'use client';

import { CallResult } from '@/actions/call';
import { ActionState, EnsureStructuredCloneable } from '@/types';

interface CallStatusProps {
  callState: ActionState<EnsureStructuredCloneable<CallResult>, null>;
  isLoading: boolean;
}

export default function CallStatus({ callState, isLoading }: CallStatusProps) {
  const getStatusInfo = () => {
    if (isLoading) {
      return {
        title: 'Calling...',
        message: 'Connecting and analyzing the call',
        icon: 'loading',
        color: 'primary'
      };
    }

    if (callState.status === 'success' && callState.data) {
      if (callState.data.human) {
        return {
          title: 'Human Detected! 🎉',
          message: 'A human has answered the call. You can now proceed with your conversation.',
          icon: 'success',
          color: 'success'
        };
      } else {
        return {
          title: 'Machine Detected 🤖',
          message: 'The call was answered by a machine or voicemail. The call has been automatically terminated.',
          icon: 'warning',
          color: 'warning'
        };
      }
    }

    if (callState.status === 'error') {
      return {
        title: 'Call Failed ❌',
        message: 'There was an error making the call. Please check the number and try again.',
        icon: 'error',
        color: 'error'
      };
    }

    return {
      title: 'Ready to Call',
      message: 'Enter a phone number and press the call button to start an AMD-enabled call.',
      icon: 'idle',
      color: 'info'
    };
  };

  const statusInfo = getStatusInfo();

  const renderIcon = () => {
    switch (statusInfo.icon) {
      case 'loading':
        return <span className="loading loading-spinner loading-lg text-primary"></span>;
      case 'success':
        return (
          <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case 'warning':
        return (
          <div className="w-16 h-16 bg-warning/20 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
        );
      case 'error':
        return (
          <div className="w-16 h-16 bg-error/20 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-16 h-16 bg-info/20 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-base-content mb-2">Call Status</h3>
        <p className="text-base-content/60">Real-time AMD detection results</p>
      </div>

      <div className="text-center space-y-4">
        {renderIcon()}
        
        <div>
          <h4 className="text-xl font-semibold text-base-content mb-2">
            {statusInfo.title}
          </h4>
          <p className="text-base-content/70 leading-relaxed">
            {statusInfo.message}
          </p>
        </div>

        {callState.data && (
          <div className="bg-base-200 rounded-xl p-4 space-y-2">
            <h5 className="font-semibold text-base-content">Call Details</h5>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-base-content/60">Call ID:</span>
                <p className="font-mono">{callState.data.id}</p>
              </div>
              <div>
                <span className="text-base-content/60">Detection Result:</span>
                <p className={`font-semibold ${callState.data.human ? 'text-success' : 'text-warning'}`}>
                  {callState.data.human ? 'Human' : 'Machine'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Call Process Timeline */}
      <div className="space-y-4">
        <h5 className="font-semibold text-center">AMD Process</h5>
        <div className="flex flex-col space-y-2">
          <div className={`flex items-center space-x-3 ${isLoading || callState.status !== 'idle' ? 'text-success' : 'text-base-content/40'}`}>
            <div className={`w-3 h-3 rounded-full ${isLoading || callState.status !== 'idle' ? 'bg-success' : 'bg-base-content/20'}`}></div>
            <span className="text-sm">Call initiated</span>
          </div>
          
          <div className={`flex items-center space-x-3 ${isLoading ? 'text-warning' : callState.status === 'success' ? 'text-success' : 'text-base-content/40'}`}>
            <div className={`w-3 h-3 rounded-full ${isLoading ? 'bg-warning animate-pulse' : callState.status === 'success' ? 'bg-success' : 'bg-base-content/20'}`}></div>
            <span className="text-sm">Analyzing response</span>
          </div>
          
          <div className={`flex items-center space-x-3 ${callState.status === 'success' ? 'text-success' : 'text-base-content/40'}`}>
            <div className={`w-3 h-3 rounded-full ${callState.status === 'success' ? 'bg-success' : 'bg-base-content/20'}`}></div>
            <span className="text-sm">Detection complete</span>
          </div>
        </div>
      </div>

      {/* AMD Technology Info */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-4">
        <h5 className="font-semibold text-base-content mb-2 flex items-center">
          <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          How AMD Works
        </h5>
        <p className="text-sm text-base-content/70 leading-relaxed">
          Our Answering Machine Detection analyzes audio patterns, silence duration, and voice characteristics 
          to determine if a human or machine answered the call. This helps optimize call campaigns and ensures 
          you only spend time talking to real people.
        </p>
      </div>
    </div>
  );
}