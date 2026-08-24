'use client';

import React from 'react';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, cartTotal, clearCart } = useStore();

  const freeShippingThreshold = 1000;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartTotal);

  if (cart.length === 0) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-16 text-center antialiased text-[#2D221C] space-y-4">
        <h1 className="font-heading text-3xl font-extrabold text-[#2D221C]">Your Shopping Bag is Empty</h1>
        <p className="text-xs text-[#8C7B71]">Discover our soft, handcrafted knitwear sets for little ones.</p>
        <Link
          href="/collections/all"
          className="inline-block px-6 py-3 bg-[#2D221C] hover:bg-[#E11D48] text-white text-xs font-bold rounded-xl transition"
        >
          Explore Collection &rarr;
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-10 antialiased text-[#2D221C]">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="font-heading text-3xl font-extrabold text-[#2D221C]">
            Shopping Cart ({cart.reduce((sum, i) => sum + (Number(i.quantity) || 0), 0)})
          </h1>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-bold text-[#8C7B71] hover:text-[#E11D48] underline cursor-pointer"
        >
          Clear Bag
        </button>
      </div>

      {/* Free Shipping Banner */}
      <div className="bg-[#FAF5EE] border border-[#EBE2D5] rounded-2xl p-4 mb-8">
        <div className="flex justify-between text-xs font-bold mb-2 text-[#2D221C]">
          <span>
            {remainingForFreeShipping > 0
              ? `Add Rs. ${remainingForFreeShipping.toLocaleString('en-IN')} more for FREE Shipping`
              : '🎉 You have qualified for FREE Shipping!'}
          </span>
          <span>{Math.min(100, Math.round((cartTotal / freeShippingThreshold) * 100))}%</span>
        </div>
        <div className="w-full bg-[#EBE2D5] h-2 rounded-full overflow-hidden">
          <div
            className="bg-[#E11D48] h-full transition-all duration-300"
            style={{ width: `${Math.min(100, (cartTotal / freeShippingThreshold) * 100)}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item, index) => (
            <div
              key={`${item.id}-${item.size}-${item.color || index}`}
              className="bg-white rounded-3xl p-5 border border-[#F4EBE1] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.image || 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&q=80'}
                  alt={item.name}
                  className="w-20 h-20 rounded-2xl object-cover border border-[#F4EBE1]"
                />
                <div>
                  <h3 className="font-heading font-extrabold text-sm text-[#2D221C]">{item.name}</h3>
                  <p className="text-xs text-[#8C7B71] mt-0.5">
                    Size: <span className="font-semibold text-[#5C4D44]">{item.size || '0-3M'}</span>
                    {item.color && (
                      <>
                        {' • '}Shade: <span className="font-semibold text-[#5C4D44]">{item.color}</span>
                      </>
                    )}
                  </p>
                  <p className="font-extrabold text-sm text-[#2D221C] mt-2">
                    Rs. {Number(item.price).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              {/* Quantity Controls & Remove */}
              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                <div className="flex items-center border border-[#EBE2D5] rounded-xl px-2 py-1 bg-[#FAF5EE] gap-3">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, Number(item.quantity) - 1, item.size, item.color)}
                    className="text-[#5C4D44] hover:text-[#E11D48] font-black text-sm px-2 py-0.5 cursor-pointer select-none"
                  >
                    -
                  </button>
                  <span className="font-black text-xs text-[#2D221C] w-4 text-center">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, Number(item.quantity) + 1, item.size, item.color)}
                    className="text-[#5C4D44] hover:text-[#E11D48] font-black text-sm px-2 py-0.5 cursor-pointer select-none"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => removeFromCart(item.id, item.size, item.color)}
                  className="text-xs font-bold text-[#8C7B71] hover:text-[#E11D48] transition cursor-pointer"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Sidebar */}
        <div className="bg-white rounded-3xl p-6 border border-[#F4EBE1] shadow-2xs space-y-5 h-fit">
          <h2 className="font-heading font-extrabold text-base text-[#2D221C]">Order Summary</h2>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between text-[#5C4D44]">
              <span>Subtotal</span>
              <span className="font-bold text-[#2D221C]">Rs. {cartTotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-[#5C4D44]">
              <span>Estimated Shipping</span>
              <span className="font-bold text-[#2D221C]">
                {cartTotal >= freeShippingThreshold ? 'FREE' : 'Rs. 99'}
              </span>
            </div>
            <div className="border-t border-[#F4EBE1] pt-3 flex justify-between text-sm font-extrabold text-[#2D221C]">
              <span>Total</span>
              <span>
                Rs. {(cartTotal >= freeShippingThreshold ? cartTotal : cartTotal + 99).toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <Link
            href="/checkout"
            className="w-full block py-3.5 bg-[#E11D48] hover:bg-[#BE123C] text-white text-center font-bold text-xs rounded-xl shadow-md transition"
          >
            Proceed to Checkout &rarr;
          </Link>
        </div>
      </div>
    </main>
  );
}