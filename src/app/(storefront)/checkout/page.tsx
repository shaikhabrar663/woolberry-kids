'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Script from 'next/script';
import { useStore } from '@/context/StoreContext';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartTotal, clearCart } = useStore();

  // Guest Identity & OTP States
  const [isGuestVerified, setIsGuestVerified] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  const [otpSent, setOtpSent] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  // Shipping details
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'RAZORPAY'>('COD');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const shippingFee = cartTotal >= 999 ? 0 : 99;
  const finalAmount = cartTotal + shippingFee;

  // Auto-detect verified guest session
  useEffect(() => {
    try {
      const savedEmail = localStorage.getItem('wbk_customer_email');
      const savedName = localStorage.getItem('wbk_customer_name');
      const savedPhone = localStorage.getItem('wbk_customer_phone');
      const verified = localStorage.getItem('wbk_guest_verified') === 'true';

      if (savedEmail && savedPhone && verified) {
        setCustomerEmail(savedEmail);
        setCustomerPhone(savedPhone);
        if (savedName) setCustomerName(savedName);
        setIsGuestVerified(true);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!customerName.trim() || !customerEmail.trim() || !customerPhone.trim()) {
      setErrorMsg('Please fill in your name, email, and mobile number.');
      return;
    }

    if (!customerEmail.includes('@') || customerPhone.length < 10) {
      setErrorMsg('Please enter a valid email and 10-digit mobile number.');
      return;
    }

    setSendingOtp(true);
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: customerEmail }),
      });
      const data = await res.json();

      if (res.ok) {
        setOtpSent(true);
        setSuccessMsg(`A 6-digit verification code was sent to ${customerEmail}`);
      } else {
        setErrorMsg(data.error || 'Failed to send OTP.');
      }
    } catch (err) {
      setErrorMsg('Network error. Please try again.');
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (enteredOtp.length < 6) {
      setErrorMsg('Please enter the complete 6-digit OTP code.');
      return;
    }

    setVerifyingOtp(true);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: customerEmail, otp: enteredOtp }),
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('wbk_customer_email', customerEmail.trim());
        localStorage.setItem('wbk_customer_name', customerName.trim());
        localStorage.setItem('wbk_customer_phone', customerPhone.trim());
        localStorage.setItem('wbk_guest_verified', 'true');
        setIsGuestVerified(true);
        setSuccessMsg('Email verified successfully! You can now complete your order.');
      } else {
        setErrorMsg(data.error || 'Invalid OTP code.');
      }
    } catch (err) {
      setErrorMsg('Verification failed. Try again.');
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handleSwitchAccount = () => {
    localStorage.removeItem('wbk_customer_email');
    localStorage.removeItem('wbk_customer_name');
    localStorage.removeItem('wbk_customer_phone');
    localStorage.removeItem('wbk_guest_verified');
    setIsGuestVerified(false);
    setOtpSent(false);
    setEnteredOtp('');
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!isGuestVerified) {
      setErrorMsg('Please verify your email with OTP before proceeding.');
      return;
    }

    if (!address.trim() || !city.trim() || !pincode.trim()) {
      setErrorMsg('Please fill in complete shipping address details.');
      return;
    }

    setLoading(true);

    const orderPayload = {
      orderNumber: `WBK-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName,
      customerEmail,
      customerPhone,
      address,
      city,
      pincode,
      items: cart,
      totalAmount: finalAmount,
      paymentMethod: paymentMethod === 'COD' ? 'Cash on Delivery' : 'Prepaid (Razorpay)',
      status: 'Pending',
      date: new Date().toISOString().split('T')[0],
    };

    if (paymentMethod === 'COD') {
      try {
        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderPayload),
        });

        if (res.ok) {
          clearCart();
          router.push('/account');
        } else {
          setErrorMsg('Failed to create order. Please try again.');
        }
      } catch (err) {
        setErrorMsg('Network error. Please try again.');
      } finally {
        setLoading(false);
      }
      return;
    }

    // Razorpay Flow
    try {
      const razorpayRes = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: finalAmount }),
      });

      const rzpData = await razorpayRes.json();

      if (!razorpayRes.ok || !rzpData.id) {
        setErrorMsg('Unable to initialize payment gateway.');
        setLoading(false);
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
        amount: rzpData.amount,
        currency: 'INR',
        name: 'Woolberry Kids',
        description: `Order ${orderPayload.orderNumber}`,
        order_id: rzpData.id,
        handler: async function (response: any) {
          const finalRes = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...orderPayload,
              paymentId: response.razorpay_payment_id,
              status: 'Paid',
            }),
          });

          if (finalRes.ok) {
            clearCart();
            router.push('/account');
          }
        },
        prefill: {
          name: customerName,
          email: customerEmail,
          contact: customerPhone,
        },
        theme: { color: '#2D221C' },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    } catch (err) {
      setErrorMsg('Payment gateway error. Please choose Cash on Delivery.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-16 text-center antialiased text-[#2D221C] space-y-4">
        <h1 className="font-heading text-3xl font-extrabold">Your Bag is Empty</h1>
        <p className="text-xs text-[#8C7B71]">Add items to your bag before proceeding to checkout.</p>
        <Link
          href="/collections/all"
          className="inline-block px-6 py-3 bg-[#2D221C] hover:bg-[#E11D48] text-white text-xs font-bold rounded-xl transition"
        >
          Shop Now →
        </Link>
      </main>
    );
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      <main className="max-w-5xl mx-auto px-4 py-10 antialiased text-[#2D221C]">
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-extrabold text-[#2D221C]">Secure Checkout</h1>
          <p className="text-xs text-[#8C7B71] mt-1">
            Handcrafted luxury knitwear delivered directly to your doorstep.
          </p>
        </div>

        {errorMsg && (
          <div className="bg-rose-50 border border-rose-200 text-[#E11D48] text-xs font-bold p-4 rounded-2xl mb-6 text-center">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold p-4 rounded-2xl mb-6 text-center">
            {successMsg}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Mandatory Email OTP Verification */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F4EBE1] shadow-2xs space-y-5">
              <div className="flex justify-between items-center border-b border-[#F4EBE1] pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-[#2D221C] text-white text-xs font-bold flex items-center justify-center">
                    1
                  </span>
                  <h2 className="font-heading font-extrabold text-sm sm:text-base text-[#2D221C]">
                    Guest Identity & OTP Verification
                  </h2>
                </div>
                {isGuestVerified && (
                  <button
                    type="button"
                    onClick={handleSwitchAccount}
                    className="text-[11px] font-bold text-[#E11D48] hover:underline cursor-pointer"
                  >
                    Change / Sign Out
                  </button>
                )}
              </div>

              {!isGuestVerified ? (
                <div className="space-y-4">
                  {!otpSent ? (
                    <form onSubmit={handleSendOtp} className="space-y-4 text-xs">
                      <p className="text-xs text-[#5C4D44]">
                        We will send a 6-digit verification code to your email to verify your order and enable Cash on Delivery.
                      </p>
                      <div>
                        <label className="font-bold text-[#5C4D44] block mb-1">Full Name *</label>
                        <input
                          required
                          type="text"
                          placeholder="e.g. Sarah Jenkins"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          className="w-full bg-[#FAF5EE] border border-[#EBE2D5] rounded-xl px-3.5 py-2.5 focus:outline-[#E11D48]"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="font-bold text-[#5C4D44] block mb-1">Email Address *</label>
                          <input
                            required
                            type="email"
                            placeholder="sarah@example.com"
                            value={customerEmail}
                            onChange={(e) => setCustomerEmail(e.target.value)}
                            className="w-full bg-[#FAF5EE] border border-[#EBE2D5] rounded-xl px-3.5 py-2.5 focus:outline-[#E11D48]"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-[#5C4D44] block mb-1">Mobile Number (10 Digits) *</label>
                          <input
                            required
                            type="tel"
                            maxLength={10}
                            placeholder="9876543210"
                            value={customerPhone}
                            onChange={(e) => setCustomerPhone(e.target.value)}
                            className="w-full bg-[#FAF5EE] border border-[#EBE2D5] rounded-xl px-3.5 py-2.5 focus:outline-[#E11D48]"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={sendingOtp}
                        className="w-full py-3 bg-[#2D221C] hover:bg-[#E11D48] text-white font-bold rounded-xl transition cursor-pointer text-xs disabled:opacity-50"
                      >
                        {sendingOtp ? 'Sending OTP Code...' : 'Send Email Verification OTP →'}
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleVerifyOtp} className="space-y-4 text-xs">
                      <div className="bg-[#FAF5EE] p-3.5 rounded-xl border border-[#EBE2D5] flex justify-between items-center">
                        <span className="text-[#5C4D44]">
                          Code sent to: <strong>{customerEmail}</strong>
                        </span>
                        <button
                          type="button"
                          onClick={() => setOtpSent(false)}
                          className="text-[11px] font-bold text-[#E11D48] underline"
                        >
                          Edit Email
                        </button>
                      </div>

                      <div>
                        <label className="font-bold text-[#5C4D44] block mb-1">Enter 6-Digit OTP Code *</label>
                        <input
                          required
                          type="text"
                          maxLength={6}
                          placeholder="••••••"
                          value={enteredOtp}
                          onChange={(e) => setEnteredOtp(e.target.value)}
                          className="w-full text-center tracking-widest font-mono text-lg font-bold bg-[#FAF5EE] border border-[#EBE2D5] rounded-xl px-3.5 py-2.5 focus:outline-[#E11D48]"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={verifyingOtp}
                        className="w-full py-3 bg-[#E11D48] hover:bg-[#BE123C] text-white font-bold rounded-xl transition cursor-pointer text-xs disabled:opacity-50 shadow-md"
                      >
                        {verifyingOtp ? 'Verifying Code...' : 'Verify OTP & Unlock Checkout →'}
                      </button>
                    </form>
                  )}
                </div>
              ) : (
                <div className="bg-[#FAF5EE] rounded-2xl p-4 text-xs border border-[#EBE2D5] flex justify-between items-center">
                  <div>
                    <p className="font-bold text-[#2D221C]">{customerName}</p>
                    <p className="text-[#8C7B71]">{customerEmail} • {customerPhone}</p>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase px-2.5 py-1 rounded-md">
                    ✓ Verified Buyer
                  </span>
                </div>
              )}
            </div>

            {/* Step 2: Shipping Details */}
            <form onSubmit={handlePlaceOrder} className="space-y-6">
              <div
                className={`bg-white rounded-3xl p-6 sm:p-8 border border-[#F4EBE1] shadow-2xs space-y-5 transition ${
                  !isGuestVerified ? 'opacity-40 pointer-events-none' : ''
                }`}
              >
                <div className="flex items-center gap-2.5 border-b border-[#F4EBE1] pb-3">
                  <span className="w-6 h-6 rounded-full bg-[#2D221C] text-white text-xs font-bold flex items-center justify-center">
                    2
                  </span>
                  <h2 className="font-heading font-extrabold text-sm sm:text-base text-[#2D221C]">
                    Delivery Destination
                  </h2>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="font-bold text-[#5C4D44] block mb-1">Street Address *</label>
                    <input
                      required={isGuestVerified}
                      type="text"
                      placeholder="Flat/House No, Street, Landmark"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full bg-[#FAF5EE] border border-[#EBE2D5] rounded-xl px-3.5 py-2.5 focus:outline-[#E11D48]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold text-[#5C4D44] block mb-1">City *</label>
                      <input
                        required={isGuestVerified}
                        type="text"
                        placeholder="e.g. Mumbai, Bengaluru"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full bg-[#FAF5EE] border border-[#EBE2D5] rounded-xl px-3.5 py-2.5 focus:outline-[#E11D48]"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-[#5C4D44] block mb-1">Postal PIN Code *</label>
                      <input
                        required={isGuestVerified}
                        type="text"
                        maxLength={6}
                        placeholder="e.g. 400001"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        className="w-full bg-[#FAF5EE] border border-[#EBE2D5] rounded-xl px-3.5 py-2.5 focus:outline-[#E11D48]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3: Payment Option */}
              <div
                className={`bg-white rounded-3xl p-6 sm:p-8 border border-[#F4EBE1] shadow-2xs space-y-5 transition ${
                  !isGuestVerified ? 'opacity-40 pointer-events-none' : ''
                }`}
              >
                <div className="flex items-center gap-2.5 border-b border-[#F4EBE1] pb-3">
                  <span className="w-6 h-6 rounded-full bg-[#2D221C] text-white text-xs font-bold flex items-center justify-center">
                    3
                  </span>
                  <h2 className="font-heading font-extrabold text-sm sm:text-base text-[#2D221C]">
                    Payment Option
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <label
                    className={`p-4 rounded-2xl border-2 cursor-pointer flex items-center justify-between transition ${
                      paymentMethod === 'COD'
                        ? 'border-[#2D221C] bg-[#FAF5EE]'
                        : 'border-[#EBE2D5] hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'COD'}
                        onChange={() => setPaymentMethod('COD')}
                        className="accent-[#2D221C]"
                      />
                      <div>
                        <p className="font-extrabold text-[#2D221C]">Cash on Delivery</p>
                        <p className="text-[10px] text-[#8C7B71]">Verified COD orders processed instantly</p>
                      </div>
                    </div>
                    <span>💵</span>
                  </label>

                  <label
                    className={`p-4 rounded-2xl border-2 cursor-pointer flex items-center justify-between transition ${
                      paymentMethod === 'RAZORPAY'
                        ? 'border-[#2D221C] bg-[#FAF5EE]'
                        : 'border-[#EBE2D5] hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'RAZORPAY'}
                        onChange={() => setPaymentMethod('RAZORPAY')}
                        className="accent-[#2D221C]"
                      />
                      <div>
                        <p className="font-extrabold text-[#2D221C]">Online Payment</p>
                        <p className="text-[10px] text-[#8C7B71]">UPI, Cards, Netbanking (Razorpay)</p>
                      </div>
                    </div>
                    <span>💳</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading || !isGuestVerified}
                  className="w-full py-4 bg-[#E11D48] hover:bg-[#BE123C] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg transition cursor-pointer disabled:opacity-50"
                >
                  {loading ? 'Processing Order...' : `Place Order (Rs. ${finalAmount.toLocaleString('en-IN')})`}
                </button>
              </div>
            </form>
          </div>

          {/* Sidebar Bag Summary */}
          <div className="bg-white rounded-3xl p-6 border border-[#F4EBE1] shadow-2xs space-y-5 h-fit">
            <h3 className="font-heading font-extrabold text-sm text-[#2D221C]">
              Bag Summary ({cart.reduce((s, i) => s + (Number(i.quantity) || 0), 0)})
            </h3>

            <div className="divide-y divide-[#F4EBE1] max-h-72 overflow-y-auto">
              {cart.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=200&q=80'}
                      alt={item.name}
                      className="w-12 h-12 rounded-xl object-cover border border-[#F4EBE1]"
                    />
                    <div>
                      <p className="font-bold text-[#2D221C] line-clamp-1">{item.name}</p>
                      <p className="text-[10px] text-[#8C7B71]">
                        {item.size || '0-3M'} × {item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-[#2D221C]">
                    Rs. {(Number(item.price) * Number(item.quantity)).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-[#F4EBE1] pt-3 space-y-2 text-xs">
              <div className="flex justify-between text-[#5C4D44]">
                <span>Items Subtotal</span>
                <span>Rs. {cartTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-[#5C4D44]">
                <span>Express Courier Shipping</span>
                <span className="font-bold text-[#2D221C]">{shippingFee === 0 ? 'FREE' : 'Rs. 99'}</span>
              </div>
              <div className="border-t border-[#F4EBE1] pt-2 flex justify-between font-extrabold text-sm text-[#2D221C]">
                <span>Total Amount</span>
                <span>Rs. {finalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}