"use client"

import { useState } from "react"
import { RoleGuard } from "@/components/auth"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Settings,
  Store,
  Bell,
  Shield,
  Palette,
  Globe,
  Mail,
  Database,
  Save,
  RefreshCw,
  Trash2,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react"
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

export default function AdminSettingsPage() {
  const { products, users, reviews, orders } = useStore()

  // Store settings state
  const [storeName, setStoreName] = useState("AnimeStore")
  const [storeEmail, setStoreEmail] = useState("admin@animestore.com")
  const [currency, setCurrency] = useState("RUB")
  const [language, setLanguage] = useState("ru")

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [orderNotifications, setOrderNotifications] = useState(true)
  const [reviewNotifications, setReviewNotifications] = useState(true)
  const [lowStockAlerts, setLowStockAlerts] = useState(false)

  // Appearance settings
  const [darkMode, setDarkMode] = useState(true)
  const [compactMode, setCompactMode] = useState(false)
  const [animationsEnabled, setAnimationsEnabled] = useState(true)

  // Security settings
  const [twoFactorAuth, setTwoFactorAuth] = useState(false)
  const [sessionTimeout, setSessionTimeout] = useState("30")

  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const handleSaveSettings = async () => {
    setIsSaving(true)
    // Simulate saving
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
    setSaveSuccess(true)
    toast.success("Настройки сохранены")
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  const handleClearCache = () => {
    // Clear localStorage except for essential data
    localStorage.removeItem("anime-store-cache")
    toast.success("Кэш очищен")
  }

  const handleResetData = () => {
    localStorage.removeItem("anime-store")
    window.location.reload()
  }

  return (
    <RoleGuard allowedRoles={['admin']}>
      <AdminLayout
        title="Настройки"
        breadcrumbs={[
          { label: "Настройки" }
        ]}
      >
        <div className="space-y-6">
          {/* Header with save button */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Settings className="h-6 w-6 text-violet-400" />
                Настройки магазина
              </h2>
              <p className="text-slate-400 mt-1">Управление настройками и конфигурацией</p>
            </div>
            <Button
              onClick={handleSaveSettings}
              disabled={isSaving}
              className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Сохранение...
                </>
              ) : saveSuccess ? (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Сохранено
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Сохранить
                </>
              )}
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Store Information */}
            <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Store className="h-5 w-5 text-blue-400" />
                  Информация о магазине
                </CardTitle>
                <CardDescription>Основные настройки магазина</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="storeName">Название магазина</Label>
                  <Input
                    id="storeName"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="bg-white/5 border-white/10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storeEmail">Email магазина</Label>
                  <Input
                    id="storeEmail"
                    type="email"
                    value={storeEmail}
                    onChange={(e) => setStoreEmail(e.target.value)}
                    className="bg-white/5 border-white/10"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Валюта</Label>
                    <Select value={currency} onValueChange={setCurrency}>
                      <SelectTrigger className="bg-white/5 border-white/10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="RUB">₽ Рубль</SelectItem>
                        <SelectItem value="USD">$ Доллар</SelectItem>
                        <SelectItem value="EUR">€ Евро</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Язык</Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger className="bg-white/5 border-white/10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ru">Русский</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="ja">日本語</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Bell className="h-5 w-5 text-amber-400" />
                  Уведомления
                </CardTitle>
                <CardDescription>Настройки уведомлений и оповещений</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email-уведомления</Label>
                    <p className="text-sm text-muted-foreground">Получать уведомления на email</p>
                  </div>
                  <Switch
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>
                <Separator className="bg-white/10" />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Новые заказы</Label>
                    <p className="text-sm text-muted-foreground">Уведомлять о новых заказах</p>
                  </div>
                  <Switch
                    checked={orderNotifications}
                    onCheckedChange={setOrderNotifications}
                  />
                </div>
                <Separator className="bg-white/10" />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Новые отзывы</Label>
                    <p className="text-sm text-muted-foreground">Уведомлять о новых отзывах</p>
                  </div>
                  <Switch
                    checked={reviewNotifications}
                    onCheckedChange={setReviewNotifications}
                  />
                </div>
                <Separator className="bg-white/10" />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Низкий запас</Label>
                    <p className="text-sm text-muted-foreground">Оповещать о низком запасе товаров</p>
                  </div>
                  <Switch
                    checked={lowStockAlerts}
                    onCheckedChange={setLowStockAlerts}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Appearance */}
            <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Palette className="h-5 w-5 text-pink-400" />
                  Внешний вид
                </CardTitle>
                <CardDescription>Настройки интерфейса и темы</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Тёмная тема</Label>
                    <p className="text-sm text-muted-foreground">Использовать тёмную тему</p>
                  </div>
                  <Switch
                    checked={darkMode}
                    onCheckedChange={setDarkMode}
                  />
                </div>
                <Separator className="bg-white/10" />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Компактный режим</Label>
                    <p className="text-sm text-muted-foreground">Уменьшить отступы и размеры</p>
                  </div>
                  <Switch
                    checked={compactMode}
                    onCheckedChange={setCompactMode}
                  />
                </div>
                <Separator className="bg-white/10" />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Анимации</Label>
                    <p className="text-sm text-muted-foreground">Включить анимации интерфейса</p>
                  </div>
                  <Switch
                    checked={animationsEnabled}
                    onCheckedChange={setAnimationsEnabled}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Security */}
            <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-400" />
                  Безопасность
                </CardTitle>
                <CardDescription>Настройки безопасности аккаунта</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Двухфакторная аутентификация</Label>
                    <p className="text-sm text-muted-foreground">Дополнительная защита аккаунта</p>
                  </div>
                  <Switch
                    checked={twoFactorAuth}
                    onCheckedChange={setTwoFactorAuth}
                  />
                </div>
                <Separator className="bg-white/10" />
                <div className="space-y-2">
                  <Label>Тайм-аут сессии (минуты)</Label>
                  <Select value={sessionTimeout} onValueChange={setSessionTimeout}>
                    <SelectTrigger className="bg-white/5 border-white/10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 минут</SelectItem>
                      <SelectItem value="30">30 минут</SelectItem>
                      <SelectItem value="60">1 час</SelectItem>
                      <SelectItem value="120">2 часа</SelectItem>
                      <SelectItem value="never">Никогда</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Data Management */}
          <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Database className="h-5 w-5 text-violet-400" />
                Управление данными
              </CardTitle>
              <CardDescription>Статистика и управление хранилищем</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <div className="text-2xl font-bold text-blue-400">{products.length}</div>
                  <div className="text-sm text-muted-foreground">Товаров</div>
                </div>
                <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                  <div className="text-2xl font-bold text-green-400">{users.length}</div>
                  <div className="text-sm text-muted-foreground">Пользователей</div>
                </div>
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <div className="text-2xl font-bold text-amber-400">{orders.length}</div>
                  <div className="text-sm text-muted-foreground">Заказов</div>
                </div>
                <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
                  <div className="text-2xl font-bold text-purple-400">{reviews.length}</div>
                  <div className="text-sm text-muted-foreground">Отзывов</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  className="border-white/10 hover:bg-white/10"
                  onClick={handleClearCache}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Очистить кэш
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Сбросить данные
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-slate-900 border-white/10">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="flex items-center gap-2 text-white">
                        <AlertTriangle className="h-5 w-5 text-red-400" />
                        Сбросить все данные?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Это действие удалит все данные из локального хранилища, включая корзину,
                        избранное, заказы и настройки. Это действие нельзя отменить.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="border-white/10">Отмена</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleResetData}
                        className="bg-red-500 hover:bg-red-600 text-white"
                      >
                        Сбросить
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>

          {/* Version Info */}
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground">
              AnimeStore Admin Panel v1.0.0
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              © 2024 AnimeStore. Все права защищены.
            </p>
          </div>
        </div>
      </AdminLayout>
    </RoleGuard>
  )
}
