import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
//import { Global } from '../../helper/urlGlobales';
import { Alert } from '@mui/material';
import { Subject, debounceTime, } from 'rxjs';
import { useNavigate } from 'react-router-dom';
import {editarDatosUsuario} from '../../helper/editarDatosUser';
import { obtenerCookieToken} from '../../helper/obtenerCookies';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://whastTcg.cl/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

let search = new Subject();
let search$ = search.asObservable();

export function EditarDatosPersonales() {

  //estados para controlar mensajes en el formulario de registro
  const [save, setSave] = React.useState(null);
  const [existe, setExiste] = React.useState(false);
  const [faltanDatos, setFaltanDatos] = React.useState(false);
  const [valCorreo, setValCorreo] = React.useState(false);
  const [valNombrePass, setValNombrePass] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {

    event.preventDefault();
    const data = new FormData(event.currentTarget);
    search.next(data);

  };


  //con el use memo evitamos que se ejecute la funcion dentro nuevamente al momento de  renderizar nuevamente el componente ya sea por un cambio de estado
  React.useMemo(() => {
    const subcription = search$.pipe(debounceTime(1000)).subscribe(async (data) => {
      // console.log({
      //   email: data.get('email'),
      //   password: data.get('password'),
      // });
      //metodo para convertir un formdata de html5 a json


      const cookie = await obtenerCookieToken();
    

      const newUser = JSON.stringify(Object.fromEntries(data));
      
      //console.log(newUser);
      const pass = data.get('password');
      const passConfirm = data.get('passwordConfirm')

      if (pass !== passConfirm) {
        setMessage('password no coinciden');
        setTimeout(() => {
          setMessage('');
          return
        }, 4000);
      
      }

      const datos =  await editarDatosUsuario(newUser,cookie);

      //console.log(datos.message)
      if (datos.message === "usuario ya existe") {
        setExiste(true);
        setFaltanDatos(false);
      }
      if (datos.status === "success" && datos.message === "usuario actualizado") {
        setSave(true);
        setTimeout(() => {
          navigate('/logout');
        }, 2000);

      }

      if (datos.status === "error" && datos.message === "faltan datos por enviar") {
        setFaltanDatos(true);
        //setExiste(false);
      }

      if (datos.status === "error" && datos.message === "error") {
        setSave(false);
       // setExiste(false);
      }
      if (datos.message === "Email invalido o password invalido") {
        setValCorreo(true);
      
      }
      if (datos.message === "Email invalido o password invalido") {
        setValNombrePass(true);
      }

      setTimeout(() => {
        setExiste(false);
        setFaltanDatos(false);
        setValNombrePass(false);
        setValCorreo(false);
      },4000);

    });
    return () => {
      return subcription.unsubscribe();
    };

  }, [])



  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs" sx={{ gridArea: 'contenedor' , backgroundColor:'white', marginTop:5, marginBottom:5}} >
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Edita Tus Datos
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="name"
                  required
                  fullWidth
                  id="firstName"
                  label="Nombre"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Apellido"
                  name="surname"
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Correo Electronico"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Contraseña"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="passwordConfirm"
                  label="Confirmar Contraseña"
                  type="password"
                  id="passwordConfirm"
                  autoComplete="new-password"
                />
              </Grid>
              {/* <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox value="allowExtraEmails" color="primary" />}
                  label="I want to receive inspiration, marketing promotions and updates via email."
                />
              </Grid> */}
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Confirmar 
            </Button>
            <Grid container justifyContent="center">
              <Grid item>
               
              </Grid>
            </Grid>
          </Box>
          {existe === true ? <Alert variant="filled" severity="info" color='warning' >Este correo ya esta registrado!!</Alert> : ""}
          {save === true ? <Alert variant='filled' severity='success' color='success'>Datos Actualizados Correctamente</Alert> : ""}
          {faltanDatos === true ? <Alert variant='filled' severity='info' color='warning'>Rellene todos los campos</Alert> : ''}
          {save === false ? <Alert variant='filled' severity='warning' color='warning'>occurio un error inesperado</Alert> : ''}
          {valCorreo === true ? <Alert variant='filled' severity='warning' color='warning'>Correo no valido</Alert> : ''}
          {valNombrePass === true ? <Alert variant='filled' severity='warning' color='warning'>Nombre debe tener al menos 3 caracteres y el Password 5</Alert> : ''}
          {message === 'password no coinciden' ? <Alert variant='filled' severity='warning' color='warning'>La Contraseña no Coincide</Alert> : ''}
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}