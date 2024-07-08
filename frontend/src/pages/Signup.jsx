import React,{useState} from 'react'
import Input from '../components/Input'
import Button from '../components/Button'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useNavigate , Link } from 'react-router-dom'


function Signup() {

  const {register , handleSubmit} = useForm()
  const[error , setError] = useState("")
  const [msg,setMsg] = useState("")
  let success , user , message;
  const navigate = useNavigate()
  
  const registerUser = async(data) =>
    {
      setError("")
      await axios.post('http://localhost:3000/api/v1/user/signup ', data)
        .then( (response) => {

          console.log(response)
          success = response.data.success
          message = response.data.message
          user=response.data.data

          setMsg(message)
          alert("user registered successfully")

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
            navigate("/signin")
          }

    }
  return (
    <div className="flex justify-center items-center min-h-screen bg-sky-600">

    <form onSubmit={handleSubmit(registerUser)} className="bg-white p-8 rounded shadow-md w-96">
      <h2 className="text-2xl mb-6 text-center">Sign Up</h2>

      <Input label={"Username"} placeholde={"Enter Username"} {...register("username" , {required:true})}/>
      <Input label={"Email"} placeholde={"Enter Email"} type={"email"} {...register("email" , {required:true , validate: {
                        matchPatern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                        "Email address must be a valid address",
                    }})} />
      <Input label={"Password"} placeholde={"Enter Password"} type={"password"} {...register("password" , {required:true})}/>

      <div className="flex justify-center">
      <Button children='Register' className='bg-sky-600 text-white hover:bg-sky-700'/>
    </div>
      <p className='text-l text-red-500 flex justify-center'>{msg}</p>
      <Link to={'/signin'} className='text-l flex justify-center mt-4'>Already have an account?</Link>
    </form>
  </div>
  )
}

export default Signup