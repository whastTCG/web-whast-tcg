import React, {  useContext, useEffect, useMemo, useState } from 'react'
import { Context } from '../../context/Context';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import {  debounceTime, Subject } from 'rxjs';
import { listarGlobalPaginado } from '../../helper/listarGlobalPagination/listarGlobalPag';


const Search = styled('div')(({ theme }) => ({
    border: "2px solid blue",
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(0),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(0),
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

const inputChange = e => {
    search.next(e.target.value);
}


export const BuscadorLateral = ({ setQtPage, cantidadItem, setCantidadItem, edicion }) => {


    const { setCartasBLMR } = useContext(Context);

    const { setValorBusqueda } = useContext(Context);


    useEffect(() => {
       // console.log("useEffect busqueda barra");
        lanzarBusqueda();
        
       // console.log("soy el valor de busqueda " + valorBusqueda)
    }, []);

    
    const busqueda = async (pagina, coincidencia, categoria) => {
        const { dato } = await listarGlobalPaginado(pagina, coincidencia, categoria);
        
        setQtPage(dato.pages);
        //si los resultados son mayor a 0  guardarlos en setCartasBLMR
        if (dato.cartas.length > 0 ) {
            setCartasBLMR(dato.cartas);
        }
        
        setCantidadItem(dato.total);

    }

    const lanzarBusqueda = () => {
        const subcription = search$.pipe(debounceTime(500)).subscribe((value) => {
            
            if (!value) {
                busqueda(1, edicion)
                setValorBusqueda("");
                
            } else {
                busqueda(1, value, edicion)
                setValorBusqueda(value);
                
            }

        });
        return () => {
            
            return subcription.unsubscribe();
        };
    }






    return (
        <>

            <h2>Edicio {edicion}</h2>
            <h5> { cantidadItem  === 0 ? <h5>No se encuentran resultados</h5> : <h5>Resultados: {cantidadItem}</h5> } </h5>
            <Search className='search-input'>
                <SearchIconWrapper >
                    <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                    placeholder="Search…"
                    inputProps={{ 'aria-label': 'search' }}
                    name="busqueda"
                    onChange={inputChange}

                />
            </Search>
        </>
    )
}
