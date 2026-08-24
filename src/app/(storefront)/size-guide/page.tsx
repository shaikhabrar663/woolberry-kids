import React from 'react';
import Link from 'next/link';

export default function SizeGuidePage() {
  const sizes = [
    { bracket: '0 to 3 Months', weight: '3.0 - 5.5 kg', chest: '16 inches', length: '12 inches' },
    { bracket: '3 to 6 Months', weight: '5.5 - 7.5 kg', chest: '17.5 inches', length: '13.5 inches' },
    { bracket: '6 to 12 Months', weight: '7.5 - 10 kg', chest: '19 inches', length: '15 inches' },
    { bracket: '1 to 2 Years', weight: '10 - 12.5 kg', chest: '20.5 inches', length: '16.5 inches' },
    { bracket: '2 to 3 Years', weight: '12.5 - 15 kg', chest: '22 inches', length: '18 inches' },
  ];

  return (
    <main className="max-w-3xl mx-auto px-4 py-16 text-[#2D221C]">
      <Link href="/" className="text-xs font-bold text-[#8C7B71] hover:text-[#E11D48] transition">&larr; Back to Shop</Link>
      <h1 className="font-heading text-3xl font-extrabold mt-3">Baby Knitwear Sizing Guide</h1>
      <p className="text-xs text-[#78675E] mt-2 mb-8">All dimensions allow for cozy layering over inner thermals and cloth diapers.</p>
      <div className="bg-white rounded-2xl border border-[#F4EBE1] overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-[#FAF5EE] text-[#8C7B71] font-bold text-[10px] uppercase">
              <th className="p-3.5">Age Bracket</th>
              <th className="p-3.5">Baby Weight</th>
              <th className="p-3.5">Chest Width</th>
              <th className="p-3.5">Top Length</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F4EBE1]">
            {sizes.map((s, i) => (
              <tr key={i} className="hover:bg-[#FFFDF9]">
                <td className="p-3.5 font-bold">{s.bracket}</td>
                <td className="p-3.5 font-mono text-gray-600">{s.weight}</td>
                <td className="p-3.5 font-mono text-gray-600">{s.chest}</td>
                <td className="p-3.5 font-mono text-gray-600">{s.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
