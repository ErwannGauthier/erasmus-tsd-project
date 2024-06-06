import {PrismaClient, Room, User, UserRoom, Vote} from "@prisma/client";
import bcrypt from "bcrypt";
import {RoomIncludes, RoomService} from "./room";
import {UserStoryIncludes, UserStoryService} from "./userStory";

export type UserDto = {
    userId: string;
    name: string;
    surname: string;
    email: string;
}

export type UserIncludes = User & {
    Room: Room[];
    UserRoom: UserRoom[];
    Vote: Vote[];
}

export type UserIncludesDto = UserDto & {
    Room: Room[];
    UserRoom: UserRoom[];
    Vote: Vote[];
}

export class UserService {
    private prisma: PrismaClient;
    private roomService: RoomService;
    private userStoryService: UserStoryService;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
        this.roomService = new RoomService(this.prisma);
        this.userStoryService = new UserStoryService(this.prisma);
    }

    public async getAll(): Promise<UserIncludesDto[]> {
        const users: UserIncludes[] = await this.prisma.user.findMany({
            include: {
                Room: true,
                UserRoom: true,
                Vote: true,
            }
        });

        return users.map((user: UserIncludes) => this.userIncludesToUserIncludesDto(user));
    }

    public async get(id: string): Promise<UserIncludesDto | null> {
        const user: UserIncludes | null = await this.prisma.user.findUnique({
            where: {
                userId: id
            },
            include: {
                Room: true,
                UserRoom: true,
                Vote: true,
            }
        });

        return user ? this.userIncludesToUserIncludesDto(user) : null;
    }

    public async getByEmail(email: string): Promise<UserIncludesDto | null> {
        const user: UserIncludes | null = await this.prisma.user.findUnique({
            where: {
                email: email
            },
            include: {
                Room: true,
                UserRoom: true,
                Vote: true,
            }
        });

        return user ? this.userIncludesToUserIncludesDto(user) : null;
    }

    public async create(name: string, surname: string, email: string, password: string): Promise<UserDto> {
        const hashedPassword: string = await bcrypt.hash(password, 10);
        const user: User = await this.prisma.user.create({
            data: {
                userId: crypto.randomUUID(),
                name: name,
                surname: surname,
                email: email,
                password: hashedPassword
            }
        });

        return this.userToUserDto(user);
    }

    public async update(id: string, name: string, surname: string, email: string): Promise<UserDto> {
        const user: User = await this.prisma.user.update({
            where: {
                userId: id
            },
            data: {
                name: name,
                surname: surname,
                email: email,
            }
        });

        return this.userToUserDto(user);
    }

    public async updatePassword(id: string, password: string, newPassword: string): Promise<boolean> {
        const user: User | null = await this.prisma.user.findUnique({
            where: {
                userId: id
            }
        });

        if (!user || !await bcrypt.compare(newPassword, password)) return false;

        const hashedPassword: string = await bcrypt.hash(newPassword, 10);
        await this.prisma.user.update({
            where: {
                userId: id
            },
            data: {
                password: hashedPassword
            }
        });

        return true;
    }

    public async delete(id: string): Promise<UserDto> {
        const user: User = await this.prisma.user.delete({
            where: {
                userId: id
            }
        });

        return this.userToUserDto(user);
    }

    public async login(email: string, password: string): Promise<UserDto | null> {
        const user: User | null = await this.prisma.user.findUnique({
            where: {
                email: email
            }
        });

        if (!user || !await bcrypt.compare(password, user.password)) return null;

        return this.userToUserDto(user);
    }

    public async isInRoom(id: string, roomId: string): Promise<boolean> {
        const userRoom: UserRoom | null = await this.prisma.userRoom.findUnique({
            where: {
                userRoomId: {
                    userId: id,
                    roomId: roomId
                }
            }
        });

        if (!userRoom) return false;
        return true;
    }

    public async joinRoom(id: string, roomId: string): Promise<boolean> {
        const user: UserIncludesDto | null = await this.get(id);
        const room: RoomIncludes | null = await this.roomService.get(roomId);

        if (!user || !room) return false;

        const userRoom: UserRoom | null = await this.prisma.userRoom.findUnique({
            where: {
                userRoomId: {
                    userId: id,
                    roomId: roomId
                }
            }
        });

        if (!userRoom) {
            await this.prisma.userRoom.create({
                data: {
                    userId: id,
                    roomId: roomId
                }
            });
        }

        return true;
    }

    public async leaveRoom(id: string, roomId: string): Promise<boolean> {
        const user: UserIncludesDto | null = await this.get(id);
        const room: RoomIncludes | null = await this.roomService.get(roomId);

        if (!user || !room) return false;

        const userRoom: UserRoom | null = await this.prisma.userRoom.findUnique({
            where: {
                userRoomId: {
                    userId: id,
                    roomId: roomId
                }
            }
        });

        if (userRoom) {
            await this.prisma.userRoom.delete({
                where: {
                    userRoomId: {
                        userId: id,
                        roomId: roomId
                    }
                }
            });
        }

        return true;
    }

    public async vote(id: string, userStoryId: string, value: string): Promise<boolean> {
        const user: UserIncludesDto | null = await this.get(id);
        const userStory: UserStoryIncludes | null = await this.userStoryService.get(userStoryId);

        if (!user || !userStory) return false;

        const vote: Vote | null = await this.prisma.vote.findUnique({
            where: {
                voteId: {
                    userId: id,
                    userStoryId: userStoryId
                }
            }
        });

        if (vote) {
            await this.prisma.vote.update({
                where: {
                    voteId: {
                        userId: id,
                        userStoryId: userStoryId
                    }
                },
                data: {
                    value: value
                }
            });
        } else {
            await this.prisma.vote.create({
                data: {
                    userId: id,
                    userStoryId: userStoryId,
                    value: value
                }
            });
        }

        return true;
    }

    public async unvote(id: string, userStoryId: string): Promise<boolean> {
        const user: UserIncludesDto | null = await this.get(id);
        const userStory: UserStoryIncludes | null = await this.userStoryService.get(userStoryId);

        if (!user || !userStory) return false;

        const vote: Vote | null = await this.prisma.vote.findUnique({
            where: {
                voteId: {
                    userId: id,
                    userStoryId: userStoryId
                }
            }
        });

        if (vote) {
            await this.prisma.vote.delete({
                where: {
                    voteId: {
                        userId: id,
                        userStoryId: userStoryId
                    }
                }
            });
        }

        return true;
    }

    private userToUserDto(user: User): UserDto {
        return {
            userId: user.userId,
            name: user.name,
            surname: user.surname,
            email: user.email,
        };
    }

    private userIncludesToUserIncludesDto(userIncludes: UserIncludes): UserIncludesDto {
        return {
            userId: userIncludes.userId,
            name: userIncludes.name,
            surname: userIncludes.surname,
            email: userIncludes.email,
            Room: userIncludes.Room,
            UserRoom: userIncludes.UserRoom,
            Vote: userIncludes.Vote,
        }
    }
}