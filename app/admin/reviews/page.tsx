"use client"

import { useState } from "react"
import { RoleGuard } from "@/components/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { 
  Search, 
  Star, 
  Trash2, 
  Eye,
  TrendingUp,
  TrendingDown,
  MessageSquare,
  Check,
  X,
  Calendar
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import products from "@/data/products.json"
import reviews from "@/data/reviews.json"

export default function AdminReviewsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [ratingFilter, setRatingFilter] = useState<string>("all")
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false)

  const filteredReviews = reviews.filter((review: any) => {
    const product = products.find(p => p.id.toString() === review.productId)
    const matchesSearch = !searchTerm || (product ? 
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.author.toLowerCase().includes(searchTerm.toLowerCase()) : false)
    
    const matchesRating = ratingFilter === "all" || 
      (ratingFilter === "high" && review.averageRating >= 4) ||
      (ratingFilter === "medium" && review.averageRating >= 3 && review.averageRating < 4) ||
      (ratingFilter === "low" && review.averageRating < 3)
    
    return matchesSearch && matchesRating
  })

  const getProduct = (productId: string) => {
    return products.find(p => p.id.toString() === productId)
  }

  const handleDeleteReview = (productId: string) => {
    if (confirm("Вы уверены, что хотите удалить все отзывы для этого товара?")) {
      console.log("Удаление отзывов для товара:", productId)
    }
  }

  const handleViewReviews = (productId: string) => {
    const product = getProduct(productId)
    const productReviews = reviews.find(r => r.productId.toString() === productId)
    setSelectedProduct({ ...product, reviews: productReviews })
    setIsReviewDialogOpen(true)
  }

  const handleApproveReview = (reviewId: number) => {
    console.log("Одобрение отзыва:", reviewId)
    // В реальном приложении здесь был бы API вызов
  }

  const handleRejectReview = (reviewId: number) => {
    console.log("Отклонение отзыва:", reviewId)
    // В реальном приложении здесь был бы API вызов
  }

  const handleDeleteSingleReview = (reviewId: number) => {
    if (confirm("Вы уверены, что хотите удалить этот отзыв?")) {
      console.log("Удаление отзыва:", reviewId)
      // В реальном приложении здесь был бы API вызов
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ))
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return "text-green-600"
    if (rating >= 4) return "text-green-500"
    if (rating >= 3.5) return "text-yellow-500"
    if (rating >= 3) return "text-orange-500"
    return "text-red-500"
  }

  const getRatingBadge = (rating: number) => {
    if (rating >= 4.5) return { variant: "default" as const, text: "Отлично" }
    if (rating >= 4) return { variant: "secondary" as const, text: "Хорошо" }
    if (rating >= 3.5) return { variant: "outline" as const, text: "Средне" }
    if (rating >= 3) return { variant: "outline" as const, text: "Ниже среднего" }
    return { variant: "destructive" as const, text: "Плохо" }
  }

  const totalReviews = reviews.reduce((sum, review) => sum + review.totalCount, 0)
  const averageRating = reviews.reduce((sum, review) => sum + review.averageRating, 0) / reviews.length

  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Управление отзывами</h1>
              <p className="text-muted-foreground">
                Модерация отзывов и управление рейтингами товаров
              </p>
            </div>
            <Link href="/admin">
              <Button variant="outline">← Назад к панели</Button>
            </Link>
          </div>

          {/* Статистика отзывов */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Всего отзывов</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalReviews}</div>
                <p className="text-xs text-muted-foreground">
                  На {reviews.length} товаров
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Средний рейтинг</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{averageRating.toFixed(1)}</div>
                <p className="text-xs text-muted-foreground">
                  Из 5.0 звезд
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Товары с отзывами</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{reviews.length}</div>
                <p className="text-xs text-muted-foreground">
                  Из {products.length} товаров
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Высокий рейтинг</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {reviews.filter(r => r.averageRating >= 4).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Товаров с рейтингом 4.0+
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Низкий рейтинг</CardTitle>
                <TrendingDown className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {reviews.filter(r => r.averageRating < 3).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Товаров с рейтингом &lt;3.0
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Фильтры и поиск */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Поиск по названию товара или автору..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={ratingFilter} onValueChange={setRatingFilter}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Рейтинг" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все рейтинги</SelectItem>
                    <SelectItem value="high">Высокий (4.0+)</SelectItem>
                    <SelectItem value="medium">Средний (3.0-3.9)</SelectItem>
                    <SelectItem value="low">Низкий (&lt;3.0)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Таблица отзывов */}
        <Card>
          <CardHeader>
            <CardTitle>Отзывы по товарам ({filteredReviews.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Товар</TableHead>
                  <TableHead>Рейтинг</TableHead>
                  <TableHead>Количество отзывов</TableHead>
                  <TableHead>Оценка</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReviews.map((review: any) => {
                  const product = getProduct(review.productId)
                  const ratingBadge = getRatingBadge(review.averageRating)
                  
                  return (
                    <TableRow key={review.productId}>
                      <TableCell>
                        {product && (
                          <div className="flex items-center gap-3">
                            <Image
                              src={product.image}
                              alt={product.title}
                              width={40}
                              height={60}
                              className="rounded object-cover"
                            />
                            <div>
                              <div className="font-medium">{product.title}</div>
                              <div className="text-sm text-muted-foreground">
                                {product.author}
                              </div>
                            </div>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Star className={`h-4 w-4 fill-current ${getRatingColor(review.averageRating)}`} />
                          <span className={`font-medium ${getRatingColor(review.averageRating)}`}>
                            {review.averageRating.toFixed(1)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{review.totalCount}</span>
                          {review.totalCount > 10 ? (
                            <TrendingUp className="h-4 w-4 text-green-500" />
                          ) : review.totalCount < 5 ? (
                            <TrendingDown className="h-4 w-4 text-red-500" />
                          ) : (
                            <span></span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={ratingBadge.variant}>
                          {ratingBadge.text}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewReviews(review.productId)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                          {product && (
                            <Link href={`/product/${product.id}`}>
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteReview(review.productId)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Диалог просмотра отзывов */}
      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Отзывы к товару: {selectedProduct?.name}
            </DialogTitle>
          </DialogHeader>
          
          {selectedProduct?.reviews && (
            <ScrollArea className="h-[60vh] pr-4">
              <div className="space-y-4">
                {selectedProduct.reviews.reviews.map((review: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{review.user}</span>
                          <div className="flex items-center gap-1">
                            {renderStars(review.rating)}
                          </div>
                          <span className="text-sm text-gray-500">({review.rating}/5)</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar className="h-4 w-4" />
                          {formatDate(review.date)}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleApproveReview(index)}
                          className="text-green-600 hover:text-green-700"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRejectReview(index)}
                          className="text-orange-600 hover:text-orange-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteSingleReview(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="text-gray-700">
                      {review.text}
                    </div>
                    
                    {index < selectedProduct.reviews.reviews.length - 1 && (
                      <Separator className="mt-4" />
                    )}
                  </div>
                ))}
              </div>
              
              {selectedProduct.reviews.reviews.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Нет отзывов для этого товара
                </div>
              )}
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </RoleGuard>
  )
}