'use client';

import { IoAddCircleOutline } from 'react-icons/io5';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import socket from '../utils/socket';
import { RoomIncludes } from '../types/data/RoomIncludes';
import { useCookies } from 'react-cookie';
import { UserRoom } from '../types/data/UserRoom';
import RoomTable from '@/components/RoomTable';

export default function IndexPage() {
  const [rooms, setRooms] = useState<RoomIncludes[]>([]);
  const [roomsAdmin, setRoomsAdmin] = useState<RoomIncludes[]>([]);
  const [roomsJoined, setRoomsJoined] = useState<RoomIncludes[]>([]);
  const [roomsPublic, setRoomsPublic] = useState<RoomIncludes[]>([]);
  const [cookies] = useCookies(['user']);
  const router = useRouter();

  useEffect(() => {
    socket.emit('getAllRooms');
    socket.on('updateRooms', (roomsUpdate: RoomIncludes[]) => {
      setRooms(roomsUpdate);
      filterRooms(roomsUpdate);
    });
  }, []);

  const filterRooms = (rooms: RoomIncludes[]) => {
    const userId: string = cookies.user.userId;
    const roomsAdminArray: RoomIncludes[] = rooms.filter((room: RoomIncludes) => !room.isClose && room.adminId === userId);
    const roomsJoinedArray: RoomIncludes[] = rooms.filter((room: RoomIncludes) => {
      const joined: UserRoom[] = room.UserRoom.filter((userRoom: UserRoom) => userRoom.userId === userId);
      return !room.isClose && room.adminId !== userId && joined.length > 0;
    });
    const roomsPublicArray: RoomIncludes[] = rooms.filter((room: RoomIncludes) => {
      const joined: UserRoom[] = room.UserRoom.filter((userRoom: UserRoom) => userRoom.userId === userId);
      return !room.isClose && !room.isPrivate && room.adminId !== userId && joined.length === 0;
    });

    setRoomsAdmin(roomsAdminArray);
    setRoomsJoined(roomsJoinedArray);
    setRoomsPublic(roomsPublicArray);
  };

  console.log(rooms);

  return (
    <main className="flex flex-1 flex-col p-4 md:p-6">
      <div className="flex items-center mb-8">
        <h1 className="font-semibold text-xl md:text-2xl">Rooms</h1>
        <button className="flex ml-auto items-center space-x-2 p-2 bg-blue-500 text-white rounded"
                onClick={() => router.push('/room/create')}>
          <span><IoAddCircleOutline className="h-4 w-4" /></span>
          <span>Create Room</span>
        </button>
      </div>

      <div className="pb-5">
        <div className="pb-5">
          <h2 className="font-semibold text-lg md:text-xl pb-2 ps-2">Your rooms</h2>
          {roomsAdmin.length > 0 ? <RoomTable rooms={roomsAdmin} /> :
            <p className="font-medium ps-2">You don't have your own room.</p>
          }
        </div>
        <div className="pb-5">
          <h2 className="font-semibold text-lg md:text-xl pb-2 ps-2">Joined rooms</h2>
          {roomsJoined.length > 0 ? <RoomTable rooms={roomsJoined} /> :
            <p className="font-medium ps-2">You haven't joined a room yet.</p>
          }
        </div>
        <div className="pb-5">
          <h2 className="font-semibold text-lg md:text-xl pb-2 ps-2">Public rooms</h2>
          {roomsPublic.length > 0 ? <RoomTable rooms={roomsPublic} /> :
            <p className="font-medium ps-2">There are no public rooms at the moment.</p>
          }
        </div>
      </div>
    </main>
  );
}
