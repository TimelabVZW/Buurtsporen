import { useAuth } from '../context/authContext';
import { Navigate, useParams } from 'react-router-dom';
import { FetchResult, useMutation, useQuery } from '@apollo/client';
import { mutationCreateLayer, mutationCreateStory, mutationRemoveLayer, mutationUpdateDefaultShow, mutationUpdateIsHighlighted, mutationUpdateIsPublished } from '../gql/mutations';
import { useEffect, useMemo, useState } from 'react';

import { Helmet } from 'react-helmet';
import { DashboardMain, Header, LayersDataGrid, LoadingSmall, MassModal } from '../components';

import '../sass/components/confirmationModal.scss';
import "../sass/components/dashboard.scss";
import '../sass/components/datagrid.scss';
import "../sass/components/countup.scss";
import '../sass/pages/dashboard.scss';
import GET_STORYDETAIL_DATA from '../gql/queries/StoryDetailPage';
import { Card, Grid, Switch } from '@mui/material';

const Story = () => {
    const { authenticated, authLoading } = useAuth();
    const { id } = useParams();
    const [story, setStory] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [refresh, setRefresh] = useState(false);

    const [updateIsHighlighted] = useMutation(mutationUpdateIsHighlighted);
    const [updateIsPublished] = useMutation(mutationUpdateIsPublished);

    // Handle authentication check
    if (!authenticated) return <Navigate to="/login" replace />;

    if (!id) return <LoadingSmall/>;


    const { loading, error, data, refetch } = useQuery(GET_STORYDETAIL_DATA, {
        variables: { id: parseInt(id) },
    });

    useEffect(() => {
        if (data && data.story) {
            setStory(data.story);
        }
    }, [data]);

    // Handle loading state
    if (authLoading || loading) return <LoadingSmall />;

    // Handle error state
    if (error) return <p>Error...</p>;

    const refetchAndSet = () => {
        refetch().then(() => setStory(data));
    }
    
    let toggleIsHighlighted = async () => {
        setIsSubmitting(true);
        await updateIsHighlighted({
            variables: {
                id: parseInt(id),
            }
        }).then((response: FetchResult<any>) => {
            setStory({...story, isPublished: response.data.updateIsHighlighted.isPublished, isHighlighted: response.data.updateIsHighlighted.isHighlighted})
            setIsSubmitting(false);
        })
    }
    
    let toggleIsPublished = async () => {
        setIsSubmitting(true);
        await updateIsPublished({
            variables: {
                id: parseInt(id),
            }
        }).then((response: FetchResult<any>) => {
            setStory({...story, isPublished: response.data.updateIsPublished.isPublished, isHighlighted: response.data.updateIsPublished.isHighlighted})
            setIsSubmitting(false);
        })
    }

  return (
    <div className='dashboard-container dashboard-container--layers'>
        <Helmet>
            <title>Buurtsporen - Stories</title>
            <meta name='description' content='Story dashboard for the buurtsporen app'/>
            <meta name='robots' content='noindex'/>
            <link rel="canonical" href="/layers" />
        </Helmet>
        <Header/>
        <DashboardMain active='stories'>
            
        <Grid container gap={1} style={{padding: '1rem'}}>
                <Grid xs={9.8} item>
                    <Card>
                    {JSON.stringify(story)}
                    </Card>
                </Grid>
                <Grid xs={2} item>
                    <Card>
                    <Switch
                        checked={data.story.isHighlighted}
                        onChange={toggleIsHighlighted}
                        disabled={isSubmitting}
                        inputProps={{ 'aria-label': 'controlled' }}
                    />
                    <Switch
                        checked={data.story.isPublished}
                        onChange={toggleIsPublished}
                        disabled={isSubmitting}
                        inputProps={{ 'aria-label': 'controlled' }}
                    />
                    </Card>
                </Grid>
        </Grid>
        </DashboardMain>
    </div>
  )
}

export default Story;