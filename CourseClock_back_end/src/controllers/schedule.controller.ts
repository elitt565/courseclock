import { Request, Response, NextFunction } from 'express';
import { ScheduleModel as Schedule } from '../models/schedule.model';
import { UserModel as User } from '../models/user.model';
import { CourseModel as Course } from '../models/courses.model';
import { modifyHits } from '../utils/util';
import { Types } from 'mongoose';



/**
 * Get all schedules.
 * @route GET /schedule/all
 * @group Schedules - Operations related to schedules.
 * @returns {object} 200 - All schedules.
 * @returns {object} 500 - Internal server error.
 */
export const getAllSchedules = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const schedules = await Schedule.find();
        res.status(200).json(schedules);
    } catch (error) {
        next(error);
    }
};

/**
 * Get a schedule by its ID.
 * @route GET /schedule/{id}
 * @param {string} id.path.required - The ID of the schedule.
 * @group Schedules - Operations related to schedules.
 * @returns {object} 200 - The requested schedule.
 * @returns {object} 404 - Schedule not found.
 * @returns {object} 500 - Internal server error.
 */
export const getScheduleById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = new Types.ObjectId(req.params.id);
        const s = await User.getUserSchedule(userId)
        if (!s) {
            res.status(404).json({ error: 'Schedule not found' });
        } else {
            res.status(200).json(s.schedule);
        }
    } catch (error) {
        next(error);
    }
};
//TODO: this will need to look cleaner
/**
 * Update a schedule by its ID.
 * @route POST /schedule/update/{id}
 * @param {string} id.path.required - The ID of the schedule.
 * @param {Schedule.model} request.body.required - The updated schedule object.
 * @group Schedules - Operations related to schedules.
 * @returns {object} 200 - Schedule updated.
 * @returns {object} 400 - Invalid schedule.
 * @returns {object} 404 - Schedule not found.
 * @returns {object} 500 - Internal server error.
 */
export const updateScheduleById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = new Types.ObjectId(req.params.id);
        const updatedScheduleData = req.body.s;
        const user = await User.findById(userId)
        const oldSchedule = await Schedule.findById(user.schedule)
        for(let i = 0; i < user.course.length; i++){
            const curCourse = await (Course.findById(user.course[i]))
            const newHits = modifyHits(oldSchedule.schedule, updatedScheduleData, curCourse.hits)
            await Course.updateOne({_id : user.course[i]}, {$set:{hits : newHits}})
        }
        const updatedSchedule = await Schedule.updateOne({_id : user.schedule}, {$set:{schedule : updatedScheduleData}});
        if (!updatedSchedule) {
            res.status(404).json({ error: 'Schedule not found' });
        } else {
            res.status(200).json(updatedSchedule);
        }
    } catch (error) {
        next(error);
    }
};
