'use client';

import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DialerHeaderClient() {
  const { user, isLoading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="navbar-center">
        <div className="loading loading-spinner loading-sm"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  return (
    <>
      <div className="navbar-center">
        <div className="text-center">
          <p className="text-sm text-base-content/60">Welcome back,</p>
          <p className="font-semibold">{user.name}</p>
        </div>
      </div>
      
      <div className="navbar-end">
        <button 
          className="btn btn-ghost btn-sm"
          onClick={signOut}
        >
          Sign Out
        </button>
      </div>
    </>
  );
}