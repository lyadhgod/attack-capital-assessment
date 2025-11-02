import LandingFormClient from './landing-form-client';

export default function LandingContent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-6">
            AMD Phone Dialer
          </h1>
          <p className="text-xl text-base-content/70 max-w-2xl mx-auto">
            Advanced Machine Detection for smarter calling. Our intelligent dialer helps you connect with real people, 
            filtering out automated responses and voicemail systems.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-12">
          {/* Features Section */}
          <div className="flex-1 max-w-lg">
            <h2 className="text-3xl font-bold mb-8">Why Choose Our Dialer?</h2>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="badge badge-primary badge-lg p-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014.846 21H9.154a3.374 3.374 0 00-2.53-1.033l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Smart Detection</h3>
                  <p className="text-base-content/70">
                    Advanced machine learning algorithms detect answering machines, voicemail, 
                    and automated systems with 95%+ accuracy.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="badge badge-secondary badge-lg p-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
                  <p className="text-base-content/70">
                    Get results in under 3 seconds. No more waiting on hold or 
                    listening to lengthy voicemail messages.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="badge badge-accent badge-lg p-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Secure & Reliable</h3>
                  <p className="text-base-content/70">
                    Enterprise-grade security with end-to-end encryption. 
                    Your calls and data are protected at all times.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Authentication Form */}
          <div className="flex-none">
            <LandingFormClient />
          </div>
        </div>
      </div>
    </div>
  );
}