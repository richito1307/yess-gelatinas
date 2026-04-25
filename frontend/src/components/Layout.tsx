import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Menu, IceCream } from 'lucide-react'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Sidebar } from './Sidebar'

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop sidebar — siempre visible */}
      <div className="hidden lg:flex lg:shrink-0">
        <Sidebar />
      </div>

      {/* Mobile sidebar — Sheet drawer */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0 w-60">
          <Sidebar onNavigate={() => setSidebarOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Área principal */}
      <main className="flex-1 overflow-y-auto flex flex-col min-w-0">
        {/* Header móvil con hamburger */}
        <header className="lg:hidden sticky top-0 z-20 flex items-center gap-3 px-4 py-3 border-b border-border bg-card shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="-ml-1 shrink-0"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={20} />
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
              <IceCream size={12} className="text-primary-foreground" />
            </div>
            <span className="text-sm font-semibold text-foreground">Yess Gelatinas</span>
          </div>
        </header>

        {/* Contenido de la página */}
        <div className="flex-1 p-4 lg:p-6 max-w-7xl w-full mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
