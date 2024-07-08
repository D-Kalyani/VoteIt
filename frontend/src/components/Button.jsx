import React from 'react'

function Button({
    children="",
    className='',
    ...props
}) {
  return (
    <button className={`inline-block px-4 py-2 md:px-6 md:py-3 lg:px-8 lg:py-4 text-sm md:text-base lg:text-lg duration-200 hover:bg-sky-600 hover:text-white rounded-full ${className}`} {...props}>{children}</button>
  )
}

export default Button