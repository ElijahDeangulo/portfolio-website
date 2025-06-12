import { useEffect } from 'react'

export const useGlobalCursorReset = (resetFn: () => void) => {
  useEffect(() => {
    const handleReset = () => resetFn()
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') resetFn()
    }

    document.addEventListener('resetCursor', handleReset)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('resetCursor', handleReset)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [resetFn])
} 