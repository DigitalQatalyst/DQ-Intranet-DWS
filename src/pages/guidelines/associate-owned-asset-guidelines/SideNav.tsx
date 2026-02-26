import React, { useEffect, useState } from 'react'

interface SideNavProps {
  activeSection?: string
  onSectionClick?: (sectionId: string) => void
}

export function SideNav({ activeSection, onSectionClick }: SideNavProps) {
  const [currentSection, setCurrentSection] = useState(activeSection || '')
  const [sections, setSections] = useState<{ id: string; label: string }[]>([])

  // Extract H1 headings from the page
  useEffect(() => {
    const extractH1Sections = () => {
      const h1Elements = document.querySelectorAll('.prose h1[id]')
      const extractedSections = Array.from(h1Elements).map((h1) => ({
        id: h1.getAttribute('id') || '',
        label: h1.textContent || '',
      }))
      setSections(extractedSections)
      
      // Set first section as active if none is set
      if (extractedSections.length > 0 && !currentSection) {
        setCurrentSection(extractedSections[0].id)
      }
    }

    // Wait for content to be rendered
    const timer = setTimeout(extractH1Sections, 200)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (sections.length === 0) return

    // Better intersection observer settings for accurate section detection
    const observerOptions = {
      root: null,
      rootMargin: '-100px 0px -66% 0px', // Top offset accounts for navbar, bottom gives priority to top sections
      threshold: [0, 0.25, 0.5, 0.75, 1], // Multiple thresholds for better detection
    }

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      // Find the entry with the highest intersection ratio that's actually intersecting
      const intersectingEntries = entries.filter(entry => entry.isIntersecting)
      
      if (intersectingEntries.length > 0) {
        // Sort by intersection ratio and position (prefer sections closer to top)
        intersectingEntries.sort((a, b) => {
          // If both have similar intersection ratios, prefer the one higher on page
          if (Math.abs(a.intersectionRatio - b.intersectionRatio) < 0.1) {
            return a.boundingClientRect.top - b.boundingClientRect.top
          }
          return b.intersectionRatio - a.intersectionRatio
        })
        
        const sectionId = intersectingEntries[0].target.getAttribute('id')
        if (sectionId) {
          setCurrentSection(sectionId)
        }
      }
    }

    const observer = new IntersectionObserver(observerCallback, observerOptions)

    // Small delay to ensure DOM is ready
    setTimeout(() => {
      sections.forEach((section) => {
        const element = document.getElementById(section.id)
        if (element) {
          observer.observe(element)
        }
      })
    }, 100)

    return () => {
      observer.disconnect()
    }
  }, [sections])

  useEffect(() => {
    if (activeSection) {
      setCurrentSection(activeSection)
    }
  }, [activeSection])

  const handleClick = (sectionId: string) => {
    setCurrentSection(sectionId)
    onSectionClick?.(sectionId)
    
    const element = document.getElementById(sectionId)
    if (element) {
      // Calculate offset to account for fixed header (adjust this value based on your header height)
      const headerOffset = 100 // Adjust this value to match your navbar height + desired spacing
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  if (sections.length === 0) {
    return null
  }

  return (
    <nav className="sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto filter-sidebar-scroll">
      <div className="pr-6">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
          Contents
        </h3>
        <ul className="space-y-2">
          {sections.map((section) => (
            <li key={section.id}>
              <button
                onClick={() => handleClick(section.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                  currentSection === section.id
                    ? 'bg-blue-50 text-blue-700 font-medium shadow-sm'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {section.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}

