'use client';

import React, { useState, useRef } from 'react';

export default function AgeBracketsShowcasePage() {
  const [cards, setCards] = useState([
    {
      id: 1,
      badge: 'ULTRA SOFT',
      title: 'Newborn',
      subtitle: '0 to 3 Months',
      image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&q=80',
    },
    {
      id: 2,
      badge: 'COZY CRAWL',
      title: 'Little Baby',
      subtitle: '3 to 6 Months',
      image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80',
    },
    {
      id: 3,
      badge: 'ACTIVE PLAY',
      title: 'Growing Baby',
      subtitle: '6 to 12 Months',
      image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800&q=80',
    },
    {
      id: 4,
      badge: 'LITTLE STEPS',
      title: 'Tiny Toddler',
      subtitle: '1 to 2 Years',
      image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&q=80',
    },
    {
      id: 5,
      badge: 'CURIOUS DAYS',
      title: 'Explorer',
      subtitle: '2 to 3 Years',
      image: 'https://images.unsplash.com/photo-1543332164-6e82f355badc?w=800&q=80',
    },
    {
      id: 6,
      badge: 'OUTDOOR WARMTH',
      title: 'Other Wearable',
      subtitle: '1 to 5 years',
      image: 'https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?w=800&q=80',
    },
  ]);

  const [editingCard, setEditingCard] = useState<any | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, WEBP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      if (uploadEvent.target?.result && editingCard) {
        setEditingCard({
          ...editingCard,
          image: uploadEvent.target.result as string,
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setCards((prev) => prev.map((c) => (c.id === editingCard.id ? editingCard : c)));
    setEditingCard(null);
  };

  return (
    <div className="space-y-6 antialiased w-full max-w-full">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#2D221C]">
          Age Brackets & Showcase Cards
        </h1>
        <p className="text-xs text-[#78675E] mt-1">
          Customize the images, titles, age descriptions, and badges displayed on the homepage "Shop by Age" cards.
        </p>
      </div>

      {/* 6 Showcase Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {cards.map((card) => (
          <div
            key={card.id}
            className="bg-white rounded-2xl border border-[#F4EBE1] shadow-xs overflow-hidden flex flex-col justify-between"
          >
            <div className="relative w-full h-48 bg-[#FAF5EE] overflow-hidden">
              <img
                src={card.image}
                alt={card.title}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-3 left-3 bg-rose-50/90 backdrop-blur-xs text-[#E11D48] text-[9px] font-black tracking-wider uppercase px-2.5 py-1 rounded shadow-xs border border-rose-100">
                {card.badge}
              </span>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="font-heading font-extrabold text-sm text-[#2D221C]">
                  {card.title}
                </h3>
                <p className="text-xs text-[#8C7B71] mt-0.5 font-medium">
                  {card.subtitle}
                </p>
              </div>

              <button
                onClick={() => setEditingCard({ ...card })}
                className="w-full py-2.5 bg-[#FAF5EE] hover:bg-[#F4EBE1] text-[#2D221C] border border-[#EBE2D5] rounded-xl text-xs font-bold transition cursor-pointer text-center"
              >
                Change Photo & Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal with Drag & Drop */}
      {editingCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <form
            onSubmit={handleSave}
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-[#F4EBE1] space-y-4 animate-in fade-in zoom-in duration-150 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center pb-2 border-b border-[#F4EBE1]">
              <h3 className="font-heading font-extrabold text-base text-[#2D221C]">
                Edit Showcase Card
              </h3>
              <button
                type="button"
                onClick={() => setEditingCard(null)}
                className="w-7 h-7 rounded-full bg-gray-100 text-xs font-bold flex items-center justify-center hover:bg-gray-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-[#2D221C] mb-1">Badge Text</label>
                <input
                  type="text"
                  required
                  value={editingCard.badge}
                  onChange={(e) => setEditingCard({ ...editingCard, badge: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[#EBE2D5] bg-[#FFFDF9] focus:outline-[#E11D48] text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-[#2D221C] mb-1">Card Title</label>
                <input
                  type="text"
                  required
                  value={editingCard.title}
                  onChange={(e) => setEditingCard({ ...editingCard, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[#EBE2D5] bg-[#FFFDF9] focus:outline-[#E11D48] text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-[#2D221C] mb-1">Age Description</label>
                <input
                  type="text"
                  required
                  value={editingCard.subtitle}
                  onChange={(e) => setEditingCard({ ...editingCard, subtitle: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[#EBE2D5] bg-[#FFFDF9] focus:outline-[#E11D48] text-xs font-semibold"
                />
              </div>

              {/* Drag & Drop Upload Zone */}
              <div>
                <label className="block font-bold text-[#2D221C] mb-1">Showcase Photo (Drag & Drop or Click)</label>
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition flex flex-col items-center justify-center gap-2 ${
                    isDragging
                      ? 'border-[#E11D48] bg-rose-50/50 scale-[1.01]'
                      : 'border-[#EBE2D5] bg-[#FAF5EE]/50 hover:bg-[#FAF5EE]'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileInput}
                    className="hidden"
                  />

                  {editingCard.image ? (
                    <div className="relative group w-full h-36 rounded-xl overflow-hidden bg-white border border-[#EBE2D5]">
                      <img
                        src={editingCard.image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-bold">
                        Click or Drop to Replace Image
                      </div>
                    </div>
                  ) : (
                    <div className="py-4">
                      <div className="w-10 h-10 rounded-full bg-rose-50 text-[#E11D48] flex items-center justify-center mx-auto mb-2 text-lg">
                        📷
                      </div>
                      <span className="font-bold text-xs text-[#2D221C] block">
                        Drag & Drop image here, or <span className="text-[#E11D48] underline">browse files</span>
                      </span>
                      <span className="text-[10px] text-[#8C7B71] block mt-0.5">Supports PNG, JPG, JPEG, WEBP</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#2D221C] mb-1">Or Direct Image URL</label>
                <input
                  type="text"
                  value={editingCard.image.startsWith('data:') ? '' : editingCard.image}
                  placeholder="https://images.unsplash.com/..."
                  onChange={(e) => setEditingCard({ ...editingCard, image: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[#EBE2D5] bg-[#FFFDF9] text-xs font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#F4EBE1]">
              <button
                type="button"
                onClick={() => setEditingCard(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-[#2D221C] rounded-xl text-xs font-bold cursor-pointer transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#2D221C] hover:bg-[#E11D48] text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-sm"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
