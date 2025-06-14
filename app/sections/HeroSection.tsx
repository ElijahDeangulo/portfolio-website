'use client'

import React from 'react'
import { TypingAnimation } from '../components/TypingAnimation'
import { FloatingElements } from '../components/FloatingElements'

interface HeroSectionProps {
  scrollToSection: (sectionId: string) => void
  setActiveSection: (section: string) => void
  handleDownloadClick: () => void
  isDownloading: boolean
  downloadComplete: boolean
  setShowSkillsModal: (show: boolean) => void
  getHeroElementTransform: (direction: 'left' | 'right' | 'up' | 'down', speed: number) => React.CSSProperties
}

export const HeroSection = ({
  scrollToSection,
  setActiveSection,
  handleDownloadClick,
  isDownloading,
  downloadComplete,
  setShowSkillsModal,
  getHeroElementTransform
}: HeroSectionProps) => {
  return (
    <section className="relative min-h-screen flex items-center py-32 overflow-hidden">
      <FloatingElements section="hero" />
      
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column - Main Content */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Main Heading */}
            <div 
              className="space-y-6"
              style={getHeroElementTransform('left', 1)}
            >
              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
                  <span className="block text-foreground">Hi, I'm</span>
                  <span className="block bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent">
                    Elijah DeAngulo
                  </span>
                </h1>
                <div className="text-xl md:text-2xl text-muted-foreground h-8">
                  <TypingAnimation 
                    texts={[
                      "Full-Stack Developer",
                      "AI/ML Engineer", 
                      "Data Scientist",
                      "Problem Solver"
                    ]}
                    speed={100}
                    deleteSpeed={50}
                    pauseTime={2000}
                  />
                </div>
              </div>

              <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
                I'm a passionate technologist specializing in AI/ML, full-stack development, and data engineering. 
                Currently working at <span className="text-primary font-medium">Palantir Technologies</span> as a 
                Deployment Strategist Intern, building intelligent systems that solve complex real-world problems.
              </p>
            </div>

            {/* Action Buttons */}
            <div 
              className="flex flex-col sm:flex-row gap-4"
              style={getHeroElementTransform('left', 0.8)}
            >
              <div className="flex gap-3">
                <button 
                  onClick={handleDownloadClick}
                  disabled={isDownloading}
                  className={`group relative overflow-hidden rounded-lg px-6 py-3 text-sm font-medium transition-all duration-300 ${
                    downloadComplete 
                      ? 'bg-green-500 text-white shadow-lg shadow-green-500/25' 
                      : isDownloading 
                        ? 'bg-primary/70 text-primary-foreground cursor-not-allowed' 
                        : 'bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 hover:shadow-lg hover:shadow-primary/25'
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/20 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-600" />
                  <div className="relative flex items-center gap-2">
                    {downloadComplete ? (
                      <>✅ Downloaded!</>
                    ) : isDownloading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Preparing...
                      </>
                    ) : (
                      <>📄 Resume</>
                    )}
                  </div>
                </button>

                <button 
                  onClick={() => setActiveSection('contact')}
                  className="group relative overflow-hidden rounded-lg border border-border bg-background px-6 py-3 text-sm font-medium transition-all duration-300 hover:bg-accent hover:scale-105 hover:shadow-lg"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/0 to-primary/10 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-600" />
                  <div className="relative">💬 Let's Talk</div>
                </button>
              </div>
              
              {/* Social Links */}
              <div className="flex items-center gap-2">
                <a 
                  href="https://www.linkedin.com/in/elijah-deangulo-a26306175" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="group flex items-center justify-center px-3 py-2 rounded-lg border border-border bg-background transition-all duration-300 hover:bg-blue-500 hover:border-blue-500 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/25"
                >
                  <svg className="h-4 w-4 text-blue-600 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a 
                  href="https://github.com/ElijahDeangulo" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="group flex items-center justify-center px-3 py-2 rounded-lg border border-border bg-background transition-all duration-300 hover:bg-gray-900 hover:border-gray-900 hover:scale-110 hover:shadow-lg hover:shadow-gray-900/25"
                >
                  <svg className="h-4 w-4 text-gray-700 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/>
                  </svg>
                </a>
                <a 
                  href="mailto:ejdeangulo@gmail.com" 
                  className="group flex items-center justify-center px-3 py-2 rounded-lg border border-border bg-background transition-all duration-300 hover:bg-red-500 hover:border-red-500 hover:scale-110 hover:shadow-lg hover:shadow-red-500/25"
                >
                  <svg className="h-4 w-4 text-red-600 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-.904.732-1.636 1.636-1.636h.075L12 13.267 22.289 3.821h.075A1.636 1.636 0 0 1 24 5.457z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column - Profile & Tech Stack */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Profile Image Card */}
            <div 
              className="group relative overflow-hidden rounded bg-card/30 backdrop-blur-sm border border-border/50 p-0 transition-all duration-300"
              style={getHeroElementTransform('right', 1.2)}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <img 
                  src="/images/profile.jpg" 
                  alt="Elijah DeAngulo" 
                  className="w-full rounded-md object-cover shadow-sm transition-transform duration-500 group-hover:scale-105"
                  style={{ aspectRatio: '3/5', objectPosition: 'center 13%', height: '290px', overflow: 'hidden', transform: 'scale(0.95)' }}
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=320&h=400&fit=crop&crop=face"
                  }}
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </div>

            {/* Current Status Card */}
            <div 
              className="rounded-lg bg-card/50 backdrop-blur-sm border border-border/50 p-3"
              style={getHeroElementTransform('right', 0.8)}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-sm font-medium text-foreground">Currently at</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <img src="/images/logos/palantir.jpg" alt="Palantir" className="h-8 w-8 rounded-lg object-contain bg-white p-1" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">Palantir Technologies</div>
                  <div className="text-xs text-muted-foreground">Deployment Strategist Intern</div>
                </div>
              </div>
            </div>

            {/* Tech Stack Preview */}
            <div 
              className="rounded-lg bg-card/50 backdrop-blur-sm border border-border/50 p-3"
              style={getHeroElementTransform('right', 0.6)}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-foreground">Core Technologies</h3>
                <button
                  onClick={() => setShowSkillsModal(true)}
                  className="group flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-all duration-300"
                >
                  <span className="text-xs">View More</span>
                  <svg className="h-3 w-3 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { name: 'Python', icon: '🐍' },
                  { name: 'AI/ML', icon: '🧠' },
                  { name: 'React', icon: '⚛️' },
                  { name: 'SQL', icon: '🗃️' },
                  { name: 'AWS', icon: '☁️' },
                  { name: 'PySpark', icon: '⭐' },
                  { name: 'TS', icon: '🟦' },
                  { name: 'Git', icon: '🌿' }
                ].map((tech, index) => (
                  <div 
                    key={tech.name}
                    className="group flex flex-col items-center gap-1 p-2 rounded-lg bg-background/50 border border-border/50 transition-all duration-300 hover:scale-110 hover:bg-accent/20"
                    style={{
                      animationDelay: `${index * 100}ms`
                    }}
                  >
                    <div className="text-lg">
                      {tech.icon}
                    </div>
                    <div className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">{tech.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 