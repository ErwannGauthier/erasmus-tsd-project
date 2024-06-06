import { Room } from './Room';
import { UserDto } from './UserDto';
import { UserStory } from './UserStory';
import { UserRoomIncludes } from './UserRoomIncludes';

export type RoomIncludes = Room & {
  Admin: UserDto;
  UserRoom: UserRoomIncludes[];
  UserStory: UserStory[];
}