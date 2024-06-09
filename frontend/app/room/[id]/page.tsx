'use client';

import { useEffect, useState } from 'react';
import EllipseNames from '@/components/EllipseNames';
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
import { UserStoryIncludes } from '../../../types/data/UserStoryIncludes';
import Card from '@/components/Card';
import { Vote } from '../../../types/data/Vote';
import ButtonLeaveRoom from '@/components/ButtonLeaveRoom';
import ButtonCloseRoom from '@/components/ButtonCloseRoom';
import ClosedRoom from '@/components/closedRoom/ClosedRoom';
import ButtonDownloadCSV from '@/components/ButtonDownloadCSV';

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
  const [votingUserStoryId, setVotingUserStoryId] = useState<string>();
  const [canVote, setCanVote] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    if (!hasMounted) {
      setHasMounted(true);
    }

    socket.emit('joinRoom', { userId: cookies.user.userId, roomId: roomId }, (response: JoinRoomResponse) => {
      if (!response.isOk) {
        console.error(response.error);
        router.push('/');
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

    socket.on('newVoteUserStory', (userStoryId: string) => {
      setVotingUserStoryId(userStoryId);
    });

    socket.on('canVote', (vote: boolean) => {
      setCanVote(vote);
    });
  }, [hasMounted]);

  console.log(room);

  const isInParticipant = (userId: string, participants: UserDto[]): boolean => {
    const filteredParticipant: UserDto[] = participants.filter((user: UserDto) => user.userId === userId);
    return filteredParticipant.length > 0;
  };

  const getVotingUserStory = (): UserStoryIncludes | undefined => {
    if (room && votingUserStoryId) {
      const filteredUserStories: UserStoryIncludes[] = room.UserStory.filter((userStory: UserStoryIncludes) => userStory.userStoryId === votingUserStoryId);
      if (filteredUserStories.length > 0) return filteredUserStories[0];
    }

    return undefined;
  };

  const getUserVote = (): string => {
    if (room && votingUserStoryId) {
      const filteredUserStories: UserStoryIncludes[] = room.UserStory.filter((userStory: UserStoryIncludes) => userStory.userStoryId === getVotingUserStory()!.userStoryId);
      if (filteredUserStories.length > 0) {
        const userStory: UserStoryIncludes = filteredUserStories[0];
        const filteredVote: Vote[] = userStory.Vote.filter((vote: Vote) => vote.userId === cookies.user.userId);
        if (filteredVote.length > 0) return filteredVote[0].value;
      }
    }

    return '';
  };

  const values: string[] = ['0', '1', '2', '3', '5', '8', '13', '20', '40', '100'];

  if (!hasMounted || !room) {
    return <LoadingScreen />;
  }

  if (room.isClose) {
    return <ClosedRoom room={room} />;
  }

  return (
    <div className="flex flex-row w-full">
      <div className="flex flex-col bg-gray-100" style={{ minWidth: '300px', maxWidth: '70%' }}>

        <div className="flex flex-col items-center justify-center bg-gray-100">
          {room && <h1 className="text-2xl font-bold mb-2">{room.name}</h1>}
          {room && room.isClose && <h2 className="text-2xl font-bold mb-2">Room closed</h2>}
          {votingUserStoryId && canVote &&
            <h2 className="text-xl font-semibold mb-4">Please vote for the user
              story: {getVotingUserStory()!.name}</h2>}
          <EllipseNames users={participants} width={220} roomId={roomId} isAdmin={isAdmin}
                        userStory={getVotingUserStory()} showVote={!canVote} />
        </div>

        {votingUserStoryId && canVote &&
          <div className="flex flex-wrap w-full p-4">
            {values.map((value) => <Card key={value} roomId={roomId} userStoryId={getVotingUserStory()!.userStoryId}
                                         value={value} isSelected={getUserVote() === value} />)}
          </div>
        }
      </div>

      <div className="flex-1">
        {isAdmin && <CopyToClipBoard />}
        {isAdmin && <ButtonCloseRoom roomId={roomId} />}
        {!isAdmin && <ButtonLeaveRoom roomId={roomId} />}
        {room && <ButtonDownloadCSV roomId={room.roomId} />}
        <UserStoryPanel roomId={roomId} roomUserStories={room.UserStory || []} isAdmin={isAdmin} canVote={canVote} />
      </div>
    </div>
  );
}
