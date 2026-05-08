import React from 'react';
import { 
  Wallet, 
  ArrowDownLeft, 
  ArrowUpRight, 
  History, 
  Lock, 
  AlertTriangle,
  Clock,
  CircleDollarSign,
  PieChart,
  BarChart3,
  Flame,
  ChevronRight,
  TrendingUp,
  Receipt
} from 'lucide-react';
import { Transaction, TransactionType } from '../../types';
import { formatCurrency, cn } from '../../lib/utils';

interface DashboardProps {
  transactions: Transaction[];
  isDarkMode: boolean;
  onViewChange?: (view: 'dashboard' | 'members' | 'loans' | 'savings' | 'cash' | 'reports' | 'settings') => void;
  onAction?: (actionId: string) => void;
}

export function CashierDashboard({ transactions, onViewChange }: DashboardProps) {
  const dailyIn = transactions
    .filter(t => t.type === TransactionType.DEPOSIT)
    .reduce((acc, t) => acc + t.amount, 0);
    
  const dailyOut = transactions
    .filter(t => t.type === TransactionType.WITHDRAWAL)
    .reduce((acc, t) => acc + t.amount, 0);

  const stats = [
    { label: 'Solde de Caisse', value: formatCurrency(1250400), icon: Wallet, color: '#10B981', trend: 'Ouverte à 08:00' },
    { label: 'Entrées du Jour', value: formatCurrency(dailyIn || 450000), icon: ArrowDownLeft, color: '#3B82F6', trend: 'Total Dépôts' },
    { label: 'Sorties du Jour', value: formatCurrency(dailyOut || 120000), icon: ArrowUpRight, color: '#F59E0B', trend: 'Total Retraits' },
    { label: 'Volume Traité', value: transactions.length + 15, icon: BarChart3, color: '#8B5CF6', trend: 'Opérations' },
  ];

  const cashierTasks = [
    { label: 'Nouveau Dépôt', icon: ArrowDownLeft, desc: 'CRÉDIT COMPTE', view: 'cash' as const },
    { label: 'Nouveau Retrait', icon: ArrowUpRight, desc: 'DÉBIT ÉPARGNE', view: 'cash' as const },
    { label: 'Clôture Caisse', icon: Lock, desc: 'ARRESTATION CA', view: 'cash' as const },
    { label: 'Hist. Opérations', icon: History, desc: 'BROUILLARD LIVE', view: 'cash' as const },
  ];

  return (
    <div className="space-y-10 animate-in fade-in zoom-in duration-1000">
      {/* Role-Specific Horizontal Task Bar */}
      <div className="flex flex-wrap gap-4 p-4 bg-emerald-500/5 dark:bg-white/5 rounded-[4rem] border border-emerald-500/10 backdrop-blur-md">
        {cashierTasks.map((mod, i) => (
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
            <h3 className="text-5xl font-[900] tracking-tighter text-[var(--text-main)] leading-none mb-4 italic italic">{stat.value}</h3>
            <p className="text-[15px] font-[900] text-[var(--text-muted)] uppercase tracking-[0.2em] leading-none italic opacity-60 underline decoration-slate-500/20 underline-offset-8">{stat.label}</p>
            <p className="mt-8 text-[10px] font-black uppercase tracking-widest bg-slate-100 dark:bg-white/5 px-4 py-1.5 rounded-full inline-block italic" style={{ color: stat.color }}>{stat.trend}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 bg-[var(--bg-card)] p-14 rounded-[5rem] border border-[var(--border)] shadow-md relative overflow-hidden">
           <div className="flex justify-between items-start mb-16 relative z-10">
              <div>
                 <h3 className="text-3xl font-[900] text-[var(--text-main)] tracking-tight uppercase italic underline decoration-emerald-500/20 decoration-8 underline-offset-4">Brouillard de Caisse</h3>
                 <p className="text-[11px] font-black text-[var(--text-muted)] uppercase tracking-[0.4em] mt-5 opacity-40 italic">MOUVEMENTS ESPÈCES — RCA 2024</p>
              </div>
              <div className="flex gap-4">
                 <div className="px-8 py-4 bg-rose-500/5 dark:bg-rose-500/10 rounded-[2.5rem] border border-rose-500/20 text-center">
                    <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-1 italic opacity-60">Écart Détecté</p>
                    <p className="text-2xl font-[900] italic text-rose-600 tracking-tighter">0 FCFA</p>
                 </div>
              </div>
           </div>
           
           <div className="space-y-6 relative z-10">
              {transactions.slice(0, 5).map((tx, i) => (
                <div key={i} className="flex flex-col md:flex-row items-start md:items-center justify-between p-10 bg-slate-50 dark:bg-[#0B1224] rounded-[4rem] border border-[var(--border)] hover:border-emerald-500/50 hover:bg-white dark:hover:bg-[#151B2E] transition-all group shadow-sm cursor-pointer">
                   <div className="flex items-center gap-8 mb-4 md:mb-0">
                      <div className={cn(
                        "w-20 h-20 rounded-[2rem] flex items-center justify-center text-3xl shadow-inner transform group-hover:scale-110 group-hover:rotate-6 transition-all",
                        tx.type === TransactionType.DEPOSIT ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
                      )}>
                         {tx.type === TransactionType.DEPOSIT ? <ArrowDownLeft className="w-10 h-10" /> : <ArrowUpRight className="w-10 h-10" />}
                      </div>
                      <div className="h-16 w-1 bg-slate-200 dark:bg-white/5 hidden md:block" />
                      <div>
                         <p className="text-2xl font-[900] text-[var(--text-main)] tracking-tight uppercase italic leading-none group-hover:translate-x-3 transition-transform">{tx.reference}</p>
                         <div className="flex items-center gap-4 mt-3 opacity-40 italic">
                             <p className="text-[12px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em]">{new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long' })}</p>
                             <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                             <p className="text-[11px] font-[900] text-emerald-500 uppercase tracking-widest px-3 py-1 bg-emerald-500/5 rounded-lg border border-emerald-500/10">{tx.method}</p>
                         </div>
                      </div>
                   </div>
                   <div className={cn(
                     "text-4xl font-[900] tracking-tighter italic transform group-hover:scale-125 transition-transform origin-right",
                     tx.type === TransactionType.DEPOSIT ? "text-emerald-500" : "text-rose-500"
                   )}>
                      {tx.type === TransactionType.DEPOSIT ? '+' : '-'}{formatCurrency(tx.amount)}
                   </div>
                </div>
              ))}
           </div>
        </div>

        <div className="space-y-10">
           <div className="bg-slate-900 dark:bg-white p-14 rounded-[5rem] text-white dark:text-slate-900 shadow-3xl flex flex-col group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 group-hover:rotate-45 transition-transform duration-1000">
                 <Lock className="w-48 h-48" />
              </div>
              <h3 className="text-3xl font-[900] tracking-tighter mb-10 italic uppercase border-b-2 border-white/10 dark:border-slate-900/10 pb-6">Contrôle de Caisse</h3>
              <div className="space-y-6 relative z-10">
                 <div className="p-8 bg-white/5 dark:bg-slate-900/5 rounded-[3rem] border border-white/5 dark:border-slate-900/5 hover:bg-white/10 transition-all cursor-pointer">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] mb-4 italic opacity-40">Statut Session</p>
                    <p className="text-2xl font-[900] tracking-tight leading-tight uppercase italic text-emerald-400 animate-pulse">Session Ouverte</p>
                    <div className="flex items-center gap-3 mt-4 text-[11px] font-black uppercase opacity-60 italic">
                       <Clock className="w-4 h-4" /> 08:00 - 18:00
                    </div>
                 </div>
                 
                 <div className="p-8 bg-rose-500 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden group/alert">
                    <div className="absolute top-0 right-0 p-8 opacity-20 group-hover/alert:rotate-12 transition-transform">
                       <AlertTriangle className="w-20 h-20" />
                    </div>
                    <p className="text-[12px] font-black uppercase tracking-[0.2em] mb-3 italic">Alerte Plafond</p>
                    <p className="text-xl font-[900] tracking-tight italic uppercase leading-tight">Attention: Solde proche du plafond autorisé (85%)</p>
                 </div>

                 <button 
                    onClick={() => onViewChange?.('cash')}
                    className="w-full py-8 border-4 border-white dark:border-slate-900 rounded-[3.5rem] font-[900] text-[13px] uppercase tracking-[0.4em] flex items-center justify-center gap-5 hover:bg-white dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white transition-all shadow-4xl italic group"
                 >
                    Détails Caisse <ChevronRight className="w-8 h-8 group-hover:translate-x-3 transition-transform" />
                 </button>
              </div>
           </div>

           <div className="p-14 bg-emerald-500 rounded-[5rem] text-slate-950 shadow-2xl relative overflow-hidden group">
              <div className="absolute -bottom-10 -left-10 opacity-10 group-hover:scale-125 transition-transform duration-1000">
                 <CircleDollarSign className="w-64 h-64" />
              </div>
              <h3 className="text-2xl font-[900] text-slate-900 mb-10 tracking-tight italic uppercase relative z-10">Statistiques Jour</h3>
              <div className="space-y-6 relative z-10">
                 <div className="flex border-b border-slate-900/10 pb-4 justify-between items-baseline">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40 italic">Moyenne / Opération</p>
                    <p className="text-xl font-[900] italic">85.000 FCFA</p>
                 </div>
                 <div className="flex border-b border-slate-900/10 pb-4 justify-between items-baseline">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40 italic">Taux d'Activité</p>
                    <p className="text-xl font-[900] italic">Élevé</p>
                 </div>
                 <button 
                  onClick={() => onViewChange?.('reports')}
                  className="w-full py-6 mt-4 bg-slate-950 text-white rounded-[2.5rem] font-[900] text-[11px] uppercase tracking-[0.3em] shadow-2xl active:scale-95 transition-all italic hover:bg-slate-900 transform">
                    Exporter Statistiques
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
