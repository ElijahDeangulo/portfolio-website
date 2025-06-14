'use client'

import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'

// Import all components and hooks
import {
  ModernThemeToggle,
  CustomCursor,
  HybridMusicPlayer,
  FeaturedProjectsCarousel,
  SkillsModal
} from './components'
import { HeroSection } from './sections'
import { useDarkMode, useParallax } from './hooks'

export default function Home() {
  // Theme and client state
  const { isDark, toggleDarkMode, isClient } = useDarkMode()
  
  // Parallax effects
  const { 
    scrollY, 
    mousePosition, 
    getSectionTransform,
    getHeroElementTransform,
    getFeaturedProjectsFadeTransform
  } = useParallax()

  // Portal containers
  const [musicPlayerContainer, setMusicPlayerContainer] = useState<Element | null>(null)
  const [themeToggleContainer, setThemeToggleContainer] = useState<Element | null>(null)

  // Component state
  const [activeSection, setActiveSection] = useState('home')
  const [isSpotifyExpanded, setIsSpotifyExpanded] = useState(false)
  const [showSkillsModal, setShowSkillsModal] = useState(false)
  const [selectedSkillCategory, setSelectedSkillCategory] = useState('all')
  
  // Download state
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadComplete, setDownloadComplete] = useState(false)
  const [showDownloadConfirm, setShowDownloadConfirm] = useState(false)

  // Portal setup
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const musicContainer = document.getElementById('music-player-portal')
      const themeContainer = document.getElementById('theme-toggle-portal')
      
      setMusicPlayerContainer(musicContainer)
      setThemeToggleContainer(themeContainer)
    }
  }, [])

  // Scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'featured-projects']
      const currentSection = sections.find(section => {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          return rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2
        }
        return false
      })
      
      if (currentSection) {
        setActiveSection(currentSection)
      }
    }

    const throttledScroll = () => {
      if (typeof requestAnimationFrame !== 'undefined') {
        requestAnimationFrame(handleScroll)
      } else {
        handleScroll()
      }
    }

    window.addEventListener('scroll', throttledScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', throttledScroll)
  }, [])

  // Utility functions
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const offsetTop = element.offsetTop - 100
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      })
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleAboutClick = () => {
    scrollToSection('featured-projects')
  }

  const handleContactClick = () => {
    scrollToSection('featured-projects')
  }

  const handleProjectClick = (projectId: string) => {
    console.log('Project clicked:', projectId)
  }

  // Download functionality
  const handleDownloadClick = () => {
    setShowDownloadConfirm(true)
  }

  const confirmDownload = async () => {
    setShowDownloadConfirm(false)
    setIsDownloading(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const link = document.createElement('a')
      link.href = '/Elijah_DeAngulo_Resume.pdf'
      link.download = 'Elijah_DeAngulo_Resume.pdf'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      setDownloadComplete(true)
      setTimeout(() => setDownloadComplete(false), 3000)
    } catch (error) {
      console.error('Download failed:', error)
    } finally {
      setIsDownloading(false)
    }
  }

  const cancelDownload = () => {
    setShowDownloadConfirm(false)
  }

  if (!isClient) {
    return <div className="min-h-screen bg-background animate-pulse" />
  }

  return (
    <div>
      {/* Fixed positioned elements */}
      <CustomCursor />
      
      {/* Portal containers */}
      <div id="music-player-portal" />
      <div id="theme-toggle-portal" />
      
      {/* Music Player Portal */}
      {musicPlayerContainer && createPortal(
        <HybridMusicPlayer 
          playlistId="37i9dQZF1DZ06evO3qQrNm"
          youtubeVideoId="5i8W1z9zkE0"
          youtubeStartTime="5448"
          onExpandedChange={setIsSpotifyExpanded}
        />,
        musicPlayerContainer
      )}

      {/* Theme Toggle Portal */}
      {themeToggleContainer && createPortal(
        <ModernThemeToggle 
          isDark={isDark} 
          toggleDarkMode={toggleDarkMode} 
          isClient={isClient} 
          isSpotifyExpanded={isSpotifyExpanded} 
        />,
        themeToggleContainer
      )}
      
      <div className="min-h-screen bg-background font-sans antialiased">
        
        {/* Navigation */}
        <header className="sticky top-0 z-[9999] backdrop-blur-sm transition-all duration-500" style={{
          background: (scrollY > 100 || activeSection !== 'home') ? 'linear-gradient(to bottom, hsl(var(--background) / 0.9) 0%, hsl(var(--background) / 0.7) 50%, hsl(var(--background) / 0.3) 80%, transparent 100%)' : 'transparent',
          transform: (scrollY > 100 || activeSection !== 'home') ? 'translateY(0)' : 'translateY(-100%)',
          opacity: (scrollY > 100 || activeSection !== 'home') ? 1 : 0,
        }}>
          <div className="mx-auto flex max-w-3xl flex-col px-8">
            <nav className="flex items-center justify-between py-6">
              <ul className="flex items-center space-x-8">
                <li><button onClick={scrollToTop} className="text-sm transition-colors hover:text-foreground/80 text-muted-foreground hover:text-foreground">Home</button></li>
                <li><button onClick={() => scrollToSection('featured-projects')} className="text-sm transition-colors hover:text-foreground text-muted-foreground hover:text-foreground">Projects</button></li>
                <li><button onClick={handleAboutClick} className="text-sm transition-colors hover:text-foreground text-muted-foreground hover:text-foreground">About</button></li>
                <li><button onClick={handleContactClick} className="text-sm transition-colors hover:text-foreground text-muted-foreground hover:text-foreground">Contact</button></li>
              </ul>
            </nav>
          </div>
        </header>

        <div className="mx-auto max-w-5xl px-6">
          
          {/* Hero Section */}
          <section id="home">
            <HeroSection
              scrollToSection={scrollToSection}
              setActiveSection={setActiveSection}
              handleDownloadClick={handleDownloadClick}
              isDownloading={isDownloading}
              downloadComplete={downloadComplete}
              setShowSkillsModal={setShowSkillsModal}
              getHeroElementTransform={getHeroElementTransform}
            />
          </section>

          {/* Featured Projects Carousel */}
          <section id="featured-projects" style={getFeaturedProjectsFadeTransform()}>
            <FeaturedProjectsCarousel 
              mousePosition={mousePosition}
              getSectionTransform={getSectionTransform}
              onProjectClick={handleProjectClick}
            />
          </section>

        </div>

        {/* Skills Modal */}
        {showSkillsModal && (
          <SkillsModal
            isOpen={showSkillsModal}
            onClose={() => setShowSkillsModal(false)}
            selectedSkillCategory={selectedSkillCategory}
            setSelectedSkillCategory={setSelectedSkillCategory}
          />
        )}

        {/* Download Confirmation Modal */}
        {showDownloadConfirm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-background border border-border rounded-2xl p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold mb-3">Download Resume</h3>
              <p className="text-muted-foreground mb-6">
                This will download my latest resume (PDF format).
              </p>
              <div className="flex gap-3">
                <button
                  onClick={confirmDownload}
                  className="flex-1 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Download
                </button>
                <button
                  onClick={cancelDownload}
                  className="flex-1 border border-border px-4 py-2 rounded-lg hover:bg-accent transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 