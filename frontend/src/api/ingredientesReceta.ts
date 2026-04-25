import { apiFetch } from './client'
import type { IngredienteReceta } from '@/types'

export const ingredientesRecetaApi = {
  findAll: () => apiFetch<IngredienteReceta[]>('/ingredientes-receta'),

  create: (data: {
    receta: { id: number }
    producto: { id: number }
    cantidad: number
    unidadMedida: { id: number }
  }) =>
    apiFetch<IngredienteReceta>('/ingredientes-receta', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  delete: (id: number) =>
    apiFetch<void>(`/ingredientes-receta/${id}`, { method: 'DELETE' }),
}
