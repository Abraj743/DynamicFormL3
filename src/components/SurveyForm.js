import React, { useState, useEffect } from 'react';
import axios from 'axios';

const useForm = (initialValues, validate) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      return true; // No errors, handle form submission
    }
    return false;
  };
  return {
    values,
    errors,
    handleChange,
    handleSubmit,
  };
};

const validate = (values) => {
  const errors = {};

  if (!values.fullName) {
    errors.fullName = 'Full Name is required';
  }

  if (!values.email) {
    errors.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(values.email)) {
    errors.email = 'Email is invalid';
  }

  if (!values.surveyTopic) {
    errors.surveyTopic = 'Survey Topic is required';
  }

  if (values.surveyTopic === 'Technology') {
    if (!values.favoriteLanguage) {
      errors.favoriteLanguage = 'Favorite Programming Language is required';
    }
    if (!values.yearsOfExperience) {
      errors.yearsOfExperience = 'Years of Experience is required';
    } else if (isNaN(values.yearsOfExperience) || values.yearsOfExperience <= 0) {
      errors.yearsOfExperience = 'Years of Experience must be a positive number';
    }
  }

  if (values.surveyTopic === 'Health') {
    if (!values.exerciseFrequency) {
      errors.exerciseFrequency = 'Exercise Frequency is required';
    }
    if (!values.dietPreference) {
      errors.dietPreference = 'Diet Preference is required';
    }
  }

  if (values.surveyTopic === 'Education') {
    if (!values.highestQualification) {
      errors.highestQualification = 'Highest Qualification is required';
    }
    if (!values.fieldOfStudy) {
      errors.fieldOfStudy = 'Field of Study is required';
    }
  }

  if (!values.feedback) {
    errors.feedback = 'Feedback is required';
  } else if (values.feedback.length < 10) {
    errors.feedback = 'Feedback must be at least 10 characters long';
  }

  return errors;
};

const fetchAdditionalQuestions = async (topic) => {
  const response = await axios.get(`https://opentdb.com/api.php?amount=5&category=${topic}`);
  return response.data.results;
};

const SurveyForm = () => {
  const initialValues = {
    fullName: '',
    email: '',
    surveyTopic: '',
    favoriteLanguage: '',
    yearsOfExperience: '',
    exerciseFrequency: '',
    dietPreference: '',
    highestQualification: '',
    fieldOfStudy: '',
    feedback: '',
  };

  const { values, errors, handleChange, handleSubmit } = useForm(initialValues, validate);
  const [additionalQuestions, setAdditionalQuestions] = useState([]);
  const [submittedData, setSubmittedData] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    if (submittedData) {
      const fetchQuestions = async () => {
        const additionalQs = await fetchAdditionalQuestions(submittedData.surveyTopic);
        setAdditionalQuestions(additionalQs);
        setIsPopupOpen(true);
      };
      fetchQuestions();
    }
  }, [submittedData]);

  const onSubmit = (e) => {
    const formIsValid = handleSubmit(e);
    if (formIsValid) {
      setSubmittedData(values);
    }
  };
  const closePopup = () => {
    setIsPopupOpen(false);
    setSubmittedData(null);
  };


  return (
    <div className="eventContainer">
      <h2 className="head">Survey Form</h2>
      <form onSubmit={onSubmit} className="form-section">
        <div className="form-field">
          <label>Full Name:</label>
          <input type="text" name="fullName" value={values.fullName} onChange={handleChange} />
          {errors.fullName && <p className="error_msg">{errors.fullName}</p>}
        </div>
        <div className="form-field">
          <label>Email:</label>
          <input type="email" name="email" value={values.email} onChange={handleChange} />
          {errors.email && <p className="error_msg">{errors.email}</p>}
        </div>
        <div className="form-field">
          <label>Survey Topic:</label>
          <select name="surveyTopic" value={values.surveyTopic} onChange={handleChange}>
            <option value="">Select a topic</option>
            <option value="Technology">Technology</option>
            <option value="Health">Health</option>
            <option value="Education">Education</option>
          </select>
          {errors.surveyTopic && <p className="error_msg">{errors.surveyTopic}</p>}
        </div>
        {values.surveyTopic === 'Technology' && (
          <>
            <div className="form-field">
              <label>Favorite Programming Language:</label>
              <select name="favoriteLanguage" value={values.favoriteLanguage} onChange={handleChange}>
                <option value="">Select a language</option>
                <option value="JavaScript">JavaScript</option>
                <option value="Python">Python</option>
                <option value="Java">Java</option>
                <option value="C#">C#</option>
              </select>
              {errors.favoriteLanguage && <p className="error_msg">{errors.favoriteLanguage}</p>}
            </div>
            <div className="form-field">
              <label>Years of Experience:</label>
              <input type="number" name="yearsOfExperience" value={values.yearsOfExperience} onChange={handleChange} />
              {errors.yearsOfExperience && <p className="error_msg">{errors.yearsOfExperience}</p>}
            </div>
          </>
        )}
        {values.surveyTopic === 'Health' && (
          <>
            <div className="form-field">
              <label>Exercise Frequency:</label>
              <select name="exerciseFrequency" value={values.exerciseFrequency} onChange={handleChange}>
                <option value="">Select a frequency</option>
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
                <option value="Rarely">Rarely</option>
              </select>
              {errors.exerciseFrequency && <p className="error_msg">{errors.exerciseFrequency}</p>}
            </div>
            <div className="form-field">
              <label>Diet Preference:</label>
              <select name="dietPreference" value={values.dietPreference} onChange={handleChange}>
                <option value="">Select a preference</option>
                <option value="Vegetarian">Vegetarian</option>
                <option value="Vegan">Vegan</option>
                <option value="Non-Vegetarian">Non-Vegetarian</option>
              </select>
              {errors.dietPreference && <p className="error_msg">{errors.dietPreference}</p>}
            </div>
          </>
        )}
        {values.surveyTopic === 'Education' && (
          <>
            <div className="form-field">
              <label>Highest Qualification:</label>
              <select name="highestQualification" value={values.highestQualification} onChange={handleChange}>
                <option value="">Select a qualification</option>
                <option value="High School">High School</option>
                <option value="Bachelor's">Bachelor's</option>
                <option value="Master's">Master's</option>
                <option value="PhD">PhD</option>
              </select>
              {errors.highestQualification && <p className="error_msg">{errors.highestQualification}</p>}
            </div>
            <div className="form-field">
              <label>Field of Study:</label>
              <input type="text" name="fieldOfStudy" value={values.fieldOfStudy} onChange={handleChange} />
              {errors.fieldOfStudy && <p className="error_msg">{errors.fieldOfStudy}</p>}
            </div>
          </>
        )}
        <div className="form-field">
          <label>Feedback:</label>
          <textarea name="feedback" value={values.feedback} onChange={handleChange} />
          {errors.feedback && <p className="error_msg">{errors.feedback}</p>}
        </div>
        <div className="form-field">
          <button type="submit" className="submit-btn">Submit</button>
        </div>
      </form>


      {isPopupOpen && (
        <div style={popupStyles}>
          <div style={popupContentStyles}>
          <h2 className='head' style={{color:"green"}}>Submission Complete</h2>
            <ul className="popup_list">
              <li className="data">Full Name: {submittedData.fullName}</li>
              <li className="data">Email: {submittedData.email}</li>
              <li className="data">Survey Topic: {submittedData.surveyTopic}</li>
              {submittedData.surveyTopic === 'Technology' && (
                <>
                  <li class

Name="data">Favorite Programming Language: {submittedData.favoriteLanguage}</li>
                  <li className="data">Years of Experience: {submittedData.yearsOfExperience}</li>
                </>
              )}
              {submittedData.surveyTopic === 'Health' && (
                <>
                  <li className="data">Exercise Frequency: {submittedData.exerciseFrequency}</li>
                  <li className="data">Diet Preference: {submittedData.dietPreference}</li>
                </>
              )}
              {submittedData.surveyTopic === 'Education' && (
                <>
                  <li className="data">Highest Qualification: {submittedData.highestQualification}</li>
                  <li className="data">Field of Study: {submittedData.fieldOfStudy}</li>
                </>
              )}
              <li className="data">Feedback: {submittedData.feedback}</li>
              {additionalQuestions.length > 0 && (
                <>
                  <h3>Additional Questions</h3>
                  {additionalQuestions.map((question, index) => (
                    <li key={index} className="data">{question}</li>
                  ))}
                </>
              )}
            </ul>
            <button className='closePopUp' onClick={closePopup}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};


  const popupStyles = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',

  };
  
  const popupContentStyles = {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '5px',
    width: '300px',
    textAlign: 'center',
  };

export default SurveyForm;

