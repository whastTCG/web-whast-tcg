import { Global } from "../urlGlobales";

export const crearDatosEnvio = async(form, cookie) =>{
  
    const opciones = {
        method: "POST",
        body: form,
        headers:{
            "Content-Type": "application/json",
            Authorization: cookie.miCookie
        },
        credentials: "include"
        
    };

    const request = await fetch(Global.urlGlobal+"datos-envio/crear-datos-envio", opciones);

    const datos = await request.json();

    //console.log(datos.status);

    return datos;
}