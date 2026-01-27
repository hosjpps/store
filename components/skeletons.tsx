"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

// Product page skeleton
export function ProductPageSkeleton() {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Skeleton className="aspect-[3/4] rounded-2xl" />
      <div className="space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-4 w-1/4" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-20" />
        </div>
        <Skeleton className="h-24 w-full" />
        <div className="flex gap-4">
          <Skeleton className="h-12 w-32" />
          <Skeleton className="h-12 w-12" />
        </div>
      </div>
    </div>
  )
}

// Cart item skeleton
export function CartItemSkeleton() {
  return (
    <Card className="glass">
      <CardContent className="p-4">
        <div className="flex gap-4">
          <Skeleton className="w-20 h-28 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-6 w-24" />
            <div className="flex justify-between">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-6 w-20" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Cart page skeleton with multiple items and summary
export function CartPageSkeleton() {
  return (
    <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
      <div className="lg:col-span-2 space-y-4 md:space-y-6">
        {/* Header skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-10 w-32" />
        </div>
        {/* Shipping progress skeleton */}
        <Card className="glass">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <Skeleton className="h-9 w-9 rounded-full" />
              <Skeleton className="h-4 flex-1" />
            </div>
            <Skeleton className="h-2 w-full rounded-full" />
          </CardContent>
        </Card>
        {/* Cart items */}
        {[1, 2, 3].map(i => (
          <CartItemSkeleton key={i} />
        ))}
      </div>
      {/* Order summary skeleton */}
      <div className="lg:col-span-1">
        <Card className="glass sticky top-24">
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-6 w-24" />
            <div className="space-y-3">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
            <Skeleton className="h-px w-full" />
            <div className="flex justify-between">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-24" />
            </div>
            <Skeleton className="h-12 w-full rounded-lg" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Account page skeleton
export function AccountSkeleton() {
  return (
    <div className="space-y-6">
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
      </div>
      <div className="glass rounded-2xl p-6 space-y-4">
        <Skeleton className="h-6 w-40" />
        {[1, 2, 3].map(i => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    </div>
  )
}

// Order tracking skeleton
export function OrderTrackingSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-48" />
      <div className="glass rounded-2xl p-6">
        <div className="flex justify-between">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="flex flex-col items-center gap-2">
              <Skeleton className="h-12 w-12 rounded-full" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
      </div>
      <div className="glass rounded-2xl p-6 space-y-4">
        {[1, 2].map(i => (
          <div key={i} className="flex gap-4">
            <Skeleton className="w-16 h-22 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Favorites page skeleton
export function FavoritesSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <Card key={i} className="glass">
          <CardContent className="p-0">
            <Skeleton className="aspect-[3/4] rounded-t-lg" />
            <div className="p-3 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <div className="flex justify-between">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-8 w-8 rounded" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Full account page skeleton with sidebar and tabs
export function AccountPageSkeleton() {
  return (
    <div className="grid lg:grid-cols-4 gap-8">
      {/* Sidebar skeleton */}
      <div className="lg:col-span-1">
        <Card className="glass border-primary/10 overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-primary/30 via-accent/30 to-primary/30" />
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <Skeleton className="w-14 h-14 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <Skeleton className="h-10 w-full rounded-md" />
          </CardContent>
        </Card>
      </div>

      {/* Main content skeleton */}
      <div className="lg:col-span-3 space-y-6">
        {/* Tabs skeleton */}
        <Skeleton className="h-10 w-full rounded-lg" />

        {/* Content card skeleton */}
        <Card className="glass border-primary/10">
          <CardContent className="p-6 space-y-6">
            <Skeleton className="h-6 w-40" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            </div>
            <Skeleton className="h-10 w-32 rounded-md" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
