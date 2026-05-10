import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

const MOCK_USER = {
  name: 'Breno Dantas',
  email: 'breno.dantas.pc@gmail.com',
  avatar: null,
  plan: 'pro',
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('hs-user')
    return stored ? JSON.parse(stored) : null
  })

  const login = (email, _password) => {
    const loggedUser = { ...MOCK_USER, email }
    localStorage.setItem('hs-user', JSON.stringify(loggedUser))
    setUser(loggedUser)
    return Promise.resolve(loggedUser)
  }

  const register = (data) => {
    const newUser = { ...MOCK_USER, ...data }
    localStorage.setItem('hs-user', JSON.stringify(newUser))
    setUser(newUser)
    return Promise.resolve(newUser)
  }

  const logout = () => {
    localStorage.removeItem('hs-user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
