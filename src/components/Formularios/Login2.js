import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { debounceTime, Subject } from 'rxjs';
import { Context } from '../../context/Context';
import { Login } from '../../helper/login/loginHelper';
import { reenviarEmial } from '../../helper/reenviarEmail';
import { useRenderMensajes } from './useRenderMensajes';
//custom hook


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
//para iniciar sesion
let search = new Subject();
let search$ = search.asObservable();

//para reenviar correo
let enviar = new Subject();
let enviar$ = enviar.asObservable();

export default function Login2() {


  //use State

  const [saved, setSaved] = React.useState("notSender");
  //use Context
  const { setUserLog } = React.useContext(Context);

  const [rememberMe, setRememberMe] = React.useState('');

  const [correo, setCorreo] = React.useState('');
  const [correoActual, setCorreoActual] = React.useState('')
  //const correoRef = React.useRef(correo);

  const handledCheckBox = (e) => {
    setRememberMe(e.target.checked);
  }



  // const renderizarMnesaje = () => {
  //   if (saved === "success") {
  //     return (<Typography variant='h7' color={"green"} >password correcto!!</Typography>)
  //   }
  //   if (saved === "error password") {
  //     return (<Typography variant='h7' color={"orangered"} >Password Incorrecto</Typography>)
  //   };

  //   if (saved === "no existe") {
  //     return (<Typography variant='h7' color={"orangered"} >Ingrese un usuario valido o existente</Typography>)
  //   }

  //   if (saved === "no verificado") {
  //     return (<><Typography variant='h7' color={"orangered"} >Usuario No Verificado. Porfavor Verifica Tu Cuenta En Tu Correo Electronico </Typography>
  //       <Typography
  //         variant="body1"
  //         component="div" // Utilizamos un componente div en lugar de un enlace (<a>)
  //         style={{ cursor: 'pointer', textDecoration: 'underline' }} // Añadimos un estilo para simular un enlace
  //         onClick={handleResend} // Asignamos la función handleResend al evento onClick
  //       >
  //         Reenviar Correo de Verificación
  //       </Typography>
  //     </>
  //     )
  //   }
  // }

  const handleSubmit = async (event) => {
    event.preventDefault();
    //capturar los datos del formulario login
    const data = new FormData(event.currentTarget);
    search.next(data);

  };

  const handleResend = (e) => {
    setCorreoActual(e.target.value);

    enviar.next();
  }

  const { renderizarMnesaje } = useRenderMensajes(saved, handleResend);
  // React.useEffect(() => {
  //   correoRef.current = correo;
  // }, [correo]);


 

  //metodo con rxjs para reenviar correo
  React.useEffect(() => {
    const subcription = enviar$.pipe(debounceTime(1000)).subscribe(async () => {

      //console.log(correo);
      if (correoActual !== correo) {
        setSaved("usuario no encontrado");
        return
      };

      const datos = await reenviarEmial(correo, null);

      if (datos.status === "success") {
        setSaved("Correo Enviado!!!")

        setTimeout(() => {
          setSaved(' ')
        }, 10000);
      }

      if (datos.status === "usuario no encontrado") {
        setSaved("usuario no encontrado");

        setTimeout(() => {
          setSaved(' ')
        }, 10000);
      }
    })

    return () => {
      return subcription.unsubscribe();
    };
  }, [correo]);



  //con el use memo evitamos que se ejecute la funcion dentro nuevamente al momento de  renderizar nuevamente el componente ya sea por un cambio de estado
  React.useEffect(() => {
    const subcription = search$.pipe(debounceTime(1000)).subscribe(async (data) => {
      const objetoCompleto = {};

      for (let [name, value] of data) {
        objetoCompleto[name] = value;
      }


      const { datos } = await Login(objetoCompleto, rememberMe);

      if (datos.status === "no verificado") {
        setSaved("no verificado");
      }

      if (datos.status === "success") {

        setUserLog(true);

        setSaved("success");


        localStorage.setItem("user", JSON.stringify(datos.userLogin));


      }
      if (datos.status === 'no existe') {
        setSaved('no existe')
      }

      if (datos.status === "error password") {
        setSaved("error password");
      }

    });

    return () => {
      return subcription.unsubscribe();
    };

  }, [rememberMe])


  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs" sx={{ gridArea: "contenedor" }}>
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
            Iniciar sesión
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
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
              onChange={e => setCorreo(e.target.value)}
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
              label="Recuerdame"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Iniciar sesión
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="/login" variant="body2">
                  Olvidaste Tu Contraseña?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/register" variant="body2">
                  {"No Tienes Una Cuent? Registrate!!"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}