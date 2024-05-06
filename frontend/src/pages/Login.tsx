import { Field, Form, Formik } from 'formik';
import {  Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as yup from 'yup';
import { useAuth } from '../context/authContext';
import { Button } from '../components';
import { Helmet } from 'react-helmet';


const Login = () => {
    const { Login } = useAuth();
    const navigate = useNavigate();
    const { authenticated, authLoading } = useAuth()

    if (authLoading) {
        return (
            <div>
                <div>Loading...</div>
            </div>
        );
    }

    if (authenticated) {
        return <Navigate to="/dashboard" replace/>;
    }
    
    const validationSchema = yup.object({
        email: yup.string().email().required().max(50),
        password: yup.string().required().max(30),
    })
  return (
    <>
        <div className='main-content'>
            <Helmet>
                <title>Buurtsporen - Login</title>
                <meta name='description' content='Login to the Buurtsporen dashboard.'/>
                <meta name='robots' content='noindex'/>
                <link rel="canonical" href="/login" />
            </Helmet>
            <div className='main-container'>
                <div className='form-container'>
                <h2  >Buurtsporen</h2>
                <Formik
                    initialValues={{
                        email: "",
                        password: "",
                    }}
                    validationSchema={validationSchema}
                    onSubmit={async (values, { setSubmitting }) => {
                        setSubmitting(true);
                        const tokenStatus = await Login({username: values.email, password: values.password})
                        if (tokenStatus === 201) {
                            navigate('/dashboard')
                        }

                        setTimeout(() => {
                            setSubmitting(false);
                        }, 1000);
                    }}
                    >
                    {({ values, handleChange, isSubmitting, errors }) => (
                        <Form>
                            <div className='form__input-container'>
                                <label htmlFor="email">Email address</label>
                                <Field name="email" required type="text" />
                            </div>
                            <div className='form__input-container'>
                                <label htmlFor="password">Password</label>
                                <Field name="password" required type="password" />
                            </div>
                            <div className='form_buttons'> 
                                <div  className="login__button">
                                    <Button type={"submit"} disabled={isSubmitting}>
                                        Log In
                                    </Button>
                                </div>
                            </div>
                        </Form>
                    )}
                </Formik>
                </div>
            </div>
        </div>
    </>
  )
}

export default Login;