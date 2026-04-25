import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Pencil, Trash2, Users, MapPin, ChevronDown, ChevronUp, Phone, Mail } from 'lucide-react'
import { toast } from 'sonner'
import { PageHeader } from '@/components/PageHeader'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { EmptyState } from '@/components/EmptyState'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { clientesApi, direccionesApi } from '@/api/clientes'
import type { Cliente, Direccion } from '@/types'

function DireccionesPanel({ cliente }: { cliente: Cliente }) {
  const qc = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [editDir, setEditDir] = useState<Direccion | null>(null)
  const [deleteDir, setDeleteDir] = useState<Direccion | null>(null)
  const [form, setForm] = useState({ alias: '', calle: '', colonia: '', ciudad: '', estado: '', codigoPostal: '', referencias: '', esPrincipal: false })

  const { data: dirs = [] } = useQuery<Direccion[]>({
    queryKey: ['direcciones', cliente.id],
    queryFn: () => clientesApi.getDirecciones(cliente.id),
  })

  const createMut = useMutation({
    mutationFn: () => direccionesApi.create({ cliente: { id: cliente.id }, ...form }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['direcciones', cliente.id] }); setShowForm(false); resetForm(); toast.success('Dirección agregada') },
    onError: (e: Error) => toast.error(e.message),
  })

  const updateMut = useMutation({
    mutationFn: () => direccionesApi.update(editDir!.id, form),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['direcciones', cliente.id] }); setEditDir(null); toast.success('Dirección actualizada') },
    onError: (e: Error) => toast.error(e.message),
  })

  const deleteMut = useMutation({
    mutationFn: (id: number) => direccionesApi.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['direcciones', cliente.id] }); setDeleteDir(null); toast.success('Dirección eliminada') },
    onError: (e: Error) => toast.error(e.message),
  })

  const resetForm = () => setForm({ alias: '', calle: '', colonia: '', ciudad: '', estado: '', codigoPostal: '', referencias: '', esPrincipal: false })

  const openEdit = (d: Direccion) => {
    setEditDir(d)
    setForm({ alias: d.alias ?? '', calle: d.calle, colonia: d.colonia ?? '', ciudad: d.ciudad, estado: d.estado ?? '', codigoPostal: d.codigoPostal ?? '', referencias: d.referencias ?? '', esPrincipal: d.esPrincipal })
  }

  const DirForm = ({ onSubmit, onCancel, loading }: { onSubmit: () => void; onCancel: () => void; loading: boolean }) => (
    <div className="space-y-3 mt-3 p-3 border border-border rounded-md bg-background">
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <Label className="text-xs">Alias (ej. Casa, Trabajo)</Label>
          <Input className="h-7 text-xs" value={form.alias} onChange={e => setForm(f => ({ ...f, alias: e.target.value }))} placeholder="Casa" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Ciudad *</Label>
          <Input className="h-7 text-xs" value={form.ciudad} onChange={e => setForm(f => ({ ...f, ciudad: e.target.value }))} placeholder="Ciudad" required />
        </div>
        <div className="col-span-2 space-y-1">
          <Label className="text-xs">Calle y número *</Label>
          <Input className="h-7 text-xs" value={form.calle} onChange={e => setForm(f => ({ ...f, calle: e.target.value }))} placeholder="Av. Principal 123" required />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Colonia</Label>
          <Input className="h-7 text-xs" value={form.colonia} onChange={e => setForm(f => ({ ...f, colonia: e.target.value }))} placeholder="Col. Centro" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">C.P.</Label>
          <Input className="h-7 text-xs" value={form.codigoPostal} onChange={e => setForm(f => ({ ...f, codigoPostal: e.target.value }))} placeholder="12345" />
        </div>
        <div className="col-span-2 space-y-1">
          <Label className="text-xs">Referencias</Label>
          <Input className="h-7 text-xs" value={form.referencias} onChange={e => setForm(f => ({ ...f, referencias: e.target.value }))} placeholder="Portón azul, entre calles..." />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" id={`principal-${cliente.id}`} checked={form.esPrincipal} onChange={e => setForm(f => ({ ...f, esPrincipal: e.target.checked }))} className="w-3.5 h-3.5 accent-primary" />
        <Label htmlFor={`principal-${cliente.id}`} className="text-xs cursor-pointer">Dirección principal</Label>
      </div>
      <div className="flex gap-2">
        <Button size="sm" className="h-7 text-xs gap-1" disabled={loading || !form.calle || !form.ciudad} onClick={onSubmit}>
          {loading ? 'Guardando...' : 'Guardar'}
        </Button>
        <Button size="sm" variant="outline" className="h-7 text-xs" onClick={onCancel} disabled={loading}>Cancelar</Button>
      </div>
    </div>
  )

  return (
    <div className="space-y-2">
      {dirs.map(d => (
        <div key={d.id} className="flex items-start gap-2 p-2.5 border border-border rounded-md bg-background group">
          <MapPin size={13} className="text-primary mt-0.5 shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              {d.alias && <span className="text-xs font-medium text-foreground">{d.alias}</span>}
              {d.esPrincipal && <Badge variant="secondary" className="text-xs py-0 px-1.5 h-4">Principal</Badge>}
            </div>
            <p className="text-xs text-muted-foreground">{d.calle}{d.colonia ? `, ${d.colonia}` : ''}</p>
            <p className="text-xs text-muted-foreground">{d.ciudad}{d.codigoPostal ? ` ${d.codigoPostal}` : ''}</p>
            {d.referencias && <p className="text-xs text-muted-foreground/70 italic">{d.referencias}</p>}
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            <Button size="icon-xs" variant="ghost" onClick={() => openEdit(d)}><Pencil size={11} /></Button>
            <Button size="icon-xs" variant="ghost" className="hover:text-destructive hover:bg-destructive/10" onClick={() => setDeleteDir(d)}><Trash2 size={11} /></Button>
          </div>
        </div>
      ))}

      {editDir && (
        <DirForm
          onSubmit={() => updateMut.mutate()}
          onCancel={() => { setEditDir(null); resetForm() }}
          loading={updateMut.isPending}
        />
      )}

      {showForm && !editDir && (
        <DirForm
          onSubmit={() => createMut.mutate()}
          onCancel={() => { setShowForm(false); resetForm() }}
          loading={createMut.isPending}
        />
      )}

      {!showForm && !editDir && (
        <Button size="sm" variant="outline" className="h-7 text-xs gap-1 w-full" onClick={() => setShowForm(true)}>
          <Plus size={12} />Agregar dirección
        </Button>
      )}

      <ConfirmDialog
        open={!!deleteDir}
        onOpenChange={open => { if (!open) setDeleteDir(null) }}
        title="¿Eliminar dirección?"
        description={`Se eliminará la dirección "${deleteDir?.calle}".`}
        onConfirm={() => deleteDir && deleteMut.mutate(deleteDir.id)}
        loading={deleteMut.isPending}
      />
    </div>
  )
}

function ClienteModal({ cliente, onClose }: { cliente?: Cliente; onClose: () => void }) {
  const qc = useQueryClient()
  const [form, setForm] = useState({
    nombre: cliente?.nombre ?? '',
    telefono: cliente?.telefono ?? '',
    email: cliente?.email ?? '',
    notas: cliente?.notas ?? '',
  })

  const saveMut = useMutation({
    mutationFn: () => cliente
      ? clientesApi.update(cliente.id, form)
      : clientesApi.create(form),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['clientes'] })
      onClose()
      toast.success(cliente ? 'Cliente actualizado' : 'Cliente creado')
    },
    onError: (e: Error) => toast.error(e.message),
  })

  return (
    <form onSubmit={e => { e.preventDefault(); saveMut.mutate() }} className="space-y-4">
      <div className="space-y-1.5">
        <Label>Nombre *</Label>
        <Input value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} placeholder="Nombre completo" required />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>Teléfono</Label>
          <Input value={form.telefono} onChange={e => setForm(f => ({ ...f, telefono: e.target.value }))} placeholder="555-000-0000" type="tel" />
        </div>
        <div className="space-y-1.5">
          <Label>Email</Label>
          <Input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="correo@ejemplo.com" type="email" />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label>Notas (alergias, preferencias...)</Label>
        <Textarea value={form.notas} onChange={e => setForm(f => ({ ...f, notas: e.target.value }))} placeholder="No le gusta el azúcar..." rows={2} />
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose} disabled={saveMut.isPending}>Cancelar</Button>
        <Button type="submit" disabled={saveMut.isPending || !form.nombre}>
          {saveMut.isPending ? 'Guardando...' : cliente ? 'Guardar cambios' : 'Crear cliente'}
        </Button>
      </DialogFooter>
    </form>
  )
}

export function Clientes() {
  const qc = useQueryClient()
  const [search, setSearch] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Cliente | undefined>()
  const [deleteTarget, setDeleteTarget] = useState<Cliente | null>(null)
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const { data: clientes = [], isLoading } = useQuery<Cliente[]>({
    queryKey: ['clientes'],
    queryFn: clientesApi.findAll,
  })

  const deleteMut = useMutation({
    mutationFn: clientesApi.delete,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['clientes'] }); setDeleteTarget(null); toast.success('Cliente eliminado') },
    onError: (e: Error) => toast.error(e.message),
  })

  const filtered = clientes.filter(c =>
    c.nombre.toLowerCase().includes(search.toLowerCase()) ||
    (c.telefono ?? '').includes(search) ||
    (c.email ?? '').toLowerCase().includes(search.toLowerCase())
  )

  const openCreate = () => { setEditTarget(undefined); setDialogOpen(true) }
  const openEdit = (c: Cliente) => { setEditTarget(c); setDialogOpen(true) }

  return (
    <div>
      <PageHeader
        title="Clientes"
        description="Gestiona tu cartera de clientes y sus direcciones"
        action={
          <Button onClick={openCreate} className="gap-2">
            <Plus size={16} />Nuevo cliente
          </Button>
        }
      />

      <div className="relative mb-4 max-w-sm">
        <Users size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Buscar por nombre, teléfono..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
      </div>

      <div className="border border-border rounded-lg overflow-hidden bg-card">
        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-muted-foreground text-sm">Cargando clientes...</div>
        ) : filtered.length === 0 ? (
          <EmptyState icon={Users} title="Sin clientes" description="Agrega tu primer cliente"
            action={<Button onClick={openCreate} size="sm" className="gap-2"><Plus size={14} />Nuevo cliente</Button>} />
        ) : (
          <div className="divide-y divide-border">
            {filtered.map(c => {
              const expanded = expandedId === c.id
              return (
                <div key={c.id}>
                  <div className="flex items-center px-4 py-3 hover:bg-muted/30">
                    <button className="flex-1 flex items-center gap-3 text-left" onClick={() => setExpandedId(expanded ? null : c.id)}>
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="text-sm font-semibold text-primary uppercase">{c.nombre[0]}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{c.nombre}</p>
                        <div className="flex items-center gap-3 mt-0.5">
                          {c.telefono && (
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Phone size={10} />{c.telefono}
                            </span>
                          )}
                          {c.email && (
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Mail size={10} />{c.email}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-muted-foreground shrink-0">
                        {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </span>
                    </button>
                    <div className="flex items-center gap-1 ml-3 shrink-0">
                      <Button size="icon-sm" variant="ghost" onClick={() => openEdit(c)}><Pencil size={14} /></Button>
                      <Button size="icon-sm" variant="ghost"
                        className="hover:text-destructive hover:bg-destructive/10"
                        onClick={() => setDeleteTarget(c)}>
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>

                  {expanded && (
                    <div className="px-4 pb-4 pt-2 bg-muted/20 border-t border-border">
                      {c.notas && (
                        <p className="text-xs text-muted-foreground italic mb-3 p-2 bg-background rounded border border-border">
                          📝 {c.notas}
                        </p>
                      )}
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Direcciones</p>
                      <DireccionesPanel cliente={c} />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={open => { if (!open) { setDialogOpen(false); setEditTarget(undefined) } }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editTarget ? 'Editar cliente' : 'Nuevo cliente'}</DialogTitle>
          </DialogHeader>
          {dialogOpen && (
            <ClienteModal
              cliente={editTarget}
              onClose={() => { setDialogOpen(false); setEditTarget(undefined) }}
            />
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={open => { if (!open) setDeleteTarget(null) }}
        title="¿Eliminar cliente?"
        description={`Se eliminará a "${deleteTarget?.nombre}" del sistema. Sus ventas registradas se conservan.`}
        onConfirm={() => deleteTarget && deleteMut.mutate(deleteTarget.id)}
        loading={deleteMut.isPending}
      />
    </div>
  )
}
