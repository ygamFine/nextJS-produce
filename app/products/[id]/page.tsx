import { redirect } from 'next/navigation'

export default function ProductDetailPage({ params }: any) {
  // 重定向到带有默认语言的路径
  redirect(`/zh/products/${params.id}`);
}

// 简化 generateStaticParams 函数
export function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' }
  ];
} 