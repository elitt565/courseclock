import jwt from 'jsonwebtoken';
import {  Response, NextFunction } from 'express';
import { ExtendedRequest } from '../interfaces/IToken.interface';
import dotenv from 'dotenv';
dotenv.config();


/**
 * Middleware function to verify JWT token in the request headers or cookies.
 * If the token is valid, it sets the decoded role and _id in the request object and calls the next middleware.
 * If the token is invalid or missing, it sends an appropriate HTTP response.
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The next middleware function.
 */
export const verifyJWT = (req: ExtendedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    const authToken = req.cookies._auth_type;
    const auth = req.cookies._auth;
    if ((typeof(authHeader) === 'string' && authHeader.startsWith('Bearer ')) || (authToken === 'Bearer' && auth)) {
        const token = (typeof authHeader === 'string' ? authHeader.split(' ')[1] : auth) || auth;
        jwt.verify(
            token, 
            process.env.ACCESS_TOKEN_SECRET as string, 
            (err: any, decoded: any) => { // Consider defining a more specific type for 'decoded'
                if (err) {
                    return res.sendStatus(403); // Forbidden
                }
                req.role = decoded.role;
                req._id = decoded._id;
                
                next();
            }
        );
    } else {
        res.sendStatus(401); // Unauthorized
    }
};