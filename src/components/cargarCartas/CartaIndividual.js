import React, { useContext, useEffect } from 'react';
import { useState } from 'react';
//import { Context } from '../../context/Context';
import { useParams } from 'react-router-dom';
//import css
import '../../style/cartaIndividual.css'
//import del metodo para buscar el item de la base de datos
import { listarPorId } from '../../helper/listarPorId';
//import { async } from 'rxjs';
import Button from '@mui/material/Button';
//import TextField from '@mui/material/TextField';
import { Box, MenuItem, Select, Typography } from '@mui/material';
import { Context } from '../../context/Context';
//componente para modificar las cartas si es usuario admin
import { ModificarCarta } from '../privateComponent/ModificarCarta';

//componente cargando
import { Cargando } from '../utilidad/Cargando';

//import material ui 
import Snackbar from '@mui/material/Snackbar';
import SnackbarContent from '@mui/material/SnackbarContent';

export const CartaIndividual = () => {

  const [carta, setCarta] = useState([])

  const [stock, setStock] = React.useState(1);

  const { setCarrito } = useContext(Context);
  const { sessionUser } = useContext(Context);

  const [loading, setLoading] = useState(true);



  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [mensajeAgregado, setMensajeAgregado] = useState(null);
  const [mensajeFueraDeStock, setMensajeFueraDeStock] = useState(null);
  const [isAdmin, setAdmin] = useState(false);



  const handleChangeSelect = (event) => {
    setStock(event.target.value);
  };

  const { idCarta } = useParams();

  // const { cartasBLMR, setCartasBLMR } = useContext(Context);
  useEffect(() => {

    const traerCarta = async (id) => {
      const consulta = await listarPorId(id)
      setCarta(consulta);
      //console.log(carta)
      setLoading(false);
    }
    traerCarta(idCarta);

  }, [idCarta]);


  useEffect(() => {


    if (sessionUser && sessionUser.roll === 'admin') {
      setAdmin(true);
    }

  }, [sessionUser])



  const anadirAlCarro = (event, item) => {

    // Verificar si el item tiene stock igual a 0
    if (parseInt(item.stock) === 0) {
      alert('No hay stock disponible para este producto.');
      return; // Salir de la función si no hay stock
    }

    const carritoActual = JSON.parse(localStorage.getItem('carrito')) || [];

    // Verificar si el producto está en el carrito
    const productoEnCarritoIndex = carritoActual.findIndex((cartItem) => cartItem._id === item._id);

    // Si el producto no está en el carrito, agregarlo con la cantidad seleccionada
    if (productoEnCarritoIndex === -1) {

      carritoActual.push({ ...item, cantidad: stock });
      setMensajeAgregado(item.cardText + ' Cantidad ' + stock + 'ha sido agregado al carrito');
      setSnackbarOpen(true);
    } else {
      // Verificar si la cantidad total es igual o mayor al stock
      if (carritoActual.reduce((total, cartItem) => cartItem.cantidad, 0) > item.stock) {

        alert('No hay suficiente stock disponible.');
      } else {

        // Si el producto ya está en el carrito, actualizar la cantidad con el stock seleccionado
        carritoActual[productoEnCarritoIndex].cantidad = stock;
        setMensajeAgregado(item.cardText + ' Cantidad: ' + stock + ', ha sido agregado al carrito');
        setSnackbarOpen(true);
      }
    }

    // Guardar el carrito actualizado en el localStorage
    localStorage.setItem('carrito', JSON.stringify(carritoActual));

    // Actualizar el estado del carrito en tu componente React
    setCarrito(carritoActual);
  };

  const renderSelectStock = () => {
    const arr = [];

    for (let index = 1; index < parseInt(carta.stock) + 1; index++) {
      arr[index] = index;
      //console.log(index);
    }

    return (
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={stock}
        label="stock"
        onChange={handleChangeSelect}
        sx={{ width: "65px" }}

      >
        {arr.map(item => {
          return (
            <MenuItem sx={{ width: "10px" }} value={item} key={item}>{item}</MenuItem>
          )
        })}
      </Select>
    )

  }

  // const handleChange = (event) => {
  //   if (event.target.value.match(/[^0-9]/)) {
  //     event.preventDefault();
  //   }
  // }


  // const controlStock = () => {
  //   if (parseInt(carta.stock) === 0) {
  //     return (<h1 className='fuera-stock-label'>NO HAY STOCK</h1>)
  //   }
  //   return (
  //     <TextField
  //       id="standard-number"
  //       type="number"
  //       variant="standard"
  //       InputProps={{ inputProps: { min: 1, max: carta.stock } }}
  //       defaultValue={1} 
  //       onChange={handleChange}
  //       className='stock-field'
  //     >
  //     </TextField>
  //   )
  // }







  const calcularPrecioCLP = (price) => {

    // Formatear el número con puntos y el signo de peso
    const precioFormateado = Math.ceil(price).toLocaleString('es-CL', {
      style: 'currency',
      currency: 'CLP'
    });

    return precioFormateado;
  };


console.log("sessionusser" +sessionUser.name)

  if (loading || !sessionUser) {
    return <div><Cargando /></div>;
  }

  //console.log("es admin? "+ sessionUser.roll);
  return (
    <div className='content-individual'>
      {
        isAdmin ? (
          <ModificarCarta />
        ) : (<Box marginRight={{ md: 20, sm: 0, xs: 0, xl: 70 }} marginLeft={{ md: 0 }} >
          <div className='container-carta-individual' >
            <Box display={{ sm: 'none', xs: 'flex' }} flexDirection={'column'} alignItems={'center'} >
              <Box display="flex" flexDirection="column" alignItems="center" marginBottom={1}>
                <Typography variant="h6">
                  Precio:{calcularPrecioCLP(carta.cardPrice)}
                </Typography>
                <Box display="flex" alignItems="center">
                  <Typography variant="body2" sx={{ marginRight: '8px' }}>
                    Stock:
                  </Typography>
                  {carta.stock >= 1 ? renderSelectStock() : <Typography variant='p' color={'crimson'}>Fuera de Stock</Typography>}
                </Box>
              </Box>

              <Button variant="contained" color="success" fullWidth onClick={(e) => anadirAlCarro(e, carta)}>
                Agregar al carro
              </Button>
            </Box>

            <div className='img-container'>

              <img src={carta.cardImg} alt='imagen carta' />

            </div>

            <div className='datos-carta'>
              <Box marginLeft={{ md: 2 }}>
                <Box marginLeft={{ xs: 3, sm: 0 }} sx={{ width: 'auto' }}>
                  <span>Nombre</span>

                  <Typography sx={{ width: { md: 300 } }} variant='h4'>{carta.cardText}</Typography>
                  <Box display={{ xs: 'none', sm: 'block' }}>
                    <span>Precioo</span>
                    <h2>{calcularPrecioCLP(carta.cardPrice)}</h2>
                  </Box>

                  <span className='edicion-span'>Edicion</span>
                  <h5>{carta.cardEdition + ' ' + carta.codeEdition}</h5>
                </Box>
                <Box display={{ xs: 'none', sm: 'block' }} >
                  <div className='button-stock-conten'>

                    <span>Stock</span>

                    {carta.stock >= 1 ? renderSelectStock() : <Typography variant='h6' color={'red'}>Fuera de Stock</Typography>}
                    <Typography component="h2" marginBottom={1} >
                      Cantidad de stock disponible {carta.stock}
                    </Typography>

                    {
                      parseInt(carta.stock) === 0 ?
                        <Button disabled={true} variant="contained" color="success" sx={{ marginBottom: 1 }} onClick={(e) => anadirAlCarro(e, carta)}>
                          Fuera De Stock
                        </Button> :
                        <Button variant="contained" color="success" sx={{ marginBottom: 1 }} onClick={(e) => anadirAlCarro(e, carta)}>
                          Agregar Al Carro
                        </Button>
                    }

                  </div>
                </Box>
              </Box>

            </div>

          </div>
          <Snackbar
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
            open={snackbarOpen}
            autoHideDuration={3000}
            onClose={() => {
              setSnackbarOpen(false);
              setMensajeAgregado(null);
              setMensajeFueraDeStock(null);
            }}
          >
            <SnackbarContent
              sx={{ backgroundColor: mensajeAgregado ? '#4caf50' : '#f44336' }}
              message={mensajeAgregado || mensajeFueraDeStock || ''}
            />
          </Snackbar>
        </Box>)
      }


    </div>
  )
}
