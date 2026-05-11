import React, { useState } from 'react';
import { UserRole, UserProfile, Member, MemberType, MemberStatus } from '../types';
import { formatDate, cn } from '../lib/utils';
import { Search, UserPlus, Filter } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';

interface MemberListProps {
  members: Member[];
  userProfile?: UserProfile;
}

export function MemberList({ members, userProfile }: MemberListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canAddMember = [
    UserRole.SUPER_ADMIN, 
    UserRole.SECRETARY, 
    UserRole.CASHIER, 
    UserRole.SAVINGS_MANAGER
  ].includes(userProfile?.role || UserRole.MEMBER);

  const filteredMembers = members.filter(m => 
    m.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.groupName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddMember = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const type = formData.get('type') as MemberType;
    
    const newMember = {
      type,
      firstName: formData.get('firstName') as string || '',
      lastName: formData.get('lastName') as string || '',
      groupName: type === MemberType.GROUP ? formData.get('groupName') as string : '',
      shares: Number(formData.get('shares')) || 0,
      status: MemberStatus.ACTIVE,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: auth.currentUser?.email || 'system',
    };

    try {
      await addDoc(collection(db, 'members'), newMember);
      setShowAddModal(false);
    } catch (err) {
      console.error('Error adding member:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] opacity-50" />
          <input 
            type="text" 
            placeholder="Rechercher un membre par nom ou identifiant..."
            className="w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-xl py-3 pl-12 pr-4 font-medium text-xs focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {canAddMember && (
          <button 
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center gap-2 shrink-0"
          >
            <UserPlus className="w-4 h-4" /> Nouveau Membre
          </button>
        )}
      </div>

      <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] shadow-sm overflow-hidden">
        {/* Desktop Header - Hidden on mobile */}
        <div className="hidden sm:grid grid-cols-[70px,1.5fr,1fr,1fr,1fr] bg-slate-50 dark:bg-white/5 border-b border-[var(--border)]">
          <span className="text-[9px] uppercase font-black text-[var(--text-muted)] p-3.5 border-r border-[var(--border)] tracking-wider">Type</span>
          <span className="text-[9px] uppercase font-black text-[var(--text-muted)] p-3.5 border-r border-[var(--border)] tracking-wider">Identité / Raison Sociale</span>
          <span className="text-[9px] uppercase font-black text-[var(--text-muted)] p-3.5 border-r border-[var(--border)] tracking-wider">Adhésion</span>
          <span className="text-[9px] uppercase font-black text-[var(--text-muted)] p-3.5 border-r border-[var(--border)] tracking-wider text-right">Parts Sociales</span>
          <span className="text-[9px] uppercase font-black text-[var(--text-muted)] p-3.5 tracking-wider">État</span>
        </div>

        {filteredMembers.length === 0 ? (
          <div className="p-10 sm:p-16 text-center opacity-40 font-black text-[9px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.3em] bg-[var(--bg-card)]">
            Aucun membre enregistré dans la base
          </div>
        ) : (
          <div className="divide-y divide-[var(--border)]">
            {filteredMembers.map((member) => (
              <div key={member.id} className="p-4 sm:p-0 group transition-all bg-[var(--bg-card)] hover:bg-slate-50 dark:hover:bg-white/5">
                {/* Mobile Layout: Card-like */}
                <div className="sm:hidden space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <span className={cn(
                        "text-[8px] font-black uppercase px-2 py-0.5 rounded-full border",
                        member.type === MemberType.INDIVIDUAL 
                          ? "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500" 
                          : "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                      )}>
                        {member.type === MemberType.INDIVIDUAL ? 'IND' : 'GRP'}
                      </span>
                      <p className="font-bold text-[var(--text-main)] text-sm">
                        {member.type === MemberType.INDIVIDUAL ? `${member.firstName} ${member.lastName}` : member.groupName}
                      </p>
                    </div>
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      member.status === MemberStatus.ACTIVE ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-amber-500"
                    )} />
                  </div>
                  
                  <div className="flex justify-between items-end pt-2">
                    <div>
                      <p className="text-[9px] uppercase font-black text-[var(--text-muted)] tracking-wider">Membre depuis</p>
                      <p className="text-[11px] font-medium text-[var(--text-muted)]">{formatDate(member.createdAt)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] font-black text-[var(--text-main)]">
                        {member.shares} <span className="opacity-40 font-bold ml-1 uppercase text-[8px]">parts</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Desktop Layout: Traditional Grid Row */}
                <div className="hidden sm:grid grid-cols-[70px,1.5fr,1fr,1fr,1fr] items-center">
                  <div className="p-3.5 flex items-center justify-center border-r border-[var(--border)]">
                    <span className={cn(
                      "text-[8px] font-black uppercase px-2 py-0.5 rounded-full border",
                      member.type === MemberType.INDIVIDUAL 
                        ? "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500" 
                        : "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                    )}>
                      {member.type === MemberType.INDIVIDUAL ? 'IND' : 'GRP'}
                    </span>
                  </div>
                  <div className="p-3.5 border-r border-[var(--border)] font-bold text-[var(--text-main)] text-xs truncate">
                    {member.type === MemberType.INDIVIDUAL ? `${member.firstName} ${member.lastName}` : member.groupName}
                  </div>
                  <div className="p-3.5 border-r border-[var(--border)] text-[11px] font-medium text-[var(--text-muted)]">
                    {formatDate(member.createdAt)}
                  </div>
                  <div className="p-3.5 border-r border-[var(--border)] text-[11px] font-black text-[var(--text-main)] text-right">
                    {member.shares} <span className="opacity-40 font-bold ml-1 uppercase text-[8px]">parts</span>
                  </div>
                  <div className="p-3.5 flex items-center">
                    <div className={cn(
                      "w-1.5 h-1.5 rounded-full mr-2 shadow-sm",
                      member.status === MemberStatus.ACTIVE ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
                    )} />
                    <span className="text-[9px] font-black uppercase text-[var(--text-muted)]">{member.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-[#06231C] p-6 text-white">
               <h3 className="text-xl font-black tracking-tight italic">Nouveau Membre</h3>
               <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest mt-1">Enregistrement dans le registre CMCC</p>
            </div>
            
            <form onSubmit={handleAddMember} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1">Type de compte</label>
                  <select name="type" className="w-full bg-slate-50 dark:bg-white/5 border border-[var(--border)] rounded-xl p-3 text-xs font-bold text-[var(--text-main)] focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all">
                    <option value={MemberType.INDIVIDUAL}>Individuel (Particulier)</option>
                    <option value={MemberType.GROUP}>Groupe Solidaire (Tontine)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1">Parts Sociales Initiales</label>
                  <input name="shares" type="number" defaultValue="1" className="w-full bg-slate-50 dark:bg-white/5 border border-[var(--border)] rounded-xl p-3 text-xs font-bold text-[var(--text-main)] focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all" />
                </div>
              </div>
              
              <div className="space-y-6 bg-slate-50/50 dark:bg-white/5 p-6 rounded-2xl border border-[var(--border)]">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1">Prénom</label>
                  <input name="firstName" placeholder="Prénom du membre" className="w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-3 text-xs font-bold text-[var(--text-main)] focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1">Nom / Nom du Groupe</label>
                  <input name="lastName" placeholder="Nom de famille ou Nom de la tontine" className="w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-3 text-xs font-bold text-[var(--text-main)] focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all" />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-1 py-4 bg-emerald-500 hover:bg-emerald-600 text-white dark:text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg active:scale-95 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'Enregistrement...' : 'Valider Adhésion'}
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-4 border border-[var(--border)] text-[var(--text-muted)] rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
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
