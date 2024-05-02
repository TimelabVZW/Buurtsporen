import { ErrorMessage, FieldArray, Form, Formik } from "formik";
import { MarkerFormProps, MarkerInput, TimestampFormInput, TimestampFormProps } from "../interfaces";
import { Button, FormLabel, Input, MenuItem, TextField  } from '@mui/material';
import * as yup from 'yup';
import { mutationCreateTimestamp, mutationImportMarkers } from "../gql/mutations";
import { useMutation } from "@apollo/client";
import Tiptap from "./WYSIWYG/Tiptap";
import UserMenu from "./WYSIWYG/UserMenu";
import DOMPurify from "dompurify";

const validationSchema = yup.object({
    description: yup.string().max(1000).required(),
    author: yup.string(),
});

const TimestampForm = ({marker, visible, setFormVisible, refetch}: TimestampFormProps) => {
    const [createTimestamp] = useMutation(mutationCreateTimestamp);
    const backendURL = import.meta.env.VITE_REACT_APP_BACKEND_URL;

return (
    <div className="map-markerform" style={{display: visible? 'block' : 'none'}}>
        <Formik
        initialValues={{
            description: '',
            author: '',
            files: [''],
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
            setSubmitting(true);

            let input: TimestampFormInput = {
                description: DOMPurify.sanitize(values.description),
                markerId: marker,
            }

            if (values.author) {
                input['author'] = values.author;
            }

            if (values.files) {
                let data = new FormData;
                values.files.forEach((file, index) => {
                    data.append(`file${index}`, file)
                });
            
                await fetch( backendURL + '/timestamp/upload', {
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
            

            const { data } = await createTimestamp({
                variables: input
            })

            if (data) {
                refetch();
                setFormVisible(false);
            }

            setTimeout(() => {
                setSubmitting(false);
            }, 1000);
        }}
        >
        {({ values, handleChange, setFieldValue, isSubmitting, errors, touched }) => (
            <Form className='marker-form' style={{paddingTop: '2rem'}}>
                <FormLabel sx={{px: '1rem'}} htmlFor='description'>Enter your message</FormLabel>
                <ErrorMessage name="description" component="div" className='errorfield' />
                <Tiptap MenuBar={<UserMenu/>} setInput={(e: string) => values.description = e}/>
                <FormLabel sx={{px: '1rem'}} htmlFor='author'>Enter your name</FormLabel>
                <ErrorMessage name="author" component="div" className='errorfield' />
                <TextField
                    name="author"
                    id="author"
                    value={values.author}
                    onChange={handleChange}
                    sx={{width: '100%', px: '1rem', mt: '1rem', mb: '2rem'}}
                />
                <FormLabel sx={{px: '1rem'}} htmlFor='files'>Upload an attachment</FormLabel>
                <ErrorMessage name="files" component="div" className='errorfield' />
                <div className="input-field">
                    <input name='files' type="file" onChange={((event) => setFieldValue(`files.${0}`, event.target.files?.[0]))} />
                </div>
                <Button
                    variant="contained"
                    type="submit"
                    className="marker-form-button"
                    disabled={isSubmitting}
                    sx={{width: 'max-content', px: '1rem', mt: '1rem', mb: '2rem', ml: 'auto', mr: '1rem'}}
                >
                    Import
                </Button>
            </Form>
            )}
        </Formik>
    </div>
);
};

export default TimestampForm;