import React from 'react'
import { Link , useNavigate} from 'react-router-dom';
import { useSelector } from 'react-redux';
import Logout from './Logout';
import Logo from './Logo'
import Button from './Button';

function Navbar() {

  const authStatus = useSelector((state) => state.user.status)
  const navigate = useNavigate()

  const options = [
    {
      name : "Home",
      slug : "/",
      display: true
    },
    {
      name : "Register",
      slug : "/signup",
      display: !authStatus
    },
    {
      name : "Sign in",
      slug : "/signin",
      display: !authStatus
    },
  ]

  return (
    <nav className="bg-white p-4 text-sky-600 font-normal font-xl md:text-2xl text-m flex justify-between items-center">
    <div>
      <Logo />
    </div>
    <div className="container mx-auto flex flex-col-reverse md:flex-row-reverse md:justify-between items-center">
    <ul className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
                {options.map((option) => 
            option.display? (<li key={option.name}>
              <Button onClick={() => navigate(option.slug)} children={option.name} />
            </li>
): null
          )}
          {authStatus ? <Logout /> : null}
        </ul>
                
              </div>
    </nav>
  );
}


export default Navbar