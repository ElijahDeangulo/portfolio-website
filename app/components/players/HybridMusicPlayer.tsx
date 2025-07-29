'use client'

import React, { useState, useEffect } from 'react'
import { MusicPlayerProps } from '../../types'

export const HybridMusicPlayer = ({ 
  playlistId = "37i9dQZF1DZ06evO3qQrNm",
  youtubeVideoId = "5i8W1z9zkE0",
  youtubeStartTime = "5448",
  onExpandedChange
}: MusicPlayerProps) => {
  const [isVisible, setIsVisible] = useState(true)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.3)
  const [hasUserInteracted, setHasUserInteracted] = useState(false)
  const [showAutoplayTip, setShowAutoplayTip] = useState(true)
  const [currentPlayer, setCurrentPlayer] = useState<'spotify' | 'youtube'>('youtube')

  // Handle user interaction for autoplay
  useEffect(() => {
    const handleFirstInteraction = (e: Event) => {
      console.log('🎵 First interaction detected:', e.type, e.target)
      setHasUserInteracted(true)
      setShowAutoplayTip(false)
      // Try to trigger autoplay after user interaction
      const spotifyIframes = document.querySelectorAll('iframe[src*="spotify"]') as NodeListOf<HTMLIFrameElement>
      spotifyIframes.forEach((iframe) => {
        const src = iframe.src
        if (src.includes('autoplay=1')) {
          iframe.src = src
        }
      })
    }

    if (!hasUserInteracted) {
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
      if (newPlayer === 'youtube' && isExpanded) {
        setIsExpanded(false)
        onExpandedChange?.(false)
      }
      return newPlayer
    })
  }

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-6 right-24 z-50 w-11 h-11 bg-background border border-border rounded-full flex items-center justify-center text-foreground hover:bg-accent transition-all duration-300 shadow-lg"
        title="Show Music Player"
      >
        ♪
      </button>
    )
  }

  return (
    <div className="fixed bottom-6 right-24 z-50">
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

        {/* Music Player */}
        <div className={`${isExpanded ? 'block' : 'hidden'} relative`}>
          {/* Control Buttons for Expanded View */}
          <div className="absolute -top-2 -right-2 flex gap-1 z-10">
            <button
              onClick={togglePlayer}
              className="w-6 h-6 bg-background border border-border rounded-full flex items-center justify-center text-xs hover:bg-accent transition-colors"
              title={`Switch to ${currentPlayer === 'spotify' ? 'YouTube' : 'Spotify'}`}
            >
              ⇄
            </button>
            <button
              onClick={() => handleExpandedChange(false)}
              className="w-6 h-6 bg-background border border-border rounded-full flex items-center justify-center text-xs hover:bg-accent transition-colors"
              title="Minimize"
            >
              ─
            </button>
            <button
              onClick={() => setIsVisible(false)}
              className="w-6 h-6 bg-background border border-border rounded-full flex items-center justify-center text-xs hover:bg-accent transition-colors"
              title="Hide Player"
            >
              ✕
            </button>
          </div>

          {/* Player Content */}
          <div className="bg-background border border-border rounded-lg shadow-lg overflow-hidden">
            {currentPlayer === 'spotify' ? (
              <iframe
                src={`https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=0&autoplay=1&loop=1&volume=${Math.round(volume * 100)}`}
                width="352"
                height="152"
                frameBorder="0"
                allowTransparency={true}
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                title="Spotify Playlist"
              />
            ) : (
              <iframe
                width="352"
                height="152"
                src={`https://www.youtube.com/embed/${youtubeVideoId}?start=${youtubeStartTime}&autoplay=0&loop=1&controls=1&modestbranding=1&rel=0`}
                title="YouTube Music"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
          </div>
        </div>

        {/* Compact Player */}
        {!isExpanded && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleExpandedChange(true)}
              className="w-11 h-11 bg-background border border-border rounded-full flex items-center justify-center text-foreground hover:bg-accent transition-all duration-300 shadow-lg group-hover:scale-110"
              title="Open Music Player"
            >
              {isPlaying ? '⏸️' : '🎵'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
} 