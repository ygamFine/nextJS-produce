'use client';

import Link from 'next/link';
import Image from 'next/image';

interface RelatedProductsProps {
  products: any[];
  locale: string;
}

export function RelatedProducts({ products, locale }: RelatedProductsProps) {
  if (!products || products.length === 0) {
    return null;
  }
  
  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">
        {locale === 'en' ? 'Related Products' : '相关产品'}
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map(product => (
          <Link 
            key={product.id} 
            href={`/${locale}/products/${product.id}`}
            className="group"
          >
            <div className="bg-gray-100 rounded-lg overflow-hidden aspect-square mb-3">
              <Image 
                src={product.image || '/placeholder.jpg'}
                alt={product.title || product.name}
                width={300}
                height={300}
                className="object-cover w-full h-full group-hover:scale-105 transition-transform"
              />
            </div>
            <h3 className="font-medium text-gray-900 group-hover:text-indigo-600">
              {product.title || product.name}
            </h3>
          </Link>
        ))}
      </div>
    </div>
  );
} 