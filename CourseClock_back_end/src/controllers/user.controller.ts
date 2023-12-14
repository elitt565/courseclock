import { Request, Response, NextFunction } from 'express';
import { IUser } from '../interfaces/IUser.interface';
import { UserModel as User } from '../models/user.model';
import { ScheduleModel as Schedule } from '../models/schedule.model';
import { CourseModel as Course } from '../models/courses.model';
import { Types } from 'mongoose';
import { ICourse } from '../interfaces/ICourses.interface';

/**
 * Add a new user to course and schedule.
 * @name POST /users/add
 * @function
 * @memberof module:userRoutes
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @returns {object} - User object
 * @throws {Error} - If user is invalid or not found
 */
export const addUserToCourseAndSchedule = async (req: Request, res: Response, next: NextFunction) => {
    const { firstName, lastName, courses, id} = req.body;
    try {
        // loop through course
        const uid = new Types.ObjectId(id);
        const newUser = await User.findById(uid);
        newUser.firstName = firstName;
        newUser.lastName = lastName;
        await Promise.all(courses.map(async (c) => {
            const curCourse = await Course.findOne({ name: c }).exec();
            if (curCourse) {
                await User.addCourseToUser(uid, curCourse._id);
                await Course.addUserToCourse(uid, curCourse._id);
            }
        }));
        await newUser.save();
        const newScheduleId = await Schedule.createNewSchedule();
        await User.addScheduleToUser(id, newScheduleId);
        res.json('User added!');
    } catch (error) {
        next(error);
    }
};

/**
 * Retrieves a user by their ID.
 * @name GET /users/{id}
 * @function
 * @memberof module:userRoutes
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @returns {object} - User data
 * @throws {Error} - If user is not found
 */
export const findUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user: IUser | null = await User.findById(new Types.ObjectId(req.params.id));
        res.json(user);
    } catch (error) {
        next(error);
    }
};

/**
 * Deletes a user by their ID.
 * @name DELETE /users/{id}
 * @function
 * @memberof module:userRoutes
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @returns {object} - Success message
 * @throws {Error} - If user is not found
 */
export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await User.findByIdAndDelete(new Types.ObjectId(req.params.id));
        res.json('User deleted.');
    } catch (error) {
        next(error);
    }
};

/**
 * Updates a user's information.
 * @name PUT /users/{id}
 * @function
 * @memberof module:userRoutes
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @returns {object} - Success message
 * @throws {Error} - If user is not found
 */
export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user: IUser | null = await User.findById(new Types.ObjectId(req.params.id));
        if (user) {
            user.firstName = req.body.firstName;
            user.lastName = req.body.lastName;
            user.email = req.body.email;
            user.course = await Course.findOne({ name: req.body.course }).exec() as any;
            user.role = req.body.role;

            await user.save();
            res.json('User updated!');
        } else {
            res.status(404).json('User not found.');
        }
    } catch (error) {
        next(error);
    }
};

/**
 * Retrieves courses associated with a user.
 * @name GET /users/{id}/courses
 * @function
 * @memberof module:userRoutes
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @returns {object} - Courses data
 * @throws {Error} - If user is not found or has no courses
 */
export const getUserCourses = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cs = await User.getUserCourses(new Types.ObjectId(req.params.id));
        if (cs) {
            const courses: string[] = cs.map(c => (c as unknown as ICourse).name);
            res.json(courses);
        } else {
            res.status(404).json('User not found.');
        }
    } catch (error) {
        next(error);
    }
}

