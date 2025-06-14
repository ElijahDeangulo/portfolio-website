import { useState, useEffect } from 'react'
import { ParallaxEffects, MousePosition } from '../types'

// Dark Mode Hook
export const useDarkMode = () => {
  const [isDark, setIsDark] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      setIsDark(savedTheme === 'dark')
    } else {
      setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches)
    }
  }, [])

  const toggleDarkMode = () => {
    const newTheme = !isDark
    setIsDark(newTheme)
    localStorage.setItem('theme', newTheme ? 'dark' : 'light')
    document.documentElement.classList.toggle('dark', newTheme)
  }

  useEffect(() => {
    if (isClient) {
      document.documentElement.classList.toggle('dark', isDark)
    }
  }, [isDark, isClient])

  return { isDark, toggleDarkMode, isClient }
}

// Parallax Effects Hook
export const useParallax = (): ParallaxEffects => {
  const [scrollY, setScrollY] = useState(0)
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 })

  useEffect(() => {
    const handleScroll = () => {
      // Safety check to prevent NaN values
      const safeScrollY = isNaN(window.scrollY) ? 0 : window.scrollY
      setScrollY(safeScrollY)
    }

    const handleMouseMove = (e: MouseEvent) => {
      // Safety checks to prevent invalid coordinates
      const x = isNaN(e.clientX) ? 0 : e.clientX
      const y = isNaN(e.clientY) ? 0 : e.clientY
      setMousePosition({ x, y })
    }

    const handleResize = () => {
      // Safety check to prevent NaN values
      const safeScrollY = isNaN(window.scrollY) ? 0 : window.scrollY
      setScrollY(safeScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('resize', handleResize, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const getSectionTransform = (speed: number) => {
    // Safety check for speed parameter
    const safeSpeed = isNaN(speed) ? 0 : speed
    const safeScrollY = isNaN(scrollY) ? 0 : scrollY
    
    return {
      transform: `translateY(${safeScrollY * safeSpeed}px)`,
      willChange: 'transform',
      backfaceVisibility: 'hidden' as const
    }
  }

  const getElementTransform = (speed: number, mouseMultiplier: number = 1) => {
    // Safety checks for all parameters
    const safeSpeed = isNaN(speed) ? 0 : speed
    const safeMouseMultiplier = isNaN(mouseMultiplier) ? 1 : mouseMultiplier
    const safeMouseX = isNaN(mousePosition.x) ? 0 : mousePosition.x
    const safeMouseY = isNaN(mousePosition.y) ? 0 : mousePosition.y
    const safeScrollY = isNaN(scrollY) ? 0 : scrollY
    
    return {
      transform: `translate(${safeMouseX * safeMouseMultiplier * 0.02}px, ${safeMouseY * safeMouseMultiplier * 0.02 + safeScrollY * safeSpeed}px)`,
      willChange: 'transform',
      backfaceVisibility: 'hidden' as const
    }
  }

  const getHeroElementTransform = (direction: 'left' | 'right' | 'up' | 'down' = 'up', speed: number = 1) => {
    const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1200
    const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 800
    
    // Safety checks to prevent division by zero
    const safeWindowWidth = windowWidth || 1200
    const safeWindowHeight = windowHeight || 800
    const safeSpeed = isNaN(speed) ? 1 : speed
    const safeMouseX = isNaN(mousePosition.x) ? 0 : mousePosition.x
    const safeMouseY = isNaN(mousePosition.y) ? 0 : mousePosition.y
    const safeScrollY = isNaN(scrollY) ? 0 : scrollY
    
    const normalizedMouseX = (safeMouseX - safeWindowWidth / 2) / (safeWindowWidth / 2)
    const normalizedMouseY = (safeMouseY - safeWindowHeight / 2) / (safeWindowHeight / 2)
    
    const maxOffset = 50 * safeSpeed
    
    let translateX = 0
    let translateY = 0
    
    switch (direction) {
      case 'left':
        translateX = normalizedMouseX * maxOffset * -1
        break
      case 'right':
        translateX = normalizedMouseX * maxOffset
        break
      case 'up':
        translateY = normalizedMouseY * maxOffset * -1
        break
      case 'down':
        translateY = normalizedMouseY * maxOffset
        break
    }
    
    // Final safety checks
    const safeTranslateX = isNaN(translateX) ? 0 : translateX
    const safeTranslateY = isNaN(translateY) ? 0 : translateY
    
    return {
      transform: `translate(${safeTranslateX}px, ${safeTranslateY + safeScrollY * 0.3}px)`,
      willChange: 'transform',
      backfaceVisibility: 'hidden' as const
    }
  }

  const getExperienceElementTransform = (index: number, delay: number = 0): React.CSSProperties => {
    const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1200
    const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 800
    
    // Safety checks to prevent division by zero and NaN values
    const safeWindowWidth = windowWidth || 1200
    const safeWindowHeight = windowHeight || 800
    const safeIndex = isNaN(index) ? 0 : index
    const safeDelay = isNaN(delay) ? 0 : Math.max(0, delay)
    const safeMouseX = isNaN(mousePosition.x) ? 0 : mousePosition.x
    const safeMouseY = isNaN(mousePosition.y) ? 0 : mousePosition.y
    const safeScrollY = isNaN(scrollY) ? 0 : scrollY
    
    const normalizedMouseX = (safeMouseX - safeWindowWidth / 2) / (safeWindowWidth / 2)
    const normalizedMouseY = (safeMouseY - safeWindowHeight / 2) / (safeWindowHeight / 2)
    
    const scrollFactor = safeScrollY * 0.15
    const mouseFactor = 15 + (safeIndex * 3)
    
    const translateX = normalizedMouseX * mouseFactor
    const translateY = normalizedMouseY * mouseFactor + scrollFactor
    
    // Final safety checks
    const safeTranslateX = isNaN(translateX) ? 0 : translateX
    const safeTranslateY = isNaN(translateY) ? 0 : translateY
    
    return {
      transform: `translate(${safeTranslateX}px, ${safeTranslateY}px)`,
      transition: `transform 0.${safeDelay}s ease-out`,
      willChange: 'transform',
      backfaceVisibility: 'hidden' as const
    }
  }

  const getExperienceSectionPushTransform = () => {
    // Safety checks
    const safeScrollY = isNaN(scrollY) ? 0 : scrollY
    const pushEffect = Math.max(0, (safeScrollY - 800) * 0.8)
    const safePushEffect = isNaN(pushEffect) ? 0 : pushEffect
    
    return {
      transform: `translateY(-${safePushEffect}px)`,
      zIndex: 10,
      willChange: 'transform',
      backfaceVisibility: 'hidden' as const
    }
  }

  const getHeroExitTransform = (): React.CSSProperties => {
    // Safety checks to prevent division by zero
    const safeScrollY = isNaN(scrollY) ? 0 : scrollY
    const opacity = Math.max(0, 1 - (safeScrollY / 500))
    const scale = Math.max(0.8, 1 - (safeScrollY / 2000))
    const blur = Math.min(10, safeScrollY / 100)
    
    // Final safety checks
    const safeOpacity = isNaN(opacity) ? 1 : opacity
    const safeScale = isNaN(scale) ? 1 : scale
    const safeBlur = isNaN(blur) ? 0 : blur
    
    return {
      opacity: safeOpacity,
      transform: `scale(${safeScale})`,
      filter: `blur(${safeBlur}px)`,
      pointerEvents: safeOpacity > 0.1 ? 'auto' as const : 'none' as const,
      willChange: 'transform, opacity, filter',
      backfaceVisibility: 'hidden' as const
    }
  }

  const getFeaturedProjectsFadeTransform = () => {
    const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 800
    const safeWindowHeight = windowHeight || 800
    const safeScrollY = isNaN(scrollY) ? 0 : scrollY
    
    const featuredProjectsOffset = safeWindowHeight * 2
    const fadeStart = featuredProjectsOffset - 200
    const fadeEnd = featuredProjectsOffset + 200
    
    let opacity = 1
    let transform = 'translateY(0px)'
    
    if (safeScrollY < fadeStart) {
      opacity = 0
      transform = 'translateY(50px)'
    } else if (safeScrollY >= fadeStart && safeScrollY <= fadeEnd) {
      const divisor = fadeEnd - fadeStart
      const progress = divisor !== 0 ? (safeScrollY - fadeStart) / divisor : 0 // Prevent division by zero
      const safeProgress = isNaN(progress) ? 0 : Math.max(0, Math.min(1, progress))
      
      opacity = safeProgress
      transform = `translateY(${50 * (1 - safeProgress)}px)`
    }
    
    // Final safety checks
    const safeOpacity = isNaN(opacity) ? 1 : opacity
    
    return {
      opacity: safeOpacity,
      transform,
      transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
      willChange: 'transform, opacity',
      backfaceVisibility: 'hidden' as const
    }
  }

  return {
    scrollY,
    mousePosition,
    getSectionTransform,
    getElementTransform,
    getHeroElementTransform,
    getExperienceElementTransform,
    getExperienceSectionPushTransform,
    getHeroExitTransform,
    getFeaturedProjectsFadeTransform
  }
} 