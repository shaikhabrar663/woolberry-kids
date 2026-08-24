import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    return NextResponse.json({ status: 'received', event: payload?.event || 'test' }, { status: 200 });
  } catch {
    return NextResponse.json({ status: 'ignored' }, { status: 200 });
  }
}

export async function GET() {
  return NextResponse.json({ status: 'active' }, { status: 200 });
}
