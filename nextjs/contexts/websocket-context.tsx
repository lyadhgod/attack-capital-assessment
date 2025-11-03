'use client';

import '@/integrations/socketio-client';

export default function WebSocketContextProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
        {children}
    </>
  );
}
