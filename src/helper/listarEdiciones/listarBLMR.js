export const conseguirCartasBLMR = async () => {
    const url = "http://localhost:3900/carta/listar-BLMR";
    let peticion = await fetch(url, {
        method: "GET",
    });
    let datos = await peticion.json();

    if (datos.status === "success") {
        return datos;
    }

    return datos;
    //console.log(cartasBLMR);
};