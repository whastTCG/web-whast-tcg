import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';

import SearchIcon from '@mui/icons-material/Search';

import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { Navbar } from '../navList/Navbar';
import { NavbarLogin } from '../navListLogin/NavbarLogin';
import { Subject, debounceTime } from 'rxjs';

import { Context } from '../../../context/Context';
import { listarGlobalPaginado } from '../../../helper/listarGlobalPagination/listarGlobalPag';
import { NavLink, useNavigate } from 'react-router-dom';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';


//import estilos
import '../../../style/AppBarTcg.css';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 1,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));





let search = new Subject();
let search$ = search.asObservable();

const inputChange = (e) => {
  search.next(e.target.value);
}

export default function PrimarySearchAppBar() {


  //const [inputSearch, setInputSearch] = React.useState("");

  const { userLog } = React.useContext(Context);

  //const { sessionUser } = React.useContext(Context);

  const { setCartasBLMR } = React.useContext(Context);

  const { setValorBusqueda } = React.useContext(Context);

  //const { parametros } = React.useContext(Context);

  const { setQtPage } = React.useContext(Context);

  const { setCantidadItem } = React.useContext(Context);

  const navegar = useNavigate();

  React.useEffect(() => {

    lanzarBusqueda()

  }, []);


  const busqueda = async (pagina, concidencia, categoria) => {
    const { dato } = await listarGlobalPaginado(pagina, concidencia, categoria);

    setQtPage(dato.pages);
    setCartasBLMR(dato.cartas);
    setCantidadItem(dato.total);

  }

  const lanzarBusqueda = () => {
    const subcription = search$.pipe(debounceTime(500)).subscribe((value) => {

      if (value) {
        setValorBusqueda(value);
        busqueda(1, value);
        navegar("/busqueda-general");
        //console.log("llegue aqui lanzar busqueda");
      } else {
        // setValorBusqueda("");
        // busqueda(1);
        // navegar("/busqueda-general", { replace: true });
        navegar('/inicio/', { replace: true })
      }
    });


    return () => {
      return subcription.unsubscribe();
    };

  }


  //metodo para redirigir al carrito
  const redirigirCarrito = () => {
    navegar('/carrito');
  }


  //metodo de renderizar appbar ( son 2 appBar una para usuarios no logeados y otra para logeados)
  const renderAppbar = () => {
    if (userLog === false) {
      return (
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar>
              <Navbar />
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ display: { xs: 'none', sm: 'block' } }}
              >
                <NavLink className="whast-tcg-icono" to="/inicio">
                  <span>Whast TCG</span>
                </NavLink>
              </Typography>

              {/* input de busqueda */}
              <Search>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase

                  placeholder="Search…"
                  inputProps={{ 'aria-label': 'search' }}
                  name="busqueda"
                  onChange={e => inputChange(e)}

                />
              </Search>

              <Box sx={{ flexGrow: "1" }} />
              <Typography variant="h6" noWrap component="div" sx={{ border: 'ButtonText', padding: 1, display: { xs: 'none', sm: 'block' } }}>
                <NavLink
                  to="/cargar-estado-venta"
                  className="enlace-navbar"
                  style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center' }}
                >
                  <ShoppingBasketIcon sx={{ marginRight: 1 }} />
                  Revisa tu pedido
                </NavLink>
              </Typography>
              <Box sx={{ display: "flex" }} >
                <IconButton
                  size="large"
                  edge="end"
                  aria-label="account of current user"
                  aria-haspopup="true"
                  color="inherit"
                  onClick={redirigirCarrito}
                >
                  <AddShoppingCartIcon />

                </IconButton>

                <Box sx={{ display: { xs: 'flex', md: 'flex' }, marginLeft: 3 }}>
                  <NavbarLogin />
                </Box>
              </Box>

            </Toolbar>
          </AppBar>

        </Box>
      )
    } else {

      if (userLog === true) {
        return (
          <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
              <Toolbar>
                <Navbar />
                <Typography
                  variant="h6"
                  noWrap
                  component="div"
                  sx={{ display: { xs: 'none', sm: 'block' } }}
                >
                  <NavLink className="whast-tcg-icono" to="/inicio">
                    <span>Whast TCG </span>
                  </NavLink>
                </Typography>
                {/* input de busqueda */}
                <Search>
                  <SearchIconWrapper>
                    <SearchIcon />
                  </SearchIconWrapper>
                  <StyledInputBase

                    placeholder="Search…"
                    inputProps={{ 'aria-label': 'search' }}
                    name="busqueda"
                    onChange={e => inputChange(e)}

                  />
                </Search>
                <Box sx={{ flexGrow: "1" }} />
                <Typography variant="h6" noWrap component="div" sx={{ border: 'ButtonText', padding: 1, display: { xs: 'none', sm: 'block' } }}>
                <NavLink
                  to="/cargar-estado-venta"
                  className="enlace-navbar"
                  style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center' }}
                >
                  <ShoppingBasketIcon sx={{ marginRight: 1 }} />
                  Revisa tu pedido
                </NavLink>
              </Typography>
                <Box sx={{ display: "flex" }} >
                  <IconButton
                    size="large"
                    edge="end"
                    aria-label="account of current user"
                    aria-haspopup="true"
                    color="inherit"
                    onClick={redirigirCarrito}
                  >
                    <AddShoppingCartIcon />

                  </IconButton>
                  <Box sx={{ display: { xs: 'flex', md: 'flex' }, marginLeft: 3 }}>
                    <NavbarLogin />
                  </Box>
                </Box>
              </Toolbar>
            </AppBar>

          </Box>
        )
      }
    }
  }


  return (
    <>
      {renderAppbar()}
    </>

  );
}