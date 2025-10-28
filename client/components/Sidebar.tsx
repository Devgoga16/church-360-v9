import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight, LayoutDashboard, FileText, Users, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const menuItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/",
  },
  {
    label: "Solicitudes",
    icon: FileText,
    href: "/solicitudes",
  },
  {
    label: "Usuarios",
    icon: Users,
    href: "/usuarios",
  },
  {
    label: "Configuración",
    icon: Settings,
    href: "/configuracion",
  },
];

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (href: string) => location.pathname === href;

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-30"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-16 h-[calc(100vh-4rem)] bg-gradient-to-b from-slate-900 to-slate-950 border-r border-slate-800 w-64 transition-all duration-300 ease-in-out z-40 md:relative md:top-0 flex flex-col shadow-xl",
          !isOpen && "-translate-x-full md:translate-x-0"
        )}
      >
        <nav className="flex-1 px-3 py-8 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 group relative",
                  active
                    ? "bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg shadow-purple-500/20"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/50"
                )}
              >
                <Icon className={cn(
                  "h-5 w-5 flex-shrink-0 transition-transform duration-200",
                  active ? "text-white" : "group-hover:scale-110"
                )} />
                <span className="flex-1">{item.label}</span>
                {active && (
                  <>
                    <ChevronRight className="h-4 w-4 ml-auto" />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 -z-10 blur opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-6 border-t border-slate-800 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 font-medium group">
            <LogOut className="h-5 w-5 flex-shrink-0 group-hover:scale-110 transition-transform" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>
    </>
  );
}
