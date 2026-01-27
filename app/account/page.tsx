"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { User, Package, Settings, LogOut, Eye, EyeOff, Shield, Users, ShoppingBag, MessageSquare, CheckCircle, XCircle, Sparkles, ExternalLink } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { AnimatedBackground } from "@/components/animated-background"
import { AccountPageSkeleton } from "@/components/skeletons"
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
import type { Order, CartItem, User as UserType } from "@/types/index"

export default function AccountPage() {
  const { cart, user, setUser, getUserOrders, getAllOrders } = useStore()
  const { isAdmin, logout } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 300)
    return () => clearTimeout(timer)
  }, [])
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

  // Get user orders
  const orderHistory = user ? getUserOrders(user.id) : []

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 3000)
  }

  const handleAuthSuccess = () => {
    setFormData({ name: "", email: "", password: "", confirmPassword: "" })
  }

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault()

    setUser({
      ...user!,
      name: profileData.name,
      email: profileData.email
    })

    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const updatedUsers = users.map((u: UserType) =>
      u.email === user?.email ? { ...u, name: profileData.name, email: profileData.email } : u
    )
    localStorage.setItem('users', JSON.stringify(updatedUsers))

    showNotification('success', 'Profile updated successfully!')
  }

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault()
    if (profileData.newPassword === profileData.confirmNewPassword) {
      showNotification('success', 'Password changed successfully!')
      setProfileData({
        ...profileData,
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      })
    } else {
      showNotification('error', 'Passwords do not match!')
    }
  }

  const handleLogout = () => {
    logout()
    setFormData({ name: "", email: "", password: "", confirmPassword: "" })
  }

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
      case "delivered":
        return "Delivered"
      case "shipped":
        return "Shipped"
      case "processing":
        return "Processing"
      case "cancelled":
        return "Cancelled"
      default:
        return status
    }
  }

  if (isLoading) {
    return (
      <AnimatedBackground>
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Breadcrumbs items={[{ label: "Личный кабинет" }]} />
          <AccountPageSkeleton />
        </main>
      </AnimatedBackground>
    )
  }

  if (!user) {
    return (
      <AnimatedBackground>
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Breadcrumbs items={[
            { label: "Личный кабинет" }
          ]} />

          <div className="max-w-md mx-auto animate-scale-in">
            <div className="glass rounded-2xl p-1">
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
          </div>
        </main>
      </AnimatedBackground>
    )
  }

  return (
    <AnimatedBackground>
      <Header />

      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-20 right-4 z-50 animate-slide-in-right`}>
          <div className={`glass rounded-xl p-4 flex items-center gap-3 shadow-lg ${
            notification.type === 'success'
              ? 'border-emerald-500/30'
              : 'border-destructive/30'
          }`}>
            {notification.type === 'success' ? (
              <CheckCircle className="h-5 w-5 text-emerald-500" />
            ) : (
              <XCircle className="h-5 w-5 text-destructive" />
            )}
            <span className="font-medium">{notification.message}</span>
          </div>
        </div>
      )}

      <main className="container mx-auto px-4 py-8">
        <Breadcrumbs items={[
          { label: "Личный кабинет" }
        ]} />

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 animate-slide-up">
            <Card className="glass border-primary/10 overflow-hidden">
              {/* Gradient accent at top */}
              <div className="h-2 bg-gradient-to-r from-primary via-accent to-primary" />
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                      {user.role === 'admin' ? (
                        <Shield className="h-7 w-7 text-white" />
                      ) : (
                        <User className="h-7 w-7 text-white" />
                      )}
                    </div>
                    {user.role === 'admin' && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-accent rounded-full flex items-center justify-center">
                        <Sparkles className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-lg truncate">{user.name}</h3>
                      {user.role === 'admin' && (
                        <Badge className="bg-gradient-to-r from-primary to-accent text-white border-0 text-xs">
                          Admin
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="w-full glass border-destructive/20 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/40 transition-all duration-300 group"
                >
                  <LogOut className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform" />
                  Log out
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className={`glass border-primary/10 p-1 grid w-full ${isAdmin ? 'grid-cols-5' : 'grid-cols-3'}`}>
                <TabsTrigger value="profile" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300">
                  <User className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Profile</span>
                </TabsTrigger>
                <TabsTrigger value="orders" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300">
                  <Package className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Orders</span>
                </TabsTrigger>
                <TabsTrigger value="settings" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300">
                  <Settings className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Settings</span>
                </TabsTrigger>
                {isAdmin && (
                  <TabsTrigger value="admin" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300">
                    <Shield className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Admin</span>
                  </TabsTrigger>
                )}
                {isAdmin && (
                  <TabsTrigger value="all-orders" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300">
                    <Package className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">All Orders</span>
                  </TabsTrigger>
                )}
              </TabsList>

              {/* Profile Tab */}
              <TabsContent value="profile">
                <Card className="glass border-primary/10 anime-card-hover">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="gradient-text">Profile</span> Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleProfileUpdate} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="profileName" className="text-sm font-semibold">Name</Label>
                          <Input
                            id="profileName"
                            value={profileData.name}
                            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                            className="bg-background/50 border-primary/20 focus:border-primary transition-colors"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="profileEmail" className="text-sm font-semibold">Email</Label>
                          <Input
                            id="profileEmail"
                            type="email"
                            value={profileData.email}
                            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                            className="bg-background/50 border-primary/20 focus:border-primary transition-colors"
                          />
                        </div>
                      </div>
                      <Button type="submit" className="btn-glow">
                        Save Changes
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Orders Tab */}
              <TabsContent value="orders">
                <Card className="glass border-primary/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="gradient-text">Order</span> History
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {orderHistory.length > 0 ? (
                         orderHistory.map((order: Order, index: number) => (
                           <div
                             key={order.id}
                             className="glass rounded-xl p-5 border-primary/10 anime-card-hover animate-slide-up"
                             style={{ animationDelay: `${index * 0.05}s` }}
                           >
                             <div className="flex items-center justify-between mb-4">
                               <div>
                                 <Link
                                   href={`/order/${order.id}`}
                                   className="font-bold text-lg hover:text-primary transition-colors inline-flex items-center gap-2 group"
                                 >
                                   Order #{order.id}
                                   <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                 </Link>
                                 <p className="text-sm text-muted-foreground">{new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                               </div>
                               <div className="text-right">
                                 <Badge className={`${getStatusColor(order.status)} border font-medium`}>
                                   {getStatusText(order.status)}
                                 </Badge>
                                 <p className="font-bold text-lg mt-2 gradient-text">${order.total.toFixed(2)}</p>
                               </div>
                             </div>
                             <Separator className="mb-4 bg-primary/10" />
                             <div>
                               <p className="text-sm font-semibold mb-3">Items:</p>
                               <ul className="space-y-2">
                                 {order.items.map((item: CartItem, idx: number) => (
                                   <li key={idx} className="flex items-center justify-between text-sm bg-background/30 rounded-lg p-3">
                                     <span className="text-muted-foreground">{item.title} x{item.quantity}</span>
                                     <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                                   </li>
                                 ))}
                               </ul>
                             </div>
                           </div>
                         ))
                       ) : (
                         <div className="text-center py-12">
                           <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                             <Package className="h-10 w-10 text-muted-foreground" />
                           </div>
                           <p className="text-muted-foreground text-lg">No orders yet</p>
                           <p className="text-sm text-muted-foreground mt-1">Your order history will appear here</p>
                         </div>
                       )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings">
                <Card className="glass border-primary/10 anime-card-hover">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="gradient-text">Change</span> Password
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handlePasswordChange} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword" className="text-sm font-semibold">Current Password</Label>
                        <Input
                          id="currentPassword"
                          type="password"
                          value={profileData.currentPassword}
                          onChange={(e) => setProfileData({ ...profileData, currentPassword: e.target.value })}
                          className="bg-background/50 border-primary/20 focus:border-primary transition-colors"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword" className="text-sm font-semibold">New Password</Label>
                        <div className="relative">
                          <Input
                            id="newPassword"
                            type={showNewPassword ? "text" : "password"}
                            value={profileData.newPassword}
                            onChange={(e) => setProfileData({ ...profileData, newPassword: e.target.value })}
                            className="bg-background/50 border-primary/20 focus:border-primary transition-colors pr-10"
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
                        <Label htmlFor="confirmNewPassword" className="text-sm font-semibold">Confirm New Password</Label>
                        <Input
                          id="confirmNewPassword"
                          type="password"
                          value={profileData.confirmNewPassword}
                          onChange={(e) => setProfileData({ ...profileData, confirmNewPassword: e.target.value })}
                          className="bg-background/50 border-primary/20 focus:border-primary transition-colors"
                        />
                      </div>
                      <Button type="submit" className="btn-glow">
                        Change Password
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Admin Panel Tab */}
              {isAdmin && (
                <TabsContent value="admin">
                  <div className="grid gap-6">
                    <Card className="glass border-primary/10 overflow-hidden anime-card-hover">
                      <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary" />
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                            <Shield className="h-5 w-5 text-white" />
                          </div>
                          <span className="gradient-text">Admin</span> Panel
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <Button
                            asChild
                            variant="outline"
                            className="h-24 flex-col glass border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition-all duration-300 group"
                          >
                            <Link href="/admin/users">
                              <Users className="h-8 w-8 mb-2 text-primary group-hover:scale-110 transition-transform" />
                              <span className="font-semibold">User Management</span>
                            </Link>
                          </Button>
                          <Button
                            asChild
                            variant="outline"
                            className="h-24 flex-col glass border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition-all duration-300 group"
                          >
                            <Link href="/admin/products">
                              <ShoppingBag className="h-8 w-8 mb-2 text-accent group-hover:scale-110 transition-transform" />
                              <span className="font-semibold">Product Management</span>
                            </Link>
                          </Button>
                          <Button
                            asChild
                            variant="outline"
                            className="h-24 flex-col glass border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition-all duration-300 group"
                          >
                            <Link href="/admin/reviews">
                              <MessageSquare className="h-8 w-8 mb-2 text-emerald-500 group-hover:scale-110 transition-transform" />
                              <span className="font-semibold">Review Management</span>
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="glass border-primary/10 anime-card-hover">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <span className="gradient-text">Quick</span> Statistics
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="glass rounded-xl p-4 text-center border-primary/10 hover:border-primary/30 transition-colors group">
                            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                              <Users className="h-6 w-6 text-primary" />
                            </div>
                            <div className="text-3xl font-bold gradient-text">156</div>
                            <div className="text-sm text-muted-foreground">Users</div>
                          </div>
                          <div className="glass rounded-xl p-4 text-center border-primary/10 hover:border-emerald-500/30 transition-colors group">
                            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                              <ShoppingBag className="h-6 w-6 text-emerald-500" />
                            </div>
                            <div className="text-3xl font-bold text-emerald-500">89</div>
                            <div className="text-sm text-muted-foreground">Products</div>
                          </div>
                          <div className="glass rounded-xl p-4 text-center border-primary/10 hover:border-accent/30 transition-colors group">
                            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                              <MessageSquare className="h-6 w-6 text-accent" />
                            </div>
                            <div className="text-3xl font-bold text-accent">342</div>
                            <div className="text-sm text-muted-foreground">Reviews</div>
                          </div>
                          <div className="glass rounded-xl p-4 text-center border-primary/10 hover:border-amber-500/30 transition-colors group">
                            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-amber-500/20 to-amber-500/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                              <Package className="h-6 w-6 text-amber-500" />
                            </div>
                            <div className="text-3xl font-bold text-amber-500">{getAllOrders().length}</div>
                            <div className="text-sm text-muted-foreground">Total Orders</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              )}

              {/* All Orders Tab (Admin only) */}
              {isAdmin && (
                <TabsContent value="all-orders">
                  <Card className="glass border-primary/10">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <span className="gradient-text">All</span> Orders
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {getAllOrders().length > 0 ? (
                          getAllOrders().map((order: Order, index: number) => (
                            <div
                              key={order.id}
                              className="glass rounded-xl p-5 border-primary/10 anime-card-hover animate-slide-up"
                              style={{ animationDelay: `${index * 0.05}s` }}
                            >
                              <div className="flex items-center justify-between mb-4">
                                <div>
                                  <Link
                                    href={`/order/${order.id}`}
                                    className="font-bold text-lg hover:text-primary transition-colors inline-flex items-center gap-2 group"
                                  >
                                    Order #{order.id}
                                    <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                  </Link>
                                  <p className="text-sm text-muted-foreground">User: {order.userId}</p>
                                  <p className="text-sm text-muted-foreground">{new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                </div>
                                <div className="text-right">
                                  <Badge className={`${getStatusColor(order.status)} border font-medium`}>
                                    {getStatusText(order.status)}
                                  </Badge>
                                  <p className="font-bold text-lg mt-2 gradient-text">${order.total.toFixed(2)}</p>
                                </div>
                              </div>
                              <Separator className="mb-4 bg-primary/10" />
                              <div>
                                <p className="text-sm font-semibold mb-3">Items:</p>
                                <ul className="space-y-2">
                                  {order.items.map((item: CartItem, idx: number) => (
                                    <li key={idx} className="flex items-center justify-between text-sm bg-background/30 rounded-lg p-3">
                                      <span className="text-muted-foreground">{item.title} x{item.quantity}</span>
                                      <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-12">
                            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                              <Package className="h-10 w-10 text-muted-foreground" />
                            </div>
                            <p className="text-muted-foreground text-lg">No orders yet</p>
                            <p className="text-sm text-muted-foreground mt-1">Orders will appear here when customers place them</p>
                          </div>
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
    </AnimatedBackground>
  )
}
