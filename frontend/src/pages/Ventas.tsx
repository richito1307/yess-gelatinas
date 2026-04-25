import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { History, Trash2, ChevronDown, ChevronUp, Plus, BookOpen, Package, Users } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { PageHeader } from '@/components/PageHeader'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { EmptyState } from '@/components/EmptyState'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ventasApi, detalleVentaApi } from '@/api/ventas'
import type { Venta, DetalleVenta } from '@/types'

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('es-MX', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

function isToday(dateStr: string) {
  return new Date(dateStr).toDateString() === new Date().toDateString()
}

export function Ventas() {
  const navigate = useNavigate()
  const qc = useQueryClient()
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Venta | null>(null)
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [clienteFilter, setClienteFilter] = useState('')

  const { data: ventas = [], isLoading } = useQuery<Venta[]>({ queryKey: ['ventas'], queryFn: ventasApi.findAll })
  const { data: detalles = [] } = useQuery<DetalleVenta[]>({ queryKey: ['detalle-venta'], queryFn: detalleVentaApi.findAll })

  const deleteMut = useMutation({
    mutationFn: ventasApi.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['ventas'] })
      qc.invalidateQueries({ queryKey: ['detalle-venta'] })
      setDeleteTarget(null)
      toast.success('Venta eliminada')
    },
    onError: (e: Error) => toast.error(e.message),
  })

  const filtered = ventas
    .filter(v => {
      const d = new Date(v.fecha)
      if (dateFrom && d < new Date(dateFrom)) return false
      if (dateTo && d > new Date(dateTo + 'T23:59:59')) return false
      if (clienteFilter && !(v.cliente?.nombre ?? 'Anónimo').toLowerCase().includes(clienteFilter.toLowerCase())) return false
      return true
    })
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())

  const totalFiltrado = filtered.reduce((sum, v) => sum + v.total, 0)

  return (
    <div>
      <PageHeader
        title="Historial de Ventas"
        description="Registro completo de todas las ventas"
        action={
          <Button onClick={() => navigate('/ventas/nueva')} className="gap-2">
            <Plus size={16} />Nueva venta
          </Button>
        }
      />

      {/* Filtros */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Desde:</span>
          <Input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="w-36 h-8 text-sm" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Hasta:</span>
          <Input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="w-36 h-8 text-sm" />
        </div>
        <div className="flex items-center gap-2">
          <Users size={14} className="text-muted-foreground" />
          <Input placeholder="Filtrar por cliente..." value={clienteFilter} onChange={e => setClienteFilter(e.target.value)} className="w-40 h-8 text-sm" />
        </div>
        {(dateFrom || dateTo || clienteFilter) && (
          <Button size="sm" variant="ghost" onClick={() => { setDateFrom(''); setDateTo(''); setClienteFilter('') }} className="h-8 text-xs">
            Limpiar filtros
          </Button>
        )}
        {filtered.length > 0 && (
          <span className="text-sm text-muted-foreground ml-auto">
            {filtered.length} ventas · <strong className="text-foreground">${totalFiltrado.toFixed(2)}</strong>
          </span>
        )}
      </div>

      <div className="border border-border rounded-lg overflow-hidden bg-card">
        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-muted-foreground text-sm">Cargando ventas...</div>
        ) : filtered.length === 0 ? (
          <EmptyState icon={History} title="Sin ventas" description="No hay ventas en el período seleccionado"
            action={<Button onClick={() => navigate('/ventas/nueva')} size="sm" className="gap-2"><Plus size={14} />Registrar venta</Button>} />
        ) : (
          <div className="divide-y divide-border">
            {filtered.map(v => {
              const ventaDetalles = detalles.filter(d => d.venta.id === v.id)
              const expanded = expandedId === v.id
              return (
                <div key={v.id}>
                  <div className="flex items-center px-4 py-3 hover:bg-muted/30">
                    <button className="flex-1 flex items-center gap-3 text-left" onClick={() => setExpandedId(expanded ? null : v.id)}>
                      <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                        <History size={14} className="text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-medium text-foreground">Venta #{v.id}</p>
                          {isToday(v.fecha) && <Badge variant="secondary" className="text-xs">Hoy</Badge>}
                          {v.cliente && (
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Users size={10} />{v.cliente.nombre}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{formatDate(v.fecha)}</p>
                      </div>
                      <Badge variant="outline" className="text-xs shrink-0">
                        {ventaDetalles.length} {ventaDetalles.length === 1 ? 'item' : 'items'}
                      </Badge>
                      <span className="text-sm font-bold text-foreground shrink-0 ml-2">${Number(v.total).toFixed(2)}</span>
                      <span className="text-muted-foreground ml-2 shrink-0">
                        {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </span>
                    </button>
                    <Button size="icon-sm" variant="ghost"
                      className="hover:text-destructive hover:bg-destructive/10 ml-2 shrink-0"
                      onClick={() => setDeleteTarget(v)}>
                      <Trash2 size={14} />
                    </Button>
                  </div>

                  {expanded && ventaDetalles.length > 0 && (
                    <div className="px-4 pb-3 pt-2 bg-muted/20 border-t border-border">
                      <div className="space-y-1.5">
                        {ventaDetalles.map(d => {
                          const nombre = d.tipo === 'RECETA' ? (d.receta?.nombrePostre ?? '—') : (d.producto?.nombre ?? '—')
                          const Icon = d.tipo === 'RECETA' ? BookOpen : Package
                          return (
                            <div key={d.id} className="flex items-center gap-2 text-sm">
                              <Icon size={11} className={d.tipo === 'RECETA' ? 'text-primary shrink-0' : 'text-muted-foreground shrink-0'} />
                              <span className="text-muted-foreground flex-1">{nombre}</span>
                              <span className="text-muted-foreground text-xs">{d.cantidad} × ${Number(d.precioUnitario).toFixed(2)}</span>
                              <span className="font-medium text-foreground text-xs w-16 text-right">
                                ${(d.cantidad * d.precioUnitario).toFixed(2)}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={open => { if (!open) setDeleteTarget(null) }}
        title="¿Eliminar venta?"
        description={`Se eliminará la Venta #${deleteTarget?.id} por $${Number(deleteTarget?.total ?? 0).toFixed(2)}.`}
        onConfirm={() => deleteTarget && deleteMut.mutate(deleteTarget.id)}
        loading={deleteMut.isPending}
      />
    </div>
  )
}
