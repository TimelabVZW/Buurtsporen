import { CrudDataGrid, CrudMarkerDataGrid, DashboardMain, Header } from '../components';
import { useAuth } from '../context/authContext';
import { Navigate } from 'react-router-dom';

import '../sass/pages/dashboard.scss'
import { GET_PAGINATED_MARKERS } from '../gql/queries';
import { useMutation, useQuery } from '@apollo/client';
import { mutationRemoveMarker } from '../gql/mutations';
import { Button, Grid, Card } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';


const Markers = () => {
    const { authenticated, authLoading, user } = useAuth();
    // needs optimizement using pagination (fetchMore, offset, limit)
    const [removeMarker] = useMutation(mutationRemoveMarker);

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
    
  return (
    <div className='dashboard-container dashboard-container--markers'>
        <Header/>
        <DashboardMain active='markers'>
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
                        <CrudMarkerDataGrid pageSize={15} pageSizeOptions={[15]}/>
                    </Card>
                </Grid>
            </Grid>
        </DashboardMain>
    </div>
  )
}

export default Markers;
