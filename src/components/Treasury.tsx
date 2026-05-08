import React, { useState } from 'react';
import { UserProfile, UserRole, Transaction, TransactionType } from '../types';
import { formatCurrency, cn } from '../lib/utils';
import { 
  History, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Lock, 
  Unlock, 
  Calendar,
  Wallet
} from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';

interface TreasuryProps {
  transactions: Transaction[];
  userProfile?: UserProfile;
}

export function Treasury({ transactions, userProfile }: TreasuryProps) {
  const [isCaisseOpen, setIsCaisseOpen] = useState(true);
  const [showOpModal, setShowOpModal] = useState(false);
  const [opType, setOpType] = useState<TransactionType>(TransactionType.DEPOSIT);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canManageCash = [
    UserRole.SUPER_ADMIN, 
    UserRole.CASHIER
  ].includes(userProfile?.role || UserRole.MEMBER);

  const dailyBalance = transactions.reduce((acc, curr) => acc + (curr.type === TransactionType.DEPOSIT ? curr.amount : -curr.amount), 0);

  const handleTransaction = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    
    const tx = {
      amount: Number(formData.get('amount')),
      type: opType,
      method: 'cash',
      reference: formData.get('reference') as string,
      timestamp: new Date().toISOString(),
      performedBy: auth.currentUser?.email || 'system',
    };

    try {
      await addDoc(collection(db, 'transactions'), tx);
      setShowOpModal(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center bg-[var(--bg-card)] p-6 rounded-2xl border border-[var(--border)] shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-[var(--text-main)] tracking-tight">Gestion de la Caisse</h1>
          <p className="text-[10px] text-[var(--text-muted)] font-black uppercase tracking-[0.2em] opacity-60">Session Opérationnelle • CMCC RCA</p>
        </div>
        <div className="flex gap-3">
          {canManageCash && (
            <>
              <button 
                onClick={() => setIsCaisseOpen(!isCaisseOpen)}
                className={cn(
                  "px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all shadow-sm border",
                  isCaisseOpen 
                    ? "bg-rose-500/10 text-rose-500 border-rose-500/20" 
                    : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                )}
              >
                {isCaisseOpen ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                {isCaisseOpen ? "Clôturer la Journal" : "Ouvrir la Caisse"}
              </button>
              <button 
                disabled={!isCaisseOpen}
                onClick={() => { setOpType(TransactionType.DEPOSIT); setShowOpModal(true); }}
                className="px-5 py-2.5 bg-[#06231C] dark:bg-[#10B981] text-white dark:text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:brightness-110 disabled:opacity-50 transition-all shadow-lg active:scale-95"
              >
                <ArrowDownLeft className="w-3.5 h-3.5" /> Nouvelle Opération
              </button>
            </>
          )}
          {!canManageCash && (
            <div className="px-5 py-2.5 bg-slate-100 dark:bg-white/5 rounded-xl text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] flex items-center gap-2">
               <Calendar className="w-3.5 h-3.5" /> Mode Consultation
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[var(--bg-card)] p-8 rounded-3xl border border-[var(--border)] shadow-sm flex items-center gap-6 relative overflow-hidden group">
          <div className="p-4 bg-emerald-500/10 text-emerald-500 rounded-2xl z-10">
            <Wallet className="w-8 h-8" />
          </div>
          <div className="z-10">
            <p className="text-[10px] uppercase font-black text-[var(--text-muted)] tracking-widest mb-1 opacity-60">Disponibilités (Encaisse)</p>
            <h3 className="text-3xl font-black text-[var(--text-main)] tracking-tighter">{formatCurrency(1250400)}</h3>
          </div>
          <div className="absolute -bottom-4 -right-4 opacity-5 group-hover:scale-110 transition-transform">
             <Wallet className="w-32 h-32 text-[var(--text-main)]" />
          </div>
        </div>
        <div className="bg-[var(--bg-card)] p-8 rounded-3xl border border-[var(--border)] shadow-sm flex items-center gap-6 relative overflow-hidden group">
          <div className="p-4 bg-blue-500/10 text-blue-500 rounded-2xl z-10">
            <ArrowDownLeft className="w-8 h-8" />
          </div>
          <div className="z-10">
            <p className="text-[10px] uppercase font-black text-[var(--text-muted)] tracking-widest mb-1 opacity-60">Flux Entrants (J)</p>
            <h3 className="text-3xl font-black text-emerald-500 tracking-tighter">+{formatCurrency(450000)}</h3>
          </div>
          <div className="absolute -bottom-4 -right-4 opacity-5 group-hover:scale-110 transition-transform">
             <ArrowDownLeft className="w-32 h-32 text-[var(--text-main)]" />
          </div>
        </div>
        <div className="bg-[var(--bg-card)] p-8 rounded-3xl border border-[var(--border)] shadow-sm flex items-center gap-6 relative overflow-hidden group">
          <div className="p-4 bg-rose-500/10 text-rose-500 rounded-2xl z-10">
            <ArrowUpRight className="w-8 h-8" />
          </div>
          <div className="z-10">
            <p className="text-[10px] uppercase font-black text-[var(--text-muted)] tracking-widest mb-1 opacity-60">Flux Sortants (J)</p>
            <h3 className="text-3xl font-black text-rose-500 tracking-tighter">-{formatCurrency(95000)}</h3>
          </div>
          <div className="absolute -bottom-4 -right-4 opacity-5 group-hover:scale-110 transition-transform">
             <ArrowUpRight className="w-32 h-32 text-[var(--text-main)]" />
          </div>
        </div>
      </div>

      <div className="bg-[var(--bg-card)] rounded-3xl border border-[var(--border)] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[var(--border)] flex justify-between items-center bg-slate-50 dark:bg-white/5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg">
               <History className="w-4 h-4" />
            </div>
            <h3 className="font-black text-[var(--text-main)] tracking-tight">Historique des Flux de Caisse</h3>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest shadow-sm">
            <Calendar className="w-3.5 h-3.5 text-emerald-500" /> {new Date().toLocaleDateString()}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-white/5">
                <th className="p-4 text-[9px] uppercase font-black text-[var(--text-muted)] tracking-[0.2em] border-r border-[var(--border)] text-center w-32">Heure Valeur</th>
                <th className="p-4 text-[9px] uppercase font-black text-[var(--text-muted)] tracking-[0.2em] border-r border-[var(--border)]">Désignation de l'Opération</th>
                <th className="p-4 text-[9px] uppercase font-black text-[var(--text-muted)] tracking-[0.2em] border-r border-[var(--border)] text-right w-40">Montant Net</th>
                <th className="p-4 text-[9px] uppercase font-black text-[var(--text-muted)] tracking-[0.2em] w-32">Catégorie</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-32 text-center text-[var(--text-muted)] font-black uppercase tracking-[0.3em] text-[10px] opacity-30">
                    Aucune transaction enregistrée • Session ouverte
                  </td>
                </tr>
              ) : (
                transactions.map((tx, i) => (
                  <tr key={i} className="border-b border-[var(--border)] last:border-b-0 hover:bg-slate-50 dark:hover:bg-white/5 transition-all group">
                    <td className="p-4 border-r border-[var(--border)] text-center text-[10px] font-black text-[var(--text-muted)] opacity-60">
                      {new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="p-4 border-r border-[var(--border)]">
                      <p className="text-xs font-black text-[var(--text-main)] tracking-tight uppercase">{tx.reference}</p>
                      <p className="text-[9px] text-[var(--text-muted)] font-bold uppercase tracking-widest mt-0.5">{tx.method}</p>
                    </td>
                    <td className={cn(
                      "p-4 border-r border-[var(--border)] text-right font-black text-sm",
                      tx.type === TransactionType.DEPOSIT ? "text-emerald-500" : "text-rose-500"
                    )}>
                      {tx.type === TransactionType.DEPOSIT ? '+' : '-'}{formatCurrency(tx.amount)}
                    </td>
                    <td className="p-4">
                      <span className={cn(
                        "text-[8px] font-black uppercase px-2 py-0.5 rounded-full border",
                        tx.type === TransactionType.DEPOSIT 
                          ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
                          : "bg-rose-500/10 text-rose-500 border-rose-500/20"
                      )}>
                        {tx.type.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showOpModal && (
        <div className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[2.5rem] w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 bg-[#06231C] text-white flex justify-between items-center border-b border-white/10">
              <div>
                <h3 className="text-xl font-black italic tracking-tight">Nouvelle Transaction Caisse</h3>
                <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest mt-1">Saisie de mouvement fiduciaire</p>
              </div>
              <div className={cn(
                "p-4 rounded-2xl shadow-inner",
                opType === TransactionType.DEPOSIT ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"
              )}>
                {opType === TransactionType.DEPOSIT ? <ArrowDownLeft className="w-8 h-8" /> : <ArrowUpRight className="w-8 h-8" />}
              </div>
            </div>
            
            <form onSubmit={handleTransaction} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black text-[var(--text-muted)] tracking-widest ml-1">Nature du Flux</label>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    type="button" 
                    disabled={isSubmitting}
                    onClick={() => setOpType(TransactionType.DEPOSIT)}
                    className={cn(
                      "py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border shadow-sm",
                      opType === TransactionType.DEPOSIT 
                        ? "bg-emerald-500 text-white border-emerald-600 shadow-emerald-500/20" 
                        : "bg-slate-50 dark:bg-white/5 text-[var(--text-muted)] border-[var(--border)]"
                    )}
                  >
                    Encaissement (IN)
                  </button>
                  <button 
                    type="button" 
                    disabled={isSubmitting}
                    onClick={() => setOpType(TransactionType.WITHDRAWAL)}
                    className={cn(
                      "py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border shadow-sm",
                      opType === TransactionType.WITHDRAWAL 
                        ? "bg-rose-500 text-white border-rose-600 shadow-rose-500/20" 
                        : "bg-slate-50 dark:bg-white/5 text-[var(--text-muted)] border-[var(--border)]"
                    )}
                  >
                    Décaissement (OUT)
                  </button>
                </div>
              </div>

              <div className="space-y-2 bg-slate-50 dark:bg-white/5 p-6 rounded-3xl border border-[var(--border)]">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-black text-[var(--text-muted)] tracking-widest ml-1">Montant Nominal (XAF)</label>
                  <input 
                    name="amount" 
                    type="number" 
                    autoFocus 
                    placeholder="0"
                    disabled={isSubmitting}
                    className="w-full bg-transparent border-none p-0 text-4xl font-black text-[var(--text-main)] placeholder:text-[var(--border)] focus:ring-0" 
                    required 
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-black text-[var(--text-muted)] tracking-widest ml-1">Justificatif / Référence Écriture</label>
                <input 
                  name="reference" 
                  disabled={isSubmitting}
                  placeholder="Ex: Versement initial part sociale de M. X..."
                  className="w-full bg-slate-50 dark:bg-white/5 border border-[var(--border)] p-4 rounded-2xl text-xs font-black text-[var(--text-main)] placeholder:text-[var(--text-muted)] opacity-50 focus:opacity-100 transition-all outline-none" 
                  required 
                />
              </div>

              <div className="flex gap-3 pt-6 border-t border-[var(--border)]">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-1 py-4 bg-[#06231C] dark:bg-[#10B981] hover:brightness-110 text-white dark:text-slate-900 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-lg active:scale-95 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'Traitement...' : "Confirmer l'opération"}
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowOpModal(false)}
                  className="px-8 py-4 bg-slate-100 dark:bg-white/10 dark:text-slate-400 text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
