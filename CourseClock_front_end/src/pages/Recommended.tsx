import React, { useEffect, useMemo, useRef } from "react";
import { useState} from "react";
import { Button, Box, Stack } from "@mui/material";
import "../styles/Recommended.css"
import { DataGrid, GridColDef, GridRowId} from '@mui/x-data-grid';
import { DayPilotCalendar } from "@daypilot/daypilot-lite-react";
import { useSearchParams } from "react-router-dom";
import { getCourseNumStudents, fetchRecommendedHours, updateCourseSchedule , getUniqueHits } from "../api/coursesService";
import { ColumnType, EventType, ConfigProps } from "../types/recomendType";

function Recommended(){ 
    const [searchParams, ] = useSearchParams()
    const [config,] = useState<ConfigProps>({
      viewType: "Days",
      days: 5,
      startDate: '2023-11-13',
      showHeader: false,
      durationBarVisible: true,
      heightSpec: "BusinessHoursNoScroll",
      businessBeginsHour: 8,
      headerDateFormat: 'dddd',
      eventMoveHandling: "Disabled",
      timeFormat: "Clock24Hours",
      eventArrangement: "Full"
    });
    const [events, setEvents] = useState<EventType[]>([])
    const eventsRef = useRef<EventType[]>([]);
    const [officeHoursInfoList, setOfficeHoursInfoList] = useState<ColumnType[]>([]);
    const [uniqueHits, setUniqueHits] = useState<number>(0);
    const [numStudent, setNumStudent] = useState<number>(0);

    const selectedRowsRef = useRef<GridRowId[]>([]);

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'startTime', headerName: 'Start Time', width: 200 },
        { field: 'endTime', headerName: 'End Time', width: 200 },
        { field: 'hits', headerName: 'Average Student Hit', width: 170 },
        
      ];

    //might need to make the dependency searchParams.get('course'), I'm not sure yet
    useEffect(() => {
      const course = searchParams.get('course')
      if (course){
        fetchRecommendedHours(course).then(
          (response) => {
            setOfficeHoursInfoList(response);
          }
        ).catch((error) => {
          console.log(error.message);
        });
        getCourseNumStudents(course).then((numStudents) => {
          if (numStudents !== undefined) {
            setNumStudent(numStudents);
          }
        }).catch((error) => {
          console.log(error.message);
        })
      }
    }, [searchParams])

    //change baseRows to officeHoursInfoList
    const rows = useMemo(() => {
      return officeHoursInfoList.map(e => {
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const startDate = new Date(e.startTime);
        const endDate = new Date(e.endTime)
        const startTimeDayOfWeek = daysOfWeek[startDate.getDay()]
        const startTimeFormattedTime = `${startDate.getHours()}:${startDate.getMinutes() === 0 ? "00" : startDate.getMinutes()}`
        const endTimeDayOfWeek = daysOfWeek[endDate.getDay()]
        const endTimeFormattedTime = `${endDate.getHours()}:${endDate.getMinutes() === 0 ? "00" : endDate.getMinutes() }`
        return {...e, startTime: `${startTimeDayOfWeek} ${startTimeFormattedTime}`, endTime:`${endTimeDayOfWeek} ${endTimeFormattedTime}`}
      });
    }, [officeHoursInfoList])
    
    const createSchedule = () => {
      const course = searchParams.get('course')
      if (course){
        const chosenOfficeHours = officeHoursInfoList.filter(row => selectedRowsRef.current.includes(row.id)).map(row => {
            return {
                start: row.startTime,
                end: row.endTime,
                id: row.id,
                text: `OfficeHours\n Hits:${row.hits}`
            }
        })

        setEvents(chosenOfficeHours)
        eventsRef.current = chosenOfficeHours

        getUniqueHits(course, eventsRef).then(
          (response) => {
            setUniqueHits(response.uniqueHits);
          }
        ).catch((error) => {
          console.log(error.message);
        });
      }
    }

    const setSchedule = async () => {
      const course = searchParams.get('course')
      if (course){
        updateCourseSchedule(course, eventsRef)
        .catch((error) => {
          console.log(error.message);
        });
      }
    }

    return (
        <Box className='schedule'>
            <Box className="selector" >
                <Stack spacing={5}>
                    <DayPilotCalendar classname='calendar' {...config} events={events}/>
                    <div className="uniqueHits">
                      <div>Unique Hits: <span>{uniqueHits}</span></div>
                      <div>Total number of Student: <span>{numStudent}</span></div> 
                      </div>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 10 },
                        },
                        }}
                        pageSizeOptions={[10]}
                        checkboxSelection
                        onRowSelectionModelChange={(ids) => {
                            const rows = new Set(ids)
                            selectedRowsRef.current = Array.from(rows)
                        }}
                    />
                </Stack>
            </Box>
            <Stack direction={"row"} justifyContent={"space-around"}>
                <Button variant="contained" className='btn'onClick={createSchedule}>
                    Create Schedule
                </Button>
                <Button variant= "contained" className='btn' onClick={setSchedule}> 
                    Set Schedule
                </Button> 
            </Stack>
            
        </Box>
    )
}

export default Recommended;