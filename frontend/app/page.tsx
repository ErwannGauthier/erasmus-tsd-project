import { UsersTable } from './users-table';
import { IoAddCircleOutline } from 'react-icons/io5';

export default async function IndexPage() {

  return (
    <main className="flex flex-1 flex-col p-4 md:p-6">
      <div className="flex items-center mb-8">
        <h1 className="font-semibold text-lg md:text-2xl">Rooms</h1>
        <button className="flex ml-auto items-center space-x-2 p-2 bg-blue-500 text-white rounded">
          <span><IoAddCircleOutline className="h-4 w-4" /></span>
          <span>Create Room</span>
        </button>
      </div>

      <UsersTable offset={0} />
    </main>
  );
}
