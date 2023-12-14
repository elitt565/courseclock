import express from 'express';
import { addUserToCourseAndSchedule, findUserById, deleteUser, updateUser, getUserCourses} from '../controllers/user.controller';
const router = express.Router();

/**
 * @openapi
 * /users/add:
 *   post:
 *     summary: Add a new user to course and schedule
 *     tags:
 *       - Users
 *     requestBody:
 *       description: User object
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid user
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
//router.post('/add', addUserToCourseAndSchedule);

/**
 * @openapi
 * /users/{id}:
 *   get:
 *     summary: Retrieves a user by their ID.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user's ID.
 *     responses:
 *       200:
 *         description: User data retrieved successfully.
 *       404:
 *         description: User not found.
 */
router.get('/:id', findUserById);

/**
 * @openapi
 * /users/{id}:
 *   delete:
 *     summary: Deletes a user by their ID.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user's ID.
 *     responses:
 *       200:
 *         description: User deleted successfully.
 *       404:
 *         description: User not found.
 */
router.delete('/:id', deleteUser);

/**
 * @openapi
 * /users/{id}:
 *   put:
 *     summary: Updates a user's information.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user's ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               course:
 *                 type: string
 *               role:
 *                 type: number
 *     responses:
 *       200:
 *         description: User updated successfully.
 *       404:
 *         description: User not found.
 */
router.put('/:id', updateUser);

/**
 * @openapi
 * /users/{id}/courses:
 *   get:
 *     summary: Retrieves courses associated with a user.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user's ID.
 *     responses:
 *       200:
 *         description: Courses retrieved successfully.
 *       404:
 *         description: User not found or user has no courses.
 */
router.get('/:id/courses', getUserCourses)


export default router;
