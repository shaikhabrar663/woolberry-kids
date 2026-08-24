import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'src', 'data', 'banner.json');

const defaultBanner = {
  tag: 'Handcrafted With Love',
  headlineStart: 'Handmade crochet &',
  headlineHighlight: 'woollen winterwear.',
  description:
    '100% skin-safe, zero-scratch organic merino & cotton yarns designed for gentle baby comfort from newborn to 5 years.',
  featuredOutfitTitle: 'Handmade Red Bow Dungaree Knit Dress',
  featuredOutfitPrice: '1,199',
  featuredOutfitLink: '/products/pointelle-vintage-coconut-button-sweater',
  image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&q=80',
};

function readBannerData() {
  try {
    if (!fs.existsSync(dataFilePath)) {
      fs.mkdirSync(path.dirname(dataFilePath), { recursive: true });
      fs.writeFileSync(dataFilePath, JSON.stringify(defaultBanner, null, 2), 'utf8');
      return defaultBanner;
    }
    const file = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(file);
  } catch {
    return defaultBanner;
  }
}

export async function GET() {
  const data = readBannerData();
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const updated = { ...readBannerData(), ...body };
    fs.writeFileSync(dataFilePath, JSON.stringify(updated, null, 2), 'utf8');
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Failed to update banner' }, { status: 500 });
  }
}