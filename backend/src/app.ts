import express from "express";
import http from "http";
import {Server} from 'socket.io';
import cors from 'cors';
import {userRouter} from "./routes/user";
import {RoomIncludes, RoomService} from "./services/room";
import {PrismaClient, Room, UserStory} from "@prisma/client";
import {UserService} from "./services/user";
import {UserStoryService} from "./services/userStory";

const app = express();
const server = http.createServer(app);
const prismaClient: PrismaClient = new PrismaClient();

app.use(express.json());
app.use(cors({origin: 'http://localhost:3000'}));

app.use('/user', userRouter);

const io = new Server(server, {
    cookie: true,
    cors: {
        origin: "*",
        credentials: true,
    }
});

//io.use(authSocket);

io.on("connection", (socket) => {
    console.log("Client connected " + socket.id);
    const userService: UserService = new UserService(prismaClient);
    const roomService: RoomService = new RoomService(prismaClient);
    const userStoryService: UserStoryService = new UserStoryService(prismaClient);

    interface CreateRoomData {
        name: string,
        maxUsers: number,
        isPrivate: boolean,
        adminId: string,
    }

    socket.on("createRoom", async (data: CreateRoomData, callback) => {
        try {
            const {name, maxUsers, isPrivate, adminId}: CreateRoomData = data;
            //const adminId: string = (socket as CustomSocket).user.userId;
            if (!await userService.get(adminId)) {
                callback(false, 'You must be logged in.');
                return
            }

            const room: Room = await roomService.create(name, maxUsers, isPrivate, adminId);
            if (!room.isPrivate) {
                socket.broadcast.emit("newRoom", room);
            }
            callback(true, room.roomId);
        } catch (error) {
            console.error(error);
            callback("Internal Server Error");
        }
    });

    socket.on('joinRoom', async (data: { userId: string, roomId: string }, callback) => {
        try {
            const {userId, roomId} = data;
            const room: RoomIncludes | null = await roomService.get(roomId);
            if (!await userService.get(userId) || !room) {
                callback({isOk: false, error: "Not found"});
                return;
            } else if (!await userService.isInRoom(userId, roomId) && room.maxUsers <= room.UserRoom.length) {
                callback({isOk: false, error: "The room is full."});
                return;
            }

            const hasJoined: boolean = await userService.joinRoom(userId, roomId);
            if (!hasJoined) {
                callback({isOk: false, error: "An error has occurred."});
                return;
            }

            socket.join(roomId);
            const updatedRoom: RoomIncludes = (await roomService.get(roomId))!;
            socket.to(roomId).emit("updateRoomData", updatedRoom);
            socket.emit("updateRoomData", room);

            callback({isOk: true, message: "You joined the room.", room: updatedRoom});
        } catch (error) {
            console.error(error);
            callback({isOk: false, error: "Internal Server Error"});
        }
    });

    socket.on("leaveRoom", async (data: { userId: string, roomId: string }, callback) => {
        try {
            const {userId, roomId} = data;
            if (!await userService.get(userId) || !await roomService.get(roomId)) {
                callback({isOk: false, error: "Not found"});
                return;
            }

            const hasLeaved: boolean = await userService.leaveRoom(userId, roomId);
            if (!hasLeaved) {
                callback({isOk: false, error: "An error has occurred."});
                return;
            }

            const room: RoomIncludes = (await roomService.get(roomId))!;

            socket.to(roomId).emit("updateRoomData", room);
            socket.emit("updateRoomData", room);
            socket.leave(roomId);
        } catch (error) {
            console.error(error);
            callback({isOk: false, error: "Internal Server Error"});
        }
    });

    socket.on("kickRoom", async (data: { userId: string, roomId: string }, callback) => {
        try {
            const {userId, roomId} = data;
            if (!await userService.get(userId) || !await roomService.get(roomId)) {
                callback({isOk: false, error: "Not found"});
                return;
            }

            const hasLeaved: boolean = await userService.leaveRoom(userId, roomId);
            if (!hasLeaved) {
                callback({isOk: false, error: "An error has occurred."});
                return;
            }

            const room: RoomIncludes = (await roomService.get(roomId))!;

            socket.to(roomId).emit("updateRoomData", room);
            socket.emit("updateRoomData", room);
        } catch (error) {
            console.error(error);
            callback({isOk: false, error: "Internal Server Error"});
        }
    });

    socket.on("createUserStory", async (data: { roomId: string, name: string, description: string }, callback) => {
        try {
            const {roomId, name, description} = data;
            if (!await roomService.get(roomId)) {
                callback({isOk: false, error: "Not found"});
                return;
            }

            const userStory: UserStory = await userStoryService.create(name, description, "", roomId);
            const room: RoomIncludes = (await roomService.get(roomId))!;
            socket.to(roomId).emit("updateRoomData", room);
            socket.emit("updateRoomData", room);
            callback({isOk: true, message: "User Story created."});
        } catch (error) {
            console.error(error);
            callback({isOk: false, error: "Internal Server Error"});
        }
    })

    socket.on("disconnect", () => {
        console.log("Client disconnected: " + socket.id);
    });
});

const port: string = process.env.PORT || "3001";
server.listen(port, () => {
    console.log("Server started on port " + port);
})