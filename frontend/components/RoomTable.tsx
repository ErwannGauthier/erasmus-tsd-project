'use client';

import React from 'react';
import { RoomIncludes } from '../types/data/RoomIncludes';
import { useRouter } from 'next/navigation';


interface RoomTableProps {
  rooms: RoomIncludes[];
}

const RoomTable: React.FC<RoomTableProps> = ({ rooms }) => {
  const router = useRouter();

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" className="px-6 py-3 w-4/6">
            Name
          </th>
          <th scope="col" className="px-6 py-3 w-1/6 text-center">
            Users
          </th>
          <th scope="col" className="px-6 py-3 w-1/6 text-center">
            Join
          </th>
        </tr>
        </thead>
        <tbody>
        {rooms.map((room: RoomIncludes) => (
            <tr key={room.roomId}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
              <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white w-4/6">
                {room.name}
              </th>
              <td className="px-6 py-4 w-1/6 text-center">
                {room.UserRoom.length} / {room.maxUsers}
              </td>
              <td className="px-6 py-4 w-1/6 text-center">
                {room.UserRoom.length < room.maxUsers ?
                  <button id="joinButton" onClick={() => router.push('/room/' + room.roomId)}
                          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                    Join
                  </button> :
                  <button id="joinButton" disabled={true}
                          className="text-black bg-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                    Join
                  </button>}
              </td>
            </tr>
          )
        )}
        </tbody>
      </table>
    </div>
  );
};

export default RoomTable;
