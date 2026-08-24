import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { sendOrderConfirmationEmail } from '@/lib/email';

const dataFilePath = path.join(process.cwd(), 'src', 'data', 'orders.json');

function readOrders(): any[] {
  try {
    if (!fs.existsSync(dataFilePath)) {
      fs.mkdirSync(path.dirname(dataFilePath), { recursive: true });
      fs.writeFileSync(dataFilePath, JSON.stringify([], null, 2), 'utf8');
      return [];
    }
    const file = fs.readFileSync(dataFilePath, 'utf8');
    const parsed = JSON.parse(file);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Error reading orders.json:', error);
    return [];
  }
}

function writeOrders(orders: any[]) {
  try {
    fs.mkdirSync(path.dirname(dataFilePath), { recursive: true });
    fs.writeFileSync(dataFilePath, JSON.stringify(orders, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing orders.json:', error);
  }
}

// GET all orders
export async function GET() {
  const orders = readOrders();
  return NextResponse.json(orders);
}

// POST new order (from checkout)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const orders = readOrders();

    const userPhone = body.phone || body.customerPhone || '';
    const userEmail = body.email || body.customerEmail || '';

    // Convert raw array items into formatted string for email template
    const rawItems = Array.isArray(body.items) ? body.items : [];
    const formattedItemsString =
      rawItems.length > 0
        ? rawItems
            .map(
              (it: any) =>
                `${it.name} (${it.size || '0-3M'}${it.color ? ` - ${it.color}` : ''}) × ${it.quantity}`
            )
            .join(', ')
        : 'Handcrafted Baby Knitwear Set';

    const newOrder = {
      id: body.id || `WBK-${Math.floor(1000 + Math.random() * 9000)}`,
      orderNumber: body.orderNumber || body.id || `WBK-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: body.customerName || 'Customer',
      email: userEmail,
      customerEmail: userEmail,
      phone: userPhone,
      customerPhone: userPhone,
      address: body.address || '',
      city: body.city || '',
      pincode: body.pincode || '',
      items: rawItems,
      totalAmount: Number(body.totalAmount) || 0,
      paymentMethod: body.paymentMethod || 'COD',
      status: body.status || 'Pending',
      date: body.date || new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
    };

    orders.unshift(newOrder);
    writeOrders(orders);

    // Dispatch email with matching OrderEmailData format
    if (newOrder.email) {
      sendOrderConfirmationEmail({
        orderNumber: newOrder.orderNumber,
        customerName: newOrder.customerName,
        customerEmail: newOrder.email,
        customerPhone: newOrder.phone,
        address: newOrder.address,
        city: newOrder.city,
        pincode: newOrder.pincode,
        items: formattedItemsString,
        totalAmount: newOrder.totalAmount,
        paymentMethod: newOrder.paymentMethod,
        status: newOrder.status,
      })
        .then((res) => {
          if (res.success) {
            console.log(`✅ Order receipt dispatched to ${newOrder.email}`);
          } else {
            console.warn(`⚠️ Email skipped/failed: ${res.reason || res.error}`);
          }
        })
        .catch((err) => {
          console.error('❌ Email error:', err);
        });
    }

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to place order' }, { status: 500 });
  }
}

// PUT update order status lifecycle (Pending -> Packed -> Dispatched -> Delivered)
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'Missing id or status' }, { status: 400 });
    }

    const orders = readOrders();
    const orderIndex = orders.findIndex(
      (o) => String(o.id) === String(id) || String(o.orderNumber) === String(id)
    );

    if (orderIndex === -1) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    orders[orderIndex].status = status;
    writeOrders(orders);

    return NextResponse.json(orders[orderIndex]);
  } catch (error) {
    console.error('Error updating order status:', error);
    return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 });
  }
}

// DELETE purge all orders (resets database to 0 for fresh store launch)
export async function DELETE() {
  try {
    writeOrders([]);
    return NextResponse.json({ success: true, message: 'All orders reset to 0' });
  } catch (error) {
    console.error('Error resetting orders:', error);
    return NextResponse.json({ error: 'Failed to reset orders' }, { status: 500 });
  }
}