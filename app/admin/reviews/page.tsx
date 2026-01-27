"use client"

import { useState, useEffect } from "react"
import { RoleGuard } from "@/components/auth"
import { AdminLayout } from "@/components/admin/admin-layout"
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
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
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
  Calendar,
  Package,
  AlertTriangle,
  CheckCircle
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useStore } from "@/lib/store"
import products from "@/data/products.json"
import staticReviews from "@/data/reviews.json"

interface ReviewItem {
  user: string
  rating: number
  text: string
  date: string
  isApproved?: boolean
}

interface ProductReview {
  productId: string
  totalCount: number
  averageRating: number
  reviews: ReviewItem[]
}

interface StaticReviewItem {
  id: number
  userName: string
  rating: number
  text: string
  date: string
}

interface StaticProductReview {
  productId: number
  totalCount: number
  averageRating: number
  reviews: StaticReviewItem[]
}

interface SelectedProduct {
  productId: string
  title?: string
  reviews?: ProductReview
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="glass-card">
            <CardContent className="p-6">
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-4 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="glass-card">
        <CardContent className="p-6">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-16 w-12 rounded" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-20" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function AdminReviewsPage() {
  const {
    reviews,
    initReviews,
    deleteReview,
    deleteAllProductReviews,
    approveReview,
    rejectReview,
    getAllReviews
  } = useStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [ratingFilter, setRatingFilter] = useState<string>("all")
  const [selectedProduct, setSelectedProduct] = useState<SelectedProduct | null>(null)
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false)
  const [isDeleteAllDialogOpen, setIsDeleteAllDialogOpen] = useState(false)
  const [isDeleteSingleDialogOpen, setIsDeleteSingleDialogOpen] = useState(false)
  const [selectedReviewIndex, setSelectedReviewIndex] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Инициализируем отзывы из статических данных при первом запуске
    if (reviews.length === 0) {
      // Convert static reviews to the format expected by the store
      const convertedReviews: ProductReview[] = (staticReviews as StaticProductReview[]).map(pr => ({
        productId: pr.productId.toString(),
        totalCount: pr.totalCount,
        averageRating: pr.averageRating,
        reviews: pr.reviews.map(r => ({
          user: r.userName,
          rating: r.rating,
          text: r.text,
          date: r.date,
          isApproved: true
        }))
      }))
      initReviews(convertedReviews)
    }
    setIsLoading(false)
  }, [])

  const allReviews = getAllReviews()

  const filteredReviews = allReviews.filter((review) => {
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

  const handleDeleteAllClick = (productId: string) => {
    const product = getProduct(productId)
    setSelectedProduct({ productId, title: product?.title || 'Товар' })
    setIsDeleteAllDialogOpen(true)
  }

  const handleConfirmDeleteAll = () => {
    if (selectedProduct) {
      deleteAllProductReviews(selectedProduct.productId)
      setIsDeleteAllDialogOpen(false)
      setSelectedProduct(null)
    }
  }

  const handleViewReviews = (productId: string) => {
    const product = getProduct(productId)
    const productReviews = allReviews.find(r => r.productId.toString() === productId)
    setSelectedProduct({ productId, title: product?.title, reviews: productReviews })
    setIsReviewDialogOpen(true)
  }

  const handleApproveReview = (reviewIndex: number) => {
    if (selectedProduct) {
      approveReview(selectedProduct.productId, reviewIndex)
      // Обновляем selectedProduct для отображения изменений
      const updatedReviews = getAllReviews().find(r => r.productId.toString() === selectedProduct.productId)
      setSelectedProduct((prev: SelectedProduct | null) => prev ? { ...prev, reviews: updatedReviews } : null)
    }
  }

  const handleRejectReview = (reviewIndex: number) => {
    if (selectedProduct) {
      rejectReview(selectedProduct.productId, reviewIndex)
      // Обновляем selectedProduct для отображения изменений
      const updatedReviews = getAllReviews().find(r => r.productId.toString() === selectedProduct.productId)
      setSelectedProduct((prev: SelectedProduct | null) => prev ? { ...prev, reviews: updatedReviews } : null)
    }
  }

  const handleDeleteSingleClick = (reviewIndex: number) => {
    setSelectedReviewIndex(reviewIndex)
    setIsDeleteSingleDialogOpen(true)
  }

  const handleConfirmDeleteSingle = () => {
    if (selectedProduct && selectedReviewIndex !== null) {
      deleteReview(selectedProduct.productId, selectedReviewIndex)
      // Обновляем selectedProduct для отображения изменений
      const updatedReviews = getAllReviews().find(r => r.productId.toString() === selectedProduct.productId)
      if (updatedReviews) {
        setSelectedProduct((prev: SelectedProduct | null) => prev ? { ...prev, reviews: updatedReviews } : null)
      } else {
        setIsReviewDialogOpen(false)
      }
      setIsDeleteSingleDialogOpen(false)
      setSelectedReviewIndex(null)
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
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'
        }`}
      />
    ))
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return "text-green-400"
    if (rating >= 4) return "text-green-300"
    if (rating >= 3.5) return "text-yellow-400"
    if (rating >= 3) return "text-orange-400"
    return "text-red-400"
  }

  const getRatingBadge = (rating: number) => {
    if (rating >= 4.5) return { className: "bg-green-500/20 text-green-300 border-green-500/30", text: "Отлично" }
    if (rating >= 4) return { className: "bg-green-500/20 text-green-300 border-green-500/30", text: "Хорошо" }
    if (rating >= 3.5) return { className: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30", text: "Средне" }
    if (rating >= 3) return { className: "bg-orange-500/20 text-orange-300 border-orange-500/30", text: "Ниже среднего" }
    return { className: "bg-red-500/20 text-red-300 border-red-500/30", text: "Плохо" }
  }

  const totalReviews = allReviews.reduce((sum, review) => sum + review.totalCount, 0)
  const averageRating = allReviews.length > 0 ? allReviews.reduce((sum, review) => sum + review.averageRating, 0) / allReviews.length : 0

  return (
    <RoleGuard allowedRoles={['admin']}>
      <AdminLayout
        title="Управление отзывами"
        breadcrumbs={[
          { label: "Отзывы" }
        ]}
      >
        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <div className="space-y-6">
            {/* Статистика отзывов */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <Card className="glass-card border-white/10 hover:border-blue-500/30 transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Всего отзывов</CardTitle>
                  <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <Star className="h-4 w-4 text-blue-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-400">{totalReviews}</div>
                  <p className="text-xs text-muted-foreground">
                    На {allReviews.length} товаров
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-card border-white/10 hover:border-yellow-500/30 transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Средний рейтинг</CardTitle>
                  <div className="h-8 w-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-yellow-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-400">{averageRating.toFixed(1)}</div>
                  <p className="text-xs text-muted-foreground">
                    Из 5.0 звезд
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-card border-white/10 hover:border-purple-500/30 transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Товары с отзывами</CardTitle>
                  <div className="h-8 w-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <Package className="h-4 w-4 text-purple-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-400">{allReviews.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Из {products.length} товаров
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-card border-white/10 hover:border-green-500/30 transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Высокий рейтинг</CardTitle>
                  <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-green-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-400">
                    {allReviews.filter(r => r.averageRating >= 4).length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Товаров с рейтингом 4.0+
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-card border-white/10 hover:border-red-500/30 transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Низкий рейтинг</CardTitle>
                  <div className="h-8 w-8 rounded-full bg-red-500/20 flex items-center justify-center">
                    <TrendingDown className="h-4 w-4 text-red-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-400">
                    {allReviews.filter(r => r.averageRating < 3).length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Товаров с рейтингом &lt;3.0
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Фильтры и поиск */}
            <Card className="glass-card border-white/10">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Поиск по названию товара или автору..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-background/50 border-white/10 focus:border-primary/50"
                      />
                    </div>
                  </div>
                  <Select value={ratingFilter} onValueChange={setRatingFilter}>
                    <SelectTrigger className="w-[200px] bg-background/50 border-white/10">
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

            {/* Таблица отзывов */}
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle>Отзывы по товарам ({filteredReviews.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/10 hover:bg-transparent">
                        <TableHead>Товар</TableHead>
                        <TableHead>Рейтинг</TableHead>
                        <TableHead>Количество отзывов</TableHead>
                        <TableHead>Оценка</TableHead>
                        <TableHead className="text-right">Действия</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredReviews.map((review) => {
                        const product = getProduct(review.productId)
                        const ratingBadge = getRatingBadge(review.averageRating)

                        return (
                          <TableRow
                            key={review.productId}
                            className="border-white/10 hover:bg-white/5 transition-colors duration-200"
                          >
                            <TableCell>
                              {product && (
                                <div className="flex items-center gap-3">
                                  <div className="relative h-14 w-10 overflow-hidden rounded">
                                    <Image
                                      src={product.image}
                                      alt={product.title}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
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
                                  <TrendingUp className="h-4 w-4 text-green-400" />
                                ) : review.totalCount < 5 ? (
                                  <TrendingDown className="h-4 w-4 text-red-400" />
                                ) : (
                                  <span></span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={ratingBadge.className}>
                                {ratingBadge.text}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleViewReviews(review.productId)}
                                  className="border-white/10 hover:bg-white/10 hover:border-blue-500/50 text-blue-400"
                                >
                                  <MessageSquare className="h-4 w-4" />
                                </Button>
                                {product && (
                                  <Link href={`/product/${product.id}`}>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="border-white/10 hover:bg-white/10 hover:border-purple-500/50"
                                    >
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                  </Link>
                                )}
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeleteAllClick(review.productId)}
                                  className="border-white/10 hover:bg-red-500/20 hover:border-red-500/50 text-red-400"
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
                  {filteredReviews.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                      <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Отзывы не найдены</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Диалог просмотра отзывов */}
        <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] glass-card border-white/10">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Отзывы к товару: {selectedProduct?.title}
              </DialogTitle>
            </DialogHeader>

            {selectedProduct?.reviews && (
              <ScrollArea className="h-[60vh] pr-4">
                <div className="space-y-4">
                  {selectedProduct.reviews.reviews.map((review: ReviewItem, index: number) => (
                    <div key={index} className="glass-card border-white/10 rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{review.user}</span>
                            <div className="flex items-center gap-1">
                              {renderStars(review.rating)}
                            </div>
                            <span className="text-sm text-muted-foreground">({review.rating}/5)</span>
                            {review.isApproved && (
                              <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-xs">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Одобрен
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            {formatDate(review.date)}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {!review.isApproved && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleApproveReview(index)}
                              className="border-white/10 hover:bg-green-500/20 hover:border-green-500/50 text-green-400"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRejectReview(index)}
                            className="border-white/10 hover:bg-orange-500/20 hover:border-orange-500/50 text-orange-400"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteSingleClick(index)}
                            className="border-white/10 hover:bg-red-500/20 hover:border-red-500/50 text-red-400"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="text-muted-foreground">
                        {review.text}
                      </div>

                      {index < (selectedProduct.reviews?.reviews.length ?? 0) - 1 && (
                        <Separator className="mt-4 bg-white/10" />
                      )}
                    </div>
                  ))}
                </div>

                {selectedProduct.reviews?.reviews.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Нет отзывов для этого товара</p>
                  </div>
                )}
              </ScrollArea>
            )}
          </DialogContent>
        </Dialog>

        {/* Диалог подтверждения удаления всех отзывов */}
        <Dialog open={isDeleteAllDialogOpen} onOpenChange={setIsDeleteAllDialogOpen}>
          <DialogContent className="glass-card border-white/10">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-400">
                <AlertTriangle className="h-5 w-5" />
                Удалить все отзывы?
              </DialogTitle>
              <DialogDescription>
                Вы уверены, что хотите удалить все отзывы для товара "{selectedProduct?.title}"?
                Это действие нельзя отменить.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteAllDialogOpen(false)} className="border-white/10">
                Отмена
              </Button>
              <Button variant="destructive" onClick={handleConfirmDeleteAll}>
                Удалить все
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Диалог подтверждения удаления одного отзыва */}
        <Dialog open={isDeleteSingleDialogOpen} onOpenChange={setIsDeleteSingleDialogOpen}>
          <DialogContent className="glass-card border-white/10">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-400">
                <AlertTriangle className="h-5 w-5" />
                Удалить отзыв?
              </DialogTitle>
              <DialogDescription>
                Вы уверены, что хотите удалить этот отзыв? Это действие нельзя отменить.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteSingleDialogOpen(false)} className="border-white/10">
                Отмена
              </Button>
              <Button variant="destructive" onClick={handleConfirmDeleteSingle}>
                Удалить
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </AdminLayout>
    </RoleGuard>
  )
}
