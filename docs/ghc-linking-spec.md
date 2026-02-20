# GHC Landing Page — Link & CTA Specification

Route: `/ghc`  
Source: `src/pages/GHCLanding.tsx`  
Registered in: `src/AppRouter.tsx`

## Section-by-section map

### 1) Hero
- CTA: **“Read the Storybook”** → `https://preview.shorthand.com/Pg0KQCF1Rp904ao7` (opens new tab via `window.open` in `handleReadStorybook`).
- Scroll chevron: in-page scroll to next section.

### 2) What is GHC
- Informational; no outbound links.

### 3) Seven Responses Carousel
- Cards (one per response) link to Guides marketplace detail pages:
  - Vision → `/marketplace/guides/dq-vision`
  - House of Values → `/marketplace/guides/dq-hov`
  - Persona → `/marketplace/guides/dq-persona`
  - Agile TMS → `/marketplace/guides/dq-agile-tms`
  - Agile SoS → `/marketplace/guides/dq-agile-sos`
  - Agile Flows → `/marketplace/guides/dq-agile-flows`
  - Agile 6xD → `/marketplace/guides/dq-agile-6xd`
- Carousel control “Explore marketplace” → `/marketplace/guides`.

### 4) Take Action
- Storybooks card → `https://preview.shorthand.com/Pg0KQCF1Rp904ao7` (external).
- Learning Center → `/lms`.
- Knowledge Center → `/marketplace/guides`.
- Viva Engage → `https://engage.cloud.microsoft/main/feed` (external, new tab).

### 5) Final CTA
- Primary button label defaults to **“Go to the DQ Digital Workspace”** → `/`.
- Secondary button is optional via overrides; default build has none.

## Entry points into /ghc
- Onboarding landing CTA “Explore GHC” → `/ghc`.
- Guides marketplace can deep-link back from cards above.

## Known gaps / TODOs
1) Bottom CTA text “Explore all Seven Responses together” is non-clickable; decide target or remove.  
2) Add click tracking for hero, response cards, carousel marketplace control, and Take Action cards.  
3) Consider SSO-friendly path for Viva Engage instead of direct external URL.  
4) If workspace home differs from `/`, update final primary CTA target accordingly.  
5) For accessibility, add `aria-label`s to carousel nav buttons and external-link indicators if required by design system.
