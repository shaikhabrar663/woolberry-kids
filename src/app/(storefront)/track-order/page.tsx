'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function TrackOrderPage() {
  const [orderQuery, setOrderQuery] = useState('');
  const [phoneQuery, setPhoneQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [orderResult, setOrderResult] = useState<any>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderQuery.trim()) return;

    setSearching(true);
    setSearched(true);
    setOrderResult(null);

    try {
      const res = await fetch('/api/orders', { cache: 'no-store' });
      if (res.ok) {
        const orders = await res.json();
        const found = orders.find((o: any) => {
          const matchNumber = o.orderNumber?.toLowerCase() === orderQuery.trim().toLowerCase();
          if (phoneQuery.trim()) {
            return matchNumber && o.customerPhone?.includes(phoneQuery.trim());
          }
          return matchNumber;
        });
        setOrderResult(found || null);
      }
    } catch (err) {
      console.error('Error tracking order:', err);
    } finally {
      setSearching(false);
    }
  };

  const getStepActive = (status: string, step: number) => {
    const steps: Record<string, number> = {
      Pending: 1,
      Packed: 2,
      Dispatched: 3,
      Delivered: 4,
    };
    const current = steps[status] || 1;
    return current >= step;
  };

  return (
    <div className="bg-[#FFFDF9] min-h-[80vh] text-[#2D221C] py-10 sm:py-16 antialiased">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center space-y-2 mb-10">
          <Link
            href="/"
            className="text-xs font-bold text-[#8C7B71] uppercase tracking-widest hover:text-[#E11D48] transition inline-block mb-2"
          >
            &larr; Back to Shop
          </Link>
          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#2D221C]">
            Track Your Order
          </h1>
          <p className="text-xs text-[#78675E] max-w-md mx-auto">
            Enter your Woolberry Order ID (e.g. WBK-6391) to check real-time package preparation and shipping status.
          </p>
        </div>

        {/* Search Box */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#F4EBE1] shadow-xl mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#2D221C] mb-1.5">
                Order ID Number *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. WBK-6391"
                value={orderQuery}
                onChange={(e) => setOrderQuery(e.target.value)}
                className="w-full p-3.5 rounded-xl border border-[#EBE2D5] text-sm font-semibold uppercase tracking-wider focus:outline-[#E11D48] bg-[#FFFDF9]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#2D221C] mb-1.5">
                Phone Number (Optional verification)
              </label>
              <input
                type="text"
                placeholder="e.g. 919226964497"
                value={phoneQuery}
                onChange={(e) => setPhoneQuery(e.target.value)}
                className="w-full p-3.5 rounded-xl border border-[#EBE2D5] text-sm font-semibold focus:outline-[#E11D48] bg-[#FFFDF9]"
              />
            </div>

            <button
              type="submit"
              disabled={searching}
              className="w-full py-4 bg-[#2D221C] hover:bg-[#E11D48] text-white rounded-xl text-xs uppercase font-extrabold tracking-widest transition cursor-pointer shadow-md disabled:opacity-50"
            >
              {searching ? 'Locating Parcel...' : 'Check Status'}
            </button>
          </form>
        </div>

        {/* Result Card */}
        {searched && (
          orderResult ? (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#F4EBE1] shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#F4EBE1] gap-2">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#8C7B71] tracking-wider block">
                    Order Reference
                  </span>
                  <h3 className="font-heading text-xl font-extrabold text-[#2D221C]">
                    {orderResult.orderNumber}
                  </h3>
                  <span className="text-xs text-[#78675E]">Placed on {orderResult.date}</span>
                </div>
                <div className="sm:text-right">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-rose-50 text-[#E11D48] border border-rose-200 inline-block">
                    {orderResult.status}
                  </span>
                  <span className="block text-xs font-extrabold text-[#2D221C] mt-1">
                    Rs. {Number(orderResult.totalAmount).toLocaleString('en-IN')} ({orderResult.paymentMethod})
                  </span>
                </div>
              </div>

              {/* Steps Tracker */}
              <div className="py-4">
                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  {[
                    { label: 'Received', step: 1 },
                    { label: 'Packed', step: 2 },
                    { label: 'Dispatched', step: 3 },
                    { label: 'Delivered', step: 4 },
                  ].map((s) => {
                    const active = getStepActive(orderResult.status, s.step);
                    return (
                      <div key={s.step} className="flex flex-col items-center gap-2">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition ${
                            active
                              ? 'bg-[#2D221C] text-white'
                              : 'bg-gray-100 text-gray-400 border border-gray-200'
                          }`}
                        >
                          {active ? (
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            s.step
                          )}
                        </div>
                        <span className={`text-[11px] font-bold ${active ? 'text-[#2D221C]' : 'text-gray-400'}`}>
                          {s.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Items & Address */}
              <div className="bg-[#FAF5EE] p-4 rounded-2xl border border-[#EBE2D5] space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#8C7B71] font-bold">Package Items:</span>
                  <span className="font-extrabold text-[#2D221C] text-right max-w-[60%]">
                    {orderResult.items}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8C7B71] font-bold">Deliver To:</span>
                  <span className="font-extrabold text-[#2D221C] text-right">
                    {orderResult.customerName}, {orderResult.city}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-3xl border border-[#F4EBE1] text-center space-y-2 shadow-sm">
              <p className="font-bold text-sm text-[#2D221C]">
                No order found matching "{orderQuery}"
              </p>
              <p className="text-xs text-[#8C7B71]">
                Please check the Order ID on your receipt or confirmation email.
              </p>
            </div>
          )
        )}

      </div>
    </div>
  );
}
