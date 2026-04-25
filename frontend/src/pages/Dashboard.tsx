import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { TrendingUp, Package, ShoppingCart, AlertTriangle, Plus, BookOpen, Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ventasApi, detalleVentaApi } from '@/api/ventas'
import { productosApi } from '@/api/productos'
import type { Venta, Producto, DetalleVenta } from '@/types'

const LOW_STOCK = 5

function StatCard({ title, value, icon: Icon, description, accent }: {
  title: string; value: string | number; icon: React.ElementType; description?: string; accent?: boolean
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className={`w-8 h-8 rounded-md flex items-center justify-center ${accent ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
          <Icon size={16} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      </CardContent>
    </Card>
  )
}

function isToday(dateStr: string) {
  return new Date(dateStr).toDateString() === new Date().toDateString()
}

function isThisWeek(dateStr: string) {
  const d = new Date(dateStr)
  const now = new Date()
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  return d >= weekAgo && d <= now
}

export function Dashboard() {
  const navigate = useNavigate()
  const { data: ventas = [] } = useQuery<Venta[]>({ queryKey: ['ventas'], queryFn: ventasApi.findAll })
  const { data: productos = [] } = useQuery<Producto[]>({ queryKey: ['productos'], queryFn: productosApi.findAll })
  const { data: detalles = [] } = useQuery<DetalleVenta[]>({ queryKey: ['detalle-venta'], queryFn: detalleVentaApi.findAll })

  const ventasHoy = ventas.filter(v => isToday(v.fecha))
  const totalHoy = ventasHoy.reduce((sum, v) => sum + v.total, 0)
  const stockBajo = productos.filter(p => p.cantidad < LOW_STOCK)

  const ultimas5 = [...ventas].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()).slice(0, 5)

  // Top receta esta semana
  const detallesSemana = detalles.filter(d => d.tipo === 'RECETA' && isThisWeek(d.venta.fecha))
  const recetaConteo: Record<string, { nombre: string; total: number }> = {}
  detallesSemana.forEach(d => {
    const nombre = d.receta?.nombrePostre ?? 'Desconocida'
    const key = String(d.receta?.id ?? 0)
    if (!recetaConteo[key]) recetaConteo[key] = { nombre, total: 0 }
    recetaConteo[key].total += d.cantidad
  })
  const topReceta = Object.values(recetaConteo).sort((a, b) => b.total - a.total)[0]

  // Top cliente del mes
  const clienteConteo: Record<string, { nombre: string; count: number }> = {}
  ventas.forEach(v => {
    if (!v.cliente) return
    const key = String(v.cliente.id)
    if (!clienteConteo[key]) clienteConteo[key] = { nombre: v.cliente.nombre, count: 0 }
    clienteConteo[key].count++
  })
  const topCliente = Object.values(clienteConteo).sort((a, b) => b.count - a.count)[0]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {new Date().toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <Button onClick={() => navigate('/ventas/nueva')} className="gap-2">
          <Plus size={16} />Nueva Venta
        </Button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Ventas hoy" value={`$${totalHoy.toFixed(2)}`} icon={TrendingUp}
          description={`${ventasHoy.length} transacciones`} accent />
        <StatCard title="Pedidos hoy" value={ventasHoy.length} icon={ShoppingCart} description="ventas registradas" />
        <StatCard title="Productos" value={productos.length} icon={Package} description="en catálogo" />
        <StatCard title="Stock bajo" value={stockBajo.length} icon={AlertTriangle}
          description={stockBajo.length > 0 ? 'requieren atención' : 'todo en orden'} accent={stockBajo.length > 0} />
      </div>

      {/* Insights row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
              <BookOpen size={14} />Postre más vendido esta semana
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topReceta ? (
              <div>
                <p className="text-lg font-semibold text-foreground">{topReceta.nombre}</p>
                <p className="text-sm text-muted-foreground">{topReceta.total} unidades vendidas</p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Sin datos esta semana</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
              <Users size={14} />Cliente más frecuente
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topCliente ? (
              <div>
                <p className="text-lg font-semibold text-foreground">{topCliente.nombre}</p>
                <p className="text-sm text-muted-foreground">{topCliente.count} compras registradas</p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Sin clientes registrados en ventas</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Últimas ventas */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Últimas ventas</CardTitle>
          </CardHeader>
          <CardContent>
            {ultimas5.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">Sin ventas registradas</p>
            ) : (
              <div className="space-y-2">
                {ultimas5.map(v => (
                  <div key={v.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-foreground">Venta #{v.id}</p>
                        {isToday(v.fecha) && <Badge variant="secondary" className="text-xs">Hoy</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {v.cliente ? v.cliente.nombre : 'Anónimo'} · {new Date(v.fecha).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-foreground">${Number(v.total).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stock bajo */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              Alertas de stock
              {stockBajo.length > 0 && <Badge variant="destructive" className="text-xs">{stockBajo.length}</Badge>}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stockBajo.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">Todo el stock está en orden</p>
            ) : (
              <div className="space-y-2">
                {stockBajo.map(p => (
                  <div key={p.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <p className="text-sm font-medium text-foreground">{p.nombre}</p>
                    <Badge variant="destructive" className="text-xs">{p.cantidad} {p.unidadMedida.nombre}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
