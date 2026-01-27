"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Heart, ShoppingBag, Sparkles, Trash2 } from "lucide-react"
import { Header } from "@/components/header"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { ProductCard } from "@/components/product-card"
import { FavoritesSkeleton } from "@/components/skeletons"
import { Button } from "@/components/ui/button"
import { AnimatedBackground } from "@/components/animated-background"
import { useStore } from "@/lib/store"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function FavoritesPage() {
  const { favorites, removeFromFavorites } = useStore()
  const [isClearing, setIsClearing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 300)
    return () => clearTimeout(timer)
  }, [])

  const handleClearAll = () => {
    setIsClearing(true)
    favorites.forEach((product) => removeFromFavorites(product.id))
    setTimeout(() => setIsClearing(false), 300)
  }

  if (isLoading) {
    return (
      <AnimatedBackground>
        <Header />
        <main className="container mx-auto px-4 py-4 md:py-8">
          <Breadcrumbs items={[{ label: "Избранное" }]} />
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              <span className="gradient-text">Избранное</span>
            </h1>
          </div>
          <FavoritesSkeleton />
        </main>
      </AnimatedBackground>
    )
  }

  if (favorites.length === 0) {
    return (
      <AnimatedBackground>
        <Header />
        <main className="container mx-auto px-4 py-8 md:py-16">
          <div className="max-w-md mx-auto text-center animate-scale-in">
            {/* Glass card for empty state */}
            <div className="glass rounded-2xl p-8 md:p-12 relative overflow-hidden">
              {/* Gradient accent */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary" />

              {/* Icon with glow effect */}
              <div className="relative w-24 h-24 md:w-32 md:h-32 mx-auto mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30 rounded-full blur-2xl" />
                <div className="relative w-full h-full flex items-center justify-center">
                  <Heart className="h-16 md:h-20 w-16 md:w-20 text-muted-foreground/50" />
                </div>
              </div>

              <h1 className="text-2xl md:text-3xl font-bold mb-3">
                <span className="gradient-text">Избранное</span> пусто
              </h1>
              <p className="text-sm md:text-base text-muted-foreground mb-6 px-4">
                Добавляйте товары в избранное, чтобы не потерять их и купить позже
              </p>

              <Button asChild className="btn-glow glow-pulse group">
                <Link href="/">
                  <Sparkles className="mr-2 h-4 w-4 group-hover:animate-bounce" />
                  Перейти к покупкам
                </Link>
              </Button>
            </div>
          </div>
        </main>
      </AnimatedBackground>
    )
  }

  return (
    <AnimatedBackground>
      <Header />

      <main className="container mx-auto px-4 py-4 md:py-8">
        <Breadcrumbs items={[
          { label: "Избранное" }
        ]} />

        {/* Header section with gradient text */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 md:mb-10 gap-4 animate-slide-up">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              <span className="gradient-text">Избранное</span>
            </h1>
            <p className="text-sm md:text-base text-muted-foreground flex items-center gap-2">
              <Heart className="h-4 w-4 text-primary" />
              У вас {favorites.length} {favorites.length === 1 ? "товар" : favorites.length < 5 ? "товара" : "товаров"} в избранном
            </p>
          </div>

          {/* Clear all with confirmation dialog */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="text-destructive border-destructive/30 hover:bg-destructive/10 hover:border-destructive/50 transition-all w-full sm:w-auto group"
                disabled={isClearing}
              >
                <Trash2 className="h-4 w-4 mr-2 group-hover:animate-bounce" />
                <span className="hidden sm:inline">Очистить избранное</span>
                <span className="sm:hidden">Очистить</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="glass">
              <AlertDialogHeader>
                <AlertDialogTitle>Очистить избранное?</AlertDialogTitle>
                <AlertDialogDescription>
                  Вы уверены, что хотите удалить все {favorites.length} {favorites.length === 1 ? "товар" : favorites.length < 5 ? "товара" : "товаров"} из избранного?
                  Это действие нельзя отменить.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Отмена</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleClearAll}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Очистить
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* Products grid with stagger animations */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
          {favorites.map((product, index) => (
            <div
              key={product.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Ready to buy card with glass morphism */}
        <div className="mt-10 md:mt-16 animate-slide-up" style={{ animationDelay: `${favorites.length * 0.05 + 0.1}s` }}>
          <div className="glass rounded-2xl p-8 md:p-10 text-center relative overflow-hidden group hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
            {/* Gradient accent line */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary opacity-50 group-hover:opacity-100 transition-opacity" />

            {/* Icon with glow */}
            <div className="relative w-16 h-16 md:w-20 md:h-20 mx-auto mb-4">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-xl group-hover:blur-2xl transition-all" />
              <div className="relative w-full h-full flex items-center justify-center">
                <ShoppingBag className="h-10 md:h-12 w-10 md:w-12 text-primary group-hover:scale-110 transition-transform" />
              </div>
            </div>

            <h2 className="text-xl md:text-2xl font-bold mb-2">
              Готовы к <span className="gradient-text">покупке</span>?
            </h2>
            <p className="text-sm md:text-base text-muted-foreground mb-6 max-w-md mx-auto">
              Добавьте товары из избранного в корзину и оформите заказ
            </p>

            <Button asChild className="btn-glow group">
              <Link href="/cart">
                <ShoppingBag className="mr-2 h-4 w-4 group-hover:animate-bounce" />
                Перейти в корзину
              </Link>
            </Button>
          </div>
        </div>
      </main>

      {/* Footer spacer */}
      <div className="h-16" />
    </AnimatedBackground>
  )
}
