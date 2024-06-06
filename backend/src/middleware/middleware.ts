import jwt from 'jsonwebtoken';
import {NextFunction, Request, Response} from 'express';
import {UserDto} from "../services/user";

export interface CustomRequest extends Request {
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