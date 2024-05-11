import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Context } from '../../context/Context';
//importar para guardar las cookies
import { Global } from '../../helper/urlGlobales';

export const Logout = () => {


  const { setUserLog } = React.useContext(Context);
  const { setSessionUser, setCarrito } = React.useContext(Context);
  
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {

    // Limpia el Local Storage y Session Storage
    localStorage.clear();
    sessionStorage.clear();

    // Setea los estados a su estado inicial
    setUserLog(false);
    setSessionUser({});


    const navegarLogin= ()=>{
      navigate("/login")
   }
    const limpiarCookieToken = async () => {

      const query = ["cookie=token"];

      try {
        // Llamar al endpoint del servidor para limpiar la cookie
        await fetch(Global.urlUser + "/clean-cookies?" + query.join("&"), {
          method: "GET",
          //debes incluir esta basura de codigo headers content type cuando envias al body parametros en un objeto de java script para espicificar sino la peticion no sera escuchada
          headers: {
            "Content-Type": "application/json",
          },
          //debes incluir esta basura de codigo si quieres que las peticiones que tengan que ver con token auth y cookies funcionen
          credentials: "include",
        });

        // Redirecciona a la página de login
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      } catch (error) {
        console.error("Error al limpiar cookies:", error);
      }
    };

    limpiarCookieToken();
    setCarrito([]);
    console.log("gola")
    navegarLogin();
  }, []);


  return (
    <>Cargandoo...</>
  )

}
