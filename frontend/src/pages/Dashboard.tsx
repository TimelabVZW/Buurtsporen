import { useAuth } from '../context/authContext';
import { Navigate } from 'react-router-dom';
import { GET_DASHBOARD_DATA } from '../gql/queries';
import { useQuery } from '@apollo/client';

import '../sass/pages/dashboard.scss'
import { Helmet } from 'react-helmet';
import { DashboardMain, Header, LoadingMap } from '../components';
import MarkerIcon from '@mui/icons-material/Room';
import TimestampIcon from '@mui/icons-material/AccessTimeFilled';
import LayersIcon from '@mui/icons-material/Layers';
import { Button, Grid, Card } from "@mui/material";
import CountUp from 'react-countup';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

import { Line } from 'react-chartjs-2';

import "../sass/components/dashboard.scss";
import "../sass/components/countup.scss";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );


const Dashboard = () => {
    const { authenticated, authLoading, user } = useAuth();
    const { loading, error, data, refetch } = useQuery(GET_DASHBOARD_DATA);

    if (authLoading) return ( <LoadingMap/> );
    
    if (!authenticated) return <Navigate to="/login" replace/>
    
    if (loading) return <LoadingMap/>;

    if (error) {
        return <p>Error...</p>;
    }
    // DATES FOR THE CHART
    const dates = [];

    for (let i = 28; i >= 0; i--) {
        const date = new Date();
        date.setTime(date.getTime() - (i * 24 * 60 * 60 * 1000));
        dates.push(date);
    }

    // DATACOUNTS FOR THE CHART
    const layerCounts = [];
    const markerCounts = [];
    const timestampCounts = [];

    for (const date of dates) {
        const currentDate = new Date(date).getTime();

        const layerCount = data.layers.filter((layer: any) => new Date(layer.createdAt).getTime() < currentDate).length;
        const markerCount = data.markers.filter((marker: any) => new Date(marker.createdAt).getTime() < currentDate).length;
        const timestampCount = data.timestamps.filter((timestamp: any) => new Date(timestamp.createdAt).getTime() < currentDate).length
        

        layerCounts.push(layerCount);
        markerCounts.push(markerCount);
        timestampCounts.push(timestampCount);
    }

    // CHART DATA
    const chartData = {
        labels: dates.map((date: any) => date.toLocaleDateString()),
        datasets: [
            {
                label: 'Layers',
                data: layerCounts,
                fill: false,
                borderColor: '#009dff',
                tension: 0.4,
            },
            {
                label: 'Markers',
                data: markerCounts,
                fill: false,
                borderColor: '#00A36C',
                tension: 0.4,
            },
            {
                label: 'Timestamps',
                data: timestampCounts,
                fill: false,
                borderColor: '#ffd300',
                tension: 0.4,
            },
        ],
    };

    // CHART OPTIONS
    const options = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top' as const,
          },
          title: {
            display: true,
            text: 'Amount of entries each day',
          },
        },
      };

    
  return (
    <div className='dashboard-container'>
        <Helmet>
            <title>Buurtsporen - Dashboard</title>
            <meta name='description' content='Dashboard for the buurtsporen app'/>
            <meta name='robots' content='noindex'/>
            <link rel="canonical" href="/dashboard" />
        </Helmet>
        <Header/>
        <DashboardMain active='dashboard'>
            <Grid container gap={1} style={{padding: '1rem'}}>
                <Grid xs={3.95}>
                    <Card 
                        sx={{
                            pt: '4.5rem',
                            pb: '1rem'
                        }}
                    >
                        <div className='countup-container'>
                            <CountUp end={data.layers.length} duration={3} className='countup-number'/>
                            <div className='flex countup-suffix'>
                                <p className='countup-string'>Layers</p>
                                <LayersIcon 
                                    className='countup-icon'
                                    sx={{
                                        width: '3rem',
                                        height: '3rem',
                                        marginLeft: '0.1rem',
                                    }}
                                />
                            </div>
                        </div>
                        <Button 
                            href='/layers'
                            sx={{
                                display: 'flex',
                                justifyContent: 'end',
                                margin: '2.5rem 1rem 0 auto',
                                width: 'max-content'
                            }}
                        >
                            Go to Layers
                        </Button>
                    </Card>
                </Grid>
                <Grid xs={3.95}>
                    <Card 
                        sx={{
                            pt: '4.5rem',
                            pb: '1rem'
                        }}
                    >
                        <div className='countup-container'>
                            <CountUp end={data.markers.length} duration={3} className='countup-number'/>
                            <div className='flex countup-suffix'>
                                <p className='countup-string'>Markers</p>
                                <MarkerIcon 
                                    className='countup-icon'
                                    sx={{
                                        width: '3rem',
                                        height: '3rem',
                                        marginLeft: '0.1rem',
                                    }}
                                />
                            </div>
                        </div>
                        <Button 
                            href='/markers'
                            sx={{
                                display: 'flex',
                                justifyContent: 'end',
                                margin: '2.5rem 1rem 0 auto',
                                width: 'max-content'
                            }}
                        
                        >
                            Go to markers
                        </Button>
                    </Card>
                </Grid>
                <Grid xs={3.95}>
                    <Card 
                        sx={{
                            pt: '4.5rem',
                            pb: '1rem',
                        }}
                    >
                        <div className='countup-container'>
                            <CountUp end={data.timestamps.length} duration={3} className='countup-number'/>
                            <div className='flex countup-suffix'>
                                <p className='countup-string'>Timestamps</p>
                                <TimestampIcon 
                                    className='countup-icon'
                                    sx={{
                                        width: '3rem',
                                        height: '3rem',
                                        marginLeft: '0.1rem',
                                    }}
                                />
                            </div>
                        </div>
                        <Button 
                            href='/timestamps'
                            sx={{
                                display: 'flex',
                                justifyContent: 'end',
                                margin: '2.5rem 1rem 0 auto',
                                width: 'max-content'
                            }}
                        
                        >
                            Go to Timestamps
                        </Button>
                    </Card>
                </Grid>
                <Grid xs={11.97}>
                    <Card 
                        sx={{
                            maxHeight: '40rem',
                        }}
                    >
                        <div className='graph-container'>
                            <Line data={chartData} options={options} style={{maxHeight: '40rem'}}/>
                        </div>
                    </Card>
                </Grid>
            </Grid>
        </DashboardMain>
    </div>
  )
}

export default Dashboard;