import { Global } from '../helper/urlGlobales';


export const listarPorId = async (id) => {
    if (id) {
        let peticion = await fetch(
            Global.url+"listar-uno/"+id, {
            method: "GET",
        });

        
        let  {consulta, status} = await peticion.json();
        
        if (status === "success") {
            return consulta;
        }
    }else{

        return "error no se ingreso el ID del item";
    }
  


}