import {useEffect , useState} from 'react'
import { useDispatch } from "react-redux";
import { login, logout } from "./store/userSlice";
import axios from "axios";
import React from "react"
import { Outlet } from "react-router-dom";
import { useRef } from "react";
import Navbar from './components/Navbar'
import Footer from './components/Footer';


function App() {

  axios.defaults.withCredentials = true;

  const dispatch = useDispatch()
  const effectRan = useRef(false);
  
  useEffect(() => {
    if (effectRan.current) return;

    const refreshToken = async () => {
        try {
              const response = await axios.post(
                  'http://localhost:3000/api/v1/user/refresh-access-token', 
                  {}, 
                  { withCredentials: true }
              );

              if (response.data) {
                dispatch(login(response.data.user));
                console.log(response.data)
              } 
              else{
                dispatch(logout())
                console.log("Error1")
              }

        } 
        catch (error) {
            console.error('Failed to refresh token', error);
            dispatch(logout());
            
        }
        
    };

    refreshToken();
    effectRan.current = true; 

    return () => {
      effectRan.current = false;
    };

},[]);

  return (
<>
  <Navbar />
  <main>
  <Outlet />
  </main>
  <Footer />
</>
  ) 
}


export default App

