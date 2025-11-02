import { ReactNode } from 'react';

interface PhoneDialerStaticProps {
  children: ReactNode;
}

export default function PhoneDialerStatic({ children }: PhoneDialerStaticProps) {
  return (
    <div className="space-y-6">
      {/* Static Header */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-base-content mb-2">Enter Phone Number</h3>
        <p className="text-base-content/60">Click on digits or use the dial pad below</p>
      </div>

      {/* Interactive Content Slot */}
      {children}

      {/* Static Instructions */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-4">
        <h5 className="font-semibold text-base-content mb-2 flex items-center">
          <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          How to Use
        </h5>
        <p className="text-sm text-base-content/70 leading-relaxed">
          Enter a 10-digit phone number using the input fields or dial pad. 
          Select the appropriate country code and click &quot;Start Call&quot; to initiate an AMD-enabled call.
        </p>
      </div>
    </div>
  );
}