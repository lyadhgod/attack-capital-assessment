import DialerShellClient from './dialer-shell-client';

export default function DialerShell() {
  return (
    <div className="bg-base-200 rounded-lg p-8">
      <div className="max-w-md mx-auto">
        <h2 className="text-3xl font-bold text-center mb-6">Make a Call</h2>
        
        <DialerShellClient />
      </div>
    </div>
  );
}