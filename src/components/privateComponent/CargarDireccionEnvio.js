import React, { useEffect } from 'react'
import { Typography, Box, CardContent, Button, DeleteIcon } from '@mui/material';
import { traerDireccionEnvio } from '../../helper/direccionEnvio';
import { obtenerCookieToken } from '../../helper/obtenerCookies';
import { Cargando } from '../utilidad/Cargando';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { borrarDatosEnvioId } from '../../helper/borrar/borrarEnvioId';
import { useNavigate } from 'react-router-dom';


export const CargarDireccionEnvio = ({listaEnviosState, setListaEnviosState}) => {

    const navegar = useNavigate();

    const handleNavegar = (id) =>{
        navegar('/editar-datos-envio/'+id);
    }

    const borrarEnvio = async (id) => {
        try {
            const cookie = await obtenerCookieToken();
            await borrarDatosEnvioId(id, cookie);
            // Actualizar la lista después de borrar
            //usamos la funcion de callback en este caso toma la lista anterior y la actualiza usando el filter que toma todos los item junto con su id el cual lo compara
            // al id por parametro, si es igual guarda la lista nueva dejando fuera a ese item que tiene el mismo id que el ingresado por parametro
            setListaEnviosState(prevListaEnvios => prevListaEnvios.filter(item => item._id !== id));
            //setListaEnviosState(...listaEnviosState.filter(item => item._id !==id));
        } catch (error) {
            console.error('Error al borrar el envío', error);
        }
    }



   
   
    return (
        <div>
            {listaEnviosState.map((item) => (

                <article key={item._id}>
                    <CardContent sx={{ maxWidth: '1000px', margin: 2, background: 'lightgray' }}>
                        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                            Nombre Completo
                        </Typography>
                        <Typography variant="h6" component="div" sx={{ mb: 1 }}>
                            {item.nombreCompleto}
                        </Typography>
                        <hr />
                        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                            Rut
                        </Typography>
                        <Typography variant="h6" component="div" sx={{ mb: 1 }}>
                            {item.rut}
                        </Typography>
                        <hr />
                        <Typography sx={{ mb: 0.5, mt: 1.5 }} color="text.secondary">
                            Telefono
                        </Typography>
                        <Typography variant="h6">
                            {item.telefono}
                        </Typography>
                        <hr />

                        <Typography sx={{ mb: 0.5, mt: 1.5 }} color="text.secondary">
                            Direccion
                        </Typography>
                        <Typography variant="h6">
                            {item.direccion}, {item.comuna}, {item.ciudad}, {item.region}
                        </Typography>
                        <hr />
                        <Box mt={2} display="flex" marginLeft={-1} >
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<EditIcon />}
                                sx={{ mb: 1, margin: 1, width: '120px' }}
                                onClick={() => handleNavegar(item._id)}
                            >
                                Editar
                            </Button>
                             <Button
                                variant="contained"
                                color="primary"
                                startIcon={<DeleteForeverIcon />}
                                sx={{ mb: 1, margin: 1, width: '120px' }}
                                //debes usar la funcion anonima o callback para llamar la funcion borrar envio
                                //porque si llamas a la funcion directamente se ejecutara cada vez que se renderice el componente
                                onClick={() => borrarEnvio(item._id)}
                            >
                                Borrar
                            </Button> 
                          
                        </Box>
                    </CardContent>
                </article>
            ))}
        </div>
    )
}
