import Dialpad from './dialpad';
import User from './user';

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-300">
      <header className="navbar bg-base-100 shadow-lg">
        <div className="navbar-start">
          <h1 className="text-xl font-bold text-primary">AMD Dialer</h1>
        </div>
        
        <User />
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-base-200 rounded-lg p-8">
            <div className="max-w-md mx-auto">
              <Dialpad />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}