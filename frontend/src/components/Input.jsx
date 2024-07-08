import React from 'react'
import { forwardRef } from 'react'



function Input(
    {className = '',
    type = "text",
    placeholder = "",
    label="",
    ...props }
    ,ref

) {
  return (
    <div className="mb-4">
          {label && <label className="block text-gray-700 text-sm md:text-base lg:text-lg" htmlFor={label}>{label}</label>}
          <input id={label} type= {type} placeholder={placeholder} className= {`w-full p-2 md:p-3 lg:p-4 border border-gray-300 rounded ${className}`} {...props} ref={ref} />
        </div>
  )
}

export default React.forwardRef(Input)