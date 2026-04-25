import { apiFetch } from './client'
import type { Venta, DetalleVenta } from '@/types'

export const ventasApi = {
  findAll: () => apiFetch<Venta[]>('/ventas'),

  findById: (id: number) => apiFetch<Venta>(`/ventas/${id}`),

  create: (data: { total: number; cliente?: { id: number } }) =>
    apiFetch<Venta>('/ventas', {
      method: 'POST',
      body: JSON.stringify({ ...data, fecha: new Date().toISOString() }),
    }),

  delete: (id: number) =>
    apiFetch<void>(`/ventas/${id}`, { method: 'DELETE' }),
}

export const detalleVentaApi = {
  findAll: () => apiFetch<DetalleVenta[]>('/detalle-venta'),

  findById: (id: number) => apiFetch<DetalleVenta>(`/detalle-venta/${id}`),

  create: (data: {
    venta: { id: number }
    tipo: 'RECETA' | 'PRODUCTO'
    receta?: { id: number }
    producto?: { id: number }
    cantidad: number
    precioUnitario: number
  }) => apiFetch<DetalleVenta>('/detalle-venta', { method: 'POST', body: JSON.stringify(data) }),

  delete: (id: number) =>
    apiFetch<void>(`/detalle-venta/${id}`, { method: 'DELETE' }),
}
