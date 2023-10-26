import { createContext, useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import { api } from '../services/api'

const AuthContext = createContext({})

function AuthProvider({ children }) {
  const [data, setData] = useState({})

  async function signIn({ email, password }) {
    try {
      const response = await api.post('/sessions', { email, password })
      const { user, token } = response.data

      user.isAdmin = user.isAdmin === 1

      localStorage.setItem('@foodexplorer:user', JSON.stringify(user))
      localStorage.setItem('@foodexplorer:token', token)

      api.defaults.headers.common.Authorization = `Bearer ${token}`

      setData({
        user,
        token,
      })
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message)
      } else {
        toast.error('Não foi possível entrar')
      }
    }
  }

  async function signOut() {
    localStorage.removeItem('@foodexplorer:user')
    localStorage.removeItem('@foodexplorer:token')

    setData({})
  }

  useEffect(() => {
    async function update() {
      const user = localStorage.getItem('@foodexplorer:user')
      const token = localStorage.getItem('@foodexplorer:token')
      if (user && token) {
        api.defaults.headers.common.Authorization = `Bearer ${token}`

        setData({
          user: JSON.parse(user),
          token,
        })
      }
    }

    update()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        user: data.user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

function useAuth() {
  const context = useContext(AuthContext)
  return context
}

export { AuthProvider, useAuth }
