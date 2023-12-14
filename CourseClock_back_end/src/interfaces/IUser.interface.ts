// IUser.ts
import { Document, Types, Model} from 'mongoose';
import mongoose from 'mongoose';
import { ISchedule } from './ISchedule.interface';

/**
 * Represents a user in the system.
 */
export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  course: Types.ObjectId[];
  role: number;
  schedule : Types.ObjectId
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Represents the IUserModel interface, which extends the Model<IUser> interface.
 * This interface defines methods for creating a new user, adding a course to a user,
 * adding a schedule to a user, retrieving a user's schedule, and retrieving a user's courses.
 */
export interface IUserModel extends Model<IUser> {
  /**
   * Creates a new user.
   * @param user - The user object to be created.
   * @returns A promise that resolves to the created user.
   */
  createNewUser(user: IUser): Promise<IUser>;

  /**
   * Adds a course to a user.
   * @param id - The ID of the user.
   * @param c_id - The ID of the course to be added.
   * @returns A promise that resolves to the updated user.
   */
  addCourseToUser(id: mongoose.Types.ObjectId, c_id: Types.ObjectId): Promise<IUser>;

  /**
   * Adds a schedule to a user.
   * @param id - The ID of the user.
   * @param s_id - The ID of the schedule to be added.
   * @returns A promise that resolves to the updated user.
   */
  addScheduleToUser(id: mongoose.Types.ObjectId, s_id: mongoose.Types.ObjectId): Promise<IUser>;

  /**
   * Retrieves a user's schedule.
   * @param id - The ID of the user.
   * @returns A promise that resolves to the user's schedule.
   */
  getUserSchedule(id: mongoose.Types.ObjectId): Promise<ISchedule>;

  /**
   * Retrieves a user's courses.
   * @param id - The ID of the user.
   * @returns A promise that resolves to an array of course IDs.
   */
  getUserCourses(id: mongoose.Types.ObjectId): Promise<Types.ObjectId[]>;
}