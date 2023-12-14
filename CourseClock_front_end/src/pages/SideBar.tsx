import React, { ReactNode, useEffect, useState } from "react";
import { Button, Box, Drawer, Stack, ListItem, ListItemButton, ListItemText, List, Divider, RadioGroup, FormControlLabel, Radio, IconButton } from "@mui/material";
import { Outlet, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { FormControl } from "@mui/base";
import Navbar from "../components/Navbar";
import "../styles/SideBar.css"
import IconChecked from "../assets/IconChecked.svg"
import IconUnchecked from "../assets/IconUnchecked.svg"
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import { ArrowForwardIosRounded, ArrowBackIosRounded } from "@mui/icons-material";
import { useAuthUser } from "react-auth-kit";
import { fetchUserCourses } from "../api/coursesService";
import ModalAddCourse from "../components/ModalAddCourse";


interface SidebarProps {
    pages: {name: string, path: string, logo?: ReactNode}[]
}

function Sidebar({pages}: SidebarProps) {
    const [course, setCourse] = useState("");
    const [open, setOpen] = useState(true);
    const [userCourses, setUserCourses] = useState<string[]>([])
    const [openModal, setOpenModal] = useState(false);
    const [, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const authUser = useAuthUser();
    const { pathname } = useLocation();
    const curPage = pathname.split("/").pop();
    const id = authUser()?.id;

    useEffect(() => {
        if (!authUser()) {
            navigate("/signin");
        } else {
            const pathSegments = pathname.split("/").filter(Boolean); // Remove empty strings
            const userType = authUser()?.isInstructor ? "instructor" : "student"; // Corrected spelling of isInstructor
            const userId = authUser()?.id.toString();
            if (pathSegments.length > 0 && pathSegments[0] !== userType) {
                navigate(`/${userType}/${userId}`);
            } else if (pathSegments.length > 1 && pathSegments[1] !== userId) {
                navigate("/not-allowed");
            } else if (pathSegments.length === 1) {
                navigate(`/${userType}/${userId}${!authUser()?.isInstructor ? "/schedule" : "/recommended"}`);
            }
        }
    }, [authUser, navigate, pathname]);

    useEffect(() => {
        if (id) {
            try {
                fetchUserCourses(id).then((courses) => {
                    setUserCourses(courses);
                });
            } catch (error) {
                console.error("Error fetching user courses:", error);
            }
        }
    }, [id]);

    useEffect(() => {
        setSearchParams({'course': course});
    }, [course, setSearchParams]);

    const handleDrawer = () => {
        setOpen(!open);
    };

    const handleAddCourse = () => {
        setOpenModal(true);
    };

    const handleCourseSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCourse(event.target.value);
    };

    return  <Box>
        <Box display={'flex'} className={"sidebar"} >
            <Navbar student = {!authUser()?.isInstructor}/>
            <Drawer variant="persistent" anchor="left" className={"drawer " + (open ? "drawerOpen" : "drawerClosed")} open={open} >
                <Stack className="stack">
                    <h2>Dashboards</h2>
                    <List disablePadding>
                        {
                            pages.map(page => (
                                <ListItem key={page.name} >  
                                    <ListItemButton selected = {page.name.toLowerCase() === curPage?.toLowerCase()} sx={{borderRadius: '5px'}} onClick={() => {navigate(
                                        page.path,
                                        {replace: true}
                                    )}} >
                                        {page.logo && page.logo}
                                        <ListItemText primary={page.name} className="listItemsText"/>
                                    </ListItemButton>
                                </ListItem>
                            ))
                        }
                    </List>
                    <Divider/>
                    <h2>Courses</h2>
                    <FormControl className="courseForm">
                        <RadioGroup name="course-select-radio-group" value={course} onChange={handleCourseSelect} >
                            {
                                userCourses.map(course => (
                                    <FormControlLabel key={course} label={course} value={course} control={<Radio icon={<img src={IconUnchecked} alt="Icon Unchecked"/>} checkedIcon={<img src={IconChecked} alt="Icon Checked"/>} />} />
                                ))
                            }
                        </RadioGroup>
                    </FormControl>
                    <Button variant="contained" className="addCourseButton" onClick = {handleAddCourse}>
                        <AddRoundedIcon/>
                        Add Course
                    </Button>
                </Stack>
            </Drawer>
            <IconButton onClick={handleDrawer} disableRipple className="collapse">
                {open ? <ArrowBackIosRounded style={{width:30, height:30}}/> : <ArrowForwardIosRounded style={{width:30, height:30}}/> }
            </IconButton>
            <Box className={"outlet " + (open ? "drawerOpen" : "drawerClosed")}>
                <Outlet/>
            </Box>
        </Box>
        <ModalAddCourse 
        open={openModal} 
        onClose={()=> setOpenModal(false)} 
        id = {id}
        isInstructor = {authUser()?.isInstructor}/>
    </Box>
}

export default Sidebar