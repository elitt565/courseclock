// ICourse.ts

/**
 * Represents a course in the system.
 */
import mongoose, { Document, Model, Types } from 'mongoose';

/**
 * Represents the structure of a course document in the database.
 */
export interface ICourse extends Document {
  name: string;
  schedule: number[][];
  hits: number[][];
  studentList: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Represents the Course model with additional static methods.
 */
export interface ICourseModel extends Model<ICourse> {
  /**
   * Creates a new course with the given name.
   * @param name - The name of the course.
   * @returns A promise that resolves to the created course.
   */
  createCourse(name: string): Promise<ICourse>;

  /**
   * Adds a user to the course.
   * @param u_id - The ID of the user to add.
   * @param c_id - The ID of the course to add the user to.
   */
  addUserToCourse(u_id: Types.ObjectId, c_id: Types.ObjectId): void;

  /**
   * Removes a user from the course.
   * @param u_id - The ID of the user to remove.
   * @param c_id - The ID of the course to remove the user from.
   */
  removeUserFromCourse(u_id: Types.ObjectId, c_id: Types.ObjectId): void;

  /**
   * Updates the schedule and hits of a course.
   * @param c_id - The ID of the course to update.
   * @param schedule - The new schedule for the course.
   * @param hits - The new hits for the course.
   */
  updateCourse(c_id: Types.ObjectId, schedule: any, hits: any): void;
}
