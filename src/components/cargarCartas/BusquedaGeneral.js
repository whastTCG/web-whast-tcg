import React, { useContext, useEffect, useMemo, useState } from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { Context } from '../../context/Context';
import { Box, Pagination } from '@mui/material';
import { listarGlobalPaginado } from '../../helper/listarGlobalPagination/listarGlobalPag';
import '../../style/testCarta.css';
import { useNavigate } from 'react-router-dom';


import Snackbar from '@mui/material/Snackbar';
import SnackbarContent from '@mui/material/SnackbarContent';
import { Cargando } from '../utilidad/Cargando';

export function BusquedaGeneral() {


    //const [cartasBLMR, setCartasBLMR] = useState([]);
    const [page, setPage] = useState(1);

    const { qtPage, setQtPage } = useContext(Context);

    const { cantidadItem, setCantidadItem } = useContext(Context);

    const { setCarrito } = useContext(Context);



    //estados para controlar mensaje de stock
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [mensajeAgregado, setMensajeAgregado] = useState(null);
    const [mensajeFueraDeStock, setMensajeFueraDeStock] = useState(null);
    const [loading, setLoading] = useState(true);


    // const { parametros, setParametros } = useContext(Context);

    const { cartasBLMR, setCartasBLMR } = useContext(Context);

    const { valorBusqueda } = useContext(Context);
    const navegar = useNavigate()
    //trae los parametros de la url

    // const [tasaDeCambio, setTasaDeCambio] = useState(1000);

    // useEffect(() => {


    //     const valorDolar = async () => {

    //         const valor = await getDollarExchangeRate();
    //         setTasaDeCambio(valor.rates.CLP);
    //     }
    //     valorDolar();
    // }, [])


    useEffect(() => {

        conseguirGlobal();

    }, [page]);

    // //use effect para limpiar el mensaje despues de 3 segundos
    // useEffect(() => {
    //     if (mensajeAgregado) {
    //         const timeoutId = setTimeout(() => {
    //             setMensajeAgregado(null);
    //         }, 3000); // Ocultar el mensaje después de 3 segundos (ajusta según sea necesario)

    //         return () => clearTimeout(timeoutId);
    //     }
    // }, [mensajeAgregado]);



    const handleChange = (event, value) => {

        setPage(value);
    };

    const conseguirGlobal = async () => {
        const { dato } = await listarGlobalPaginado(page, valorBusqueda);
        setQtPage(dato.pages)
        setCartasBLMR(dato.cartas);
        setCantidadItem(dato.total);
        setLoading(false);
    };

    const abrirCarta = (e, idCarta) => {
        navegar('/carta/' + idCarta)

    }


    const anadirAlCarro = (event, item) => {
        // Verificar si el item tiene stock igual a 0

        if (parseInt(item.stock) === 0) {

            setMensajeFueraDeStock('No hay stock disponible para este producto.');
            setSnackbarOpen(true);
            return; // Salir de la función si no hay stock
        }

        const carritoActual = JSON.parse(localStorage.getItem('carrito')) || [];

        // Verificar si el producto está en el carrito
        const productoEnCarritoIndex = carritoActual.findIndex((cartItem) => cartItem._id === item._id);

        // Verificar si la cantidad total del producto en el carrito más la cantidad que deseas agregar excede el stock disponible
        const totalCantidadProductoEnCarrito = carritoActual.reduce((total, cartItem) => {
            if (cartItem._id === item._id) {
                return total + cartItem.cantidad; // Sumar solo la cantidad del producto actual
            }
            return total;
        }, 0);

        if (totalCantidadProductoEnCarrito + 1 > item.stock) {
            setMensajeFueraDeStock('No hay suficiente stock disponible.');
            setSnackbarOpen(true);
        } else {
            // Si hay suficiente stock disponible, agregar el producto al carrito
            if (productoEnCarritoIndex === -1) {
                carritoActual.push({ ...item, cantidad: 1 });
                setMensajeAgregado(item.cardText + " Ha sido agregado al carrito");
                setSnackbarOpen(true);
            } else {
                carritoActual[productoEnCarritoIndex].cantidad += 1;
                setMensajeAgregado(item.cardText + " Ha sido agregado al carrito");
                setSnackbarOpen(true);
            }
        }


        // Guardar el carrito actualizado en el localStorage
        localStorage.setItem('carrito', JSON.stringify(carritoActual));

        // Actualizar el estado del carrito en tu componente React
        setCarrito(carritoActual);
    };


    const calcularPrecioCLP = (price) => {
        // const precioNumerico = parseFloat(price.replace(/[^0-9.-]+/g, ''));
        // const CLP = precioNumerico * tasaDeCambio;

        // Formatear el número con puntos y el signo de peso
        const precioFormateado = Math.ceil(price).toLocaleString('es-CL', {
            style: 'currency',
            currency: 'CLP'
        });

        return precioFormateado;
    };


    if (loading) {
        return <div>
            <Cargando />
        </div>
    }

    return (
        <Box marginTop={2} >
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <strong> Total Coincidencias: {cantidadItem}</strong>
            </Box>
            <div className='container-card'>

                {cartasBLMR ? (

                    cartasBLMR.map(item => {
                        return (
                            <article className="card" key={item._id} >


                                <Card sx={{ backgroundColor: 'lightgray', width: "250px", marginBottom: "1px", marginTop: "1px" }} className='carta'>

                                    <CardHeader

                                        title={item.cardText}
                                        subheader={calcularPrecioCLP(item.cardPrice)}
                                        sx={{ textAlign: 'center', height: 135, whiteSpace: "break-spaces" }}
                                        component='h1'

                                    />
                                    <CardMedia
                                        component="img"
                                        height="auto"
                                        image={item.cardImg}
                                        alt="Paella dish"
                                        sx={{ cursor: 'pointer' }}
                                        onClick={e => abrirCarta(e, item._id)}


                                    />
                                    {
                                        item.stock < 1 ? (


                                            <CardContent sx={{ justifyContent: "center", display: "flex" }}>
                                                <Button sx={{ width: 180, height: 40 }} variant="contained" disabled={true}>Fuera de stock</Button>

                                            </CardContent>

                                        ) : (

                                            <CardContent sx={{ justifyContent: "center", display: "flex" }}>
                                                <Button sx={{ width: 200, height: 40 }} variant="contained" onClick={e => anadirAlCarro(e, item)}>Anadir al carro</Button>

                                            </CardContent>
                                        )
                                    }



                                </Card>
                            </article>


                        )
                    })
                ) : (
                    <h1>loading</h1>
                )

                }
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
            </div>
            <div className='paginacion'>
                <Pagination count={qtPage} page={page} onChange={handleChange} />
            </div>


        </Box>
    );
}