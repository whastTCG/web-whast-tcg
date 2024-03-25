import React, { useContext, useEffect, useState } from 'react';
//import { NavListDrawer } from '../navList/NavListDrawer';
import { IconButton } from '@mui/material';
import { Drawer } from "@mui/material";
import AccountCircle from '@mui/icons-material/AccountCircle';
import Login from '../../Formularios/Login';
//import MenuIcon from '@mui/icons-material/Menu';
//import { Context } from '../../../context/Context';



export const NavbarLogin = () => {

  const [abrir, setAbrir] = useState(false);

  //const { parametros } = useContext(Context);
  return (
    <>


      <Drawer
        open={abrir}
        anchor="right"
        onClose={() => setAbrir(false)}
        >
        <Login setAbrir={setAbrir}/>
      </Drawer>

      <IconButton
        size="large"
        edge="start"
        color="inherit"
        aria-label="open drawer"
        onClick={() => setAbrir(true)}

      >

        <AccountCircle sx={{ width:{xs:40, md:40, sm:50 }, height: 45, marginLeft:0}}  />
      </IconButton>

    </>
  )
}

