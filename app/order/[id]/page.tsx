"use client"

import { useParams, useRouter } from "next/navigation"
import { useStore } from "@/lib/store"
import { Header } from "@/components/header"
import { AnimatedBackground } from "@/components/animated-background"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { Clock, Package, Truck, CheckCircle, XCircle, ArrowLeft, Calendar, CreditCard } from "lucide-react"
import type { CartItem } from "@/types/index"

const ORDER_STATUSES = [
  { key: 'pending', label: 'Ожидание', icon: Clock },
  { key: 'processing', label: 'Обработка', icon: Package },
  { key: 'shipped', label: 'Отправлен', icon: Truck },
  { key: 'delivered', label: 'Доставлен', icon: CheckCircle },
]

export default function OrderTrackingPage() {
  const { id } = useParams()
  const router = useRouter()
  const { orders } = useStore()

  const order = orders.find(o => o.id === id)

  // Order not found state
  if (!order) {
    return (
      <AnimatedBackground>
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Breadcrumbs items={[
            { label: "Личный кабинет", href: "/account" },
            { label: "Заказ не найден" }
          ]} />

          <div className="flex flex-col items-center justify-center min-h-[50vh] animate-scale-in">
            <div className="glass rounded-2xl p-8 text-center max-w-md">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-destructive/20 to-destructive/5 flex items-center justify-center">
                <XCircle className="h-10 w-10 text-destructive" />
              </div>
              <h1 className="text-2xl font-bold mb-2">Заказ не найден</h1>
              <p className="text-muted-foreground mb-6">
                Заказ с номером {id} не существует или был удален.
              </p>
              <Button
                onClick={() => router.push('/account')}
                className="btn-glow"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Вернуться в кабинет
              </Button>
            </div>
          </div>
        </main>
      </AnimatedBackground>
    )
  }

  const isCancelled = order.status === 'cancelled'

  // Determine current status index for timeline
  const currentStatusIndex = ORDER_STATUSES.findIndex(s => s.key === order.status)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
      case "shipped":
        return "bg-primary/10 text-primary border-primary/20"
      case "processing":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
      case "cancelled":
        return "bg-destructive/10 text-destructive border-destructive/20"
      default:
        return "bg-muted text-muted-foreground border-border"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Ожидание"
      case "processing":
        return "Обработка"
      case "shipped":
        return "Отправлен"
      case "delivered":
        return "Доставлен"
      case "cancelled":
        return "Отменён"
      default:
        return status
    }
  }

  return (
    <AnimatedBackground>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Breadcrumbs items={[
          { label: "Личный кабинет", href: "/account" },
          { label: `Заказ ${order.id}` }
        ]} />

        {/* Back Button */}
        <div className="mb-6 animate-slide-up">
          <Button
            variant="ghost"
            onClick={() => router.push('/account')}
            className="group hover:bg-primary/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
            Вернуться в кабинет
          </Button>
        </div>

        {/* Order Header */}
        <Card className="glass border-primary/10 mb-6 overflow-hidden animate-slide-up">
          <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary" />
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">
                  <span className="gradient-text">Заказ</span> {order.id}
                </h1>
                <div className="flex items-center gap-4 mt-2 text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(order.date).toLocaleDateString('ru-RU', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-start md:items-end gap-2">
                <Badge className={`${getStatusColor(order.status)} border font-medium text-sm px-3 py-1`}>
                  {getStatusText(order.status)}
                </Badge>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <CreditCard className="h-4 w-4" />
                  <span className="text-lg font-bold gradient-text">${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status Timeline */}
        <Card className="glass border-primary/10 mb-6 anime-card-hover animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="gradient-text">Статус</span> заказа
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isCancelled ? (
              // Cancelled order state
              <div className="flex flex-col items-center justify-center py-8">
                <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4 animate-pulse">
                  <XCircle className="h-8 w-8 text-destructive" />
                </div>
                <h3 className="text-xl font-bold text-destructive mb-2">Заказ отменён</h3>
                <p className="text-muted-foreground text-center max-w-md">
                  Этот заказ был отменён. Если у вас есть вопросы, свяжитесь с нашей службой поддержки.
                </p>
              </div>
            ) : (
              // Normal order timeline
              <div className="relative">
                {/* Horizontal timeline for desktop */}
                <div className="hidden md:flex items-center justify-between">
                  {ORDER_STATUSES.map((status, index) => {
                    const Icon = status.icon
                    const isCompleted = index <= currentStatusIndex
                    const isCurrent = index === currentStatusIndex

                    return (
                      <div key={status.key} className="flex flex-col items-center relative z-10">
                        {/* Icon circle */}
                        <div
                          className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 ${
                            isCompleted
                              ? 'bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/30'
                              : 'bg-muted border-2 border-muted-foreground/20'
                          } ${isCurrent ? 'ring-4 ring-primary/30 scale-110' : ''}`}
                        >
                          <Icon className={`h-6 w-6 ${isCompleted ? 'text-white' : 'text-muted-foreground'}`} />
                        </div>

                        {/* Label */}
                        <span className={`mt-3 text-sm font-medium transition-colors ${
                          isCompleted ? 'text-foreground' : 'text-muted-foreground'
                        }`}>
                          {status.label}
                        </span>

                        {/* Current indicator */}
                        {isCurrent && (
                          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2">
                            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                          </div>
                        )}
                      </div>
                    )
                  })}

                  {/* Connection lines */}
                  <div className="absolute top-7 left-0 right-0 h-0.5 bg-muted-foreground/20 -z-0" />
                  <div
                    className="absolute top-7 left-0 h-0.5 bg-gradient-to-r from-primary to-accent transition-all duration-700 -z-0"
                    style={{
                      width: currentStatusIndex >= 0
                        ? `${(currentStatusIndex / (ORDER_STATUSES.length - 1)) * 100}%`
                        : '0%'
                    }}
                  />
                </div>

                {/* Vertical timeline for mobile */}
                <div className="md:hidden space-y-6">
                  {ORDER_STATUSES.map((status, index) => {
                    const Icon = status.icon
                    const isCompleted = index <= currentStatusIndex
                    const isCurrent = index === currentStatusIndex

                    return (
                      <div key={status.key} className="flex items-center gap-4 relative">
                        {/* Vertical line */}
                        {index < ORDER_STATUSES.length - 1 && (
                          <div
                            className={`absolute left-5 top-12 w-0.5 h-8 transition-colors duration-500 ${
                              index < currentStatusIndex
                                ? 'bg-gradient-to-b from-primary to-accent'
                                : 'bg-muted-foreground/20'
                            }`}
                          />
                        )}

                        {/* Icon circle */}
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500 ${
                            isCompleted
                              ? 'bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/30'
                              : 'bg-muted border-2 border-muted-foreground/20'
                          } ${isCurrent ? 'ring-4 ring-primary/30 scale-110' : ''}`}
                        >
                          <Icon className={`h-5 w-5 ${isCompleted ? 'text-white' : 'text-muted-foreground'}`} />
                        </div>

                        {/* Label */}
                        <div className="flex-1">
                          <span className={`text-sm font-medium transition-colors ${
                            isCompleted ? 'text-foreground' : 'text-muted-foreground'
                          }`}>
                            {status.label}
                          </span>
                          {isCurrent && (
                            <span className="ml-2 text-xs text-primary animate-pulse">
                              (текущий статус)
                            </span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order Items */}
        <Card className="glass border-primary/10 anime-card-hover animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="gradient-text">Товары</span> в заказе
              <Badge variant="secondary" className="ml-2">{order.items.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {order.items.map((item: CartItem, index: number) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 rounded-xl bg-background/30 border border-primary/5 hover:border-primary/20 transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${0.3 + index * 0.05}s` }}
                >
                  {/* Product Image */}
                  <div className="relative w-16 h-20 md:w-20 md:h-28 flex-shrink-0 rounded-lg overflow-hidden shadow-lg">
                    <Image
                      src={item.image}
                      alt={item.title || 'Product'}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 64px, 80px"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm md:text-base truncate">
                      {item.title}
                    </h4>
                    {item.author && (
                      <p className="text-xs md:text-sm text-muted-foreground truncate">
                        {item.author}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        x{item.quantity}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        ${item.price.toFixed(2)} / шт
                      </span>
                    </div>
                  </div>

                  {/* Item Total */}
                  <div className="text-right flex-shrink-0">
                    <span className="font-bold gradient-text text-lg">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Total */}
            <Separator className="my-6 bg-primary/10" />
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold">Итого:</span>
              <span className="text-2xl font-bold gradient-text">
                ${order.total.toFixed(2)}
              </span>
            </div>
          </CardContent>
        </Card>
      </main>
    </AnimatedBackground>
  )
}
