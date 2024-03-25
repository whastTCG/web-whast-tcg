import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../context/Context';
import { Container, Typography, Box, FormControl, FormLabel, RadioGroup, Radio, FormControlLabel, TextField, Button } from '@mui/material';

export const ConfirmarPago = () => {
    const { userLog, totalCarrito, setTotalCarrito } = useContext(Context);
    const [casillaCorreo, setCasillaCorreo] = useState('');
    const [entregaPresencial, setEntregaPresencial] = useState(false); // Estado para controlar si se seleccionó entrega presencial
    const [direccionSucursal, setDireccionSucursal] = useState('');


    const handleCasillaChange = (event) => {
        setCasillaCorreo(event.target.value);
        const value = event.target.value;
        if (value === 'Entrega presencial en Santiago') {
            setEntregaPresencial(true);
        } else {
            setEntregaPresencial(false);
        }

    };

    const handleDireccionChange = (event) => {
        setDireccionSucursal(event.target.value);

    };


    useEffect(() => {
        const totalCarritoString = localStorage.getItem('totalCarrito')

        setTotalCarrito(totalCarritoString.replace(/"/g, ''));
    }, [])



    const renderLogin = () => {
        if (userLog === false) {
            return (
                <>
                    <Typography component={'h1'}>No está logueado</Typography>
                    <Container maxWidth='lg'>
                        <Box display={'flex'} justifyContent={'center'} mt={2} flexDirection={{ xs: 'column', lg: 'row' }} marginBottom={3}>
                            <Box width={{ xs: '100%', }} margin={{ lg: 1 }} marginBottom={{ xs: 1 }} padding={1}>
                                <FormControl component="fieldset">
                                    <FormLabel component="legend">Selecciona casilla de correo</FormLabel>
                                    <RadioGroup aria-label="casillaCorreo" name="casillaCorreo" value={casillaCorreo} onChange={handleCasillaChange}>
                                        <FormControlLabel value="Chile Express" control={<Radio />} label="Chile Express" />
                                        <FormControlLabel value="Starken" control={<Radio />} label="Starken" />
                                        <FormControlLabel value="Entrega presencial en Santiago" control={<Radio />} label="Entrega presencial en Santiago" />
                                    </RadioGroup>
                                </FormControl>
                            </Box>
                            <Box width={{ xs: '100%' }} margin={{ lg: 1 }} padding={1}>
                                <Typography variant='h5' marginBottom={2}>Total</Typography>
                                <Typography variant='h5'> {totalCarrito}</Typography>
                                <Typography variant='p'>Total sin envio ya que el envio es por pagar</Typography>
                                {/* Aquí va el componente que muestra el total del carrito */}
                            </Box>
                        </Box>
                        {entregaPresencial && ( // Si se seleccionó entrega presencial, muestra la dirección
                            <Typography component="p" margin={1} marginLeft={2}>
                                Dirección de entrega presencial: Metro Rojas Magallanes, Santiago
                            </Typography>
                        )}
                        {casillaCorreo === 'Chile Express' && (
                            <>
                                <Typography component="p" marginLeft={2}>
                                    Envio por Chile express, el envio queda por pagar y se envia a la sucursal destinada
                                </Typography>

                                <Box width={{ xs: '100%', }} margin={{ lg: 1 }} marginBottom={{ xs: 1 }} padding={1}>
                                    <TextField
                                        id="direccion-sucursal"
                                        label="Dirección de la sucursal"
                                        variant="outlined"
                                        fullWidth
                                        value={direccionSucursal}
                                        onChange={handleDireccionChange}
                                    />
                                </Box>
                            </>
                        )}
                        {casillaCorreo === 'Starken' && (
                            <>
                                <Typography component="p" margin={1} marginLeft={2}>
                                    Envio por Starken, el envio queda por pagar y se envia a la sucursal o direccion a domicilio
                                </Typography>
                                <Typography component="p" margin={1} marginLeft={2} color={'red'}>
                                    Si queda en blanco se tomara la Dirección agregada anteriormente
                                </Typography>

                                <Box width={{ xs: '100%', }} margin={{ lg: 1 }} marginBottom={{ xs: 1 }} padding={1}>
                                    <TextField
                                        id="direccion-sucursal"
                                        label="Dirección de la sucursal o domicilio"
                                        variant="outlined"
                                        fullWidth
                                        value={direccionSucursal}
                                        onChange={handleDireccionChange}
                                    />
                                </Box>
                            </>
                        )}
                        <Button variant="contained" color="primary" sx={{margin:1, marginLeft:2}}>
                            Confirmar Compra
                        </Button>
                    </Container>

                </>
            );
        } else {
            if (userLog === true) {
                return (
                    <Typography component={'h5'}>Está logueado</Typography>
                );
            }
        }
    };

    return (
        <>
            {renderLogin()}
        </>
    );
};
