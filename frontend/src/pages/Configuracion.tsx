import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Download, CheckCircle, AlertCircle, Clock, FolderOpen } from 'lucide-react'
import { toast } from 'sonner'
import { PageHeader } from '@/components/PageHeader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { backupApi } from '@/api/backup'
import { useAuth } from '@/contexts/AuthContext'

export function Configuracion() {
  const { auth } = useAuth()
  const [lastBackup, setLastBackup] = useState<string | null>(null)

  const backupMut = useMutation({
    mutationFn: backupApi.crear,
    onSuccess: (data) => {
      setLastBackup(data.archivo)
      toast.success('Backup creado exitosamente')
    },
    onError: (e: Error) => toast.error(`Error al crear backup: ${e.message}`),
  })

  return (
    <div>
      <PageHeader title="Configuración" description="Ajustes del sistema y respaldos de datos" />

      <div className="space-y-4 max-w-2xl">
        {/* Backup */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Download size={16} />
              Respaldo de datos
            </CardTitle>
            <CardDescription>
              Crea un archivo .sql con todos los datos de la base de datos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3 p-3 rounded-md bg-muted/50">
              <Clock size={16} className="text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">Backup automático</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  El sistema crea un respaldo automático todos los días a las 2:00 AM.
                  Los archivos se guardan en <code className="bg-muted px-1 py-0.5 rounded text-xs">C:\YessBackups\</code>
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-md bg-muted/50">
              <FolderOpen size={16} className="text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">Sincronización con Google Drive</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Para subir los backups a Google Drive, instala la aplicación de Google Drive y
                  configúrala para sincronizar la carpeta <code className="bg-muted px-1 py-0.5 rounded text-xs">C:\YessBackups\</code>.
                  Los archivos se subirán automáticamente.
                </p>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">Backup manual</p>
              {lastBackup && (
                <div className="flex items-start gap-2 p-3 rounded-md bg-primary/5 border border-primary/20">
                  <CheckCircle size={15} className="text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-primary">Backup creado exitosamente</p>
                    <p className="text-xs text-muted-foreground font-mono mt-0.5 break-all">{lastBackup}</p>
                  </div>
                </div>
              )}
              <Button
                onClick={() => backupMut.mutate()}
                disabled={backupMut.isPending}
                variant="outline"
                className="gap-2"
              >
                <Download size={16} />
                {backupMut.isPending ? 'Creando backup...' : 'Crear backup ahora'}
              </Button>
              <p className="text-xs text-muted-foreground">
                También puedes ejecutar <code className="bg-muted px-1 py-0.5 rounded">backup.bat</code> directamente desde la carpeta del proyecto.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Sistema */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Información del sistema</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span className="text-sm text-muted-foreground">Usuario activo</span>
              <Badge variant="secondary">{auth?.username}</Badge>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span className="text-sm text-muted-foreground">Servidor backend</span>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span className="text-xs text-muted-foreground">localhost:8080</span>
              </div>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span className="text-sm text-muted-foreground">Base de datos</span>
              <span className="text-xs text-muted-foreground">MySQL · YessGelatinas</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-muted-foreground">Sistema</span>
              <Badge variant="outline">Yess Gelatinas v1.0</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Nota de seguridad */}
        <div className="flex items-start gap-3 p-3 rounded-md border border-amber-200 bg-amber-50">
          <AlertCircle size={16} className="text-amber-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-amber-800">Credenciales del sistema</p>
            <p className="text-xs text-amber-700 mt-0.5">
              Para cambiar el usuario o contraseña, edita el archivo{' '}
              <code className="bg-amber-100 px-1 py-0.5 rounded">application.properties</code>{' '}
              en la carpeta del servidor y reinicia el sistema.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
