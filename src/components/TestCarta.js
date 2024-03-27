import React, { useContext, useEffect, useRef, useState } from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { Context } from '../context/Context';
import { useParams } from 'react-router-dom';
import { Pagination } from '@mui/material';
import { listarGlobalPaginado } from '../helper/listarGlobalPagination/listarGlobalPag';
import '../style/testCarta.css';
import { BuscadorLateral } from './layaoutGenericos/BuscadorLateral';

export function TestCarta() {

    //const [cartasBLMR, setCartasBLMR] = useState([]);
    const [page, setPage] = useState(1);

    const [qtPage, setQtPage] = useState(10);

    const [cantidadItem, setCantidadItem] = useState(0);

    const {  setParametros } = useContext(Context);

    const { cartasBLMR, setCartasBLMR } = useContext(Context);

    //trae los parametros de la url
    const { edicion = "" } = useParams();


    useEffect(() => {
        setParametros(edicion);
        conseguirCartasBLMR();
      //  console.log("use effect del test");
    }, []);


    
    useEffect(() => {

        conseguirCartasBLMR();
        console.log("use effect de cambiar pagina");
    }, [page]);



    const conseguirCartasBLMR = async () => {
        const { dato } = await listarGlobalPaginado(page, edicion);
        setQtPage(dato.pages)
        setCartasBLMR(dato.cartas);
    };

    const handleChange = (event, value) => {
        setPage(value);
    };

    return (
        <div className='content'>
            <div className='lateral-buscador'>
                <BuscadorLateral  setQtPage={setQtPage} cantidadItem={cantidadItem} setCantidadItem={setCantidadItem} />
            </div>
            <div className='container-card'>

                {cartasBLMR ? (

                    cartasBLMR.map(item => {
                        return (
                            <article className="card" key={item._id} >


                                <Card sx={{ backgroundColor: 'lightgray', width: "250px", marginBottom: "1px", marginTop: "1px" }} className='carta'>

                                    <CardHeader

                                        title={item.cardText}
                                        subheader={item.cardPrice}
                                        sx={{ textAlign: 'center', height: 135, whiteSpace: "break-spaces" }}
                                        component='h1'

                                    />
                                    <CardMedia
                                        component="img"
                                        height="auto"
                                        image={item.cardImg}
                                        alt="Paella dish"


                                    />
                                    {
                                        item.stock < 1 ? (


                                            <CardContent sx={{ justifyContent: "center", display: "flex" }}>
                                                <Button sx={{ width: 180, height: 40 }} variant="contained">Fuera de stock</Button>

                                            </CardContent>

                                        ) : (

                                            <CardContent sx={{ alignContent: "center", display: "flex" }}>
                                                <Button sx={{ width: 200, height: 40 }} variant="contained">Anadir al carro</Button>

                                            </CardContent>
                                        )
                                    }



                                </Card>
                            </article>

                        )
                    })
                ) : (
                    <h1>loading</h1>
                )

                }
            </div>
            <div className='paginacion'>
                <Pagination count={qtPage} page={page} onChange={handleChange} />
            </div>

        </div>
    );
}