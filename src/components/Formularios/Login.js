import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';

import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Context } from '../../context/Context';
import { Login } from '../../helper/login/loginHelper';
import { debounceTime, Subject } from 'rxjs';

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

export default function SignInSide({ setAbrir }) {

  //use State

  const [saved, setSaved] = React.useState("notSender");
  //use Context
  const { userLog, setUserLog } = React.useContext(Context);
  const { sessionUser } = React.useContext(Context);
  const [rememberMe, setRememberMe] = React.useState('');



  const handledCheckBox = (e) => {
    setRememberMe(e.target.checked);
  }

  const renderizarMnesaje = () => {
    if (saved === "success") {
      return (<strong className='alert-success'>password correcto</strong>)
    } else {

    }
    if (saved === "error password") {
      return (<strong className='alert-error'>Password Incorrecto</strong>)
    };

    if (saved === "no existe") {
      return (<strong className='alert-error'>Ingrese un usuario valido o existente</strong>)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    //capturar los datos del formulario login
    const data = new FormData(event.currentTarget);
    search.next(data);


  };

  
  //con el use memo evitamos que se ejecute la funcion dentro nuevamente al momento de  renderizar nuevamente el componente ya sea por un cambio de estado
  React.useMemo(() => {
    const subcription = search$.pipe(debounceTime(1000)).subscribe(async (data) => {
      const objetoCompleto = {};
      //guardar los datos del formulario login en un objeto
      for (let [name, value] of data) {
        objetoCompleto[name] = value;
      }
      // console.log(objetoCompleto);
      
      //pasarle el objeto como parametro al metodo login que viene del helper
      const { datos } = await Login(objetoCompleto, rememberMe);
      
      if (datos.status === "success") {
        //setear como true el estado de la session
        setUserLog(true);
        //controlar el estado saved para mandar el mensaje correspondiente
        setSaved("success");

        //cerrar el lateral del login 
        setAbrir(false);
       
        localStorage.setItem("user", JSON.stringify(datos.userLogin));

        //guardamos los datos del usuario logeado 
        //usamos el sessionStorage por defecto ya que al cerrar el navegador o la pestaña se destruyen
        //en caso de que marque la opcion recordarme guardar las variables en el local storage ya que estan persisten aun despues de cerrar las pestañas o el navegador
      //   if (rememberMe === true) {
          
      //     //cargar l;a informacion del token en el local storage
      //     localStorage.setItem("token", datos.token);
      //     //cargar la informacion del usuaario en el local storage
      //     localStorage.setItem("user", JSON.stringify(datos.userLogin));
      //     localStorage.setItem("remember", 'true');
      //   } else {
           
      //     //cargar l;a informacion del token en el session storage
      //     sessionStorage.setItem("token", datos.token);
      //     //cargar la informacion del usuaario en el session storage
      //     sessionStorage.setItem("user", JSON.stringify(datos.userLogin));
      //     localStorage.setItem("remember", 'false');
          
        
      //   }
        
      // } else {
      //   if (datos.status === "error password") {
      //     setSaved("error");
      //   }
       }
      if (datos.status==='no existe') {
        setSaved('no existe')
      }
      if (datos.status === "error password") {
        setSaved("error password");
      }
      //console.log(datos.status)
    });
   
    return () => {
      return subcription.unsubscribe();
    };

  }, [rememberMe])
  




  const renderLogin = () => {

    if (userLog === false) {
      return (
        <ThemeProvider theme={defaultTheme}>
          <Box sx={{ display: "flex", flexDirection: "row-reverse" }}>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={() => setAbrir(false)}

            >

              <CloseIcon sx={{ width: { xs: 40, md: 40, sm: 50 }, height: 45, marginLeft: 0 }} />
            </IconButton>
          </Box>
          <Grid container component="main" sx={{ height: '100vh', width: { md: 290, xs: "380px" } }}>



            <Grid >
              <Box
                sx={{
                  my: 8,
                  mx: { xs: 12, md: 6 },
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  width: "200px",


                }}
              >
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                  <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                  Sign in
                </Typography>
                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                  {renderizarMnesaje()}
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Correo Electronico"
                    name="email"
                    autoComplete="email"
                    autoFocus
                  />

                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Contraseña"
                    type="password"
                    id="password"
                    autoComplete="current-password"

                  />
                  <FormControlLabel
                    control={<Checkbox value="remember" color="primary" name='remember' onChange={handledCheckBox} />}
                    label="Remember me"
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Iniciar Sesión
                  </Button>
                  <Grid container>
                    <Grid item xs>
                      <Link href="#" variant="body2">
                        restablecer mi contraseña
                      </Link>
                    </Grid>
                    <Grid item>
                      <Link href="/register" variant="body2">
                        {"No tienes cuenta? Ingresa Aqui "}
                      </Link>
                    </Grid>
                  </Grid>
                  <Copyright sx={{ mt: 5 }} />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </ThemeProvider>
      )
    } else {
      if (userLog === true) {
        return (
          <ThemeProvider theme={defaultTheme}>
            <Box sx={{ display: "flex", flexDirection: "row-reverse" }}>
              <IconButton
                size="small"
                edge="start"
                color="inherit"
                aria-label="open drawer"
                onClick={() => setAbrir(false)}

              >

                <CloseIcon sx={{ width: { xs: 40, md: 40, sm: 50 }, height: 45, marginLeft: 0 }} />
              </IconButton>
            </Box>
            <Grid container component="main" sx={{ height: '100vh', width: { md: 290, xs: "380px" } }}>
              <Grid >
                <Box
                  sx={{
                    my: -5,
                    mx: { xs: 12, md: 6 },
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: "200px",

                  }}
                >

                  <Typography component="span" variant="h7">
                    Bienvenido a Whast TCG
                  </Typography>
                  <Typography component="h5" variant="h5" >
                    {sessionUser.name} {sessionUser.surname}
                  </Typography>
                  <Typography component="a" variant="a" href='/customer' marginTop={2} sx={{ textDecoration: "none", color: 'black' }}>
                    Ir a Mi Cuenta
                  </Typography>

                  <Typography component="a" variant="a" href='/customer' marginTop={2} sx={{ textDecoration: "none", color: 'black' }}>
                    Editar Detalle De Contacto
                  </Typography>


                  <Typography component="a" variant="a" href='/logout' marginTop={2} sx={{ textDecoration: "none", color: 'black' }}>
                    Cerrar Sesion
                  </Typography>


                  <Box sx={{ mt: 1, display: "flex", flexDirection: "column" }}>

                    <Copyright sx={{ mt: 5 }} />
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </ThemeProvider>
        )
      }
    }

  }


  return (
    <>
      {renderLogin()}
    </>
  );
}