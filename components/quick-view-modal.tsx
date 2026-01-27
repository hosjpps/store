"use client"

import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingCart, Star, X } from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useStore } from "@/lib/store"
import { toast } from "sonner"
import reviews from "@/data/reviews.json"

import { Product } from "@/types/index"

// Base64 blur placeholder for images
const blurDataURL = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAMI/8QAIhAAAgEDAwUBAAAAAAAAAAAAAQIDAAQRBRIhBhMxQVFh/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAZEQACAwEAAAAAAAAAAAAAAAABAgADESH/2gAMAwEAAhEDEQA/AKVLqN7aT28ltcSwyrKC8bYyFPkZGR9FdBqHX2pXdhLbXFjbsJIijMjOD4I8g5/aKKKGxQT2JYhsz//Z"

interface QuickViewModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
}

export function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const { addToCart, addToFavorites, removeFromFavorites, favorites } = useStore()

  if (!product) return null

  const reviewData = reviews.find((r) => r.productId === product.id)
  const isInFavorites = favorites.some((fav) => fav.id === product.id)

  const handleAddToCart = () => {
    addToCart({ ...product, description: "" })
    toast.success("Добавлено в корзину", {
      description: product.title,
    })
  }

  const handleToggleFavorite = () => {
    if (isInFavorites) {
      removeFromFavorites(product.id)
      toast.info("Удалено из избранного", {
        description: product.title,
      })
    } else {
      addToFavorites({ ...product, description: "" })
      toast.success("Добавлено в избранное", {
        description: product.title,
      })
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < Math.floor(rating)
            ? "fill-yellow-400 text-yellow-400"
            : index < rating
            ? "fill-yellow-400/50 text-yellow-400"
            : "fill-muted text-muted"
        }`}
      />
    ))
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="glass max-w-4xl w-[95vw] p-0 overflow-hidden border-white/20 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] duration-300"
      >
        {/* Hidden DialogTitle for accessibility */}
        <DialogTitle className="sr-only">
          Быстрый просмотр: {product.title}
        </DialogTitle>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 text-muted-foreground hover:text-foreground hover:bg-background transition-all duration-200 hover:scale-110 active:scale-95"
          aria-label="Закрыть"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col md:flex-row">
          {/* Product Image */}
          <div className="relative w-full md:w-2/5 aspect-[3/4] md:aspect-auto md:min-h-[500px] overflow-hidden">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 40vw"
              priority
              placeholder="blur"
              blurDataURL={blurDataURL}
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-black/10 pointer-events-none" />
          </div>

          {/* Product Info */}
          <div className="flex-1 p-6 md:p-8 flex flex-col justify-between space-y-6">
            {/* Header Section */}
            <div className="space-y-4">
              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="text-xs">
                  {product.type}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {product.genre}
                </Badge>
              </div>

              {/* Title & Author */}
              <div className="space-y-2">
                <h2 className="text-2xl md:text-3xl font-bold leading-tight">
                  {product.title}
                </h2>
                <p className="text-muted-foreground text-sm md:text-base">
                  {product.author}
                </p>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {renderStars(product.rating)}
                </div>
                <span className="text-sm font-medium">{product.rating}</span>
                <span className="text-sm text-muted-foreground">
                  ({reviewData?.totalCount || 0} отзывов)
                </span>
              </div>

              {/* Price */}
              <div className="text-3xl md:text-4xl font-bold gradient-text">
                {product.price.toLocaleString("ru-RU")} ₽
              </div>

              {/* Description */}
              <p className="text-muted-foreground text-sm md:text-base line-clamp-3 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Actions Section */}
            <div className="space-y-4">
              {/* Buttons */}
              <div className="flex gap-3">
                <Button
                  size="lg"
                  className="flex-1 h-12 text-base transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] btn-glow"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  В корзину
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className={`h-12 w-12 p-0 transition-all duration-200 hover:scale-110 active:scale-95 ${
                    isInFavorites
                      ? "text-red-500 border-red-500 hover:bg-red-500/10"
                      : "hover:text-red-500 hover:border-red-500"
                  }`}
                  onClick={handleToggleFavorite}
                  aria-label={isInFavorites ? "Удалить из избранного" : "Добавить в избранное"}
                >
                  <Heart
                    className={`h-5 w-5 transition-transform duration-200 ${
                      isInFavorites ? "fill-red-500 scale-110" : ""
                    }`}
                  />
                </Button>
              </div>

              {/* Link to product page */}
              <Link
                href={`/product/${product.id}`}
                onClick={onClose}
                className="inline-flex items-center justify-center w-full h-11 px-4 rounded-md border border-border bg-transparent text-foreground text-sm font-medium transition-all duration-200 hover:bg-accent hover:text-accent-foreground hover:border-primary/50 group"
              >
                <span>Подробнее</span>
                <svg
                  className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
