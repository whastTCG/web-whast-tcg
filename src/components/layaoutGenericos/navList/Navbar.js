import React, { useContext, useEffect, useState } from 'react';
import { NavListDrawer } from './../navList/NavListDrawer';
import { IconButton } from '@mui/material';
import { Drawer } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { Context } from '../../../context/Context';
export const Navbar = () => {

    const [abrir, setAbrir] = useState(false);
    
    //const { parametros } = useContext(Context);


   


    return (
        <>

          
            <Drawer open={abrir}
            anchor="left"
            onClose={()=> setAbrir(false)}>
                <NavListDrawer />
            </Drawer>

            <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr:2 }}
            onClick={() => setAbrir(true)}
            
          >
            
            <MenuIcon/>
          </IconButton>

        </>
    )
}
