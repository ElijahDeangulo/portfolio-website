'use client'

import React from 'react'
import { useParallax } from '@/app/hooks'

interface PhilanthropyTimelineProps {
  activeTimelineItem: string | null
  setActiveTimelineItem: (item: string | null) => void
}

export const PhilanthropyTimeline: React.FC<PhilanthropyTimelineProps> = ({ 
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
          {/* A Special Miracle segment */}
          <div className={`h-[8.75rem] w-full transition-all duration-300 ${activeTimelineItem === 'asm' ? 'bg-gradient-to-b from-transparent via-cyan-400 to-transparent shadow-lg shadow-cyan-400/20' : 'bg-transparent'}`}></div>
          <div className="h-3"></div> {/* space-y-3 gap */}
          
          {/* Food Bank segment */}
          <div className={`h-[8rem] w-full transition-all duration-300 ${activeTimelineItem === 'food-bank' ? 'bg-gradient-to-b from-transparent via-cyan-400 to-transparent shadow-lg shadow-cyan-400/20' : 'bg-transparent'}`}></div>
        </div>
        
        <div className="space-y-3">
          {/* A Special Miracle */}
          <div 
            data-timeline-item="asm"
            onMouseEnter={() => setActiveTimelineItem('asm')}
            className={`relative flex items-start gap-6 transition-all duration-300 cursor-pointer rounded-lg p-4 -m-4 hover:bg-accent/20 ${
              activeTimelineItem && activeTimelineItem !== 'asm' 
                ? 'opacity-40 scale-95 blur-[1px]' 
                : 'opacity-100 scale-100 blur-0'
            } ${activeTimelineItem === 'asm' ? 'bg-accent/10' : ''}`}
            style={getExperienceElementTransform(2, 1)}
          >
            <div className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-lg border-4 border-background overflow-hidden transition-all duration-300 transform ${
              activeTimelineItem === 'asm' 
                ? 'bg-cyan-400 shadow-lg shadow-cyan-400/30 scale-110' 
                : 'bg-white'
            }`}
              style={{
                transform: `translate3d(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02 + Math.sin(scrollY * 0.01) * 2}px, 0) ${
                  activeTimelineItem === 'asm' ? 'scale(1.1)' : 'scale(1)'
                }`
              }}
            >
              <a href="https://aspecialmiracle.org/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-full h-full">
                <img src="/images/logos/asm.jpg" alt="A Special Miracle" className="h-8 w-8 object-contain hover:scale-110 transition-transform" />
              </a>
            </div>
            <div className="flex-1 pt-1">
              <div className="mb-1 text-sm text-muted-foreground">May 2017 - Present</div>
              <h3 className="mb-1 text-lg font-semibold text-foreground">A Special Miracle</h3>
              <div className="text-sm text-muted-foreground">Co-Founder · Full-time</div>
              <p className="mt-2 text-sm text-muted-foreground">
                Founded and operate a non-profit organization supporting families with children with Down Syndrome through community programs and resources.
              </p>
            </div>
          </div>

          {/* Bread of the Mighty Food Bank */}
          <div 
            data-timeline-item="food-bank"
            onMouseEnter={() => setActiveTimelineItem('food-bank')}
            className={`relative flex items-start gap-6 transition-all duration-300 cursor-pointer rounded-lg p-4 -m-4 hover:bg-accent/20 ${
              activeTimelineItem && activeTimelineItem !== 'food-bank' 
                ? 'opacity-40 scale-95 blur-[1px]' 
                : 'opacity-100 scale-100 blur-0'
            } ${activeTimelineItem === 'food-bank' ? 'bg-accent/10' : ''}`}
            style={getExperienceElementTransform(3, 2)}
          >
            <div className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-lg border-4 border-background overflow-hidden transition-all duration-300 transform ${
              activeTimelineItem === 'food-bank' 
                ? 'bg-cyan-400 shadow-lg shadow-cyan-400/30 scale-110' 
                : 'bg-white'
            }`}
              style={{
                transform: `translate3d(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02 + Math.sin(scrollY * 0.01) * 2}px, 0) ${
                  activeTimelineItem === 'food-bank' ? 'scale(1.1)' : 'scale(1)'
                }`
              }}
            >
              <a href="https://breadofthemighty.org/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-full h-full">
                <img src="/images/logos/food-bank.jpg" alt="Bread of the Mighty Food Bank" className="h-8 w-8 object-contain hover:scale-110 transition-transform" />
              </a>
            </div>
            <div className="flex-1 pt-1">
              <div className="mb-1 text-sm text-muted-foreground">Dec 2022 - Mar 2023</div>
              <h3 className="mb-1 text-lg font-semibold text-foreground">Bread of the Mighty Food Bank</h3>
              <div className="text-sm text-muted-foreground">Food Drive Operations Manager</div>
              <p className="mt-2 text-sm text-muted-foreground">
                Coordinated large-scale food distribution operations and managed volunteer teams to address food insecurity in underserved communities.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}