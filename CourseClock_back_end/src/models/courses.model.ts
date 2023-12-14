import mongoose from 'mongoose';
import { ICourse, ICourseModel } from '../interfaces/ICourses.interface';
import { UserModel as User } from '../models/user.model';
import { DEFAULT_SCHEDULE } from '../constants/default';


/**
 * @openapi
 * components:
 *   schemas:
 *     Course:
 *       type: object
 *       required:
 *         - name
 *         - schedule
 *         - hits
 *         - studentList
 *         - createdAt
 *         - updatedAt
 *       properties:
 *         name:
 *           type: string
 *           description: Course name
 *         schedule:
 *           type: array
 *           items:
 *             type: array
 *             items:
 *               type: number
 *           description: Course schedule
 *         hits:
 *           type: array
 *           items:
 *             type: array
 *             items:
 *               type: number
 *           description: Course hits
 *         studentList:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/User'
 *           description: List of students in the course
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date of creation
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Date of last update
 */
const courseSchema = new mongoose.Schema<ICourse, ICourseModel>({
  name: { type: String, required: true, unique: true },
  schedule: { type: mongoose.Schema.Types.Mixed, required: true },
  hits: { type: mongoose.Schema.Types.Mixed, required: true },
  studentList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }]
}, {
  timestamps: true,
});

courseSchema.statics.createCourse = async function (name: string) {
  const course = await this.create(
    {
      name: name,
      schedule: [],
      hits: DEFAULT_SCHEDULE.schedule,
      studentList: []
    }
  );
  return course;
}

courseSchema.statics.addUserToCourse = async function (u_id: mongoose.Types.ObjectId, c_id: mongoose.Types.ObjectId) {
  const course = await this.findById(c_id);
  const schedule = (await User.getUserSchedule(u_id)).schedule;
  if (course) {
    course.hits = (course.hits).map((row, i) => row.map((time, j) => time + schedule[i][j]))
    course.studentList.push(u_id);
    await course.save();
  }
}

courseSchema.statics.removeUserFromCourse = async function (u_id: mongoose.Types.ObjectId, c_id: mongoose.Types.ObjectId) {
  const course = await this.findById(c_id);
  if (course) {
    course.studentList = course.studentList.filter((id: mongoose.Types.ObjectId) => id.toString() !== u_id.toString());
    await course.save();
  }
}

courseSchema.statics.updateCourse = async function (c_id: mongoose.Types.ObjectId, schedule: any, hits: any) {
  const course = await this.findById(c_id);
  if (course) {
    course.schedule = schedule;
    course.hits = hits;
    await course.save();
  }
}

export const CourseModel = mongoose.model<ICourse, ICourseModel>('Course', courseSchema);
