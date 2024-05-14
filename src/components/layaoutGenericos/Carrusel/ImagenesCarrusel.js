import React, { useState } from 'react';
import Carrusel from './Carrusel';
import { Box, Container } from '@mui/material';
import blmrBanner from "../../../img/blmr-logo-sp-600x291-transformed.png";
import agovBanner from "../../../img/AGOV-LogoEN.png";
const ImagenesCarrusel = () => {
    const [images, setImages ] = useState([
        {
            url: 'cartas/AGOV',
            src: agovBanner
        },
        {
            url: 'cartas/BLMR',
            src:blmrBanner
        }

        // Agrega más URLs de imágenes según sea necesario
    ]);

    return (
        <Box >
            <Container maxWidth={'xl'} style={{ width: '100%', height: 'auto' }}>
                <Carrusel images={images} />
            </Container>
        </Box>
    );
};

export default ImagenesCarrusel;
