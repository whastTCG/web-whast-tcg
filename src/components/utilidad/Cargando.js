import { Box, CircularProgress } from '@mui/material';
import React from 'react'

export const Cargando = () => {
 
    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            height="100vh" // Esto centra el spinner verticalmente en la pantalla
        >
            <CircularProgress />
        </Box>
    );
  
}

