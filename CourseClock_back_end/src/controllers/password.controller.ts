import { Request, Response, NextFunction } from 'express';
import { PasswordModel as Password } from '../models/password.model';
import { Types } from 'mongoose';

// TODO: Add reset password functionality
// Create a new password

/**
 * Creates a new password for a user.
 * 
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next function.
 * @returns A JSON response indicating that the password has been added.
 */
export const createPassword = async (req: Request, res: Response, next: NextFunction) => {
    const { newPassword, id } = req.body;
    try {
        const uid = new Types.ObjectId(id);
        await Password.savePassword(uid, newPassword);
        res.json('Password added!');
    } catch (error) {
        next(error);
    }
}