import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Функция для получения пользователя из localStorage (имитация)
// В реальном приложении это был бы JWT токен или сессия
function getUserFromRequest(request: NextRequest) {
  // В реальном приложении здесь была бы проверка JWT токена из cookies
  // Для демонстрации используем заголовок
  const userHeader = request.headers.get('x-user-data')
  if (userHeader) {
    try {
      return JSON.parse(userHeader)
    } catch {
      return null
    }
  }
  return null
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Отключаем middleware для админ-панели, так как авторизация обрабатывается в компоненте
  // if (pathname.startsWith('/admin')) {
  //   const user = getUserFromRequest(request)
  //   
  //   // Если пользователь не авторизован
  //   if (!user) {
  //     // Перенаправляем на страницу входа
  //     const loginUrl = new URL('/account', request.url)
  //     loginUrl.searchParams.set('redirect', pathname)
  //     return NextResponse.redirect(loginUrl)
  //   }
  //   
  //   // Если пользователь не администратор
  //   if (user.role !== 'admin') {
  //     // Перенаправляем на главную страницу с сообщением об ошибке
  //     const homeUrl = new URL('/', request.url)
  //     homeUrl.searchParams.set('error', 'access_denied')
  //     return NextResponse.redirect(homeUrl)
  //   }
  // }

  return NextResponse.next()
}

// Настройка маршрутов, к которым применяется middleware
export const config = {
  matcher: [
    // Применяем middleware ко всем админским маршрутам
    '/admin/:path*',
    // Исключаем статические файлы и API маршруты
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}