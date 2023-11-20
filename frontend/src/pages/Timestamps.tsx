import { DashboardMain, Header } from '../components';
import { useAuth } from '../context/authContext';
import { Navigate } from 'react-router-dom';

import '../sass/pages/dashboard.scss'
import { useMutation, useQuery } from '@apollo/client';
import { GET_TIMESTAMPS_DATA } from '../gql/queries';
import { mutationRemoveTimestamp } from '../gql/mutations';
import { Button, Card, Grid } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import CrudDataGrid from '../components/CrudDataGrid';
import DownloadIcon from '@mui/icons-material/Download';

import DeleteIcon from '@mui/icons-material/Delete';

const Timestamps = () => {
    const { authenticated, authLoading, user } = useAuth();
    const { loading, error, data, refetch } = useQuery(GET_TIMESTAMPS_DATA);
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
              return <Button onClick={onClick}><DeleteIcon sx={{ fill: '#FF0000', '&::hover': "#AA0000"}}/></Button>;
            }
        },
        { field: "id", headerName: "ID", width: 150 },
        { field: "description", headerName: "Message", width: 150 },
        { field: "createdAt", headerName: "Created at", width: 250 },
        {
            field: "file",
            headerName: "File",
            sortable: false,
            filterable: false,
            renderCell: (params: any) => {
                if (params.row.fileName) {
                    return <a target='blank' href={`https://api.buurtsporen.be/timestamp/timestamp-file/${params.row.fileName}`}><DownloadIcon sx={{fill: '#0000ff'}}/></a>;
                }
                
              return 'No file';
            }
        },
    ];

    const rows = data.timestamps.map((timestamp: any) => {
        return {
            id: timestamp.id,
            description: timestamp.description,
            createdAt: `${new Date(timestamp.createdAt).toLocaleDateString()}\n ${new Date(timestamp.createdAt).toLocaleTimeString()}`,
            fileName: timestamp.fileName
        }
    });
    
  return (
    <div className='dashboard-container dashboard-container--markers'>
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
                        <CrudDataGrid rows={rows} columns={columns} pageSize={15} pageSizeOptions={[15]}
                        />
                    </Card>
                </Grid>
            </Grid>
        </DashboardMain>
    </div>
  )
}

export default Timestamps;