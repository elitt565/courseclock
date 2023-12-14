import { Document, Types, Model} from 'mongoose';
import { Request } from 'express';
import { IUser } from './IUser.interface';
/**
 * Represents a token in the system.
 */
export interface IToken extends Document {
    refreshToken: string;
    user: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Represents the model for the IToken interface.
 */
export interface ITokenModel extends Model<IToken> {
    /**
     * Creates a new token.
     * @param token - The token string.
     * @param user - The user associated with the token.
     * @returns A promise that resolves to the created token.
     */
    createNewToken(token: string, user: Types.ObjectId): Promise<IToken>;

    /**
     * Verifies a token.
     * @param token - The token string to verify.
     * @returns A promise that resolves to the user associated with the token.
     */
    verifyToken(token: string): Promise<IUser>;

    /**
     * Deletes a token.
     * @param token - The token string to delete.
     * @returns A promise that resolves to the deleted token.
     */
    deleteToken(token: string): Promise<IToken>;
}

/**
 * Represents an extended request object with additional properties.
 */
export interface ExtendedRequest extends Request {
    role?: number;
    _id?: string;
}