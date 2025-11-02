import DialerHeaderClient from './dialer-header-client';

export default function DialerHeader() {
  return (
    <header className="navbar bg-base-100 shadow-lg">
      <div className="navbar-start">
        <h1 className="text-xl font-bold text-primary">AMD Dialer</h1>
      </div>
      
      <DialerHeaderClient />
    </header>
  );
}