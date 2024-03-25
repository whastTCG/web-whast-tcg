//import { async } from "rxjs";
import { Global } from "../urlGlobales";

export const Login = async (params, remember) => {

    let query=[];
    if (remember===true) {
       // console.log(remember);
         query=["remember=true"];
        
    }
    let body = JSON.stringify(params);
    // console.log(body);
    let opciones = {
        method: "POST",
        body: body,
        headers: {
            "Content-Type": "application/json"
        },
        credentials: 'include',
    };


    const peticion = await fetch(Global.urlUser + "login/?"+query, opciones);

    const datos = await peticion.json();
    
    console.log(datos.status);
    if (datos.status === "success") {
        return {
            datos,
            message: "logeado exitosamente"
        };
    } else {
       // console.log(datos +'aa');
        return {
            datos,
            status: ":error",
            message: "usuario no encontrado"
        };
    }
}


