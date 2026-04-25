import { apiFetch } from './client'

export const backupApi = {
  crear: () =>
    apiFetch<{ archivo: string; mensaje: string }>('/backup', { method: 'POST' }),
}
