import { RoomIncludes } from '../data/RoomIncludes';
import { CommonResponse } from './CommonResponse';

export interface GetAllRoomsResponse extends CommonResponse {
  rooms?: RoomIncludes[];
}