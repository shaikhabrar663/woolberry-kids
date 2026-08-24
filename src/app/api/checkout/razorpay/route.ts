export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { prisma } from '@/lib/prisma';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'rzp_secret_placeholder',
});

export async function POST(req: Request) {
  try {
    const { items, customer, shippingAddress } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // Verify prices on server against DB to prevent client-side tampering
    let calculatedTotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const dbProduct = await prisma.product.findUnique({
        where: { id: item.productId },
        include: { variants: { where: { sku: item.sku } } }
      });

      if (!dbProduct || dbProduct.variants.length === 0) {
        return NextResponse.json({ error: `Product variant not found: ${item.sku}` }, { status: 404 });
      }

      const variant = dbProduct.variants[0];
      if (variant.inventory < item.quantity) {
        return NextResponse.json({ error: `Insufficient inventory for ${dbProduct.name}` }, { status: 400 });
      }

      calculatedTotal += Number(dbProduct.basePrice) * item.quantity;
      validatedItems.push({
        productId: dbProduct.id,
        sku: variant.sku,
        title: dbProduct.name,
        variantAge: variant.ageGroup,
        unitPrice: dbProduct.basePrice,
        quantity: item.quantity
      });
    }

    const shippingCharge = calculatedTotal >= 999 ? 0 : 99;
    const finalPayable = calculatedTotal + shippingCharge;

    const rzpOrder = await razorpay.orders.create({
      amount: Math.round(finalPayable * 100), // Amount in paise
      currency: 'INR',
      receipt: `wb_${Date.now()}`,
    });

    const newOrder = await prisma.order.create({
      data: {
        orderNumber: `WB-${Math.floor(100000 + Math.random() * 900000)}`,
        customerEmail: customer.email,
        customerPhone: customer.phone,
        shippingAddress: shippingAddress,
        totalAmount: finalPayable,
        shippingAmount: shippingCharge,
        razorpayOrderId: rzpOrder.id,
        items: {
          create: validatedItems
        }
      }
    });

    return NextResponse.json({
      orderId: newOrder.id,
      orderNumber: newOrder.orderNumber,
      razorpayOrderId: rzpOrder.id,
      amount: rzpOrder.amount,
      currency: rzpOrder.currency,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Payment initiation failed' }, { status: 500 });
  }
}