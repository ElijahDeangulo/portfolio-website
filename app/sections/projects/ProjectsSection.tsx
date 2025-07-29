'use client'

import React from 'react'
import { FeaturedProjectsCarousel } from '@/app/components/FeaturedProjectsCarousel'

interface ProjectsSectionProps {
  onProjectClick?: (projectId: string) => void
  mousePosition: { x: number; y: number }
  getSectionTransform: (speed: number) => any
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ onProjectClick, mousePosition, getSectionTransform }) => {
  return (
    <section id="featured-projects" className="py-16 scroll-mt-24">
      <div className="relative">
        {/* Anchor point for better scrolling */}
        <div id="projects-anchor" className="absolute -top-24 left-0 w-1 h-1 opacity-0 pointer-events-none" />
        <FeaturedProjectsCarousel 
          onProjectClick={onProjectClick}
          mousePosition={mousePosition}
          getSectionTransform={getSectionTransform}
        />
      </div>
    </section>
  )
}