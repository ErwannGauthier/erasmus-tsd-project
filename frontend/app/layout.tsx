import './globals.css';

import Link from 'next/link';
import { Analytics } from '@vercel/analytics/react';
import { Logo, UsersIcon } from '@/components/icons';

import { NavItem } from './nav-item';
import { Logout } from './(account)/logout/logout';
import { LoginButton } from './(account)/login/LoginButton';
import { useCookies } from 'react-cookie';

export const metadata = {
  title: 'Planning Poker'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  //const [cookies] = useCookies(['user']);

  return (
    <html lang="en" className="h-full bg-gray-50">
    <body>
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-[60px] items-center border-b px-5">
            <Link
              className="flex items-center gap-2 font-semibold"
              href="/"
            >
              <Logo />
              <span className="">Poker Planner</span>
            </Link>
          </div>
          <div className="flex-1 overflow-auto py-2">
            <nav className="grid items-start px-4 text-sm font-medium">
              <NavItem href="/">
                <UsersIcon className="h-4 w-4" />
                Rooms
              </NavItem>
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header
          className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40 justify-between lg:justify-end">
          <div className="flex flex-row items-baseline">
            <div>
              <Link className="flex items-center gap-2 font-semibold lg:hidden" href="/">
                <Logo />
                <span className="">Poker Planner</span>
              </Link>
            </div>
            <div className="mb-3">
              <Link className="text-lg font-semibold hover:text-blue-500 me-8 hover:underline" href="/">Rooms</Link>
              {/*cookies.user ? <Logout /> : <LoginButton />*/}
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
