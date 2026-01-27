"use client"

import Link from "next/link"
import Image from "next/image"
import { Search, Heart, ShoppingCart, User, Shield, Settings, Menu, X, Tag, Package, LogOut, HelpCircle, Info, Home, Ticket } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from "@/components/ui/sheet"
import { useStore } from "@/lib/store"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useState, useEffect, useRef, useCallback } from "react"
import products from "@/data/products.json"
import { Product } from "@/types/index"

export function Header() {
  const { cart, favorites, setSearchQuery, orders } = useStore()
  const { user, isAdmin, logout } = useAuth()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [suggestions, setSuggestions] = useState<Product[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const searchRef = useRef<HTMLDivElement>(null)
  const mobileSearchRef = useRef<HTMLDivElement>(null)

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const favoritesCount = favorites.length
  const userOrders = user ? orders.filter(order => order.userId === user.id) : []
  const ordersCount = userOrders.length
  const mostRecentOrder = userOrders.length > 0
    ? userOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]
    : null

  // Available promo codes to display
  const promoCodes = ['ANIME10', 'MANGA15', 'NEWUSER']

  // Search autocomplete logic with debounce
  useEffect(() => {
    if (searchTerm.trim().length >= 2) {
      const filtered = (products as Product[]).filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.author.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 5)
      setSuggestions(filtered)
      setShowSuggestions(filtered.length > 0)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
    setSelectedIndex(-1)
  }, [searchTerm])

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      const isOutsideDesktop = !searchRef.current || !searchRef.current.contains(target)
      const isOutsideMobile = !mobileSearchRef.current || !mobileSearchRef.current.contains(target)

      if (isOutsideDesktop && isOutsideMobile) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Keyboard navigation handler
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions) return

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setSelectedIndex(prev =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        )
        break
      case "ArrowUp":
        e.preventDefault()
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
        break
      case "Enter":
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          e.preventDefault()
          navigateToProduct(suggestions[selectedIndex].id)
        }
        break
      case "Escape":
        setShowSuggestions(false)
        setSelectedIndex(-1)
        break
    }
  }, [showSuggestions, suggestions, selectedIndex])

  const navigateToProduct = (productId: number) => {
    setShowSuggestions(false)
    setSearchTerm("")
    setSelectedIndex(-1)
    setIsMobileMenuOpen(false)
    router.push(`/product/${productId}`)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      setSearchQuery(searchTerm.trim())
      setShowSuggestions(false)
      router.push('/')
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    setSearchQuery(value)
  }

  // Suggestion dropdown component
  const SuggestionDropdown = () => {
    if (!showSuggestions || suggestions.length === 0) return null

    return (
      <div className="absolute top-full left-0 right-0 mt-2 glass rounded-lg border border-white/10 shadow-xl z-50 overflow-hidden">
        {suggestions.map((product, index) => (
          <div
            key={product.id}
            className={`flex items-center gap-3 p-3 cursor-pointer transition-all duration-200 ${
              index === selectedIndex
                ? "bg-primary/20 border-l-2 border-primary"
                : "hover:bg-white/5 border-l-2 border-transparent"
            }`}
            onClick={() => navigateToProduct(product.id)}
            onMouseEnter={() => setSelectedIndex(index)}
          >
            <div className="relative w-10 h-14 flex-shrink-0 rounded overflow-hidden">
              <Image
                src={product.image}
                alt={product.title}
                fill
                className="object-cover"
                sizes="40px"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {product.title}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {product.author}
              </p>
            </div>
            <div className="flex-shrink-0">
              <span className="text-sm font-semibold gradient-text">
                {product.price} ₽
              </span>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <header className="glass sticky top-0 z-50 w-full border-b border-white/10 shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Animated Logo with hover glow */}
          <Link
            href="/"
            className="flex items-center space-x-2 group"
          >
            <div className="text-xl md:text-2xl font-bold gradient-text transition-all duration-300 group-hover:drop-shadow-[0_0_15px_rgba(139,92,246,0.5)] group-hover:scale-105">
              AnimeStore
            </div>
          </Link>

          {/* Search with focus animation - hidden on mobile */}
          <div ref={searchRef} className="hidden md:flex flex-1 max-w-md mx-4 relative">
            <form onSubmit={handleSearch} className="relative w-full group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 transition-colors duration-300 group-focus-within:text-primary" />
              <Input
                placeholder="Поиск манги, манхвы, ранобэ..."
                className="pl-10 transition-all duration-300 border-muted-foreground/20 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:border-primary/50"
                value={searchTerm}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                onFocus={() => {
                  if (suggestions.length > 0) setShowSuggestions(true)
                }}
              />
            </form>
            <SuggestionDropdown />
          </div>

          {/* Desktop navigation with hover animations */}
          <nav className="hidden md:flex items-center space-x-2">
            {/* Home link with animated underline */}
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="relative overflow-hidden transition-all duration-300 hover:scale-105 hover:bg-primary/10 group"
            >
              <Link href="/">
                <span className="relative z-10">Главная</span>
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 group-hover:w-3/4 rounded-full" />
              </Link>
            </Button>

            {/* Favorites with pulse animation on badge */}
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="relative overflow-visible transition-all duration-300 hover:scale-105 hover:bg-primary/10 group"
            >
              <Link href="/favorites" className="flex items-center gap-2 relative">
                <Heart className="h-4 w-4 transition-all duration-300 group-hover:text-pink-500 group-hover:fill-pink-500/20" />
                <span className="hidden sm:inline relative z-10">Избранное</span>
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 group-hover:w-3/4 rounded-full" />
                {favoritesCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs flex items-center justify-center animate-pulse shadow-lg shadow-red-500/50"
                  >
                    {favoritesCount}
                  </Badge>
                )}
              </Link>
            </Button>

            {/* Cart with pulse animation on badge */}
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="relative overflow-visible transition-all duration-300 hover:scale-105 hover:bg-primary/10 group"
            >
              <Link href="/cart" className="flex items-center gap-2 relative">
                <ShoppingCart className="h-4 w-4 transition-all duration-300 group-hover:text-purple-500" />
                <span className="hidden sm:inline relative z-10">Корзина</span>
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 group-hover:w-3/4 rounded-full" />
                {totalItems > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs flex items-center justify-center animate-pulse shadow-lg shadow-red-500/50"
                  >
                    {totalItems}
                  </Badge>
                )}
              </Link>
            </Button>

            {/* Admin panel - only for administrators */}
            {isAdmin && (
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="relative overflow-hidden transition-all duration-300 hover:scale-105 hover:bg-primary/10 group"
              >
                <Link href="/admin" className="flex items-center gap-2">
                  <Settings className="h-4 w-4 transition-all duration-500 group-hover:rotate-90 group-hover:text-blue-500" />
                  <span className="hidden sm:inline relative z-10">Админ</span>
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 group-hover:w-3/4 rounded-full" />
                </Link>
              </Button>
            )}

            {/* Account with smooth transitions */}
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="relative overflow-hidden transition-all duration-300 hover:scale-105 hover:bg-primary/10 group"
            >
              <Link href="/account" className="flex items-center gap-2">
                {user?.role === 'admin' ? (
                  <Shield className="h-4 w-4 text-blue-600 transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(37,99,235,0.5)]" />
                ) : (
                  <User className="h-4 w-4 transition-all duration-300 group-hover:text-purple-500" />
                )}
                <div className="hidden sm:flex flex-col items-start">
                  <span className="text-sm relative z-10">{user ? user.name : "Кабинет"}</span>
                  {user?.role === 'admin' && (
                    <Badge variant="secondary" className="text-xs px-1 py-0 animate-pulse">
                      Админ
                    </Badge>
                  )}
                </div>
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 group-hover:w-3/4 rounded-full" />
              </Link>
            </Button>
          </nav>

          {/* Mobile navigation */}
          <div className="flex md:hidden items-center space-x-2">
            {/* Quick favorites button with animation */}
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="relative overflow-visible transition-all duration-300 hover:scale-110 active:scale-95"
            >
              <Link href="/favorites" className="flex items-center gap-1 relative">
                <Heart className="h-4 w-4 transition-colors duration-300 hover:text-pink-500" />
                {favoritesCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-4 w-4 p-0 text-xs flex items-center justify-center animate-pulse shadow-lg shadow-red-500/50"
                  >
                    {favoritesCount}
                  </Badge>
                )}
              </Link>
            </Button>

            {/* Quick cart button with animation */}
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="relative overflow-visible transition-all duration-300 hover:scale-110 active:scale-95"
            >
              <Link href="/cart" className="flex items-center gap-1 relative">
                <ShoppingCart className="h-4 w-4 transition-colors duration-300 hover:text-purple-500" />
                {totalItems > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-4 w-4 p-0 text-xs flex items-center justify-center animate-pulse shadow-lg shadow-red-500/50"
                  >
                    {totalItems}
                  </Badge>
                )}
              </Link>
            </Button>

            {/* Mobile menu with smooth slide animation */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="transition-all duration-300 hover:scale-110 hover:bg-primary/10 active:scale-95"
                >
                  <Menu className="h-5 w-5 transition-transform duration-300" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-80 p-0 glass border-l border-white/10 animate-in slide-in-from-right duration-300 flex flex-col"
              >
                <SheetHeader className="sr-only">
                  <SheetTitle>Мобильное меню</SheetTitle>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto p-6 pb-20">
                  {/* User Info Section */}
                  {user && (
                    <div className="mb-6 p-4 rounded-xl bg-primary/5 border border-primary/10 animate-in fade-in slide-in-from-right-4 duration-300">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary via-accent to-pink-500 blur-sm opacity-75" />
                          <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-lg ring-2 ring-white/20">
                            {user.name[0].toUpperCase()}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold truncate">{user.name}</p>
                            {isAdmin && (
                              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs px-1.5 py-0">
                                Админ
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Quick Stats Row */}
                  <div className="grid grid-cols-3 gap-2 mb-6 animate-in fade-in slide-in-from-right-4 duration-300 delay-75">
                    <Link
                      href="/cart"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-center p-3 rounded-lg bg-muted/50 hover:bg-primary/10 transition-all duration-300 hover:scale-105 group"
                    >
                      <ShoppingCart className="h-4 w-4 mx-auto mb-1 text-muted-foreground group-hover:text-primary transition-colors" />
                      <span className="text-sm font-bold block">{totalItems}</span>
                      <span className="text-xs text-muted-foreground">Корзина</span>
                    </Link>
                    <Link
                      href="/favorites"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-center p-3 rounded-lg bg-muted/50 hover:bg-pink-500/10 transition-all duration-300 hover:scale-105 group"
                    >
                      <Heart className="h-4 w-4 mx-auto mb-1 text-muted-foreground group-hover:text-pink-500 transition-colors" />
                      <span className="text-sm font-bold block">{favoritesCount}</span>
                      <span className="text-xs text-muted-foreground">Избранное</span>
                    </Link>
                    {user ? (
                      <Link
                        href="/account"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-center p-3 rounded-lg bg-muted/50 hover:bg-accent/10 transition-all duration-300 hover:scale-105 group"
                      >
                        <Package className="h-4 w-4 mx-auto mb-1 text-muted-foreground group-hover:text-accent transition-colors" />
                        <span className="text-sm font-bold block">{ordersCount}</span>
                        <span className="text-xs text-muted-foreground">Заказы</span>
                      </Link>
                    ) : (
                      <div className="text-center p-3 rounded-lg bg-muted/30 opacity-50">
                        <Package className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                        <span className="text-sm font-bold block">-</span>
                        <span className="text-xs text-muted-foreground">Заказы</span>
                      </div>
                    )}
                  </div>

                  {/* Gradient Divider */}
                  <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent mb-6" />

                  {/* Mobile search with focus animation */}
                  <div className="space-y-2 animate-in fade-in slide-in-from-right-4 duration-300 delay-100 relative mb-6">
                    <h3 className="font-semibold gradient-text text-sm flex items-center gap-2">
                      <Search className="h-4 w-4" />
                      Поиск
                    </h3>
                    <form onSubmit={handleSearch} className="relative group">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 transition-colors duration-300 group-focus-within:text-primary" />
                      <Input
                        placeholder="Поиск манги, манхвы, ранобэ..."
                        className="pl-10 transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:shadow-[0_0_15px_rgba(139,92,246,0.3)]"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        onKeyDown={handleKeyDown}
                        onFocus={() => {
                          if (suggestions.length > 0) setShowSuggestions(true)
                        }}
                      />
                    </form>
                    <SuggestionDropdown />
                  </div>

                  {/* Gradient Divider */}
                  <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent mb-6" />

                  {/* Navigation links with staggered animations */}
                  <div className="space-y-2 animate-in fade-in slide-in-from-right-4 duration-300 delay-200 mb-6">
                    <h3 className="font-semibold gradient-text text-sm mb-3">Навигация</h3>
                    <div className="flex flex-col space-y-1">
                      <Button
                        variant="ghost"
                        className="justify-start transition-all duration-300 hover:translate-x-2 hover:bg-primary/10 group"
                        asChild
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Link href="/" className="flex items-center gap-3">
                          <Home className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                          Главная
                        </Link>
                      </Button>

                      <Button
                        variant="ghost"
                        className="justify-start transition-all duration-300 hover:translate-x-2 hover:bg-pink-500/10 group"
                        asChild
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Link href="/favorites" className="flex items-center gap-3">
                          <Heart className="h-4 w-4 text-muted-foreground group-hover:text-pink-500 transition-colors" />
                          Избранное
                          {favoritesCount > 0 && (
                            <Badge variant="secondary" className="ml-auto animate-pulse">{favoritesCount}</Badge>
                          )}
                        </Link>
                      </Button>

                      <Button
                        variant="ghost"
                        className="justify-start transition-all duration-300 hover:translate-x-2 hover:bg-primary/10 group"
                        asChild
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Link href="/cart" className="flex items-center gap-3">
                          <ShoppingCart className="h-4 w-4 text-muted-foreground group-hover:text-purple-500 transition-colors" />
                          Корзина
                          {totalItems > 0 && (
                            <Badge variant="secondary" className="ml-auto animate-pulse">{totalItems}</Badge>
                          )}
                        </Link>
                      </Button>

                      {/* Order Tracking */}
                      {user && (
                        <Button
                          variant="ghost"
                          className="justify-start transition-all duration-300 hover:translate-x-2 hover:bg-accent/10 group"
                          asChild
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Link
                            href={mostRecentOrder ? `/order/${mostRecentOrder.id}` : '/account'}
                            className="flex items-center gap-3"
                          >
                            <Ticket className="h-4 w-4 text-muted-foreground group-hover:text-accent transition-colors" />
                            Отслеживание заказа
                            {mostRecentOrder && (
                              <Badge variant="outline" className="ml-auto text-xs">
                                {mostRecentOrder.status === 'pending' && 'Ожидает'}
                                {mostRecentOrder.status === 'processing' && 'Обработка'}
                                {mostRecentOrder.status === 'shipped' && 'Отправлен'}
                                {mostRecentOrder.status === 'delivered' && 'Доставлен'}
                                {mostRecentOrder.status === 'cancelled' && 'Отменён'}
                              </Badge>
                            )}
                          </Link>
                        </Button>
                      )}

                      {isAdmin && (
                        <Button
                          variant="ghost"
                          className="justify-start transition-all duration-300 hover:translate-x-2 hover:bg-blue-500/10 group"
                          asChild
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Link href="/admin" className="flex items-center gap-3">
                            <Settings className="h-4 w-4 text-muted-foreground group-hover:text-blue-500 group-hover:rotate-90 transition-all duration-500" />
                            Админ панель
                          </Link>
                        </Button>
                      )}

                      <Button
                        variant="ghost"
                        className="justify-start transition-all duration-300 hover:translate-x-2 hover:bg-primary/10 group"
                        asChild
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Link href="/account" className="flex items-center gap-3">
                          {user?.role === 'admin' ? (
                            <Shield className="h-4 w-4 text-blue-500" />
                          ) : (
                            <User className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                          )}
                          {user ? 'Личный кабинет' : 'Войти'}
                        </Link>
                      </Button>
                    </div>
                  </div>

                  {/* Gradient Divider */}
                  <div className="h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent mb-6" />

                  {/* Promo Codes Section */}
                  <div className="p-4 rounded-xl bg-accent/5 border border-accent/10 animate-in fade-in slide-in-from-right-4 duration-300 delay-300 mb-6">
                    <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                      <Tag className="h-4 w-4 text-accent" />
                      <span className="gradient-text">Промокоды</span>
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {promoCodes.map((code) => (
                        <Badge
                          key={code}
                          variant="outline"
                          className="cursor-pointer hover:bg-accent/20 hover:border-accent/50 transition-all duration-300 hover:scale-105"
                          onClick={() => {
                            navigator.clipboard.writeText(code)
                          }}
                        >
                          {code}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Нажмите, чтобы скопировать
                    </p>
                  </div>

                  {/* Logout Button */}
                  {user && (
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-3 text-red-500 border-red-500/20 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 transition-all duration-300 animate-in fade-in slide-in-from-right-4 duration-300 delay-400"
                      onClick={() => {
                        logout()
                        setIsMobileMenuOpen(false)
                      }}
                    >
                      <LogOut className="h-4 w-4" />
                      Выйти
                    </Button>
                  )}
                </div>

                {/* Footer Section */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10 bg-background/80 backdrop-blur-sm">
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span className="opacity-60">v1.0.0</span>
                    <div className="flex gap-4">
                      <Link
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          setIsMobileMenuOpen(false)
                        }}
                        className="flex items-center gap-1 hover:text-primary transition-colors duration-300"
                      >
                        <HelpCircle className="h-3 w-3" />
                        Помощь
                      </Link>
                      <Link
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          setIsMobileMenuOpen(false)
                        }}
                        className="flex items-center gap-1 hover:text-primary transition-colors duration-300"
                      >
                        <Info className="h-3 w-3" />
                        О нас
                      </Link>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Mobile search below header with focus animation */}
        <div ref={mobileSearchRef} className="md:hidden mt-4 relative">
          <form onSubmit={handleSearch} className="relative group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 transition-colors duration-300 group-focus-within:text-primary" />
            <Input
              placeholder="Поиск манги, манхвы, ранобэ..."
              className="pl-10 transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:border-primary/50"
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              onFocus={() => {
                if (suggestions.length > 0) setShowSuggestions(true)
              }}
            />
          </form>
          <SuggestionDropdown />
        </div>
      </div>
    </header>
  )
}
