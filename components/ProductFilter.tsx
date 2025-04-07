'use client'
import { useState } from 'react'

type Category = '全部' | '类别1' | '类别2' | '类别3'

export function ProductFilter({ onFilter }: { onFilter: (category: Category) => void }) {
  const [activeCategory, setActiveCategory] = useState<Category>('全部')

  const categories: Category[] = ['全部', '类别1', '类别2', '类别3']

  const handleFilter = (category: Category) => {
    setActiveCategory(category)
    onFilter(category)
  }

  return (
    <div className="flex flex-wrap gap-4 mb-8">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => handleFilter(category)}
          className={`px-4 py-2 rounded-full transition ${
            activeCategory === category
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  )
} 