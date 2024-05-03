import { useQuery } from "@apollo/client";
import { TimestampListProps } from "../interfaces";
import { GET_MARKER_DETAIL } from "../gql/queries";
import ConditionalLoader from "./ConditionalLoader";
import Button from "./Button";

import AddBoxIcon from '@mui/icons-material/AddBox';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useEffect, useState } from "react";
import TimestampForm from "./TimestampForm";
import SquareGreenLogo from '../assets/svg/BS_logo_square_green.svg';

const TimestampList = ({marker, visible, setFormVisible}: TimestampListProps) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [form, setForm] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setIsLoaded(true);
        }, 1000);
    }
    , []);

    const { loading, error, data, refetch } = useQuery(GET_MARKER_DETAIL, {
        variables: {
            id: marker,
        }
    });

    if (loading) return <p>Loading...</p>;

    if (error) {
        return <p>Error...</p>;
    }
    
    const isImageFile = (filename: string) => {
        // Extract the file extension
        const fileExtension = filename.split('.').pop();
      
        // List of common image file extensions
        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'];
      
        // Check if the extracted extension is in the list of image extensions
        if (fileExtension === undefined) {
            return false;
        }
        return imageExtensions.includes(fileExtension.toLowerCase());
      }

      const isAudioFile = (filename: string) => {
        const fileExtension = filename.split('.').pop();
        const audioExtensions = ['mp3', 'wav', 'ogg', 'aac', 'flac'];
        if (fileExtension === undefined) {
            return false;
        }
        return audioExtensions.includes(fileExtension.toLowerCase());
      }

      const isVideoFile = (filename: string) => {
        const fileExtension = filename.split('.').pop();
        const videoExtensions = ['mp4', 'avi', 'mkv', 'mov', 'wmv'];
        if (fileExtension === undefined) {
            return false;
        }
        return videoExtensions.includes(fileExtension.toLowerCase());
      }
    
return (
    <div style={{display: visible? 'block' : 'none'}}>
        
        <div className="flex flex-row map-form-container__header">
            <div className='map-form-container__close' onClick={() => {
                if (!form) {
                    setFormVisible('')
                } else {
                    setForm(false)
                }}
                }>
                <ArrowForwardIosIcon  color='secondary' sx={{
                visibility: visible? 'visible': 'hidden',
                width: visible? '2rem': '0',
                }}/>
            </div>
            <div className="small-logo--container" style={{display: visible? 'block' : 'none'}} >
                <img src={SquareGreenLogo} />
            </div>
        </div>
        <ConditionalLoader condition={!form}>
            <div className="map-timestamp-list" style={{display: visible? 'block' : 'none'}}>
                <div className='marker-info__header'>
                    <h2>{data.marker.name}</h2>
                    <div className="header-date__container flex">
                        <p className="info-header__date info-header__date--title">Toegevoegd op:</p>
                        <p className="info-header__date">
                            {new Date(data.marker.createdAt).toLocaleDateString()} {new Date(data.marker.createdAt).toLocaleTimeString()}
                        </p>
                    </div>
                </div>
                <div className='marker-info__body'>
                    <div dangerouslySetInnerHTML={{ __html: data.marker.description }} />
                </div>
                <div className='marker-info__divider'></div>
                <ConditionalLoader condition={data.marker.timestamps.length > 0}>
                    <h2>Opmerkingen</h2>
                    <div className='marker-info__timestamps'>
                        {data.marker.timestamps.map((timestamp: {author: string, description: string, createdAt: string, fileName: string, url: string}, index: number) => (
                            <div className='marker-info__timestamp'>
                                <ConditionalLoader condition={timestamp.fileName? true : false}>
                                    {isImageFile(timestamp.fileName) && (
                                        <div className="timestamp__image-container">
                                        <img src={`${timestamp.url}`} alt={`marker ${marker} timestamp ${index}`} />
                                        </div>
                                    )}
                                    {isAudioFile(timestamp.fileName) && (
                                        <div className="timestamp__audio-container">
                                        <audio controls>
                                            <source src={`${timestamp.url}`} />
                                        </audio>
                                        </div>
                                    )}
                                    {isVideoFile(timestamp.fileName) && (
                                        <div className="timestamp__video-container">
                                        <video controls>
                                            <source src={`${timestamp.url}`} />
                                        </video>
                                        </div>
                                    )}
                                </ConditionalLoader>
                                <div className='timestamp__header'>
                                    <h3>{timestamp.author}</h3>
                                    <p className="info-header__date">
                                        {new Date(timestamp.createdAt).toLocaleDateString()} {new Date(timestamp.createdAt).toLocaleTimeString()}
                                    </p>
                                </div>
                                <div className='timestamp__body'>
                                    <div dangerouslySetInnerHTML={{__html: timestamp.description}}/>
                                </div>
                            </div>
                        ))}
                    </div>
                </ConditionalLoader>
                <ConditionalLoader condition={data.marker.timestamps.length === 0}>
                    <div className='marker-info__no-timestamps'>
                        <p>No timestamps yet, add one!</p>
                    </div>
                </ConditionalLoader>
                <Button className={isLoaded? 'button': 'button button--not-loaded' } type='button' onClick={() => setForm(true)}>
                    <AddBoxIcon color='secondary'/>
                    <p style={{color: '#282829'}}>Voeg een opmerking toe</p>
                </Button>
            </div>
        </ConditionalLoader>
        <TimestampForm marker={marker} refetch={refetch} setFormVisible={setForm} visible={form}/>
    </div>
);
};

export default TimestampList;