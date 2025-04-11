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
import { useToast } from "@/components/ui/use-toast"

interface Category {
  id: string
  name: string
  nameEn: string
  icon?: string
  count?: number
}

/**
 * 分类列表组件
 * 包含分类列表、搜索、添加、编辑和删除功能
 */
export function CategoryList() {
  const { toast } = useToast()
  const locale = useAppStore((state) => state.locale)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [newCategory, setNewCategory] = useState<{ name: string; nameEn: string; icon?: string }>({ name: "", nameEn: "", icon: "" })

  // 将 fetchCategories 定义移到前面
  const fetchCategories = async () => {
    setLoading(true)
    setError(null) // 重置错误状态
    try {
      const response = await fetch("/api/categories")
      if (!response.ok) {
        throw new Error("获取分类列表失败")
      }
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error("加载数据失败:", error)
      setError(error instanceof Error ? error.message : "未知错误")
      toast({ // 添加错误提示
        title: locale === "zh" ? "错误" : "Error",
        description: locale === "zh" ? "获取分类列表失败" : "Failed to fetch category list",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // 加载分类列表
  useEffect(() => {
    fetchCategories()
  }, [])

  // 处理表单输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    // 根据编辑状态更新不同的 state
    if (editingCategory) {
      setEditingCategory((prev) => prev ? { ...prev, [name]: value } : null)
    } else {
      setNewCategory((prev) => ({ ...prev, [name]: value }))
    }
  }

  // 处理添加分类
  const handleAddCategory = async () => {
    if (!newCategory.name || !newCategory.nameEn) {
      toast({
        title: locale === "zh" ? "提示" : "Info",
        description: locale === "zh" ? "请输入分类名称" : "Please enter category name",
      })
      return
    }
    try {
      const response: Response = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newCategory)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to add category")
      }

      await response.json()
      await fetchCategories() // 现在应该能找到了
      setNewCategory({
        name: "",
        nameEn: "",
        icon: ""
      })
      toast({
        title: locale === "zh" ? "成功" : "Success",
        description: locale === "zh" ? "分类添加成功" : "Category added successfully",
      })
    } catch (error) {
      console.error("添加分类失败:", error)
      // setError(error instanceof Error ? error.message : "未知错误") // 错误状态由 toast 处理
      toast({
        title: locale === "zh" ? "错误" : "Error",
        description: `${locale === "zh" ? "添加分类失败" : "Failed to add category"}: ${error instanceof Error ? error.message : String(error)}`,
        variant: "destructive",
      })
    }
  }

  // 处理编辑分类
  const handleEditCategory = async () => {
    if (!editingCategory) return

    try {
      const response = await fetch(`/api/categories/${editingCategory.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(editingCategory)
      })

      if (!response.ok) {
        throw new Error("更新分类失败")
      }

      // const updatedCategory = await response.json() // API 应该返回更新后的数据
      // setCategories((prev) => // 使用返回的数据更新列表
      //   prev.map((category) =>
      //     category.id === updatedCategory.id ? updatedCategory : category
      //   )
      // )
      await response.json() // 假设 API 只是确认成功
      await fetchCategories() // 重新获取列表以显示更新
      setEditingCategory(null)
      toast({
        title: locale === "zh" ? "成功" : "Success",
        description: locale === "zh" ? "分类更新成功" : "Category updated successfully",
      })
    } catch (error) {
      console.error("更新分类失败:", error)
      // setError(error instanceof Error ? error.message : "未知错误")
      toast({
        title: locale === "zh" ? "错误" : "Error",
        description: `${locale === "zh" ? "更新分类失败" : "Failed to update category"}: ${error instanceof Error ? error.message : String(error)}`,
        variant: "destructive",
      })
    }
  }

  // 处理删除分类
  const handleDeleteCategory = async () => {
    if (!editingCategory) return

    try {
      const response = await fetch(`/api/categories/${editingCategory.id}`, {
        method: "DELETE"
      })

      if (!response.ok) {
        throw new Error("删除分类失败")
      }

      // setCategories((prev) => prev.filter((category) => category.id !== id)) // 由 fetchCategories 更新
      await fetchCategories()
      setEditingCategory(null) // 清空编辑状态
      toast({
        title: locale === "zh" ? "成功" : "Success",
        description: locale === "zh" ? "分类删除成功" : "Category deleted successfully",
      })
    } catch (error) {
      console.error("删除分类失败:", error)
      // setError(error instanceof Error ? error.message : "未知错误")
      toast({
        title: locale === "zh" ? "错误" : "Error",
        description: `${locale === "zh" ? "删除分类失败" : "Failed to delete category"}: ${error instanceof Error ? error.message : String(error)}`,
        variant: "destructive",
      })
    }
  }

  // 过滤分类列表
  const filteredCategories = categories.filter((category) => {
    const query = searchTerm.toLowerCase()
    return (
      category.name.toLowerCase().includes(query) ||
      category.nameEn.toLowerCase().includes(query)
    )
  })

  // 加载状态
  if (loading && categories.length === 0) { // 初始加载时显示
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-semibold">
          {locale === "zh" ? "加载中..." : "Loading..."}
        </h2>
      </div>
    )
  }

  // 错误状态
  if (error) {
    return (
      <div className="text-center text-red-500 py-10">
        <h2 className="text-xl font-semibold">
          {locale === "zh" ? "加载失败" : "Failed to load"}
        </h2>
        <p>{error}</p>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{locale === "zh" ? "分类管理" : "Category Management"}</CardTitle>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search"
              placeholder={locale === "zh" ? "搜索分类..." : "Search categories..."}
              className="pl-8 w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" onClick={() => setNewCategory({ name: "", nameEn: "", icon: "" })}> 
                <Plus className="h-4 w-4 mr-2" />
                {locale === "zh" ? "添加分类" : "Add Category"}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{locale === "zh" ? "添加新分类" : "Add New Category"}</DialogTitle>
                <DialogDescription>
                  {locale === "zh" ? "输入新分类的信息" : "Enter information for the new category"}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">{locale === "zh" ? "名称 (中文)" : "Name (Chinese)"}</Label>
                  <Input id="name" name="name" value={newCategory.name} onChange={handleInputChange} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="nameEn" className="text-right">{locale === "zh" ? "名称 (英文)" : "Name (English)"}</Label>
                  <Input id="nameEn" name="nameEn" value={newCategory.nameEn} onChange={handleInputChange} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="icon" className="text-right">{locale === "zh" ? "图标 (可选)" : "Icon (Optional)"}</Label>
                  <Input id="icon" name="icon" value={newCategory.icon || ""} onChange={handleInputChange} className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddCategory}>{locale === "zh" ? "保存" : "Save"}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">{locale === "zh" ? "加载中..." : "Loading..."}</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{locale === "zh" ? "名称 (中文)" : "Name (Chinese)"}</TableHead>
                <TableHead>{locale === "zh" ? "名称 (英文)" : "Name (English)"}</TableHead>
                <TableHead>{locale === "zh" ? "图标" : "Icon"}</TableHead>
                <TableHead>{locale === "zh" ? "游戏数量" : "Game Count"}</TableHead>
                <TableHead className="text-right">{locale === "zh" ? "操作" : "Actions"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>{category.nameEn}</TableCell>
                  <TableCell>{category.icon || '-'}</TableCell>
                  <TableCell>{category.count || 0}</TableCell>
                  <TableCell className="text-right">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={() => setEditingCategory({ ...category })}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{locale === "zh" ? "编辑分类" : "Edit Category"}</DialogTitle>
                          <DialogDescription>
                            {locale === "zh" ? "修改分类信息" : "Modify category information"}
                          </DialogDescription>
                        </DialogHeader>
                        {editingCategory && (
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-name" className="text-right">{locale === "zh" ? "名称 (中文)" : "Name (Chinese)"}</Label>
                              <Input id="edit-name" name="name" value={editingCategory.name || ""} onChange={handleInputChange} className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-nameEn" className="text-right">{locale === "zh" ? "名称 (英文)" : "Name (English)"}</Label>
                              <Input id="edit-nameEn" name="nameEn" value={editingCategory.nameEn || ""} onChange={handleInputChange} className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-icon" className="text-right">{locale === "zh" ? "图标 (可选)" : "Icon (Optional)"}</Label>
                              <Input id="edit-icon" name="icon" value={editingCategory.icon || ""} onChange={handleInputChange} className="col-span-3" />
                            </div>
                          </div>
                        )}
                        <DialogFooter>
                          <Button onClick={handleEditCategory}>{locale === "zh" ? "保存更改" : "Save Changes"}</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700" onClick={() => setEditingCategory(category)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{locale === "zh" ? "确认删除" : "Confirm Deletion"}</DialogTitle>
                          <DialogDescription>
                            {locale === "zh" ? `确定要删除分类 "${editingCategory?.name}" 吗？` : `Are you sure you want to delete category "${editingCategory?.nameEn}"?`}
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button variant="destructive" onClick={handleDeleteCategory}>{locale === "zh" ? "删除" : "Delete"}</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
} 