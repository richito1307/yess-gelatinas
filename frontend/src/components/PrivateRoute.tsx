import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

export function PrivateRoute() {
  const { auth } = useAuth()
  if (!auth) return <Navigate to="/login" replace />
  return <Outlet />
}
