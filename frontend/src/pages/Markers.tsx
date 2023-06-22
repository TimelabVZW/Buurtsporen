import { ConditionalLoader, DashboardMain, Header } from '../components';
import { useAuth } from '../context/authContext';
import { Navigate } from 'react-router-dom';
import { Button, Card, Checkbox, FormControlLabel, FormLabel, Grid, Input, MenuItem, Select, TextField } from '@mui/material';
import { Field, Form, Formik } from 'formik';
import CountUp from 'react-countup';
import MarkerIcon from '@mui/icons-material/Room';
import { useMutation, useQuery } from '@apollo/client';
import { GET_LAYERS_DATA } from '../gql/queries';
import * as yup from 'yup';

import '../sass/pages/dashboard.scss'
import { DetailedHTMLProps, InputHTMLAttributes, useRef, useState } from 'react';
import { mutationImportMarkers } from '../gql/mutations';

const Markers = () => {
    const [ jsonLoaded , setJsonLoaded ] = useState(false);
    const [ jsonKeys , setJsonKeys ] = useState<string[] | null>(null); 
    const [ jsonData , setJsonData ]  = useState([]); 
    const { authenticated, authLoading, user } = useAuth();
    const [importMarkers] = useMutation(mutationImportMarkers);
    const fileRef = useRef<HTMLInputElement | null>(null);
    const { loading, error, data } = useQuery(GET_LAYERS_DATA);

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

const validationSchema = yup.object({
    files: yup.mixed()
      .test("is-file-too-big", "File exceeds 10MB", () => {
        let valid = true;
        const files = fileRef?.current?.files;
        if (files) {
          const fileArr = Array.from(files);
          fileArr.forEach((file) => {
            const size = file.size / 1024 / 1024;
            if (size > 10) {
              valid = false;
            }
          });
        }
        return valid;
      })
      .test(
        "is-file-of-correct-type",
        "File is not of supported type",
        () => {
          let valid = true;
          const files = fileRef?.current?.files;
          if (files) {
            const fileArr = Array.from(files);
            fileArr.forEach((file) => {
              const type = file.type.split("/")[1];
              const validTypes = [
                "json",
              ];
              if (!validTypes.includes(type)) {
                valid = false;
              }
            });
          }
          return valid;
        }
      )
  })

//   file reader functions
  function readerRead(event: any) {
    let reader = new FileReader();
    reader.onload = readerLoad;
    reader.readAsText(event.target.files[0])
  }

  async function readerLoad(event: any) {
    let obj = JSON.parse(event.target.result);
    setJsonLoaded(true);
    setJsonData(obj);
    let jsonKeysTemp = Object.keys(obj[1]);
    setJsonKeys(jsonKeysTemp.filter((key: any) => typeof obj[0][key] === 'string' || typeof obj[0][key] === 'number'));
  }

  function checkJson(event: any) {
    if (event.currentTarget.files?.[0].type.split('/')[1] === 'json') {
        return;
    }
    setJsonLoaded(false);
  }

  function filterJsonKeys(): void {
    if (jsonKeys && jsonData) {
        setJsonKeys(jsonKeys.filter((key: any) => typeof jsonData[0][key] === 'string' || typeof jsonData[0][key] === 'number'))
    }
  }
    
  return (
    <div className='dashboard-container'>
        <Header/>
        <DashboardMain active='markers'>
            
        <Grid container gap={1} style={{padding: '1rem'}}>
                <Grid xs={3.95}>
                    <Card 
                        sx={{
                            pt: '2rem',
                            pb: '1rem'
                        }}
                    >
                        <Formik
                            initialValues={{
                                file: null,
                                private: false,
                                layerId: undefined,
                                titleField: undefined,
                                descriptionField: undefined,
                            }}
                            validationSchema={validationSchema}
                            onSubmit={async (values, { setSubmitting }) => {
                                setSubmitting(true);
                                let titleKeyName: string | undefined = '';
                                let descriptionKeyName: string | undefined = '';

                                // check if titleField is filled
                                if (
                                    values.titleField !==  undefined
                                ) {
                                    console.log( values.titleField);
                                    titleKeyName = jsonKeys?.[values.titleField];
                                }

                                // Check if descriptionField is filled
                                if (
                                    values.descriptionField !==  undefined
                                ) {
                                    descriptionKeyName = jsonKeys?.[values.descriptionField];
                                }

                                
                                let inputs = jsonData.map((markerData: any[any]) => {
                                    let type = markerData.geometry.geometry.type;
                                    let name = titleKeyName? markerData[titleKeyName] : undefined;
                                    let coords = markerData.geometry.geometry.coordinates;
                                    let layerId = values.layerId;

                                    if (type === 'Point') {
                                        coords = [coords]
                                    }
                                    
                                    if (descriptionKeyName) {
                                        let description = markerData[descriptionKeyName]
                                        return {
                                            name: name,
                                            description: description,
                                            type: type,
                                            coords: coords,
                                            layerId: layerId
                                        }
                                    };
                                    return {
                                        name: name,
                                        type: type,
                                        coords: coords,
                                        layerId: layerId
                                    }
                                });
                                
                                const { data } = await importMarkers({
                                    variables: {
                                        createMarkerWithCoordsInputs: inputs,
                                    }
                                })
                                if (data) {
                                    console.log(data);
                                };

                                setTimeout(() => {
                                    alert(JSON.stringify(values, null, 2));
                                    setSubmitting(false);
                                }, 1000);
                            }}
                            >
                            {({ values, handleChange, setFieldValue, isSubmitting, errors }) => (
                                <Form className='card-form'>


                                    <FormLabel sx={{px: '1rem'}} htmlFor='layerId'>Select Layer to import to</FormLabel>
                                    <TextField
                                        variant="outlined"
                                        name="layerId"
                                        id="layerId"
                                        sx={{
                                            width: '100%',
                                            px: '1rem'
                                        }}
                                        select
                                        value={values.layerId}
                                        onChange={handleChange}
                                        >
                                            
                                        <MenuItem key={-1} value={undefined}>
                                            ---
                                        </MenuItem>
                                        {data.layers?.map((layer: {name: string, id: number}) => (
                                            <MenuItem key={layer.id} value={layer.id}>
                                                {layer.name}
                                            </MenuItem>
                                        ))}
                                    </TextField>

                                    <input id="file" ref={fileRef} name="file" type="file" className='card-form-file' onChange={(event) => {
                                        setFieldValue("file", event.currentTarget.files?.[0]);
                                        checkJson(event);
                                        readerRead(event);
                                    }} />
                                    
                                    <ConditionalLoader condition={jsonLoaded && jsonKeys !== null}>
                                        <FormLabel sx={{px: '1rem'}} htmlFor='titleField'>Choose what field represents the title</FormLabel>
                                        <TextField
                                        variant="outlined"
                                        name="titleField"
                                        id="titleField"
                                        sx={{
                                            width: '100%',
                                            px: '1rem'
                                        }}
                                        select
                                        value={values.titleField}
                                        onChange={handleChange}
                                        >
                                        <MenuItem key={-1} value={undefined}>
                                            ---
                                        </MenuItem>
                                        {jsonKeys?.map((jsonKey, key) => (
                                            <MenuItem key={key} value={key}>
                                                {jsonKey}
                                            </MenuItem>
                                        ))}
                                        </TextField>

                                        
                                        <FormLabel sx={{px: '1rem'}} htmlFor='descriptionField'>Choose what field represents the description (optional)</FormLabel>
                                        <TextField
                                        variant="outlined"
                                        name="descriptionField"
                                        id="descriptionField"
                                        sx={{
                                            width: '100%',
                                            px: '1rem'
                                        }}
                                        select
                                        value={values.descriptionField}
                                        onChange={handleChange}
                                        >
                                        <MenuItem key={-1} value={undefined}>
                                            ---
                                        </MenuItem>
                                        {jsonKeys?.map((jsonKey, key) => (
                                            <MenuItem key={key} value={key}>
                                                {jsonKey}
                                            </MenuItem>
                                        ))}
                                        </TextField>

                                    </ConditionalLoader>

                                    <Button
                                        className='card-form-button'
                                        type='submit'
                                        disabled={values.file === null}
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'end',
                                            margin: '0 1rem 0 auto',
                                            width: 'max-content'
                                        }}
                                    >
                                        Import markers
                                    </Button>
                                </Form>
                            )}
                        </Formik>
                    </Card>
                </Grid>
                <Grid xs={3.95}>
                    <Card 
                        sx={{
                            pt: '2rem',
                            pb: '1rem'
                        }}
                    >
                        <h2>EXPORT</h2>
                    </Card>
                </Grid>
                <Grid xs={3.95}>
                    <Card 
                        sx={{
                            pt: '4.5rem',
                            pb: '4.5rem'
                        }}
                    >
                        <div className='countup-container'>
                            <CountUp end={data.markers.length} duration={3} className='countup-number'/>
                            <div className='flex countup-suffix'>
                                <p className='countup-string'>Markers</p>
                                <MarkerIcon 
                                    className='countup-icon'
                                    sx={{
                                        width: '3rem',
                                        height: '3rem',
                                        marginLeft: '0.1rem',
                                    }}
                                />
                            </div>
                        </div>
                    </Card>
                </Grid>
            </Grid>
        </DashboardMain>
    </div>
  )
}

export default Markers;