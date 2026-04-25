import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from '@/components/ui/sonner'
import { AuthProvider } from '@/contexts/AuthContext'
import { PrivateRoute } from '@/components/PrivateRoute'
import { Layout } from '@/components/Layout'
import { Login } from '@/pages/Login'
import { Dashboard } from '@/pages/Dashboard'
import { Productos } from '@/pages/Productos'
import { Recetas } from '@/pages/Recetas'
import { NuevaVenta } from '@/pages/NuevaVenta'
import { Ventas } from '@/pages/Ventas'
import { Clientes } from '@/pages/Clientes'
import { UnidadesMedida } from '@/pages/UnidadesMedida'
import { Configuracion } from '@/pages/Configuracion'

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30_000 } },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<PrivateRoute />}>
              <Route element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="/productos" element={<Productos />} />
                <Route path="/recetas" element={<Recetas />} />
                <Route path="/ventas" element={<Ventas />} />
                <Route path="/ventas/nueva" element={<NuevaVenta />} />
                <Route path="/clientes" element={<Clientes />} />
                <Route path="/unidades-medida" element={<UnidadesMedida />} />
                <Route path="/configuracion" element={<Configuracion />} />
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
        <Toaster position="top-right" richColors />
      </AuthProvider>
    </QueryClientProvider>
  )
}
