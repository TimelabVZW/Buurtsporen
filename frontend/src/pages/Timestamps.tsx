import { DashboardMain, Header } from '../components';
import { useAuth } from '../context/authContext';
import { Navigate } from 'react-router-dom';

import '../sass/pages/dashboard.scss'
import { useMutation, useQuery } from '@apollo/client';
import { mutationRemoveTimestamp } from '../gql/mutations';

import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import ViewIcon from '@mui/icons-material/Visibility';
import { Helmet } from 'react-helmet';
import GET_PAGINATED_TIMESTAMPS from '../gql/queries/PaginatedTimestamps';
import { DataGrid } from '@mui/x-data-grid';
import { useState } from 'react';
import debounce from 'lodash.debounce';
import { Card, Grid } from '@mui/material';

const Timestamps = () => {
    // NEEDS OPTIMIZATION USING PAGINATION
    const { authenticated, authLoading, user } = useAuth();
    const [gridPage, setGridPage] = useState(0);
    const [limit, setLimit] = useState(15);
    const [sortBy, setSortBy] = useState("id");
    const [sortDirection, setSortDirection] = useState("ASC");
    const [filterModel, setfilterModel] = useState({items: []});
    const [filter, setFilter] = useState({description: ''});
    const { loading, error, data, refetch } = useQuery(GET_PAGINATED_TIMESTAMPS, {
        variables: {
        query: {
            page: 1,
            limit: limit,
            sortBy: sortBy,
            sortDirection: sortDirection,
            ...filter
        },
        },
    });
    const [removeTimestamp] = useMutation(mutationRemoveTimestamp);

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

    const columns = [
        {
            field: "action",
            headerName: "",
            width: 75,
            cellClassName: 'mui-cell--icon',
            sortable: false,
            filterable: false,
            renderCell: (params: any) => {
              const onClick = (e: any) => {
                removeTimestamp({
                    variables: {
                        id: params.row.id
                    }
                });
                refetch();
              };
              return <DeleteIcon onClick={onClick} sx={{ fill: '#FF0000', '&::hover': "#AA0000"}}/>;
            }
        },
        {
            field: "link",
            headerName: "",
            width: 75,
            cellClassName: 'mui-cell--icon',
            sortable: false,
            filterable: false,
            renderCell: (params: any) => {
              return <a className='datagrid--view' href={`/map?marker=${params.row.markerId}`} target='_blank'><ViewIcon sx={{ fill: '#0000ff'}}/></a>;
            }
        },
        { field: "id", headerName: "ID", width: 150 },
        { field: "description", headerName: "Message", width: 150 },
        { field: "createdAt", headerName: "Created at", width: 250 },
        {
            field: "file",
            headerName: "File",
            width: 75,
            cellClassName: 'mui-cell--icon',
            sortable: false,
            filterable: false,
            renderCell: (params: any) => {
                if (params.row.fileName) {
                    return <a target='blank' href={`${params.row.url}`}><DownloadIcon sx={{fill: '#0000ff'}}/></a>;
                }
                
              return 'No file';
            }
        },
    ];

    const rows = data.paginatedTimestamps.map((timestamp: any) => {
        return {
            id: timestamp.id,
            description: timestamp.description,
            markerId: timestamp.markerId,
            createdAt: `${new Date(timestamp.createdAt).toLocaleDateString()}\n ${new Date(timestamp.createdAt).toLocaleTimeString()}`,
            fileName: timestamp.fileName
        }
    });
    
  return (
    <div className='dashboard-container dashboard-container--markers'>
        <Helmet>
            <title>Buurtsporen - Timestamps</title>
            <meta name='description' content='Timestamp dashboard for the buurtsporen app'/>
            <meta name='robots' content='noindex'/>
            <link rel="canonical" href="/timestamps" />
        </Helmet>
        <Header/>
        <DashboardMain active='timestamps'>
            <Grid container gap={1} style={{padding: '1rem'}}>
                <Grid xs={12}>
                    <Card 
                        sx={{
                            pt: '1rem',
                            pb: '1rem',
                            px: '1rem',
                            minHeight: '25rem',
                            maxWidth: '100%',
                        }}
                    >
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            disableRowSelectionOnClick
                            autoHeight
                            rowHeight={49} 
                            rowCount={data.timestamps.length}
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
                                    paginationModel: { page: 0, pageSize: 15 },
                                },
                            }}
                            pageSizeOptions= {[15]}
                        />
                    </Card>
                </Grid>
            </Grid>
        </DashboardMain>
    </div>
  )
}

export default Timestamps;