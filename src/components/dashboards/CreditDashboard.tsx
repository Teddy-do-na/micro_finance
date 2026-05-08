import React from 'react';
import { 
  FileText, 
  TrendingUp, 
  AlertTriangle, 
  Clock, 
  Wallet,
  FilePlus,
  Target,
  ShieldCheck,
  History,
  Briefcase,
  Calculator,
  ChevronRight,
  Flame,
  CalendarCheck
} from 'lucide-react';
import { Loan, LoanStatus } from '../../types';
import { formatCurrency, cn } from '../../lib/utils';

interface DashboardProps {
  loans: Loan[];
  isDarkMode: boolean;
  onViewChange?: (view: 'dashboard' | 'members' | 'loans' | 'savings' | 'cash' | 'reports' | 'settings') => void;
  onAction?: (actionId: string) => void;
}

export function CreditDashboard({ loans, onViewChange }: DashboardProps) {
  const activeLoansCount = loans.filter(l => l.status === LoanStatus.ACTIVE).length;
  const pendingLoans = loans.filter(l => l.status === LoanStatus.PENDING_REVIEW).length;
  const defaultedLoans = loans.filter(l => l.status === LoanStatus.DEFAULTED).length;
  const portfolioAtRisk = (defaultedLoans / (loans.length || 1) * 100).toFixed(1);

  const stats = [
    { label: 'Prêts Actifs', value: activeLoansCount, icon: Briefcase, color: '#10B981', trend: 'Portefeuille Vivant' },
    { label: 'Montant Total Prêté', value: '185.4M', icon: Wallet, color: '#3B82F6', trend: 'Total Décaissements' },
    { label: 'Taux d\'impayés', value: `${portfolioAtRisk}%`, icon: AlertTriangle, color: '#EF4444', trend: 'CRITIQUE > 10%' },
    { label: 'Échéances à venir', value: '45', icon: Clock, color: '#F59E0B', trend: '7 Prochains Jours' },
  ];

  const creditTasks = [
    { label: 'Nouvelle Demande', icon: FilePlus, desc: 'OUVRIR DOSSIER', view: 'loans' as const },
    { label: 'Validation Prêts', icon: ShieldCheck, desc: 'COMITÉ CRÉDIT', view: 'loans' as const },
    { label: 'Échéanciers', icon: CalendarCheck, desc: 'PLAN AMORTISSEMENT', view: 'loans' as const },
    { label: 'Retards de Paiement', icon: AlertTriangle, desc: 'RECOUVREMENT', view: 'reports' as const },
    { label: 'Simulateur de Prêt', icon: Calculator, desc: 'CALCUL CAPACITÉ', view: 'loans' as const },
  ];

  return (
    <div className="space-y-10 animate-in fade-in zoom-in duration-1000">
      {/* Role-Specific Horizontal Task Bar */}
      <div className="flex flex-wrap gap-4 p-4 bg-amber-500/5 dark:bg-white/5 rounded-[4rem] border border-amber-500/10 backdrop-blur-md">
        {creditTasks.map((mod, i) => (
          <button 
            key={i} 
            onClick={() => onViewChange?.(mod.view)}
            className="flex-1 min-w-[180px] flex items-center gap-5 p-7 bg-white dark:bg-[#0B1224] rounded-[3.5rem] border border-[var(--border)] hover:border-amber-500 hover:bg-amber-500 hover:text-white transition-all group shadow-sm"
          >
            <div className="p-4 rounded-[1.8rem] bg-amber-500/10 group-hover:bg-white/20 transition-colors shadow-inner text-amber-600 group-hover:text-white">
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
                 <h3 className="text-3xl font-[900] text-[var(--text-main)] tracking-tight uppercase italic underline decoration-amber-500/30 decoration-8 underline-offset-4">Analyse de Portefeuille</h3>
                 <p className="text-[11px] font-black text-[var(--text-muted)] uppercase tracking-[0.4em] mt-5 opacity-40 italic">VALIDATION DES PRÊTS — CMCC 2024</p>
              </div>
           </div>
           
           <div className="space-y-6 relative z-10">
             {loans.filter(l => l.status === LoanStatus.PENDING_REVIEW).slice(0, 5).map((loan, i) => (
                <div key={loan.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-10 bg-slate-50 dark:bg-[#0B1224] rounded-[4rem] border border-[var(--border)] hover:border-amber-500/50 hover:bg-white dark:hover:bg-[#151B2E] transition-all group shadow-sm cursor-pointer">
                   <div className="flex items-center gap-8 mb-4 md:mb-0">
                      <div className="w-20 h-20 rounded-[2rem] bg-amber-500/10 flex items-center justify-center text-amber-500 font-[900] text-3xl shadow-inner transform group-hover:scale-110 group-hover:rotate-6 transition-all italic border border-amber-500/20">
                         {i + 1}
                      </div>
                      <div className="h-16 w-1 bg-slate-200 dark:bg-white/5 hidden md:block" />
                      <div>
                         <p className="text-2xl font-[900] text-[var(--text-main)] tracking-tight uppercase italic leading-none group-hover:translate-x-3 transition-transform line-clamp-1 truncate">ID #{loan.id.slice(0, 8).toUpperCase()}</p>
                         <div className="flex items-center gap-4 mt-3 opacity-40 italic">
                             <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/5 rounded-lg border border-amber-500/10">
                                <Target className="w-4 h-4 text-amber-500" />
                                <span className="text-[11px] font-black text-amber-600">SCORE: {loan.scoring || 85}</span>
                             </div>
                             <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                             <p className="text-[12px] font-black uppercase tracking-widest">{loan.purpose}</p>
                         </div>
                      </div>
                   </div>
                   <div className="text-right">
                     <p className="text-4xl font-[900] tracking-tighter italic text-amber-600 transform group-hover:scale-125 transition-transform origin-right leading-none mb-2">{formatCurrency(loan.amount)}</p>
                     <p className="text-[11px] font-black text-[var(--text-muted)] uppercase tracking-widest opacity-40 italic">{loan.durationMonths} MOIS • {loan.interestRate}%</p>
                   </div>
                </div>
              ))}
           </div>
        </div>

        <div className="space-y-10">
           <div className="bg-slate-900 p-14 rounded-[5rem] text-white shadow-3xl relative overflow-hidden group border-b-[20px] border-amber-500">
              <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 group-hover:rotate-45 transition-transform duration-1000">
                 <AlertTriangle className="w-48 h-48" />
              </div>
              <h3 className="text-3xl font-[900] italic tracking-tight mb-10 text-amber-400 relative z-10 uppercase">Alertes Risques</h3>
              <div className="space-y-6 relative z-10">
                 <div className="p-8 bg-white/5 rounded-[3.5rem] border border-white/5 hover:border-rose-500/30 transition-all group/info">
                    <p className="text-[12px] font-black text-rose-400 uppercase mb-3 tracking-[0.3em] italic opacity-60">Prêts en retard</p>
                    <p className="text-xl font-bold italic leading-tight opacity-90"><span className="text-rose-400">{defaultedLoans} dossiers</span> nécessitent une intervention immédiate.</p>
                 </div>
                 <div className="p-8 bg-white/5 rounded-[3.5rem] border border-white/5 hover:border-amber-500/30 transition-all group/info">
                    <p className="text-[12px] font-black text-amber-400 uppercase mb-3 tracking-[0.3em] italic opacity-60">Clients à risque (Scoring &lt; 40)</p>
                    <p className="text-xl font-bold leading-tight italic opacity-90">Hausse de <span className="text-amber-400 font-black">12%</span> du risque sur le secteur Commerce.</p>
                 </div>
              </div>
              <button 
                onClick={() => onViewChange?.('reports')}
                className="mt-12 w-full py-8 bg-amber-500 text-slate-950 rounded-[3rem] font-[900] text-[13px] uppercase tracking-[0.4em] shadow-4xl italic group/btn flex items-center justify-center gap-4"
              >
                 Lister Retards <ChevronRight className="w-8 h-8 group-hover:translate-x-3 transition-transform" />
              </button>
           </div>

           <div className="p-14 bg-[var(--bg-card)] border border-[var(--border)] rounded-[5rem] shadow-md group relative overflow-hidden">
              <div className="absolute -bottom-10 -left-10 opacity-5 group-hover:rotate-12 transition-transform duration-700">
                 <Calculator className="w-64 h-64" />
              </div>
              <h3 className="text-2xl font-[900] text-[var(--text-main)] mb-10 tracking-tight uppercase italic underline decoration-slate-500/10 decoration-8 underline-offset-8">Simulateur Express</h3>
              <div className="space-y-6 relative z-10">
                 <div className="p-8 bg-slate-50 dark:bg-[#0B1224] rounded-[3rem] border border-[var(--border)]">
                    <p className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-widest mb-2 opacity-50 italic">Capacité d'emprunt moyenne</p>
                    <p className="text-3xl font-[900] tracking-tighter italic text-emerald-500">2.500.000 FCFA</p>
                 </div>
                 <button 
                    onClick={() => onViewChange?.('loans')}
                    className="w-full py-6 bg-slate-950 text-white rounded-[2.5rem] font-[900] text-[11px] uppercase tracking-[0.3em] hover:bg-slate-900 transition-all flex items-center justify-center gap-5 shadow-2xl italic group"
                 >
                    Démarrer Simulation
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
