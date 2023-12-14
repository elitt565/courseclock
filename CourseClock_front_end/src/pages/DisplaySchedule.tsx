import React, { useEffect  } from "react";
import { useState} from "react";
import {  Box, Stack } from "@mui/material";
import "../styles/Recommended.css"
import { DayPilotCalendar } from "@daypilot/daypilot-lite-react";
import { useSearchParams } from "react-router-dom";
import {  ConfigProps } from "../types/recomendType";
import { getOfficeHours } from "../api/coursesService";



function Display(){ 
    const [searchParams, ] = useSearchParams()
    const [config, setConfig] = useState<ConfigProps>({
        viewType: "Days",
        days: 5,
        startDate: '2023-11-13',
        showHeader: false,
        durationBarVisible: true,
        heightSpec: "BusinessHoursNoScroll",
        businessBeginsHour: 8,
        headerDateFormat: 'dddd',
        events:[],
        eventMoveHandling: "Disabled",
        timeFormat: "Clock24Hours",
        eventArrangement: "Full"
    });

    useEffect(() => { 
        const getSetOfficeHours = async () => {
            const course = searchParams.get('course');
            if (course){
                getOfficeHours(course).then((response) => {
                    setConfig(config => ({...config, events: response}));
                }).catch((error) => {
                    console.error('Error fetching office hours:', error);
                });

            }
        };
    
        getSetOfficeHours();
    }, [searchParams]);


    return (
        <Box className='schedule'>
            <Box className="selector" >
                <Stack spacing={5}>
                    <DayPilotCalendar classname='calendar' {...config}/>
          
                </Stack>
            </Box>
            <Stack direction={"row"} justifyContent={"space-around"}>
            </Stack>
            
        </Box>
    )
}

export default Display;