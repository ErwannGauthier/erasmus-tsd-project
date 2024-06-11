'use client';

import { useEffect, useState } from 'react';
import LoadingScreen from '@/components/LoadingScreen';
import { useRouter } from 'next/navigation';
import EllipseNames from '@/components/closedRoom/EllipseNames';
import UserStoryPanel from '@/components/closedRoom/UserStoryPanel';
import { RoomIncludes } from '../../types/data/RoomIncludes';
import { UserDto } from '../../types/data/UserDto';
import { UserRoomIncludes } from '../../types/data/UserRoomIncludes';
import ButtonDownloadCSV from '@/components/ButtonDownloadCSV';

interface ClosedRoomProps {
  room: RoomIncludes;
}

export default function ClosedRoom({ room }: ClosedRoomProps) {
  const [hasMounted, setHasMounted] = useState<boolean>(false);
  const [participants, setParticipants] = useState<UserDto[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (!hasMounted) {
      setHasMounted(true);
    }

    setParticipants(room.UserRoom.map((userRoom: UserRoomIncludes) => userRoom.User));
  }, [hasMounted]);

  if (!hasMounted || !room) {
    return <LoadingScreen />;
  }

  return (
    <div className="flex flex-row w-full">
      <div className="flex flex-col bg-gray-100" style={{ minWidth: '300px', maxWidth: '70%' }}>
        <div className="flex flex-col items-center justify-center bg-gray-100">
          {room && <h1 className="text-2xl font-bold mb-2">{room.name}</h1>}
          {room && room.isClose && <h2 className="text-xl font-semibold mb-2">This room is closed</h2>}
          <EllipseNames users={participants} width={220} />
        </div>
      </div>

      <div className="flex-1">
        {room && <ButtonDownloadCSV roomId={room.roomId} />}
        <UserStoryPanel userStories={room.UserStory || []} />
      </div>
    </div>
  );
}
