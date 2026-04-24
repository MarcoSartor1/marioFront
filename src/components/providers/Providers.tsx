"use client";

import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { SessionProvider } from "next-auth/react";
import { NavigationLoader } from '@/components/ui/navigation-loader/NavigationLoader';

interface Props {
  children: React.ReactNode;
}

export const Providers = ({ children }: Props) => {
  return (
    <PayPalScriptProvider options={{
      clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? '',
      intent: 'capture',
      currency: 'USD',
    }}>
      <SessionProvider>
        <NavigationLoader />
        {children}
      </SessionProvider>
    </PayPalScriptProvider>
  );
};
