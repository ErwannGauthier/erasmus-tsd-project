'use client';

import { useRouter } from 'next/navigation';

export function LoginButton() {
  const router = useRouter();

  return (
    <button id="loginButton" onClick={() => router.push('/login')}
            className="text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded text-sm px-5 py-2.5 text-center mt-5">
      Log In
    </button>
  );
}