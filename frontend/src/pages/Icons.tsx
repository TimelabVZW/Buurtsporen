import { useAuth } from '../context/authContext';
import { Navigate } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import { mutationCreateIcon, mutationRemoveIcon, mutationUpdateIcon } from '../gql/mutations';
import { GET_ICONS_PAGE } from '../gql/queries';
import { useState } from 'react';
import * as yup from 'yup';

import { Helmet } from 'react-helmet';
import { DashboardMain, Header, LoadingMap, MassModal } from '../components';
import { IconFormInput, IconFormUpdate } from '../interfaces';
import { Button, Grid, Card, FormLabel, TextField, ImageList, ImageListItem, ImageListItemBar, IconButton} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import { Form, Formik, ErrorMessage} from 'formik';

import '../sass/components/datagrid.scss';
import "../sass/components/dashboard.scss";

const validationSchema = yup.object({
    name: yup.string().max(1000).required(),
    fileName: yup.string(),
});

const validationSchema2 = yup.object({
    name: yup.string().max(1000).required(),
    fileName: yup.string(),
});

const Icons = () => {
    const { authenticated, authLoading } = useAuth();
    const [search, setSearch] = useState<string>('');
    const [modalVisible, setModalVisible] = useState<string>('');
    const [activeIcon, setActiveIcon] = useState<null | number>(null);
    const [createIcon] = useMutation(mutationCreateIcon);
    const [updateIcon] = useMutation(mutationUpdateIcon);
    const [removeIcon] = useMutation(mutationRemoveIcon);
    const { loading, error, data, refetch } = useQuery(GET_ICONS_PAGE);

    if (authLoading) return <LoadingMap/>;
    
    if (!authenticated) return <Navigate to="/login" replace/>;

    if (loading) return <LoadingMap/>;

    if (error) {
        return <p>Error...</p>;
    }

    let icons = data.icons;
    const backendURL = import.meta.env.VITE_REACT_APP_BACKEND_URL;
    
    
  return (
    <div className='dashboard-container dashboard-container--layers'>
        <Helmet>
            <title>Buurtsporen - Icons</title>
            <meta name='description' content='Icon dashboard for the buurtsporen app'/>
            <meta name='robots' content='noindex'/>
            <link rel="canonical" href="/icons" />
        </Helmet>
        <Header/>
        <DashboardMain active='icons'>
        <Grid container gap={1} style={{padding: '1rem'}}>
                <Grid xs={11.95} item>
                    <Card 
                        sx={{
                            pt: '1rem',
                            pb: '1rem',
                            px: '1rem',
                            maxWidth: '100%',
                        }}
                    >
                                <Formik
                        initialValues={{
                            name: '',
                            files: [''],
                        }}
                        validationSchema={validationSchema}
                        onSubmit={async (values, { setSubmitting }) => {
                            setSubmitting(true);
                            let input: IconFormInput = {
                                name: values.name,
                            }

                            if (values.files) {
                                let data = new FormData;
                                values.files.forEach((file, index) => {
                                    data.append(`file${index}`, file)
                                });
                            
                                await fetch(backendURL + '/icon/upload', {
                                method: 'POST',
                                headers: {
                                    'Accept': 'application/json',
                                },
                                body: data
                                })
                                .then(async (response) => {
                                    const responseBody = await response.json();
                                    
                                    input['fileName'] = responseBody.fileName;
                                    input['url'] = responseBody.url;
                                })     
                            }

                            const { data } = await createIcon({
                                variables: input
                            })

                            if (data) {
                                refetch();
                            }

                            setTimeout(() => {
                                setSubmitting(false);
                            }, 1000);
                        }}
                        >
                        {({ values, handleChange, setFieldValue, isSubmitting }) => (
                            <Form className='marker-form' style={{paddingTop: '2rem'}}>
                                <div className='flex flex-row' style={{justifyContent: 'space-between', alignItems: 'center'}}>
                                    <div style={{width: '50%'}}>
                                        <FormLabel sx={{px: '1rem'}} htmlFor='name'>Icon name</FormLabel>
                                        <ErrorMessage name="name" component="div" className='errorfield' />
                                        <TextField
                                            name="name"
                                            id="name"
                                            value={values.name}
                                            onChange={handleChange}
                                            rows={5}
                                            sx={{width: '100%', py: '0', px: '1rem', mt: '1rem'}}
                                        />
                                    </div>
                                    <div style={{width: '50%', paddingLeft: '4rem', paddingTop: '2rem'}}>
                                        <FormLabel sx={{px: '1rem'}} htmlFor='files'>Upload the icon svg/png</FormLabel>
                                        <ErrorMessage name="files" component="div" className='errorfield' />
                                        <div className="input-field">
                                            <input name='files' type="file" accept='image/svg+xml, image/png' onChange={((event) => setFieldValue(`files.${0}`, event.target.files?.[0]))} />
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    variant="contained"
                                    type="submit"
                                    className="marker-form-button"
                                    disabled={isSubmitting}
                                    sx={{width: 'max-content', px: '1rem', mb: '2rem', ml: 'auto', mr: '1rem'}}
                                >
                                    Create Icon
                                </Button>
                            </Form>
                            )}
                        </Formik>
                    </Card>
                </Grid>
                <Grid xs={11.95} item>
                    <Card 
                        sx={{
                            pt: '1rem',
                            pb: '1rem',
                            px: '1rem',
                            maxWidth: '100%',
                            minHeight: '39rem',
                        }}
                    >
                        <FormLabel sx={{px: '1rem'}} htmlFor='search'>Search</FormLabel>
                        <TextField
                            name="search"
                            id="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            rows={5}
                            sx={{width: '100%', py: '0', px: '1rem', mt: '1rem', mb: '2rem'}}
                        />
                        <ImageList
                            sx={{
                                width: '100%',
                                height: '24rem',
                                transform: 'translateZ(0)',
                            }}
                            gap={1}
                            rowHeight={240}
                            cols={6}
                        >
                            {icons.filter((icon: any) => icon.name.includes(search)).map((icon: any) => {
                                return (
                                <ImageListItem key={icon.id} cols={1} rows={1} sx={{position: 'relative'}}>
                                    <img
                                    src={`${icon.url}`}
                                    alt={icon.name}
                                    loading="lazy"
                                    style={{width: '10rem', height: '10rem', objectFit: 'contain', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', maxWidth: '100%', maxHeight: '100'}}
                                    />
                                    <ImageListItemBar
                                        title={icon.name}
                                        sx={{
                                        position: 'absolute',
                                        bottom: '0',
                                        top: 'auto',
                                        left: '20'
                                        }}
                                        actionIcon={
                                        <IconButton
                                            sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                                            aria-label={`info about ${icon.name}`}
                                            onClick={() => {
                                            setActiveIcon(icon.id)
                                            setModalVisible('open')
                                        }}
                                        >
                                            <EditIcon/>
                                        </IconButton>
                                        }
                                    />
                                </ImageListItem>
                                );
                            })}
                        </ImageList>
                    </Card>
                </Grid>
            </Grid>
        </DashboardMain>
        <MassModal visible={modalVisible === 'open'} setVisible={setModalVisible}>
            <Formik
                initialValues={{
                    id: icons.filter((icon: any) => icon.id === activeIcon)[0]?.id,
                    name: icons.filter((icon: any) => icon.id === activeIcon)[0]?.name,
                    files: [''],
                    oldName: icons.filter((icon: any) => icon.id === activeIcon)[0]?.fileName || undefined,
                }}
                validationSchema={validationSchema2}
                onSubmit={async (values, { setSubmitting }) => {
                    setSubmitting(true);
                    let input: IconFormUpdate = {
                        id: values.id,
                        name: values.name,
                    }

                    if (values.files) {
                        let data = new FormData;
                        values.files.forEach((file, index) => {
                            data.append(`file${index}`, file)
                        });
                    
                        await fetch(backendURL + '/icon/upload', {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                        },
                        body: data
                        })
                        .then(async (response) => {
                        const responseBody = await response.json();
                        
                        input['fileName'] = responseBody.fileName;
                        input['url'] = responseBody.url;
                        })
                        .catch((error) => {
                        // Handle errors if the promise is rejected
                        console.error('An error occurred:', error);
                        });
                
                        if (values.oldName) {
                            await fetch(backendURL + `/icon/deleteSDK/${values.oldName}`, {
                            method: 'GET',
                            headers: {
                                'Accept': 'application/json',
                            },
                            })
                        }
                    }

                    if (input.fileName === '') {
                        input.fileName = icons.filter((icon: any) => icon.id === activeIcon)[0]?.fileName;
                    }

                    const { data } = await updateIcon({
                        variables: input
                    })

                    if (data) {
                        setModalVisible('');
                        refetch();
                    }

                    setTimeout(() => {
                        setSubmitting(false);
                        
                    }, 1000);
                }}
                >
                {({ values, handleChange, setFieldValue, isSubmitting }) => (
                    <Form className='marker-form' style={{paddingTop: '2rem'}}>
                        <div className='flex flex-row' style={{justifyContent: 'space-between', alignItems: 'center'}}>
                            <div style={{width: '50%'}}>
                                <FormLabel sx={{px: '1rem'}} htmlFor='name'>Icon name</FormLabel>
                                <ErrorMessage name="name" component="div" className='errorfield' />
                                <TextField
                                    name="name"
                                    id="name"
                                    value={values.name}
                                    onChange={handleChange}
                                    rows={5}
                                    sx={{width: '100%', py: '0', px: '1rem', mt: '1rem'}}
                                />
                            </div>
                            <div style={{width: '50%', paddingLeft: '4rem', paddingTop: '2rem'}}>
                                <FormLabel sx={{px: '1rem'}} htmlFor='files'>Upload the icon svg/png</FormLabel>
                                <ErrorMessage name="files" component="div" className='errorfield' />
                                <div className="input-field">
                                    <input name='files' type="file" accept='image/svg+xml, image/png' onChange={((event) => setFieldValue(`files.${0}`, event.target.files?.[0]))} />
                                </div>
                            </div>
                        </div>
                        <div className='flex flex-row' style={{ justifyContent: 'space-between' }}>
                            <Button
                                variant="contained"
                                type="button"
                                className="marker-form-button marker-form-button--delete"
                                color='error'
                                disabled={isSubmitting}
                                sx={{width: 'max-content', px: '1rem', ml: '1rem', mt: '2rem'}}
                                onClick={() => {setModalVisible('deleteConfirmation')}}
                            >
                                Delete
                            </Button>
                            <Button
                                variant="contained"
                                type="submit"
                                className="marker-form-button"
                                disabled={isSubmitting}
                                sx={{width: 'max-content', px: '1rem', mr: '1rem',  mt: '2rem'}}
                            >
                                Change Icon
                            </Button>
                        </div>
                    </Form>
                    )}
                </Formik>
        </MassModal>
        <MassModal visible={modalVisible === 'deleteConfirmation'} setVisible={setModalVisible}>
            <h2 style={{paddingTop: '2rem', paddingLeft: '2rem', paddingRight: '2rem'}}>Are you sure you want to delete this icon?</h2>
            <div className='flex flex-row' style={{ justifyContent: 'space-between' }}>
                <Button
                    variant="contained"
                    type="button"
                    color='primary'
                    className="marker-form-button"
                    sx={{width: 'max-content', px: '1rem', ml: '1rem', mt: '2rem'}}
                    onClick={() => {setModalVisible('open')}}
                >
                    Go back
                </Button>
                <Button
                    variant="contained"
                    type="button"
                    className="marker-form-button marker-form-button--delete"
                    color='error'
                    sx={{width: 'max-content', px: '1rem', ml: '1rem', mt: '2rem'}}
                    onClick={async () => {
                        setModalVisible('')
                        
                        // remove image from aws bucket
                        await fetch(backendURL + `/icon/deleteSDK/${icons.find((icon: any) => icon.id === activeIcon).fileName}`, {
                        method: 'GET',
                        headers: {
                            'Accept': 'application/json',
                        },
                        })

                        // remove icon from api
                        removeIcon({
                            variables: {
                                id: icons.filter((icon: any) => icon.id === activeIcon)[0]?.id
                            }
                        }).then(() => {
                            setActiveIcon(null);
                            refetch();
                        });
                    }}
                >
                    Delete
                </Button>
            </div>
        </MassModal>
    </div>
  )
}

export default Icons;