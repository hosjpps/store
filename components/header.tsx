"use client"

import Link from "next/link"
import { Search, Heart, ShoppingCart, User, Shield, Settings, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from "@/components/ui/sheet"
import { useStore } from "@/lib/store"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function Header() {
  const { cart, favorites, setSearchQuery } = useStore()
  const { user, isAdmin } = useAuth()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const favoritesCount = favorites.length

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      setSearchQuery(searchTerm.trim())
      router.push('/')
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    setSearchQuery(value)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-xl md:text-2xl font-bold gradient-text">AnimeStore</div>
          </Link>

          {/* Поиск - скрыт на мобильных */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <form onSubmit={handleSearch} className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Поиск манги, манхвы, ранобэ..." 
                className="pl-10" 
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </form>
          </div>

          {/* Десктопная навигация */}
          <nav className="hidden md:flex items-center space-x-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">Главная</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/favorites" className="flex items-center gap-2 relative">
                <Heart className="h-4 w-4" />
                <span className="hidden sm:inline">Избранное</span>
                {favoritesCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs flex items-center justify-center"
                  >
                    {favoritesCount}
                  </Badge>
                )}
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/cart" className="flex items-center gap-2 relative">
                <ShoppingCart className="h-4 w-4" />
                <span className="hidden sm:inline">Корзина</span>
                {totalItems > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs flex items-center justify-center"
                  >
                    {totalItems}
                  </Badge>
                )}
              </Link>
            </Button>
            {/* Админ панель - только для администраторов */}
            {isAdmin && (
              <Button variant="ghost" size="sm" asChild>
                <Link href="/admin" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  <span className="hidden sm:inline">Админ</span>
                </Link>
              </Button>
            )}
            <Button variant="ghost" size="sm" asChild>
              <Link href="/account" className="flex items-center gap-2">
                {user?.role === 'admin' ? (
                  <Shield className="h-4 w-4 text-blue-600" />
                ) : (
                  <User className="h-4 w-4" />
                )}
                <div className="hidden sm:flex flex-col items-start">
                  <span className="text-sm">{user ? user.name : "Кабинет"}</span>
                  {user?.role === 'admin' && (
                    <Badge variant="secondary" className="text-xs px-1 py-0">
                      Админ
                    </Badge>
                  )}
                </div>
              </Link>
            </Button>
          </nav>

          {/* Мобильная навигация */}
          <div className="flex md:hidden items-center space-x-2">
            {/* Быстрые кнопки корзины и избранного */}
            <Button variant="ghost" size="sm" asChild>
              <Link href="/favorites" className="flex items-center gap-1 relative">
                <Heart className="h-4 w-4" />
                {favoritesCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-4 w-4 p-0 text-xs flex items-center justify-center"
                  >
                    {favoritesCount}
                  </Badge>
                )}
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/cart" className="flex items-center gap-1 relative">
                <ShoppingCart className="h-4 w-4" />
                {totalItems > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-4 w-4 p-0 text-xs flex items-center justify-center"
                  >
                    {totalItems}
                  </Badge>
                )}
              </Link>
            </Button>
            
            {/* Мобильное меню */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 p-6">
                <SheetHeader className="sr-only">
                  <SheetTitle>Мобильное меню</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col space-y-4 mt-8">
                  {/* Мобильный поиск */}
                  <div className="space-y-2">
                    <h3 className="font-semibold">Поиск</h3>
                    <form onSubmit={handleSearch} className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input 
                        placeholder="Поиск манги, манхвы, ранобэ..." 
                        className="pl-10" 
                        value={searchTerm}
                        onChange={handleSearchChange}
                      />
                    </form>
                  </div>

                  {/* Навигационные ссылки */}
                  <div className="space-y-2">
                    <h3 className="font-semibold">Навигация</h3>
                    <div className="flex flex-col space-y-2">
                      <Button variant="ghost" className="justify-start" asChild onClick={() => setIsMobileMenuOpen(false)}>
                        <Link href="/">Главная</Link>
                      </Button>
                      <Button variant="ghost" className="justify-start" asChild onClick={() => setIsMobileMenuOpen(false)}>
                        <Link href="/favorites" className="flex items-center gap-2">
                          <Heart className="h-4 w-4" />
                          Избранное
                          {favoritesCount > 0 && (
                            <Badge variant="secondary">{favoritesCount}</Badge>
                          )}
                        </Link>
                      </Button>
                      <Button variant="ghost" className="justify-start" asChild onClick={() => setIsMobileMenuOpen(false)}>
                        <Link href="/cart" className="flex items-center gap-2">
                          <ShoppingCart className="h-4 w-4" />
                          Корзина
                          {totalItems > 0 && (
                            <Badge variant="secondary">{totalItems}</Badge>
                          )}
                        </Link>
                      </Button>
                      {isAdmin && (
                        <Button variant="ghost" className="justify-start" asChild onClick={() => setIsMobileMenuOpen(false)}>
                          <Link href="/admin" className="flex items-center gap-2">
                            <Settings className="h-4 w-4" />
                            Админ панель
                          </Link>
                        </Button>
                      )}
                      <Button variant="ghost" className="justify-start" asChild onClick={() => setIsMobileMenuOpen(false)}>
                        <Link href="/account" className="flex items-center gap-2">
                          {user?.role === 'admin' ? (
                            <Shield className="h-4 w-4 text-blue-600" />
                          ) : (
                            <User className="h-4 w-4" />
                          )}
                          <div className="flex flex-col items-start">
                            <span className="text-sm">{user ? user.name : "Кабинет"}</span>
                            {user?.role === 'admin' && (
                              <Badge variant="secondary" className="text-xs px-1 py-0">
                                Админ
                              </Badge>
                            )}
                          </div>
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Мобильный поиск под header */}
        <div className="md:hidden mt-4">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder="Поиск манги, манхвы, ранобэ..." 
              className="pl-10" 
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </form>
        </div>
      </div>
    </header>
  )
}
