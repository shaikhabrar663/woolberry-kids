'use client';

import React, { useState, useEffect } from 'react';
import { exportOrdersToCsv } from '@/lib/exportOrdersCsv';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const res = await fetch('/api/orders', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      console.error('Failed to fetch orders:', e);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch('/api/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, status: newStatus }),
      });
      if (res.ok) {
        await loadOrders();
      }
    } catch (e) {
      console.error('Failed to update status:', e);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleResetOrders = async () => {
    const confirmed = window.confirm(
      '⚠️ WARNING: Are you sure you want to permanently reset all orders to 0? This will clear all test and dummy data before handing over to the client.'
    );
    if (!confirmed) return;

    setResetting(true);
    try {
      const res = await fetch('/api/orders', { method: 'DELETE' });
      if (res.ok) {
        setOrders([]);
        alert('Store orders successfully reset to 0.');
      } else {
        alert('Failed to reset orders.');
      }
    } catch (e) {
      alert('Network error while resetting orders.');
    } finally {
      setResetting(false);
    }
  };

  // Helper to normalize item lists
  const getNormalizedItems = (items: any): any[] => {
    if (!items) return [];
    if (Array.isArray(items)) return items;
    if (typeof items === 'string') {
      try {
        const parsed = JSON.parse(items);
        return Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        return [{ name: items, size: '0-3M', quantity: 1 }];
      }
    }
    if (typeof items === 'object') return [items];
    return [];
  };

  const handlePrintLabel = (order: any) => {
    const orderNumber = order.orderNumber || order.id || 'WBK-8921';
    const isCod = (order.paymentMethod || 'COD').toUpperCase().includes('COD');
    const paymentBadge = isCod ? 'COD' : 'PREPAID';
    const safeItems = getNormalizedItems(order.items);

    const itemsHtml =
      safeItems.length > 0
        ? safeItems
            .map(
              (it: any) =>
                `<div style="display:flex; justify-content:space-between; margin-bottom: 2px;">
                  <span>${it.name || 'Handmade Knit Outfit'} (${it.size || '0-3M'})</span>
                  <span style="font-weight:bold;">x ${it.quantity || 1}</span>
                </div>`
            )
            .join('')
        : `<div>Handmade Knit Outfit (0-3M) x 1</div>`;

    const printHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Shipping Label - ${orderNumber}</title>
          <style>
            @page { size: 4in 6in; margin: 0; }
            * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
            body { background: #fff; display: flex; justify-content: center; align-items: center; min-height: 100vh; padding: 15px; }
            .label-card { width: 100%; max-width: 380px; border: 2.5px solid #000; border-radius: 12px; padding: 16px; color: #000; background: #fff; }
            .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #000; padding-bottom: 8px; }
            .brand-title { font-size: 16px; font-weight: 900; letter-spacing: 0.5px; text-transform: uppercase; }
            .brand-subtitle { font-size: 9px; font-weight: 700; letter-spacing: 0.5px; color: #333; margin-top: 1px; }
            .payment-badge { border: 1.5px solid #000; border-radius: 6px; padding: 2px 8px; font-size: 11px; font-weight: 900; text-transform: uppercase; }
            .order-ref { font-size: 10px; font-weight: 800; margin-top: 3px; text-align: right; }
            .barcode-section { text-align: center; padding: 12px 0 8px 0; border-bottom: 1.5px dashed #000; }
            .barcode-svg { width: 90%; height: 48px; margin: 0 auto; }
            .barcode-text { font-family: monospace; font-size: 11px; font-weight: 800; letter-spacing: 2px; margin-top: 2px; }
            .deliver-section { padding: 12px 0; border-bottom: 2px solid #000; }
            .deliver-label { font-size: 9px; font-weight: 800; letter-spacing: 0.5px; color: #555; text-transform: uppercase; }
            .customer-name { font-size: 14px; font-weight: 900; text-transform: uppercase; margin: 3px 0 2px 0; }
            .customer-address { font-size: 11px; line-height: 1.35; font-weight: 500; }
            .customer-phone { font-size: 11px; font-weight: 800; margin-top: 4px; }
            .contents-section { padding: 10px 0; border-bottom: 1.5px dashed #000; display: flex; justify-content: space-between; font-size: 11px; }
            .contents-left { flex: 1; padding-right: 10px; }
            .contents-title { font-size: 9px; font-weight: 800; letter-spacing: 0.5px; color: #555; margin-bottom: 3px; text-transform: uppercase; }
            .total-box { text-align: right; min-width: 90px; }
            .total-amount { font-size: 13px; font-weight: 900; margin-top: 2px; }
            .footer { padding-top: 8px; font-size: 8px; color: #444; line-height: 1.3; }
            .footer strong { color: #000; text-transform: uppercase; font-size: 8.5px; }
          </style>
        </head>
        <body>
          <div class="label-card">
            <div class="header">
              <div>
                <div class="brand-title">Woolberry Kids</div>
                <div class="brand-subtitle">Handcrafted Baby Knitwear</div>
              </div>
              <div>
                <div class="payment-badge">${paymentBadge}</div>
                <div class="order-ref">${orderNumber}</div>
              </div>
            </div>

            <div class="barcode-section">
              <svg class="barcode-svg" viewBox="0 0 260 50" xmlns="http://www.w3.org/2000/svg">
                <rect x="0" y="0" width="4" height="46" fill="#000"/>
                <rect x="6" y="0" width="2" height="46" fill="#000"/>
                <rect x="11" y="0" width="5" height="46" fill="#000"/>
                <rect x="19" y="0" width="2" height="46" fill="#000"/>
                <rect x="24" y="0" width="7" height="46" fill="#000"/>
                <rect x="34" y="0" width="3" height="46" fill="#000"/>
                <rect x="40" y="0" width="6" height="46" fill="#000"/>
                <rect x="49" y="0" width="2" height="46" fill="#000"/>
                <rect x="54" y="0" width="8" height="46" fill="#000"/>
                <rect x="65" y="0" width="3" height="46" fill="#000"/>
                <rect x="71" y="0" width="4" height="46" fill="#000"/>
                <rect x="78" y="0" width="2" height="46" fill="#000"/>
                <rect x="83" y="0" width="6" height="46" fill="#000"/>
                <rect x="92" y="0" width="4" height="46" fill="#000"/>
                <rect x="99" y="0" width="7" height="46" fill="#000"/>
                <rect x="109" y="0" width="2" height="46" fill="#000"/>
                <rect x="114" y="0" width="5" height="46" fill="#000"/>
                <rect x="122" y="0" width="3" height="46" fill="#000"/>
                <rect x="128" y="0" width="8" height="46" fill="#000"/>
                <rect x="139" y="0" width="3" height="46" fill="#000"/>
                <rect x="145" y="0" width="5" height="46" fill="#000"/>
                <rect x="153" y="0" width="2" height="46" fill="#000"/>
                <rect x="158" y="0" width="7" height="46" fill="#000"/>
                <rect x="168" y="0" width="4" height="46" fill="#000"/>
                <rect x="175" y="0" width="3" height="46" fill="#000"/>
                <rect x="181" y="0" width="6" height="46" fill="#000"/>
                <rect x="190" y="0" width="2" height="46" fill="#000"/>
                <rect x="195" y="0" width="8" height="46" fill="#000"/>
                <rect x="206" y="0" width="3" height="46" fill="#000"/>
                <rect x="212" y="0" width="5" height="46" fill="#000"/>
                <rect x="220" y="0" width="2" height="46" fill="#000"/>
                <rect x="225" y="0" width="7" height="46" fill="#000"/>
                <rect x="235" y="0" width="4" height="46" fill="#000"/>
                <rect x="242" y="0" width="3" height="46" fill="#000"/>
                <rect x="248" y="0" width="6" height="46" fill="#000"/>
                <rect x="257" y="0" width="3" height="46" fill="#000"/>
              </svg>
              <div class="barcode-text">*${orderNumber}*</div>
            </div>

            <div class="deliver-section">
              <div class="deliver-label">Deliver To:</div>
              <div class="customer-name">${order.customerName || 'Customer'}</div>
              <div class="customer-address">
                ${order.address || 'Address on file'}<br/>
                <strong>${(order.city || 'MUMBAI').toUpperCase()} - ${order.pincode || '400001'}</strong>
              </div>
              <div class="customer-phone">Phone: ${order.phone || '+91 98765 43210'}</div>
            </div>

            <div class="contents-section">
              <div class="contents-left">
                <div class="contents-title">Contents:</div>
                ${itemsHtml}
              </div>
              <div class="total-box">
                <div class="contents-title">Total Amount:</div>
                <div class="total-amount">Rs. ${Number(order.totalAmount || 0).toLocaleString('en-IN')}</div>
              </div>
            </div>

            <div class="footer">
              <strong>If Undelivered, Return To:</strong><br/>
              Woolberry Kids Studio, Express Logistics Hub, Maharashtra, India<br/>
              Support: support@woolberrykids.com
            </div>
          </div>

          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() {
                window.close();
              }, 600);
            };
          </script>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank', 'width=600,height=800');
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(printHtml);
      printWindow.document.close();
    }
  };

  return (
    <div className="space-y-6 antialiased text-[#2D221C]">
      {/* Header & Global Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#2D221C]">
            Orders & Dispatch ({orders.length})
          </h1>
          <p className="text-xs text-[#8C7B71] mt-0.5">
            Manage customer orders, print thermal slips, export reports, or reset store metrics.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* CSV Export Button */}
          <button
            type="button"
            onClick={() => exportOrdersToCsv(orders)}
            disabled={orders.length === 0}
            className="flex items-center gap-1.5 bg-[#2D221C] hover:bg-[#E11D48] text-white text-xs font-bold px-3.5 py-2.5 rounded-xl transition cursor-pointer shadow-xs disabled:opacity-40"
          >
            <span>📊</span>
            <span>Export CSV</span>
          </button>

          {/* Reset All Orders to 0 Button */}
          <button
            type="button"
            onClick={handleResetOrders}
            disabled={resetting || orders.length === 0}
            className="flex items-center gap-1.5 bg-rose-50 hover:bg-rose-100 text-[#E11D48] border border-rose-200 text-xs font-bold px-3.5 py-2.5 rounded-xl transition cursor-pointer disabled:opacity-40"
            title="Purge all demo orders to start fresh"
          >
            <span>🗑️</span>
            <span>{resetting ? 'Resetting...' : 'Reset Orders (0)'}</span>
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-[#F4EBE1] shadow-xs overflow-hidden">
        {orders.length === 0 ? (
          <div className="p-16 text-center text-xs text-[#8C7B71] space-y-2">
            <span className="text-3xl block">📦</span>
            <p className="font-bold text-[#2D221C]">No orders in database</p>
            <p className="text-[11px]">The store is in fresh launch state. New customer checkouts will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#F4EBE1] bg-[#FAF5EE]/50 text-[#8C7B71] uppercase font-bold text-[10px] tracking-wider">
                  <th className="p-4">Order Info</th>
                  <th className="p-4">Customer Details</th>
                  <th className="p-4">Purchased Items</th>
                  <th className="p-4">Total Amount</th>
                  <th className="p-4">Fulfillment Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F4EBE1]">
                {orders.map((o) => {
                  const safeItems = getNormalizedItems(o.items);

                  return (
                    <tr key={o.id || o.orderNumber} className="hover:bg-[#FAF5EE]/30 transition">
                      <td className="p-4 font-bold font-mono text-[#2D221C]">
                        {o.orderNumber || o.id}
                        <span className="block font-sans text-[10px] font-normal text-[#8C7B71] mt-0.5">
                          {o.date || 'Today'}
                        </span>
                      </td>

                      <td className="p-4">
                        <span className="font-bold text-[#2D221C] block">{o.customerName}</span>
                        <span className="text-[11px] text-[#8C7B71] block">{o.customerPhone || o.phone}</span>
                        <span className="text-[10px] text-[#8C7B71] block max-w-xs truncate">
                          {o.address}, {o.city} - {o.pincode}
                        </span>
                      </td>

                      <td className="p-4">
                        <div className="space-y-1">
                          {safeItems.length > 0 ? (
                            safeItems.map((it: any, idx: number) => (
                              <div key={idx} className="text-[11px] text-[#5C4D44]">
                                <span className="font-semibold">{it.name || 'Handmade Item'}</span>{' '}
                                <span className="text-[#8C7B71]">({it.size || '0-3M'}) × {it.quantity || 1}</span>
                              </div>
                            ))
                          ) : (
                            <span className="text-[11px] text-[#8C7B71]">Standard Package</span>
                          )}
                        </div>
                      </td>

                      <td className="p-4">
                        <span className="font-heading font-extrabold text-sm text-[#2D221C] block">
                          Rs. {Number(o.totalAmount || 0).toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 inline-block mt-0.5">
                          {o.paymentMethod || 'Prepaid / COD'}
                        </span>
                      </td>

                      <td className="p-4">
                        <select
                          value={o.status || 'Pending'}
                          disabled={updatingId === (o.id || o.orderNumber)}
                          onChange={(e) => handleStatusChange(o.id || o.orderNumber, e.target.value)}
                          className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition cursor-pointer ${
                            o.status === 'Delivered'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : o.status === 'Dispatched'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : o.status === 'Packed'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-rose-50 text-[#E11D48] border-rose-200'
                          }`}
                        >
                          <option value="Pending">⏳ Pending</option>
                          <option value="Packed">📦 Packed</option>
                          <option value="Dispatched">🚚 Dispatched</option>
                          <option value="Delivered">✓ Delivered</option>
                        </select>
                      </td>

                      <td className="p-4 text-right">
                        <button
                          onClick={() => handlePrintLabel(o)}
                          className="px-3.5 py-2 bg-[#2D221C] hover:bg-[#E11D48] text-white text-[11px] font-bold rounded-xl transition cursor-pointer shadow-xs inline-flex items-center gap-1.5"
                        >
                          <span>🏷️</span> Print Label
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}