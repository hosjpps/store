export interface Product {
  id: number
  title: string
  author: string
  description: string
  price: number
  image: string
  genre: string
  type: string
  rating: number
  createdAt?: string
  tags?: string[]
}

export interface Review {
  id: number
  userName: string
  rating: number
  text: string
  date: string
}

export interface User {
  id: string
  name: string
  email: string
  password: string
  role: 'admin' | 'user'
  createdAt: string
  updatedAt: string
}

export interface CartItem extends Product {
  quantity: number
}

export interface Order {
  id: string
  userId: string
  items: CartItem[]
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  date: string
  createdAt: string
}

export interface StoreUser {
  id: string
  name: string
  email: string
  role: 'admin' | 'user'
  createdAt: string
  isActive: boolean
}