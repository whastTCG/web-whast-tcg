/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, Grid, Alert } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { debounceTime, Subject } from 'rxjs';
import { updateContrasenaToken } from '../../helper/recuperarContrasenaEmail';

const defaultTheme = createTheme();


let enviar = new Subject();
let $enviar = enviar.asObservable();

export const RecuperarContrasenaEmailToken = () => {


    const navigate = useNavigate();
    const params = useParams();

    const [nuevaContrasena, setNuevaContrasena] = useState('');
    const [confirmarContrasena, setConfirmarContrasena] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [cargando, setCargando] = useState(false);
    const [token, setToken] = useState('');


    const handleSubmit = (event) => {
        event.preventDefault();
        if (nuevaContrasena !== confirmarContrasena) {
            setMensaje('Error: Las contraseñas no coinciden');
            return;
        }
        enviar.next();
    }

    useEffect(() => {
        const subcription = $enviar.pipe(debounceTime(1000)).subscribe(async () => {

            const datos = await updateContrasenaToken(nuevaContrasena, token, params.email);

            console.log(datos.message)
            if (datos.message === "Token inválido o expirado" && datos.status === "error") {
                setCargando(true);
                setMensaje("Error: Token invalido o Explirado");
            }

            if (datos.status === "Error") {
                setCargando(true);
                setMensaje("Error Inesperado intentelo denuevo");
            }
            if (datos.status === "success") {

                setMensaje("Su contraseña a sido actualizada ya puede volver a iniciar sesion");
                setCargando(true);

                setTimeout(() => {
                    navigate("/inicio");

                }, 8000);

            }

            setCargando(false);
        })

        return () => {
            return subcription.unsubscribe();
        }

    }, [nuevaContrasena, token])

    return (
        <ThemeProvider theme={defaultTheme}>
            <Grid container component="main" sx={{ height: 400, display: 'flex', justifyContent: 'center', alignContent: 'center', margin: 10 }}>
                <Grid item xs={12} sm={8} md={6} lg={3} >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            p: 4,
                            borderRadius: 2,
                            boxShadow: 3,
                            bgcolor: 'Background.paper'
                        }}>
                        <Typography component="h1" variant="h5" gutterBottom>
                            Restablecer contrasena
                        </Typography>
                        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
                            {mensaje && (
                                <Alert severity={mensaje.includes("Error") ? 'error' : 'success'} sx={{ mb: 2 }}>
                                    {mensaje}
                                </Alert>
                            )}
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="token"
                                value={token}
                                label="Codigo de verificacion"
                                onChange={(e) => setToken(e.target.value)}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="nuevaContrasena"
                                label="Nueva Contraseña"
                                type="password"
                                name='nuevaContrasena'
                                value={nuevaContrasena}
                                onChange={(e) => setNuevaContrasena(e.target.value)}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="confirmarContrasena"
                                label="Confirmar Contraseña"
                                type="password"
                                name='confirmarContrasena'
                                value={confirmarContrasena}
                                onChange={(e) => setConfirmarContrasena(e.target.value)}
                            />
                            <Button
                                type='submit'
                                fullWidth
                                variant='contained'
                                sx={{ mt: 3, mb: 2 }}
                                disabled={cargando}
                            >
                                {cargando ? 'Actualizando...' : 'Restablecer contraseña'}
                            </Button>

                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </ThemeProvider>
    )
}
