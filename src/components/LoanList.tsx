import React, { useState } from 'react';
import { UserRole, UserProfile, Loan, Member, LoanStatus } from '../types';
import { formatDate, formatCurrency, cn } from '../lib/utils';
import { Wallet, Plus, ChevronRight, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

interface LoanListProps {
  loans: Loan[];
  members: Member[];
  userProfile?: UserProfile;
}

export function LoanList({ loans, members, userProfile }: LoanListProps) {
  const [showLoanModal, setShowLoanModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canManageLoans = [
    UserRole.SUPER_ADMIN, 
    UserRole.CREDIT_MANAGER, 
    UserRole.DIRECTOR
  ].includes(userProfile?.role || UserRole.MEMBER);

  const canRequestLoan = canManageLoans || userProfile?.role === UserRole.MEMBER;

  const handleAddLoan = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    
    const newLoan = {
      memberId: formData.get('memberId') as string,
      amount: Number(formData.get('amount')),
      durationMonths: Number(formData.get('duration')),
      interestRate: 2.5, 
      purpose: formData.get('purpose') as string,
      status: LoanStatus.PENDING_REVIEW,
      scoring: Math.floor(Math.random() * 40) + 60, 
      repaymentSchedule: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await addDoc(collection(db, 'loans'), newLoan);
      setShowLoanModal(false);
    } catch (err) {
      console.error('Error adding loan:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusIcon = (status: LoanStatus) => {
    switch (status) {
      case LoanStatus.ACTIVE: return <CheckCircle2 className="w-3 h-3 text-emerald-500" />;
      case LoanStatus.PENDING_REVIEW: return <Clock className="w-3 h-3 text-amber-500" />;
      default: return <AlertCircle className="w-3 h-3 text-[var(--text-muted)] opacity-50" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-[var(--bg-card)] p-5 rounded-2xl border border-[var(--border)] shadow-sm">
        <div>
          <h3 className="text-lg font-black text-[var(--text-main)] tracking-tight">Dossiers de Crédit</h3>
          <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest mt-0.5">Gestion du Portefeuille • CMCC</p>
        </div>
        {canRequestLoan && (
          <button 
            onClick={() => setShowLoanModal(true)}
            className="bg-[#06231C] text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-emerald-950 dark:hover:bg-emerald-900 transition-all shadow-lg active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" /> Nouvelle Demande
          </button>
        )}
      </div>

      <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] shadow-sm overflow-hidden">
        <div className="grid grid-cols-[1.5fr,1fr,1fr,1fr,auto] border-b border-[var(--border)] bg-slate-50 dark:bg-white/5">
          <span className="text-[9px] uppercase font-black text-[var(--text-muted)] p-4 border-r border-[var(--border)] tracking-wider">Bénéficiaire</span>
          <span className="text-[9px] uppercase font-black text-[var(--text-muted)] p-4 text-right border-r border-[var(--border)] tracking-wider">Montant Principal</span>
          <span className="text-[9px] uppercase font-black text-[var(--text-muted)] p-4 text-center border-r border-[var(--border)] tracking-wider">Note de Crédit</span>
          <span className="text-[9px] uppercase font-black text-[var(--text-muted)] p-4 tracking-wider">Statut Dossier</span>
          <span className="p-4"></span>
        </div>

        {loans.length === 0 ? (
          <div className="p-20 text-center opacity-40 font-black text-[10px] uppercase tracking-[0.3em] bg-[var(--bg-card)]">
            Aucun dossier de crédit en cours
          </div>
        ) : (
          loans.map((loan) => {
            const borrower = members.find(m => m.id === loan.memberId);
            return (
              <div key={loan.id} className="grid grid-cols-[1.5fr,1fr,1fr,1fr,auto] items-center group border-b border-[var(--border)] last:border-b-0 hover:bg-slate-50 dark:hover:bg-white/5 transition-all bg-[var(--bg-card)]">
                <div className="p-4 border-r border-[var(--border)] font-bold text-[var(--text-main)] text-xs">
                  {borrower ? (borrower.groupName || `${borrower.firstName} ${borrower.lastName}`) : 'Inconnu'}
                </div>
                <div className="p-4 text-right font-black text-[var(--text-main)] border-r border-[var(--border)] text-xs">
                  {formatCurrency(loan.amount)}
                </div>
                <div className="p-4 text-center border-r border-[var(--border)]">
                  <span className={cn(
                    "font-black text-[8px] px-2 py-0.5 rounded-full border uppercase tracking-widest",
                    loan.scoring > 80 ? "bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400" : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500"
                  )}>
                    {loan.scoring}/100
                  </span>
                </div>
                <div className="p-4 flex items-center gap-2 uppercase font-black text-[9px] text-[var(--text-muted)]">
                  {getStatusIcon(loan.status)}
                  {loan.status.replace('_', ' ')}
                </div>
                <div className="p-4 opacity-20 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                  <ChevronRight className="w-4 h-4 text-[var(--text-main)]" />
                </div>
              </div>
            );
          })
        )}
      </div>

      {showLoanModal && (
        <div className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-[#0f172a] p-6 text-white border-b border-white/10">
               <h3 className="text-xl font-black tracking-tight italic">Nouveau Dossier de Crédit</h3>
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Évaluation et Instruction de la demande</p>
            </div>
            
            <form onSubmit={handleAddLoan} className="p-8 space-y-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1">Membre Émetteur</label>
                <select name="memberId" className="w-full bg-slate-50 dark:bg-white/5 border border-[var(--border)] rounded-xl p-3 text-xs font-bold text-[var(--text-main)] focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all" required>
                  <option value="">Sélectionner un membre bénéficiaire...</option>
                  {members.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.groupName || `${m.firstName} ${m.lastName}`}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-6 bg-slate-50/50 dark:bg-white/5 p-6 rounded-2xl border border-[var(--border)]">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1">Montant Souhaité (XAF)</label>
                  <input name="amount" type="number" step="5000" className="w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-3 text-xs font-black text-[var(--text-main)] focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all" placeholder="Ex: 500000" required />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1">Durée du Crédit (Mois)</label>
                  <input name="duration" type="number" defaultValue="12" className="w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-3 text-xs font-black text-[var(--text-main)] focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all" required />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1">Objet opérationnel de l'emprunt</label>
                <textarea name="purpose" className="w-full bg-slate-50 dark:bg-white/5 border border-[var(--border)] rounded-xl p-3 text-xs font-bold text-[var(--text-main)] focus:ring-2 focus:ring-emerald-500/20 outline-none h-28 transition-all resize-none" placeholder="Décrivez le projet à financer..."></textarea>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-1 py-4 bg-[#06231C] dark:bg-[#10B981] hover:brightness-110 text-white dark:text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg active:scale-95 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'Traitement en cours...' : 'Soumettre le Dossier'}
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowLoanModal(false)}
                  className="px-6 py-4 border border-[var(--border)] text-[var(--text-muted)] rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
                >
                  Fermer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
