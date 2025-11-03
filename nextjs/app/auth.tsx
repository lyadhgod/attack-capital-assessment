'use client';

import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';

interface AuthRouterProps {
  loadingSlot?: ReactNode;
  authenticatedSlot?: ReactNode;
  unauthenticatedSlot?: ReactNode;
}

export default function Auth({ 
  loadingSlot, 
  authenticatedSlot, 
  unauthenticatedSlot 
}: AuthRouterProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.push('/dialer');
    }
  }, [user, isLoading]);

  if (isLoading) {
    return loadingSlot;
  }

  if (user) {
    return authenticatedSlot;
  }

  return unauthenticatedSlot;
}