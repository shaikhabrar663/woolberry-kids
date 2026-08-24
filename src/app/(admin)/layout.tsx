'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { label: 'Overview', href: '/admin', icon: '🏠' },
  { label: 'Products & Catalog', href: '/admin/products', icon: '🛍️' },
  { label: 'Inventory & Stock', href: '/admin/inventory', icon: '📦' },
  { label: 'Age Brackets', href: '/admin/age-brackets', icon: '👶' },
  { label: 'Orders', href: '/admin/orders', icon: '📋' },
  { label: 'Customers', href: '/admin/customers', icon: '👥' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // If on the login screen, do not show the admin sidebar
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      window.location.href = '/admin/login';
    } catch (e) {
      console.error('Failed to logout:', e);
      window.location.href = '/admin/login';
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF5EE] flex antialiased text-[#2D221C]">
      {/* Dark Sidebar */}
      <aside className="w-64 bg-[#2D221C] text-[#FAF5EE] flex flex-col justify-between shrink-0 p-5 hidden md:flex border-r border-[#3E3028]">
        <div className="space-y-6">
          {/* Brand Header */}
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 bg-[#E11D48] text-white rounded-xl flex items-center justify-center font-black text-sm">
              W
            </div>
            <div>
              <h2 className="font-heading font-extrabold text-sm tracking-tight text-white">Woolberry</h2>
              <span className="text-[9px] uppercase tracking-widest text-[#8C7B71] block font-bold">
                Admin Portal
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                    isActive
                      ? 'bg-[#E11D48] text-white shadow-sm'
                      : 'text-[#C7B9B0] hover:bg-[#3E3028] hover:text-white'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer (Live Store Link & Sign Out Button) */}
        <div className="space-y-2 pt-4 border-t border-[#3E3028] text-xs">
          <Link
            href="/"
            target="_blank"
            className="block px-3.5 py-2 text-[#C7B9B0] hover:text-white hover:bg-[#3E3028] rounded-xl transition text-[11px] font-bold"
          >
            &larr; View Live Store
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3.5 py-2.5 text-rose-300 hover:text-white hover:bg-rose-900/40 rounded-xl transition font-bold text-left cursor-pointer"
          >
            <span>🚪</span>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-6 sm:p-8 lg:p-10 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}