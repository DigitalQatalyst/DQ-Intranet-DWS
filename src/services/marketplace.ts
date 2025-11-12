import { request } from "./graphql/client";
import { MARKETPLACE_QUERIES } from "./graphql/queries";
import { FilterConfig } from "../components/marketplace/FilterSidebar";
import { MarketplaceItem } from "../components/marketplace/MarketplaceGrid";
import { getMarketplaceConfig } from "../utils/marketplaceConfiguration";
import { supabaseClient } from "../lib/supabaseClient";

/**
 * Fetches marketplace items based on marketplace type, filters, and search query
 */
export const fetchMarketplaceItems = async (
  marketplaceType: string,
  filters: Record<string, string>,
  searchQuery?: string
): Promise<any[]> => {
  try {
    // Get the marketplace config to access query and mapping functions
    const config = getMarketplaceConfig(marketplaceType);
    // Get the appropriate query for this marketplace type
    const query =
      MARKETPLACE_QUERIES[marketplaceType as keyof typeof MARKETPLACE_QUERIES]
        ?.getItems;
    if (!query) {
      throw new Error(
        `No query defined for marketplace type: ${marketplaceType}`
      );
    }
    // Prepare variables for the query
    const variables: Record<string, string | undefined> = {
      search: searchQuery || undefined,
    };
    // Add filter variables
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        variables[key] = value;
      }
    });
    // Execute the query
    const data = (await request(
      query,
      variables,
      `get${
        marketplaceType.charAt(0).toUpperCase() + marketplaceType.slice(1)
      }Items`,
      marketplaceType
    )) as any;
    // Transform the data using the mapping function if provided in the config
    if (config.mapListResponse && data.items) {
      return config.mapListResponse(data.items);
    }
    return data.items || [];
  } catch (error) {
    console.error(`Error fetching ${marketplaceType} items:`, error);
    throw new Error(
      `Failed to load ${marketplaceType} items. Please try again later.`
    );
  }
};

/**
 * Fetches filter configurations for a specific marketplace type
 */
export const fetchMarketplaceFilters = async (
  marketplaceType: string
): Promise<FilterConfig[]> => {
  try {
    // Get the marketplace config
    const config = getMarketplaceConfig(marketplaceType);
    // Get the appropriate query for this marketplace type
    const query =
      MARKETPLACE_QUERIES[marketplaceType as keyof typeof MARKETPLACE_QUERIES]
        ?.getFilterOptions;
    if (!query) {
      // Fall back to config-defined filters if no query is available
      return config.filterCategories;
    }
    // Execute the query
    const data = (await request(
      query,
      {},
      `get${
        marketplaceType.charAt(0).toUpperCase() + marketplaceType.slice(1)
      }FilterOptions`,
      marketplaceType
    )) as any;
    // Transform the data using the mapping function if provided in the config
    if (config.mapFilterResponse && data.filterOptions) {
      return config.mapFilterResponse(data.filterOptions);
    }
    // Fall back to config-defined filters if mapping fails
    return config.filterCategories;
  } catch (error) {
    console.error(
      `Error fetching filter options for ${marketplaceType}:`,
      error
    );
    // Fall back to config-defined filters on error
    const config = getMarketplaceConfig(marketplaceType);
    return config.filterCategories;
  }
};

/**
 * Transform Supabase event to marketplace event format
 * This matches the transformation used in MarketplacePage.tsx
 */
const transformEventToMarketplace = (event: any): any => {
  const startDate = new Date(event.start_time);
  const endDate = new Date(event.end_time);
  
  // Format date
  const dateStr = startDate.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  // Format time range
  const startTime = startDate.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
  const endTime = endDate.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
  const timeStr = `${startTime} - ${endTime}`;

  // Handle location for virtual events
  let location = event.location || "TBA";
  if (event.is_virtual && event.meeting_link) {
    location = location.includes('Virtual') ? location : `Virtual - ${location}`;
  }

  return {
    id: event.id,
    title: event.title,
    description: event.description || "",
    category: event.category || "General",
    eventType: event.category || "General",
    businessStage: "All Stages",
    provider: {
      name: event.organizer_name || "DQ Events",
      logoUrl: "/DWS-Logo.png",
      description: event.organizer_name ? `${event.organizer_name} Events` : "Digital Qatalyst Events"
    },
    date: dateStr,
    time: timeStr,
    location: location,
    price: "Free",
    capacity: event.max_attendees ? `${event.max_attendees} attendees` : undefined,
    tags: event.tags || [],
    imageUrl: event.image_url || undefined,
    isVirtual: event.is_virtual || false,
    startTime: event.start_time,
    endTime: event.end_time,
    // Additional fields for details page
    meetingLink: event.meeting_link,
    registrationRequired: event.registration_required || false,
    registrationDeadline: event.registration_deadline,
    isFeatured: event.is_featured || false,
    organizerEmail: event.organizer_email,
    organizerId: event.organizer_id,
  };
};

/**
 * Fetches details for a specific marketplace item
 */
export const fetchMarketplaceItemDetails = async (
  marketplaceType: string,
  itemId: string
): Promise<any> => {
  try {
    // Handle events separately - fetch from Supabase
    if (marketplaceType === 'events') {
      // Try events_v2 table first
      let eventData = null;
      
      try {
        const { data, error } = await supabaseClient
          .from('events_v2')
          .select('*')
          .eq('id', itemId)
          .eq('status', 'published')
          .single();

        if (error) {
          console.warn('Error fetching from events_v2:', error);
          // Try upcoming_events view as fallback
          const { data: viewData, error: viewError } = await supabaseClient
            .from('upcoming_events')
            .select('*')
            .eq('id', itemId)
            .eq('status', 'published')
            .single();

          if (viewError) {
            throw viewError;
          }
          eventData = viewData;
        } else {
          eventData = data;
        }

        if (eventData) {
          return transformEventToMarketplace(eventData);
        }
      } catch (supabaseError) {
        console.error('Error fetching event from Supabase:', supabaseError);
        throw new Error(`Failed to load event details from database.`);
      }
    }

    // For other marketplace types, use GraphQL
    const config = getMarketplaceConfig(marketplaceType);
    const query =
      MARKETPLACE_QUERIES[marketplaceType as keyof typeof MARKETPLACE_QUERIES]
        ?.getItemDetails;
    if (!query) {
      throw new Error(
        `No detail query defined for marketplace type: ${marketplaceType}`
      );
    }
    // Execute the query
    const data = (await request(
      query,
      {
        id: itemId,
      },
      `get${
        marketplaceType.charAt(0).toUpperCase() + marketplaceType.slice(1)
      }ItemDetails`,
      marketplaceType
    )) as any;
    // Transform the data using the mapping function if provided in the config
    if (config.mapDetailResponse && data.item) {
      return config.mapDetailResponse(data.item);
    }
    return data.item;
  } catch (error) {
    console.error(`Error fetching ${marketplaceType} item details:`, error);
    throw new Error(`Failed to load item details. Please try again later.`);
  }
};

/**
 * Fetches related items for a specific marketplace item
 */
export const fetchRelatedMarketplaceItems = async (
  marketplaceType: string,
  itemId: string,
  category: string,
  provider: string
): Promise<any[]> => {
  try {
    // Handle events separately - fetch from Supabase
    if (marketplaceType === 'events') {
      const now = new Date().toISOString();
      
      // Fetch related events (same category, different ID, future events)
      const { data, error } = await supabaseClient
        .from('events_v2')
        .select('*')
        .eq('status', 'published')
        .eq('category', category)
        .neq('id', itemId)
        .gte('start_time', now)
        .order('start_time', { ascending: true })
        .limit(6);

      if (error) {
        console.warn('Error fetching related events:', error);
        // Try upcoming_events view as fallback
        const { data: viewData, error: viewError } = await supabaseClient
          .from('upcoming_events')
          .select('*')
          .eq('status', 'published')
          .eq('category', category)
          .neq('id', itemId)
          .gte('start_time', now)
          .order('start_time', { ascending: true })
          .limit(6);

        if (viewError) {
          console.error('Error fetching related events from view:', viewError);
          return [];
        }

        return (viewData || []).map(transformEventToMarketplace);
      }

      return (data || []).map(transformEventToMarketplace);
    }

    // For other marketplace types, use GraphQL
    const config = getMarketplaceConfig(marketplaceType);
    const query =
      MARKETPLACE_QUERIES[marketplaceType as keyof typeof MARKETPLACE_QUERIES]
        ?.getRelatedItems;
    if (!query) {
      throw new Error(
        `No related items query defined for marketplace type: ${marketplaceType}`
      );
    }
    // Execute the query
    const data = (await request(
      query,
      {
        id: itemId,
        category,
        provider,
      },
      `getRelated${
        marketplaceType.charAt(0).toUpperCase() + marketplaceType.slice(1)
      }Items`,
      marketplaceType
    )) as any;
    // Transform the data using the mapping function if provided in the config
    if (config.mapListResponse && data.relatedItems) {
      return config.mapListResponse(data.relatedItems);
    }
    return data.relatedItems || [];
  } catch (error) {
    console.error(`Error fetching related ${marketplaceType} items:`, error);
    throw new Error(`Failed to load related items. Please try again later.`);
  }
};

/**
 * Fetches providers for a specific marketplace type
 */
export const fetchMarketplaceProviders = async (
  marketplaceType: string
): Promise<any[]> => {
  try {
    // Get the appropriate query for this marketplace type
    const query =
      MARKETPLACE_QUERIES[marketplaceType as keyof typeof MARKETPLACE_QUERIES]
        ?.getProviders;
    if (!query) {
      throw new Error(
        `No providers query defined for marketplace type: ${marketplaceType}`
      );
    }
    // Execute the query
    const data = (await request(
      query,
      {},
      `get${
        marketplaceType.charAt(0).toUpperCase() + marketplaceType.slice(1)
      }Providers`,
      marketplaceType
    )) as any;
    return data.providers || [];
  } catch (error) {
    console.error(`Error fetching ${marketplaceType} providers:`, error);
    throw new Error(`Failed to load providers. Please try again later.`);
  }
};
