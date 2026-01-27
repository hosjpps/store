"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingCart, Star, Plus, Minus, ChevronRight, Home } from "lucide-react"
import { Header } from "@/components/header"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { ProductCard } from "@/components/product-card"
import { ProductReviews } from "@/components/product-reviews";
import { AnimatedBackground, FloatingMangaPage, StarBurst, Sparkle } from "@/components/animated-background"
import { ProductPageSkeleton } from "@/components/skeletons"
import reviews from "@/data/reviews.json";
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useStore } from "@/lib/store"
import products from "@/data/products.json"

// Base64 blur placeholder for images
const blurDataURL = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAMI/8QAIhAAAgEDAwUBAAAAAAAAAAAAAQIDAAQRBRIhBhMxQVFh/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAZEQACAwEAAAAAAAAAAAAAAAABAgADESH/2gAMAwEAAhEDEQA/AKVLqN7aT28ltcSwyrKC8bYyFPkZGR9FdBqHX2pXdhLbXFjbsJIijMjOD4I8g5/aKKKGxQT2JYhsz//Z"

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(true)

  const { addToCart, addToFavorites, removeFromFavorites, favorites, addToRecentlyViewed } = useStore()

  const productId = Number.parseInt(params.id as string)
  const product = products.find((p) => p.id === productId)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 300)
    return () => clearTimeout(timer)
  }, [])

  // Track recently viewed products
  useEffect(() => {
    if (product) {
      addToRecentlyViewed(product)
    }
  }, [product, addToRecentlyViewed])
  const reviewData = reviews.find(r => r.productId === productId)
  const relatedProducts = products
    .filter((p) => {
      if (p.id === productId) return false
      if (p.type === product?.type) return true

      // Проверяем пересечение жанров
      const productGenres = product?.genre?.split(', ') || []
      const pGenres = p.genre?.split(', ') || []
      return productGenres.some(genre => pGenres.includes(genre))
    })
    .slice(0, 4)

  const isInFavorites = favorites.some((fav) => fav.id === productId)

  if (isLoading) {
    return (
      <AnimatedBackground className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-4 md:py-8">
          <ProductPageSkeleton />
        </main>
      </AnimatedBackground>
    )
  }

  if (!product) {
    return (
      <AnimatedBackground className="min-h-screen">
        <Header />

        {/* Decorative elements */}
        <Sparkle className="top-32 left-1/4 hidden md:block" size={20} />
        <Sparkle className="top-48 right-1/3 hidden md:block" size={16} />

        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="glass rounded-2xl p-8 md:p-12 max-w-md mx-auto">
              <h1 className="text-2xl font-bold mb-4">Товар не найден</h1>
              <p className="text-muted-foreground mb-6">К сожалению, запрашиваемый товар не существует.</p>
              <Button onClick={() => router.push("/")} className="btn-glow">
                <Home className="h-4 w-4 mr-2" />
                Вернуться на главную
              </Button>
            </div>
          </div>
        </div>
      </AnimatedBackground>
    )
  }



  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product)
    }
  }

  const handleToggleFavorite = () => {
    if (isInFavorites) {
      removeFromFavorites(product.id)
    } else {
      addToFavorites(product)
    }
  }

  const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" className="h-4 w-4 fill-yellow-400/50 text-yellow-400" />)
    }

    const emptyStars = 5 - Math.ceil(rating)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />)
    }

    return stars
  }

  return (
    <AnimatedBackground className="min-h-screen">
      <Header />

      {/* Decorative floating elements - behind content */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <FloatingMangaPage className="absolute top-32 right-8 opacity-30 hidden lg:block" />
        <StarBurst className="absolute top-40 left-16 hidden lg:block" />
        <Sparkle className="absolute top-64 right-1/4 hidden md:block" size={24} />
        <Sparkle className="absolute bottom-1/3 left-1/4 hidden md:block" size={16} />
      </div>

      <main className="container mx-auto px-4 py-4 md:py-8 relative z-10">
        <Breadcrumbs items={[
          { label: product.type, href: `/?type=${product.type}` },
          { label: product.title }
        ]} />

        <div className="grid lg:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-12">
          {/* Изображение товара */}
          <div className="space-y-4">
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-muted group">
              {/* Glow effect behind image */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                priority
                placeholder="blur"
                blurDataURL={blurDataURL}
              />
              {/* Image overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>

          {/* Информация о товаре - Glass Card */}
          <div className="glass rounded-2xl p-6 md:p-8 space-y-4 md:space-y-6 h-fit">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                  {product.type}
                </Badge>
                <Badge variant="outline" className="border-accent/30 text-accent">
                  {product.genre}
                </Badge>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2 gradient-text">{product.title}</h1>
              <p className="text-base md:text-lg text-muted-foreground mb-4">Автор: {product.author}</p>
            </div>

            {/* Рейтинг */}
            <div className="flex items-center gap-2 p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/20 w-fit">
              <div className="flex items-center gap-1">{renderStars(product.rating)}</div>
              <span className="font-semibold">{product.rating}</span>
              <span className="text-muted-foreground">({reviewData?.totalCount || 0} отзывов)</span>
            </div>

            {/* Цена */}
            <div className="text-2xl md:text-4xl font-bold text-primary animate-pulse-soft">{product.price}₽</div>

            {/* Описание */}
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Описание</h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{product.description}</p>
            </div>

            <Separator className="bg-border/50" />

            {/* Управление количеством и кнопки */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 md:gap-4">
                <span className="font-medium text-sm md:text-base">Количество:</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="h-10 w-10 p-0 rounded-full hover:bg-primary/10 hover:border-primary/50 transition-all"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-10 md:w-12 text-center font-bold text-lg">{quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                    className="h-10 w-10 p-0 rounded-full hover:bg-primary/10 hover:border-primary/50 transition-all"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-2 md:gap-3">
                <Button
                  onClick={handleAddToCart}
                  className="flex-1 text-sm md:text-base btn-glow glow-pulse h-12 rounded-xl group"
                >
                  <ShoppingCart className="h-4 w-4 mr-2 group-hover:animate-bounce" />
                  <span className="hidden sm:inline">Добавить в корзину</span>
                  <span className="sm:hidden">В корзину</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={handleToggleFavorite}
                  className={`h-12 w-12 md:h-12 md:w-auto md:px-4 rounded-xl transition-all duration-300 ${
                    isInFavorites
                      ? "text-red-500 border-red-500 bg-red-500/10 hover:bg-red-500/20"
                      : "hover:border-red-500/50 hover:text-red-500"
                  }`}
                >
                  <Heart className={`h-5 w-5 transition-transform ${isInFavorites ? "fill-red-500 scale-110" : "hover:scale-110"}`} />
                </Button>
              </div>
            </div>

            {/* Дополнительная информация */}
            <Card className="bg-background/50 border-border/50 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <span className="font-medium text-muted-foreground">Тип:</span>
                    <p className="font-semibold">{product.type}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="font-medium text-muted-foreground">Жанр:</span>
                    <p className="font-semibold">{product.genre}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="font-medium text-muted-foreground">Автор:</span>
                    <p className="font-semibold">{product.author}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="font-medium text-muted-foreground">Рейтинг:</span>
                    <p className="font-semibold">{product.rating}/5</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Отзывы */}
        <div className="mb-12">
          <ProductReviews
            productId={product.id}
            totalCount={reviews.find(r => r.productId === product.id)?.totalCount}
            averageRating={reviews.find(r => r.productId === product.id)?.averageRating}
          />
        </div>

        {/* Похожие товары */}
        {relatedProducts.length > 0 && (
          <section className="animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                <span className="gradient-text">Похожие</span> товары
              </h2>
              <Button variant="ghost" asChild className="group">
                <Link href="/">
                  Смотреть все
                  <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((relatedProduct, index) => (
                <div
                  key={relatedProduct.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <ProductCard product={relatedProduct} />
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer spacer */}
      <div className="h-16" />
    </AnimatedBackground>
  )
}
