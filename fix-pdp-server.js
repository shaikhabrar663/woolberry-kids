const fs = require("fs");
const path = require("path");

const baseDir = process.cwd();
const pdpDir = path.join(baseDir, "src", "app", "(storefront)", "products", "[slug]");
const compDir = path.join(baseDir, "src", "components", "storefront");

if (!fs.existsSync(pdpDir)) fs.mkdirSync(pdpDir, { recursive: true });
if (!fs.existsSync(compDir)) fs.mkdirSync(compDir, { recursive: true });

// 1. Create ProductView.tsx (Client component for state, size selector, and cart)
const productViewCode = `'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export function ProductView({ product, slug }: { product: any; slug: string }) {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState(product.sizes ? product.sizes[0] : '0-3M');

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      slug: slug,
      name: product.name,
      price: product.price,
      image: product.image,
      size: selectedSize
    }, 1);
  };

  return (
    <div className="bg-[#FFFDF9] min-h-screen text-[#2D221C] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="text-xs text-[#8C7B71] mb-8 flex items-center gap-2">
          <Link href="/" className="hover:text-[#E11D48] transition">Home</Link>
          <span>/</span>
          <Link href="/collections/baby-sweaters" className="hover:text-[#E11D48] transition">{product.category}</Link>
          <span>/</span>
          <span className="text-[#2D221C] font-semibold">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-6">
            <div className="bg-white p-3.5 rounded-3xl border-2 border-[#F4EBE1] shadow-xl">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#FAF5EE]">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-4 left-4 bg-[#E11D48] text-white text-xs font-black uppercase px-3 py-1 rounded-lg shadow-sm">
                  {product.tag}
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-xs font-extrabold uppercase text-[#8C7B71] tracking-widest">{product.category}</span>
              <h1 className="font-heading text-3xl sm:text-4xl font-bold text-[#2D221C] mt-1">{product.name}</h1>
              
              <div className="flex items-center gap-2 mt-3">
                <span className="text-amber-500 text-sm">?????</span>
                <span className="text-xs font-bold text-[#2D221C]">{product.rating}</span>
                <span className="text-xs text-[#8C7B71]">({product.reviews} verified parent reviews)</span>
              </div>
            </div>

            <div className="flex items-baseline gap-3 p-4 bg-[#FAF5EE] rounded-2xl border border-[#EBE2D5]">
              <span className="font-heading text-2xl sm:text-3xl font-extrabold text-[#2D221C]">
                Rs. {product.price.toLocaleString('en-IN')}
              </span>
              <span className="text-sm text-[#8C7B71] line-through">
                Rs. {product.mrp.toLocaleString('en-IN')}
              </span>
              <span className="text-xs font-bold text-[#E11D48] bg-rose-100 px-2.5 py-0.5 rounded-md">
                Save {product.discount}
              </span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#2D221C]">Select Size (Age):</span>
                <span className="text-xs text-emerald-700 font-bold">? Diaper-Ease Guaranteed</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {product.sizes && product.sizes.map((s: string) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSelectedSize(s)}
                    className={\`py-3 rounded-xl text-xs font-bold border-2 transition cursor-pointer \${
                      selectedSize === s
                        ? 'border-[#E11D48] bg-rose-50 text-[#E11D48] shadow-xs'
                        : 'border-[#EBE2D5] bg-white text-[#5C4D44] hover:border-[#2D221C]'
                    }\`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleAddToCart}
                className="w-full bg-[#2D221C] text-white py-4 rounded-2xl text-xs uppercase font-extrabold tracking-widest hover:bg-[#E11D48] transition shadow-md transform hover:-translate-y-0.5 cursor-pointer"
              >
                Add to Cart • Rs. {product.price.toLocaleString('en-IN')}
              </button>
            </div>

            <div className="border-t border-[#F4EBE1] pt-6 space-y-3">
              <h3 className="font-heading text-sm font-bold text-[#2D221C]">Why Parents Love This:</h3>
              <ul className="space-y-1.5 text-xs text-[#6B5A51]">
                {product.highlights && product.highlights.map((h: string, i: number) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">?</span> {h}
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-xs text-[#78675E] leading-relaxed pt-2">
              {product.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
`;

fs.writeFileSync(path.join(compDir, "ProductView.tsx"), productViewCode, "utf8");

// 2. Create Server Component Page (App Router compliant with async params)
const pdpPageCode = `import { ProductView } from "@/components/storefront/ProductView";

const productsData: Record<string, any> = {
  "handmade-red-bow-dungaree-dress": {
    id: "1",
    name: "Handmade Red Bow Dungaree Knit Dress",
    category: "Handmade Knit Dress",
    price: 1199,
    mrp: 1499,
    discount: "20% OFF",
    rating: "4.9",
    reviews: 168,
    sizes: ["0-3M", "3-6M", "6-12M", "1-2Y"],
    image: "/images/products/red-bow-dress.jpg",
    tag: "Bestseller",
    description: "Hand-crocheted with itch-free baby yarn, this heirloom dungaree dress features a signature pearl-accented bow and roomy diaper ease. Perfect for festive celebrations and winter outings.",
    highlights: ["100% Skin-Kind Organic Yarn", "Comfort ease for diaper layers", "Wooden adjustment buttons", "Gentle hand-wash safe"]
  },
  "sunflower-crochet-cardigan": {
    id: "2",
    name: "Sunflower Crochet Yellow & White Cardigan",
    category: "Crochet Cardigans",
    price: 1499,
    mrp: 1999,
    discount: "25% OFF",
    rating: "4.9",
    reviews: 114,
    sizes: ["6-12M", "1-2Y", "2-3Y", "3-5Y"],
    image: "/images/products/sunflower-cardigan.jpg",
    tag: "Most Loved",
    description: "Bright floral sunflower crochet motifs handcrafted by master artisans with natural coconut shell buttons.",
    highlights: ["Breathable cotton-wool blend", "Zero scratchiness on direct skin", "Pre-washed for softness", "Handmade in India"]
  },
  "merino-heirloom-romper-set": {
    id: "3",
    name: "Merino Heirloom Cable Romper & Cap Set",
    category: "Woollen Sets",
    price: 1899,
    mrp: 2499,
    discount: "24% OFF",
    rating: "5.0",
    reviews: 92,
    sizes: ["0-3M", "3-6M", "6-12M"],
    image: "/images/products/merino-romper-set.jpg",
    tag: "New Arrival",
    description: "Complete 2-piece winter set containing a thermal cable knit romper and matching bonnet cap made from pure merino wool.",
    highlights: ["Pure thermal merino insulation", "Matching cozy ear-warmer cap", "Bottom snap closures for easy diaper changes", "Gift hamper ready"]
  },
  "pointelle-vintage-sweater": {
    id: "4",
    name: "Pointelle Vintage Coconut Button Sweater",
    category: "Knitted Sweaters",
    price: 1299,
    mrp: 1799,
    discount: "28% OFF",
    rating: "4.8",
    reviews: 84,
    sizes: ["3-6M", "6-12M", "1-2Y", "2-3Y"],
    image: "/images/products/vintage-sweater.jpg",
    tag: "Trending",
    description: "Classic European pointelle knit pattern with breathable micro-air pockets that keep babies warm without overheating.",
    highlights: ["Micro-air pocket insulation", "Pre-shrunk organic cotton wool", "Soft ribbed neck and cuffs", "Machine gentle cycle safe"]
  }
};

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = productsData[slug] || {
    id: "1",
    name: slug ? slug.replace(/-/g, " ").toUpperCase() : "Handcrafted Baby Knitwear",
    category: "Handmade Knitwear",
    price: 1199,
    mrp: 1499,
    discount: "20% OFF",
    rating: "4.9",
    reviews: 168,
    sizes: ["0-3M", "3-6M", "6-12M", "1-2Y"],
    image: "/images/products/red-bow-dress.jpg",
    tag: "Bestseller",
    description: "Handcrafted with skin-safe, zero-scratch baby woollen yarns with comfort diaper ease.",
    highlights: ["100% Skin-Kind Organic Yarn", "Comfort ease for diaper layers", "Wooden adjustment buttons", "Gentle hand-wash safe"]
  };

  return <ProductView product={product} slug={slug} />;
}
`;

fs.writeFileSync(path.join(pdpDir, "page.tsx"), pdpPageCode, "utf8");
console.log("Clean Server-Client split PDP generated successfully!");
