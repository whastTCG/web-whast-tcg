import { Box, Typography } from '@mui/material';
import * as React from 'react';
import { Context } from '../../context/Context';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import HistoryIcon from '@mui/icons-material/History';


export default function DatosPersonales() {

    const { sessionUser } = React.useContext(Context);

    const navegar = useNavigate();

    const cerrarSession = () => {
        navegar("/logout");
    };

    const mostrarDetalleCuenta = () => {
        navegar('/datos-envio');
    };

    const mostrarHistorialPedidos = () => {
        navegar('/historial-pedidos');
    };

    return (
        <Box sx={{ background: 'linear-gradient(180deg, #001f3f 0%, #000000 100%)' }} maxWidth={'1600px'} marginLeft={'auto'} marginRight={'auto'}>
            <Box display={{ xs: 'block', sm: 'flex' }} color={'white'} paddingY={5}>
                <Typography component={'h1'} variant='h3' sx={{ display: 'flex', alignItems: 'center', marginBottom:{xs: 4}}} marginLeft={'36px'}>
                    {sessionUser.name + " " + sessionUser.surname}
                </Typography>
                <Box mt={{ md: 5, sm: 7 }} marginLeft={{ md: 'auto', sm: 'auto', xs: 5 }} marginRight={{ md: 5, sm: 2 }} display={{md:'flex', sm:"flex"}}  >
                    <Button
                        color='inherit'
                        variant='outlined'
                        size='medium'
                        startIcon={<AccountBoxIcon />}
                        sx={{ height: 50, marginBottom: { xs: 4 }, marginLeft: { xs: 0} }}
                        onClick={mostrarDetalleCuenta}
                    >
                        Datos Personales
                    </Button>
                    <Button
                        color='inherit'
                        variant='outlined'
                        size='medium'
                        startIcon={<HistoryIcon />}
                        sx={{ height: 50, marginBottom: { xs: 4}, marginLeft: { xs: 0, md:7, sm:5 },  }}
                        onClick={mostrarHistorialPedidos}
                    >
                        Historial de Pedidos
                    </Button>
                    <Button
                        color='inherit'
                        variant='outlined'
                        size='medium'
                        startIcon={<ExitToAppIcon />}
                        sx={{ height: 50,  marginBottom: { xs: 2, sm: 4 },  marginLeft:{xs: 0, md :7, sm:5 }}}
                        onClick={cerrarSession}
                    >
                        Cerrar Sesión
                    </Button>

                </Box>
            </Box>
        </Box>

    );
}