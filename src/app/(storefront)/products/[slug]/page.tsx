'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useStore } from '@/context/StoreContext';

export default function ProductDetailPage() {
  const params = useParams();
  const rawSlug = (params?.slug as string) || '';
  const { addToCart, toggleWishlist, isInWishlist } = useStore();

  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [selectedSize, setSelectedSize] = useState<string>('0-3M');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [addedAnimation, setAddedAnimation] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      try {
        const res = await fetch('/api/products', { cache: 'no-store' });
        if (res.ok) {
          const products = await res.json();
          const target = products.find(
            (p: any) =>
              p.slug === rawSlug ||
              p.id === rawSlug ||
              (p.name && p.name.toLowerCase().replace(/\s+/g, '-') === rawSlug.toLowerCase())
          );
          if (target) {
            setProduct(target);
            if (target.sizes && target.sizes.length > 0) setSelectedSize(target.sizes[0]);
            if (target.colors && target.colors.length > 0) setSelectedColor(target.colors[0].name);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [rawSlug]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center text-xs text-[#8C7B71]">
        Loading handcrafted details...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-heading text-2xl font-extrabold text-[#2D221C]">Outfit Not Found</h2>
        <p className="text-xs text-[#8C7B71]">The piece you are looking for might have moved or sold out.</p>
        <Link
          href="/collections/all"
          className="inline-block px-6 py-3 bg-[#2D221C] hover:bg-[#E11D48] text-white text-xs font-bold rounded-xl transition"
        >
          Browse All Knitwear
        </Link>
      </div>
    );
  }

  const gallery =
    product.images && Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : [product.image];

  const colors = product.colors && Array.isArray(product.colors) ? product.colors : [];
  const sizes = product.sizes && Array.isArray(product.sizes) ? product.sizes : ['0-3M', '3-6M', '6-12M', '1-2Y'];
  const liked = isInWishlist(product.id || product.slug);

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, 1);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 antialiased text-[#2D221C]">
      {/* Breadcrumb Navigation */}
      <nav className="text-xs text-[#8C7B71] flex items-center gap-2 mb-8">
        <Link href="/" className="hover:underline">Home</Link>
        <span>/</span>
        <Link href="/collections/all" className="hover:underline">Catalog</Link>
        <span>/</span>
        <span className="font-bold text-[#2D221C] truncate">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14">
        {/* Left: Multi-Angle Photo Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-white border border-[#F4EBE1] shadow-xs">
            <img
              src={gallery[selectedImageIndex] || product.image}
              alt={product.name}
              className="w-full h-full object-cover object-center transition duration-300"
            />

            {product.tag && (
              <span className="absolute top-4 left-4 bg-[#E11D48] text-white text-[10px] font-black uppercase px-3 py-1 rounded shadow-xs">
                {product.tag}
              </span>
            )}

            <button
              onClick={() => toggleWishlist(product.id || product.slug)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/95 backdrop-blur-xs flex items-center justify-center hover:scale-110 transition shadow-md cursor-pointer"
            >
              <svg
                className="w-5 h-5"
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

          {/* Clickable Multi-Angle Thumbnail Row */}
          {gallery.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {gallery.map((imgUrl: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition shrink-0 cursor-pointer ${
                    selectedImageIndex === idx
                      ? 'border-[#E11D48] shadow-md scale-95'
                      : 'border-[#F4EBE1] hover:border-gray-400'
                  }`}
                >
                  <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details, Color Swatches & Bag Actions */}
        <div className="space-y-6 flex flex-col justify-center">
          <div>
            <span className="text-[10px] uppercase font-black tracking-widest text-[#E11D48] bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-100 inline-block mb-2">
              {product.category}
            </span>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#2D221C] leading-tight">
              {product.name}
            </h1>

            {/* Price & Discounts */}
            <div className="flex items-baseline gap-3 mt-3">
              <span className="font-heading font-extrabold text-2xl text-[#2D221C]">
                Rs. {Number(product.price).toLocaleString('en-IN')}
              </span>
              {product.mrp && Number(product.mrp) > Number(product.price) && (
                <span className="text-sm text-[#8C7B71] line-through">
                  Rs. {Number(product.mrp).toLocaleString('en-IN')}
                </span>
              )}
              {product.discount && (
                <span className="text-xs font-bold text-[#E11D48] bg-rose-50 px-2 py-0.5 rounded border border-rose-100">
                  {product.discount}
                </span>
              )}
            </div>
          </div>

          {/* Color Swatches */}
          {colors.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-[#F4EBE1]">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-[#5C4D44]">Select Color Shade:</span>
                <span className="text-[#E11D48]">{selectedColor}</span>
              </div>
              <div className="flex items-center gap-3">
                {colors.map((c: any, i: number) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedColor(c.name)}
                    className={`group relative p-1 rounded-full border-2 transition cursor-pointer ${
                      selectedColor === c.name ? 'border-[#E11D48] shadow-xs' : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <span
                      style={{ backgroundColor: c.hex }}
                      className="block w-7 h-7 rounded-full border border-black/15 shadow-inner"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selector */}
          <div className="space-y-2 pt-2 border-t border-[#F4EBE1]">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-[#5C4D44]">Select Size:</span>
              <Link href="/size-guide" className="text-[#E11D48] hover:underline text-[11px]">
                Size Guide &rarr;
              </Link>
            </div>
            <div className="flex flex-wrap gap-2">
              {sizes.map((sz: string) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(sz)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    selectedSize === sz
                      ? 'bg-[#2D221C] text-white shadow-xs'
                      : 'bg-[#FAF5EE] text-[#5C4D44] hover:bg-[#F4EBE1]'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Add to Bag Button */}
          <div className="pt-4 space-y-3">
            <button
              onClick={handleAddToCart}
              className={`w-full py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition cursor-pointer shadow-md ${
                addedAnimation
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#2D221C] hover:bg-[#E11D48] text-white'
              }`}
            >
              {addedAnimation ? '✓ Added to Bag' : 'Add to Bag'}
            </button>
            <p className="text-[11px] text-center text-[#8C7B71]">
              🌿 100% Skin-safe merino wool • Handcrafted in India • Free exchanges
            </p>
          </div>

          {/* Description & Knit Info */}
          <div className="pt-4 border-t border-[#F4EBE1] space-y-2 text-xs text-[#78675E] leading-relaxed">
            <h4 className="font-bold text-[#2D221C] uppercase tracking-wider text-[11px]">
              Craftsmanship & Care
            </h4>
            <p>{product.description}</p>
          </div>
        </div>
      </div>
    </main>
  );
}