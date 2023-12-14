/**
 * This file contains the routes for the application.
 * It exports an express Router instance that handles various API endpoints.
 * The routes include authentication, courses, users, schedules, and password-related operations.
 * Each route is associated with a specific logger middleware for logging purposes.
 * The authentication routes are handled separately from the other routes.
 * All routes except the authentication routes require a valid JSON Web Token (JWT) for authorization.
 */
import courseRoutes from './courseRoutes';
import userRoutes from './userRoutes';
import scheduleRoutes from './scheduleRoutes';
import passwordRoutes from './passwordRoutes';
import authRouter from './authRoutes';

import express from 'express';
import Logger from '../middlewares/logger';
import { verifyJWT } from '../middlewares/authenticate';

const appRouter = express.Router();

const authLogger = Logger("AUTH");
const courseLogger = Logger("COURSES");
const userLogger = Logger("USERS");
const scheduleLogger = Logger("SCHEDULES");
const passwordLogger = Logger("PASSWORD");

appRouter.use('/auth', authLogger.printRequest, authRouter, authLogger.logErrors);
appRouter.use(verifyJWT);
appRouter.use('/courses', courseLogger.printRequest, courseRoutes, courseLogger.logErrors);
appRouter.use('/users', userLogger.printRequest, userRoutes, userLogger.logErrors);
appRouter.use('/schedules', scheduleLogger.printRequest, scheduleRoutes, scheduleLogger.logErrors);
appRouter.use('/password', passwordLogger.printRequest, passwordRoutes, passwordLogger.logErrors);

export default appRouter;