'use client';

import React from 'react';
import socket from 'utils/socket';
import { useCookies } from 'react-cookie';

interface ModalProps {
  roomId: string;
  closeModal: () => void;
}

const ModalRoomClose: React.FC<ModalProps> = ({ roomId, closeModal }) => {
    const [cookies] = useCookies(['user']);

    const handleSubmit = async (event: React.FormEvent): Promise<void> => {
      event.preventDefault();

      socket.emit('closeRoom', { roomId: roomId, userId: cookies.user.userId });
      closeModal();
    };

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded shadow-lg w-96">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Close room</h2>
            <button onClick={() => closeModal()}
                    className="text-gray-500 hover:text-gray-700">
              &times;
            </button>
          </div>
          <div>
            <p className="text-lg pb-2">Do you really want to close this room? It will no longer be possible to modify
              data after that.</p>
            <form onSubmit={handleSubmit} id="formCloseRoom" className="flex flex-col text-black">
            </form>
            <div className="flex justify-end gap-2">
              <button id="submitButton" type="submit" form="formCloseRoom"
                      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                Close
              </button>
              <button id="cancelButton" onClick={() => closeModal()}
                      className="text-black bg-gray-300 hover:bg-gray-400 focus:ring-4 focus:outline-none focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
;

export default ModalRoomClose;