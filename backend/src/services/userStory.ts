import {PrismaClient, Room, UserStory, Vote} from "@prisma/client";

export type UserStoryIncludes = UserStory & {
    Room: Room;
    Vote: Vote[];
}

export class UserStoryService {
    private prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    public async getAll(): Promise<UserStoryIncludes[]> {
        return this.prisma.userStory.findMany({
            include: {
                Room: true,
                Vote: true
            }
        });
    }

    public async get(id: string): Promise<UserStoryIncludes | null> {
        return this.prisma.userStory.findUnique({
            where: {
                userStoryId: id
            },
            include: {
                Room: true,
                Vote: true
            }
        });
    }

    public async create(name: string, description: string, finalVote: string, roomId: string): Promise<UserStory> {
        return this.prisma.userStory.create({
            data: {
                userStoryId: crypto.randomUUID(),
                name: name,
                description: description,
                finalVote: finalVote,
                roomId: roomId
            }
        });
    }

    public async update(id: string, name: string, description: string, finalVote: string, roomId: string): Promise<UserStory> {
        return this.prisma.userStory.update({
            where: {
                userStoryId: id
            },
            data: {
                name: name,
                description: description,
                finalVote: finalVote,
                roomId: roomId
            }
        });
    }

    public async delete(id: string): Promise<UserStory> {
        return this.prisma.userStory.delete({where: {userStoryId: id}});
    }
}