import { Global } from "./urlGlobales";

export const editarDatosUsuario = async(form, cookie) =>{
  
    const opciones = {
        method: "PUT",
        body: form,
        headers:{
            "Content-Type": "application/json",
            Authorization: cookie.miCookie
        },
        credentials: "include"
        
    };

    const request = await fetch(Global.urlGlobal+"user/update", opciones);

    const datos = await request.json();

    //console.log(datos.status);

    return datos;
}