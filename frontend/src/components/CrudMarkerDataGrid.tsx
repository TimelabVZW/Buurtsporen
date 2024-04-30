import { Button, FormLabel, TextField, ImageList, ImageListItem } from '@mui/material';
import { DataGrid, GridCellParams, getGridNumericOperators, getGridStringOperators } from '@mui/x-data-grid';
import React, { useMemo, useState } from 'react';
import { CrudMarkerDataGridProps } from '../interfaces';
import { mutationRemoveMarker, mutationUpdateMarker } from '../gql/mutations';
import { useMutation, useQuery } from '@apollo/client';
import DeleteIcon from '@mui/icons-material/Delete';
import { GET_PAGINATED_MARKERS } from '../gql/queries';
import debounce from 'lodash.debounce';
import EditIcon from '@mui/icons-material/Edit';
import MassModal from './MassModal';
import ConditionalLoader from "./ConditionalLoader";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { ErrorMessage, Form, Formik } from 'formik';
import * as yup from 'yup';

const validationSchema = yup.object({
  name: yup.string().required().max(40),
  description: yup.string().required().max(500),
});

const CrudMarkerDataGrid = ({ pageSize, pageSizeOptions }: CrudMarkerDataGridProps) => {
  const [activeMarker, setActiveMarker] = React.useState<number>();
  const [iconOpen, setIconOpen] = useState(false);
  const [search, setSearch] = useState<string>('');
  const [modal, setModal] = useState('');
  const [activeIcon, setActiveIcon] = useState('');
  const [updateMarker] = useMutation(mutationUpdateMarker);
  const [removeMarker] = useMutation(mutationRemoveMarker);
  const [page, setPage] = useState(1);
  const [gridPage, setGridPage] = useState(0);
  const [limit, setLimit] = useState(15);
  const [filterModel, setfilterModel] = useState({items: []});
  const [sortBy, setSortBy] = useState("id");
  const [sortDirection, setSortDirection] = useState("ASC");
  const [filter, setFilter] = useState({name: '', type: '', author: '', description: ''});
  const { loading, error, data, refetch } = useQuery(GET_PAGINATED_MARKERS, {
    variables: {
      query: {
        page: page,      // Set the initial page number
        limit: limit,    // Set the page size (number of items per page)
        sortBy: sortBy, // Set the default sorting field
        sortDirection: sortDirection, // Set the default sorting direction
        ...filter
      },
    },
  });

  useMemo(() => {
    refetch();
  }, [page, limit, sortBy, sortDirection, filter]);
  
  if (loading) return <div>Loading...</div>;

  if (error) return <div>Error! {error.message}</div>;
  
  let icons = data.icons;

  const idFilterOperator = getGridStringOperators().filter(
    (operator) => {
      
      return operator.value === 'equals'
    },
  );

  const containsFilterOperator = getGridStringOperators().filter(
    (operator) => operator.value === 'contains',
  );

  const columns = [
    {
      field: "action",
      headerName: "",
      sortable: false,
      filterable: false,
      renderCell: (params: any) => {
        const onClick = (e: any) => {
          removeMarker({
              variables: {
                  id: params.row.id
              }
          });
          refetch();
        };
        return <Button onClick={onClick}><DeleteIcon sx={{ fill: '#FF0000', '&::hover': "#AA0000"}}/></Button>;
      }
    },
    {
      field: "edit",
      headerName: "",
      sortable: false,
      filterable: false,
      renderCell: (params: any) => {
        const onClick = (e: any) => {
          setActiveMarker(params.row.id);
          setActiveIcon(data.paginatedMarkers.find((marker: any) => marker.id === params.row.id)?.icon.id)
          setModal('edit');
        };
        return <Button onClick={onClick}><EditIcon sx={{ fill: '#4aa3df', '&::hover': "#2980b9"}}/></Button>;
      }
    },
    { field: "id", headerName: "ID", width: 150, filterable: true, filterOperators: idFilterOperator },
    { field: "name", headerName: "Name", width: 150, filterable: true, filterOperators: containsFilterOperator },
    { field: "type", headerName: "Type", width: 150, filterable: true, filterOperators: containsFilterOperator },
    { field: "createdAt", headerName: "Created at", filterable: false, width: 250 },
    { field: "layer", sortable: false, filterable: false, headerName: "Layer", width: 150 },
    { field: "timestamps", headerName: "Timestamps", sortable: false, filterable: false, width: 150 },
  ];

  const rows = data.paginatedMarkers.map((marker: any) => ({
      id: marker.id,
      name: marker.name,
      type: marker.type,
      layer: marker.layer.name,
      createdAt: `${new Date(marker.createdAt).toLocaleDateString()}\n ${new Date(
        marker.createdAt
      ).toLocaleTimeString()}`,
      timestamps: marker.timestamps ? marker.timestamps.length : 0,
    }));

  return (
    <>
      <DataGrid
          rows={rows}
          columns={columns}
          disableRowSelectionOnClick
          autoHeight
          rowHeight={49} 
          rowCount={data.markers.length}
          paginationModel={
            {
              page: gridPage,
              pageSize: 15,
            }
          }
          
          onPaginationModelChange={(params, grid) => {
            if (params.page > gridPage && limit / params.pageSize <= params.page) {
              setLimit(limit + params.pageSize);
            }
            setGridPage(params.page);
          }}
          sortModel={[{ field: sortBy, sort: sortDirection.toLowerCase() as 'asc' | 'desc' }]}
          onSortModelChange={(params) => {
            setSortBy(params[0].field);
            if (params[0].sort) {
              setSortDirection(params[0].sort.toUpperCase());
            }
          }}
          filterModel={filterModel}
          onFilterModelChange={debounce((params) => {
            setfilterModel(params);
            let newFilter: any = {name: '', type: '', author: '', description: ''};
            params.items.forEach((item: any) => {
              newFilter[item.field] = item.value;
            });
            setFilter(newFilter);
          }, 2000)}
          sx={{
            width: '100%',
            height: '20rem',
          }}
          initialState={{
            pagination: {
                paginationModel: { page: 0, pageSize: pageSize },
            },
          }}
          pageSizeOptions= {pageSizeOptions}
      />
      <MassModal
          visible={modal === 'edit'}
          setVisible={setModal}
      >
        <Formik
        initialValues={{
          name: data.paginatedMarkers.find((marker: any) => marker.id === activeMarker)?.name || '',
          description: data.paginatedMarkers.find((marker: any) => marker.id === activeMarker)?.description || '',          
          iconId: data.paginatedMarkers.find((marker: any) => marker.id === activeMarker)?.icon.id || undefined,
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
            setSubmitting(true);
            
            let marker = {
              id : activeMarker,
              name: values.name,
              description: values.description,
              iconId: values.iconId
            }

            const { data } = await updateMarker({
              variables: marker
          })

          if (data) {
              setModal('');
              refetch();
          }

            setTimeout(() => {
                setSubmitting(false);
            }, 1000);
        }}
        >
        {({ values, handleChange, setFieldValue, isSubmitting, errors, touched }) => (
            <Form className='card-form' style={{paddingTop: '2rem', minWidth: '32rem'}}>
                <FormLabel sx={{px: '1rem'}} htmlFor='name'>Name</FormLabel>
                <ErrorMessage name="name" component="div" className='errorfield' />
                <TextField
                    name="name"
                    id="name"
                    value={values.name}
                    onChange={handleChange}
                    rows={5}
                    sx={{width: '100%', py: '0', px: '1rem', mt: '1rem'}}
                />
                <FormLabel sx={{px: '1rem'}} htmlFor='description'>Description</FormLabel>
                <ErrorMessage name="description" component="div" className='errorfield' />
                <TextField
                    name="description"
                    id="description"
                    value={values.description}
                    onChange={handleChange}
                    multiline
                    rows={5}
                    sx={{width: '100%', py: '0', px: '1rem', mt: '1rem'}}
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
                  {'Edit'}
                </Button>
            </Form>
            )}
        </Formik>
      </MassModal>
    </>
  );
};

export default CrudMarkerDataGrid;