import React, { useEffect } from 'react';
import { Customer } from './Customer';
import Box from '@mui/material/Box';


import Grid from '@mui/material/Grid';
import { Typography } from '@mui/material';
import { Context } from '../../context/Context';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import '../../style/DatosEnvio.css';
import { CargarDireccionEnvio } from './CargarDireccionEnvio';
import { obtenerCookieToken } from '../../helper/obtenerCookies';
import { traerDireccionEnvio } from '../../helper/direccionEnvio';
import { Cargando } from '../utilidad/Cargando';
export const DatosEnvio = () => {

    const { sessionUser } = React.useContext(Context);


    const [listaEnviosState, setListaEnviosState] = React.useState([]);
    const [loading, setLoading] = React.useState(true);


    

    useEffect(() => {

        const traerEnvios = async () => {

            //usamos trycatch ya que usaremos un estado de loading porque nuestro useEffect tiene un metodo asyncrono estro provoca que primero se renderice el componente
            // y luego ejecute el codigo del useEffect por lo tanto al mapear la lista de envios esta estara en undefined porque aun no se ejecuta el codigo de nuestro useEffect
            //esto se soluciona usando un estado de loading
            try {
                //traemos la cookie 
                //usamos el metodo del helper para obtener la cookie
                const cookie = await obtenerCookieToken();

                const { listaEnvios } = await traerDireccionEnvio(cookie)


                setListaEnviosState(listaEnvios);
            } catch (error) {
                console.error('Error al obtener los datos de dirección de envío', error);
            } finally {
                setLoading(false);
            }

        }
        traerEnvios();


    }, [])



    const navegar = useNavigate();

    const editarDatos = () => {
        navegar('/editar-datos');
    }

    const cambiarContrasena = () => {
        navegar('/cambiar-contrasena');
    }

    const agregarEnvio = () =>{
        navegar('/agregar-datos-envio')
    }
    const card = (
        <React.Fragment>
            <CardContent sx={{ maxWidth: '300px' }}>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    Nombre Completo
                </Typography>
                <Typography variant="h5" component="div" sx={{ mb: 1 }}>
                    {sessionUser.name + " " + sessionUser.surname}
                </Typography>
                <Typography sx={{ mb: 0.5, mt: 1.5 }} color="text.secondary">
                    Correo Electronico
                </Typography>
                <Typography variant="h5">{sessionUser.email}</Typography>

                <Box mt={2} display="flex" flexDirection="column">
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<EditIcon />}
                        sx={{ mb: 1, width: '100%' }}
                        onClick={editarDatos}
                    >
                        Editar Datos
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<EditIcon />}
                        sx={{ width: '100%' }}
                        onClick={cambiarContrasena}
                    >
                        Editar Contraseña
                    </Button>
                </Box>
            </CardContent>

        </React.Fragment>
    );


    const addShippingSection = (
        <Box
            sx={{
                display: 'block',
                backgroundColor: '#f5f5f5',
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '10px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                marginTop: '20px',
                marginLeft: { lg: 2, sm: 2, md: 2 },
                width: { lg: 1000, md: 500 },

            }}
        >
            <Typography variant="h5" sx={{ mb: 2, marginLeft: 3 }}>
                Agregar una dirección de envío
            </Typography>

            {
                listaEnviosState.length < 3 ? <Button
                    variant="contained"
                    color="primary"
                    sx={{ marginLeft: 3 }}
                    onClick={agregarEnvio}
                >
                    Agregar
                </Button> : <Typography variant="h5" color='crimson' sx={{ mb: 2, marginLeft: 3 }}>
                    Puedes tener un maximo de 3 direcciones de envio
                </Typography>
            }

            <hr style={{ margin: '20px 0', borderBottom: '1px solid #ddd' }} />
            {/* {aqui va el componente que lista las direcciones de envio agregadas} */}

            <CargarDireccionEnvio listaEnviosState={listaEnviosState} setListaEnviosState={setListaEnviosState} />
        </Box>

    );


    if (loading) {
        return <Cargando />; // Puedes mostrar un indicador de carga aquí
    }

    return (
        <>
            <Customer />
            <Box sx={{ flexGrow: 1 }}>
                <Box marginLeft={{ xl: 11, lg: 0, md: 0, xs: 0, sm: 0 }} className='container-personal'>
                    <Grid container spacing={3} >

                        <Grid item xs display={{ xs: 'none', md: 'block', sm: 'block' }} />

                        <Grid item xs={10} sx={{ mx: 'auto' }}>
                            <Box
                                display={{ sm: 'flex', md: 'flex', xs: 'block' }}
                                marginLeft={{ xs: 0, md: 0, xl: '20px' }} // Ajusta según sea necesario
                            >
                                <Box
                                    sx={{
                                        display: { sm: 'block', md: 'block', xs: 'block' },
                                        backgroundColor: '#f5f5f5',
                                        border: '1px solid #ddd',
                                        borderRadius: '8px',
                                        padding: '10px',
                                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                        marginTop: '20px',
                                        marginBottom: '20px',
                                    }}
                                >
                                    <Box sx={{ minWidth: 275 }}>
                                        <Card variant="outlined">{card}</Card>
                                    </Box>
                                </Box>
                                {addShippingSection}
                            </Box>
                        </Grid>

                        <Grid item xs display={{ xs: 'none', md: 'block', sm: 'block' }} />
                    </Grid>
                </Box>
            </Box>



        </>
    );
}
