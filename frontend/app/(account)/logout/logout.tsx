'use client';

import { useCookies } from 'react-cookie';
import { useRouter } from 'next/navigation';

export function Logout() {
  const [cookies, setCookie, removeCookie] = useCookies(['token', 'user']);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();

    removeCookie('token');
    removeCookie('user');
    router.push('/login');
  };

  return (
    <form id="formLogout" onSubmit={handleSubmit}>
      <button id="submitButton" type="submit" form="formLogout"
              className="text-white bg-rose-700 hover:bg-rose-800 focus:ring-4 focus:outline-none focus:ring-rose-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
        Log Out
      </button>
    </form>
  );
}