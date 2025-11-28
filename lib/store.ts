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
  addProduct: (product: Omit<Product, 'id'>) => void
  updateProduct: (id: number, product: Partial<Product>) => void
  deleteProduct: (id: number) => void
  getProducts: () => Product[]

  // Пользователь
  user: {
    id: string
    name: string
    email: string
    role: 'admin' | 'user'
    createdAt: string
    isActive: boolean
  } | null
  setUser: (user: {
    id: string
    name: string
    email: string
    role: 'admin' | 'user'
    createdAt: string
    isActive: boolean
  } | null) => void
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

      // Пользователь
      user: null,
      setUser: (user) => set({ user })
    }),
    {
      name: "anime-store",
    },
  ),
)
