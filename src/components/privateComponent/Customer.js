import React from 'react'
import { Context } from '../../context/Context';
import DatosPersonales from './DatosPersonales';
import { Box } from '@mui/material';

export const Customer = () => {
  //  const { sessionUser } = React.useContext(Context);
  return (
    <Box >
      <DatosPersonales/>
    </Box>
  )
}
