'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';

export default function StorefrontHomePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [activeAgeFilter, setActiveAgeFilter] = useState<string>('All');
  const { addToCart, toggleWishlist, isInWishlist } = useStore();

  const [babyAgeMonths, setBabyAgeMonths] = useState<number>(6);
  const [babyWeight, setBabyWeight] = useState<number>(7.5);

  const [bannerData, setBannerData] = useState({
    tag: 'Handcrafted With Love',
    headlineStart: 'Handmade crochet &',
    headlineHighlight: 'woollen winterwear.',
    description:
      '100% skin-safe, zero-scratch organic merino & cotton yarns designed for gentle baby comfort from newborn to 5 years.',
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&q=80',
  });

  const [showcaseCards, setShowcaseCards] = useState<any[]>([
    {
      badge: 'ULTRA SOFT',
      badgeBg: 'bg-[#EBF3FA] text-[#3B82F6] border-[#D6E6F7]',
      title: 'Newborn',
      subtitle: '0 to 3 Months',
      image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=500&q=80',
      filterCode: '0-3m',
    },
    {
      badge: 'COZY CRAWL',
      badgeBg: 'bg-[#FEF6E6] text-[#D97706] border-[#FDE68A]',
      title: 'Little Baby',
      subtitle: '3 to 6 Months',
      image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=500&q=80',
      filterCode: '3-6m',
    },
    {
      badge: 'ACTIVE PLAY',
      badgeBg: 'bg-[#EAF8F1] text-[#059669] border-[#A7F3D0]',
      title: 'Growing Baby',
      subtitle: '6 to 12 Months',
      image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=500&q=80',
      filterCode: '6-12m',
    },
    {
      badge: 'LITTLE STEPS',
      badgeBg: 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]',
      title: 'Tiny Toddler',
      subtitle: '1 to 2 Years',
      image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=500&q=80',
      filterCode: '1-2y',
    },
    {
      badge: 'ACCESSORIES',
      badgeBg: 'bg-[#F5F3FF] text-[#7C3AED] border-[#DDD6FE]',
      title: 'Explorer',
      subtitle: '1 to 3 Years',
      image: 'https://images.unsplash.com/photo-1543332164-6e82f355badc?w=500&q=80',
      filterCode: '2-5y',
    },
    {
      badge: 'OUTDOOR WARMTH',
      badgeBg: 'bg-[#FFF7ED] text-[#EA580C] border-[#FFEDD5]',
      title: 'Other Wearable',
      subtitle: '1 to 3 years',
      image: 'https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?w=500&q=80',
      filterCode: 'all',
    },
  ]);

  const ageBrackets = [
    { label: 'All Ages', code: 'All' },
    { label: '0 to 3 Months', code: '0-3M' },
    { label: '3 to 6 Months', code: '3-6M' },
    { label: '6 to 12 Months', code: '6-12M' },
    { label: '1 to 2 Years', code: '1-2Y' },
    { label: '2 to 5 Years', code: '2-5Y' },
  ];

  useEffect(() => {
    async function loadData() {
      try {
        const [bannerRes, prodRes, catRes] = await Promise.all([
          fetch('/api/banner', { cache: 'no-store' }),
          fetch('/api/products', { cache: 'no-store' }),
          fetch('/api/categories', { cache: 'no-store' }),
        ]);

        if (bannerRes.ok) {
          const bData = await bannerRes.json();
          if (bData?.image) setBannerData(bData);
        }

        if (prodRes.ok) {
          setProducts(await prodRes.json());
        }

        if (catRes.ok) {
          const cardsData = await catRes.json();
          if (Array.isArray(cardsData) && cardsData.length > 0) {
            setShowcaseCards(cardsData);
          }
        }
      } catch (e) {
        console.error('Failed to load dynamic cards:', e);
      }
    }
    loadData();
  }, []);

  const filteredProducts = (
    activeAgeFilter === 'All'
      ? products
      : products.filter(
          (p) => !p.ageBracket || p.ageBracket === activeAgeFilter || p.size === activeAgeFilter
        )
  ).slice(0, 8);

  const getRecommendedSize = () => {
    if (babyAgeMonths <= 3 || babyWeight <= 5.5) return '0-3 Months (Newborn)';
    if (babyAgeMonths <= 6 || babyWeight <= 7.5) return '3-6 Months (Little Baby)';
    if (babyAgeMonths <= 12 || babyWeight <= 10.0) return '6-12 Months (Growing Baby)';
    if (babyAgeMonths <= 24 || babyWeight <= 12.5) return '1-2 Years (Tiny Toddler)';
    return '2-5 Years (Explorer)';
  };

  return (
    <div className="space-y-16 pt-6 pb-20 antialiased">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-linear-to-br from-[#FFF5ED] via-[#FFFDF9] to-[#FAF0E6] rounded-3xl p-8 sm:p-12 border border-[#F4EBE1] grid grid-cols-1 md:grid-cols-2 gap-8 items-center shadow-xs">
          <div className="space-y-4">
            <span className="text-[10px] uppercase font-black tracking-widest text-[#E11D48] bg-rose-50 px-3 py-1 rounded-full border border-rose-100 inline-block">
              {bannerData.tag || 'Handcrafted With Love'}
            </span>
            <h1 className="font-heading text-3xl sm:text-5xl font-extrabold text-[#2D221C] leading-tight">
              {bannerData.headlineStart || 'Handmade crochet &'}{' '}
              <span className="text-[#E11D48]">
                {bannerData.headlineHighlight || 'woollen winterwear.'}
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-[#78675E] leading-relaxed max-w-md">
              {bannerData.description}
            </p>
            <div className="flex items-center gap-3 pt-2">
              <Link
                href="/collections/all"
                className="px-6 py-3.5 bg-[#2D221C] hover:bg-[#E11D48] text-white rounded-xl text-xs font-extrabold uppercase tracking-wider transition shadow-md cursor-pointer"
              >
                Shop Full Catalog
              </Link>
              <Link
                href="/collections/gift-sets"
                className="px-6 py-3.5 bg-white hover:bg-[#FAF5EE] text-[#2D221C] border border-[#EBE2D5] rounded-xl text-xs font-bold uppercase tracking-wider transition"
              >
                Gift Hampers
              </Link>
            </div>
          </div>

          <Link
            href="/collections/all"
            className="relative aspect-4/3 rounded-2xl overflow-hidden bg-[#FAF5EE] border border-[#F4EBE1] shadow-md group block"
          >
            <img
              src={bannerData.image}
              alt="Handcrafted Baby Winterwear"
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />
          </Link>
        </div>
      </section>

      {/* Dynamic 6-Card "Shop by Age" Showcase Linking to Filtered Collections */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="text-center space-y-1">
          <span className="text-[10px] uppercase font-black tracking-widest text-[#E11D48]">
            NO GUESSWORK SIZING
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#2D221C]">
            Shop by your little one's age
          </h2>
          <p className="text-xs text-[#8C7B71]">
            Handcrafted with exact measurements for comfortable layering.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 w-full">
          {showcaseCards.map((c, idx) => {
            const collectionTarget = c.filterCode ? c.filterCode.toLowerCase() : 'all';

            return (
              <Link
                key={idx}
                href={`/collections/${collectionTarget}`}
                className="bg-white rounded-2xl border border-[#F4EBE1] shadow-xs overflow-hidden flex flex-col items-center text-center p-2.5 group hover:shadow-md transition cursor-pointer"
              >
                <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-[#FAF5EE] mb-3">
                  <img
                    src={c.image}
                    alt={c.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <span
                    className={`absolute top-1.5 left-1.5 text-[8px] font-black tracking-wider uppercase px-2 py-0.5 rounded shadow-2xs border ${
                      c.badgeBg || 'bg-[#EBF3FA] text-[#3B82F6] border-[#D6E6F7]'
                    }`}
                  >
                    {c.badge || 'ULTRA SOFT'}
                  </span>
                </div>

                <div className="space-y-1 w-full flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-heading font-extrabold text-xs text-[#2D221C]">
                      {c.title}
                    </h3>
                    <p className="text-[10px] text-[#8C7B71] font-medium">
                      {c.subtitle}
                    </p>
                  </div>

                  <span className="text-[10px] font-bold text-[#E11D48] group-hover:underline pt-2 block">
                    Browse &rarr;
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Curated Bestsellers Grid */}
      <section id="catalog" className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="text-center space-y-1">
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#2D221C]">
            Bestsellers
          </h2>
          <p className="text-xs text-[#8C7B71]">Our most loved handcrafted pieces for the season</p>
        </div>

        <div className="flex items-center justify-center flex-wrap gap-2 pt-1 pb-2">
          {ageBrackets.map((tier) => (
            <button
              key={tier.code}
              onClick={() => setActiveAgeFilter(tier.code)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition cursor-pointer ${
                activeAgeFilter === tier.code
                  ? 'bg-[#E11D48] text-white shadow-xs'
                  : 'bg-white border border-[#EBE2D5] text-[#5C4D44] hover:border-[#E11D48] hover:text-[#E11D48]'
              }`}
            >
              {tier.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {filteredProducts.map((p) => {
            const liked = isInWishlist(p.id || p.slug);
            const productSlug =
              p.slug || p.id || encodeURIComponent((p.name || '').toLowerCase().replace(/\s+/g, '-'));

            return (
              <div
                key={p.id || p.slug}
                className="bg-white rounded-2xl border border-[#F4EBE1] overflow-hidden flex flex-col h-full group hover:shadow-lg transition duration-200 relative"
              >
                <div className="relative w-full h-64 bg-[#FAF5EE] overflow-hidden shrink-0">
                  <Link href={`/products/${productSlug}`} className="block w-full h-full">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-300"
                    />
                  </Link>

                  <span className="absolute top-2.5 left-2.5 bg-[#E11D48] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded shadow-xs z-10 pointer-events-none">
                    {p.tag || 'Bestseller'}
                  </span>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
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

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
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

                  <div className="pt-4 mt-auto">
                    <button
                      onClick={() => addToCart(p, '0-3M')}
                      className="w-full py-2.5 bg-[#2D221C] hover:bg-[#E11D48] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer shadow-xs text-center block"
                    >
                      Add to Bag
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Explore Full Catalog Link */}
        <div className="text-center pt-4">
          <Link
            href="/collections/all"
            className="inline-block px-8 py-3.5 bg-white hover:bg-[#FAF5EE] text-[#2D221C] border border-[#EBE2D5] rounded-2xl text-xs font-black uppercase tracking-wider transition shadow-xs"
          >
            Explore Full Catalog &rarr;
          </Link>
        </div>
      </section>

      {/* Sizing Tool */}
      <section className="max-w-xl mx-auto px-4 sm:px-6 mb-12">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F4EBE1] shadow-xl text-center space-y-6">
          <div>
            <h3 className="font-heading text-xl font-extrabold text-[#2D221C]">
              Smart Sizing Calculator
            </h3>
            <p className="text-xs text-[#78675E] mt-1">
              Slide to your baby's age and weight for a guaranteed cozy fit over base thermals.
            </p>
          </div>

          <div className="space-y-4 text-left">
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span>Age of Baby:</span>
                <span className="text-[#E11D48]">{babyAgeMonths} Months</span>
              </div>
              <input
                type="range"
                min="0"
                max="36"
                step="1"
                value={babyAgeMonths}
                onChange={(e) => setBabyAgeMonths(Number(e.target.value))}
                className="w-full accent-[#E11D48] cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span>Baby Weight:</span>
                <span className="text-[#E11D48]">{babyWeight} kg</span>
              </div>
              <input
                type="range"
                min="2.5"
                max="16.0"
                step="0.5"
                value={babyWeight}
                onChange={(e) => setBabyWeight(Number(e.target.value))}
                className="w-full accent-[#E11D48] cursor-pointer"
              />
            </div>
          </div>

          <div className="bg-[#FAF5EE] p-4 rounded-2xl border border-[#EBE2D5]">
            <span className="text-[10px] uppercase font-bold text-[#8C7B71] tracking-wider block">
              Perfect Recommended Fit
            </span>
            <h4 className="font-heading text-base font-extrabold text-[#2D221C] mt-0.5">
              {getRecommendedSize()}
            </h4>
            <Link
              href="/collections/all"
              className="mt-3 inline-block px-5 py-2 bg-[#E11D48] hover:bg-[#BE123C] text-white text-xs font-bold rounded-xl transition"
            >
              Shop {getRecommendedSize().split(' ')[0]} Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}