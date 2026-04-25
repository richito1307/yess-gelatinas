import { apiFetch } from './client'
import type { Producto } from '@/types'

export const productosApi = {
  findAll: () => apiFetch<Producto[]>('/productos'),

  findById: (id: number) => apiFetch<Producto>(`/productos/${id}`),

  create: (data: FormData) =>
    apiFetch<Producto>('/productos', { method: 'POST', body: data }),

  update: (id: number, data: FormData) =>
    apiFetch<Producto>(`/productos/${id}`, { method: 'PUT', body: data }),

  delete: (id: number) =>
    apiFetch<void>(`/productos/${id}`, { method: 'DELETE' }),
}
