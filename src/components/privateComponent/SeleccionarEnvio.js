import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../../context/Context';
import { obtenerCookieToken } from '../../helper/obtenerCookies';
import { traerDireccionEnvio } from '../../helper/direccionEnvio';
import { CardContent, Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemText, styled, Container, TextField, Alert } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useNavigate } from 'react-router-dom';
import { validarRut, validarTelefono, validarNombre } from '../../helper/validarFormularioEnvio';
import { isValidEmail } from '../../helper/validarEmail';
import { Cargando } from '../utilidad/Cargando';

//import { getDollarExchangeRate } from '../../helper/UsdToCLP';

const StyledCardContent = styled(CardContent)({
  maxWidth: '1000px',
  margin: '2px',
  background: 'lightgray',
});



const StyledDialog = styled(Dialog)({
  '& .MuiDialog-paper': {
    minWidth: '300px',
  },
});



export const SeleccionarEnvio = () => {
  const { userLog, totalCarrito, setTotalCarrito } = useContext(Context);
  const [listaEnvioState, setListaEnvioState] = useState([]);
  const [direccionSeleccionada, setDireccionSeleccionada] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [carritoInfo, setCarritoInfo] = useState([]);
  const [alertaVisible, setAlertaVisible] = useState('');
  const [fono, setFono] = useState('');
  const [loadign, setLoading] = useState(true);
  const [formulario, setFormulario] = useState({
    nombreCompleto: '',
    rut: '',
    telefono: fono,
    region: '',
    direccion: '',
    comuna: '',
    ciudad: '',
    email: ''
    // ... otros campos del formulario ...
  });

  // const [tasaDeCambio, setTasaDeCambio] = useState(1000);
  const navegar = useNavigate();

  //useEffect para verificar si el carro esta vacio, en caso que este vacio redireccionar al inicio
  useEffect(() => {
    //llamar datos del carrito del local storage 
    const carritoFromLocalStorage = JSON.parse(localStorage.getItem('carrito'));

    if (!carritoFromLocalStorage || carritoFromLocalStorage.length === 0) {
      navegar("/inicio");
    }
  }, [])

  useEffect(() => {

    const traerDatosEnvio = async () => {
      try {
        const cookie = await obtenerCookieToken();
        const { listaEnvios } = await traerDireccionEnvio(cookie);
        setListaEnvioState(listaEnvios);
        setLoading(false);

        //asignar automaticamente la primera direccion si la lista no esta vacia
        if (listaEnvios.length > 0) {
          setDireccionSeleccionada(listaEnvios[0]);
        }else{
          navegar("/agregar-datos-envio");
        }
      } catch (error) {
        console.error('Error al obtener los datos de dirección de envío', error);
      }
    };

    if (userLog === true) {

      // Obtener el carrito del localStorage
      const carritoGuardado = JSON.parse(localStorage.getItem('carrito') || '[]');
      setCarritoInfo(carritoGuardado);
      traerDatosEnvio();
    } else {
      const carritoGuardado = JSON.parse(localStorage.getItem('carrito') || '[]');
      setCarritoInfo(carritoGuardado);
    }
    //obtener carrito del local storage
    const carritoGuardado = JSON.parse(localStorage.getItem('totalCarrito') || '[]');

    //obtener el valor del dolar desde nuestro helper 
    // const valorDolar = async () => {

    //   const valor = await getDollarExchangeRate();
    //   setTasaDeCambio(valor.rates.CLP);
    // }
    // valorDolar();
    setTotalCarrito(carritoGuardado);
  }, [userLog]);

  useEffect(() => {
    setTimeout(() => {
      setAlertaVisible('');
    }, 30000);

  }, [alertaVisible])


  //useEffect para cargar el formulario en caso que exista 
  useEffect(() => {
    // Cargar información del formulario temporal desde el localStorage
    const formularioTemporal = JSON.parse(localStorage.getItem('formularioTemporal')) || {};

    if (Object.values(formularioTemporal).some(value => value !== null && value !== undefined && value !== "")) {
      // Verificar si alguna propiedad del objeto tiene algún valor
      setFono(formularioTemporal.telefono);
      // Actualizar el estado del formulario con la información cargada
      setFormulario({
        nombreCompleto: formularioTemporal.nombreCompleto || '',
        rut: formularioTemporal.rut || '',
        telefono: formularioTemporal.telefono || '',
        region: formularioTemporal.region || '',
        direccion: formularioTemporal.direccion || '',
        comuna: formularioTemporal.comuna || '',
        ciudad: formularioTemporal.ciudad || '',
        email: formularioTemporal.email || '',
        // ... otras propiedades del formulario ...
      });
    }
  }, []);

  const handleSeleccionarDireccion = (direccion) => {
    setDireccionSeleccionada(direccion);
    handleCerrarDialog();
  };

  const handleAbrirDialog = () => {
    setOpenDialog(true);
  };

  const handleCerrarDialog = () => {
    setOpenDialog(false);
  };

  const handleEditarDireccion = (id) => {
    // Implementa la lógica para editar la dirección seleccionada
    navegar('/editar-datos-envio2/' + id);
  };

  const handleBorrarDireccion = () => {
    // Implementa la lógica para borrar la dirección seleccionada
    console.log('Borrar dirección');
  };

  const validarFono = (inputValue) => {
    // Usa una expresión regular para permitir solo números y el signo más
    const telefonoRegex = /^[0-9+]*$/;
    return telefonoRegex.test(inputValue);
  };


  const handleInputChange = (event) => {
    const { name, value } = event.target;

    // Validar el formato del teléfono solo si se está modificando el campo de teléfono
    if (name === "telefono") {
      // Realiza la validación antes de actualizar el estado
      if (validarFono(value)) {
        // Actualiza el estado solo si la entrada es válida
        setFono(value);
      }
    }

    // Actualizar el estado general del formulario
    setFormulario((prevFormulario) => ({
      ...prevFormulario,
      [name]: value,
    }));
  };

  const handleEnviarFormularioSession = () => {
    localStorage.setItem('formularioTemporal', JSON.stringify(direccionSeleccionada));
    navegar('/confirmar-pago')
  }

  const handleEnviarFormulario = () => {


    // Validar los campos del formulario

    // if (validarCampos(formulario) !== null) {
    //   setAlertaVisible("errorCampos");
    //   console.log('error en los campos no estan completos o no son validos');
    //   return;
    // }

    if (validarNombre(formulario.nombreCompleto) !== null) {
      setAlertaVisible('errorNombre');
      //console.log("ingrese un nombre valido");
      return;
    }
    if (validarRut(formulario.rut) !== null) {
      setAlertaVisible('errorRut');
      //console.log("ingrese un rut valido");
      return;
    }
    if (validarTelefono(formulario.telefono) !== null) {
      setAlertaVisible("errorTelefono");
      // console.log("ingrese un telefono valido")
      return;
    }

    if (!isValidEmail(formulario.email)) {
      setAlertaVisible("errorEmail");
      return;
    }

    if (!formulario.nombreCompleto || !formulario.rut || !formulario.telefono || !formulario.region || !formulario.ciudad || !formulario.comuna || !formulario.direccion) {
      alert('Todos los campos son obligatorios. Por favor, complete todos los campos.');
      return;
    };
    // Guarda la información del formulario en el localStorage
    console.log('guardado correctamente');
    localStorage.setItem('formularioTemporal', JSON.stringify(formulario));
    navegar('/confirmar-pago')
  }


  const calcularPrecioCLP = (price) => {
    // const precioNumerico = parseFloat(price.replace(/[^0-9.-]+/g, ''));
    // const CLP = precioNumerico * tasaDeCambio;

    // Formatear el número con puntos y el signo de peso
    const precioFormateado = Math.ceil(price).toLocaleString('es-CL', {
      style: 'currency',
      currency: 'CLP'
    });

    return precioFormateado;
  };

  const AddressCard = ({ direccion, onEdit }) => {
    return (
      <Box p={2} boxShadow={0} mb={0} display={{ xl: 'flex' }}>
        <StyledCardContent>
          <Box bgcolor="white" p={2} boxShadow={10} borderRadius={3}>
            <Typography variant="h6" component="div" sx={{ mb: 1 }}>
              Dirección de Envío
            </Typography>
            <Typography variant="subtitle1">
              Nombre: {direccion.nombreCompleto}
            </Typography>
            <Typography variant="subtitle1">
              Direccion: {direccion.direccion}
            </Typography>
            <Typography variant="subtitle1">
              Comuna: {direccion.comuna}
            </Typography>
            <Typography variant="subtitle1">
              Ciudad: {direccion.ciudad}
            </Typography>
            <Typography variant="subtitle1">
              Region: {direccion.region}
            </Typography>
            <Typography variant="subtitle1">
              Telefono: {direccion.telefono}
            </Typography>
            <hr />
            <Box display="flex">
              <Button variant="outlined" color="primary" startIcon={<EditIcon />} sx={{ mb: 1, margin: 1, width: '100%' }} onClick={onEdit}>
                Editar Dirección
              </Button>
              <Button variant="outlined" color="primary" startIcon={<LocationOnIcon />} sx={{ mb: 1, margin: 1, width: '100%' }} onClick={handleAbrirDialog}>
                Seleccionar Datos de envío
              </Button>
            </Box>
          </Box>
        </StyledCardContent>
      </Box>
    );
  };

  const renderLog = () => {
    if (userLog === true) {

      if (loadign) {
        return <><Cargando /></>
      }
      return (
        <Container maxWidth="xl" sx={{ display: 'flex', justifyContent: 'center' }} >
          <Box display="flex" justifyContent="center" mt={3} flexDirection={{ xs: 'column', lg: 'row' }}>
            {/* Columna izquierda */}
            <Box width={{ xs: '100%', lg: 'auto' }} mb={{ xs: 2, lg: 0 }} justifyContent={'center'} flex={1} >
              <Typography variant="h5" sx={{ justifyContent: 'center', alignContent: 'center', display: 'flex' }}>Dirección de entrega  </Typography>

              {direccionSeleccionada && <AddressCard direccion={direccionSeleccionada} onEdit={() => handleEditarDireccion(direccionSeleccionada._id)} onDelete={handleBorrarDireccion} isSelected={true} />}
              <StyledDialog open={openDialog} onClose={handleCerrarDialog}>
                <DialogTitle>Otras direcciones de envío</DialogTitle>
                <DialogContent>
                  <List>
                    {listaEnvioState.map((direccion) => (
                      <ListItem key={direccion._id} button onClick={() => handleSeleccionarDireccion(direccion)}>
                        <ListItemText
                          primary={`${direccion.nombreCompleto}, ${direccion.direccion}, ${direccion.comuna}, ${direccion.ciudad}, ${direccion.region}, ${direccion.telefono}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCerrarDialog}>Cerrar</Button>
                </DialogActions>
              </StyledDialog>
            </Box>

            {/* Columna derecha */}
            <Box width={{ xs: 'auto', lg: 'auto' }} pl={{ xs: 0, lg: 2 }} flex={1} >
              <Box >
                <Typography variant="h5" mt={1}>
                  Resumen
                </Typography>
                <Box marginTop={3.5} boxShadow={2} bgcolor={'white'} borderRadius={2} p={1} maxWidth={{ xl:'xl', lg: 'lg' }} height={{ xl: 300, lg: 270 }} sx={{ overflow: 'auto', boxShadow: 10, padding: 2 }}>
                  {carritoInfo.map(item => {
                    return (
                      <Box key={item._id} >
                        <Typography> Nombre: {item.cardText}</Typography>
                        <Typography> Cantidad: {item.cantidad}</Typography>
                        <Typography> Precio Unitario: {calcularPrecioCLP(item.cardPrice)}</Typography>
                        <hr />
                      </Box>
                    )
                  }

                  )}
                  {/* Contenido del resumen, por ejemplo, el total */}
                  <Typography variant="h6" component="div" sx={{ mb: 1 }}>Total</Typography>
                  <Typography>{totalCarrito}</Typography>
                </Box>
              </Box>
              <Box display="flex" justifyContent="flex-start" mt={2} marginBottom={2}>
                <Button variant="contained" color="primary" onClick={handleEnviarFormularioSession} >
                  Siguiente
                </Button>
              </Box>
            </Box>
          </Box>
        </Container>
      );
    } else {
      return (
        <>
          <Container maxWidth="lg">
            <Box display="flex" justifyContent="center" mt={3} flexDirection={{ xs: 'column', lg: 'row' }}>
              {/* Columna izquierda */}
              <Box width={{ xs: '100%', lg: '33%' }} mb={{ xs: 2, lg: 0 }} pr={{ xs: 0, lg: 2 }} >
                <Typography variant="h5" sx={{
                  marginLeft: { lg: 7.5, xl: 9 },
                  '@media (max-width: 1440px)': {
                    marginLeft: 0,
                  },
                }}>
                  Dirección de entrega
                </Typography>
                <Box marginTop={3.5} boxShadow={2} bgcolor={'white'} borderRadius={2} p={1} maxWidth={{ xl: 530, lg: 600 }} height={{ xl: 450, lg: 450 }} sx={{ overflow: 'auto', }}>
                  {/* Mostrar la alerta si es visible */}
                  {alertaVisible === "errorNombre" ? <Alert severity='warning'>
                    Ingrese el Nombre y Apellido
                  </Alert> : ''
                  }

                  {alertaVisible === "errorRut" ? <Alert severity='warning'>
                    Ingrese Un Rut Valido
                  </Alert> : ''
                  }

                  {alertaVisible === "errorCampos" ? <Alert severity='warning'>
                    Debe llenar todos los campos
                  </Alert> : ''
                  }

                  {alertaVisible === "errorTelefono" ? <Alert severity='warning'>
                    Ingrese un telefono Valido
                  </Alert> : ''
                  }
                  {alertaVisible === "errorEmail" ? <Alert severity='warning'>
                    Ingrese Un Correo Electronico Valido
                  </Alert> : ''
                  }

                  <form >
                    {/* Agrega los campos del formulario con manejo de eventos */}
                    <TextField required label="Nombre y Apellido" name="nombreCompleto" value={formulario.nombreCompleto} onChange={handleInputChange} fullWidth sx={{ mt: 1 }} InputProps={{
                      inputProps: {
                        maxLength: 40
                      }
                    }} />
                    <TextField required label="Rut" name="rut" value={formulario.rut} onChange={handleInputChange} fullWidth sx={{ mt: 1 }} InputProps={{
                      inputProps: {
                        maxLength: 12
                      }
                    }} />
                    <TextField required label="Telefono" name="telefono" value={fono} onChange={handleInputChange} type="tel" // Establece el tipo de entrada como teléfono
                      InputProps={{
                        inputProps: {
                          pattern: "[0-9\\+]*",
                          maxLength: 12,
                        },
                      }} fullWidth sx={{ mt: 1 }} />
                    <TextField required label="Region" name="region" value={formulario.region} onChange={handleInputChange} fullWidth sx={{ mt: 1 }} InputProps={{
                      inputProps: {
                        maxLength: 40,

                      }
                    }} />
                    <TextField required label="Ciudad" name="ciudad" value={formulario.ciudad} onChange={handleInputChange} fullWidth sx={{ mt: 1 }} InputProps={{
                      inputProps: {
                        maxLength: 40
                      }
                    }} />
                    <TextField required label="Comuna" name="comuna" value={formulario.comuna} onChange={handleInputChange} fullWidth sx={{ mt: 1 }} InputProps={{
                      inputProps: {
                        maxLength: 40
                      }
                    }} />
                    <TextField required label="Dirección" name="direccion" value={formulario.direccion} onChange={handleInputChange} fullWidth sx={{ mt: 1 }}
                      InputProps={{
                        inputProps: {
                          maxLength: 40
                        }
                      }} />
                    <TextField required label="Email" name="email" value={formulario.email} onChange={handleInputChange} fullWidth sx={{ mt: 1 }}
                      InputProps={{
                        inputProps: {
                          maxLength: 40
                        }
                      }} />
                    {/* ... otros campos del formulario ... */}
                  </form>
                </Box>
              </Box>

              {/* Columna derecha */}
              <Box width={{ xs: '100%', lg: '67%' }} pl={{ xs: 0, lg: 2 }} marginBottom={2}>
                <Box >
                  <Typography variant="h5" sx={{
                    marginLeft: { lg: 10, xl: 24 },
                    '@media (max-width: 1440px)': {
                      marginLeft: 0,
                    },
                  }}>
                    Resumen
                  </Typography>
                  <Box marginTop={3.5} boxShadow={2} bgcolor={'white'} borderRadius={2} p={1} maxWidth={{ xl: 530, lg: 600 }} height={{ xl: 450, lg: 450 }} sx={{ overflow: 'auto' }}>
                    {carritoInfo.map(item => (
                      <Box key={item._id} margin={1}>
                        <Typography> Nombre: {item.cardText}</Typography>
                        <Typography> Cantidad: {item.cantidad}</Typography>
                        <Typography> Precio Unitario: {calcularPrecioCLP(item.cardPrice)}</Typography>
                        <hr />
                      </Box>
                    ))}
                    {/* Contenido del resumen, por ejemplo, el total */}
                    <Typography variant="h6" component="div" sx={{ mb: 1 }}>Total</Typography>
                    <Typography>{totalCarrito}</Typography>
                  </Box>
                </Box>

                {/* Botón "Siguiente" al final del contenedor de la columna derecha para el usuario no logeado */}
                <Box display="flex" justifyContent="flex-start" mt={2}>
                  <Button variant="contained" color="primary" onClick={handleEnviarFormulario} >
                    Siguiente
                  </Button>
                </Box>
              </Box>
            </Box>
          </Container>
        </>
      );
    };
  }
  return <>{renderLog()}</>;
};

