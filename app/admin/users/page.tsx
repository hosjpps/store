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
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Search,
  UserPlus,
  Edit,
  Trash2,
  Shield,
  User,
  CheckCircle,
  XCircle,
  Users,
  UserCheck,
  UserX,
  AlertTriangle
} from "lucide-react"
import { useStore } from "@/lib/store"
import staticUsers from "@/data/users.json"

type UserType = {
  id: string
  name: string
  email: string
  role: 'admin' | 'user'
  isActive: boolean
  createdAt: string
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
                <Skeleton className="h-6 w-20" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function AdminUsersPage() {
  const { users, initUsers, addUser, updateUser, deleteUser, toggleUserStatus, getAllUsers } = useStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [editForm, setEditForm] = useState({ name: "", email: "", role: "user" as 'admin' | 'user' })
  const [newUserForm, setNewUserForm] = useState({ name: "", email: "", role: "user" as 'admin' | 'user' })

  useEffect(() => {
    // Инициализируем пользователей из статических данных при первом запуске
    if (users.length === 0) {
      initUsers(staticUsers as UserType[])
    }
    setIsLoading(false)
  }, [])

  const allUsers = getAllUsers()

  const filteredUsers = allUsers.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    const matchesStatus = statusFilter === "all" ||
                         (statusFilter === "active" && user.isActive) ||
                         (statusFilter === "inactive" && !user.isActive)

    return matchesSearch && matchesRole && matchesStatus
  })

  const handleEditUser = (user: UserType) => {
    setSelectedUser(user)
    setEditForm({ name: user.name, email: user.email, role: user.role })
    setIsEditDialogOpen(true)
  }

  const handleSaveEdit = () => {
    if (selectedUser && editForm.name && editForm.email) {
      updateUser(selectedUser.id, {
        name: editForm.name,
        email: editForm.email,
        role: editForm.role
      })
      setIsEditDialogOpen(false)
      setSelectedUser(null)
      setEditForm({ name: "", email: "", role: "user" })
    }
  }

  const handleAddUser = () => {
    setNewUserForm({ name: "", email: "", role: "user" })
    setIsAddDialogOpen(true)
  }

  const handleSaveNewUser = () => {
    if (newUserForm.name && newUserForm.email) {
      addUser({
        name: newUserForm.name,
        email: newUserForm.email,
        role: newUserForm.role,
        isActive: true
      })
      setIsAddDialogOpen(false)
      setNewUserForm({ name: "", email: "", role: "user" })
    }
  }

  const handleDeleteClick = (user: UserType) => {
    setSelectedUser(user)
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    if (selectedUser) {
      deleteUser(selectedUser.id)
      setIsDeleteDialogOpen(false)
      setSelectedUser(null)
    }
  }

  const handleStatusClick = (user: UserType) => {
    setSelectedUser(user)
    setIsStatusDialogOpen(true)
  }

  const handleConfirmStatusChange = () => {
    if (selectedUser) {
      toggleUserStatus(selectedUser.id)
      setIsStatusDialogOpen(false)
      setSelectedUser(null)
    }
  }

  return (
    <RoleGuard allowedRoles={['admin']}>
      <AdminLayout
        title="Управление пользователями"
        breadcrumbs={[
          { label: "Пользователи" }
        ]}
      >
        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <div className="space-y-6">
            {/* Фильтры и поиск */}
            <Card className="glass-card border-white/10">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Поиск по имени или email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-background/50 border-white/10 focus:border-primary/50"
                      />
                    </div>
                  </div>
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-[180px] bg-background/50 border-white/10">
                      <SelectValue placeholder="Роль" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все роли</SelectItem>
                      <SelectItem value="admin">Администратор</SelectItem>
                      <SelectItem value="user">Пользователь</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px] bg-background/50 border-white/10">
                      <SelectValue placeholder="Статус" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все статусы</SelectItem>
                      <SelectItem value="active">Активные</SelectItem>
                      <SelectItem value="inactive">Неактивные</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Статистика пользователей */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="glass-card border-white/10 hover:border-blue-500/30 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-blue-400">{allUsers.length}</div>
                      <p className="text-sm text-muted-foreground">Всего пользователей</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <Users className="h-6 w-6 text-blue-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="glass-card border-white/10 hover:border-green-500/30 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-green-400">
                        {allUsers.filter((u) => u.isActive).length}
                      </div>
                      <p className="text-sm text-muted-foreground">Активных</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center">
                      <UserCheck className="h-6 w-6 text-green-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="glass-card border-white/10 hover:border-purple-500/30 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-purple-400">
                        {allUsers.filter((u) => u.role === 'admin').length}
                      </div>
                      <p className="text-sm text-muted-foreground">Администраторов</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <Shield className="h-6 w-6 text-purple-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="glass-card border-white/10 hover:border-orange-500/30 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-orange-400">
                        {allUsers.filter((u) => !u.isActive).length}
                      </div>
                      <p className="text-sm text-muted-foreground">Заблокированных</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-orange-500/20 flex items-center justify-center">
                      <UserX className="h-6 w-6 text-orange-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Таблица пользователей */}
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Пользователи ({filteredUsers.length})</span>
                  <Button onClick={handleAddUser} className="bg-primary/90 hover:bg-primary">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Добавить пользователя
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/10 hover:bg-transparent">
                        <TableHead>Пользователь</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Роль</TableHead>
                        <TableHead>Статус</TableHead>
                        <TableHead>Дата регистрации</TableHead>
                        <TableHead className="text-right">Действия</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow
                          key={user.id}
                          className="border-white/10 hover:bg-white/5 transition-colors duration-200"
                        >
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell className="text-muted-foreground">{user.email}</TableCell>
                          <TableCell>
                            <Badge
                              variant={user.role === 'admin' ? 'default' : 'secondary'}
                              className={user.role === 'admin' ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' : 'bg-slate-500/20 text-slate-300 border-slate-500/30'}
                            >
                              {user.role === 'admin' ? (
                                <><Shield className="h-3 w-3 mr-1" />Админ</>
                              ) : (
                                <><User className="h-3 w-3 mr-1" />Пользователь</>
                              )}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={user.isActive ? 'default' : 'destructive'}
                              className={user.isActive ? 'bg-green-500/20 text-green-300 border-green-500/30' : 'bg-red-500/20 text-red-300 border-red-500/30'}
                            >
                              {user.isActive ? (
                                <><CheckCircle className="h-3 w-3 mr-1" />Активен</>
                              ) : (
                                <><XCircle className="h-3 w-3 mr-1" />Неактивен</>
                              )}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {new Date(user.createdAt).toLocaleDateString('ru-RU')}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditUser(user)}
                                className="border-white/10 hover:bg-white/10 hover:border-blue-500/50"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleStatusClick(user)}
                                className="border-white/10 hover:bg-white/10 hover:border-yellow-500/50"
                              >
                                {user.isActive ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteClick(user)}
                                className="border-white/10 hover:bg-red-500/20 hover:border-red-500/50 text-red-400"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {filteredUsers.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                      <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Пользователи не найдены</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Диалог редактирования пользователя */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogContent className="glass-card border-white/10">
                <DialogHeader>
                  <DialogTitle>Редактировать пользователя</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name">Имя</Label>
                    <Input
                      id="edit-name"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="bg-background/50 border-white/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-email">Email</Label>
                    <Input
                      id="edit-email"
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="bg-background/50 border-white/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-role">Роль</Label>
                    <Select
                      value={editForm.role}
                      onValueChange={(value: 'admin' | 'user') => setEditForm({ ...editForm, role: value })}
                    >
                      <SelectTrigger className="bg-background/50 border-white/10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">Пользователь</SelectItem>
                        <SelectItem value="admin">Администратор</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="border-white/10">
                      Отмена
                    </Button>
                    <Button onClick={handleSaveEdit}>
                      Сохранить
                    </Button>
                  </DialogFooter>
                </div>
              </DialogContent>
            </Dialog>

            {/* Диалог добавления пользователя */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogContent className="glass-card border-white/10">
                <DialogHeader>
                  <DialogTitle>Добавить пользователя</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="add-name">Имя</Label>
                    <Input
                      id="add-name"
                      placeholder="Введите имя"
                      value={newUserForm.name}
                      onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                      className="bg-background/50 border-white/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="add-email">Email</Label>
                    <Input
                      id="add-email"
                      type="email"
                      placeholder="email@example.com"
                      value={newUserForm.email}
                      onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                      className="bg-background/50 border-white/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="add-role">Роль</Label>
                    <Select
                      value={newUserForm.role}
                      onValueChange={(value: 'admin' | 'user') => setNewUserForm({ ...newUserForm, role: value })}
                    >
                      <SelectTrigger className="bg-background/50 border-white/10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">Пользователь</SelectItem>
                        <SelectItem value="admin">Администратор</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="border-white/10">
                      Отмена
                    </Button>
                    <Button onClick={handleSaveNewUser}>
                      Добавить
                    </Button>
                  </DialogFooter>
                </div>
              </DialogContent>
            </Dialog>

            {/* Диалог подтверждения удаления */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <DialogContent className="glass-card border-white/10">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-red-400">
                    <AlertTriangle className="h-5 w-5" />
                    Подтвердите удаление
                  </DialogTitle>
                  <DialogDescription>
                    Вы уверены, что хотите удалить пользователя "{selectedUser?.name}"?
                    Это действие нельзя отменить.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} className="border-white/10">
                    Отмена
                  </Button>
                  <Button variant="destructive" onClick={handleConfirmDelete}>
                    Удалить
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Диалог изменения статуса */}
            <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
              <DialogContent className="glass-card border-white/10">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    {selectedUser?.isActive ? (
                      <XCircle className="h-5 w-5 text-orange-400" />
                    ) : (
                      <CheckCircle className="h-5 w-5 text-green-400" />
                    )}
                    {selectedUser?.isActive ? "Заблокировать пользователя?" : "Разблокировать пользователя?"}
                  </DialogTitle>
                  <DialogDescription>
                    {selectedUser?.isActive
                      ? `Пользователь "${selectedUser?.name}" будет заблокирован и не сможет войти в систему.`
                      : `Пользователь "${selectedUser?.name}" будет разблокирован и сможет войти в систему.`
                    }
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsStatusDialogOpen(false)} className="border-white/10">
                    Отмена
                  </Button>
                  <Button
                    onClick={handleConfirmStatusChange}
                    className={selectedUser?.isActive ? "bg-orange-500 hover:bg-orange-600" : "bg-green-500 hover:bg-green-600"}
                  >
                    {selectedUser?.isActive ? "Заблокировать" : "Разблокировать"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </AdminLayout>
    </RoleGuard>
  )
}
