# JA, VOOR ALTIJD - Project TODO

> Nederlandse website voor digitale trouwuitnodigingen
> Geïnspireerd op thedigitalyes.com, maar eigen merk met wax seal als USP
> URL: www.javooraltijd.nl

---

## PROJECT TODO

### A) PRODUCTSTRATEGIE & SCOPE
- ✅ MVP scope gedefinieerd (3 templates, builder, checkout)
- ✅ Doelgroep bepaald (Nederlandse koppels)
- ✅ Prijslogica vastgesteld (Basic €125, Signature €175, Premium €225)
- ✅ Wax seal als unieke USP geïmplementeerd
- ⬜ Concurrentie-analyse document maken
- ⬜ V1/V2 roadmap formaliseren

### B) PAGINA'S & INFORMATIEARCHITECTUUR

#### Marketing Pages
- ✅ Home (hero + templates + hoe het werkt + wax seal story + reviews + FAQ + CTA)
- ✅ Templates gallery met filtering (Romantisch/Modern/Minimaal)
- ✅ Demo/Preview flow met watermark bescherming
- ✅ Prijzen pagina (aparte pagina)
- ✅ FAQ pagina (aparte pagina)
- ✅ Over ons / Story pagina (wax seal focus)
- ✅ Contact pagina met formulier

#### Legal Pages (GDPR)
- ✅ Privacy Policy
- ✅ Algemene Voorwaarden
- ✅ Cookie Policy

#### Builder (8 stappen)
- ✅ Stap 1: Template kiezen
- ✅ Stap 2: Details (namen, datum, tijd, headline)
- ✅ Stap 3: Locaties (CRUD, types, tijden, adressen)
- ✅ Stap 4: Programma/Timeline (CRUD, presets, emoji icons)
- ✅ Stap 5: RSVP configuratie (velden, deadline)
- ✅ Stap 6: Styling (lakzegel kleur/stijl, monogram, typografie)
- ✅ Stap 7: Preview (device frames, sealed reveal animatie)
- ✅ Stap 8: Checkout (pricing plans, add-ons, mock Stripe)
- ✅ Builder layout met progress indicator en auto-save

#### Dashboard (Post-purchase)
- ✅ Mijn uitnodiging overview
- ✅ Deelbare link genereren
- ✅ RSVP overzicht / gasten dashboard
- ✅ Gastenlijst beheer (RSVP overzicht pagina)
- ⬜ Uitnodiging bewerken
- ✅ Instellingen pagina

#### Auth Pages
- ✅ Login pagina (magic link / email OTP)
- ✅ Email verificatie pagina
- ✅ Account aanmaken flow

#### Public Pages
- ✅ Publieke uitnodiging view (/u/[shareId])
- ✅ RSVP formulier voor gasten

### C) UI/UX & DESIGN SYSTEM
- ✅ Merkpersoonlijkheid gedefinieerd (premium, romantisch, modern)
- ✅ Kleurenpalet (burgundy, champagne, stone)
- ✅ Typografie (Cormorant Garamond, Inter, Caveat)
- ✅ Spacing en layout systeem (Tailwind)
- ✅ UI componenten (Button, Card, Input, Label, Select, Accordion)
- ✅ Wax seal component met animaties en stijlen
- ✅ Scroll reveals en micro-interacties
- ✅ Accessibility (focus states, reduced motion support)
- ⬜ Dark mode implementatie (geconfigureerd maar niet actief)
- ⬜ Component documentatie / Storybook

### D) COPYWRITING & i18n
- ✅ NL copyblokken voor alle marketing secties
- ✅ EN vertalingen (volledige pariteit)
- ✅ i18n structuur met next-intl
- ✅ Tone of voice: warm, stijlvol, modern Nederlands
- ✅ Builder labels en instructies
- ✅ Pricing copy met features per plan
- ✅ Legal content (privacy, voorwaarden, cookies)
- ✅ Email templates copy
- ⬜ Error messages verfijnen

### E) BUILDER: UX FLOW & DATA MODEL
- ✅ 8-stappen flow geïmplementeerd
- ✅ Template systeem (3 templates met kleuren/fonts)
- ✅ Live preview met device frames
- ✅ Opslaan als concept (localStorage persistence)
- ✅ Zustand state management met auto-save
- ✅ Prisma database schema voor alle entiteiten
- ✅ Database persistence (auto-sync wanneer ingelogd)
- ⬜ Template bewerken na betaling
- ✅ RSVP export functionaliteit (CSV/Excel)

### F) ANTI-FREE DEMO ONTWERP
- ✅ Generieke placeholders in demo (Emma & Lucas)
- ✅ Watermark overlay (VOORBEELD • DEMO)
- ✅ RSVP sectie geblurd in demo
- ✅ Print detectie (@media print) met blokkade
- ✅ Context menu disabled + anti-save maatregelen
- ✅ Demo links niet-geïndexeerd
- ⬜ Low-resolution rendering voor screenshots
- ⬜ Demo links laten verlopen

### G) STRIPE INTEGRATIE
- ✅ Checkout UI met plans en add-ons
- ✅ Environment variables geconfigureerd
- ✅ Prisma velden voor payment tracking
- ✅ Stripe Checkout sessie aanmaken
- ✅ Success/cancel routes implementeren
- ✅ Webhook handlers (payment_intent.succeeded)
- ✅ Entitlement systeem na betaling
- ✅ Publish link genereren na payment
- ⬜ Refund policy implementatie
- ⬜ Factuur/receipt via Stripe

### H) AUTHENTICATIE
- ✅ Prisma User en VerificationToken models
- ✅ NextAuth environment variables
- ✅ NextAuth configuratie en providers
- ✅ Magic link / email OTP implementatie
- ✅ Login/signup pagina's
- ✅ Session management
- ✅ Protected routes middleware
- ✅ User context/hooks

### I) BACKEND & API
- ✅ Prisma schema compleet
- ✅ Database connectie setup
- ✅ API routes voor invitations CRUD
- ✅ API routes voor RSVP submissions
- ✅ API routes voor user management (data export/delete)
- ✅ Email service integratie (Resend)
- ✅ Webhooks voor Stripe events

### J) "BETER DAN DIGITALYES" FEATURES
- ✅ Wax seal personalisatie (kleur, stijl, monogram)
- ✅ Multi-locatie ondersteuning
- ✅ Timeline/programma builder
- ✅ RSVP configuratie opties
- ✅ Device preview (desktop/tablet/mobile)
- ✅ RSVP dashboard (overzicht pagina met stats en export)
- ⬜ Automatische RSVP reminders
- ✅ WhatsApp share tips
- ⬜ Route + parkeren modules
- ✅ Dresscode + cadeautip modules
- ✅ "Add to calendar" voor gasten
- ❌ QR code generatie (niet nodig)
- ⬜ Hosted media (foto + video upload)
- ⬜ Accessibility mode toggle
- ✅ GDPR data export/delete
- ✅ Background music (Signature/Premium) - upload + library
- ✅ Guest segmentation (custom groups with event selection)
- ✅ Custom program blocks with icon picker

### K) BUILDER OVERHAUL FASE 1 ✅
- ✅ Remove wax seal particles on click (already removed)
- ✅ Restructure flow: Package → Template → Details → etc. (already implemented)
- ✅ Delete optional add-ons from checkout page
- ✅ Add watermark to builder preview
- ✅ Remove personal names (Emma/Lucas) from demos (uses "Partner 1 & Partner 2")
- ✅ Add dresscode feature
- ✅ Add cadeau tip (gift) feature with envelope icon
- ✅ Guest segmentation (custom groups with event selection)
- ✅ RSVP form beautification
- ✅ Background music for Signature/Premium (vinyl player UI, music library, volume controls)
- ✅ Custom program blocks with icon picker (Lucide icons, categorized picker, search)
- ✅ `useBuilderGuard(minRequired)` hook → redirects to /builder/package if no plan, /builder/template if no template
- ✅ Step locking in builder layout.tsx → locked steps show Lock icon, are non-clickable
- ✅ Auto-apply template styling defaults (sealColor, fontPairing) when template is selected
- ✅ Upgrade chips in RSVP step (dietary/message locked for Basic plan with "Upgrade naar Signature" chip)
- ✅ Premium upsell banner in Program step for custom program blocks
- ✅ Template context banner in Styling step (template name + style + accent dot)
- ✅ "Aanbevolen" badge on recommended font pairing per template

### L) BUILDER OVERHAUL FASE 2 — DESIGN & PREVIEW ✅ DONE
> Plan file: `C:\Users\ieyuh\.claude\plans\cryptic-sprouting-babbage.md`
> All steps below are PENDING — none have been implemented yet.

**Step 0 — Todolist**
- ✅ Update todolist.md with Phase 2 plan (this update)

**Step 1 — Fix `/builder` entry point**
- ✅ Create `src/app/[locale]/(builder)/builder/page.tsx` — redirects `/builder` → `/builder/package`
- ✅ Fix marketing CTAs: `href="/builder/template"` → `href="/builder/package"` in prijzen, over-ons, navigation, hero, final-cta, dashboard

**Step 2 — Redesign Step 1 (Package page)**
- ✅ Rich card design: icon badge, WaxSeal, RSVP highlight box, decorative gradient corner, feature list
- ✅ Selected state: border + ring uses plan's accentColor
- ✅ "Meest gekozen" banner on Signature card
- ✅ Plan colors: Basic #B0AEB0, Signature DEFAULT_SEAL_COLOR, Premium #C09878

**Step 3 — Redesign Step 2 (Template page)**
- ✅ Port TemplateCard + cardStyles from marketing templates page
- ✅ Cards: aspect-[3/4], hero image, namePreview, bottom gradient, number badge
- ✅ Selected state: ring-2 ring-olive-500 + checkmark badge
- ✅ "Bekijk demo" opens `/demo/{slug}` in new tab
- ✅ Grid: 2 cols mobile, 4 cols lg

**Step 4 — Dresscode color picker in Details page**
- ✅ Store: `dresscodeColors: DresscodeColor[]` + `setDresscodeColors` (persisted)
- ✅ Template color suggestion map (2 swatches per template)
- ✅ UI: heading, suggestion chips, "Gebruik aanbevolen kleuren", clear (×), custom hex+name input (max 3)
- ✅ Wired to `DresscodeSection` in preview and real invitation rendering

**Step 5 — Real RSVPSection preview in RSVP page**
- ✅ Replaced hand-coded preview with real `RSVPSection` (invitationId="preview", demo=true)

**Step 6 — Static envelope preview in Styling page**
- ✅ Created `src/components/envelope-2d/envelope-preview.tsx` — static envelope with body+flap PNGs + WaxSeal
- ✅ Store: `showDateOnEnvelope: boolean` added to `EnvelopeConfig`
- ✅ Styling page: removed old preview, added EnvelopePreview, date toggle, removed personalizedText input

**Step 7 — Real invitation rendering in Preview page**
- ✅ Sealed state: EnvelopePreview + "Klik om te openen →" button
- ✅ Revealed: real sections (HeroSection, CountdownSection, LocationSection, TimelineSection, DresscodeSection, FAQSection, GiftSection, RSVPSection)
- ✅ Wrapped in overflow-auto device frame

**Key files for Phase 2 implementation:**
- `src/app/[locale]/(marketing)/prijzen/page.tsx` — copy card visual from here
- `src/app/[locale]/(marketing)/templates/page.tsx` — copy TemplateCard + cardStyles from here
- `src/components/invitation-sections/rsvp-section.tsx` — use in step 6 preview
- `src/components/invitation-sections/dresscode-section.tsx` — accepts `colors?: { hex, name }[]`
- `src/components/envelope-2d/envelope-2d.tsx` — reference for envelope image paths + seal positioning
- `src/app/u/[shareId]/public-invitation.tsx` — InvitationContent component to reuse in step 8
- `src/stores/builder-store.ts` — add dresscodeColors + showDateOnEnvelope
- `src/lib/templates.ts` — getTemplateById + template slugs

---

## TECH STACK

### Geïmplementeerd
- ✅ Next.js 14 (App Router) + TypeScript
- ✅ Tailwind CSS + shadcn/ui componenten
- ✅ Radix UI primitives
- ✅ Framer Motion animaties
- ✅ Zustand state management
- ✅ next-intl voor i18n
- ✅ Prisma ORM + PostgreSQL schema
- ✅ Lucide React icons

### Te implementeren
- ✅ NextAuth voor authenticatie
- ✅ Stripe SDK integratie
- ✅ Resend voor email
- ⬜ Vercel deployment
- ⬜ Managed PostgreSQL database

---

## RECENTE BESLISSINGEN
1. 3 templates voor MVP: Eeuwige Elegantie, Modern Minimaal, Botanische Droom
2. Wax seal als centrale merkbeleving met 3 stijlen (classic/modern/romantic)
3. 8-stappen builder flow met progressive disclosure
4. Pricing: Basic €125, Signature €175, Premium €225
5. Demo bescherming via watermark + blur + print blokkade
6. localStorage voor builder state persistence (database later)

---

## VOLGENDE STAPPEN (Prioriteit)

### Fase 1: Core Backend ✅
1. ✅ NextAuth implementeren (magic link)
2. ✅ API routes voor invitation CRUD
3. ✅ Database persistence voor builder data

### Fase 2: Payment ✅
4. ✅ Stripe Checkout integratie
5. ✅ Webhook handlers
6. ✅ Post-payment entitlement

### Fase 3: Publishing ✅
7. ✅ Publieke uitnodiging pagina
8. ✅ RSVP formulier voor gasten
9. ✅ Dashboard voor koppels

### Fase 4: Polish ✅
10. ✅ Legal pages content
11. ✅ Email templates
12. ✅ Contact formulier

---

## BESTANDEN REFERENTIE

```
src/
├── app/
│   ├── [locale]/
│   │   ├── (marketing)/          # Homepage, templates
│   │   ├── (builder)/builder/    # 8-stappen builder
│   │   ├── (legal)/              # Privacy, voorwaarden, cookies
│   │   ├── (auth)/               # Login, verify (placeholder)
│   │   └── (dashboard)/          # User dashboard (placeholder)
│   ├── demo/[templateSlug]/      # Template demos
│   └── u/[shareId]/              # Publieke shares (placeholder)
├── components/
│   ├── ui/                       # Button, Card, Input, etc.
│   ├── marketing/                # Hero, features, testimonials
│   └── wax-seal/                 # Wax seal component
├── stores/
│   └── builder-store.ts          # Zustand state
├── lib/
│   ├── templates.ts              # 3 template definities
│   └── db.ts                     # Prisma client
├── messages/
│   ├── nl.json                   # Nederlandse vertalingen
│   └── en.json                   # Engelse vertalingen
└── i18n.ts                       # Locale configuratie

prisma/
└── schema.prisma                 # Database models
```

---

## HUIDIGE SESSIE - Premium Features

- ⬜ Envelope animation refinements (seal position + flap speed)

### Completed Features
- ✅ Background Music feature (Signature/Premium)
  - Vinyl record player visualization with spinning animation
  - Curated music library with 5 romantic tracks
  - Play/pause preview with audio wave visualization
  - Volume slider and autoplay toggle
  - Upload option for Premium users
  - Locked state for Basic users with upgrade prompt
- ✅ Guest Segmentation feature
  - Create custom guest groups (Familie, Vrienden, Collega's, Avondgasten presets)
  - Assign events/locations to each group
  - Per-group RSVP field configuration
  - Expandable cards with color-coded design
  - Drag handle for reordering (visual only)
- ✅ Custom Program Blocks with Icon Picker
  - 60+ Lucide icons organized in 9 categories
  - Search functionality to find icons quickly
  - Beautiful picker UI with hover effects
  - Consistent icon rendering across builder, public view, and demo
  - Categories: Wedding, Food & Drink, Entertainment, Locations, Transport, Time, People, Nature, Misc

### Previous Session - UX Polish
- ✅ Post-payment success banner (shows congratulations after checkout redirect)
- ✅ Draft invitation guidance (prominent CTA to continue to payment)
- ✅ Empty dashboard state improvement (welcoming design with decorative elements)
- ✅ Conditional RSVP stats (only shown for paid/published invitations)

### Previous Session - Feature Completion
- ✅ RSVP form beautification (premium design with animations)
- ✅ Dresscode & cadeau tip in builder (already in details page, added DB persistence)
- ✅ Add to calendar (Google Calendar + .ics download)
- ✅ RSVP export (CSV export with all guest data)
- ✅ RSVP overview page (stats, table, dietary overview)
- ✅ WhatsApp share tips (pre-formatted messages, share buttons)
- ✅ Settings page (GDPR export/delete, logout)
- ✅ Updated pricing in docs (€125/€175/€225)
- ✅ Marked already-done items (watermark, particles, demo names, add-ons)

---

## VORIGE SESSIE - Wax Seal Fixes

### Wax Seal Verbeteringen
- ✅ Fix initialen kleuren - moeten blenden met zegel, niet contrasteren
- ✅ Dancing Script label aanpassen (niet "Speels" maar "Handgeschreven")
- ✅ Accent kleur sectie verwijderen uit styling pagina

---

## OUDERE SESSIE - V2 Development

### Dynamic Wax Seal Color Picker ✅
- ✅ Dynamic color picker for wax seal (keep red design, make color customizable via hex)
- ✅ Remove gold/green PNG variants, use CSS hue-rotate on red base

### Wax Seal Realistisch Maken ✅
- ✅ Wax seal component redesign (realistischer zoals referentie)
  - Organische, onregelmatige randen met SVG turbulence filters
  - 3D diepte met realistische schaduwen en gradients
  - Embossed initialen met bloem decoratie (togglebaar)
  - Zachte highlights voor wax textuur
  - Subtiele papier schaduw
- ✅ Wax seal updaten in builder (stap 6 styling) + floral toggle toegevoegd
- ✅ Wax seal updaten door hele site (hero, about, preview, public, demo)
- ✅ Prisma schema + API routes bijgewerkt met sealFloral veld

---

*Laatst bijgewerkt: Januari 2026*
