import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  ShoppingCart, Plus, Minus, Trash2, CheckCircle,
  Search, Users, BookOpen, Package,
} from 'lucide-react'
import { toast } from 'sonner'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { productosApi } from '@/api/productos'
import { recetasApi } from '@/api/recetas'
import { ventasApi, detalleVentaApi } from '@/api/ventas'
import { clientesApi } from '@/api/clientes'
import type { Producto, Receta, ItemCarrito, ItemCarritoInput, Cliente } from '@/types'

type Tab = 'postres' | 'productos'

function CartContent({
  carrito,
  clienteSeleccionado,
  clienteSearch,
  clientes,
  showClienteSearch,
  setClienteSearch,
  setShowClienteSearch,
  setClienteSeleccionado,
  updateQty,
  removeItem,
  total,
  totalItems,
  onConfirm,
  confirming,
}: {
  carrito: ItemCarrito[]
  clienteSeleccionado: Cliente | null
  clienteSearch: string
  clientes: Cliente[]
  showClienteSearch: boolean
  setClienteSearch: (v: string) => void
  setShowClienteSearch: (v: boolean) => void
  setClienteSeleccionado: (c: Cliente | null) => void
  updateQty: (tipo: string, id: number, delta: number) => void
  removeItem: (tipo: string, id: number) => void
  total: number
  totalItems: number
  onConfirm: () => void
  confirming: boolean
}) {
  const clientesFiltrados = clienteSearch
    ? clientes.filter(c =>
        c.nombre.toLowerCase().includes(clienteSearch.toLowerCase()) ||
        (c.telefono ?? '').includes(clienteSearch)
      )
    : clientes.slice(0, 8)

  return (
    <div className="flex flex-col h-full gap-3">
      {/* Selector cliente */}
      <div className="space-y-1">
        <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
          <Users size={11} />Cliente (opcional)
        </p>
        {clienteSeleccionado ? (
          <div className="flex items-center gap-2 p-2 bg-primary/5 border border-primary/20 rounded-md">
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-primary">{clienteSeleccionado.nombre[0]}</span>
            </div>
            <span className="text-xs font-medium text-foreground flex-1 truncate">{clienteSeleccionado.nombre}</span>
            <button onClick={() => setClienteSeleccionado(null)} className="text-muted-foreground hover:text-foreground text-xs">✕</button>
          </div>
        ) : (
          <div>
            <button
              onClick={() => setShowClienteSearch(!showClienteSearch)}
              className="w-full text-left text-xs text-muted-foreground border border-dashed border-border rounded-md px-2 py-1.5 hover:border-primary/40 transition-colors"
            >
              + Seleccionar cliente
            </button>
            {showClienteSearch && (
              <div className="mt-1 border border-border rounded-md bg-card shadow-sm">
                <Input
                  placeholder="Buscar cliente..."
                  value={clienteSearch}
                  onChange={e => setClienteSearch(e.target.value)}
                  className="h-7 text-xs border-0 border-b rounded-none"
                />
                <div className="max-h-32 overflow-y-auto">
                  {clientesFiltrados.map(c => (
                    <button
                      key={c.id}
                      onClick={() => { setClienteSeleccionado(c); setShowClienteSearch(false); setClienteSearch('') }}
                      className="w-full text-left px-3 py-1.5 text-xs hover:bg-muted/50 flex items-center gap-2"
                    >
                      <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">
                        {c.nombre[0]}
                      </span>
                      <span className="truncate">{c.nombre}</span>
                    </button>
                  ))}
                  {clientesFiltrados.length === 0 && (
                    <p className="text-center text-xs text-muted-foreground py-2">Sin resultados</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <Separator />

      {/* Items */}
      {carrito.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-6 flex-1">
          Selecciona items del catálogo
        </p>
      ) : (
        <>
          <div className="space-y-1.5 flex-1 overflow-y-auto max-h-72 lg:max-h-64">
            {carrito.map(item => (
              <div key={`${item.tipo}-${item.id}`} className="flex items-center gap-1.5 py-1.5 border-b border-border last:border-0">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    {item.tipo === 'RECETA'
                      ? <BookOpen size={9} className="text-primary shrink-0" />
                      : <Package size={9} className="text-muted-foreground shrink-0" />}
                    <p className="text-xs font-medium text-foreground truncate">{item.nombre}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">${Number(item.precio).toFixed(2)} c/u</p>
                </div>
                <div className="flex items-center gap-0.5 shrink-0">
                  <Button size="icon-xs" variant="outline" onClick={() => updateQty(item.tipo, item.id, -1)}><Minus size={10} /></Button>
                  <span className="text-xs w-5 text-center font-medium">{item.cantidad}</span>
                  <Button size="icon-xs" variant="outline" onClick={() => updateQty(item.tipo, item.id, 1)}><Plus size={10} /></Button>
                </div>
                <p className="text-xs font-semibold text-foreground w-12 text-right shrink-0">
                  ${(item.precio * item.cantidad).toFixed(2)}
                </p>
                <Button size="icon-xs" variant="ghost"
                  className="hover:text-destructive hover:bg-destructive/10 shrink-0"
                  onClick={() => removeItem(item.tipo, item.id)}>
                  <Trash2 size={10} />
                </Button>
              </div>
            ))}
          </div>

          <Separator />
          <div className="flex items-center justify-between py-0.5">
            <span className="text-sm font-medium text-foreground">Total ({totalItems} items)</span>
            <span className="text-lg font-bold text-primary">${total.toFixed(2)}</span>
          </div>

          <Button className="w-full gap-2" onClick={onConfirm} disabled={confirming}>
            <CheckCircle size={16} />
            {confirming ? 'Registrando...' : 'Confirmar venta'}
          </Button>
        </>
      )}
    </div>
  )
}

export function NuevaVenta() {
  const navigate = useNavigate()
  const qc = useQueryClient()
  const [carrito, setCarrito] = useState<ItemCarrito[]>([])
  const [success, setSuccess] = useState(false)
  const [lastVentaId, setLastVentaId] = useState<number | null>(null)
  const [lastTotal, setLastTotal] = useState(0)
  const [tab, setTab] = useState<Tab>('postres')
  const [search, setSearch] = useState('')
  const [clienteSearch, setClienteSearch] = useState('')
  const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(null)
  const [showClienteSearch, setShowClienteSearch] = useState(false)
  const [mobileCartOpen, setMobileCartOpen] = useState(false)

  const { data: productos = [] } = useQuery<Producto[]>({ queryKey: ['productos'], queryFn: productosApi.findAll })
  const { data: recetas = [] } = useQuery<Receta[]>({ queryKey: ['recetas'], queryFn: recetasApi.findAll })
  const { data: clientes = [] } = useQuery<Cliente[]>({ queryKey: ['clientes'], queryFn: clientesApi.findAll })

  const ventaMut = useMutation({
    mutationFn: async () => {
      const total = carrito.reduce((sum, i) => sum + i.precio * i.cantidad, 0)
      const venta = await ventasApi.create({
        total,
        ...(clienteSeleccionado ? { cliente: { id: clienteSeleccionado.id } } : {}),
      })
      await Promise.all(
        carrito.map(item =>
          detalleVentaApi.create({
            venta: { id: venta.id },
            tipo: item.tipo,
            ...(item.tipo === 'RECETA' ? { receta: { id: item.id } } : { producto: { id: item.id } }),
            cantidad: item.cantidad,
            precioUnitario: item.precio,
          })
        )
      )
      return venta
    },
    onSuccess: (venta) => {
      qc.invalidateQueries({ queryKey: ['ventas'] })
      setLastVentaId(venta.id)
      setLastTotal(carrito.reduce((sum, i) => sum + i.precio * i.cantidad, 0))
      setSuccess(true)
      setMobileCartOpen(false)
      toast.success(`Venta #${venta.id} registrada`)
    },
    onError: (e: Error) => toast.error(e.message),
  })

  const addItem = (item: ItemCarritoInput) => {
    setCarrito(prev => {
      const key = `${item.tipo}-${item.id}`
      const exists = prev.find(i => `${i.tipo}-${i.id}` === key)
      if (exists) return prev.map(i => `${i.tipo}-${i.id}` === key ? { ...i, cantidad: i.cantidad + 1 } : i)
      return [...prev, { ...item, cantidad: 1 }]
    })
  }

  const updateQty = (tipo: string, id: number, delta: number) => {
    setCarrito(prev =>
      prev.map(i => `${i.tipo}-${i.id}` === `${tipo}-${id}` ? { ...i, cantidad: i.cantidad + delta } : i)
          .filter(i => i.cantidad > 0)
    )
  }

  const removeItem = (tipo: string, id: number) => {
    setCarrito(prev => prev.filter(i => `${i.tipo}-${i.id}` !== `${tipo}-${id}`))
  }

  const total = carrito.reduce((sum, i) => sum + i.precio * i.cantidad, 0)
  const totalItems = carrito.reduce((sum, i) => sum + i.cantidad, 0)
  const recetasFiltradas = recetas.filter(r => r.nombrePostre.toLowerCase().includes(search.toLowerCase()))
  const productosFiltrados = productos.filter(p => p.nombre.toLowerCase().includes(search.toLowerCase()))

  const cartProps = {
    carrito, clienteSeleccionado, clienteSearch, clientes,
    showClienteSearch, setClienteSearch, setShowClienteSearch, setClienteSeleccionado,
    updateQty, removeItem, total, totalItems,
    onConfirm: () => ventaMut.mutate(),
    confirming: ventaMut.isPending,
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <CheckCircle size={32} className="text-primary" />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-semibold text-foreground">¡Venta registrada!</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Venta #{lastVentaId} — Total: ${lastTotal.toFixed(2)}
            {clienteSeleccionado && ` — ${clienteSeleccionado.nombre}`}
          </p>
        </div>
        <div className="flex gap-3 mt-2">
          <Button variant="outline" onClick={() => navigate('/ventas')}>Ver historial</Button>
          <Button onClick={() => { setCarrito([]); setSuccess(false); setClienteSeleccionado(null) }}>Nueva venta</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="pb-24 lg:pb-0">
      <PageHeader title="Nueva Venta" description="Registra una venta de postres o productos" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Catálogo */}
        <div className="lg:col-span-2 space-y-4">
          {/* Tabs */}
          <div className="flex items-center gap-1 p-1 bg-muted rounded-lg w-fit">
            {(['postres', 'productos'] as Tab[]).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${t === tab ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
              >
                {t === 'postres' ? <BookOpen size={14} /> : <Package size={14} />}
                {t === 'postres' ? 'Postres' : 'Productos'}
              </button>
            ))}
          </div>

          {/* Buscador */}
          <div className="relative max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={tab === 'postres' ? 'Buscar postre...' : 'Buscar producto...'}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 h-8 text-sm"
            />
          </div>

          {/* Grid de items */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {tab === 'postres' ? recetasFiltradas.map(r => {
              const enCarrito = carrito.find(i => i.tipo === 'RECETA' && i.id === r.id)
              return (
                <button key={r.id}
                  onClick={() => addItem({ tipo: 'RECETA', id: r.id, nombre: r.nombrePostre, precio: r.precio, imagen: r.imagen })}
                  className="relative flex flex-col items-start p-3 border border-border rounded-lg bg-card hover:border-primary/50 hover:shadow-sm transition-all text-left">
                  {r.imagen ? (
                    <img src={`data:image/jpeg;base64,${r.imagen.imagen}`} alt={r.nombrePostre} className="w-full h-20 object-cover rounded-md mb-2 border border-border" />
                  ) : (
                    <div className="w-full h-20 rounded-md bg-primary/10 mb-2 flex items-center justify-center">
                      <BookOpen size={20} className="text-primary/60" />
                    </div>
                  )}
                  <p className="text-xs font-medium text-foreground line-clamp-2 w-full">{r.nombrePostre}</p>
                  <p className="text-sm font-bold text-primary mt-0.5">${Number(r.precio).toFixed(2)}</p>
                  {enCarrito && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                      {enCarrito.cantidad}
                    </div>
                  )}
                </button>
              )
            }) : productosFiltrados.map(p => {
              const enCarrito = carrito.find(i => i.tipo === 'PRODUCTO' && i.id === p.id)
              return (
                <button key={p.id}
                  onClick={() => addItem({ tipo: 'PRODUCTO', id: p.id, nombre: p.nombre, precio: p.precio, imagen: p.imagen })}
                  className="relative flex flex-col items-start p-3 border border-border rounded-lg bg-card hover:border-primary/50 hover:shadow-sm transition-all text-left">
                  {p.imagen ? (
                    <img src={`data:image/jpeg;base64,${p.imagen.imagen}`} alt={p.nombre} className="w-full h-20 object-cover rounded-md mb-2 border border-border" />
                  ) : (
                    <div className="w-full h-20 rounded-md bg-muted mb-2 flex items-center justify-center">
                      <Package size={20} className="text-muted-foreground" />
                    </div>
                  )}
                  <p className="text-xs font-medium text-foreground line-clamp-2 w-full">{p.nombre}</p>
                  <p className="text-sm font-bold text-primary mt-0.5">${Number(p.precio).toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">Stock: {p.cantidad} {p.unidadMedida.nombre}</p>
                  {enCarrito && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                      {enCarrito.cantidad}
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Carrito desktop */}
        <div className="hidden lg:block lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <ShoppingCart size={16} />Carrito
                {totalItems > 0 && <Badge className="ml-auto">{totalItems}</Badge>}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CartContent {...cartProps} />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Carrito móvil — barra fija inferior */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-card border-t border-border p-3 safe-area-bottom">
        {carrito.length === 0 ? (
          <p className="text-center text-xs text-muted-foreground py-1">Selecciona items para comenzar</p>
        ) : (
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">{totalItems} {totalItems === 1 ? 'item' : 'items'}</p>
              <p className="text-lg font-bold text-primary leading-none">${total.toFixed(2)}</p>
            </div>
            <Button onClick={() => setMobileCartOpen(true)} className="gap-2 shrink-0">
              <ShoppingCart size={16} />
              Ver carrito
            </Button>
          </div>
        )}
      </div>

      {/* Sheet carrito móvil */}
      <Sheet open={mobileCartOpen} onOpenChange={setMobileCartOpen}>
        <SheetContent side="bottom" className="h-[85vh] flex flex-col">
          <SheetHeader className="shrink-0">
            <SheetTitle className="flex items-center gap-2">
              <ShoppingCart size={16} />Carrito
              {totalItems > 0 && <Badge>{totalItems}</Badge>}
            </SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto pt-2">
            <CartContent {...cartProps} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
