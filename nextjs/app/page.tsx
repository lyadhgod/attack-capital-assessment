import { Metadata } from 'next';
import Auth from './auth';
import Form from './form';
import { TbBulb } from 'react-icons/tb';
import { BsLightningCharge } from 'react-icons/bs';
import { IoShieldCheckmarkOutline } from 'react-icons/io5';

export const metadata: Metadata = {
  title: 'AMD Dialer - Smart Voice Detection',
  description: 'Advanced Machine Detection for intelligent voice calls',
};

export default function Page() {
  return (
    <Auth
      loadingSlot={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-secondary to-accent">
          <div className="text-center text-white">
            <div className="loading loading-spinner loading-lg mb-4"></div>
            <p className="text-xl">Loading AMD Dialer...</p>
          </div>
        </div>
      }
      authenticatedSlot={
        <div className="min-h-screen flex items-center justify-center">
          <div className="loading loading-spinner loading-lg text-primary"></div>
        </div>
      }
      unauthenticatedSlot={
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

            <div className="flex flex-col lg:flex-row justify-center gap-12">
              <div className="flex-1 max-w-lg">
                <h2 className="text-3xl font-bold mb-8">Why Choose Our Dialer?</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="badge badge-primary badge-lg p-3">
                      <TbBulb />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Smart Detection</h3>
                      <p className="text-base-content/70">
                        Advanced machine learning algorithms detect answering machines, voicemail, 
                        and automated systems with high accuracy.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="badge badge-secondary badge-lg p-3">
                      <BsLightningCharge />
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
                      <IoShieldCheckmarkOutline />
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

              <div className="flex-none">
                <Form />
              </div>
            </div>
          </div>
        </div>
      }
    />
  );
}
