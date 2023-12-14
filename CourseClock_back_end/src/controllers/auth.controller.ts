
import { Request, Response, NextFunction } from 'express';
import { IUser } from '../interfaces/IUser.interface';
import { UserModel as User } from '../models/user.model';
import { PasswordModel as Password } from '../models/password.model';
import { CourseModel as Course } from '../models/courses.model';
import { TokenModel as Token } from '../models/token.model';
import {  createJWT, createRefreshJWT, createNonExpiringJWT } from '../utils/jwt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { ScheduleModel as Schedule } from '../models/schedule.model';
dotenv.config();

/**
 * Logs in a user.
 * @route POST /auth/login
 * @summary Logs in a user.
 * @tags Authentication
 * @param {object} requestBody.body.required - The request body containing user's email, password, and isInstructor flag.
 * @param {string} requestBody.body.email - User's email.
 * @param {string} requestBody.body.password - User's password.
 * @param {boolean} requestBody.body.isInstructor - Flag to indicate if user is an instructor.
 * @returns {object} 200 - Successfully logged in, returns access and refresh tokens.
 * @returns {object} 401 - Unauthorized, wrong password.
 * @returns {object} 404 - User not found.
 */
export const login = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, isInstructor } = req.body;
    try {
        const user: IUser | null = await User.findOne({ email: email });
        if (user) {
            if ((user.role === 0) === isInstructor && await Password.checkPassword(user._id, password)) {
                const accessToken = createJWT(user.toJSON());
                const refreshToken = createRefreshJWT(user.toJSON());
                await Token.createNewToken(refreshToken, user._id);
                //maybe this is not the best way to do it
                res.cookie('jwt', refreshToken, { httpOnly: true , maxAge: 1000 * 60 * 60 * 24 * 7});
                res.json({
                    accessToken,
                    id : user._id
                });
            } else {
                res.status(401).json('Wrong password');
            }
        } else {
            res.status(404).json('User not found');
        }
    } catch (error) {
        next(error);
    }
}

/**
 * Registers a new user.
 * @route POST /auth/register
 * @summary Registers a new user.
 * @tags Authentication
 * @param {object} requestBody.body.required - The request body containing user's email, password, re_password, isInstructor flag, courses, schedule, firstName, and lastName.
 * @param {string} requestBody.body.email - User's email.
 * @param {string} requestBody.body.password - User's password.
 * @param {string} requestBody.body.re_password - User's password confirmation.
 * @param {boolean} requestBody.body.isInstructor - Flag to indicate if user is an instructor.
 * @param {string[]} requestBody.body.courses - Array of course names.
 * @param {object} requestBody.body.schedule - User's schedule object.
 * @param {string} requestBody.body.firstName - User's first name.
 * @param {string} requestBody.body.lastName - User's last name.
 * @returns {object} 201 - User successfully created.
 * @returns {object} 400 - Bad request, possibly due to existing user or password mismatch.
 */
export const register = async (req: Request, res: Response, next: NextFunction) => {
    const { password, re_password, isInstructor, email, courses, schedule, firstName, lastName} = req.body;

    if (password !== re_password) {
        return res.status(400).json({ message: "Password does not match" });
    }

    const role = isInstructor ? 0 : 1;
    const existingUser = await User.findOne({ email: email, role: role });

    if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
    }

    try {
        const newUser :IUser = new User({
            email,
            role,
            firstName,
            lastName,
        });
        const user = await User.createNewUser(newUser);
        const new_schedule = await Schedule.create({schedule: schedule});
        await User.addScheduleToUser(user._id, new_schedule._id);
        await Promise.all(courses.map(async (c) => {
            let curCourse = await Course.findOne({ name: c }).exec();
            if (curCourse) {
                await User.addCourseToUser(user._id, curCourse._id);
                if (!isInstructor) { 
                    Course.addUserToCourse(user._id, curCourse._id);
                }
            } else if (isInstructor){
                await Course.createCourse(c)
                curCourse = await Course.findOne({ name: c }).exec();
                await User.addCourseToUser(user._id, curCourse._id);
            }
        }));
        await Password.savePassword(user._id, password);
        res.status(201).json({
            message: "User is created!",
            key: user._id
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Refreshes the access token using a refresh token.
 * @route POST /auth/refreshToken
 * @summary Refreshes the access token using a refresh token.
 * @tags Authentication
 * @returns {object} 200 - Successfully refreshed, returns new access token.
 * @returns {object} 401 - Unauthorized, no refresh token provided.
 * @returns {object} 403 - Forbidden, invalid or expired refresh token.
 */
export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    const cookie = req.cookies;
    if (!cookie?.jwt) {
        return res.sendStatus(401);
    }   
    const refreshToken = cookie.jwt;

    try {
        const user = await Token.verifyToken(refreshToken);
        if (!user) {
            return res.sendStatus(403);
        }
        jwt.verify(
            refreshToken, 
            process.env.REFRESH_TOKEN_SECRET as string, 
            (err: any, decoded: any) => { 
                if (err || user._id !== decoded._id) {
                    return res.sendStatus(403); // Forbidden
                }
                
                const accessToken = createJWT(user.toJSON());
                res.json({
                    accessToken,
                    id : user._id
                });
            }
        );
            
    } catch (error) {
        next(error);
    }
}
/**
 * Logs out a user by clearing the refresh token.
 * @route POST /auth/logout
 * @summary Logs out a user by clearing the refresh token.
 * @tags Authentication
 * @returns {object} 204 - Successfully logged out.
 */
export const logout = async (req: Request, res: Response, next: NextFunction) => {
    const cookie = req.cookies;
    if (!cookie?.jwt) {
        res.clearCookie('jwt', { httpOnly: true });
        return res.sendStatus(204);
    }   
    const refreshToken = cookie.jwt;
    try {
        await Token.deleteToken(refreshToken);
        res.clearCookie('jwt', { httpOnly: true });
        // secure: true, // only set cookies over https. Server will not send back a cookie over http.
        res.sendStatus(204);
    }catch (error) {
        next(error);
    }
}
/**
 * Generate a test token.
 * @route GET /auth/test
 * @summary Generate a test token.
 * @tags Authentication
 * @returns {object} 200 - Successfully generated test token.
 */
export const genTokenTest = async (req: Request, res: Response, next: NextFunction) => {
    res.json({
        accessToken: createNonExpiringJWT({ _id: "123", role: 0, email: ""}),
    })
}
