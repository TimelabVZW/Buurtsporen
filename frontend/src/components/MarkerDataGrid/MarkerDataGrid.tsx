import React from 'react'
import { TextareaAutosize } from '@mui/base';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import MassModal from '../MassModal';
import { DeconstructedObject, MarkerDataGridProps } from '../../interfaces';
import { Marker } from 'react-leaflet';
import MarkerImportForm1 from './MarkerImportForm1';
import MarkerImportForm2 from './MarkerImportForm2';


const MarkerDataGrid = ({json, layers, jsonType, refetch}: MarkerDataGridProps) => {
  const [rowSelectionModel, setRowSelectionModel] = React.useState<any[]>([]);
  const [formData, setFormData] = React.useState<object>({});
  const [modal, setModal] = React.useState<string>('');

// json deconstruction function
function deconstructObject(obj: any, parentKey: string = '', result: DeconstructedObject = {}) {
  for (const key in obj) {
    const newKey = parentKey ? `${parentKey}.${key}` : key;
    if (key === 'coordinates' || key === 'geo_point_2d') {
      result[newKey] = obj[key];
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      deconstructObject(obj[key], newKey, result);
    } else {
      result[newKey] = obj[key];
    }
  }
  return result;
}

// deconstruct the json so the values can fit inside the data grid
const deconstructedJson = json.map((obj: any) => deconstructObject(obj));

// get the keys from the first object in the array
const exampleObject = deconstructObject(json[0]);
const deconstructedKeys = Object.keys(exampleObject);

// create the columns for the data grid
const columns: GridColDef[] = deconstructedKeys.map((key: string) => ({
  field: key,
  headerName: key,
  width: 150,
}));

// create the rows for the data grid
const rows = deconstructedJson.map((obj: any, index: number) => ({
  ...obj,
  id: index,
}));

  return (
    <>
      <DataGrid
        rows={rows}
        columns={columns}
        sx={{
          width: '100%',
        }}
        // Add a button on the bottom of the datagrid that will open a <MassModal> by checking if the modal state is equal to 'import' with the selected rows
        slots={{
          toolbar: () => (
            <>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#1976d2',
                  color: '#ffffff',
                  width: 'max-content',
                    '&:hover': {
                      backgroundColor: '#115293',
                    },
                  }
                }
                disabled={rowSelectionModel.length === 0}
                onClick={() => {
                  setModal('import-1');
                }}
              >
                Import
              </Button>
            </>
          ),
        }}
        initialState={{
          pagination: {
              paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        rowSelectionModel={rowSelectionModel}
        onRowSelectionModelChange={(newRowSelectionModel) => {
          setRowSelectionModel(newRowSelectionModel);
        }}
      />
      <MassModal
          visible={modal === 'import-1'}
          setVisible={setModal}
      >
        <MarkerImportForm1 refetch={() => refetch()} jsonType={jsonType} selectedRows={rows.filter((row) => rowSelectionModel.includes(row.id))} layers={layers} setModal={setModal} formData={formData} setFormData={setFormData}/>
      </MassModal>
      <MassModal
          visible={modal === 'import-2'}
          setVisible={setModal}
      >
        <MarkerImportForm2 refetch={() => refetch()} jsonType={jsonType} selectedRows={rows.filter((row) => rowSelectionModel.includes(row.id))} layers={layers} setModal={setModal} formData={formData} setFormData={setFormData}/>
      </MassModal>
    </>
  )
};

export default MarkerDataGrid;