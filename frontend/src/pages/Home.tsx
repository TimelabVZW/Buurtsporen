import { MapContainer, TileLayer, Popup, Marker } from 'react-leaflet';
import { useState, useEffect } from 'react';
import { Icon } from 'leaflet';
import { Bounds, ConditionalLoader, CustomCheckbox, LoadingMap, MarkerList, MassModal, SVGButton } from '../components';
import { Button as MuiButton } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import { GET_MAPS_DATA } from '../gql/queries';
import { useQuery } from '@apollo/client';
import MarkerForm from '../components/MarkerForm';
import bounds from "../utils/bounds"
import classifyPoint from 'robust-point-in-polygon';
import TimestampList from '../components/TimestampList';
import { layer } from '../interfaces';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { Helmet } from 'react-helmet';

import FilterIcon from '@mui/icons-material/FilterList';
import AddBoxIcon from '@mui/icons-material/AddBox';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import UserIconImage from '../assets/images/user-marker.png';
import RasterLogoImage from '../assets/svg/BS_logo_raster_1.svg';

import "leaflet/dist/leaflet.css";
import { useSearchParams } from 'react-router-dom';

const Home = () => {
  const [location, setLocation] = useState<null | [number, number]>(null);
  const [isLocationSet, setIsLocationSet] = useState(false);
  const [modal, setModal] = useState('');
  const [inBounds, setInBounds] = useState(false);
  const [onlyTimeLab, setOnlyTimeLab] = useState(false);
  const [dates, setDates] = useState<{start: any, end: any}>({ start: new Date(0), end: new Date(Date.now() + 3600000) });
  const [formVisible, setFormVisible] = useState('');
  const [activeMarker, setActiveMarker] = useState<number>();
  const [activeMarkerSet, setActiveMarkerSet] = useState<boolean>(false);
  const [refresh, setRefresh] = useState(new Date());
  const [center, setCenter] = useState<[number, number]>([51.0591448, 3.7418415]);
  const [layers, setLayers] = useState<number[]>([]);
  const [layersSet, setLayersSet] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const { loading, error, data, refetch } = useQuery(GET_MAPS_DATA, {
    variables: {ids: layers, onlyImported: onlyTimeLab},
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      toast.info('Locatie aan het ophalen', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      
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

  useEffect(() => {
    //Layer selection logic
    if (!layersSet && data && data.layersByIds) {
      const layerIds = data.layersByIds.map((layer: layer) => layer.id);
      setLayers(layerIds);
      setLayersSet(true);
    }

    //searchParam logic
    const layerIds = searchParams.get('layers')?.split(',').filter((layer: string) => !isNaN(parseInt(layer))).map((layer: string) => parseInt(layer));
    if (layerIds && layerIds.length > 0) {
      setLayers(layerIds);
    }
    const markerId = searchParams.get('marker') || '';
    if (markerId.length > 0 && !isNaN(parseInt(markerId))) {
      setActiveMarker(parseInt(markerId));
      if (!activeMarkerSet) {
        setFormVisible('timestamp-list');
        setActiveMarkerSet(true);
      }
    }
  }, [data]);

  if (loading) return <LoadingMap/>;

  if (error) {
      return <p>Error...</p>;
  }

  const onRefreshClick = () => {
    setRefresh(new Date());
    if (location) {
      setCenter(location);
    }
  };

  const toggleLayer = (id: number) => {
    let index = layers.indexOf(id);
    let newLayers = layers;
    if (index > -1) {
      newLayers.splice(index, 1);
      setLayers(newLayers)
    } else {
      newLayers.push(id);
      setLayers(newLayers)
    }
  }

  const userIcon = new Icon({
    iconUrl: UserIconImage,
    iconSize: [32, 32]
  })

    return (
    <div className='app-container'>
      <Helmet>
        <title>Buurtsporen - Map</title>
        <meta name='description' content='Bezoek de sporen en belevingen binnen de ... omgeving.' />
        <link rel="canonical" href={`${import.meta.env.VITE_REACT_APP_FRONTEND_URL}/map`}/>
      </Helmet>
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
        <MapContainer center={center} zoom={17} maxZoom={23} scrollWheelZoom={true}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url='https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png'
            maxZoom={23}
          />

          <ConditionalLoader condition={isLocationSet}>
            <Marker icon={userIcon} position={location !== null ? location : [0 , 0]}>
              <Popup>
                Jouw locatie
              </Popup>
            </Marker>
          </ConditionalLoader>
          <Bounds />
          <ConditionalLoader condition={data}>
            <MarkerList
              layers={data.layersByIds}
              setSearchParams={setSearchParams}
              searchParams={searchParams}
              setActiveMarker={setActiveMarker}
              setFormVisible={setFormVisible}
              modal={modal}
            />
          </ConditionalLoader>
        </MapContainer>
          <div className='map-form-container'>
            <MarkerForm refetch={refetch} setFormVisible={setFormVisible} visible={formVisible === 'create-marker'} layers={data.layers} icons={data.icons} coordinate={location? location : [0, 0]}/>
            <ConditionalLoader condition={formVisible === 'timestamp-list'}>
              <TimestampList setFormVisible={setFormVisible} visible={formVisible === 'timestamp-list'} marker={activeMarker? activeMarker : 0} />
            </ConditionalLoader>
          </div>
      </div>

      {/* UI COMPONENTS */}
        <ConditionalLoader condition={modal === '' && formVisible === ''}>
          <div className='title--container'>
            <img className='title' src={RasterLogoImage} alt='Buurtsporen logo'/>
            <div className='title--buttons flex flex-row'>
              <SVGButton
                title='Refresh location'
                onClick={onRefreshClick}
              >
                <MyLocationIcon color='secondary'/>
              </SVGButton>
              <SVGButton
                title='Filter map'
                onClick={() => {
                  setModal('filters');
                }}
              >
                <FilterIcon color='secondary'/>
              </SVGButton>
              <div className='filler-square'>
                <ConditionalLoader condition={inBounds && formVisible === ''}>
                  <SVGButton
                    title='Create marker'
                    onClick={() => {
                      setFormVisible('create-marker');
                    }}
                  >
                    <AddBoxIcon color='secondary'/>
                  </SVGButton>
                </ConditionalLoader>
              </div>
            </div>
          </div>
        </ConditionalLoader>
        <MassModal visible={modal === 'filters'} setVisible={(e : string) => setModal(e)}>
          <div className='filters-container'>
            <h2>Filters</h2>
            <div className='flex filter__options'>
              <div className='flex flex-col filter__layers'>
                {data.layers.map((layer: {id: number, name: string}) => (
                    <CustomCheckbox key={layer.name} initialChecked={layers.indexOf(layer.id) > -1} onClick={() => toggleLayer(layer.id)} name={layer.name} />
                ))}
              </div>
              <div className='flex flex-col filter__second'>
                <div className='flex flex-row second__dates'>
                  <DatePicker 
                    className='filter__datepicker'
                    slotProps={{ textField: { helperText: 'Start datum' } }}
                    value={dates.start? dayjs(dates.start) : dayjs(new Date())}
                    onChange={(value: any) => {
                      let newDates = dates;
                      dates['start'] = value;
                      setDates(newDates)
                    }}
                  />
                  <DatePicker
                    className='filter__datepicker'
                    slotProps={{ textField: { helperText: 'Eind datum' } }}
                    value={dates.end? dayjs(dates.end) : dayjs(new Date())}
                    onChange={(value: any) => {
                      let newDates = dates;
                      dates['end'] = value;
                      setDates(newDates)
                    }}
                  />
                </div>
                <CustomCheckbox className='filter__imported' initialChecked={onlyTimeLab} onClick={() => setOnlyTimeLab(!onlyTimeLab)} name='Toon enkel de data dat door Timelab zijn toegevoegd'/>
              </div>
            </div>
            <MuiButton
              variant='contained'
              color='primary'
              className='card-form-button'
              onClick={() => {
                refetch().then(() => {
                  const markerId = searchParams.get('marker') || '';
                  if (markerId.length > 0) {
                    setSearchParams({ layers: layers.join(','), marker: markerId})
                  } else {
                    setSearchParams({ layers: layers.join(',')})
                  }
                  setModal('');
                })
              }}
              sx={{
                  position: 'absolute',
                  bottom: '1rem',
                  right: '1rem',
              }}
            >
              {'Filter'}
            </MuiButton>
          </div>
        </MassModal>
    </div>
  )
}

export default Home;