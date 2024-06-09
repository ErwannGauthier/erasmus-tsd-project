import React, { useEffect, useState } from 'react';
import { UserDto } from '../types/data/UserDto';
import socket from '../utils/socket';
import { useCookies } from 'react-cookie';
import { UserStoryIncludes } from '../types/data/UserStoryIncludes';
import { Vote } from '../types/data/Vote';

interface EllipseNamesProps {
  users: UserDto[];
  width: number;
  roomId: string;
  isAdmin: boolean;
  userStory?: UserStoryIncludes;
  showVote: boolean;
}

const EllipseNames: React.FC<EllipseNamesProps> = ({ users, width, roomId, isAdmin, userStory, showVote }) => {
  const [cookies] = useCookies(['user']);

  const [positions, setPositions] = useState<{ x: number; y: number }[]>([]);
  const [size, setSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

  useEffect(() => {
    const ellipsePositions = calculateEllipsePositions(users.length, width, width / 2);
    setPositions(ellipsePositions);

    const maxX = Math.max(...ellipsePositions.map(p => p.x));
    const maxY = Math.max(...ellipsePositions.map(p => p.y));
    const minX = Math.min(...ellipsePositions.map(p => p.x));
    const minY = Math.min(...ellipsePositions.map(p => p.y));

    setSize({
      width: maxX - minX + 100,
      height: maxY - minY + 100
    });
  }, [users.length]);

  const calculateEllipsePositions = (count: number, rx: number, ry: number) => {
    const positions = [];
    const angleStep = (2 * Math.PI) / count;

    for (let i = 0; i < count; i++) {
      const angle = i * angleStep;
      const x = rx * Math.cos(angle);
      const y = ry * Math.sin(angle);
      positions.push({ x, y });
    }

    return positions;
  };

  const handleKick = (userId: string) => {
    socket.emit('kickRoom', { userId: userId, roomId: roomId });
  };

  const hasUserVoted = (userId: string): boolean => {
    if (!userStory) return false;
    const filteredVote: Vote[] = userStory.Vote.filter((vote: Vote) => vote.userId === userId);
    return filteredVote.length > 0;
  };

  const getUserVote = (userId: string): string => {
    if (!userStory) return '';
    const filteredVote: Vote[] = userStory.Vote.filter((vote: Vote) => vote.userId === userId);
    if (filteredVote.length > 0) return filteredVote[0].value;
    return '';
  };

  return (
    <div className="relative mx-auto" style={{ width: `${size.width}px`, height: `${size.height}px` }}>
      <div className="absolute inset-0 bg-table-image bg-cover bg-center rounded-full"
           style={{ clipPath: 'ellipse(75% 50% at 50% 50%)' }}></div>
      {users.map((user, index) => (
        <div
          key={index}
          className="absolute transform -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${size.width / 2 + positions[index]?.x}px`,
            top: `${size.height / 2 + positions[index]?.y}px`
          }}
        >
          {/* */}
          <div className={`rounded p-1 ${hasUserVoted(user.userId) ? 'bg-green-600' : 'bg-red-600'}`}>{user.name}</div>
          {userStory && showVote && getUserVote(user.userId) && <p>Vote: {getUserVote(user.userId)}</p>}
          {(isAdmin && user.userId !== cookies.user.userId) && <button onClick={() => handleKick(user.userId)}
                                                                       className="font-normal text-sm rounded p-1 bg-gray-400">Kick</button>}
        </div>
      ))}
      <div className="absolute transform -translate-x-1/2 -translate-y-1/2 text-center"
           style={{ left: `${size.width / 2}px`, top: `${size.height / 2}px` }}>
      </div>
    </div>
  );
};

export default EllipseNames;
