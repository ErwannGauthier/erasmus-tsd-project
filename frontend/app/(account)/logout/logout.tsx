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
    <form id="formLogout" onSubmit={handleSubmit} className='w-full'>
      <button id="submitButton" type="submit" form="formLogout"
              className="text-white bg-rose-700 hover:bg-rose-800 focus:ring-4 focus:outline-none focus:ring-rose-300 font-medium rounded text-sm px-5 py-2.5 text-center mt-5 w-full">
        Log Out
      </button>
    </form>
  );
}

export default Logout;