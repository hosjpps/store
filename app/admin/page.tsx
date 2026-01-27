"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { AdminLayout } from "@/components/admin/admin-layout"
import { AnimatedCounter } from "@/components/admin/animated-counter"
import {
  SalesChart,
  OrdersChart,
  RevenueChart,
  CategoryDonut,
  sampleSalesData,
  sampleOrdersData,
  sampleRevenueData,
  sampleCategoryData,
} from "@/components/admin/admin-charts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Users,
  Package,
  ShoppingCart,
  Star,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  DollarSign,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  FileText,
  Settings,
  BarChart3,
  Activity,
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useStore } from "@/lib/store"
import users from "@/data/users.json"
import products from "@/data/products.json"
import reviews from "@/data/reviews.json"

// Loading skeleton component for the dashboard
function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      {/* Welcome section skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-10 w-80 bg-white/5" />
        <Skeleton className="h-5 w-48 bg-white/5" />
      </div>

      {/* Stats grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-36 rounded-2xl bg-white/5" />
        ))}
      </div>

      {/* Charts skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-80 rounded-2xl bg-white/5" />
        ))}
      </div>
    </div>
  )
}

// Stats card component with glass morphism effect
interface StatsCardProps {
  title: string
  value: number
  prefix?: string
  suffix?: string
  subtitle: string
  icon: React.ComponentType<{ className?: string }>
  trend?: { value: number; isPositive: boolean }
  gradient: string
  delay?: number
}

function StatsCard({
  title,
  value,
  prefix = "",
  suffix = "",
  subtitle,
  icon: Icon,
  trend,
  gradient,
  delay = 0,
}: StatsCardProps) {
  return (
    <div
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:shadow-xl hover:shadow-violet-500/10 hover:-translate-y-1"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Gradient accent */}
      <div
        className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${gradient}`}
      />

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-xl ${gradient} shadow-lg`}
          >
            <Icon className="h-6 w-6 text-white" />
          </div>
          {trend && (
            <div
              className={`flex items-center gap-1 text-sm font-medium ${
                trend.isPositive ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {trend.isPositive ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              {trend.value}%
            </div>
          )}
        </div>

        <div className="space-y-1">
          <h3 className="text-sm font-medium text-slate-400">{title}</h3>
          <div className="text-3xl font-bold text-white">
            <AnimatedCounter
              target={value}
              prefix={prefix}
              suffix={suffix}
              duration={2000}
            />
          </div>
          <p className="text-xs text-slate-500">{subtitle}</p>
        </div>
      </div>
    </div>
  )
}

// Chart card component with glass morphism effect
interface ChartCardProps {
  title: string
  description?: string
  children: React.ReactNode
  action?: React.ReactNode
}

function ChartCard({ title, description, children, action }: ChartCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
      <div className="flex items-center justify-between p-6 pb-0">
        <div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          {description && (
            <p className="text-sm text-slate-400 mt-1">{description}</p>
          )}
        </div>
        {action}
      </div>
      <div className="p-6 pt-4">{children}</div>
    </div>
  )
}

// Activity item component
interface ActivityItemProps {
  icon: React.ComponentType<{ className?: string }>
  iconBg: string
  title: string
  description: string
  time: string
}

function ActivityItem({
  icon: Icon,
  iconBg,
  title,
  description,
  time,
}: ActivityItemProps) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors">
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconBg}`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">{title}</p>
        <p className="text-xs text-slate-400 truncate">{description}</p>
      </div>
      <span className="text-xs text-slate-500 whitespace-nowrap">{time}</span>
    </div>
  )
}

// Quick action card component
interface QuickActionProps {
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  href: string
  gradient: string
}

function QuickAction({
  title,
  description,
  icon: Icon,
  href,
  gradient,
}: QuickActionProps) {
  return (
    <Link href={href}>
      <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:shadow-xl hover:-translate-y-1">
        <div className={`absolute top-0 right-0 w-32 h-32 ${gradient} opacity-20 blur-3xl group-hover:opacity-40 transition-opacity`} />
        <div className="relative z-10">
          <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${gradient} shadow-lg mb-4`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-violet-400 transition-colors">
            {title}
          </h3>
          <p className="text-sm text-slate-400 mb-4">{description}</p>
          <div className="flex items-center text-sm font-medium text-violet-400 group-hover:text-violet-300 transition-colors">
            Перейти
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  )
}

// Order status badge component
function OrderStatusBadge({ status }: { status: string }) {
  const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; className: string }> = {
    pending: { label: "Ожидает", variant: "outline", className: "border-amber-500/50 text-amber-400 bg-amber-500/10" },
    processing: { label: "Обработка", variant: "outline", className: "border-blue-500/50 text-blue-400 bg-blue-500/10" },
    shipped: { label: "Отправлен", variant: "outline", className: "border-violet-500/50 text-violet-400 bg-violet-500/10" },
    delivered: { label: "Доставлен", variant: "outline", className: "border-emerald-500/50 text-emerald-400 bg-emerald-500/10" },
    cancelled: { label: "Отменен", variant: "destructive", className: "border-red-500/50 text-red-400 bg-red-500/10" },
  }

  const config = statusConfig[status] || statusConfig.pending
  return (
    <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>
  )
}

export default function AdminPage() {
  const { user, login, logout, isAuthenticated } = useAuth()
  const { getAllOrders, cart, favorites } = useStore()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loginError, setLoginError] = useState("")
  const [isClient, setIsClient] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsClient(true)
    // Reduced loading time for faster perceived performance
    const timer = setTimeout(() => setIsLoading(false), 200)
    return () => clearTimeout(timer)
  }, [])

  const handleQuickLogin = () => {
    const result = login(email, password)
    if (!result.success) {
      setLoginError(result.error || "Ошибка входа")
    } else {
      setLoginError("")
    }
  }

  const handleAdminLogin = () => {
    const result = login("admin@animestore.com", "admin123")
    if (!result.success) {
      setLoginError("Ошибка входа администратора")
    }
  }

  // Show loading state before hydration
  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-violet-500/20 rounded-full" />
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-violet-500 rounded-full animate-spin" />
          </div>
          <p className="mt-4 text-slate-400 font-medium">Загрузка...</p>
        </div>
      </div>
    )
  }

  // Login form when not authenticated
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
        {/* Background decorations */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        </div>

        <div className="relative w-full max-w-md">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-violet-500 to-purple-600 p-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 mx-auto mb-4">
                <Package className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">AnimeStore</h1>
              <p className="text-white/80 mt-1">Вход в админ-панель</p>
            </div>

            {/* Form */}
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@animestore.com"
                  className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-violet-500 focus:ring-violet-500/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-300">
                  Пароль
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="admin123"
                  className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-violet-500 focus:ring-violet-500/20"
                />
              </div>

              {loginError && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {loginError}
                </div>
              )}

              <div className="space-y-3 pt-2">
                <Button
                  onClick={handleQuickLogin}
                  className="w-full bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white shadow-lg shadow-violet-500/25"
                >
                  Войти
                </Button>
                <Button
                  onClick={handleAdminLogin}
                  variant="outline"
                  className="w-full border-white/10 text-white hover:bg-white/10"
                >
                  Быстрый вход (Демо)
                </Button>
              </div>

              <p className="text-xs text-center text-slate-500 pt-2">
                Демо данные: admin@animestore.com / admin123
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Access denied for non-admin users
  if (user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
        <div className="relative w-full max-w-md">
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 backdrop-blur-xl shadow-2xl p-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/20 mx-auto mb-4">
              <AlertCircle className="h-8 w-8 text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Доступ запрещен</h2>
            <p className="text-slate-400 mb-6">
              У вас нет прав администратора для доступа к этой странице.
            </p>
            <Button
              onClick={() => (window.location.href = "/")}
              className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white"
            >
              На главную
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Calculate stats
  const orders = getAllOrders()
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
  const completedOrders = orders.filter((order) => order.status === "delivered").length
  const pendingOrders = orders.filter((order) => order.status === "processing").length

  const stats = {
    totalUsers: users.length,
    totalProducts: products.length,
    totalReviews: reviews.reduce((sum, product) => sum + product.totalCount, 0),
    totalOrders: orders.length,
    activeUsers: users.filter((u) => u.isActive).length,
    averageRating:
      reviews.length > 0
        ? (
            reviews.reduce((sum, product) => sum + product.averageRating, 0) /
            reviews.length
          ).toFixed(1)
        : "0.0",
    totalRevenue,
    completedOrders,
    pendingOrders,
    cartItems: cart.reduce((sum, item) => sum + item.quantity, 0),
    favoriteItems: favorites.length,
  }

  // Format date for welcome section
  const currentDate = new Date()
  const formattedDate = currentDate.toLocaleDateString("ru-RU", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  // Get time-based greeting
  const getGreeting = () => {
    const hour = currentDate.getHours()
    if (hour < 12) return "Доброе утро"
    if (hour < 18) return "Добрый день"
    return "Добрый вечер"
  }

  // Recent orders (last 5)
  const recentOrders = orders.slice(-5).reverse()

  // Recent reviews from data
  const recentReviews = reviews
    .flatMap((product) =>
      product.reviews.slice(0, 2).map((review) => ({
        ...review,
        productId: product.productId,
        productTitle: products.find((p) => p.id === product.productId)?.title || "Товар",
      }))
    )
    .slice(0, 5)

  // Category data for donut chart based on actual products
  const categoryData = products.reduce((acc, product) => {
    const type = product.type || "Другое"
    const existing = acc.find((item) => item.name === type)
    if (existing) {
      existing.value += 1
    } else {
      acc.push({ name: type, value: 1, color: "" })
    }
    return acc
  }, [] as { name: string; value: number; color: string }[])

  // Assign colors to categories
  const categoryColors = ["#8B5CF6", "#EC4899", "#3B82F6", "#F59E0B", "#10B981"]
  categoryData.forEach((item, index) => {
    item.color = categoryColors[index % categoryColors.length]
  })

  return (
    <AdminLayout title="Dashboard">
      {isLoading ? (
        <DashboardSkeleton />
      ) : (
        <div className="space-y-8">
          {/* Welcome Section */}
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-xl p-6 md:p-8">
            {/* Background decorations */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                    {getGreeting()}, {user?.name || "Администратор"}!
                  </h1>
                  <p className="text-slate-400 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {formattedDate}
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="outline"
                    className="border-white/10 text-white hover:bg-white/10"
                    onClick={() => (window.location.href = "/")}
                  >
                    На сайт
                  </Button>
                  <Button className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white shadow-lg shadow-violet-500/25">
                    <Plus className="h-4 w-4 mr-2" />
                    Добавить товар
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <StatsCard
              title="Пользователи"
              value={stats.totalUsers}
              subtitle={`Активных: ${stats.activeUsers}`}
              icon={Users}
              trend={{ value: 12.5, isPositive: true }}
              gradient="bg-gradient-to-br from-blue-500 to-cyan-500"
              delay={0}
            />
            <StatsCard
              title="Товары"
              value={stats.totalProducts}
              subtitle="В каталоге"
              icon={Package}
              trend={{ value: 8.2, isPositive: true }}
              gradient="bg-gradient-to-br from-violet-500 to-purple-500"
              delay={100}
            />
            <StatsCard
              title="Заказы"
              value={stats.totalOrders}
              subtitle={`Выполнено: ${stats.completedOrders}`}
              icon={ShoppingCart}
              trend={{ value: 15.3, isPositive: true }}
              gradient="bg-gradient-to-br from-amber-500 to-orange-500"
              delay={200}
            />
            <StatsCard
              title="Выручка"
              value={stats.totalRevenue}
              suffix="₽"
              subtitle="Общая сумма"
              icon={DollarSign}
              trend={{ value: 22.1, isPositive: true }}
              gradient="bg-gradient-to-br from-emerald-500 to-green-500"
              delay={300}
            />
          </div>

          {/* Charts Section - 2x2 Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard
              title="Динамика продаж"
              description="Продажи за последние 12 месяцев"
            >
              <SalesChart data={sampleSalesData} height={280} />
            </ChartCard>

            <ChartCard
              title="Заказы по статусу"
              description="Распределение заказов"
            >
              <OrdersChart data={sampleOrdersData} height={280} />
            </ChartCard>

            <ChartCard
              title="Сравнение выручки"
              description="Текущий vs предыдущий период"
            >
              <RevenueChart data={sampleRevenueData} height={280} />
            </ChartCard>

            <ChartCard
              title="Товары по категориям"
              description="Распределение по типам"
            >
              <CategoryDonut
                data={categoryData.length > 0 ? categoryData : sampleCategoryData}
                height={280}
              />
            </ChartCard>
          </div>

          {/* Recent Activity Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Orders */}
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
              <div className="flex items-center justify-between p-6 pb-0">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Последние заказы
                  </h3>
                  <p className="text-sm text-slate-400 mt-1">
                    Последние {recentOrders.length} заказов
                  </p>
                </div>
                <Link href="/admin/orders">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-violet-400 hover:text-violet-300 hover:bg-violet-500/10"
                  >
                    Все заказы
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <ScrollArea className="h-80">
                <div className="p-4 space-y-2">
                  {recentOrders.length > 0 ? (
                    recentOrders.map((order, index) => (
                      <div
                        key={order.id || index}
                        className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10">
                            <ShoppingCart className="h-5 w-5 text-violet-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">
                              Заказ #{order.id?.slice(-6) || index + 1}
                            </p>
                            <p className="text-xs text-slate-400">
                              {order.items?.length || 0} товаров
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-white">
                            {order.total?.toLocaleString()}₽
                          </p>
                          <OrderStatusBadge status={order.status || "pending"} />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <ShoppingCart className="h-12 w-12 text-slate-600 mb-4" />
                      <p className="text-slate-400">Заказов пока нет</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>

            {/* Recent Activity */}
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
              <div className="flex items-center justify-between p-6 pb-0">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Активность
                  </h3>
                  <p className="text-sm text-slate-400 mt-1">
                    Последние события
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-violet-400 hover:text-violet-300 hover:bg-violet-500/10"
                >
                  <Activity className="mr-2 h-4 w-4" />
                  Журнал
                </Button>
              </div>
              <ScrollArea className="h-80">
                <div className="p-4 space-y-1">
                  <ActivityItem
                    icon={Users}
                    iconBg="bg-gradient-to-br from-blue-500 to-cyan-500"
                    title="Новый пользователь"
                    description="Регистрация: Мария Сидорова"
                    time="2 мин"
                  />
                  <ActivityItem
                    icon={ShoppingCart}
                    iconBg="bg-gradient-to-br from-amber-500 to-orange-500"
                    title="Новый заказ"
                    description="Заказ #12345 на сумму 2,450₽"
                    time="15 мин"
                  />
                  <ActivityItem
                    icon={Star}
                    iconBg="bg-gradient-to-br from-violet-500 to-purple-500"
                    title="Новый отзыв"
                    description="5 звезд на Attack on Titan"
                    time="32 мин"
                  />
                  <ActivityItem
                    icon={CheckCircle2}
                    iconBg="bg-gradient-to-br from-emerald-500 to-green-500"
                    title="Заказ доставлен"
                    description="Заказ #12340 успешно доставлен"
                    time="1 час"
                  />
                  <ActivityItem
                    icon={Package}
                    iconBg="bg-gradient-to-br from-pink-500 to-rose-500"
                    title="Товар обновлен"
                    description="One Piece, Том 1 - изменена цена"
                    time="2 часа"
                  />
                </div>
              </ScrollArea>
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-6">
              Быстрые действия
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <QuickAction
                title="Пользователи"
                description="Управление учетными записями"
                icon={Users}
                href="/admin/users"
                gradient="bg-gradient-to-br from-blue-500 to-cyan-500"
              />
              <QuickAction
                title="Товары"
                description="Каталог и добавление товаров"
                icon={Package}
                href="/admin/products"
                gradient="bg-gradient-to-br from-violet-500 to-purple-500"
              />
              <QuickAction
                title="Отзывы"
                description="Модерация отзывов"
                icon={Star}
                href="/admin/reviews"
                gradient="bg-gradient-to-br from-amber-500 to-orange-500"
              />
              <QuickAction
                title="Заказы"
                description="Управление заказами"
                icon={ShoppingCart}
                href="/admin/orders"
                gradient="bg-gradient-to-br from-emerald-500 to-green-500"
              />
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
