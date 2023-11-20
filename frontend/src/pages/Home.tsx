import { MapContainer, TileLayer, Popup, Marker, useMapEvent, useMap } from 'react-leaflet';
import { useState, useEffect, useRef, useMemo } from 'react';
import { Icon, LatLng, latLng } from 'leaflet';
import { Bounds, Button, ConditionalLoader, CustomCheckbox, MassModal, TimestampForm } from '../components';
import { toast, ToastContainer } from 'react-toastify';
import { GET_MAPS_DATA } from '../gql/queries';
import { useQuery } from '@apollo/client';
import MarkerForm from '../components/MarkerForm';
import bounds from "../utils/bounds"
import classifyPoint from 'robust-point-in-polygon';
import TimestampList from '../components/TimestampList';
import { MarkerInterface, layer } from '../interfaces';
import MapElement from '../components/MapElement';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

import FilterIcon from '@mui/icons-material/FilterList';
import AddBoxIcon from '@mui/icons-material/AddBox';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import UserIconImage from '../assets/images/user-marker.png';
import LogoImage from '../assets/images/logo.png';

import "leaflet/dist/leaflet.css";


const Home = () => {
  const [location, setLocation] = useState<null | [number, number]>(null);
  const [isLocationSet, setIsLocationSet] = useState(false);
  const [modal, setModal] = useState('');
  const [inBounds, setInBounds] = useState(false);
  const [onlyTimeLab, setOnlyTimeLab] = useState(false);
  const [layers, setLayers] = useState<string[]>([]);
  const [dates, setDates] = useState<{start: any, end: any}>({ start: new Date(0), end: new Date() });
  const [formVisible, setFormVisible] = useState('');
  const [activeMarker, setActiveMarker] = useState<number>();
  const [refresh, setRefresh] = useState(new Date());
  const [center, setCenter] = useState<[number, number]>([51.0591448, 3.7418415]);
  const { loading, error, data, refetch } = useQuery(GET_MAPS_DATA);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      toast.info('Fetching your location', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      console.log('test');
      
      const crds = position.coords;
      if (location?.[0] !== crds.latitude && location?.[1] !== crds.longitude) {
        let tempLoc: [number, number] = [crds.latitude, crds.longitude];
        setLocation(tempLoc);
        setIsLocationSet(true);
        if (classifyPoint(bounds, [crds.latitude, crds.longitude]) === 1) {
          setInBounds(false)
        } else {
          setInBounds(true)
        }
      }
    }, (err) => {
      console.warn(`ERROR(${err.code}): ${err.message}`);
    }
    , {
      enableHighAccuracy: true,
    });
  }, [refresh]);

  if (loading) return <p>Loading...</p>;

  if (error) {
      return <p>Error...</p>;
  }
  
  const onRefreshClick = () => {
    setRefresh(new Date());
    if (location) {
      setCenter(location);
    }
  };

  const toggleLayer = (name: string) => {
    let index = layers.indexOf(name);
    let newLayers = layers;
    if (index > -1) {
      newLayers.splice(index, 1);
      setLayers(newLayers)
    } else {
      newLayers.push(name);
      setLayers(newLayers)
    }
  }

  const filterMarkers = (markers: MarkerInterface[]) => {
    let filteredMarkers = markers;
    
    if (dates.start) {
      filteredMarkers = filteredMarkers.filter((marker: MarkerInterface) => new Date(marker.createdAt) >= new Date(dates.start))
      
    }
    if (dates.end) {
      filteredMarkers = filteredMarkers.filter((marker: MarkerInterface) => new Date(marker.createdAt) <= new Date(dates.end))
    }
    if (onlyTimeLab === true) {
      filteredMarkers = filteredMarkers.filter((marker: MarkerInterface) => marker.author === 'ImportedByTimelab')
    }
    return filteredMarkers;
  }

  const userIcon = new Icon({
    iconUrl: UserIconImage,
    iconSize: [32, 32]
  })

    return (
    <div className='app-container'>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <div className={formVisible !== ''? 'app-container-map--small': 'app-container-map'}>
        <MapContainer center={center} zoom={18} maxZoom={23} scrollWheelZoom={true}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={23}
          />

          <ConditionalLoader condition={isLocationSet}>
            <Marker icon={userIcon} position={location !== null ? location : [0 , 0]}>
              <Popup>
                Jouw locatie
              </Popup>
            </Marker>
          </ConditionalLoader>
          
          <ConditionalLoader condition={data}>
              {data.layers?.filter((layer: {name: string}) => layers.indexOf(layer.name) > -1).map((layer: layer) => {
              return (filterMarkers(layer.markers).map((marker: MarkerInterface) => (
                <MapElement 
                  marker={marker}
                  onClick={() => {
                    setActiveMarker(marker.id)
                    setFormVisible('timestamp-list')
                  }} 
                  disabled={modal !== ''}
                />
              )))})}
          </ConditionalLoader>
          <Bounds />
        </MapContainer>
          <div className='map-form-container'>
            <MarkerForm refetch={refetch} setFormVisible={setFormVisible} visible={formVisible === 'create-marker'} layers={data.layers} icons={data.icons} coordinate={location? location : [0, 0]}/>
            <ConditionalLoader condition={formVisible === 'timestamp-list'}>
              <TimestampList setFormVisible={setFormVisible} visible={formVisible === 'timestamp-list'} marker={activeMarker? activeMarker : 0} coordinate={location? location : [0, 0]}/>
            </ConditionalLoader>
          </div>
      </div>

      {/* UI COMPONENTS */}
        <ConditionalLoader condition={modal === '' && formVisible === ''}>
          <img className='title' src={LogoImage}/>
        </ConditionalLoader>
        <ConditionalLoader className='button-container button-container--bottom-left' condition={formVisible === ''}>
          <Button className='button button--filters' disabled={modal !== ''} type='button' onClick={() => setModal('filters')}>
            <FilterIcon color='secondary'/>
          </Button>
          <Button className='button button--refresh' disabled={modal !== ''} type='button' onClick={onRefreshClick}>
            <MyLocationIcon color='secondary'/>
          </Button>
        </ConditionalLoader>
        <MassModal visible={modal === 'filters'} setVisible={(e : string) => setModal(e)}>
          <div className='filters-container'>
            <h2>Filters</h2>
            <div className='flex filter__options'>
              <div className='flex flex-col filter__layers'>
                {data.layers.map((layer: {id: number, name: string}) => (
                    <CustomCheckbox key={layer.name} initialChecked={layers.indexOf(layer.name) > -1} onClick={() => toggleLayer(layer.name)} name={layer.name} />
                ))}
              </div>
              <div className='flex flex-col filter__second'>
                <DatePicker 
                  className='filter__datepicker'
                  slotProps={{ textField: { helperText: 'Start Date' } }}
                  value={dates.start? dayjs(dates.start) : dayjs(new Date())}
                  onChange={(value: any) => {
                    let newDates = dates;
                    dates['start'] = value;
                    setDates(newDates)
                  }}/>
                <DatePicker
                  className='filter__datepicker'
                  slotProps={{ textField: { helperText: 'End Date' } }}
                  value={dates.end? dayjs(dates.end) : dayjs(new Date())}
                  onChange={(value: any) => {
                    let newDates = dates;
                    dates['end'] = value;
                    setDates(newDates)
                  }}/>
                <CustomCheckbox className='filter__imported' initialChecked={onlyTimeLab} onClick={() => setOnlyTimeLab(!onlyTimeLab)} name='Only show data imported by TimeLab'/>
              </div>
            </div>
          </div>
        </MassModal>
      <ConditionalLoader condition={!inBounds && formVisible === ''}>
        <Button className='button button--form' disabled={modal !== ''} type='button' onClick={() => setFormVisible('create-marker')}>
          <AddBoxIcon color='secondary'/>
        </Button>
      </ConditionalLoader>
    </div>
  )
}

export default Home;