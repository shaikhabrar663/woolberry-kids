'use client';

import React, { useState, useEffect, useRef } from 'react';

export default function AdminAgeBracketsPage() {
  const [brackets, setBrackets] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCard, setActiveCard] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    age: '',
    tag: '',
    image: '',
    slug: '',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadBrackets();
  }, []);

  const loadBrackets = async () => {
    try {
      const res = await fetch('/api/categories', { cache: 'no-store' });
      if (res.ok) {
        setBrackets(await res.json());
      }
    } catch (e) {
      console.error('Failed to load showcase cards:', e);
    }
  };

  const openAddModal = () => {
    setActiveCard(null);
    setFormData({
      id: `bracket-${Date.now()}`,
      title: '',
      age: '',
      tag: 'NEW ARRIVAL',
      image: '',
      slug: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (card: any) => {
    setActiveCard(card);
    setFormData({
      id: card.id,
      title: card.title || '',
      age: card.age || '',
      tag: card.tag || '',
      image: card.image || '',
      slug: card.slug || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this showcase card?')) return;
    try {
      const res = await fetch(`/api/categories?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setBrackets((prev) => prev.filter((b) => b.id !== id));
      }
    } catch (e) {
      console.error('Failed to delete card:', e);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setFormData((prev) => ({ ...prev, image: uploadEvent.target!.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
      slug:
        formData.slug ||
        formData.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, ''),
      image:
        formData.image ||
        'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&q=80',
    };

    try {
      const method = activeCard ? 'PUT' : 'POST';
      const res = await fetch('/api/categories', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsModalOpen(false);
        loadBrackets();
      }
    } catch (e) {
      console.error('Failed to save card:', e);
    }
  };

  return (
    <div className="space-y-6 antialiased text-[#2D221C]">
      {/* Top Header with "Add Showcase Card" Button */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#2D221C]">
            Age Brackets & Showcase Cards ({brackets.length})
          </h1>
          <p className="text-xs text-[#8C7B71] mt-0.5">
            Customize the images, titles, age descriptions, and badges displayed on the homepage &ldquo;Shop by Age&rdquo; cards.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="px-4 py-2.5 bg-[#2D221C] hover:bg-[#E11D48] text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-sm flex items-center gap-1.5"
        >
          <span>＋</span> Add Showcase Card
        </button>
      </div>

      {/* Grid of Cards with Edit & Delete Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {brackets.map((card) => (
          <div
            key={card.id}
            className="bg-white rounded-3xl border border-[#F4EBE1] overflow-hidden flex flex-col justify-between shadow-2xs group hover:shadow-md transition h-full"
          >
            <div>
              <div className="relative h-52 w-full bg-[#FAF5EE] overflow-hidden">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-300"
                />
                {card.tag && (
                  <span className="absolute top-3 left-3 bg-[#E11D48] text-white text-[9px] font-black uppercase px-2.5 py-1 rounded-md shadow-2xs">
                    {card.tag}
                  </span>
                )}
              </div>

              <div className="p-4 space-y-1">
                <h3 className="font-heading font-extrabold text-sm text-[#2D221C]">
                  {card.title}
                </h3>
                <p className="text-xs text-[#8C7B71]">{card.age}</p>
              </div>
            </div>

            {/* Edit & Delete Action Row */}
            <div className="p-4 pt-0 grid grid-cols-5 gap-2">
              <button
                onClick={() => openEditModal(card)}
                className="col-span-4 py-2.5 bg-[#FAF5EE] hover:bg-[#F4EBE1] text-[#2D221C] text-xs font-bold rounded-xl transition cursor-pointer text-center border border-[#EBE2D5]"
              >
                Change Photo & Details
              </button>
              <button
                onClick={() => handleDelete(card.id)}
                className="col-span-1 py-2.5 bg-[#FAF5EE] hover:bg-rose-50 text-[#8C7B71] hover:text-[#E11D48] text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center border border-[#EBE2D5]"
                title="Delete card"
              >
                🗑
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-[#F4EBE1]">
            <div className="flex justify-between items-center border-b border-[#F4EBE1] pb-3">
              <h2 className="font-heading text-lg font-extrabold text-[#2D221C]">
                {activeCard ? `Edit: ${activeCard.title}` : 'Add New Showcase Card'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-black font-bold text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-[#5C4D44] block mb-1">Title *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Newborn, Little Baby, Gift Boxes"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-[#FAF5EE] border border-[#EBE2D5] rounded-xl px-3.5 py-2.5 focus:outline-[#E11D48]"
                />
              </div>

              <div>
                <label className="font-bold text-[#5C4D44] block mb-1">Age Description *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. 0 to 3 Months, 1 to 2 Years"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="w-full bg-[#FAF5EE] border border-[#EBE2D5] rounded-xl px-3.5 py-2.5 focus:outline-[#E11D48]"
                />
              </div>

              <div>
                <label className="font-bold text-[#5C4D44] block mb-1">Badge Tag</label>
                <input
                  type="text"
                  placeholder="e.g. ULTRA SOFT, COZY CRAWL, BESTSELLER"
                  value={formData.tag}
                  onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                  className="w-full bg-[#FAF5EE] border border-[#EBE2D5] rounded-xl px-3.5 py-2.5 focus:outline-[#E11D48]"
                />
              </div>

              <div>
                <label className="font-bold text-[#5C4D44] block mb-1">Card Photo</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-3 bg-[#FAF5EE] border-2 border-dashed border-[#EBE2D5] rounded-xl font-bold text-[#2D221C] hover:bg-rose-50 hover:border-[#E11D48] transition cursor-pointer"
                >
                  📁 Upload Photo from Computer
                </button>
                {formData.image && (
                  <div className="relative h-32 w-full rounded-xl overflow-hidden mt-2 border border-[#EBE2D5]">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded-xl font-bold hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2D221C] hover:bg-[#E11D48] text-white font-bold rounded-xl transition cursor-pointer"
                >
                  {activeCard ? 'Save Changes' : 'Publish Card'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}