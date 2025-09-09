'use client'
import ProductCard from '@/components/ProductCard';
import ColourfulText from '@/components/ui/colourful-text';
import React, { useEffect, useState } from 'react';

function BestSeller() {
  const [products, setProducts] = useState([]); // ✅ state to hold products

  const fetchProducts = async () => {
    const res = await fetch("https://dummyjson.com/products?limit=0");
    const data = await res.json();
    const sortedProducts = data.products.sort((a, b) => b.rating - a.rating);
    const top30 = sortedProducts.slice(0, 30);
    setProducts(top30); 
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
   <div className="w-[95%] mx-auto my-8 rounded-3xl bg-gray-800 p-4">
  {/* Section Heading */}
  <h2 className="md:text-6xl text-4xl font-bold text-white mb-6 text-center">
    <ColourfulText text="⭐ Best Sellers"></ColourfulText>
  </h2>

  {/* Products Grid */}
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
    {products.map((product) => (
      <div
        key={product.id}>
        <ProductCard product={product} />
      </div>
    ))}
  </div>
</div>

  );
}

export default BestSeller;
