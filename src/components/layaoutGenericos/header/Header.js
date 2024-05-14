import React from 'react'
import rescueCat from "../../../img/gatoql.png";
import tituloYugioh from "../../../img/yugioh-titutlo.png";
import { Box } from '@mui/material';

export const Header = () => {
  return (
    <>
      <Box sx={{display:{xl:'flex', xs:'none'}, justifyContent:'center', alignItems:'center', }}>
        <h2>Bienvenido a Last TCG Store</h2>
        <img className='titulo' src={tituloYugioh} alt='titulo'></img>
        <img className='gatoql' src={rescueCat} alt='gatoql'></img>
      </Box>
    </>
  )
}
