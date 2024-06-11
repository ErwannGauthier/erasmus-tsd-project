'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

const ButtonLogout: React.FC = () => {
  const router = useRouter();

  return (
    <button onClick={() => router.push('/logout')}
            className="text-white bg-rose-700 hover:bg-rose-800 focus:ring-4 focus:outline-none focus:ring-rose-300 font-medium rounded text-sm px-5 py-2.5 text-center mt-5 w-full">
      Log Out
    </button>
  );
};

export default ButtonLogout;