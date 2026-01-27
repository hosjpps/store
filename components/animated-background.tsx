"use client"

import { memo, useEffect, useState } from "react"

/**
 * AnimatedBackground - A performant animated background component for the anime store
 *
 * Features:
 * - Floating gradient orbs/particles with smooth animations
 * - Subtle grid pattern overlay
 * - Mouse-following gradient effect
 * - Supports light and dark themes (via CSS classes in globals.css)
 * - Uses will-change for GPU acceleration
 * - Fixed positioning as a background layer (-z-10)
 */

interface AnimatedBackgroundProps {
  children?: React.ReactNode
  className?: string
  showMouseGlow?: boolean
}

function AnimatedBackgroundComponent({
  children,
  className = "",
  showMouseGlow = true
}: AnimatedBackgroundProps) {
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 })

  useEffect(() => {
    if (!showMouseGlow) return

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [showMouseGlow])

  return (
    <div className={`relative min-h-screen overflow-hidden ${className}`}>
      {/* Base animated background */}
      <div
        className="fixed inset-0 -z-10 overflow-hidden animated-bg"
        aria-hidden="true"
      >
        {/* Floating gradient orb particles */}
        <div
          className="particle particle-1"
          style={{ willChange: "transform" }}
        />
        <div
          className="particle particle-2"
          style={{ willChange: "transform" }}
        />
        <div
          className="particle particle-3"
          style={{ willChange: "transform" }}
        />
        <div
          className="particle particle-4"
          style={{ willChange: "transform" }}
        />

        {/* Grid overlay for subtle texture */}
        <div
          className="absolute inset-0 bg-grid opacity-30 pointer-events-none"
        />

        {/* Dot pattern overlay */}
        <div className="absolute inset-0 bg-dots opacity-20 pointer-events-none" />
      </div>

      {/* Mouse-following gradient glow */}
      {showMouseGlow && (
        <div
          className="fixed inset-0 pointer-events-none -z-5 opacity-30 transition-opacity duration-300"
          style={{
            background: `radial-gradient(600px circle at ${mousePosition.x}% ${mousePosition.y}%, oklch(0.55 0.25 285 / 0.15), transparent 40%)`,
          }}
          aria-hidden="true"
        />
      )}

      {/* Content */}
      {children && <div className="relative z-10">{children}</div>}
    </div>
  )
}

// Memoize the component to prevent unnecessary re-renders
export const AnimatedBackground = memo(AnimatedBackgroundComponent)

// Floating manga page decoration
export function FloatingMangaPage({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute pointer-events-none select-none ${className}`}>
      <div className="relative animate-float">
        {/* Manga page shape */}
        <div className="w-32 h-44 md:w-48 md:h-64 bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-2xl transform rotate-6 border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Page content simulation */}
          <div className="absolute inset-2 flex flex-col gap-1">
            {/* Panel 1 */}
            <div className="flex-1 bg-gradient-to-br from-primary/20 to-accent/20 rounded border border-gray-300 dark:border-gray-600" />
            {/* Panel 2 - split */}
            <div className="flex gap-1 h-1/3">
              <div className="flex-1 bg-gradient-to-tl from-primary/30 to-transparent rounded border border-gray-300 dark:border-gray-600" />
              <div className="flex-1 bg-gradient-to-tr from-accent/30 to-transparent rounded border border-gray-300 dark:border-gray-600" />
            </div>
            {/* Speed lines */}
            <div className="absolute top-4 left-4 w-12 h-0.5 bg-gray-400/30 rotate-45" />
            <div className="absolute top-6 left-6 w-8 h-0.5 bg-gray-400/30 rotate-45" />
            <div className="absolute top-8 left-8 w-6 h-0.5 bg-gray-400/30 rotate-45" />
          </div>
          {/* Page fold effect */}
          <div className="absolute top-0 right-0 w-6 h-6 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-bl-lg shadow-inner" />
        </div>

        {/* Shadow */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-4 bg-black/10 dark:bg-black/30 blur-lg rounded-full" />
      </div>
    </div>
  )
}

// Second manga page variant with different rotation
export function FloatingMangaPageAlt({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute pointer-events-none select-none ${className}`}>
      <div className="relative animate-float" style={{ animationDelay: "-3s" }}>
        {/* Manga page shape */}
        <div className="w-24 h-32 md:w-36 md:h-48 bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-xl transform -rotate-12 border border-gray-200 dark:border-gray-700 overflow-hidden opacity-80">
          {/* Page content simulation */}
          <div className="absolute inset-2 flex flex-col gap-1">
            {/* Panel layout */}
            <div className="flex gap-1 h-1/2">
              <div className="flex-1 bg-gradient-to-br from-accent/20 to-transparent rounded border border-gray-300 dark:border-gray-600" />
            </div>
            <div className="flex-1 bg-gradient-to-tl from-primary/20 to-accent/10 rounded border border-gray-300 dark:border-gray-600" />
          </div>
        </div>
      </div>
    </div>
  )
}

// Decorative star burst
export function StarBurst({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute pointer-events-none ${className}`}>
      <svg
        width="60"
        height="60"
        viewBox="0 0 60 60"
        className="animate-spin-slow text-primary/30"
      >
        <path
          fill="currentColor"
          d="M30 0L33.5 26.5L60 30L33.5 33.5L30 60L26.5 33.5L0 30L26.5 26.5L30 0Z"
        />
      </svg>
    </div>
  )
}

// Small decorative sparkle
export function Sparkle({ className = "", size = 20 }: { className?: string; size?: number }) {
  return (
    <div className={`absolute pointer-events-none ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 20 20"
        className="text-accent/40 animate-pulse"
      >
        <path
          fill="currentColor"
          d="M10 0L11.2 8.8L20 10L11.2 11.2L10 20L8.8 11.2L0 10L8.8 8.8L10 0Z"
        />
      </svg>
    </div>
  )
}
