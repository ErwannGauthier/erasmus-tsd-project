import { UserRoom } from './UserRoom';
import { UserDto } from './UserDto';
import { Room } from './Room';

export type UserRoomIncludes = UserRoom & {
  Room: Room;
  User: UserDto;
}