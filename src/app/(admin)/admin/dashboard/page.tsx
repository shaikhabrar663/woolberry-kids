'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/admin');
  }, [router]);
  return <div className="p-8 text-xs text-[#8C7B71]">Redirecting to Admin Overview...</div>;
}
