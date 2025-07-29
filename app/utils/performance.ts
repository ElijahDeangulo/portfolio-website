// RAF-based throttle that ensures smooth 60fps animations
export function rafThrottle<T extends (...args: any[]) => any>(
  fn: T
): ((...args: Parameters<T>) => void) & { cancel: () => void } {
  let rafId: number | null = null
  let lastArgs: Parameters<T> | null = null

  const throttled = (...args: Parameters<T>) => {
    lastArgs = args
    
    if (rafId === null) {
      rafId = requestAnimationFrame(() => {
        if (lastArgs) {
          fn(...lastArgs)
        }
        rafId = null
      })
    }
  }

  throttled.cancel = () => {
    if (rafId !== null) {
      cancelAnimationFrame(rafId)
      rafId = null
    }
  }

  return throttled as ((...args: Parameters<T>) => void) & { cancel: () => void }
}

// Debounce for user interactions
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): ((...args: Parameters<T>) => void) & { cancel: () => void } {
  let timeoutId: NodeJS.Timeout | null = null

  const debounced = (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    
    timeoutId = setTimeout(() => {
      fn(...args)
    }, delay)
  }

  debounced.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
  }

  return debounced as ((...args: Parameters<T>) => void) & { cancel: () => void }
}