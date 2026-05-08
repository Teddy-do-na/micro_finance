import React from 'react';
import { 
  BarChart3, 
  FileText, 
  Scale, 
  BookOpen, 
  Download, 
  History,
  Activity,
  Calculator,
  CreditCard,
  ChevronRight,
  Landmark,
  Zap,
  ArrowRightLeft,
  ShieldCheck,
  FileSpreadsheet,
  FileCheck
} from 'lucide-react';
import { Transaction } from '../../types';
import { formatCurrency, cn } from '../../lib/utils';

interface DashboardProps {
  transactions: Transaction[];
  isDarkMode: boolean;
  onViewChange?: (view: 'dashboard' | 'members' | 'loans' | 'savings' | 'cash' | 'reports' | 'settings') => void;
  onAction?: (actionId: string) => void;
}

export function AccountantDashboard({ transactions, onViewChange }: DashboardProps) {
  const stats = [
    { label: 'Solde Bancaire', value: '142.5M', icon: Landmark, color: '#10B981', trend: 'Disponibilité réelle' },
    { label: 'Situation Financière', value: '450.1M', icon: Scale, color: '#3B82F6', trend: 'Total Actifs' },
    { label: 'Écritures du Jour', value: transactions.length, icon: Zap, color: '#F59E0B', trend: 'Mise à jour Live' },
    { label: 'Ratio Solvabilité', value: '22.4%', icon: Activity, color: '#8B5CF6', trend: 'BDEAC Conformité' },
  ];

  const accountantTasks = [
    { label: 'Journal Comptable', icon: BookOpen, desc: 'SAISIE QUOTIDIENNE', view: 'reports' as const },
    { label: 'Grand Livre', icon: FileText, desc: 'VISION PAR COMPTE', view: 'reports' as const },
    { label: 'Balance Générale', icon: Scale, desc: 'CONTRÔLE ÉQUILIBRE', view: 'reports' as const },
    { label: 'États Financiers', icon: FileSpreadsheet, desc: 'BILAN & RÉSULTAT', view: 'reports' as const },
    { label: 'Rapprochements', icon: ArrowRightLeft, desc: 'AUDIT BANCAIRE', view: 'reports' as const },
  ];

  return (
    <div className="space-y-10 animate-in slide-in-from-right-10 duration-1000">
      {/* Role-Specific Horizontal Task Bar */}
      <div className="flex flex-wrap gap-4 p-4 bg-emerald-500/5 dark:bg-white/5 rounded-[4rem] border border-emerald-500/10 backdrop-blur-md">
        {accountantTasks.map((mod, i) => (
          <button 
            key={i} 
            onClick={() => onViewChange?.(mod.view)}
            className="flex-1 min-w-[200px] flex items-center gap-5 p-7 bg-white dark:bg-[#0B1224] rounded-[3.5rem] border border-[var(--border)] hover:border-emerald-500 hover:bg-emerald-500 hover:text-white transition-all group shadow-sm"
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
                 <h3 className="text-3xl font-[900] text-[var(--text-main)] tracking-tight uppercase italic underline decoration-emerald-500/20 decoration-8 underline-offset-4 font-black">Écritures Comptables</h3>
                 <p className="text-[11px] font-black text-[var(--text-muted)] uppercase tracking-[0.4em] mt-5 opacity-40 italic">MOUVEMENTS RÉCENTS AUX NORMES OHADA</p>
              </div>
              <div className="flex gap-4">
                 <button className="p-5 bg-slate-50 dark:bg-white/5 border border-[var(--border)] rounded-[2rem] hover:bg-emerald-500 hover:text-white transition-all group">
                    <Download className="w-6 h-6" />
                 </button>
                 <button className="p-5 bg-slate-50 dark:bg-white/5 border border-[var(--border)] rounded-[2rem] hover:bg-emerald-500 hover:text-white transition-all group">
                    <FileSpreadsheet className="w-6 h-6" />
                 </button>
              </div>
           </div>
           
           <div className="overflow-x-auto relative z-10">
              <table className="w-full text-left">
                 <thead>
                    <tr className="border-b-2 border-[var(--border)]">
                       <th className="pb-8 text-[12px] font-black uppercase text-[var(--text-muted)] tracking-widest opacity-40 italic">CPTE</th>
                       <th className="pb-8 text-[12px] font-black uppercase text-[var(--text-muted)] tracking-widest opacity-40 italic">Libellé</th>
                       <th className="pb-8 text-[12px] font-black uppercase text-[var(--text-muted)] tracking-widest opacity-40 text-right">Débit</th>
                       <th className="pb-8 text-[12px] font-black uppercase text-[var(--text-muted)] tracking-widest opacity-40 text-right">Crédit</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-[var(--border)]">
                    {transactions.slice(0, 8).map((tx, i) => (
                       <tr key={i} className="group hover:bg-slate-50 dark:hover:bg-[#0B1224] transition-all">
                          <td className="py-10 font-[900] text-[14px] text-emerald-500 transform group-hover:translate-x-3 transition-transform italic">521.{Math.floor(Math.random() * 900) + 100}</td>
                          <td className="py-10">
                             <p className="text-[16px] font-[900] text-[var(--text-main)] uppercase tracking-tighter italic leading-none group-hover:translate-x-3 transition-transform truncate max-w-[250px]">{tx.reference}</p>
                             <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em] mt-3 opacity-40 italic">{new Date(tx.timestamp).toLocaleDateString()} — {tx.method}</p>
                          </td>
                          <td className="py-10 text-right text-[18px] font-[900] italic tracking-tighter">{tx.type === 'deposit' ? formatCurrency(tx.amount) : '—'}</td>
                          <td className="py-10 text-right text-[18px] font-[900] italic tracking-tighter">{tx.type === 'withdrawal' ? formatCurrency(tx.amount) : '—'}</td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>

        <div className="space-y-10">
           <div className="bg-slate-950 p-14 rounded-[5rem] text-white shadow-3xl relative overflow-hidden group border-b-[20px] border-emerald-500">
              <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-45 group-hover:rotate-90 transition-transform duration-1000">
                 <Scale className="w-56 h-56 text-emerald-400" />
              </div>
              <h3 className="text-3xl font-[900] italic tracking-tight mb-10 text-emerald-400 relative z-10 uppercase border-b-2 border-white/5 pb-6">Reporting PDF</h3>
              <div className="space-y-6 relative z-10">
                 <button className="w-full py-8 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-[3rem] font-[900] text-[13px] uppercase tracking-[0.4em] shadow-4xl italic group/btn flex items-center justify-center gap-4">
                    Générer Bilan PDF <FileCheck className="w-8 h-8 group-hover:rotate-12 transition-transform" />
                 </button>
                 <button className="w-full py-8 bg-white/5 hover:bg-white/10 border border-white/10 rounded-[3rem] font-[900] text-[13px] uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-5 italic shadow-inner outline outline-transparent hover:outline-emerald-500/30">
                    Exporter Excel .xlsx
                 </button>
                 <div className="pt-8 text-center text-[11px] font-black uppercase tracking-[0.3em] opacity-40 italic">Standard OHADA — SYSTEME NORMAL</div>
              </div>
           </div>

           <div className="p-14 bg-[var(--bg-card)] border border-[var(--border)] rounded-[5rem] shadow-md group relative overflow-hidden">
              <div className="absolute -bottom-10 -left-10 opacity-5 group-hover:scale-110 transition-transform duration-700">
                 <Calculator className="w-64 h-64" />
              </div>
              <h3 className="text-2xl font-[900] text-[var(--text-main)] mb-10 tracking-tight uppercase italic underline decoration-emerald-500/10 decoration-8 underline-offset-8">Audit & Conformité</h3>
              <div className="space-y-6 relative z-10">
                 <div className="p-8 bg-slate-50 dark:bg-white/5 rounded-[3rem] border border-[var(--border)] flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <div className="w-4 h-4 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                       <span className="text-[12px] font-black uppercase tracking-widest italic opacity-60">Status Rapprochement</span>
                    </div>
                    <span className="text-[12px] font-[900] text-emerald-500 italic bg-emerald-500/10 px-4 py-1.5 rounded-full">VALIDE</span>
                 </div>
                 <button className="w-full py-6 bg-slate-50 dark:bg-white/5 border border-emerald-500/30 rounded-[3rem] text-[11px] font-black uppercase tracking-[0.4em] hover:bg-emerald-500 hover:text-white transition-all transform italic shadow-sm active:scale-95 group flex items-center justify-center gap-4">
                    Run Smart Audit <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
