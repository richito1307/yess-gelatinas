import { apiFetch } from './client'
import type { ProductoHistorial } from '@/types'

export const historialApi = {
  findAll: () => apiFetch<ProductoHistorial[]>('/productos-historial'),

  create: (data: { producto: { id: number }; precioAnterior: number; precioNuevo: number }) =>
    apiFetch<ProductoHistorial>('/productos-historial', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
}
