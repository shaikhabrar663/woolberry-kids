import React from 'react';
import Link from 'next/link';

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <main className="max-w-3xl mx-auto px-4 py-16 text-[#2D221C]">
      <Link href="/" className="text-xs font-bold text-[#8C7B71] hover:text-[#E11D48] transition">&larr; Back to Shop</Link>
      <h1 className="font-heading text-3xl font-extrabold mt-4 capitalize">{slug.replace(/-/g, ' ')}</h1>
      <p className="text-xs text-[#78675E] mt-4 leading-relaxed">
        Artisanal insights into organic baby yarns, winter warmth layering, and gentle handknit clothing care.
      </p>
    </main>
  );
}
