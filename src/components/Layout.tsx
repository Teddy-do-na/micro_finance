import React from 'react';
import { User } from 'firebase/auth';
import { 
  LayoutDashboard, 
  Users, 
  Wallet, 
  PiggyBank, 
  Calculator, 
  FileText,
  Settings,
  LogOut, 
  Bell,
  Wifi,
  ChevronRight,
  Sun,
  Moon
} from 'lucide-react';
import { cn } from '../lib/utils';
import { UserRole, UserProfile } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentView: string;
  onViewChange: (view: any) => void;
  user: User;
  userProfile?: UserProfile;
  onLogout: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export function Layout({ 
  children, 
  currentView, 
  onViewChange, 
  user, 
  userProfile, 
  onLogout,
  isDarkMode,
  onToggleDarkMode
}: LayoutProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard, roles: Object.values(UserRole) },
    { id: 'members', label: 'Membres', icon: Users, roles: [UserRole.SUPER_ADMIN, UserRole.SECRETARY, UserRole.CASHIER, UserRole.SAVINGS_MANAGER, UserRole.CREDIT_MANAGER, UserRole.DIRECTOR, UserRole.AUDITOR, UserRole.ACCOUNTANT, UserRole.MEMBER] },
    { id: 'loans', label: 'Prêts', icon: Wallet, roles: [UserRole.SUPER_ADMIN, UserRole.CREDIT_MANAGER, UserRole.DIRECTOR, UserRole.AUDITOR, UserRole.ACCOUNTANT, UserRole.MEMBER], badge: 2 },
    { id: 'savings', label: 'Épargne', icon: PiggyBank, roles: [UserRole.SUPER_ADMIN, UserRole.SAVINGS_MANAGER, UserRole.CASHIER, UserRole.DIRECTOR, UserRole.AUDITOR, UserRole.MEMBER] },
    { id: 'cash', label: 'Caisse', icon: Calculator, roles: [UserRole.SUPER_ADMIN, UserRole.CASHIER, UserRole.DIRECTOR, UserRole.AUDITOR] },
    { id: 'reports', label: 'Comptabilité', icon: FileText, roles: [UserRole.SUPER_ADMIN, UserRole.ACCOUNTANT, UserRole.DIRECTOR, UserRole.AUDITOR] },
  ];

  const systemItems = [
    { id: 'settings', label: 'Paramètres', icon: Settings, roles: [UserRole.SUPER_ADMIN] },
  ];

  const role = userProfile?.role || UserRole.MEMBER; 
  const filteredNav = menuItems.filter(item => item.roles.includes(role));
  const filteredSystem = systemItems.filter(item => item.roles.includes(role));

  return (
    <div className="flex h-screen bg-[var(--bg-main)] overflow-hidden font-sans transition-colors duration-300">
      {/* Sidebar - Dark Professional (Capture 3 style) */}
      <aside className="w-68 bg-[#06231C] text-white/70 flex flex-col shrink-0 border-r border-[#0B2F26] z-20">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-[0_0_20px_rgba(16,185,129,0.2)]">
              CM
            </div>
            <div className="min-w-0">
              <h1 className="text-white font-[900] text-lg tracking-tight leading-none truncate">CMCC</h1>
              <p className="text-[9px] text-emerald-400 font-bold uppercase tracking-[0.1em] mt-1 truncate">Crédit Centrafrique</p>
            </div>
          </div>
        </div>

        <div className="flex-1 px-4 py-2 space-y-8 overflow-y-auto">
          <div className="space-y-1">
            <p className="px-5 mb-3 text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">Application</p>
            <nav className="space-y-1.5">
              {filteredNav.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all group",
                    currentView === item.id 
                      ? "bg-emerald-500/10 text-emerald-400 shadow-[inset_0_0_0_1px_rgba(16,185,129,0.1)]" 
                      : "hover:bg-white/5 hover:text-white"
                  )}
                >
                  <div className="flex items-center gap-3.5">
                    <item.icon className={cn("w-5 h-5", currentView === item.id ? "text-emerald-400" : "text-white/30 group-hover:text-emerald-400")} />
                    <span className={cn("text-xs font-bold tracking-tight", currentView === item.id ? "text-white" : "text-white/60")}>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="bg-rose-500 text-white text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-lg">
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {filteredSystem.length > 0 && (
            <div className="space-y-1">
              <p className="px-5 mb-3 text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">Système</p>
              <nav className="space-y-1.5">
                {filteredSystem.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onViewChange(item.id)}
                    className={cn(
                      "w-full flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all group",
                      currentView === item.id 
                        ? "bg-emerald-500/10 text-emerald-400 shadow-[inset_0_0_0_1px_rgba(16,185,129,0.1)]" 
                        : "hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <item.icon className={cn("w-5 h-5", currentView === item.id ? "text-emerald-400" : "text-white/30 group-hover:text-emerald-400")} />
                    <span className={cn("text-xs font-bold tracking-tight", currentView === item.id ? "text-white" : "text-white/60")}>{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          )}
        </div>

        {/* Status indicator (Style Capture 3) */}
        <div className="px-8 py-4 mb-4">
           <div className="flex items-center gap-3">
              <div className="relative">
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                <div className="absolute -right-0.5 -top-0.5 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              </div>
              <span className="text-[10px] text-white/30 font-black uppercase tracking-[0.1em]">Connecté — synchronisé</span>
           </div>
        </div>

        {/* User Card - Bottom Sidebar */}
        <div className="p-4 mx-3 mb-4 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white font-black shrink-0 shadow-lg text-xs italic">
              {user.displayName?.split(' ').map(n => n[0]).join('') || 'KT'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-black text-white truncate">{user.displayName || 'Komta Teddy'}</p>
              <p className="text-[9px] text-emerald-400/60 font-bold uppercase tracking-widest truncate">
                {userProfile?.role.replace('_', ' ') || 'Caissier'} • Bangui
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 bg-[var(--bg-card)] border-b border-[var(--border)] flex items-center justify-between px-8 shrink-0 z-10 transition-colors duration-300">
          <div className="space-y-0.5">
            <h2 className="text-xl font-[900] text-[var(--text-main)] tracking-tight leading-none uppercase italic underline decoration-emerald-500/20 underline-offset-4">
              {menuItems.find(i => i.id === currentView)?.label || currentView}
            </h2>
            <p className="text-[11px] text-[var(--text-muted)] font-bold tracking-tight opacity-70 italic">Système CMCC — Crédit Centrafrique</p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Dark Mode Toggle */}
            <button 
              onClick={onToggleDarkMode}
              className="w-10 h-10 flex items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-amber-500 dark:hover:text-amber-400 transition-all shadow-sm"
              title={isDarkMode ? "Activer mode clair" : "Activer mode sombre"}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 border border-[var(--border)] rounded-xl bg-[var(--bg-card)] shadow-sm">
              <div className="relative">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <div className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-500 animate-ping opacity-30" />
              </div>
              <span className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest">En ligne</span>
            </div>

            <button className="relative w-10 h-10 flex items-center justify-center border border-[var(--border)] rounded-xl shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
              <Bell className="w-5 h-5 text-[var(--text-muted)]" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-[var(--bg-card)] ring-1 ring-rose-500/10 shadow-sm" />
            </button>

            <div className="h-8 w-px bg-[var(--border)] mx-1" />

            {/* Header Logout Button - High Contrast Green (User Requested) */}
            <button 
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500 dark:bg-emerald-600 hover:bg-emerald-600 dark:hover:bg-emerald-700 text-white dark:text-emerald-50 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] shadow-lg transition-all active:scale-95"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Sortie sécurisée</span>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-auto">
          <div className="max-w-[1600px] mx-auto p-8">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
