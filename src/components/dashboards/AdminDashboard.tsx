import React from 'react';
import { 
  Users, 
  Wallet, 
  TrendingUp, 
  Settings, 
  ShieldCheck, 
  Activity, 
  Database,
  Lock,
  ArrowUp,
  ArrowDown,
  Bell,
  BarChart3,
  Globe,
  LayoutGrid,
  ShieldAlert,
  ChevronRight,
  UserCheck,
  FileText
} from 'lucide-react';
import { Member, Loan, Transaction } from '../../types';
import { formatCurrency, cn } from '../../lib/utils';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface DashboardProps {
  members: Member[];
  loans: Loan[];
  transactions: Transaction[];
  isDarkMode: boolean;
  onViewChange?: (view: 'dashboard' | 'members' | 'loans' | 'savings' | 'cash' | 'reports' | 'settings') => void;
  onAction?: (actionId: string) => void;
}

export function AdminDashboard({ members, loans, transactions, isDarkMode, onViewChange }: DashboardProps) {
  const activeMembers = members.filter(m => m.status === 'active').length;
  const inactiveMembers = members.length - activeMembers;
  
  const stats = [
    { label: 'Total Membres', value: members.length, icon: Users, color: '#10B981', trend: '+12% ce mois' },
    { label: 'Total Épargne', value: formatCurrency(14500000), icon: Wallet, color: '#3B82F6', trend: 'Capitaux gérés' },
    { label: 'Total Crédits', value: formatCurrency(45200000), icon: TrendingUp, color: '#F59E0B', trend: 'Encours global' },
    { label: 'Encaisse Disponible', value: formatCurrency(8200000), icon: ShieldCheck, color: '#8B5CF6', trend: 'Position Caisse' },
  ];

  const secondaryStats = [
    { label: 'Taux Remboursement', value: '94.2%', icon: BarChart3, color: '#10B981' },
    { label: 'Utilisateurs Connectés', value: '08', icon: UserCheck, color: '#3B82F6' },
  ];

  const adminModules = [
    { label: 'Gestion Utilisateurs', icon: Users, desc: 'RÔLES & DROITS', view: 'settings' as const },
    { label: 'Paramètres Système', icon: Settings, desc: 'CONFIG GLOBALE', view: 'settings' as const },
    { label: 'Rapports Globaux', icon: FileText, desc: 'COMPTABILITÉ / RH', view: 'reports' as const },
    { label: 'Logs de Sécurité', icon: Activity, desc: 'SURVEILLANCE LIVE', view: 'reports' as const },
    { label: 'Sauvegardes', icon: Database, desc: 'DATA CLOUD / RCA', view: 'settings' as const },
    { label: 'Gestion des Droits', icon: Lock, desc: 'HIERARCHIE ACCÈS', view: 'settings' as const },
  ];

  const pieData = [
    { name: 'Actifs', value: activeMembers, color: '#10B981' },
    { name: 'Inactifs', value: inactiveMembers, color: '#F43F5E' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in zoom-in duration-1000">
      {/* Role-Specific Horizontal Task Bar */}
      <div className="flex flex-wrap gap-4 p-4 bg-slate-900/5 dark:bg-white/5 rounded-[4rem] border border-[var(--border)] backdrop-blur-md">
        {adminModules.map((mod, i) => (
          <button 
            key={i} 
            onClick={() => onViewChange?.(mod.view)}
            className="flex-1 min-w-[200px] flex items-center gap-5 p-7 bg-white dark:bg-[#0B1224] rounded-[3.5rem] border border-[var(--border)] hover:border-slate-950 dark:hover:border-white hover:bg-slate-900 dark:hover:bg-white hover:text-white dark:hover:text-slate-950 transition-all group shadow-sm"
          >
            <div className="p-4 rounded-[1.8rem] bg-slate-100 dark:bg-white/5 group-hover:bg-white/20 transition-colors shadow-inner">
              <mod.icon className="w-8 h-8" />
            </div>
            <div className="text-left">
              <p className="text-[12px] font-[900] uppercase tracking-tight leading-none italic">{mod.label}</p>
              <p className="text-[9px] font-bold opacity-40 uppercase tracking-[0.2em] mt-2 leading-none italic">{mod.desc}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-[var(--bg-card)] p-12 rounded-[4.5rem] border border-[var(--border)] shadow-md group hover:shadow-4xl transition-all relative overflow-hidden">
             <div className="absolute top-0 right-0 p-10 opacity-[0.03] scale-150 rotate-45 group-hover:rotate-90 transition-transform duration-1000">
                <stat.icon className="w-48 h-48" />
             </div>
             <div className="flex justify-between items-start mb-12">
              <div className="p-5 rounded-3xl shadow-sm transform group-hover:scale-125 transition-transform" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
                <stat.icon className="w-10 h-10" />
              </div>
            </div>
            <h3 className="text-5xl font-[900] tracking-tighter text-[var(--text-main)] leading-none mb-4 italic">{stat.value}</h3>
            <p className="text-[15px] font-[900] text-[var(--text-muted)] uppercase tracking-[0.2em] leading-none italic opacity-60 underline decoration-slate-500/20 underline-offset-8">{stat.label}</p>
            <p className="mt-8 text-[10px] font-black uppercase tracking-widest bg-slate-100 dark:bg-white/5 px-4 py-1.5 rounded-full inline-block italic" style={{ color: stat.color }}>{stat.trend}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 bg-[var(--bg-card)] p-14 rounded-[5rem] border border-[var(--border)] shadow-md relative overflow-hidden">
           <div className="flex justify-between items-start mb-16 relative z-10">
              <div>
                 <h3 className="text-3xl font-[900] text-[var(--text-main)] tracking-tight uppercase italic underline decoration-slate-500/20 decoration-8 underline-offset-4">Flux de Trésorerie & Épargne</h3>
                 <p className="text-[11px] font-black text-[var(--text-muted)] uppercase tracking-[0.4em] mt-5 opacity-40 italic">CONSOLIDATION GLOBALE SYSTÈME 2024</p>
              </div>
              <div className="flex gap-4">
                 {secondaryStats.map((s, i) => (
                   <div key={i} className="px-8 py-4 bg-slate-50 dark:bg-white/5 rounded-[2.5rem] border border-[var(--border)] text-center">
                      <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-1 italic opacity-50">{s.label}</p>
                      <p className="text-2xl font-[900] italic" style={{ color: s.color }}>{s.value}</p>
                   </div>
                 ))}
              </div>
           </div>
           
           <div className="h-[400px] relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={[
                   { x: 'Jan', savings: 4000, loans: 2400 },
                   { x: 'Fév', savings: 4500, loans: 2600 },
                   { x: 'Mar', savings: 5200, loans: 3200 },
                   { x: 'Avr', savings: 4800, loans: 3000 },
                   { x: 'Mai', savings: 6100, loans: 4200 },
                   { x: 'Juin', savings: 7200, loans: 4800 },
                 ]}>
                    <defs>
                       <linearGradient id="savingsGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10B981" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                       </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? "#1e293b" : "#f1f5f9"} opacity={0.3} />
                    <XAxis dataKey="x" hide />
                    <YAxis hide />
                    <Tooltip 
                       contentStyle={{ borderRadius: '2rem', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)', background: '#000', color: '#fff', fontSize: '12px', fontWeight: 'bold', fontStyle: 'italic' }}
                    />
                    <Area type="monotone" dataKey="savings" stroke="#10B981" strokeWidth={6} fill="url(#savingsGrad)" />
                    <Area type="monotone" dataKey="loans" stroke="#3B82F6" strokeWidth={6} fillOpacity={0} />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        <div className="space-y-10">
           <div className="bg-slate-900 dark:bg-white p-14 rounded-[5rem] text-white dark:text-slate-900 shadow-3xl flex flex-col group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 group-hover:rotate-45 transition-transform duration-1000">
                 <Globe className="w-48 h-48" />
              </div>
              <h3 className="text-3xl font-[900] tracking-tighter mb-10 italic uppercase border-b-2 border-white/10 dark:border-slate-900/10 pb-6">Démographie Membres</h3>
              <div className="h-[250px] relative z-10 flex items-center justify-center">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                       <Pie
                          data={pieData}
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={10}
                          dataKey="value"
                       >
                          {pieData.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                       </Pie>
                       <Tooltip />
                    </PieChart>
                 </ResponsiveContainer>
                 <div className="absolute text-center mt-[-10px]">
                    <p className="text-5xl font-[900] italic leading-none">{members.length}</p>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40">TOTAL</p>
                 </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-8 relative z-10">
                 <div className="p-6 bg-white/5 dark:bg-slate-900/5 rounded-3xl border border-white/5 dark:border-slate-900/5 text-center">
                    <p className="text-[9px] font-black uppercase tracking-widest mb-1 opacity-40 italic">Actifs</p>
                    <p className="text-2xl font-[900] text-emerald-400">{activeMembers}</p>
                 </div>
                 <div className="p-6 bg-white/5 dark:bg-slate-900/5 rounded-3xl border border-white/5 dark:border-slate-900/5 text-center">
                    <p className="text-[9px] font-black uppercase tracking-widest mb-1 opacity-40 italic">Inactifs</p>
                    <p className="text-2xl font-[900] text-rose-400">{inactiveMembers}</p>
                 </div>
              </div>
           </div>

           <div className="bg-rose-500 p-14 rounded-[5rem] text-white shadow-4xl relative overflow-hidden group border-b-[20px] border-rose-600">
              <div className="absolute top-0 right-0 p-10 opacity-20 group-hover:scale-125 transition-transform duration-1000">
                 <ShieldAlert className="w-24 h-24" />
              </div>
              <p className="text-[12px] font-black uppercase tracking-[0.3em] mb-4 italic opacity-100">Alertes Système</p>
              <div className="space-y-6">
                 <div className="flex gap-4 items-start">
                    <div className="w-2 h-2 rounded-full bg-white animate-ping mt-1.5" />
                    <p className="text-base font-bold italic leading-tight">3 tentatives de connexion infructueuses sur Agence Bimbo.</p>
                 </div>
                 <div className="flex gap-4 items-start">
                    <div className="w-2 h-2 rounded-full bg-white opacity-40 mt-1.5" />
                    <p className="text-base font-bold italic leading-tight opacity-80">Sauvegarde automatique des données réussie (02:00).</p>
                 </div>
              </div>
              <button 
                onClick={() => onViewChange?.('reports')}
                className="mt-12 w-full py-6 bg-white text-rose-600 rounded-[2.5rem] font-[900] text-[12px] uppercase tracking-[0.4em] shadow-4xl italic group"
              >
                 Voir tous les logs <ChevronRight className="w-6 h-6 inline-block group-hover:translate-x-2 transition-transform" />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
