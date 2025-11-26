import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, Bell, User, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

interface HeaderProps {
  isSidebarOpen?: boolean;
  onToggleSidebar?: () => void;
}

export function Header({ onToggleSidebar }: HeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notificationCount] = useState(3);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const userName = user?.person?.nombreCompleto || user?.username || "Usuario";
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-[#042D62] border-[#031f42] dark:bg-[#042D62] dark:border-[#031f42] shadow-md">
      <div className="flex h-14 items-center justify-between px-3 md:px-4">
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleSidebar}
            className="inline-flex md:hidden items-center justify-center w-9 h-9 rounded-lg hover:bg-white/10 transition-colors text-white"
          >
            <Menu className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white shadow-lg shadow-white/20 font-logo">
              <span className="text-[#042D62] font-bold text-sm">✦</span>
            </div>
            <div className="hidden sm:flex flex-col">
              <h1 className="text-sm font-logo text-white leading-tight">
                Iglesia 360
              </h1>
              <span className="text-xs font-subheading text-white/70">
                IACYM - Comas
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Notifications */}
          <button className="relative p-1.5 rounded-lg hover:bg-white/10 transition-colors">
            <Bell className="h-4 w-4 text-white" />
            {notificationCount > 0 && (
              <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold text-[10px]">
                {notificationCount}
              </span>
            )}
          </button>

          {/* User Menu */}
          {user && (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center">
                  <span className="text-[#042D62] text-xs font-bold">
                    {userInitial}
                  </span>
                </div>
                <span className="text-xs font-medium text-white hidden sm:block">
                  {userName.split(" ")[0]}{" "}
                  {userName.split(" ")[1]?.charAt(0)}.
                </span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden z-50">
                  <div className="px-3 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800">
                    <p className="text-xs font-semibold text-[#042D62] dark:text-white">
                      {userName}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {user.email}
                    </p>
                  </div>
                  <div className="p-1.5">
                    <button className="w-full flex items-center gap-2 px-2 py-1.5 text-xs rounded-md hover:bg-[#042D62]/10 dark:hover:bg-[#042D62]/20 transition-colors text-slate-700 dark:text-slate-300 hover:text-[#042D62]">
                      <User className="h-3.5 w-3.5" />
                      Mi Perfil
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-md transition-colors"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
