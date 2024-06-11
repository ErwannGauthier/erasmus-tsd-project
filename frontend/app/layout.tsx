import './globals.css';

import Link from 'next/link';
import { Analytics } from '@vercel/analytics/react';
import { Logo } from '@/components/icons';

export const metadata = {
  title: 'Planning Poker'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {

  return (
    <html lang="en" className="h-full bg-gray-50">
    <body>
    <div className="min-h-screen w-full">
      <div className="flex flex-col">
        <header
          className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40 justify-between lg:justify-end">
          <div className="flex flex-row items-baseline justify-between w-full">
            <div className="">
              <Logo />
              <span className="">Poker Planner</span>

            </div>
            <div className="mb-3">
              <Link className="text-lg font-semibold hover:text-blue-500 me-8 hover:underline" href="/">Rooms</Link>
            </div>
          </div>
        </header>
        {children}
      </div>
    </div>
    <Analytics />
    </body>
    </html>
  );
}
