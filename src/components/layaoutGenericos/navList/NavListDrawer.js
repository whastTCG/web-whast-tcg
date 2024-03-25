import React, { useState } from 'react'
import { Box, Drawer, ListItemButton } from '@mui/material';
import { List, ListItem, ListItemText } from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';
import { useHref, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

export const NavListDrawer = () => {


    const [abrir, setAbrir] = useState(false);
    const navegar = useNavigate();

    //redirigir ediciones
    const redirigirBLMR = () => {
        navegar("/cartas/BLMR", { replace: true });
        window.location.reload();
        setAbrir(false);
    }

    const redirigirAGOV = () => {
        navegar("/cartas/AGOV", { replace: true });
        window.location.reload();
        setAbrir(false);
    }

    const test = () => {
        navegar("/test/BLMR", { replace: true });
        window.location.reload();
        setAbrir(false);
    }

    const handleClick = () => {
        setAbrir(!abrir);
    };

    return (
        <Box sx={{ bgcolor: "orange" }}>
            <nav>

                <List sx={{ minWidth: 250 }}>
                    <ListItem disablePadding>

                        <ListItemButton component="a" href='/inicio'>
                            <ListItemText primary="Inicio" />
                        </ListItemButton>

                    </ListItem>

                    <ListItem disablePadding>
                        <ListItemButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            sx={{ mr: 2 }}
                            onClick={handleClick}
                        >

                            <ListItemText primary="Ediciones" />
                            {!abrir ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                    </ListItem>
                    <Collapse in={abrir} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <ListItemButton sx={{ pl: 4 }} onClick={test}>

                                <ListItemText primary="test" />

                            </ListItemButton>

                            <ListItemButton sx={{ pl: 4 }} onClick={redirigirAGOV}>

                                <ListItemText primary="Age of Overlord" />

                            </ListItemButton>

                            <ListItemButton sx={{ pl: 4 }} onClick={redirigirBLMR}>

                                <ListItemText primary="Battle of Leggend: Monstrous Revenge" />

                            </ListItemButton>

                            <ListItemButton sx={{ pl: 4 }} href='/BLMR'>

                                <ListItemText primary="Otros" />

                            </ListItemButton>
                        </List>
                    </Collapse>

                    <ListItem disablePadding>
                        <ListItemButton component="a" href='/Contacto'>
                            <ListItemText primary="Contacto" />
                        </ListItemButton>
                    </ListItem>
                </List>

            </nav>

        </Box>
    )
}
