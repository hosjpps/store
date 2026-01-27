'use client'

import { useRef } from 'react'
import { ChevronLeft, ChevronRight, X, Clock } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useStore } from '@/lib/store'

// Base64 blur placeholder for images
const blurDataURL = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAMI/8QAIhAAAgEDAwUBAAAAAAAAAAAAAQIDAAQRBRIhBhMxQVFh/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAZEQACAwEAAAAAAAAAAAAAAAABAgADESH/2gAMAwEAAhEDEQA/AKVLqN7aT28ltcSwyrKC8bYyFPkZGR9FdBqHX2pXdhLbXFjbsJIijMjOD4I8g5/aKKKGxQT2JYhsz//Z"

export function RecentlyViewed() {
  const { recentlyViewed, clearRecentlyViewed } = useStore()
  const carouselRef = useRef<HTMLDivElement>(null)

  // Don't render if no items
  if (recentlyViewed.length === 0) {
    return null
  }

  const scroll = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return

    const scrollAmount = 200
    const currentScroll = carouselRef.current.scrollLeft
    const newScroll = direction === 'left'
      ? currentScroll - scrollAmount
      : currentScroll + scrollAmount

    carouselRef.current.scrollTo({
      left: newScroll,
      behavior: 'smooth'
    })
  }

  return (
    <Card className="backdrop-blur-md bg-background/60 border-border/50 shadow-xl">
      <CardContent className="p-4 md:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-lg md:text-xl font-semibold">
              Недавно просмотренные
            </h2>
            <Badge variant="secondary" className="ml-2">
              {recentlyViewed.length}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearRecentlyViewed}
            className="text-muted-foreground hover:text-destructive transition-colors"
          >
            <X className="h-4 w-4 mr-1" />
            Очистить
          </Button>
        </div>

        {/* Carousel */}
        <div className="relative group">
          <div
            ref={carouselRef}
            className="flex gap-3 md:gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-2"
          >
            {recentlyViewed.map((product, index) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="flex-none snap-start"
              >
                <div
                  className="w-[120px] md:w-[150px] group/item animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <Card className="overflow-hidden transition-all duration-200 hover:scale-105 hover:shadow-lg bg-background/80 backdrop-blur-sm border-border/50">
                    <CardContent className="p-0">
                      <div className="relative aspect-[3/4] overflow-hidden">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover/item:scale-110"
                          placeholder="blur"
                          blurDataURL={blurDataURL}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-300" />
                        <Badge
                          variant="secondary"
                          className="absolute top-1.5 left-1.5 text-[10px] md:text-xs px-1.5 py-0.5"
                        >
                          {product.type}
                        </Badge>
                      </div>
                      <div className="p-2 md:p-3 space-y-1">
                        <h3 className="font-medium text-xs md:text-sm leading-tight line-clamp-2 group-hover/item:text-primary transition-colors">
                          {product.title}
                        </h3>
                        <p className="text-xs text-muted-foreground line-clamp-1 hidden md:block">
                          {product.author}
                        </p>
                        <p className="text-sm md:text-base font-bold text-primary">
                          {product.price}₽
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </Link>
            ))}
          </div>

          {/* Navigation buttons */}
          {recentlyViewed.length > 3 && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 opacity-0 group-hover:opacity-100 transition-all duration-200 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm shadow-md hover:scale-110"
                onClick={() => scroll('left')}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 opacity-0 group-hover:opacity-100 transition-all duration-200 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm shadow-md hover:scale-110"
                onClick={() => scroll('right')}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
