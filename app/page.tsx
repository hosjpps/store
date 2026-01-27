"use client"

import { useState, useMemo, useEffect, useRef, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { ProductCard } from "@/components/product-card"
import { AnimatedBackground, FloatingMangaPage, StarBurst, Sparkle } from "@/components/animated-background"
import { PullToRefresh } from "@/components/pull-to-refresh"
import { ProductSkeletonGrid } from "@/components/product-skeleton"
import { QuickViewModal } from "@/components/quick-view-modal"
import { RecentlyViewed } from "@/components/recently-viewed"
import { Product } from "@/types/index"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Filter,
  SlidersHorizontal,
  ArrowUpDown,
  Star,
  RussianRuble,
  Type,
  TrendingUp,
  Sparkles,
  BookOpen,
  ChevronRight,
  Search as SearchIcon,
  Heart,
  X,
  ChevronDown,
  Tag,
  Layers
} from "lucide-react"
import products from "@/data/products.json"
import { useStore } from "@/lib/store"

const genres = ["Все жанры", "Сёнэн", "Приключения", "Исекай", "Фэнтези", "Экшен", "Триллер", "Мистика", "Ужасы", "Супергерои", "История", "Комедия", "Романтика"]
const types = ["Все типы", "Манга", "Манхва", "Ранобэ"]

export default function HomePage() {
  const { searchQuery, favorites } = useStore()
  const [selectedGenre, setSelectedGenre] = useState("Все жанры")
  const [selectedType, setSelectedType] = useState("Все типы")
  const [sortBy, setSortBy] = useState("popularity")
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000])
  const [minRating, setMinRating] = useState<number>(0) // 0 = all, 4 = 4+, 4.5 = 4.5+
  const [showFilters, setShowFilters] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [currentFeaturedIndex, setCurrentFeaturedIndex] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 10
  const productsRef = useRef<HTMLDivElement>(null)
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)

  // Get featured products (top rated >= 4.5)
  const featuredProducts = useMemo(() => {
    return products.filter((product) => product.rating >= 4.5)
  }, [products])

  // Simulate loading state - reduced for faster perceived performance
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [])

  // Auto-rotate featured products
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeaturedIndex((prev) => (prev + 1) % featuredProducts.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedGenre, selectedType, sortBy, searchQuery, priceRange, minRating])

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter((product) => {
      const genreMatch = selectedGenre === "Все жанры" || product.genre.split(', ').some(g => g === selectedGenre)
      const typeMatch = selectedType === "Все типы" || product.type === selectedType
      const searchMatch = !searchQuery ||
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.genre.toLowerCase().includes(searchQuery.toLowerCase())
      const priceMatch = product.price >= priceRange[0] && product.price <= priceRange[1]
      const ratingMatch = minRating === 0 || product.rating >= minRating
      return genreMatch && typeMatch && searchMatch && priceMatch && ratingMatch
    })

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "rating":
          return b.rating - a.rating
        case "name":
          return a.title.localeCompare(b.title)
        default: // popularity
          return b.rating - a.rating
      }
    })

    return filtered
  }, [selectedGenre, selectedType, sortBy, searchQuery, priceRange, minRating])

  // Calculate paginated products
  const totalPages = Math.ceil(filteredAndSortedProducts.length / ITEMS_PER_PAGE)
  const paginatedProducts = filteredAndSortedProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const scrollToProducts = () => {
    productsRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleRefresh = useCallback(async () => {
    // Reset filters
    setSelectedGenre("Все жанры")
    setSelectedType("Все типы")
    setPriceRange([0, 2000])
    setMinRating(0)
    setCurrentPage(1)

    // Simulate refresh delay
    await new Promise(resolve => setTimeout(resolve, 500))
  }, [])

  // Scroll to top of products section when page changes
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    productsRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <AnimatedBackground className="scroll-smooth">
        <Header />

      {/* Hero Section */}
      <section className="relative min-h-[80vh] md:min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Floating Manga Pages Decoration */}
        <FloatingMangaPage className="top-20 left-4 md:left-20 opacity-60 hidden sm:block" />

        {/* Star Bursts */}
        <StarBurst className="top-32 right-1/4 hidden md:block" />
        <Sparkle className="top-40 left-1/3 hidden md:block" size={24} />
        <Sparkle className="bottom-40 right-1/3 hidden md:block" size={16} />

        <div className="container mx-auto px-4 py-12 md:py-20">
          <div className="max-w-5xl mx-auto text-center space-y-8">
            {/* Main Title with Gradient */}
            <div className="space-y-4 animate-slide-up">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight">
                <span className="gradient-text">Anime</span>
                <span className="text-foreground">Store</span>
              </h1>

              {/* Animated Subtitle */}
              <div className="relative h-8 md:h-10 overflow-hidden">
                <p className="text-lg md:text-2xl text-muted-foreground animate-bounce-soft">
                  <Sparkles className="inline-block h-5 w-5 mr-2 text-accent" />
                  Погрузись в мир аниме и манги
                  <Sparkles className="inline-block h-5 w-5 ml-2 text-accent" />
                </p>
              </div>
            </div>

            {/* Featured Product Highlight */}
            <div className="relative mt-8 animate-scale-in" style={{ animationDelay: "0.2s" }}>
              <div className="glass rounded-2xl p-6 md:p-8 max-w-3xl mx-auto">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  {/* Featured Image */}
                  <div className="relative w-32 h-44 md:w-40 md:h-56 flex-shrink-0 group">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg blur-xl group-hover:blur-2xl transition-all" />
                    <div className="relative w-full h-full rounded-lg overflow-hidden shadow-2xl transform group-hover:scale-105 transition-transform duration-300">
                      <Image
                        src={featuredProducts[currentFeaturedIndex].image || "/placeholder.svg"}
                        alt={featuredProducts[currentFeaturedIndex].title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    {/* Hot badge */}
                    <div className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                      HOT
                    </div>
                  </div>

                  {/* Featured Info */}
                  <div className="text-center md:text-left space-y-3 flex-1">
                    <Badge variant="secondary" className="mb-2">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Популярное
                    </Badge>
                    <h2 className="text-xl md:text-2xl font-bold line-clamp-2">
                      {featuredProducts[currentFeaturedIndex].title}
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      {featuredProducts[currentFeaturedIndex].author}
                    </p>
                    <div className="flex items-center justify-center md:justify-start gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{featuredProducts[currentFeaturedIndex].rating}</span>
                      </div>
                      <span className="text-muted-foreground">|</span>
                      <span className="text-lg font-bold text-primary">
                        {featuredProducts[currentFeaturedIndex].price}₽
                      </span>
                    </div>

                    {/* Carousel Indicators */}
                    <div className="flex justify-center md:justify-start gap-2 pt-2">
                      {featuredProducts.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentFeaturedIndex(idx)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            idx === currentFeaturedIndex
                              ? "bg-primary w-6"
                              : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 animate-slide-up" style={{ animationDelay: "0.4s" }}>
              <Button
                size="lg"
                className="btn-glow glow-pulse text-lg px-8 py-6 group"
                onClick={scrollToProducts}
              >
                <BookOpen className="mr-2 h-5 w-5 group-hover:animate-bounce" />
                Смотреть каталог
                <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-6 glass border-primary/20 hover:border-primary/50 hover:bg-primary/5 relative overflow-visible"
                asChild
              >
                <Link href="/favorites">
                  <Heart className="mr-2 h-5 w-5" />
                  Избранное
                  {favorites.length > 0 && (
                    <span className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center text-xs font-bold rounded-full bg-primary text-primary-foreground shadow-lg">
                      {favorites.length}
                    </span>
                  )}
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto pt-8 animate-slide-up" style={{ animationDelay: "0.6s" }}>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary">{products.length}+</div>
                <div className="text-xs md:text-sm text-muted-foreground">Товаров</div>
              </div>
              <div className="text-center border-x border-border">
                <div className="text-2xl md:text-3xl font-bold text-primary">{types.length - 1}</div>
                <div className="text-xs md:text-sm text-muted-foreground">Категории</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary">4.8</div>
                <div className="text-xs md:text-sm text-muted-foreground">Рейтинг</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator - Arrow */}
        <button
          onClick={scrollToProducts}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer group"
          aria-label="Прокрутить к каталогу"
        >
          <ChevronDown className="h-8 w-8 text-muted-foreground/50 group-hover:text-primary transition-colors" />
        </button>
      </section>

      {/* Main Content */}
      <main ref={productsRef} className="container mx-auto px-4 py-8 md:py-16">
        {/* Section Title */}
        <div className="text-center mb-8 md:mb-12 animate-slide-up">
          <h2 className="text-2xl md:text-4xl font-bold mb-3">
            <span className="gradient-text">Каталог</span> товаров
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Откройте для себя лучшую мангу, манхву и ранобэ
          </p>
        </div>

        {/* Mobile Filter Toggle */}
        <div className="md:hidden mb-4">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex items-center justify-between gap-2 h-14 glass border-primary/20 hover:border-primary/40 transition-all duration-300"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20">
                <SlidersHorizontal className="h-4 w-4 text-primary" />
              </div>
              <span className="font-medium">Фильтры и сортировка</span>
            </div>
            <div className="flex items-center gap-2">
              {(selectedGenre !== "Все жанры" || selectedType !== "Все типы" || priceRange[0] !== 0 || priceRange[1] !== 2000 || minRating !== 0) && (
                <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-primary text-primary-foreground">
                  {(selectedGenre !== "Все жанры" ? 1 : 0) + (selectedType !== "Все типы" ? 1 : 0) + (priceRange[0] !== 0 || priceRange[1] !== 2000 ? 1 : 0) + (minRating !== 0 ? 1 : 0)}
                </span>
              )}
              <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform duration-300 ${showFilters ? "rotate-180" : ""}`} />
            </div>
          </Button>
        </div>

        {/* Beautiful Glassmorphism Filter Card */}
        <div className={`mb-8 transition-all duration-500 ease-out overflow-hidden ${showFilters ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0 md:max-h-[1000px] md:opacity-100"}`}>
          <div className="relative">
            {/* Gradient background glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 rounded-2xl blur-xl" />

            <Card className="relative glass border-primary/10 overflow-hidden rounded-2xl">
              {/* Decorative gradient border top */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

              <CardContent className="pt-6 pb-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/10">
                      <Sparkles className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Фильтры</h3>
                      <p className="text-xs text-muted-foreground">Найдите идеальную мангу</p>
                    </div>
                  </div>
                  {(selectedGenre !== "Все жанры" || selectedType !== "Все типы" || priceRange[0] !== 0 || priceRange[1] !== 2000 || minRating !== 0) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedGenre("Все жанры")
                        setSelectedType("Все типы")
                        setPriceRange([0, 2000])
                        setMinRating(0)
                      }}
                      className="text-xs h-8 px-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                    >
                      <X className="h-3 w-3 mr-1" />
                      Сбросить
                    </Button>
                  )}
                </div>

                {/* Genre Pills Section */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-primary" />
                    <label className="text-sm font-semibold">Жанр</label>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {genres.map((genre) => (
                      <button
                        key={genre}
                        onClick={() => setSelectedGenre(genre)}
                        className={`
                          px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                          ${selectedGenre === genre
                            ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/25 scale-105"
                            : "bg-background/50 hover:bg-background/80 border border-border/50 hover:border-primary/30 hover:shadow-md"
                          }
                        `}
                      >
                        {genre === "Все жанры" ? (
                          <span className="flex items-center gap-1.5">
                            <Layers className="h-3.5 w-3.5" />
                            {genre}
                          </span>
                        ) : genre}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Type & Sort Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-background/30 border border-border/30">
                  {/* Type Filter */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-primary" />
                      <label className="text-sm font-semibold">Тип</label>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {types.map((type) => (
                        <button
                          key={type}
                          onClick={() => setSelectedType(type)}
                          className={`
                            px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300
                            ${selectedType === type
                              ? "bg-primary/20 text-primary border-2 border-primary shadow-sm"
                              : "bg-background/50 hover:bg-background/80 border border-border/50 hover:border-primary/30"
                            }
                          `}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sort */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <ArrowUpDown className="h-4 w-4 text-primary" />
                      <label className="text-sm font-semibold">Сортировка</label>
                    </div>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-full h-10 bg-background/50 border-border/50 hover:border-primary/30 transition-colors">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="popularity">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-primary" />
                            По популярности
                          </div>
                        </SelectItem>
                        <SelectItem value="rating">
                          <div className="flex items-center gap-2">
                            <Star className="h-4 w-4 text-yellow-500" />
                            По рейтингу
                          </div>
                        </SelectItem>
                        <SelectItem value="price-low">
                          <div className="flex items-center gap-2">
                            <RussianRuble className="h-4 w-4 text-green-500" />
                            Цена: по возрастанию
                          </div>
                        </SelectItem>
                        <SelectItem value="price-high">
                          <div className="flex items-center gap-2">
                            <RussianRuble className="h-4 w-4 text-green-500" />
                            Цена: по убыванию
                          </div>
                        </SelectItem>
                        <SelectItem value="name">
                          <div className="flex items-center gap-2">
                            <Type className="h-4 w-4 text-blue-500" />
                            По названию
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Price Range & Rating Filters */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 p-4 rounded-xl bg-background/30 border border-border/30">
                  {/* Price Range Slider */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <RussianRuble className="h-4 w-4 text-green-500" />
                        <label className="text-sm font-semibold">Цена</label>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        от {priceRange[0]}₽ до {priceRange[1]}₽
                      </span>
                    </div>
                    <Slider
                      value={priceRange}
                      onValueChange={(value) => setPriceRange(value as [number, number])}
                      min={0}
                      max={2000}
                      step={50}
                      className="w-full"
                    />
                  </div>

                  {/* Rating Filter */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <label className="text-sm font-semibold">Рейтинг</label>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { value: 0, label: "Все" },
                        { value: 4, label: "4+" },
                        { value: 4.5, label: "4.5+" }
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setMinRating(option.value)}
                          className={`
                            px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-1.5
                            ${minRating === option.value
                              ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/25 scale-105"
                              : "bg-background/50 hover:bg-background/80 border border-border/50 hover:border-primary/30 hover:shadow-md"
                            }
                          `}
                        >
                          {option.value > 0 && <Star className="h-3.5 w-3.5 fill-current" />}
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Active Filters Display */}
                {(selectedGenre !== "Все жанры" || selectedType !== "Все типы" || priceRange[0] !== 0 || priceRange[1] !== 2000 || minRating !== 0) && (
                  <div className="mt-4 pt-4 border-t border-border/30">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                        <Filter className="h-3.5 w-3.5" />
                        Активные:
                      </span>
                      {selectedGenre !== "Все жанры" && (
                        <Badge
                          className="cursor-pointer bg-gradient-to-r from-primary/20 to-accent/20 text-foreground border border-primary/20 hover:border-destructive hover:bg-destructive/10 hover:text-destructive transition-all duration-300 pr-1.5"
                          onClick={() => setSelectedGenre("Все жанры")}
                        >
                          <Tag className="h-3 w-3 mr-1.5" />
                          {selectedGenre}
                          <X className="h-3 w-3 ml-1.5" />
                        </Badge>
                      )}
                      {selectedType !== "Все типы" && (
                        <Badge
                          className="cursor-pointer bg-gradient-to-r from-primary/20 to-accent/20 text-foreground border border-primary/20 hover:border-destructive hover:bg-destructive/10 hover:text-destructive transition-all duration-300 pr-1.5"
                          onClick={() => setSelectedType("Все типы")}
                        >
                          <BookOpen className="h-3 w-3 mr-1.5" />
                          {selectedType}
                          <X className="h-3 w-3 ml-1.5" />
                        </Badge>
                      )}
                      {(priceRange[0] !== 0 || priceRange[1] !== 2000) && (
                        <Badge
                          className="cursor-pointer bg-gradient-to-r from-primary/20 to-accent/20 text-foreground border border-primary/20 hover:border-destructive hover:bg-destructive/10 hover:text-destructive transition-all duration-300 pr-1.5"
                          onClick={() => setPriceRange([0, 2000])}
                        >
                          <RussianRuble className="h-3 w-3 mr-1.5" />
                          {priceRange[0]}₽ - {priceRange[1]}₽
                          <X className="h-3 w-3 ml-1.5" />
                        </Badge>
                      )}
                      {minRating !== 0 && (
                        <Badge
                          className="cursor-pointer bg-gradient-to-r from-primary/20 to-accent/20 text-foreground border border-primary/20 hover:border-destructive hover:bg-destructive/10 hover:text-destructive transition-all duration-300 pr-1.5"
                          onClick={() => setMinRating(0)}
                        >
                          <Star className="h-3 w-3 mr-1.5 fill-current" />
                          {minRating}+
                          <X className="h-3 w-3 ml-1.5" />
                        </Badge>
                      )}
                    </div>

                    {/* Price Range Indicator */}
                    <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-1.5">
                          <RussianRuble className="h-4 w-4 text-green-500" />
                          Диапазон цен:
                        </span>
                        <span className="font-semibold text-green-600 dark:text-green-400">
                          {filteredAndSortedProducts.length > 0 ? `${Math.min(...filteredAndSortedProducts.map(p => p.price))}₽ - ${Math.max(...filteredAndSortedProducts.map(p => p.price))}₽` : 'Нет товаров'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 md:mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 rounded-full p-2">
              <Filter className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-base md:text-lg font-semibold">
                Показано: <span className="text-primary">{((currentPage - 1) * ITEMS_PER_PAGE) + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, filteredAndSortedProducts.length)}</span> из <span className="text-primary">{filteredAndSortedProducts.length}</span>
              </p>
              <p className="text-xs md:text-sm text-muted-foreground hidden md:block">
                {sortBy === "popularity" && "Отсортировано по популярности"}
                {sortBy === "rating" && "Отсортировано по рейтингу"}
                {sortBy === "price-low" && "Отсортировано по цене (возрастание)"}
                {sortBy === "price-high" && "Отсортировано по цене (убывание)"}
                {sortBy === "name" && "Отсортировано по названию"}
              </p>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <ProductSkeletonGrid count={10} />
        ) : paginatedProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
              {paginatedProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <ProductCard product={product} onQuickView={setQuickViewProduct} />
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8 md:mt-12">
                <Pagination>
                  <PaginationContent className="glass rounded-xl p-2">
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-primary/10"}
                      />
                    </PaginationItem>
                    {/* Page numbers */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => handlePageChange(page)}
                          isActive={currentPage === page}
                          className={currentPage === page ? "bg-primary text-primary-foreground" : "hover:bg-primary/10 cursor-pointer"}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-primary/10"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        ) : (
          /* Empty State */
          <div className="text-center py-16 md:py-24">
            <div className="glass rounded-2xl p-8 md:p-12 max-w-md mx-auto">
              {/* Illustration */}
              <div className="relative w-32 h-32 mx-auto mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-2xl" />
                <div className="relative w-full h-full flex items-center justify-center">
                  <SearchIcon className="w-16 h-16 text-muted-foreground/50" />
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-2">Ничего не найдено</h3>
              <p className="text-muted-foreground mb-6">
                К сожалению, по вашему запросу товары не найдены. Попробуйте изменить фильтры.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedGenre("Все жанры")
                    setSelectedType("Все типы")
                    setPriceRange([0, 2000])
                    setMinRating(0)
                  }}
                  className="glass"
                >
                  Сбросить фильтры
                </Button>
                <Button onClick={scrollToProducts}>
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Популярное
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>

        {/* Recently Viewed Section */}
        <section className="container mx-auto px-4 pb-8">
          <RecentlyViewed />
        </section>

        {/* Footer spacer */}
        <div className="h-16" />
      </AnimatedBackground>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </PullToRefresh>
  )
}
