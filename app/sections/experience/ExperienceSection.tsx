'use client'

import React, { useState } from 'react'
import { useParallax } from '@/app/hooks'
import { ExperienceTimeline } from './ExperienceTimeline'
import { EducationTimeline } from './EducationTimeline'
import { PhilanthropyTimeline } from './PhilanthropyTimeline'

export const ExperienceSection = () => {
  const { getExperienceSectionPushTransform } = useParallax()
  const [activeTab, setActiveTab] = useState<'work' | 'education' | 'philanthropy'>('work')
  const [activeTimelineItem, setActiveTimelineItem] = useState<string | null>('palantir')

  return (
    <section 
      className="relative py-8 hero-transition"
      data-section="experience"
      style={{ 
        ...getExperienceSectionPushTransform(),
        background: `linear-gradient(135deg, 
          hsl(var(--card))/80 0%, 
          hsl(var(--background))/90 100%)`,
        backfaceVisibility: 'hidden',
        transformStyle: 'preserve-3d',
      }}
    >
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-[3rem] md:text-[4rem] font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Experience & Impact
          </h2>
          
          {/* Tab Switcher */}
          <div className="flex gap-2 p-1 bg-background/50 backdrop-blur-sm rounded-full border border-border/50">
            <button
              onClick={() => setActiveTab('work')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeTab === 'work' 
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Work
            </button>
            <button
              onClick={() => setActiveTab('education')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeTab === 'education' 
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Education
            </button>
            <button
              onClick={() => setActiveTab('philanthropy')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeTab === 'philanthropy' 
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Philanthropy
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="relative">
          {activeTab === 'work' && (
            <ExperienceTimeline 
              activeTimelineItem={activeTimelineItem}
              setActiveTimelineItem={setActiveTimelineItem}
            />
          )}
          {activeTab === 'education' && (
            <EducationTimeline 
              activeTimelineItem={activeTimelineItem}
              setActiveTimelineItem={setActiveTimelineItem}
            />
          )}
          {activeTab === 'philanthropy' && (
            <PhilanthropyTimeline 
              activeTimelineItem={activeTimelineItem}
              setActiveTimelineItem={setActiveTimelineItem}
            />
          )}
        </div>
      </div>
    </section>
  )
}