import React from 'react';
import { Member, Loan, Transaction, UserRole, UserProfile } from '../types';
import { AdminDashboard } from './dashboards/AdminDashboard';
import { SecretaryDashboard } from './dashboards/SecretaryDashboard';
import { CashierDashboard } from './dashboards/CashierDashboard';
import { CreditDashboard } from './dashboards/CreditDashboard';
import { SavingsDashboard } from './dashboards/SavingsDashboard';
import { AccountantDashboard } from './dashboards/AccountantDashboard';
import { DirectorDashboard } from './dashboards/DirectorDashboard';
import { AuditorDashboard } from './dashboards/AuditorDashboard';
import { MemberDashboard } from './dashboards/MemberDashboard';

interface DashboardProps {
  members: Member[];
  loans: Loan[];
  transactions: Transaction[];
  isDarkMode: boolean;
  userProfile?: UserProfile;
  onViewChange?: (view: 'dashboard' | 'members' | 'loans' | 'savings' | 'cash' | 'reports' | 'settings') => void;
  onAction?: (actionId: string) => void;
}

export function Dashboard({ members, loans, transactions, isDarkMode, userProfile, onViewChange, onAction }: DashboardProps) {
  const role = userProfile?.role || UserRole.SECRETARY; // Default fallback

  const passProps = { isDarkMode, onViewChange, onAction };

  switch (role) {
    case UserRole.SUPER_ADMIN:
      return <AdminDashboard members={members} loans={loans} transactions={transactions} {...passProps} />;
    
    case UserRole.SECRETARY:
      return <SecretaryDashboard members={members} {...passProps} />;
      
    case UserRole.CASHIER:
      return <CashierDashboard transactions={transactions} {...passProps} />;
      
    case UserRole.CREDIT_MANAGER:
      return <CreditDashboard loans={loans} {...passProps} />;
      
    case UserRole.SAVINGS_MANAGER:
      return <SavingsDashboard members={members} {...passProps} />;
      
    case UserRole.ACCOUNTANT:
      return <AccountantDashboard transactions={transactions} {...passProps} />;
      
    case UserRole.DIRECTOR:
      return <DirectorDashboard members={members} loans={loans} transactions={transactions} {...passProps} />;
      
    case UserRole.AUDITOR:
      return <AuditorDashboard members={members} loans={loans} transactions={transactions} {...passProps} />;
      
    case UserRole.MEMBER:
      return <MemberDashboard transactions={transactions} loans={loans} {...passProps} />;
      
    default:
      return <DirectorDashboard members={members} loans={loans} transactions={transactions} {...passProps} />;
  }
}
