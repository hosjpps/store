"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingCart, Star, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useStore } from "@/lib/store"
import reviews from "@/data/reviews.json"

import { Product } from '@/types/index'

// Base64 blur placeholder for images
const blurDataURL = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAMI/8QAIhAAAgEDAwUBAAAAAAAAAAAAAQIDAAQRBRIhBhMxQVFh/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAZEQACAwEAAAAAAAAAAAAAAAABAgADESH/2gAMAwEAAhEDEQA/AKVLqN7aT28ltcSwyrKC8bYyFPkZGR9FdBqHX2pXdhLbXFjbsJIijMjOD4I8g5/aKKKGxQT2JYhsz//Z"

interface ProductCardProps {
  product: Product
  index?: number
  onQuickView?: (product: Product) => void
}

export function ProductCard({ product, index = 0, onQuickView }: ProductCardProps) {
  const { addToCart, addToFavorites, removeFromFavorites, favorites } = useStore()
  const reviewData = reviews.find(r => r.productId === product.id)

  const isInFavorites = favorites.some((fav) => fav.id === product.id)

  // Check if product is new (created within the last 30 days or has "new" in tags)
  const isNew = product.createdAt
    ? new Date(product.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    : product.tags?.some(tag => tag.toLowerCase() === 'new') ?? false

  // Generate stagger class based on index (supports stagger-0 through stagger-9)
  const staggerClass = `stagger-${Math.min(index, 9)}`

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart({ ...product, description: '' })
  }

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isInFavorites) {
      removeFromFavorites(product.id)
    } else {
      addToFavorites({ ...product, description: '' })
    }
  }

  return (
    <Card className={`anime-card-hover group overflow-hidden animate-slide-up ${staggerClass}`}>
      <CardContent className="p-0">
        <Link href={`/product/${product.id}`}>
          <div className="image-shine relative aspect-[3/4] overflow-hidden">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              placeholder="blur"
              blurDataURL={blurDataURL}
            />
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            <div className="absolute top-2 left-2 flex gap-2">
              <Badge variant="secondary" className="text-xs">
                {product.type}
              </Badge>
              {isNew && (
                <Badge
                  variant="default"
                  className="text-xs bg-green-500 hover:bg-green-600 animate-pulse"
                >
                  New
                </Badge>
              )}
            </div>

            {/* Quick View Button */}
            {onQuickView && (
              <Button
                size="sm"
                variant="secondary"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0 bg-background/80 backdrop-blur-sm hover:bg-background hover:scale-110"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  onQuickView(product)
                }}
              >
                <Eye className="h-4 w-4" />
              </Button>
            )}
          </div>
        </Link>

        <div className="p-3 md:p-4 space-y-2 md:space-y-3">
          <div className="space-y-1">
            <Link href={`/product/${product.id}`}>
              <h3 className="font-semibold text-xs md:text-sm leading-tight line-clamp-2 hover:text-primary transition-colors">
                {product.title}
              </h3>
            </Link>
            <p className="text-xs text-muted-foreground hidden md:block">{product.author}</p>
            <p className="text-xs text-muted-foreground">{product.genre}</p>
          </div>

          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-medium">{product.rating}</span>
            <span className="text-xs text-muted-foreground">({reviewData?.totalCount || 0})</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm md:text-lg font-bold text-primary">{product.price}₽</span>
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="outline"
                className={`h-11 w-11 md:h-8 md:w-8 p-0 bg-transparent transition-all duration-200 hover:scale-110 active:scale-95 ${isInFavorites ? "text-red-500 border-red-500" : ""}`}
                onClick={handleToggleFavorite}
              >
                <Heart className={`h-4 w-4 md:h-3 md:w-3 transition-transform duration-200 ${isInFavorites ? "fill-red-500 scale-110" : ""}`} />
              </Button>
              <Button
                size="sm"
                className="h-11 w-11 md:h-8 md:w-8 p-0 transition-all duration-200 hover:scale-110 active:scale-95"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-4 w-4 md:h-3 md:w-3" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
