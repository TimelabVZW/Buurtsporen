import { LayersDataGridProps } from "../interfaces";
import { CrudDataGrid, CustomCheckbox, LoadingSmall } from '../components';
import { useQuery } from '@apollo/client';
import DeleteIcon from '@mui/icons-material/Delete';
import ViewIcon from '@mui/icons-material/Visibility';

import '../sass/pages/dashboard.scss'
import { GET_LAYERS_DATA } from '../gql/queries';
import { GridColDef } from '@mui/x-data-grid';
import { useMemo } from "react";


const LayersDataGrid = ({setLayerCount, refetchTrigger, setActiveLayer, updateDefaultShow, setModal}: LayersDataGridProps) => {
    const { loading, error, data, refetch } = useQuery(GET_LAYERS_DATA);

    useMemo(()=> {
        refetch()
    }, [refetchTrigger])

    if (loading) return <LoadingSmall/>;

    if (error) {
        return <p>Error...</p>;
    }

    setLayerCount(data.layers.length);

    const columns: GridColDef[] = [
        {
            field: "action",
            headerName: "",
            width: 75,
            cellClassName: 'mui-cell--icon',
            sortable: false,
            filterable: false,
            renderCell: (params: any) => {
              const onClick = (e: any) => {
                setActiveLayer(params.row.id);
                setModal('deleteLayer');
              };
        
              return <DeleteIcon onClick={onClick} sx={{ fill: '#FF0000'}}/>;
            }
        },
        {
            field: "link",
            headerName: "",
            width: 75,
            cellClassName: 'mui-cell--icon',
            sortable: false,
            filterable: false,
            renderCell: (params: any) => {
              return <a className='datagrid--view' href={`/map?layers=${params.row.id}`} target='_blank'><ViewIcon sx={{ fill: '#0000ff'}}/></a>;
            }
        },
        { field: "id", headerName: "ID", width: 150 },
        { field: "name", headerName: "Name", width: 150 },
        { field: "createdAt", headerName: "Created at", width: 250 },
        { field: "private", headerName: "Private", width: 150 },
        { field: "markers", headerName: "Markers", width: 150 },
        {
            field: "defaultShow",
            headerName: "Default to show",
            width: 150,
            sortable: false,
            filterable: false,
            renderCell: (params: any) => {
                let disabled = false;
                const onClick = async (e: any) => {
                    disabled = true;
                    await updateDefaultShow({
                        variables: {
                            id: params.row.id,
                            defaultShow: !params.row.defaultShow
                        }
                    }).then(() => {
                        params.row.defaultShow = !params.row.defaultShow;
                        disabled = false;
                    })
                };
            
                return (
                    <CustomCheckbox
                        name=''
                        onClick={onClick}
                        disabled={disabled}
                        initialChecked={params.row.defaultShow}
                    />
                )
            }
        },
    ]


    let rows = data.layers.map((obj: any, index: number) => ({
        ...obj,
        markers: obj.markers.length,
        createdAt: `${new Date(obj.createdAt).toLocaleDateString()}\n ${new Date(obj.createdAt).toLocaleTimeString()}`,
    }));

    return (
        <CrudDataGrid rows={rows} columns={columns} pageSize={10} pageSizeOptions={[5, 10, 20]}/>
    )
}

export default LayersDataGrid;