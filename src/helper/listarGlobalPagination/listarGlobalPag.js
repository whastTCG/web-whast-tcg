//import { firstValueFrom, debounceTime, distinctUntilChanged, of, from, fromEvent, switchMap, BehaviorSubject } from 'rxjs';
//import { fromFetch } from 'rxjs/fetch';
//import { distinct } from 'rxjs/operators';
import { Global } from '../urlGlobales';
//const wea = new BehaviorSubject("");




export const listarGlobalPaginado = async (page,busqueda,categoria,filtro) => {
   // console.log("peticion api busqueda");
    const query = []
    //pregunta si la pagina es enviada por parametro en caso contrario se coloca por defecto la pagina 1
    if (!page) {
        page = 1;
        query.push("page=1");
    }else{
        query.push(`page=${page}`);
    }
    //pregunta si existe la busqueda , en caso que exista se coloca en la url de lo contrario se deja vacio y por el metodo en la api listara todos los item 
    if (busqueda) {
        query.push(`search=${busqueda}`);
        
    }
    // pregunta por la categoria en este caso la edicion de la carta en caso de que se envie vacio o no exista el metodo procedera a listar todas las cartas
    if (categoria) {
        query.push(`category=${categoria}`);
        
    }

    if (filtro) {
        query.push(`filtro=${filtro}`);
    }

    //console.log(e);
 
    let peticion = await fetch(
        Global.url + "listar-pag?" + query.join("&"), {
        method: "GET",
    });
    
    let dato = await peticion.json();
    //console.log(dato);
    if (dato.status === "success") {
        
        //console.log(e);
        return {
            dato,
            mensaje:"encontrado"
        } 
           
        

    }else{
        return {
            mensaje: "no se encontro"
        }
    }
    
    

};
