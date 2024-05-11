import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Typography, Button, Container, Box, Card, CardContent } from '@mui/material';

const InfoPostVenta = ({ codigoVenta, email }) => {

    const navegar = useNavigate();

    useEffect(() => {
        if (!codigoVenta) {
            navegar("/inicio");
        }
    }, []);

    return (
        <Container maxWidth="lg">
            <Box my={4} sx={{ borderRadius: 2, boxShadow: 3 }} display={{ lg: 'flex' }}  >
                <Card sx={{ margin: 1 }}>
                    <CardContent >
                        <Typography variant="h4" align="center" gutterBottom color="primary">
                            ¡Gracias por tu compra!
                        </Typography>
                        <Typography variant="body1" align="center" gutterBottom>
                            Tu pedido ha sido procesado correctamente.
                        </Typography>
                        <Typography variant="body1" align="center" gutterBottom>
                            Número de pedido: <strong>{codigoVenta}</strong>
                        </Typography>
                        <Typography variant="body1" align="center" gutterBottom>
                            Para ver el estado de tu pedido, por favor sigue este{' '}
                            <Link to="/cargar-estado-venta" style={{ color: '#4285F4', textDecoration: 'underline' }}>
                                enlace
                            </Link>
                            .
                        </Typography>
                        <Typography variant="body1" align="center" gutterBottom>
                            Si tienes alguna pregunta o problema con tu pedido, contáctanos{' '}
                            <Link to="/contacto" style={{ color: '#4285F4', textDecoration: 'underline' }}>
                                aquí
                            </Link>
                            .
                        </Typography>
                        <Typography variant="body1" align="center" gutterBottom>
                            ¿Quieres seguir comprando? Visita nuestra{' '}
                            <Link to="/inicio" style={{ color: '#4285F4', textDecoration: 'underline' }}>
                                tienda
                            </Link>
                            .
                        </Typography>
                        <Typography variant="body1" align="center" gutterBottom>
                            Para más información sobre tu compra, revisa tu email: <strong>{email}</strong>
                        </Typography>
                        <Box display="flex" justifyContent="center" mt={2}>
                            <Button variant="contained" component={Link} to="/tienda" color="primary">
                                Seguir Comprando
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
                <Card sx={{ margin: 1 }}>
                    <CardContent >
                        <Typography variant="h4" align="center" gutterBottom color="primary">
                            Envío de Comprobante de Pago
                        </Typography>
                        <Typography variant="body1" align="center" gutterBottom>
                            Por favor, envía el comprobante de pago con el código de venta al correo electrónico:
                            <strong> pagos.last.tcg@gmail.com</strong>
                        </Typography>
                        <Typography variant="body1" align="center" gutterBottom>

                            <strong>Tiene 24Hrs habiles para efectuar la transferencia sino su pedido sera cancelado</strong>

                        </Typography>
                        <Typography variant="body1" align="center" gutterBottom>

                            <strong>Su pedido sera guardado hasta entonces</strong>

                        </Typography>
                     
                    </CardContent>
                </Card>
            </Box>
        </Container>
    );
};

export default InfoPostVenta;
