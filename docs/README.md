# Documentation

## Current

| Document | Audience | Purpose |
|---|---|---|
| [`../README.md`](../README.md) | Developers | Setup, project structure, commands |
| [`../OWNER_GUIDE.md`](../OWNER_GUIDE.md) | Shop owner | Running the GitHub Actions that edit the site |
| [`../EDITING.md`](../EDITING.md) | Shop owner | Editing content directly in `src/data/content/` |
| [`../DECISIONS.md`](../DECISIONS.md) | Developers | Architecture decision log |
| [`CODE_REVIEW.md`](CODE_REVIEW.md) | Developers | Engineering review, findings tracked to the commits that fixed them |

`OWNER_GUIDE.md` and `EDITING.md` overlap substantially and are candidates for
a merge; they are kept separate for now because both are owner-facing and
consolidating them is an editorial decision, not a mechanical one.

## Archive

[`archive/`](archive/) holds documents from the original build that describe
decisions and states no longer current. They are kept for provenance, not as
instructions — **do not follow them as guidance.** Where they conflict with the
documents above, the documents above win.

| Document | Why archived |
|---|---|
| `DISCOVERY.md` | Pre-build research and option comparison |
| `ASSUMPTIONS.md` | Assumptions made before the site existed |
| `HOMEPAGE_FULL_OVERVIEW.md` | Section-by-section snapshot, now drifted from the components |
| `CUSTOMER_OVERVIEW.md` | Early summary for the customer |
| `OWNER_INTERACTION_RUNBOOK.md` | Superseded by `OWNER_GUIDE.md` |

## Content model

Content lives in `src/data/content/`, one YAML file per area, assembled by
`src/lib/content-store.mjs` (see `CONTENT_FILE_DEFINITIONS` for which sections
land in which file). It is validated against `src/lib/content-schema.mjs`, and
the TypeScript types in `src/lib/content-types.ts` are derived from that same
schema — so types and validation cannot disagree.

The single `src/data/content.yaml` referenced by older documents no longer
exists.
