import React from 'react';
import { 
  ShieldCheck, 
  Activity, 
  History, 
  Search, 
  FileSearch, 
  AlertTriangle,
  ClipboardList,
  Eye,
  CheckCircle,
  Scan,
  Zap,
  CalendarDays,
  FileText,
  Lock,
  ChevronRight,
  GanttChart
} from 'lucide-react';
import { Transaction, Loan, Member } from '../../types';
import { formatCurrency, cn } from '../../lib/utils';

interface DashboardProps {
  transactions: Transaction[];
  loans: Loan[];
  members: Member[];
  isDarkMode: boolean;
  onViewChange?: (view: 'dashboard' | 'members' | 'loans' | 'savings' | 'cash' | 'reports' | 'settings') => void;
  onAction?: (actionId: string) => void;
}

export function AuditorDashboard({ transactions, loans, onViewChange }: DashboardProps) {
  const stats = [
    { label: 'Conformité Globale', value: '98.4%', icon: ShieldCheck, color: '#10B981', trend: 'Audit Continu' },
    { label: 'Points Audit Ouverts', value: '02', icon: GanttChart, color: '#EF4444', trend: 'Action Requise' },
    { label: 'Risques Identifiés', value: '07', icon: AlertTriangle, color: '#F59E0B', trend: 'Niveau Modéré' },
    { label: 'Flux Audités (24h)', value: transactions.length, icon: Zap, color: '#3B82F6', trend: 'Analyse Live' },
  ];

  const auditorTasks = [
    { label: 'Plan d\'Audit', icon: CalendarDays, desc: 'OUVERTURE MISSION', view: 'reports' as const },
    { label: 'Contrôle Interne', icon: Lock, desc: 'VÉRIFICATION SYSTÈMES', view: 'reports' as const },
    { label: 'Rapports d\'Audit', icon: FileText, desc: 'SYNTHÈSES & ÉTATS', view: 'reports' as const },
    { label: 'Piste d\'Audit', icon: Search, desc: 'JOURNAL SÉCURITÉ', view: 'settings' as const },
    { label: 'Conformité (KYC)', icon: CheckCircle, desc: 'RÈGLES OHADA', view: 'members' as const },
  ];

  return (
    <div className="space-y-10 animate-in fade-in zoom-in duration-1000">
      {/* Role-Specific Horizontal Task Bar */}
      <div className="flex flex-wrap gap-4 p-4 bg-emerald-500/5 dark:bg-white/5 rounded-[4rem] border border-emerald-500/10 backdrop-blur-md">
        {auditorTasks.map((mod, i) => (
          <button 
            key={i} 
            onClick={() => onViewChange?.(mod.view)}
            className="flex-1 min-w-[200px] flex items-center gap-5 p-7 bg-white dark:bg-[#0B1224] rounded-[3.5rem] border border-[var(--border)] hover:border-emerald-500 hover:bg-emerald-500 hover:text-white transition-all group shadow-sm active:scale-95"
          >
            <div className="p-4 rounded-[1.8rem] bg-emerald-500/10 group-hover:bg-white/20 transition-colors shadow-inner text-emerald-600 group-hover:text-white">
              <mod.icon className="w-8 h-8" />
            </div>
            <div className="text-left">
              <p className="text-[12px] font-[900] uppercase tracking-tight leading-none italic">{mod.label}</p>
              <p className="text-[9px] font-bold opacity-40 uppercase tracking-[0.2em] mt-2 leading-none italic">{mod.desc}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="p-12 bg-slate-900 rounded-[5rem] text-white flex flex-col md:flex-row items-center justify-between border-b-[12px] border-emerald-500 shadow-4xl relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-125 transition-transform duration-1000">
            <Eye className="w-96 h-96 rotate-12" />
         </div>
         <div className="flex items-center gap-10 relative z-10">
            <div className="w-24 h-24 bg-white/5 rounded-[2.5rem] flex items-center justify-center text-emerald-400 border border-white/10 shadow-2xl backdrop-blur-md">
               <Eye className="w-14 h-14 animate-pulse" />
            </div>
            <div>
               <h2 className="text-4xl font-[900] italic tracking-tighter leading-none mb-3 uppercase">Pôle de Surveillance</h2>
               <p className="text-[12px] font-black uppercase text-emerald-400 tracking-[0.5em] opacity-60 italic">AUDIT & CONFORMITÉ RÉGLEMENTAIRE — RCA 2024</p>
            </div>
         </div>
         <div className="flex gap-4 mt-8 md:mt-0 relative z-10 w-full md:w-auto">
            <button 
               onClick={() => onViewChange?.('reports')}
               className="flex-1 md:flex-none px-10 py-5 bg-white/5 hover:bg-white/10 rounded-[2.5rem] font-black text-[11px] uppercase tracking-widest transition-all border border-white/10 italic"
            >
              Export Global
            </button>
            <button className="flex-1 md:flex-none px-10 py-5 bg-emerald-500 text-slate-950 rounded-[2.5rem] font-black text-[11px] uppercase tracking-widest shadow-2xl transform active:scale-95 transition-all italic tracking-[0.2em]">
              Initier Inspection
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-[var(--bg-card)] p-12 rounded-[4.5rem] border border-[var(--border)] shadow-md hover:shadow-4xl transition-all relative overflow-hidden group">
             <div className="absolute -bottom-8 -right-8 opacity-[0.03] group-hover:scale-125 transition-transform duration-1000">
                <stat.icon className="w-48 h-48" />
             </div>
            <div className="p-6 rounded-3xl w-fit mb-10 shadow-lg transform group-hover:rotate-12 transition-transform" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
              <stat.icon className="w-10 h-10" />
            </div>
            <h3 className="text-5xl font-[900] tracking-tighter text-[var(--text-main)] mb-3 leading-none italic">{stat.value}</h3>
            <p className="text-[14px] font-[900] text-[var(--text-muted)] uppercase tracking-widest opacity-40 leading-none mt-2 italic underline decoration-slate-500/10 decoration-4 underline-offset-8 font-black">{stat.label}</p>
            <div className="mt-10 text-[10px] font-black uppercase tracking-[0.3em] italic bg-slate-100 dark:bg-white/5 px-4 py-2 rounded-full inline-block" style={{ color: stat.color }}>{stat.trend}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 bg-[var(--bg-card)] p-14 rounded-[5.5rem] border border-[var(--border)] shadow-xl relative overflow-hidden">
           <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-500/5 blur-[120px]" />
           <div className="flex items-center justify-between mb-16 relative z-10">
              <div className="flex items-center gap-8">
                 <div className="p-5 bg-emerald-500/10 rounded-[2rem] shadow-inner">
                   <ClipboardList className="w-12 h-12 text-emerald-500" />
                 </div>
                 <div>
                   <h3 className="text-3xl font-[900] text-[var(--text-main)] tracking-tight uppercase italic underline decoration-emerald-500/20 decoration-[14px] underline-offset-8">Journal Sécurité</h3>
                   <p className="text-[11px] font-black text-[var(--text-muted)] uppercase tracking-[0.4em] mt-6 opacity-30 italic font-black">ANALYSE EN TEMPS RÉEL — NIVEAU DE RISQUE PRUDENTIEL</p>
                 </div>
              </div>
           </div>
           
           <div className="space-y-6 relative z-10">
              {[
                { time: '09:12', user: 'Caissier Bangui', action: 'Flux Espèces', details: 'Client #4492 - 450k FCFA', risk: 'low' },
                { time: '08:45', user: 'Admin Général', action: 'Modif Taux', details: 'Prêt Scolaire: 8% -> 7.5%', risk: 'high' },
                { time: '08:30', user: 'Agent Secrétariat', action: 'Nouveau Membre', details: 'Groupement AGRI-RCA', risk: 'low' },
                { time: '07:55', user: 'Directeur', action: 'Validation Crédit', details: 'Prêt #8822 - 2.5M FCFA', risk: 'low' },
              ].map((log, i) => (
                <div key={i} className="flex flex-col md:flex-row items-start md:items-center justify-between p-10 bg-slate-50 dark:bg-white/5 rounded-[4rem] border border-[var(--border)] hover:border-emerald-500/50 hover:bg-white dark:hover:bg-[#151B2E] transition-all group shadow-sm cursor-pointer">
                   <div className="flex items-center gap-10 mb-5 md:mb-0">
                      <span className="text-[13px] font-black text-emerald-500 tabular-nums bg-emerald-500/5 px-5 py-2.5 rounded-2xl italic shadow-inner border border-emerald-500/10">#{log.time}</span>
                      <div className="h-16 w-2 bg-slate-200 dark:bg-white/5 group-hover:bg-emerald-500/30 transition-colors hidden md:block rounded-full" />
                      <div>
                         <p className="text-2xl font-[900] text-[var(--text-main)] tracking-tighter uppercase italic leading-none group-hover:translate-x-3 transition-transform">{log.action}</p>
                         <p className="text-[11px] font-black text-[var(--text-muted)] mt-3 opacity-30 italic group-hover:translate-x-2 transition-transform delay-75 uppercase tracking-[0.3em]">{log.user}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-12 w-full md:w-auto">
                      <p className="flex-1 md:flex-none text-[13px] font-black text-[var(--text-muted)] uppercase tracking-tight italic opacity-30 text-right group-hover:opacity-100 transition-opacity font-black">{log.details}</p>
                      <div className={cn(
                        "px-8 py-4 rounded-[2rem] text-[12px] font-[900] uppercase tracking-widest italic shadow-xl transform group-hover:scale-110 group-hover:rotate-3 transition-all",
                        log.risk === 'low' ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/10" : "bg-rose-500 text-white shadow-[0_15px_30px_rgba(244,63,94,0.3)]"
                      )}>
                         {log.risk} RISK
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>

        <div className="space-y-12">
           <div className="p-14 bg-rose-600 dark:bg-slate-900 rounded-[5.5rem] text-white shadow-4xl relative overflow-hidden group border-b-[25px] border-rose-500">
              <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-200 transition-transform duration-1000 rotate-12">
                 <AlertTriangle className="w-64 h-64" />
              </div>
              <h3 className="text-3xl font-[900] italic tracking-tight mb-12 uppercase relative z-10 border-b-2 border-white/10 pb-8 underline decoration-white/20 underline-offset-8">Synthèse Audit</h3>
              <div className="space-y-8 relative z-10">
                 <div className="p-10 bg-white/5 rounded-[4rem] border border-white/10 backdrop-blur-md shadow-2xl hover:bg-white/10 transition-all cursor-pointer group/card active:scale-95">
                    <p className="text-[12px] font-black uppercase mb-5 tracking-[0.4em] italic opacity-40">Audit Terrain (Bossangoa)</p>
                    <p className="text-xl font-bold italic leading-tight opacity-90 group-hover:translate-x-3 transition-transform">Anomalies détectées sur <span className="text-rose-200 font-black">12%</span> des dossiers KYC.</p>
                 </div>
              </div>
              <button 
                 onClick={() => onViewChange?.('reports')}
                 className="mt-12 w-full py-9 bg-white text-rose-600 rounded-[3rem] font-[900] text-[15px] uppercase tracking-[0.5em] shadow-4xl hover:bg-slate-50 transition-all italic transform flex items-center justify-center gap-5 group"
              >
                 Suivi Anomalies <ChevronRight className="w-8 h-8 group-hover:translate-x-4 transition-transform duration-500" />
              </button>
           </div>

           <div className="p-16 bg-slate-50 dark:bg-white/5 rounded-[6rem] border border-[var(--border)] group relative overflow-hidden flex flex-col items-center text-center shadow-xl">
              <div className="absolute -bottom-12 -left-12 opacity-5 group-hover:rotate-12 transition-transform duration-1500 text-emerald-500">
                 <ShieldCheck className="w-72 h-72" />
              </div>
              <h4 className="text-[13px] font-black uppercase tracking-[0.4em] mb-10 italic opacity-30">Conformité OHADA</h4>
              <div className="space-y-2 mb-10">
                 <p className="text-6xl font-[900] italic tracking-tighter text-[var(--text-main)] transition-all group-hover:scale-110">94%</p>
                 <p className="text-[12px] font-black uppercase tracking-widest text-emerald-500 italic">+2% vs M-1</p>
              </div>
              <button 
                 onClick={() => onViewChange?.('members')}
                 className="w-full py-7 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[2.5rem] font-black text-[13px] uppercase tracking-[0.3em] shadow-3xl transform active:scale-95 transition-all italic border-b-6 border-slate-700 dark:border-slate-300"
              >
                 Lancer Contrôle
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
