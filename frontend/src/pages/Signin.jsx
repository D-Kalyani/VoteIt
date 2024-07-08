import React,{useState} from 'react'
import Input from '../components/Input'
import { login } from '../store/userSlice'
import { useForm } from 'react-hook-form'
import {useDispatch} from 'react-redux'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import {Link} from 'react-router-dom'

function Signin() {
  const {register , handleSubmit} = useForm()
  const [msg,setMsg] = useState("")
  const dispatch = useDispatch()
  const navigate = useNavigate()
  let success , user , message;
  
  const loginUser = async(data) =>
    {
      await axios.post('http://localhost:3000/api/v1/user/login ', data)
        .then( (response) => {

          success = response.data.success
          message = response.data.message
          user=response.data.data.user


          setMsg(message)

        })
        .catch((error) => {
          if (error.response) {
            setMsg(error.response.data.message);
        } else {
            setMsg('An unexpected error occurred');
        }
        });

        if(success === true && user)
          {
            dispatch(login(user))
            navigate("/")
          }

    }
  return (
    <div className="flex justify-center items-center min-h-screen bg-sky-600">
      <form onSubmit={handleSubmit(loginUser)} className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl mb-6 text-center">Sign In</h2>
        
        <Input label={"Username"} placeholde={"Enter Username"} {...register("username" , {required:true})}/>
        <Input label={"Password"} placeholde={"Enter Password"} type={"password"} {...register("password" , {required:true})}/>
        <div className="flex justify-center">
        <Button children='Login' className='bg-sky-600 text-white hover:bg-sky-700'/>
        </div>
      <p className='text-l text-red-500 flex justify-center'>{msg}</p>
      <Link to={'/signup'} className='text-l flex justify-center mt-4'>Don't have an account?</Link>
      </form>
    </div>
  )
}

export default Signin