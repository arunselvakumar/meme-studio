import { useEffect, useState, useMemo, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { wait } from '@shared/utils'

declare global {
  interface Window {
    ga: any
  }
}

export function useWindowWidth(): {
  isMinMdSize: boolean
  isMinLgSize: boolean
  isMinXlSize: boolean
  width: number
} {
  const [width, setWidth] = useState<number>(window.innerWidth)

  const isMinMdSize: boolean = useMemo(() => width >= 768, [width])
  const isMinLgSize: boolean = useMemo(() => width >= 992, [width])
  const isMinXlSize: boolean = useMemo(() => width >= 1200, [width])

  useEffect(() => {
    const handleResize = (): void => setWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return (): void => {
      window.removeEventListener('resize', handleResize)
    }
  })

  return { width, isMinMdSize, isMinLgSize, isMinXlSize }
}

export function usePageViews(): void {
  const location = useLocation()
  useEffect(() => {
    ;(async (): Promise<void> => {
      while (typeof window.ga !== 'function') {
        console.log('awaiting for window.ga')
        await wait(50)
      }
      window.ga('send', {
        hitType: 'pageview',
        page: location.pathname
      })
    })()
  }, [location.pathname])
}

export function useDebouncedCallback<A extends any[]>(callback: (...args: A) => void, wait: number): (...args: A) => void {
  // track args & timeout handle between calls
  const argsRef = useRef<A>()
  const timeout = useRef<ReturnType<typeof setTimeout>>()

  function cleanup(): void {
    if (timeout.current) {
      clearTimeout(timeout.current)
    }
  }

  // make sure our timeout gets cleared if
  // our consuming component gets unmounted
  useEffect(() => cleanup, [])

  return function debouncedCallback(...args: A): void {
    // capture latest args
    argsRef.current = args

    // clear debounce timer
    cleanup()

    // start waiting again
    timeout.current = setTimeout(() => {
      if (argsRef.current) {
        callback(...argsRef.current)
      }
    }, wait)
  }
}
