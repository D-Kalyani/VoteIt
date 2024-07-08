import React from 'react'
import { useDispatch } from 'react-redux'
import { logout } from '../store/userSlice'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Button from './Button'
function Logout() {
    const dispatch = useDispatch()
    const navigate = useNavigate()  
        

        const LogoutUser = async() =>
          {
            await axios.get('http://localhost:3000/api/v1/user/logout')
              .then( (response) => {
                dispatch(logout());
                navigate("/")
                alert("Logout successful")
              })
              .catch((error) => {
                console.log(error);
                alert("Could not logout")
              });
      
          }
  return (
    <Button  onClick={LogoutUser} children='Logout'/>
  )
}

export default Logout