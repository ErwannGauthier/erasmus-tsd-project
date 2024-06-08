import { Room } from './Room';
import { Task } from './Task';
import { UserStory } from './UserStory';
import { Vote } from './Vote';

export type UserStoryIncludes = UserStory & {
  Room: Room;
  Task: Task[];
  Vote: Vote[];
}