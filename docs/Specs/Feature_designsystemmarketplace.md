DWS | DESIGN SYSTEM MARKETPLACE SPECIFICATION

1. Overview
The Design System Marketplace is a section of the DWS (DQ Workspace) intranet that surfaces DQ’s design systems: CI.DS, V.DS, and CDS. It lets users browse, filter, and open detailed views for each system.

Attribute | Value
Route | /marketplace/design-system
Component | MarketplacePage (with marketplaceType="design-system")
Parent | DWS Marketplace (/marketplace/*)
Navigation | Header Explore dropdown → "Design System Marketplace"

2. Purpose & Goals
- Discoverability: Central place for CI.DS, V.DS, and CDS.
- Consistency: Shared patterns for content, video, and campaigns.
- Context: Tab descriptions explain each system’s role.
- Detail views: Deep dives into each framework via dedicated detail pages.

3. User Experience
3.1 Page Layout
- Container: container mx-auto px-4 py-8 flex-grow max-w-7xl (inside min-h-screen flex flex-col bg-gray-50).
- Header: Title "Design System Marketplace" and description.
- Tabs: CI.DS | V.DS | CDS (URL-synced via ?tab=cids|vds|cds).
- Tab description: Short explanation for the active tab.
- Search: Shared search bar (placeholder: "Search in DQ Knowledge Center").
- Filters: Sidebar filters by category and location.
- Grid: Cards in grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto.

3.2 Tab Descriptions
Tab | Description
CI.DS | How DQ creates and delivers high-quality content with structure, guidelines, and review standards for consistency and impact.
V.DS | How DQ creates high-impact video content with storytelling, design, and production standards.
CDS | How DQ designs and delivers marketing campaigns by combining strategy, storytelling, and execution.

4. Navigation & Routing
Route | Component | Purpose
/marketplace/design-system | MarketplacePage | Main listing with tabs
/marketplace/design-system/:cardId | DesignSystemDetailPage | Detail page (routes to CI.DS, V.DS, or CDS based on ?tab= param)

Detail routing (DesignSystemDetailPage.tsx):
- ?tab=vds → VDSServiceDetailPage
- ?tab=cds → CDSServiceDetailPage
- Default → CIDSServiceDetailPage
- Card links: /marketplace/design-system/{id}?tab={type} (e.g., /marketplace/design-system/cids-introduction?tab=cids).

5. Data Model
5.1 Design System Item
```
interface DesignSystemItem {
  id: string;
  title: string;
  description: string;
  type: 'cids' | 'vds' | 'cds';
  imageUrl: string;
  location?: string;      // DXB, KSA, NBO
  tags?: string[];
  category?: string;     // e.g. 'cids-framework', 'vds-framework', 'cds-framework'
}
```

5.2 Current Items
ID | Title | Type | Category | Location
cids-introduction | CI.DS Framework | cids | cids-framework | DXB
vds-framework | V.DS Framework | vds | vds-framework | KSA
cds-campaigns-design-system | CDS Framework | cds | cds-framework | NBO
Source: src/utils/designSystemData.ts (static data).

6. Components & Architecture
6.1 Main Components
Component | Path | Role
MarketplacePage | src/components/marketplace/MarketplacePage.tsx | Shared marketplace layout; design-system is one mode
DesignSystemCard | src/components/marketplace/DesignSystemCard.tsx | Card for each design system item
DesignSystemDetailPage | src/pages/marketplace/DesignSystemDetailPage.tsx | Router to CI.DS / V.DS / CDS detail pages
CIDSServiceDetailPage | src/pages/marketplace/CIDSServiceDetailPage.tsx | CI.DS detail
VDSServiceDetailPage | src/pages/marketplace/VDSServiceDetailPage.tsx | V.DS detail
CDSServiceDetailPage | src/pages/marketplace/CDSServiceDetailPage.tsx | CDS detail

6.2 DesignSystemCard
- Height: 350px
- Content: Hero image, title, description (line-clamp-3), "View Details" button
- Styling: White card, rounded-lg, shadow, border-gray-200, hover shadow-md
- CTA: Link to /marketplace/design-system/{id}?tab={type}

7. Features & Functionality
7.1 Implemented
- Tab navigation: CI.DS, V.DS, CDS with URL sync
- Filtering: Category (Framework, Lifecycle, Template) and Location (DXB, KSA, NBO)
- Search: Text search across items
- Card grid: Responsive 1/2/3 columns
- Detail pages: Separate pages for CI.DS, V.DS, CDS
- Breadcrumbs: Home → Design Systems → Design System Marketplace on detail pages

7.2 Filters (per tab)
CI.DS tab:
- CI.DS: CI.DS Framework, CI.DS Lifecycle, CI.DS Template
- Location: DXB, KSA, NBO

V.DS tab:
- V.DS: V.DS Framework, V.DS Lifecycle, V.DS Template
- Location: DXB, KSA, NBO

CDS tab:
- CDS: CDS Framework, CDS Lifecycle, CDS Template
- Location: DXB, KSA, NBO
Config: getDesignSystemTabSpecificFilters() in src/utils/marketplaceConfig.ts.

7.3 Empty State
When no items match filters:
> "No {CI.DS|V.DS|CDS} services found"
> "Service cards will appear here once they are added."

8. Configuration
Design system config in marketplaceConfig.ts:
```
'design-system': {
  id: 'design-system',
  title: 'Design System Marketplace',
  description: 'Explore design system components, patterns, and resources for consistent digital experiences.',
  route: '/marketplace/design-system',
  primaryCTA: 'Access Now',
  secondaryCTA: 'View Details',
  itemName: 'Design System',
  itemNamePlural: 'Design Systems',
  // ... attributes, detailSections, tabs, filterCategories
}
```

9. Technical Notes
9.1 Data Source
- Current: Static data in designSystemData.ts
- No API: No fetchMarketplaceItems for design-system
- Filtering: Client-side via getDesignSystemItemsByType() and category filters

9.2 Routing
- MarketplaceRouter has duplicate design-system routes (lines 159–160 and 171–172). The first set uses DesignSystemDetailPage; the second uses MarketplaceDetailsPage. Only the first set is used because it appears earlier.

9.3 Dependencies
- React Router (useSearchParams, useNavigate, Link)
- Lucide icons (FilterIcon, XIcon, HomeIcon, ChevronRightIcon, InfoIcon)
- Shared marketplace components (FilterSidebar, SearchBar, Header, Footer)

10. Future Enhancements
- Backend: Move items to Supabase or another API instead of static data.
- More items: Add Lifecycle and Template items for each system.
- Bookmarks: Add bookmarking like Knowledge Hub.
- Comparison: Add comparison of design systems.
- Promo cards: Add promo cards similar to other marketplaces.
- Analytics: Track tab changes and card clicks.
- Versioning: Add version metadata for each system.

11. File Reference
File | Purpose
src/utils/designSystemData.ts | Static items and helpers
src/utils/marketplaceConfig.ts | Design system config and filters
src/components/marketplace/MarketplacePage.tsx | Main marketplace page
src/components/marketplace/DesignSystemCard.tsx | Card component
src/pages/marketplace/DesignSystemDetailPage.tsx | Detail router
src/pages/marketplace/CIDSServiceDetailPage.tsx | CI.DS detail
src/pages/marketplace/VDSServiceDetailPage.tsx | V.DS detail
src/pages/marketplace/CDSServiceDetailPage.tsx | CDS detail
src/pages/marketplace/MarketplaceRouter.tsx | Route definitions
src/components/Header/components/ExploreDropdown.tsx | Header navigation entry
