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
import { Global } from '../../helper/urlGlobales';
import { Alert } from '@mui/material';
import { Subject, debounceTime, } from 'rxjs';
import { useNavigate } from 'react-router-dom';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
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

export function Register() {
  //estados para controlar mensajes en el formulario de registro
  const [save, setSave] = React.useState(null);
  const [existe, setExiste] = React.useState(false);
  const [faltanDatos, setFaltanDatos] = React.useState(false);
  const [valCorreo, setValCorreo] = React.useState(false);
  const [valNombrePass, setValNombrePass] = React.useState(false);
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
      const newUser = JSON.stringify(Object.fromEntries(data));
      console.log(newUser);

      const request = await fetch(Global.urlUser + "/register", {
        method: "POST",
        body: newUser,
        headers: {
          "Content-Type": "application/json"
        }
      });

      const requestData = await request.json();

      //console.log(requestData.message)
      if (requestData.message === "usuario ya existe") {
        setExiste(true);
        setFaltanDatos(false);
      }
      if (requestData.status === "success" && requestData.message === "usuario registrado correctamente") {
        setSave(true);
        setTimeout(() => {
          navigate('/login');
        }, 2000);

      }

      if (requestData.status === "error" && requestData.message === "faltan datos por enviar") {
        setFaltanDatos(true);
        //setExiste(false);
      }

      if (requestData.status === "error" && requestData.message === "error al guardar el usuario") {
        setSave(false);
       // setExiste(false);
      }
      if (requestData.message === "correo invalido") {
        setValCorreo(true);
      
      }
      if (requestData.message === "el nombre debe tener minimo 3 caracter y las password 5") {
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
      <Container component="main" maxWidth="xs" sx={{ gridArea: 'contenedor' }} >
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
            Sign up
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
                  label="First Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="surname"
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
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
              Sign Up
            </Button>
            <Grid container justifyContent="center">
              <Grid item>
                <Link href="#" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
          {existe === true ? <Alert variant="filled" severity="info" color='warning' >Este correo ya esta registrado!!</Alert> : ""}
          {save === true ? <Alert variant='filled' severity='success' color='success'>Registrado correctamente ya puede iniciar session</Alert> : ""}
          {faltanDatos === true ? <Alert variant='filled' severity='info' color='warning'>Rellene todos los campos</Alert> : ''}
          {save === false ? <Alert variant='filled' severity='warning' color='warning'>occurio un error inesperado</Alert> : ''}
          {valCorreo === true ? <Alert variant='filled' severity='warning' color='warning'>Correo no valido</Alert> : ''}
          {valNombrePass === true ? <Alert variant='filled' severity='warning' color='warning'>Nombre debe tener al menos 3 caracteres y el Password 5</Alert> : ''}
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}