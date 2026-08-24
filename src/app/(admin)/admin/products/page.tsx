'use client';

import React, { useState, useEffect, useRef } from 'react';

const COLOR_DICTIONARY: Record<string, string> = {
  blue: '#3B82F6',
  'sky blue': '#87CEEB',
  'powder blue': '#B0E0E6',
  'baby blue': '#89CFF0',
  navy: '#000080',
  'navy blue': '#1E3A8A',
  teal: '#0D9488',
  turquoise: '#40E0D0',

  pink: '#EC4899',
  'baby pink': '#F4C2C2',
  'blush pink': '#DDA7A5',
  'dusty rose': '#DCAE96',
  rose: '#F43F5E',
  red: '#EF4444',
  coral: '#FF7F50',
  peach: '#FFDAB9',

  green: '#10B981',
  'sage green': '#9CAF88',
  'mint green': '#98FF98',
  olive: '#808000',
  forest: '#228B22',

  yellow: '#EAB308',
  'mustard yellow': '#E1AD01',
  mustard: '#E1AD01',
  lemon: '#FFF44F',
  cream: '#FFFDD0',
  beige: '#F5F5DC',
  oat: '#E6DCBF',
  brown: '#8B4513',
  tan: '#D2B48C',
  camel: '#C19A6B',

  purple: '#A855F7',
  lavender: '#E6E6FA',
  lilac: '#C8A2C8',
  plum: '#DDA0DD',

  white: '#FFFFFF',
  'off white': '#FAF9F6',
  grey: '#9CA3AF',
  gray: '#9CA3AF',
  charcoal: '#36454F',
  black: '#000000',
};

function getApproximateColorName(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16) || 0;
  const g = parseInt(hex.slice(3, 5), 16) || 0;
  const b = parseInt(hex.slice(5, 7), 16) || 0;

  if (r > 240 && g > 240 && b > 240) return 'White';
  if (r < 35 && g < 35 && b < 35) return 'Black';
  if (r > 200 && g < 150 && b < 150) return 'Dusty Rose';
  if (r > 220 && g > 150 && b < 100) return 'Mustard Yellow';
  if (r < 150 && g > 180 && b < 150) return 'Mint Green';
  if (r < 150 && g < 170 && b > 210) return 'Sky Blue';
  if (r > 180 && g < 150 && b > 200) return 'Lavender';
  if (r > 220 && g > 200 && b > 180) return 'Cream';
  if (r > 130 && g > 140 && b > 120) return 'Sage Green';
  if (r > 100 && g > 100 && b > 100 && Math.abs(r - g) < 20 && Math.abs(g - b) < 20) return 'Grey';

  return 'Pastel Shade';
}

const DEFAULT_CATEGORIES = ['Sweaters & Dresses', 'Cardigans', 'Gift Sets'];

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categoriesList, setCategoriesList] = useState<string[]>(DEFAULT_CATEGORIES);
  const [isCustomCategoryActive, setIsCustomCategoryActive] = useState(false);
  const [customCategoryInput, setCustomCategoryInput] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'Sweaters & Dresses',
    ageBracket: '0-3M',
    price: '',
    mrp: '',
    discount: '',
    tag: 'Bestseller',
    description: '',
    images: [] as string[],
    colors: [] as { name: string; hex: string }[],
  });

  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#87CEEB');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const res = await fetch('/api/products', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      console.error('Failed to load products:', e);
    }
  };

  const handlePriceChange = (priceVal: string, mrpVal: string) => {
    const p = parseFloat(priceVal);
    const m = parseFloat(mrpVal);
    let disc = '';
    if (p > 0 && m > 0 && m > p) {
      const pct = Math.round(((m - p) / m) * 100);
      disc = `${pct}% OFF`;
    }
    setFormData((prev) => ({ ...prev, price: priceVal, mrp: mrpVal, discount: disc }));
  };

  const handleColorNameChange = (name: string) => {
    setNewColorName(name);
    const clean = name.toLowerCase().trim();
    if (COLOR_DICTIONARY[clean]) {
      setNewColorHex(COLOR_DICTIONARY[clean]);
    } else {
      const matchedKey = Object.keys(COLOR_DICTIONARY).find((k) => clean.includes(k));
      if (matchedKey) {
        setNewColorHex(COLOR_DICTIONARY[matchedKey]);
      }
    }
  };

  const handleColorHexChange = (hex: string) => {
    setNewColorHex(hex);
    const exactMatch = Object.entries(COLOR_DICTIONARY).find(
      ([_, h]) => h.toLowerCase() === hex.toLowerCase()
    );
    if (exactMatch) {
      setNewColorName(exactMatch[0].replace(/\b\w/g, (l) => l.toUpperCase()));
    } else {
      setNewColorName(getApproximateColorName(hex));
    }
  };

  const handleAddCustomCategory = () => {
    const trimmed = customCategoryInput.trim();
    if (!trimmed) return;
    if (!categoriesList.includes(trimmed)) {
      setCategoriesList((prev) => [...prev, trimmed]);
    }
    setFormData((prev) => ({ ...prev, category: trimmed }));
    setCustomCategoryInput('');
    setIsCustomCategoryActive(false);
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            setFormData((prev) => ({
              ...prev,
              images: [...prev.images, e.target!.result as string],
            }));
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleAddColor = () => {
    const finalName = newColorName.trim() || getApproximateColorName(newColorHex);
    setFormData((prev) => ({
      ...prev,
      colors: [...prev.colors, { name: finalName, hex: newColorHex }],
    }));
    setNewColorName('');
  };

  const handleRemoveColor = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== idx),
    }));
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setIsCustomCategoryActive(false);
    setCustomCategoryInput('');
    setCategoriesList(DEFAULT_CATEGORIES);
    setFormData({
      name: '',
      category: 'Sweaters & Dresses',
      ageBracket: '0-3M',
      price: '',
      mrp: '',
      discount: '',
      tag: 'Bestseller',
      description: '',
      images: [],
      colors: [],
    });
    setNewColorName('');
    setNewColorHex('#87CEEB');
    setIsModalOpen(true);
  };

  const openEditModal = (product: any) => {
    setEditingProduct(product);
    setIsCustomCategoryActive(false);
    setCustomCategoryInput('');

    const prodCategory = product.category || 'Sweaters & Dresses';
    if (!DEFAULT_CATEGORIES.includes(prodCategory) && !categoriesList.includes(prodCategory)) {
      setCategoriesList([...DEFAULT_CATEGORIES, prodCategory]);
    }

    const productImages =
      product.images && Array.isArray(product.images) && product.images.length > 0
        ? product.images
        : product.image
        ? [product.image]
        : [];

    setFormData({
      name: product.name || '',
      category: prodCategory,
      ageBracket: product.ageBracket || '0-3M',
      price: String(product.price || ''),
      mrp: String(product.mrp || ''),
      discount: product.discount || '',
      tag: product.tag || 'Bestseller',
      description: product.description || '',
      images: productImages,
      colors: product.colors || [],
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this outfit?')) return;
    try {
      const res = await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (e) {
      console.error('Failed to delete product:', e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const primaryImg =
      formData.images[0] ||
      'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&q=80';

    const productPayload = {
      id: editingProduct ? editingProduct.id : `wbk-${Date.now()}`,
      slug: (formData.name || 'outfit')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, ''),
      name: formData.name,
      category: formData.category,
      ageBracket: formData.ageBracket,
      price: Number(formData.price),
      mrp: Number(formData.mrp || formData.price),
      discount: formData.discount,
      tag: formData.tag,
      description:
        formData.description ||
        '100% skin-safe, zero-scratch organic merino wool & cotton yarn knitwear.',
      image: primaryImg,
      images: formData.images.length > 0 ? formData.images : [primaryImg],
      colors: formData.colors,
      rating: editingProduct?.rating || 4.9,
      sizes: ['0-3M', '3-6M', '6-12M', '1-2Y'],
    };

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productPayload),
      });

      if (res.ok) {
        setIsModalOpen(false);
        loadProducts();
      }
    } catch (e) {
      console.error('Failed to save outfit:', e);
    }
  };

  const pNum = parseFloat(formData.price) || 0;
  const mNum = parseFloat(formData.mrp) || 0;
  const savings = mNum > pNum ? mNum - pNum : 0;

  return (
    <div className="space-y-6 antialiased text-[#2D221C]">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#2D221C]">
            Product Catalog ({products.length})
          </h1>
          <p className="text-xs text-[#8C7B71] mt-0.5">
            Manage your store inventory, pricing, tags, and product images.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="px-4 py-2.5 bg-[#2D221C] hover:bg-[#E11D48] text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-sm flex items-center gap-1.5"
        >
          <span>＋</span> Add New Outfit
        </button>
      </div>

      {/* Standardized Symmetrical Product Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
        {products.map((p) => {
          const gallery = p.images && Array.isArray(p.images) ? p.images : [p.image];

          return (
            <div
              key={p.id || p.slug}
              className="bg-white rounded-3xl border border-[#F4EBE1] overflow-hidden flex flex-col justify-between shadow-2xs group hover:shadow-md transition h-full"
            >
              <div>
                {/* Standardized 1:1 Aspect Ratio Box */}
                <div className="relative aspect-square w-full bg-[#FAF5EE] overflow-hidden">
                  <img
                    src={p.image || gallery[0]}
                    alt={p.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-300"
                  />
                  {p.tag && (
                    <span className="absolute top-3 left-3 bg-[#E11D48] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded shadow-2xs">
                      {p.tag}
                    </span>
                  )}
                  <span className="absolute bottom-2.5 right-3 bg-white/95 backdrop-blur-xs text-[#2D221C] text-[10px] font-bold px-2 py-0.5 rounded-md shadow-2xs flex items-center gap-1">
                    ★ {p.rating || '4.9'}
                  </span>
                </div>

                {/* Locked Text Block */}
                <div className="p-4 space-y-1">
                  <span className="text-[9px] uppercase font-bold text-[#8C7B71] tracking-wider block truncate">
                    {p.category}
                  </span>
                  <h3 className="font-heading font-bold text-xs text-[#2D221C] line-clamp-2 min-h-[32px] leading-snug">
                    {p.name}
                  </h3>
                  <div className="flex items-baseline gap-2 pt-1">
                    <span className="font-heading font-extrabold text-sm text-[#2D221C]">
                      Rs. {Number(p.price).toLocaleString('en-IN')}
                    </span>
                    {p.mrp && Number(p.mrp) > Number(p.price) && (
                      <span className="text-[10px] text-[#8C7B71] line-through">
                        Rs. {Number(p.mrp).toLocaleString('en-IN')}
                      </span>
                    )}
                    {p.discount && (
                      <span className="text-[10px] text-[#E11D48] font-bold">
                        {p.discount}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Fixed Bottom Action Row */}
              <div className="p-4 pt-0 grid grid-cols-5 gap-2 mt-auto">
                <button
                  onClick={() => openEditModal(p)}
                  className="col-span-4 py-2 bg-[#FAF5EE] hover:bg-[#F4EBE1] text-[#2D221C] text-xs font-bold rounded-xl transition cursor-pointer text-center border border-[#EBE2D5]"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="col-span-1 py-2 bg-[#FAF5EE] hover:bg-rose-50 text-[#8C7B71] hover:text-[#E11D48] text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center border border-[#EBE2D5]"
                  title="Delete outfit"
                >
                  🗑
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl border border-[#F4EBE1]">
            <div className="flex justify-between items-center border-b border-[#F4EBE1] pb-4">
              <h2 className="font-heading text-xl font-extrabold text-[#2D221C]">
                {editingProduct ? 'Edit Handcrafted Outfit' : 'Add New Handcrafted Outfit'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-black font-bold text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-[#5C4D44] block mb-1">Outfit Title *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Pointelle Vintage Coconut Button Cardigan"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#FAF5EE] border border-[#EBE2D5] rounded-xl px-3.5 py-2.5 focus:outline-[#E11D48]"
                />
              </div>

              {/* Category Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="font-bold text-[#5C4D44]">Category *</label>
                    <button
                      type="button"
                      onClick={() => setIsCustomCategoryActive(!isCustomCategoryActive)}
                      className="text-[10px] text-[#E11D48] font-bold hover:underline cursor-pointer"
                    >
                      {isCustomCategoryActive ? '← Select Default' : '＋ Add Custom'}
                    </button>
                  </div>

                  {!isCustomCategoryActive ? (
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-[#FAF5EE] border border-[#EBE2D5] rounded-xl px-3.5 py-2.5 focus:outline-[#E11D48] font-medium"
                    >
                      {categoriesList.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        placeholder="e.g. Woollen Caps & Booties"
                        value={customCategoryInput}
                        onChange={(e) => setCustomCategoryInput(e.target.value)}
                        className="flex-1 bg-[#FAF5EE] border border-[#EBE2D5] rounded-xl px-3 py-2 text-xs focus:outline-[#E11D48]"
                      />
                      <button
                        type="button"
                        onClick={handleAddCustomCategory}
                        className="px-3 py-2 bg-[#2D221C] text-white rounded-xl font-bold hover:bg-[#E11D48] transition cursor-pointer"
                      >
                        Add
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="font-bold text-[#5C4D44] block mb-1">Primary Age Bracket *</label>
                  <select
                    value={formData.ageBracket}
                    onChange={(e) => setFormData({ ...formData, ageBracket: e.target.value })}
                    className="w-full bg-[#FAF5EE] border border-[#EBE2D5] rounded-xl px-3.5 py-2.5 focus:outline-[#E11D48]"
                  >
                    <option value="0-3M">0 to 3 Months (Newborn)</option>
                    <option value="3-6M">3 to 6 Months (Little Baby)</option>
                    <option value="6-12M">6 to 12 Months (Growing Baby)</option>
                    <option value="1-2Y">1 to 2 Years (Tiny Toddler)</option>
                    <option value="2-5Y">2 to 5 Years (Explorer)</option>
                  </select>
                </div>
              </div>

              {/* Price & Auto-Discount */}
              <div className="space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="font-bold text-[#5C4D44] block mb-1">Offer Price (Rs.) *</label>
                    <input
                      required
                      type="number"
                      placeholder="1200"
                      value={formData.price}
                      onChange={(e) => handlePriceChange(e.target.value, formData.mrp)}
                      className="w-full bg-[#FAF5EE] border border-[#EBE2D5] rounded-xl px-3.5 py-2.5 focus:outline-[#E11D48]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-[#5C4D44] block mb-1">MRP Cutout (Rs.)</label>
                    <input
                      type="number"
                      placeholder="1500"
                      value={formData.mrp}
                      onChange={(e) => handlePriceChange(formData.price, e.target.value)}
                      className="w-full bg-[#FAF5EE] border border-[#EBE2D5] rounded-xl px-3.5 py-2.5 focus:outline-[#E11D48]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-[#5C4D44] block mb-1">Badge Tag</label>
                    <select
                      value={formData.tag}
                      onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                      className="w-full bg-[#FAF5EE] border border-[#EBE2D5] rounded-xl px-3.5 py-2.5 focus:outline-[#E11D48]"
                    >
                      <option value="Bestseller">Bestseller</option>
                      <option value="New Arrival">New Arrival</option>
                      <option value="Most Loved">Most Loved</option>
                      <option value="Trending">Trending</option>
                      <option value="Handcrafted">Handcrafted</option>
                    </select>
                  </div>
                </div>

                {formData.discount && (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1.5 rounded-xl flex items-center justify-between text-[11px] font-bold">
                    <span>⚡ Calculated Discount: <strong>{formData.discount}</strong></span>
                    <span>Customer Saves: <strong>Rs. {savings.toLocaleString('en-IN')}</strong></span>
                  </div>
                )}
              </div>

              {/* Local File Selector */}
              <div className="space-y-2 pt-2 border-t border-[#F4EBE1]">
                <label className="font-bold text-[#5C4D44] block">
                  Product Photos (Drag & Drop or Select from Computer)
                </label>

                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    handleFiles(e.dataTransfer.files);
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition ${
                    isDragging
                      ? 'border-[#E11D48] bg-rose-50/50'
                      : 'border-[#EBE2D5] bg-[#FAF5EE]/50 hover:bg-[#FAF5EE]'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleFiles(e.target.files)}
                    className="hidden"
                  />
                  <div className="space-y-1">
                    <span className="text-2xl block">📸</span>
                    <p className="font-bold text-[#2D221C]">Click to browse or drag photos here</p>
                    <p className="text-[10px] text-[#8C7B71]">Supports JPG, PNG, WEBP (Add multiple angles)</p>
                  </div>
                </div>

                {formData.images.length > 0 && (
                  <div className="flex flex-wrap gap-3 pt-2">
                    {formData.images.map((imgUrl, idx) => (
                      <div
                        key={idx}
                        className="relative w-16 h-16 rounded-xl overflow-hidden border border-[#EBE2D5] group shadow-2xs"
                      >
                        <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition font-bold text-xs cursor-pointer"
                        >
                          ✕
                        </button>
                        {idx === 0 && (
                          <span className="absolute bottom-0 inset-x-0 bg-[#2D221C] text-white text-[8px] text-center font-bold">
                            Cover
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Two-Way Color Sync Swatches */}
              <div className="space-y-2 pt-2 border-t border-[#F4EBE1]">
                <div className="flex justify-between items-center">
                  <label className="font-bold text-[#5C4D44] block">Available Color Shades</label>
                  <span className="text-[10px] text-[#8C7B71]">Type a color name or pick any shade</span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Type name (e.g. Blue, Blush Pink, Sage Green)..."
                    value={newColorName}
                    onChange={(e) => handleColorNameChange(e.target.value)}
                    className="flex-1 bg-[#FAF5EE] border border-[#EBE2D5] rounded-xl px-3 py-2 focus:outline-[#E11D48]"
                  />
                  <input
                    type="color"
                    value={newColorHex}
                    onChange={(e) => handleColorHexChange(e.target.value)}
                    title="Click to pick custom shade"
                    className="w-11 h-9 p-0.5 rounded-xl border border-[#EBE2D5] bg-[#FAF5EE] cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={handleAddColor}
                    className="px-4 py-2 bg-[#2D221C] text-white rounded-xl font-bold hover:bg-[#E11D48] transition cursor-pointer"
                  >
                    Add Color
                  </button>
                </div>

                {formData.colors.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {formData.colors.map((c, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 bg-[#FAF5EE] border border-[#EBE2D5] px-3 py-1 rounded-full text-[11px] font-bold text-[#2D221C]"
                      >
                        <span
                          style={{ backgroundColor: c.hex }}
                          className="w-3.5 h-3.5 rounded-full border border-black/20 shrink-0"
                        />
                        {c.name}
                        <button
                          type="button"
                          onClick={() => handleRemoveColor(i)}
                          className="text-gray-400 hover:text-red-500 ml-1 text-xs font-bold cursor-pointer"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="pt-2 border-t border-[#F4EBE1]">
                <label className="font-bold text-[#5C4D44] block mb-1">Fabric & Knit Details</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Handcrafted with zero-scratch organic merino wool. Wooden coconut button front closure."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-[#FAF5EE] border border-[#EBE2D5] rounded-xl px-3.5 py-2 focus:outline-[#E11D48]"
                />
              </div>

              {/* Actions */}
              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 font-bold hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#2D221C] hover:bg-[#E11D48] text-white font-bold rounded-xl transition shadow-md cursor-pointer"
                >
                  {editingProduct ? 'Update Outfit' : 'Save & Publish Outfit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}