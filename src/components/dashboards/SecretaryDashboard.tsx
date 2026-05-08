import React from 'react';
import { 
  Users, 
  UserPlus, 
  FileText, 
  CreditCard, 
  History,
  CheckCircle2,
  AlertCircle,
  FileSearch,
  User,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  Files
} from 'lucide-react';
import { Member, MemberStatus } from '../../types';
import { cn } from '../../lib/utils';

interface DashboardProps {
  members: Member[];
  isDarkMode: boolean;
  onViewChange?: (view: 'dashboard' | 'members' | 'loans' | 'savings' | 'cash' | 'reports' | 'settings') => void;
  onAction?: (actionId: string) => void;
}

export function SecretaryDashboard({ members, onViewChange }: DashboardProps) {
  const activeMembers = members.filter(m => m.status === MemberStatus.ACTIVE).length;
  const pendingMembers = members.filter(m => m.status === MemberStatus.PENDING).length;

  const stats = [
    { label: 'Nouveaux Membres', value: pendingMembers, icon: UserPlus, color: '#3B82F6', trend: 'CE MOIS EN RCA' },
    { label: 'Membres Actifs', value: activeMembers, icon: Users, color: '#10B981', trend: 'VALIDE' },
    { label: 'Parts Sociales', value: '45.2M', icon: CreditCard, color: '#F59E0B', trend: 'FCFA COLLECTÉS' },
    { label: 'Dossiers Incomplets', value: '28', icon: Files, color: '#EF4444', trend: 'À COMPLÉTER' },
  ];

  const secretaryTasks = [
    { label: 'Ajouter un Membre', icon: UserPlus, desc: 'NOUVELLE ADHÉSION', view: 'members' as const },
    { label: 'Liste des Membres', icon: Users, desc: 'REGISTRE CENTRAL', view: 'members' as const },
    { label: 'Parts Sociales', icon: CreditCard, desc: 'SUIVI CAPITAL', view: 'savings' as const },
    { label: 'Documents Membres', icon: Files, desc: 'KYC & DOSSIERS', view: 'members' as const },
    { label: 'Hist. Adhésions', icon: History, desc: 'ARCHIVES RCA', view: 'reports' as const },
  ];

  return (
    <div className="space-y-10 animate-in fade-in zoom-in duration-1000">
      {/* Role-Specific Horizontal Task Bar */}
      <div className="flex flex-wrap gap-4 p-4 bg-emerald-500/5 dark:bg-white/5 rounded-[4rem] border border-emerald-500/10 backdrop-blur-md">
        {secretaryTasks.map((mod, i) => (
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
          <div key={i} className="bg-[var(--bg-card)] p-12 rounded-[4.5rem] border border-[var(--border)] shadow-md group hover:shadow-4xl transition-all relative overflow-hidden">
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
        <div className="lg:col-span-3 bg-[var(--bg-card)] p-14 rounded-[5rem] border border-[var(--border)] shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:scale-150 transition-transform duration-1000">
             <Users className="w-96 h-96 rotate-12" />
          </div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16 relative z-10">
             <div className="flex items-center gap-6">
                <div className="p-5 bg-emerald-500/10 rounded-[2rem]">
                   <UserPlus className="w-10 h-10 text-emerald-500" />
                </div>
                <div>
                   <h3 className="text-3xl font-[900] text-[var(--text-main)] tracking-tight uppercase italic underline decoration-emerald-500/30 decoration-[14px] underline-offset-8">Registre d'Adhésion</h3>
                   <p className="text-[11px] font-black text-[var(--text-muted)] uppercase tracking-[0.4em] mt-5 opacity-40 italic font-black">VALIDATION DES NOUVEAUX MEMBRES CMCC</p>
                </div>
             </div>
             <button 
                onClick={() => onViewChange?.('members')}
                className="px-12 py-6 bg-emerald-500 text-slate-950 rounded-[2.5rem] text-[13px] font-[900] uppercase tracking-[0.3em] hover:scale-105 transition-all shadow-4xl italic transform active:scale-95 flex items-center gap-4 group"
             >
                Ouvrir Registre Central <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
             </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 relative z-10">
            {members.slice(0, 6).map((member) => (
              <div key={member.id} className="flex flex-col p-10 bg-slate-50 dark:bg-[#0B1224] rounded-[5rem] border border-[var(--border)] hover:border-emerald-500/50 hover:bg-white dark:hover:bg-[#151B2E] transition-all group relative overflow-hidden shadow-sm">
                <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:scale-125 transition-transform">
                   <User className="w-24 h-24" />
                </div>
                <div className="flex items-center gap-6 mb-10">
                  <div className="w-20 h-20 rounded-[2.5rem] bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-[900] text-3xl shadow-inner group-hover:scale-110 group-hover:rotate-6 transition-all italic border border-emerald-500/20">
                    {member.firstName?.[0] || member.groupName?.[0]}
                  </div>
                  <div className="h-16 w-1 bg-slate-200 dark:bg-white/5" />
                  <div>
                    <h4 className="text-xl font-[900] text-[var(--text-main)] tracking-tight italic uppercase leading-tight line-clamp-1 group-hover:translate-x-2 transition-transform">
                       {member.groupName || `${member.firstName} ${member.lastName}`}
                    </h4>
                    <p className="text-[11px] font-black text-emerald-500 uppercase tracking-widest mt-2 opacity-70 italic">{member.type}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-auto pt-8 border-t border-[var(--border)] group-hover:border-emerald-500/20 transition-colors">
                  <div className="flex flex-col">
                    <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] leading-none opacity-40 italic">Matricule</p>
                    <p className="text-[13px] font-[900] text-[var(--text-main)] mt-2 italic">#{member.id.slice(0, 8).toUpperCase()}</p>
                  </div>
                  <div className={cn(
                    "px-5 py-2.5 rounded-[1.5rem] text-[11px] font-[900] uppercase tracking-widest border shadow-inner italic",
                    member.status === MemberStatus.ACTIVE ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                  )}>
                    {member.status}
                  </div>
                </div>

                <button className="mt-10 w-full py-6 bg-white dark:bg-white/5 border border-[var(--border)] rounded-[2.5rem] text-[11px] font-black uppercase tracking-[0.3em] group-hover:bg-slate-950 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-slate-950 transition-all shadow-sm italic">
                   Vérifier Dossier
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
