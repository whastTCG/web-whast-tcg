// Función para formatear la fecha en un formato legible
export const formatFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

//funcion para formatear a pesos chilenos
export const formatTotalCLP = (total) => {
    // Formatear el total con separador de miles y sin decimales
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(total);
};