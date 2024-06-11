import {createObjectCsvWriter} from 'csv-writer';
import path from 'path';
import fs from 'fs';
import {PrismaClient} from "@prisma/client";
import express from "express";
import {RoomIncludes, RoomService} from "../services/room";

const prisma = new PrismaClient();
export const csvRouter = express.Router();
const roomService: RoomService = new RoomService(prisma);

csvRouter.get('/download-room-csv/:roomId', async (req, res) => {
    const {roomId} = req.params;
    try {
        // Fetch room data
        const room: RoomIncludes | null = await roomService.get(roomId);

        if (!room) {
            return res.status(404).json({error: 'Room not found'});
        }

        // Prepare data for CSV
        const records = room.UserStory.map((userStory) => {
            const tasks = userStory.Task.map(task => `${task.name} (${task.description})`).join('; ');
            const votes = userStory.Vote.map(vote => `${vote.userId}: ${vote.value}`).join('; ');

            return {
                roomId: room.roomId,
                roomName: room.name,
                userStoryId: userStory.userStoryId,
                userStoryName: userStory.name,
                userStoryDescription: userStory.description,
                finalVote: userStory.finalVote,
                tasks,
                votes
            };
        });

        // CSV writer configuration
        const csvWriter = createObjectCsvWriter({
            path: path.join(__dirname, 'room_data.csv'),
            header: [
                {id: 'roomId', title: 'Room ID'},
                {id: 'roomName', title: 'Room Name'},
                {id: 'userStoryId', title: 'User Story ID'},
                {id: 'userStoryName', title: 'User Story Name'},
                {id: 'userStoryDescription', title: 'User Story Description'},
                {id: 'finalVote', title: 'Final Vote'},
                {id: 'tasks', title: 'Tasks'},
                {id: 'votes', title: 'Votes'}
            ]
        });

        // Write CSV file
        await csvWriter.writeRecords(records);

        // Send CSV file to client
        res.download(path.join(__dirname, 'room_data.csv'), (err) => {
            if (err) {
                console.error('Error sending file:', err);
                res.status(500).send('Error sending file');
            }

            // Remove the file after sending
            fs.unlinkSync(path.join(__dirname, 'room_data.csv'));
        });
    } catch (error) {
        console.error('Error generating CSV:', error);
        res.status(500).json({error: 'Internal Server Error'});
    }
});
