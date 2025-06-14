'use client'

import React, { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

export const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(true)
  const [isPressed, setIsPressed] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [mounted, setMounted] = useState(false)

  const cursorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
    
    const updateMousePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
    }

    const handleScroll = () => {
      setIsVisible(false)
      setTimeout(() => setIsVisible(true), 100)
    }

    const handleMouseEnter = (e: Event) => {
      const target = e.target as HTMLElement
      if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.role === 'button' ||
        target.classList.contains('cursor-pointer') ||
        window.getComputedStyle(target).cursor === 'pointer'
      ) {
        setIsHovering(true)
      }
    }

    const handleMouseLeave = () => {
      setIsHovering(false)
    }

    const handleMouseDown = () => setIsPressed(true)
    const handleMouseUp = () => setIsPressed(false)

    const addEventListeners = () => {
      window.addEventListener('mousemove', updateMousePosition, { passive: true })
      window.addEventListener('scroll', handleScroll, { passive: true })
      window.addEventListener('mousedown', handleMouseDown)
      window.addEventListener('mouseup', handleMouseUp)
      
      document.querySelectorAll('button, a, [role="button"], .cursor-pointer').forEach(el => {
        el.addEventListener('mouseenter', handleMouseEnter)
        el.addEventListener('mouseleave', handleMouseLeave)
      })
    }

    const animateCursor = () => {
      if (cursorRef.current) {
        const { x, y } = position
        cursorRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`
      }
      requestAnimationFrame(animateCursor)
    }

    addEventListeners()
    animateCursor()

    return () => {
      window.removeEventListener('mousemove', updateMousePosition)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      
      document.querySelectorAll('button, a, [role="button"], .cursor-pointer').forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter)
        el.removeEventListener('mouseleave', handleMouseLeave)
      })
    }
  }, [position])

  if (!mounted) return null

  const cursorElement = (
    <div
      ref={cursorRef}
      className={`
        fixed top-0 left-0 w-6 h-6 pointer-events-none z-[9999] mix-blend-difference
        transition-all duration-150 ease-out
        ${isVisible ? 'opacity-100' : 'opacity-0'}
        ${isPressed ? 'scale-75' : 'scale-100'}
        ${isHovering ? 'scale-150 bg-white' : 'scale-100 bg-white'}
      `}
      style={{
        borderRadius: '50%',
        willChange: 'transform',
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
      }}
    />
  )

  return createPortal(cursorElement, document.body)
} 