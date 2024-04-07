import { Global } from "./urlGlobales";


export const validarCuenta = async (_id) => {


    try {

        const request = await fetch(Global.urlGlobal + "email/verificar-usuario/?_id=" + _id, {
            method: "PUT"
        });

        const datos = await request.json();
       // console.log(datos.status)
        return datos
    } catch (error) {
        return error
    }
}