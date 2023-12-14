import React from "react";
import { useState} from "react";
import ScheduleSelector from "react-schedule-selector";
import { Button, Box } from "@mui/material";
import "../styles/Calendar.css"
import { UserInfoProps } from "./UserInfo";
import {convertDates} from "../api/calendarService";

let dates : Date[] = [];
const GetSchedule: React.FC<UserInfoProps> = ({ info, set, back }) =>{ 
    const [state, setState] = useState(dates);
    const handleClick = async () => {
        set({
            ...info,
            schedule: convertDates(state),
        })
    }
    
    function handleChange(newSchedule : Date[]){
        dates = newSchedule
        setState(newSchedule)
    }

    const handleBack = () => {
        back('user-info');
    }

    return (
        <Box className='schedule'>
            <Box className="selector selector-sign" >
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
            
                <Button variant= "contained" className='btn' onClick={handleClick} sx={{ margin: '15px' }}>Save Schedule</Button> 
                <Button variant= "contained" className='btn' onClick={handleBack} sx={{ margin: '15px' }}>Back</Button> 
            
        </Box>
    )
}

export default GetSchedule;