import React from 'react'
import {Link} from 'react-router-dom'

function Hero() {
  return (
    <div className="bg-sky-600 text-white">
  <div className="flex items-center justify-center h-screen bg-sky-600 p-4 md:p-6 lg:p-8">
    <div className="text-center max-w-lg mx-auto">
      <h1 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6">Create Your Own Voting Events!</h1>
      <p className="text-lg md:text-2xl mb-6 md:mb-8">Whether it's for small fun or large serious events, our platform has you covered.</p>
      <Link to={'/signin'} className="px-6 py-3 md:px-8 md:py-4 bg-white text-sky-600 font-normal text-lg md:text-2xl rounded-full hover:bg-gray-200 transition duration-300">Sign In to Create a Voting Event</Link>
    </div>
  </div>
</div>

  )
}

export default Hero