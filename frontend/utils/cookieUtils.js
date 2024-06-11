import { useCookies } from 'react-cookie';

export const useIsUserConnected = () => {
  const [cookies] = useCookies(['token', 'user']);

  const isUserConnected = () => {
    return cookies.token !== undefined && cookies.user !== undefined;
  };

  return isUserConnected;
};