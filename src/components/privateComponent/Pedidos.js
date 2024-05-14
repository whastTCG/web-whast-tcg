import { Avatar, Box, Button, Card, CardContent, Container, Divider, Grid, List, ListItem, ListItemAvatar, ListItemText, Paper, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../../context/Context';
import { useNavigate } from 'react-router-dom';
import { obtenerCookieToken } from '../../helper/obtenerCookies';
import axios from 'axios';
import { Global } from '../../helper/urlGlobales';
import { formatFecha } from '../utilidad/funcionesFormat';
import { Cargando } from '../utilidad/Cargando';

export const Pedidos = () => {
    const { sessionUser } = useContext(Context);
    const [loading, setLoading] = useState(true);
    const [lista, setLista] = useState([]);
    const [page, setPage] = useState(1);
    const [moreAvailable, setMoreAvailable] = useState(true);
    const navegar = useNavigate();

    const editarDatos = () => {
        navegar('/editar-datos');
    };
    const cambiarContrasena = () => {
        navegar('/cambiar-contrasena');
    };

    useEffect(() => {
        const traerHistoriaPedidos = async () => {
            try {
                const cookie = await obtenerCookieToken();
               
                const response = await axios.get(Global.urlGlobal + `venta/listar-historial/pedidos?page=${page}`, {
                    headers: {
                        'Content-Type': "application/json",
                        Authorization: cookie.miCookie
                    },
                    credentials: "include"
                });

                const { ventas, pages } = response.data;

                //cargamoslas ventas y si pulsamos el boton vermas cargamos las nuevas manteniendo las antiguas
                setLista( prevLista => [...prevLista, ...ventas]);

                // Si estamos en la última página, desactivamos el botón "Ver más" asi como si es solo 1 pagina
                if (pages <=1 || pages <= page) {
                    setMoreAvailable(false);
                }

                setLoading(false);
            } catch (error) {
                console.error("Error al obtener el historial de pedidos:", error);
                setLoading(false);
            }
        };

        traerHistoriaPedidos();
    }, [page]);

    const cargarMasVentas = () => {
        setPage(prevPage => prevPage + 1);
    };

    if (loading) {
       return <Box><Cargando /></Box>
    }
 
    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ mx: 'auto', maxWidth: '100%' }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                        <Paper elevation={3} style={{ padding: '20px' }}>
                            <Card variant="outlined">
                                <CardContent sx={{ maxWidth: '300px' }}>
                                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                        Nombre Completo
                                    </Typography>
                                    <Typography variant="h5" component="div" sx={{ mb: 1 }}>
                                        {sessionUser.name + " " + sessionUser.surname}
                                    </Typography>
                                    <Typography sx={{ mb: 0.5, mt: 1.5 }} color="text.secondary">
                                        Correo Electronico
                                    </Typography>
                                    <Typography variant="h5">{sessionUser.email}</Typography>
                                    <Box mt={2} display="flex" flexDirection="column">
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            startIcon={<EditIcon />}
                                            sx={{ mb: 1, width: '100%' }}
                                            onClick={editarDatos}
                                        >
                                            Editar Datos
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            startIcon={<EditIcon />}
                                            sx={{ width: '100%' }}
                                            onClick={cambiarContrasena}
                                        >
                                            Editar Contraseña
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={8}>
                        <Paper elevation={3} style={{ padding: '20px' }}>
                            <Typography variant="h5" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                                Historial de pedidos
                            </Typography>
                            {lista.map((venta, index) => (
                                <Card key={index} variant="outlined" sx={{ marginBottom: 2, borderRadius: 2, boxShadow: 3 }}>
                                    <CardContent sx={{ padding: 2 }}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} md={6}>
                                                <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                                                    Número de Venta: {venta._id}
                                                </Typography>
                                                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                                                    Método de Pago: {venta.metodoPago}
                                                </Typography>
                                                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                                                    Estado de Venta: {venta.estadoVenta}
                                                </Typography>
                                                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                                                    Pagada: {!venta.pagada ? 'No' : 'Si'}
                                                </Typography>
                                                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                                                    Fecha De Compra: {formatFecha(venta.fechaEmision)}
                                                </Typography>
                                                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                                                    Total: {venta.total}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                                                    Productos
                                                </Typography>
                                                <Divider />
                                                <List sx={{ maxHeight: 200, overflow: 'auto' }}>
                                                    {venta.productos.map((producto, index) => (
                                                        <ListItem key={index}>
                                                            <ListItemAvatar>
                                                                <Box
                                                                    sx={{
                                                                        width: 48,
                                                                        height: 70,
                                                                        overflow: 'hidden',
                                                                        display: 'flex',
                                                                        justifyContent: 'center',
                                                                        alignItems: 'center',
                                                                        borderRadius: 1, // Puedes ajustar este valor para controlar el borde redondeado
                                                                    }}
                                                                >
                                                                    <img
                                                                        src={producto.carta.cardImg}
                                                                        alt={producto.carta.cardText}
                                                                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                                                                    />
                                                                </Box>
                                                            </ListItemAvatar>
                                                            <ListItemText
                                                                primary={producto.carta.cardText}
                                                                secondary={`Cantidad: ${producto.cantidad} | Precio: ${producto.precio}`}
                                                            />
                                                        </ListItem>
                                                    ))}
                                                </List>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            ))}

                            {moreAvailable && (
                                <Button onClick={cargarMasVentas} variant="outlined" color="primary" sx={{ mt: 2 }}>
                                    Ver más
                                </Button>
                            )}
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};