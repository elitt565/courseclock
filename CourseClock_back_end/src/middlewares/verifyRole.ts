import { Response, NextFunction } from 'express';
import { ExtendedRequest } from '../interfaces/IToken.interface';
// TODO: this should be implemented
/**
 * Middleware function to verify if the user has the required roles.
 * If the user does not have the required roles, it sends a 401 Unauthorized response.
 * @param {...string} allowedRoles - The roles allowed to access the route.
 * @returns {Function} - The middleware function.
 */
const verifyRoles = (...allowedRoles) => (req: ExtendedRequest, res: Response, next: NextFunction) => {
    if (!req?.role) return res.sendStatus(401);
    const rolesArray = [...allowedRoles];
    const result = rolesArray.includes(req.role);
    if (!result) return res.sendStatus(401);
    next();
};

export default verifyRoles;
