import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Button, Dropdown, Input } from 'components';
import { isExist, isObject } from 'helpers';
import { useAuth, useGlobalElements } from 'hooks';
import { clearLocalStorage, getLocalStorage, phoneOptions } from 'utils';

const validationSchema = Yup.object({
  firstName: Yup.string().required('First Name is Required'),
  lastName: Yup.string().required('Last Name is Required'),
  phoneNumber: Yup.number().required('Phone Number is Required'),
  email: Yup.string().email().required('Email is Required'),
  password: Yup.string().required('Password is Required'),
  confirmPassword: Yup.string()
    .required('Confirm Password is Required')
    .oneOf([Yup.ref('password'), null], 'Passwords must match'),
});

const flexStyle = { display: 'flex', alignItems: 'flex-start' };

const SignUp = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const { showToast } = useGlobalElements();
  const [isLoading, setLoading] = useState(false);

  const initialValues = {
    countryCode: '+1',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    firstName: '',
    lastName: '',
  };

  const formik = useFormik({
    initialValues: initialValues,
    validateOnMount: false,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      handleDone(values);
    },
  });

  const {
    values,
    handleBlur,
    handleChange,
    touched,
    errors,
    setFieldValue,
    handleSubmit,
    setValues,
  } = formik;

  const handleDone = async (values) => {
    setLoading(true);
    const params = {
      email: values.email,
      password: values.password,
      phoneNumber: `${values.countryCode}${values.phoneNumber}`,
      firstName: values.firstName,
      lastName: values.lastName,
    };
    try {
      const res = await signUp(params);
      if (isObject(res.user)) {
        showToast({
          message: 'Registration Successful',
          type: 'success',
        });
        if (getLocalStorage('path')) {
          navigate(getLocalStorage('path'));
          clearLocalStorage('path');
        } else navigate('/');
      }
    } catch (err) {
      showToast({
        message: err.message,
        type: 'danger',
      });
    }
    setLoading(false);
  };

  return (
    <div>
      <section className='container no-bg'>
        <div className='row justify-content-center mt-5'>
          <div className='col-lg-7 '>
            <h1 className='text-center'>
              Sign<span className='color'>Up</span>
            </h1>
          </div>
        </div>
        <section className='row justify-content-center'>
          <div className='col-lg-5 mb-5'>
            <div>
              {/* ---------- Email ---------- */}
              <Input
                heading={'Email'}
                value={values.email}
                name='email'
                type='email'
                onBlur={handleBlur}
                onChange={handleChange}
                autoComplete='off'
                placeholder='Email'
                isError={touched.email && isExist(errors.email)}
                errorMsg={errors.email}
              />
            </div>
            <div className='spacer-single' />
            {/* ---------- First & Last Name ---------- */}
            <div style={{ ...flexStyle, justifyContent: 'space-between' }}>
              <Input
                heading={'First Name'}
                value={values.firstName}
                name='firstName'
                type='text'
                onBlur={handleBlur}
                onChange={handleChange}
                autoComplete='off'
                placeholder='First Name'
                isError={touched.firstName && errors.firstName}
                errorMsg={errors.firstName}
                style={{ width: '49%' }}
              />
              <Input
                heading={'Last Name'}
                value={values.lastName}
                name='lastName'
                type='text'
                onBlur={handleBlur}
                onChange={handleChange}
                autoComplete='off'
                placeholder='Last Name'
                isError={touched.lastName && errors.lastName}
                errorMsg={errors.lastName}
                extraStyles={{ ml: 2 }}
                style={{ width: '49%' }}
              />
            </div>
            <div className='spacer-single' />
            {/* ---------- Password ---------- */}
            <div>
              <Input
                heading={'Password'}
                value={values.password}
                name='password'
                type='password'
                onBlur={handleBlur}
                onChange={handleChange}
                autoComplete='off'
                placeholder='Password'
                isError={touched.password && errors.password}
                errorMsg={errors.password}
                style={{ position: 'relative' }}
              />
            </div>
            <div className='spacer-single' />
            {/* ---------- Confirm Password  ---------- */}
            <div>
              <Input
                heading={'Confirm Password'}
                value={values.confirmPassword}
                name='confirmPassword'
                type='password'
                onBlur={handleBlur}
                onChange={handleChange}
                placeholder='Confirm Password'
                isError={touched.confirmPassword && errors.confirmPassword}
                errorMsg={errors.confirmPassword}
                style={{ position: 'relative' }}
              />
            </div>
            <div className='spacer-single' />
            {/* ---------- Phone Number ---------- */}
            <div style={{ ...flexStyle, justifyContent: 'space-between' }}>
              <Dropdown
                heading={'Country Code'}
                onBlur={handleBlur}
                onChange={handleChange}
                options={phoneOptions}
                name='countryCode'
                value={values.countryCode}
                style={{ width: '49%' }}
              />

              <Input
                heading={'Phone Number'}
                value={values.phoneNumber}
                name='phoneNumber'
                type='number'
                onBlur={handleBlur}
                onChange={handleChange}
                placeholder='Phone'
                isError={touched.phoneNumber && errors.phoneNumber}
                errorMsg={errors.phoneNumber}
                extraStyles={{ ml: 2 }}
                style={{ width: '49%' }}
              />
            </div>
            <div className='spacer-double' />
            {/* ---------- Create Button ---------- */}
            <div className='d-flex justify-content-center'>
              <Button
                isLoading={isLoading}
                onClick={handleSubmit}
                classes='btn-main'
                title={'Create Account'}
                extraStyles={{ width: '33rem', height: '3rem' }}
              />
            </div>
            <div style={{ marginTop: '1.5rem' }}>
              <span style={{ fontSize: '14px' }}>Have a Account?</span>
              <span
                style={{
                  marginLeft: '0.3rem',
                }}>
                <Link
                  className='color'
                  style={{
                    fontSize: '14px',
                    textDecoration: 'none',
                  }}
                  to={'/signin'}>
                  Sign In
                </Link>
              </span>
            </div>
          </div>
        </section>
      </section>
    </div>
  );
};

export default SignUp;
