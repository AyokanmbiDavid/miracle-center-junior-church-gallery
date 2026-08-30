import React, { useState } from 'react'
import { createContext } from 'react'

export const gallery = createContext(null)

const ContextProvider = ({children}) => {
  const [sto,setsto] = useState()
  return (
    <gallery.Provider value={{sto}}>
        {children}
    </gallery.Provider>
  )
}

export default ContextProvider
