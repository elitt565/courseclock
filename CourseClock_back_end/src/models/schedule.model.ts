import mongoose from 'mongoose';
import { ISchedule, IScheduleModel } from '../interfaces/ISchedule.interface';
import {DEFAULT_SCHEDULE} from '../constants/default';


/**
 * @openapi
 * components:
 *   schemas:
 *     Schedule:
 *       type: object
 *       required:
 *         - schedule
 *         - createdAt
 *         - updatedAt
 *       properties:
 *         schedule:
 *           type: array
 *           items:
 *             type: array
 *             items:
 *               type: number
 *           description: Array of hits
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date of creation
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Date of last update
 */
const scheduleSchema = new mongoose.Schema<ISchedule, IScheduleModel>({
    schedule: {type: mongoose.Schema.Types.Mixed, required: true } // assuming Schedule is a string
  }, {
    timestamps: true,
});

scheduleSchema.statics.createNewSchedule = async function(){
    const newSchedule = await this.create(
        {schedule: DEFAULT_SCHEDULE.schedule});
    return newSchedule._id;
};


export const ScheduleModel = mongoose.model<ISchedule, IScheduleModel>('Schedule', scheduleSchema);