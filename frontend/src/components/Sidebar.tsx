import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Package, BookOpen, ShoppingCart,
  History, Settings, LogOut, IceCream, Users, Ruler,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: '/productos', label: 'Productos', icon: Package },
  { to: '/recetas', label: 'Recetas', icon: BookOpen },
  { to: '/ventas/nueva', label: 'Nueva Venta', icon: ShoppingCart },
  { to: '/ventas', label: 'Historial Ventas', icon: History },
  { to: '/clientes', label: 'Clientes', icon: Users },
  { to: '/unidades-medida', label: 'Unidades', icon: Ruler },
  { to: '/configuracion', label: 'Configuración', icon: Settings },
]

interface SidebarProps {
  onNavigate?: () => void
}

export function Sidebar({ onNavigate }: SidebarProps) {
  const { auth, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className="w-60 shrink-0 border-r border-border bg-card flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-border">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground shadow-sm">
          <IceCream size={16} />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground leading-none">Yess</p>
          <p className="text-xs text-muted-foreground leading-none mt-0.5">Gelatinas</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ to, label, icon: Icon, exact }) => (
          <NavLink
            key={to}
            to={to}
            end={exact}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-secondary hover:text-secondary-foreground'
              )
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 pb-4 border-t border-border pt-4">
        <div className="flex items-center gap-2 px-3 py-2 mb-1">
          <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center">
            <span className="text-xs font-bold text-primary uppercase">{auth?.username?.[0] ?? 'U'}</span>
          </div>
          <span className="text-sm text-muted-foreground truncate">{auth?.username}</span>
        </div>
        <Button variant="ghost" size="sm"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          onClick={handleLogout}>
          <LogOut size={16} />Cerrar sesión
        </Button>
      </div>
    </aside>
  )
}
