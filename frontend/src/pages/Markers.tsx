import { CrudMarkerDataGrid, DashboardMain, Header } from '../components';
import { useAuth } from '../context/authContext';
import { Navigate } from 'react-router-dom';

import '../sass/pages/dashboard.scss'
import { Grid, Card } from "@mui/material";
import { Helmet } from 'react-helmet';


const Markers = () => {
    const { authenticated, authLoading } = useAuth();

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
        <Helmet>
            <title>Buurtsporen - Markers</title>
            <meta name='description' content='Marker dashboard for the buurtsporen app'/>
            <meta name='robots' content='noindex'/>
            <link rel="canonical" href="/markers" />
        </Helmet>
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
