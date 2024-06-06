import {PrismaClient, Room, UserRoom, UserStory} from "@prisma/client";
import {UserDto} from "./user";

export type UserRoomIncludes = UserRoom & {
    Room: Room;
    User: UserDto;
}

export type RoomIncludes = Room & {
    Admin: UserDto;
    UserRoom: UserRoomIncludes[];
    UserStory: UserStory[];
}

export class RoomService {
    private prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    public async getAll(): Promise<RoomIncludes[]> {
        return this.prisma.room.findMany({
            include: {
                Admin: true,
                UserRoom: {
                    include: {
                        Room: true,
                        User: true,
                    }
                },
                UserStory: true
            }
        });
    }

    public async get(id: string): Promise<RoomIncludes | null> {
        return this.prisma.room.findUnique({
            where: {
                roomId: id
            },
            include: {
                Admin: true,
                UserRoom: {
                    include: {
                        Room: true,
                        User: true,
                    }
                },
                UserStory: true
            }
        });
    }

    public async create(name: string, maxUsers: number, isPrivate: boolean, adminId: string): Promise<Room> {
        return this.prisma.room.create({
            data: {
                roomId: crypto.randomUUID(),
                name: name,
                maxUsers: Number(maxUsers),
                isPrivate: isPrivate,
                adminId: adminId,
            }
        });
    }

    public async update(id: string, name: string, maxUsers: number, isPrivate: boolean, adminId: string): Promise<Room> {
        return this.prisma.room.update({
            where: {
                roomId: id
            },
            data: {
                name: name,
                maxUsers: maxUsers,
                isPrivate: isPrivate,
                adminId: adminId,
            }
        });
    }

    public async delete(id: string): Promise<Room> {
        return this.prisma.room.delete({where: {roomId: id}});
    }
}