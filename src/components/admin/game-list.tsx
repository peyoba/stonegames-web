"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Pencil, Trash2, Search } from "lucide-react"
import { useAppStore } from "@/store"

interface Game {
  id: string
  title: string
  titleEn: string
  description: string
  descriptionEn: string
  imageUrl: string
  gameUrl: string
  categoryId: string
  category: {
    id: string
    name: string
    nameEn: string
  }
  published: boolean
  views: number
  likes: number
  tags: string[]
}

interface Category {
  id: string
  name: string
  nameEn: string
}

/**
 * 游戏列表组件
 * 包含游戏列表、搜索、添加、编辑和删除功能
 */
export function GameList() {
  const locale = useAppStore((state) => state.locale)
  const [games, setGames] = useState<Game[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedGame, setSelectedGame] = useState<Game | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    titleEn: "",
    description: "",
    descriptionEn: "",
    imageUrl: "",
    gameUrl: "",
    categoryId: "",
    published: false,
    tags: [] as string[]
  })

  // 加载游戏列表和分类列表
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 获取游戏列表
        const gamesResponse = await fetch("/api/admin/games")
        if (!gamesResponse.ok) {
          throw new Error("获取游戏列表失败")
        }
        const gamesData = await gamesResponse.json()
        setGames(gamesData)

        // 获取分类列表
        const categoriesResponse = await fetch("/api/admin/categories")
        if (!categoriesResponse.ok) {
          throw new Error("获取分类列表失败")
        }
        const categoriesData = await categoriesResponse.json()
        setCategories(categoriesData)
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
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  // 处理分类选择
  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      categoryId: value
    }))
  }

  // 处理发布状态切换
  const handlePublishedChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      published: checked
    }))
  }

  // 处理标签输入
  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value.split(",").map((tag) => tag.trim())
    setFormData((prev) => ({
      ...prev,
      tags
    }))
  }

  // 处理添加游戏
  const handleAddGame = async () => {
    try {
      const response = await fetch("/api/admin/games", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error("添加游戏失败")
      }

      const newGame = await response.json()
      setGames((prev) => [...prev, newGame])
      setIsAddDialogOpen(false)
      setFormData({
        title: "",
        titleEn: "",
        description: "",
        descriptionEn: "",
        imageUrl: "",
        gameUrl: "",
        categoryId: "",
        published: false,
        tags: []
      })
    } catch (error) {
      console.error("添加游戏失败:", error)
      setError(error instanceof Error ? error.message : "未知错误")
    }
  }

  // 处理编辑游戏
  const handleEditGame = async () => {
    if (!selectedGame) return

    try {
      const response = await fetch(`/api/admin/games/${selectedGame.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error("更新游戏失败")
      }

      const updatedGame = await response.json()
      setGames((prev) =>
        prev.map((game) => (game.id === updatedGame.id ? updatedGame : game))
      )
      setIsEditDialogOpen(false)
      setSelectedGame(null)
      setFormData({
        title: "",
        titleEn: "",
        description: "",
        descriptionEn: "",
        imageUrl: "",
        gameUrl: "",
        categoryId: "",
        published: false,
        tags: []
      })
    } catch (error) {
      console.error("更新游戏失败:", error)
      setError(error instanceof Error ? error.message : "未知错误")
    }
  }

  // 处理删除游戏
  const handleDeleteGame = async (id: string) => {
    if (!confirm(locale === "zh" ? "确定要删除这个游戏吗？" : "Are you sure you want to delete this game?")) {
      return
    }

    try {
      const response = await fetch(`/api/admin/games/${id}`, {
        method: "DELETE"
      })

      if (!response.ok) {
        throw new Error("删除游戏失败")
      }

      setGames((prev) => prev.filter((game) => game.id !== id))
    } catch (error) {
      console.error("删除游戏失败:", error)
      setError(error instanceof Error ? error.message : "未知错误")
    }
  }

  // 打开编辑对话框
  const openEditDialog = (game: Game) => {
    setSelectedGame(game)
    setFormData({
      title: game.title,
      titleEn: game.titleEn,
      description: game.description,
      descriptionEn: game.descriptionEn,
      imageUrl: game.imageUrl,
      gameUrl: game.gameUrl,
      categoryId: game.categoryId,
      published: game.published,
      tags: game.tags
    })
    setIsEditDialogOpen(true)
  }

  // 过滤游戏列表
  const filteredGames = games.filter((game) => {
    const query = searchQuery.toLowerCase()
    return (
      game.title.toLowerCase().includes(query) ||
      game.titleEn.toLowerCase().includes(query) ||
      game.description.toLowerCase().includes(query) ||
      game.descriptionEn.toLowerCase().includes(query)
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
            placeholder={locale === "zh" ? "搜索游戏..." : "Search games..."}
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              {locale === "zh" ? "添加游戏" : "Add Game"}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{locale === "zh" ? "添加游戏" : "Add Game"}</DialogTitle>
              <DialogDescription>
                {locale === "zh"
                  ? "填写游戏信息并点击保存"
                  : "Fill in the game information and click save"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">{locale === "zh" ? "中文标题" : "Chinese Title"}</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="titleEn">{locale === "zh" ? "英文标题" : "English Title"}</Label>
                <Input
                  id="titleEn"
                  name="titleEn"
                  value={formData.titleEn}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">{locale === "zh" ? "中文描述" : "Chinese Description"}</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="descriptionEn">{locale === "zh" ? "英文描述" : "English Description"}</Label>
                <Textarea
                  id="descriptionEn"
                  name="descriptionEn"
                  value={formData.descriptionEn}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="imageUrl">{locale === "zh" ? "图片URL" : "Image URL"}</Label>
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gameUrl">{locale === "zh" ? "游戏URL" : "Game URL"}</Label>
                <Input
                  id="gameUrl"
                  name="gameUrl"
                  value={formData.gameUrl}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="categoryId">{locale === "zh" ? "分类" : "Category"}</Label>
                <Select value={formData.categoryId} onValueChange={handleCategoryChange}>
                  <SelectTrigger>
                    <SelectValue placeholder={locale === "zh" ? "选择分类" : "Select category"} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {locale === "zh" ? category.name : category.nameEn}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags">{locale === "zh" ? "标签" : "Tags"}</Label>
                <Input
                  id="tags"
                  name="tags"
                  value={formData.tags.join(", ")}
                  onChange={handleTagsChange}
                  placeholder={locale === "zh" ? "用逗号分隔" : "Separate with commas"}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="published"
                  checked={formData.published}
                  onCheckedChange={handlePublishedChange}
                />
                <Label htmlFor="published">{locale === "zh" ? "发布" : "Published"}</Label>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddGame}>
                {locale === "zh" ? "保存" : "Save"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* 游戏列表 */}
      <Card>
        <CardHeader>
          <CardTitle>{locale === "zh" ? "游戏列表" : "Game List"}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{locale === "zh" ? "标题" : "Title"}</TableHead>
                <TableHead>{locale === "zh" ? "分类" : "Category"}</TableHead>
                <TableHead>{locale === "zh" ? "浏览次数" : "Views"}</TableHead>
                <TableHead>{locale === "zh" ? "点赞数" : "Likes"}</TableHead>
                <TableHead>{locale === "zh" ? "状态" : "Status"}</TableHead>
                <TableHead>{locale === "zh" ? "操作" : "Actions"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGames.map((game) => (
                <TableRow key={game.id}>
                  <TableCell>
                    <div className="font-medium">
                      {locale === "zh" ? game.title : game.titleEn}
                    </div>
                    <div className="text-sm text-gray-500">
                      {locale === "zh" ? game.description : game.descriptionEn}
                    </div>
                  </TableCell>
                  <TableCell>
                    {locale === "zh" ? game.category.name : game.category.nameEn}
                  </TableCell>
                  <TableCell>{game.views}</TableCell>
                  <TableCell>{game.likes}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        game.published
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {game.published
                        ? locale === "zh"
                          ? "已发布"
                          : "Published"
                        : locale === "zh"
                        ? "未发布"
                        : "Unpublished"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(game)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteGame(game.id)}
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
            <DialogTitle>{locale === "zh" ? "编辑游戏" : "Edit Game"}</DialogTitle>
            <DialogDescription>
              {locale === "zh"
                ? "修改游戏信息并点击保存"
                : "Modify the game information and click save"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">{locale === "zh" ? "中文标题" : "Chinese Title"}</Label>
              <Input
                id="edit-title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-titleEn">{locale === "zh" ? "英文标题" : "English Title"}</Label>
              <Input
                id="edit-titleEn"
                name="titleEn"
                value={formData.titleEn}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">{locale === "zh" ? "中文描述" : "Chinese Description"}</Label>
              <Textarea
                id="edit-description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-descriptionEn">{locale === "zh" ? "英文描述" : "English Description"}</Label>
              <Textarea
                id="edit-descriptionEn"
                name="descriptionEn"
                value={formData.descriptionEn}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-imageUrl">{locale === "zh" ? "图片URL" : "Image URL"}</Label>
              <Input
                id="edit-imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-gameUrl">{locale === "zh" ? "游戏URL" : "Game URL"}</Label>
              <Input
                id="edit-gameUrl"
                name="gameUrl"
                value={formData.gameUrl}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-categoryId">{locale === "zh" ? "分类" : "Category"}</Label>
              <Select value={formData.categoryId} onValueChange={handleCategoryChange}>
                <SelectTrigger>
                  <SelectValue placeholder={locale === "zh" ? "选择分类" : "Select category"} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {locale === "zh" ? category.name : category.nameEn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-tags">{locale === "zh" ? "标签" : "Tags"}</Label>
              <Input
                id="edit-tags"
                name="tags"
                value={formData.tags.join(", ")}
                onChange={handleTagsChange}
                placeholder={locale === "zh" ? "用逗号分隔" : "Separate with commas"}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-published"
                checked={formData.published}
                onCheckedChange={handlePublishedChange}
              />
              <Label htmlFor="edit-published">{locale === "zh" ? "发布" : "Published"}</Label>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleEditGame}>
              {locale === "zh" ? "保存" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 