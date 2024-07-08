import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux'
import store from './store/store.js'
import { createBrowserRouter , RouterProvider } from 'react-router-dom'
import AuthLayout from './AuthLayout.jsx'
import Signup from './pages/Signup.jsx'
import Signin from './pages/Signin.jsx'
import Event from './components/Event.jsx'
import Home from './pages/Home.jsx'
import ErrorPage from './pages/ErrorPage.jsx'
import EventPage from './components/EventPage.jsx'



const router = createBrowserRouter([
  {
    path: "",
    element: <App />,
    children : [
      {
        path: "/",
        element:<Home />
      },
      {
        path: "/signup",
        element:<Signup />
      },
      {
        path: "/signin",
        element:
          <Signin />,
      },
      {
        path: "/add-event",
        element:<Event />
      },
      {
        path: "/event/:id", 
        element: <EventPage /> 
      },
      {
        path: "*", 
        element: <ErrorPage />
      }

    ]
  }
 
]);


ReactDOM.createRoot(document.getElementById('root')).render(

 <Provider store={store}>
 <RouterProvider router={router} />
 </Provider>


)
