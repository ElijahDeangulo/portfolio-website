'use client'

import React, { useState, useEffect, useRef } from 'react'

// Enhanced Professional Custom Cursor Component
const CustomCursor = () => {
  const [cursorType, setCursorType] = useState('default')
  const [isHovering, setIsHovering] = useState(false)
  const [isPressed, setIsPressed] = useState(false)
  const [targetPosition, setTargetPosition] = useState({ x: 0, y: 0 })
  const [isClient, setIsClient] = useState(false)
  const [isMobile, setIsMobile] = useState(true)
  
  const cursorRef = useRef<HTMLDivElement>(null)
  const trailRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number | null>(null)
  
  // Use refs to avoid stale closures in the animation loop
  const mousePositionRef = useRef({ x: 0, y: 0 })
  const targetPositionRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    // Only run on client and detect mobile
    setIsClient(true)
    setIsMobile(/Mobi|Android/i.test(navigator.userAgent) || window.innerWidth < 768)
    
    if (/Mobi|Android/i.test(navigator.userAgent) || window.innerWidth < 768) {
      return
    }

    const updateMousePosition = (e: MouseEvent) => {
      const x = e.clientX
      const y = e.clientY
      
      mousePositionRef.current = { x, y }
      targetPositionRef.current = { x, y }
      setTargetPosition({ x, y })
    }

    const handleMouseEnter = (e: Event) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'BUTTON' || target.classList.contains('btn')) {
        setCursorType('button')
        setIsHovering(true)
      } else if (target.tagName === 'A' || target.classList.contains('link')) {
        setCursorType('link')
        setIsHovering(true)
      } else if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        setCursorType('input')
        setIsHovering(true)
      } else if (target.style.cursor === 'pointer' || window.getComputedStyle(target).cursor === 'pointer') {
        setCursorType('hover')
        setIsHovering(true)
      }
    }

    const handleMouseLeave = () => {
      setCursorType('default')
      setIsHovering(false)
    }

    const handleMouseDown = () => setIsPressed(true)
    const handleMouseUp = () => setIsPressed(false)

    const addEventListeners = () => {
      const interactiveElements = document.querySelectorAll('button, a, input, textarea, [role="button"], .btn, .link')
      const elementsArray = Array.from(interactiveElements)
      
      elementsArray.forEach(element => {
        element.addEventListener('mouseenter', handleMouseEnter)
        element.addEventListener('mouseleave', handleMouseLeave)
      })
      
      return elementsArray
    }

    const animateCursor = () => {
      if (cursorRef.current && trailRef.current && dotRef.current) {
        const cursor = cursorRef.current
        const trail = trailRef.current
        const dot = dotRef.current
        
        // Dot follows mouse immediately for snappy feel
        dot.style.transform = `translate3d(${targetPositionRef.current.x}px, ${targetPositionRef.current.y}px, 0) translate(-50%, -50%)`
        
        // Main cursor ring has slight lag for smooth effect
        const currentX = parseFloat(cursor.dataset.x || '0') || targetPositionRef.current.x
        const currentY = parseFloat(cursor.dataset.y || '0') || targetPositionRef.current.y
        
        // Use higher interpolation for very close distances for snappier feel
        const distanceX = Math.abs(targetPositionRef.current.x - currentX)
        const distanceY = Math.abs(targetPositionRef.current.y - currentY)
        const interpolationSpeed = (distanceX < 5 && distanceY < 5) ? 0.6 : 0.35
        
        const newX = currentX + (targetPositionRef.current.x - currentX) * interpolationSpeed
        const newY = currentY + (targetPositionRef.current.y - currentY) * interpolationSpeed
        
        cursor.style.transform = `translate3d(${newX}px, ${newY}px, 0) translate(-50%, -50%)`
        cursor.dataset.x = newX.toString()
        cursor.dataset.y = newY.toString()
        
        // Trail follows with more lag
        const trailX = parseFloat(trail.dataset.x || '0') || mousePositionRef.current.x
        const trailY = parseFloat(trail.dataset.y || '0') || mousePositionRef.current.y
        
        const newTrailX = trailX + (mousePositionRef.current.x - trailX) * 0.22
        const newTrailY = trailY + (mousePositionRef.current.y - trailY) * 0.22
        
        trail.style.transform = `translate3d(${newTrailX}px, ${newTrailY}px, 0) translate(-50%, -50%)`
        trail.dataset.x = newTrailX.toString()
        trail.dataset.y = newTrailY.toString()
      }
      
      animationRef.current = requestAnimationFrame(animateCursor)
    }

    // Add event listeners
    document.addEventListener('mousemove', updateMousePosition)
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mouseup', handleMouseUp)

    let currentElements = addEventListeners()
    animationRef.current = requestAnimationFrame(animateCursor)

    // Observe DOM changes
    const observer = new MutationObserver(() => {
      currentElements.forEach(element => {
        element.removeEventListener('mouseenter', handleMouseEnter)
        element.removeEventListener('mouseleave', handleMouseLeave)
      })
      currentElements = addEventListeners()
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true
    })

    return () => {
      document.removeEventListener('mousemove', updateMousePosition)
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mouseup', handleMouseUp)
      currentElements.forEach(element => {
        element.removeEventListener('mouseenter', handleMouseEnter)
        element.removeEventListener('mouseleave', handleMouseLeave)
      })
      observer.disconnect()
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  // Don't render anything until we're on the client to prevent hydration issues
  if (!isClient || isMobile) {
    return null
  }

  return (
    <>
      {/* Main Cursor */}
      <div
        ref={cursorRef}
        className={`custom-cursor custom-cursor--${cursorType} ${isHovering ? 'custom-cursor--hovering' : ''} ${isPressed ? 'custom-cursor--pressed' : ''}`}
      />
      
      {/* Trailing Effect */}
      <div
        ref={trailRef}
        className="custom-cursor-trail"
      />
      
      {/* Cursor Dot */}
      <div
        ref={dotRef}
        className={`custom-cursor-dot custom-cursor-dot--${cursorType} ${isHovering ? 'custom-cursor-dot--hovering' : ''} ${isPressed ? 'custom-cursor-dot--pressed' : ''}`}
      />
    </>
  )
}

// Typing Animation Component
const TypingAnimation = ({ texts, speed = 100, deleteSpeed = 50, pauseTime = 2000 }: {
  texts: string[]
  speed?: number
  deleteSpeed?: number
  pauseTime?: number
}) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [currentText, setCurrentText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    const targetText = texts[currentTextIndex]
    
    if (isPaused) {
      const pauseTimer = setTimeout(() => {
        setIsPaused(false)
        setIsDeleting(true)
      }, pauseTime)
      return () => clearTimeout(pauseTimer)
    }

    const timer = setTimeout(() => {
      if (!isDeleting) {
        // Typing
        if (currentText.length < targetText.length) {
          setCurrentText(targetText.slice(0, currentText.length + 1))
        } else {
          setIsPaused(true)
        }
      } else {
        // Deleting
        if (currentText.length > 0) {
          setCurrentText(currentText.slice(0, -1))
        } else {
          setIsDeleting(false)
          setCurrentTextIndex((prev) => (prev + 1) % texts.length)
        }
      }
    }, isDeleting ? deleteSpeed : speed)

    return () => clearTimeout(timer)
  }, [currentText, currentTextIndex, isDeleting, isPaused, texts, speed, deleteSpeed, pauseTime])

  return (
    <span className="typing-text">
      {currentText}
      <span className="typing-cursor">|</span>
    </span>
  )
}

// Dark Mode Hook
const useDarkMode = () => {
  const [isDark, setIsDark] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    
    const stored = localStorage.getItem('darkMode')
    const initialDark = stored === 'true' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)
    setIsDark(initialDark)
    document.documentElement.classList.toggle('dark', initialDark)
  }, [])

  const toggleDarkMode = () => {
    const newDark = !isDark
    setIsDark(newDark)
    localStorage.setItem('darkMode', newDark.toString())
    document.documentElement.classList.toggle('dark', newDark)
  }

  return { isDark, toggleDarkMode, isClient }
}

// Parallax Hook
const useParallax = () => {
  const [scrollY, setScrollY] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20
      const y = (e.clientY / window.innerHeight - 0.5) * 20
      setMousePosition({ x, y })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  // Calculate parallax transforms for sections
  const getSectionTransform = (speed: number) => {
    return `translate3d(0, ${scrollY * speed}px, 0)`
  }

  const getElementTransform = (speed: number, mouseMultiplier: number = 1) => {
    const scrollOffset = scrollY * speed
    const mouseX = mousePosition.x * mouseMultiplier
    const mouseY = mousePosition.y * mouseMultiplier
    return `translate3d(${mouseX}px, ${-scrollOffset + mouseY}px, 0)`
  }

  return { scrollY, mousePosition, getSectionTransform, getElementTransform }
}

// Floating Background Elements Component
const FloatingElements = ({ section }: { section: string }) => {
  const { scrollY, mousePosition, getElementTransform } = useParallax()
  
  if (section === 'hero') {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-400/8 to-purple-400/8 rounded-full blur-xl"
          style={{ transform: getElementTransform(0.1, 0.5) }}
        />
        <div 
          className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-green-400/8 to-cyan-400/8 rounded-full blur-lg"
          style={{ transform: getElementTransform(0.2, -0.3) }}
        />
        <div 
          className="absolute bottom-20 left-1/4 w-40 h-40 bg-gradient-to-br from-purple-400/8 to-pink-400/8 rounded-full blur-2xl"
          style={{ transform: getElementTransform(0.15, 0.4) }}
        />
      </div>
    )
  }

  if (section === 'experience') {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-20 right-1/4 w-28 h-28 bg-gradient-to-br from-cyan-400/8 to-blue-400/8 rounded-full blur-xl"
          style={{ transform: getElementTransform(0.15, 0.3) }}
        />
        <div 
          className="absolute bottom-10 left-1/3 w-32 h-32 bg-gradient-to-br from-purple-400/8 to-pink-400/8 rounded-full blur-2xl"
          style={{ transform: getElementTransform(0.1, -0.2) }}
        />
      </div>
    )
  }

  if (section === 'projects') {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-0 left-1/4 w-20 h-20 bg-gradient-to-br from-orange-400/8 to-red-400/8 rounded-full blur-lg"
          style={{ transform: getElementTransform(0.4, 0.2) }}
        />
        <div 
          className="absolute bottom-10 right-1/3 w-16 h-16 bg-gradient-to-br from-teal-400/8 to-green-400/8 rounded-full blur-lg"
          style={{ transform: getElementTransform(0.35, -0.2) }}
        />
      </div>
    )
  }

  if (section === 'contact') {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-20 right-10 w-12 h-12 bg-gradient-to-br from-blue-400/8 to-cyan-400/8 rounded-full blur-lg"
          style={{ transform: getElementTransform(0.3, 0.3) }}
        />
        <div 
          className="absolute bottom-10 left-10 w-16 h-16 bg-gradient-to-br from-purple-400/8 to-pink-400/8 rounded-full blur-xl"
          style={{ transform: getElementTransform(0.05, -0.2) }}
        />
      </div>
    )
  }

  return null
}

export default function Home() {
  // Add gradient animation styles
  React.useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      @keyframes gradient-shift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      
      @keyframes sparkle {
        0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
        50% { opacity: 1; transform: scale(1) rotate(180deg); }
      }
    `
    document.head.appendChild(style)
    return () => {
      document.head.removeChild(style)
    }
  }, [])
  const [activeSection, setActiveSection] = useState('home')
  const [activeTab, setActiveTab] = useState('work')
  const [activeTimelineItem, setActiveTimelineItem] = useState<string | null>('palantir')

  const { isDark, toggleDarkMode, isClient } = useDarkMode()
  const { scrollY, mousePosition, getSectionTransform, getElementTransform } = useParallax()
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadComplete, setDownloadComplete] = useState(false)
  const [showDownloadConfirm, setShowDownloadConfirm] = useState(false)
  
  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState('')

  // Simple hover-based highlighting + light scroll detection
  useEffect(() => {
    const handleScroll = () => {
      // Only run scroll detection if we're in the experience section and no hover is happening
      const timelineItems = document.querySelectorAll('[data-timeline-item]')
      if (timelineItems.length === 0) return

      const viewportCenter = window.innerHeight / 2
      let closestItem = null
      let closestDistance = Infinity

      timelineItems.forEach((item) => {
        const rect = item.getBoundingClientRect()
        const itemCenter = rect.top + rect.height / 2
        const distance = Math.abs(viewportCenter - itemCenter)

        if (distance < closestDistance && rect.top < viewportCenter && rect.bottom > viewportCenter) {
          closestDistance = distance
          closestItem = item.getAttribute('data-timeline-item')
        }
      })

      if (closestItem) {
        setActiveTimelineItem(closestItem)
      }
    }

    // Light throttling - only check every 100ms
    let ticking = false
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', throttledScroll)
    return () => window.removeEventListener('scroll', throttledScroll)
  }, [activeTab])

  const handleDownloadClick = () => {
    setShowDownloadConfirm(true)
  }

  const confirmDownload = async () => {
    setShowDownloadConfirm(false)
    setIsDownloading(true)
    setDownloadComplete(false)
    
    // Simulate download preparation
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Create a mock PDF download (replace with your actual resume file)
    const link = document.createElement('a')
    link.href = '/resume.pdf' // You'll need to add your actual resume file to the public folder
    link.download = 'Elijah_DeAngulo_Resume.pdf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    setIsDownloading(false)
    setDownloadComplete(true)
    
    // Reset success state after 3 seconds
    setTimeout(() => setDownloadComplete(false), 3000)
  }

  const cancelDownload = () => {
    setShowDownloadConfirm(false)
  }

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError('')
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactForm),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong. Please try again.')
      }
      
      setSubmitSuccess(true)
      setContactForm({ name: '', email: '', message: '' })
      
      // Reset success state after 5 seconds
      setTimeout(() => setSubmitSuccess(false), 5000)
      
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setContactForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <CustomCursor />
      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-background/75 backdrop-blur-sm">
        <div className="mx-auto flex max-w-3xl flex-col px-8">
          <nav className="flex items-center justify-between py-6">
            <ul className="flex items-center space-x-8">
              <li><button onClick={() => setActiveSection('home')} className={`text-sm transition-colors hover:text-foreground/80 ${activeSection === 'home' ? 'text-foreground' : 'text-muted-foreground'}`}>Home</button></li>
              <li><button onClick={() => setActiveSection('projects')} className={`text-sm transition-colors hover:text-foreground ${activeSection === 'projects' ? 'text-foreground' : 'text-muted-foreground'}`}>Projects</button></li>
              <li><button onClick={() => setActiveSection('blog')} className={`text-sm transition-colors hover:text-foreground ${activeSection === 'blog' ? 'text-foreground' : 'text-muted-foreground'}`}>Blog</button></li>
              <li><button onClick={() => setActiveSection('contact')} className={`text-sm transition-colors hover:text-foreground ${activeSection === 'contact' ? 'text-foreground' : 'text-muted-foreground'}`}>Contact</button></li>
        </ul>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleDownloadClick}
                disabled={isDownloading}
                className={`inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-all duration-300 ${
                  downloadComplete 
                    ? 'bg-green-500 text-white' 
                    : isDownloading 
                      ? 'bg-primary/70 text-primary-foreground cursor-not-allowed' 
                      : 'bg-primary text-primary-foreground hover:bg-primary/90'
                }`}
              >
                {downloadComplete ? (
                  <>✅</>
                ) : isDownloading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  </>
                ) : (
                  <>📄</>
                )}
              </button>
              {isClient && (
                <button 
                  onClick={toggleDarkMode}
                  className="rounded-md border border-border bg-background p-2 text-sm transition-all duration-300 hover:bg-accent hover:text-accent-foreground"
                  title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  {isDark ? '☀️' : '🌙'}
                </button>
              )}
            </div>
          </nav>
        </div>
      </header>

            <div className="mx-auto max-w-5xl px-6">
        
        {/* Home Section */}
        {activeSection === 'home' && (
          <div>
        {/* Hero Section */}
        <section 
          className="relative py-6 overflow-hidden"
          style={{ transform: getSectionTransform(-0.02) }}
        >
          <FloatingElements section="hero" />
          
          {/* Background Grid Pattern */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
                               radial-gradient(circle at 75% 75%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)`,
            }} />
          </div>

          <div className="relative z-10">
            {/* Main Content Grid */}
            <div className="grid gap-4 lg:grid-cols-12 lg:gap-6 items-center">
              
              {/* Left Column - Main Content */}
              <div className="lg:col-span-7 space-y-4">
                
                {/* Intro Card */}
                <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-sm border border-border/50 p-4 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/10">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-sm text-muted-foreground">Actively looking for internships for Fall 2025</span>
                    </div>
                                        <h1 
                      className="mb-3 text-2xl font-bold tracking-tight lg:text-4xl bg-gradient-to-r from-slate-500 via-cyan-300 via-cyan-500 via-blue-400 to-slate-600 bg-clip-text text-transparent"
                      style={{
                        backgroundSize: '300% 300%',
                        animation: 'gradient-shift 4s ease infinite'
                      }}
                    >
                      Hi, I'm Elijah Deangulo
                    </h1>
                    <div className="mb-3 text-base text-muted-foreground">
                      <TypingAnimation 
                        texts={[
                          "AI/ML Engineer building intelligent systems",
                          "Data Scientist transforming insights into impact", 
                          "Software engineer developing enterprise-grade solutions",
                          "Graduate student mastering business analytics"
                        ]}
                        speed={80}
                        deleteSpeed={40}
                        pauseTime={2500}
                      />
                    </div>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 sm:grid-cols-3">
                  <div 
                    className="group relative overflow-hidden rounded-lg bg-card/60 backdrop-blur-sm border border-border/50 p-3 transition-all duration-300 hover:scale-105 hover:bg-accent/20"
                    style={{
                      transform: `translate3d(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px, 0)`
                    }}
                  >
                    <div className="text-lg font-bold text-primary mb-1">4.0</div>
                    <div className="text-xs text-muted-foreground">Current Grad GPA</div>
                    <div className="absolute top-1 right-1 opacity-50 group-hover:opacity-100 transition-opacity">
                      <div className="text-sm transition-transform group-hover:scale-110 group-hover:rotate-6">🐊</div>
                    </div>
                  </div>
                  
                  <div 
                    className="group relative overflow-hidden rounded-lg bg-card/60 backdrop-blur-sm border border-border/50 p-3 transition-all duration-300 hover:scale-105 hover:bg-accent/20"
                    style={{
                      transform: `translate3d(${mousePosition.x * 0.015}px, ${mousePosition.y * 0.015}px, 0)`
                    }}
                  >
                    <div className="text-lg font-bold text-primary mb-1">Florida</div>
                    <div className="text-xs text-muted-foreground">Ft. Lauderdale</div>
                    <div className="absolute top-1 right-1 text-lg opacity-50">🌴</div>
                  </div>
                  
                  <div 
                    className="group relative overflow-hidden rounded-lg bg-card/60 backdrop-blur-sm border border-border/50 p-3 transition-all duration-300 hover:scale-105 hover:bg-accent/20"
                    style={{
                      transform: `translate3d(${mousePosition.x * 0.008}px, ${mousePosition.y * 0.008}px, 0)`
                    }}
                  >
                    <div className="text-lg font-bold text-primary mb-1">4+</div>
                    <div className="text-xs text-muted-foreground">Years Experience</div>
                    <div className="absolute top-1 right-1 text-lg opacity-50">⚡</div>
                  </div>
                </div>

                {/* Description Card */}
                <div className="rounded-lg bg-card/30 backdrop-blur-sm border border-border/50 p-3">
                  <div className="space-y-4 text-muted-foreground">
                    <p className="leading-relaxed">
                      Currently pursuing my <strong className="text-foreground">MS in Business Analytics at UF</strong> while interning as a <strong className="text-foreground">Deployment Strategist at Palantir</strong>. I specialize in building AI-powered solutions that drive measurable business impact.
                    </p>
                    <p className="leading-relaxed">
                      My passion lies at the intersection of <strong className="text-foreground">machine learning, fintech innovation,</strong> and <strong className="text-foreground">scalable data platforms</strong> — transforming complex data into actionable insights that matter.
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
                  <div className="flex gap-4">
                    <button 
                      onClick={handleDownloadClick}
                      disabled={isDownloading}
                      className={`group relative overflow-hidden rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300 ${
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
                      className="group relative overflow-hidden rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium transition-all duration-300 hover:bg-accent hover:scale-105 hover:shadow-lg"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/0 to-primary/10 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-600" />
                      <div className="relative">💬 Let's Talk</div>
                    </button>
                  </div>
                  
                  {/* Social Links */}
                  <div className="flex items-center gap-3">
                    <a href="https://www.linkedin.com/in/elijah-deangulo-a26306175" target="_blank" rel="noopener noreferrer" className="group flex items-center justify-center px-5 py-2.5 rounded-lg border border-border bg-background transition-all duration-300 hover:bg-blue-500 hover:border-blue-500 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/25">
                      <svg className="h-4 w-4 text-blue-600 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </a>
                    <a href="https://github.com/ElijahDeangulo" target="_blank" rel="noopener noreferrer" className="group flex items-center justify-center px-5 py-2.5 rounded-lg border border-border bg-background transition-all duration-300 hover:bg-gray-900 hover:border-gray-900 hover:scale-110 hover:shadow-lg hover:shadow-gray-900/25">
                      <svg className="h-4 w-4 text-gray-700 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/>
                      </svg>
                    </a>
                    <a href="mailto:ejdeangulo@gmail.com" className="group flex items-center justify-center px-5 py-2.5 rounded-lg border border-border bg-background transition-all duration-300 hover:bg-red-500 hover:border-red-500 hover:scale-110 hover:shadow-lg hover:shadow-red-500/25">
                      <svg className="h-4 w-4 text-red-600 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-.904.732-1.636 1.636-1.636h.075L12 13.267 22.289 3.821h.075A1.636 1.636 0 0 1 24 5.457z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>

              {/* Right Column - Profile & Tech Stack */}
              <div className="lg:col-span-5 space-y-0.5">
                
                {/* Profile Image Card */}
                <div 
                  className="group relative overflow-hidden rounded bg-card/30 backdrop-blur-sm border border-border/50 p-0.5 transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10">
                    <img 
                      src="/images/profile.jpg" 
                      alt="Elijah DeAngulo" 
                      className="w-full rounded-md object-cover shadow-sm transition-transform duration-500 group-hover:scale-105"
                      style={{ aspectRatio: '2/3', objectPosition: 'center 13%', height: '320px', overflow: 'hidden', transform: 'scale(0.85)' }}
                      onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=320&h=400&fit=crop&crop=face"
                      }}
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                </div>

                {/* Current Status Card */}
                <div className="rounded-lg bg-card/50 backdrop-blur-sm border border-border/50 p-3">
                                    <div className="flex items-center gap-3 mb-3">
                    <div className="h-3 w-3 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-sm font-medium text-foreground">Currently at</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      <img src="/images/logos/palantir.jpg" alt="Palantir" className="h-10 w-10 rounded-lg object-contain bg-white p-2" />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">Palantir Technologies</div>
                      <div className="text-sm text-muted-foreground">Deployment Strategist Intern</div>
                    </div>
                  </div>
                </div>

                                 {/* Tech Stack Preview */}
                 <div className="rounded-lg bg-card/50 backdrop-blur-sm border border-border/50 p-3">
                   <h3 className="text-sm font-medium text-foreground mb-3">Core Technologies</h3>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 <div className="grid grid-cols-4 gap-3">
                     {[
                       { 
                         name: 'Python', 
                         icon: (
                           <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                             <path d="M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.77l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.17l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05-.05-1.23.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.24-.01h.16l.06.01h8.16v-.83H6.18l-.01-2.75-.02-.37.05-.34.11-.31.17-.28.25-.26.31-.23.38-.2.44-.18.51-.15.58-.12.64-.1.71-.06.77-.04.84-.02 1.27.05zm-6.3 1.98l-.23.33-.08.41.08.41.23.34.33.22.41.09.41-.09.33-.22.23-.34.08-.41-.08-.41-.23-.33-.33-.22-.41-.09-.41.09zm13.09 3.95l.28.06.32.12.35.18.36.27.36.35.35.47.32.59.28.73.21.88.14 1.04.05 1.23-.06 1.23-.16 1.04-.24.86-.32.71-.36.57-.4.45-.42.33-.42.24-.4.16-.36.09-.32.05-.24.02-.16-.01h-8.22v.82h5.84l.01 2.76.02.36-.05.34-.11.31-.17.29-.25.25-.31.24-.38.2-.44.17-.51.15-.58.13-.64.09-.71.07-.77.04-.84.01-1.27-.04-1.07-.14-.9-.2-.73-.25-.59-.3-.45-.33-.34-.34-.25-.34-.16-.33-.1-.3-.04-.25-.02-.2.01-.13v-5.34l.05-.64.13-.54.21-.46.26-.38.3-.32.33-.24.35-.2.35-.14.33-.1.3-.06.26-.04.21-.02.13-.01h5.84l.69-.05.59-.14.5-.21.41-.28.33-.32.27-.35.2-.36.15-.36.1-.35.07-.32.04-.28.02-.21V6.07h2.09l.14.01zm-6.47 14.25l-.23.33-.08.41.08.41.23.33.33.23.41.08.41-.08.33-.23.23-.33.08-.41-.08-.41-.23-.33-.33-.23-.41-.08-.41.08z"/>
                           </svg>
                         )
                       },
                       { 
                         name: 'AI/ML', 
                         icon: (
                           <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                             <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2M12 18L10.91 14.26L4 13.5L10.91 12.74L12 6L13.09 12.74L20 13.5L13.09 14.26L12 18M12 12C13.66 12 15 10.66 15 9S13.66 6 12 6 9 7.34 9 9 10.34 12 12 12Z"/>
                           </svg>
                         )
                       },
                       { 
                         name: 'React', 
                         icon: (
                           <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                             <path d="M12 10.11C13.03 10.11 13.87 10.95 13.87 12C13.87 13.05 13.03 13.89 12 13.89C10.97 13.89 10.13 13.05 10.13 12C10.13 10.95 10.97 10.11 12 10.11M7.37 20C8.18 19.81 9.17 19.59 10.29 19.37C10.95 20.87 11.7 21.81 12 21.81C12.3 21.81 13.05 20.87 13.71 19.37C14.83 19.59 15.82 19.81 16.63 20C17.78 20.31 18.25 20.16 18.46 19.95C18.67 19.74 18.52 19.27 18.21 18.12C17.88 16.85 17.39 15.38 16.79 13.81C18.15 13.05 19.23 12.19 19.92 11.34C20.73 10.35 20.73 9.65 20.73 9.65S20.73 8.95 19.92 7.96C19.23 7.11 18.15 6.25 16.79 5.49C17.39 3.92 17.88 2.45 18.21 1.18C18.52 0.03 18.67 -0.44 18.46 -0.65C18.25 -0.86 17.78 -1.01 16.63 -0.7C15.82 -0.49 14.83 -0.27 13.71 -0.05C13.05 -1.55 12.3 -2.49 12 -2.49C11.7 -2.49 10.95 -1.55 10.29 -0.05C9.17 -0.27 8.18 -0.49 7.37 -0.7C6.22 -1.01 5.75 -0.86 5.54 -0.65C5.33 -0.44 5.48 0.03 5.79 1.18C6.12 2.45 6.61 3.92 7.21 5.49C5.85 6.25 4.77 7.11 4.08 7.96C3.27 8.95 3.27 9.65 3.27 9.65S3.27 10.35 4.08 11.34C4.77 12.19 5.85 13.05 7.21 13.81C6.61 15.38 6.12 16.85 5.79 18.12C5.48 19.27 5.33 19.74 5.54 19.95C5.75 20.16 6.22 20.31 7.37 20M9.08 17.81C9.67 16.85 10.26 15.73 10.82 14.5C11.18 14.5 11.59 14.5 12 14.5C12.41 14.5 12.82 14.5 13.18 14.5C13.74 15.73 14.33 16.85 14.92 17.81C14.19 17.94 13.42 18.06 12.62 18.15C12.41 18.18 12.21 18.2 12 18.2C11.79 18.2 11.59 18.18 11.38 18.15C10.58 18.06 9.81 17.94 9.08 17.81M14.92 6.19C14.33 7.15 13.74 8.27 13.18 9.5C12.82 9.5 12.41 9.5 12 9.5C11.59 9.5 11.18 9.5 10.82 9.5C10.26 8.27 9.67 7.15 9.08 6.19C9.81 6.06 10.58 5.94 11.38 5.85C11.59 5.82 11.79 5.8 12 5.8C12.21 5.8 12.41 5.82 12.62 5.85C13.42 5.94 14.19 6.06 14.92 6.19M16.5 13.5C17.73 13.93 18.83 14.38 19.65 14.84C20.39 15.26 20.73 15.63 20.73 15.63S20.39 15.99 19.65 16.41C18.83 16.87 17.73 17.32 16.5 17.75C16.09 16.61 15.61 15.36 15.08 14.03C15.23 13.85 15.37 13.68 15.5 13.5M7.5 13.5C7.63 13.68 7.77 13.85 7.92 14.03C7.39 15.36 6.91 16.61 6.5 17.75C5.27 17.32 4.17 16.87 3.35 16.41C2.61 15.99 2.27 15.63 2.27 15.63S2.61 15.26 3.35 14.84C4.17 14.38 5.27 13.93 6.5 13.5H7.5M16.5 10.5C17.73 10.07 18.83 9.62 19.65 9.16C20.39 8.74 20.73 8.37 20.73 8.37S20.39 8.01 19.65 7.59C18.83 7.13 17.73 6.68 16.5 6.25C16.91 7.39 17.39 8.64 17.92 9.97C17.77 10.15 17.63 10.32 17.5 10.5H16.5M7.5 10.5C7.37 10.32 7.23 10.15 7.08 9.97C7.61 8.64 8.09 7.39 8.5 6.25C5.27 6.68 4.17 7.13 3.35 7.59C2.61 8.01 2.27 8.37 2.27 8.37S2.61 8.74 3.35 9.16C4.17 9.62 5.27 10.07 6.5 10.5H7.5Z"/>
                           </svg>
                         )
                       },
                       { 
                         name: 'SQL', 
                         icon: (
                           <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                             <path d="M12 3C7.58 3 4 4.79 4 7C4 9.21 7.58 11 12 11S20 9.21 20 7C20 4.79 16.42 3 12 3M4 9V12C4 14.21 7.58 16 12 16S20 14.21 20 12V9C20 11.21 16.42 13 12 13S4 11.21 4 9M4 14V17C4 19.21 7.58 21 12 21S20 19.21 20 17V14C20 16.21 16.42 18 12 18S4 16.21 4 14Z"/>
                           </svg>
                         )
                       },
                       { 
                         name: 'AWS', 
                         icon: (
                           <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                             <path d="M6.5 14.5V16H3V14.5C3 13.12 4.12 12 5.5 12S8 13.12 8 14.5M12 3V7H9V3C9 1.62 10.12 0.5 11.5 0.5S14 1.62 14 3M17.5 12C18.88 12 20 13.12 20 14.5V16H16.5V14.5C16.5 13.12 17.62 12 19 12H17.5M3 18H21V20H3V18M6 8H18V10H6V8M9 14H15V16H9V14Z"/>
                           </svg>
                         )
                       },
                       { 
                         name: 'Spark', 
                         icon: (
                           <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                             <path d="M8.5,7L10.5,1L11.5,2L12.5,1L14.5,7H8.5M12,8A1,1 0 0,1 13,9A1,1 0 0,1 12,10A1,1 0 0,1 11,9A1,1 0 0,1 12,8M8.75,11.25L12,12L15.25,11.25L16,21H8L8.75,11.25M10,13V19H11V13H10M13,13V19H14V13H13Z"/>
                           </svg>
                         )
                       },
                       { 
                         name: 'TS', 
                         icon: (
                           <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                             <path d="M3,3H21V21H3V3M13.71,17.86C14.21,18.84 15.22,19.59 16.8,19.59C18.4,19.59 19.6,18.76 19.6,17.23C19.6,15.82 18.79,15.19 17.35,14.57L16.93,14.39C16.2,14.08 15.89,13.87 15.89,13.37C15.89,12.96 16.2,12.64 16.7,12.64C17.18,12.64 17.5,12.85 17.79,13.37L19.1,12.5C18.55,11.54 17.77,11.17 16.7,11.17C15.19,11.17 14.22,12.13 14.22,13.4C14.22,14.78 15.03,15.43 16.25,15.95L16.67,16.13C17.45,16.47 17.91,16.68 17.91,17.26C17.91,17.74 17.46,18.09 16.76,18.09C15.93,18.09 15.45,17.66 15.09,17.06L13.71,17.86M13,11.25H8V12.75H9.5V20H11.25V12.75H13V11.25Z"/>
                           </svg>
                         )
                       },
                       { 
                         name: 'Git', 
                         icon: (
                           <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                             <path d="M2.6,10.59L8.38,4.8L10.07,6.5C9.83,7.35 10.22,8.28 11,8.73V14.27C10.4,14.61 10,15.26 10,16A2,2 0 0,0 12,18A2,2 0 0,0 14,16C14,15.26 13.6,14.61 13,14.27V9.41L15.07,11.5C15,11.65 15,11.82 15,12A2,2 0 0,0 17,14A2,2 0 0,0 19,12A2,2 0 0,0 17,10C16.82,10 16.65,10 16.5,10.07L13.93,7.5C14.19,6.57 13.71,5.55 12.78,5.16C11.85,4.77 10.83,5.25 10.44,6.18C10.05,7.11 10.53,8.13 11.46,8.52L8.4,11.58C7.57,11.58 6.8,12.18 6.61,13C6.42,13.83 6.84,14.7 7.65,15.05C8.46,15.4 9.4,15.05 9.75,14.24C10.1,13.43 9.75,12.5 8.94,12.15L2.6,10.59Z"/>
                           </svg>
                         )
                       }
                     ].map((tech, index) => (
                       <div 
                         key={tech.name}
                         className="group flex flex-col items-center gap-2 p-2 rounded-lg bg-background/50 border border-border/50 transition-all duration-300 hover:scale-110 hover:bg-accent/20"
                         style={{
                           animationDelay: `${index * 100}ms`,
                           transform: `translate3d(${mousePosition.x * 0.005}px, ${mousePosition.y * 0.005}px, 0)`
                         }}
                       >
                         <div className="text-muted-foreground group-hover:text-primary transition-colors">
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

              {/* Work/Education Tabs */}
        <section 
          className="relative py-8"
          style={{ transform: getSectionTransform(0.01) }}
        >
          <FloatingElements section="experience" />
          <div className="max-w-2xl mx-auto">
          <div className="mb-6 rounded-lg border border-border bg-card">
            <div className="flex">
            <button 
                className={`flex-1 rounded-l-lg px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'work' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-background text-muted-foreground hover:text-foreground'
                }`}
              onClick={() => {
                setActiveTab('work')
                setActiveTimelineItem('palantir')
              }}
            >
              Work
            </button>
            <button 
                className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'education' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-background text-muted-foreground hover:text-foreground'
                }`}
              onClick={() => {
                setActiveTab('education')
                setActiveTimelineItem('uf-masters')
              }}
            >
              Education
            </button>
              <button 
                className={`flex-1 rounded-r-lg px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'philanthropy' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-background text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => {
                  setActiveTab('philanthropy')
                  setActiveTimelineItem('asm')
                }}
              >
                Philanthropy
              </button>
            </div>
          </div>

          {/* Work Experience */}
          {activeTab === 'work' && (
            <div className="rounded-lg border border-border bg-card p-6">
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
                  {/* Palantir */}
                  <div 
                    data-timeline-item="palantir"
                    onMouseEnter={() => setActiveTimelineItem('palantir')}
                    className={`relative flex items-start gap-6 transition-all duration-300 cursor-pointer rounded-lg p-4 -m-4 hover:bg-accent/20 ${
                      activeTimelineItem && activeTimelineItem !== 'palantir' 
                        ? 'opacity-40 scale-95 blur-[1px]' 
                        : 'opacity-100 scale-100 blur-0'
                    } ${activeTimelineItem === 'palantir' ? 'bg-accent/10' : ''}`}
                  >
                    <div className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-lg border-4 border-background overflow-hidden transition-all duration-300 transform ${
                      activeTimelineItem === 'palantir' 
                        ? 'bg-cyan-400 shadow-lg shadow-cyan-400/30 scale-110' 
                        : 'bg-white'
                    }`}
                      style={{
                        transform: `translate3d(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01 + Math.sin(scrollY * 0.005) * 1}px, 0) ${
                          activeTimelineItem === 'palantir' ? 'scale(1.1)' : 'scale(1)'
                        }`
                      }}
                    >
                      <a href="https://www.palantir.com/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-full h-full">
                        <img src="/images/logos/palantir.jpg" alt="Palantir" className="h-8 w-8 object-contain hover:scale-110 transition-transform" />
                      </a>
                    </div>
                    <div className="flex-1 pt-1 max-w-lg">
                      <div className="mb-1 text-sm text-muted-foreground">Jan 2025 - Present</div>
                      <h3 className="mb-1 text-lg font-semibold text-foreground">Palantir</h3>
                      <div className="text-sm text-muted-foreground">Deployment Strategist Intern</div>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Building enterprise-scale AI solutions and deployment strategies for Fortune 500 companies, focusing on data integration and business transformation.
                      </p>
                    </div>
                  </div>

                  {/* Inselligence */}
                  <div 
                    data-timeline-item="inselligence"
                    onMouseEnter={() => setActiveTimelineItem('inselligence')}
                    className={`relative flex items-start gap-6 transition-all duration-300 cursor-pointer rounded-lg p-4 -m-4 hover:bg-accent/20 ${
                      activeTimelineItem && activeTimelineItem !== 'inselligence' 
                        ? 'opacity-40 scale-95 blur-[1px]' 
                        : 'opacity-100 scale-100 blur-0'
                    } ${activeTimelineItem === 'inselligence' ? 'bg-accent/10' : ''}`}
                  >
                    <div className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-lg border-4 border-background overflow-hidden transition-all duration-300 transform ${
                      activeTimelineItem === 'inselligence' 
                        ? 'bg-cyan-400 shadow-lg shadow-cyan-400/30 scale-110' 
                        : 'bg-gray-900'
                    }`}
                      style={{
                        transform: `translate3d(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02 + Math.sin(scrollY * 0.01) * 2}px, 0) ${
                          activeTimelineItem === 'inselligence' ? 'scale(1.1)' : 'scale(1)'
                        }`
                      }}
                    >
                      <a href="https://inselligence.com/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-full h-full">
                        <img src="/images/logos/inselligence.jpg" alt="Inselligence" className="h-8 w-8 object-contain hover:scale-110 transition-transform" />
                      </a>
                    </div>
                    <div className="flex-1 pt-1 max-w-lg">
                      <div className="mb-1 text-sm text-muted-foreground">May 2024 - Aug 2024</div>
                      <h3 className="mb-1 text-lg font-semibold text-foreground">Inselligence (Revenue Intelligence)</h3>
                      <div className="text-sm text-muted-foreground">Product Manager and Data Analyst Intern</div>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Developed AI-powered revenue intelligence platform using LLM orchestration to transform fragmented sales data into actionable insights.
                      </p>
                    </div>
                  </div>

                  {/* Elion Partners */}
                  <div 
                    data-timeline-item="elion"
                    onMouseEnter={() => setActiveTimelineItem('elion')}
                    className={`relative flex items-start gap-6 transition-all duration-300 cursor-pointer rounded-lg p-4 -m-4 hover:bg-accent/20 ${
                      activeTimelineItem && activeTimelineItem !== 'elion' 
                        ? 'opacity-40 scale-95 blur-[1px]' 
                        : 'opacity-100 scale-100 blur-0'
                    } ${activeTimelineItem === 'elion' ? 'bg-accent/10' : ''}`}
                  >
                    <div className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-lg border-4 border-background overflow-hidden transition-all duration-300 transform ${
                      activeTimelineItem === 'elion' 
                        ? 'bg-cyan-400 shadow-lg shadow-cyan-400/30 scale-110' 
                        : 'bg-white'
                    }`}
                      style={{
                        transform: `translate3d(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02 + Math.sin(scrollY * 0.01) * 2}px, 0) ${
                          activeTimelineItem === 'elion' ? 'scale(1.1)' : 'scale(1)'
                        }`
                      }}
                    >
                      <a href="https://elionpartners.com/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-full h-full">
                        <img src="/images/logos/elion.jpg" alt="Elion Partners" className="h-8 w-8 object-contain hover:scale-110 transition-transform" />
                      </a>
                    </div>
                    <div className="flex-1 pt-1 max-w-lg min-h-[6rem]">
                      <div className="mb-1 text-sm text-muted-foreground">Jun 2023 - Aug 2023</div>
                      <h3 className="mb-1 text-lg font-semibold text-foreground">Elion Partners</h3>
                      <div className="text-sm text-muted-foreground">Data Science and Acquisitions Intern</div>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Led data-driven acquisition analysis and due diligence processes, developing predictive models to evaluate investment opportunities.
                      </p>
                    </div>
                  </div>

                  {/* Elite Endoscopy Services */}
                  <div 
                    data-timeline-item="elite-endoscopy"
                    onMouseEnter={() => setActiveTimelineItem('elite-endoscopy')}
                    className={`relative flex items-start gap-6 transition-all duration-300 cursor-pointer rounded-lg p-4 -m-4 hover:bg-accent/20 ${
                      activeTimelineItem && activeTimelineItem !== 'elite-endoscopy' 
                        ? 'opacity-40 scale-95 blur-[1px]' 
                        : 'opacity-100 scale-100 blur-0'
                    } ${activeTimelineItem === 'elite-endoscopy' ? 'bg-accent/10' : ''}`}
                  >
                    <div className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-lg border-4 border-background overflow-hidden transition-all duration-300 transform ${
                      activeTimelineItem === 'elite-endoscopy' 
                        ? 'bg-cyan-400 shadow-lg shadow-cyan-400/30 scale-110' 
                        : 'bg-white'
                    }`}
                      style={{
                        transform: `translate3d(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02 + Math.sin(scrollY * 0.01) * 2}px, 0) ${
                          activeTimelineItem === 'elite-endoscopy' ? 'scale(1.1)' : 'scale(1)'
                        }`
                      }}
                    >
                      <a href="https://www.eliteendoscopyservices.com/index.htm" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-full h-full">
                        <img src="/images/logos/elite-endoscopy.jpg" alt="Elite Endoscopy Services" className="h-8 w-8 object-contain hover:scale-110 transition-transform" />
                      </a>
                    </div>
                    <div className="flex-1 pt-1 max-w-lg min-h-[6rem]">
                      <div className="mb-1 text-sm text-muted-foreground">Nov 2020 - Mar 2021</div>
                      <h3 className="mb-1 text-lg font-semibold text-foreground">Elite Endoscopy Services</h3>
                      <div className="text-sm text-muted-foreground">Revenue Operations Intern</div>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Optimized revenue cycle management and streamlined billing processes for healthcare operations, improving collection efficiency and financial reporting.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Education Section */}
          {activeTab === 'education' && (
            <div className="rounded-lg border border-border bg-card p-6">
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
          )}

          {/* Philanthropy Section */}
          {activeTab === 'philanthropy' && (
            <div className="rounded-lg border border-border bg-card p-6">
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
          )}
          </div>

      </section>

              {/* Featured Projects */}
        <section 
          className="relative py-8"
          style={{ transform: getSectionTransform(-0.015) }}
        >
          <FloatingElements section="projects" />
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">Featured Projects</h2>
            <a href="#" className="group flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
              <span>View more</span>
              <span className="relative transition-transform group-hover:scale-110">
                <svg className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" viewBox="0 0 24 24" fill="currentColor">
                  {/* Top jaw - rotates down on hover */}
                  <path 
                    className="origin-[12px_12px] transition-transform duration-300 group-hover:rotate-12" 
                    d="M4 8c0-2 2-4 8-4s8 2 8 4v2H4V8z"
                  />
                  {/* Bottom jaw - rotates up on hover */}
                  <path 
                    className="origin-[12px_12px] transition-transform duration-300 group-hover:-rotate-12" 
                    d="M4 14c0 2 2 4 8 4s8-2 8-4v-2H4v2z"
                  />
                  {/* Teeth */}
                  <path className="opacity-80" d="M6 10h1v2H6v-2zm2 0h1v2H8v-2zm2 0h1v2h-1v-2zm2 0h1v2h-1v-2zm2 0h1v2h-1v-2zm2 0h1v2h-1v-2z"/>
                  {/* Eyes */}
                  <circle cx="8" cy="6" r="1"/>
                  <circle cx="16" cy="6" r="1"/>
                </svg>
              </span>
            </a>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div 
              className="rounded-lg border border-border bg-card p-4 transition-all duration-300 hover:bg-accent/50 transform hover:scale-105"
              style={{
                transform: `translate3d(${mousePosition.x * 0.008}px, ${mousePosition.y * 0.008}px, 0)`
              }}
            >
              <div className="mb-3 text-3xl">🤖</div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">AR Automation Platform</h3>
              <p className="mb-3 text-sm text-muted-foreground">
                End-to-end accounts receivable automation using multi-agent LLM orchestration, RAG techniques, and real-time payment processing.
              </p>
              <div className="mb-3 flex flex-wrap gap-2">
                <span className="rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground">PySpark</span>
                <span className="rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground">LLM</span>
                <span className="rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground">RAG</span>
                <span className="rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground">Foundry</span>
                <span className="rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground">TypeScript</span>
              </div>
                    </div>
            
            <div 
              className="rounded-lg border border-border bg-card p-4 transition-all duration-300 hover:bg-accent/50 transform hover:scale-105"
              style={{
                transform: `translate3d(${mousePosition.x * 0.003}px, ${mousePosition.y * 0.003}px, 0)`
              }}
            >
              <div className="mb-3 text-3xl">📈</div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">Pricing Intelligence Platform</h3>
              <p className="mb-3 text-sm text-muted-foreground">
                Bayesian optimization models with demand curve simulation and real-time anomaly detection driving $10M+ revenue impact.
              </p>
              <div className="mb-3 flex flex-wrap gap-2">
                <span className="rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground">Bayesian Optimization</span>
                <span className="rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground">Python</span>
                <span className="rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground">Real-time Analytics</span>
                <span className="rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground">ML Models</span>
              </div>
            </div>

            <div 
              className="rounded-lg border border-border bg-card p-4 transition-all duration-300 hover:bg-accent/50 transform hover:scale-105"
              style={{
                transform: `translate3d(${mousePosition.x * 0.003}px, ${mousePosition.y * 0.003}px, 0)`
              }}
            >
              <div className="mb-3 text-3xl">🏆</div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">A Special Miracle</h3>
              <p className="mb-3 text-sm text-muted-foreground">
                Founded a non-profit organization focused on community impact and social good initiatives.
              </p>
              <div className="mb-3 flex flex-wrap gap-2">
                <span className="rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground">Leadership</span>
                <span className="rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground">Non-Profit</span>
                <span className="rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground">Community Impact</span>
              </div>
              <div className="flex items-center gap-2">
                <a href="https://aspecialmiracle.org" className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground">
                  🌐 Website
                </a>
            </div>
                      </div>

            <div 
              className="rounded-lg border border-border bg-card p-4 transition-all duration-300 hover:bg-accent/50 transform hover:scale-105"
              style={{
                transform: `translate3d(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px, 0)`
              }}
            >
              <div className="mb-3 text-3xl">💼</div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">Revenue Intelligence Suite</h3>
              <p className="mb-3 text-sm text-muted-foreground">
                ML-driven sales forecasting and CRM optimization platform improving pipeline hygiene and customer engagement.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground">ML Forecasting</span>
                <span className="rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground">CRM</span>
                <span className="rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground">Python</span>
                <span className="rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground">API Integration</span>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Posts */}
        <section 
          className="py-8"
          style={{ transform: getSectionTransform(0.005) }}
        >
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">Recent Posts</h2>
            <a href="#" className="group flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
              <span>View more</span>
              <span className="relative transition-transform group-hover:scale-110">
                <svg className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" viewBox="0 0 24 24" fill="currentColor">
                  {/* Top jaw - rotates down on hover */}
                  <path 
                    className="origin-[12px_12px] transition-transform duration-300 group-hover:rotate-12" 
                    d="M4 8c0-2 2-4 8-4s8 2 8 4v2H4V8z"
                  />
                  {/* Bottom jaw - rotates up on hover */}
                  <path 
                    className="origin-[12px_12px] transition-transform duration-300 group-hover:-rotate-12" 
                    d="M4 14c0 2 2 4 8 4s8-2 8-4v-2H4v2z"
                  />
                  {/* Teeth */}
                  <path className="opacity-80" d="M6 10h1v2H6v-2zm2 0h1v2H8v-2zm2 0h1v2h-1v-2zm2 0h1v2h-1v-2zm2 0h1v2h-1v-2zm2 0h1v2h-1v-2z"/>
                  {/* Eyes */}
                  <circle cx="8" cy="6" r="1"/>
                  <circle cx="16" cy="6" r="1"/>
                </svg>
              </span>
            </a>
          </div>
          
          <div className="space-y-4">
            <div className="rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent/50">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="mb-2 text-lg font-semibold text-foreground">Building AI-Powered Revenue Intelligence at Scale</h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Deep dive into the ML architecture and prompt engineering techniques used to transform fragmented sales data into actionable insights.
                  </p>
              </div>
                <div className="text-sm text-muted-foreground">March 15, 2025</div>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent/50">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="mb-2 text-lg font-semibold text-foreground">From Academia to Industry: My Journey at Palantir</h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Reflections on transitioning from university research to deploying enterprise-scale AI solutions that drive real business impact.
                  </p>
                </div>
                <div className="text-sm text-muted-foreground">February 28, 2025</div>
            </div>
          </div>
        </div>
      </section>
          </div>
        )}

        {/* Projects Section */}
        {activeSection === 'projects' && (
          <div className="py-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-4">My Projects</h2>
              <p className="text-muted-foreground">
                A collection of projects I've worked on, from AI-powered solutions to enterprise platforms.
              </p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg border border-border bg-card p-6 transition-all duration-300 hover:bg-accent/50 transform hover:scale-105">
                <div className="mb-4 text-4xl">🤖</div>
                <h3 className="mb-3 text-xl font-semibold text-foreground">AR Automation Platform</h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  End-to-end accounts receivable automation using multi-agent LLM orchestration, RAG techniques, and real-time payment processing. Built for enterprise scale with PySpark and Foundry.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground">PySpark</span>
                  <span className="rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground">LLM</span>
                  <span className="rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground">RAG</span>
                  <span className="rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground">Foundry</span>
                  <span className="rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground">TypeScript</span>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-card p-6 transition-all duration-300 hover:bg-accent/50 transform hover:scale-105">
                <div className="mb-4 text-4xl">📈</div>
                <h3 className="mb-3 text-xl font-semibold text-foreground">Pricing Intelligence Platform</h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  Bayesian optimization models with demand curve simulation and real-time anomaly detection. Drove $10M+ in projected revenue impact through intelligent pricing strategies.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground">Bayesian Optimization</span>
                  <span className="rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground">Python</span>
                  <span className="rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground">Real-time Analytics</span>
                  <span className="rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground">ML Models</span>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-card p-6 transition-all duration-300 hover:bg-accent/50 transform hover:scale-105">
                <div className="mb-4 text-4xl">💼</div>
                <h3 className="mb-3 text-xl font-semibold text-foreground">Revenue Intelligence Suite</h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  ML-driven sales forecasting and CRM optimization platform improving pipeline hygiene and customer engagement. Enhanced system reliability by 34%.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground">ML Forecasting</span>
                  <span className="rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground">CRM</span>
                  <span className="rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground">Python</span>
                  <span className="rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground">API Integration</span>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-card p-6 transition-all duration-300 hover:bg-accent/50 transform hover:scale-105">
                <div className="mb-4 text-4xl">🏆</div>
                <h3 className="mb-3 text-xl font-semibold text-foreground">A Special Miracle</h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  Founded a non-profit organization focused on community impact and social good initiatives. Supporting families with children with Down Syndrome.
                </p>
                <div className="mb-4 flex flex-wrap gap-2">
                  <span className="rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground">Leadership</span>
                  <span className="rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground">Non-Profit</span>
                  <span className="rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground">Community Impact</span>
                </div>
                <div className="flex items-center gap-2">
                  <a href="https://aspecialmiracle.org" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors">
                    🌐 Visit Website
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Blog Section */}
        {activeSection === 'blog' && (
          <div className="py-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-4">Recent Posts</h2>
              <p className="text-muted-foreground">
                Thoughts on AI, data science, and building products that matter.
              </p>
            </div>
            
            <div className="space-y-6">
              <article className="rounded-lg border border-border bg-card p-6 transition-colors hover:bg-accent/50">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="mb-3 text-xl font-semibold text-foreground">Building AI-Powered Revenue Intelligence at Scale</h3>
                    <p className="mb-4 text-muted-foreground">
                      Deep dive into the ML architecture and prompt engineering techniques used to transform fragmented sales data into actionable insights. Learn how we built end-to-end automation that drives millions in revenue impact.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground">Machine Learning</span>
                      <span className="rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground">AI</span>
                      <span className="rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground">Revenue Intelligence</span>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">March 15, 2025</div>
                </div>
              </article>

              <article className="rounded-lg border border-border bg-card p-6 transition-colors hover:bg-accent/50">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="mb-3 text-xl font-semibold text-foreground">From Academia to Industry: My Journey at Palantir</h3>
                    <p className="mb-4 text-muted-foreground">
                      Reflections on transitioning from university research to deploying enterprise-scale AI solutions that drive real business impact. What I learned building deployment strategies for Fortune 500 companies.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground">Career</span>
                      <span className="rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground">Data Science</span>
                      <span className="rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground">Enterprise AI</span>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">February 28, 2025</div>
                </div>
              </article>

              <article className="rounded-lg border border-border bg-card p-6 transition-colors hover:bg-accent/50">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="mb-3 text-xl font-semibold text-foreground">The Future of Fintech: ML-Driven Financial Intelligence</h3>
                    <p className="mb-4 text-muted-foreground">
                      Exploring how machine learning is revolutionizing financial services, from automated trading to risk assessment. A look at the technologies shaping the next generation of fintech products.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground">Fintech</span>
                      <span className="rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground">Financial ML</span>
                      <span className="rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground">Innovation</span>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">February 10, 2025</div>
                </div>
              </article>
            </div>
          </div>
        )}

        {/* Contact Section */}
        {activeSection === 'contact' && (
          <div>
            {/* Contact Hero Section */}
            <section 
              className="relative flex flex-col gap-6 py-8 lg:flex-row lg:items-center"
              style={{ transform: getSectionTransform(-0.02) }}
            >
              <FloatingElements section="contact" />
              <div className="flex-1">
                            <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground lg:text-5xl">
              Get in Touch 📧
            </h1>
                <p className="mb-6 text-xl text-muted-foreground">
                  Interested in collaborating or have a question? I'd love to hear from you.
                </p>
                
                <form onSubmit={handleContactSubmit} className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="group">
                      <div className="relative">
                        <input
                          type="text"
                          name="name"
                          value={contactForm.name}
                          onChange={handleContactChange}
                          required
                          className="peer w-full rounded-lg border border-border bg-background px-4 pt-6 pb-2 text-foreground transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                          placeholder=" "
                        />
                        <label className="absolute left-4 top-2 text-xs text-muted-foreground transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs peer-focus:text-primary">
                          Your Name
                        </label>
                      </div>
                    </div>
                    
                    <div className="group">
                      <div className="relative">
                        <input
                          type="email"
                          name="email"
                          value={contactForm.email}
                          onChange={handleContactChange}
                          required
                          className="peer w-full rounded-lg border border-border bg-background px-4 pt-6 pb-2 text-foreground transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                          placeholder=" "
                        />
                        <label className="absolute left-4 top-2 text-xs text-muted-foreground transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs peer-focus:text-primary">
                          Email Address
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="relative">
                      <textarea
                        name="message"
                        value={contactForm.message}
                        onChange={handleContactChange}
                        required
                        rows={6}
                        className="peer w-full rounded-lg border border-border bg-background px-4 pt-6 pb-2 text-foreground transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                        placeholder=" "
                      />
                      <label className="absolute left-4 top-2 text-xs text-muted-foreground transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs peer-focus:text-primary">
                        Your Message
                      </label>
                    </div>
                  </div>
                  
                  {submitError && (
                    <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-red-700 text-sm animate-in slide-in-from-top-2 duration-300">
                      {submitError}
                    </div>
                  )}
                  
                  {submitSuccess && (
                    <div className="rounded-lg bg-green-50 border border-green-200 p-4 text-green-700 text-sm animate-in slide-in-from-top-2 duration-300">
                      ✅ Message sent successfully! I'll get back to you soon.
                    </div>
                  )}
                  
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <button
                      type="submit"
                      disabled={isSubmitting || submitSuccess}
                      className={`inline-flex items-center justify-center rounded-lg px-8 py-3 text-sm font-medium transition-all duration-300 ${
                        submitSuccess
                          ? 'bg-green-500 text-white cursor-not-allowed'
                          : isSubmitting
                            ? 'bg-primary/70 text-primary-foreground cursor-not-allowed'
                            : 'bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105'
                      }`}
                    >
                      {submitSuccess ? (
                        <>✅ Sent!</>
                      ) : isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Sending...
                        </>
                      ) : (
                        <>📧 Send Message</>
                      )}
                    </button>
                  </div>
                </form>
              </div>
              
              <div 
                className="lg:w-80 transform transition-transform duration-700 ease-out"
                style={{
                  transform: `translate3d(${mousePosition.x * 0.1}px, ${mousePosition.y * 0.1 + scrollY * -0.03}px, 0) rotateY(${mousePosition.x * 0.01}deg) rotateX(${-mousePosition.y * 0.01}deg)`
                }}
              >
                <div className="w-full rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 p-8 shadow-2xl border border-border">
                  <div className="text-center space-y-6">
                    <div className="text-6xl mb-4">📬</div>
                    <h3 className="text-2xl font-semibold text-foreground">Quick Connect</h3>
                    
                    <div className="space-y-4 pt-4">
                      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        Usually responds within 24 hours
                      </div>
                      
                      <div className="grid gap-4">
                        <a href="https://www.linkedin.com/in/elijah-deangulo-a26306175" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-border/50 hover:bg-blue-500/20 hover:border-blue-500/50 transition-all duration-300 hover:scale-105 group">
                          <div className="flex items-center justify-center w-5 h-5">
                            <svg className="h-4 w-4 text-blue-600 group-hover:text-blue-500 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                            </svg>
                          </div>
                          <div className="text-left">
                            <div className="font-medium text-foreground text-sm group-hover:text-blue-500 transition-colors">LinkedIn</div>
                            <div className="text-xs text-muted-foreground">Professional networking</div>
                          </div>
                        </a>
                        
                        <a href="https://github.com/ElijahDeangulo" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-border/50 hover:bg-gray-500/20 hover:border-gray-500/50 transition-all duration-300 hover:scale-105 group">
                          <div className="flex items-center justify-center w-5 h-5">
                            <svg className="h-4 w-4 text-gray-700 group-hover:text-gray-600 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/>
                            </svg>
                          </div>
                          <div className="text-left">
                            <div className="font-medium text-foreground text-sm group-hover:text-gray-600 transition-colors">GitHub</div>
                            <div className="text-xs text-muted-foreground">Check out my code</div>
                          </div>
                        </a>
                        
                        <a href="mailto:ejdeangulo@gmail.com" className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-border/50 hover:bg-red-500/20 hover:border-red-500/50 transition-all duration-300 hover:scale-105 group">
                          <div className="flex items-center justify-center w-5 h-5">
                            <svg className="h-4 w-4 text-red-600 group-hover:text-red-500 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-.904.732-1.636 1.636-1.636h.075L12 13.267 22.289 3.821h.075A1.636 1.636 0 0 1 24 5.457z"/>
                            </svg>
                          </div>
                          <div className="text-left">
                            <div className="font-medium text-foreground text-sm group-hover:text-red-500 transition-colors">Email</div>
                            <div className="text-xs text-muted-foreground">ejdeangulo@gmail.com</div>
                          </div>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* Footer */}
        <footer className="border-t border-border py-8">
          <div className="text-center">
            <div className="text-sm text-muted-foreground">
              © 2025 ejdeangulo.com | <a href="#" className="hover:text-foreground">Privacy</a>
            </div>
          </div>
        </footer>
        </div>

        {/* Download Confirmation Dialog */}
        {showDownloadConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300"
              onClick={cancelDownload}
            />
            
            {/* Dialog */}
            <div className="relative bg-background rounded-xl border border-border shadow-2xl p-6 mx-4 max-w-md w-full animate-in zoom-in-95 slide-in-from-bottom-8 duration-300">
              <div className="text-center">
                <div className="mb-4 text-4xl">📄</div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Download Resume
                </h3>
                <p className="text-muted-foreground mb-6">
                  Would you like to download Elijah's resume? This will save the PDF file to your device.
                </p>
                
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={cancelDownload}
                    className="px-6 py-2 text-sm font-medium rounded-lg border border-border bg-background text-foreground hover:bg-accent transition-all duration-200 hover:scale-105"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDownload}
                    className="px-6 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 hover:scale-105 shadow-lg"
                  >
                    Yes, Download
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  )
}

