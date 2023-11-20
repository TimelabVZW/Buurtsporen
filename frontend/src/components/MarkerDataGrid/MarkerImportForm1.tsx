import React from 'react'
import { Icon, MarkerImportFormProps } from '../../interfaces'
import { ErrorMessage, Form, Formik } from 'formik'
import * as yup from 'yup';
import { Button, FormLabel, MenuItem, StepButton, TextField } from '@mui/material';
import { useMutation, useQuery } from '@apollo/client';
import { mutationImportMarkers } from '../../gql/mutations';
import { GET_ICONS_PAGE } from '../../gql/queries';
import { ColorBox } from "material-ui-color";

const validationSchema = yup.object({
    layerId: yup.number().required(),
    coordinateField: yup.string().required(),
    iconId: yup.number().required(),
    color: yup.number().required(),
});

const MarkerImportForm1 = ({selectedRows, layers, setModal, formData, setFormData}: MarkerImportFormProps) => {
    const [importMarkers] = useMutation(mutationImportMarkers);
    const [colorValue, setColorValue] = React.useState<number>(0);

    const { loading, error, data, refetch } = useQuery(GET_ICONS_PAGE);

    if (loading) return <p>Loading...</p>;
    
    if (error) {
        return <p>Error...</p>;
    }
    
    let icons = data.icons;

    let rowKeys: string[] = Object.keys(selectedRows[0]);

    return (
        <Formik
        initialValues={{
            layerId: formData.layerId || null,
            iconId: formData.iconId || null,
            coordinateField: formData.coordinateField || '',
            color: formData.color ? parseInt(formData.color.substring(1), 16) : 0,
        }}
        validationSchema={validationSchema}
        validate={(values) => {
            const errors: Record<string, string> = {};
            if (values.coordinateField) {
                if (typeof selectedRows[0][values.coordinateField][0] !== 'number' && typeof selectedRows[0][values.coordinateField][0][0] !== 'number' && typeof selectedRows[0][values.coordinateField][0][0][0] !== 'number') {
                    errors.coordinateField = 'The coordinates field must contain a number';
                }
            }

            return errors;
        }}
        onSubmit={async (values, { setSubmitting }) => {
            setSubmitting(true);

            let {color, ...newValues} = values;
            let newColor = '#' + values.color.toString(16);

            setFormData({...formData, ...newValues, color: newColor});
            
            setModal('import-2');

            setTimeout(() => {
                setSubmitting(false);
            }, 1000);
        }}
        >
        {({ values, handleChange, setFieldValue, isSubmitting, errors, touched }) => (
            <Form className='card-form' style={{paddingTop: '2rem'}}>
                <FormLabel sx={{px: '1rem'}} htmlFor='layerId'>Choose the layer you want to import to</FormLabel>
                <ErrorMessage name="layerId" component="div" className='errorfield'/>
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
                    {layers?.map((layer: {name: string, id: number}) => (
                        <MenuItem key={layer.id} value={layer.id}>
                            {layer.name}
                        </MenuItem>
                    ))}
                </TextField>
                <FormLabel sx={{px: '1rem'}} htmlFor='coordinateField'>Choose what field represents the coordinates</FormLabel>
                <ErrorMessage name="coordinateField" component="div" className='errorfield'/>
                <TextField
                variant="outlined"
                name="coordinateField"
                id="coordinateField"
                sx={{
                    width: '100%',
                    px: '1rem'
                }}
                select
                value={values.coordinateField}
                onChange={handleChange}
                >
                <MenuItem key={-1} value={undefined}>
                    ---
                </MenuItem>
                {rowKeys?.map((rowKey, key) => (
                    <MenuItem key={key} value={rowKey}>
                        {rowKey}
                    </MenuItem>
                ))}
                </TextField>
                <FormLabel sx={{px: '1rem'}} htmlFor='iconId'>Choose an icon that fits the marker</FormLabel>
                <ErrorMessage name="iconId" component="div" className='errorfield'/>
                <TextField
                variant="outlined"
                name="iconId"
                id="iconId"
                sx={{
                    width: '100%',
                    px: '1rem'
                }}
                select
                value={values.iconId}
                onChange={handleChange}
                >
                <MenuItem key={-1} value={undefined}>
                    ---
                </MenuItem>
                {icons?.map((icon: Icon) => (
                    <MenuItem key={icon.id} value={icon.id}>
                        {icon.name}
                    </MenuItem>
                ))}
                </TextField>
                <FormLabel sx={{px: '1rem'}} htmlFor='color'>Choose a color that fits the marker</FormLabel>
                <ErrorMessage name="color" component="p" className='errorfield' />
                <ColorBox
                    value={colorValue}
                    onChange={(arg) => {
                        values.color = arg.value;
                        setColorValue(arg.value);
                    }}
                />
                <Button
                    variant='contained'
                    className='card-form-button'
                    type='submit'
                    sx={{
                        display: 'flex',
                        justifyContent: 'end',
                        margin: '1rem 1rem 0 auto',
                        width: 'max-content'
                    }}
                >
                    {'Next >'}
                </Button>
            </Form>
            )}
        </Formik>
    )
}

export default MarkerImportForm1;