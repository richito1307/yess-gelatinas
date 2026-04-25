import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Pencil, Trash2, BookOpen, ChevronDown, ChevronUp } from 'lucide-react'
import { toast } from 'sonner'
import { PageHeader } from '@/components/PageHeader'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { EmptyState } from '@/components/EmptyState'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { recetasApi } from '@/api/recetas'
import { ingredientesRecetaApi } from '@/api/ingredientesReceta'
import { productosApi } from '@/api/productos'
import { unidadesMedidaApi } from '@/api/unidadesMedida'
import type { Receta, IngredienteReceta, Producto, UnidadMedida } from '@/types'

function IngredientesPanel({
  receta,
  ingredientes,
  productos,
  unidades,
  onRefresh,
}: {
  receta: Receta
  ingredientes: IngredienteReceta[]
  productos: Producto[]
  unidades: UnidadMedida[]
  onRefresh: () => void
}) {
  const [productoId, setProductoId] = useState('')
  const [cantidad, setCantidad] = useState('')
  const [unidadId, setUnidadId] = useState('')
  const [adding, setAdding] = useState(false)

  const deleteMut = useMutation({
    mutationFn: ingredientesRecetaApi.delete,
    onSuccess: () => { onRefresh(); toast.success('Ingrediente eliminado') },
    onError: (e: Error) => toast.error(e.message),
  })

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setAdding(true)
    try {
      await ingredientesRecetaApi.create({
        receta: { id: receta.id },
        producto: { id: Number(productoId) },
        cantidad: Number(cantidad),
        unidadMedida: { id: Number(unidadId) },
      })
      onRefresh()
      setProductoId('')
      setCantidad('')
      setUnidadId('')
      toast.success('Ingrediente agregado')
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Error')
    } finally {
      setAdding(false)
    }
  }

  return (
    <div className="space-y-3">
      {ingredientes.length > 0 ? (
        <div className="border border-border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead>Ingrediente</TableHead>
                <TableHead>Cantidad</TableHead>
                <TableHead>Unidad</TableHead>
                <TableHead className="w-8"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ingredientes.map(ing => (
                <TableRow key={ing.id}>
                  <TableCell className="text-sm font-medium">{ing.producto.nombre}</TableCell>
                  <TableCell className="text-sm">{ing.cantidad}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{ing.unidadMedida.nombre}</TableCell>
                  <TableCell>
                    <Button size="icon-xs" variant="ghost"
                      className="hover:text-destructive hover:bg-destructive/10"
                      onClick={() => deleteMut.mutate(ing.id)}>
                      <Trash2 size={12} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground text-center py-3">Sin ingredientes</p>
      )}

      <form onSubmit={handleAdd} className="grid grid-cols-3 gap-2 items-end">
        <Select value={productoId} onValueChange={setProductoId} required>
          <SelectTrigger className="h-8 text-xs">
            <SelectValue placeholder="Producto..." />
          </SelectTrigger>
          <SelectContent>
            {productos.map(p => <SelectItem key={p.id} value={String(p.id)}>{p.nombre}</SelectItem>)}
          </SelectContent>
        </Select>
        <Input type="number" step="0.01" min="0.01" placeholder="Cantidad" value={cantidad}
          onChange={e => setCantidad(e.target.value)} className="h-8 text-xs" required />
        <Select value={unidadId} onValueChange={setUnidadId} required>
          <SelectTrigger className="h-8 text-xs">
            <SelectValue placeholder="Unidad..." />
          </SelectTrigger>
          <SelectContent>
            {unidades.map(u => <SelectItem key={u.id} value={String(u.id)}>{u.nombre}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button type="submit" size="sm" disabled={adding || !productoId || !cantidad || !unidadId}
          className="col-span-3 h-8 text-xs gap-1">
          <Plus size={12} />
          {adding ? 'Agregando...' : 'Agregar ingrediente'}
        </Button>
      </form>
    </div>
  )
}

export function Recetas() {
  const qc = useQueryClient()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Receta | undefined>()
  const [deleteTarget, setDeleteTarget] = useState<Receta | null>(null)
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [form, setForm] = useState({ nombre: '', descripcion: '', precio: '' })

  const { data: recetas = [], isLoading } = useQuery<Receta[]>({ queryKey: ['recetas'], queryFn: recetasApi.findAll })
  const { data: ingredientes = [], refetch: refetchIngredientes } = useQuery<IngredienteReceta[]>({
    queryKey: ['ingredientes-receta'],
    queryFn: ingredientesRecetaApi.findAll,
  })
  const { data: productos = [] } = useQuery<Producto[]>({ queryKey: ['productos'], queryFn: productosApi.findAll })
  const { data: unidades = [] } = useQuery<UnidadMedida[]>({ queryKey: ['unidades'], queryFn: unidadesMedidaApi.findAll })

  const createMut = useMutation({
    mutationFn: recetasApi.create,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['recetas'] }); closeDialog(); toast.success('Receta creada') },
    onError: (e: Error) => toast.error(e.message),
  })
  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Receta> }) => recetasApi.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['recetas'] }); closeDialog(); toast.success('Receta actualizada') },
    onError: (e: Error) => toast.error(e.message),
  })
  const deleteMut = useMutation({
    mutationFn: recetasApi.delete,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['recetas'] }); setDeleteTarget(null); toast.success('Receta eliminada') },
    onError: (e: Error) => toast.error(e.message),
  })

  const openCreate = () => { setEditTarget(undefined); setForm({ nombre: '', descripcion: '', precio: '' }); setDialogOpen(true) }
  const openEdit = (r: Receta) => {
    setEditTarget(r)
    setForm({ nombre: r.nombrePostre, descripcion: r.descripcion ?? '', precio: String(r.precio) })
    setDialogOpen(true)
  }
  const closeDialog = () => { setDialogOpen(false); setEditTarget(undefined) }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const data = { nombrePostre: form.nombre, descripcion: form.descripcion, precio: Number(form.precio) }
    if (editTarget) updateMut.mutate({ id: editTarget.id, data })
    else createMut.mutate(data)
  }

  const isMutating = createMut.isPending || updateMut.isPending

  return (
    <div>
      <PageHeader
        title="Recetas"
        description="Administra las recetas y sus ingredientes"
        action={
          <Button onClick={openCreate} className="gap-2">
            <Plus size={16} />Nueva receta
          </Button>
        }
      />

      <div className="border border-border rounded-lg overflow-hidden bg-card">
        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-muted-foreground text-sm">Cargando recetas...</div>
        ) : recetas.length === 0 ? (
          <EmptyState icon={BookOpen} title="Sin recetas" description="Agrega tu primera receta"
            action={<Button onClick={openCreate} size="sm" className="gap-2"><Plus size={14} />Nueva receta</Button>} />
        ) : (
          <div className="divide-y divide-border">
            {recetas.map(r => {
              const ings = ingredientes.filter(i => i.receta.id === r.id)
              const expanded = expandedId === r.id
              return (
                <div key={r.id}>
                  <div className="flex items-center px-4 py-3 hover:bg-muted/30">
                    <button
                      className="flex-1 flex items-center gap-3 text-left min-w-0"
                      onClick={() => setExpandedId(expanded ? null : r.id)}
                    >
                      <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                        <BookOpen size={14} className="text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{r.nombrePostre}</p>
                        {r.descripcion && (
                          <p className="text-xs text-muted-foreground truncate">{r.descripcion}</p>
                        )}
                      </div>
                      <Badge variant="secondary" className="shrink-0 text-xs ml-2">{ings.length} ingredientes</Badge>
                      <span className="text-sm font-semibold text-foreground shrink-0 ml-2">${Number(r.precio).toFixed(2)}</span>
                      <span className="text-muted-foreground shrink-0 ml-2">
                        {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </span>
                    </button>
                    <div className="flex items-center gap-1 ml-3 shrink-0">
                      <Button size="icon-sm" variant="ghost" onClick={() => openEdit(r)}><Pencil size={14} /></Button>
                      <Button size="icon-sm" variant="ghost"
                        className="hover:text-destructive hover:bg-destructive/10"
                        onClick={() => setDeleteTarget(r)}>
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                  {expanded && (
                    <div className="px-4 pb-4 pt-2 bg-muted/20 border-t border-border">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Ingredientes</p>
                      <IngredientesPanel
                        receta={r}
                        ingredientes={ings}
                        productos={productos}
                        unidades={unidades}
                        onRefresh={() => refetchIngredientes()}
                      />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={open => { if (!isMutating) { if (!open) closeDialog(); else setDialogOpen(true) } }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editTarget ? 'Editar receta' : 'Nueva receta'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Nombre del postre *</Label>
              <Input value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
                placeholder="Ej: Gelatina de mosaico" required />
            </div>
            <div className="space-y-1.5">
              <Label>Descripción</Label>
              <Textarea value={form.descripcion} onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))}
                placeholder="Descripción de la receta..." rows={3} />
            </div>
            <div className="space-y-1.5">
              <Label>Precio ($) *</Label>
              <Input type="number" step="0.01" min="0" value={form.precio}
                onChange={e => setForm(f => ({ ...f, precio: e.target.value }))} placeholder="0.00" required />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeDialog} disabled={isMutating}>Cancelar</Button>
              <Button type="submit" disabled={isMutating || !form.nombre || !form.precio}>
                {isMutating ? 'Guardando...' : editTarget ? 'Guardar cambios' : 'Crear receta'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={open => { if (!open) setDeleteTarget(null) }}
        title="¿Eliminar receta?"
        description={`Se eliminará "${deleteTarget?.nombrePostre}" permanentemente.`}
        onConfirm={() => deleteTarget && deleteMut.mutate(deleteTarget.id)}
        loading={deleteMut.isPending}
      />
    </div>
  )
}
