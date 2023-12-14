import axios from 'axios';
import { EventType } from '../types/recomendType';

/**
 * Fetches the courses associated with a user.
 * @param id - The ID of the user.
 * @returns A promise that resolves to the data of the user's courses.
 */
export const fetchUserCourses = async (id: string) => {
    const response = await axios.get(`http://localhost:8080/users/${id}/courses`, {
        headers: {
            'content-type': 'application/json',
        },
        withCredentials: true
    });
    return response.data;
}

/**
 * Adds a course to the server.
 * @param id - The ID of the course.
 * @param courseName - The name of the course.
 * @param isInstructor - Indicates whether the user is an instructor.
 * @returns A promise that resolves to the response data from the server.
 */
export const addCourse = async (id: string, courseName: string, isInstructor: boolean) => {
    const url = isInstructor ? `http://localhost:8080/courses/create-course` : `http://localhost:8080/courses/enroll-course`;
    const method = isInstructor ? 'POST' : 'PUT';
    const body = JSON.stringify({ id, name: courseName }); // Add body with id and courseName
    const response = await axios({
        method: method,
        url: url,
        headers: {
            'content-type': 'application/json',
        },
        data: body, // Include the body in the request
        withCredentials: true
    });
    return response.data;
}

/**
 * Fetches the recommended hours for a given course.
 * @param course - The course identifier.
 * @returns An array of recommended hours.
 */
export const fetchRecommendedHours = async (course: string) => {
    let recHours = [];
    try {
        const response = await axios.get('http://localhost:8080/courses/' + course + '/rec-hours', {
            headers: {
                'content-type': 'application/json',
            },
            withCredentials: true
        });
        recHours = response.data;
    } catch (error) {
        console.error('Error fetching recommended hours:', error);
    }
    return recHours;
};

/**
 * Retrieves the number of students enrolled in a course.
 * @param courseName - The name of the course.
 * @returns A Promise that resolves to the number of students enrolled in the course.
 */
export const getCourseNumStudents = async (courseName: string) => {
    const response = await axios.get(`http://localhost:8080/courses/${courseName}/students`, {
        headers: {
            'content-type': 'application/json',
        },
        withCredentials: true
    });
    return response.data;
}

/**
 * Updates the schedule of a course.
 * @param course - The course identifier.
 * @param eventsRef - A mutable ref object containing the events to update the schedule with.
 * @returns A promise that resolves when the schedule is successfully updated.
 */
export const updateCourseSchedule = async (course: string, eventsRef: React.MutableRefObject<EventType[]>) => {
    await axios.put(`http://localhost:8080/courses/${course}/update`, {
        schedule: eventsRef.current.map((event: EventType) => ({ start: event.start, end: event.end }))
    }, {
        headers: {
            'content-type': 'application/json',
        },
        withCredentials: true
    });
}

/**
 * Retrieves the unique hits for a specific course.
 * @param course - The course identifier.
 * @param eventsRef - A mutable reference to an array of event types.
 * @returns A Promise that resolves to the unique hits data.
 */
export const getUniqueHits = async (course: string, eventsRef: React.MutableRefObject<EventType[]>) => {
    const response = await axios.post(`http://localhost:8080/courses/${course}/unique-hits`, {
        schedule: eventsRef.current.map((event: EventType) => ({ start: event.start, end: event.end }))
    }, {
        headers: {
            'content-type': 'application/json',
        },
        withCredentials: true
    });
    return response.data;
};

/**
 * Retrieves the office hours for a specific course.
 * @param courseParam - The course parameter.
 * @returns An array of office hour events.
 */
export const getOfficeHours = async (courseParam: string) => {
    const response = await axios.get(`http://localhost:8080/courses/${courseParam}/officeHours`, {
        headers: {
            'Content-Type': 'application/json',
        },
        withCredentials: true
    });
    
    const newEvents = response.data.map((oHours: any, i: any) => {
        // Ensure oHours.start and oHours.end are in the correct format
        return {
            start: oHours.start, // adjust format if needed
            end: oHours.end, // adjust format if needed
            id: i,
            text: `${courseParam} Office Hours`
        };
    });

    return newEvents;
};
