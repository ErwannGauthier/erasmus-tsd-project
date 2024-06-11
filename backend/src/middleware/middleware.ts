import jwt from 'jsonwebtoken';
import {NextFunction, Request, Response} from 'express';
import {UserDto} from "../services/user";
import {Socket} from "socket.io";
import {IncomingMessage} from "http";
import cookie from "cookie";

export interface CustomRequest extends Request {
    user: UserDto;
}

export interface CustomSocket extends Socket {
    user: UserDto;
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({error: 'You must be logged in.'});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY || '');
        (req as CustomRequest).user = decoded as UserDto;

        next();
    } catch (err) {
        res.status(401).json({error: 'Invalid token.'});
    }
};

export const authSocket = (socket: Socket, next: (err?: Error) => void) => {
    try {
        const req = socket.request as IncomingMessage;
        const cookies = cookie.parse(req.headers.cookie || "");
        const token = cookies.token;

        if (!token) {
            return next(new Error("Authentication error"));
        }

        jwt.verify(token, process.env.JWT_SECRET_KEY || '', (err, decoded) => {
            if (err) {
                return next(new Error("Authentication error"));
            }

            // Attach the decoded token to the socket object for later use
            (socket as CustomSocket).user = decoded as UserDto;
            next();
        });
    } catch (error) {
        next(new Error("Authentication error"));
    }
};