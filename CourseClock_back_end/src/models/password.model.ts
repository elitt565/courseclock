
import {Schema} from 'mongoose';
import mongoose from 'mongoose';
import { IPassword, IPasswordModel } from '../interfaces/IPassword.interface';
import bcrypt from 'bcrypt';

/**
 * @openapi
 * components:
 *   schemas:
 *     Password:
 *       type: object
 *       required:
 *         - user
 *         - hash_pass
 *         - createdAt
 *         - updatedAt
 *       properties:
 *         user:
 *           type: string
 *           $ref: '#/components/schemas/User'
 *           description: User ID
 *         hash_pass:
 *           type: string
 *           description: Hashed password
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date of creation
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Date of last update
 */
const passwordSchema = new mongoose.Schema<IPassword, IPasswordModel>({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    hash_pass: { type: String, required: true }
  }, { timestamps: true }
);

passwordSchema.statics.savePassword = async function (id: mongoose.Types.ObjectId, password: string) {
    const hash_pass = await bcrypt.hash(password, 10);
    const newPassword = await this.create(
        { user: id, hash_pass: hash_pass });
    return newPassword;
}

passwordSchema.statics.updatePassword = async function (id: mongoose.Types.ObjectId, password: string) {
    const hash_pass = await bcrypt.hash(password, 10);
    const newPassword = await this.findOneAndUpdate(
        { user: id }, { hash_pass: hash_pass });
    return newPassword;
}

passwordSchema.statics.checkPassword = async function (id: mongoose.Types.ObjectId, password: string) {
    const userPassword = await this.findOne({ user: id });
    if (userPassword) {
        const result = await bcrypt.compare(password, userPassword.hash_pass);
        return result;
    }
    return false;
}


export const PasswordModel = mongoose.model<IPassword, IPasswordModel>('Password', passwordSchema);
