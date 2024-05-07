import React from 'react'
import { MarkerImportFormProps, MarkerInput } from '../../interfaces'
import { ErrorMessage, Form, Formik } from 'formik'
import * as yup from 'yup';
import { Button, FormLabel, TextField  } from '@mui/material';
import { useMutation } from '@apollo/client';
import { mutationImportMarkers } from '../../gql/mutations';
import Tiptap from '../WYSIWYG/Tiptap';
import ImportMenu from '../WYSIWYG/ImportMenu';
import DOMPurify from "dompurify";

const validationSchema = yup.object({
    title: yup.string().required(),
    description: yup.string().required(),
});

const MarkerImportForm2 = ({selectedRows, layers, formData, setFormData, setModal, refetch, jsonType}: MarkerImportFormProps) => {
    const [focus, setFocus] = React.useState<'' | 'title' | 'description'>('');
    const [importMarkers] = useMutation(mutationImportMarkers);

    const templateString = (template: string, object: Record<string, number>): string => {
        return template.replace(/{([^}]+)}/g, (match: string, key: string) => {
            const value = object[key.trim()];
            if (value === undefined) {
                return match;
            }
            if (typeof value === 'number') {
                return value.toString();
            }
            return value;
        });
    }

    let rowKeys: string[] = Object.keys(selectedRows[0]);

    return (
        <Formik
        initialValues={{
            title: formData.title || '',
            description: formData.description || '',
        }}
        validationSchema={validationSchema}
        
        onSubmit={async (values, { setSubmitting }) => {
            setSubmitting(true);

            function isValidCoordinate(coord: any): boolean {
                return Array.isArray(coord) && coord.length === 2 && !isNaN(coord[0]) && !isNaN(coord[1]);
            }
            
            function getCoordinatesArray(markerData: any, field: string): [number, number][] | null {
                const coordinates = markerData[field];

                if (jsonType !== 'json') {
                    if (markerData[field]) {
                        let coords = markerData[field].replace('POINT (', '').replace(')', '').split(/\s+/);
                        
                        // Check if there are exactly two elements in the resulting array
                        if (coords.length === 2 && !isNaN(parseFloat(coords[0])) && !isNaN(parseFloat(coords[1]))) {
                            let [longitude, latitude] = coords.map(parseFloat);
                            return [[latitude, longitude]];
                        }
                    } else {
                        ('markerData[field] is undefined or null.');
                    }
                }
            
                if (!Array.isArray(coordinates)) {
                    return null;
                }
            
                if (markerData['geometry.geometry.type'] === 'Point') {
                    const coord = markerData[field];
                    
                    if (isValidCoordinate(coord)) {
                        return [[coord[1], coord[0]]];
                    }
                } else if (markerData['geometry.geometry.type'] === 'LineString') {
                    const validCoords: [number, number][] = coordinates
                    .filter(isValidCoordinate)
                    .map((coord: any) => [parseFloat(coord[1]), parseFloat(coord[0])]); // Swap positions
        
                    if (validCoords.length > 0) {
                        return validCoords;
                    }
                } else if (markerData['geometry.geometry.type'] === 'MultiLineString') {
                    const validCoords: [number, number][] = coordinates
                    .filter(isValidCoordinate)
                    .map((coord: any) => [parseFloat(coord[1]), parseFloat(coord[0])]); // Swap positions
        
                    if (validCoords.length > 0) {
                        return validCoords;
                    }
                } else if (markerData['geometry.geometry.type'] === 'Polygon') {
                    const polygonCoordinates = coordinates[0]; // Assuming it's an array of arrays
                    if (polygonCoordinates && polygonCoordinates.length > 0) {
                        return polygonCoordinates.map((coord: any) => {
                            if (isValidCoordinate(coord)) {
                                return [parseFloat(coord[1]), parseFloat(coord[0])];
                            }
                        }).filter(isValidCoordinate);
                    }
                }
            
                return null;
            }
            
            let validInputs: any[] = [];

            selectedRows.forEach((markerData: any) => {
                if (formData.coordinateField) {
                    let coords = getCoordinatesArray(markerData, formData.coordinateField);
                    
                    if (coords) {
                        const input: MarkerInput = {
                            type: jsonType === 'json'? markerData['geometry.geometry.type'] : 'Point',
                            name: templateString(values.title, markerData),
                            coords,
                            description: DOMPurify.sanitize(templateString(values.description, markerData)),
                            color: formData.color,
                            layerId: formData.layerId,
                            iconId: formData.iconId,
                            author: 'ImportedByTimelab',
                            createdAt: new Date(),
                        };
            
                        validInputs.push(input);
                    }
                }
            });
            

            const { data, errors } = await importMarkers({
                variables: {
                    createMarkerWithCoordsInputs: validInputs,
                }
            })
            
            if (data) {
                setFormData({});
                setModal('');
                refetch();
            }

            setTimeout(() => {
                setSubmitting(false);
            }, 1000);
        }}
        >
        {({ values, handleChange, setFieldValue, isSubmitting, errors, touched }) => (
            <Form className='parameter-card-form' style={{paddingTop: '2rem'}}>
                <div className='card-form-form'>
                    <FormLabel sx={{px: '1rem'}} htmlFor='title'>Enter the desired title for the markers</FormLabel>
                    <ErrorMessage name="title" component="div" className='errorfield' />
                    <TextField
                        name="title"
                        id="title"
                        onFocus={() => {
                            setFocus('title');
                        }}
                        value={values.title}
                        onChange={handleChange}
                        multiline
                        rows={2}
                        sx={{width: '100%', px: '1rem', mt: '1rem', mb: '2rem'}}
                    />
                    <FormLabel sx={{px: '1rem'}} htmlFor='description'>Enter the desired description for the markers</FormLabel>
                    <ErrorMessage name="description" component="div" className='errorfield' />
                    <Tiptap MenuBar={<ImportMenu keys={Object.keys(selectedRows[0])}/>} setInput={(e: string) => values.description = e}/>
                    <div className='form-step-buttons'>
                        <Button
                            variant="outlined"
                            color='warning'
                            type="button"
                            disabled={isSubmitting}
                            onClick={() => {
                                setFormData({...formData, ...values});
                                setFocus('');
                                setModal('import-1');
                            }}
                            sx={{width: '100%', mt: '1rem', mb: '2rem'}}
                        >
                            {'< Previous'}
                        </Button>
                        <Button
                            variant="contained"
                            type="submit"
                            disabled={isSubmitting}
                            sx={{width: '100%', mt: '1rem', mb: '2rem'}}
                        >
                            Import
                        </Button>
                    </div>
                </div>
            </Form>
            )}
        </Formik>
    )
}

export default MarkerImportForm2;