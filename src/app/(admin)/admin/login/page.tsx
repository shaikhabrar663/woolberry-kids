'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || '/admin/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          password: password.trim(),
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        window.location.href = from;
      } else {
        setErrorMsg(data.error || 'Invalid email or password.');
      }
    } catch (err) {
      setErrorMsg('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-8 border border-[#F4EBE1] shadow-lg max-w-sm w-full text-[#2D221C]">
      <div className="flex flex-col items-center mb-6">
        <span className="w-12 h-12 rounded-full bg-[#2D221C] text-white flex items-center justify-center font-black text-lg mb-3 shadow-sm">
          w
        </span>
        <h1 className="font-heading font-extrabold text-2xl text-[#2D221C]">
          Admin Portal
        </h1>
        <p className="text-xs text-[#8C7B71] mt-1">
          Woolberry Kids Store Management
        </p>
      </div>

      {errorMsg && (
        <div className="bg-rose-50 border border-rose-200 text-[#E11D48] text-xs font-bold p-3 rounded-xl mb-4 text-center">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4 text-xs">
        <div>
          <label className="font-bold text-[#5C4D44] block mb-1">
            Admin Email
          </label>
          <input
            required
            type="email"
            placeholder="admin@woolberry.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[#FAF5EE] border border-[#EBE2D5] rounded-xl px-4 py-3 text-xs focus:outline-[#E11D48] text-[#2D221C]"
          />
        </div>

        <div>
          <label className="font-bold text-[#5C4D44] block mb-1">
            Password
          </label>
          <input
            required
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-[#FAF5EE] border border-[#EBE2D5] rounded-xl px-4 py-3 text-xs focus:outline-[#E11D48] text-[#2D221C]"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-[#2D221C] hover:bg-[#E11D48] text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-md disabled:opacity-50 mt-2 flex items-center justify-center gap-1.5"
        >
          <span>{loading ? 'Authenticating...' : 'Sign In to Portal'}</span>
          <span>→</span>
        </button>
      </form>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFDF9] px-4">
      <Suspense fallback={<div className="text-xs text-[#8C7B71]">Loading portal...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}