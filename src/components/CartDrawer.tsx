'use client';

import React from 'react';
import { useStore } from '../context/StoreContext';
import Link from 'next/link';

export default function CartDrawer() {
  const { cart, isCartOpen, closeCart, removeFromCart, updateQuantity, cartTotal } = useStore();

  if (!isCartOpen) return null;

  const totalItemsCount = cart.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
  const freeShippingThreshold = 999;
  const progress = Math.min(100, (cartTotal / freeShippingThreshold) * 100);
  const remaining = freeShippingThreshold - cartTotal;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden antialiased">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity cursor-pointer"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-[#F4EBE1] flex items-center justify-between">
            <h2 className="font-heading font-extrabold text-lg text-[#2D221C]">
              Your Shopping Bag ({totalItemsCount})
            </h2>
            <button
              onClick={closeCart}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-[#2D221C] font-bold text-xs flex items-center justify-center cursor-pointer transition"
            >
              ✕
            </button>
          </div>

          {/* Free Shipping Meter */}
          <div className="bg-[#FAF5EE] px-5 py-3 border-b border-[#F4EBE1] text-xs">
            {remaining > 0 ? (
              <p className="text-[#5C4D44] font-medium">
                Add <span className="font-bold text-[#E11D48]">Rs. {remaining.toLocaleString('en-IN')}</span> more for <strong className="text-[#2D221C]">FREE Shipping</strong>
              </p>
            ) : (
              <p className="text-emerald-700 font-bold flex items-center gap-1">
                ✓ You have unlocked FREE Express Shipping!
              </p>
            )}
            <div className="w-full bg-[#EBE2D5] h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-[#E11D48] h-full transition-all duration-300 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <p className="text-sm font-bold text-[#2D221C]">Your bag is currently empty</p>
                <p className="text-xs text-[#8C7B71]">Discover our handcrafted organic wool pieces.</p>
                <button
                  onClick={closeCart}
                  className="mt-2 px-5 py-2.5 bg-[#2D221C] text-white text-xs font-bold rounded-xl cursor-pointer hover:bg-[#E11D48] transition"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              cart.map((item, index) => (
                <div
                  key={`${item.id}-${item.size}-${item.color || index}`}
                  className="flex gap-4 p-3 rounded-2xl border border-[#F4EBE1] bg-[#FFFDF9]"
                >
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&q=80'}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-xl bg-[#FAF5EE] border border-[#F4EBE1]"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-[#2D221C] line-clamp-1">{item.name}</h4>
                      <span className="text-[10px] text-[#8C7B71] block mt-0.5">
                        Size: {item.size || '0-3M'} {item.color ? `• ${item.color}` : ''}
                      </span>
                      <span className="text-xs font-extrabold text-[#2D221C] block mt-1">
                        Rs. {(Number(item.price) * Number(item.quantity)).toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-[#EBE2D5] rounded-lg bg-white overflow-hidden text-xs">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, Number(item.quantity) - 1, item.size, item.color)}
                          className="px-2.5 py-0.5 text-[#2D221C] hover:bg-gray-100 font-bold cursor-pointer select-none"
                        >
                          -
                        </button>
                        <span className="px-2 text-[11px] font-bold min-w-[20px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, Number(item.quantity) + 1, item.size, item.color)}
                          className="px-2.5 py-0.5 text-[#2D221C] hover:bg-gray-100 font-bold cursor-pointer select-none"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id, item.size, item.color)}
                        className="text-[11px] text-[#E11D48] hover:underline font-bold cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Checkout Footer */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-[#F4EBE1] bg-white space-y-3">
              <div className="flex justify-between items-baseline text-sm">
                <span className="text-[#8C7B71] font-bold">Subtotal:</span>
                <span className="font-heading font-extrabold text-lg text-[#2D221C]">
                  Rs. {cartTotal.toLocaleString('en-IN')}
                </span>
              </div>
              <p className="text-[10px] text-gray-500 text-center">Taxes and shipping calculated at checkout</p>
              <Link
                href="/cart"
                onClick={closeCart}
                className="w-full block text-center py-3.5 bg-[#E11D48] hover:bg-[#BE123C] text-white rounded-xl font-bold text-xs uppercase tracking-wider transition shadow-md"
              >
                View Cart & Checkout &rarr;
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}