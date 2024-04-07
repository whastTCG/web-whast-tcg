import React, { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom';
import { validarCuenta } from '../../helper/verificarCuenta';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { Typography } from '@mui/material';
import { debounceTime, Subject } from 'rxjs';
import { reenviarEmial } from '../../helper/reenviarEmail';


let enviar = new Subject();
let $enviar = enviar.asObservable();

export const VerificarCuenta = () => {

    const [cargando, setCargando] = useState(true);
    const [mensajePag, setMensajePag] = useState('');

    let { _id } = useParams();

    useEffect(() => {
        const verificandoCuenta = async () => {

            const usuarioVerificado = sessionStorage.getItem('usuarioVerificado'); // Obtener el indicador de verificación del almacenamiento local
            const reenviado = sessionStorage.getItem('reenviado'); //obtener indicador de si se reenvio el correo o no
            if (usuarioVerificado === 'true') {
                // El usuario ya ha sido verificado, no es necesario realizar la verificación nuevamente
                setCargando(false);
                setMensajePag("La Cuenta Ya a Sido Verificada");
                return;
            }

            if (reenviado === "true") {
                setMensajePag("Correo Reenviado");
                setCargando(false);
                return;
            }

            const datos = await validarCuenta(_id);
            //console.log(datos.message)
            if (datos.status === "success") {

                if (datos.message === "cuenta ya a sido verificada") {
                    setCargando(false);
                    setMensajePag("La Cuenta Ya a Sido Verificada");

                }
                else {
                    setCargando(false);
                    setMensajePag("Cuenta Verificada Con Exito!!")
                    sessionStorage.setItem('usuarioVerificado', 'true');
                }


            }

            if (datos.status === "Error") {

                setMensajePag("error al verificar cuenta")
                setCargando(false);
            }

            if (datos.status === "expirado") {
                setMensajePag("Este Link a expirado");
                setCargando(false);
            }

        }

        verificandoCuenta();
    }, [])


    useMemo(() => {
        const subcription = $enviar.pipe(debounceTime(1000)).subscribe(async () => {
            const reenviado = sessionStorage.getItem('reenviado'); //obtener indicador de si se reenvio el correo o no

            if (reenviado === "true") {
                setMensajePag("Correo Reenviado");
                setCargando(false);
                return;
            }
            const datos = await reenviarEmial(null, _id);

            if (datos.status === "success") {
                setMensajePag("Correo Reenviado");
                sessionStorage.setItem('reenviado', 'true');
            }

            if (datos.status === "usuario no encontrado") {
                setMensajePag("error al encontrar usuario");
            }

            if (datos.status === "Error") {
                setMensajePag("Error");
            }

        });

        return () => {
            return subcription.unsubscribe();
        };

    }, [])

    const handleResend = () => {
        enviar.next();
    }



    if (cargando === true) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', padding: 3 }}>
                <CircularProgress size={100} />
            </Box>
        )
    }


    return (
        <>
            {mensajePag === "error al verificar cuenta" ? (
                <Stack sx={{ width: '100%' }} spacing={2}>
                    <Alert severity="warning" >
                        {mensajePag}
                    </Alert>
                </Stack>
            ) : mensajePag === "La Cuenta Ya a Sido Verificada" ? (
                <Stack sx={{ width: '100%' }} spacing={2}>
                    <Alert severity="success">
                        {mensajePag}
                    </Alert>
                </Stack>
            ) : mensajePag === "Este Link a expirado" ? (
                <Stack sx={{ width: '100%' }} spacing={2}>
                    <Alert severity="warning">
                        {mensajePag}
                    </Alert>
                    <Typography
                        variant="body1"
                        component="div" // Utilizamos un componente div en lugar de un enlace (<a>)
                        style={{ cursor: 'pointer', textDecoration: 'underline' }} // Añadimos un estilo para simular un enlace
                        onClick={handleResend} // Asignamos la función handleResend al evento onClick
                    >
                        Reenviar Correo de Verificación
                    </Typography>
                </Stack>
            ) : mensajePag === "Error" ? (
                <Stack sx={{ width: '100%' }} spacing={2}>
                    <Alert severity="error">
                        {mensajePag}
                    </Alert>
                </Stack>
            ) : mensajePag === "Correo Reenviado" ? (
                <Stack sx={{ width: '100%' }} spacing={2}>
                    <Alert severity="success">
                        {mensajePag}
                    </Alert>
                </Stack>
            ) : mensajePag === "error al encontrar usuario" ? (
                <Stack sx={{ width: '100%' }} spacing={2}>
                    <Alert severity="error">
                        {mensajePag}
                    </Alert>
                </Stack>
            ) : mensajePag === "Cuenta Verificada Con Exito!!" ? (
                <Stack sx={{ width: '100%' }} spacing={2}>
                    <Alert severity="success">
                        {mensajePag}
                    </Alert>
                </Stack>
            ) : <></>}
        </>

    )
}
