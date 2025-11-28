"use client"

import Link from "next/link"
import { ArrowLeft, Heart, ShoppingBag } from "lucide-react"
import { Header } from "@/components/header"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { useStore } from "@/lib/store"

export default function FavoritesPage() {
  const { favorites, removeFromFavorites } = useStore()

  if (favorites.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-4 md:py-8">
          <div className="text-center py-8 md:py-12">
            <Heart className="h-16 md:h-24 w-16 md:w-24 mx-auto text-muted-foreground mb-4 md:mb-6" />
            <h1 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Ваш список избранного пуст</h1>
            <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6 px-4">
              Добавляйте товары в избранное, чтобы не потерять их и купить позже
            </p>
            <Button asChild>
              <Link href="/">Перейти к покупкам</Link>
            </Button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-4 md:py-8">
        {/* Навигация назад */}
        <Button variant="ghost" asChild className="mb-4 md:mb-6 p-0 h-auto">
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Продолжить покупки</span>
            <span className="sm:hidden">Назад</span>
          </Link>
        </Button>

        {/* Заголовок */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 md:mb-8 gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2">Избранное</h1>
            <p className="text-sm md:text-base text-muted-foreground">
              У вас {favorites.length} {favorites.length === 1 ? "товар" : "товаров"} в избранном
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              favorites.forEach((product) => removeFromFavorites(product.id))
            }}
            className="text-destructive bg-transparent w-full sm:w-auto"
          >
            <span className="hidden sm:inline">Очистить избранное</span>
            <span className="sm:hidden">Очистить</span>
          </Button>
        </div>

        {/* Сетка товаров */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
          {favorites.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Рекомендации для покупок */}
        <div className="mt-8 md:mt-12 text-center">
          <div className="bg-muted/50 rounded-lg p-6 md:p-8">
            <ShoppingBag className="h-10 md:h-12 w-10 md:w-12 mx-auto text-primary mb-3 md:mb-4" />
            <h2 className="text-lg md:text-xl font-semibold mb-2">Готовы к покупке?</h2>
            <p className="text-sm md:text-base text-muted-foreground mb-4 px-4">Добавьте товары из избранного в корзину и оформите заказ</p>
            <Button asChild>
              <Link href="/cart">Перейти в корзину</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
