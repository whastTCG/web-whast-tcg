
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import "../../style/layaout.css";
import { Inicio } from '../Inicio';
import { Header } from '../layaoutGenericos/header/Header';
import PrimarySearchAppBar from '../layaoutGenericos/appbar/AppBarTcg';
import banner from '../../img/DL_Digital_Web_Banner.png';
//import { AppBarButton } from '../layaoutGenericos/AppBarButton';
import { Cartas } from '../cargarCartas/Cartas';
import { Footer } from '../layaoutGenericos/footer/Footer';
import "../../style/footer.css";
import { TestCarta } from '../TestCarta';
import { BusquedaGeneral } from '../cargarCartas/BusquedaGeneral';
import { CartaIndividual } from '../cargarCartas/CartaIndividual';
import { Carrito } from '../carritoCompras/Carrito';
import { Register } from '../Formularios/Register';
import Login2 from '../Formularios/Login2';


import { PublicLayoutLogin } from '../privateComponent/PublicLayoutLogin';
import { Customer } from '../privateComponent/Customer';
import { Logout } from '../privateComponent/Logout';
import { PrivateLayautUser } from '../privateComponent/PrivateLayautUser';
import { DatosEnvio } from '../privateComponent/DatosEnvio';
import { EditarDatosPersonales } from '../privateComponent/EditarDatosPersonales';
import { CambiarContrasena } from '../privateComponent/CambiarContrasena';
import { EditarDatosEnvio } from '../privateComponent/EditarDatosEnvio';
import { EditarDatosEnvio2 } from '../privateComponent/EditarDatosEnvio2';
import AgregarDatosEnvio from '../privateComponent/AgregarDatosEnvio';
import { SeleccionarEnvio } from '../privateComponent/SeleccionarEnvio';
import { ConfirmarPago } from '../ConfirmarPago';
import { VerificarCuenta } from '../utilidad/VerificarCuenta';
import RecuperarContrasena from '../Formularios/RecuperarContraseña';
import { RecuperarContrasenaEmailToken } from '../Formularios/RecuperarContrasenaEmailToken'; 
import { CargarEstadoVenta } from '../Formularios/CargarEstadoVenta';
import { HistoriaDePedidos } from '../privateComponent/HistoriaDePedidos';
import ImagenesCarrusel from '../layaoutGenericos/Carrusel/ImagenesCarrusel';
 


export const MainRouter = () => {



    return (
        <div className='layaout'>

            <BrowserRouter>

                <header className='header'>
                    {/* headder */}
                    
                </header>

                <nav className='AppBar'>
                    {/* aqui va la barra de navegacion */}
                    <PrimarySearchAppBar />
                    
                </nav>

                <div className='banner'>
                    {/* aqui va el banner */}
                    {/* <img src={banner} alt='banner' /> */}
                    <ImagenesCarrusel/>

                </div>

                <section className='content-2'>
                    {/* contenido */}
                    <Routes>
                        {/* {rutas publicas} */}
                        <Route path='/' element={<Inicio />} />
                        <Route path='/inicio' element={<Inicio />} />
                        <Route path='/cartas/:edicion?' element={<Cartas />} />
                        <Route path='/test/:edicion?' element={<TestCarta />} />
                        <Route path='/busqueda-general' element={<BusquedaGeneral />} />
                        <Route path='/carta/:idCarta' element={<CartaIndividual />} />
                        <Route path='/carrito' element={<Carrito />} />
                        <Route path='/seleccionar-envio' element={<SeleccionarEnvio/>}/>
                        <Route path='/confirmar-pago' element={<ConfirmarPago/>}/ >
                        <Route path='*' element={<div>Error 404 Page Not Found!</div>}/ >
                        <Route path='/verificar-cuenta/:_id' element={<VerificarCuenta/>}/ >
                        <Route path='/recuperar-contraseña/' element={<RecuperarContrasena/>}/ >
                        <Route path='/recuperar-contraseña-token/:email' element={<RecuperarContrasenaEmailToken/>}/>
                        <Route path='/cargar-estado-venta' element={<CargarEstadoVenta/>}/ >
                        
                            
                        {/* {solo mostrar si no estan logeados} */}
                        <Route path='/' element={<PublicLayoutLogin />}>
                            <Route path='/register' element={<Register />} />
                            <Route path='/login/' element={<Login2 />} />
                        </Route>

                        {/* rutas privadas solo mostrar si estan con sesion iniciada */}
                        <Route  element={<PrivateLayautUser/>}>

                            <Route path="/customer" element={<Customer />} />
                            <Route path="/logout" element={<Logout/>}/>
                            <Route path='/datos-envio' element={<DatosEnvio/>}/>
                            <Route path='/editar-datos' element={<EditarDatosPersonales/>} />
                            <Route path='/cambiar-contrasena' element={<CambiarContrasena/>} />
                            <Route path='/editar-datos-envio/:id' element={<EditarDatosEnvio/>} />
                            <Route path='/editar-datos-envio2/:id' element={<EditarDatosEnvio2/>} />
                            <Route path='/agregar-datos-envio' element={<AgregarDatosEnvio/>} />
                            <Route path='/historial-pedidos' element={<HistoriaDePedidos/>} />
                           
                        </Route>

                    </Routes>
                </section>



                <footer className='footer'>
                    {/*Pie de pagina*/}
                    <Footer />

                </footer>

            </BrowserRouter>
        </div>

    )
}
