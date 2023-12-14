import { Request, Response, NextFunction } from 'express';
import { ICourse } from '../interfaces/ICourses.interface';
import { CourseModel as Course } from '../models/courses.model';
import { UserModel as User } from '../models/user.model';
import { getRecommendations, calcUniqueHits, convertDates} from '../utils/util';
import { Types } from 'mongoose';


/**
 * Create a course and enroll.
 * 
 * @route POST /courses/create-course
 * @tags Courses
 * @param {object} requestBody.body.required - Course object that needs to be created.
 * @returns {object} 200 - Course created and enrolled.
 * @returns {object} 400 - Invalid course.
 * @returns {object} 500 - Internal server error.
 */
export const createCourseAndEnroll = async (req: Request, res: Response, next: NextFunction) => {
    const { id, name } = req.body;
    try {
        let course: ICourse = await Course.findOne({ name: name }) as ICourse;
        const uid = new Types.ObjectId(id);
        if (!course) {
            course = await Course.createCourse(name);
        } 
        await User.addCourseToUser(uid, course._id);
        res.status(201).json({
            message: "Course is added!",
            courseName : course.name
        });
    } catch (error) {
        next(error);
    }

};

/**
 * Get recommended hours for a course.
 * 
 * @route GET /courses/{name}/rec-hours
 * @tags Courses
 * @param {string} name.path.required - The name of the course.
 * @returns {object} 200 - Returns the recommended hours for the course.
 * @returns {object} 404 - Course not found.
 * @returns {object} 500 - Internal server error.
 */
export const getRecHours =async (req: Request, res: Response, next: NextFunction) => {
    try {
        const courseName = req.params.name;
       const course = await Course.findOne({name : courseName}) as ICourse;
       const recHours = getRecommendations(course.hits)
       res.status(200).json(recHours);
    } catch (error) {
        next(error)
    }
}

/**
 * Get unique hits for a course.
 * 
 * @route POST /courses/{name}/unique-hits
 * @tags Courses
 * @param {string} name.path.required - The name of the course.
 * @returns {object} 200 - Returns the unique hits for the course.
 * @returns {object} 404 - Course not found.
 * @returns {object} 500 - Internal server error.
 */
export const getUniqueHits = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const courseName = req.params.name;
        const {schedule} = req.body;
        const studentSchedules : number[][][] = [];
        const studentList = (await Course.findOne({name : courseName})).studentList;
        for(let i =0; i < studentList.length; i++){
            const s = await User.getUserSchedule(studentList[i]);
            studentSchedules.push(s.schedule as number[][]);
        }
        res.status(200).json({
            uniqueHits: calcUniqueHits(convertDates(schedule), studentSchedules)
        });
    } catch (error) {
        next(error)
    }
}

/**
 * Update a course schedule.
 * 
 * @route PUT /courses/{name}/update
 * @tags Courses
 * @param {string} name.path.required - The name of the course.
 * @param {object} requestBody.body.required - Course object that needs to be updated.
 * @returns {object} 200 - Course schedule updated.
 * @returns {object} 400 - Invalid course.
 * @returns {object} 404 - Course not found.
 * @returns {object} 500 - Internal server error.
 */
export const updateCourseSchedule =async (req: Request, res: Response, next: NextFunction) => {
    try {
        const courseName = req.params.name;
        const newSchedule = req.body.schedule
        // const newSchedule = convertSchedule(schedule);
        const updatedSchedule = await Course.updateOne({name : courseName}, {$set :{schedule : newSchedule}}); // need to code convertSched
        if (!updatedSchedule) {
            res.status(404).json({ error: 'Schedule not found' });
        } else {
            res.status(200).json(updatedSchedule);
        }
    } catch (error) {
        next(error)
    }
}

/**
 * Enroll a course.
 * 
 * @route PUT /courses/enroll-course
 * @tags Courses
 * @param {object} requestBody.body.required - Course object that needs to be enrolled.
 * @returns {object} 200 - Course enrolled.
 * @returns {object} 400 - Invalid course.
 * @returns {object} 500 - Internal server error.
 */
export const enrollCourse = async (req: Request, res: Response, next: NextFunction) => {
    const {id, name} = req.body;
    try {
        let course: ICourse = await Course.findOne({ name: name }) as ICourse;
        const uid = new Types.ObjectId(id);
        if (course) {
            await User.addCourseToUser(uid, course._id);
            await Course.addUserToCourse(uid, course._id);
            res.status(201).json({
                message: "Course is enroll!",
                added: true
            });
        }else{
            res.status(201).json({
                message: "Course is does not exist",
                added: false
            });
        }
    } catch(error) {
        next(error);
    }

};

/**
 * Retrieves all courses.
 * @param req - The request object.
 * @param res - The response object.
 * @returns A JSON response with the retrieved courses or an error message.
 */
export const getAllCourses = async (req: Request, res: Response) => {
    try {
        const courses = await Course.find();
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve courses' });
    }
};

/**
 * Get a course by its name.
 * 
 * @route GET /courses/{name}
 * @tags Courses
 * @param {string} name.path.required - The name of the course.
 * @returns {object} 200 - Returns the requested course.
 * @returns {object} 404 - Course not found.
 * @returns {object} 500 - Internal server error.
 */
export const getCourseByName = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const courseName = req.params.name;
        const course = await Course.findOne({ name: courseName }) as ICourse
        res.status(200).json(course.schedule);
    } catch (error) {
        next(error);
    }
}

/**
 * Update a course by its ID.
 * 
 * @route PUT /courses/{id}
 * @tags Courses
 * @param {string} id.path.required - The ID of the course.
 * @param {object} requestBody.body.required - Course object that needs to be updated.
 * @returns {object} 200 - Course updated.
 * @returns {object} 400 - Invalid course.
 * @returns {object} 404 - Course not found.
 * @returns {object} 500 - Internal server error.
 */
export const updateCourse = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, schedule } = req.body;
        const course = (await Course.findOne({ name: name }) as ICourse);

        if (!course) {
            res.status(404).json({ error: 'Course not found' });
        }
        const courseId = course._id;
        const hits = course.hits || [];
        await Course.updateCourse(courseId, schedule, hits)

        res.status(200).json("Course updated");
    } catch (error) {
        next(error);
    }
};
//POSIBLE IMPROVEMENT: ADD REMOVE COURSE FOR USER
//Delete a course
// export const deleteCourse = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const courseId = new Types.ObjectId(req.params.id);
//         await Course.findOneAndDelete({_id: courseId});
//         res.status(204).json("worked!");
//     } catch (error) {
//         next(error);
//     }
// };

// export const deleteCourseByName = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const courseName = new String(req.params.name);
//         await Course.findOneAndDelete({ name: courseName });
//         res.status(204).json("worked!");
//     } catch (error) {
//         next(error);
//     }
// };

/**
 * Get office hours for a course.
 * 
 * @route GET /courses/{name}/officeHours
 * @tags Courses
 * @param {string} name.path.required - The name of the course.
 * @returns {object} 200 - Returns the office hours for the course.
 * @returns {object} 404 - Course not found.
 * @returns {object} 500 - Internal server error.
 */
export const getCourseOfficeHours = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const course = (await Course.findOne({ name: req.params.name }) as ICourse);
        res.status(200).json(course.schedule);
    } catch (error) {
        next(error);
    }
};

/**
 * Get students for a course.
 * 
 * @route GET /courses/{name}/students
 * @tags Courses
 * @param {string} name.path.required - The name of the course.
 * @returns {object} 200 - Returns the students for the course.
 * @returns {object} 404 - Course not found.
 * @returns {object} 500 - Internal server error.
 */
export const getCourseStudents = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const course = (await Course.findOne({ name: req.params.name }) as ICourse);
        res.status(200).json(course.studentList.length);
    }catch(error){
        next(error);
    }
}