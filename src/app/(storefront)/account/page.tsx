'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { downloadInvoicePdf } from '@/lib/generateInvoice';

export default function CustomerAccountPage() {
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  const [customerOrders, setCustomerOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const savedEmail = localStorage.getItem('wbk_customer_email');
    const verified = localStorage.getItem('wbk_guest_verified') === 'true';

    if (savedEmail && verified) {
      setEmail(savedEmail);
      setIsVerified(true);
      fetchOrders(savedEmail);
    }
  }, []);

  const fetchOrders = async (targetEmail: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders', { cache: 'no-store' });
      if (res.ok) {
        const allOrders = await res.json();
        const clean = targetEmail.trim().toLowerCase();
        const matched = (Array.isArray(allOrders) ? allOrders : []).filter(
          (o) =>
            o.customerEmail?.toLowerCase() === clean ||
            o.email?.toLowerCase() === clean
        );
        setCustomerOrders(matched);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();

      if (res.ok) {
        setOtpSent(true);
        setSuccessMsg(`Verification code sent to ${email}`);
      } else {
        setErrorMsg(data.error || 'Failed to send OTP.');
      }
    } catch (err) {
      setErrorMsg('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (otp.length < 6) {
      setErrorMsg('Please enter the full 6-digit OTP code.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), otp }),
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('wbk_customer_email', email.trim());
        localStorage.setItem('wbk_guest_verified', 'true');
        setIsVerified(true);
        fetchOrders(email.trim());
      } else {
        setErrorMsg(data.error || 'Invalid OTP code.');
      }
    } catch (err) {
      setErrorMsg('Verification failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('wbk_customer_email');
    localStorage.removeItem('wbk_guest_verified');
    setIsVerified(false);
    setOtpSent(false);
    setOtp('');
    setCustomerOrders([]);
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-12 antialiased text-[#2D221C]">
      <div className="text-center space-y-1 mb-8">
        <h1 className="font-heading text-3xl font-extrabold text-[#2D221C]">
          Customer Account & Orders
        </h1>
        <p className="text-xs text-[#8C7B71]">
          {isVerified
            ? `Signed in as ${email}`
            : 'Access your purchases, invoices, and tracking securely via Email OTP.'}
        </p>
      </div>

      {errorMsg && (
        <div className="bg-rose-50 border border-rose-200 text-[#E11D48] text-xs font-bold p-3.5 rounded-2xl mb-6 text-center">
          {errorMsg}
        </div>
      )}

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold p-3.5 rounded-2xl mb-6 text-center">
          {successMsg}
        </div>
      )}

      {!isVerified ? (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F4EBE1] shadow-xs max-w-md mx-auto">
          {!otpSent ? (
            <form onSubmit={handleSendOtp} className="space-y-4 text-xs">
              <h2 className="font-heading font-extrabold text-base text-[#2D221C]">
                Guest Login with OTP
              </h2>
              <p className="text-xs text-[#5C4D44]">
                Enter your email to receive a secure login code.
              </p>
              <div>
                <label className="font-bold text-[#5C4D44] block mb-1">
                  Email Address
                </label>
                <input
                  required
                  type="email"
                  placeholder="yourname@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#FAF5EE] border border-[#EBE2D5] rounded-xl px-4 py-3 text-xs focus:outline-[#E11D48]"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#2D221C] hover:bg-[#E11D48] text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-md disabled:opacity-50"
              >
                {loading ? 'Sending Code...' : 'Send 6-Digit Login Code →'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4 text-xs">
              <h2 className="font-heading font-extrabold text-base text-[#2D221C]">
                Enter Verification Code
              </h2>
              <p className="text-xs text-[#5C4D44]">
                We sent a 6-digit code to <strong>{email}</strong>.
              </p>
              <div>
                <input
                  required
                  type="text"
                  maxLength={6}
                  placeholder="••••••"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full text-center tracking-widest font-mono text-lg font-bold bg-[#FAF5EE] border border-[#EBE2D5] rounded-xl px-4 py-2.5 focus:outline-[#E11D48]"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#E11D48] hover:bg-[#BE123C] text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-md disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Verify & View My Orders →'}
              </button>
              <button
                type="button"
                onClick={() => setOtpSent(false)}
                className="w-full text-center text-[11px] text-[#8C7B71] hover:underline block pt-2"
              >
                Use a different email address
              </button>
            </form>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-[#F4EBE1]">
            <span className="text-xs font-bold text-[#2D221C]">
              Account: {email}
            </span>
            <button
              onClick={handleSignOut}
              className="text-xs font-bold text-[#E11D48] hover:underline cursor-pointer"
            >
              Sign Out
            </button>
          </div>

          <div className="space-y-4">
            <h2 className="font-heading text-lg font-extrabold text-[#2D221C]">
              Your Orders ({customerOrders.length})
            </h2>

            {customerOrders.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 border border-[#F4EBE1] text-center space-y-3">
                <p className="text-xs text-[#8C7B71]">
                  No orders found for this account.
                </p>
                <Link
                  href="/collections/sweaters"
                  className="inline-block px-5 py-2.5 bg-[#2D221C] text-white text-xs font-bold rounded-xl hover:bg-[#E11D48] transition"
                >
                  Start Shopping →
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {customerOrders.map((ord, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-3xl p-6 border border-[#F4EBE1] shadow-2xs space-y-4"
                  >
                    <div className="flex flex-wrap justify-between items-center border-b border-[#F4EBE1] pb-3 gap-2">
                      <div>
                        <span className="font-mono font-bold text-xs text-[#2D221C] block">
                          Order #{ord.orderNumber}
                        </span>
                        <span className="text-[10px] text-[#8C7B71]">
                          Placed on: {ord.date}
                        </span>
                      </div>

                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                          ord.status === 'Delivered'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : ord.status === 'Dispatched'
                            ? 'bg-sky-50 text-sky-700 border border-sky-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {ord.status || 'Pending'}
                      </span>
                    </div>

                    <div className="divide-y divide-[#F4EBE1] text-xs">
                      {(Array.isArray(ord.items) ? ord.items : []).map(
                        (it: any, i: number) => (
                          <div
                            key={i}
                            className="py-2 flex justify-between items-center text-[#5C4D44]"
                          >
                            <span>
                              {it.name} ({it.size || '0-3M'}
                              {it.color ? ` - ${it.color}` : ''}) × {it.quantity}
                            </span>
                            <span className="font-bold text-[#2D221C]">
                              Rs. {(
                                Number(it.price) * Number(it.quantity)
                              ).toLocaleString('en-IN')}
                            </span>
                          </div>
                        )
                      )}
                    </div>

                    <div className="flex flex-wrap justify-between items-center border-t border-[#F4EBE1] pt-3 text-xs gap-3">
                      <div className="space-y-0.5">
                        <span className="text-[#8C7B71] block">
                          Payment:{' '}
                          <strong className="text-[#2D221C]">
                            {ord.paymentMethod}
                          </strong>
                        </span>
                        <span className="font-heading font-extrabold text-sm text-[#2D221C] block">
                          Total: Rs. {Number(ord.totalAmount).toLocaleString('en-IN')}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => downloadInvoicePdf(ord)}
                        className="flex items-center gap-1.5 px-3.5 py-2 bg-[#FAF5EE] hover:bg-[#2D221C] hover:text-white text-[#2D221C] border border-[#EBE2D5] rounded-xl font-bold transition cursor-pointer text-xs"
                      >
                        <span>📄</span>
                        <span>Download Tax Invoice (PDF)</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}