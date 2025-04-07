// @ts-nocheck
import { redirect } from 'next/navigation';

export default function AboutPage() {
  // 重定向到带有默认语言的路径
  redirect('/zh/about');
}

// 简化 generateStaticParams 函数
export function generateStaticParams() {
  return [];
} 