import express from 'express';

import {getScheduleById, updateScheduleById, getAllSchedules,} from '../controllers/schedule.controller';

//TODO: this need updating
const router = express.Router();

/**
 * @openapi
 * /schedule/{id}:
 *   get:
 *     summary: Get a schedule by its ID
 *     tags:
 *       - Schedules
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Returns the requested schedule
 *       404:
 *         description: Schedule not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', getScheduleById);
/**
 * @openapi
 * /schedule/update/{id}:
 *   post:
 *     summary: Update a schedule by its ID
 *     tags:
 *       - Schedules
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Schedule object that needs to be updated
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Schedule'
 *     responses:
 *       200:
 *         description: Schedule updated
 *       400:
 *         description: Invalid schedule
 *       404:
 *         description: Schedule not found
 *       500:
 *         description: Internal server error
 */
router.post('/update/:id', updateScheduleById);
/**
 * @openapi
 * /schedule/all:
 *   get:
 *     summary: Get all schedules
 *     tags:
 *       - Schedules
 *     responses:
 *       200:
 *         description: Returns all schedules
 *       500:
 *         description: Internal server error
 */
router.get('/all', getAllSchedules);
export default router;
