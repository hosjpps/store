"use client"

import { useAuth } from "@/hooks/use-auth"
import { LoginForm } from "./login-form"
import { RegisterForm } from "./register-form"
import { useState } from "react"

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  fallback?: React.ReactNode
}

export function AuthGuard({ children, requireAuth = true, fallback }: AuthGuardProps) {
  const { isAuthenticated } = useAuth()
  const [showRegister, setShowRegister] = useState(false)

  if (!requireAuth || isAuthenticated) {
    return <>{children}</>
  }

  if (fallback) {
    return <>{fallback}</>
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {showRegister ? (
        <RegisterForm
          onSuccess={() => window.location.reload()}
          onSwitchToLogin={() => setShowRegister(false)}
        />
      ) : (
        <LoginForm
          onSuccess={() => window.location.reload()}
          onSwitchToRegister={() => setShowRegister(true)}
        />
      )}
    </div>
  )
}