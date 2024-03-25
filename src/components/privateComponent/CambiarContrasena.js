import React, { useState, useEffect } from 'react';
import { Container, Paper, TextField, Button, Typography, Box, Alert } from '@mui/material';
import { Subject, debounceTime } from 'rxjs';
import { obtenerCookieToken } from '../../helper/obtenerCookies';
import { cambiarPass } from '../../helper/cambiarPass';
import { useNavigate } from 'react-router-dom';

let search = new Subject();
let search$ = search.asObservable();

export const CambiarContrasena = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'newPassword') setNewPassword(value);
    else if (name === 'confirmNewPassword') setConfirmNewPassword(value);
  };

  useEffect(() => {
    const subscription = search$.pipe(debounceTime(1000)).subscribe(async (data) => {
      const cookie = await obtenerCookieToken();

      if (newPassword !== confirmNewPassword) {
        setMessage('password no coinciden');
        setTimeout(() => {
          setMessage('');
          return;
        }, 4000);
        return;
      }

      const datos = await cambiarPass(newPassword, cookie);

      if (datos.status === 'error' && datos.message === 'error el password debe tener minimo 5 caracteres') {
        setMessage('password invalido');
      } else if (datos.status === 'success' && datos.message === 'password actualizado') {
        setMessage('actualizado');
        setTimeout(() => {
          navigate('/logout');
        }, 2000);
      }

      setTimeout(() => {
        setMessage('');
      }, 4000);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [newPassword, confirmNewPassword, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    search.next(data);
  };

  return (
    <Container maxWidth="xs" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: 50, marginBottom: 50 }}>
      <Paper elevation={3} style={{ padding: 20, width: '100%' }}>
        <Typography variant="h5" gutterBottom style={{ textAlign: 'center' }}>
          Cambiar Contraseña
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <TextField
            fullWidth
            type="password"
            label="Nueva Contraseña"
            name="newPassword"
            value={newPassword}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            InputLabelProps={{ style: { textAlign: 'center' } }}
          />
          <TextField
            fullWidth
            type="password"
            label="Confirmar Nueva Contraseña"
            name="confirmNewPassword"
            value={confirmNewPassword}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
          />
          <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 , marginBottom:2}}>
            <Button type="submit" variant="contained" color="primary">
              Cambiar Contraseña
            </Button>
          </Box>
          {message === 'password invalido' ? <Alert variant='filled' severity='warning' color='warning'>Password invalido, debe tener al menos 5 caracteres</Alert> : ''}
          {message === 'password no coinciden' ? <Alert variant='filled' severity='warning' color='warning'>La Contraseña no Coincide</Alert> : ''}
          {message === 'actualizado' ? <Alert variant='filled' severity='warning' color='success'>Contraseña Actualizada!!</Alert> : ''}
        </form>
      </Paper>
    </Container>
  );
};