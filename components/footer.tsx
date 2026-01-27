"use client"

import Link from "next/link"
import { useState } from "react"
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Heart,
  Youtube,
  Instagram,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

// Custom Telegram icon
function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  )
}

// Custom VK icon
function VKIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.862-.525-2.049-1.714-1.033-1.01-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.593v1.575c0 .424-.135.678-1.253.678-1.846 0-3.896-1.118-5.335-3.202C4.624 10.857 4 8.57 4 8.096c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.677.863 2.49 2.303 4.675 2.896 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.203.17-.407.44-.407h2.744c.373 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.813-.542 1.254-1.406 2.151-3.574 2.151-3.574.119-.254.322-.491.763-.491h1.744c.525 0 .644.27.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.779 1.203 1.253.745.847 1.32 1.558 1.473 2.049.17.49-.085.744-.576.744z" />
    </svg>
  )
}

const navigationLinks = [
  { name: "Главная", href: "/" },
  { name: "Каталог", href: "/catalog" },
  { name: "Избранное", href: "/favorites" },
  { name: "Корзина", href: "/cart" },
  { name: "Личный кабинет", href: "/account" },
]

const socialLinks = [
  {
    name: "Telegram",
    href: "https://t.me/animestore",
    icon: TelegramIcon,
    hoverColor: "hover:text-[#0088cc]",
  },
  {
    name: "VK",
    href: "https://vk.com/animestore",
    icon: VKIcon,
    hoverColor: "hover:text-[#4680C2]",
  },
  {
    name: "Instagram",
    href: "https://instagram.com/animestore",
    icon: Instagram,
    hoverColor: "hover:text-[#E4405F]",
  },
  {
    name: "YouTube",
    href: "https://youtube.com/animestore",
    icon: Youtube,
    hoverColor: "hover:text-[#FF0000]",
  },
]

const paymentMethods = [
  { name: "Visa", color: "from-[#1A1F71] to-[#2566AF]" },
  { name: "Mastercard", color: "from-[#EB001B] to-[#F79E1B]" },
  { name: "МИР", color: "from-[#0F754E] to-[#00A651]" },
]

export function Footer() {
  const [email, setEmail] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSubscribed(true)
    setIsLoading(false)
    setEmail("")

    // Reset after 3 seconds
    setTimeout(() => setIsSubscribed(false), 3000)
  }

  return (
    <footer className="glass border-t border-white/10 mt-auto">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Logo & Description */}
          <div className="space-y-4">
            <Link href="/" className="inline-block group">
              <h2 className="text-2xl font-bold gradient-text transition-all duration-300 group-hover:drop-shadow-[0_0_15px_rgba(139,92,246,0.5)] group-hover:scale-105">
                AnimeStore
              </h2>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Ваш любимый магазин манги, манхвы и ранобэ. Погрузитесь в мир
              японской и корейской культуры вместе с нами!
            </p>

            {/* Social Media */}
            <div className="flex items-center gap-3 pt-2">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2 rounded-lg bg-muted/50 text-muted-foreground transition-all duration-300 hover:scale-110 hover:bg-primary/10 ${social.hoverColor} group`}
                  aria-label={social.name}
                >
                  <social.icon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-4">
            <h3 className="font-semibold gradient-text text-lg">Навигация</h3>
            <nav className="flex flex-col space-y-2">
              {navigationLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-muted-foreground text-sm transition-all duration-300 hover:text-foreground hover:translate-x-2 relative w-fit group"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 group-hover:w-full rounded-full" />
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="font-semibold gradient-text text-lg">Контакты</h3>
            <div className="space-y-3">
              <a
                href="mailto:info@animestore.ru"
                className="flex items-center gap-3 text-muted-foreground text-sm transition-all duration-300 hover:text-foreground group"
              >
                <div className="p-2 rounded-lg bg-muted/50 transition-all duration-300 group-hover:bg-primary/10 group-hover:scale-110">
                  <Mail className="h-4 w-4 transition-colors duration-300 group-hover:text-purple-500" />
                </div>
                <span>info@animestore.ru</span>
              </a>

              <a
                href="tel:+78001234567"
                className="flex items-center gap-3 text-muted-foreground text-sm transition-all duration-300 hover:text-foreground group"
              >
                <div className="p-2 rounded-lg bg-muted/50 transition-all duration-300 group-hover:bg-primary/10 group-hover:scale-110">
                  <Phone className="h-4 w-4 transition-colors duration-300 group-hover:text-purple-500" />
                </div>
                <span>8 (800) 123-45-67</span>
              </a>

              <div className="flex items-start gap-3 text-muted-foreground text-sm">
                <div className="p-2 rounded-lg bg-muted/50 mt-0.5">
                  <MapPin className="h-4 w-4" />
                </div>
                <span>
                  г. Москва, ул. Аниме, д. 42,
                  <br />
                  офис 108
                </span>
              </div>
            </div>
          </div>

          {/* Newsletter Subscription */}
          <div className="space-y-4">
            <h3 className="font-semibold gradient-text text-lg">Рассылка</h3>
            <p className="text-muted-foreground text-sm">
              Подпишитесь на новости о новинках и скидках!
            </p>

            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="relative group">
                <Input
                  type="email"
                  placeholder="Ваш email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pr-12 transition-all duration-300 border-muted-foreground/20 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:border-primary/50"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={isLoading || !email.trim()}
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 rounded-md transition-all duration-300 hover:scale-110 hover:shadow-[0_0_15px_rgba(139,92,246,0.5)]"
                >
                  <Send className={`h-4 w-4 ${isLoading ? "animate-pulse" : ""}`} />
                </Button>
              </div>

              {isSubscribed && (
                <p className="text-sm text-green-500 flex items-center gap-1 animate-in fade-in slide-in-from-bottom-2">
                  <Heart className="h-4 w-4 fill-current" />
                  Спасибо за подписку!
                </p>
              )}
            </form>

            {/* Payment Methods */}
            <div className="pt-4">
              <p className="text-muted-foreground text-xs mb-3">
                Принимаем к оплате:
              </p>
              <div className="flex flex-wrap gap-2">
                {paymentMethods.map((method) => (
                  <div
                    key={method.name}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium text-white bg-gradient-to-r ${method.color} transition-all duration-300 hover:scale-105 hover:shadow-md`}
                  >
                    {method.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <Separator className="opacity-20" />
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Copyright */}
          <p className="text-muted-foreground text-sm text-center sm:text-left">
            &copy; 2025 AnimeStore. Все права защищены.
          </p>

          {/* Legal Links */}
          <div className="flex items-center gap-4 text-sm">
            <Link
              href="/privacy"
              className="text-muted-foreground transition-all duration-300 hover:text-foreground relative group"
            >
              Политика конфиденциальности
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 group-hover:w-full rounded-full" />
            </Link>
            <span className="text-muted-foreground/50">|</span>
            <Link
              href="/terms"
              className="text-muted-foreground transition-all duration-300 hover:text-foreground relative group"
            >
              Условия использования
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 group-hover:w-full rounded-full" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
