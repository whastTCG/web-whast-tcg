import  {Global}  from '../helper/urlGlobales';

export const obtenerValorDolar = async()=>{

    const request =  await fetch(Global.urlGlobal+"carta/valorDolar", {
        method:"GET",
        //debes incluir esta basura de codigo si quieres que las peticiones que tengan que ver con token auth y cookies funcionen
        // credentials:"include"
    });

    const dato = await request.json();
    if (dato.status === 'success') {
        return dato.valorDolar;
    }
    if (dato.status=== "error") {
      
        return dato;
       
    }
}