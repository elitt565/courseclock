/**
 * Represents the Navbar component.
 * @param {Object} props - The component props.
 * @param {boolean} props.student - Indicates if the user is a student.
 * @returns {JSX.Element} The rendered Navbar component.
 */
import React from 'react';
import { Box, Stack } from '@mui/material';
import { ReactComponent as Logo } from '../assets/Logo.svg';
import { useAuthUser, useSignOut } from 'react-auth-kit';
import axios, { AxiosError } from 'axios'; // Import axios and AxiosError
import '../styles/Navbar.css';
import { useNavigate } from 'react-router';

const Navbar = ({ student }: { student?: boolean }) => {
  const logoMessage = student ? "Student" : "Instructor";
  const authUser = useAuthUser();
  const signOut = useSignOut();
  const navigate = useNavigate();

  /**
   * Handles the logout functionality.
   * @returns {Promise<void>} A promise that resolves when the logout is complete.
   * @throws {Error} If an error occurs during the logout process.
   */
  const handleLogout = async () => { // Wrap the code inside an async function
    try {
      await axios.post('http://localhost:8080/auth/logout');
      signOut();
      navigate('/');
    } catch (err: unknown) { // Add type assertion for the 'err' variable
      if (axios.isAxiosError(err as AxiosError)) { // Type assertion for 'err'
          throw new Error( 'An error occurred'); // Throw a new error
        } else {
          throw new Error('An unknown error occurred'); // Throw a new error
    }
    
  }

}

  return (
    <div className='navbar'>
      <Stack spacing={1.5} direction={"row"} className='navbar_logo'>
        <Logo width={50} height={50} />
        <Stack direction={"row"} spacing={0.5}>
          <h1>CourseClock</h1>
          <h1 className='roleDescriptor'>{logoMessage}</h1>
        </Stack>
      </Stack>
      <Box className={'logout'}>
        {authUser()?.email && (
          <>
            <h1>welcome, <span>{authUser()?.email}</span></h1>
            <h1 className='button' onClick={handleLogout}>Logout</h1>
          </>
        )}
      </Box>
    </div>
  );
};

export default Navbar;
                
