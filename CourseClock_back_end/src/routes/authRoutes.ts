import express from 'express';
import { 
    login,
    refreshToken,
    logout,
    register,
    genTokenTest
  } from '../controllers/auth.controller';

const router = express.Router();

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Logs in a user.
 *     tags: 
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email.
 *               password:
 *                 type: string
 *                 description: User's password.
 *               isInstructor:
 *                 type: boolean
 *                 description: Flag to indicate if user is an instructor.
 *     responses:
 *       200:
 *         description: Successfully logged in, returns access and refresh tokens.
 *       401:
 *         description: Unauthorized, wrong password.
 *       404:
 *         description: User not found.
 */
router.post('/login', login);

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     summary: Logs out a user by clearing the refresh token.
 *     tags: 
 *       - Authentication
 *     responses:
 *       204:
 *         description: Successfully logged out.
 */
router.post('/logout', logout);

/**
 * @openapi
 * /auth/refreshToken:
 *   post:
 *     summary: Refreshes the access token using a refresh token.
 *     tags: 
 *       - Authentication 
 *     responses:
 *       200:
 *         description: Successfully refreshed, returns new access token.
 *       401:
 *         description: Unauthorized, no refresh token provided.
 *       403:
 *         description: Forbidden, invalid or expired refresh token.
 */
router.post('/token', refreshToken);

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Registers a new user.
 *     tags: 
 *       - Authentication 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               re_password:
 *                 type: string
 *               isInstructor:
 *                 type: boolean
 *               courses:
 *                 type: array
 *                 items:
 *                   type: string
 *               schedule:
 *                 type: object
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *     responses:
 *       201:
 *         description: User successfully created.
 *       400:
 *         description: Bad request, possibly due to existing user or password mismatch.
 */
router.post('/register', register);

/**
 * @openapi
 * /auth/test:
 *   get:
 *     summary: Generate a test token.
 *     tags: 
 *       - Authentication 
 *     responses:
 *       200:
 *         description: Successfully generated test token.
 */
router.get('/test', genTokenTest);

export default router;
