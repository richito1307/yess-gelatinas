import { apiFetch } from './client'
import type { ProductImageResponse } from '@/types'

export const imagenesApi = {
  uploadProductImage: (file: File, productoId: number) => {
    const form = new FormData()
    form.append('imagen', file)
    form.append('id', String(productoId))
    return apiFetch<ProductImageResponse>('/imagenes/uploadProductImage', {
      method: 'POST',
      body: form,
    })
  },

  delete: (id: number) =>
    apiFetch<void>(`/imagenes/${id}`, { method: 'DELETE' }),
}
