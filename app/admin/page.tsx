"use client"

import { RoleGuard } from "@/components/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Users, Package, ShoppingCart, Star, TrendingUp, Eye } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { useStore } from "@/lib/store"
import { useState, useEffect } from "react"
import users from "@/data/users.json"
import products from "@/data/products.json"
import reviews from "@/data/reviews.json"

export default function AdminPage() {
  const { user, login, logout, isAuthenticated } = useAuth()
  const { getAllOrders, cart, favorites } = useStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleQuickLogin = () => {
    const result = login(email, password)
    if (!result.success) {
      setLoginError(result.error || 'Ошибка входа')
    } else {
      setLoginError('')
    }
  }

  // Быстрый вход для демо
  const handleAdminLogin = () => {
    const result = login('admin@animestore.com', 'admin123')
    if (!result.success) {
      setLoginError('Ошибка входа администратора')
    }
  }

  // Показываем загрузку до гидратации
  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Загрузка...</p>
        </div>
      </div>
    )
  }

  // Если пользователь не авторизован, показываем форму входа
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-center text-lg md:text-xl">Вход в админ-панель</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@animestore.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="admin123"
              />
            </div>
            {loginError && (
              <p className="text-sm text-red-600">{loginError}</p>
            )}
            <div className="space-y-2">
              <Button onClick={handleQuickLogin} className="w-full">
                Войти
              </Button>
              <Button onClick={handleAdminLogin} variant="outline" className="w-full">
                Быстрый вход (Админ)
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Для демо: admin@animestore.com / admin123
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Проверяем роль пользователя
  if (user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-center text-red-600">Доступ запрещен</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">
              У вас нет прав администратора для доступа к этой странице.
            </p>
            <Button onClick={() => window.location.href = '/'}>На главную</Button>
          </CardContent>
        </Card>
      </div>
    )
  }
  
  const orders = getAllOrders()
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
  const completedOrders = orders.filter(order => order.status === 'delivered').length
  const pendingOrders = orders.filter(order => order.status === 'processing').length
  
  const stats = {
    totalUsers: users.length,
    totalProducts: products.length,
    totalReviews: reviews.reduce((sum, product) => sum + product.totalCount, 0),
    totalOrders: orders.length,
    activeUsers: users.filter(u => u.isActive).length,
    averageRating: reviews.length > 0 ? (reviews.reduce((sum, product) => sum + product.averageRating, 0) / reviews.length).toFixed(1) : '0.0',
    totalRevenue,
    completedOrders,
    pendingOrders,
    cartItems: cart.reduce((sum, item) => sum + item.quantity, 0),
    favoriteItems: favorites.length
  }

  return (
    <div className="container mx-auto px-4 py-4 md:py-8">
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">Панель администратора</h1>
              <p className="text-sm md:text-base text-muted-foreground">
                Добро пожаловать, {user?.name}! Управляйте магазином аниме.
              </p>
            </div>
            <Button variant="outline" onClick={() => {
              window.location.href = '/';
            }} className="w-full sm:w-auto">
              На главную
            </Button>
          </div>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Пользователи</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                Активных: {stats.activeUsers}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Товары</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.totalProducts}</div>
              <p className="text-xs text-muted-foreground">
                В каталоге
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Отзывы</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.totalReviews}</div>
              <p className="text-xs text-muted-foreground">
                Средняя оценка: {stats.averageRating}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Всего заказов</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.totalOrders}</div>
              <p className="text-xs text-muted-foreground">
                Выполнено: {stats.completedOrders}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Дополнительная статистика */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Выручка</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.totalRevenue}₽</div>
              <p className="text-xs text-muted-foreground">
                Общая сумма заказов
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ожидающие заказы</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.pendingOrders}</div>
              <p className="text-xs text-muted-foreground">
                Требуют обработки
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">В корзинах</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.cartItems}</div>
              <p className="text-xs text-muted-foreground">
                Товаров в корзинах
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">В избранном</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-pink-600">{stats.favoriteItems}</div>
              <p className="text-xs text-muted-foreground">
                Товаров в избранном
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Быстрые действия */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Управление пользователями
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Просмотр, редактирование и управление учетными записями пользователей
              </p>
              <Link href="/admin/users">
                <Button className="w-full">
                  <Eye className="h-4 w-4 mr-2" />
                  Управлять пользователями
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Управление товарами
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Добавление, редактирование и удаление товаров в каталоге
              </p>
              <Link href="/admin/products">
                <Button className="w-full">
                  <Eye className="h-4 w-4 mr-2" />
                  Управлять товарами
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Управление отзывами
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Модерация отзывов и управление рейтингами товаров
              </p>
              <Link href="/admin/reviews">
                <Button className="w-full">
                  <Eye className="h-4 w-4 mr-2" />
                  Управлять отзывами
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Управление заказами
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Просмотр и управление статусами заказов клиентов
              </p>
              <Link href="/admin/orders">
                <Button className="w-full">
                  <Eye className="h-4 w-4 mr-2" />
                  Управлять заказами
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
  )
}