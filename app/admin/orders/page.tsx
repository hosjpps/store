'use client'

import { useState, useEffect } from 'react'
import { useStore } from '@/lib/store'
import { RoleGuard } from '@/components/auth'
import { AdminLayout } from '@/components/admin/admin-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Search,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  ShoppingCart,
  Truck,
  Ban
} from 'lucide-react'

type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

const statusColors: Record<OrderStatus, string> = {
  pending: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  processing: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  shipped: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  delivered: 'bg-green-500/20 text-green-300 border-green-500/30',
  cancelled: 'bg-red-500/20 text-red-300 border-red-500/30'
}

const statusIcons = {
  pending: Clock,
  processing: Package,
  shipped: Truck,
  delivered: CheckCircle,
  cancelled: XCircle
}

const statusLabels = {
  pending: 'Ожидает',
  processing: 'Обрабатывается',
  shipped: 'Отправлен',
  delivered: 'Доставлен',
  cancelled: 'Отменен'
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function AdminOrdersPage() {
  const { getAllOrders, updateOrderStatus } = useStore()
  const [orders, setOrders] = useState<any[]>([])
  const [filteredOrders, setFilteredOrders] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const allOrders = getAllOrders()
    setOrders(allOrders)
    setFilteredOrders(allOrders)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    let filtered = orders

    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.userEmail?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter)
    }

    setFilteredOrders(filtered)
  }, [orders, searchTerm, statusFilter])

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus)
    const updatedOrders = getAllOrders()
    setOrders(updatedOrders)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const calculateTotal = (items: any[]) => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  }

  return (
    <RoleGuard allowedRoles={['admin']}>
      <AdminLayout
        title="Управление заказами"
        breadcrumbs={[
          { label: "Заказы" }
        ]}
      >
        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <div className="space-y-6">
            {/* Фильтры */}
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="text-lg">Фильтры</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Поиск по ID заказа или email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-background/50 border-white/10 focus:border-primary/50"
                      />
                    </div>
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-48 bg-background/50 border-white/10">
                      <SelectValue placeholder="Статус заказа" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все статусы</SelectItem>
                      <SelectItem value="pending">Ожидает</SelectItem>
                      <SelectItem value="processing">Обрабатывается</SelectItem>
                      <SelectItem value="shipped">Отправлен</SelectItem>
                      <SelectItem value="delivered">Доставлен</SelectItem>
                      <SelectItem value="cancelled">Отменен</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Статистика */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <Card className="glass-card border-white/10 hover:border-blue-500/30 transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-blue-400">{orders.length}</div>
                      <p className="text-sm text-muted-foreground">Всего заказов</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <ShoppingCart className="h-5 w-5 text-blue-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="glass-card border-white/10 hover:border-yellow-500/30 transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-yellow-400">
                        {orders.filter(o => o.status === 'pending').length}
                      </div>
                      <p className="text-sm text-muted-foreground">Ожидают</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-yellow-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="glass-card border-white/10 hover:border-purple-500/30 transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-purple-400">
                        {orders.filter(o => o.status === 'processing').length}
                      </div>
                      <p className="text-sm text-muted-foreground">Обрабатываются</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <Package className="h-5 w-5 text-purple-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="glass-card border-white/10 hover:border-green-500/30 transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-green-400">
                        {orders.filter(o => o.status === 'delivered').length}
                      </div>
                      <p className="text-sm text-muted-foreground">Доставлены</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-green-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="glass-card border-white/10 hover:border-red-500/30 transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-red-400">
                        {orders.filter(o => o.status === 'cancelled').length}
                      </div>
                      <p className="text-sm text-muted-foreground">Отменены</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-red-500/20 flex items-center justify-center">
                      <Ban className="h-5 w-5 text-red-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Таблица заказов */}
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle>Заказы ({filteredOrders.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/10 hover:bg-transparent">
                        <TableHead>ID заказа</TableHead>
                        <TableHead>Дата</TableHead>
                        <TableHead>Email клиента</TableHead>
                        <TableHead>Товары</TableHead>
                        <TableHead>Сумма</TableHead>
                        <TableHead>Статус</TableHead>
                        <TableHead>Действия</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOrders.map((order) => {
                        const StatusIcon = statusIcons[order.status as OrderStatus]
                        return (
                          <TableRow
                            key={order.id}
                            className="border-white/10 hover:bg-white/5 transition-colors duration-200"
                          >
                            <TableCell className="font-mono text-sm text-muted-foreground">
                              {order.id.slice(0, 8)}...
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {formatDate(order.createdAt)}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {order.userEmail || 'Гость'}
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary" className="bg-slate-500/20 text-slate-300 border-slate-500/30">
                                {order.items.length} товар(ов)
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="font-semibold text-green-400">
                                ¥{calculateTotal(order.items).toLocaleString()}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={statusColors[order.status as OrderStatus]}>
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {statusLabels[order.status as OrderStatus]}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Select
                                  value={order.status}
                                  onValueChange={(value) => handleStatusChange(order.id, value as OrderStatus)}
                                >
                                  <SelectTrigger className="w-36 bg-background/50 border-white/10">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="pending">Ожидает</SelectItem>
                                    <SelectItem value="processing">Обрабатывается</SelectItem>
                                    <SelectItem value="shipped">Отправлен</SelectItem>
                                    <SelectItem value="delivered">Доставлен</SelectItem>
                                    <SelectItem value="cancelled">Отменен</SelectItem>
                                  </SelectContent>
                                </Select>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-white/10 hover:bg-white/10 hover:border-blue-500/50"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                  {filteredOrders.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                      <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Заказы не найдены</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </AdminLayout>
    </RoleGuard>
  )
}
