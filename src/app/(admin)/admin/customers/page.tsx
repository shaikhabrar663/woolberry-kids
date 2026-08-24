'use client';

import React, { useState, useEffect } from 'react';

export default function CustomersAdminPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [allOrders, setAllOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);

  useEffect(() => {
    async function loadDirectory() {
      try {
        const res = await fetch('/api/orders', { cache: 'no-store' });
        if (res.ok) {
          const orders = await res.json();
          setAllOrders(orders);

          const customerMap: { [key: string]: any } = {};

          orders.forEach((o: any) => {
            const key = o.customerPhone || o.customerName || 'Unknown';
            if (!customerMap[key]) {
              customerMap[key] = {
                name: o.customerName || 'Unknown Buyer',
                phone: o.customerPhone || 'N/A',
                email: o.customerEmail || 'N/A',
                city: o.city || 'India',
                address: o.address || '',
                totalSpent: 0,
                ordersCount: 0,
                orderHistory: [],
              };
            }
            customerMap[key].totalSpent += Number(o.totalAmount) || 0;
            customerMap[key].ordersCount += 1;
            customerMap[key].orderHistory.push(o);
          });

          setCustomers(Object.values(customerMap));
        }
      } catch (e) {
        console.error('Failed to load customer directory:', e);
      } finally {
        setLoading(false);
      }
    }
    loadDirectory();
  }, []);

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      c.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 antialiased">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#2D221C]">
            Customer Directory ({customers.length})
          </h1>
          <p className="text-xs text-[#78675E] mt-1">
            Click on any customer name to inspect their full lifetime order history and details.
          </p>
        </div>

        <input
          type="text"
          placeholder="Search customer, phone, city..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2.5 text-xs rounded-xl border border-[#EBE2D5] bg-white focus:outline-[#E11D48] w-full sm:w-72 shadow-xs"
        />
      </div>

      {/* Directory Table */}
      {loading ? (
        <div className="p-12 text-center text-xs text-[#8C7B71]">Loading directory...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-[#F4EBE1]">
          <p className="text-xs text-[#8C7B71]">No customer matching '{search}' found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#F4EBE1] shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#FAF5EE] border-b border-[#F4EBE1] text-[#8C7B71] uppercase tracking-wider font-bold text-[10px]">
                <th className="py-3.5 px-6">Customer Name</th>
                <th className="py-3.5 px-6">Phone / Contact</th>
                <th className="py-3.5 px-6">City / Address</th>
                <th className="py-3.5 px-6 text-center">Orders Placed</th>
                <th className="py-3.5 px-6 text-right">Lifetime Store Spend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4EBE1]">
              {filtered.map((c, idx) => (
                <tr key={idx} className="hover:bg-[#FFFDF9] transition">
                  <td className="py-4 px-6">
                    <button
                      onClick={() => setSelectedCustomer(c)}
                      className="font-bold text-[#2D221C] hover:text-[#E11D48] hover:underline cursor-pointer text-left flex items-center gap-1.5"
                    >
                      <span>{c.name}</span>
                      <span className="text-[10px] text-[#8C7B71]">↗</span>
                    </button>
                    <span className="text-[10px] text-[#8C7B71] block mt-0.5">{c.email}</span>
                  </td>
                  <td className="py-4 px-6 font-mono text-[#5C4D44]">{c.phone}</td>
                  <td className="py-4 px-6 text-[#78675E]">
                    <span className="font-semibold text-[#2D221C] block">{c.city}</span>
                    <span className="text-[10px] text-gray-500 block truncate max-w-xs">{c.address}</span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className="bg-rose-50 text-[#E11D48] font-black px-2.5 py-0.5 rounded-full text-[11px] border border-rose-100">
                      {c.ordersCount}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right font-extrabold text-[#2D221C] text-sm">
                    Rs. {c.totalSpent.toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Customer Order History Popup Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs antialiased">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-[#F4EBE1] overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-[#F4EBE1] bg-[#FAF5EE] flex justify-between items-start">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#E11D48] tracking-widest block">
                  Customer Purchase Profile
                </span>
                <h2 className="font-heading text-xl font-extrabold text-[#2D221C] mt-0.5">
                  {selectedCustomer.name}
                </h2>
                <div className="flex flex-wrap gap-4 text-xs text-[#78675E] mt-1.5">
                  <span>📞 <strong>{selectedCustomer.phone}</strong></span>
                  <span>✉️ <strong>{selectedCustomer.email}</strong></span>
                  <span>📍 <strong>{selectedCustomer.city}</strong></span>
                </div>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="w-8 h-8 rounded-full bg-white hover:bg-gray-100 text-[#2D221C] font-bold text-xs flex items-center justify-center cursor-pointer border border-[#EBE2D5]"
              >
                ✕
              </button>
            </div>

            {/* Lifetime Overview Strip */}
            <div className="grid grid-cols-2 bg-white px-6 py-3 border-b border-[#F4EBE1] text-xs">
              <div>
                <span className="text-[#8C7B71]">Total Orders:</span>
                <span className="font-bold text-[#2D221C] ml-1.5">{selectedCustomer.ordersCount}</span>
              </div>
              <div className="text-right">
                <span className="text-[#8C7B71]">Lifetime Revenue:</span>
                <span className="font-extrabold text-[#E11D48] ml-1.5 text-sm">
                  Rs. {selectedCustomer.totalSpent.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Order Items List */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              <h3 className="font-heading font-extrabold text-sm text-[#2D221C]">
                Order History ({selectedCustomer.orderHistory.length})
              </h3>

              <div className="space-y-3">
                {selectedCustomer.orderHistory.map((order: any, i: number) => (
                  <div
                    key={i}
                    className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#F4EBE1] space-y-2 text-xs"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="font-heading font-extrabold text-[#2D221C] text-sm">
                          {order.orderNumber}
                        </span>
                        <span className="text-[10px] text-[#8C7B71]">({order.date})</span>
                      </div>
                      <span className="font-extrabold text-[#2D221C]">
                        Rs. {Number(order.totalAmount).toLocaleString('en-IN')}
                      </span>
                    </div>

                    <p className="text-[#5C4D44] font-medium leading-relaxed">
                      {order.items}
                    </p>

                    <div className="flex justify-between items-center pt-1 text-[11px] border-t border-[#F4EBE1]">
                      <span className="text-emerald-700 font-bold">{order.paymentMethod}</span>
                      <span className="bg-amber-50 text-amber-800 font-bold px-2 py-0.5 rounded-full text-[10px] border border-amber-200">
                        {order.status || 'Pending'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#FAF5EE] border-t border-[#F4EBE1] text-right">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-5 py-2 bg-[#2D221C] hover:bg-[#E11D48] text-white text-xs font-bold rounded-xl transition cursor-pointer"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
