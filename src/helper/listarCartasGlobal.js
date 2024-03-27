
export const conseguirCartasGlobal = async (edicion) => {
    const url = "http://localhost:3900/carta/"+edicion;
    let peticion = await fetch(url, {
        method: "GET",
    });
    let datos = await peticion.json();

    if (datos.status === "success") {
        return datos;
    }

    return [];
    //console.log(cartasBLMR);
};