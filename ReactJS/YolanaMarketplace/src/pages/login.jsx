import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button, Input } from 'components';
import { isObject } from 'helpers';
import { useAuth, useGlobalElements } from 'hooks';
import { clearLocalStorage, getLocalStorage } from 'utils';

const validationSchema = Yup.object({
  email: Yup.string().email().required('Email is Required'),
  password: Yup.string().required('Password is Required'),
});

const Login = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const { showToast } = useGlobalElements();
  const [isLoading, setLoading] = useState(false);

  const initialValues = {
    email: '',
    password: '',
  };

  const formik = useFormik({
    initialValues: initialValues,
    validateOnMount: false,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      handleDone(values);
    },
  });

  const { values, handleBlur, handleChange, touched, errors, handleSubmit } =
    formik;

  const handleDone = async (values) => {
    setLoading(true);
    try {
      const res = await signIn(values.email, values.password);
      if (isObject(res.user)) {
        showToast({
          message: 'Login Successfully',
          type: 'success',
        });
      }
      if (getLocalStorage('path')) {
        navigate(getLocalStorage('path'));
        clearLocalStorage('path');
      } else navigate('/');
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
              Sign<span className='color'>In</span>
            </h1>
          </div>
        </div>
        <section className='row justify-content-center'>
          <div className='col-lg-4 mb-5'>
            {/* ---------- Email ---------- */}
            <div>
              <Input
                heading={'Email'}
                value={values.email}
                name='email'
                type='email'
                onBlur={handleBlur}
                onChange={handleChange}
                autoComplete='off'
                placeholder='Email'
                isError={touched.email && errors.email}
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
                style={{ position: 'relative' }}
              />
            </div>
            {/* ---------- Create Button ---------- */}
            <div className='spacer-double' />
            <div className='d-flex justify-content-center'>
              <Button
                isLoading={isLoading}
                onClick={handleSubmit}
                classes='btn-main'
                title={'Sign In'}
                extraStyles={{ width: '26rem', height: '3rem' }}
              />
            </div>
            <div style={{ marginTop: '1.5rem' }}>
              <span style={{ fontSize: '14px' }}>No Account?</span>
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
                  to={'/signup'}>
                  Create one
                </Link>
              </span>
            </div>
          </div>
        </section>
      </section>
    </div>
  );
};

export default Login;
