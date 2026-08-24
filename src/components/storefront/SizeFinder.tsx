'use client';

import { useState } from 'react';
import Link from 'next/link';

export function SizeFinder() {
  const [ageMonths, setAgeMonths] = useState(6);
  const [weightKg, setWeightKg] = useState(7.5);

  const calculateSize = () => {
    if (ageMonths <= 3 && weightKg <= 5.5) return { size: '0-3 Months (Newborn)', collection: '/collections/newborn' };
    if (ageMonths <= 6 && weightKg <= 7.5) return { size: '3-6 Months (Little Baby)', collection: '/collections/0-6-months' };
    if (ageMonths <= 12 && weightKg <= 10) return { size: '6-12 Months (Crawler)', collection: '/collections/6-12-months' };
    if (ageMonths <= 24 && weightKg <= 12.5) return { size: '1-2 Years (Toddler)', collection: '/collections/1-2-years' };
    if (ageMonths <= 36 && weightKg <= 15) return { size: '2-3 Years (Explorer)', collection: '/collections/2-3-years' };
    return { size: '3-5 Years (Big Kid)', collection: '/collections/3-5-years' };
  };

  const rec = calculateSize();

  return (
    <div className="bg-white border-2 border-[#F4EBE1] rounded-3xl p-6 sm:p-10 max-w-2xl mx-auto shadow-xl">
      <div className="text-center mb-8">
        <h3 className="font-heading text-3xl font-bold text-[#2D221C] mt-2">Smart Sizing Calculator</h3>
        <p className="text-xs text-[#78675E] mt-1 font-medium">
          Slide to your baby age and weight for a guaranteed cozy fit over base thermals.
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-[#FFFDF9] p-4 rounded-2xl border border-[#F4EBE1]">
          <div className="flex justify-between text-xs font-bold text-[#2D221C] mb-2">
            <span>Age of Baby:</span>
            <span className="text-[#E11D48] font-heading text-sm">
              {ageMonths < 12 ? ageMonths + " Months" : (ageMonths / 12).toFixed(1) + " Years"}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="60"
            step="1"
            value={ageMonths}
            onChange={(e) => setAgeMonths(parseInt(e.target.value))}
            className="w-full accent-[#E11D48] bg-[#F4EBE1] h-3 rounded-lg cursor-pointer"
          />
        </div>

        <div className="bg-[#FFFDF9] p-4 rounded-2xl border border-[#F4EBE1]">
          <div className="flex justify-between text-xs font-bold text-[#2D221C] mb-2">
            <span>Baby Weight:</span>
            <span className="text-[#E11D48] font-heading text-sm">{weightKg} kg</span>
          </div>
          <input
            type="range"
            min="2.5"
            max="22"
            step="0.5"
            value={weightKg}
            onChange={(e) => setWeightKg(parseFloat(e.target.value))}
            className="w-full accent-[#E11D48] bg-[#F4EBE1] h-3 rounded-lg cursor-pointer"
          />
        </div>

        <div className="bg-gradient-to-r from-rose-50 via-pink-50 to-amber-50 p-6 rounded-2xl border-2 border-rose-200 text-center">
          <span className="text-[10px] uppercase text-[#E11D48] tracking-widest block font-extrabold">
            Perfect Recommended Fit
          </span>
          <span className="font-heading text-2xl font-bold text-[#2D221C] block mt-1">
            {rec.size}
          </span>
          <p className="text-[11px] text-[#78675E] mt-1 font-medium">
            Tailored with comfort ease for diapers and thermal underlayers.
          </p>
          <Link
            href={rec.collection}
            className="inline-block mt-4 bg-[#E11D48] text-white text-xs uppercase tracking-wider font-extrabold py-3 px-8 rounded-xl hover:bg-[#BE123C] transition-colors shadow-md hover:shadow-lg"
          >
            Shop {rec.size} Now
          </Link>
        </div>
      </div>
    </div>
  );
}
