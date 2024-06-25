import { StoriesDataGridProps } from "../interfaces";
import { useQuery } from '@apollo/client';
import { GET_STORIES_DATA } from '../gql/queries';
import { GridColDef } from '@mui/x-data-grid';
import { useMemo } from "react";

import ViewIcon from '@mui/icons-material/Visibility';
import { CrudDataGrid, LoadingSmall } from '../components';

import "../sass/components/dashboard.scss"


const StoriesDataGrid = ({setStoriesCount, refetchTrigger}: StoriesDataGridProps) => {
    const { loading, error, data, refetch } = useQuery(GET_STORIES_DATA);

    useMemo(()=> {
        refetch()
    }, [refetchTrigger])

    if (loading) return <LoadingSmall/>;

    if (error) {
        return <p>Error...</p>;
    }

    setStoriesCount(data.stories.length);

    const columns: GridColDef[] = [
        {
            field: "link",
            headerName: "",
            width: 75,
            cellClassName: 'mui-cell--icon',
            sortable: false,
            filterable: false,
            renderCell: (params: any) => {
              return <a className='datagrid--view' href={`/stories/${params.row.id}`} target='_blank'><ViewIcon sx={{ fill: '#0000ff'}}/></a>;
            }
        },
        { field: "id", headerName: "ID", width: 150 },
        { field: "title", headerName: "Title", width: 150 },
        { field: "slug", headerName: "Slug", width: 450 },
    ]


    let rows = data.stories.map((obj: any) => ({
        ...obj,
    }));

    return (
        <CrudDataGrid rows={rows} columns={columns} pageSize={10} pageSizeOptions={[5, 10, 20]}/>
    )
}

export default StoriesDataGrid;