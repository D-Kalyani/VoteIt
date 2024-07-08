import React,{useEffect , useState} from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

export default function AuthLayout({children , authentication = true }) //authentication bydefault true else if anthing is sent by user then that
{

    const navigate = useNavigate()
    const [loader , setLoader] = useState()
    const authStatus = useSelector((state) => state.auth.status)

    useEffect( 
        () => 
            {
                //true && (not logged in) false!== true i.e true thus overall true so take it to login page
                // true && (logged in) true !== true i.e false thus overall false so dont take it to login page
                if(authentication && authStatus !== authentication)
                    {
                        navigate("/login")
                    }

                    //false && (not logged in) false!==true i.e true so overall false
                    //false && (logged in) true!==true i.e false so overall false
                else if(!authentication && authStatus !== authentication)
                    {
                        navigate("/")
                    }

                    setLoader(false)

            }
        ,[authStatus,navigate,authentication]
        //if there is any change is authStatus or navigates somewhere without signin or authentication 
    )
  return (
    loader ? <h1>Loading</h1> : <>{children}</>
  ) 
}
