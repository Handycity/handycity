#!/usr/bin/env node
/**
 * Guards the deploy chain.
 *
 * Pushes made with GITHUB_TOKEN do not fire `on: push`, so every workflow that
 * commits content has to be named in deploy.yml's `workflow_run` list or its
 * changes sit on main without ever being published. That list is matched as
 * free text, so a rename or a new workflow breaks the chain silently — which is
 * exactly what happened to "Sync Phone-Expert Data".
 *
 * Rather than restructure the deploy pipeline itself (a change that can only be
 * tested by running it against production Pages), this asserts the invariant:
 * anything that pushes to main is listed, and everything listed exists.
 */
import fs from 'node:fs/promises';
import path from 'node:path';

const WORKFLOW_DIR = '.github/workflows';
const DEPLOY_FILE = 'deploy.yml';

const files = (await fs.readdir(WORKFLOW_DIR)).filter((f) => f.endsWith('.yml') || f.endsWith('.yaml'));

const workflows = new Map();
for (const file of files) {
  const source = await fs.readFile(path.join(WORKFLOW_DIR, file), 'utf8');
  const name = source.match(/^name:\s*(.+)$/m)?.[1].trim().replace(/^["']|["']$/g, '');
  if (!name) continue;
  workflows.set(file, { name, source });
}

const deploy = workflows.get(DEPLOY_FILE);
if (!deploy) throw new Error(`${WORKFLOW_DIR}/${DEPLOY_FILE} not found.`);

// The names listed under workflow_run.workflows in deploy.yml
const listedBlock = deploy.source.match(/workflow_run:\s*\n\s*workflows:\s*\n((?:\s*-\s*.+\n)+)/);
const listed = new Set(
  (listedBlock?.[1] ?? '')
    .split('\n')
    .map((line) => line.replace(/^\s*-\s*/, '').trim().replace(/^["']|["']$/g, ''))
    .filter(Boolean)
);

const errors = [];

// A workflow that pushes to main must be in the list.
for (const [file, { name, source }] of workflows) {
  if (file === DEPLOY_FILE) continue;
  const pushesToMain = /git\s+push\s+origin\s+HEAD:main/.test(source);
  if (pushesToMain && !listed.has(name)) {
    errors.push(
      `${file} pushes to main but "${name}" is not in ${DEPLOY_FILE}'s workflow_run list — its commits would never deploy.`
    );
  }
}

// Every listed name must correspond to a real workflow.
const knownNames = new Set([...workflows.values()].map((w) => w.name));
for (const name of listed) {
  if (!knownNames.has(name)) {
    errors.push(`${DEPLOY_FILE} lists "${name}" under workflow_run, but no workflow declares that name.`);
  }
}

if (errors.length) {
  throw new Error(`Deploy chain is inconsistent:\n- ${errors.join('\n- ')}`);
}

console.log(`Deploy chain check passed (${listed.size} workflows wired to deploy).`);
