'use client'

import React, { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

// Global cursor reset event for modal/popup closures
const CURSOR_RESET_EVENT = 'cursorReset'

// Global function to trigger cursor reset (can be called from anywhere)
export const resetCursorState = () => {
  window.dispatchEvent(new CustomEvent(CURSOR_RESET_EVENT))
}

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
      // Safety check to prevent invalid coordinates
      const x = isNaN(e.clientX) ? 0 : e.clientX
      const y = isNaN(e.clientY) ? 0 : e.clientY
      setPosition({ x, y })
    }

    const handleScroll = () => {
      setIsVisible(false)
      setTimeout(() => setIsVisible(true), 100)
    }

    // Improved hover detection that works with dynamic content
    const handleMouseOver = (e: Event) => {
      const target = e.target as HTMLElement
      if (target && (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.role === 'button' ||
        target.classList.contains('cursor-pointer') ||
        target.closest('button') ||
        target.closest('a') ||
        target.closest('[role="button"]') ||
        target.closest('.cursor-pointer') ||
        window.getComputedStyle(target).cursor === 'pointer'
      )) {
        setIsHovering(true)
      } else {
        setIsHovering(false)
      }
    }

    // Global mouse leave detection
    const handleMouseOut = (e: Event) => {
      const target = e.target as HTMLElement
      const relatedTarget = (e as MouseEvent).relatedTarget as HTMLElement
      
      // Check if we're leaving a clickable element and not entering another one
      if (target && !relatedTarget || 
          (relatedTarget && 
           relatedTarget.tagName !== 'BUTTON' &&
           relatedTarget.tagName !== 'A' &&
           relatedTarget.role !== 'button' &&
           !relatedTarget.classList.contains('cursor-pointer') &&
           !relatedTarget.closest('button') &&
           !relatedTarget.closest('a') &&
           !relatedTarget.closest('[role="button"]') &&
           !relatedTarget.closest('.cursor-pointer') &&
           window.getComputedStyle(relatedTarget).cursor !== 'pointer')) {
        setIsHovering(false)
      }
    }

    const handleMouseDown = () => setIsPressed(true)
    const handleMouseUp = () => {
      setIsPressed(false)
      // Reset hover state on mouse up to prevent stuck states
      setTimeout(() => {
        const elementUnderCursor = document.elementFromPoint(position.x, position.y) as HTMLElement
        if (elementUnderCursor && !(
          elementUnderCursor.tagName === 'BUTTON' ||
          elementUnderCursor.tagName === 'A' ||
          elementUnderCursor.role === 'button' ||
          elementUnderCursor.classList.contains('cursor-pointer') ||
          elementUnderCursor.closest('button') ||
          elementUnderCursor.closest('a') ||
          elementUnderCursor.closest('[role="button"]') ||
          elementUnderCursor.closest('.cursor-pointer') ||
          window.getComputedStyle(elementUnderCursor).cursor === 'pointer'
        )) {
          setIsHovering(false)
        }
      }, 50)
    }

    // Force reset cursor state periodically to prevent stuck states
    const resetCursorState = () => {
      const elementUnderCursor = document.elementFromPoint(position.x, position.y) as HTMLElement
      if (elementUnderCursor) {
        const shouldHover = !!(
          elementUnderCursor.tagName === 'BUTTON' ||
          elementUnderCursor.tagName === 'A' ||
          elementUnderCursor.role === 'button' ||
          elementUnderCursor.classList.contains('cursor-pointer') ||
          elementUnderCursor.closest('button') ||
          elementUnderCursor.closest('a') ||
          elementUnderCursor.closest('[role="button"]') ||
          elementUnderCursor.closest('.cursor-pointer') ||
          window.getComputedStyle(elementUnderCursor).cursor === 'pointer'
        )
        setIsHovering(shouldHover)
      } else {
        setIsHovering(false)
      }
    }

    // Global cursor reset handler for modal/popup closures
    const handleGlobalCursorReset = () => {
      setIsHovering(false)
      setIsPressed(false)
      // Wait a bit then check if we should be hovering over current element
      setTimeout(() => {
        resetCursorState()
      }, 100)
    }

    const animateCursor = () => {
      if (cursorRef.current) {
        const { x, y } = position
        // Safety check to prevent NaN values
        const safeX = isNaN(x) ? 0 : x
        const safeY = isNaN(y) ? 0 : y
        cursorRef.current.style.transform = `translate3d(${safeX}px, ${safeY}px, 0)`
      }
      requestAnimationFrame(animateCursor)
    }

    // Use event delegation for better dynamic content support
    window.addEventListener('mousemove', updateMousePosition, { passive: true })
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    
    // Use event delegation on document for dynamic content
    document.addEventListener('mouseover', handleMouseOver, { passive: true })
    document.addEventListener('mouseout', handleMouseOut, { passive: true })
    
    // Listen for global cursor reset events (triggered when modals close)
    window.addEventListener(CURSOR_RESET_EVENT, handleGlobalCursorReset)
    
    // Reset cursor state periodically to prevent stuck states
    const resetInterval = setInterval(resetCursorState, 500)

    animateCursor()

    return () => {
      window.removeEventListener('mousemove', updateMousePosition)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('mouseover', handleMouseOver)
      document.removeEventListener('mouseout', handleMouseOut)
      window.removeEventListener(CURSOR_RESET_EVENT, handleGlobalCursorReset)
      clearInterval(resetInterval)
    }
  }, [position])

  if (!mounted) return null

  // Safety check for position values
  const safeX = isNaN(position.x) ? 0 : position.x
  const safeY = isNaN(position.y) ? 0 : position.y

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
        willChange: 'transform, opacity',
        backfaceVisibility: 'hidden',
        transform: `translate3d(${safeX}px, ${safeY}px, 0)`,
      }}
    />
  )

  return createPortal(cursorElement, document.body)
} 