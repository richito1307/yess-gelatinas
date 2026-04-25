import { apiFetch } from './client'
import type { Receta } from '@/types'

export const recetasApi = {
  findAll: () => apiFetch<Receta[]>('/recetas'),

  findById: (id: number) => apiFetch<Receta>(`/recetas/${id}`),

  create: (data: Partial<Receta>) =>
    apiFetch<Receta>('/recetas', { method: 'POST', body: JSON.stringify(data) }),

  update: (id: number, data: Partial<Receta>) =>
    apiFetch<Receta>(`/recetas/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  delete: (id: number) =>
    apiFetch<void>(`/recetas/${id}`, { method: 'DELETE' }),
}
