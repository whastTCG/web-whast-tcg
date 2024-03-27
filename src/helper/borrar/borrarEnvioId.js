import { Global } from "../urlGlobales";


export const borrarDatosEnvioId = async (id, cookie) => {

    const query = [`id=${id}`];

    const opciones = {
        method: "DELETE",
        headers: {
            //'Content-Type': "application/json",
            Authorization: cookie.miCookie
        },
        credentials: "include"
    };

    const request = await fetch(Global.urlGlobal + "datos-envio/borrar-datos-envio?" + query, opciones);

    const datos = await request.json();
    console.log(datos);
    return datos;

}
