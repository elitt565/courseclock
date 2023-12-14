/**
 * Represents the schedule interface.
 */
import { Document, Model, Types } from 'mongoose';

/**
 * Represents the schedule document.
 */
export interface ISchedule extends Document {
  schedule: number[][];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Represents the schedule model.
 */
export interface IScheduleModel extends Model<ISchedule> {
  /**
   * Creates a new schedule.
   * @returns A promise that resolves to the ID of the newly created schedule.
   */
  createNewSchedule(): Promise<Types.ObjectId>;
}
