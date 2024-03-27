import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../../context/Context';
import { Button, Typography, Paper, Box, Divider, Grid } from '@mui/material';
import { getDollarExchangeRate } from '../../helper/UsdToCLP';
import { useNavigate } from 'react-router-dom';


export const Carrito = () => {
  const { carrito, setCarrito, setTotalCarrito, totalCarrito } = useContext(Context);
  const [tasaDeCambio, setTasaDeCambio] = useState(1000);

  useEffect(() => {

    // const subscription = startDolarTimer().subscribe((cambio) => {
    //   console.log(cambio)
    //   setTasaDeCambio(cambio);
    // });

    // return () => {
    //   subscription.unsubscribe();
    // };
    const valorDolar = async () => {

      const valor = await getDollarExchangeRate();
      setTasaDeCambio(valor.rates.CLP);
    }
    valorDolar();

    // Guardar carrito en localStorage cada vez que cambia
    localStorage.setItem('totalCarrito', JSON.stringify(totalCarrito));
  }, [totalCarrito])

  const navegar = useNavigate();

  const eliminarItem = (itemId) => {
    const nuevoCarrito = carrito.filter(item => item._id !== itemId);
    setCarrito(nuevoCarrito);
    localStorage.setItem('carrito', JSON.stringify(nuevoCarrito));
  };

  const aumentarCantidad = (itemId) => {
    const nuevoCarrito = carrito.map(item => {
      if (item._id === itemId && item.cantidad < item.stock) {
        return { ...item, cantidad: item.cantidad + 1 };
      }
      return item;
    });
    setCarrito(nuevoCarrito);
    localStorage.setItem('carrito', JSON.stringify(nuevoCarrito));
  };

  const disminuirCantidad = (itemId) => {
    const nuevoCarrito = carrito.map(item => {
      if (item._id === itemId && item.cantidad > 1) {
        return { ...item, cantidad: item.cantidad - 1 };
      }
      return item;
    });
    setCarrito(nuevoCarrito);
    localStorage.setItem('carrito', JSON.stringify(nuevoCarrito));
  };



  useEffect(() => {

    const calcularTotal = () => {
      const totalEnDolares = carrito.reduce((total, item) => {


        return isNaN(item.cardPrice) ? total : total + item.cantidad * item.cardPrice;

      }, 0);





      // Formatear el número con puntos y el signo de peso
      const precioFormateado = Math.ceil(totalEnDolares).toLocaleString('es-CL', {
        style: 'currency',
        currency: 'CLP'
      });

      // Agregar otro console.log para verificar el formato final

      setTotalCarrito(precioFormateado)
      return precioFormateado;
    };
    calcularTotal();
  }, [carrito, totalCarrito])


  const calcularPrecioCLP = (price) => {


    // Formatear el número con puntos y el signo de peso
    const precioFormateado = Math.ceil(price).toLocaleString('es-CL', {
      style: 'currency',
      currency: 'CLP'
    });

    return precioFormateado;
  };

  const calcularTotalIndividual = (item) => {

    const totalEnDolares = item.cantidad * item.cardPrice;


    // Formatear el número con puntos y el signo de peso
    const precioFormateado = Math.ceil(totalEnDolares).toLocaleString('es-CL', {
      style: 'currency',
      currency: 'CLP'
    });

    return precioFormateado;
  };


  const procederCompra = () => {
    // Agrega lógica para proceder con la compra, como redirección a una página de pago, etc.
    navegar('/seleccionar-envio')
    console.log('Proceder con la compra');
  };



  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Carrito de Compras
      </Typography>

      {carrito.map(item => (
        <Paper key={item._id} elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={8}>
              <Box display="flex" alignItems="center">
                <img src={item.cardImg} alt={item.cardText} style={{ width: '80px', marginRight: '20px' }} />
                <div>
                  <Typography onClick={() => { navegar('/carta/' + item._id) }} variant="h6" sx={{
                    cursor: 'pointer',
                    '&:hover': {
                      textDecoration: 'underline',
                      color: 'orange'
                    },
                  }}>{item.cardText}</Typography>
                  <Typography variant="subtitle1">Cantidad: {item.cantidad}</Typography>
                  <Typography variant="subtitle1">Precio Unitario: {calcularPrecioCLP(item.cardPrice)}</Typography>
                  <Typography variant="subtitle1">Total Por Cantidad: {calcularTotalIndividual(item)}</Typography>
                </div>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box display="flex" justifyContent="flex-end">
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => eliminarItem(item._id)}
                >
                  Eliminar
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => disminuirCantidad(item._id)}
                  disabled={item.cantidad === 1}
                >
                  -
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => aumentarCantidad(item._id)}
                  disabled={item.cantidad === item.stock}
                >
                  +
                </Button>
              </Box>
            </Grid>
          </Grid>
          <Divider sx={{ marginTop: 2 }} />
        </Paper>
      ))}

      {carrito.length === 0 && (
        <Typography variant="subtitle1" sx={{ marginTop: 2 }}>
          Tu carrito está vacío.
        </Typography>
      )}

      {carrito.length > 0 && (
        <Box marginTop={2}>
          <Typography variant="h6" sx={{ marginLeft: 1 }}>
            Total: {totalCarrito}
          </Typography>
          <Button
            variant="contained"
            color="success"
            onClick={procederCompra}
            sx={{ marginTop: 2, marginBottom: 2, marginLeft: 1 }}
          >
            Siguiente
          </Button>
        </Box>
      )}
    </div>
  );
};
