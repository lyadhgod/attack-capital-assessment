import CallStatusClient from './call-status-client';

export default function CallStatusStatic() {
  return (
    <div className="space-y-6">
      {/* Static Header */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-base-content mb-2">Call Status</h3>
        <p className="text-base-content/60">Real-time AMD detection results</p>
      </div>

      {/* Interactive Status */}
      <CallStatusClient />

      {/* Static AMD Process Info */}
      <div className="space-y-4">
        <h5 className="font-semibold text-center">AMD Process</h5>
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-3 text-base-content/40">
            <div className="w-3 h-3 rounded-full bg-base-content/20"></div>
            <span className="text-sm">Call initiated</span>
          </div>
          
          <div className="flex items-center space-x-3 text-base-content/40">
            <div className="w-3 h-3 rounded-full bg-base-content/20"></div>
            <span className="text-sm">Analyzing response</span>
          </div>
          
          <div className="flex items-center space-x-3 text-base-content/40">
            <div className="w-3 h-3 rounded-full bg-base-content/20"></div>
            <span className="text-sm">Detection complete</span>
          </div>
        </div>
      </div>

      {/* Static AMD Technology Info */}
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