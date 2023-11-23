import { createTheme } from '@mui/material/styles';
import { red, orange } from '@mui/material/colors';

declare module '@mui/material/styles' {
    interface Theme {
      status: {
        danger: string;
      };
    }
    // allow configuration using `createTheme`
    interface ThemeOptions {
      status?: {
        danger?: string;
      };
    }
  }

  const theme = createTheme({
    status: {
        danger: orange[500],
        },
    palette: {
        primary: {
            main: '#556cd6',
        },
        secondary: {
            main: '#282829',
        },
        error: {
            main: red.A400,
        },
        background: {
            default: '#fff',
        },
        },
    });

    export default theme;
