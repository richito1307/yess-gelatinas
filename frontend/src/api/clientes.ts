import { apiFetch } from './client'
import type { Cliente, Direccion } from '@/types'

export const clientesApi = {
  findAll: () => apiFetch<Cliente[]>('/clientes'),

  findById: (id: number) => apiFetch<Cliente>(`/clientes/${id}`),

  getDirecciones: (id: number) => apiFetch<Direccion[]>(`/clientes/${id}/direcciones`),

  search: (nombre: string) =>
    apiFetch<Cliente[]>(`/clientes/buscar?nombre=${encodeURIComponent(nombre)}`),

  create: (data: Omit<Cliente, 'id' | 'fechaRegistro' | 'activo'>) =>
    apiFetch<Cliente>('/clientes', { method: 'POST', body: JSON.stringify(data) }),

  update: (id: number, data: Omit<Cliente, 'id' | 'fechaRegistro' | 'activo'>) =>
    apiFetch<Cliente>(`/clientes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  delete: (id: number) =>
    apiFetch<void>(`/clientes/${id}`, { method: 'DELETE' }),
}

export const direccionesApi = {
  create: (data: {
    cliente: { id: number }
    alias?: string
    calle: string
    colonia?: string
    ciudad: string
    estado?: string
    codigoPostal?: string
    referencias?: string
    esPrincipal: boolean
  }) => apiFetch<Direccion>('/direcciones', { method: 'POST', body: JSON.stringify(data) }),

  update: (id: number, data: Partial<Direccion>) =>
    apiFetch<Direccion>(`/direcciones/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  delete: (id: number) =>
    apiFetch<void>(`/direcciones/${id}`, { method: 'DELETE' }),
}
