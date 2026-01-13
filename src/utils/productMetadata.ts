export interface ProductMetadata {
  productType: string
  productStage: string
  description: string
  imageUrl: string
}

// Product metadata mapping - maps product titles to their metadata
export const PRODUCT_METADATA: Record<string, ProductMetadata> = {
  'TMaaS': {
    productType: 'TMaaS',
    productStage: 'MVP',
    description: 'A managed service offering that provides continuous transformation leadership, governance, and execution support using DQ platforms and expertise.',
    imageUrl: '/images/tmaas.jpg'
  },
  'Transformation Management as a Service': {
    productType: 'TMaaS',
    productStage: 'MVP',
    description: 'A managed service offering that provides continuous transformation leadership, governance, and execution support using DQ platforms and expertise.',
    imageUrl: '/images/tmaas.jpg'
  },
  'TMaaS – Transformation Management as a Service': {
    productType: 'TMaaS',
    productStage: 'MVP',
    description: 'A managed service offering that provides continuous transformation leadership, governance, and execution support using DQ platforms and expertise.',
    imageUrl: '/images/tmaas.jpg'
  }
}

/**
 * Get product metadata for a given title
 * Performs case-insensitive matching and handles variations
 */
export function getProductMetadata(title: string | null | undefined): ProductMetadata | null {
  if (!title) return null
  
  const normalizedTitle = title.trim()
  
  // Direct match
  if (PRODUCT_METADATA[normalizedTitle]) {
    return PRODUCT_METADATA[normalizedTitle]
  }
  
  // Case-insensitive match
  const lowerTitle = normalizedTitle.toLowerCase()
  for (const [key, value] of Object.entries(PRODUCT_METADATA)) {
    if (key.toLowerCase() === lowerTitle) {
      return value
    }
  }
  
  // Partial match for TMaaS variations
  if (lowerTitle.includes('tmaas') || (lowerTitle.includes('transformation management as a service'))) {
    return PRODUCT_METADATA['TMaaS – Transformation Management as a Service']
  }
  
  return null
}


