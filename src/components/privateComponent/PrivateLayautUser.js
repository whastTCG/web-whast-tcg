/* eslint-disable no-unused-vars */
import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Context } from '../../context/Context';


export const PrivateLayautUser = () => {
  const { userLog } = useContext(Context);
  
  console.log(userLog)
  return (
    <>
    
    {userLog ===true ?  <Outlet /> :
    <Navigate to='/'/>}
     
    </>
  )
}