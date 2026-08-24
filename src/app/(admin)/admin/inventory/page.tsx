'use client';

import React, { useState, useEffect } from 'react';

export default function AdminInventoryPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      const res = await fetch('/api/products', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        const cleanProducts = (Array.isArray(data) ? data : []).map((p) => ({
          ...p,
          stock: Number.isFinite(Number(p.stock)) ? Number(p.stock) : 0,
        }));
        setProducts(cleanProducts);
      }
    } catch (e) {
      console.error('Failed to load inventory:', e);
    }
  };

  const updateStock = async (product: any, delta: number) => {
    const prodId = product.id || product.slug;
    const currentStock = Number.isFinite(Number(product.stock)) ? Number(product.stock) : 0;
    const newStock = Math.max(0, currentStock + delta);

    setUpdatingId(prodId);

    // Optimistic UI update
    setProducts((prev) =>
      prev.map((p) => ((p.id || p.slug) === prodId ? { ...p, stock: newStock } : p))
    );

    try {
      const updatedProduct = {
        ...product,
        stock: newStock,
      };

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProduct),
      });

      if (!res.ok) {
        throw new Error('Failed to update stock on server');
      }
    } catch (e) {
      console.error('Failed to persist stock update:', e);
      loadInventory(); // Rollback on error
    } finally {
      setUpdatingId(null);
    }
  };

  const totalStock = products.reduce(
    (sum, p) => sum + (Number.isFinite(Number(p.stock)) ? Number(p.stock) : 0),
    0
  );
  
  const lowStockCount = products.filter((p) => {
    const s = Number.isFinite(Number(p.stock)) ? Number(p.stock) : 0;
    return s > 0 && s <= 5;
  }).length;

  return (
    <div className="space-y-6 antialiased text-[#2D221C]">
      {/* Page Header */}
      <div>
        <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#2D221C]">
          Inventory & Stock Control
        </h1>
        <p className="text-xs text-[#8C7B71] mt-0.5">
          Real-time handknit pieces in stock, low-stock warnings, and unit allocation.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-[#F4EBE1] shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-[#8C7B71] tracking-wider block">
            Total Stock Available
          </span>
          <div className="font-heading font-extrabold text-2xl text-[#2D221C] mt-1">
            {totalStock} <span className="text-xs font-normal text-[#8C7B71]">units</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#F4EBE1] shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-[#8C7B71] tracking-wider block">
            Total Active SKUs
          </span>
          <div className="font-heading font-extrabold text-2xl text-[#2D221C] mt-1">
            {products.length} <span className="text-xs font-normal text-[#8C7B71]">Products</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#F4EBE1] shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-[#8C7B71] tracking-wider block">
            Low Stock Alerts
          </span>
          <div
            className={`font-heading font-extrabold text-2xl mt-1 ${
              lowStockCount > 0 ? 'text-amber-600' : 'text-emerald-700'
            }`}
          >
            {lowStockCount} <span className="text-xs font-normal text-[#8C7B71]">Products</span>
          </div>
        </div>
      </div>

      {/* Stock Management Table */}
      <div className="bg-white rounded-3xl border border-[#F4EBE1] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#F4EBE1] bg-[#FAF5EE]/50 text-[#8C7B71] uppercase font-bold text-[10px] tracking-wider">
                <th className="p-4">Product Details</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock Status</th>
                <th className="p-4 text-center">Units in Hand</th>
                <th className="p-4 text-right">Quick Adjust</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4EBE1]">
              {products.map((p) => {
                const stockQty = Number.isFinite(Number(p.stock)) ? Number(p.stock) : 0;
                const isOutOfStock = stockQty === 0;
                const isLowStock = stockQty > 0 && stockQty <= 5;
                const currentId = p.id || p.slug;

                return (
                  <tr key={currentId} className="hover:bg-[#FAF5EE]/30 transition">
                    <td className="p-4 flex items-center gap-3">
                      <img
                        src={p.image || (p.images && p.images[0])}
                        alt={p.name}
                        className="w-10 h-10 rounded-xl object-cover border border-[#F4EBE1] shrink-0"
                      />
                      <div>
                        <span className="font-bold text-[#2D221C] block">{p.name}</span>
                        <span className="text-[10px] text-[#8C7B71] font-mono">
                          SKU: WBK-{p.id || 'PROD'}
                        </span>
                      </div>
                    </td>

                    <td className="p-4 font-medium text-[#5C4D44]">{p.category}</td>

                    <td className="p-4 font-heading font-extrabold text-[#2D221C]">
                      Rs. {Number(p.price).toLocaleString('en-IN')}
                    </td>

                    <td className="p-4">
                      {isOutOfStock ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-50 text-[#E11D48] border border-rose-200 inline-block">
                          Out of Stock
                        </span>
                      ) : isLowStock ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 inline-block">
                          Low Stock ({stockQty})
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 inline-block">
                          In Stock
                        </span>
                      )}
                    </td>

                    <td className="p-4 text-center font-heading font-extrabold text-sm text-[#2D221C]">
                      {stockQty}
                    </td>

                    <td className="p-4 text-right">
                      <div className="inline-flex items-center gap-2 bg-[#FAF5EE] border border-[#EBE2D5] rounded-xl p-1">
                        <button
                          type="button"
                          disabled={stockQty <= 0 || updatingId === currentId}
                          onClick={() => updateStock(p, -1)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg bg-white text-[#2D221C] font-bold hover:bg-[#E11D48] hover:text-white transition disabled:opacity-30 cursor-pointer shadow-2xs"
                        >
                          -
                        </button>
                        <span className="font-mono font-bold text-xs px-2 text-[#2D221C] min-w-[20px] text-center">
                          {stockQty}
                        </span>
                        <button
                          type="button"
                          disabled={updatingId === currentId}
                          onClick={() => updateStock(p, 1)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg bg-white text-[#2D221C] font-bold hover:bg-emerald-600 hover:text-white transition disabled:opacity-30 cursor-pointer shadow-2xs"
                        >
                          +
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}