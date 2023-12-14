import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const createJWT = (payload: any): string => {
    const token = jwt.sign(
        payload, 
        process.env.ACCESS_TOKEN_SECRET,
        // { expiresIn: '100y'}
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN as string }
        );
    return token;
};

export const createRefreshJWT = (payload: any): string => {
    const token = jwt.sign(
        payload, 
        process.env.REFRESH_TOKEN_SECRET,
        // { expiresIn: '1d'}
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN as string }
        );
    return token;
};

export const createNonExpiringJWT = (payload: any): string => {
    const token = jwt.sign(
        payload, 
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '100y' } // 100 years
    );
    return token;
};
