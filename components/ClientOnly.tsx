'use client'
import { useState, useEffect, ReactNode } from 'react'

export function ClientOnly({ children, fallback = null }: { children: ReactNode, fallback?: ReactNode }) {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  if (!mounted) {
    return <>{fallback}</>
  }
  
  return <>{children}</>
} 