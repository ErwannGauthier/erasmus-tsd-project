import { Room } from './Room';
import { UserDto } from './UserDto';
import { UserRoomIncludes } from './UserRoomIncludes';
import { UserStoryIncludes } from './UserStoryIncludes';

export type RoomIncludes = Room & {
  Admin: UserDto;
  UserRoom: UserRoomIncludes[];
  UserStory: UserStoryIncludes[];
}