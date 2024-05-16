import ReactDOM from 'react-dom/client'
import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { AuthProvider } from './context/authContext';
import { ThemeProvider } from '@mui/material/styles';
import './sass/main.scss';
import 'react-toastify/dist/ReactToastify.css';
import theme from './utils/theme';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Icons from './pages/Icons';
import Test from './pages/Test';

// Lazy load pages
const App = React.lazy(() => import('./App'));
const LandingPage = React.lazy(() => import('./pages/LandingPage'));
const Home = React.lazy(() => import('./pages/Home'));
const Login = React.lazy(() => import('./pages/Login'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Layers = React.lazy(() => import('./pages/Layers'));
const Markers = React.lazy(() => import('./pages/Markers'));
const ImportExport = React.lazy(() => import('./pages/ImportExport'));
const Timestamps = React.lazy(() => import('./pages/Timestamps'));

const client = new ApolloClient({
  uri: import.meta.env.VITE_REACT_APP_BACKEND_URL+'/graphql',
  cache: new InMemoryCache(),
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ApolloProvider client={client}>
    <AuthProvider>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>
                <Route element={<App />}>
                  <Route path='/' element={<LandingPage/>} />
                  <Route path="/map" element={<Home />} />
                  <Route path='/login' element={<Login/>} />
                  <Route path='/dashboard' element={<Dashboard/>} />
                  <Route path='/layers' element={<Layers/>} />
                  <Route path='/markers' element={<Markers/>} />
                  <Route path='/import-export' element={<ImportExport/>} />
                  <Route path='/timestamps' element={<Timestamps/>} />
                  <Route path='/icons' element={<Icons/>} />
                  <Route path='/test' element={<Test/>} />
                </Route>
              </Routes>
            </Suspense>
          </BrowserRouter>
        </ThemeProvider>
      </LocalizationProvider>
    </AuthProvider>
  </ApolloProvider>
);