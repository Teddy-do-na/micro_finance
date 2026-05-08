import React from 'react';
import { 
  TrendingUp, 
  Users, 
  Target, 
  ShieldAlert, 
  PieChart, 
  ChevronRight,
  Activity,
  Briefcase,
  Globe,
  Award,
  BarChart3,
  Flame,
  CheckCircle2,
  FileCheck2,
  AlertTriangle,
  Zap
} from 'lucide-react';
import { Member, Loan, Transaction } from '../../types';
import { formatCurrency, cn } from '../../lib/utils';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

interface DashboardProps {
  members: Member[];
  loans: Loan[];
  transactions: Transaction[];
  isDarkMode: boolean;
  onViewChange?: (view: 'dashboard' | 'members' | 'loans' | 'savings' | 'cash' | 'reports' | 'settings') => void;
  onAction?: (actionId: string) => void;
}

export function DirectorDashboard({ members, loans, isDarkMode, onViewChange }: DashboardProps) {
  const stats = [
    { label: 'Performance Globale', value: 'AA+', icon: Award, color: '#10B981', trend: 'Rating Audit' },
    { label: 'Taux de Croissance', value: '+14.5%', icon: TrendingUp, color: '#3B82F6', trend: 'Objectif +12%' },
    { label: 'Rentabilité NET', value: '8.4%', icon: Zap, color: '#F59E0B', trend: 'En hausse' },
    { label: 'Risques Opérationnels', value: '2.1%', icon: AlertTriangle, color: '#EF4444', trend: 'Alerte Seuil 3%' },
  ];

  const directorTasks = [
    { label: 'Rapports Stratégiques', icon: Activity, desc: 'PILOTAGE EXÉCUTIF', view: 'reports' as const },
    { label: 'Validation Gros Montants', icon: FileCheck2, desc: 'DÉCISIONS TOP-NIVEAU', view: 'loans' as const },
    { label: 'Crédits Spéciaux', icon: Briefcase, desc: 'PROJETS AGRICOLES/PME', view: 'loans' as const },
    { label: 'Analyse Risques', icon: ShieldAlert, desc: 'CONFORMITÉ & AUDIT', view: 'reports' as const },
    { label: 'Suivi Objectifs', icon: Target, desc: 'KPI BANGUI 2025', view: 'dashboard' as const },
  ];

  return (
    <div className="space-y-12 animate-in fade-in zoom-in duration-1000">
      {/* Role-Specific Horizontal Task Bar */}
      <div className="flex flex-wrap gap-4 p-5 bg-slate-900/5 dark:bg-white/5 rounded-[4.5rem] border border-[var(--border)] backdrop-blur-xl shadow-2xl">
        {directorTasks.map((mod, i) => (
          <button 
            key={i} 
            onClick={() => onViewChange?.(mod.view)}
            className="flex-1 min-w-[220px] flex items-center gap-6 p-8 bg-white dark:bg-[#0B1224] rounded-[3.5rem] border border-[var(--border)] hover:border-slate-950 dark:hover:border-white hover:bg-slate-900 dark:hover:bg-white hover:text-white dark:hover:text-slate-950 transition-all group shadow-sm active:scale-95"
          >
            <div className="p-4 rounded-[1.8rem] bg-slate-100 dark:bg-white/5 group-hover:bg-white/20 transition-colors shadow-inner outline outline-transparent group-hover:outline-white/10">
              <mod.icon className="w-9 h-9" />
            </div>
            <div className="text-left">
              <p className="text-[13px] font-[900] uppercase tracking-tight leading-none italic">{mod.label}</p>
              <p className="text-[10px] font-bold opacity-30 uppercase tracking-[0.2em] mt-2 leading-none italic">{mod.desc}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {stats.map((stat, i) => (
          <div key={i} className="bg-[var(--bg-card)] p-14 rounded-[5rem] border border-[var(--border)] shadow-md group hover:shadow-4xl transition-all relative overflow-hidden">
             <div className="absolute top-0 right-0 p-12 opacity-[0.03] scale-150 rotate-45 group-hover:rotate-90 transition-transform duration-1000">
                <stat.icon className="w-64 h-64" />
             </div>
             <div className="flex justify-between items-start mb-14 transition-transform group-hover:-translate-y-2">
              <div className="p-6 rounded-[2rem] shadow-lg transform group-hover:scale-125 transition-transform" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
                <stat.icon className="w-12 h-12" />
              </div>
            </div>
            <h3 className="text-6xl font-[900] tracking-tighter text-[var(--text-main)] leading-none mb-4 italic italic transform group-hover:scale-105 origin-left transition-transform duration-500">{stat.value}</h3>
            <p className="text-[16px] font-[900] text-[var(--text-muted)] uppercase tracking-[0.2em] leading-none italic opacity-60 underline decoration-slate-500/15 underline-offset-10">{stat.label}</p>
            <p className="mt-10 text-[11px] font-black uppercase tracking-widest bg-slate-100 dark:bg-white/5 px-5 py-2 rounded-full inline-block italic" style={{ color: stat.color }}>{stat.trend}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 bg-[var(--bg-card)] p-16 rounded-[6rem] border border-[var(--border)] shadow-xl relative overflow-hidden">
           <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-20 relative z-10 gap-8">
              <div>
                 <h3 className="text-4xl font-[900] text-[var(--text-main)] tracking-tight uppercase italic underline decoration-slate-400/10 decoration-8 underline-offset-4">Trajectoire Stratégique</h3>
                 <p className="text-[12px] font-black text-[var(--text-muted)] uppercase tracking-[0.5em] mt-6 opacity-30 italic">CONSOLIDATION DU MODÈLE ÉCONOMIQUE CMCC 2024-2025</p>
              </div>
              <div className="flex gap-4">
                 <button className="px-8 py-4 bg-slate-50 dark:bg-white/5 border border-[var(--border)] rounded-[2.5rem] text-[11px] font-black uppercase tracking-[0.2em] hover:bg-slate-100 transition-all italic shadow-inner">Mensuel</button>
                 <button className="px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[2.5rem] text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl transform active:scale-95 transition-all italic border-b-4 border-slate-700 dark:border-slate-200">Trimestriel</button>
              </div>
           </div>
           
           <div className="h-[500px] relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={[
                   { x: 'JAN', y: 4000 },
                   { x: 'FÉV', y: 3500 },
                   { x: 'MAR', y: 4500 },
                   { x: 'AVR', y: 4800 },
                   { x: 'MAI', y: 4200 },
                   { x: 'JUIN', y: 5600 },
                 ]}>
                    <defs>
                       <linearGradient id="directorGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#000" stopOpacity={0.08}/>
                          <stop offset="95%" stopColor="#000" stopOpacity={0}/>
                       </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="6 6" vertical={false} stroke={isDarkMode ? "#ffffff" : "#000000"} opacity={0.05} />
                    <XAxis dataKey="x" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, opacity: 0.2 }} />
                    <YAxis hide />
                    <Tooltip 
                       contentStyle={{ borderRadius: '2.5rem', border: 'none', boxShadow: '0 40px 80px -20px rgb(0 0 0 / 0.3)', background: '#000', color: '#fff', fontSize: '13px', fontWeight: 'bold', fontStyle: 'italic', padding: '1.5rem' }}
                       cursor={{ stroke: '#000', strokeWidth: 1, strokeDasharray: '4 4', opacity: 0.2 }}
                    />
                    <Area type="monotone" dataKey="y" stroke={isDarkMode ? "#fff" : "#0f172a"} strokeWidth={10} fillOpacity={1} fill="url(#directorGrad)" />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        <div className="space-y-12">
           <div className="bg-slate-900 dark:bg-white p-16 rounded-[6rem] text-white dark:text-slate-900 shadow-4xl flex flex-col group relative overflow-hidden border-b-[30px] border-emerald-500">
              <div className="absolute -bottom-16 -right-16 opacity-5 group-hover:scale-125 transition-transform duration-1000">
                 <ShieldAlert className="w-80 h-80 rotate-12" />
              </div>
              <h3 className="text-4xl font-[900] tracking-tighter mb-12 italic uppercase border-b-2 border-white/5 dark:border-slate-950/5 pb-8">Cockpit Decision</h3>
              <div className="space-y-8 flex-1 relative z-10">
                 <div className="p-10 bg-white/5 dark:bg-slate-900/5 rounded-[4rem] border border-white/5 dark:border-slate-900/5 hover:border-emerald-500/30 transition-all cursor-pointer group/item">
                    <p className="text-[12px] font-black uppercase tracking-[0.3em] mb-4 italic opacity-30">Validation Urgente</p>
                    <p className="text-2xl font-[900] tracking-tight leading-tight uppercase italic underline underline-offset-8 decoration-emerald-500/20 group-hover:decoration-emerald-500">Lignes de Crédit Campagne Cacao (85M FCFA)</p>
                    <button className="mt-10 w-full py-6 bg-emerald-500 text-slate-950 rounded-[2.5rem] font-[900] text-[13px] uppercase tracking-[0.3em] shadow-3xl hover:bg-emerald-400 active:scale-95 transition-all italic flex items-center justify-center gap-4">
                       Approuver <CheckCircle2 className="w-6 h-6" />
                    </button>
                 </div>
                 
                 <div className="p-10 bg-rose-500/10 dark:bg-rose-500/5 rounded-[4rem] text-rose-500 border border-rose-500/20 shadow-inner group/alert overflow-hidden flex items-center gap-6">
                    <div className="w-5 h-5 rounded-full bg-rose-500 animate-pulse shadow-[0_0_20px_rgba(244,63,94,0.6)]" />
                    <div>
                       <p className="text-[12px] font-black uppercase tracking-[0.2em] mb-1 italic opacity-40">Risque</p>
                       <p className="text-xl font-[900] tracking-tight italic uppercase leading-tight line-clamp-1 truncate">Anomalie Agence Bossangoa</p>
                    </div>
                 </div>
              </div>
           </div>

           <div className="p-16 bg-[var(--bg-card)] border border-[var(--border)] rounded-[6rem] shadow-xl group relative overflow-hidden flex flex-col justify-center text-center">
              <div className="absolute top-0 left-0 p-12 opacity-5 rotate-12 transition-transform duration-2000 pointer-events-none">
                 <Target className="w-56 h-56" />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-[0.5em] mb-10 italic opacity-20">Executive Access</h3>
              <button 
                 onClick={() => onViewChange?.('reports')}
                 className="w-full py-12 bg-white dark:bg-slate-900 border-4 border-slate-950 dark:border-white rounded-[4rem] font-[900] text-[15px] uppercase tracking-[0.4em] flex items-center justify-center gap-6 hover:bg-slate-950 dark:hover:bg-white hover:text-white dark:hover:text-slate-900 transition-all shadow-4xl italic group active:translate-y-3"
              >
                 Board Reports <ChevronRight className="w-10 h-10 group-hover:translate-x-4 transition-transform duration-500" />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
