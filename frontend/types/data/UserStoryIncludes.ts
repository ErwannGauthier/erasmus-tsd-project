import { Room } from './Room';
import { UserStory } from './UserStory';
import { Vote } from './Vote';

export type UserStoryIncludes = UserStory & {
  Room: Room;
  Vote: Vote[];
}