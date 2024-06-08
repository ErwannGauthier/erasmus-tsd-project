'use client';

import { useEffect, useState } from 'react';
import EllipseNames from '@/components/EllipseNames';
import Card from '@/components/Card';
import { ITask } from '@/components/OldTask';
import socket from '../../../utils/socket';
import { useCookies } from 'react-cookie';
import { RoomIncludes } from '../../../types/data/RoomIncludes';
import { JoinRoomResponse } from '../../../types/socket/JoinRoom';
import { UserDto } from '../../../types/data/UserDto';
import { UserRoomIncludes } from '../../../types/data/UserRoomIncludes';
import CopyToClipBoard from '@/components/CopyToClipBoard';
import UserStoryPanel from '@/components/UserStoryPanel';
import LoadingScreen from '@/components/LoadingScreen';
import { useRouter } from 'next/navigation';

export interface IUserStory {
  id: number;
  name: string;
  tasks: ITask[];
}

export interface CallCreateUserStoryArgs {
  name: string,
  description: string,
  roomId: string
}

export default function Room({ params }: { params: { id: string } }) {
  const roomId: string = params.id;
  const [hasMounted, setHasMounted] = useState<boolean>(false);
  const [cookies] = useCookies(['user']);
  const [room, setRoom] = useState<RoomIncludes>();
  const [participants, setParticipants] = useState<UserDto[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!hasMounted) {
      setHasMounted(true);
    }

    socket.emit('joinRoom', { userId: cookies.user.userId, roomId: roomId }, (response: JoinRoomResponse) => {
      if (!response.isOk) {
        console.error(response.error);
        return;
      }

      if (response?.room) {
        const room: RoomIncludes = response.room;
        setRoom(room);
        setParticipants(room.UserRoom.map((userRoom: UserRoomIncludes) => userRoom.User));
        room.adminId === cookies.user.userId && setIsAdmin(true);
      }
    });

    socket.on('updateRoomData', (room: RoomIncludes) => {
      setRoom(room);
      setParticipants(room.UserRoom.map((userRoom: UserRoomIncludes) => userRoom.User));
      room.adminId === cookies.user.userId ? setIsAdmin(true) : setIsAdmin(false);

      if (!isInParticipant(cookies.user.userId, room.UserRoom.map((userRoom: UserRoomIncludes) => userRoom.User))) {
        socket.emit('leaveRoom', { userId: cookies.user.userId, roomId: roomId });
        router.push('/');
      }
    });
  }, [hasMounted]);

  console.log(room);

  const isInParticipant = (userId: string, participants: UserDto[]): boolean => {
    const filteredParticipant: UserDto[] = participants.filter((user: UserDto) => user.userId === userId);
    return filteredParticipant.length > 0;
  };

  const values: number[] = [0, 1, 2, 3, 5, 8, 13, 20, 40, 100];

  if (!hasMounted || !room) {
    return <LoadingScreen />;
  }

  return (
    <div className="flex flex-row w-full">
      <div className="flex flex-col bg-gray-100" style={{ minWidth: '300px', maxWidth: '70%' }}>

        <div className="flex flex-col items-center justify-center bg-gray-100">
          {room && <h1 className="text-2xl font-bold mb-4">{room.name}</h1>}
          <EllipseNames users={participants} width={220} roomId={roomId} isAdmin={isAdmin} />
        </div>

        <div className="flex flex-wrap w-full p-4">
          {values.map((value) => (
            <Card value={value} isSelected={value === 5} key={value} />
          ))}
        </div>
      </div>

      <div className="flex-1">
        {isAdmin && <CopyToClipBoard />}
        <UserStoryPanel roomId={roomId} roomUserStories={room.UserStory || []} />
      </div>
    </div>
  );
}
