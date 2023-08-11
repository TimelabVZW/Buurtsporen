import { DashboardMain, Header } from '../components';
import { useAuth } from '../context/authContext';
import { Navigate } from 'react-router-dom';
import MarkerIcon from '@mui/icons-material/Room';
import TimestampIcon from '@mui/icons-material/AccessTimeFilled';
import LayersIcon from '@mui/icons-material/Layers';
import { Button, Grid, Card } from "@mui/material";
import CountUp from 'react-countup';
import { GET_DASHBOARD_DATA } from '../gql/queries';
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

import '../sass/pages/dashboard.scss'
import { useQuery } from '@apollo/client';
import { LineController } from 'chart.js';

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
    // DATES FOR THE CHART
    const dates = [];

    for (let i = 28; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        dates.push(date.toLocaleDateString());
    }

    // DATACOUNTS FOR THE CHART
    const layerCounts = [];
    const markerCounts = [];
    const timestampCounts = [];

    for (const date of dates) {
        const currentDate = new Date(date).getTime();

        const layerCount = data.layers.filter((layer: any) => new Date(layer.createdAt).getTime() < currentDate).length;
        const markerCount = data.markers.filter((marker: any) => new Date(marker.createdAt).getTime() < currentDate).length;
        const timestampCount = data.timestamps.filter((timestamp: any) => new Date(timestamp.createdAt).getTime() < currentDate).length;

        layerCounts.push(layerCount);
        markerCounts.push(markerCount);
        timestampCounts.push(timestampCount);
    }

    // CHART DATA
    const chartData = {
        labels: dates,
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
                    >
                        <div className='graph-container'>
                            <Line data={chartData} options={options} />
                        </div>
                    </Card>
                </Grid>
            </Grid>
        </DashboardMain>
    </div>
  )
}

export default Dashboard;