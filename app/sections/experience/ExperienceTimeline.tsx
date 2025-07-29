'use client'

import React from 'react'
import { useParallax } from '@/app/hooks'

interface ExperienceTimelineProps {
  activeTimelineItem: string | null
  setActiveTimelineItem: (item: string | null) => void
}

export const ExperienceTimeline: React.FC<ExperienceTimelineProps> = ({ 
  activeTimelineItem, 
  setActiveTimelineItem 
}) => {
  const { getExperienceElementTransform, mousePosition, scrollY } = useParallax()

  const workExperiences = [
    {
      id: 'palantir',
      logo: '/images/logos/palantir.jpg',
      logoAlt: 'Palantir',
      companyUrl: 'https://www.palantir.com/',
      date: 'Jan 2025 - Present',
      company: 'Palantir Technologies',
      role: 'Deployment Strategist Intern',
      description: 'Building enterprise-scale AI solutions and deployment strategies for Fortune 500 companies, focusing on data integration and business transformation.',
      index: 2,
      delay: 1
    },
    {
      id: 'inselligence',
      logo: '/images/logos/inselligence.jpg',
      logoAlt: 'Inselligence',
      companyUrl: 'https://inselligence.com/',
      date: 'May 2024 - Aug 2024',
      company: 'Inselligence',
      role: 'Product Manager and Software Engineer Intern',
      description: 'Developed AI-powered revenue intelligence platform using LLM orchestration to transform fragmented sales data into actionable insights.',
      index: 3,
      delay: 2
    },
    {
      id: 'elion',
      logo: '/images/logos/elion.jpg',
      logoAlt: 'Elion Partners',
      companyUrl: 'https://elionpartners.com/',
      date: 'Jun 2023 - Aug 2023',
      company: 'Elion Partners',
      role: 'Data Science and Acquisitions Intern',
      description: 'Led data-driven acquisition analysis and due diligence processes, developing predictive models to evaluate investment opportunities.',
      index: 4,
      delay: 2
    },
    {
      id: 'elite-endoscopy',
      logo: '/images/logos/elite-endoscopy.jpg',
      logoAlt: 'Elite Endoscopy Services',
      companyUrl: 'https://www.eliteendoscopyservices.com/index.htm',
      date: 'Nov 2020 - Mar 2021',
      company: 'Elite Endoscopy Services',
      role: 'Revenue Operations Intern',
      description: 'Optimized revenue cycle management and streamlined billing processes for healthcare operations, improving collection efficiency and financial reporting.',
      index: 5,
      delay: 3
    }
  ]

  return (
    <div 
      className="rounded-lg border border-border bg-card p-6"
      style={getExperienceElementTransform(1, 1)}
    >
      <div className="relative">
        {/* Timeline line - base line always visible */}
        <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-border"></div>
        
        {/* Dynamic highlight segments - accurate content height alignment */}
        <div className="absolute left-6 top-6 w-0.5 flex flex-col">
          {/* Palantir segment - compact content */}
          <div className={`h-[9.5rem] w-full transition-all duration-300 ${activeTimelineItem === 'palantir' ? 'bg-gradient-to-b from-transparent via-cyan-400 to-transparent shadow-lg shadow-cyan-400/20' : 'bg-transparent'}`}></div>
          <div className="h-3"></div> {/* space-y-3 gap */}
          
          {/* Inselligence segment - compact content */}
          <div className={`h-[9.5rem] w-full transition-all duration-300 ${activeTimelineItem === 'inselligence' ? 'bg-gradient-to-b from-transparent via-cyan-400 to-transparent shadow-lg shadow-cyan-400/20' : 'bg-transparent'}`}></div>
          <div className="h-3"></div> {/* space-y-3 gap */}
          
          {/* Elion segment - compact content */}
          <div className={`h-[9.5rem] w-full transition-all duration-300 ${activeTimelineItem === 'elion' ? 'bg-gradient-to-b from-transparent via-cyan-400 to-transparent shadow-lg shadow-cyan-400/20' : 'bg-transparent'}`}></div>
          <div className="h-3"></div> {/* space-y-3 gap */}
          
          {/* Elite Endoscopy segment - compact content */}
          <div className={`h-[9.5rem] w-full transition-all duration-300 ${activeTimelineItem === 'elite-endoscopy' ? 'bg-gradient-to-b from-transparent via-cyan-400 to-transparent shadow-lg shadow-cyan-400/20' : 'bg-transparent'}`}></div>
        </div>
        
        <div className="space-y-3">
          {workExperiences.map((experience) => (
            <div 
              key={experience.id}
              data-timeline-item={experience.id}
              onMouseEnter={() => setActiveTimelineItem(experience.id)}
              className={`relative flex items-start gap-6 transition-all duration-300 cursor-pointer rounded-lg p-4 -m-4 hover:bg-accent/20 ${
                activeTimelineItem && activeTimelineItem !== experience.id 
                  ? 'opacity-40 scale-95 blur-[1px]' 
                  : 'opacity-100 scale-100 blur-0'
              } ${activeTimelineItem === experience.id ? 'bg-accent/10' : ''}`}
              style={getExperienceElementTransform(experience.index, experience.delay)}
            >
              <div className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-lg border-4 border-background overflow-hidden transition-all duration-300 transform ${
                activeTimelineItem === experience.id 
                  ? 'bg-cyan-400 shadow-lg shadow-cyan-400/30 scale-110' 
                  : experience.id === 'inselligence' ? 'bg-gray-900' : 'bg-white'
              }`}
                style={{
                  transform: `translate3d(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01 + Math.sin(scrollY * 0.005) * 1}px, 0) ${
                    activeTimelineItem === experience.id ? 'scale(1.1)' : 'scale(1)'
                  }`
                }}
              >
                {experience.companyUrl ? (
                  <a href={experience.companyUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-full h-full">
                    <img src={experience.logo} alt={experience.logoAlt} className="h-8 w-8 object-contain hover:scale-110 transition-transform" />
                  </a>
                ) : (
                  <img src={experience.logo} alt={experience.logoAlt} className="h-8 w-8 object-contain" />
                )}
              </div>
              <div className="flex-1 pt-1 max-w-lg">
                <div className="mb-1 text-sm text-muted-foreground">{experience.date}</div>
                <h3 className="mb-1 text-lg font-semibold text-foreground">{experience.company}</h3>
                <div className="text-sm text-muted-foreground">{experience.role}</div>
                <p className="mt-2 text-sm text-muted-foreground">{experience.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}