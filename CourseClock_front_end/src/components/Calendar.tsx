import React from "react";
import { useState, useEffect} from "react";
import ScheduleSelector from "react-schedule-selector";
import { Button, Box } from "@mui/material";
import "../styles/Calendar.css"
import {updateSchedule, getSchedule} from '../api/calendarService'
import { useAuthUser } from "react-auth-kit";

let dates : Date[] = [];
//createNewUserAndSchedule();

/**
 * Renders a calendar component with a schedule selector.
 * 
 * @returns The rendered calendar component.
 */
function Calendar(){ 
    const [state, setState] = useState(dates);
    const authUser = useAuthUser();
    const id = authUser()?.id;
    useEffect(() => { 
        getSchedule(id).then(d => setState(d)).catch(err => console.log(err));
    } , [id]); 
    
    function handleChange(newSchedule : Date[]){
        dates = newSchedule
        setState(newSchedule)
    }

    return (
        <Box className='schedule'>
            <Box className="selector" >
                <ScheduleSelector
                selection={state}
                startDate={new Date("11-13-23")}
                numDays={5}
                minTime={8}
                maxTime={18}
                hourlyChunks={4}
                dateFormat="dddd"
                timeFormat="HH:mm"
                onChange={handleChange}
                columnGap="1px"
                rowGap="1px"
                unselectedColor='rgba(255,255,255,255)'
                selectedColor='rgba(16, 94, 245, 1)'
                />
            </Box>
            <Button variant= "contained" className='btn' onClick={() => updateSchedule(dates, id)}>Save Schedule</Button> 
        </Box>
    )
}

export default Calendar;