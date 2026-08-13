# handycity.at — Engineering Review

Full-project review from a principal-engineer perspective, with the applied
fixes tracked against each finding.

**Reviewed:** `origin/main` @ `6010f65` (2026-08-07)
**Stack:** Astro 6 (static) · Tailwind 4 · Alpine 3 · YAML content store · GitHub Pages · 13 Actions workflows
**Verification:** production build on Node 22.23, `content:validate`, `assets:validate`,
byte-level analysis of `dist/index.html`, content-key cross-reference, browser
network/DOM checks, 100-commit history analysis.

---

## Status

| Phase | Scope | State |
|---|---|---|
| 1 | Legal & correctness | **Applied** — `54b8a62` |
| 2 | De-duplicate business data | **Applied** — `3a6e995` |
| 3 | Price data cleanup | **Partly applied** — `2f638c6`; provenance decision still open |
| 4 | Performance | Outstanding |
| 5 | Dead weight | Outstanding (one item landed incidentally) |
| 6 | Structural | Outstanding |

### Open decisions

1. **Price-data provenance** (§2.1) — the dataset is a competitor's. Cleaned and
   de-duplicated, but not resolved. `research/` is still in the public repo.
2. **`research/` removal** — deliberately *not* deleted: it is the default input
   to `sync-phone-expert.mjs`, so removing it pre-empts decision 1.

---

## Risk register

| # | Finding | Severity | State |
|---|---|---|---|
| 1 | Competitor's scraped prices published as Handycity's own | Critical | **Open** — data cleaned, provenance undecided |
| 2 | Maps consent gate cosmetic; IP sent to Google pre-consent | Critical | **Fixed** `54b8a62` |
| 3 | Duplicate devices, typos, blank prices in calculator | High | **Fixed** `2f638c6` |
| 4 | Hard-coded phone/hours/URLs diverge from content store | High | **Fixed** `3a6e995` |
| 5 | `Sync Phone-Expert Data` never triggered a deploy | High | **Fixed** `54b8a62` |
| 6 | Impressum UID duplicated in two places | Medium | **Fixed** `54b8a62` |
| 7 | 257 KB of price JSON inlined into every page | Medium | Partly — 3012→2816 entries, 372→355 KB |
| 8 | 24/24 images without dimensions; 397 KB LCP JPEG | Medium | **Open** — phase 4 |
| 9 | Unclosed `<div>` in `Footer.astro` | Medium | **Fixed** `54b8a62` |
| 10 | `assets:validate` guarded the wrong logo | Medium | **Fixed** `3a6e995` |
| 11 | Dead `content.yaml` (11 585 lines); 1.1 MB `research/` | Medium | Partly — `content.yaml` deleted |
| 12 | Owner workflows edit fields nothing renders | Medium | **Open** |
| 13 | Daily no-op deploy; 76 % of history is bot churn | Low | Partly — cadences lowered |
| 14 | 84 KB of overlapping, partly stale documentation | Low | **Open** |

---

## 1. What is good

Stated first so it does not get refactored away.

- **The content-store abstraction is well designed.** `CONTENT_FILE_DEFINITIONS`
  drives both read-ordering and write-splitting, with duplicate-key detection on
  merge (`content-store.mjs:41-48`).
- **`sync-willhaben-offers.mjs` fails loudly** — throws on no offer URLs, throws
  on missing Product JSON-LD, validates before writing, and carries known-good
  fields forward by SKU. This is why the "Live-Sync <date>" badge is honest.
- **Alpine is vendored, not CDN-loaded**, with a checksum-style sync check. No
  third-party runtime dependency, no SRI problem, no privacy leak.
- **`validate-site.yml` runs on every PR and push.** The gate existed; it just
  needed to check the right things.

---

## 2. Critical

### 2.1 The price table is a competitor's data — **OPEN**

`src/data/phone-expert/prices.json` derives from `research/phone-experts-repair-data.json`,
520 KB scraped from **Phone Experts**, a competing repair shop. A weekly cron kept
it current. Of the 2 816 entries now in `calculator.yaml`, 2 773 originate there.
The page presents them under "Alle Preise sind Richtwerte inkl. MwSt."

- **Legal/commercial:** systematically copying a competitor's price database into
  a commercial site is database-right and unfair-competition exposure (AT/EU:
  §76c UrhG *sui generis*, UWG). The raw scrape sits in a **public** repo.
- **Business:** Handycity advertises prices it did not set.

**Options:**

- **(a) Own the data** — freeze the table, owner reviews and sets real prices,
  then delete `research/`, `sync-phone-expert.mjs`, `src/data/phone-expert/` and
  the weekly workflow.
- **(b) Curate** — keep ~150–300 devices actually repaired, maintained through
  `Owner Update Price Entry`. Also resolves §7 outright. *Recommended.*
- **(c) Keep** — then purge `research/` from the public repo and get written
  owner sign-off.

**Applied meanwhile** (`2f638c6`): data normalised and de-duplicated, the
render-time merge removed, weekly cron suspended. The cleanup made the table
presentable, which arguably makes the decision more urgent, not less.

### 2.2 Maps consent gate — **FIXED** (`54b8a62`)

`x-show` left a live `src` in the served HTML. A hidden iframe is still fetched,
so Google received every visitor's IP before the dialog was answered — while the
dialog claimed data would only be sent on click.

Now `<template x-if>`, which keeps the node out of the DOM until consent, plus
`referrerpolicy="no-referrer"` and a `localStorage` memory.

Verified in a browser: 0 iframes and 0 requests to google.com before consent;
iframe created with the correct src after; choice persists across reload.

---

## 3. High

### 3.1 Calculator data quality — **FIXED** (`2f638c6`)

Two sources with different conventions were merged at render time, so the
imported half bypassed `failOnValidationErrors` entirely. Customers saw:

| Symptom | Before | After |
|---|---|---|
| `iPhone 11` in device list | 2 entries (`iPhone 11`, `Iphone 11`) | 1 |
| Brand buttons | 10, incl. a bogus `iPad` | 9, all real manufacturers |
| Price formats | `€70` and `70` side by side | `€70` throughout |
| Typos | `Kameragals`, `Laut/Leiste Taste`, 3× `Ein/Ausschaltknopf` | canonicalised |

Correction to an earlier draft of this review: it claimed three repairs rendered
a blank price badge. They did not. Three entries in `prices.json` have an empty
price, but `calculator.yaml` already held the same three keys with
`Preis auf Anfrage`, and the old dedup kept the curated side — so customers
never saw a blank. Dropping them is still correct (they would have surfaced the
moment the curated row was removed), but it was not a live defect.

`scripts/lib/normalize-prices.mjs` canonicalises brand, device casing, repair
names and price format; `scripts/normalize-calculator-prices.mjs` folds the
import into `calculator.prices`. `npm run prices:check` runs in CI so unvalidated
prices cannot reach a customer again.

2 816 entries, down from 3 012 rendered, **0 lost** — verified every pre-migration
entry that had a price is still reachable.

### 3.2 Hard-coded business data — **FIXED** (`3a6e995`)

Six places broke the "owner edits YAML" contract. All now read from content:
calculator phone + bonus amounts, Contact opening hours, ServicesHub Willhaben
URL, Trust kicker/intro, Location headings and consent copy, bonus domain.
Hero's `tel:` CTA hrefs are re-derived from `company.phone`.

Guarded by a check in `validate-content.mjs` that fails the build on `tel:`,
willhaben-URL or opening-hours literals in components. It caught a real bug on
first run: `Hero.astro` had `?.time || '9:00–18:00'` fallbacks that would have
displayed hours the shop does not keep. Both components now share
`src/lib/hours.mjs`, which renders nothing rather than guessing.

### 3.3 Deploy chain — **FIXED** (`54b8a62`)

`Sync Phone-Expert Data` was missing from `deploy.yml`'s `workflow_run` list.
Bot pushes do not fire `on: push`, so that sync never triggered a rebuild.

Still structurally fragile: the list is hand-maintained free text, so a rename
breaks the chain silently. See §6.3.

### 3.4 `assets:validate` — **FIXED** (`3a6e995`)

It required `handycity_logo_v1.png` while the header uses
`handycity_logo_transparent.png` — deleting the real logo passed CI. Now derives
the required set from assets the built pages actually reference. Runs after the
build; workflow ordering updated accordingly.

---

## 4. Outstanding — phase 4, performance

- **LCP image**: `store-image-in.jpg` (392 KB) is preloaded and used as the hero
  background. `store-image-in.webp` — same 1440×810, **236 KB** — already exists
  in the repo and is referenced by nothing. 40 % off the most important byte.
- **24/24 `<img>` ship without `width`/`height`** → layout shift on every one.
  CLS is a ranking factor for a business found through local search.
- **No `srcset`** — the hero is served at full width to a 375 px phone.
- **`Hero.astro` lacks `fetchpriority="high"`** on the element itself.
- All images live in `public/` as raw `<img>`, so Astro's asset pipeline
  (hashing, format negotiation, automatic dimensions) is unused. Moving them to
  `src/assets/` with `<Image>`/`<Picture>` fixes dimensions, formats and `srcset`
  in one change — the highest-leverage performance work available here.

---

## 5. Outstanding — phase 5, dead weight

| Path | Size | Note |
|---|---|---|
| `research/` | 1.1 MB | Competitor scrape. **Blocked on decision §2.1** — it is the default input to `sync-phone-expert.mjs`. |
| `public/images/handycity_logo_v1_wbg.png` | 104 KB | Unreferenced. |
| `public/images/README.md` | 4 KB | Served at `https://handycity.at/images/README.md`. |
| `public/.DS_Store`, `public/images/.DS_Store` | 16 KB | Copied into `dist/` on **local** builds only — untracked, so a clean CI checkout has none. Production is unaffected. |

`src/data/content.yaml` (11 585 lines, dead) was removed in `2f638c6` —
`writeContent` deletes it by design.

Also outstanding:

- `[x-cloak] { display: none !important; }` duplicated in **4** components
  (Header, PriceCalculator, FAQ, Contact) as Astro *scoped* styles — which is why
  it had to be copied. Belongs in `global.css` once.
- Dead `@media (prefers-reduced-motion)` blocks in `PriceCalculator` and
  `ServicesHub`: `global.css:41-47` already applies `animation-duration: 0.01ms
  !important` to `*`, so they cannot fire.
- `brandLogoMap` defined twice, identically (`Brands.astro`, `PriceCalculator.astro`).
- Header nav written out twice by hand (desktop + mobile), and hard-coded rather
  than content-driven.
- Phone SVG appears 6×, checkmark 4×, external-link 3×.
- No `.npmrc` — `engines: node >=22.12.0` is unenforced (local Node is 18.12.1
  and both validators ran on it happily).
- Stale `vite.server.watch.ignored` entries in `astro.config.mjs` for directories
  that no longer exist.

### 5.1 Content with no consumer — **OPEN**

`services.items[].description` and `services.items[].price` render nowhere, yet
`content-admin.mjs:137` *requires* description. The owner's `Owner Update Service
Item` workflow edits four fields and only `name` reaches the page — an edit goes
green and changes nothing.

Either restore them to the UI or remove them from content, validator and workflow
together. Left alone deliberately: deleting owner-authored copy is not a
mechanical call.

`ServicesHub`'s two intent cards still hard-code their titles, taglines, CTAs and
chip labels. Moving those to content is a content-modelling decision.

### 5.2 The phone number still lives in three content places

`site.description`, and twice in `legal.yaml`. These are prose, and the Impressum
one is legally the source of truth, so they need a judgement call rather than a
refactor. `llms.txt` likewise restates name/address/phone/email with nothing
keeping it in sync.

---

## 6. Outstanding — phase 6, structural

### 6.1 Colour tokens are actively misleading

```css
--color-navy: #9c141d;  /* a red  */
--color-cyan: #2d2d2d;  /* a grey */
```

Every component reads `bg-navy`, `text-cyan`. Fine until someone makes a "small
colour tweak". Rename to `--color-brand` / `--color-ink` (~120 call sites,
mechanical, needs a visual diff pass).

`global.css` also overrides Tailwind's `slate` at 50/100/200/600/800/900 only, so
300/400/500/700 keep Tailwind defaults — the ramp is inconsistent by construction.

### 6.2 No content schema

Every component hand-writes an `interface Props` unverified against the YAML, and
`index.astro` casts to `Record<string, any>`, discarding it. A Zod schema (Zod is
already a transitive dependency) driving both runtime validation and component
prop types would have caught §5.1 and §3.1 automatically. **This is the change
that prevents the class of bug the first three commits fixed.**

### 6.3 Deploy chain should be structural

Replace the hand-maintained `workflow_run` name list with a single `deploy` job
invoked via `workflow_call` from each mutating workflow.

### 6.4 Accessibility

- `Header.astro:17` — `<a href="#">` announces as an empty target; use `/`.
- Mobile menu `aria-label="Menü öffnen"` never changes when open; no `aria-controls`.
- `FAQ` buttons bind `aria-expanded` but have no `aria-controls`, panels no `id`.
- **`GoogleReviews` autoplays every 5.8 s with no pause control.** Hover pauses;
  keyboard and touch users have none. WCAG 2.2 §2.2.2 requires a pause mechanism.
  Should also stop under `prefers-reduced-motion`.
- No `theme-color` meta.

### 6.5 Sitemap, llms.txt, docs

`public/sitemap.xml` is static with `lastmod: 2026-04-08` on a site that
redeploys daily — use `@astrojs/sitemap` (`site:` is already configured).

84 KB of docs across nine root files with heavy overlap (`OWNER_GUIDE.md` 25 KB
and `EDITING.md` 20 KB largely restate each other), all still instructing the
owner to edit the now-deleted `content.yaml`. Target: `README.md` (developers),
`OWNER_GUIDE.md` (owner), `DECISIONS.md` (ADR log); archive the rest.

`DECISIONS.md:82` documents a web3forms `accessKey` setup that does not exist —
the form is `mailto:`-based.

---

## 7. Not worth doing

- **Reducing the Willhaben sync further.** Now daily (was every 6 h). Its commits
  are honest: the badge reflects a real re-verification. History noise is cosmetic.
- **Migrating off Alpine.** Vendored, small, doing its job.
