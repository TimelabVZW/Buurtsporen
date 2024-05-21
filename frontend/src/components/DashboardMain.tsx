import { DashboardMainProps } from "../interfaces";

import { List, ListItem, ListItemButton, ListItemIcon } from "@mui/material";
import LayersIcon from '@mui/icons-material/Layers';
import HomeIcon from '@mui/icons-material/Home';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import MarkerIcon from '@mui/icons-material/Room';
import TimestampIcon from '@mui/icons-material/AccessTimeFilled';
import PaletteIcon from '@mui/icons-material/Palette';

import "../sass/components/dashboard.scss"

const DashboardMain = ({ children, active }: DashboardMainProps) => {
    const pages = ['dashboard', 'layers', 'markers', 'timestamps', 'icons', 'import-export'];

    const getIcon = (name: string) => {
        switch (name) {
            case 'dashboard':
                return (
                    <HomeIcon 
                        sx={{
                            fill: active === name? '#000000': '',
                        }}
                    />
                );
            case 'layers':
                return (
                    <LayersIcon 
                        sx={{
                            fill: active === name? '#000000': '',
                        }}
                    />
                );
            case 'markers':
                return (
                    <MarkerIcon 
                        sx={{
                            fill: active === name? '#000000': '',
                        }}
                    />
                );
            case 'import-export':
                return (
                    <ImportExportIcon 
                        sx={{
                            fill: active === name? '#000000': '',
                        }}
                    />
                );
            case 'timestamps':
                return (
                    <TimestampIcon 
                        sx={{
                            fill: active === name? '#000000': '',
                        }}
                    />
                );
            case 'icons':
                return (
                    <PaletteIcon 
                        sx={{
                            fill: active === name? '#000000': '',
                        }}
                    />
                );
            default:
                return null;
        }
    };

  return (
    <div className="dashboard-main-container">
        <div className="dashboard-main">
            <div className="dashboard-main-navigation">
                <List
                    sx={{
                        pt: 0,
                        height: 'max-content'
                    }}
                >
                {pages.map((name) => (
                    <ListItem key={name} disablePadding sx={{ display: 'block' }}>
                        <ListItemButton
                            href={`/${name}`}
                            sx={{
                            minHeight: 48,
                            maxHeight: 48,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: active === name? '#1976d2': '',
                            px: 2.5,
                            py: 5,
                            "&:hover": {
                                backgroundColor: active === name? '#1976d2': '',
                            }
                            }}
                        >
                            <ListItemIcon
                            sx={{
                                minWidth: 0,
                                mr: 'auto',
                                justifyContent: 'center',
                            }}
                            >
                                {getIcon(name)}
                            </ListItemIcon>
                        </ListItemButton>
                    </ListItem>
                ))}
                </List>
            </div>
            <div className="dashboard-main-content">
                {children}
            </div>
        </div>
    </div>
  );
};

export default DashboardMain;