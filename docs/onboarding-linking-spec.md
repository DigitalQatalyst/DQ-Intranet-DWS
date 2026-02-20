# Onboarding Experience — Link & Navigation Spec

This spec captures how the onboarding experience is wired today across the landing page and the onboarding marketplace so implementers know exactly where each CTA goes and what needs to be added later.

## Scope
- **Onboarding landing page:** `/onboarding/welcome` (`src/pages/OnboardingLanding.tsx`)
- **Onboarding marketplace:** `/onboarding` (`src/pages/OnboardingMarketplace.tsx` via `MarketplacePage`)
- **Routing context:** declared in `src/App.tsx`

## Entry Points
- **Signin redirect:** `/signin` redirects to `/onboarding/start` (placeholder screen). Expected follow-up is to route users to `/onboarding/welcome` once the start flow is implemented.
- **Direct links:** `/onboarding` opens the onboarding marketplace; `/onboarding/welcome` opens the narrative landing page.

## Onboarding Landing (`/onboarding/welcome`)
Primary purpose: narrative welcome + deep links into core orientation resources.

| UI Element / CTA | Current Target | Notes |
| --- | --- | --- |
| Hero button “View the 3-Month Onboarding Guide” | `/onboarding/journey` | Placeholder route; page not yet implemented. |
| Scroll chevron | Scrolls to `#onboarding-sections` | Client-side scroll only. |
| “Explore GHC” (Section 3) | `/ghc` | Internal route for Golden Honeycomb competencies. |
| “Explore Agile 6xD” (Section 4) | `/6xd` | Internal route for 6xD system. |
| “View Roles & Teams” (handleViewRole) — currently unused in UI | `/marketplace/work-directory?tab=positions` | Navigation helper exists but no visible button in current markup. |
| Support cards (People Partner, Comms Center, FAQs, Unit/Delivery Lead) | `/support/*` | Marked `comingSoon` (buttons disabled). |
| “DQ Organization” & “You Are the Qatalyst” buttons | — | Disabled, labeled “Coming Soon.” |

## Onboarding Marketplace (`/onboarding`)
Purpose: catalog of onboarding flows using the shared marketplace shell.

Source: `getMarketplaceConfig('onboarding')` in `src/utils/marketplaceConfig.ts`.

- **Page title/description:** “Onboarding Flows” / “Discover guided flows to get productive fast in the Digital Workspace.”
- **Primary CTA label:** “Start Flow” (per item). Secondary: “View Details”.
- **Attributes shown per item:** duration, format (deliveryMode), role, journey phase, plus tags.
- **Filters:** Journey Phase, Role, Time to Complete, Format, Popularity.
- **Tabs on detail view:** About, Steps, Resources, Provider, Related.
- **Data:** currently backed by `mockOnboardingFlowsData` until API is wired.
- **Routes emitted by MarketplacePage:**  
  - List: `/onboarding`  
  - Detail: `/onboarding/:id` (handled by MarketplacePage; id comes from data)  
  - Primary CTA clicks follow the item’s `primaryRoute` if present; otherwise default handled inside `MarketplacePage` (check when wiring real data).

## Routing Map (quick reference)
- `/signin` → (redirect) `/onboarding/start` → *(planned)* `/onboarding/welcome`
- `/onboarding/welcome` → hero CTA → `/onboarding/journey` *(not built yet)*
- `/onboarding/welcome` → Explore GHC → `/ghc`
- `/onboarding/welcome` → Explore Agile 6xD → `/6xd`
- `/onboarding/welcome` → (helper) View Roles → `/marketplace/work-directory?tab=positions`
- `/onboarding` → onboarding marketplace list
- `/onboarding/:id` → onboarding flow detail (marketplace shell)

## Gaps / TODOs
1) Build `/onboarding/journey` and wire the signin “start” redirect to land on the hero CTA destination.  
2) Decide whether `/onboarding/start` should immediately redirect to `/onboarding/welcome` until the start form exists.  
3) Expose a visible button for “View Roles & Teams” if the work-directory tab is ready.  
4) Flip support cards to active targets when the `/support/*` routes go live.  
5) Swap mock onboarding data to live API once available and confirm `primaryRoute`/`secondaryRoute` handling for flow CTAs.  
6) Add tracking (if needed): log hero CTA, GHC, 6xD, and marketplace clicks for onboarding funnel metrics.

---

# GHC Landing — Link & CTA Map
- **Route:** `/ghc` (registered in `src/AppRouter.tsx`)
- **Source:** `src/pages/GHCLanding.tsx`

## Primary Links
| UI | Target | Notes |
| --- | --- | --- |
| Hero button “Read the Storybook” | `https://preview.shorthand.com/Pg0KQCF1Rp904ao7` | Opens new tab. |
| Scroll chevron | Scroll to carousel | In-page scroll. |
| Seven Responses cards (Vision, HoV, Persona, Agile TMS, Agile SoS, Agile Flows, Agile 6xD) | `/marketplace/guides/dq-vision`, `/marketplace/guides/dq-hov`, `/marketplace/guides/dq-persona`, `/marketplace/guides/dq-agile-tms`, `/marketplace/guides/dq-agile-sos`, `/marketplace/guides/dq-agile-flows`, `/marketplace/guides/dq-agile-6xd` | One per card. |
| Carousel “Explore marketplace” control | `/marketplace/guides` | Navigate inside app. |
| Action cards | Storybooks → `https://preview.shorthand.com/Pg0KQCF1Rp904ao7` (external) • Learning Center → `/lms` • Knowledge Center → `/marketplace/guides` • Viva Engage → `https://engage.cloud.microsoft/main/feed` (external) | Uses `window.open` for external. |
| Final CTA primary | `/` | Label “Go to the DQ Digital Workspace”. |
| Final CTA secondary | *(none by default)* | Can be provided via overrides. |

## Entry/Exit
- Onboarding landing “Explore GHC” → `/ghc`.
- Guides marketplace can deep-link back via the card routes above.

## TODOs
1) Confirm if bottom CTA (“Explore all Seven Responses together”) needs a link; currently text only.  
2) Add analytics for hero, response card clicks, and action cards.  
3) Decide if Viva Engage should open in SSO-aware wrapper instead of direct external link.

---

# Agile 6xD Landing — Link & CTA Map
- **Route:** `/6xd` (via `src/pages/6XDLanding.tsx`, built on GHCLanding with overrides)

## Primary Links
| UI | Target | Notes |
| --- | --- | --- |
| Hero button “Read the Agile 6xD Storybook” | `https://digital-qatalyst.shorthandstories.com/4d9b256d-1632-4c32-bc0c-73d9cdfa57fc/index.html` | Opens new tab. |
| Six Perspectives cards (DE, DCO, DBP, DT2.0, DW/WS, Digital Accelerators) | `/marketplace/guides/digital-economy`, `/marketplace/guides/digital-cognitive-organisation`, `/marketplace/guides/digital-business-platforms`, `/marketplace/guides/digital-transformation-2`, `/marketplace/guides/digital-worker-workspace`, `/knowledge-center/products/digital-accelerators` | Each card “Explore in Knowledge Center”. |
| Responses CTA (books) | `/6xd-products#products` | Label “Read the 6xD Books”; rendered locked in layout. |
| Action cards | Start in Learning Center → `/lms?category=6xd` • Knowledge Center → `/marketplace/guides/dq-6xd` • Storybook → `https://digital-qatalyst.shorthandstories.com/4d9b256d-1632-4c32-bc0c-73d9cdfa57fc/index.html` | External opens new tab. |
| Foundation CTA | `/marketplace/guides/dq-6xd` | Label “Read the full Agile 6xD storybook”. |
| Final CTA secondary | `/6xd-products` | Label “Explore Agile 6xD Products”. |
| Final CTA primary | *(empty label/target in overrides)* | Button renders empty; should be set or hidden (see TODOs). |

## Entry/Exit
- Onboarding landing “Explore Agile 6xD” → `/6xd`.
- 6xD Products page links back via “Read the 6xD Books” (shorthand) and DTMI insights.

## TODOs
1) Set a real final primary CTA (e.g., `/marketplace/guides/dq-6xd` or `/6xd-products`) or hide when not provided.  
2) Decide if responses CTA lock should be removed; currently points to products section.  
3) Add analytics for perspective card clicks, action cards, and book CTA.

---

# Agile 6xD Products — Link & CTA Map
- **Route:** `/6xd-products` (`src/pages/6XDProductsLanding.tsx`)

## Primary Links
| UI | Target | Notes |
| --- | --- | --- |
| Hero “Explore Product Marketplace” | `/marketplace/directory/products` | Internal. |
| Hero “Explore 6xD & DTMI” | `https://corp-web.qatalyst.tech/marketplace/dtmi` | New tab. |
| Clarity section “See All Product Classes” | `#products` anchor | Scroll within page. |
| 6xD books button | `https://digital-qatalyst.shorthandstories.com/4d9b256d-1632-4c32-bc0c-73d9cdfa57fc/index.html` | New tab. |
| DTMI insights button | `/marketplace/guides/dq-6xd` | Internal. |
| Filter chips | Toggle local filter; “Class 04 TxM” is locked (disabled) while `MAX_UNLOCKED_CLASS` is 3. |
| Product cards (unlocked Classes 01–03) | Uses `product.href` when present, else `/marketplace/directory/products` | Class 01 links: Design → `https://dq-prod-corp-web-git-develop-digitalqatalysts-projects.vercel.app/services/design-4-0`; Deploy → `https://dq-prod-corp-web-git-develop-digitalqatalysts-projects.vercel.app/services/deploy-4-0` (both new tab). Others fall back to marketplace directory. |
| Product cards (locked classes) | CTA disabled, shows “Locked” badge | Class 04 currently locked. |
| Sector tags | Mixed: some external service links (e.g., Experience 4.0) open new tab; “Coming Soon” tags prevent navigation. |

## Entry/Exit
- From 6xD landing final CTA secondary → `/6xd-products`.
- Buttons within page route to marketplace directory and sector service pages.

## TODOs
1) When Class 04 should open, set `MAX_UNLOCKED_CLASS` to 4 and confirm filter chip enabled.  
2) Replace fallback `/marketplace/directory/products` with specific product detail routes when available.  
3) Add tracking for filter usage and per-product CTA clicks.
