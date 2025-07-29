'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, useMotionValue, PanInfo } from 'framer-motion'

interface FeaturedProjectsCarouselProps {
  mousePosition: { x: number; y: number }
  getSectionTransform: (speed: number) => React.CSSProperties
  onProjectClick?: (projectId: string) => void
}

export const FeaturedProjectsCarousel = ({ 
  mousePosition, 
  getSectionTransform,
  onProjectClick
}: FeaturedProjectsCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [progressWidth, setProgressWidth] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)
  const dragX = useMotionValue(0)
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)
  
  // Project data
  const projects = [
    {
      id: 1,
      projectId: 'ar-automation',
      logo: '/images/logos/palantir.jpg',
      title: 'AR Automation Platform',
      description: 'End-to-end accounts receivable automation using multi-agent LLM orchestration, RAG techniques, and real-time payment processing.',
      briefDescription: 'AI-powered system using LLM orchestration and RAG techniques to automate accounts receivable, reducing manual work by 85%.',
      tags: ['PySpark', 'LLM', 'RAG', 'Foundry', 'TypeScript'],
      gradient: 'from-blue-500/20 to-cyan-500/20',
      accentColor: 'text-cyan-400',
      shadowColor: 'shadow-cyan-500/20'
    },
    {
      id: 2,
      projectId: 'pricing-intelligence',
      logo: '/images/logos/palantir.jpg',
      title: 'Pricing Intelligence Platform',
      description: 'Bayesian optimization models with demand curve simulation and real-time anomaly detection driving $10M+ revenue impact.',
      briefDescription: 'ML platform using Bayesian optimization and demand simulation to optimize pricing strategies, driving $10M+ revenue impact.',
      tags: ['Bayesian Optimization', 'Python', 'Real-time Analytics', 'ML Models'],
      gradient: 'from-orange-500/20 to-red-500/20',
      accentColor: 'text-orange-400',
      shadowColor: 'shadow-orange-500/20'
    },
    {
      id: 3,
      projectId: 'special-miracle',
      logo: '/images/logos/asm.jpg',
      title: 'Non-Profit Organization',
      description: 'Founded a non-profit organization focused on community impact and social good initiatives.',
      briefDescription: 'Non-profit supporting families with children with Down Syndrome through community resources, educational programs, and advocacy.',
      tags: ['Leadership', 'Non-Profit', 'Community Impact'],
      gradient: 'from-purple-500/20 to-pink-500/20',
      accentColor: 'text-purple-400',
      shadowColor: 'shadow-purple-500/20',
      link: 'https://aspecialmiracle.org'
    },
    {
      id: 4,
      projectId: 'revenue-intelligence',
      logo: '/images/logos/inselligence.jpg',
      title: 'Revenue Intelligence Suite',
      description: 'ML-driven sales forecasting and CRM optimization platform improving pipeline hygiene and customer engagement.',
      briefDescription: 'Sales intelligence platform using ML to predict revenue trends, optimize CRM processes, and enhance customer engagement.',
      tags: ['ML Forecasting', 'CRM', 'Python', 'API Integration'],
      gradient: 'from-emerald-500/20 to-green-500/20',
      accentColor: 'text-emerald-400',
      shadowColor: 'shadow-emerald-500/20'
    }
  ]

  // Helper function to get current project colors
  const getCurrentProjectColors = () => {
    const currentProject = projects[currentIndex]
    
    const colorMap: Record<string, { from: string; to: string; shadow: string }> = {
      'text-cyan-400': { from: 'rgb(34, 211, 238)', to: 'rgb(6, 182, 212)', shadow: 'rgba(34, 211, 238, 0.4)' },
      'text-emerald-400': { from: 'rgb(52, 211, 153)', to: 'rgb(16, 185, 129)', shadow: 'rgba(52, 211, 153, 0.4)' },
      'text-purple-400': { from: 'rgb(196, 181, 253)', to: 'rgb(168, 85, 247)', shadow: 'rgba(196, 181, 253, 0.4)' },
      'text-orange-400': { from: 'rgb(251, 146, 60)', to: 'rgb(249, 115, 22)', shadow: 'rgba(251, 146, 60, 0.4)' }
    }
    
    return colorMap[currentProject.accentColor as keyof typeof colorMap] || colorMap['text-cyan-400']
  }

  // Intersection Observer for intelligent triggering
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0.3 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  // Auto-advance carousel when visible with progress bar
  useEffect(() => {
    if (isVisible && !isDragging) {
      let progressValue = 0
      
      const startInterval = () => {
        progressIntervalRef.current = setInterval(() => {
          progressValue += 1
          setProgressWidth(progressValue)
          
          if (progressValue >= 100) {
            progressValue = 0
            setProgressWidth(0)
            setCurrentIndex((prev) => (prev + 1) % projects.length)
          }
        }, 50) // Update every 50ms for smooth progress
      }
      
      startInterval()
      
      return () => {
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current)
        }
      }
    } else {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
      setProgressWidth(0)
    }
  }, [isVisible, isDragging, currentIndex, projects.length])

  const getProjectTransform = (index: number) => {
    const offset = index - currentIndex
    const baseX = offset * 100
    
    // Safety checks to prevent NaN values
    const safeDragValue = isNaN(dragX.get()) ? 0 : dragX.get()
    const safeWindowWidth = window.innerWidth || 1024 // Fallback width
    const dragOffset = isDragging ? (safeDragValue / safeWindowWidth) * 100 : 0
    const finalX = baseX + dragOffset

    // Safety checks for opacity and scale calculations
    const absOffset = Math.abs(offset)
    const safeOpacity = absOffset <= 1 ? Math.max(0, 1 - absOffset * 0.3) : 0
    const safeScale = absOffset <= 1 ? Math.max(0.1, 1 - absOffset * 0.1) : 0.8

    return {
      x: `${isNaN(finalX) ? baseX : finalX}%`,
      opacity: isNaN(safeOpacity) ? 1 : safeOpacity,
      scale: isNaN(safeScale) ? 1 : safeScale,
    }
  }

  const handleDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 50
    if (Math.abs(info.offset.x) > threshold) {
      if (info.offset.x > 0 && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1)
      } else if (info.offset.x < 0 && currentIndex < projects.length - 1) {
        setCurrentIndex(currentIndex + 1)
      }
    }
    setIsDragging(false)
  }

  const currentColors = getCurrentProjectColors()

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen flex items-center py-32 overflow-hidden"
      style={getSectionTransform(0.5)}
    >
      {/* Background Gradient - Dynamic based on current project */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          background: `radial-gradient(ellipse at center, ${currentColors.from}10 0%, transparent 50%)`
        }}
      />
      
      {/* Content Container */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
              Featured Projects
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A showcase of my recent work combining AI/ML, full-stack development, and data engineering
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative h-[500px] overflow-hidden rounded-2xl">
          {/* Project Cards */}
          <div className="absolute inset-0 flex items-center">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                className="absolute inset-0 cursor-grab active:cursor-grabbing"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.1}
                onDragStart={() => setIsDragging(true)}
                onDragEnd={handleDrag}
                animate={getProjectTransform(index)}
                transition={{ 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 30,
                  opacity: { duration: 0.3 },
                  scale: { duration: 0.3 }
                }}
                style={{
                  willChange: 'transform, opacity',
                  backfaceVisibility: 'hidden'
                }}
              >
                <div 
                  className={`h-full w-full rounded-2xl bg-gradient-to-br ${project.gradient} border border-border/50 backdrop-blur-sm p-8 flex flex-col justify-between ${project.shadowColor} shadow-2xl`}
                  onClick={() => onProjectClick?.(project.projectId)}
                >
                  {/* Project Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <img 
                        src={project.logo} 
                        alt={project.title}
                        className="w-12 h-12 rounded-lg object-contain bg-white/10 backdrop-blur-sm p-2"
                      />
                      <div>
                        <h3 className={`text-2xl font-bold ${project.accentColor} mb-1`}>
                          {project.title}
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          Project {project.id} of {projects.length}
                        </p>
                      </div>
                    </div>
                    <button className="p-2 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors">
                      <svg className="w-5 h-5 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </button>
                  </div>

                  {/* Project Description */}
                  <div className="flex-1">
                    <p className="text-foreground/90 text-lg leading-relaxed mb-6">
                      {project.briefDescription}
                    </p>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag, tagIndex) => (
                        <span 
                          key={tagIndex}
                          className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-sm font-medium text-foreground/80 border border-white/20"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Navigation Dots */}
        <div className="flex justify-center items-center gap-3 mt-8">
          {projects.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`relative h-2 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'w-8 bg-primary' 
                  : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
              }`}
            >
              {index === currentIndex && (
                <div 
                  className="absolute inset-0 bg-gradient-to-r from-primary to-primary/60 rounded-full origin-left transition-all duration-75"
                  style={{ width: `${progressWidth}%` }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Navigation Arrows */}
        <div className="absolute top-1/2 left-4 right-4 flex justify-between pointer-events-none">
          <button
            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
            className="p-3 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 text-foreground hover:bg-background/90 disabled:opacity-50 disabled:cursor-not-allowed pointer-events-auto transition-all duration-200 hover:scale-110"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => setCurrentIndex(Math.min(projects.length - 1, currentIndex + 1))}
            disabled={currentIndex === projects.length - 1}
            className="p-3 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 text-foreground hover:bg-background/90 disabled:opacity-50 disabled:cursor-not-allowed pointer-events-auto transition-all duration-200 hover:scale-110"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}

export default FeaturedProjectsCarousel 