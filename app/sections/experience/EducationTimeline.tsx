'use client'

import React from 'react'
import { useParallax } from '@/app/hooks'

interface EducationTimelineProps {
  activeTimelineItem: string | null
  setActiveTimelineItem: (item: string | null) => void
}

export const EducationTimeline: React.FC<EducationTimelineProps> = ({ 
  activeTimelineItem, 
  setActiveTimelineItem 
}) => {
  const { getExperienceElementTransform, mousePosition, scrollY } = useParallax()

  return (
    <div 
      className="rounded-lg border border-border bg-card p-6"
      style={getExperienceElementTransform(1, 1)}
    >
      <div className="relative">
        {/* Timeline line - base line always visible */}
        <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-border"></div>
        
        {/* Dynamic highlight segments - full content height alignment */}
        <div className="absolute left-6 top-6 w-0.5 flex flex-col">
          {/* UF Masters segment - compact content */}
          <div className={`h-[9.5rem] w-full transition-all duration-300 ${activeTimelineItem === 'uf-masters' ? 'bg-gradient-to-b from-transparent via-cyan-400 to-transparent shadow-lg shadow-cyan-400/20' : 'bg-transparent'}`}></div>
          <div className="h-3"></div> {/* space-y-3 gap */}
          
          {/* UF Bachelors segment - compact content */}
          <div className={`h-[9.5rem] w-full transition-all duration-300 ${activeTimelineItem === 'uf-bachelors' ? 'bg-gradient-to-b from-transparent via-cyan-400 to-transparent shadow-lg shadow-cyan-400/20' : 'bg-transparent'}`}></div>
        </div>
        
        <div className="space-y-3">
          {/* Master's Degree */}
          <div 
            data-timeline-item="uf-masters"
            onMouseEnter={() => setActiveTimelineItem('uf-masters')}
            className={`relative flex items-start gap-6 transition-all duration-300 cursor-pointer rounded-lg p-4 -m-4 hover:bg-accent/20 ${
              activeTimelineItem && activeTimelineItem !== 'uf-masters' 
                ? 'opacity-40 scale-95 blur-[1px]' 
                : 'opacity-100 scale-100 blur-0'
            } ${activeTimelineItem === 'uf-masters' ? 'bg-accent/10' : ''}`}
            style={getExperienceElementTransform(2, 1)}
          >
            <div className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-lg border-4 border-background overflow-hidden transition-all duration-300 transform ${
              activeTimelineItem === 'uf-masters' 
                ? 'bg-cyan-400 shadow-lg shadow-cyan-400/30 scale-110' 
                : 'bg-white'
            }`}
              style={{
                transform: `translate3d(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02 + Math.sin(scrollY * 0.01) * 2}px, 0) ${
                  activeTimelineItem === 'uf-masters' ? 'scale(1.1)' : 'scale(1)'
                }`
              }}
            >
              <a href="https://warrington.ufl.edu/master-business-analytics/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-full h-full">
                <img src="/images/logos/uf.jpg" alt="University of Florida" className="h-8 w-8 object-contain hover:scale-110 transition-transform" />
              </a>
            </div>
            <div className="flex-1 pt-1">
              <div className="mb-1 text-sm text-muted-foreground">Expected Graduation: Dec 2025</div>
              <h3 className="mb-1 text-lg font-semibold text-foreground">University of Florida, Hough College of Business</h3>
              <div className="mb-3 text-sm text-muted-foreground">Master of Science in Business Analytics</div>
              <div className="mb-3 text-sm font-medium text-foreground">GPA: 4.0 (Dean's List)</div>
            </div>
          </div>

          {/* Bachelor's Degree */}
          <div 
            data-timeline-item="uf-bachelors"
            onMouseEnter={() => setActiveTimelineItem('uf-bachelors')}
            className={`relative flex items-start gap-6 transition-all duration-300 cursor-pointer rounded-lg p-4 -m-4 hover:bg-accent/20 ${
              activeTimelineItem && activeTimelineItem !== 'uf-bachelors' 
                ? 'opacity-40 scale-95 blur-[1px]' 
                : 'opacity-100 scale-100 blur-0'
            } ${activeTimelineItem === 'uf-bachelors' ? 'bg-accent/10' : ''}`}
            style={getExperienceElementTransform(3, 2)}
          >
            <div className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-lg border-4 border-background overflow-hidden transition-all duration-300 transform ${
              activeTimelineItem === 'uf-bachelors' 
                ? 'bg-cyan-400 shadow-lg shadow-cyan-400/30 scale-110' 
                : 'bg-white'
            }`}
              style={{
                transform: `translate3d(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02 + Math.sin(scrollY * 0.01) * 2}px, 0) ${
                  activeTimelineItem === 'uf-bachelors' ? 'scale(1.1)' : 'scale(1)'
                }`
              }}
            >
              <a href="https://warrington.ufl.edu/undergraduate-academics/information-systems/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-full h-full">
                <img src="/images/logos/uf-warrington.jpg" alt="UF Warrington College" className="h-8 w-8 object-contain hover:scale-110 transition-transform" />
              </a>
            </div>
            <div className="flex-1 pt-1">
              <div className="mb-1 text-sm text-muted-foreground">Graduated: May 2024</div>
              <h3 className="mb-1 text-lg font-semibold text-foreground">University of Florida, Warrington College of Business</h3>
              <div className="mb-3 text-sm text-muted-foreground">Bachelor of Science in Business Administration - Information Systems Operations Management</div>
              <div className="mb-3 text-sm font-medium text-foreground">
                GPA: 3.81 / ISM: 3.97<br/>
                <span className="text-muted-foreground">Minor: Economics, Artificial Intelligence Fundamentals and Applications – Certificate</span>
              </div>
              <ul className="space-y-2 text-sm text-foreground">
                <li>• <strong>Clubs:</strong> Product Space – (PM Fellowship for product strategy & innovation)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}