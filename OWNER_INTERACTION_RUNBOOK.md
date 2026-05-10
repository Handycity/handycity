# OWNER_INTERACTION_RUNBOOK.md

## Purpose

This runbook is the practical operating manual for the website owner.
It explains exactly how to add, edit, and delete website content through GitHub Actions, how publishing works, and how to recover from mistakes.

The canonical content source remains:

- `src/data/content/*.yaml`

The owner should primarily use GitHub Actions forms and only edit YAML directly as fallback.

---
## 1) Access Requirements

Owner needs:

1. GitHub access to this repository with permission to run workflows and push to `main`.
2. Access to `Actions` tab in GitHub.
3. Optional: access to repository secrets (for Google reviews sync).

---
## 2) How Publishing Works (End-to-End)

Every owner action follows the same pipeline:

1. Owner opens `Actions`.
2. Owner runs a workflow with form inputs.
3. Workflow updates `src/data/content/*.yaml` via script.
4. Workflow runs:
- `npm run content:validate`
- `npm run assets:validate` (where configured)
- `npm run build`
5. If checks pass, workflow commits/pushes to `main`.
6. `Deploy to GitHub Pages` runs and publishes.

Result: content change is live without manual developer intervention.

---
## 3) Workflow Selection Matrix

Use the specific workflow when possible:

1. `Owner Update Business Info`
- Hero text, phone, email, address, map link, SEO basics.

2. `Owner Update Opening Hours`
- Week schedule.

3. `Owner Update Price Entry`
- One calculator row at a time (`upsert` / `remove`).

4. `Owner Update Service Item`
- Service add/edit/remove.

5. `Owner Update Offers`
- Willhaben section text.

6. `Owner Update FAQ Item`
- Add/update/remove FAQ entries.

7. `Owner Update Willhaben Offer`
- Add/update/remove one offer card in `willhaben.offers`.

8. `Sync Willhaben Offers`
- Re-import current offers from Willhaben shop URL.

9. `Sync Google Reviews Backup`
- Refresh review backup in YAML from Google Places.

10. `Owner Update Content Advanced` (full control)
- Any `content.yaml` field or list entry via path-based operations:
  - `set`
  - `remove`
  - `list_upsert`
  - `list_remove`

---
## 4) Full Owner Interaction Examples

## Scenario A: Add a new FAQ item

Workflow:
- `Owner Update FAQ Item` (recommended)

Inputs:
- `action`: `upsert`
- `question`: `Bietet ihr Express-Service?`
- `answer`: `Ja, je nach Ersatzteil oft am selben Tag.`

Expected result:
- FAQ entry added if new, updated if same question exists.

## Scenario B: Edit legal text (Impressum)

Workflow:
- `Owner Update Content Advanced`

Inputs:
- `action`: `set`
- `target_path`: `impressum.content`
- `value_json`: `"Neuer Impressumstext ..."`

Expected result:
- Entire text field replaced.

## Scenario C: Remove one repair-price row

Workflow:
- `Owner Update Price Entry` (or Advanced)

Option 1 (standard):
- `action`: `remove`
- `brand`: `Apple`
- `device`: `iPhone 15`
- `repair`: `Akku Tausch`

Option 2 (advanced):
- `action`: `list_remove`
- `target_path`: `calculator.prices`
- `key_fields`: `brand,device,repair`
- `value_json`:
```json
{"brand":"Apple","device":"iPhone 15","repair":"Akku Tausch"}
```

Expected result:
- Matching price row removed.

## Scenario D: Add or update one Willhaben offer

Workflow:
- `Owner Update Willhaben Offer`

Inputs (new entry):
- `action`: `upsert`
- `title`: `iPhone 14 128GB Black Neu/Haendler`
- `price`: `EUR 499`
- `url`: `https://www.willhaben.at/iad/kaufen-und-verkaufen/d/...`
- `image`: `https://cache.willhaben.at/...`
- `image_alt`: `iPhone 14 Black von Handycity auf willhaben`
- `listed_at`: `05.05.2026`
- `storage`: `128 GB`
- `unlocked`: `Ja`
- `condition`: `Neu`
- `delivery`: `Selbstabholung, Versand`

Expected result:
- Offer card is created or updated in `willhaben.offers`.

## Scenario E: Update homepage headline

Workflow:
- `Owner Update Business Info` (recommended)

Input:
- `hero_headline`: `Handy Reparatur in Klagenfurt`

Expected result:
- Hero headline updated and deployed.

---
## 5) Advanced Workflow Input Rules

Workflow:
- `Owner Update Content Advanced`

Rules:

1. `target_path` uses dot notation:
- Example: `company.address.street`
- Example (list root): `faq.items`

2. `value_json` for list operations must be valid JSON object.

3. `key_fields` for list operations:
- Comma-separated unique identifier fields.
- Example: `brand,device,repair` for `calculator.prices`.

4. `set` accepts JSON values and plain text.

---
## 6) Validation and Failure Handling

If workflow fails:

1. Open the failed run in `Actions`.
2. Check the failed step (usually validation/build).
3. Correct input and rerun.

Typical causes:

- Invalid JSON in `value_json`.
- Invalid URL format in fields that require URL-like values.
- Removing too much content and violating required content rules.

---
## 7) Rollback Procedure

If a bad change was deployed:

1. Open `Commits` on `main`.
2. Identify last good commit.
3. Revert bad commit in GitHub UI (or run a corrective owner workflow).
4. Push revert -> automatic redeploy.

---
## 8) Governance Recommendation

To keep operations safe:

1. Prefer specific workflows first.
2. Use `Owner Update Content Advanced` for uncovered cases.
3. Keep commit messages meaningful (advanced workflow supports custom message).
4. Review `Actions` logs after each change.
5. Keep this runbook and `OWNER_GUIDE.md` as the source of process truth.
