import { Global } from "./urlGlobales";

export const cambiarPass = async(pass, cookie) =>{

    console.log(pass)

    const bodyData = {
        pass: pass, // Nombre del campo en el backend: valor que estás enviando
      };

    const opciones = {
        method:'PUT',
        //debes mandafr el cambpo body como json  
        body:JSON.stringify(bodyData),
        headers:{
            "Content-Type": "application/json",
            Authorization: cookie.miCookie
        },
        credentials:'include'
    }

    const request = await fetch(Global.urlGlobal+"user/update-password", opciones)

    const  datos = await request.json();
    
    console.log(datos.message);
    return datos;
}