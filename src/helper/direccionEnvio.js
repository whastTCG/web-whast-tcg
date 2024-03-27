import { Global } from "./urlGlobales";

export const traerDireccionEnvio = async(cookie)=>{

    const opciones = {
        method:'GET',
        headers:{
            'Content-Type': "application/json",
            Authorization: cookie.miCookie
        },
        credentials: "include"
    }

    const request =  await fetch(Global.urlGlobal+"datos-envio/list-direccion-envios", opciones);

    const datos = await request.json();

    //console.log(datos.status);

    return datos;
}