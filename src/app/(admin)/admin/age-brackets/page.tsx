'use client';

import React, { useState, useEffect } from 'react';

export default function AgeBracketsAdminPage() {
  const [brackets, setBrackets] = useState<any[]>([]);
  const [editingCard, setEditingCard] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadBrackets();
  }, []);

  const loadBrackets = async () => {
    try {
      const savedLocal = localStorage.getItem('wbk_age_brackets');
      if (savedLocal) {
        setBrackets(JSON.parse(savedLocal));
      }

      const res = await fetch('/api/age-brackets', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setBrackets(data);
          localStorage.setItem('wbk_age_brackets', JSON.stringify(data));
        }
      }
    } catch (e) {
      console.error('Failed to fetch age brackets:', e);
    }
  };

  const handleSaveCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCard) return;

    setSaving(true);
    const updated = brackets.map((b) =>
      b.id === editingCard.id ? editingCard : b
    );

    setBrackets(updated);
    localStorage.setItem('wbk_age_brackets', JSON.stringify(updated));

    try {
      await fetch('/api/age-brackets', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      alert('Card updated successfully!');
    } catch (err) {
      console.error('API sync error:', err);
    } finally {
      setSaving(false);
      setEditingCard(null);
    }
  };

  return (
    <div className="space-y-6 antialiased text-[#2D221C]">
      <div>
        <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#2D221C]">
          Age Brackets & Showcase Cards ({brackets.length})
        </h1>
        <p className="text-xs text-[#8C7B71] mt-0.5">
          Customize the images, titles, age descriptions, and badges displayed on the homepage "Shop by Age" cards.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {brackets.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl border border-[#F4EBE1] overflow-hidden shadow-xs flex flex-col"
          >
            <div className="relative h-48 w-full bg-[#FAF5EE]">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-3 left-3 bg-[#E11D48] text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs">
                {item.badge}
              </span>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-heading font-extrabold text-base text-[#2D221C]">
                  {item.title}
                </h3>
                <p className="text-xs text-[#8C7B71] mt-0.5">{item.age}</p>
              </div>

              <div className="mt-4 pt-4 border-t border-[#F4EBE1] flex items-center gap-2">
                <button
                  onClick={() => setEditingCard({ ...item })}
                  className="w-full py-2 bg-[#FAF5EE] hover:bg-[#EBE2D5] text-[#2D221C] text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  Change Photo & Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingCard && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 border border-[#F4EBE1] max-w-md w-full text-xs space-y-4 shadow-xl">
            <h2 className="font-heading font-extrabold text-lg text-[#2D221C]">
              Edit Card: {editingCard.title}
            </h2>

            <form onSubmit={handleSaveCard} className="space-y-3">
              <div>
                <label className="font-bold text-[#5C4D44] block mb-1">
                  Card Title
                </label>
                <input
                  type="text"
                  required
                  value={editingCard.title}
                  onChange={(e) =>
                    setEditingCard({ ...editingCard, title: e.target.value })
                  }
                  className="w-full bg-[#FAF5EE] border border-[#EBE2D5] rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-[#5C4D44] block mb-1">
                  Age Subtitle
                </label>
                <input
                  type="text"
                  required
                  value={editingCard.age}
                  onChange={(e) =>
                    setEditingCard({ ...editingCard, age: e.target.value })
                  }
                  className="w-full bg-[#FAF5EE] border border-[#EBE2D5] rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-[#5C4D44] block mb-1">
                  Badge Label
                </label>
                <input
                  type="text"
                  required
                  value={editingCard.badge}
                  onChange={(e) =>
                    setEditingCard({ ...editingCard, badge: e.target.value })
                  }
                  className="w-full bg-[#FAF5EE] border border-[#EBE2D5] rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-[#5C4D44] block mb-1">
                  Image URL / Path
                </label>
                <input
                  type="text"
                  required
                  value={editingCard.image}
                  onChange={(e) =>
                    setEditingCard({ ...editingCard, image: e.target.value })
                  }
                  placeholder="/images/categories/newborn.jpg or https://..."
                  className="w-full bg-[#FAF5EE] border border-[#EBE2D5] rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingCard(null)}
                  className="flex-1 py-2.5 bg-[#FAF5EE] text-[#5C4D44] font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 bg-[#2D221C] hover:bg-[#E11D48] text-white font-bold rounded-xl"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}