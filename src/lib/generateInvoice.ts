import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export function downloadInvoicePdf(order: any) {
  const doc = new jsPDF();

  // 1. Header Banner
  doc.setFillColor(45, 34, 28); // #2D221C
  doc.rect(0, 0, 210, 34, 'F');

  doc.setTextColor(250, 245, 238);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('WOOLBERRY KIDS', 14, 18);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.text('Handcrafted Luxury Organic Baby Knitwear', 14, 25);
  doc.text('GSTIN: 27AABCU9603R1ZM • support@woolberrykids.com', 14, 30);

  doc.setFontSize(15);
  doc.setFont('helvetica', 'bold');
  doc.text('TAX INVOICE', 196, 21, { align: 'right' });

  // 2. Customer & Invoice Info Blocks
  doc.setTextColor(45, 34, 28);

  // Left Column - Billed To
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'bold');
  doc.text('BILLED TO / DELIVER TO:', 14, 44);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  const name = order.customerName || order.name || 'Valued Customer';
  const email = order.customerEmail || order.email || '';
  const phone = order.customerPhone || order.phone || '';
  const address = order.address || order.shippingAddress || '';
  const city = order.city || '';
  const pincode = order.pincode || order.postalCode || '';

  doc.text(name, 14, 50);
  if (email) doc.text(email, 14, 55);
  if (phone) doc.text(`+91 ${phone.replace(/^\+91/, '')}`, 14, 60);
  
  const fullAddress = [address, city, pincode ? `- ${pincode}` : ''].filter(Boolean).join(', ');
  const splitAddress = doc.splitTextToSize(fullAddress || 'India', 85);
  doc.text(splitAddress, 14, 65);

  // Right Column - Invoice Details
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text('INVOICE DETAILS:', 130, 44);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Invoice No:`, 130, 50);
  doc.setFont('helvetica', 'bold');
  doc.text(`${order.orderNumber || order.id || 'WBK-7486'}`, 160, 50);

  doc.setFont('helvetica', 'normal');
  doc.text(`Order Date:`, 130, 55);
  doc.text(`${order.date || order.createdAt || new Date().toISOString().split('T')[0]}`, 160, 55);

  doc.text(`Payment Mode:`, 130, 60);
  doc.text(`${order.paymentMethod || 'Cash on Delivery (COD)'}`, 160, 60);

  doc.text(`Order Status:`, 130, 65);
  doc.setFont('helvetica', 'bold');
  doc.text(`${order.status || 'Confirmed'}`, 160, 65);

  // 3. Normalize Order Items (handles any array shape)
  const rawItems = order.items || order.cart || order.products || order.orderItems || order.cartItems || [];
  
  let totalCalculated = 0;
  const tableData = (Array.isArray(rawItems) ? rawItems : []).map((it: any, index: number) => {
    const title = it.name || it.title || it.productName || 'Handcrafted Knitwear';
    const size = it.size || '0-3M';
    const color = it.color ? ` • Shade: ${it.color}` : '';
    const qty = Number(it.quantity || it.qty || 1);
    const price = Number(it.price || it.unitPrice || 0);
    const amount = qty * price;
    totalCalculated += amount;

    return [
      index + 1,
      `${title}\nSize: ${size}${color}`,
      qty,
      `Rs. ${price.toLocaleString('en-IN')}`,
      `Rs. ${amount.toLocaleString('en-IN')}`,
    ];
  });

  // Fallback if raw items array was missing
  if (tableData.length === 0) {
    const fallbackPrice = Number(order.totalAmount || order.total || 1199);
    tableData.push([
      1,
      `Handcrafted Luxury Knitwear Set\nSize: Standard 0-3M`,
      1,
      `Rs. ${fallbackPrice.toLocaleString('en-IN')}`,
      `Rs. ${fallbackPrice.toLocaleString('en-IN')}`,
    ]);
  }

  // 4. Render Table
  autoTable(doc, {
    startY: 82,
    head: [['#', 'Item Description', 'Qty', 'Unit Price', 'Total Amount']],
    body: tableData,
    headStyles: {
      fillColor: [45, 34, 28],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9,
    },
    styles: {
      fontSize: 8.5,
      cellPadding: 4,
      textColor: [45, 34, 28],
      lineColor: [244, 235, 225],
      lineWidth: 0.5,
    },
    alternateRowStyles: {
      fillColor: [255, 253, 249],
    },
    columnStyles: {
      0: { cellWidth: 12, halign: 'center' },
      1: { cellWidth: 95 },
      2: { cellWidth: 18, halign: 'center' },
      3: { cellWidth: 35, halign: 'right' },
      4: { cellWidth: 35, halign: 'right' },
    },
  });

  // 5. Calculate Subtotal, Tax Breakdown & Grand Total
  const finalY = (doc as any).lastAutoTable.finalY + 8;
  const grandTotal = Number(order.totalAmount || order.total || totalCalculated || 1199);
  const shippingCharge = grandTotal >= 999 ? 0 : 99;
  const subtotal = Math.max(0, grandTotal - shippingCharge);
  const gstAmount = Math.round((subtotal * 5) / 105); // 5% GST on Apparel

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');

  doc.text('Items Subtotal:', 135, finalY);
  doc.text(`Rs. ${(subtotal - gstAmount).toLocaleString('en-IN')}`, 196, finalY, { align: 'right' });

  doc.text('GST (5% Apparel Included):', 135, finalY + 5);
  doc.text(`Rs. ${gstAmount.toLocaleString('en-IN')}`, 196, finalY + 5, { align: 'right' });

  doc.text('Shipping & Handling:', 135, finalY + 10);
  doc.text(shippingCharge === 0 ? 'FREE' : `Rs. ${shippingCharge}`, 196, finalY + 10, { align: 'right' });

  doc.setDrawColor(235, 226, 213);
  doc.setLineWidth(0.5);
  doc.line(135, finalY + 13, 196, finalY + 13);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Grand Total:', 135, finalY + 19);
  doc.text(`Rs. ${grandTotal.toLocaleString('en-IN')}`, 196, finalY + 19, { align: 'right' });

  // 6. Authorized Signatory & Notes
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('Terms & Conditions:', 14, finalY + 8);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(140, 123, 113);
  doc.text('• 7-day hassle-free exchange on unused items with tags intact.', 14, finalY + 13);
  doc.text('• Certified 100% organic, baby-safe materials & zero-itch guarantee.', 14, finalY + 17);

  // 7. Footer
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(140, 123, 113);
  doc.text(
    'Thank you for choosing Woolberry Kids. For assistance, WhatsApp us or email support@woolberrykids.com',
    105,
    285,
    { align: 'center' }
  );

  doc.save(`Invoice_${order.orderNumber || 'WBK'}.pdf`);
}