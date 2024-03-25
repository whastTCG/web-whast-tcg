//import { firstValueFrom, debounceTime, distinctUntilChanged, of, from, fromEvent, switchMap, BehaviorSubject } from 'rxjs';
//import { fromFetch } from 'rxjs/fetch';
//import { distinct } from 'rxjs/operators';
import { Global } from '../helper/urlGlobales';
//const wea = new BehaviorSubject("");




export const BuscarCarta = async (e) => {
    //let datos = e.target; 
    if (e === "") {
        return [];
    }
    //console.log(e);
 
    let peticion = await fetch(Global.url + "buscar/" + e, {
        method: "GET",
    });
    let dato = await peticion.json();
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




// export const BuscarCarta = (e) => {

//     let datos = e.target;
//     if (datos.value === "" || datos.value === null) {
//         return [];
//     }


//     console.log("paso");
//     const url = "http://localhost:3900/BLMR/buscar/" + datos.value;
//     wea.next(url);
//     const data2 = wea.pipe(debounceTime(1000),distinct(e => e)).subscribe(r => {

//         const data = fromFetch(r).pipe(distinct(e => e), switchMap(res => {
//             console.log({
//                 res
//             })
//             if (res.ok) {
//                 return res.json();
//             } else {
//                 return null
//             }
//         })).subscribe({
//             next: (value) => {

//                 console.log({
//                     value
//                 })
//                 if (value && value.status === "success") {
//                     return value.articuloEncontrado;
//                 } else {
//                     return [];
//                 }
//             }, error: (err) => {
//                 console.log({ err });
//             }
//         });

//         return data
//     })

//     return data2;

// };


//console.log(cartasBLMR);



