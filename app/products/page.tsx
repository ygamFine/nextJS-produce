import { fetchProducts } from '@/lib/api'
import { ProductsClientWrapper } from '@/components/ProductsClientWrapper'
import { redirect } from 'next/navigation'

// @ts-nocheck
export default function ProductsPage() {
  // 重定向到带有默认语言的路径
  redirect('/zh/products')
}

// 简化 generateStaticParams 函数
export function generateStaticParams() {
  return []
}

// 删除这个重复的默认导出
// export default async function Products() {
//   const products = await fetchProducts()
//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//       <h1 className="text-3xl font-bold mb-8">产品中心</h1>
//       <ProductsClientWrapper initialProducts={products} />
//     </div>
//   )
// } 