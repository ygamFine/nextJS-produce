'use client';
import { useState } from 'react';
import { ProductList } from './ProductList';
import { Search } from './Search';
import { ProductFilter } from './ProductFilter';

export function ProductsClientWrapper({ initialProducts }) {
  const [filteredProducts, setFilteredProducts] = useState(initialProducts);
  
  const handleSearch = (query) => {
    if (!query) {
      setFilteredProducts(initialProducts);
      return;
    }
    
    const filtered = initialProducts.filter(product => 
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProducts(filtered);
  };
  
  const handleFilter = (category) => {
    if (!category || category === 'all') {
      setFilteredProducts(initialProducts);
      return;
    }
    
    const filtered = initialProducts.filter(product => 
      product.category === category
    );
    setFilteredProducts(filtered);
  };
  
  return (
    <>
      <Search onSearch={handleSearch} />
      <ProductFilter onFilter={handleFilter} />
      <ProductList products={filteredProducts} />
    </>
  );
} 