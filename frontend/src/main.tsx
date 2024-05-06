import ReactDOM from 'react-dom/client'
import {
  BrowserRouter,
  Routes,
  Route } from 'react-router-dom'
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import App from './App'
import { Dashboard, Home, ImportExport, LandingPage, Layers, Login, Markers, Timestamps } from './pages';
import { AuthProvider } from './context/authContext';
import { ThemeProvider } from '@mui/material/styles';

import './sass/main.scss'
import 'react-toastify/dist/ReactToastify.css';
import theme from './utils/theme';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import Icons from './pages/Icons';
import Test from './pages/Test';
import Sitemap from '../sitemap.txt';
import Robots from '../robots.txt';

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
                <Route path='/robots.txt' element={Robots} />
                <Route path='/sitemap.txt' element={Sitemap} />
                <Route path='*' element={<Home/>} />
              </Route>
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </LocalizationProvider>
    </AuthProvider>
  </ApolloProvider>
);
