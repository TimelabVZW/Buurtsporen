import { CrudDataGrid, CustomCheckbox, DashboardMain, Header, MassModal } from '../components';
import { useAuth } from '../context/authContext';
import { Navigate } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import { Field, FieldArray, Form, Formik } from 'formik';
import { Button, Grid, Card, Checkbox, FormControlLabel, Input } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import LayersIcon from '@mui/icons-material/Layers';
import CountUp from 'react-countup';

import '../sass/pages/dashboard.scss'
import { mutationCreateLayer, mutationRemoveLayer, mutationUpdateDefaultShow } from '../gql/mutations';
import { GET_LAYERS_DATA } from '../gql/queries';
import { GridColDef } from '@mui/x-data-grid';
import { useState } from 'react';

const Layers = () => {
    const { authenticated, authLoading, user } = useAuth();
    const [modal, setModal] = useState<string>('');
    const [activeLayer, setActiveLayer] = useState<null | number>(null);
    const [createLayer] = useMutation(mutationCreateLayer);
    const [removeLayer] = useMutation(mutationRemoveLayer);
    const [updateDefaultShow] = useMutation(mutationUpdateDefaultShow);
    const { loading, error, data, refetch } = useQuery(GET_LAYERS_DATA);

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

    if (loading) return <p>Loading...</p>;

    if (error) {
        return <p>Error...</p>;
    }

    const columns: GridColDef[] = [
        {
            field: "action",
            headerName: "",
            sortable: false,
            filterable: false,
            renderCell: (params) => {
              const onClick = (e: any) => {
                setActiveLayer(params.row.id);
                setModal('deleteLayer');
              };
        
              return <Button onClick={onClick}><DeleteIcon sx={{ fill: '#FF0000'}}/></Button>;
            }
        },
        { field: "id", headerName: "ID", width: 150 },
        { field: "name", headerName: "Name", width: 150 },
        { field: "createdAt", headerName: "Created at", width: 250 },
        { field: "private", headerName: "Private", width: 150 },
        { field: "markers", headerName: "Markers", width: 150 },
        {
            field: "defaultShow",
            headerName: "Default to show",
            width: 150,
            sortable: false,
            filterable: false,
            renderCell: (params) => {
                let disabled = false;
                const onClick = async (e: any) => {
                    disabled = true;
                    await updateDefaultShow({
                        variables: {
                            id: params.row.id,
                            defaultShow: !params.row.defaultShow
                        }
                    })
                    params.row.defaultShow = !params.row.defaultShow;
                    disabled = false;
                };
            
                return (
                    <CustomCheckbox
                        name=''
                        onClick={onClick}
                        disabled={disabled}
                        initialChecked={params.row.defaultShow}
                    />
                )
            }
        },
    ]


    let rows = data.layers.map((obj: any, index: number) => ({
        ...obj,
        markers: obj.markers.length,
        createdAt: `${new Date(obj.createdAt).toLocaleDateString()}\n ${new Date(obj.createdAt).toLocaleTimeString()}`,
    }));
    
  return (
    <div className='dashboard-container dashboard-container--layers'>
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
                                const { data: createData } = await createLayer({
                                    variables: {
                                        name: values.name,
                                        private: values.private
                                    }
                                })
                                refetch();
                                setTimeout(() => {
                                    setSubmitting(false);
                                }, 1000);
                            }}
                            >
                            {({ values, handleChange, isSubmitting, errors }) => (
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
                            <CountUp end={data.layers.length} duration={3} className='countup-number'/>
                            <div className='flex countup-suffix'>
                                <p className='countup-string'>{data.layers.length === 1? 'Layer': 'Layers'}</p>
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
                        <CrudDataGrid rows={rows} columns={columns} pageSize={5} pageSizeOptions={[5, 10, 20]}
                        />
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
                            const { data: removedData } = await removeLayer({
                                variables: {
                                    id: activeLayer
                                }
                            })
                            setModal('');
                            refetch();
                            setActiveLayer(null);
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