import React from 'react';
import { useCookies } from 'react-cookie';
import socket from '../utils/socket';
import { IoArrowBack } from 'react-icons/io5';
import { useRouter } from 'next/navigation';

interface ButtonLeaveRoomProps {
  roomId: string;
}

const ButtonLeaveRoom: React.FC<ButtonLeaveRoomProps> = ({ roomId }) => {
  const [cookies] = useCookies(['user']);
  const router = useRouter();

  const handleClick = () => {
    socket.emit('leaveRoom', { roomId: roomId, userId: cookies.user.userId });
    router.push('/');
  };

  return (
    <button onClick={() => handleClick()}
            className="flex align-middle items-center justify-between text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ml-2">
      <IoArrowBack className="inline-block mr-2" />
      Leave
    </button>
  );
};

export default ButtonLeaveRoom;