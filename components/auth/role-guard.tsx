"use client"

import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShieldX } from "lucide-react"

interface RoleGuardProps {
  children: React.ReactNode
  allowedRoles: ('admin' | 'user')[]
  fallback?: React.ReactNode
}

export function RoleGuard({ children, allowedRoles, fallback }: RoleGuardProps) {
  const { user, isAuthenticated } = useAuth()

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center gap-2">
              <ShieldX className="h-6 w-6 text-red-500" />
              Требуется авторизация
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">
              Для доступа к этой странице необходимо войти в систему
            </p>
            <Button onClick={() => window.location.href = '/account'}>
              Войти в аккаунт
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!allowedRoles.includes(user.role)) {
    if (fallback) {
      return <>{fallback}</>
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center gap-2">
              <ShieldX className="h-6 w-6 text-red-500" />
              Доступ запрещен
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">
              У вас недостаточно прав для доступа к этой странице
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Требуемые роли: {allowedRoles.join(', ')}
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Ваша роль: {user.role}
            </p>
            <Button onClick={() => window.location.href = '/'}>
              На главную
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}