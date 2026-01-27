"use client"

import { Card, CardContent } from "@/components/ui/card"

interface ProductSkeletonProps {
  index?: number
}

export function ProductSkeleton({ index = 0 }: ProductSkeletonProps) {
  return (
    <Card
      className="overflow-hidden animate-slide-up"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <CardContent className="p-0">
        {/* Image placeholder with badge */}
        <div className="relative aspect-[3/4] overflow-hidden">
          <div className="shimmer absolute inset-0 rounded-t-xl" />
          {/* Badge placeholder */}
          <div className="absolute top-2 left-2">
            <div className="shimmer h-5 w-14 rounded-md" />
          </div>
        </div>

        {/* Content section */}
        <div className="p-3 md:p-4 space-y-2 md:space-y-3">
          {/* Title placeholder (2 lines) */}
          <div className="space-y-1">
            <div className="space-y-1.5">
              <div className="shimmer h-3.5 md:h-4 w-full rounded" />
              <div className="shimmer h-3.5 md:h-4 w-3/4 rounded" />
            </div>
            {/* Author placeholder (hidden on mobile) */}
            <div className="shimmer h-3 w-1/2 rounded hidden md:block mt-1" />
            {/* Genre placeholder */}
            <div className="shimmer h-3 w-1/3 rounded mt-1" />
          </div>

          {/* Rating placeholder */}
          <div className="flex items-center gap-1">
            <div className="shimmer h-3 w-3 rounded" />
            <div className="shimmer h-3 w-8 rounded" />
            <div className="shimmer h-3 w-10 rounded" />
          </div>

          {/* Price and buttons row */}
          <div className="flex items-center justify-between">
            {/* Price placeholder */}
            <div className="shimmer h-5 md:h-7 w-16 md:w-20 rounded" />
            {/* Action buttons placeholder */}
            <div className="flex gap-1">
              <div className="shimmer h-7 w-7 md:h-8 md:w-8 rounded-md" />
              <div className="shimmer h-7 w-7 md:h-8 md:w-8 rounded-md" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface ProductSkeletonGridProps {
  count?: number
}

export function ProductSkeletonGrid({ count = 10 }: ProductSkeletonGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <ProductSkeleton key={index} index={index} />
      ))}
    </div>
  )
}

// Hero section skeleton
export function HeroSkeleton() {
  return (
    <div className="relative py-12 md:py-20 px-4">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        {/* Title skeleton */}
        <div className="shimmer h-16 md:h-24 w-3/4 mx-auto rounded-xl" />

        {/* Subtitle skeleton */}
        <div className="space-y-2">
          <div className="shimmer h-6 w-full max-w-xl mx-auto rounded" />
          <div className="shimmer h-6 w-2/3 max-w-md mx-auto rounded" />
        </div>

        {/* Buttons skeleton */}
        <div className="flex justify-center gap-4 pt-4">
          <div className="shimmer h-12 w-40 rounded-lg" />
          <div className="shimmer h-12 w-40 rounded-lg" />
        </div>
      </div>
    </div>
  )
}

// Featured carousel skeleton
export function FeaturedSkeletonCarousel() {
  return (
    <div className="flex gap-4 overflow-hidden py-4 px-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="flex-shrink-0 w-48 md:w-64 animate-slide-up"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <Card className="overflow-hidden">
            <div className="shimmer aspect-[3/4]" />
            <CardContent className="p-3">
              <div className="shimmer h-4 w-full mb-2 rounded" />
              <div className="shimmer h-4 w-2/3 rounded" />
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  )
}

// Filter card skeleton
export function FilterCardSkeleton() {
  return (
    <div className="glass rounded-xl p-6 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="shimmer h-4 w-4 rounded" />
              <div className="shimmer h-4 w-16 rounded" />
            </div>
            <div className="shimmer h-11 w-full rounded-md" />
          </div>
        ))}
      </div>
    </div>
  )
}
