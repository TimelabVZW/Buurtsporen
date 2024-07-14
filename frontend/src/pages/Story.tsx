import { useAuth } from '../context/authContext';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { FetchResult, useMutation, useQuery } from '@apollo/client';
import { GET_STORYDETAIL_DATA } from '../gql/queries';
import { mutationCreateFullStory, mutationRemoveStory, mutationUpdateIsHighlighted, mutationUpdateIsPublished, mutationUpdateStory } from '../gql/mutations';
import { Story as StoryInterface, Block, Property } from '../interfaces';
import { ChangeEvent, useEffect, useRef, useState } from 'react';

import { Helmet } from 'react-helmet';
import { BlockDropdown, ConditionalLoader, DashboardMain, Header, LoadingSmall, MassModal } from '../components';
import { Button, Card, Grid, Switch } from '@mui/material';
import { Input, InputLabel } from '@material-ui/core';
import DeleteIcon from '@mui/icons-material/Delete';

import '../sass/components/confirmationModal.scss';
import "../sass/components/dashboard.scss";
import '../sass/components/datagrid.scss';
import "../sass/components/countup.scss";
import '../sass/pages/dashboard.scss';
import '../sass/pages/story.scss';

const removeTypename = (key: string, value: any) => (key === "__typename" ? undefined : value);

const stripTypenames = (obj: any) => {
  return JSON.parse(JSON.stringify(obj), removeTypename);
};

const removeIdAndTypename = (key: string, value: any) => (key === "__typename" || key === "id" ? undefined : value);

const stripIdAndTypenames = (obj: any) => {
  return JSON.parse(JSON.stringify(obj), removeIdAndTypename);
};

const Story = () => {
    const { authenticated, authLoading } = useAuth();
    const { id } = useParams();
    const navigate = useNavigate();

    const [story, setStory] = useState<StoryInterface | null>(null);
    const [modal, setModal] = useState<string>('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [duplicateStory] = useMutation(mutationCreateFullStory);
    const [updateIsHighlighted] = useMutation(mutationUpdateIsHighlighted);
    const [updateIsPublished] = useMutation(mutationUpdateIsPublished);
    const [updateStory] = useMutation(mutationUpdateStory);
    const [removeStory] = useMutation(mutationRemoveStory);

    const dragBlock = useRef<number>(0);
    const draggedOverBlock = useRef<number>(0)
    const backendURL = import.meta.env.VITE_REACT_APP_BACKEND_URL;

    // Handle authentication check
    if (!authenticated) return <Navigate to="/login" replace />;

    if (!id) return <LoadingSmall/>;


    const { loading, error, data, refetch } = useQuery(GET_STORYDETAIL_DATA, {
        variables: { id: parseInt(id) },
    });

    useEffect(() => {
        if (data && data.story) {
            setStory(stripTypenames(data.story));
        }
    }, [data]);

    // Handle loading state
    if (authLoading || loading || !story) return <LoadingSmall />;

    // Handle error state
    if (error) return <p>Error...</p>;
    
    let toggleIsHighlighted = async () => {
        setIsSubmitting(true);
        await updateIsHighlighted({
            variables: {
                id: parseInt(id),
            }
        }).then((response: FetchResult<any>) => {
            if (!story) return null;
            setStory({...story, isPublished: response.data.updateIsHighlighted.isPublished, isHighlighted: response.data.updateIsHighlighted.isHighlighted})
            setIsSubmitting(false);
        })
    }

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;

        // Generate a preview URL for the image
        if (file) {
            if (!file.type.startsWith('image/')) {
                alert('Please select a valid image file');
                return;
            }
            setSelectedFile(file);
            const previewUrl = URL.createObjectURL(file);
            setPreview(previewUrl);
        } else {
            setSelectedFile(null);
            setPreview(null);
        }
    };
    
    let toggleIsPublished = async () => {
        setIsSubmitting(true);
        await updateIsPublished({
            variables: {
                id: parseInt(id),
            }
        }).then((response: FetchResult<any>) => {
            if (!story) return null;
            setStory({...story, isPublished: response.data.updateIsPublished.isPublished, isHighlighted: response.data.updateIsPublished.isHighlighted})
            setIsSubmitting(false);
        })
    }

    const updateStoryParameter = <K extends keyof StoryInterface>(key: K, newValue: StoryInterface[K]) => {
        setStory((prevStory: StoryInterface | null) => {
            if (!prevStory) return null;
            return {
            ...prevStory,
            [key]: newValue
        }});
    }

    const updateBlockParameter = <K extends keyof Block>(key: K, newValue: Block[K], blockPosition: number) => {
        setStory((prevStory: StoryInterface | null) => {
            if (!prevStory || !prevStory.blocks) return prevStory;
    
            // Find the block to update
            const updatedBlocks = prevStory.blocks.map(block => {
                if (block.position === blockPosition) {
                    return {
                        ...block,
                        [key]: newValue
                    };
                }
                return block;
            });
    
            // Return the updated story
            return {
                ...prevStory,
                blocks: updatedBlocks
            };
        });
    };

    const updatePropertyParameter = (key: string, newValue: string, blockPosition: number, type: string) => {
        setStory((prevStory: any) => {
            if (!prevStory || !prevStory.blocks) return prevStory;
    
            // Find the block to update
            const updatedBlocks = prevStory.blocks.map((block: Block) => {
                if (block.position === blockPosition) {
                    let oldProperty = block.properties.find((property: Property) => property.name === key);
                    let newProperty = {
                        ...oldProperty,
                        value: newValue
                    }
                    return {
                        ...block,
                        properties: [{...block.properties.filter((property: Property) => property.name !== key), ...newProperty}]
                    }
                }
                return block;
            });
    
            // Return the updated story
            return {
                ...prevStory,
                blocks: updatedBlocks
            };
        });
    };

    const handleUpdateStory = async () => {
        if (selectedFile) {
            let storyCopy = story;
            let data = new FormData;
            data.append(`file`, selectedFile)
            await fetch(backendURL + '/story/upload', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
            },
            body: data
            })
            .then(async (response) => {
                const responseBody = await response.json();
                storyCopy['imageUrl'] = responseBody.fileName;
                updateStory({
                    variables: {
                        updateStoryWithBlocksInput: storyCopy
                    }
                })
            })
        } else {
            updateStory({
                variables: {
                    updateStoryWithBlocksInput: story
                }
            })
        }
    }

    const handleDeleteBlock = (position: number) => {
        let remainingBlocks = story.blocks?.filter((block) => position !== block.position);
        setStory({...story, blocks: remainingBlocks});
    }
  
    const handleDragOver = (e: any) => { 
        e.preventDefault();
    }; 

    const handleDrag = () => {
        //origineel kleiner dan nieuw (naar boven)
        if (dragBlock.current < draggedOverBlock.current) {
            let blocksCopy = story.blocks?.map((block) => {
                // als de huidige block groter is dan het origineel EN de huidige kleiner of gelijk aan de nieuwe is dan +1
                if (block.position > dragBlock.current && block.position <= draggedOverBlock.current) {
                    return {...block, position: block.position - 1};
                } else if (block.position === dragBlock.current) {
                    return {...block, position: draggedOverBlock.current}
                }
                return block;
            })
            setStory({...story, blocks: blocksCopy})
        }

        //origineel groter dan nieuw (naar beneden)
        if (dragBlock.current > draggedOverBlock.current) {
            let blocksCopy = story.blocks?.map((block) => {
                // als de huidige kleiner is dan het origineel EN de huidige groter of gelijk aan de nieuwe is dan -1
                if (block.position < dragBlock.current && block.position >= draggedOverBlock.current) {
                    return {...block, position: block.position + 1};
                } else if (block.position === dragBlock.current) {
                    return {...block, position: draggedOverBlock.current}
                }
                return block;
            })
            setStory({...story, blocks: blocksCopy})
        }
    }

  return (
    <div className='dashboard-container dashboard-container--stories'>
        <Helmet>
            <title>Buurtsporen - {story.title}</title>
            <meta name='description' content='Story dashboard for the buurtsporen app'/>
            <meta name='robots' content='noindex'/>
            <link rel="canonical" href="/layers" />
        </Helmet>
        <Header/>
            <DashboardMain active='stories'>
                <Grid container gap={1} sx={{padding: '1rem', height: 'max-content'}}>
                    <Grid xs={9.8} sx={{height: 'max-content'}} item>
                        {/* <Card sx={{marginBottom: '1rem'}}>
                            {JSON.stringify(story)}
                        </Card> */}
                        <Card className='story-main' sx={{marginBottom: '2rem'}}>
                            <div className='story-main--left'>
                                <InputLabel>Title</InputLabel>
                                <Input 
                                    name='title'
                                    value={(story as StoryInterface).title || ''}
                                    onChange={(e) => updateStoryParameter('title', e.target.value)}
                                />
                                <InputLabel>Slug</InputLabel>
                                <Input 
                                    name='slug'
                                    value={(story as StoryInterface).slug || ''}
                                    onChange={(e) => updateStoryParameter('slug', e.target.value)}
                                />
                                <InputLabel>Description</InputLabel>
                                <Input 
                                    name='description'
                                    value={(story as StoryInterface).description || ''}
                                    onChange={(e) => updateStoryParameter('description', e.target.value)}
                                />
                                <InputLabel>Author</InputLabel>
                                <Input 
                                    name='author'
                                    value={(story as StoryInterface).author || ''}
                                    onChange={(e) => updateStoryParameter('author', e.target.value)}
                                />
                            </div>
                            <div className='story-main--right'>   
                                <input type="file" accept="image/*" onChange={handleFileChange} />
                                <div>
                                    <p>Preview:</p>
                                    <ConditionalLoader condition={preview !== null} >
                                        <img src={preview? preview : ''} alt="Selected file" />
                                    </ConditionalLoader>
                                    <ConditionalLoader condition={story.imageUrl !== undefined && preview == null}>
                                    <img src={story.imageUrl} alt="Selected file" />
                                    </ConditionalLoader>
                                    <ConditionalLoader condition={story.imageUrl == undefined && preview == null}>
                                        <div className='no-image-container'>
                                            <p>No image found.</p>
                                        </div>
                                    </ConditionalLoader>
                                </div>
                            </div>
                        </Card>
                        <ul className='blocks-list'>
                        {
                            story && story.blocks && story.blocks.length > 0 ? (
                                story.blocks.map((block) => { 
                                    
                                    return (
                                    <Card
                                        sx={{order: block.position}}
                                        draggable
                                        onDragStart={() => (dragBlock.current = block.position)}
                                        onDragEnter={() => (draggedOverBlock.current = block.position)}
                                        onDragEnd={handleDrag}
                                        onDragOver={handleDragOver}
                                    >
                                        <div className='block-head'>
                                            <div>
                                                <InputLabel>Anchor ID</InputLabel>
                                                <Input
                                                    name='divId'
                                                    value={block.divId || ''}
                                                    onChange={(e) => updateBlockParameter('divId', e.target.value, block.position)}
                                                />
                                            </div>
                                            <button
                                                className='story-delete-btn'
                                                onClick={() => handleDeleteBlock(block.position)}
                                            >
                                                <DeleteIcon sx={{ fill: '#FF0000', '&::hover': "#AA0000"}}/>
                                            </button>
                                        </div>
                                        {
                                            block && block.properties && block.properties.length > 0 ? (
                                                block.properties.map((property) => {
                                                    return (
                                                        <div className='story-input-container'>
                                                            <InputLabel>{property.name}</InputLabel>
                                                            <Input
                                                                name={property.name}
                                                                type={property.type}
                                                                value={property.value}
                                                                onChange={(e) => updatePropertyParameter(property.name, e.target.value, block.position, property.type)}
                                                            />
                                                        </div>
                                                    )
                                                })
                                            ) : (
                                                <p>No properties found.</p>
                                            )
                                        }
                                    </Card>
                                )
                                })
                            ) : (
                                <p>No blocks found.</p>
                            )
                        }
                        </ul>
                        <Card sx={{marginTop: '1rem'}}>
                            <BlockDropdown story={story} setStory={setStory} />
                        </Card>
                    </Grid>
                    <Grid xs={2} item sx={{height: 'max-content'}}>
                        <Card className={'story-options'}>
                            <div className='option-container'>
                                <InputLabel>Highlight Story</InputLabel>
                                <Switch
                                    checked={(story as StoryInterface).isHighlighted || false}
                                    onChange={toggleIsHighlighted}
                                    disabled={isSubmitting}
                                    inputProps={{ 'aria-label': 'controlled' }}
                                />
                            </div>
                            <div className='option-container'>
                                <InputLabel>Publish Story</InputLabel>
                                <Switch
                                    className='switch-large'
                                    checked={(story as StoryInterface).isPublished || false}
                                    onChange={toggleIsPublished}
                                    disabled={isSubmitting}
                                    inputProps={{ 'aria-label': 'controlled' }}
                                />
                            </div>
                            <Button
                                type='button'
                                onClick={handleUpdateStory}
                            >
                                Update Story
                            </Button>
                            <Button
                                type='button'
                                color='secondary'
                                onClick={() => setModal('duplicateStory')}
                            >
                                Duplicate Story
                            </Button>
                            <Button
                                type='button'
                                color='warning'
                                onClick={() => setModal('deleteStory')}
                            >
                                Delete Story
                            </Button>
                        </Card>
                    </Grid>
                </Grid>
            </DashboardMain>
            <MassModal
                visible={modal === 'deleteStory'}
                setVisible={setModal}
            >
            <div className='confirmation-container'>
                <h2>Are you sure you want to delete this story?</h2>
                <div className='confirmation-buttons'>
                    <Button
                        variant='contained'
                        onClick={() => {
                            setModal('');
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant='contained'
                        color='error'
                        onClick={async () => {
                            await removeStory({
                                variables: {
                                    id: story.id
                                }
                            }).then(() => {
                                setModal('');
                                navigate('/stories');
                            });
                        }}
                    >
                        Delete
                    </Button>
                </div>
            </div>
        </MassModal>
            <MassModal
                visible={modal === 'duplicateStory'}
                setVisible={setModal}
            >
            <div className='confirmation-container'>
                <h2>Are you sure you want to duplicate this story?</h2>
                <div className='confirmation-buttons'>
                    <Button
                        variant='contained'
                        onClick={() => {
                            setModal('');
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant='contained'
                        color='error'
                        onClick={async () => {
                            let {isPublished, isHighlighted, ...restStory} = story;
                            await duplicateStory({
                                variables: {
                                    createStoryWithBlocksInput: {
                                        ...stripIdAndTypenames(restStory),
                                        title: story.title + ' Copy',
                                        slug: story.slug + '-copy',
                                    }
                                }
                            }).then((response) => {
                                setModal('');
                                setTimeout(() => {
                                    navigate('/stories/' + response.data.createStoryWithBlocks.id);
                                }, 1000)
                            });
                        }}
                    >
                        Duplicate
                    </Button>
                </div>
            </div>
        </MassModal>
    </div>
  )
}

export default Story;