"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag } from "lucide-react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useStore } from "@/lib/store"

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart, addOrder, user } = useStore()
  const [isProcessing, setIsProcessing] = useState(false)

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId)
    } else {
      updateQuantity(productId, newQuantity)
    }
  }

  const handleCheckout = async () => {
    if (!user) {
      alert("Войдите в аккаунт для оформления заказа")
      return
    }

    setIsProcessing(true)
    
    // Создаем заказ
    const order = {
      userId: user.id,
      items: cart,
      total: totalPrice,
      status: 'processing' as const,
      date: new Date().toLocaleDateString('ru-RU')
    }
    
    // Имитация процесса оформления заказа
    await new Promise((resolve) => setTimeout(resolve, 2000))
    
    addOrder(order)
    alert("Заказ успешно оформлен! Спасибо за покупку!")
    clearCart()
    setIsProcessing(false)
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-4 md:py-8">
          <div className="text-center py-8 md:py-12">
            <ShoppingBag className="h-16 md:h-24 w-16 md:w-24 mx-auto text-muted-foreground mb-4 md:mb-6" />
            <h1 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Ваша корзина пуста</h1>
            <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6">Добавьте товары из каталога, чтобы начать покупки</p>
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

        <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
          {/* Список товаров в корзине */}
          <div className="lg:col-span-2 space-y-3 md:space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 md:mb-6 gap-3">
              <h1 className="text-xl md:text-2xl font-bold">Корзина ({totalItems})</h1>
              <Button variant="outline" onClick={clearCart} className="text-destructive bg-transparent w-full sm:w-auto">
                <Trash2 className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Очистить корзину</span>
                <span className="sm:hidden">Очистить</span>
              </Button>
            </div>

            {cart.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    {/* Изображение товара */}
                    <Link href={`/product/${item.id}`} className="flex-shrink-0">
                      <div className="relative w-20 h-28 overflow-hidden rounded-md bg-muted">
                        <Image src={item.image || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
                      </div>
                    </Link>

                    {/* Информация о товаре */}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <Link href={`/product/${item.id}`}>
                            <h3 className="font-semibold hover:text-primary transition-colors line-clamp-2">
                              {item.title}
                            </h3>
                          </Link>
                          <p className="text-sm text-muted-foreground">{item.author}</p>
                          <div className="flex gap-2 mt-1">
                            <Badge variant="secondary" className="text-xs">
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
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Управление количеством и цена */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-12 text-center font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-primary">{(item.price * item.quantity).toFixed(2)}₽</div>
                          <div className="text-sm text-muted-foreground">{item.price}₽ за шт.</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Сводка заказа */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6 space-y-4">
                <h2 className="text-xl font-bold">Итого</h2>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Товары ({totalItems} шт.)</span>
                    <span>{totalPrice.toFixed(2)}₽</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Доставка</span>
                    <span className="text-green-600">Бесплатно</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>К оплате</span>
                  <span className="text-primary">{totalPrice.toFixed(2)}₽</span>
                </div>

                <Button onClick={handleCheckout} disabled={isProcessing} className="w-full" size="lg">
                  {isProcessing ? "Обработка..." : "Оформить заказ"}
                </Button>

                <div className="text-xs text-muted-foreground text-center">
                  Нажимая "Оформить заказ", вы соглашаетесь с условиями использования
                </div>
              </CardContent>
            </Card>

            {/* Преимущества */}
            <Card className="mt-4">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Почему выбирают нас?</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Бесплатная доставка от €50</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Гарантия качества</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Быстрая доставка 1-3 дня</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Возврат в течение 14 дней</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
