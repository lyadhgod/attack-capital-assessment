'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useActionState } from 'react';
import { call, CallResult } from '@/actions/call';
import { ActionState, EnsureStructuredCloneable } from '@/types';
import PhoneDialer from './phone-dialer';
import CallStatus from './call-status';

const initialMakeCallState: ActionState<EnsureStructuredCloneable<CallResult>, null> = {
  status: 'idle',
};

export default function DialerContent() {
  const { user, isLoading, signOut } = useAuth();
  const router = useRouter();
  const [makeCallState, makeCallFormAction, makeCallPending] = useActionState(call, initialMakeCallState);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading loading-spinner loading-lg text-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-300">
      {/* Header */}
      <header className="navbar bg-base-100 shadow-lg">
        <div className="navbar-start">
          <h1 className="text-xl font-bold text-primary">AMD Dialer</h1>
        </div>
        
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
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-base-content mb-4">
              Make a Smart Call
            </h2>
            <p className="text-lg text-base-content/70">
              Enter a phone number and let our AMD technology detect if a human answers
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Phone Dialer */}
            <div className="bg-base-100 rounded-3xl shadow-xl p-8">
              <PhoneDialer 
                onCall={makeCallFormAction}
                isLoading={makeCallPending}
              />
            </div>

            {/* Call Status */}
            <div className="bg-base-100 rounded-3xl shadow-xl p-8">
              <CallStatus 
                callState={makeCallState}
                isLoading={makeCallPending}
              />
            </div>
          </div>

          {/* Features Section */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="bg-base-100 rounded-2xl p-6 text-center shadow-lg">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Human Detection</h3>
              <p className="text-base-content/60">Advanced AMD technology to identify human vs machine responses</p>
            </div>

            <div className="bg-base-100 rounded-2xl p-6 text-center shadow-lg">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Fast Response</h3>
              <p className="text-base-content/60">Get results in under 2 seconds with real-time processing</p>
            </div>

            <div className="bg-base-100 rounded-2xl p-6 text-center shadow-lg">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Smart Analytics</h3>
              <p className="text-base-content/60">Track call success rates and optimize your campaigns</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}