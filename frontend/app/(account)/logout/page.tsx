'use client';

import { useCookies } from 'react-cookie';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LogoutPage() {
  const [hasMounted, setHasMounted] = useState<boolean>(false);
  const [cookies, setCookie, removeCookie] = useCookies(['token', 'user']);
  const router = useRouter();

  useEffect(() => {
    if (!hasMounted) {
      setHasMounted(true);
    }

    if (hasMounted) {
      removeCookie('token');
      removeCookie('user');
      router.push('/login');
    }
  }, [hasMounted]);

  return (<h1>Logout</h1>);
}