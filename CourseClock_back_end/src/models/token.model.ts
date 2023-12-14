import mongoose from 'mongoose';
import { IToken, ITokenModel } from '../interfaces/IToken.interface';

/** 
 * @openapi
 * components:
 *  schemas:
 *     Token:
 *      type: object
 *      required:
 *        - refreshToken
 *        - user
 *        - createdAt
 *        - updatedAt
 *      properties:
 *        refreshToken:
 *          type: string
 *          description: Refresh token
 *        user:
 *          type: string
 *          $ref: '#/components/schemas/User'
 *          description: User ID
 *        createdAt:
 *          type: string
 *          format: date-time
 *          description: Date of creation
 *        updatedAt:
 *          type: string
 *          format: date-time
 *          description: Date of last update
 * 
 */
const TokenSchema = new mongoose.Schema<IToken, ITokenModel>(
    {
        refreshToken: { type: String, required: true },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    { timestamps: true }
);

TokenSchema.statics.createNewToken = async (token: string, user: mongoose.Schema.Types.ObjectId) => {
    const savedToken: IToken = new TokenModel({
        refreshToken: token,
        user: user,
    });
    const newToken = await savedToken.save();
    return newToken;
};

TokenSchema.statics.verifyToken = async (token: string) => {
    const user = (await TokenModel.findOne({ refreshToken: token }).populate('user')).user;
    return user;
}

TokenSchema.statics.deleteToken = async (token: string) => {
    const deletedToken = await TokenModel.deleteOne({ refreshToken: token });
    return deletedToken;
}

export const TokenModel = mongoose.model<IToken, ITokenModel>('Token', TokenSchema);
