import React, { useEffect, useState } from 'react';
import { Box, Typography, Container, Button, TextField, CircularProgress, Card, CardContent, CardActions } from '@mui/material';
import axios from 'axios';
import { Subject, debounceTime } from 'rxjs';
import { Global } from '../../helper/urlGlobales';
import { formatFecha, formatTotalCLP } from '../utilidad/funcionesFormat';

let enviar = new Subject();
let enviar$ = enviar.asObservable();

export const CargarEstadoVenta = () => {
    const [codigoVenta, setCodigoVenta] = useState('');
    const [ventaInfo, setVentaInfo] = useState(null);
    const [mensaje, setMensaje] = useState('');
    const [cargando, setCargando] = useState(false);

    const handleVerEstadoVenta = () => {
        if (codigoVenta.trim() !== '') {
            enviar.next();
        } else {
            setMensaje('Por favor, ingrese un código de venta');
        }
    }

    const handleCodigoVenta = (event) => {
        setCodigoVenta(event.target.value);
        setVentaInfo(null);
        setMensaje('');
    }

    useEffect(() => {
        const subscription = enviar$.pipe(debounceTime(1000)).subscribe(async () => {
            setCargando(true);
            try {
                const response = await axios.get(Global.urlGlobal + "venta/buscar-venta", {
                    params: {
                        ventaCodigo: codigoVenta
                    }
                });

                if (response.status === 200) {
                    setVentaInfo(response.data.venta);
                    setMensaje('');
                }
            } catch (error) {
                console.error(error);
                if (error.message.includes('Network Error')) {
                    setMensaje('Error de red: Verifique su conexión a internet');
                } else if (error.response.status === 400) {
                    setMensaje('Error venta no encontrada');
                } else {
                    setMensaje('Error al buscar la venta');
                }
                setVentaInfo(null);
            } finally {
                setCargando(false);
            }
        });

        return () => {
            return subscription.unsubscribe();
        };
    }, [codigoVenta]);

    return (
        <Container maxWidth='lg' >
            <Box sx={{ display: "flex", flexDirection: 'column', alignItems: 'center', marginTop: 3, marginBottom:4 }}>
                <Typography variant="h4" gutterBottom>
                    Estado De Venta
                </Typography>
                <Card sx={{ width: '100%', maxWidth: 600, p: 2, backgroundColor: 'azure' }}>
                    <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <TextField
                                margin="normal"
                                required
                                id="codigoVenta"
                                label="Ingrese El Código De La Venta"
                                name="codigoVenta"
                                autoFocus
                                sx={{ flexGrow: 1, mr: 1 }}
                                onChange={handleCodigoVenta}
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleVerEstadoVenta}
                                disabled={cargando}
                                sx={{ height: '100%' }}
                            >
                                {cargando ? <CircularProgress size={24} /> : 'Buscar'}
                            </Button>
                        </Box>
                        {mensaje && (
                            <Typography color="error" variant="body1" align="center">
                                {mensaje}
                            </Typography>
                        )}
                        {ventaInfo && (
                            <Box>
                                <Typography variant="h6" gutterBottom>
                                    Información de la Venta
                                </Typography>
                                <Typography>
                                    <strong>Fecha de Emisión:</strong> {formatFecha(ventaInfo.fechaEmision)}
                                </Typography>
                                <Typography>
                                    <strong>Método de Pago:</strong> {ventaInfo.metodoPago}
                                </Typography>
                                <Typography>
                                    <strong>Total:</strong> {formatTotalCLP(ventaInfo.total)}
                                </Typography>
                                <Typography>
                                    <strong>Estado de Venta:</strong> {ventaInfo.estadoVenta}
                                </Typography>
                                <Typography>
                                    <strong>Pagada:</strong> {ventaInfo.pagada ? 'Sí' : 'No'}
                                </Typography>
                            </Box>
                        )}
                    </CardContent>
                </Card>
            </Box>
        </Container>
    );
};