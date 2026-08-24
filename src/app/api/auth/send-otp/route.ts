import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { saveOtp } from '@/lib/otpStore';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required.' }, { status: 400 });
    }

    // Generate 6-digit random code
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    saveOtp(email, otp, 5);

    const smtpEmail = process.env.SMTP_EMAIL;
    const smtpPassword = process.env.SMTP_PASSWORD;

    if (!smtpEmail || !smtpPassword) {
      console.log(`[DEV MODE] OTP for ${email}: ${otp}`);
      return NextResponse.json({
        success: true,
        message: 'OTP generated. (SMTP not configured in local environment)',
      });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: smtpEmail,
        pass: smtpPassword,
      },
    });

    const mailOptions = {
      from: `"Woolberry Kids" <${smtpEmail}>`,
      to: email,
      subject: `${otp} is your Woolberry Kids Verification Code`,
      html: `
        <div style="font-family: Arial, sans-serif; background: #FAF5EE; padding: 30px; color: #2D221C;">
          <div style="max-width: 480px; margin: 0 auto; background: #FFFFFF; border-radius: 20px; padding: 25px; border: 1px solid #F4EBE1; text-align: center;">
            <div style="width: 44px; height: 44px; background: #2D221C; color: #FAF5EE; border-radius: 12px; font-weight: 900; font-size: 18px; line-height: 44px; margin: 0 auto 15px;">W</div>
            <h2 style="margin: 0 0 10px; font-size: 20px; color: #2D221C;">Verify Your Identity</h2>
            <p style="font-size: 13px; color: #8C7B71; margin-bottom: 25px;">Use the verification code below to authenticate your guest session and confirm your order.</p>
            
            <div style="background: #FAF5EE; border: 2px dashed #E11D48; border-radius: 14px; padding: 15px; margin-bottom: 20px;">
              <span style="font-size: 32px; font-weight: 900; letter-spacing: 6px; color: #E11D48; font-family: monospace;">${otp}</span>
            </div>
            
            <p style="font-size: 11px; color: #8C7B71; margin: 0;">This code will expire in <strong>5 minutes</strong>. If you did not request this, please ignore this email.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: 'OTP sent successfully to your email.' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    return NextResponse.json({ error: 'Failed to send OTP email.' }, { status: 500 });
  }
}