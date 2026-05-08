import { UserProfile, UserRole, Member } from '../types';
import { formatCurrency, cn } from '../lib/utils';
import { PiggyBank, ArrowDownLeft, ArrowUpRight } from 'lucide-react';

interface SavingsListProps {
  members: Member[];
  userProfile?: UserProfile;
}

export function SavingsList({ members, userProfile }: SavingsListProps) {
  const canManageSavings = [
    UserRole.SUPER_ADMIN, 
    UserRole.SAVINGS_MANAGER, 
    UserRole.CASHIER,
    UserRole.DIRECTOR
  ].includes(userProfile?.role || UserRole.MEMBER);
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-emerald-500/10 border border-emerald-500/20 p-8 rounded-3xl flex flex-col gap-2 relative overflow-hidden group hover:shadow-lg transition-all">
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
             <PiggyBank className="w-20 h-20 text-emerald-500" />
          </div>
          <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-[0.2em]">Épargne Volontaire</span>
          <span className="text-3xl font-black text-[var(--text-main)] tracking-tighter">{formatCurrency(12500000)}</span>
          <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 opacity-60 uppercase tracking-widest mt-1">Collecte cumulée • CMCC RCA</span>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/20 p-8 rounded-3xl flex flex-col gap-2 relative overflow-hidden group hover:shadow-lg transition-all">
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
             <PiggyBank className="w-20 h-20 text-blue-500" />
          </div>
          <span className="text-[10px] font-black uppercase text-blue-600 dark:text-blue-400 tracking-[0.2em]">Épargne Obligatoire</span>
          <span className="text-3xl font-black text-[var(--text-main)] tracking-tighter">{formatCurrency(4850000)}</span>
          <span className="text-[9px] font-bold text-blue-600 dark:text-blue-400 opacity-60 uppercase tracking-widest mt-1">Garantie Prêts • CMCC RCA</span>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/20 p-8 rounded-3xl flex flex-col gap-2 relative overflow-hidden group hover:shadow-lg transition-all">
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
             <PiggyBank className="w-20 h-20 text-amber-500" />
          </div>
          <span className="text-[10px] font-black uppercase text-amber-600 dark:text-amber-400 tracking-[0.2em]">Compte à Terme</span>
          <span className="text-3xl font-black text-[var(--text-main)] tracking-tighter">{formatCurrency(2200000)}</span>
          <span className="text-[9px] font-bold text-amber-600 dark:text-amber-400 opacity-60 uppercase tracking-widest mt-1">Placements • CMCC RCA</span>
        </div>
      </div>

      <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[var(--border)] bg-slate-50 dark:bg-white/5">
          <h3 className="text-lg font-black text-[var(--text-main)] tracking-tight">Registre des Épargnants</h3>
          <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest mt-0.5">Situation des avoirs par membre</p>
        </div>

        <div className="grid grid-cols-[1.5fr,1fr,1fr,1fr] bg-slate-50 dark:bg-white/5 border-b border-[var(--border)]">
          <span className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-wider p-4 border-r border-[var(--border)]">Identité du Membre</span>
          <span className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-wider p-4 border-r border-[var(--border)] text-right">Volontaire</span>
          <span className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-wider p-4 border-r border-[var(--border)] text-right">Parts Sociales</span>
          <span className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-wider p-4 text-center">Mouvements</span>
        </div>

        {members.length === 0 ? (
          <div className="p-16 text-center opacity-40 font-black text-[10px] uppercase tracking-[0.3em]">
            Aucun épargnant enregistré
          </div>
        ) : (
          members.map((m) => (
            <div key={m.id} className="grid grid-cols-[1.5fr,1fr,1fr,1fr] group border-b border-[var(--border)] last:border-b-0 hover:bg-slate-50 dark:hover:bg-white/5 transition-all bg-[var(--bg-card)] items-center">
              <div className="p-4 border-r border-[var(--border)] font-bold text-[var(--text-main)] text-xs">
                {m.groupName || `${m.firstName} ${m.lastName}`}
              </div>
              <div className="p-4 border-r border-[var(--border)] text-right font-black text-[var(--text-main)]">
                {formatCurrency(Math.floor(Math.random() * 500000))}
              </div>
              <div className="p-4 border-r border-[var(--border)] text-right font-black text-[var(--text-main)]">
                {formatCurrency(m.shares * 5000)}
                <span className="text-[8px] opacity-30 ml-1">({m.shares})</span>
              </div>
              <div className="p-4 flex items-center justify-center gap-3">
                {canManageSavings ? (
                  <>
                    <button className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-all">
                      <ArrowUpRight className="w-3.5 h-3.5" title="Dépôt" />
                    </button>
                    <button className="p-2 rounded-lg bg-rose-500/10 text-rose-600 hover:bg-rose-500 hover:text-white transition-all">
                      <ArrowDownLeft className="w-3.5 h-3.5" title="Retrait" />
                    </button>
                  </>
                ) : (
                  <span className="text-[10px] font-black uppercase text-[var(--text-muted)] opacity-30 italic">Lecture seule</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
