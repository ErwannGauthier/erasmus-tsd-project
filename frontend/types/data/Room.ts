export type Room = {
  roomId: string,
  name: string,
  createdAt: Date,
  maxUsers: number,
  isPrivate: boolean,
  isClose: boolean,
  adminId: string,
  typeOfVote: string,
}