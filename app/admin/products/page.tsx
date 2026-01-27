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
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Star,
  Package,
  Grid3X3,
  MessageSquare,
  TrendingUp
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useStore } from "@/lib/store"
import { Product } from "@/types/index"
import staticProducts from "@/data/products.json"
import reviews from "@/data/reviews.json"

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
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

export default function AdminProductsPage() {
  const { products, initProducts, addProduct, updateProduct, deleteProduct } = useStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editProduct, setEditProduct] = useState<Partial<Product>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [newProduct, setNewProduct] = useState({
    title: "",
    author: "",
    category: "",
    price: 0,
    genre: "",
    image: "",
    description: ""
  })

  // Инициализация товаров из статических данных при первом запуске
  useEffect(() => {
    // Используем initProducts для сохранения оригинальных ID
    initProducts(staticProducts as Product[])
    setIsLoading(false)
  }, [])

  const handleEdit = (product: Product) => {
    setSelectedProduct(product)
    setIsEditDialogOpen(true)
  }

  const handleDelete = (product: Product) => {
    setSelectedProduct(product)
    setIsDeleteDialogOpen(true)
  }

  const handleAddProduct = () => {
    setIsAddDialogOpen(true)
  }

  const handleSaveNewProduct = () => {
    if (newProduct.title && newProduct.author && newProduct.category && newProduct.price) {
      addProduct({
        ...newProduct,
        type: newProduct.category,
        rating: 0
      })
      setNewProduct({
        title: "",
        author: "",
        category: "",
        price: 0,
        genre: "",
        image: "",
        description: ""
      })
      setIsAddDialogOpen(false)
    }
  }

  const handleDeleteProduct = () => {
    if (selectedProduct) {
      deleteProduct(selectedProduct.id)
      setIsDeleteDialogOpen(false)
      setSelectedProduct(null)
    }
  }

  const categories = [...new Set(products.map(p => p.type))]

  const filteredProducts = products.filter((product: Product) => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.author.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || product.type === categoryFilter

    return matchesSearch && matchesCategory
  })

  const getProductRating = (productId: number) => {
    const review = reviews.find(r => Number(r.productId) === productId)
    return review ? review.averageRating : 0
  }

  const getProductReviewCount = (productId: number) => {
    const review = reviews.find(r => Number(r.productId) === productId)
    return review ? review.totalCount : 0
  }

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product)
    setEditProduct({
      title: product.title,
      author: product.author,
      type: product.type,
      price: product.price,
      genre: product.genre,
      image: product.image,
      description: product.description || ""
    })
    setIsEditDialogOpen(true)
  }

  const handleSaveEditProduct = () => {
    if (selectedProduct && editProduct.title && editProduct.author && editProduct.type && editProduct.price) {
      updateProduct(selectedProduct.id, {
        ...selectedProduct,
        ...editProduct
      })
      setIsEditDialogOpen(false)
      setSelectedProduct(null)
      setEditProduct({})
    }
  }

  return (
    <RoleGuard allowedRoles={['admin']}>
      <AdminLayout
        title="Управление товарами"
        breadcrumbs={[
          { label: "Товары" }
        ]}
      >
        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <div className="space-y-6">
            {/* Статистика товаров */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="glass-card border-white/10 hover:border-blue-500/30 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-blue-400">{products.length}</div>
                      <p className="text-sm text-muted-foreground">Всего товаров</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <Package className="h-6 w-6 text-blue-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="glass-card border-white/10 hover:border-green-500/30 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-green-400">
                        {categories.length}
                      </div>
                      <p className="text-sm text-muted-foreground">Категорий</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center">
                      <Grid3X3 className="h-6 w-6 text-green-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="glass-card border-white/10 hover:border-purple-500/30 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-purple-400">
                        {reviews.reduce((sum, r) => sum + r.totalCount, 0)}
                      </div>
                      <p className="text-sm text-muted-foreground">Всего отзывов</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <MessageSquare className="h-6 w-6 text-purple-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="glass-card border-white/10 hover:border-orange-500/30 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-orange-400">
                        {reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.averageRating, 0) / reviews.length).toFixed(1) : '0.0'}
                      </div>
                      <p className="text-sm text-muted-foreground">Средний рейтинг</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-orange-500/20 flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-orange-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Фильтры и поиск */}
            <Card className="glass-card border-white/10">
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Поиск по названию или автору..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-background/50 border-white/10 focus:border-primary/50"
                      />
                    </div>
                  </div>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-full sm:w-[200px] bg-background/50 border-white/10">
                      <SelectValue placeholder="Категория" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все категории</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Таблица товаров */}
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <span className="text-lg md:text-xl">Товары ({filteredProducts.length})</span>
                  <Button onClick={handleAddProduct} className="w-full sm:w-auto bg-primary/90 hover:bg-primary">
                    <Plus className="h-4 w-4 mr-2" />
                    <span className="sm:hidden">Добавить</span>
                    <span className="hidden sm:inline">Добавить товар</span>
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/10 hover:bg-transparent">
                        <TableHead className="min-w-[200px]">Товар</TableHead>
                        <TableHead className="min-w-[120px]">Автор</TableHead>
                        <TableHead className="min-w-[100px]">Категория</TableHead>
                        <TableHead className="min-w-[80px]">Цена</TableHead>
                        <TableHead className="min-w-[100px]">Рейтинг</TableHead>
                        <TableHead className="text-right min-w-[120px]">Действия</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProducts.map((product: Product, index: number) => (
                        <TableRow
                          key={`${product.id}-${index}`}
                          className="border-white/10 hover:bg-white/5 transition-colors duration-200"
                        >
                          <TableCell>
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
                                  {product.genre}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{product.author}</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="bg-slate-500/20 text-slate-300 border-slate-500/30">
                              {product.type}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium text-green-400">{product.price}₽</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-yellow-400">{getProductRating(product.id).toFixed(1)}</span>
                              <span className="text-sm text-muted-foreground">
                                ({getProductReviewCount(product.id)})
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1 md:gap-2">
                              <Link href={`/product/${product.id}`}>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 w-8 p-0 border-white/10 hover:bg-white/10 hover:border-blue-500/50"
                                >
                                  <Eye className="h-3 w-3 md:h-4 md:w-4" />
                                </Button>
                              </Link>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditProduct(product)}
                                className="h-8 w-8 p-0 border-white/10 hover:bg-white/10 hover:border-yellow-500/50"
                              >
                                <Edit className="h-3 w-3 md:h-4 md:w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(product)}
                                className="h-8 w-8 p-0 border-white/10 hover:bg-red-500/20 hover:border-red-500/50 text-red-400"
                              >
                                <Trash2 className="h-3 w-3 md:h-4 md:w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Диалог редактирования товара */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogContent className="max-w-2xl glass-card border-white/10">
                <DialogHeader>
                  <DialogTitle className="text-lg md:text-xl">Редактировать товар</DialogTitle>
                </DialogHeader>
                {selectedProduct && (
                  <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-title">Название</Label>
                        <Input
                          id="edit-title"
                          value={editProduct.title}
                          onChange={(e) => setEditProduct({...editProduct, title: e.target.value})}
                          className="bg-background/50 border-white/10"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-author">Автор</Label>
                        <Input
                          id="edit-author"
                          value={editProduct.author}
                          onChange={(e) => setEditProduct({...editProduct, author: e.target.value})}
                          className="bg-background/50 border-white/10"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-category">Категория</Label>
                        <Select value={editProduct.type} onValueChange={(value) => setEditProduct({...editProduct, type: value})}>
                          <SelectTrigger className="bg-background/50 border-white/10">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map(category => (
                              <SelectItem key={category} value={category}>{category}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-price">Цена (₽)</Label>
                        <Input
                          id="edit-price"
                          type="number"
                          step="0.01"
                          value={editProduct.price}
                          onChange={(e) => setEditProduct({...editProduct, price: parseFloat(e.target.value) || 0})}
                          className="bg-background/50 border-white/10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-genre">Жанр</Label>
                      <Input
                        id="edit-genre"
                        value={editProduct.genre}
                        onChange={(e) => setEditProduct({...editProduct, genre: e.target.value})}
                        className="bg-background/50 border-white/10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-image">URL изображения</Label>
                      <Input
                        id="edit-image"
                        value={editProduct.image}
                        onChange={(e) => setEditProduct({...editProduct, image: e.target.value})}
                        className="bg-background/50 border-white/10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-description">Описание</Label>
                      <Textarea
                        id="edit-description"
                        value={editProduct.description}
                        onChange={(e) => setEditProduct({...editProduct, description: e.target.value})}
                        rows={3}
                        className="bg-background/50 border-white/10"
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                      <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="w-full sm:w-auto border-white/10">
                        Отмена
                      </Button>
                      <Button onClick={handleSaveEditProduct} className="w-full sm:w-auto">
                        Сохранить
                      </Button>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>

            {/* Диалог добавления товара */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogContent className="max-w-2xl glass-card border-white/10">
                <DialogHeader>
                  <DialogTitle className="text-lg md:text-xl">Добавить новый товар</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="add-title">Название</Label>
                      <Input
                        id="add-title"
                        placeholder="Название товара"
                        value={newProduct.title}
                        onChange={(e) => setNewProduct({...newProduct, title: e.target.value})}
                        className="bg-background/50 border-white/10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="add-author">Автор</Label>
                      <Input
                        id="add-author"
                        placeholder="Автор"
                        value={newProduct.author}
                        onChange={(e) => setNewProduct({...newProduct, author: e.target.value})}
                        className="bg-background/50 border-white/10"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="add-category">Категория</Label>
                      <Select value={newProduct.category} onValueChange={(value) => setNewProduct({...newProduct, category: value})}>
                        <SelectTrigger className="bg-background/50 border-white/10">
                          <SelectValue placeholder="Выберите категорию" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(category => (
                            <SelectItem key={category} value={category}>{category}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="add-price">Цена (₽)</Label>
                      <Input
                        id="add-price"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value) || 0})}
                        className="bg-background/50 border-white/10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="add-genre">Жанр</Label>
                    <Input
                      id="add-genre"
                      placeholder="Жанр"
                      value={newProduct.genre}
                      onChange={(e) => setNewProduct({...newProduct, genre: e.target.value})}
                      className="bg-background/50 border-white/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="add-image">URL изображения</Label>
                    <Input
                      id="add-image"
                      placeholder="https://..."
                      value={newProduct.image}
                      onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                      className="bg-background/50 border-white/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="add-description">Описание</Label>
                    <Textarea
                      id="add-description"
                      placeholder="Описание товара..."
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                      rows={3}
                      className="bg-background/50 border-white/10"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="w-full sm:w-auto border-white/10">
                      Отмена
                    </Button>
                    <Button onClick={handleSaveNewProduct} className="w-full sm:w-auto">
                      Добавить
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Диалог подтверждения удаления */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <DialogContent className="glass-card border-white/10">
                <DialogHeader>
                  <DialogTitle className="text-lg md:text-xl">Подтвердите удаление</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <p className="text-muted-foreground">Вы уверены, что хотите удалить товар "{selectedProduct?.title}"?</p>
                  <div className="flex flex-col sm:flex-row justify-end gap-3">
                    <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} className="w-full sm:w-auto border-white/10">
                      Отмена
                    </Button>
                    <Button variant="destructive" onClick={handleDeleteProduct} className="w-full sm:w-auto">
                      Удалить
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </AdminLayout>
    </RoleGuard>
  )
}
