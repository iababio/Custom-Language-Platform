import React from 'react';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { DashboardProvider } from '../contexts/DashboardContext';
import type { Metadata } from 'next';
import { Inter, Epilogue } from 'next/font/google';

const inter = Inter({
   variable: '--font-inter',
   subsets: ['latin'],
   weight: ['400', '500', '700'],
   display: 'swap',
});

const epilogue = Epilogue({
   variable: '--font-epilogue',
   subsets: ['latin'],
   weight: '500',
   display: 'swap',
});

export const metadata: Metadata = {
   title: 'Language Pipeline',
   description: 'Language model training and management platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
   return (
      <html lang="en" className={`${inter.variable} ${epilogue.variable}`}>
         <body className="min-h-screen bg-background font-sans antialiased">
            <ClerkProvider
               publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
               signInUrl="/sign-in"
               signUpUrl="/sign-up"
               afterSignInUrl="/dashboard"
               afterSignUpUrl="/dashboard"
            >
               <DashboardProvider>{children}</DashboardProvider>
            </ClerkProvider>
         </body>
      </html>
   );
}
