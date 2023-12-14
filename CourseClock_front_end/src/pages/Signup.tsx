import React, { useEffect } from 'react'
import { useState } from 'react'
import { Formik, Form , Field, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import '../styles/Signup.css'
import peace from '../assets/Emoji_Peace.svg'
import UserInfo from './UserInfo';
import GetSchedule from './GetSchedule';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { register } from '../api/authService';

const Signup = () => {
    const [isInstuctor, setIsInstructor] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentView, setCurrentView] = useState('signin');
    const [info, setInfo] = useState({} as any);
    const navigate = useNavigate();


    const handleSubmit = (values : any) => {
      values.isInstructor = isInstuctor;
      setInfo(values)
      setCurrentView('user-info');
    }

    useEffect(() => {
      const submitForm = async () => {
        if (info.schedule) {
          try {
            await register(info);
            navigate('/signin');
          } catch (err) {
            if (axios.isAxiosError(err)) {
              setError(err.response?.data.message || 'An error occurred');
            } else {
              setError('An unknown error occurred');
            }
          }
        }
      };

      submitForm();
    }, [info, navigate]);
    

    // const handleSubmit = (values: any) => {
    //     console.log(values);
    // }
    
  
    const validationSchema = Yup.object().shape({
      email: Yup.string()
        .email("Invalid email")
        .matches(/@umass\.edu$/, "Email must be from @umass.edu")
        .required("Email is required"),
      password: Yup.string()
        .required("Password is required"),
      re_password: Yup.string()
        .oneOf([Yup.ref('password'), ""], 'Passwords must match')
        .required('Password confirmation is required')
    });
  
    const initialValues = {
      email: "",
      password: "",
      re_password: "",
      isInstuctor: isInstuctor,
    };
  
    return (
      <div>
        {currentView === 'user-info' && <UserInfo 
        info={info} 
        set={setInfo}
        back={(b: string) => setCurrentView(b)}
        />}
        {currentView === 'signin' && 
          <div className='signup-container'>
          <div className="signup-type" >
            <div className={`signup-span  ${isInstuctor ? '' : 'active'}`} onClick={() => setIsInstructor(false)}>
              <span >Student</span>
            </div>
            <div className={`signup-span  ${isInstuctor ? 'active' : ''}`} onClick={() => setIsInstructor(true)}>
              <span >Instructor</span>
            </div>
          </div>
          {/* This part is kinda ass, we can fix this */}
          <div className='signup-welcome'>
              <h1>Let's Start</h1>
              <img src={peace} alt="peace logo"/>
          </div>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                {error && <span className='error'>{error}</span>}
                <div className='signup-box'>
                  <label htmlFor="email">Enter your email address</label>
                  <Field className="signup-input" name="email" type="email" placeholder="email@umass.edu"/>
                  <ErrorMessage className = "signup-error" name="email" component="div" />
                </div>
                <div className='signup-box'>
                  <label htmlFor="password">Enter your Password</label>
                  <Field className="signup-input" name="password" type="password" placeholder="Password"/>
                  <ErrorMessage className = "signup-error" name="password" component="div" />
                </div>
                <div className='signup-box'>
                  <label htmlFor="re_password">Renter your Password</label>
                  <Field className="signup-input" name="re_password" type="password" placeholder="Renter password"/>
                  <ErrorMessage className = "signup-error" name="re_password" component="div" />
                </div>
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                  >
                    Sign up
                  </button>
                </div>
              </Form>
            )}
          </Formik>
          </div>
        }
        {currentView === 'schedule' && <GetSchedule
        info={info} 
        set={setInfo}
        back={(b: string) => setCurrentView(b)}
        />}
      </div>
    )
}

export default Signup