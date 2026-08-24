'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export function ProductView({ product, slug }: { product: any; slug: string }) {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState(
    product?.sizes && product.sizes.length > 0 ? product.sizes[0] : '0-3M'
  );

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FFFDF9] flex items-center justify-center text-xs text-[#8C7B71]">
        Loading outfit details...
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(
      {
        id: product.id,
        slug: slug,
        name: product.name,
        price: product.price,
        image: product.image,
        size: selectedSize,
      },
      1
    );
  };

  return (
    <div className="bg-[#FFFDF9] min-h-screen text-[#2D221C] py-8 sm:py-12 antialiased">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <nav className="text-xs text-[#8C7B71] mb-8 flex items-center gap-2 font-medium">
          <Link href="/" className="hover:text-[#E11D48] transition">Home</Link>
          <span>/</span>
          <Link href="/collections/baby-sweaters" className="hover:text-[#E11D48] transition">
            {product.category || 'Handmade Knitwear'}
          </Link>
          <span>/</span>
          <span className="text-[#2D221C] font-semibold">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Product Image */}
          <div className="lg:col-span-6">
            <div className="bg-white p-3.5 rounded-3xl border-2 border-[#F4EBE1] shadow-xl">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#FAF5EE]">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-4 left-4 bg-[#E11D48] text-white text-xs font-black uppercase px-3 py-1 rounded-lg shadow-sm">
                  {product.tag || 'Handmade'}
                </span>
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-xs font-extrabold uppercase text-[#8C7B71] tracking-widest block">
                {product.category || 'Handmade Knitwear'}
              </span>
              <h1 className="font-heading text-3xl sm:text-4xl font-bold text-[#2D221C] mt-1 leading-tight">
                {product.name}
              </h1>
              
              {/* Star Rating with Pure Gold Vector SVGs */}
              <div className="flex items-center gap-2 mt-3">
                <div className="flex items-center text-amber-500 gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-4 h-4 fill-amber-400" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-xs font-bold text-[#2D221C]">{product.rating || '4.9'}</span>
                <span className="text-xs text-[#8C7B71]">({product.reviews || 114} verified parent reviews)</span>
              </div>
            </div>

            {/* Pricing */}
            <div className="flex items-baseline gap-3 p-4 bg-[#FAF5EE] rounded-2xl border border-[#EBE2D5]">
              <span className="font-heading text-2xl sm:text-3xl font-extrabold text-[#2D221C]">
                Rs. {Number(product.price).toLocaleString('en-IN')}
              </span>
              {product.mrp && product.mrp > product.price && (
                <span className="text-sm text-[#8C7B71] line-through">
                  Rs. {Number(product.mrp).toLocaleString('en-IN')}
                </span>
              )}
              <span className="text-xs font-bold text-[#E11D48] bg-rose-100 px-2.5 py-0.5 rounded-md">
                {product.discount || 'Save 25% OFF'}
              </span>
            </div>

            {/* Size Selector */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#2D221C]">Select Size (Age):</span>
                <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                  Diaper-Ease Guaranteed
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {(product.sizes || ["0-3M", "3-6M", "6-12M", "1-2Y"]).map((s: string) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSelectedSize(s)}
                    className={`py-3 rounded-xl text-xs font-bold border-2 transition cursor-pointer ${
                      selectedSize === s
                        ? 'border-[#E11D48] bg-rose-50 text-[#E11D48] shadow-xs'
                        : 'border-[#EBE2D5] bg-white text-[#5C4D44] hover:border-[#2D221C]'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleAddToCart}
                className="w-full bg-[#2D221C] text-white py-4 rounded-2xl text-xs uppercase font-extrabold tracking-widest hover:bg-[#E11D48] transition shadow-md transform hover:-translate-y-0.5 cursor-pointer"
              >
                Add to Cart - Rs. {Number(product.price).toLocaleString('en-IN')}
              </button>
            </div>

            {/* Feature Highlights with Vector Checkmarks */}
            <div className="border-t border-[#F4EBE1] pt-6 space-y-3">
              <h3 className="font-heading text-sm font-bold text-[#2D221C]">Why Parents Love This:</h3>
              <ul className="space-y-2 text-xs text-[#6B5A51]">
                {[
                  "Breathable cotton-wool blend",
                  "Zero scratchiness on direct skin",
                  "Pre-washed for softness",
                  "Handmade in India"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 flex-shrink-0">
                      <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-xs text-[#78675E] leading-relaxed pt-2">
              {product.description || "Bright floral sunflower crochet motifs handcrafted by master artisans with natural coconut shell buttons."}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}