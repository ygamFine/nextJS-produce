import Link from 'next/link'
import type { Product } from '@/lib/data'

export function ProductList({ products = [] }: { products?: Product[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <Link key={product.id} href={`/products/${product.id}`}>
          <div className="border rounded-lg overflow-hidden hover:shadow-lg transition">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="mt-2 text-gray-600">{product.description}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
} 