import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Typography, Link, Grid, Alert, CircularProgress } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { recuperarContrasenaEmailToken } from '../../helper/recuperarContrasenaEmail';
import { Subject, debounceTime } from 'rxjs'
import { validateEmail } from '../../helper/validarEmail';
const defaultTheme = createTheme();

let enviar = new Subject();
let enviar$ = enviar.asObservable();

export default function RecuperarContrasenaEmail() {

  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(true);


  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isEmailValid) return;
    enviar.next();
  };

  const handleSetCorreo = (event) => {
    const correoNuevo =  event.target.value || "";
    setEmail(correoNuevo);
    validateEmail(correoNuevo, setIsEmailValid);

  } 

  useEffect(() => {

    const subcription = enviar$.pipe(debounceTime(1000)).subscribe( async () => {

      setIsLoading(true);
      const datos = await recuperarContrasenaEmailToken(email);
      setIsLoading(false);

      if (datos.status === 'success') {
        setMessage('Correo enviado, Revise Su Bandeja De Entrada');
        setTimeout(() => {
          setMessage('');
        }, 10000);
      } else {
        setMessage('Error, Revise que su correo electrónico esté escrito correctamente');
        setTimeout(() => {
          setMessage('');
        }, 10000);
      }
    })

    return () => {
      return subcription.unsubscribe();
    }

  }, [email]);


  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: 400, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Grid item xs={12} sm={8} md={6} lg={3}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              p: 4,
              borderRadius: 2,
              boxShadow: 3,
              bgcolor: 'background.paper',
            }}
          >
            <Typography component="h1" variant="h5" gutterBottom>
              Recuperar contraseña
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
              {message && (
                <Alert severity={message.includes('error') ? 'error' : message.includes('success') ? 'success' : 'warning'} sx={{ mb: 2 }}>
                  {message}
                </Alert>
              )}
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Correo electrónico"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(event) => handleSetCorreo(event)}
                error={!isEmailValid}
                helperText={!isEmailValid ? 'Por favor, ingrese un correo electrónico válido' : ''}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={24} /> : 'Enviar correo de recuperación'}
              </Button>
              <Grid container justifyContent="center">
                <Grid item>
                  <Link href="/login" variant="body2">
                    {'¿Recuerdas tu contraseña? Inicia sesión aquí'}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}