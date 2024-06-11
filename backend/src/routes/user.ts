import express, {Router} from "express";
import {UserDto, UserIncludesDto, UserService} from "../services/user";
import {PrismaClient} from "@prisma/client";
import {isStringEmpty} from "../utils/utils";
import jwt from "jsonwebtoken";
import {auth} from "../middleware/middleware";

interface UserRegisterBody {
    name: string;
    surname: string;
    email: string;
    password: string;
}

interface UserLoginBody {
    email: string;
    password: string;
}

export const userRouter: Router = express.Router();
const userService: UserService = new UserService(new PrismaClient());

userRouter.get('/', auth, async (req: express.Request, res: express.Response) => {
    try {
        const users: UserIncludesDto[] = await userService.getAll();
        return res.status(200).json(users);
    } catch (error) {
        console.error(error);
        return res.status(500).json({error: "Internal Server Error"});
    }
});

userRouter.post('/register', async (req: express.Request, res: express.Response) => {
    try {
        const {name, surname, email, password}: UserRegisterBody = req.body;
        if (isStringEmpty(name) || isStringEmpty(surname) || isStringEmpty(email) || isStringEmpty(password)) {
            return res.status(400).json({error: "Name, surname, email and password must be specified."});
        }

        if (await userService.getByEmail(email)) {
            return res.status(409).json({error: "Email address is already in use."});
        }

        const user: UserDto = await userService.create(name, surname, email, password);
        return res.status(200).json({message: "Account successfully created.", user: user});
    } catch (error) {
        console.error(error);
        return res.status(500).json({error: "Internal Server Error"});
    }
});

userRouter.post('/login', async (req: express.Request, res: express.Response) => {
    try {
        const {email, password}: UserLoginBody = req.body;
        if (isStringEmpty(email) || isStringEmpty(password)) {
            return res.status(400).json({error: "Email and password must be specified."});
        }

        const user: UserDto | null = await userService.login(email, password);
        if (!user) return res.status(401).send({error: 'Incorrect email or password.'});

        const token: string = jwt.sign(user, process.env.JWT_SECRET_KEY || '', {
            expiresIn: '1d',
        });

        return res.status(200).json({message: "Login successful.", token: token, user: user});
    } catch (error) {
        console.error(error);
        return res.status(500).json({error: "Internal Server Error"});
    }
});