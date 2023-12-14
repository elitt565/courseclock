import React from 'react';
import { Link } from 'react-router-dom';
import { Box } from '@mui/material'; // Add import statement for Box
import pointer from '../assets/Pointer.svg';
import '../styles/InvalidURL.css';

const PageNotFound = () => {
  return ( 
    <Box display={'flex'} className={"invalidURL"} flexDirection={'column'} >
      Page Not Found! 
      <Link to="/signin" >Go back to signin page <img src={pointer} alt="wave" style={{width: '50px'}}/></Link>
    </Box>

  );
};

export default PageNotFound;
