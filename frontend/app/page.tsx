'use client';

import { IoAddCircleOutline } from 'react-icons/io5';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import socket from '../utils/socket';
import { RoomIncludes } from '../types/data/RoomIncludes';
import { useCookies } from 'react-cookie';
import { UserRoom } from '../types/data/UserRoom';
import RoomTable from '@/components/RoomTable';
import RoomClosedTable from '@/components/RoomClosedTable';
import { UserStoryIncludes } from '../types/data/UserStoryIncludes';
import { LoginButton } from './(account)/login/LoginButton';
import Logout from './(account)/logout/logout';
import { Vote } from 'types/data/Vote';
import { useIsUserConnected } from '../utils/cookieUtils';
import { is } from 'drizzle-orm';

export default function IndexPage() {
  const [rooms, setRooms] = useState<RoomIncludes[]>([]);
  const [roomsAdmin, setRoomsAdmin] = useState<RoomIncludes[]>([]);
  const [roomsJoined, setRoomsJoined] = useState<RoomIncludes[]>([]);
  const [roomsPublic, setRoomsPublic] = useState<RoomIncludes[]>([]);
  const [roomsClosedAdmin, setRoomsClosedAdmin] = useState<RoomIncludes[]>([]);
  const [roomsClosedParticipate, setRoomsClosedParticipate] = useState<RoomIncludes[]>([]);
  const isUserConnected = useIsUserConnected();
  const [cookies] = useCookies(['user']);
  const router = useRouter();

  useEffect(() => {
    if (!isUserConnected()) {
      router.push('/login');
      return
    }
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

    const roomsClosedAdmin: RoomIncludes[] = rooms.filter((room: RoomIncludes) => room.isClose && room.adminId === userId);

    const roomsCloseJoinedOrParticipateIn: RoomIncludes[] = rooms.filter((room: RoomIncludes) => {
      const joined: UserRoom[] = room.UserRoom.filter((userRoom: UserRoom) => userRoom.userId === userId);
      const voted: UserStoryIncludes[] = room.UserStory.filter((userStory: UserStoryIncludes) => {
        const votes: Vote[] = userStory.Vote.filter((vote: Vote) => vote.userId === userId);
        return votes.length > 0;
      });

      return room.isClose && room.adminId !== userId && (joined.length !== 0 || voted.length !== 0);
    });

    setRoomsAdmin(roomsAdminArray);
    setRoomsJoined(roomsJoinedArray);
    setRoomsPublic(roomsPublicArray);
    setRoomsClosedAdmin(roomsClosedAdmin);
    setRoomsClosedParticipate(roomsCloseJoinedOrParticipateIn);
  };

  console.log(rooms);

  return (
    <main className="flex flex-1 flex-col p-4 md:p-6">
      <div className="flex items-center mb-8">
        <h1 className="font-semibold text-xl md:text-2xl">Rooms</h1>
        <div className='flex flex-col ml-auto '>
          <button className="flex items-center space-x-2 p-2 bg-blue-500 text-white rounded"
                  onClick={() => router.push('/room/create')}>
            <span><IoAddCircleOutline className="h-4 w-4" /></span>
            <span>Create Room</span>
          </button>
          {
            isUserConnected() ? <Logout></Logout> : <LoginButton></LoginButton>
          }

        </div>

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

        <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />

        <div className="pb-5">
          <h2 className="font-semibold text-lg md:text-xl pb-2 ps-2">Your closed rooms</h2>
          {roomsClosedAdmin.length > 0 ? <RoomClosedTable rooms={roomsClosedAdmin} /> :
            <p className="font-medium ps-2">You don't have closed room.</p>
          }
        </div>
        <div className="pb-5">
          <h2 className="font-semibold text-lg md:text-xl pb-2 ps-2">Closed rooms you participated in</h2>
          {roomsClosedParticipate.length > 0 ? <RoomClosedTable rooms={roomsClosedParticipate} /> :
            <p className="font-medium ps-2">You didn't participate in closed rooms.</p>
          }
        </div>
      </div>
    </main>
  );
}
