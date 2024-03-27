/* eslint-disable no-unused-vars */
import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Context } from '../../context/Context';


export const PublicLayoutLogin = () => {
  const { userLog } = useContext(Context);
  return (
    <>
    {userLog===false ?  <Outlet /> :
    <Navigate to='/'/>}
     

    </>
  )
}