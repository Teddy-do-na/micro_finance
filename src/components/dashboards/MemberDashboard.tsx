import React from 'react';
import { 
  PiggyBank, 
  Wallet, 
  CreditCard, 
  History, 
  FileText, 
  Bell,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Zap,
  Star,
  Users2,
  ListOrdered,
  CalendarClock,
  Gift
} from 'lucide-react';
import { formatCurrency, cn } from '../../lib/utils';
import { Transaction, Loan } from '../../types';

interface DashboardProps {
  transactions: Transaction[];
  loans: Loan[];
  isDarkMode: boolean;
  onViewChange?: (view: 'dashboard' | 'members' | 'loans' | 'savings' | 'cash' | 'reports' | 'settings') => void;
  onAction?: (actionId: string) => void;
}

export function MemberDashboard({ transactions, loans, onViewChange }: DashboardProps) {
  const memberLoans = loans; 
  const totalSavings = 455000; 

  const stats = [
    { label: 'Solde Épargne', value: formatCurrency(totalSavings), icon: PiggyBank, color: '#10B981', sub: 'Total Disponible' },
    { label: 'Encours Crédit', value: formatCurrency(1200000), icon: Wallet, color: '#EF4444', sub: 'Restant à payer' },
    { label: 'Prochaine Échéance', value: '15 MAI 2026', icon: CalendarClock, color: '#3B82F6', sub: 'Remboursement' },
    { label: 'Dividendes Perçus', value: '12.500 FCFA', icon: Gift, color: '#F59E0B', sub: 'Exercice 2023' },
  ];

  const memberTasks = [
    { label: 'Mes Comptes', icon: Star, desc: 'ÉPARGNE & PARTS', view: 'savings' as const },
    { label: 'Demander un Prêt', icon: Zap, desc: 'SIMULER & POSTULER', view: 'loans' as const },
    { label: 'Mes Documents', icon: FileText, desc: 'CONTRATS & RELEVÉS', view: 'reports' as const },
    { label: 'Historique Personnel', icon: ListOrdered, desc: 'TOUS MES MOUVEMENTS', view: 'savings' as const },
    { label: 'Parrainage', icon: Users2, desc: 'INVITER UN PROCHE', view: 'members' as const },
  ];

  return (
    <div className="space-y-10 animate-in fade-in zoom-in duration-1000">
      {/* Role-Specific Horizontal Task Bar */}
      <div className="flex flex-wrap gap-3 sm:gap-4 p-3 sm:p-4 bg-emerald-500/5 dark:bg-white/5 rounded-2xl sm:rounded-[4rem] border border-emerald-500/10 backdrop-blur-md">
        {memberTasks.map((mod, i) => (
          <button 
            key={i} 
            onClick={() => onViewChange?.(mod.view)}
            className="flex-1 min-w-[140px] sm:min-w-[200px] flex items-center gap-3 sm:gap-5 p-4 sm:p-7 bg-white dark:bg-[#0B1224] rounded-2xl sm:rounded-[3.5rem] border border-[var(--border)] hover:border-emerald-500 hover:bg-emerald-500 hover:text-white transition-all group shadow-sm"
          >
            <div className="p-3 sm:p-4 rounded-xl sm:rounded-[1.8rem] bg-emerald-500/10 group-hover:bg-white/20 transition-colors shadow-inner text-emerald-600 group-hover:text-white">
              <mod.icon className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <div className="text-left">
              <p className="text-[11px] sm:text-[12px] font-[900] uppercase tracking-tight leading-none italic">{mod.label}</p>
              <p className="text-[8px] sm:text-[9px] font-bold opacity-40 uppercase tracking-[0.2em] mt-1 sm:mt-2 leading-none italic">{mod.desc}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="p-8 sm:p-14 bg-gradient-to-br from-[#06231C] to-[#020617] rounded-3xl sm:rounded-[5rem] text-white shadow-4xl relative overflow-hidden border border-white/5 group">
         <div className="absolute top-0 right-0 p-8 sm:p-16 opacity-10 blur-md group-hover:scale-150 transition-transform duration-1000">
            <PiggyBank className="w-48 h-48 sm:w-96 sm:h-96 rotate-45" />
         </div>
         <div className="relative z-10 max-w-3xl">
            <h2 className="text-3xl sm:text-5xl font-[900] italic tracking-tighter mb-4 sm:mb-6 leading-none uppercase">Bienvenue dans votre <br/> Sanctuaire Financier</h2>
            <p className="text-emerald-400 font-black uppercase tracking-[0.2em] sm:tracking-[0.5em] text-[10px] sm:text-[12px] opacity-80 italic leading-relaxed">COOPÉRATIVE DE MICRO-FINANCE CRÉDIT CENTRAFRIQUE — RCA</p>
            
            <div className="mt-8 sm:mt-20 flex flex-wrap items-center gap-8 sm:gap-16">
               <div className="group/stat cursor-default w-full sm:w-auto">
                  <p className="text-[10px] sm:text-[12px] font-black uppercase text-white/30 tracking-[0.3em] mb-2 sm:mb-3 group-hover/stat:text-emerald-400 transition-colors">Dernier versement</p>
                  <p className="text-3xl sm:text-5xl font-[900] text-emerald-400 tracking-tighter italic border-l-4 border-emerald-500 pl-4 sm:pl-6">+50.000 FCFA</p>
               </div>
               <div className="w-px h-16 sm:h-24 bg-white/10 hidden md:block" />
               <div className="group/stat cursor-default w-full sm:w-auto">
                  <p className="text-[10px] sm:text-[12px] font-black uppercase text-white/30 tracking-[0.3em] mb-2 sm:mb-3 group-hover/stat:text-amber-400 transition-colors">Remboursement attendu</p>
                  <p className="text-3xl sm:text-5xl font-[900] text-amber-400 tracking-tighter italic border-l-4 border-amber-500 pl-4 sm:pl-6">15 MAI 2026</p>
               </div>
            </div>
         </div>
         <div className="mt-10 sm:mt-16 flex gap-4">
            <button 
              onClick={() => onViewChange?.('savings')}
              className="w-full sm:w-auto flex items-center justify-center gap-4 sm:gap-5 px-6 sm:px-10 py-4 sm:py-6 bg-emerald-500 rounded-2xl sm:rounded-[2.5rem] text-slate-950 font-[900] text-[11px] sm:text-[13px] uppercase tracking-[0.3em] hover:scale-105 transition-all shadow-4xl italic group/btn"
            >
              Relevé de Comptes <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover/btn:translate-x-3 transition-transform" />
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-10">
        {stats.map((stat, i) => (
          <div key={i} className="bg-[var(--bg-card)] p-8 sm:p-14 rounded-3xl sm:rounded-[4.5rem] border border-[var(--border)] shadow-md hover:shadow-4xl transition-all relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-3 bg-slate-100 dark:bg-white/5 opacity-30 transition-all group-hover:bg-emerald-500/20" />
            <div className="flex justify-between items-start mb-6 sm:mb-10">
              <div className="p-4 sm:p-5 rounded-xl sm:rounded-[2rem] shadow-inner transform group-hover:scale-125 group-hover:rotate-12 transition-all" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
                <stat.icon className="w-8 h-8 sm:w-10 sm:h-10" />
              </div>
            </div>
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-[900] tracking-tighter text-[var(--text-main)] mb-2 sm:mb-3 leading-none italic">{stat.value}</h3>
            <p className="text-[12px] sm:text-[14px] font-[900] text-[var(--text-muted)] uppercase tracking-widest opacity-40 leading-none mt-2 italic underline decoration-slate-500/10 decoration-4 underline-offset-8">{stat.label}</p>
            <div className="mt-8 sm:mt-10 inline-block px-4 sm:px-5 py-2 rounded-xl sm:rounded-[1.5rem] bg-emerald-500/5 dark:bg-white/5 text-[9px] sm:text-[11px] font-black uppercase tracking-[0.2em] italic" style={{ color: stat.color }}>{stat.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-10">
        <div className="lg:col-span-2 bg-[var(--bg-card)] p-8 sm:p-14 rounded-3xl sm:rounded-[5rem] border border-[var(--border)] shadow-md relative overflow-hidden">
           <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-10 sm:mb-16 relative z-10 gap-8">
              <div className="flex items-center gap-4 sm:gap-6">
                 <div className="p-3 sm:p-4 bg-emerald-500/10 rounded-xl sm:rounded-[1.8rem]">
                    <History className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-500" />
                 </div>
                 <div>
                    <h3 className="text-2xl sm:text-3xl font-[900] text-[var(--text-main)] tracking-tight uppercase italic underline decoration-emerald-500/30 decoration-[10px] underline-offset-8">Historique Personnel</h3>
                    <p className="text-[9px] sm:text-[11px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em] sm:tracking-[0.4em] mt-3 sm:mt-4 opacity-40 italic">MES DERNIERS MOUVEMENTS FINANCIERS</p>
                 </div>
              </div>
              <button 
                 onClick={() => onViewChange?.('savings')}
                 className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-slate-50 dark:bg-[#0B1224] border border-[var(--border)] rounded-xl sm:rounded-[2rem] text-[9px] sm:text-[11px] font-black text-emerald-500 uppercase tracking-widest flex items-center justify-center gap-4 hover:bg-emerald-500 hover:text-white transition-all shadow-sm group italic"
              >
                Tout voir <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-3 transition-transform" />
              </button>
           </div>
           
           <div className="space-y-4 sm:space-y-6 relative z-10">
              {transactions.slice(0, 5).map((tx, i) => (
                <div key={i} className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 sm:p-10 bg-slate-50 dark:bg-[#0B1224] rounded-2xl sm:rounded-[4rem] border border-[var(--border)] hover:border-emerald-500/50 hover:bg-white dark:hover:bg-[#151B2E] transition-all group shadow-sm cursor-pointer gap-4">
                   <div className="flex items-center gap-4 sm:gap-8">
                      <div className={cn(
                        "w-12 h-12 sm:w-20 sm:h-20 rounded-xl sm:rounded-[2rem] flex items-center justify-center text-xl sm:text-3xl shadow-inner transform group-hover:scale-110 group-hover:rotate-6 transition-all shrink-0",
                        tx.type === 'deposit' ? "bg-emerald-500/10 text-emerald-500 shadow-[0_15px_30px_rgba(16,185,129,0.2)]" : "bg-rose-500/10 text-rose-500 shadow-[0_15px_30px_rgba(244,63,94,0.2)]"
                      )}>
                         {tx.type === 'deposit' ? <PiggyBank className="w-6 h-6 sm:w-10 sm:h-10" /> : <History className="w-6 h-6 sm:w-10 sm:h-10" />}
                      </div>
                      <div className="h-12 sm:h-16 w-1 bg-slate-200 dark:bg-white/5 hidden md:block" />
                      <div>
                         <p className="text-xl sm:text-2xl font-[900] text-[var(--text-main)] tracking-tight uppercase italic leading-none group-hover:translate-x-2 transition-transform truncate">{tx.reference}</p>
                         <div className="flex items-center gap-3 mt-2 sm:mt-3 opacity-40 italic">
                             <p className="text-[10px] sm:text-[12px] font-black text-[var(--text-muted)] uppercase tracking-[0.1em]">{new Date(tx.timestamp).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}</p>
                             <div className="w-1 h-1 rounded-full bg-slate-300" />
                             <p className="text-[9px] sm:text-[11px] font-[900] text-emerald-500 uppercase tracking-widest px-2 py-0.5 bg-emerald-500/5 rounded-md border border-emerald-500/10">{tx.method}</p>
                         </div>
                      </div>
                   </div>
                   <div className={cn(
                     "text-2xl sm:text-4xl font-[900] tracking-tighter italic transform group-hover:scale-110 transition-transform origin-right",
                     tx.type === 'deposit' ? "text-emerald-500" : "text-rose-500"
                   )}>
                      {tx.type === 'deposit' ? '+' : '-'}{formatCurrency(tx.amount)}
                   </div>
                </div>
              ))}
           </div>
        </div>

        <div className="space-y-8 sm:space-y-10">
           <div className="p-8 sm:p-12 bg-slate-950 rounded-3xl sm:rounded-[5rem] text-white shadow-4xl relative overflow-hidden border border-white/5 group border-b-[15px] sm:border-b-[20px] border-emerald-500">
              <div className="absolute top-0 right-0 p-8 sm:p-12 opacity-5 scale-150 rotate-12 group-hover:rotate-45 transition-transform duration-1000">
                 <Bell className="w-32 h-32 sm:w-48 sm:h-48" />
              </div>
              <div className="flex items-center gap-4 sm:gap-5 mb-8 sm:mb-12 relative z-10">
                 <div className="p-3 sm:p-4 bg-emerald-500/20 rounded-xl sm:rounded-[2rem]">
                    <Bell className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-400" />
                 </div>
                 <h3 className="text-2xl sm:text-3xl font-[900] italic tracking-tight text-emerald-400 uppercase">Flash Info</h3>
              </div>
              <div className="space-y-6 sm:space-y-8 relative z-10">
                 <div className="p-6 sm:p-8 bg-white/5 rounded-2xl sm:rounded-[3.5rem] border border-white/5 hover:border-emerald-500/30 transition-all group/info">
                    <p className="text-[9px] sm:text-[12px] font-black text-emerald-400 uppercase mb-2 sm:mb-3 tracking-[0.2em] sm:tracking-[0.3em] italic opacity-60 group-hover/info:scale-105 transition-transform origin-left">Rappel Important</p>
                    <p className="text-base sm:text-lg font-bold italic leading-tight opacity-90">Versement prévu le <span className="text-emerald-400 underline underline-offset-4 decoration-2">15 MAI 2026</span>.</p>
                 </div>
                 <div className="p-6 sm:p-8 bg-white/5 rounded-2xl sm:rounded-[3.5rem] border border-white/5 hover:border-blue-500/30 transition-all group/info">
                    <p className="text-[9px] sm:text-[12px] font-black text-blue-400 uppercase mb-2 sm:mb-3 tracking-[0.2em] sm:tracking-[0.3em] italic opacity-60 group-hover/info:scale-105 transition-transform origin-left">Promotion</p>
                    <p className="text-base sm:text-lg font-bold leading-tight italic opacity-90"><span className="text-blue-400 font-black">Crédit Équipement</span> à taux réduit (4.5%).</p>
                 </div>
              </div>
           </div>

           <div className="p-8 sm:p-14 bg-[var(--bg-card)] border border-[var(--border)] rounded-3xl sm:rounded-[5rem] shadow-md relative overflow-hidden group">
              <h3 className="text-xl sm:text-2xl font-[900] text-[var(--text-main)] mb-8 sm:mb-12 tracking-tight uppercase italic underline decoration-slate-500/10 decoration-8 underline-offset-8">Opérations Express</h3>
              <div className="space-y-4 sm:space-y-6 relative z-10">
                 <button 
                   onClick={() => onViewChange?.('loans')}
                   className="w-full py-6 sm:py-8 bg-emerald-500 text-slate-950 rounded-2xl sm:rounded-[2.5rem] font-[900] text-[11px] sm:text-[13px] uppercase tracking-[0.3em] sm:tracking-[0.4em] hover:scale-105 transition-all flex items-center justify-center gap-4 sm:gap-5 shadow-4xl italic group/btn"
                 >
                    <Zap className="w-6 h-6 sm:w-8 sm:h-8 group-hover/btn:animate-bounce" /> Demander un Prêt
                 </button>
                 <button 
                   onClick={() => onViewChange?.('reports')}
                   className="w-full py-6 sm:py-8 bg-slate-950 text-white rounded-2xl sm:rounded-[2.5rem] font-[900] text-[10px] sm:text-[12px] uppercase tracking-[0.3em] sm:tracking-[0.4em] hover:bg-slate-900 transition-all flex items-center justify-center gap-4 sm:gap-5 shadow-2xl italic group/btn"
                 >
                    <FileText className="w-6 h-6 sm:w-8 sm:h-8" /> Relevé PDF
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
