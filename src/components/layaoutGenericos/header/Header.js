import React from 'react'
import rescueCat from "../../../img/gatoql.png";
import tituloYugioh from "../../../img/yugioh-titutlo.png";

export const Header = () => {
  return (
    <>
      <h2>Bienvenido a Whast TCG</h2>
      <img className='titulo' src={tituloYugioh} alt='titulo'></img>
      <img className='gatoql' src={rescueCat} alt='gatoql'></img>
    </>
  )
}
