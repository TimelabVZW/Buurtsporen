import { MarkerFormProps, MarkerInput } from "../interfaces";
import * as yup from 'yup';
import { mutationImportMarkers } from "../gql/mutations";
import { useMutation } from "@apollo/client";
import DOMPurify from "dompurify";

import { ErrorMessage, Form, Formik } from "formik";
import { Button, FormLabel, MenuItem, TextField, ImageList, ImageListItem } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ConditionalLoader from "./ConditionalLoader";
import { useState } from "react";
import SquareGreenLogo from '../assets/svg/BS_logo_square_green.svg';
import UserMenu from "./WYSIWYG/UserMenu";
import Tiptap from "./WYSIWYG/Tiptap";

const validationSchema = yup.object({
    layerId: yup.number().required(),
    title: yup.string().required().max(40),
    description: yup.string().required().max(500),
    author: yup.string(),
});

const MarkerForm = ({coordinate, layers, icons, visible, setFormVisible, refetch}: MarkerFormProps) => {
    const [importMarkers] = useMutation(mutationImportMarkers);
    const [iconOpen, setIconOpen] = useState(false);
    const [search, setSearch] = useState<string>('');
    const [activeIcon, setActiveIcon] = useState('');

const filteredLayers = layers?.filter((layer: {name: string, id: number, private: boolean}) => layer.private === false);

return (
    <>
        <div className="flex flex-row map-form-container__header">
            <div className='map-form-container__close'  style={{display: visible? 'block' : 'none'}} onClick={() => setFormVisible('')}>
                <ArrowForwardIosIcon  color='secondary' sx={{
                    visibility: visible? 'visible': 'hidden',
                    width: visible? '2rem': '0',
                }}/>
            </div>
            <div className="small-logo--container" style={{display: visible? 'block' : 'none'}} >
                <img src={SquareGreenLogo} />
            </div>
        </div>
        <div className="map-markerform" style={{display: visible? 'block' : 'none'}}>
            <Formik
            initialValues={{
                layerId: undefined,
                title: '',
                description: '',
                author: '',
                iconId: activeIcon || icons[0]?.id || undefined,
            }}
            validationSchema={validationSchema}
            onSubmit={async (values, { setSubmitting }) => {
                setSubmitting(true);

                let iconId: number | undefined = typeof values.iconId === 'string' ? parseInt(values.iconId) : values.iconId;

                let input: MarkerInput[] = [{
                    type: 'Point',
                    name: values.title,
                    coords: [coordinate],
                    layerId: values.layerId,
                    iconId,
                    createdAt: new Date(),
                }];

                if (values.description) {
                    input[0].description = DOMPurify.sanitize(values.description);
                }

                if (values.author) {
                    input[0].author = values.author;
                }

                await importMarkers({
                    variables: {
                        createMarkerWithCoordsInputs: input,
                    }
                }).then(() => {
                    setFormVisible('');
                    refetch();
                })

                setTimeout(() => {
                    setSubmitting(false);
                }, 1000);
            }}
            >
            {({ values, handleChange, setFieldValue, isSubmitting, errors, touched }) => (
                <Form className='marker-form' style={{paddingTop: '2rem'}}>
                    <FormLabel sx={{px: '1rem'}} htmlFor='layerId'>Aan welke laag wil je een punt toevoegen?<span className="text-red">*</span></FormLabel>
                    <ErrorMessage name="layerId" component="div" className='errorfield' />
                    <TextField
                        variant="outlined"
                        name="layerId"
                        id="layerId"
                        sx={{
                            width: '100%',
                            px: '1rem',
                            mb: '1.8rem'
                        }}
                        select
                        value={values.layerId}
                        onChange={handleChange}
                        >
                            
                        <MenuItem key={-1} value={undefined}>
                            ---
                        </MenuItem>
                        {filteredLayers?.map((layer: {name: string, id: number}) => (
                            <MenuItem key={layer.id} value={layer.id}>
                                {layer.name}
                            </MenuItem>
                        ))}
                    </TextField>
                    <FormLabel sx={{px: '1rem'}} htmlFor='title'>Geef een titel aan het toegevoegde punt <span className="text-red">*</span></FormLabel>
                    <ErrorMessage name="title" component="div" className='errorfield' />
                    <TextField
                        name="title"
                        id="title"
                        value={values.title}
                        defaultValue={values.title}
                        onChange={handleChange}
                        sx={{width: '100%', px: '1rem', mt: '1rem', mb: '1.8rem'}}
                    />
                    <FormLabel sx={{px: '1rem'}} htmlFor='description'>Geef een beschrijving aan het toegevoegde punt <span className="text-red">*</span></FormLabel>
                    <ErrorMessage name="description" component="div" className='errorfield' />
                    <Tiptap MenuBar={<UserMenu/>} setInput={(e: string) => values.description = e}/>
                    <FormLabel sx={{px: '1rem'}} htmlFor='author'>Voeg je naam toe (optioneel)</FormLabel>
                    <ErrorMessage name="author" component="div" className='errorfield' />
                    <TextField
                        name="author"
                        id="author"
                        value={values.author}
                        defaultValue={values.author}
                        onChange={handleChange}
                        sx={{width: '100%', px: '1rem', mt: '1rem', mb: '1.8rem'}}
                    />
                    <div 
                        className="iconSelector" 
                        style={{
                            marginBottom: '2rem'
                        }}
                    >
                        <div 
                            className="flex flex-row iconSelector--title"
                            onClick={() => {
                                setIconOpen(!iconOpen);
                            }}>
                            <FormLabel sx={{px: '1rem'}} htmlFor='iconId'>Kies een passend icoontje</FormLabel>
                            <ArrowForwardIosIcon  
                                color='secondary' 
                                sx={{
                                    width: '2rem',
                                    transform: iconOpen? 'rotate(270deg)': 'rotate(90deg)',
                                    transition: 'transform 0.3s ease-in-out'
                                }}
                            />
                        </div>
                        <ConditionalLoader condition={iconOpen}>
                        <TextField
                            name="search"
                            id="search"
                            placeholder="Search for an icon"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            rows={5}
                            sx={{
                                width: '100%',
                                py: '0',
                                px: '1rem',
                                mt: '1rem',
                                mb: '1rem',
                                transition: 'all 0.3s ease-in-out'
                            }}
                        />
                            <ImageList
                                sx={{
                                    width: '100%',
                                    maxHeight: '24rem',
                                    transform: 'translateZ(0)',
                                    pl: '1rem'
                                }}
                                gap={1}
                                rowHeight={120}
                                cols={4}
                            >
                                {icons.filter((icon: any) => icon.name.includes(search)).map((icon: any) => {
                                    return (
                                    <ImageListItem 
                                        key={icon.id}
                                        cols={1}
                                        rows={1}
                                        sx={{
                                            position: 'relative', 
                                            borderStyle: icon.id === activeIcon? 'solid':'none', 
                                            borderWidth: '2px', 
                                            borderColor: '#4aaa9f'
                                        }}
                                        onClick={() => {
                                            setFieldValue('iconId', icon.id);
                                            setActiveIcon(icon.id);
                                        }}
                                    >
                                        <img
                                        src={`${icon.url}`}
                                        alt={icon.name}
                                        loading="lazy"
                                        style={{width: '80%', height: '5rem', objectFit: 'contain', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', maxWidth: '100%', maxHeight: '100'}}
                                        />
                                    </ImageListItem>
                                    );
                                })}
                            </ImageList>
                        </ConditionalLoader>
                    </div>
                    <Button
                        variant="contained"
                        type="submit"
                        className="marker-form-button"
                        disabled={isSubmitting}
                        sx={{width: 'max-content', mt: '1rem', mb: '1.8rem', ml: 'auto', mr: '1rem'}}
                    >
                        Import
                    </Button>
                </Form>
                )}
            </Formik>
        </div>
        
    </>
);
};

export default MarkerForm;