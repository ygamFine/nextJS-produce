import { redirect } from 'next/navigation';

export default function NewsPage() {
  // 重定向到带有默认语言的路径
  redirect('/zh/news');
}

// 简化 generateStaticParams 函数
export function generateStaticParams() {
  return [];
} 