import  {Global}  from '../helper/urlGlobales';

export const obtenerCookieToken = async()=>{

    const request =  await fetch(Global.urlUser+"obtener-cookie", {
        method:"GET",
        //debes incluir este  codigo si quieres que las peticiones que tengan que ver con token auth y cookies funcionen
        credentials:"include"
    });

    const dato = await request.json();
    if (dato.status === 'success') {
        return dato;
    }
    if (dato.status=== "error") {
        //en caso de que la cookie tooken no este en el header procedemos a limpiar el local storage
        localStorage.clear();
        return dato;
       
    }
        
    

}