import express from 'express';
import { 
    enrollCourse,
    getCourseByName,
    updateCourse,
    getRecHours,
    updateCourseSchedule,
    getUniqueHits,
    createCourseAndEnroll,
    getCourseOfficeHours,
    getCourseStudents
  } from '../controllers/courses.controller';

const router = express.Router();

/**
 * @openapi
 * /courses/{name}:
 *   get:
 *     summary: Get a course by its name
 *     tags:
 *       - Courses
 *     parameters:
 *       - name: name
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Returns the requested course
 *       404:
 *         description: Course not found
 *       500:
 *         description: Internal server error
 */

router.get('/:name', getCourseByName);
/**
 * @openapi
 * /courses/create-course:
 *   post:
 *     summary: Create a course and enroll
 *     tags:
 *       - Courses
 *     requestBody:
 *       description: Course object that needs to be created
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Course'
 *     responses:
 *       200:
 *         description: Course created and enrolled
 *       400:
 *         description: Invalid course
 *       500:
 *         description: Internal server error
 */
router.post('/create-course', createCourseAndEnroll);
/**
 * @openapi
 * /courses/enroll-course:
 *   put:
 *     summary: Enroll a course
 *     tags:
 *       - Courses
 *     requestBody:
 *       description: Course object that needs to be enrolled
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Course'
 *     responses:
 *       200:
 *         description: Course enrolled
 *       400:
 *         description: Invalid course
 *       500:
 *         description: Internal server error
 */
router.put('/enroll-course', enrollCourse);
/**
 * @openapi
 * /courses/{id}:
 *   put:
 *     summary: Update a course by its ID
 *     tags:
 *       - Courses
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Course object that needs to be updated
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Course'
 *     responses:
 *       200:
 *         description: Course updated
 *       400:
 *         description: Invalid course
 *       404:
 *         description: Course not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', updateCourse);
/**
 * @openapi
 * /courses/{name}/rec-hours:
 *   get:
 *     summary: Get recommended hours for a course
 *     tags:
 *       - Courses
 *     parameters:
 *       - name: name
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Returns the recommended hours for the course
 *       404:
 *         description: Course not found
 *       500:
 *         description: Internal server error
 */
router.get('/:name/rec-hours', getRecHours);
/**
 * @openapi
 * /courses/{name}/unique-hits:
 *   post:
 *     summary: Get unique hits for a course
 *     tags:
 *       - Courses
 *     parameters:
 *       - name: name
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Returns the unique hits for the course
 *       404:
 *         description: Course not found
 *       500:
 *         description: Internal server error
 */
router.post('/:name/unique-hits', getUniqueHits);
/**
 * @openapi
 * /courses/{name}/update:
 *   put:
 *     summary: Update a course schedule
 *     tags:
 *       - Courses
 *     parameters:
 *       - name: name
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Course object that needs to be updated
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Course'
 *     responses:
 *       200:
 *         description: Course schedule updated
 *       400:
 *         description: Invalid course
 *       404:
 *         description: Course not found
 *       500:
 *         description: Internal server error
 */
router.put('/:name/update', updateCourseSchedule);
/**
 * @openapi
 * /courses/{name}/officeHours:
 *   get:
 *     summary: Get office hours for a course
 *     tags:
 *       - Courses
 *     parameters:
 *       - name: name
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Returns the office hours for the course
 *       404:
 *         description: Course not found
 *       500:
 *         description: Internal server error
 */
router.get('/:name/officeHours', getCourseOfficeHours)
/**
 * @openapi
 * /courses/{name}/students:
 *   get:
 *     summary: Get students for a course
 *     tags:
 *       - Courses
 *     parameters:
 *       - name: name
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Returns the students for the course
 *       404:
 *         description: Course not found
 *       500:
 *         description: Internal server error
 */
router.get('/:name/students', getCourseStudents)

// router.delete('/:id', deleteCourse);
// router.delete('/delete/:name', deleteCourseByName);

export default router;
