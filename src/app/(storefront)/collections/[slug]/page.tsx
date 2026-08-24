'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useStore } from '@/context/StoreContext';

export default function CollectionCatalogPage() {
  const params = useParams();
  const initialSlug = (params?.slug as string) || 'all';
  const { addToCart, toggleWishlist, isInWishlist } = useStore();

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedAge, setSelectedAge] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('default');

  useEffect(() => {
    // Synchronize starting filter from URL slug
    const slug = initialSlug.toLowerCase();
    if (['0-3m', '3-6m', '6-12m', '1-2y', '2-5y'].includes(slug)) {
      setSelectedAge(slug);
    } else if (['sweaters', 'cardigans', 'gift-sets'].includes(slug)) {
      setSelectedCategory(slug);
    } else {
      setSelectedCategory('all');
      setSelectedAge('all');
    }

    async function loadProducts() {
      try {
        const res = await fetch('/api/products', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setProducts(Array.isArray(data) ? data : []);
        }
      } catch (e) {
        console.error('Failed to load products:', e);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [initialSlug]);

  // Comprehensive Filtering Logic
  const filteredProducts = products.filter((p) => {
    const pCat = (p.category || '').toLowerCase();
    const pAge = (p.ageBracket || p.size || '').toLowerCase();
    const pName = (p.name || '').toLowerCase();
    const pTag = (p.tag || '').toLowerCase();

    // Category Filter
    if (selectedCategory !== 'all') {
      if (selectedCategory === 'sweaters' && !pCat.includes('sweater') && !pCat.includes('dress')) return false;
      if (selectedCategory === 'cardigans' && !pCat.includes('cardigan')) return false;
      if (selectedCategory === 'gift-sets' && !pCat.includes('gift') && !pTag.includes('gift')) return false;
    }

    // Age Bracket Filter
    if (selectedAge !== 'all') {
      if (!pAge.includes(selectedAge) && !pCat.includes(selectedAge)) {
        // Fallback checks for age matches
        if (selectedAge === '0-3m' && !pAge.includes('0-3') && !pAge.includes('newborn')) return false;
        if (selectedAge === '3-6m' && !pAge.includes('3-6')) return false;
        if (selectedAge === '6-12m' && !pAge.includes('6-12')) return false;
        if (selectedAge === '1-2y' && !pAge.includes('1-2') && !pAge.includes('toddler')) return false;
        if (selectedAge === '2-5y' && !pAge.includes('2-5') && !pAge.includes('2-3') && !pAge.includes('3-5')) return false;
      }
    }

    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return pName.includes(q) || pCat.includes(q) || pTag.includes(q);
    }

    return true;
  });

  // Sort Filtered Products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return Number(a.price) - Number(b.price);
    if (sortBy === 'price-high') return Number(b.price) - Number(a.price);
    if (sortBy === 'rating') return Number(b.rating || 4.9) - Number(a.rating || 4.9);
    return 0;
  });

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 antialiased text-[#2D221C]">
      {/* Top Banner */}
      <div className="text-center space-y-2 mb-8">
        <span className="text-[10px] uppercase font-black tracking-widest text-[#E11D48] bg-rose-50 px-3 py-1 rounded-full border border-rose-100 inline-block">
          HANDCRAFTED BABYWEAR
        </span>
        <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#2D221C]">
          Woolberry Complete Catalog
        </h1>
        <p className="text-xs text-[#8C7B71]">
          Explore zero-scratch merino wool & organic cotton knitwear crafted for little ones.
        </p>
      </div>

      {/* Filter Control Bar */}
      <div className="bg-white rounded-2xl border border-[#F4EBE1] p-4 mb-8 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Category Chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-bold text-[#8C7B71] mr-1">Category:</span>
            {[
              { id: 'all', label: 'All Items' },
              { id: 'sweaters', label: 'Sweaters & Dresses' },
              { id: 'cardigans', label: 'Cardigans' },
              { id: 'gift-sets', label: 'Gift Sets' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#2D221C] text-white shadow-xs'
                    : 'bg-[#FAF5EE] text-[#5C4D44] hover:bg-[#F4EBE1]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#8C7B71]">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#FAF5EE] border border-[#EBE2D5] text-xs font-bold rounded-xl px-3 py-1.5 focus:outline-[#E11D48] cursor-pointer"
            >
              <option value="default">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {/* Age Bracket Chips & Live Search */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-[#F4EBE1]">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-bold text-[#8C7B71] mr-1">Age:</span>
            {[
              { id: 'all', label: 'All Ages' },
              { id: '0-3m', label: '0-3M' },
              { id: '3-6m', label: '3-6M' },
              { id: '6-12m', label: '6-12M' },
              { id: '1-2y', label: '1-2Y' },
              { id: '2-5y', label: '2-5Y' },
            ].map((age) => (
              <button
                key={age.id}
                onClick={() => setSelectedAge(age.id)}
                className={`px-3 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                  selectedAge === age.id
                    ? 'bg-[#E11D48] text-white'
                    : 'bg-[#FAF5EE] text-[#5C4D44] hover:bg-[#F4EBE1]'
                }`}
              >
                {age.label}
              </button>
            ))}
          </div>

          <div className="w-full sm:w-64">
            <input
              type="text"
              placeholder="Search by outfit name, style..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#FAF5EE] border border-[#EBE2D5] rounded-xl px-3 py-1.5 text-xs focus:outline-[#E11D48]"
            />
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex justify-between items-center mb-6 text-xs text-[#8C7B71] font-bold">
        <span>Showing {sortedProducts.length} handcrafted outfits</span>
        {(selectedCategory !== 'all' || selectedAge !== 'all' || searchQuery) && (
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedAge('all');
              setSearchQuery('');
            }}
            className="text-[#E11D48] hover:underline cursor-pointer"
          >
            Clear All Filters ✕
          </button>
        )}
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="p-20 text-center text-xs text-[#8C7B71]">Loading outfits...</div>
      ) : sortedProducts.length === 0 ? (
        <div className="p-16 text-center space-y-4 bg-white rounded-3xl border border-[#F4EBE1]">
          <p className="text-xs text-[#8C7B71]">No outfits match your chosen filter criteria.</p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedAge('all');
              setSearchQuery('');
            }}
            className="px-6 py-2.5 bg-[#2D221C] hover:bg-[#E11D48] text-white text-xs font-bold rounded-xl transition cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {sortedProducts.map((p) => {
            const liked = isInWishlist(p.id || p.slug);
            const productSlug =
              p.slug || p.id || encodeURIComponent((p.name || '').toLowerCase().replace(/\s+/g, '-'));

            return (
              <div
                key={p.id || p.slug}
                className="bg-white rounded-2xl border border-[#F4EBE1] overflow-hidden flex flex-col justify-between group hover:shadow-lg transition duration-200 relative"
              >
                <div>
                  <div className="relative w-full h-64 bg-[#FAF5EE] overflow-hidden">
                    <Link href={`/products/${productSlug}`} className="block w-full h-full">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-300"
                      />
                    </Link>

                    {p.tag && (
                      <span className="absolute top-2.5 left-2.5 bg-[#E11D48] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded shadow-xs z-10 pointer-events-none">
                        {p.tag}
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        toggleWishlist(p.id || p.slug);
                      }}
                      className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/95 backdrop-blur-xs flex items-center justify-center transition hover:scale-110 cursor-pointer shadow-sm z-20"
                      title="Add to Wishlist"
                    >
                      <svg
                        className="w-4 h-4"
                        fill={liked ? '#E11D48' : 'none'}
                        stroke={liked ? '#E11D48' : '#2D221C'}
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="p-4">
                    <span className="text-[9px] uppercase font-bold text-[#8C7B71] tracking-wider block">
                      {p.category}
                    </span>
                    <Link
                      href={`/products/${productSlug}`}
                      className="font-heading font-bold text-xs text-[#2D221C] mt-1 line-clamp-2 min-h-[32px] hover:text-[#E11D48] transition block"
                    >
                      {p.name}
                    </Link>
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="font-heading font-extrabold text-sm text-[#2D221C]">
                        Rs. {Number(p.price).toLocaleString('en-IN')}
                      </span>
                      {p.mrp && Number(p.mrp) > Number(p.price) && (
                        <span className="text-[10px] text-[#8C7B71] line-through">
                          Rs. {Number(p.mrp).toLocaleString('en-IN')}
                        </span>
                      )}
                      {p.discount && (
                        <span className="text-[9px] font-bold text-[#E11D48]">{p.discount}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <button
                    onClick={() => addToCart(p, '0-3M')}
                    className="w-full py-2.5 bg-[#2D221C] hover:bg-[#E11D48] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer shadow-xs text-center block"
                  >
                    Add to Bag
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}