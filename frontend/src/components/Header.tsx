import { Button, ListItemIcon, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | Element>(null);
    const navigate = useNavigate();
    const { clearUser } = useAuth()

    const clickButton = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setAnchorEl(e.currentTarget)
        setMenuOpen(true);
    };

    const closeMenu = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setAnchorEl(null)
        setMenuOpen(false);
    }

    const onLogoutClick = () => {
        localStorage.removeItem('jwt-token');
        clearUser()
        navigate('/login')
    }

    return (
        <div className="header-container">
            <div className="header">
                <h2>Buurtsporen Dashboard</h2>

                
                <Button variant="contained" onClick={clickButton}>
                    <MenuIcon/>
                </Button>
                {/* source: https://mui.com/material-ui/react-menu/ */}
                <Menu open={menuOpen} anchorEl={anchorEl} onClose={closeMenu}
                    PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                        },
                        '&:before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: 'background.paper',
                        transform: 'translateY(-50%) rotate(45deg)',
                        zIndex: 0,
                        },
                    },
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                    <MenuItem onClick={onLogoutClick}
                        sx={{
                            height: 'max-content'
                        }}
                    >
                        <ListItemIcon
                            sx={{
                                height: 'max-content'
                            }}
                        >
                            <LogoutIcon fontSize="small" />
                        </ListItemIcon>
                        <p style={{height: 'max-content'}}>Logout</p>
                    </MenuItem>
                </Menu>
            </div>
        </div>
    )
}

export default Header;