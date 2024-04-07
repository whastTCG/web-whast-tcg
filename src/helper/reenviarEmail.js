import { Global } from "./urlGlobales"

export const reenviarEmial = async (email, _id) => {

    
    try {
        const query = [];

        if (email) {
            query.push(`email=${email}`);
        }

        if (_id) {
            query.push(`_id=${_id}`);
        }

        const request = await fetch(Global.urlGlobal+"email/reenviar-email/?"+query.join("&"), {
            method:"PUT"
        });

        let datos = await request.json();
        
        console.log(datos.status);
        return datos;
    } catch (error) {

        return error;
    }

}