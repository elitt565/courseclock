import React, { useEffect } from 'react'
import { useState } from 'react'
import { Formik, Form , Field, ErrorMessage} from 'formik';
import { useSignIn, useIsAuthenticated, useAuthUser } from "react-auth-kit";
import axios from "axios";
import * as Yup from 'yup';
import '../styles/Signin.css'
import wave from '../assets/Emoji_Wave.svg'
import { login } from '../api/authService';

const Signin = () => {
  const [isInstructor, setIsInstructor] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const signIn = useSignIn();
  const isAuthenticated = useIsAuthenticated();
  const authUser = useAuthUser();

  useEffect(() => {
    if (isAuthenticated()) {
      const user = authUser();
      if (user) {

        const redirectPath = user.isInstructor ? `/instructor/${user.id}/officeHours` : `/student/${user.id}/officeHours`;
        window.location.href = redirectPath;
      }
    }
  }, [isAuthenticated, authUser, isInstructor]);

  const handleSubmit = async (values: { email: string; password: string;}, isInstructor: boolean) => {
    
    try {
      const response = await login(values, isInstructor)
      signIn({
        token: response.accessToken,
        expiresIn: 30, // minutes
        tokenType: 'Bearer',
        authState: { id: response.id, email: values.email, isInstructor: isInstructor },
        refreshToken: "1",                    
        refreshTokenExpireIn: 1440,     
      });
    } catch (err) {
      console.log(err);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data.message || 'Unauthorized');
      } else {
        setError('An unknown error occurred');
      }
    }
  }

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email")
      .matches(/@umass\.edu$/, "Email must be from @umass.edu")
      .required("Email is required"),
    password: Yup.string()
      .required("Password is required")
  });

  const initialValues = {
    email: "", // Add email field
    password: "", // Add password field
  };


  return (
    <div className='signin-container'>
        <div className="signin-type" >
          <div className={`signin-span  ${isInstructor ? '' : 'active'}`} onClick={() => setIsInstructor(false)}>
            <span >Student</span>
          </div>
          <div className={`signin-span  ${isInstructor ? 'active' : ''}`} onClick={() => setIsInstructor(true)}>
            <span >Instructor</span>
          </div>
        </div>
        <div className='signin-welcome'>
            <h1>Welcome Back</h1>
            <img src={wave} alt="wave" />
        </div>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values) => handleSubmit(values, isInstructor)}
        >
          {({ isSubmitting }) => (
            <Form>
              {/* TODO: Fix styling of this */}
              {error && <span className='error'>{error}</span>}
              <div className='signin-box email'>
                <label htmlFor="email">Enter your email address</label>
                <Field className="signin-input" name="email" type="email" placeholder="email@umass.edu"/>
                <ErrorMessage className="signin-error" name="email" component="div" />
              </div>
              <div className='signin-box password'>
                <label htmlFor="password">Enter your Password</label>
                <Field className="signin-input" name="password" type="password" placeholder="Password"/>
                <ErrorMessage className = "signin-error" name="password" component="div" />
              </div>
              <div className='signin-new'>
                <a href='/signup'><span>No Account</span> Sign Up</a>
                <a href="/forgotpassword">Forgot Password</a>
              </div>
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                >
                  Sign in
                </button>
              </div>
            </Form>
          )}
        </Formik>
    </div>
  )
}

export default Signin