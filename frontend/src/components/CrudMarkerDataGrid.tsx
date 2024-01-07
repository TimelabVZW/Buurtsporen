import { Button, FormLabel, TextField } from '@mui/material';
import { DataGrid, GridCellParams, getGridNumericOperators, getGridStringOperators } from '@mui/x-data-grid';
import React, { useMemo } from 'react';
import { CrudMarkerDataGridProps } from '../interfaces';
import { mutationRemoveMarker, mutationUpdateMarker } from '../gql/mutations';
import { useMutation, useQuery } from '@apollo/client';
import DeleteIcon from '@mui/icons-material/Delete';
import { GET_PAGINATED_MARKERS } from '../gql/queries';
import debounce from 'lodash.debounce';
import EditIcon from '@mui/icons-material/Edit';
import MassModal from './MassModal';
import { ErrorMessage, Form, Formik } from 'formik';
import * as yup from 'yup';


const validationSchema = yup.object({
  name: yup.string().required().max(40),
  description: yup.string().required().max(500),
});

const CrudMarkerDataGrid = ({ pageSize, pageSizeOptions }: CrudMarkerDataGridProps) => {
  const [activeMarker, setActiveMarker] = React.useState<number>();
  const [modal, setModal] = React.useState('');
  const [updateMarker] = useMutation(mutationUpdateMarker);
  const [removeMarker] = useMutation(mutationRemoveMarker);
  const [page, setPage] = React.useState(1);
  const [gridPage, setGridPage] = React.useState(0);
  const [limit, setLimit] = React.useState(15);
  const [filterModel, setfilterModel] = React.useState({items: []});
  const [sortBy, setSortBy] = React.useState("id");
  const [sortDirection, setSortDirection] = React.useState("ASC");
  const [filter, setFilter] = React.useState({name: '', type: '', author: '', description: ''});
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
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
            setSubmitting(true);
            
            let marker = {
              id : activeMarker,
              name: values.name,
              description: values.description,
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