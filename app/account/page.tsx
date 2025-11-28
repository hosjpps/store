"use client"

import type React from "react"

import { useState } from "react"
import { ArrowLeft, User, Package, Settings, LogOut, Eye, EyeOff, Shield, Users, ShoppingBag, MessageSquare } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useStore } from "@/lib/store"
import { useAuth } from "@/hooks/use-auth"
import { LoginForm, RegisterForm } from "@/components/auth"

export default function AccountPage() {
  const { cart, user, setUser, getUserOrders, getAllOrders } = useStore()
  const { isAdmin, logout } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  })

  // Получаем заказы пользователя
  const orderHistory = user ? getUserOrders(user.id) : []

  const handleAuthSuccess = () => {
    // Форма успешно обработана, пользователь авторизован
    setFormData({ name: "", email: "", password: "", confirmPassword: "" })
  }

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Обновляем данные пользователя в store
    setUser({
      ...user!,
      name: profileData.name,
      email: profileData.email
    })
    
    // Сохраняем в localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const updatedUsers = users.map((u: any) => 
      u.email === user?.email ? { ...u, name: profileData.name, email: profileData.email } : u
    )
    localStorage.setItem('users', JSON.stringify(updatedUsers))
    
    console.log('Профиль обновлен:', profileData)
  }

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault()
    if (profileData.newPassword === profileData.confirmNewPassword) {
      alert("Пароль успешно изменен!")
      setProfileData({
        ...profileData,
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      })
    } else {
      alert("Пароли не совпадают!")
    }
  }

  const handleLogout = () => {
    logout()
    setFormData({ name: "", email: "", password: "", confirmPassword: "" })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800"
      case "shipped":
        return "bg-blue-100 text-blue-800"
      case "processing":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "delivered":
        return "Доставлен"
      case "shipped":
        return "В пути"
      case "processing":
        return "Обработка"
      case "cancelled":
        return "Отменен"
      default:
        return status
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Button variant="ghost" asChild className="mb-6 p-0 h-auto">
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              На главную
            </Link>
          </Button>

          <div className="max-w-md mx-auto">
            {isLogin ? (
              <LoginForm 
                onSuccess={handleAuthSuccess}
                onSwitchToRegister={() => setIsLogin(false)}
              />
            ) : (
              <RegisterForm 
                onSuccess={handleAuthSuccess}
                onSwitchToLogin={() => setIsLogin(true)}
              />
            )}
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Button variant="ghost" asChild className="mb-6 p-0 h-auto">
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            На главную
          </Link>
        </Button>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Боковое меню */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    {user.role === 'admin' ? (
                      <Shield className="h-6 w-6 text-blue-600" />
                    ) : (
                      <User className="h-6 w-6 text-primary" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{user.name}</h3>
                      {user.role === 'admin' && (
                        <Badge variant="secondary" className="text-xs">
                          Администратор
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <p className="text-xs text-muted-foreground">Роль: {user.role === 'admin' ? 'Администратор' : 'Пользователь'}</p>
                  </div>
                </div>
                <Button variant="outline" onClick={handleLogout} className="w-full bg-transparent">
                  <LogOut className="h-4 w-4 mr-2" />
                  Выйти
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Основной контент */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className={`grid w-full ${isAdmin ? 'grid-cols-5' : 'grid-cols-3'}`}>
                <TabsTrigger value="profile">
                  <User className="h-4 w-4 mr-2" />
                  Профиль
                </TabsTrigger>
                <TabsTrigger value="orders">
                  <Package className="h-4 w-4 mr-2" />
                  Заказы
                </TabsTrigger>
                <TabsTrigger value="settings">
                  <Settings className="h-4 w-4 mr-2" />
                  Настройки
                </TabsTrigger>
                {isAdmin && (
                  <TabsTrigger value="admin">
                    <Shield className="h-4 w-4 mr-2" />
                    Админ
                  </TabsTrigger>
                )}
                {isAdmin && (
                  <TabsTrigger value="all-orders">
                    <Package className="h-4 w-4 mr-2" />
                    Все заказы
                  </TabsTrigger>
                )}
              </TabsList>

              {/* Профиль */}
              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle>Информация профиля</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleProfileUpdate} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="profileName">Имя</Label>
                          <Input
                            id="profileName"
                            value={profileData.name}
                            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="profileEmail">Email</Label>
                          <Input
                            id="profileEmail"
                            type="email"
                            value={profileData.email}
                            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                          />
                        </div>
                      </div>
                      <Button type="submit">Сохранить изменения</Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* История заказов */}
              <TabsContent value="orders">
                <Card>
                  <CardHeader>
                    <CardTitle>История заказов</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {orderHistory.length > 0 ? (
                         orderHistory.map((order: any) => (
                           <div key={order.id} className="border rounded-lg p-4">
                             <div className="flex items-center justify-between mb-3">
                               <div>
                                 <h4 className="font-semibold">Заказ {order.id}</h4>
                                 <p className="text-sm text-muted-foreground">{new Date(order.date).toLocaleDateString('ru-RU')}</p>
                               </div>
                               <div className="text-right">
                                 <Badge className={getStatusColor(order.status)}>{getStatusText(order.status)}</Badge>
                                 <p className="font-semibold mt-1">₽{order.total.toFixed(2)}</p>
                               </div>
                             </div>
                             <Separator className="mb-3" />
                             <div>
                               <p className="text-sm font-medium mb-2">Товары:</p>
                               <ul className="text-sm text-muted-foreground space-y-1">
                                 {order.items.map((item: any, index: number) => (
                                   <li key={index}>• {item.name} x{item.quantity} - ₽{(item.price * item.quantity).toFixed(2)}</li>
                                 ))}
                               </ul>
                             </div>
                           </div>
                         ))
                       ) : (
                         <p className="text-muted-foreground text-center py-8">
                           У вас пока нет заказов
                         </p>
                       )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Настройки */}
              <TabsContent value="settings">
                <Card>
                  <CardHeader>
                    <CardTitle>Смена пароля</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handlePasswordChange} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Текущий пароль</Label>
                        <Input
                          id="currentPassword"
                          type="password"
                          value={profileData.currentPassword}
                          onChange={(e) => setProfileData({ ...profileData, currentPassword: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">Новый пароль</Label>
                        <div className="relative">
                          <Input
                            id="newPassword"
                            type={showNewPassword ? "text" : "password"}
                            value={profileData.newPassword}
                            onChange={(e) => setProfileData({ ...profileData, newPassword: e.target.value })}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                          >
                            {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmNewPassword">Подтвердите новый пароль</Label>
                        <Input
                          id="confirmNewPassword"
                          type="password"
                          value={profileData.confirmNewPassword}
                          onChange={(e) => setProfileData({ ...profileData, confirmNewPassword: e.target.value })}
                        />
                      </div>
                      <Button type="submit">Изменить пароль</Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Админ панель */}
              {isAdmin && (
                <TabsContent value="admin">
                  <div className="grid gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Shield className="h-5 w-5 text-blue-600" />
                          Панель администратора
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <Button asChild variant="outline" className="h-20 flex-col">
                            <Link href="/admin/users">
                              <Users className="h-6 w-6 mb-2" />
                              Управление пользователями
                            </Link>
                          </Button>
                          <Button asChild variant="outline" className="h-20 flex-col">
                            <Link href="/admin/products">
                              <ShoppingBag className="h-6 w-6 mb-2" />
                              Управление товарами
                            </Link>
                          </Button>
                          <Button asChild variant="outline" className="h-20 flex-col">
                            <Link href="/admin/reviews">
                              <MessageSquare className="h-6 w-6 mb-2" />
                              Управление отзывами
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Быстрая статистика</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">156</div>
                            <div className="text-sm text-muted-foreground">Пользователей</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">89</div>
                            <div className="text-sm text-muted-foreground">Товаров</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600">342</div>
                            <div className="text-sm text-muted-foreground">Отзывов</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-orange-600">{getAllOrders().length}</div>
                            <div className="text-sm text-muted-foreground">Всего заказов</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              )}

              {/* Все заказы (только для админа) */}
              {isAdmin && (
                <TabsContent value="all-orders">
                  <Card>
                    <CardHeader>
                      <CardTitle>Все заказы</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {getAllOrders().length > 0 ? (
                          getAllOrders().map((order: any) => (
                            <div key={order.id} className="border rounded-lg p-4">
                              <div className="flex items-center justify-between mb-3">
                                <div>
                                  <h4 className="font-semibold">Заказ {order.id}</h4>
                                  <p className="text-sm text-muted-foreground">Пользователь: {order.userId}</p>
                                  <p className="text-sm text-muted-foreground">{new Date(order.date).toLocaleDateString('ru-RU')}</p>
                                </div>
                                <div className="text-right">
                                  <Badge className={getStatusColor(order.status)}>{getStatusText(order.status)}</Badge>
                                  <p className="font-semibold mt-1">₽{order.total.toFixed(2)}</p>
                                </div>
                              </div>
                              <Separator className="mb-3" />
                              <div>
                                <p className="text-sm font-medium mb-2">Товары:</p>
                                <ul className="text-sm text-muted-foreground space-y-1">
                                  {order.items.map((item: any, index: number) => (
                                    <li key={index}>• {item.name} x{item.quantity} - ₽{(item.price * item.quantity).toFixed(2)}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-muted-foreground text-center py-8">
                            Заказов пока нет
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  )
}
