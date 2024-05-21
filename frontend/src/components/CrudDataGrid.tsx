import { CrudDataGridProps } from '../interfaces';

import { DataGrid } from '@mui/x-data-grid';

const CrudDataGrid = ({rows, columns, pageSize, pageSizeOptions}: CrudDataGridProps) => {
  return (
    <DataGrid
        rows={rows}
        columns={columns}
        disableRowSelectionOnClick
        autoHeight
        rowHeight={49}  
        sx={{
          width: '100%',
          height: '20rem',
        }}
        initialState={{
          pagination: {
              paginationModel: { page: 0, pageSize: pageSize },
          },
        }}
        pageSizeOptions= {pageSizeOptions}
    />
  );
};

export default CrudDataGrid;