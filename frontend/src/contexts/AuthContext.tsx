import { createContext, useContext, useState, type ReactNode } from 'react'

interface AuthData {
  username: string
  password: string
}

interface AuthContextValue {
  auth: AuthData | null
  login: (username: string, password: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthData | null>(() => {
    const stored = localStorage.getItem('yess_auth')
    return stored ? JSON.parse(stored) : null
  })

  const login = (username: string, password: string) => {
    const data = { username, password }
    localStorage.setItem('yess_auth', JSON.stringify(data))
    setAuth(data)
  }

  const logout = () => {
    localStorage.removeItem('yess_auth')
    setAuth(null)
  }

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
