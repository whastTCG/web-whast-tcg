import { useEffect, useState } from 'react';
import './App.css';
import { MainRouter } from './components/ruoute/MainRouter';
import { Context } from './context/Context';
import { Global } from './helper/urlGlobales';
import { obtenerValorDolar } from './helper/obtenerValorDolar';
import axios from 'axios';
//import {timer, repeat} from 'rxjs';
//importar para guardar las cookies
//import Cookies from 'js-cookie';
import { obtenerCookieToken } from '../src/helper/obtenerCookies';
import { Cargando } from './components/utilidad/Cargando';

function App() {

  const [cartasBLMR, setCartasBLMR] = useState([]);
  const [parametros, setParametros] = useState("");
  const [valorBusqueda, setValorBusqueda] = useState("");
  const [qtPage, setQtPage] = useState(10);
  const [cantidadItem, setCantidadItem] = useState(0);
  const [filtro, setFiltro] = useState('');
  const [carrito, setCarrito] = useState([]);
  const [totalCarrito, setTotalCarrito] = useState('');

  //useState loadign lo usamos para esperar que se actualicen los estados antes que cargue toda la appi ya que el usseEffect que usamos para setear todos nuestros estados globales de session
  // tiene un metodo asyncrono entonces los componente se cargan primero y que useEffect, con esto evitamos que eso suceda 
  const [loading, setLoading] = useState(true);



  //parametro de usuarios logeados
  const [userLog, setUserLog] = useState(false);

  const [sessionUser, setSessionUser] = useState(null);



  useEffect(() => {

    //metodo para verificar en cada componente si el usuario esta on ( logeado)
    const authUser = async () => {


      //cargar el carrito de compras de forma global en la api, si no existe no hacer nada
      const carritoLocalStorage = localStorage.getItem('carrito');
      if (carritoLocalStorage) {
        setCarrito(JSON.parse(carritoLocalStorage));
      }

      //solo puedes obtener las cookies asi en caso de que esten puestas en el backend como httpOnly false 
      // const cookiesToken = Cookies.get();
      //console.log(cookiesToken.token);
      let user = localStorage.getItem('user');
      if (!user) {

        setLoading(false);
        setSessionUser({});
        return false
      }
      //usamos el metodo del helper para obtener la cookie
      const cookie = await obtenerCookieToken();

      if (cookie.status === 'error') {
        setUserLog(false);
        setSessionUser({});
        setLoading(false);
        return false;
      }


      if (!cookie.miCookie || !user) {
        setUserLog(false);
        setSessionUser({});
        setLoading(false);

        return false;
      }

      const userObj = JSON.parse(user);

      const userId = userObj.id;

      const request = await fetch(Global.urlUser + "profile/" + userId, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: cookie.miCookie
        }
      });

      const data = await request.json();

      setSessionUser(data.userIdentity);
      setUserLog(true);
      setLoading(false);
    };

    authUser();

  }, []);

  useEffect(() => {
    const actualizarCarritoConNuevoDolar = async (item) => {
      try {
        // Llama al backend para obtener la información más reciente del producto
        const response = await axios.get(Global.urlGlobal + `carta/listar-uno/${item._id}`);
        const producto = response.data.consulta;


        console.log('metodo actualizar')
        // Actualiza el precio del producto en el carrito con el nuevo valor del dólar
        return {
          ...item,
          cardPrice: producto.cardPrice,
        };
      } catch (error) {
        console.error(`Error al obtener información del producto con ID ${item._id}`, error);
        return item; // Si hay un error, conserva el elemento original en el carrito
      }
    };

    const dolarCarrito = async () => {
      try {
        // Obtenemos el valor del dólar
        const dolar = await obtenerValorDolar();

        // Convertimos el valor del localStorage a número
        const valorDolarLocalStorage = parseFloat(localStorage.getItem('valorDolar'));

        // Verificamos si el valor del dólar existe en el local storage
        if (isNaN(valorDolarLocalStorage) || valorDolarLocalStorage !== parseFloat(dolar)) {

          // Si es diferente, actualizamos el valor en el localStorage
          localStorage.setItem('valorDolar', dolar);

          // Obtén los elementos del carrito del localStorage
          const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

          // Actualiza los precios en el carrito con el nuevo valor del dólar
          const carritoActualizado = await Promise.all(carrito.map(actualizarCarritoConNuevoDolar));

          // Guarda el carrito actualizado en el localStorage
          localStorage.setItem('carrito', JSON.stringify(carritoActualizado));
          // Actualiza el estado del componente con el nuevo carrito
          setCarrito(carritoActualizado);
        }
      } catch (error) {
        console.error('Error al obtener o actualizar el valor del dólar:', error);
      }
    };

    // Llamamos a la función al cargar el componente (arreglo de dependencias vacío)
    dolarCarrito();
  }, []);



  // Mientras se está autenticando, puedes mostrar un indicador de carga
  // esto se muestra mientras el loading este en false y cuando pase a true pasa al render de abajo
  // lo aplicamos porque el useEffect es asyncrono entonces nuestros estados no alcanzan a acutalizarse antes que se renderizen nuestros componentes de la app
  if (loading || sessionUser === null) {
    return (<div><Cargando /></div>);
  }

  return (
    <div className="App">
      <Context.Provider value={{
        cartasBLMR,
        setCartasBLMR,
        parametros,
        setParametros,
        valorBusqueda,
        setValorBusqueda,
        qtPage,
        setQtPage,
        cantidadItem,
        setCantidadItem,
        filtro,
        setFiltro,
        userLog,
        setUserLog,
        sessionUser,
        setSessionUser,
        carrito,
        setCarrito,
        totalCarrito,
        setTotalCarrito

      }}>
        <MainRouter />
      </Context.Provider>

    </div>
  );
}

export default App;
