import { UserProfile, Transaction } from '../types';
import { formatDate, formatCurrency, cn } from '../lib/utils';
import { BookText, Download, Printer } from 'lucide-react';

interface AccountingProps {
  transactions: Transaction[];
  userProfile?: UserProfile;
}

export function Accounting({ transactions, userProfile }: AccountingProps) {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-[var(--bg-card)] p-6 rounded-2xl border border-[var(--border)] shadow-sm">
        <div className="space-y-1">
          <h3 className="text-xl font-black text-[var(--text-main)] tracking-tight">Journal Général</h3>
          <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] opacity-60">Plan Comptable SYSCOHADA • CMCC RCA</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-slate-100 dark:bg-white/5 border border-[var(--border)] text-[var(--text-main)] rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-slate-200 dark:hover:bg-white/10 transition-all">
            <Download className="w-3 h-3" /> Export
          </button>
          <button className="px-4 py-2 bg-[#06231C] dark:bg-[#10B981] text-white dark:text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:brightness-110 transition-all shadow-md">
            <Printer className="w-3 h-3" /> Imprimer
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-8 rounded-3xl bg-[var(--bg-card)] border border-[var(--border)] shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
             <BookText className="w-24 h-24 text-[var(--text-main)]" />
          </div>
          <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] mb-4 block">Bilan Actif Consolidé</span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-[var(--text-main)] tracking-tighter">288,5<span className="text-emerald-500">M</span></span>
            <span className="text-xs uppercase font-black text-[var(--text-muted)] opacity-40">XAF</span>
          </div>
          <p className="text-[10px] font-bold text-emerald-500 mt-2 flex items-center gap-1">
             <span className="inline-block w-1 h-1 bg-emerald-500 rounded-full" /> +4.2% vs Exercice Précédent
          </p>
        </div>
        <div className="p-8 rounded-3xl bg-[var(--bg-card)] border border-[var(--border)] shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
             <BookText className="w-24 h-24 text-[var(--text-main)]" />
          </div>
          <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] mb-4 block">Ratio de Liquidité (COBAC)</span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-emerald-500 tracking-tighter">112%</span>
            <span className="text-xs uppercase font-black text-emerald-500 opacity-60">OPTIMAL</span>
          </div>
          <p className="text-[10px] font-bold text-emerald-500 mt-2 flex items-center gap-1">
             <span className="inline-block w-1 h-1 bg-emerald-500 rounded-full" /> Conforme aux normes prudentielles
          </p>
        </div>
      </div>

      <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] shadow-sm overflow-hidden">
        <div className="grid grid-cols-[110px,1fr,130px,130px] bg-slate-50 dark:bg-white/5 border-b border-[var(--border)]">
          <span className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-wider p-4 border-r border-[var(--border)] text-center">Date Valeur</span>
          <span className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-wider p-4 border-r border-[var(--border)]">Libellé / Compte Imputé</span>
          <span className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-wider p-4 border-r border-[var(--border)] text-right">Débit</span>
          <span className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-wider p-4 text-right">Crédit</span>
        </div>

        {transactions.length === 0 ? (
          <div className="p-20 text-center opacity-30 font-black text-[10px] uppercase tracking-[0.3em] bg-[var(--bg-card)]">
            Journal comptable vierge • Exercice 2024
          </div>
        ) : (
          transactions.map((tx, i) => (
            <div key={i} className="grid grid-cols-[110px,1fr,130px,130px] items-center text-[11px] border-b border-[var(--border)] last:border-b-0 hover:bg-slate-50 dark:hover:bg-white/5 transition-all bg-[var(--bg-card)]">
              <div className="p-4 border-r border-[var(--border)] text-center font-mono opacity-60 text-[10px] font-black">
                {new Date(tx.timestamp).toLocaleDateString()}
              </div>
              <div className="p-4 border-r border-[var(--border)] flex flex-col">
                <span className="font-black uppercase tracking-tight text-[var(--text-main)] text-xs text-emerald-600 dark:text-emerald-400">{tx.reference || 'ECRITURE GÉNÉRÉE'}</span>
                <span className="text-[8px] font-black text-[var(--text-muted)] uppercase tracking-[0.1em] mt-0.5">{tx.type}</span>
              </div>
              <div className="p-4 border-r border-[var(--border)] text-right font-black text-[var(--text-main)]">
                {tx.amount > 0 ? formatCurrency(tx.amount) : '-'}
              </div>
              <div className="p-4 text-right font-black text-[var(--text-main)]">
                {tx.amount < 0 ? formatCurrency(Math.abs(tx.amount)) : '-'}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
