import { Box } from '@mui/material';
import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Link } from 'react-router-dom';

const Carrusel = ({ images }) => {
  return (
    <Carousel showArrows autoPlay infiniteLoop showThumbs={false} interval={3500}>
      {images.map((image, index) => (
        <Box key={index} sx={{ display: 'flex', justifyContent: 'center' }} >
          <Link to={image.url} >
          <img src={image.src} alt={`Slide ${index}`} style={{ maxWidth: '100%', maxHeight: '400px', width: '1050px', height: 'auto' }} />
          </Link>
        </Box>
      ))}
    </Carousel>
  );
};

export default Carrusel;
