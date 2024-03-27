import { interval, from } from 'rxjs';
import { switchMap, catchError,tap, startWith } from 'rxjs/operators';

const fetchDolarToClp = async () => {
    try {
      const response = await fetch('https://open.er-api.com/v6/latest/USD',{
        method:"GET"
      });
      const data = await response.json();
      return data.rates.CLP;
    } catch (error) {
      console.error('Error en fetchDolarToClp:', error);
      throw error;
    }
  };
  
  export const startDolarTimer = (intervalTime = 3600000) => {
    console.log("startDolarTimer")
    const source = interval(intervalTime).pipe(
        
        tap(() => console.log('Intervalo activado')),
        tap(() => console.log('Antes de switchMap')),
        switchMap(() => from(fetchDolarToClp())),
        tap((data) => console.log('Después de switchMap:', data)),
        
        catchError((error) => {
          console.error('Error en el temporizador (catchError):', error);
          return from(getCachedDolarToClp());
        })
      );
      
    return from(source);
  };
  
  const getCachedDolarToClp = async () => {
    
    const cachedData = localStorage.getItem('dolarToClp');
    return cachedData ? parseFloat(cachedData) : 900; 
  };

// Helper para obtener la tasa de cambio del dólar
export const getDollarExchangeRate = async () => {
    try {
        // Obtener la información almacenada en caché
        const cachedData = localStorage.getItem('dollarExchangeRateData');
        const cachedTimestamp = localStorage.getItem('dollarExchangeRateTimestamp');

        // Verificar si la caché está presente y es válida (menos de 24 horas)
        if (cachedData && cachedTimestamp) {
            const timestampDiff = Date.now() - parseInt(cachedTimestamp, 10);
            const hoursElapsed = timestampDiff / (1000 * 60 * 60);

            if (hoursElapsed < 24) {
                // Devolver la información almacenada en caché
                return JSON.parse(cachedData);
            }
        }

        // Realizar una nueva solicitud si la caché no está presente o es antigua
        console.log('peticiones')
        const response = await fetch('https://open.er-api.com/v6/latest/USD');
        const data = await response.json();

        // Almacenar en caché la nueva información con la marca de tiempo actual
        localStorage.setItem('dollarExchangeRateData', JSON.stringify(data));
        localStorage.setItem('dollarExchangeRateTimestamp', Date.now());

        return data;
    } catch (error) {
        console.error('Error al obtener la tasa de cambio:', error);
    }
};