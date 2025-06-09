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
              <li><button onClick={() => setActiveSection('home')} className={`text-sm transition-colors hover:text-foreground/80 ${activeSection === 'home' ? 'text-foreground' : 'text-muted-foreground'}`}>home</button></li>
              <li><button onClick={() => setActiveSection('projects')} className={`text-sm transition-colors hover:text-foreground ${activeSection === 'projects' ? 'text-foreground' : 'text-muted-foreground'}`}>projects</button></li>
              <li><button onClick={() => setActiveSection('blog')} className={`text-sm transition-colors hover:text-foreground ${activeSection === 'blog' ? 'text-foreground' : 'text-muted-foreground'}`}>blog</button></li>
              <li><button onClick={() => setActiveSection('contact')} className={`text-sm transition-colors hover:text-foreground ${activeSection === 'contact' ? 'text-foreground' : 'text-muted-foreground'}`}>contact</button></li>
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
          className="relative flex flex-col gap-6 py-8 lg:flex-row lg:items-center"
          style={{ transform: getSectionTransform(-0.02) }}
        >
          <FloatingElements section="hero" />
          <div className="flex-1">
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground lg:text-5xl">
              hi elijah here. 👋
            </h1>
            <p className="mb-4 text-xl text-muted-foreground">
              <TypingAnimation 
                texts={[
                  "Graduate student and data scientist from Florida 🇺🇸",
                  "Building AI-powered solutions 🤖", 
                  "ML Engineer and Problem Solver 🚀",
                  "Transforming data into insights 📊"
                ]}
                speed={80}
                deleteSpeed={40}
                pauseTime={2500}
              />
            </p>
            <div className="mb-6 space-y-4 text-base text-muted-foreground">
              <p>
            MS Business Analytics @ UF. Building AI-powered solutions and scalable data platforms.
          </p>
              <p>
            Passionate about fintech, ML engineering, and transforming data into actionable insights.<br/>
                Currently interning at <strong className="text-foreground">Palantir</strong> as a Deployment Strategist ↗
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <button 
                onClick={handleDownloadClick}
                disabled={isDownloading}
                className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-all duration-300 ${
                  downloadComplete 
                    ? 'bg-green-500 text-white' 
                    : isDownloading 
                      ? 'bg-primary/70 text-primary-foreground cursor-not-allowed' 
                      : 'bg-primary text-primary-foreground hover:bg-primary/90'
                }`}
              >
                {downloadComplete ? (
                  <>✅ Downloaded!</>
                ) : isDownloading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Preparing...
                  </>
                ) : (
                  <>📄 Resume</>
                )}
              </button>
              <div className="flex items-center space-x-3">
                <a href="https://www.linkedin.com/in/elijah-deangulo-a26306175" target="_blank" rel="noopener noreferrer" className="group inline-flex items-center justify-center rounded-md border border-border bg-background px-3 py-2 text-sm transition-all duration-300 hover:bg-blue-500 hover:border-blue-500 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25">
                  <svg className="h-4 w-4 text-blue-600 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a href="https://github.com/ElijahDeangulo" target="_blank" rel="noopener noreferrer" className="group inline-flex items-center justify-center rounded-md border border-border bg-background px-3 py-2 text-sm transition-all duration-300 hover:bg-gray-900 hover:border-gray-900 hover:scale-105 hover:shadow-lg hover:shadow-gray-900/25">
                  <svg className="h-4 w-4 text-gray-700 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/>
                  </svg>
                </a>
                <a href="mailto:ejdeangulo@gmail.com" className="group inline-flex items-center justify-center rounded-md border border-border bg-background px-3 py-2 text-sm transition-all duration-300 hover:bg-red-500 hover:border-red-500 hover:scale-105 hover:shadow-lg hover:shadow-red-500/25">
                  <svg className="h-4 w-4 text-red-600 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-.904.732-1.636 1.636-1.636h.075L12 13.267 22.289 3.821h.075A1.636 1.636 0 0 1 24 5.457z"/>
                  </svg>
                </a>
              </div>
            </div>
                    </div>
          <div 
            className="lg:w-80 transform transition-transform duration-700 ease-out"
            style={{
              transform: `translate3d(${mousePosition.x * 0.1}px, ${mousePosition.y * 0.1 + scrollY * -0.03}px, 0) rotateY(${mousePosition.x * 0.01}deg) rotateX(${-mousePosition.y * 0.01}deg)`
            }}
          >
            <img 
              src="/images/profile.jpg" 
              alt="Elijah DeAngulo" 
              className="w-full rounded-2xl object-cover shadow-2xl"
              style={{ aspectRatio: '320/400' }}
              onError={(e) => {
                e.currentTarget.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=320&h=400&fit=crop&crop=face"
              }}
          />
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
                  <div className="h-4"></div> {/* space-y-4 gap */}
                  
                  {/* Inselligence segment - compact content */}
                  <div className={`h-[9.5rem] w-full transition-all duration-300 ${activeTimelineItem === 'inselligence' ? 'bg-gradient-to-b from-transparent via-cyan-400 to-transparent shadow-lg shadow-cyan-400/20' : 'bg-transparent'}`}></div>
                  <div className="h-4"></div> {/* space-y-4 gap */}
                  
                  {/* Elion segment - compact content */}
                  <div className={`h-[9.5rem] w-full transition-all duration-300 ${activeTimelineItem === 'elion' ? 'bg-gradient-to-b from-transparent via-cyan-400 to-transparent shadow-lg shadow-cyan-400/20' : 'bg-transparent'}`}></div>
                  <div className="h-4"></div> {/* space-y-4 gap */}
                  
                  {/* Elite Endoscopy segment - compact content */}
                  <div className={`h-[9.5rem] w-full transition-all duration-300 ${activeTimelineItem === 'elite-endoscopy' ? 'bg-gradient-to-b from-transparent via-cyan-400 to-transparent shadow-lg shadow-cyan-400/20' : 'bg-transparent'}`}></div>
                </div>
                
                <div className="space-y-4">
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
                    <div className="flex-1 pt-1 max-w-lg">
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
                    <div className="flex-1 pt-1 max-w-lg">
                      <div className="mb-1 text-sm text-muted-foreground">Nov 2020 - Mar 2021</div>
                      <h3 className="mb-1 text-lg font-semibold text-foreground">Elite Endoscopy Services</h3>
                      <div className="text-sm text-muted-foreground">Revenue Operations Consultant Intern</div>
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
                  <div className="h-4"></div> {/* space-y-4 gap */}
                  
                  {/* UF Bachelors segment - compact content */}
                  <div className={`h-[9.5rem] w-full transition-all duration-300 ${activeTimelineItem === 'uf-bachelors' ? 'bg-gradient-to-b from-transparent via-cyan-400 to-transparent shadow-lg shadow-cyan-400/20' : 'bg-transparent'}`}></div>
                </div>
                
                <div className="space-y-4">
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
                  <div className="h-4"></div> {/* space-y-4 gap */}
                  
                  {/* Food Bank segment */}
                  <div className={`h-[8rem] w-full transition-all duration-300 ${activeTimelineItem === 'food-bank' ? 'bg-gradient-to-b from-transparent via-cyan-400 to-transparent shadow-lg shadow-cyan-400/20' : 'bg-transparent'}`}></div>
                </div>
                
                <div className="space-y-4">
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
            <h2 className="text-2xl font-bold text-foreground">featured projects</h2>
            <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              view more →
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
                End-to-end accounts receivable automation using multi-agent LLM orchestration, RAG techniques, and real-time payment processing
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
                Bayesian optimization models with demand curve simulation and real-time anomaly detection driving $10M+ revenue impact
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
                Founded a non-profit organization focused on community impact and social good initiatives
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
                ML-driven sales forecasting and CRM optimization platform improving pipeline hygiene and customer engagement
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
            <h2 className="text-2xl font-bold text-foreground">recent posts</h2>
            <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              view more →
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
              <h2 className="text-2xl font-bold text-foreground mb-4">my projects</h2>
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
              <h2 className="text-2xl font-bold text-foreground mb-4">recent posts</h2>
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
                  get in touch 📧
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
              © 2025 ejdeangulo.com | <a href="#" className="hover:text-foreground">privacy?</a>
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

