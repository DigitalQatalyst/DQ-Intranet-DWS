import React from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { parseCsv } from "../../utils/guides"

interface Props {
  items: any[]
  onClickGuide?: (guide: any) => void
}

const TestimonialsGrid: React.FC<Props> = ({ items, onClickGuide }) => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const disclaimer = '(not approved for external publication)'
  // Get a hero image for testimonials - use an office/team collaboration image
  const serviceCardImage = "/images/testimonials.jpg"
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  // Service cards always show regardless of filter selection

  // Filter items to exclude "Client Feedback" entries
  const filteredItems = (items || []).filter((item) => {
    const title = (item.title || "").toLowerCase()
    return !title.includes("client feedback")
  })

  return (
    <div className="space-y-6">
      {/* Service cards row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Client Feedback Service Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col min-h-[340px]">
          {/* Hero Image */}
          <img 
            src={serviceCardImage} 
            alt="Client Feedback" 
            className="w-full h-32 object-cover"
            loading="lazy"
          />
          
          {/* Content */}
          <div className="p-4 flex flex-col flex-grow">
            {/* Title */}
            <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">Client Feedback</h3>
            
            {/* Description */}
            <p className="text-sm text-gray-600 mb-3 leading-relaxed line-clamp-2 flex-grow">
              Highlights from DFSA, ADIB, and Khalifa Fund showcasing how Digital Qatalyst engagements accelerate transformation outcomes.
            </p>
            
            {/* Tag */}
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-white border border-gray-200 text-[#0B1E67]">
                Client Success
              </span>
            </div>
            
            {/* Metadata */}
            <div className="text-xs text-gray-600 mb-3">
              <div>{formatDate()}</div>
            </div>
            
            {/* Separator */}
            <div className="border-t border-gray-200 mb-3"></div>
            
            {/* View Details Button */}
            <button
              type="button"
              onClick={() => navigate('/marketplace/guides/testimonials')}
              className="w-full inline-flex items-center justify-center rounded-full bg-[var(--guidelines-primary-solid)] text-white text-sm font-semibold px-4 py-2 transition-all hover:bg-[var(--guidelines-primary-solid-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--guidelines-ring-color)]"
              aria-label="View details"
            >
              View Details
            </button>
          </div>
        </div>

        {/* Associate Testimonials Service Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col min-h-[340px]">
          {/* Hero Image */}
          <img 
            src={serviceCardImage} 
            alt="Associate Feedback" 
            className="w-full h-32 object-cover"
            loading="lazy"
          />
          
          {/* Content */}
          <div className="p-4 flex flex-col flex-grow">
            {/* Title */}
            <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">Associate Feedback</h3>
            
            {/* Description */}
            <p className="text-sm text-gray-600 mb-3 leading-relaxed line-clamp-2 flex-grow">
              Stories from DQ associates showcasing how Digital Qatalyst's values and culture have supported their professional and personal growth.
            </p>
            
            {/* Tag */}
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-white border border-gray-200 text-[#0B1E67]">
                Associate Stories
              </span>
            </div>
            
            {/* Metadata */}
            <div className="text-xs text-gray-600 mb-3">
              <div>{formatDate()}</div>
            </div>
            
            {/* Separator */}
            <div className="border-t border-gray-200 mb-3"></div>
            
            {/* View Details Button */}
            <button
              type="button"
              onClick={() => navigate('/marketplace/guides/associate-testimonials')}
              className="w-full inline-flex items-center justify-center rounded-full bg-[var(--guidelines-primary-solid)] text-white text-sm font-semibold px-4 py-2 transition-all hover:bg-[var(--guidelines-primary-solid-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--guidelines-ring-color)]"
              aria-label="View details"
            >
              View Details
            </button>
          </div>
        </div>
      </div>

      {/* Associate testimonial cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        {filteredItems.map((item) => {
          const name = item.author_name || item.title || "Unnamed Testimonial"
          const organization = item.author_org || item.domain || ""
          const quote = (item.summary || item.body || "").trim()

          return (
            <div
              key={item.id || item.slug}
              className="h-full min-h-[340px] rounded-2xl border border-gray-200 bg-white text-left p-5 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => onClickGuide && onClickGuide(item)}
            >
              <div className="flex items-start gap-4 mb-3">
                <div className="w-12 h-12 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {/* Generic user icon */}
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-600">
                    <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="currentColor" />
                    <path d="M12 14C7.58172 14 4 16.6863 4 20V22H20V20C20 16.6863 16.4183 14 12 14Z" fill="currentColor" />
                  </svg>
                </div>
                <div className="leading-tight">
                  <p className="font-semibold text-gray-900">{name}</p>
                  {organization && (
                    <p className="text-xs text-gray-500 whitespace-pre-line">{organization}</p>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                "{quote}"
                <span className="block text-xs text-gray-500 italic mt-2">{disclaimer}</span>
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default TestimonialsGrid
