import React from 'react'
//import { useState } from 'react'
import { Formik, Form , Field, ErrorMessage} from 'formik';
//import * as Yup from 'yup';
import '../styles/UserInfo.css'
import ForwardRoundedIcon from '@mui/icons-material/ForwardRounded';
export interface UserInfoProps {
  info: any; // You can replace 'any' with a more specific type if you know the structure of 'info'
  set: (info: any) => void; // Replace 'any' with the appropriate type
  back: (view: string) => void;
}

const UserInfo : React.FC<UserInfoProps> = ({ info, set, back }) => {
    const handleSubmit = (values: any) => {
        const courses = values.courses.replace(/ /g,'').toUpperCase().split(',');
        set({
            ...info,
            firstName: values.firstName,
            lastName: values.lastName,
            courses: courses,
        })
        back('schedule')

    }
    const initialValues = {
        firstName: "",
        lastName: "",
        courses: "",
    }
    return (
        <div className='user-info-container'>
            <ForwardRoundedIcon className='back' onClick={() => back('signin')}/>
            <div className='user-info-welcome'>
                <h1>Information </h1>
                {/* <img src={peace} alt="peace logo"/> */}
            </div>
            <Formik
              initialValues={initialValues}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form>
                  <div className='user-info-box'>
                    <label htmlFor="firstName">Enter your first name</label>
                    <Field className="user-info-input" name="firstName" type="firstName" placeholder="ex. John"/>
                    <ErrorMessage className = "signup-error" name="firstName" component="div" />
                  </div>
                  <div className='user-info-box'>
                    <label htmlFor="lastName">Enter your last name</label>
                    <Field className="user-info-input" name="lastName" type="lastName" placeholder="ex. Doe"/>
                    <ErrorMessage className = "signup-error" name="lastName" component="div" />
                  </div>
                  <div className='user-info-box'>
                    <label htmlFor="courses">Enter your courses separated by commas</label>
                    <Field className="user-info-input" name="courses" type="courses" placeholder="ex. CS320,CS311,..."/>
                    <ErrorMessage className = "signup-error" name="courses" component="div" />
                  </div>
                  <div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                    >
                      Submit
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
        </div>
    )

}

export default UserInfo;


