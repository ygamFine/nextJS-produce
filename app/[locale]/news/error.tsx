'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function NewsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('News error:', error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-4 text-red-600">
          出错了
        </h1>
        <p className="mb-6">
          加载新闻时出现问题
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={reset}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            重试
          </button>
          <Link 
            href="/zh/news"
            className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50 transition"
          >
            返回新闻列表
          </Link>
        </div>
      </div>
    </div>
  );
} 