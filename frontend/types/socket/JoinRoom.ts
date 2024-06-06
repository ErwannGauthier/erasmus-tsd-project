import { RoomIncludes } from '../data/RoomIncludes';
import { CommonResponse } from './CommonResponse';

export interface JoinRoomResponse extends CommonResponse {
  room?: RoomIncludes;
}