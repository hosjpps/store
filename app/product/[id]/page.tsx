"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Heart, ShoppingCart, Star, Plus, Minus } from "lucide-react"
import { Header } from "@/components/header"
import { ProductCard } from "@/components/product-card"
import { ProductReviews } from "@/components/product-reviews";
import reviews from "@/data/reviews.json";
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useStore } from "@/lib/store"
import products from "@/data/products.json"

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const [quantity, setQuantity] = useState(1)

  const { addToCart, addToFavorites, removeFromFavorites, favorites } = useStore()

  const productId = Number.parseInt(params.id as string)
  const product = products.find((p) => p.id === productId)
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

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Товар не найден</h1>
            <Button onClick={() => router.push("/")}>Вернуться на главную</Button>
          </div>
        </div>
      </div>
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
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-4 md:py-8">
        {/* Навигация назад */}
        <Button variant="ghost" onClick={() => router.back()} className="mb-4 md:mb-6 p-0 h-auto">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Назад к каталогу
        </Button>

        <div className="grid lg:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-12">
          {/* Изображение товара */}
          <div className="space-y-4">
            <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-muted">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Информация о товаре */}
          <div className="space-y-4 md:space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">{product.type}</Badge>
                <Badge variant="outline">{product.genre}</Badge>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{product.title}</h1>
              <p className="text-base md:text-lg text-muted-foreground mb-4">Автор: {product.author}</p>
            </div>

            {/* Рейтинг */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">{renderStars(product.rating)}</div>
              <span className="font-semibold">{product.rating}</span>
              <span className="text-muted-foreground">({reviewData?.totalCount || 0} отзывов)</span>
            </div>

            {/* Цена */}
            <div className="text-2xl md:text-4xl font-bold text-primary">{product.price}₽</div>

            {/* Описание */}
            <div>
              <h3 className="font-semibold mb-2">Описание</h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{product.description}</p>
            </div>

            <Separator />

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
                    className="h-8 w-8 p-0"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-8 md:w-12 text-center font-medium text-sm md:text-base">{quantity}</span>
                  <Button variant="outline" size="sm" onClick={() => setQuantity(quantity + 1)} className="h-8 w-8 p-0">
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-2 md:gap-3">
                <Button onClick={handleAddToCart} className="flex-1 text-sm md:text-base">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Добавить в корзину</span>
                  <span className="sm:hidden">В корзину</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={handleToggleFavorite}
                  className={`h-10 w-10 md:h-auto md:w-auto md:px-4 ${isInFavorites ? "text-red-500 border-red-500" : ""}`}
                >
                  <Heart className={`h-4 w-4 ${isInFavorites ? "fill-red-500" : ""}`} />
                </Button>
              </div>
            </div>

            {/* Дополнительная информация */}
            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Тип:</span>
                    <p className="text-muted-foreground">{product.type}</p>
                  </div>
                  <div>
                    <span className="font-medium">Жанр:</span>
                    <p className="text-muted-foreground">{product.genre}</p>
                  </div>
                  <div>
                    <span className="font-medium">Автор:</span>
                    <p className="text-muted-foreground">{product.author}</p>
                  </div>
                  <div>
                    <span className="font-medium">Рейтинг:</span>
                    <p className="text-muted-foreground">{product.rating}/5</p>
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
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Похожие товары</h2>
              <Button variant="ghost" asChild>
                <Link href="/">Смотреть все</Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
