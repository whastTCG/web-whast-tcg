import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useContext, useEffect } from 'react';
import { Context } from '../../context/Context';
import { listarGlobalPaginado } from '../../helper/listarGlobalPagination/listarGlobalPag';

export  const SelectFiltro = ({ setQtPage, setCantidadItem, edicion })=>{

    const {filtro, setFiltro} = useContext(Context);

    const { setCartasBLMR } = useContext(Context);

    const { valorBusqueda } = useContext(Context);


    const busqueda = async (pagina, coincidencia, categoria, filtro) => {
        const { dato } = await listarGlobalPaginado(pagina, coincidencia, categoria, filtro);

        setQtPage(dato.pages);
        setCartasBLMR(dato.cartas);
        setCantidadItem(dato.total);

    }

    const lanzarBusqueda = () => {
        busqueda(1, valorBusqueda, edicion, filtro);
    }


    const handleChange = (event) => {
        setFiltro(event.target.value);
        
    };

    useEffect(() => {
        if (filtro !== '') {
            lanzarBusqueda();
        }
    },[filtro])


    
    return (
        <Box sx={{ minWidth: 120, marginTop: 3  }}>
            <FormControl fullWidth>
                <InputLabel id="ordenar-por">Ordenar Por</InputLabel>
                <Select
                    labelId="ordenar-por"
                    id="ordenar-por"
                    name="filtro"
                    value={filtro}
                    label="Filtro"
                    onChange={handleChange}
                >
                    <MenuItem value={1}>Precio mas bajo</MenuItem>
                    <MenuItem value={2}>Precio mas alto</MenuItem>
                    <MenuItem value={3}>A - Z</MenuItem>
                    <MenuItem value={4}>Z - A</MenuItem>
                </Select>
            </FormControl>
        </Box>
    );
}