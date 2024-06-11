import React, { useEffect, useState } from 'react';
import { UserDto } from '../../types/data/UserDto';

interface EllipseNamesProps {
  users: UserDto[];
  width: number;
}

const EllipseNames: React.FC<EllipseNamesProps> = ({ users, width }) => {
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

  return (
    <div className="relative mx-auto" style={{ width: `${540}px`, height: `${290.52}px` }}>
      <div className="absolute inset-0 bg-table-image bg-cover bg-center rounded-full"
           style={{ clipPath: 'ellipse(75% 50% at 50% 50%)' }}></div>
      {users.map((user, index) => (
        <div
          key={index}
          className="absolute transform -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${size.width / 2 + positions[index]?.x}px`,
            top: `${size.height / 2 + positions[index]?.y}px`
          }}>
          <div className="rounded p-1 bg-gray-300">{user.name}</div>
        </div>
      ))}
      <div className="absolute transform -translate-x-1/2 -translate-y-1/2 text-center"
           style={{ left: `${size.width / 2}px`, top: `${size.height / 2}px` }}>
      </div>
    </div>
  );
};

export default EllipseNames;
