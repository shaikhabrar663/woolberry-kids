'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AgeCards() {
  const [cards, setCards] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('wbk_age_brackets');
    if (saved) {
      try {
        setCards(JSON.parse(saved));
      } catch (e) {}
    }

    fetch('/api/age-brackets', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setCards(data);
        }
      })
      .catch(() => {});
  }, []);

  if (cards.length === 0) return null;

  return (
    <section className="py-12 bg-[#FFFDF9]">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#2D221C] text-center mb-8">
          Shop by Age
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {cards.map((item) => (
            <Link
              key={item.id}
              href={`/collections/${item.id}`}
              className="group flex flex-col items-center text-center p-3 rounded-2xl bg-white border border-[#F4EBE1] hover:shadow-md transition"
            >
              <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-3">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <span className="absolute top-2 left-2 bg-[#E11D48] text-white text-[8px] font-bold px-1.5 py-0.5 rounded">
                  {item.badge}
                </span>
              </div>
              <h3 className="font-bold text-xs text-[#2D221C]">{item.title}</h3>
              <p className="text-[10px] text-[#8C7B71]">{item.age}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}