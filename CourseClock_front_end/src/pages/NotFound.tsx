import { Box } from '@mui/material'
import React from 'react'

const NotFound = () => {
  return (
    <Box
    sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '60px', // Setting the font size
        // width: '50%', // You can adjust the width as needed
        // height: '200px', // Adjust the height as per your requirement
        margin: 'auto', // Centers the box horizontally
        textAlign: 'center', // Centers the text horizontally within the box
        // border: '1px solid black' // Optional, just for visibility
    }}
    >
        Content Not Found
    </Box>
  )
}

export default NotFound