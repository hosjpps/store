"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, Trash2, ShoppingBag, Truck, Shield, Clock, Package, AlertTriangle, Sparkles, X } from "lucide-react"
import { Header } from "@/components/header"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { AnimatedBackground } from "@/components/animated-background"
import { CartPageSkeleton } from "@/components/skeletons"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
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
import { useStore } from "@/lib/store"
import { toast } from "sonner"

const FREE_SHIPPING_THRESHOLD = 3000 // Free shipping at 3000₽

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart, addOrder, user, appliedPromoCode, promoDiscount, applyPromoCode, removePromoCode } = useStore()
  const [isProcessing, setIsProcessing] = useState(false)
  const [promoInput, setPromoInput] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 300)
    return () => clearTimeout(timer)
  }, [])

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shippingProgress = Math.min((totalPrice / FREE_SHIPPING_THRESHOLD) * 100, 100)
  const amountForFreeShipping = FREE_SHIPPING_THRESHOLD - totalPrice

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId)
    } else {
      updateQuantity(productId, newQuantity)
    }
  }

  const handleApplyPromo = () => {
    if (!promoInput.trim()) {
      toast.error("Введите промокод", {
        description: "Поле промокода не может быть пустым"
      })
      return
    }

    const success = applyPromoCode(promoInput)
    if (success) {
      toast.success("Промокод применен!", {
        description: `Скидка ${promoDiscount || 'рассчитывается'}₽ добавлена к заказу`
      })
      setPromoInput("")
    } else {
      toast.error("Промокод недействителен", {
        description: "Проверьте код или условия минимального заказа"
      })
    }
  }

  const handleRemovePromo = () => {
    removePromoCode()
    toast.info("Промокод удален")
  }

  const handleCheckout = async () => {
    // Валидация: пользователь должен быть авторизован
    if (!user) {
      toast.error("Войдите в аккаунт", {
        description: "Для оформления заказа необходимо авторизоваться"
      })
      return
    }

    // Валидация: корзина не должна быть пустой
    if (cart.length === 0) {
      toast.error("Корзина пуста", {
        description: "Добавьте товары в корзину для оформления заказа"
      })
      return
    }

    setIsProcessing(true)

    try {
      // Create order with discount applied
      const finalTotal = totalPrice - promoDiscount
      const order = {
        userId: user.id,
        items: cart,
        total: finalTotal,
        status: 'processing' as const,
        date: new Date().toLocaleDateString('ru-RU')
      }

      // Simulate checkout process
      await new Promise((resolve) => setTimeout(resolve, 1500))

      addOrder(order)
      clearCart()
      removePromoCode()

      toast.success("Заказ оформлен!", {
        description: `Заказ на сумму ${finalTotal.toFixed(0)}₽ успешно создан`
      })
    } catch (error) {
      toast.error("Ошибка оформления", {
        description: "Произошла ошибка при оформлении заказа. Попробуйте снова."
      })
    } finally {
      setIsProcessing(false)
    }
  }

  if (isLoading) {
    return (
      <AnimatedBackground>
        <Header />
        <main className="container mx-auto px-4 py-4 md:py-8">
          <Breadcrumbs items={[{ label: "Корзина" }]} />
          <CartPageSkeleton />
        </main>
      </AnimatedBackground>
    )
  }

  if (cart.length === 0) {
    return (
      <AnimatedBackground>
        <Header />
        <main className="container mx-auto px-4 py-8 md:py-16">
          <div className="max-w-md mx-auto text-center">
            {/* Glass morphism empty state card */}
            <div className="glass rounded-2xl p-8 md:p-12 animate-scale-in">
              {/* Animated icon */}
              <div className="relative w-32 h-32 mx-auto mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-2xl animate-pulse" />
                <div className="relative w-full h-full flex items-center justify-center">
                  <ShoppingBag className="w-16 h-16 text-muted-foreground/50" />
                </div>
              </div>

              <h1 className="text-2xl md:text-3xl font-bold mb-3">
                <span className="gradient-text">Корзина</span> пуста
              </h1>
              <p className="text-muted-foreground mb-6">
                Добавьте товары из каталога, чтобы начать покупки
              </p>

              <Button asChild size="lg" className="btn-glow glow-pulse">
                <Link href="/">
                  <Sparkles className="mr-2 h-5 w-5" />
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
          { label: "Корзина" }
        ]} />

        <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
          {/* Cart items list */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            {/* Header with clear cart button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h1 className="text-2xl md:text-3xl font-bold">
                <span className="gradient-text">Корзина</span> ({totalItems})
              </h1>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="text-destructive bg-transparent hover:bg-destructive/10 w-full sm:w-auto glass">
                    <Trash2 className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Очистить корзину</span>
                    <span className="sm:hidden">Очистить</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="glass">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                      Очистить корзину?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Все товары будут удалены из корзины. Это действие нельзя отменить.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="glass">Отмена</AlertDialogCancel>
                    <AlertDialogAction onClick={clearCart} className="bg-destructive hover:bg-destructive/90">
                      Очистить
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            {/* Free shipping progress bar */}
            <Card className="glass border-primary/20 overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Truck className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    {amountForFreeShipping > 0 ? (
                      <p className="text-sm font-medium">
                        До бесплатной доставки осталось <span className="text-primary font-bold">{amountForFreeShipping.toFixed(0)}₽</span>
                      </p>
                    ) : (
                      <p className="text-sm font-medium text-green-600">
                        Поздравляем! Вы получили бесплатную доставку!
                      </p>
                    )}
                  </div>
                </div>
                {/* Progress bar */}
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${shippingProgress}%` }}
                  />
                </div>
                <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                  <span>0₽</span>
                  <span>{FREE_SHIPPING_THRESHOLD}₽</span>
                </div>
              </CardContent>
            </Card>

            {/* Cart items */}
            {cart.map((item, index) => (
              <Card
                key={item.id}
                className="glass border-primary/10 overflow-hidden group hover:border-primary/30 transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    {/* Product image */}
                    <Link href={`/product/${item.id}`} className="flex-shrink-0">
                      <div className="relative w-20 h-28 overflow-hidden rounded-lg bg-muted group-hover:scale-105 transition-transform duration-300">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <Image src={item.image || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
                      </div>
                    </Link>

                    {/* Product info */}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <Link href={`/product/${item.id}`}>
                            <h3 className="font-semibold hover:text-primary transition-colors line-clamp-2 group-hover:text-primary">
                              {item.title}
                            </h3>
                          </Link>
                          <p className="text-sm text-muted-foreground">{item.author}</p>
                          <div className="flex gap-2 mt-1">
                            <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-none">
                              {item.type}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {item.genre}
                            </Badge>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Quantity and price */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="h-8 w-8 p-0 min-h-[44px] min-w-[44px] md:min-h-0 md:min-w-0 hover:bg-primary/10 hover:border-primary/50"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-12 text-center font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            className="h-8 w-8 p-0 min-h-[44px] min-w-[44px] md:min-h-0 md:min-w-0 hover:bg-primary/10 hover:border-primary/50"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg gradient-text">{(item.price * item.quantity).toFixed(2)}₽</div>
                          <div className="text-sm text-muted-foreground">{item.price}₽ за шт.</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <Card className="glass border-primary/20 sticky top-24 overflow-hidden">
              {/* Gradient accent at top */}
              <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary" />
              <CardContent className="p-6 space-y-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  Итого
                </h2>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Товары ({totalItems} шт.)</span>
                    <span>{totalPrice.toFixed(2)}₽</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Доставка</span>
                    {amountForFreeShipping > 0 ? (
                      <span>от 299₽</span>
                    ) : (
                      <span className="text-green-600 font-medium">Бесплатно</span>
                    )}
                  </div>
                  {promoDiscount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Скидка</span>
                      <span className="text-green-600 font-medium">-{promoDiscount}₽</span>
                    </div>
                  )}
                </div>

                <Separator className="bg-border/50" />

                {/* Promo Code Section */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Промокод</label>
                  {appliedPromoCode ? (
                    <div className="flex items-center justify-between p-2 rounded-lg bg-green-500/10 border border-green-500/20">
                      <div>
                        <span className="font-medium text-green-600">{appliedPromoCode}</span>
                        <span className="text-sm text-muted-foreground ml-2">-{promoDiscount}₽</span>
                      </div>
                      <Button variant="ghost" size="sm" onClick={handleRemovePromo}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Input
                        placeholder="Введите промокод"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleApplyPromo()}
                      />
                      <Button onClick={handleApplyPromo}>Применить</Button>
                    </div>
                  )}
                </div>

                <Separator className="bg-border/50" />

                <div className="flex justify-between text-lg font-bold">
                  <span>К оплате</span>
                  <span className="gradient-text text-xl">{(totalPrice - promoDiscount).toFixed(2)}₽</span>
                </div>

                {!user && (
                  <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-sm">
                    <p className="text-amber-600 dark:text-amber-400">
                      Войдите в аккаунт для оформления заказа
                    </p>
                  </div>
                )}

                <Button
                  onClick={handleCheckout}
                  disabled={isProcessing || !user}
                  className="w-full btn-glow glow-pulse"
                  size="lg"
                >
                  {isProcessing ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Обработка...
                    </>
                  ) : (
                    "Оформить заказ"
                  )}
                </Button>

                <div className="text-xs text-muted-foreground text-center">
                  Нажимая "Оформить заказ", вы соглашаетесь с условиями использования
                </div>
              </CardContent>
            </Card>

            {/* Benefits card */}
            <Card className="glass border-primary/10 mt-4 overflow-hidden">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-accent" />
                  Почему выбирают нас?
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 group">
                    <div className="p-2 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <Truck className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm text-muted-foreground">Бесплатная доставка от 3000₽</span>
                  </div>
                  <div className="flex items-center gap-3 group">
                    <div className="p-2 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <Shield className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm text-muted-foreground">Гарантия качества</span>
                  </div>
                  <div className="flex items-center gap-3 group">
                    <div className="p-2 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <Clock className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm text-muted-foreground">Быстрая доставка 1-3 дня</span>
                  </div>
                  <div className="flex items-center gap-3 group">
                    <div className="p-2 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <Package className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm text-muted-foreground">Возврат в течение 14 дней</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </AnimatedBackground>
  )
}
