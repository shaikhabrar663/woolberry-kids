import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'src', 'data', 'categories.json');

const DEFAULT_CATEGORIES = [
  {
    id: 'newborn',
    title: 'Newborn',
    age: '0 to 3 Months',
    tag: 'ULTRA SOFT',
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&q=80',
    slug: '0-3m',
  },
  {
    id: 'little-baby',
    title: 'Little Baby',
    age: '3 to 6 Months',
    tag: 'COZY CRAWL',
    image: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=800&q=80',
    slug: '3-6m',
  },
  {
    id: 'growing-baby',
    title: 'Growing Baby',
    age: '6 to 12 Months',
    tag: 'ACTIVE PLAY',
    image: 'https://images.unsplash.com/photo-1544126592-807ade215a0b?w=800&q=80',
    slug: '6-12m',
  },
  {
    id: 'tiny-toddler',
    title: 'Tiny Toddler',
    age: '1 to 2 Years',
    tag: 'LITTLE STEPS',
    image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800&q=80',
    slug: '1-2y',
  },
  {
    id: 'explorer',
    title: 'Explorer',
    age: '2 to 5 Years',
    tag: 'CURIOUS DAYS',
    image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&q=80',
    slug: '2-5y',
  },
  {
    id: 'gift-sets',
    title: 'Heirloom Gifts',
    age: 'All Ages (0-5Y)',
    tag: 'GIFT BOXES',
    image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&q=80',
    slug: 'gift-sets',
  },
];

function readCategories(): any[] {
  try {
    if (!fs.existsSync(dataFilePath)) {
      writeCategories(DEFAULT_CATEGORIES);
      return DEFAULT_CATEGORIES;
    }

    const file = fs.readFileSync(dataFilePath, 'utf8');
    const parsed = JSON.parse(file);

    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }

    writeCategories(DEFAULT_CATEGORIES);
    return DEFAULT_CATEGORIES;
  } catch (error) {
    console.error('Error reading categories.json:', error);
    return DEFAULT_CATEGORIES;
  }
}

function writeCategories(data: any[]) {
  try {
    fs.mkdirSync(path.dirname(dataFilePath), { recursive: true });
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing categories.json:', error);
  }
}

export async function GET() {
  const data = readCategories();
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  try {
    const newCard = await req.json();
    const data = readCategories();
    data.push(newCard);
    writeCategories(data);
    return NextResponse.json(newCard, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create showcase card' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const updatedCard = await req.json();
    const data = readCategories();
    const index = data.findIndex((item) => String(item.id) === String(updatedCard.id));

    if (index > -1) {
      data[index] = { ...data[index], ...updatedCard };
      writeCategories(data);
      return NextResponse.json(data[index]);
    }
    return NextResponse.json({ error: 'Card not found' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update showcase card' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing card ID' }, { status: 400 });
    }

    const data = readCategories();
    const filtered = data.filter((item) => String(item.id) !== String(id));
    writeCategories(filtered);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete card' }, { status: 500 });
  }
}