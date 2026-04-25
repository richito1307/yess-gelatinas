import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Pencil, Trash2, Ruler } from 'lucide-react'
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
import { unidadesMedidaApi } from '@/api/unidadesMedida'
import type { UnidadMedida } from '@/types'

export function UnidadesMedida() {
  const qc = useQueryClient()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<UnidadMedida | undefined>()
  const [deleteTarget, setDeleteTarget] = useState<UnidadMedida | null>(null)
  const [form, setForm] = useState({ nombre: '', tipo: '' as 'masa' | 'volumen', factorConversion: '' })

  const { data: unidades = [], isLoading } = useQuery<UnidadMedida[]>({
    queryKey: ['unidades'],
    queryFn: unidadesMedidaApi.findAll,
  })

  const createMut = useMutation({
    mutationFn: () => unidadesMedidaApi.create({ nombre: form.nombre, tipo: form.tipo, factorConversion: Number(form.factorConversion) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['unidades'] }); closeDialog(); toast.success('Unidad creada') },
    onError: (e: Error) => toast.error(e.message),
  })

  const updateMut = useMutation({
    mutationFn: () => unidadesMedidaApi.update(editTarget!.id, { nombre: form.nombre, tipo: form.tipo, factorConversion: Number(form.factorConversion) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['unidades'] }); closeDialog(); toast.success('Unidad actualizada') },
    onError: (e: Error) => toast.error(e.message),
  })

  const deleteMut = useMutation({
    mutationFn: unidadesMedidaApi.delete,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['unidades'] }); setDeleteTarget(null); toast.success('Unidad eliminada') },
    onError: (e: Error) => toast.error(e.message),
  })

  const openCreate = () => { setEditTarget(undefined); setForm({ nombre: '', tipo: 'masa', factorConversion: '1' }); setDialogOpen(true) }
  const openEdit = (u: UnidadMedida) => {
    setEditTarget(u)
    setForm({ nombre: u.nombre, tipo: u.tipo, factorConversion: String(u.factorConversion) })
    setDialogOpen(true)
  }
  const closeDialog = () => { setDialogOpen(false); setEditTarget(undefined) }
  const isMutating = createMut.isPending || updateMut.isPending

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editTarget) updateMut.mutate()
    else createMut.mutate()
  }

  return (
    <div>
      <PageHeader
        title="Unidades de Medida"
        description="Define las unidades usadas en productos e ingredientes"
        action={
          <Button onClick={openCreate} className="gap-2">
            <Plus size={16} />Nueva unidad
          </Button>
        }
      />

      <div className="border border-border rounded-lg overflow-hidden bg-card overflow-x-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-muted-foreground text-sm">Cargando...</div>
        ) : unidades.length === 0 ? (
          <EmptyState icon={Ruler} title="Sin unidades" description="Agrega unidades de medida como gramos, litros, piezas..."
            action={<Button onClick={openCreate} size="sm" className="gap-2"><Plus size={14} />Nueva unidad</Button>} />
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead>Nombre</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Factor de conversión</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {unidades.map(u => (
                <TableRow key={u.id} className="hover:bg-muted/30">
                  <TableCell className="font-medium text-foreground">{u.nombre}</TableCell>
                  <TableCell>
                    <Badge variant={u.tipo === 'masa' ? 'default' : 'secondary'} className="capitalize">
                      {u.tipo}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground font-mono text-sm">{u.factorConversion}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button size="icon-sm" variant="ghost" onClick={() => openEdit(u)}><Pencil size={14} /></Button>
                      <Button size="icon-sm" variant="ghost"
                        className="hover:text-destructive hover:bg-destructive/10"
                        onClick={() => setDeleteTarget(u)}>
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

      <Dialog open={dialogOpen} onOpenChange={open => { if (!isMutating && !open) closeDialog() }}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{editTarget ? 'Editar unidad' : 'Nueva unidad de medida'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Nombre *</Label>
              <Input value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
                placeholder="Ej: gramo, litro, pieza" required />
            </div>
            <div className="space-y-1.5">
              <Label>Tipo *</Label>
              <Select value={form.tipo} onValueChange={v => setForm(f => ({ ...f, tipo: v as 'masa' | 'volumen' }))}>
                <SelectTrigger><SelectValue placeholder="Selecciona tipo..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="masa">Masa (gramos, kg...)</SelectItem>
                  <SelectItem value="volumen">Volumen (litros, ml...)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Factor de conversión *</Label>
              <Input type="number" step="0.000001" min="0" value={form.factorConversion}
                onChange={e => setForm(f => ({ ...f, factorConversion: e.target.value }))}
                placeholder="1.0" required />
              <p className="text-xs text-muted-foreground">Relación con la unidad base (ej. 1000 para kg→g)</p>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeDialog} disabled={isMutating}>Cancelar</Button>
              <Button type="submit" disabled={isMutating || !form.nombre || !form.tipo || !form.factorConversion}>
                {isMutating ? 'Guardando...' : editTarget ? 'Guardar cambios' : 'Crear unidad'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={open => { if (!open) setDeleteTarget(null) }}
        title="¿Eliminar unidad?"
        description={`Se eliminará "${deleteTarget?.nombre}". Verifica que no esté en uso.`}
        onConfirm={() => deleteTarget && deleteMut.mutate(deleteTarget.id)}
        loading={deleteMut.isPending}
      />
    </div>
  )
}
