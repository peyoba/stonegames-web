"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Pencil, Trash2, Search } from "lucide-react"
import { useAppStore } from "@/store"

interface Category {
  id: string
  name: string
  nameEn: string
  gameCount: number
}

/**
 * 分类列表组件
 * 包含分类列表、搜索、添加、编辑和删除功能
 */
export function CategoryList() {
  const locale = useAppStore((state) => state.locale)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    nameEn: ""
  })

  // 加载分类列表
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/admin/categories")
        if (!response.ok) {
          throw new Error("获取分类列表失败")
        }
        const data = await response.json()
        setCategories(data)
      } catch (error) {
        console.error("加载数据失败:", error)
        setError(error instanceof Error ? error.message : "未知错误")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // 处理表单输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  // 处理添加分类
  const handleAddCategory = async () => {
    try {
      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error("添加分类失败")
      }

      const newCategory = await response.json()
      setCategories((prev) => [...prev, newCategory])
      setIsAddDialogOpen(false)
      setFormData({
        name: "",
        nameEn: ""
      })
    } catch (error) {
      console.error("添加分类失败:", error)
      setError(error instanceof Error ? error.message : "未知错误")
    }
  }

  // 处理编辑分类
  const handleEditCategory = async () => {
    if (!selectedCategory) return

    try {
      const response = await fetch(`/api/admin/categories/${selectedCategory.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error("更新分类失败")
      }

      const updatedCategory = await response.json()
      setCategories((prev) =>
        prev.map((category) =>
          category.id === updatedCategory.id ? updatedCategory : category
        )
      )
      setIsEditDialogOpen(false)
      setSelectedCategory(null)
      setFormData({
        name: "",
        nameEn: ""
      })
    } catch (error) {
      console.error("更新分类失败:", error)
      setError(error instanceof Error ? error.message : "未知错误")
    }
  }

  // 处理删除分类
  const handleDeleteCategory = async (id: string) => {
    if (!confirm(locale === "zh" ? "确定要删除这个分类吗？" : "Are you sure you want to delete this category?")) {
      return
    }

    try {
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: "DELETE"
      })

      if (!response.ok) {
        throw new Error("删除分类失败")
      }

      setCategories((prev) => prev.filter((category) => category.id !== id))
    } catch (error) {
      console.error("删除分类失败:", error)
      setError(error instanceof Error ? error.message : "未知错误")
    }
  }

  // 打开编辑对话框
  const openEditDialog = (category: Category) => {
    setSelectedCategory(category)
    setFormData({
      name: category.name,
      nameEn: category.nameEn
    })
    setIsEditDialogOpen(true)
  }

  // 过滤分类列表
  const filteredCategories = categories.filter((category) => {
    const query = searchQuery.toLowerCase()
    return (
      category.name.toLowerCase().includes(query) ||
      category.nameEn.toLowerCase().includes(query)
    )
  })

  // 加载状态
  if (loading) {
    return (
      <div className="text-center">
        <h2 className="text-xl font-semibold">
          {locale === "zh" ? "加载中..." : "Loading..."}
        </h2>
      </div>
    )
  }

  // 错误状态
  if (error) {
    return (
      <div className="text-center text-red-500">
        <h2 className="text-xl font-semibold">
          {locale === "zh" ? "加载失败" : "Failed to load"}
        </h2>
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* 搜索和添加按钮 */}
      <div className="flex items-center justify-between">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder={locale === "zh" ? "搜索分类..." : "Search categories..."}
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              {locale === "zh" ? "添加分类" : "Add Category"}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{locale === "zh" ? "添加分类" : "Add Category"}</DialogTitle>
              <DialogDescription>
                {locale === "zh"
                  ? "填写分类信息并点击保存"
                  : "Fill in the category information and click save"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{locale === "zh" ? "中文名称" : "Chinese Name"}</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nameEn">{locale === "zh" ? "英文名称" : "English Name"}</Label>
                <Input
                  id="nameEn"
                  name="nameEn"
                  value={formData.nameEn}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddCategory}>
                {locale === "zh" ? "保存" : "Save"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* 分类列表 */}
      <Card>
        <CardHeader>
          <CardTitle>{locale === "zh" ? "分类列表" : "Category List"}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{locale === "zh" ? "名称" : "Name"}</TableHead>
                <TableHead>{locale === "zh" ? "游戏数量" : "Game Count"}</TableHead>
                <TableHead>{locale === "zh" ? "操作" : "Actions"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    <div className="font-medium">
                      {locale === "zh" ? category.name : category.nameEn}
                    </div>
                  </TableCell>
                  <TableCell>{category.gameCount}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(category)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteCategory(category.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 编辑对话框 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{locale === "zh" ? "编辑分类" : "Edit Category"}</DialogTitle>
            <DialogDescription>
              {locale === "zh"
                ? "修改分类信息并点击保存"
                : "Modify the category information and click save"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">{locale === "zh" ? "中文名称" : "Chinese Name"}</Label>
              <Input
                id="edit-name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-nameEn">{locale === "zh" ? "英文名称" : "English Name"}</Label>
              <Input
                id="edit-nameEn"
                name="nameEn"
                value={formData.nameEn}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleEditCategory}>
              {locale === "zh" ? "保存" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 