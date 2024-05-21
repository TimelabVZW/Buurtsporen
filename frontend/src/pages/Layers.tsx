import { useAuth } from '../context/authContext';
import { Navigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { mutationCreateLayer, mutationRemoveLayer, mutationUpdateDefaultShow } from '../gql/mutations';
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

const Layers = () => {
    const { authenticated, authLoading } = useAuth();
    const [modal, setModal] = useState<string>('');
    const [activeLayer, setActiveLayer] = useState<null | number>(null);
    const [layerCount, setLayerCount] = useState<number>(0);
    const [refetchTrigger, setRefetchTrigger] = useState<boolean>(false);
    const [createLayer] = useMutation(mutationCreateLayer);
    const [removeLayer] = useMutation(mutationRemoveLayer);
    const [updateDefaultShow] = useMutation(mutationUpdateDefaultShow);

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
    
  return (
    <div className='dashboard-container dashboard-container--layers'>
        <Helmet>
            <title>Buurtsporen - Layers</title>
            <meta name='description' content='Layer dashboard for the buurtsporen app'/>
            <meta name='robots' content='noindex'/>
            <link rel="canonical" href="/layers" />
        </Helmet>
        <Header/>
        <DashboardMain active='layers'>
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
                                name: "",
                                private: false,
                            }}
                            onSubmit={async (values, { setSubmitting }) => {
                                setSubmitting(true);
                                await createLayer({
                                    variables: {
                                        name: values.name,
                                        private: values.private
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
                                    label="Name"
                                    name="name"
                                    onChange={handleChange}
                                    />

                                    <FormControlLabel
                                    control={<Checkbox checked={values.private} />}
                                    sx={{
                                        marginLeft: '0.2rem'
                                    }}
                                    label="Private"
                                    name="private"
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
                                        Create Layer
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
                            <CountUp end={layerCount || 0} duration={3} className='countup-number'/>
                            <div className='flex countup-suffix'>
                                <p className='countup-string'>{layerCount === 1? 'Layer': 'Layers'}</p>
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
                        <LayersDataGrid setLayerCount={(e: number) => setLayerCount(e)} refetchTrigger={refetchTrigger} updateDefaultShow={(e: any) => updateDefaultShow(e)} setModal={(e: string) => setModal(e)} setActiveLayer={(e: number) => setActiveLayer(e)} />
                    </Card>
                </Grid>
            </Grid>
        </DashboardMain>
        <MassModal
          visible={modal === 'deleteLayer'}
          setVisible={setModal}
        >
            <div className='confirmation-container'>
                <h2>Are you sure you want to delete this layer?</h2>
                <div className='confirmation-buttons'>
                    <Button
                        variant='contained'
                        onClick={() => {
                            setModal('');
                            setActiveLayer(null);
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant='contained'
                        color='error'
                        onClick={async () => {
                            await removeLayer({
                                variables: {
                                    id: activeLayer
                                }
                            }).then(() => {
                                setModal('');
                                setRefetchTrigger(!refetchTrigger);
                                setActiveLayer(null);
                            });
                        }}
                    >
                        Delete
                    </Button>
                </div>
            </div>
        </MassModal>
    </div>
  )
}

export default Layers;