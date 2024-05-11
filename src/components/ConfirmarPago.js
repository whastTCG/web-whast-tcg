import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../context/Context';
import { Container, Typography, Box, FormControl, FormLabel, RadioGroup, Radio, FormControlLabel, TextField, Button } from '@mui/material';
import { Subject, debounceTime } from 'rxjs';
import axios from 'axios';
import { Global } from "../helper/urlGlobales"
import { useNavigate } from 'react-router-dom';
import InfoPostVenta from './Formularios/InfoPostVenta';
import { Cargando } from './utilidad/Cargando';


let enviar = new Subject();
let enviar$ = enviar.asObservable();

export const  ConfirmarPago = () => {
    const { userLog, totalCarrito, setTotalCarrito, carrito, setCarrito, sessionUser } = useContext(Context);


    const [casillaCorreo, setCasillaCorreo] = useState('');
    const [entregaPresencial, setEntregaPresencial] = useState(false); // Estado para controlar si se seleccionó entrega presencial
    const [direccionSucursal, setDireccionSucursal] = useState('');
    const [cargando, setCargando] = useState(false);
    const [datosEnvioTemporal, setDatosEnvioTemporal] = useState([]);
    const [mensaje, setMensaje] = useState('');
    // estado para confirmar compra
    const [compraConfirmada, setCompraConfirmada] = useState(false);
    //estado para guardar el codigo de la ultima venta efectuada 
    const [codigoVenta, setCodigoVenta] = useState('')
    //estado para guardar el email al que fue enviado el detalle de la compra
    const [email, setEmail] = useState();

    const navegar = useNavigate();



    //effect para llamar a los datos del local storage
    useEffect(() => {


        //llamar datos del carrito del local storage
        const carritoFromLocalStorage = JSON.parse(localStorage.getItem('carrito'));

        if (!carritoFromLocalStorage || carritoFromLocalStorage.length === 0) {
            navegar("/inicio");
        }

        setCarrito(carritoFromLocalStorage);

        //llamar datos de envio del usuario no registrado
        const datosEnvioFromLocalStorage = JSON.parse(localStorage.getItem('formularioTemporal'));

        if (!datosEnvioFromLocalStorage || datosEnvioFromLocalStorage.length === 0) {
            navegar("/inicio");
        }

        setDatosEnvioTemporal(datosEnvioFromLocalStorage);

        setEmail(datosEnvioFromLocalStorage.email);

    }, []);

    const handleCasillaChange = (event) => {
        setCasillaCorreo(event.target.value);
        const value = event.target.value;
        if (value === 'Entrega presencial en Santiago') {
            setEntregaPresencial(true);
        } else {
            setEntregaPresencial(false);
        }

    };

    const handleDireccionChange = (event) => {
        setDireccionSucursal(event.target.value);
    };

    const handLeCompra = (e) => {
        setCargando(true);

        if (casillaCorreo === "" || direccionSucursal === "") {
            setMensaje("Seleccione una opción");
            setCargando(false);
            return
        }
        enviar.next();
    }

    useEffect(() => {
        const subcription = enviar$.pipe(debounceTime(1000)).subscribe(async () => {
            try {


                if (!userLog) {

                    //aqui la logica en caso que el cliente compre sin tener cuenta

                    //llamar al elpoint ppara crear la venta
                    const request = await axios.post(Global.urlGlobal + "venta/crear-venta", {
                        usuarioEntidad: "662f74166283e7cdee65819b",
                        productos: carrito,
                        metodoPago: "Transferencia"
                    });



                    if (request.data.status !== "success") {
                        setMensaje("Error al procesar la venta")
                        // console.log(request.data.message);
                        return
                    }

                    if (request.data.status === "success") {
                        //console.log(request.data);
                        //luego llamar al endpoint para agregar los datos de envio del usuario no registrado
                        // console.log("respuesta: " + request.data.status);
                        const request2 = await axios.post(Global.urlGlobal + "envio-no-registrado/crear-datos-envio", {
                            params: datosEnvioTemporal,
                            entregaPresencial: entregaPresencial,
                            casillaCorreo: casillaCorreo,
                            direccionSucursal: direccionSucursal,
                            productos: carrito,
                            metodoPago: "Transferencia",
                            total: totalCarrito

                        });


                    }
                    setCompraConfirmada(true);
                    // console.log(request2.data);

                };
                if (userLog === true) {
                    console.log(sessionUser.id)
                   // llamar al elpoint ppara crear la venta
                    const request = await axios.post(Global.urlGlobal + "venta/crear-venta", {
                        usuarioEntidad: sessionUser.id,
                        productos: carrito,
                        metodoPago: "Transferencia",
                        casillaCorreo,
                        direccionSucursal,
                        entregaPresencial: entregaPresencial,
                        idEnvio: datosEnvioTemporal._id
                    });
                    // console.log(request.data.status)
                    // console.log(request.data.message)
                    if (request.data.status === "success") {
                        setCompraConfirmada(true);
                        setEmail(sessionUser.email)
                    }
                }

            } catch (error) {
                console.error("Error al crear la venta ", error);
            } finally {

                setCargando(false);
            }
        })

        return () => {
            return subcription.unsubscribe();
        }
    }, [carrito, datosEnvioTemporal, casillaCorreo, direccionSucursal, entregaPresencial, sessionUser]);


    useEffect(() => {


        //funcion para obtener el id de la venta

        const obtenerIdVenta = async () => {
            const request = await axios.get(Global.urlGlobal + "venta/buscar-ultima-venta");
            setCodigoVenta(request.data.venta._id);
            // console.log(request.data.venta._id)
        }

        if (compraConfirmada === true) {

            //limpiar el carrito global 
            setCarrito([]);
            localStorage.clear("carrito");

            obtenerIdVenta();
            //redireccionar
            //navegar('/inicio');
        }
    }, [compraConfirmada])

    useEffect(() => {
        const totalCarritoString = localStorage.getItem('totalCarrito')

        if (!totalCarritoString || totalCarritoString.length === 0) {
            navegar("/inicio");
        } else {
            setTotalCarrito(totalCarritoString.replace(/"/g, ''));
        }


    }, [])



    const renderLogin = () => {

        return (
            <>

                <Container maxWidth='lg'>

                    <Box display={'flex'} justifyContent={'center'} mt={2} flexDirection={{ xs: 'column', lg: 'row' }} marginBottom={3}>
                        <Box width={{ xs: '100%', }} margin={{ lg: 1 }} marginBottom={{ xs: 1 }} padding={1}>
                            <FormControl component="fieldset">
                                {mensaje === "Seleccione una opción" ? <Typography color='red' variant='h7' >Debe Marcar Una Opción</Typography> : <FormLabel component="legend">Selecciona casilla de correo</FormLabel>}

                                <RadioGroup aria-label="casillaCorreo" name="casillaCorreo" value={casillaCorreo} onChange={handleCasillaChange}>
                                    <FormControlLabel value="Chile Express" control={<Radio />} label="Chile Express" />
                                    <FormControlLabel value="Starken" control={<Radio />} label="Starken" />
                                    <FormControlLabel value="Entrega presencial en Santiago" control={<Radio />} label="Entrega presencial en Santiago" />
                                </RadioGroup>
                            </FormControl>
                        </Box>
                        <Box width={{ xs: '100%' }} margin={{ lg: 1 }} padding={1}>
                            <Typography variant='h5' marginBottom={2}>Total</Typography>
                            <Typography variant='h5'> {totalCarrito}</Typography>
                            <Typography variant='p'>Total sin envio ya que el envio es por pagar</Typography>
                            {/* Aquí va el componente que muestra el total del carrito */}
                        </Box>

                    </Box>


                    {entregaPresencial && ( // Si se seleccionó entrega presencial, muestra la dirección
                        <Typography component="p" margin={1} marginLeft={2}>
                            Dirección de entrega presencial: "por determinar"
                        </Typography>
                    )}
                    {casillaCorreo === 'Chile Express' && (
                        <>
                            <Typography component="p" marginLeft={2}>
                                Envio por Chile express, el envio queda por pagar y se envia a la sucursal destinada
                            </Typography>

                            <Box width={{ xs: '100%', }} margin={{ lg: 1 }} marginBottom={{ xs: 1 }} padding={1} >
                                <TextField
                                    id="direccion-sucursal"
                                    label="Dirección de la sucursal"
                                    variant="outlined"
                                    fullWidth
                                    value={direccionSucursal}
                                    onChange={handleDireccionChange}
                                    required={true}
                                />
                            </Box>
                        </>
                    )}
                    {casillaCorreo === 'Starken' && (
                        <>
                            <Typography component="p" margin={1} marginLeft={2}>
                                Envio por Starken, el envio queda por pagar y se envia a la sucursal o direccion a domicilio
                            </Typography>
                            <Typography component="p" margin={1} marginLeft={2} color={'red'}>
                                Si queda en blanco se tomara la Dirección agregada anteriormente
                            </Typography>

                            <Box width={{ xs: '100%', }} margin={{ lg: 1 }} marginBottom={{ xs: 1 }} padding={1}>
                                <TextField
                                    id="direccion-sucursal"
                                    label="Dirección de la sucursal o domicilio"
                                    variant="outlined"
                                    fullWidth
                                    value={direccionSucursal}
                                    onChange={handleDireccionChange}
                                />
                            </Box>
                        </>
                    )}


                    <Button disabled={cargando} onClick={(e) => handLeCompra(e)} variant="contained" component="form" color="primary" sx={{ margin: 1, marginLeft: 2 }}>
                        {cargando ? 'Cargando...' : 'Confirmar Compra'}
                    </Button>
                </Container>

            </>
        );

    };



    return (
        <>
            {!compraConfirmada ? (
                renderLogin()
            )
                : (codigoVenta && email ? (
                    <InfoPostVenta codigoVenta={codigoVenta} email={email} />
                ) : (
                    <Typography>
                        <Cargando />
                    </Typography>
                )
                )};

        </>
    );
};
