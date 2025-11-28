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