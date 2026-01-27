"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Search, ShoppingCart, Heart, User } from "lucide-react"
import { useStore } from "@/lib/store"
import { cn } from "@/lib/utils"

interface NavItem {
  label: string
  icon: typeof Home
  href: string
  isScrollLink?: boolean
}

const navItems: NavItem[] = [
  { label: "Главная", icon: Home, href: "/" },
  { label: "Каталог", icon: Search, href: "/#products", isScrollLink: true },
  { label: "Корзина", icon: ShoppingCart, href: "/cart" },
  { label: "Избранное", icon: Heart, href: "/favorites" },
  { label: "Профиль", icon: User, href: "/account" },
]

export function BottomNavigation() {
  const pathname = usePathname()
  const { cart, favorites } = useStore()

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const favoritesCount = favorites.length

  const isActive = (href: string, isScrollLink?: boolean) => {
    if (isScrollLink) {
      return pathname === "/" && typeof window !== "undefined" && window.location.hash === "#products"
    }
    if (href === "/") {
      return pathname === "/" && (typeof window === "undefined" || window.location.hash !== "#products")
    }
    return pathname === href || pathname.startsWith(href + "/")
  }

  const getBadgeCount = (href: string) => {
    if (href === "/cart") return totalItems
    if (href === "/favorites") return favoritesCount
    return 0
  }

  const handleClick = (item: NavItem) => {
    if (item.isScrollLink && pathname === "/") {
      const element = document.getElementById("products")
      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
      }
    }
  }

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="h-16 glass border-t border-white/10 backdrop-blur-xl bg-background/80">
        <div className="flex items-center justify-around h-full px-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href, item.isScrollLink)
            const badgeCount = getBadgeCount(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => handleClick(item)}
                className={cn(
                  "flex flex-col items-center justify-center flex-1 h-full relative",
                  "transition-all duration-200 ease-out",
                  "active:scale-95",
                  active ? "text-primary" : "text-muted-foreground"
                )}
              >
                <div
                  className={cn(
                    "relative transition-transform duration-200",
                    active && "scale-110"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-6 w-6 transition-all duration-200",
                      active && item.icon === Heart && "fill-primary",
                      active && item.icon === Home && "fill-primary/20"
                    )}
                    strokeWidth={active ? 2.5 : 2}
                  />
                  {badgeCount > 0 && (
                    <span
                      className={cn(
                        "absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1",
                        "flex items-center justify-center",
                        "text-[10px] font-medium text-white",
                        "bg-destructive rounded-full",
                        "shadow-lg shadow-destructive/50",
                        "animate-in zoom-in-50 duration-200"
                      )}
                    >
                      {badgeCount > 99 ? "99+" : badgeCount}
                    </span>
                  )}
                </div>
                <span
                  className={cn(
                    "text-xs mt-1 transition-all duration-200",
                    active ? "font-medium" : "font-normal"
                  )}
                >
                  {item.label}
                </span>
                {active && (
                  <span
                    className={cn(
                      "absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5",
                      "bg-gradient-to-r from-purple-500 to-pink-500 rounded-full",
                      "animate-in fade-in slide-in-from-top-1 duration-200"
                    )}
                  />
                )}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
