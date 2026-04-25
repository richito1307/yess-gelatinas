import { useState, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Pencil, Trash2, Package, Search, ImageIcon } from 'lucide-react'
import { toast } from 'sonner'
import { PageHeader } from '@/components/PageHeader'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { EmptyState } from '@/components/EmptyState'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { productosApi } from '@/api/productos'
import { unidadesMedidaApi } from '@/api/unidadesMedida'
import { historialApi } from '@/api/historial'
import type { Producto, UnidadMedida } from '@/types'

const LOW_STOCK = 5

function ProductoForm({
  producto,
  unidades,
  onSubmit,
  onClose,
  loading,
}: {
  producto?: Producto
  unidades: UnidadMedida[]
  onSubmit: (form: FormData) => void
  onClose: () => void
  loading: boolean
}) {
  const [nombre, setNombre] = useState(producto?.nombre ?? '')
  const [precio, setPrecio] = useState(String(producto?.precio ?? ''))
  const [cantidad, setCantidad] = useState(String(producto?.cantidad ?? ''))
  const [unidadId, setUnidadId] = useState(String(producto?.unidadMedida?.id ?? ''))
  const [preview, setPreview] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    const url = URL.createObjectURL(f)
    setPreview(url)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const form = new FormData()
    form.append('nombre', nombre)
    form.append('precio', precio)
    form.append('cantidad', cantidad)
    form.append('unidadMedidaId', unidadId)
    const file = fileRef.current?.files?.[0]
    if (file) form.append('imagen', file)
    onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 space-y-1.5">
          <Label htmlFor="nombre">Nombre del producto *</Label>
          <Input id="nombre" value={nombre} onChange={e => setNombre(e.target.value)} required placeholder="Ej: Gelatina de fresa" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="precio">Precio ($) *</Label>
          <Input id="precio" type="number" step="0.01" min="0.01" value={precio} onChange={e => setPrecio(e.target.value)} required placeholder="0.00" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="cantidad">Cantidad *</Label>
          <Input id="cantidad" type="number" step="0.01" min="0.01" value={cantidad} onChange={e => setCantidad(e.target.value)} required placeholder="0" />
        </div>
        <div className="col-span-2 space-y-1.5">
          <Label>Unidad de medida *</Label>
          <Select value={unidadId} onValueChange={setUnidadId} required>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona unidad..." />
            </SelectTrigger>
            <SelectContent>
              {unidades.map(u => (
                <SelectItem key={u.id} value={String(u.id)}>
                  {u.nombre} ({u.tipo})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-2 space-y-1.5">
          <Label>Imagen (opcional)</Label>
          <div
            className="border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => fileRef.current?.click()}
          >
            {preview ? (
              <img src={preview} alt="preview" className="h-24 mx-auto object-contain rounded" />
            ) : producto?.imagen ? (
              <img
                src={`data:image/jpeg;base64,${producto.imagen.imagen}`}
                alt={producto.nombre}
                className="h-24 mx-auto object-contain rounded"
              />
            ) : (
              <div className="flex flex-col items-center gap-1 py-2">
                <ImageIcon size={24} className="text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Click para seleccionar imagen</p>
              </div>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </div>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose} disabled={loading}>Cancelar</Button>
        <Button type="submit" disabled={loading || !nombre || !precio || !cantidad || !unidadId}>
          {loading ? 'Guardando...' : producto ? 'Guardar cambios' : 'Crear producto'}
        </Button>
      </DialogFooter>
    </form>
  )
}

export function Productos() {
  const qc = useQueryClient()
  const [search, setSearch] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Producto | undefined>()
  const [deleteTarget, setDeleteTarget] = useState<Producto | null>(null)

  const { data: productos = [], isLoading } = useQuery<Producto[]>({ queryKey: ['productos'], queryFn: productosApi.findAll })
  const { data: unidades = [] } = useQuery<UnidadMedida[]>({ queryKey: ['unidades'], queryFn: unidadesMedidaApi.findAll })

  const createMut = useMutation({
    mutationFn: productosApi.create,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['productos'] }); setDialogOpen(false); toast.success('Producto creado') },
    onError: (e: Error) => toast.error(e.message),
  })

  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormData }) => productosApi.update(id, data),
    onSuccess: async (updated, vars) => {
      const prev = productos.find(p => p.id === vars.id)
      if (prev && updated.precio !== prev.precio) {
        await historialApi.create({ producto: { id: updated.id }, precioAnterior: prev.precio, precioNuevo: updated.precio })
      }
      qc.invalidateQueries({ queryKey: ['productos'] })
      setDialogOpen(false)
      setEditTarget(undefined)
      toast.success('Producto actualizado')
    },
    onError: (e: Error) => toast.error(e.message),
  })

  const deleteMut = useMutation({
    mutationFn: productosApi.delete,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['productos'] }); setDeleteTarget(null); toast.success('Producto eliminado') },
    onError: (e: Error) => toast.error(e.message),
  })

  const filtered = productos.filter(p =>
    p.nombre.toLowerCase().includes(search.toLowerCase())
  )

  const openCreate = () => { setEditTarget(undefined); setDialogOpen(true) }
  const openEdit = (p: Producto) => { setEditTarget(p); setDialogOpen(true) }

  const handleSubmit = (form: FormData) => {
    if (editTarget) {
      updateMut.mutate({ id: editTarget.id, data: form })
    } else {
      createMut.mutate(form)
    }
  }

  const isMutating = createMut.isPending || updateMut.isPending

  return (
    <div>
      <PageHeader
        title="Productos"
        description="Gestiona el catálogo y stock de productos"
        action={
          <Button onClick={openCreate} className="gap-2">
            <Plus size={16} />
            Nuevo producto
          </Button>
        }
      />

      {/* Search */}
      <div className="relative mb-4 max-w-sm">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar producto..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Table */}
      <div className="border border-border rounded-lg overflow-hidden bg-card overflow-x-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-muted-foreground text-sm">Cargando productos...</div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={Package}
            title="Sin productos"
            description={search ? 'No hay productos que coincidan con la búsqueda' : 'Agrega tu primer producto para comenzar'}
            action={!search ? <Button onClick={openCreate} size="sm" className="gap-2"><Plus size={14} />Nuevo producto</Button> : undefined}
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="w-12">Img</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead className="hidden sm:table-cell">Unidad</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(p => (
                <TableRow key={p.id} className="hover:bg-muted/30">
                  <TableCell>
                    {p.imagen ? (
                      <img
                        src={`data:image/jpeg;base64,${p.imagen.imagen}`}
                        alt={p.nombre}
                        className="w-9 h-9 rounded-md object-cover border border-border"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-md bg-muted flex items-center justify-center">
                        <Package size={14} className="text-muted-foreground" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium text-foreground">{p.nombre}</TableCell>
                  <TableCell className="text-foreground">${Number(p.precio).toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={p.cantidad < LOW_STOCK ? 'destructive' : 'secondary'}>
                      {p.cantidad} {p.unidadMedida.nombre}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-muted-foreground text-sm">{p.unidadMedida.tipo}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button size="icon-sm" variant="ghost" onClick={() => openEdit(p)} title="Editar">
                        <Pencil size={14} />
                      </Button>
                      <Button size="icon-sm" variant="ghost" onClick={() => setDeleteTarget(p)} title="Eliminar"
                        className="hover:text-destructive hover:bg-destructive/10">
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={open => { if (!isMutating) { setDialogOpen(open); if (!open) setEditTarget(undefined) } }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editTarget ? 'Editar producto' : 'Nuevo producto'}</DialogTitle>
          </DialogHeader>
          <ProductoForm
            producto={editTarget}
            unidades={unidades}
            onSubmit={handleSubmit}
            onClose={() => setDialogOpen(false)}
            loading={isMutating}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={open => { if (!open) setDeleteTarget(null) }}
        title="¿Eliminar producto?"
        description={`Se eliminará "${deleteTarget?.nombre}" permanentemente. Esta acción no se puede deshacer.`}
        onConfirm={() => deleteTarget && deleteMut.mutate(deleteTarget.id)}
        loading={deleteMut.isPending}
      />
    </div>
  )
}
