import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'src', 'data', 'products.json');

function readProducts(): any[] {
  try {
    if (!fs.existsSync(dataFilePath)) {
      return [];
    }
    const file = fs.readFileSync(dataFilePath, 'utf8');
    const parsed = JSON.parse(file);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Error reading products.json:', error);
    return [];
  }
}

function writeProducts(products: any[]) {
  try {
    fs.mkdirSync(path.dirname(dataFilePath), { recursive: true });
    fs.writeFileSync(dataFilePath, JSON.stringify(products, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing products.json:', error);
  }
}

export async function GET() {
  const products = readProducts();
  return NextResponse.json(products);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const products = readProducts();

    const cleanProduct = {
      ...body,
      stock: Number.isFinite(Number(body.stock)) ? Number(body.stock) : 0,
      price: Number.isFinite(Number(body.price)) ? Number(body.price) : 0,
      mrp: Number.isFinite(Number(body.mrp)) ? Number(body.mrp) : Number(body.price || 0),
    };

    const targetId = String(cleanProduct.id || cleanProduct.slug || '');
    const existingIndex = products.findIndex(
      (p) => String(p.id) === targetId || String(p.slug) === targetId
    );

    if (existingIndex > -1) {
      products[existingIndex] = { ...products[existingIndex], ...cleanProduct };
    } else {
      products.unshift(cleanProduct);
    }

    writeProducts(products);
    return NextResponse.json(cleanProduct, { status: 200 });
  } catch (error) {
    console.error('Error creating/updating product:', error);
    return NextResponse.json({ error: 'Failed to save product' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing product ID' }, { status: 400 });
    }

    const products = readProducts();
    const filtered = products.filter(
      (p) => String(p.id) !== String(id) && String(p.slug) !== String(id)
    );
    writeProducts(filtered);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}