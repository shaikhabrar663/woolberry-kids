interface OtpEntry {
  otp: string;
  expiresAt: number;
}

// Global in-memory map for OTP storage
const otpCache = new Map<string, OtpEntry>();

export function saveOtp(target: string, otp: string, ttlMinutes = 5) {
  const cleanTarget = target.trim().toLowerCase();
  const expiresAt = Date.now() + ttlMinutes * 60 * 1000;
  otpCache.set(cleanTarget, { otp, expiresAt });
}

export function verifyOtp(target: string, enteredOtp: string): { valid: boolean; message: string } {
  const cleanTarget = target.trim().toLowerCase();
  const record = otpCache.get(cleanTarget);

  if (!record) {
    return { valid: false, message: 'OTP not requested or has expired. Please request a new one.' };
  }

  if (Date.now() > record.expiresAt) {
    otpCache.delete(cleanTarget);
    return { valid: false, message: 'OTP has expired. Please request a new code.' };
  }

  if (record.otp !== enteredOtp.trim()) {
    return { valid: false, message: 'Incorrect OTP. Please check and try again.' };
  }

  // Clear OTP after successful use
  otpCache.delete(cleanTarget);
  return { valid: true, message: 'Verified successfully' };
}