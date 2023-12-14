import React from 'react';
import '../styles/ModalAddCourse.css';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { addCourse } from '../api/coursesService';
import * as Yup from 'yup';

/**
 * Modal component for adding a course.
 *
 * @component
 * @param {boolean} open - Determines whether the modal is open or not.
 * @param {Function} onClose - Callback function to close the modal.
 * @param {string} id - The ID of the user.
 * @param {boolean} isInstructor - Determines whether the user is an instructor or not.
 * @returns {JSX.Element|null} The modal component.
 */
const ModalAddCourse = ({ open, onClose, id, isInstructor}: { open: boolean, onClose: () => void, id: string , isInstructor: boolean}) => {

  const handleSubmit = (values: { name: string }, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    const courseName = values.name.replace(/ /g,'').toUpperCase();
    try {
      addCourse(id, courseName, isInstructor); // this function adds to the database
    } catch (error) {
      console.error("Error adding course:", error);
    }
    onClose();
    setSubmitting(false);
    window.location.reload();
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required("Course name is required")
      .min(5, "Course name must be at least 5 characters long")
      .max(13, "Course name cannot exceed 13 characters")
  });

  const initialValues = {
    name: "",
  };

  if (!open) return null;
  return (
    <div onClick={onClose} className='overlay'>
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className='modalContainer'
      >
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className='box'>
                <label htmlFor="email">Enter your the course name</label>
                <Field className="box-input" name="name" type="name" placeholder="Enter Course Name (Only enter abbreviation)"/>
                <ErrorMessage className="box-error" name="name" component="div" />
              </div>
              <div className='btn-container'>
                <button
                  type="submit"
                  disabled={isSubmitting}
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={onClose}
                >
                  Cancel
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ModalAddCourse;