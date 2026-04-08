# DECISIONS.md — Architecture Choices

> **Date:** 2026-04-08

---

## 1. Static Site Generator: Astro

**Choice:** Astro v6
**Alternatives considered:** Eleventy (11ty)

**Rationale:**
- Component-based architecture makes sections easy to isolate and maintain
- Built-in image optimization pipeline
- Islands architecture: Alpine.js only loads where needed, rest is zero-JS HTML
- First-class Tailwind CSS support via Vite plugin
- Excellent build performance (~2s for one-pager)
- Eleventy would work too, but Nunjucks templates become unwieldy for a 12-section page with shared data passing

---

## 2. CMS / Editability: `content.yaml` + GitHub Web UI

**Choice:** Single `src/data/content.yaml` file, edited via GitHub's web editor
**Alternatives considered:** Decap CMS, TinaCMS

**Rationale:**
- **Simplest possible approach** — zero dependencies, zero authentication setup, zero third-party services
- Owner opens one file on GitHub, edits text, commits → GitHub Actions rebuilds and deploys in ~60 seconds
- YAML is human-readable with clear structure — every field is labeled
- No OAuth configuration, no admin panel to maintain, no security surface
- `EDITING.md` provides step-by-step instructions with field descriptions
- Decap CMS would add complexity (admin UI, OAuth, identity service) for minimal benefit on a single-page site with one editor
- TinaCMS requires a cloud account and adds vendor lock-in
- If the owner later wants a visual editor, Decap CMS can be added without changing the content structure — YAML maps directly to CMS fields

**Trade-off:** No visual preview during editing. Mitigated by the clear field labels in YAML and the fast deploy cycle.

---

## 3. Styling: Tailwind CSS v4

**Choice:** Tailwind CSS v4 via `@tailwindcss/vite` plugin
**Alternatives considered:** Vanilla CSS with custom properties

**Rationale:**
- Utility-first approach produces minimal CSS — only used classes ship
- Final CSS is ~5-8KB for a one-pager (smaller than most hand-written stylesheets)
- Co-location of styles in HTML means no context switching
- Tailwind v4 uses native CSS cascade layers — no config file bloat
- Custom theme tokens defined in `global.css` for brand colors

---

## 4. JavaScript: Alpine.js

**Choice:** Alpine.js + @alpinejs/collapse (~7KB gzipped)
**Alternatives considered:** Vanilla JS, no framework

**Rationale:**
- Declarative syntax directly in HTML — easy to understand for future maintainers
- Handles: mobile menu toggle, FAQ accordion, contact form submission, Google Maps click-to-load
- Alpine's `x-collapse` plugin provides smooth accordion animations with zero custom code
- Vanilla JS would require ~150 lines of imperative code for the same features
- No build step — Alpine is loaded as an ES module

---

## 5. Forms: Web3Forms

**Choice:** Web3Forms (https://web3forms.com)
**Alternatives considered:** Formspree, FormSubmit

**Rationale:**
- Free tier: 250 submissions/month (sufficient for a local repair shop)
- No account required for basic use — just an access key
- GDPR-friendly: EU data processing, no tracking
- Simple POST endpoint — works with static sites
- Owner receives submissions via email
- Honeypot spam protection built in

**Setup required:** Owner must get a free access key from web3forms.com and add it to `content.yaml` → `contact.accessKey`

---

## 6. Google Maps: Click-to-Load

**Choice:** Maps iframe loads only after user clicks "Karte laden"
**Rationale:**
- GDPR/DSGVO compliance: no data transmitted to Google without consent
- Performance: saves ~500KB on initial load
- No cookie banner needed for Maps since it's opt-in
- Aligns with Austrian data protection expectations

---

## 7. Analytics: None by default

**Choice:** No analytics installed
**Rationale:**
- Zero cookies = no cookie banner needed
- Owner can add Plausible (privacy-friendly, GDPR-compliant, no cookies) later
- Adding Plausible requires only one `<script>` tag — documented in EDITING.md

---

## 8. Image Strategy

**Current:** Original images in `src/assets/images/`, logo copied to `public/images/`
**Future:** Astro's `<Image>` component can be used to auto-generate WebP/AVIF with responsive srcset
**Note:** For Phase 4, images should be optimized and properly integrated with `<picture>` elements
