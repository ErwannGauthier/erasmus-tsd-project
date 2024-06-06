'use client';

import {
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
  Table
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { int } from 'drizzle-orm/mysql-core';

interface Room {
  id: number;
  name: string;
}

export function UsersTable({
  offset
}: {
  offset: number | null;
}) {
  const router = useRouter();
  const rooms:Room[] =[
      {
        id: 1,
        name: 'John Doe',
      },
      {
        id: 2,
        name: 'Brown Doe',
      },
      {
        id: 3,
        name: 'Jane Doe',
      },
      
  ]

  return (
    <>
      <form className="border shadow-sm rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="max-w-[150px]">Id</TableHead>
              <TableHead className="hidden md:table-cell">Name</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rooms.map((room) => (
              <RoomRow key={room.id} room={room} />
            ))}
          </TableBody>
        </Table>
      </form>
    </>
  );
}

function RoomRow({ room }: { room: Room }) {
  return (
    <TableRow>
      <TableCell className="font-medium">{room.id}</TableCell>
      <TableCell className="hidden md:table-cell">{room.name}</TableCell>
    </TableRow>
  );
}
