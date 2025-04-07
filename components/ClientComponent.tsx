'use client'
import { useState, useEffect } from 'react'

export function ClientComponent() {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  if (!mounted) {
    return <div className="h-[component-height] bg-gray-100"></div> // 占位符
  }
  
  // 实际组件内容
  return (
    <div>
      {/* 组件内容 */}
    </div>
  )
} 