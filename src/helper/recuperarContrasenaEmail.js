import { Global } from "./urlGlobales";

export const recuperarContrasenaEmail = async (email) => {

    try {

        const query = [];

        if (email) {
            query.push(`email=${email}`);
        } else {
            query.push(`email=${'error'}`);
        }

        const request = await fetch(Global.urlGlobal + "user/recuperar-password/?" + query, {
            method: "PUT"
        })

        const datos =  await request.json();
        console.log(datos.status);
        return datos
    } catch (error) {
        return {
            status: 'error',
            message: 'Error al recuperar la contraseña',
            error,
        };
    }
}


export const recuperarContrasenaEmailToken = async (email) => {

    try {
        
        const request = await fetch(Global.urlGlobal + "user/recuperar-pass-token/?email="+email,{
            method : "POST"
        })

        const datos = await request.json();

        console.log(datos.status);

        return datos;
    } catch (error) {
        return{
            status : "error",
            message: "error al reenviar el correo de recuperacion",
            error
        }
    }
}

export const updateContrasenaToken = async(contrasena, token, email) =>{

    try {
        
        const params = JSON.stringify({email, token, contrasena})
        const request = await fetch(Global.urlGlobal + "user/update-contrasena-token", {
            method:"POST",
            headers: {
                'Content-Type': 'application/json',
              },
            body: params
        });

        const data = await request.json();
       // console.log(data.message)
        // if (!request.ok) {
        //     throw new Error(data.message);
        // }
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}