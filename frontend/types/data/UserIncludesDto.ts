import { Room } from './Room';
import { UserDto } from './UserDto';
import { UserRoom } from './UserRoom';
import { Vote } from './Vote';

export type UserIncludesDto = UserDto & {
  Room: Room[];
  UserRoom: UserRoom[];
  Vote: Vote[];
}