export type Product = {
  id: number
  name: string
  description: string
  image: string
  category: string
}

export type News = {
  id: number
  title: string
  date: string
  summary: string
  content: string
}

export type Case = {
  id: number
  title: string
  description: string
  image: string
}

// 模拟数据，实际项目中可以从 CMS 或其他数据源获取
const products: Product[] = [
  {
    id: 1,
    name: '产品一',
    description: '产品描述...',
    image: '/images/product1.jpg',
    category: '类别1',
  },
  // ... 更多产品
]

const news: News[] = [
  {
    id: 1,
    title: '新闻标题',
    date: '2024-01-01',
    summary: '新闻摘要...',
    content: '新闻详细内容...',
  },
  // ... 更多新闻
]

const cases: Case[] = [
  {
    id: 1,
    title: '案例标题',
    description: '案例描述...',
    image: '/images/case1.jpg',
  },
  // ... 更多案例
]

export async function getProducts(): Promise<Product[]> {
  return products
}

export async function getProduct(id: string): Promise<Product | undefined> {
  return products.find(p => p.id.toString() === id)
}

export async function getNews(): Promise<News[]> {
  return news
}

export async function getNewsItem(id: string): Promise<News | undefined> {
  return news.find(n => n.id.toString() === id)
}

export async function getCases(): Promise<Case[]> {
  return cases
}

export async function getCase(id: string): Promise<Case | undefined> {
  return cases.find(c => c.id.toString() === id)
} 