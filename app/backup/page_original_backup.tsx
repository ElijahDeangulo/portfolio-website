'use client'

import React, { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from 'framer-motion'

interface Project {
  title: string;
  emoji: string;
  description: string;
  fullDescription: string;
  technologies: string[];
  features: string[];
  impact: string;
  github?: string;
  demo?: string;
  website?: string;
}

type ProjectId = 'ar-automation' | 'pricing-intelligence' | 'revenue-intelligence' | 'special-miracle';

// Modern Theme Toggle Component
const ModernThemeToggle = ({ isDark, toggleDarkMode, isClient, isSpotifyExpanded }: { 
  isDark: boolean
  toggleDarkMode: () => void
  isClient: boolean 
  isSpotifyExpanded: boolean
}) => {
  if (!isClient) return null

  return (
    <div 
      className="transition-all duration-300"
    >
      <button 
        onClick={toggleDarkMode}
        className="flex items-center justify-center w-11 h-11 bg-background/90 border border-border/20 rounded-full shadow-lg transition-all duration-300 hover:bg-background hover:shadow-xl hover:scale-105 text-foreground/80 hover:text-foreground group"
        title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        style={{ backdropFilter: 'none', filter: 'none' }}
      >
        <div className="relative w-5 h-5 overflow-hidden">
          {/* Sun Icon */}
          <svg 
            className={`absolute inset-0 w-5 h-5 transition-all duration-500 ${
              isDark ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'
            }`} 
            fill="currentColor" 
            viewBox="0 0 24 24"
          >
            <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z"/>
          </svg>
          
          {/* Moon Icon */}
          <svg 
            className={`absolute inset-0 w-5 h-5 transition-all duration-500 ${
              isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'
            }`} 
            fill="currentColor" 
            viewBox="0 0 24 24"
          >
            <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd"/>
          </svg>
        </div>
      </button>
    </div>
  )
}

// Hybrid Music Player Component
const HybridMusicPlayer = ({ 
  playlistId = "37i9dQZF1DZ06evO3qQrNm",
  youtubeVideoId = "5i8W1z9zkE0", // Your specific YouTube video
  youtubeStartTime = "5448", // Start at 1:31:48
  onExpandedChange
}: { 
  playlistId?: string
  youtubeVideoId?: string
  youtubeStartTime?: string
  onExpandedChange?: (expanded: boolean) => void
}) => {
  const [isVisible, setIsVisible] = useState(true)
  
  // Temporary fix: Force visible to always be true for debugging
  const forceVisible = true
  const [isExpanded, setIsExpanded] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.3)
  const [hasUserInteracted, setHasUserInteracted] = useState(false)
  const [showAutoplayTip, setShowAutoplayTip] = useState(true)
  const [currentPlayer, setCurrentPlayer] = useState<'spotify' | 'youtube'>('youtube')

  // Debug visibility changes
  useEffect(() => {
    console.log('🎵 Music Player visibility changed:', isVisible)
  }, [isVisible])

  // Debug component rendering
  console.log('🎵 HybridMusicPlayer rendering - isVisible:', isVisible, 'forceVisible:', forceVisible)

  // Handle user interaction for autoplay
  useEffect(() => {
    const handleFirstInteraction = (e: Event) => {
      console.log('🎵 First interaction detected:', e.type, e.target)
      setHasUserInteracted(true)
      setShowAutoplayTip(false)
      // Try to trigger autoplay after user interaction
      const spotifyIframes = document.querySelectorAll('iframe[src*="spotify"]') as NodeListOf<HTMLIFrameElement>
      spotifyIframes.forEach((iframe) => {
        // Reload iframe with autoplay after user interaction  
        const src = iframe.src
        if (src.includes('autoplay=1')) {
          iframe.src = src // Trigger reload
        }
      })
    }

    if (!hasUserInteracted) {
      // Use capture phase to avoid conflicts with music player buttons
      document.addEventListener('click', handleFirstInteraction, { once: true, capture: true })
      document.addEventListener('keydown', handleFirstInteraction, { once: true, capture: true })
      document.addEventListener('touchstart', handleFirstInteraction, { once: true, capture: true })
    }

    return () => {
      document.removeEventListener('click', handleFirstInteraction, true)
      document.removeEventListener('keydown', handleFirstInteraction, true)
      document.removeEventListener('touchstart', handleFirstInteraction, true)
    }
  }, [hasUserInteracted])

  // Auto-hide autoplay tip after 10 seconds
  useEffect(() => {
    if (showAutoplayTip) {
      const timer = setTimeout(() => {
        setShowAutoplayTip(false)
      }, 10000)
      return () => clearTimeout(timer)
    }
  }, [showAutoplayTip])

  // Notify parent when expanded state changes
  const handleExpandedChange = (expanded: boolean) => {
    setIsExpanded(expanded)
    onExpandedChange?.(expanded)
  }

  // Toggle between Spotify and YouTube
  const togglePlayer = () => {
    setCurrentPlayer(prev => {
      const newPlayer = prev === 'spotify' ? 'youtube' : 'spotify'
      // Auto-collapse when switching to YouTube (since YouTube can't expand)
      if (newPlayer === 'youtube' && isExpanded) {
        setIsExpanded(false)
        onExpandedChange?.(false)
      }
      return newPlayer
    })
  }

  // Mock controls for compact view
  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  if (!isVisible && !forceVisible) {
    return (
      <button
        onClick={() => {
          console.log('🎵 Show button clicked!')
          setIsVisible(true)
        }}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '100px',
          zIndex: 2147483647,
          width: '44px',
          height: '44px',
          pointerEvents: 'auto',
          transform: 'none'
        }}
        className="w-11 h-11 bg-red-500 border border-border rounded-full flex items-center justify-center text-white hover:text-foreground hover:bg-accent transition-all duration-300 shadow-lg"
        title="Show Music Player"
      >
        ♪
      </button>
    )
  }

  return (
    <div className="group">
      
      {/* Autoplay Tip */}
      {showAutoplayTip && !hasUserInteracted && (
        <div className="absolute -top-16 -right-4 w-64 bg-background border border-border rounded-lg p-3 shadow-xl text-xs text-muted-foreground animate-pulse">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
            <span className="font-medium">Music Ready</span>
          </div>
          <p>Click anywhere to enable autoplay 🎵</p>
          <div className="absolute bottom-0 left-8 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-border transform translate-y-full"></div>
        </div>
      )}

      {/* Always-present Music Embed (hidden when compact) */}
      <div className={`${isExpanded ? 'block' : 'hidden'} relative`}>
        {/* Control Buttons for Expanded View */}
        <div className="absolute -top-2 -right-2 flex gap-1 z-10">
          <button
            onClick={togglePlayer}
            className="w-6 h-6 bg-background border border-border rounded-full flex items-center justify-center text-xs hover:bg-accent transition-colors"
            title={`Switch to ${currentPlayer === 'spotify' ? 'YouTube' : 'Spotify'}`}
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M7.5 5.6L5 7l1.4-2.5L5 2l2.5 1.4L10 2 8.6 4.5 10 7 7.5 5.6zm4.6 4.6L10.7 8l1.4-2.5L10.7 3l2.5 1.4L16.2 3l-1.4 2.5L16.2 8l-2.5-1.4-1.4 1.4zm-4.6 4.6L5 16l1.4-2.5L5 11l2.5 1.4L10 11l-1.4 2.5L10 16l-2.5-1.4zm7.5 0L12.7 16l1.4-2.5L12.7 11l2.5 1.4L18.2 11l-1.4 2.5L18.2 16l-2.5-1.4z"/>
            </svg>
          </button>
          <button
            onClick={() => handleExpandedChange(false)}
            className="w-6 h-6 bg-background border border-border rounded-full flex items-center justify-center text-xs hover:bg-accent transition-colors"
            title="Compact View"
          >
            ⤡
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="w-6 h-6 bg-background border border-border rounded-full flex items-center justify-center text-xs hover:bg-accent transition-colors"
            title="Hide Player"
          >
            −
          </button>
        </div>

        {/* Music Player Embed - Only Spotify can expand */}
        {currentPlayer === 'spotify' && (
          <div className="bg-background border border-border rounded-lg overflow-hidden shadow-xl">
            <iframe
              src={`https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=0${hasUserInteracted ? '&autoplay=1' : ''}`}
              width="300"
              height="152"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              className="rounded-lg"
              style={{ filter: 'none', backdropFilter: 'none', borderRadius: '12px' }}
            />
          </div>
        )}
      </div>

      {/* Hidden Mini Embed for Background Playback */}
      <div className={`${isExpanded ? 'hidden' : 'block'} absolute top-0 left-0 opacity-0 pointer-events-none w-0 h-0 overflow-hidden`}>
        {currentPlayer === 'spotify' ? (
          <iframe
            src={`https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=0${hasUserInteracted ? '&autoplay=1' : ''}`}
            width="1"
            height="1"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            style={{ filter: 'none', backdropFilter: 'none' }}
          />
        ) : (
          <iframe
            key="youtube-background"
            src={`https://www.youtube.com/embed/${youtubeVideoId}?start=${youtubeStartTime}&autoplay=${hasUserInteracted ? '1' : '0'}&loop=1&controls=0&modestbranding=1&rel=0`}
            width="1"
            height="1"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            style={{ filter: 'none', backdropFilter: 'none' }}
          />
        )}
      </div>

      {/* Compact Controls Overlay */}
      <div className={`${isExpanded ? 'hidden' : 'flex'} items-center gap-3 bg-background border border-border/20 rounded-full px-4 py-2 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105`} style={{ backdropFilter: 'none', filter: 'none' }}>
        
        {/* Platform Logo & Label */}
        <div className="flex items-center gap-2">
          {currentPlayer === 'spotify' ? (
            <>
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.84-.179-.959-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.361 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.32 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
              </svg>
              <span className="text-xs text-muted-foreground font-medium">Spotify</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              <span className="text-xs text-muted-foreground font-medium">YouTube</span>
            </>
          )}
          {hasUserInteracted ? (
            <div className="w-1 h-1 rounded-full bg-green-400 animate-pulse" />
          ) : (
            <div className="w-1 h-1 rounded-full bg-yellow-400 animate-pulse" title="Click to enable autoplay" />
          )}
        </div>

        {/* Toggle Platform Button */}
        <button
          onClick={togglePlayer}
          className="flex items-center justify-center w-7 h-7 rounded-full hover:bg-accent transition-all duration-200 text-foreground/60 hover:text-foreground group-hover:scale-110"
          title={`Switch to ${currentPlayer === 'spotify' ? 'YouTube' : 'Spotify'}`}
        >
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M7.5 5.6L5 7l1.4-2.5L5 2l2.5 1.4L10 2 8.6 4.5 10 7 7.5 5.6zm4.6 4.6L10.7 8l1.4-2.5L10.7 3l2.5 1.4L16.2 3l-1.4 2.5L16.2 8l-2.5-1.4-1.4 1.4zm-4.6 4.6L5 16l1.4-2.5L5 11l2.5 1.4L10 11l-1.4 2.5L10 16l-2.5-1.4zm7.5 0L12.7 16l1.4-2.5L12.7 11l2.5 1.4L18.2 11l-1.4 2.5L18.2 16l-2.5-1.4z"/>
          </svg>
        </button>

        {/* Primary Action: Expand Player - Only for Spotify */}
        {currentPlayer === 'spotify' && (
          <button
            onClick={() => handleExpandedChange(true)}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-all duration-200 hover:scale-110"
            title={hasUserInteracted ? "Open Spotify Player" : "Open Spotify Player (Click to enable autoplay)"}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
            </svg>
          </button>
        )}

        {/* Hide Button */}
        <button
          onClick={() => {
            console.log('🎵 Hide button clicked!')
            setIsVisible(false)
          }}
          className="flex items-center justify-center w-7 h-7 rounded-full hover:bg-accent transition-all duration-200 text-foreground/60 hover:text-foreground group-hover:scale-110"
          title="Hide Music Player"
        >
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
      </div>
    </div>
  )
}

// Original Music Player Component (Alternative)
const LocalMusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true) // Start muted for better UX
  const [volume, setVolume] = useState(0.3) // Low volume for ambient effect
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    // Set initial volume and muted state
    audio.volume = volume
    audio.muted = isMuted
    audio.loop = true

    // Handle play/pause
    if (isPlaying && !isMuted) {
      audio.play().catch(() => {
        // Autoplay failed, user interaction required
        setIsPlaying(false)
      })
    } else {
      audio.pause()
    }
  }, [isPlaying, isMuted, volume])

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
    if (!isPlaying && isMuted) {
      setIsMuted(false) // Unmute when starting to play
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    if (isMuted && !isPlaying) {
      setIsPlaying(true) // Start playing when unmuting
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-[100] group">
      {/* Hidden audio element */}
      <audio 
        ref={audioRef}
        preload="none"
      >
        {/* You'll need to add your music file to the public folder */}
        <source src="/music/lofi-ambient.mp3" type="audio/mpeg" />
        <source src="/music/lofi-ambient.ogg" type="audio/ogg" />
      </audio>

      {/* Compact Music Player */}
      <div className="flex items-center gap-2 bg-background/90 border border-border/20 rounded-full px-3 py-2 shadow-lg transition-all duration-300 hover:bg-background hover:shadow-xl hover:scale-105" style={{ backdropFilter: 'none', filter: 'none' }}>
        
        {/* Status Indicator */}
        <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
          isPlaying && !isMuted ? 'bg-green-400 shadow-sm shadow-green-400/50' : 'bg-muted-foreground/40'
        }`} />

        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          className="flex items-center justify-center w-7 h-7 rounded-full hover:bg-accent transition-all duration-200 text-foreground/80 hover:text-foreground group-hover:scale-110"
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
            </svg>
          ) : (
            <svg className="w-3 h-3 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          )}
        </button>

        {/* Mute/Unmute Button */}
        <button
          onClick={toggleMute}
          className="flex items-center justify-center w-7 h-7 rounded-full hover:bg-accent transition-all duration-200 text-foreground/80 hover:text-foreground group-hover:scale-110"
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? (
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3.63 3.63a.996.996 0 000 1.41L7.29 8.7 7 9H4a1 1 0 00-1 1v4a1 1 0 001 1h3l3.29 3.29c.63.63 1.71.18 1.71-.71v-4.17l4.18 4.18c-.49.37-1.02.68-1.6.91-.36.15-.58.53-.58.92 0 .72.73 1.18 1.39.91.8-.33 1.55-.77 2.22-1.31l1.34 1.34a.996.996 0 101.41-1.41L5.05 3.63c-.39-.39-1.02-.39-1.42 0zM19 12c0 .82-.15 1.61-.41 2.34l1.53 1.53c.56-1.17.88-2.48.88-3.87 0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zm-7-8L9.91 6.09 12 8.18V4z"/>
            </svg>
          ) : (
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 9v6h4l5 5V4L7 9H3zm7-.17v6.34L7.83 13H5v-2h2.83L10 8.83z"/>
            </svg>
          )}
        </button>

        {/* Volume Slider - Only on Desktop */}
        <div className="hidden lg:flex items-center ml-1">
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-12 h-1 rounded-full appearance-none cursor-pointer opacity-70 hover:opacity-100 transition-opacity [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-foreground [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-2.5 [&::-moz-range-thumb]:h-2.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-foreground [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-none"
            style={{
              background: `linear-gradient(to right, hsl(var(--foreground)) 0%, hsl(var(--foreground)) ${volume * 100}%, hsl(var(--muted-foreground)) ${volume * 100}%, hsl(var(--muted-foreground)) 100%)`
            }}
          />
        </div>
      </div>
    </div>
  )
}

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
      let x = e.clientX
      let y = e.clientY
      
      // Advanced compensation for scroll-based section transforms
      const scrollY = window.scrollY
      const viewportHeight = window.innerHeight
      const heroExitProgress = Math.min(scrollY / (viewportHeight * 0.6), 1)
      const experienceProgress = Math.min(scrollY / (viewportHeight * 0.4), 1)
      
      // If we're in any transition zone, adjust cursor position
      if (scrollY > 0 && experienceProgress < 1) {
        const experienceSection = document.querySelector('[data-section="experience"]')
        if (experienceSection && e.target) {
          // Check if cursor is over experience section elements
          const isOverExperience = experienceSection.contains(e.target as Node) || 
                                   (e.target as Element).closest?.('[data-section="experience"]')
          
          if (isOverExperience) {
            // Calculate the exact transform being applied to the experience section
            const parallaxProgress = Math.min(scrollY / (viewportHeight * 0.4), 1)
            const smoothEase = 1 - Math.pow(1 - parallaxProgress, 2)
            const pushUpAmount = parallaxProgress * viewportHeight * 0.85 * smoothEase
            
            // Compensate cursor position to account for the upward transform
            // We need to reverse-engineer where the element actually is vs where the cursor thinks it is
            const compensationFactor = pushUpAmount * 0.05 // Fine-tuned compensation
            y = y + compensationFactor
          }
        }
      }
      
      mousePositionRef.current = { x, y }
      targetPositionRef.current = { x, y }
      setTargetPosition({ x, y })
    }

    // Track scroll state for cursor responsiveness optimization
    let isScrolling = false
    let scrollTimeout: NodeJS.Timeout | null = null
    const handleScroll = () => {
      isScrolling = true
      if (scrollTimeout) clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => {
        isScrolling = false
      }, 100)
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
        
        // Dynamic interpolation speed based on distance and scroll state
        const distanceX = Math.abs(targetPositionRef.current.x - currentX)
        const distanceY = Math.abs(targetPositionRef.current.y - currentY)
        const totalDistance = Math.sqrt(distanceX * distanceX + distanceY * distanceY)
        
        // Highly responsive interpolation with section-aware optimization
        let interpolationSpeed = 0.55 // Base speed increased from 0.45 to 0.55
        if (totalDistance < 3) interpolationSpeed = 0.85 // Very close - snap very quickly
        if (totalDistance > 80) interpolationSpeed = 0.75 // Large movements - much faster tracking
        if (isScrolling) interpolationSpeed = Math.min(interpolationSpeed * 1.4, 0.9) // Higher boost during scroll
        
        // Extra speed boost during section transitions for precision
        const scrollY = window.scrollY
        const viewportHeight = window.innerHeight
        const transitionZone = scrollY > 0 && scrollY < viewportHeight * 0.8
        if (transitionZone) interpolationSpeed = Math.min(interpolationSpeed * 1.2, 0.95)
        
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
    window.addEventListener('scroll', handleScroll, { passive: true })

    let currentElements = addEventListeners()
    animationRef.current = requestAnimationFrame(animateCursor)

    // Optimized DOM change observation with throttling
    let mutationTimeout: NodeJS.Timeout | null = null
    const observer = new MutationObserver(() => {
      // Throttle mutations to prevent lag during scroll animations
      if (mutationTimeout) clearTimeout(mutationTimeout)
      mutationTimeout = setTimeout(() => {
        currentElements.forEach(element => {
          element.removeEventListener('mouseenter', handleMouseEnter)
          element.removeEventListener('mouseleave', handleMouseLeave)
        })
        currentElements = addEventListeners()
      }, 16) // Delay by one frame to avoid blocking animations
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: false, // Don't observe attribute changes for better performance
      characterData: false // Don't observe text changes
    })

    return () => {
      document.removeEventListener('mousemove', updateMousePosition)
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('scroll', handleScroll)
      currentElements.forEach(element => {
        element.removeEventListener('mouseenter', handleMouseEnter)
        element.removeEventListener('mouseleave', handleMouseLeave)
      })
      observer.disconnect()
      if (mutationTimeout) clearTimeout(mutationTimeout)
      if (scrollTimeout) clearTimeout(scrollTimeout)
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

// Enhanced Parallax Hook with Modern Scroll Animations
const useParallax = () => {
  const [scrollY, setScrollY] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [viewportHeight, setViewportHeight] = useState(1000) // Initialize with a safe default to prevent NaN

  useEffect(() => {
    setViewportHeight(window.innerHeight)
    
    let ticking = false
    
    // Ultra-optimized scroll handler with RAF throttling
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrollY(window.scrollY)
          ticking = false
        })
        ticking = true
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20
      const y = (e.clientY / window.innerHeight - 0.5) * 20
      setMousePosition({ x, y })
    }

    const handleResize = () => {
      setViewportHeight(window.innerHeight)
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

  // Hero elements rip LEFT and RIGHT off screen with parallax
  const getHeroElementTransform = (direction: 'left' | 'right' | 'up' | 'down' = 'up', speed: number = 1) => {
    // Safety check to prevent division by zero
    if (viewportHeight === 0) return { opacity: 1 }
    
    const progress = Math.min(scrollY / (viewportHeight * 0.6), 1) // Medium scroll distance
    
    // Two clear phases: gentle movement, then violent sideways ripping
    const gentlePhase = Math.min(progress / 0.4, 1) // First 40% - gentle movement
    const ripPhase = Math.max(0, (progress - 0.4) / 0.6) // Last 60% - violent sideways exit
    
    let translateX = 0
    let translateY = 0
    let rotate = 0
    let scale = 1 - gentlePhase * 0.03 - ripPhase * 0.25 // Controlled shrinking
    let opacity = Math.max(1 - gentlePhase * 0.1 - ripPhase * 1.8, 0)
    
    // Safety check for NaN values
    if (isNaN(opacity)) opacity = 1
    
    // All elements rip to LEFT or RIGHT - never up/down
    const ripMultiplier = 1 + ripPhase * 2.5 // Accelerate ripping

    switch (direction) {
      case 'left':
        // Rip to the LEFT
        translateX = -(gentlePhase * 50 + ripPhase * 600) * speed * ripMultiplier
        rotate = -(gentlePhase * 3 + ripPhase * 20)
        translateY = (gentlePhase * 5 + ripPhase * 30) * speed // Slight downward drift
        break
      case 'right':
        // Rip to the RIGHT  
        translateX = (gentlePhase * 50 + ripPhase * 600) * speed * ripMultiplier
        rotate = (gentlePhase * 3 + ripPhase * 20)
        translateY = (gentlePhase * 5 + ripPhase * 30) * speed // Slight downward drift
        break
      case 'up':
        // UP elements also rip to LEFT
        translateX = -(gentlePhase * 40 + ripPhase * 500) * speed * ripMultiplier
        rotate = -(gentlePhase * 2 + ripPhase * 15)
        translateY = (gentlePhase * 8 + ripPhase * 40) * speed // Slight downward
        break
      case 'down':
        // DOWN elements rip to RIGHT
        translateX = (gentlePhase * 40 + ripPhase * 500) * speed * ripMultiplier
        rotate = (gentlePhase * 2 + ripPhase * 15)
        translateY = (gentlePhase * 8 + ripPhase * 40) * speed // Slight downward
        break
    }

    // Dramatic color degradation as elements rip away
    const brightness = Math.max(1 - gentlePhase * 0.4 - ripPhase * 0.9, 0.05) // Fade to almost black
    const contrast = Math.max(1 - gentlePhase * 0.3 - ripPhase * 0.8, 0.2) // Massive contrast reduction
    const saturation = Math.max(1 - gentlePhase * 0.5 - ripPhase * 1.2, 0) // Complete desaturation
    const hueRotate = gentlePhase * 15 + ripPhase * 45 // Color shift as they tear away

    return {
      transform: `translate3d(${translateX}px, ${translateY}px, 0) rotate(${rotate}deg) scale(${scale})`,
      opacity,
      filter: `blur(${gentlePhase * 2 + ripPhase * 18}px) brightness(${brightness}) contrast(${contrast}) saturate(${saturation}) hue-rotate(${hueRotate}deg)`,
      willChange: 'transform, opacity, filter',
      backfaceVisibility: 'hidden' as const,
      transformOrigin: translateX < 0 ? 'right center' : 'left center',
      pointerEvents: gentlePhase > 0.05 ? 'none' as const : 'auto' as const, // Much earlier disable to prevent cursor lag
    }
  }

  const getExperienceElementTransform = (index: number, delay: number = 0): React.CSSProperties => {
    // Safety check to prevent division by zero
    if (viewportHeight === 0) return { opacity: 1 }
    
    const startPoint = viewportHeight * 0.1 // Start earlier - reduced from 0.15 to 0.1
    const progress = Math.max(0, Math.min((scrollY - startPoint) / (viewportHeight * 0.12), 1)) // Faster entrance - reduced from 0.15 to 0.12
    const adjustedProgress = Math.max(0, progress - (delay * 0.03)) // Faster stagger - reduced from 0.05 to 0.03
    
    // Simple smooth entrance for parallax
    const smoothEase = adjustedProgress < 0 ? 0 : 1 - Math.pow(1 - adjustedProgress, 2) // Quadratic ease-out
    
    // Only apply entrance animation if not fully loaded yet
    if (smoothEase >= 0.9) { // Earlier completion - reduced from 0.95 to 0.9
      return {
        willChange: 'auto',
        backfaceVisibility: 'visible' as const,
        pointerEvents: 'auto' as const,
      }
    }
    
    const finalOpacity = smoothEase < 0.1 ? 0 : smoothEase
    // Safety check for NaN values
    const safeOpacity = isNaN(finalOpacity) ? 1 : finalOpacity
    
    return {
      transform: `translate3d(0, ${20 - (smoothEase * 20)}px, 0)`,
      opacity: safeOpacity,
      filter: `blur(${(1 - smoothEase) * 2}px)`,
      pointerEvents: (smoothEase < 0.3 ? 'none' : 'auto') as 'none' | 'auto', // Earlier enable for better responsiveness
      willChange: 'transform, opacity, filter',
      backfaceVisibility: 'hidden' as const,
    }
  }

  // Resume slides in FRONT - dominates the hero
  const getExperienceSectionPushTransform = () => {
    // Safety check to prevent division by zero
    if (viewportHeight === 0) return { transform: 'translate3d(0, 0, 0)' }
    
    const parallaxProgress = Math.min(scrollY / (viewportHeight * 0.4), 1) // Start even earlier - reduced from 0.5 to 0.4
    const pushUpAmount = parallaxProgress * viewportHeight * 0.5 // Further reduced movement - decreased from 0.65 to 0.5
    
    // Smooth parallax easing - no dramatic acceleration
    const smoothEase = 1 - Math.pow(1 - parallaxProgress, 2) // Simple quadratic ease-out
    
    return {
      transform: `translate3d(0, ${-pushUpAmount * smoothEase}px, 0)`,
      zIndex: 50, // IN FRONT of hero content - slides over it
      willChange: 'transform',
      backfaceVisibility: 'hidden' as const,
    }
  }

  // Hero fades and blurs dramatically as resume overtakes it
  const getHeroExitTransform = () => {
    // Safety check to prevent division by zero
    if (viewportHeight === 0) return { opacity: 1 }
    
    const exitProgress = Math.min(scrollY / (viewportHeight * 0.6), 1) // Medium scroll distance
    
    // Two phases: gentle start, then violent sideways ripping
    const gentlePhase = Math.min(exitProgress / 0.5, 1) // First 50% - gentle movement
    const ripPhase = Math.max(0, (exitProgress - 0.5) / 0.5) // Last 50% - violent sideways rip
    
    // Dramatic color fading and blur
    const scale = 1 - gentlePhase * 0.05 - ripPhase * 0.2
    let opacity = Math.max(1 - gentlePhase * 0.4 - ripPhase * 2.0, 0) // Much more aggressive fading
    
    // Safety check for NaN values
    if (isNaN(opacity)) opacity = 1
    const brightness = Math.max(1 - gentlePhase * 0.3 - ripPhase * 0.8, 0.1) // Fade to near black
    const contrast = Math.max(1 - gentlePhase * 0.2 - ripPhase * 0.6, 0.3) // Reduce contrast dramatically
    const saturation = Math.max(1 - gentlePhase * 0.4 - ripPhase * 1.0, 0) // Completely desaturate
    
    return {
      transform: `translate3d(0, 0, 0) scale(${scale})`, // No vertical movement for container
      opacity,
      filter: `blur(${gentlePhase * 3 + ripPhase * 15}px) brightness(${brightness}) contrast(${contrast}) saturate(${saturation})`,
      willChange: 'transform, opacity, filter',
      backfaceVisibility: 'hidden' as const,
      zIndex: 1, // BEHIND the sliding resume
      pointerEvents: gentlePhase > 0.05 ? 'none' as const : 'auto' as const, // Much earlier disable to sync with hero elements
    }
  }

  // Featured Projects aggressive push up effect - inverse to experience push
  const getFeaturedProjectsFadeTransform = () => {
    // Safety check to prevent division by zero
    if (viewportHeight === 0) return { opacity: 0.1, transform: 'translate3d(0, 0, 0)' }
    
    // Slightly extended scroll trigger for full force effect
    const fadeProgress = Math.min(scrollY / (viewportHeight * 0.5), 1) // Slightly longer trigger for full force effect
    
    // Balanced easing curves - quicker completion but dramatic start
    const smoothEase = fadeProgress < 0 ? 0 : 1 - Math.pow(1 - fadeProgress, 2) // Faster completion curve
    const lateAcceleration = Math.pow(fadeProgress, 0.4) // Moderate acceleration
    
    // Quicker full effect while keeping dramatic initial appearance
    const opacity = Math.max(0.0006, Math.min(smoothEase * 1.4, 1)) // Quicker opacity progression to full effect
    const blur = Math.max(50 - (smoothEase * 50), 0) // Blur reaches clear state quicker (100% rate)
    const scale = Math.min(0.6 + (smoothEase * 0.4), 1) // Scale reaches full size quicker (100% rate)
    
    // Maximally refined push up with gradual progression over longer scroll
    const basePush = 85 - (smoothEase * 0.7 * 85) // Maximally refined base push (70% rate)
    const aggressivePush = lateAcceleration * 60 // Maximally refined aggressive push for later scroll
    const translateY = Math.max(basePush + aggressivePush, 0) // Combined maximally refined push effect
    
    // Enhanced shadow with more dramatic depth
    const shadowOpacity = Math.min(smoothEase * 0.8, 0.8)
    const shadowSize = 50 + (lateAcceleration * 50) // Growing shadow size
    
    return {
      opacity,
      transform: `translate3d(0, ${-translateY}px, 0) scale(${scale})`,
      filter: `blur(${blur}px)`,
      boxShadow: `0 ${shadowSize}px ${shadowSize * 2}px rgba(0, 0, 0, ${shadowOpacity})`,
      willChange: 'transform, opacity, filter, box-shadow',
      backfaceVisibility: 'hidden' as const,
    }
  }

  return { 
    scrollY, 
    mousePosition, 
    viewportHeight,
    getSectionTransform, 
    getElementTransform,
    getHeroElementTransform,
    getExperienceElementTransform,
    getExperienceSectionPushTransform,
    getHeroExitTransform,
    getFeaturedProjectsFadeTransform
  }
}

// Floating Background Elements Component
const FloatingElements = ({ section }: { section: string }) => {
  const { scrollY, mousePosition, getElementTransform } = useParallax()
  
  if (section === 'hero') {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-400/8 to-purple-400/8 rounded-full blur-xl"
          style={{ 
            transform: getElementTransform(0.1, 0.5),
            pointerEvents: 'none' // Ensure no cursor interference
          }}
        />
        <div 
          className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-green-400/8 to-cyan-400/8 rounded-full blur-lg"
          style={{ 
            transform: getElementTransform(0.2, -0.3),
            pointerEvents: 'none' // Ensure no cursor interference
          }}
        />
        <div 
          className="absolute bottom-20 left-1/4 w-40 h-40 bg-gradient-to-br from-purple-400/8 to-pink-400/8 rounded-full blur-2xl"
          style={{ 
            transform: getElementTransform(0.15, 0.4),
            pointerEvents: 'none' // Ensure no cursor interference
          }}
        />
      </div>
    )
  }

  if (section === 'experience') {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-20 right-1/4 w-28 h-28 bg-gradient-to-br from-cyan-400/8 to-blue-400/8 rounded-full blur-xl"
          style={{ 
            transform: getElementTransform(0.15, 0.3),
            pointerEvents: 'none' // Ensure no cursor interference
          }}
        />
        <div 
          className="absolute bottom-10 left-1/3 w-32 h-32 bg-gradient-to-br from-purple-400/8 to-pink-400/8 rounded-full blur-2xl"
          style={{ 
            transform: getElementTransform(0.1, -0.2),
            pointerEvents: 'none' // Ensure no cursor interference
          }}
        />
      </div>
    )
  }

  if (section === 'projects') {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-0 left-1/4 w-20 h-20 bg-gradient-to-br from-orange-400/8 to-red-400/8 rounded-full blur-lg"
          style={{ 
            transform: getElementTransform(0.4, 0.2),
            pointerEvents: 'none' // Ensure no cursor interference
          }}
        />
        <div 
          className="absolute bottom-10 right-1/3 w-16 h-16 bg-gradient-to-br from-teal-400/8 to-green-400/8 rounded-full blur-lg"
          style={{ 
            transform: getElementTransform(0.35, -0.2),
            pointerEvents: 'none' // Ensure no cursor interference
          }}
        />
      </div>
    )
  }

  if (section === 'contact') {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-20 right-10 w-12 h-12 bg-gradient-to-br from-blue-400/8 to-cyan-400/8 rounded-full blur-lg"
          style={{ 
            transform: getElementTransform(0.3, 0.3),
            pointerEvents: 'none' // Ensure no cursor interference
          }}
        />
        <div 
          className="absolute bottom-10 left-10 w-16 h-16 bg-gradient-to-br from-purple-400/8 to-pink-400/8 rounded-full blur-xl"
          style={{ 
            transform: getElementTransform(0.05, -0.2),
            pointerEvents: 'none' // Ensure no cursor interference
          }}
        />
      </div>
    )
  }

  return null
}

// Featured Projects Carousel Component
const FeaturedProjectsCarousel = ({ 
  mousePosition, 
  getSectionTransform
}: { 
  mousePosition: { x: number; y: number }; 
  getSectionTransform: (speed: number) => any;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const dragX = useMotionValue(0)
  
  // Project data
  const projects = [
    {
      id: 1,
      emoji: '🤖',
      title: 'AR Automation Platform',
      description: 'End-to-end accounts receivable automation using multi-agent LLM orchestration, RAG techniques, and real-time payment processing.',
      tags: ['PySpark', 'LLM', 'RAG', 'Foundry', 'TypeScript'],
      gradient: 'from-blue-500/20 to-cyan-500/20',
      accentColor: 'text-cyan-400',
      shadowColor: 'shadow-cyan-500/20'
    },
    {
      id: 2,
      emoji: '📈',
      title: 'Pricing Intelligence Platform',
      description: 'Bayesian optimization models with demand curve simulation and real-time anomaly detection driving $10M+ revenue impact.',
      tags: ['Bayesian Optimization', 'Python', 'Real-time Analytics', 'ML Models'],
      gradient: 'from-emerald-500/20 to-green-500/20',
      accentColor: 'text-emerald-400',
      shadowColor: 'shadow-emerald-500/20'
    },
    {
      id: 3,
      emoji: '🏆',
      title: 'A Special Miracle',
      description: 'Founded a non-profit organization focused on community impact and social good initiatives.',
      tags: ['Leadership', 'Non-Profit', 'Community Impact'],
      gradient: 'from-purple-500/20 to-pink-500/20',
      accentColor: 'text-purple-400',
      shadowColor: 'shadow-purple-500/20',
      link: 'https://aspecialmiracle.org'
    },
    {
      id: 4,
      emoji: '💼',
      title: 'Revenue Intelligence Suite',
      description: 'ML-driven sales forecasting and CRM optimization platform improving pipeline hygiene and customer engagement.',
      tags: ['ML Forecasting', 'CRM', 'Python', 'API Integration'],
      gradient: 'from-orange-500/20 to-red-500/20',
      accentColor: 'text-orange-400',
      shadowColor: 'shadow-orange-500/20'
    }
  ]

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

  // Auto-advance carousel when visible
  useEffect(() => {
    if (!isVisible || isDragging) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % projects.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [isVisible, isDragging, projects.length])

  // Calculate transforms for infinite loop effect
  const getProjectTransform = (index: number) => {
    const totalProjects = projects.length
    const offset = index - currentIndex
    
    // Normalize to handle infinite loop
    let normalizedOffset = offset
    if (offset > totalProjects / 2) {
      normalizedOffset = offset - totalProjects
    } else if (offset < -totalProjects / 2) {
      normalizedOffset = offset + totalProjects
    }

    const translateX = normalizedOffset * 320 + (isDragging ? 0 : 0)
    const scale = Math.max(0.7, 1 - Math.abs(normalizedOffset) * 0.15)
    const opacity = Math.max(0.3, 1 - Math.abs(normalizedOffset) * 0.3)
    const rotateY = normalizedOffset * -15
    const zIndex = 10 - Math.abs(normalizedOffset)

    return {
      x: translateX,
      scale,
      opacity,
      rotateY,
      zIndex,
      filter: `blur(${Math.abs(normalizedOffset) * 1}px)`,
    }
  }

  const handleDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 100
    
    if (Math.abs(info.offset.x) > threshold) {
      if (info.offset.x > 0) {
        setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length)
      } else {
        setCurrentIndex((prev) => (prev + 1) % projects.length)
      }
    }
  }

  return (
    <motion.section 
      ref={sectionRef}
      className="relative py-8 -mt-64 overflow-hidden"
      style={{ 
        transform: getSectionTransform(-0.015),
        background: `linear-gradient(135deg, 
          hsl(var(--background))/95 0%, 
          hsl(var(--card))/85 100%)`,
        backdropFilter: 'blur(8px)',
      }}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <FloatingElements section="projects" />
      
      {/* Header */}
      <motion.div 
        className="mb-12 flex items-center justify-between"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <h2 className="text-3xl font-bold text-foreground bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text">
          Featured Projects
        </h2>
        <div className="flex items-center gap-4">
          {/* Progress indicator */}
          <div className="flex gap-2">
            {projects.map((_, index) => (
              <motion.div
                key={index}
                className={`h-2 rounded-full cursor-pointer transition-all duration-300 ${
                  index === currentIndex 
                    ? 'w-8 bg-gradient-to-r from-cyan-400 to-blue-500' 
                    : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
                onClick={() => setCurrentIndex(index)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              />
            ))}
          </div>
          
          <a href="#" className="group flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
            <span>View all</span>
            <motion.span 
              className="relative"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <svg className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" viewBox="0 0 24 24" fill="currentColor">
                <path className="origin-[12px_12px] transition-transform duration-300 group-hover:rotate-12" d="M4 8c0-2 2-4 8-4s8 2 8 4v2H4V8z"/>
                <path className="origin-[12px_12px] transition-transform duration-300 group-hover:-rotate-12" d="M4 14c0 2 2 4 8 4s8-2 8-4v-2H4v2z"/>
                <path className="opacity-80" d="M6 10h1v2H6v-2zm2 0h1v2H8v-2zm2 0h1v2h-1v-2zm2 0h1v2h-1v-2zm2 0h1v2h-1v-2zm2 0h1v2h-1v-2z"/>
                <circle cx="8" cy="6" r="1"/>
                <circle cx="16" cy="6" r="1"/>
              </svg>
            </motion.span>
          </a>
        </div>
      </motion.div>

      {/* Carousel Container */}
      <div className="relative h-80 flex items-center justify-center perspective-1000">
        <div className="relative w-full max-w-6xl">
          {projects.map((project, index) => {
            const transform = getProjectTransform(index)
            
            return (
              <motion.div
                key={project.id}
                className="absolute left-1/2 top-1/2 w-72 cursor-grab active:cursor-grabbing"
                style={{
                  zIndex: transform.zIndex,
                  transformOrigin: 'center center',
                }}
                animate={{
                  x: `calc(-50% + ${transform.x}px)`,
                  y: '-50%',
                  scale: transform.scale,
                  opacity: transform.opacity,
                  rotateY: transform.rotateY,
                  filter: transform.filter,
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                  mass: 0.8,
                }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragStart={() => setIsDragging(true)}
                onDragEnd={(event, info) => {
                  setIsDragging(false)
                  handleDrag(event, info)
                }}
                whileHover={index === currentIndex ? { 
                  scale: transform.scale * 1.05,
                  rotateY: transform.rotateY * 0.5,
                } : {}}
                whileTap={{ scale: transform.scale * 0.95 }}
              >
                <div 
                  className={`relative rounded-2xl border border-border/50 bg-gradient-to-br ${project.gradient} backdrop-blur-sm p-6 transition-all duration-300 hover:border-border group ${project.shadowColor} shadow-xl`}
                  style={{
                    transform: `translate3d(${mousePosition.x * 0.005}px, ${mousePosition.y * 0.005}px, 0)`,
                    background: `linear-gradient(135deg, hsl(var(--card) / 0.8), hsl(var(--card) / 0.4))`,
                  }}
                >
                  {/* Accent gradient overlay */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${project.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />
                  
                  {/* Content */}
                  <div className="relative z-10">
                    <motion.div 
                      className="mb-4 text-4xl"
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      {project.emoji}
                    </motion.div>
                    
                    <h3 className={`mb-3 text-xl font-bold ${project.accentColor} group-hover:text-foreground transition-colors`}>
                      {project.title}
                    </h3>
                    
                    <p className="mb-4 text-sm text-muted-foreground leading-relaxed line-clamp-3">
                      {project.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.map((tag, tagIndex) => (
                        <motion.span
                          key={tagIndex}
                          className="rounded-full bg-secondary/80 px-3 py-1 text-xs text-secondary-foreground backdrop-blur-sm border border-border/30"
                          whileHover={{ scale: 1.05, y: -2 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                          {tag}
                        </motion.span>
                      ))}
                    </div>

                    {project.link && (
                      <motion.a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-2 text-sm ${project.accentColor} hover:text-foreground transition-colors group/link`}
                        whileHover={{ x: 5 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        <span>🌐 Visit Website</span>
                        <motion.svg 
                          className="w-4 h-4" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                          whileHover={{ x: 3, y: -3 }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </motion.svg>
                      </motion.a>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2">
        <motion.button
          onClick={() => setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length)}
          className="w-12 h-12 rounded-full bg-background/80 border border-border backdrop-blur-sm flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-background transition-all duration-300 shadow-lg"
          whileHover={{ scale: 1.1, x: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </motion.button>
      </div>

      <div className="absolute right-8 top-1/2 -translate-y-1/2">
        <motion.button
          onClick={() => setCurrentIndex((prev) => (prev + 1) % projects.length)}
          className="w-12 h-12 rounded-full bg-background/80 border border-border backdrop-blur-sm flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-background transition-all duration-300 shadow-lg"
          whileHover={{ scale: 1.1, x: 2 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </motion.button>
      </div>
    </motion.section>
  )
}

export default function Home() {
  // State management
  const [showAboutModal, setShowAboutModal] = useState(false)
  const [selectedProject, setSelectedProject] = useState<ProjectId | null>(null)
  const [activeTab, setActiveTab] = useState('work')
  const [activeTimelineItem, setActiveTimelineItem] = useState<string | null>('palantir')
  const [isSpotifyExpanded, setIsSpotifyExpanded] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  
  const { isDark, toggleDarkMode, isClient } = useDarkMode()
  const { 
    scrollY, 
    mousePosition, 
    viewportHeight,
    getSectionTransform, 
    getElementTransform,
    getHeroElementTransform,
    getExperienceElementTransform,
    getExperienceSectionPushTransform,
    getHeroExitTransform,
    getFeaturedProjectsFadeTransform
  } = useParallax()
  
  // Smooth scroll functions
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setActiveSection(sectionId)
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setActiveSection('home')
  }

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      // Update active section based on scroll position
      const sections = ['home', 'projects', 'contact']
      const currentSection = sections.find(section => {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          return rect.top <= 100 && rect.bottom >= 100
        }
        return false
      })
      
      if (currentSection) {
        setActiveSection(currentSection)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Project click handler
  const handleProjectClick = (projectId: ProjectId) => {
    setSelectedProject(projectId)
  }

  // Add gradient animation styles and scroll effects
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

      @keyframes slideInFromBottom {
        0% {
          opacity: 0;
          transform: translateY(50px) scale(0.95);
          filter: blur(10px);
        }
        100% {
          opacity: 1;
          transform: translateY(0) scale(1);
          filter: blur(0);
        }
      }

      @keyframes slideOutToSide {
        0% {
          opacity: 1;
          transform: translateX(0) scale(1) rotate(0deg);
          filter: blur(0);
        }
        100% {
          opacity: 0;
          transform: translateX(-100px) scale(0.9) rotate(-5deg);
          filter: blur(8px);
        }
      }

      /* Ultra-smooth scroll behavior with performance optimizations */
      html {
        scroll-behavior: smooth;
        /* transform-style: preserve-3d; TEMPORARILY DISABLED FOR TESTING */
      }

      /* Create a separate stacking context for fixed elements */
      .fixed-viewport-layer {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
        pointer-events: none !important;
        z-index: 999998 !important;
        transform: none !important;
        transform-style: flat !important;
        perspective: none !important;
      }

      /* Global performance optimizations */
      * {
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }

      /* Optimized sections for hardware acceleration */
      section {
        transform-style: preserve-3d;
        backface-visibility: hidden;
      }

      /* Custom scrollbar for modern look */
      ::-webkit-scrollbar {
        width: 8px;
      }

      ::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.1);
      }

      ::-webkit-scrollbar-thumb {
        background: linear-gradient(180deg, #3b82f6, #1e40af);
        border-radius: 4px;
      }

      ::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(180deg, #1e40af, #1e3a8a);
      }

      /* Force hardware acceleration for transitions */
      .hero-transition {
        will-change: transform, opacity, filter;
        transform-style: preserve-3d;
        backface-visibility: hidden;
      }

      /* Music player positioning within the viewport layer */
      .music-player-fixed {
        position: absolute !important;
        top: calc(100vh - 100px) !important;
        bottom: auto !important;
        left: auto !important;
        right: 88px !important;
        z-index: 1 !important;
        pointer-events: auto !important;
      }

      /* Optimize animations */
      @media (prefers-reduced-motion: no-preference) {
        .smooth-transition {
          transition: transform 0.16ms cubic-bezier(0.4, 0, 0.2, 1);
        }
      }
    `
    document.head.appendChild(style)
    return () => {
      document.head.removeChild(style)
    }
  }, [])
  // Remove tab switching - now using smooth scroll navigation
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

  // Create viewport overlay for fixed positioning that works with transforms
  const [musicPlayerContainer, setMusicPlayerContainer] = useState<HTMLElement | null>(null)
  const [themeToggleContainer, setThemeToggleContainer] = useState<HTMLElement | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Create viewport overlay that ignores all page transforms
    let viewportOverlay = document.getElementById('viewport-overlay')
    if (!viewportOverlay) {
      viewportOverlay = document.createElement('div')
      viewportOverlay.id = 'viewport-overlay'
      viewportOverlay.style.cssText = `
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
        pointer-events: none !important;
        z-index: 999999 !important;
        transform: none !important;
        filter: none !important;
        perspective: none !important;
        transform-style: flat !important;
        isolation: isolate !important;
      `
      document.body.appendChild(viewportOverlay)
    }

    // Create theme toggle container inside the overlay (rightmost position)
    let themeContainer = document.getElementById('theme-toggle-root')
    if (!themeContainer) {
      themeContainer = document.createElement('div')
      themeContainer.id = 'theme-toggle-root'
      themeContainer.style.cssText = `
        position: absolute !important;
        bottom: 24px !important;
        right: 24px !important;
        z-index: 1 !important;
        pointer-events: auto !important;
        transform: none !important;
        filter: none !important;
        perspective: none !important;
        transform-style: flat !important;
        isolation: isolate !important;
      `
      viewportOverlay.appendChild(themeContainer)
      setThemeToggleContainer(themeContainer)
    }

    // Create music player container inside the overlay (positioned further to the left of theme toggle)
    let musicContainer = document.getElementById('music-player-root')
    if (!musicContainer) {
      musicContainer = document.createElement('div')
      musicContainer.id = 'music-player-root'
      musicContainer.style.cssText = `
        position: absolute !important;
        bottom: 24px !important;
        right: 100px !important;
        z-index: 1 !important;
        pointer-events: auto !important;
        transform: none !important;
        filter: none !important;
        perspective: none !important;
        transform-style: flat !important;
        isolation: isolate !important;
      `
      viewportOverlay.appendChild(musicContainer)
      setMusicPlayerContainer(musicContainer)
    }

    return () => {
      // Cleanup on unmount
      const overlay = document.getElementById('viewport-overlay')
      if (overlay && overlay.parentNode) {
        overlay.parentNode.removeChild(overlay)
      }
      setMusicPlayerContainer(null)
      setThemeToggleContainer(null)
    }
  }, [])

  return (
    <React.Fragment>
      {/* Fixed positioned elements must be outside of transformed containers */}
      <CustomCursor />
      
      {/* Music Player Portal - Render into viewport overlay */}
      {musicPlayerContainer && createPortal(
        <HybridMusicPlayer 
          playlistId="37i9dQZF1DZ06evO3qQrNm"
          youtubeVideoId="5i8W1z9zkE0"
          youtubeStartTime="5448"
          onExpandedChange={setIsSpotifyExpanded}
        />,
        musicPlayerContainer
      )}

      {/* Theme Toggle Portal - Render into viewport overlay */}
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
              <li><button onClick={() => scrollToSection('projects')} className="text-sm transition-colors hover:text-foreground text-muted-foreground hover:text-foreground">Projects</button></li>
              <li><button onClick={() => setShowAboutModal(true)} className="text-sm transition-colors hover:text-foreground text-muted-foreground hover:text-foreground">About</button></li>
              <li><button onClick={() => scrollToSection('contact')} className="text-sm transition-colors hover:text-foreground text-muted-foreground hover:text-foreground">Contact</button></li>
        </ul>
            <div className="flex items-center space-x-3">
            </div>
          </nav>
        </div>
      </header>

            <div className="mx-auto max-w-5xl px-6">
        
        {/* Main Content - Continuous Scroll Layout */}
        <div>
        {/* Hero Section */}
        <section 
          className="relative py-4 overflow-hidden"
          style={{ 
            ...getHeroExitTransform(),
            backfaceVisibility: 'hidden',
            perspective: '1000px',
            background: 'radial-gradient(ellipse at top, hsl(var(--background) / 0.9) 0%, hsl(var(--background) / 0.6) 30%, hsl(var(--background) / 0.3) 60%, hsl(var(--background) / 0.1) 85%, transparent 100%)',
          }}
        >
          <FloatingElements section="hero" />
          
          {/* Enhanced Background Grid Pattern with Parallax */}
          <div 
            className="absolute inset-0 opacity-30 transition-all duration-1000"
            style={{
              transform: `translateY(${-scrollY * 0.08}px) scale(${1 + (scrollY / (viewportHeight * 0.4)) * 0.15})`, // Gentler movement and scaling
              opacity: viewportHeight > 0 ? Math.max(1 - (scrollY / (viewportHeight * 0.4)) * 1.8, 0) : 1, // Smoother dissipation with safety check
              filter: `blur(${(scrollY / (viewportHeight * 0.4)) * 12}px)`, // Gentler progressive blur
              transition: 'transform 0.2s ease-out, opacity 0.2s ease-out', // Smooth transitions
              pointerEvents: 'none' // Fix cursor issues
            }}
          >
            <div className="absolute inset-0" style={{
              backgroundImage: `
                radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
                radial-gradient(circle at 75% 75%, rgba(168, 85, 247, 0.15) 0%, transparent 50%),
                radial-gradient(circle at 50% 50%, rgba(34, 197, 94, 0.08) 0%, transparent 60%)
              `,
            }} />
            
            {/* Animated Particles */}
            <div 
              className="absolute inset-0"
              style={{
                backgroundImage: `
                  radial-gradient(1px 1px at 20% 30%, rgba(59, 130, 246, 0.4), transparent),
                  radial-gradient(1px 1px at 40% 70%, rgba(168, 85, 247, 0.3), transparent),
                  radial-gradient(1px 1px at 80% 20%, rgba(34, 197, 94, 0.3), transparent)
                `,
                backgroundSize: '200px 200px, 150px 150px, 100px 100px',
                animation: 'gradient-shift 8s ease-in-out infinite'
              }}
            />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4">
            {/* Main Content Grid */}
            <div className="grid gap-3 lg:grid-cols-12 lg:gap-4 items-start">
              
              {/* Left Column - Main Content */}
              <div className="lg:col-span-7 space-y-3">
                
                {/* Hero Navigation - Sleek & Elegant */}
                <div 
                  className="flex justify-center mb-4 transition-all duration-500"
                  style={{
                    transform: `${scrollY > 100 ? 'translateY(-20px)' : 'translateY(0)'} ${getHeroElementTransform('up', 0.3).transform || ''}`,
                    opacity: scrollY > 100 ? 0 : (getHeroElementTransform('up', 0.3).opacity as number || 1),
                  }}
                >
                  <nav className="relative group">
                    {/* Subtle outer glow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-cyan-400/10 to-cyan-500/5 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <div className="relative bg-background/10 backdrop-blur-md rounded-full border border-border/20 px-4 py-2 shadow-lg shadow-black/10">
                      <ul className="flex items-center space-x-4">
                        <li>
                          <button 
                            onClick={scrollToTop} 
                            className="relative px-2.5 py-1 text-sm font-medium text-muted-foreground hover:text-cyan-300 transition-all duration-200 hover:scale-105 group/item"
                          >
                            Home
                            <div className="absolute bottom-0 left-1/2 h-px bg-gradient-to-r from-cyan-400 to-cyan-300 w-0 group-hover/item:w-full -translate-x-1/2 transition-all duration-200 shadow-sm shadow-cyan-400/50"></div>
                          </button>
                        </li>
                        
                        <li>
                          <button 
                            onClick={() => scrollToSection('projects')} 
                            className="relative px-2.5 py-1 text-sm font-medium transition-all duration-200 hover:scale-105 group/item text-muted-foreground hover:text-cyan-300"
                          >
                            Projects
                            <div className="absolute bottom-0 left-1/2 h-px bg-gradient-to-r from-cyan-400 to-cyan-300 transition-all duration-200 -translate-x-1/2 shadow-sm shadow-cyan-400/50 w-0 group-hover/item:w-full"></div>
                          </button>
                        </li>
                        
                        <li>
                          <button 
                            onClick={() => setShowAboutModal(true)} 
                            className="relative px-2.5 py-1 text-sm font-medium transition-all duration-200 hover:scale-105 group/item text-muted-foreground hover:text-cyan-300"
                          >
                            About
                            <div className="absolute bottom-0 left-1/2 h-px bg-gradient-to-r from-cyan-400 to-cyan-300 transition-all duration-200 -translate-x-1/2 shadow-sm shadow-cyan-400/50 w-0 group-hover/item:w-full"></div>
                          </button>
                        </li>
                        
                        <li>
                          <button 
                            onClick={() => scrollToSection('contact')} 
                            className="relative px-2.5 py-1 text-sm font-medium transition-all duration-200 hover:scale-105 group/item text-muted-foreground hover:text-cyan-300"
                          >
                            Contact
                            <div className="absolute bottom-0 left-1/2 h-px bg-gradient-to-r from-cyan-400 to-cyan-300 transition-all duration-200 -translate-x-1/2 shadow-sm shadow-cyan-400/50 w-0 group-hover/item:w-full"></div>
                          </button>
                        </li>
                      </ul>
                    </div>
                  </nav>
                </div>
                
                {/* Intro Card */}
                <div 
                  className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-sm border border-border/50 p-3 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/10 hero-transition"
                  style={getHeroElementTransform('left', 1)}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10">
                    <div className="mb-3 flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-xs text-muted-foreground">Actively looking for internships for Fall 2025</span>
                    </div>
                                        <h1 
                      className="mb-2 text-xl font-bold tracking-tight lg:text-3xl bg-gradient-to-r from-slate-500 via-cyan-300 via-cyan-500 via-blue-400 to-slate-600 bg-clip-text text-transparent"
                      style={{
                        backgroundSize: '300% 300%',
                        animation: 'gradient-shift 4s ease infinite'
                      }}
                    >
                      Hi, I'm Elijah Deangulo
                    </h1>
                    <div className="mb-2 text-sm text-muted-foreground">
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
                <div 
                  className="grid gap-2.5 sm:grid-cols-3"
                  style={getHeroElementTransform('up', 0.8)}
                >
                  <div 
                    className="group relative overflow-hidden rounded-lg bg-card/60 backdrop-blur-sm border border-border/50 p-2.5 transition-all duration-300 hover:scale-105 hover:bg-accent/20"
                  >
                    <div className="text-base font-bold text-primary mb-0.5">4.0</div>
                    <div className="text-xs text-muted-foreground">Current Grad GPA</div>
                    <div className="absolute top-1 right-1 opacity-50 group-hover:opacity-100 transition-opacity">
                      <div className="text-xs transition-transform group-hover:scale-110 group-hover:rotate-6">🐊</div>
                    </div>
                  </div>
                  
                  <div 
                    className="group relative overflow-hidden rounded-lg bg-card/60 backdrop-blur-sm border border-border/50 p-2.5 transition-all duration-300 hover:scale-105 hover:bg-accent/20"
                  >
                    <div className="text-base font-bold text-primary mb-0.5">Florida</div>
                    <div className="text-xs text-muted-foreground">Ft. Lauderdale</div>
                    <div className="absolute top-1 right-1 text-sm opacity-50">🌴</div>
                  </div>
                  
                  <div 
                    className="group relative overflow-hidden rounded-lg bg-card/60 backdrop-blur-sm border border-border/50 p-2.5 transition-all duration-300 hover:scale-105 hover:bg-accent/20"
                  >
                    <div className="text-base font-bold text-primary mb-0.5">4+</div>
                    <div className="text-xs text-muted-foreground">Years Experience</div>
                    <div className="absolute top-1 right-1 text-sm opacity-50">⚡</div>
                  </div>
                </div>

                {/* Description Card */}
                <div 
                  className="rounded-lg bg-card/30 backdrop-blur-sm border border-border/50 p-2.5"
                  style={getHeroElementTransform('down', 0.6)}
                >
                  <div className="space-y-3 text-muted-foreground text-sm">
                    <p className="leading-relaxed">
                      Currently pursuing my <strong className="text-foreground">MS in Business Analytics at UF</strong> while interning as a <strong className="text-foreground">Deployment Strategist at Palantir</strong>. I specialize in building AI-powered solutions that drive measurable business impact.
                    </p>
                    <p className="leading-relaxed">
                      My passion lies at the intersection of <strong className="text-foreground">machine learning, fintech innovation,</strong> and <strong className="text-foreground">scalable data platforms</strong> — transforming complex data into actionable insights that matter.
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div 
                  className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4"
                  style={getHeroElementTransform('left', 0.7)}
                >
                  <div className="flex gap-3">
                    <button 
                      onClick={handleDownloadClick}
                      disabled={isDownloading}
                      className={`group relative overflow-hidden rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-300 ${
                        downloadComplete 
                          ? 'bg-green-500 text-white shadow-lg shadow-green-500/25' 
                          : isDownloading 
                            ? 'bg-primary/70 text-primary-foreground cursor-not-allowed' 
                            : 'bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 hover:shadow-lg hover:shadow-primary/25'
                      }`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/20 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-600" />
                      <div className="relative flex items-center gap-1.5">
                        {downloadComplete ? (
                          <>✅ Downloaded!</>
                        ) : isDownloading ? (
                          <>
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                            Preparing...
                          </>
                        ) : (
                          <>📄 Resume</>
                        )}
                      </div>
                    </button>

                    <button 
                      onClick={() => setActiveSection('contact')}
                      className="group relative overflow-hidden rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-medium transition-all duration-300 hover:bg-accent hover:scale-105 hover:shadow-lg"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/0 to-primary/10 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-600" />
                      <div className="relative">💬 Let's Talk</div>
                    </button>
                  </div>
                  
                  {/* Social Links */}
                  <div className="flex items-center gap-2">
                    <a href="https://www.linkedin.com/in/elijah-deangulo-a26306175" target="_blank" rel="noopener noreferrer" className="group flex items-center justify-center px-3 py-2 rounded-lg border border-border bg-background transition-all duration-300 hover:bg-blue-500 hover:border-blue-500 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/25">
                      <svg className="h-3.5 w-3.5 text-blue-600 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </a>
                    <a href="https://github.com/ElijahDeangulo" target="_blank" rel="noopener noreferrer" className="group flex items-center justify-center px-3 py-2 rounded-lg border border-border bg-background transition-all duration-300 hover:bg-gray-900 hover:border-gray-900 hover:scale-110 hover:shadow-lg hover:shadow-gray-900/25">
                      <svg className="h-3.5 w-3.5 text-gray-700 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/>
                      </svg>
                    </a>
                    <a href="mailto:ejdeangulo@gmail.com" className="group flex items-center justify-center px-3 py-2 rounded-lg border border-border bg-background transition-all duration-300 hover:bg-red-500 hover:border-red-500 hover:scale-110 hover:shadow-lg hover:shadow-red-500/25">
                      <svg className="h-3.5 w-3.5 text-red-600 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-.904.732-1.636 1.636-1.636h.075L12 13.267 22.289 3.821h.075A1.636 1.636 0 0 1 24 5.457z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>

              {/* Right Column - Profile & Tech Stack */}
              <div className="lg:col-span-5 space-y-2">
                
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
                  className="rounded-lg bg-card/50 backdrop-blur-sm border border-border/50 p-2"
                  style={getHeroElementTransform('right', 0.8)}
                >
                                    <div className="flex items-center gap-1.5 mb-1.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-xs font-medium text-foreground">Currently at</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="flex-shrink-0">
                      <img src="/images/logos/palantir.jpg" alt="Palantir" className="h-7 w-7 rounded-lg object-contain bg-white p-1" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-foreground">Palantir Technologies</div>
                      <div className="text-xs text-muted-foreground">Deployment Strategist Intern</div>
                    </div>
                  </div>
                </div>

                                 {/* Tech Stack Preview */}
                 <div 
                   className="rounded-lg bg-card/50 backdrop-blur-sm border border-border/50 p-2"
                   style={getHeroElementTransform('right', 0.6)}
                 >
                   <h3 className="text-xs font-medium text-foreground mb-1.5">Core Technologies</h3>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 <div className="grid grid-cols-4 gap-1.5">
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
                           className="group flex flex-col items-center gap-0.5 p-1 rounded-lg bg-background/50 border border-border/50 transition-all duration-300 hover:scale-110 hover:bg-accent/20"
                           style={{
                             animationDelay: `${index * 100}ms`
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

        {/* Transition Buffer Zone */}
        <div 
          className="relative overflow-hidden"
          style={{
            height: `${Math.max(2 - (scrollY / (viewportHeight * 0.5)) * 5, 0)}px`, // Virtually eliminate buffer
            background: `linear-gradient(to bottom, 
              hsl(var(--background))/70 0%, 
              hsl(var(--card))/60 100%)`,
            opacity: viewportHeight > 0 ? Math.max(1 - (scrollY / (viewportHeight * 0.3)) * 3, 0) : 1,
            willChange: 'height, opacity',
            backfaceVisibility: 'hidden',
            pointerEvents: 'none',
            zIndex: 5, // Between hero (1) and resume (50)
          }}
        >
          {/* Subtle fade gradient */}
          <div 
            className="absolute inset-0"
            style={{
              background: `radial-gradient(ellipse at center, 
                rgba(59, 130, 246, ${viewportHeight > 0 ? Math.max(0.05 - (scrollY / (viewportHeight * 0.3)) * 0.05, 0) : 0.05}) 0%, 
                transparent 40%)`,
              transform: `translate3d(0, ${-(scrollY / (viewportHeight * 0.3)) * 20}px, 0)`,
              willChange: 'transform',
              backfaceVisibility: 'hidden',
            }}
          />
        </div>

              {/* Work/Education Tabs */}
        <section 
          className="relative py-8 hero-transition"
          data-section="experience"
          style={{ 
            ...getExperienceSectionPushTransform(),
            background: `linear-gradient(135deg, 
              hsl(var(--card))/80 0%, 
              hsl(var(--background))/90 100%)`,
            backfaceVisibility: 'hidden',
            transformStyle: 'preserve-3d',
          }}
        >
          <FloatingElements section="experience" />
          <div className="max-w-2xl mx-auto">
          <div 
            className="mb-6 rounded-lg border border-border bg-card"
            style={getExperienceElementTransform(0, 0)}
          >
            <div className="flex p-2 bg-gradient-to-r from-background via-accent/5 to-background rounded-lg">
              <button 
                className={`group relative flex-1 rounded-md px-6 py-3 text-sm font-medium transition-all duration-300 ${
                  activeTab === 'work' 
                    ? 'bg-gradient-to-r from-cyan-500/10 to-cyan-400/10 text-cyan-300 shadow-lg shadow-cyan-400/20 border border-cyan-400/20' 
                    : 'text-muted-foreground hover:text-cyan-300 hover:bg-accent/20'
                }`}
                onClick={() => {
                  setActiveTab('work')
                  setActiveTimelineItem('palantir')
                }}
              >
                <span className="relative z-10">Work</span>
                {activeTab === 'work' && (
                  <div className="absolute inset-0 rounded-md bg-gradient-to-r from-cyan-500/5 via-cyan-400/10 to-cyan-500/5 animate-pulse"></div>
                )}
                <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent transition-all duration-300 ${
                  activeTab === 'work' ? 'w-3/4 opacity-100' : 'w-0 opacity-0 group-hover:w-1/2 group-hover:opacity-70'
                }`}></div>
              </button>
              <button 
                className={`group relative flex-1 rounded-md px-6 py-3 text-sm font-medium transition-all duration-300 ${
                  activeTab === 'education' 
                    ? 'bg-gradient-to-r from-cyan-500/10 to-cyan-400/10 text-cyan-300 shadow-lg shadow-cyan-400/20 border border-cyan-400/20' 
                    : 'text-muted-foreground hover:text-cyan-300 hover:bg-accent/20'
                }`}
                onClick={() => {
                  setActiveTab('education')
                  setActiveTimelineItem('uf-masters')
                }}
              >
                <span className="relative z-10">Education</span>
                {activeTab === 'education' && (
                  <div className="absolute inset-0 rounded-md bg-gradient-to-r from-cyan-500/5 via-cyan-400/10 to-cyan-500/5 animate-pulse"></div>
                )}
                <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent transition-all duration-300 ${
                  activeTab === 'education' ? 'w-3/4 opacity-100' : 'w-0 opacity-0 group-hover:w-1/2 group-hover:opacity-70'
                }`}></div>
              </button>
              <button 
                className={`group relative flex-1 rounded-md px-6 py-3 text-sm font-medium transition-all duration-300 ${
                  activeTab === 'philanthropy' 
                    ? 'bg-gradient-to-r from-cyan-500/10 to-cyan-400/10 text-cyan-300 shadow-lg shadow-cyan-400/20 border border-cyan-400/20' 
                    : 'text-muted-foreground hover:text-cyan-300 hover:bg-accent/20'
                }`}
                onClick={() => {
                  setActiveTab('philanthropy')
                  setActiveTimelineItem('asm')
                }}
              >
                <span className="relative z-10">Philanthropy</span>
                {activeTab === 'philanthropy' && (
                  <div className="absolute inset-0 rounded-md bg-gradient-to-r from-cyan-500/5 via-cyan-400/10 to-cyan-500/5 animate-pulse"></div>
                )}
                <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent transition-all duration-300 ${
                  activeTab === 'philanthropy' ? 'w-3/4 opacity-100' : 'w-0 opacity-0 group-hover:w-1/2 group-hover:opacity-70'
                }`}></div>
              </button>
            </div>
          </div>

          {/* Work Experience */}
          {activeTab === 'work' && (
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
                  {/* Palantir */}
                  <div 
                    data-timeline-item="palantir"
                    onMouseEnter={() => setActiveTimelineItem('palantir')}
                    className={`relative flex items-start gap-6 transition-all duration-300 cursor-pointer rounded-lg p-4 -m-4 hover:bg-accent/20 ${
                      activeTimelineItem && activeTimelineItem !== 'palantir' 
                        ? 'opacity-40 scale-95 blur-[1px]' 
                        : 'opacity-100 scale-100 blur-0'
                    } ${activeTimelineItem === 'palantir' ? 'bg-accent/10' : ''}`}
                    style={getExperienceElementTransform(2, 1)}
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
                    style={getExperienceElementTransform(3, 2)}
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
                    style={getExperienceElementTransform(4, 2)}
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
                    style={getExperienceElementTransform(5, 3)}
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
            <div 
              className="rounded-lg border border-border bg-card p-6"
              style={getExperienceElementTransform(1, 1)}
            >
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
                    style={getExperienceElementTransform(2, 1)}
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
                    style={getExperienceElementTransform(3, 2)}
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
            <div 
              className="rounded-lg border border-border bg-card p-6"
              style={getExperienceElementTransform(1, 1)}
            >
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
                    style={getExperienceElementTransform(2, 1)}
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
                    style={getExperienceElementTransform(3, 2)}
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

              {/* Featured Projects - Advanced Carousel */}
        <div style={getFeaturedProjectsFadeTransform()}>
          <FeaturedProjectsCarousel 
            mousePosition={mousePosition}
            getSectionTransform={getSectionTransform}
          />
        </div>


          </div>

        {/* Projects Section */}
        <section id="projects" className="py-8 mt-8">
          <div>
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
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-8 mt-8">
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-4">Get in Touch 📧</h2>
              <p className="text-muted-foreground">
                Learn more about my journey, passions, and what drives me to build meaningful technology.
              </p>
            </div>
            
            <div className="space-y-6">
              {/* Personal Story */}
              <div className="rounded-lg border border-border bg-card p-6 transition-colors hover:bg-accent/50">
                <h3 className="mb-4 text-xl font-semibold text-foreground">My Journey</h3>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    I'm a passionate AI/ML engineer and graduate student at the University of Florida, where I'm pursuing my Master's in Business Analytics while maintaining a 4.0 GPA. My journey in technology began with a fascination for how data can tell stories and drive meaningful change.
                  </p>
                  <p>
                    Currently, I work as a Decision Sciences Engineering Intern at Palantir Technologies, where I build enterprise-scale AI solutions that transform how Fortune 500 companies leverage their data. From developing accounts receivable automation systems to creating pricing intelligence platforms, I love solving complex problems that have real business impact.
                  </p>
                  <p>
                    What excites me most is the intersection of technology and human impact. Whether it's building ML models that drive millions in revenue or founding a non-profit to support families with children with Down Syndrome, I believe technology should serve a greater purpose.
                  </p>
                </div>
              </div>

              {/* Personal Interests */}
              <div className="rounded-lg border border-border bg-card p-6 transition-colors hover:bg-accent/50">
                <h3 className="mb-4 text-xl font-semibold text-foreground">Beyond Code</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="mb-2 font-semibold text-foreground">🏈 Sports & Fitness</h4>
                    <p className="text-sm text-muted-foreground">
                      Avid sports enthusiast and fitness lover. I believe in maintaining a healthy work-life balance and find that physical activity enhances my problem-solving abilities.
                    </p>
                  </div>
                  <div>
                    <h4 className="mb-2 font-semibold text-foreground">🎵 Music Production</h4>
                    <p className="text-sm text-muted-foreground">
                      Creative outlet through music production and sound design. The same attention to detail that goes into my code translates beautifully into crafting the perfect beat.
                    </p>
                  </div>
                  <div>
                    <h4 className="mb-2 font-semibold text-foreground">🌟 Community Impact</h4>
                    <p className="text-sm text-muted-foreground">
                      Founder of "A Special Miracle," a non-profit supporting families with children with Down Syndrome. Using technology and community to create meaningful change.
                    </p>
                  </div>
                  <div>
                    <h4 className="mb-2 font-semibold text-foreground">📚 Continuous Learning</h4>
                    <p className="text-sm text-muted-foreground">
                      Always exploring new technologies, from the latest ML frameworks to emerging fintech trends. The tech landscape evolves fast, and I love staying ahead of the curve.
                    </p>
                  </div>
                </div>
              </div>

              {/* Values & Philosophy */}
              <div className="rounded-lg border border-border bg-card p-6 transition-colors hover:bg-accent/50">
                <h3 className="mb-4 text-xl font-semibold text-foreground">What Drives Me</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 h-2 w-2 rounded-full bg-primary"></div>
                    <p className="text-sm text-muted-foreground">
                      <strong className="text-foreground">Impact over Innovation:</strong> Technology should solve real problems and improve lives, not just showcase technical prowess.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 h-2 w-2 rounded-full bg-primary"></div>
                    <p className="text-sm text-muted-foreground">
                      <strong className="text-foreground">Continuous Growth:</strong> Every project is an opportunity to learn something new and push the boundaries of what's possible.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 h-2 w-2 rounded-full bg-primary"></div>
                    <p className="text-sm text-muted-foreground">
                      <strong className="text-foreground">Collaborative Excellence:</strong> The best solutions emerge from diverse perspectives and inclusive collaboration.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 h-2 w-2 rounded-full bg-primary"></div>
                    <p className="text-sm text-muted-foreground">
                      <strong className="text-foreground">Purpose-Driven Work:</strong> Whether it's enterprise AI or community service, everything I do is guided by a desire to make a positive difference.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
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
                    'Send Message'
                  )}
                </button>
              </div>
            </form>
          </div>
        </section>

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
    </React.Fragment>
  )
}

