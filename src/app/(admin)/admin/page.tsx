'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminOverviewPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  const [banner, setBanner] = useState<any>({
    tag: 'Handcrafted With Love',
    headlineStart: 'Handmade crochet &',
    headlineHighlight: 'woollen winterwear.',
    description: '100% skin-safe, zero-scratch organic merino & cotton yarns designed for gentle baby comfort from newborn to 5 years.',
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&q=80',
  });
  const [savingBanner, setSavingBanner] = useState(false);
  const [bannerMsg, setBannerMsg] = useState('');

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [ordersRes, productsRes, bannerRes] = await Promise.all([
          fetch('/api/orders', { cache: 'no-store' }),
          fetch('/api/products', { cache: 'no-store' }),
          fetch('/api/banner', { cache: 'no-store' }),
        ]);

        if (ordersRes.ok) setOrders(await ordersRes.json());
        if (productsRes.ok) setProducts(await productsRes.json());
        if (bannerRes.ok) {
          const bannerData = await bannerRes.json();
          if (bannerData?.image) setBanner(bannerData);
        }
      } catch (e) {
        console.error('Failed to load dashboard data:', e);
      }
    }
    loadDashboardData();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBanner((prev: any) => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingBanner(true);
    try {
      const res = await fetch('/api/banner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(banner),
      });
      if (res.ok) {
        setBannerMsg('✓ Homepage hero banner image updated!');
        setTimeout(() => setBannerMsg(''), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSavingBanner(false);
    }
  };

  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
  const totalOrdersCount = orders.length;
  const pendingOrders = orders.filter((o) => (o.status || '').toLowerCase() === 'pending').length;

  return (
    <div className="space-y-8 antialiased text-[#2D221C]">
      <div>
        <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#2D221C]">
          Store Overview
        </h1>
        <p className="text-xs text-[#8C7B71] mt-1">
          Real-time summary of sales, pending fulfillment, and catalog inventory.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-[#F4EBE1] shadow-xs space-y-2">
          <span className="text-[10px] uppercase font-bold text-[#8C7B71] tracking-wider block">
            TOTAL SALES REVENUE
          </span>
          <div className="font-heading text-2xl font-black text-[#2D221C]">
            Rs. {totalRevenue.toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-emerald-700 font-bold block">
            Live from orders
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#F4EBE1] shadow-xs space-y-2">
          <span className="text-[10px] uppercase font-bold text-[#8C7B71] tracking-wider block">
            TOTAL ORDERS
          </span>
          <div className="font-heading text-2xl font-black text-[#2D221C]">
            {totalOrdersCount}
          </div>
          <Link href="/admin/orders" className="text-[10px] text-[#E11D48] font-bold hover:underline block">
            View order list &rarr;
          </Link>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#F4EBE1] shadow-xs space-y-2">
          <span className="text-[10px] uppercase font-bold text-[#8C7B71] tracking-wider block">
            PENDING FULFILLMENT
          </span>
          <div className="font-heading text-2xl font-black text-[#E11D48]">
            {pendingOrders}
          </div>
          <span className="text-[10px] text-[#8C7B71] font-medium block">
            Requires dispatch label
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#F4EBE1] shadow-xs space-y-2">
          <span className="text-[10px] uppercase font-bold text-[#8C7B71] tracking-wider block">
            CATALOG OUTFITS
          </span>
          <div className="font-heading text-2xl font-black text-[#2D221C]">
            {products.length}
          </div>
          <Link href="/admin/products" className="text-[10px] text-[#E11D48] font-bold hover:underline block">
            Manage inventory &rarr;
          </Link>
        </div>
      </div>

      {/* Simplified Hero Image Manager */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#F4EBE1] shadow-xs space-y-4">
        <div>
          <h2 className="font-heading text-lg font-extrabold text-[#2D221C]">
            Homepage Hero Banner Image
          </h2>
          <p className="text-xs text-[#8C7B71] mt-0.5">
            Upload or change the primary showcase photo displayed in the hero section.
          </p>
        </div>

        {bannerMsg && (
          <div className="p-3 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-200">
            {bannerMsg}
          </div>
        )}

        <form onSubmit={handleSaveBanner} className="space-y-4 text-xs font-bold text-[#2D221C]">
          <div className="flex gap-4 items-center flex-wrap pt-2">
            {banner.image && (
              <img
                src={banner.image}
                alt="Banner Preview"
                className="w-28 h-20 object-cover rounded-2xl border border-[#EBE2D5] shrink-0 shadow-2xs"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="text-xs file:mr-3 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#2D221C] file:text-white cursor-pointer"
            />
          </div>

          <button
            type="submit"
            disabled={savingBanner}
            className="px-6 py-3 bg-[#E11D48] hover:bg-[#BE123C] disabled:opacity-50 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer"
          >
            {savingBanner ? 'Saving...' : 'Update Hero Image'}
          </button>
        </form>
      </div>

      {/* Overview Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-[#F4EBE1] shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-heading font-extrabold text-base text-[#2D221C]">
              Recent Orders
            </h2>
            <Link href="/admin/orders" className="text-xs font-bold text-[#E11D48] hover:underline">
              View All
            </Link>
          </div>

          {orders.length === 0 ? (
            <p className="text-xs text-[#8C7B71] py-4">No customer orders placed yet.</p>
          ) : (
            <div className="divide-y divide-[#F4EBE1]">
              {orders.slice(0, 4).map((o, idx) => (
                <div key={idx} className="py-3 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-[#2D221C] block">{o.orderNumber || `WBK-${1000 + idx}`}</span>
                    <span className="text-[10px] text-[#8C7B71]">{o.customerName} ({o.city || 'Standard'})</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-[#2D221C] block">Rs. {Number(o.totalAmount || 0).toLocaleString('en-IN')}</span>
                    <span className="inline-block text-[9px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
                      {o.status || 'Delivered'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#F4EBE1] shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-heading font-extrabold text-base text-[#2D221C]">
              Active Inventory
            </h2>
            <Link href="/admin/products" className="text-xs font-bold text-[#E11D48] hover:underline">
              Manage Catalog
            </Link>
          </div>

          {products.length === 0 ? (
            <p className="text-xs text-[#8C7B71] py-4">No products in catalog.</p>
          ) : (
            <div className="divide-y divide-[#F4EBE1]">
              {products.slice(0, 4).map((p, idx) => (
                <div key={idx} className="py-3 flex items-center gap-3 text-xs">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-10 h-10 rounded-xl object-cover border border-[#F4EBE1] shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="font-bold text-[#2D221C] block truncate">{p.name}</span>
                    <span className="text-[10px] text-[#8C7B71] capitalize">{p.category}</span>
                  </div>
                  <span className="font-bold text-[#2D221C]">
                    Rs. {Number(p.price).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}