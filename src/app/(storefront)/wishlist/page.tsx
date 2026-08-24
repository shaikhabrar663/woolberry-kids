'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useStore } from '../../../context/StoreContext';

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart } = useStore();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch('/api/products', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (e) {
        console.error('Failed to load products:', e);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  const favoriteProducts = products.filter((p) => wishlist.includes(p.id || p.slug));

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 antialiased text-[#2D221C]">
      {/* Header */}
      <div className="flex items-center gap-2 text-xs font-bold text-[#8C7B71] mb-6">
        <Link href="/" className="hover:text-[#E11D48]">Home</Link>
        <span>/</span>
        <span className="text-[#2D221C]">My Favorites</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-8">
        <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#2D221C]">
          Saved Outfits ({favoriteProducts.length})
        </h1>
        <p className="text-xs text-[#78675E]">Your favorite handcrafted pieces saved for later.</p>
      </div>

      {loading ? (
        <div className="p-16 text-center text-xs text-[#8C7B71]">Loading your favorites...</div>
      ) : favoriteProducts.length === 0 ? (
        <div className="bg-white p-12 sm:p-16 rounded-3xl border border-[#F4EBE1] text-center space-y-4 shadow-xs">
          <div className="w-14 h-14 rounded-full bg-rose-50 text-[#E11D48] flex items-center justify-center mx-auto">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <div>
            <h3 className="font-heading font-extrabold text-lg text-[#2D221C]">No favorites saved yet</h3>
            <p className="text-xs text-[#8C7B71] mt-1 max-w-sm mx-auto">
              Tap the heart icon on any sweater or cardigan in the shop to save it here.
            </p>
          </div>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-[#E11D48] hover:bg-[#BE123C] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-sm"
          >
            Browse Collection
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {favoriteProducts.map((p) => (
            <div
              key={p.id || p.slug}
              className="bg-white rounded-2xl border border-[#F4EBE1] overflow-hidden flex flex-col group hover:shadow-lg transition duration-200"
            >
              <div className="relative aspect-4/3 bg-[#FAF5EE] overflow-hidden">
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <button
                  onClick={() => toggleWishlist(p.id || p.slug)}
                  className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center transition hover:scale-110 cursor-pointer shadow-xs"
                  title="Remove from favorites"
                >
                  <svg className="w-4 h-4 text-[#E11D48]" fill="#E11D48" stroke="#E11D48" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-[9px] uppercase font-bold text-[#8C7B71] tracking-wider block">
                    {p.category}
                  </span>
                  <h3 className="font-heading font-bold text-xs text-[#2D221C] mt-0.5 line-clamp-1">
                    {p.name}
                  </h3>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-heading font-extrabold text-sm text-[#2D221C]">
                      Rs. {Number(p.price).toLocaleString('en-IN')}
                    </span>
                    {p.mrp && Number(p.mrp) > Number(p.price) && (
                      <span className="text-[10px] text-[#8C7B71] line-through">
                        Rs. {Number(p.mrp).toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => addToCart(p, '0-3M')}
                  className="w-full py-2.5 bg-[#2D221C] hover:bg-[#E11D48] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer shadow-xs text-center"
                >
                  Move to Bag
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
