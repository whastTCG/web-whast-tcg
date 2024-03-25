import React, { useEffect, useState } from 'react';
import { Container, Button, Grid, TextField, Avatar, Typography, Box, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Subject, debounceTime } from 'rxjs';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { obtenerCookieToken } from '../../helper/obtenerCookies';
import { crearDatosEnvio } from '../../helper/crear/crearDireccionEnvio';

let search = new Subject();
let search$ = search.asObservable();

const AgregarDatosEnvio = () => {

  const [message, setMessage] = useState('');
  const [telefono, setTelefono] = useState('');
  const [rut, setRut] = useState('');

  const navegar = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    data.set("telefono", telefono);
    data.set("rut", rut);
    search.next(data);
  }

  const validarTelefono = (inputValue) => {
    // Usa una expresión regular para permitir solo números y el signo más
    const telefonoRegex = /^[0-9+]*$/;
    return telefonoRegex.test(inputValue);
  };

  const handleTelefonoInput = (event) => {
    const inputValue = event.target.value;

    // Realiza la validación antes de actualizar el estado
    if (validarTelefono(inputValue) || inputValue === "") {
      // Actualiza el estado solo si la entrada es válida
      setTelefono(inputValue);
    }
  };

  const validarRut = (inputValue) => {
    const rutRegex = /^[0-9k.-]*$/;
    return rutRegex.test(inputValue);
  }

  const handlRutInput = (event) => {
    const inputValue = event.target.value;

    if (validarRut(inputValue) || inputValue === "") {
      setRut(inputValue);
    }
  }


  useEffect(() => {

    const subcription = search$.pipe(debounceTime(2000)).subscribe(async (data) => {

      const cookie = await obtenerCookieToken();

      const form = JSON.stringify(Object.fromEntries(data));

      const datos = await crearDatosEnvio(form, cookie);

      console.log(datos.message);

      console.log(datos.message);
      if (datos.message === "ingrese campos validos") {
        setMessage("campos invalidos");
      }

      if (datos.status === "success") {
        setMessage("Creado");

        setTimeout(() => {
          navegar("/datos-envio");
        }, 3000);
      }

      setTimeout(() => {
        setMessage('');
      }, 4000);

    });

    return () => {
      return subcription.unsubscribe();
    }
  }, [])

  return (
    <>
      <Container component='main' maxWidth='xs' sx={{ gridArea: 'contenedor', backgroundColor: 'white', marginTop: 6, marginBottom: 6 }}>
        <Box sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LocalShippingIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Agregar Datos De Envio
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} >
                <TextField
                  autoComplete="given-name"
                  name="nombreCompleto"
                  required
                  fullWidth
                  id="nombreCompleto"
                  label="Nombre Completo"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} >
                <TextField
                  required
                  fullWidth
                  id="rut"
                  label="Rut"
                  name="rut"
                  inputProps={{
                    pattern: "[0-9\\\\k.]*"
                  }}
                  value={rut}
                  onChange={handlRutInput}
                />
              </Grid>
              <Grid item xs={12} sm={6} >
                <TextField
                  required
                  fullWidth
                  id="telefono"
                  label="Telefono"
                  name="telefono"
                  type="tel" // Establece el tipo de entrada como teléfono
                  InputProps={{
                    inputProps: {
                      pattern: "[0-9\\+]*",
                      maxLength: 12,
                    },
                  }}
                  value={telefono}
                  onChange={handleTelefonoInput}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="region"
                  label="Region"
                  name="region"

                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="ciudad"
                  label="Ciudad"
                  name="ciudad"

                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="comuna"
                  label="Comuna"
                  name="comuna"

                />
              </Grid>
              <Grid item xs={12} >
                <TextField
                  required
                  fullWidth
                  id="direccion"
                  label="Dirección"
                  name="direccion"

                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Confirmar
            </Button>
          </Box>

        </Box>
        {message === "campos invalidos" ? <Alert variant="filled" severity="info" color='warning' >Rellene todos los campos correctamente</Alert> : ""}
        {message === "Creado" ? <Alert variant="filled" severity="info" color='success' >Direccion Creada</Alert> : ""}
      </Container>
    </>
  );
};

export default AgregarDatosEnvio;
