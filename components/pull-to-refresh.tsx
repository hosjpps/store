"use client"

import { useState, useRef, useCallback, ReactNode } from "react"
import { RefreshCw } from "lucide-react"

interface PullToRefreshProps {
  children: ReactNode
  onRefresh: () => Promise<void>
}

export function PullToRefresh({ children, onRefresh }: PullToRefreshProps) {
  const [isPulling, setIsPulling] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const startY = useRef(0)
  const THRESHOLD = 80 // pixels to trigger refresh

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (window.scrollY === 0) {
      startY.current = e.touches[0].clientY
      setIsPulling(true)
    }
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isPulling || isRefreshing) return

    const currentY = e.touches[0].clientY
    const diff = currentY - startY.current

    if (diff > 0 && window.scrollY === 0) {
      // Apply resistance (pull harder for less distance)
      const distance = Math.min(diff * 0.5, 120)
      setPullDistance(distance)
    }
  }, [isPulling, isRefreshing])

  const handleTouchEnd = useCallback(async () => {
    if (pullDistance >= THRESHOLD && !isRefreshing) {
      setIsRefreshing(true)
      setPullDistance(THRESHOLD) // Keep spinner visible

      try {
        await onRefresh()
      } finally {
        setIsRefreshing(false)
      }
    }

    setIsPulling(false)
    setPullDistance(0)
  }, [pullDistance, isRefreshing, onRefresh])

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="min-h-screen"
    >
      {/* Pull indicator */}
      <div
        className="flex justify-center items-center overflow-hidden transition-all duration-200 md:hidden"
        style={{ height: pullDistance }}
      >
        <div
          className={`p-2 rounded-full bg-primary/10 transition-transform ${isRefreshing ? 'animate-spin' : ''}`}
          style={{
            transform: `rotate(${pullDistance * 2}deg)`,
            opacity: Math.min(pullDistance / THRESHOLD, 1)
          }}
        >
          <RefreshCw className="h-6 w-6 text-primary" />
        </div>
      </div>

      {children}
    </div>
  )
}
