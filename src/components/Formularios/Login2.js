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

export default function Login2() {
  

  //use State

  const [saved, setSaved] = React.useState("notSender");
  //use Context
  const {  setUserLog } = React.useContext(Context);
 
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
      
      for (let [name, value] of data) {
        objetoCompleto[name] = value;
      }
     
      
      const { datos } = await Login(objetoCompleto, rememberMe);
      
      if (datos.status === "success") {
        setUserLog(true);
        
        setSaved("success");

        
        localStorage.setItem("user", JSON.stringify(datos.userLogin));


       }
      if (datos.status==='no existe') {
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
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            {renderizarMnesaje()}
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
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
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
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