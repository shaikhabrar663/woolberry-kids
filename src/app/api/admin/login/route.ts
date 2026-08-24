import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const expectedEmail = process.env.ADMIN_EMAIL || 'admin@woolberry.com';
    const expectedPassword = process.env.ADMIN_PASSWORD || 'woolberry2026';

    if (
      email?.trim().toLowerCase() !== expectedEmail.toLowerCase() ||
      password?.trim() !== expectedPassword
    ) {
      return NextResponse.json(
        { success: false, error: 'Invalid admin credentials' },
        { status: 401 }
      );
    }

    const jwtSecret =
      process.env.JWT_SECRET || 'woolberry_super_secret_signing_key_32_chars';
    const secret = new TextEncoder().encode(jwtSecret);

    const token = await new SignJWT({
      email: expectedEmail,
      role: 'admin',
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(secret);

    const isProduction = process.env.NODE_ENV === 'production';

    const response = NextResponse.json({ success: true });

    response.cookies.set('wbk_admin_token', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Authentication failed' },
      { status: 500 }
    );
  }
}