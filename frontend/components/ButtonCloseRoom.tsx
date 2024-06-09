'use client';

import React, { useState } from 'react';
import { useCookies } from 'react-cookie';
import { IoLockClosedOutline } from 'react-icons/io5';
import { useRouter } from 'next/navigation';
import ModalRoomClose from '@/components/ModalRoomClose';

interface ButtonCloseRoomProps {
  roomId: string;
}

const ButtonCloseRoom: React.FC<ButtonCloseRoomProps> = ({ roomId }) => {
  const [isCloseRoomModalOpen, setIsCloseRoomModalOpen] = useState<boolean>(false);
  const [cookies] = useCookies(['user']);
  const router = useRouter();

  const handleClick = () => {
    setIsCloseRoomModalOpen(true);
  };

  const closeModal = (): void => {
    setIsCloseRoomModalOpen(false);
  };

  return (
    <>
      <button onClick={() => handleClick()}
              className="flex align-middle items-center justify-between text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
        <IoLockClosedOutline className="inline-block mr-2" />
        Close
      </button>

      {isCloseRoomModalOpen &&
        <ModalRoomClose roomId={roomId} closeModal={closeModal} />}
    </>
  );
};

export default ButtonCloseRoom;