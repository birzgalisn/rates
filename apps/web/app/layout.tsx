import { PropsWithChildren } from 'react';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';

import Providers from '~/lib/providers';

import '@repo/ui/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Exchange rates',
  description:
    'Browse various historical EUR exchange rates for currencies such as AUD, GBP, and USD.',
} satisfies Metadata;

export default function RootLayout({ children }: Readonly<PropsWithChildren>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-muted`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
