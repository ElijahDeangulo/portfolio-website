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
      setScrollY(window.scrollY)
    }

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    const handleResize = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener('scroll', handleScroll)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const getSectionTransform = (speed: number) => ({
    transform: `translateY(${scrollY * speed}px)`
  })

  const getElementTransform = (speed: number, mouseMultiplier: number = 1) => ({
    transform: `translate(${mousePosition.x * mouseMultiplier * 0.02}px, ${mousePosition.y * mouseMultiplier * 0.02 + scrollY * speed}px)`
  })

  const getHeroElementTransform = (direction: 'left' | 'right' | 'up' | 'down' = 'up', speed: number = 1) => {
    const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1200
    const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 800
    
    const normalizedMouseX = (mousePosition.x - windowWidth / 2) / (windowWidth / 2)
    const normalizedMouseY = (mousePosition.y - windowHeight / 2) / (windowHeight / 2)
    
    const maxOffset = 50 * speed
    
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
    
    return {
      transform: `translate(${translateX}px, ${translateY + scrollY * 0.3}px)`
    }
  }

  const getExperienceElementTransform = (index: number, delay: number = 0): React.CSSProperties => {
    const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1200
    const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 800
    
    const normalizedMouseX = (mousePosition.x - windowWidth / 2) / (windowWidth / 2)
    const normalizedMouseY = (mousePosition.y - windowHeight / 2) / (windowHeight / 2)
    
    const scrollFactor = scrollY * 0.15
    const mouseFactor = 15 + (index * 3)
    
    const translateX = normalizedMouseX * mouseFactor
    const translateY = normalizedMouseY * mouseFactor + scrollFactor
    
    return {
      transform: `translate(${translateX}px, ${translateY}px)`,
      transition: `transform 0.${delay}s ease-out`
    }
  }

  const getExperienceSectionPushTransform = () => {
    const pushEffect = Math.max(0, (scrollY - 800) * 0.8)
    
    return {
      transform: `translateY(-${pushEffect}px)`,
      zIndex: 10
    }
  }

  const getHeroExitTransform = (): React.CSSProperties => {
    const opacity = Math.max(0, 1 - (scrollY / 500))
    const scale = Math.max(0.8, 1 - (scrollY / 2000))
    const blur = Math.min(10, scrollY / 100)
    
    return {
      opacity,
      transform: `scale(${scale})`,
      filter: `blur(${blur}px)`,
      pointerEvents: opacity > 0.1 ? 'auto' : 'none'
    }
  }

  const getFeaturedProjectsFadeTransform = () => {
    const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 800
    const featuredProjectsOffset = windowHeight * 2
    const fadeStart = featuredProjectsOffset - 200
    const fadeEnd = featuredProjectsOffset + 200
    
    let opacity = 1
    let transform = 'translateY(0px)'
    
    if (scrollY < fadeStart) {
      opacity = 0
      transform = 'translateY(50px)'
    } else if (scrollY >= fadeStart && scrollY <= fadeEnd) {
      const progress = (scrollY - fadeStart) / (fadeEnd - fadeStart)
      opacity = progress
      transform = `translateY(${50 * (1 - progress)}px)`
    }
    
    return {
      opacity,
      transform,
      transition: 'opacity 0.6s ease-out, transform 0.6s ease-out'
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