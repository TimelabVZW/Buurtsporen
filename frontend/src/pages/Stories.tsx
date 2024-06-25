import { useAuth } from '../context/authContext';
import { Navigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { mutationCreateLayer, mutationCreateStory, mutationRemoveLayer, mutationUpdateDefaultShow } from '../gql/mutations';
import { useState } from 'react';

import { Helmet } from 'react-helmet';
import { DashboardMain, Header, LayersDataGrid, MassModal } from '../components';
import { Button, Grid, Card, Checkbox, FormControlLabel, Input } from "@mui/material";
import LayersIcon from '@mui/icons-material/Layers';
import { Form, Formik } from 'formik';
import CountUp from 'react-countup';

import '../sass/components/confirmationModal.scss';
import "../sass/components/dashboard.scss";
import '../sass/components/datagrid.scss';
import "../sass/components/countup.scss";
import '../sass/pages/dashboard.scss';
import StoriesDataGrid from '../components/StoriesDataGrid';

const Stories = () => {
    const { authenticated, authLoading } = useAuth();
    const [storiesCount, setStoriesCount] = useState<number>(0);
    const [refetchTrigger, setRefetchTrigger] = useState<boolean>(false);
    const [createStory] = useMutation(mutationCreateStory);

    if (authLoading) {
        return (
            <div>
                <div>Loading...</div>
            </div>
        );
    }
    
    if (!authenticated) {
        return <Navigate to="/login" replace/>;
    }

    const slugify = (str: string) => {
        return str
          .normalize('NFKD') // split accented characters into their base characters and diacritical marks
          .replace(/[\u0300-\u036f]/g, '') // remove all the accents, which happen to be all in the \u03xx UNICODE block.
          .trim() // trim leading or trailing whitespace
          .toLowerCase() // convert to lowercase
          .replace(/[^a-z0-9 -]/g, '') // remove non-alphanumeric characters
          .replace(/\s+/g, '-') // replace spaces with hyphens
          .replace(/-+/g, '-'); // remove consecutive hyphens
      }
    
  return (
    <div className='dashboard-container dashboard-container--layers'>
        <Helmet>
            <title>Buurtsporen - Stories</title>
            <meta name='description' content='Story dashboard for the buurtsporen app'/>
            <meta name='robots' content='noindex'/>
            <link rel="canonical" href="/layers" />
        </Helmet>
        <Header/>
        <DashboardMain active='stories'>
            <Grid container gap={1} style={{padding: '1rem'}}>
                <Grid xs={7.95} item>
                    <Card 
                        sx={{
                            pt: '2rem',
                            pb: '1rem'
                        }}
                    >
                        <Formik
                            initialValues={{
                                title: "",
                            }}
                            onSubmit={async (values, { setSubmitting }) => {
                                setSubmitting(true);

                                let slug = slugify(values.title);

                                await createStory({
                                    variables: {
                                        title: values.title,
                                        slug
                                    }
                                }).then(() => {
                                    setRefetchTrigger(!refetchTrigger);
                                });
                                setTimeout(() => {
                                    setSubmitting(false);
                                }, 1000);
                            }}
                            >
                            {({ values, handleChange }) => (
                                <Form className='card-form'>
                                    <FormControlLabel
                                    control={<Input sx={{width: '100%'}}/>}
                                    sx={{
                                        alignItems: 'start',
                                    }}
                                    labelPlacement='top'
                                    label="Title"
                                    name="title"
                                    onChange={handleChange}
                                    />
                                    <div>
                                    <Button
                                        className='card-form-button'
                                        type='submit'
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'end',
                                            margin: '0 1rem 0 auto',
                                            width: 'max-content'
                                        }}

                                    >
                                        Create Story
                                    </Button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </Card>
                </Grid>
                <Grid xs={3.95} item>
                    <Card 
                        sx={{
                            pt: '4.5rem',
                            pb: '1rem'
                        }}
                    >
                        <div className='countup-container'>
                            <CountUp end={storiesCount || 0} duration={3} className='countup-number'/>
                            <div className='flex countup-suffix'>
                                <p className='countup-string'>{storiesCount === 1? 'Story': 'Stories'}</p>
                                <LayersIcon
                                    className='countup-icon'
                                    sx={{
                                        width: '3rem',
                                        height: '3rem',
                                        marginLeft: '0.1rem',
                                    }}
                                />
                            </div>
                        </div>
                        <Button
                            href='/Dashboard'
                            sx={{
                                display: 'flex',
                                justifyContent: 'end',
                                margin: '2.5rem 1rem 0 auto',
                                width: 'max-content'
                            }}
                        >
                            Go back to Dashboard
                        </Button>
                    </Card>
                </Grid>
                <Grid xs={11.95} item>
                    <Card 
                        sx={{
                            pt: '1rem',
                            pb: '1rem',
                            px: '1rem',
                            minHeight: '25rem',
                            maxWidth: '100%',
                        }}
                    >
                        <StoriesDataGrid setStoriesCount={(e: number) => setStoriesCount(e)} refetchTrigger={refetchTrigger} />
                    </Card>
                </Grid>
            </Grid>
        </DashboardMain>
    </div>
  )
}

export default Stories;