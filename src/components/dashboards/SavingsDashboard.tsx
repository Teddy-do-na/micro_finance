import React from 'react';
import { 
  PiggyBank, 
  TrendingUp, 
  History,
  Landmark,
  Clock,
  ShieldCheck,
  FilePlus,
  FileText,
  CircleDollarSign,
  ArrowDownLeft,
  ArrowUpRight,
  Calculator,
  ChevronRight,
  BarChart3,
  Flame
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency, cn } from '../../lib/utils';
import { Member } from '../../types';

interface DashboardProps {
  members: Member[];
  isDarkMode: boolean;
  onViewChange?: (view: 'dashboard' | 'members' | 'loans' | 'savings' | 'cash' | 'reports' | 'settings') => void;
  onAction?: (actionId: string) => void;
}

export function SavingsDashboard({ isDarkMode, onViewChange, members }: DashboardProps) {
  const activeAccounts = members.length * 1.2; // Simulated: some members have multiple accounts
  
  const stats = [
    { label: 'Total Épargne Collectée', value: '425.8M', icon: Landmark, color: '#3B82F6', trend: 'RCA 2024' },
    { label: 'Comptes Actifs', value: Math.floor(activeAccounts), icon: PiggyBank, color: '#10B981', trend: 'Ouverts' },
    { label: 'Intérêts Générés', value: formatCurrency(1250000), icon: TrendingUp, color: '#F59E0B', trend: 'Provisionnés' },
    { label: 'Collecte du Mois', value: '18.4M', icon: BarChart3, color: '#8B5CF6', trend: 'Flux entrant' },
  ];

  const savingsTasks = [
    { label: 'Comptes Épargne', icon: Landmark, desc: 'GESTION PLANS', view: 'savings' as const },
    { label: 'Nouveau Dépôt', icon: ArrowDownLeft, desc: 'ALIMENTATION', view: 'cash' as const },
    { label: 'Nouveau Retrait', icon: ArrowUpRight, desc: 'DÉCAISSEMENT', view: 'cash' as const },
    { label: 'Calcul Intérêts', icon: Calculator, desc: 'SIMULATION / RUN', view: 'savings' as const },
    { label: 'Historique Global', icon: History, desc: 'ARCHIVES FLUX', view: 'reports' as const },
  ];

  return (
    <div className="space-y-10 animate-in fade-in zoom-in duration-1000">
      {/* Role-Specific Horizontal Task Bar */}
      <div className="flex flex-wrap gap-4 p-4 bg-blue-500/5 dark:bg-white/5 rounded-[4rem] border border-blue-500/10 backdrop-blur-md">
        {savingsTasks.map((mod, i) => (
          <button 
            key={i} 
            onClick={() => onViewChange?.(mod.view)}
            className="flex-1 min-w-[200px] flex items-center gap-5 p-7 bg-white dark:bg-[#0B1224] rounded-[3.5rem] border border-[var(--border)] hover:border-blue-500 hover:bg-blue-500 hover:text-white transition-all group shadow-sm"
          >
            <div className="p-4 rounded-[1.8rem] bg-blue-500/10 group-hover:bg-white/20 transition-colors shadow-inner text-blue-500 group-hover:text-white">
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
          <div key={i} className="bg-[var(--bg-card)] p-12 rounded-[4.5rem] border border-[var(--border)] shadow-md hover:shadow-4xl transition-all relative overflow-hidden group">
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
                 <h3 className="text-3xl font-[900] text-[var(--text-main)] tracking-tight uppercase italic underline decoration-blue-500/20 decoration-8 underline-offset-4">Performance Épargne</h3>
                 <p className="text-[11px] font-black text-[var(--text-muted)] uppercase tracking-[0.4em] mt-5 opacity-40 italic font-black">VOLUMÉTRIE DES DÉPÔTS CMCC (EN MILLIONS FCFA)</p>
              </div>
           </div>
           
           <div className="h-[400px] relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={[
                   { x: 'Jan', val: 320 },
                   { x: 'Fév', val: 350 },
                   { x: 'Mar', val: 310 },
                   { x: 'Avr', val: 380 },
                   { x: 'Mai', val: 400 },
                   { x: 'Juin', val: 425.8 },
                 ]}>
                    <defs>
                       <linearGradient id="savingsTrend" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                       </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? "#1e293b" : "#f1f5f9"} opacity={0.3} />
                    <XAxis dataKey="x" hide />
                    <YAxis hide />
                    <Tooltip 
                       contentStyle={{ borderRadius: '2rem', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)', background: '#000', color: '#fff', fontSize: '12px', fontWeight: 'bold', fontStyle: 'italic' }}
                    />
                    <Area type="monotone" dataKey="val" stroke="#3B82F6" strokeWidth={6} fill="url(#savingsTrend)" />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        <div className="space-y-10">
           <div className="bg-slate-900 dark:bg-white p-14 rounded-[5rem] text-white dark:text-slate-900 shadow-3xl flex flex-col group relative overflow-hidden border-b-[20px] border-blue-500">
              <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 group-hover:rotate-45 transition-transform duration-1000">
                 <Flame className="w-48 h-48" />
              </div>
              <h3 className="text-3xl font-[900] tracking-tighter mb-10 italic uppercase border-b-2 border-white/10 dark:border-slate-900/10 pb-6">Campagne DAT</h3>
              <div className="space-y-6 relative z-10">
                 <div className="p-8 bg-white/5 dark:bg-slate-900/5 rounded-[3rem] border border-white/5 dark:border-slate-900/5">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] mb-4 italic opacity-40">Dépôts à Terme</p>
                    <p className="text-3xl font-[900] tracking-tight leading-none uppercase italic text-emerald-400">Jusqu'à 6.5%</p>
                    <p className="mt-4 text-[13px] font-bold italic opacity-80">Boostez votre capital avec le CMCC.</p>
                 </div>
                 <button 
                  onClick={() => onViewChange?.('reports')}
                  className="w-full py-8 bg-blue-500 text-white rounded-[3.5rem] font-[900] text-[13px] uppercase tracking-[0.4em] shadow-4xl italic group border-b-8 border-blue-600 active:translate-y-2 active:border-b-0 transition-all flex items-center justify-center gap-4"
                 >
                    Détails Offre <ChevronRight className="w-8 h-8 group-hover:translate-x-3 transition-transform" />
                 </button>
              </div>
           </div>

           <div className="p-14 bg-[var(--bg-card)] border border-[var(--border)] rounded-[5rem] shadow-md group relative overflow-hidden">
              <div className="absolute -bottom-10 -left-10 opacity-5 group-hover:rotate-12 transition-transform duration-700">
                 <Calculator className="w-64 h-64" />
              </div>
              <h3 className="text-2xl font-[900] text-[var(--text-main)] mb-10 tracking-tight uppercase italic underline decoration-slate-500/10 decoration-8 underline-offset-8">Simulation</h3>
              <div className="space-y-6 relative z-10">
                 <div className="p-8 bg-slate-50 dark:bg-[#0B1224] rounded-[3rem] border border-[var(--border)] text-center">
                    <p className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-widest mb-2 opacity-50 italic">Calcul d'intérêts sur 1M FCFA / AN</p>
                    <p className="text-3xl font-[900] tracking-tighter italic text-blue-500">35.000 FCFA</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
