"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingCart, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useStore } from "@/lib/store"
import reviews from "@/data/reviews.json"

import { Product } from '@/types/index'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, addToFavorites, removeFromFavorites, favorites } = useStore()
  const reviewData = reviews.find(r => r.productId === product.id)

  const isInFavorites = favorites.some((fav) => fav.id === product.id)

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
    <Card className="anime-card-hover group overflow-hidden">
      <CardContent className="p-0">
        <Link href={`/product/${product.id}`}>
          <div className="relative aspect-[3/4] overflow-hidden">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute top-2 left-2">
              <Badge variant="secondary" className="text-xs">
                {product.type}
              </Badge>
            </div>
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
                className={`h-7 w-7 md:h-8 md:w-8 p-0 bg-transparent ${isInFavorites ? "text-red-500 border-red-500" : ""}`}
                onClick={handleToggleFavorite}
              >
                <Heart className={`h-3 w-3 ${isInFavorites ? "fill-red-500" : ""}`} />
              </Button>
              <Button size="sm" className="h-7 w-7 md:h-8 md:w-8 p-0" onClick={handleAddToCart}>
                <ShoppingCart className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
