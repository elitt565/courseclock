import axios from 'axios';
/**
 * Converts an array of Date objects into a 2D array representing a schedule.
 * Each element in the resulting array represents a 15-minute time slot in a day.
 * The value 1 indicates that the time slot is occupied, while 0 indicates it is available.
 * 
 * @param schedule - An array of Date objects representing scheduled times.
 * @returns A 2D array representing the schedule, where each element represents a 15-minute time slot.
 */
export function convertDates(schedule : Date[]) : number[][]{
    const numSchedule : number[][] = []; 
    for(let day = 0; day < 5; day++){
        const time = new Array<number>(40).fill(0);
        numSchedule.push(time);
    }
    let day : number = 0;
    let time : number = 0;
    for(let i = 0; i < schedule.length; i++){
        const curDate = schedule[i].toString();
        switch(curDate.substring(0,3)){
            case "Mon" : {
                day = 0
                break;
            }
            case "Tue" : {
                day = 1
                break;
            }
            case "Wed" : {
                day = 2
                break;
            }
            case "Thu" : {
                day = 3
                break;
            }
            case "Fri" : {
                day = 4
                break;
            }
            default : {
                console.log("Could not parse day")
            }

        }
        const hour : number= Number(curDate.substring(16,18));
        const min : number = Number(curDate.substring(19,21));
        time = (hour-8)*4 + (min/15);
        numSchedule[day][time] = 1;
    }
    return numSchedule
}

//to display current schedule of student, num array will be converted to dates array and displayed as initial state
/**
 * Converts a schedule array into an array of Date objects.
 * 
 * @param schedule - The schedule array to convert.
 * @returns An array of Date objects representing the scheduled dates.
 */
function convertNum(schedule: any) : Date[]{
    const dateArr : Date[] = [];
    const date = 13;
    for(let day = 0; day < 5; day++){
        for(let time = 0; time < 40; time++){
            if(schedule[day][time] === 1){
                const curDate = new Date(2023, 10, date + day, Math.floor(time/4) + 8, (time % 4) * 15, 0)
                dateArr.push(curDate);
            }
        } 
    }
    return dateArr;
}


/**
 * Updates the schedule with the given new schedule and ID.
 * @param newSchedule - The new schedule to update.
 * @param id - The ID of the schedule to update.
 * @returns A promise that resolves when the schedule is successfully updated.
 */
export async function updateSchedule(newSchedule: Date[], id: any) {
    const s = convertDates(newSchedule);
    await axios.post('http://localhost:8080/schedules/update/' + id, { s }, { withCredentials: true });
}

/**
 * Retrieves the schedule for a given ID.
 * @param id - The ID of the schedule to retrieve.
 * @returns A promise that resolves to an array of dates representing the schedule.
 */
export async function getSchedule(id: any) {
    const response = await axios.get('http://localhost:8080/schedules/' + id, { withCredentials: true });
    const schedule: Date[] = convertNum(response.data);
    return schedule;
}