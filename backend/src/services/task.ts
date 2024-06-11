import {PrismaClient, Task} from "@prisma/client";

export class TaskService {
    private prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    public async getAll(): Promise<Task[]> {
        return this.prisma.task.findMany();
    }

    public async get(id: string): Promise<Task | null> {
        return this.prisma.task.findUnique({where: {taskId: id}});
    }

    public async create(name: string, description: string, userStoryId: string): Promise<Task> {
        return this.prisma.task.create({
            data: {
                taskId: crypto.randomUUID(),
                name: name,
                description: description,
                userStoryId: userStoryId
            }
        });
    }

    public async update(id: string, name: string, description: string, userStoryId: string): Promise<Task> {
        return this.prisma.task.update({
            where: {
                taskId: id,
            },
            data: {
                name: name,
                description: description,
                userStoryId: userStoryId
            }
        });
    }

    public async delete(id: string): Promise<Task> {
        return this.prisma.task.delete({where: {taskId: id}});
    }
}