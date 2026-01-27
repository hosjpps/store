"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

import { User, Product } from '@/types/index'

interface CartItem extends Product {
  quantity: number
}

interface Order {
  id: string
  userId: string
  items: CartItem[]
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  date: string
  createdAt: string
}

interface StoreUser {
  id: string
  name: string
  email: string
  role: 'admin' | 'user'
  createdAt: string
  isActive: boolean
}

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

// Available promo codes
const PROMO_CODES: Record<string, { discount: number; type: 'percent' | 'fixed'; minOrder: number }> = {
  'ANIME10': { discount: 10, type: 'percent', minOrder: 1000 },
  'MANGA15': { discount: 15, type: 'percent', minOrder: 2000 },
  'WELCOME': { discount: 500, type: 'fixed', minOrder: 3000 },
  'NEWUSER': { discount: 20, type: 'percent', minOrder: 0 },
}

interface StoreState {
  // Корзина
  cart: CartItem[]
  addToCart: (product: Product) => void
  removeFromCart: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  clearCart: () => void

  // Избранное
  favorites: Product[]
  addToFavorites: (product: Product) => void
  removeFromFavorites: (productId: number) => void

  // Поиск
  searchQuery: string
  setSearchQuery: (query: string) => void

  // Заказы
  orders: Order[]
  addOrder: (order: Omit<Order, 'id' | 'createdAt'>) => void
  updateOrderStatus: (orderId: string, status: Order['status']) => void
  getUserOrders: (userId: string) => Order[]
  getAllOrders: () => Order[]

  // Товары
  products: Product[]
  initProducts: (products: Product[]) => void
  addProduct: (product: Omit<Product, 'id'>) => void
  addProductWithId: (product: Product) => void
  updateProduct: (id: number, product: Partial<Product>) => void
  deleteProduct: (id: number) => void
  getProducts: () => Product[]

  // Пользователь (текущий авторизованный)
  user: StoreUser | null
  setUser: (user: StoreUser | null) => void

  // Управление пользователями (админ)
  users: StoreUser[]
  initUsers: (users: StoreUser[]) => void
  addUser: (user: Omit<StoreUser, 'id' | 'createdAt'>) => void
  updateUser: (id: string, data: Partial<StoreUser>) => void
  deleteUser: (id: string) => void
  toggleUserStatus: (id: string) => void
  getAllUsers: () => StoreUser[]

  // Управление отзывами (админ)
  reviews: ProductReview[]
  initReviews: (reviews: ProductReview[]) => void
  addReview: (productId: string, review: Omit<ReviewItem, 'date' | 'isApproved'>) => void
  deleteReview: (productId: string, reviewIndex: number) => void
  deleteAllProductReviews: (productId: string) => void
  approveReview: (productId: string, reviewIndex: number) => void
  rejectReview: (productId: string, reviewIndex: number) => void
  getAllReviews: () => ProductReview[]
  getProductReviews: (productId: string) => ProductReview | undefined

  // Recently Viewed
  recentlyViewed: Product[]
  addToRecentlyViewed: (product: Product) => void
  clearRecentlyViewed: () => void

  // Promo codes
  appliedPromoCode: string | null
  promoDiscount: number
  applyPromoCode: (code: string) => boolean
  removePromoCode: () => void
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Корзина
      cart: [],
      addToCart: (product) => {
        const cart = get().cart
        const existingItem = cart.find((item) => item.id === product.id)

        if (existingItem) {
          set({
            cart: cart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)),
          })
        } else {
          set({ cart: [...cart, { ...product, quantity: 1 }] })
        }
      },
      removeFromCart: (productId) => {
        set({ cart: get().cart.filter((item) => item.id !== productId) })
      },
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId)
          return
        }

        set({
          cart: get().cart.map((item) => (item.id === productId ? { ...item, quantity } : item)),
        })
      },
      clearCart: () => set({ cart: [] }),

      // Избранное
      favorites: [],
      addToFavorites: (product) => {
        const favorites = get().favorites
        if (!favorites.find((item) => item.id === product.id)) {
          set({ favorites: [...favorites, product] })
        }
      },
      removeFromFavorites: (productId) => {
        set({ favorites: get().favorites.filter((item) => item.id !== productId) })
      },

      // Заказы
      orders: [],
      addOrder: (orderData) => {
        const newOrder: Order = {
          ...orderData,
          id: `ORD-${Date.now()}`,
          createdAt: new Date().toISOString()
        }
        set({ orders: [...get().orders, newOrder] })
      },
      updateOrderStatus: (orderId, status) => {
        set({
          orders: get().orders.map(order => 
            order.id === orderId ? { ...order, status } : order
          )
        })
      },
      getUserOrders: (userId) => {
        return get().orders.filter(order => order.userId === userId)
      },
      getAllOrders: () => {
        return get().orders
      },

      // Поиск
      searchQuery: "",
      setSearchQuery: (query) => set({ searchQuery: query }),

      // Товары
      products: [],
      initProducts: (products) => {
        if (get().products.length === 0) {
          set({ products })
        }
      },
      addProduct: (productData) => {
        const existingIds = get().products.map(p => p.id)
        let newId = Date.now()
        // Убеждаемся, что ID уникален
        while (existingIds.includes(newId)) {
          newId++
        }
        const newProduct = {
          ...productData,
          id: newId
        }
        set({ products: [...get().products, newProduct] })
      },
      addProductWithId: (product) => {
        const existingIds = get().products.map(p => p.id)
        if (!existingIds.includes(product.id)) {
          set({ products: [...get().products, product] })
        }
      },
      updateProduct: (id, productData) => {
        set({
          products: get().products.map(product => 
            product.id === id ? { ...product, ...productData } : product
          )
        })
      },
      deleteProduct: (id) => {
        set({ products: get().products.filter(product => product.id !== id) })
      },
      getProducts: () => {
        return get().products
      },

      // Пользователь (текущий авторизованный)
      user: null,
      setUser: (user) => set({ user }),

      // Управление пользователями (админ)
      users: [],
      initUsers: (users) => {
        if (get().users.length === 0) {
          set({ users })
        }
      },
      addUser: (userData) => {
        const newUser: StoreUser = {
          ...userData,
          id: `user-${Date.now()}`,
          createdAt: new Date().toISOString()
        }
        set({ users: [...get().users, newUser] })
      },
      updateUser: (id, data) => {
        set({
          users: get().users.map(user =>
            user.id === id ? { ...user, ...data } : user
          )
        })
      },
      deleteUser: (id) => {
        set({ users: get().users.filter(user => user.id !== id) })
      },
      toggleUserStatus: (id) => {
        set({
          users: get().users.map(user =>
            user.id === id ? { ...user, isActive: !user.isActive } : user
          )
        })
      },
      getAllUsers: () => get().users,

      // Управление отзывами (админ)
      reviews: [],
      initReviews: (reviews) => {
        if (get().reviews.length === 0) {
          set({ reviews })
        }
      },
      addReview: (productId, reviewData) => {
        const reviews = get().reviews
        const existingIndex = reviews.findIndex(r => r.productId === productId)

        const newReview: ReviewItem = {
          ...reviewData,
          date: new Date().toISOString(),
          isApproved: false
        }

        if (existingIndex >= 0) {
          const updated = [...reviews]
          updated[existingIndex] = {
            ...updated[existingIndex],
            reviews: [...updated[existingIndex].reviews, newReview],
            totalCount: updated[existingIndex].totalCount + 1,
            averageRating: (
              (updated[existingIndex].averageRating * updated[existingIndex].reviews.length + reviewData.rating) /
              (updated[existingIndex].reviews.length + 1)
            )
          }
          set({ reviews: updated })
        } else {
          set({
            reviews: [...reviews, {
              productId,
              totalCount: 1,
              averageRating: reviewData.rating,
              reviews: [newReview]
            }]
          })
        }
      },
      deleteReview: (productId, reviewIndex) => {
        const reviews = get().reviews
        const productReviewIndex = reviews.findIndex(r => r.productId === productId)

        if (productReviewIndex >= 0) {
          const updated = [...reviews]
          const productReview = { ...updated[productReviewIndex] }
          const deletedRating = productReview.reviews[reviewIndex].rating

          productReview.reviews = productReview.reviews.filter((_, i) => i !== reviewIndex)
          productReview.totalCount = productReview.reviews.length

          if (productReview.reviews.length > 0) {
            productReview.averageRating = productReview.reviews.reduce((sum, r) => sum + r.rating, 0) / productReview.reviews.length
          } else {
            productReview.averageRating = 0
          }

          updated[productReviewIndex] = productReview
          set({ reviews: updated })
        }
      },
      deleteAllProductReviews: (productId) => {
        set({ reviews: get().reviews.filter(r => r.productId !== productId) })
      },
      approveReview: (productId, reviewIndex) => {
        const reviews = get().reviews
        const productReviewIndex = reviews.findIndex(r => r.productId === productId)

        if (productReviewIndex >= 0) {
          const updated = [...reviews]
          const productReview = { ...updated[productReviewIndex] }
          productReview.reviews = productReview.reviews.map((review, i) =>
            i === reviewIndex ? { ...review, isApproved: true } : review
          )
          updated[productReviewIndex] = productReview
          set({ reviews: updated })
        }
      },
      rejectReview: (productId, reviewIndex) => {
        // Отклонение = удаление отзыва
        get().deleteReview(productId, reviewIndex)
      },
      getAllReviews: () => get().reviews,
      getProductReviews: (productId) => get().reviews.find(r => r.productId === productId),

      // Recently Viewed
      recentlyViewed: [],
      addToRecentlyViewed: (product) => {
        const current = get().recentlyViewed
        // Remove if already exists
        const filtered = current.filter(p => p.id !== product.id)
        // Add to front, limit to 10
        const updated = [product, ...filtered].slice(0, 10)
        set({ recentlyViewed: updated })
      },
      clearRecentlyViewed: () => set({ recentlyViewed: [] }),

      // Promo codes
      appliedPromoCode: null,
      promoDiscount: 0,
      applyPromoCode: (code) => {
        const upperCode = code.toUpperCase()
        const promo = PROMO_CODES[upperCode]
        if (!promo) return false

        const cart = get().cart
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

        if (total < promo.minOrder) return false

        const discount = promo.type === 'percent'
          ? Math.round(total * promo.discount / 100)
          : promo.discount

        set({ appliedPromoCode: upperCode, promoDiscount: discount })
        return true
      },
      removePromoCode: () => set({ appliedPromoCode: null, promoDiscount: 0 })
    }),
    {
      name: "anime-store",
    },
  ),
)
