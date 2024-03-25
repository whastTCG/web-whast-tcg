import { Global } from "../urlGlobales";

export const edtiarDatosEvio = async (form, cookie, id) => {
    

        
        const opciones = {
            method:"PUT",
            body:form,
            headers:{
                "Content-Type":"application/json",
                "Authorization":cookie.miCookie
            },
            credentials:"include"
        }

        const request =  await fetch(Global.urlGlobal+"datos-envio/update?id="+id, opciones);
        console.log(request)
       
        const datos = await request.json();


        
        //console.log(datos.status);
    
        return datos;

    

}