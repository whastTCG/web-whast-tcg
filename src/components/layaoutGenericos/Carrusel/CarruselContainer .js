// CarruselContainer.jsx
import React from 'react';
import { useLocation } from 'react-router-dom';
import ImagenesCarrusel from '../Carrusel/ImagenesCarrusel';

const CarruselContainer = () => {
  const location = useLocation();
  const shouldHideCarousel = location.pathname === '/seleccionar-envio' || location.pathname === '/confirmar-pago';

  return (
    <div className='banner'>
      {!shouldHideCarousel && <ImagenesCarrusel />}
    </div>
  );
};

export default CarruselContainer;