import { DashboardMain, Header } from '../components';
import { useAuth } from '../context/authContext';
import { Navigate } from 'react-router-dom';

import '../sass/pages/dashboard.scss'


const Dashboard = () => {

    const { authenticated, authLoading, user } = useAuth();

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
    <div className='dashboard-container'>
        <Header/>
        <DashboardMain active='dashboard'>
            home
        </DashboardMain>
    </div>
  )
}

export default Dashboard;