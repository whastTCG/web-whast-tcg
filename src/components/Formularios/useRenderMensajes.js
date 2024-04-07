import { Typography } from '@mui/material'
import React from 'react'

export const useRenderMensajes = (saved, handleResend) => {

    const renderizarMnesaje = () => {
        if (saved === "success") {
            return (<Typography variant='h7' color={"green"} >password correcto!!</Typography>)
        }
        if (saved === "error password") {
            return (<Typography variant='h7' color={"orangered"} >Password Incorrecto</Typography>)
        };

        if (saved === "no existe") {
            return (<Typography variant='h7' color={"orangered"} >Ingrese un usuario valido o existente</Typography>)
        }
        if (saved === "Correo Enviado!!!") {
            return (<Typography variant='h7' color={"green"} >Correo Enviado. Revise Su Bandeja De Entrada</Typography>)
        }

        if (saved === "usuario no encontrado") {
            return (<Typography variant='h7' color={"red"} >Ingrese Su Correo Correctamente</Typography>)
        }

        if (saved === "no verificado") {
            return (<><Typography variant='h7' color={"orangered"} >Usuario No Verificado. Porfavor Verifica Tu Cuenta En Tu Correo Electronico </Typography>
                <Typography
                    variant="body1"
                    component="div" // Utilizamos un componente div en lugar de un enlace (<a>)
                    style={{ cursor: 'pointer', textDecoration: 'underline' }} // Añadimos un estilo para simular un enlace
                    onClick={handleResend} // Asignamos la función handleResend al evento onClick
                >
                    Reenviar Correo de Verificación
                </Typography>
            </>
            )
        }
    }
   return {renderizarMnesaje};
}

export default useRenderMensajes;