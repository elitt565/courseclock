import mongoose from 'mongoose';
import { IUser, IUserModel} from '../interfaces/IUser.interface';


/**
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - role
 *         - createdAt
 *         - updatedAt
 *       properties:
 *         firstName:
 *           type: string
 *           description: First name of the user
 *         lastName:
 *           type: string
 *           description: Last name of the user
 *         email:
 *           type: string
 *           description: Email of the user
 *         role:
 *           type: number
 *           description: Role of the user
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date of creation
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Date of last update
 *         course:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Course'
 *             description: Course ID
 *         schedule:
 *           type: string
 *           $ref: '#/components/schemas/Schedule'
 *           description: Schedule ID
 */
const userSchema = new mongoose.Schema<IUser, IUserModel>({
  firstName: { 
    type: String, 
    trim: true 
  },
  lastName: { 
    type: String, 
    trim: true 
  },
  email: { 
    type: String, 
    required: true ,
    validate: {
      validator: function(email) {
        const regex = /^[a-zA-Z0-9._%+-]+@umass\.edu$/;
        return regex.test(email);
      },
      message: 'Please provide a valid email address',
    }
  },
  course: [
    { type: mongoose.Schema.Types.ObjectId, 
      ref: 'Course' }
  ],
  role: { 
    type: Number, 
    required: true 
  },
  schedule : {type : mongoose.Schema.Types.ObjectId, ref : 'Schedule'}
}, { 
  timestamps: true,
  // query: {
  //   byId: function(id: number) {
  //     return this.where({ u_id: id });
  //   },
  //   byEmail: function(email: string) {
  //     return this.where({ email: email });
  //   },
  //   byName: function(name: string) {
  //     return this.where({ firstName: name });
  //   }
  // }
  // AUTO TYPE DOES NOT WORK, IMPLEMENT QUERY INTERFACE TYPING FOR ANOTHER DAY
});

/**
 * statics
 */
// WE COULD ADD TRY CATCH IF WE DECIDE TO DO SPECIFIC ERROR MESSAGES
userSchema.statics.createNewUser = async function (user: IUser) {
  const newUser = this.create(user); // Create a new user document
  return newUser;
}

userSchema.statics.addCourseToUser = async function (id: mongoose.Types.ObjectId, c_id: mongoose.Types.ObjectId) {
  const user = await this.findById(id);
  if (user) {
    user.course.push(c_id);
    await user.save();
  }
  return user;
}
userSchema.statics.addScheduleToUser = async function(id : mongoose.Types.ObjectId, s_id : mongoose.Types.ObjectId) {
  const user = await this.findById(id);
  if(user) {
    user.schedule = s_id
    await user.save()
  }
  return user
}

userSchema.statics.getUserSchedule = async function(id : mongoose.Types.ObjectId) {
  const user = await this.findById(id).populate('schedule').exec()
  if(user) {
    return user.schedule
  }
  return null
}

userSchema.statics.getUserCourses = async function(id : mongoose.Types.ObjectId) {
  const user = await this.findById(id).populate('course').exec()
  if(user) {
    return user.course
  }
  return null
}

/** 
 * methods
*/

// userSchema.methods = {

// }

export const UserModel = mongoose.model<IUser, IUserModel>('User', userSchema);
