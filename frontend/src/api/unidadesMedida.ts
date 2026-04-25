import { apiFetch } from './client'
import type { UnidadMedida } from '@/types'

export const unidadesMedidaApi = {
  findAll: () => apiFetch<UnidadMedida[]>('/unidades-medida'),

  findById: (id: number) => apiFetch<UnidadMedida>(`/unidades-medida/${id}`),

  create: (data: Omit<UnidadMedida, 'id'>) =>
    apiFetch<UnidadMedida>('/unidades-medida', { method: 'POST', body: JSON.stringify(data) }),

  update: (id: number, data: Omit<UnidadMedida, 'id'>) =>
    apiFetch<UnidadMedida>(`/unidades-medida/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  delete: (id: number) =>
    apiFetch<void>(`/unidades-medida/${id}`, { method: 'DELETE' }),
}
