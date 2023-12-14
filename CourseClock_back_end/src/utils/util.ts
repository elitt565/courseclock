
/**
 * Calculates and returns recommendations based on the given course hits.
 * @param courseHits - The course hits for each day of the week.
 * @returns An array of recommendations, each containing the id, start time, end time, and hits.
 */
export const getRecommendations = (courseHits: number[][]): {id: number, startTime: string, endTime: string, hits: number}[] => {
    //sliding window of each time slot for each day of the week
    //keep track of each time slot and how many people are hit
    //Return top __________ (I'm thinking 5, 10)
    let hourlyHits: number[][] = Array<number>(5).fill(0).map(() => Array<number>(40).fill(0));

    for(let dayOfWeek = 0; dayOfWeek < 5; dayOfWeek++) {
        let slidingWindow = 0;
        for(let timeSlot = 0; timeSlot < 36; timeSlot++) {
            if(timeSlot == 0) {
                slidingWindow = courseHits[dayOfWeek][0] + courseHits[dayOfWeek][1] + courseHits[dayOfWeek][2]
                + courseHits[dayOfWeek][3];
            }
            else {
                slidingWindow = slidingWindow - courseHits[dayOfWeek][timeSlot - 1] + courseHits[dayOfWeek][timeSlot + 4];
            }
            hourlyHits[dayOfWeek][timeSlot] = slidingWindow;
        }
    }
    let recommendations = [];
    let id = 0;
    for(let dayOfWeek = 0; dayOfWeek < 5; dayOfWeek++) {
        for(let timeSlot = 0; timeSlot < 36; timeSlot++) {
            //if(hourlyHits[dayOfWeek][timeSlot] != 0) {
                const startTimeString = (new Date(2023, 10, 13 + dayOfWeek, Math.floor(timeSlot/4) + 3, (timeSlot % 4) * 15, 0)).toISOString().replace("Z", "");
                const endTimeString = (new Date(2023, 10, 13 + dayOfWeek, Math.floor((timeSlot + 4)/4) + 3, (timeSlot % 4) * 15, 0)).toISOString().replace("Z", "");
                let dict = {
					id: id,
					startTime: startTimeString,
					endTime: endTimeString,
					hits: parseFloat((hourlyHits[dayOfWeek][timeSlot]/4).toFixed(3))
				}
                recommendations.push(dict);
                id++;
            //}
        }
    }
    recommendations.sort((a, b) => {return b.hits - a.hits});
    return recommendations;
};

/**
 * Calculates the number of unique hits in a schedule for a given set of student schedules.
 * A hit occurs when a student is present at a specific time slot in the schedule.
 * 
 * @param schedule - The schedule containing time slots and their corresponding indices.
 * @param studentSchedules - The set of student schedules to check for hits.
 * @returns The number of unique hits in the schedule for the student schedules.
 */
export const calcUniqueHits = (schedule: number[][][], studentSchedules: number[][][]): number => {
    //iterate through all students
    //check if they're hit by anything in the schedule sent in
    //if yes, increment count by 1
    //if not, continue
    let count = 0;
    for(let studentIndex = 0; studentIndex < studentSchedules.length; studentIndex++) {
        let counted = false;
        for(let officeHourIndex = 0; officeHourIndex < schedule.length; officeHourIndex++) {
            for(let i = 0; i < schedule[officeHourIndex].length; i++) {
                let i1 = schedule[officeHourIndex][i][0];
                let i2 = schedule[officeHourIndex][i][1];
                if(studentSchedules[studentIndex][i1][i2] == 1) {
                    counted = true;
                    count++;
                    break;
                }
            }
            if(counted) {
                break;
            }
        }
    }
    
    return count;
    // return studentSchedules.reduce((count, studentSchedule) => {
    //     let counted = schedule.some(officeHour => 
    //         officeHour.some(([i1, i2]) => studentSchedule[i1][i2] === 1)
    //     );
    //     return counted ? count + 1 : count;
    // }, 0);
};


/**
 * Converts an array of schedule objects into a nested array of numbers representing days and times.
 * @param schedule - The array of schedule objects containing start and end times.
 * @returns A nested array representing the converted schedule, where each inner array contains [day, time] pairs.
 */
export function convertDates( schedule : {start : string, end : string}[]):number[][][]{
    const daysIndex = [-1, 0, 1, 2, 3, 4 ,-1]
    return schedule.map((interval : {start : string, end : string}) => {
        const intervalDate = new Date(interval.start);
        const day = daysIndex[intervalDate.getDay()]
        const time = (intervalDate.getHours() - 8)*4 + (intervalDate.getMinutes() / 15);
        return [[day, time],[day, time + 1], [day, time + 2], [day, time + 3]]
    })
}

/**
 * Modifies the hits array based on the old schedule, new schedule, and the current hits array.
 * @param oldSched - The old schedule array.
 * @param newSched - The new schedule array.
 * @param hits - The current hits array.
 * @returns The modified hits array.
 */
export const modifyHits = (oldSched: number[][], newSched: number[][], hits: number[][]): number[][] => {
    for(let i = 0; i < hits.length; i++){
        for(let j = 0; j < hits[0].length; j++){
            if(oldSched[i][j] == 1)
                hits[i][j]--;
        }
    }
    for(let i = 0; i < hits.length; i++){
        for(let j = 0; j < hits[0].length; j++){
            hits[i][j] += newSched[i][j];
        }
    }
   return hits;
}
    // hits.map((row, i) => row.map((cell, j) => {
    //     let newHit = cell - (oldSched[i][j] === 1 ? 1 : 0) + newSched[i][j];
    //     return newHit;
    // }));



//change course schema - add hits and student list
//modify student list every time a user is created 
