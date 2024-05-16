import { DashboardMain, Header, LoadingSmall, TimestampDataGrid } from '../components';
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
                        <TimestampDataGrid/>
                    </Card>
                </Grid>
            </Grid>
        </DashboardMain>
    </div>
  )
}

export default Timestamps;