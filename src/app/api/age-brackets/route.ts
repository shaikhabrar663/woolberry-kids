import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'src', 'data', 'age-brackets.json');

const DEFAULT_AGE_BRACKETS = [
  { id: 'newborn', title: 'Newborn', age: '0 to 3 Months', badge: 'ULTRA SOFT', image: '/images/categories/newborn.jpg' },
  { id: 'little-baby', title: 'Little Baby', age: '3 to 6 Months', badge: 'COZY CRAWL', image: '/images/categories/little-baby.jpg' },
  { id: 'growing-baby', title: 'Growing Baby', age: '6 to 12 Months', badge: 'ACTIVE PLAY', image: '/images/categories/growing-baby.jpg' },
  { id: 'toddler', title: 'Tiny Toddler', age: '1 to 2 Years', badge: 'LITTLE STEPS', image: '/images/categories/toddler.jpg' },
  { id: 'explorer', title: 'Explorer', age: '2 to 3 Years', badge: 'CURIOUS DAYS', image: '/images/categories/explorer.jpg' },
  { id: 'big-kid', title: 'Heirloom Gifts', age: 'All Ages (0-5Y)', badge: 'GIFT BOXES', image: '/images/categories/big-kid.jpg' },
];

function readBrackets(): any[] {
  try {
    if (fs.existsSync(dataFilePath)) {
      const data = fs.readFileSync(dataFilePath, 'utf8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Error reading age-brackets.json:', e);
  }
  return DEFAULT_AGE_BRACKETS;
}

function writeBrackets(data: any[]) {
  try {
    fs.mkdirSync(path.dirname(dataFilePath), { recursive: true });
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {
    console.warn('Filesystem write skipped in production environment');
  }
}

export async function GET() {
  const brackets = readBrackets();
  return NextResponse.json(brackets, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    },
  });
}

export async function PUT(req: Request) {
  try {
    const updatedBrackets = await req.json();
    if (Array.isArray(updatedBrackets)) {
      writeBrackets(updatedBrackets);
      return NextResponse.json({ success: true, data: updatedBrackets });
    }
    return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to update age brackets' }, { status: 500 });
  }
}