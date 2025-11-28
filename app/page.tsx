"use client"

import { useState, useMemo } from "react"
import { Header } from "@/components/header"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Filter, SlidersHorizontal, ArrowUpDown, Star, DollarSign, Type, TrendingUp } from "lucide-react"
import products from "@/data/products.json"
import { useStore } from "@/lib/store"

const genres = ["Все жанры", "Сёнэн", "Приключения", "Исекай", "Фэнтези", "Экшен", "Триллер", "Мистика"]
const types = ["Все типы", "Манга", "Манхва", "Ранобэ"]

export default function HomePage() {
  const { searchQuery } = useStore()
  const [selectedGenre, setSelectedGenre] = useState("Все жанры")
  const [selectedType, setSelectedType] = useState("Все типы")
  const [sortBy, setSortBy] = useState("popularity")
  const [showFilters, setShowFilters] = useState(false)

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter((product) => {
      const genreMatch = selectedGenre === "Все жанры" || product.genre === selectedGenre
      const typeMatch = selectedType === "Все типы" || product.type === selectedType
      const searchMatch = !searchQuery || 
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.genre.toLowerCase().includes(searchQuery.toLowerCase())
      return genreMatch && typeMatch && searchMatch
    })

    // Сортировка
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
  }, [selectedGenre, selectedType, sortBy, searchQuery])

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-4 md:py-8">
        {/* Заголовок */}
        <div className="mb-6 md:mb-8">
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-2xl md:text-4xl font-bold mb-2 md:mb-3 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Популярные товары
            </h1>
            <p className="text-sm md:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
              Лучшая манга, манхва и ранобэ для истинных ценителей
            </p>
          </div>

          {/* Мобильная кнопка фильтров */}
          <div className="sm:hidden mb-4">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="w-full flex items-center justify-center gap-2 h-12"
            >
              <SlidersHorizontal className="h-4 w-4" />
              {showFilters ? 'Скрыть фильтры' : 'Показать фильтры'}
            </Button>
          </div>

          {/* Фильтры в карточке */}
          <Card className={`mb-6 ${showFilters ? "block" : "hidden sm:block"}`}>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Жанр */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-primary" />
                    <label className="text-sm font-semibold">Жанр</label>
                  </div>
                  <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                    <SelectTrigger className="w-full h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {genres.map((genre) => (
                        <SelectItem key={genre} value={genre}>
                          {genre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Тип */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-primary" />
                    <label className="text-sm font-semibold">Тип</label>
                  </div>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="w-full h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {types.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Сортировка */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <ArrowUpDown className="h-4 w-4 text-primary" />
                    <label className="text-sm font-semibold">Сортировка</label>
                  </div>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full h-11 text-left">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="popularity">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4" />
                          По популярности
                        </div>
                      </SelectItem>
                      <SelectItem value="rating">
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4" />
                          По рейтингу
                        </div>
                      </SelectItem>
                      <SelectItem value="price-low">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          Цена: по возрастанию
                        </div>
                      </SelectItem>
                      <SelectItem value="price-high">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          Цена: по убыванию
                        </div>
                      </SelectItem>
                      <SelectItem value="name">
                        <div className="flex items-center gap-2">
                          <Type className="h-4 w-4" />
                          По названию
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Активные фильтры */}
              {(selectedGenre !== "Все жанры" || selectedType !== "Все типы") && (
                <div className="mt-6 pt-4 border-t">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground">Активные фильтры:</span>
                    {selectedGenre !== "Все жанры" && (
                      <Badge 
                        variant="secondary" 
                        className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors" 
                        onClick={() => setSelectedGenre("Все жанры")}
                      >
                        {selectedGenre} ×
                      </Badge>
                    )}
                    {selectedType !== "Все типы" && (
                      <Badge 
                        variant="secondary" 
                        className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors" 
                        onClick={() => setSelectedType("Все типы")}
                      >
                        {selectedType} ×
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedGenre("Все жанры")
                        setSelectedType("Все типы")
                      }}
                      className="text-xs h-6 px-2 ml-2"
                    >
                      Очистить все
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Результаты с улучшенным дизайном */}
        <div className="mb-6 md:mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 rounded-full p-2">
              <Filter className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-base md:text-lg font-semibold">
                Найдено: <span className="text-primary">{filteredAndSortedProducts.length}</span>
              </p>
              <p className="text-xs md:text-sm text-muted-foreground hidden md:block">
                {sortBy === 'popularity' && 'Отсортировано по популярности'}
                {sortBy === 'rating' && 'Отсортировано по рейтингу'}
                {sortBy === 'price-low' && 'Отсортировано по цене (возрастание)'}
                {sortBy === 'price-high' && 'Отсортировано по цене (убывание)'}
                {sortBy === 'name' && 'Отсортировано по названию'}
              </p>
            </div>
          </div>
        </div>

        {/* Сетка товаров */}
        {filteredAndSortedProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
            {filteredAndSortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground mb-4">Товары не найдены</p>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedGenre("Все жанры")
                setSelectedType("Все типы")
              }}
            >
              Сбросить фильтры
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
