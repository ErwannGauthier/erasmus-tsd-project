import express from "express";
import http from "http";
import {Server} from 'socket.io';
import cors from 'cors';
import {userRouter} from "./routes/user";
import {RoomService} from "./services/room";
import {PrismaClient, Room} from "@prisma/client";
import {UserService} from "./services/user";

const app = express();
const server = http.createServer(app);
const prismaClient: PrismaClient = new PrismaClient();

app.use(express.json());
app.use(cors({origin: 'http://localhost:3000'}));

app.use('/user', userRouter);

const io = new Server(server, {
    cors: {
        origin: "*",
    }
});

io.on("connection", (socket) => {
    console.log("Client connected " + socket.id);
    const userService: UserService = new UserService(prismaClient);
    const roomService: RoomService = new RoomService(prismaClient);

    interface CreateRoomData {
        name: string,
        maxUsers: number,
        isPrivate: boolean,
        adminId: string
    }

    socket.on("createRoom", async (data: CreateRoomData, callback) => {
        try {
            const {name, maxUsers, isPrivate, adminId}: CreateRoomData = data;
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
    })
});

const port: string = process.env.PORT || "3001";
server.listen(port, () => {
    console.log("Server started on port " + port);
})