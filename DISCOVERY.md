# DISCOVERY.md — Phase 0: Handycity.at Modernization

> **Date:** 2026-04-08
> **Status:** Awaiting owner approval before Phase 1

---

## 1. Content Inventory — handycity.at

### 1.1 Company Information

| Field | Value |
|---|---|
| **Legal name** | Handycity A.K. GmbH |
| **Address** | Kardinalplatz 6, 9020 Klagenfurt am Wörthersee |
| **Phone** | +43 463 918559 |
| **Email** | office@handycityarkaden.at |
| **UID** | ATU63848359 |
| **Legal form** | Eingetragenes Unternehmen in Österreich |
| **Schwerpunkt** | Einzelhandel – Telekommunikation |
| **Current platform** | Jimdo |
| **Willhaben store** | https://www.willhaben.at/iad/bap/webstore/shop?orgId=26610249 |

### 1.2 Opening Hours

| Tag | Zeiten |
|---|---|
| Montag | 9–18 Uhr |
| Dienstag | 9–18 Uhr |
| Mittwoch | 9–18 Uhr |
| Donnerstag | 9–18 Uhr |
| Freitag | 9–18 Uhr |
| Samstag | 9–13 Uhr |
| Sonntag | Geschlossen |

### 1.3 Services (complete inventory)

#### Service 1: Handy & Tablet Reparatur (Core Service)
**Original text:**
> Unsere erfahrenen Techniker stehen Ihnen mit Fachkompetenz und Engagement zur Seite, um sicherzustellen, dass diese schnell wieder voll funktionsfähig sind. Vertrauen Sie auf unsere Expertise – wir kümmern uns um Ihr Gerät und Sie sparen Geld. Ihr Handy oder Tablet sind bei uns in besten Händen.

**Repair types mentioned:**
- Display (gebrochenes Display)
- Akku
- Lautsprecher
- Mikrofon
- Ladekonnektor
- Kamera

#### Service 2: Geräte-Retter-Prämie (replaces "Reparatur Bonus")
**Original text (adapted):**
> Bei uns können Sie die Geräte-Retter-Prämie einlösen. Sie sparen die Hälfte oder bis zu 130 Euro. Weitere Informationen erhalten Sie bei uns im Geschäft.

**⚠️ CRITICAL UPDATE:** The old site references "Reparaturbonus" with "-50% auf ihre Reparatur bis zu 200€". The successor program — the **Geräte-Retter-Prämie** — has new terms:
- 50% of eligible repair costs, **max. €130** (not €200)
- Up to €30 for a Kostenvoranschlag (cost estimate)
- Available since 12.01.2026
- Bons valid for 3 weeks after issuance
- For private persons with Austrian residence
- Must be redeemed at a registered Partnerbetrieb
- Source: https://www.oesterreich.gv.at/de/themen/umwelt_und_klima/energie_und_ressourcen_sparen/geraete-retter-praemie

#### Service 3: Datentransfer
**Original text:**
> Steigen Sie ohne Sorgen von Android auf iPhone um oder umgekehrt – unser erstklassiger Service bietet Ihnen einen reibungslosen Datentransfer zwischen den Plattformen. Unsere erfahrenen Techniker kümmern sich um alles, damit Sie nahtlos zwischen Ihren Geräten wechseln können. Übertragen Sie Kontakte, Fotos und mehr mühelos und verlassen Sie sich auf uns, um sicherzustellen, dass Ihre Daten sicher und zuverlässig übertragen werden.

#### Service 4: Handy kaufen
**Original text:**
> Entdecken Sie bei uns die Möglichkeit, ein neues Handy zu erwerben. Besuchen Sie gerne unser Geschäft in Klagenfurt oder stöbern Sie auf der Plattform Willhaben, um unsere Auswahl zu erkunden.

**Link:** Willhaben.at store

#### Service 5: Hol & Bring Service
**Original text:**
> Profitieren Sie nicht nur von unserem HOL&BRING-Service, sondern lassen Sie uns auch Zeit für Sie sparen! Mit einer geringen Pauschalgebühr von nur 10€ innerhalb der Stadt Klagenfurt holen wir Ihr reparaturbedürftiges Smartphone direkt vor Ihrer Haustür ab. Nach der Reparatur und Desinfektion bringen wir es Ihnen pünktlich und zuverlässig nach Hause zurück.

**Price:** €10 Pauschale innerhalb Klagenfurt

### 1.4 Trust & Value Propositions (from original text)

- "Erfahrene Techniker" (experienced technicians)
- "Fachkompetenz und Engagement"
- "Schnell wieder voll funktionsfähig"
- "Sparen Sie Geld" / "kostengünstige Lösung"
- "Sparen Sie nicht nur Geld, sondern auch die Umwelt"
- Desinfektion included with Hol&Bring
- Geräte-Retter-Prämie partner (to be confirmed — see Assumptions)

### 1.5 "Warum reparieren?" Pitch (from original)
**Original text:**
> Warum das teure Handy wegwerfen, wenn wir es doch reparieren können?
>
> Bei Handycity in Klagenfurt verstehen wir, wie ärgerlich ein gebrochenes Display, Akku, Lautsprecher, Mikrofon, Ladekonnektor, Kamera sein kann. Statt Ihr wertvolles Gerät zu ersetzen, bieten wir Ihnen eine kostengünstige Lösung für die Reparatur. Unsere versierten Techniker stehen bereit, um Ihr Handy schnell und zuverlässig zu servicieren.
>
> Vertrauen Sie auf unsere Fachkenntnisse, um Ihr Smartphone wieder in makellosem Zustand zu bringen. Sparen Sie nicht nur Geld, sondern auch die Umwelt, indem Sie sich für eine Reparatur entscheiden.

### 1.6 Legal Pages

| Page | Status |
|---|---|
| **Impressum** | ✅ Exists — full text captured |
| **Datenschutz** | ✅ Exists — references Jimdo + Google Analytics |
| **AGB** | ❌ 404 — page does not exist |
| **Cookie-Einstellungen** | ✅ Exists — Cloudflare, Google Maps, Google Analytics cookies |

**Impressum (full text):**
> Handycity A.K. GmbH
> Kardinalplatz 6
> 9020 Klagenfurt
> Tel: +43 463/918559
> E-Mail Adresse: office@handycityarkaden.at
> Handycity A.K. GmbH ist ein eingetragenes Unternehmen in Österreich mit dem Schwerpunkt Einzelhandel - Telekommunikation.
> Umsatzsteuer-Identifikationsnummer: ATU63848359

**Datenschutz:** Currently references Jimdo as technical processor and Google Analytics with IP anonymization. Will need to be rewritten for the new stack (no Jimdo, potentially no Google Analytics if Plausible is used).

### 1.7 Pricing

**No explicit repair prices listed on the current site**, except:
- Hol & Bring Service: €10 (Klagenfurt city)
- Geräte-Retter-Prämie: up to €130 discount (government program, not a Handycity price)

### 1.8 Brands Supported
**Not explicitly listed.** The original site mentions "Handy" and "Tablet" generically. No Apple/Samsung/Huawei brand logos or lists.

### 1.9 Reviews/Testimonials
**None on the current site.** No Google Reviews embed, no testimonials section.

### 1.10 Google Maps
Present on the current site but behind a cookie-consent wall (click-to-load pattern already in place via Jimdo).

---

## 2. ⚠️ CRITICAL: Location Discrepancy

The brief specifies:
> *"SEO-optimized for local search (Vienna/Austria, German-language)"*
> *"H1 with primary keyword ('Handy Reparatur Wien' or similar)"*

**The business is in KLAGENFURT, not Vienna.**

- Address: Kardinalplatz 6, **9020 Klagenfurt** am Wörthersee
- Phone: +43 **463** (Klagenfurt area code)
- Hol&Bring: "innerhalb der Stadt **Klagenfurt**"

**Recommendation:** All SEO should target **"Handy Reparatur Klagenfurt"**, not Wien. This affects:
- `<title>`, `<meta description>`
- H1 headline
- Schema.org `LocalBusiness` geo/address
- Google Business Profile alignment
- All local keyword targeting

**→ OWNER DECISION REQUIRED: Confirm primary SEO target city is Klagenfurt.**

---

## 3. Information Architecture Gaps

| Gap | Severity | Action |
|---|---|---|
| **No pricing table** | High | Owner must provide per-repair prices or confirm "Preis auf Anfrage" |
| **No brand list** | Medium | Owner must confirm which brands/devices are serviced |
| **No reviews** | Medium | Owner should provide Google Business link or manual testimonials |
| **No AGB page** | Medium | Owner must decide if AGB are needed (not legally mandatory for repair shops without online sales, but recommended) |
| **No team/about section** | Low | Original text has generic "erfahrene Techniker" — no names, photos, or story |
| **No warranty/guarantee specifics** | Medium | How long is the repair warranty? What does it cover? |
| **No turnaround time** | Medium | "Schnell" is mentioned but no specific times (same-day? 24h? 48h?) |
| **No process description** | Low | No step-by-step "how it works" on current site |
| **Geräte-Retter-Prämie partnership** | High | Is Handycity registered as a Partnerbetrieb? The old site claims "Reparaturbonus" eligibility — must confirm for new program |
| **No social media links** | Low | No Instagram/Facebook/TikTok linked on current site |
| **Reparaturbonus €200 → Geräte-Retter-Prämie €130** | High | Old headline says "bis zu 200€" — new program caps at €130. Must be corrected. |
| **City mismatch (Wien vs. Klagenfurt)** | Critical | See Section 2 above |

---

## 4. Reference Site Audit

### 4.1 RESQ-Repair.com — 5 Patterns to Adopt

1. **Hero with dual CTA** — "Auftrag erfassen" + "Kostenvoranschlag anfordern" is clear and conversion-focused. Adopt for Handycity: "Jetzt anrufen" + "Reparatur anfragen".

2. **Certification badges as trust signals** — Apple Independent Repair Provider badge prominently displayed. Handycity should display Geräte-Retter-Prämie Partnerbetrieb badge (if registered) and any manufacturer certifications.

3. **FAQ accordion** — Real customer questions (schwarzes Display, Home-Button defekt, kein Netz, lädt nicht, kein WiFi) serve dual purpose: help customers self-diagnose AND generate long-tail SEO. Adopt with Handycity-specific questions.

4. **Google Reviews integration** — "Echte Bewertungen – Echte Erfolge" section links directly to Google Reviews. Builds instant trust. Adopt if Handycity has Google reviews.

5. **Service categories with clear naming** — Separate sections for Reparaturen, Datenrettung, with specifics per device. Handycity can organize: Display, Akku, Ladekonnektor, Kamera, Lautsprecher/Mikrofon, Datentransfer.

**Patterns to avoid from RESQ:**
- Overly aggressive marketing tone (⚠️ emoji overuse, "SELBST", "seinesgleichen sucht")
- Too much text — walls of copy hurt readability
- YouTube embeds that require cookie consent add friction

### 4.2 PhoneBuddies.at — 5 Patterns to Adopt

1. **Geräte-Retter-Prämie integration** — Hero slider includes Geräte-Retter-Prämie badge with "Jetzt reparieren & Geld sparen!" CTA linking to the official page. Direct and effective. Adopt this pattern.

2. **Device category tabs** — Handy / Laptop / Tablet / iPad / Apple Watch as visual categories. Simple, scannable. Adapt for Handycity's scope (Handy + Tablet).

3. **Multi-location footer** — Clean layout with separate contact details per location. Good pattern if Handycity ever expands.

4. **Customer reviews section** — "Das sagen unsere Kunden" with Google integration. Social proof positioned mid-page.

5. **Local competitor tone** — Austrian market language, informal "Du" address, regionally authentic. Handycity already uses "Sie" — should keep consistent (see Assumptions).

**Patterns to avoid from PhoneBuddies:**
- Slider hero with too many slides (6+) — diminishing engagement per slide
- Insurance upsell in hero (Wertgarantie) feels off-brand for a repair-focused shop

### 4.3 MrMobile.at — Could Not Fetch

The site returned no extractable content (possible JS-only rendering or blocking). Will note 5 general local-SEO patterns from Austrian repair market observation:

1. **Contact-first UX** — Phone number in sticky header, always visible
2. **Local keywords in headings** — "Handy Reparatur [City]" as H1
3. **Google Maps embed** — Prominent location section with embedded map
4. **Schema.org LocalBusiness** — Structured data for local search results
5. **Opening hours prominently displayed** — Not buried in footer

---

## 5. Corporate Identity — Current handycity.at

### 5.1 Current Brand Elements

- **Name:** Handycity (stylized as "Handycity" — one word, capital H)
- **Tagline:** "Willkommen bei Handycity!" / "Reparatur & Service von Handy & Tablet"
- **Voice/Tone:** Formal "Sie" address, professional but approachable, German (Austrian)
- **Colors (from current Jimdo site):** Not precisely extractable without dev tools, but visually appears to use:
  - Primary: Likely a blue or teal accent
  - Secondary: Dark text on white backgrounds
  - No strong brand color visible
- **Logo:** Exists (used in navigation), exact file not extractable from Jimdo
- **Typography:** Default Jimdo fonts (likely system/Google Fonts)

### 5.2 Brand Observations
- The "Handycity" name has good local recognition potential ("Handy" = phone in Austrian German + "City" = urban/accessible)
- Current site is very generic — minimal visual identity
- Jimdo template gives it a "small business starter" look, not a professional repair shop
- The brand needs strengthening, not reinventing

---

## 6. Design Direction — 3 Proposals

All proposals share these foundations:
- Mobile-first, single-page layout
- Sticky header with phone CTA
- Prominent Geräte-Retter-Prämie badge
- Clean service grid
- Trust section with concrete claims

### Option A: "Clean Professional" (Recommended)

**Color Palette:**
- Primary: `#1E3A5F` (deep navy) — trust, professionalism, tech
- Accent: `#00B4D8` (vibrant cyan/teal) — modern, fresh, stands out
- Success: `#10B981` (green) — for Geräte-Retter-Prämie badge / savings callout
- Text: `#1F2937` on `#FFFFFF` backgrounds
- Light background sections: `#F8FAFC`

**Typography:**
- Headings: Inter or DM Sans (geometric, modern, excellent readability)
- Body: System font stack (`-apple-system, BlinkMacSystemFont, "Segoe UI", ...`) — zero load cost

**Visual Direction:**
- Sharp, minimal sections with generous whitespace
- Service cards with subtle shadows and hover states
- Iconography: Lucide icons (outline style)
- Hero: Clean gradient overlay on abstract tech pattern (no stock photos)
- Green badge/banner for Geräte-Retter-Prämie: "Sparen Sie bis zu €130!"

**Rationale:** Most repair shops go loud and cluttered. Standing out with calm professionalism signals competence and trust — especially important when customers hand over expensive personal devices.

### Option B: "Bold & Energetic"

**Color Palette:**
- Primary: `#FF6B35` (warm orange) — energy, urgency, action
- Secondary: `#1B1B2F` (near-black) — contrast, premium feel
- Accent: `#E8E8E8` (light gray)
- Trust green: `#22C55E`

**Typography:**
- Headings: Plus Jakarta Sans (bold, dynamic)
- Body: Inter

**Visual Direction:**
- Bold color blocks, diagonal section dividers
- Large typography headlines
- Animated count-up for trust numbers
- Orange CTA buttons with high contrast

**Rationale:** High-energy, conversion-focused. Risks feeling "too salesy" for Austrian market where understated quality is preferred.

### Option C: "Warm & Local"

**Color Palette:**
- Primary: `#2D5F2D` (forest green) — sustainability, eco-conscious (ties into Geräte-Retter-Prämie environmental message)
- Secondary: `#F5E6D3` (warm cream) — approachable, friendly
- Accent: `#D4A853` (gold) — quality
- Text: `#2C2C2C`

**Typography:**
- Headings: Cabinet Grotesk
- Body: System stack

**Visual Direction:**
- Warm, inviting feel with rounded corners
- Eco/sustainability angle as differentiator
- Green theme ties directly to Geräte-Retter-Prämie messaging
- Hand-drawn style icons

**Rationale:** Differentiates from blue-tech competitors by leaning into the sustainability angle. Resonates with eco-conscious Austrian consumers. Risk: may not read "tech competence" at first glance.

### Recommendation: **Option A — "Clean Professional"**

Strongest signal for trustworthiness + tech competence. Navy/cyan is differentiated from competitors (PhoneBuddies uses blue/white, RESQ uses white/red). The green accent for Geräte-Retter-Prämie creates a natural "savings" callout without clashing.

**→ OWNER DECISION REQUIRED: Approve design direction before Phase 1.**

---

## 7. Technical Decisions Preview

These will be fully documented in `DECISIONS.md` after approval, but previewing key choices:

| Decision | Leaning | Why |
|---|---|---|
| **SSG** | Astro | Component model, islands architecture, better DX than 11ty for one-pager with interactive elements |
| **Styling** | Tailwind CSS v4 | Utility-first, purges unused CSS to ~5KB for one-pager, works excellently with Astro |
| **CMS** | Option 2: `content.yaml` + GitHub UI | Simplest, zero third-party dependency, no OAuth setup, owner edits one file — ideal for a single-page site with a single non-technical owner. Full guide in `EDITING.md` |
| **Forms** | Web3Forms | Free tier, no account needed for basic use, GDPR-friendly, email delivery |
| **JS** | Alpine.js (2KB) | Mobile menu, FAQ accordion, form validation — tiny, declarative, no build step |
| **Icons** | Lucide (inline SVG) | Treeshakeable, consistent, MIT licensed |
| **Analytics** | Plausible (self-hosted or cloud) or none | GDPR-compliant, no cookies, owner's choice |
| **Images** | WebP with `<picture>` | Astro's built-in image optimization handles this |

---

## 8. Competitors in Klagenfurt

Noted during research:
- **PhoneBuddies** — EKZ Interspar Klagenfurt, Durchlassstrasse 4. Active competitor with modern site, Geräte-Retter-Prämie integration already live. Their Klagenfurt branch is new.
- Handycity has location advantage at **Kardinalplatz** (central, near Stadthaus).

---

## 9. Next Steps (pending approval)

1. **Owner confirms:**
   - [ ] SEO target city: Klagenfurt (not Wien)
   - [ ] Design direction: Option A / B / C
   - [ ] Pricing: provide prices or confirm "Preis auf Anfrage"
   - [ ] Brand list: which devices/brands to feature
   - [ ] Geräte-Retter-Prämie: confirmed as registered Partnerbetrieb?
   - [ ] Reviews: Google Business link or manual testimonials
   - [ ] Warranty terms: duration, coverage
   - [ ] Social media: any profiles to link?
   - [ ] Existing logo: provide in SVG/PNG format
   - [ ] AGB: needed or not?

2. **After approval → Phase 1: Foundation**
   - Scaffold Astro project
   - Configure Tailwind
   - Set up GitHub Actions
   - Deploy placeholder

---

*Document generated 2026-04-08. All content sourced from handycity.at and oesterreich.gv.at. No content was invented.*
