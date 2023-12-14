import allowedOrigins from '../config/allowedOrigins';
import { Request, Response, NextFunction } from 'express';

/**
 * Middleware function to handle credentials.
 * 
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next function to call in the middleware chain.
 */
const credentials = (req: Request, res: Response, next: NextFunction) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Credentials', 'true'); // Convert boolean to string
    }
    next();
}

export default credentials;
