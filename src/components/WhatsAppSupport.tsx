'use client';

import React from 'react';

export default function WhatsAppSupport() {
  const phoneNumber = '919226964497'; // Replace with your support WhatsApp number
  const defaultMessage = encodeURIComponent(
    'Hi Woolberry Kids Team! I have a question about baby sizing and ordering handcrafted knitwear.'
  );

  return (
    <aside aria-label="Support">
      <a
        href={`https://wa.me/${phoneNumber}?text=${defaultMessage}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white px-4 py-3 rounded-full shadow-2xl transition transform hover:scale-105"
      >
        <span className="text-lg">💬</span>
        <span className="text-xs font-extrabold hidden sm:inline">WhatsApp Help</span>
      </a>
    </aside>
  );
}