'use client'

import { useParallax } from '../hooks'

interface FloatingElementsProps {
  section: string
}

export const FloatingElements = ({ section }: FloatingElementsProps) => {
  const { getElementTransform } = useParallax()
  
  if (section === 'hero') {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-400/8 to-purple-400/8 rounded-full blur-xl"
          style={{ 
            ...getElementTransform(0.1, 0.5),
            pointerEvents: 'none',
            backfaceVisibility: 'hidden'
          } as React.CSSProperties}
        />
        <div 
          className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-green-400/8 to-cyan-400/8 rounded-full blur-lg"
          style={{ 
            ...getElementTransform(0.2, -0.3),
            pointerEvents: 'none',
            backfaceVisibility: 'hidden'
          } as React.CSSProperties}
        />
        <div 
          className="absolute bottom-20 left-1/4 w-40 h-40 bg-gradient-to-br from-purple-400/8 to-pink-400/8 rounded-full blur-2xl"
          style={{ 
            ...getElementTransform(0.15, 0.4),
            pointerEvents: 'none',
            backfaceVisibility: 'hidden'
          } as React.CSSProperties}
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
            ...getElementTransform(0.15, 0.3),
            pointerEvents: 'none',
            backfaceVisibility: 'hidden'
          } as React.CSSProperties}
        />
        <div 
          className="absolute bottom-10 left-1/3 w-32 h-32 bg-gradient-to-br from-purple-400/8 to-pink-400/8 rounded-full blur-2xl"
          style={{ 
            ...getElementTransform(0.1, -0.2),
            pointerEvents: 'none',
            backfaceVisibility: 'hidden'
          } as React.CSSProperties}
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
            ...getElementTransform(0.4, 0.2),
            pointerEvents: 'none',
            backfaceVisibility: 'hidden'
          } as React.CSSProperties}
        />
        <div 
          className="absolute bottom-10 right-1/3 w-16 h-16 bg-gradient-to-br from-teal-400/8 to-green-400/8 rounded-full blur-lg"
          style={{ 
            ...getElementTransform(0.35, -0.2),
            pointerEvents: 'none',
            backfaceVisibility: 'hidden'
          } as React.CSSProperties}
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
            ...getElementTransform(0.3, 0.3),
            pointerEvents: 'none',
            backfaceVisibility: 'hidden'
          } as React.CSSProperties}
        />
        <div 
          className="absolute bottom-10 left-10 w-16 h-16 bg-gradient-to-br from-purple-400/8 to-pink-400/8 rounded-full blur-xl"
          style={{ 
            ...getElementTransform(0.05, -0.2),
            pointerEvents: 'none',
            backfaceVisibility: 'hidden'
          } as React.CSSProperties}
        />
      </div>
    )
  }

  return null
}

export default FloatingElements 