import React from 'react'
import { GlassmorphismHeroSection } from '../../../components/shared/GlassmorphismHeroSection'

interface HeroSectionProps {
  title?: string
  date?: string
  author?: string
}

export function HeroSection({ title = 'DQ Associate Owned Asset Guidelines', date = 'Version 1.8 • December 19, 2025', author = 'HRA' }: HeroSectionProps) {
  return (
    <GlassmorphismHeroSection
      title={title}
      date={date}
      author={author}
    />
  )
}


