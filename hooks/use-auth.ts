"use client"

import { useStore } from "@/lib/store"
import users from "@/data/users.json"

export function useAuth() {
  const { user, setUser } = useStore()

  const login = (email: string, password: string) => {
    const foundUser = users.find(
      (u) => u.email === email && u.password === password && u.isActive
    )

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser
      setUser(userWithoutPassword as { id: string; name: string; email: string; role: "admin" | "user"; createdAt: string; isActive: boolean })
      return { success: true, user: userWithoutPassword }
    }

    return { success: false, error: "Неверный email или пароль" }
  }

  const logout = () => {
    setUser(null)
  }

  const register = (name: string, email: string, password: string) => {
    // В реальном приложении здесь была бы отправка на сервер
    const existingUser = users.find((u) => u.email === email)
    
    if (existingUser) {
      return { success: false, error: "Пользователь с таким email уже существует" }
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      role: "user" as "user",
      createdAt: new Date().toISOString(),
      isActive: true
    }

    setUser(newUser)
    return { success: true, user: newUser }
  }

  return {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    isUser: user?.role === "user",
    login,
    logout,
    register
  }
}