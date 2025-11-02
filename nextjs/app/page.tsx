import { Metadata } from 'next';
import AuthRouter from './auth-router';
import "@/integrations/socketio-client";

export const metadata: Metadata = {
  title: 'AMD Dialer - Smart Voice Detection',
  description: 'Advanced Machine Detection for intelligent voice calls',
};

export default function Page() {
  return <AuthRouter />;
}
