export function exportOrdersToCsv(orders: any[]) {
  if (!orders || orders.length === 0) {
    alert('No orders available to export.');
    return;
  }

  const headers = [
    'Order Number',
    'Date',
    'Customer Name',
    'Customer Email',
    'Customer Phone',
    'Shipping Address',
    'City',
    'PIN Code',
    'Payment Method',
    'Status',
    'Total Amount (INR)',
    'Items Summary'
  ];

  const escapeCell = (cell: any) => {
    if (cell === null || cell === undefined) return '""';
    const str = String(cell).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = orders.map((ord) => {
    const rawItems = ord.items || ord.cart || ord.products || [];
    const itemsSummary = (Array.isArray(rawItems) ? rawItems : [])
      .map((it: any) => `${it.name || it.title} (${it.size || '0-3M'}) x ${it.quantity || 1}`)
      .join(' | ');

    return [
      escapeCell(ord.orderNumber || ord.id || ''),
      escapeCell(ord.date || ord.createdAt || ''),
      escapeCell(ord.customerName || ord.name || ''),
      escapeCell(ord.customerEmail || ord.email || ''),
      escapeCell(ord.customerPhone || ord.phone || ''),
      escapeCell(ord.address || ord.shippingAddress || ''),
      escapeCell(ord.city || ''),
      escapeCell(ord.pincode || ord.postalCode || ''),
      escapeCell(ord.paymentMethod || 'COD'),
      escapeCell(ord.status || 'Pending'),
      escapeCell(ord.totalAmount || ord.total || 0),
      escapeCell(itemsSummary)
    ].join(',');
  });

  const csvContent = [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Woolberry_Orders_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}