export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  SECRETARY = 'secretary', // Gestionnaire des Membres
  CASHIER = 'cashier',
  CREDIT_MANAGER = 'credit_manager',
  SAVINGS_MANAGER = 'savings_manager',
  ACCOUNTANT = 'accountant',
  DIRECTOR = 'director',
  AUDITOR = 'auditor',
  MEMBER = 'member'
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  agency?: string;
}

export enum MemberStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  CLOSED = 'closed'
}

export enum MemberType {
  INDIVIDUAL = 'individual',
  GROUP = 'group'
}

export interface Member {
  id: string;
  type: MemberType;
  firstName?: string;
  lastName?: string;
  groupName?: string;
  birthDate?: string;
  idType?: string;
  idNumber?: string;
  idExpiry?: string;
  phone?: string;
  address?: string;
  photoUrl?: string;
  status: MemberStatus;
  shares: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export enum LoanStatus {
  DRAFT = 'draft',
  PENDING_REVIEW = 'pending_review',
  APPROVED = 'approved',
  ACTIVE = 'active',
  REJECTED = 'rejected',
  REPAID = 'repaid',
  DEFAULTED = 'defaulted'
}

export interface RepaymentScheduleItem {
  dueDate: string;
  principal: number;
  interest: number;
  status: 'pending' | 'paid' | 'late';
}

export interface Loan {
  id: string;
  memberId: string;
  amount: number;
  durationMonths: number;
  interestRate: number;
  purpose: string;
  status: LoanStatus;
  disbursementDate?: string;
  repaymentSchedule: RepaymentScheduleItem[];
  guarantees: string;
  scoring: number;
  createdAt: string;
  updatedAt: string;
}

export enum AccountType {
  VOLUNTARY = 'voluntary',
  MANDATORY = 'mandatory',
  TERM = 'term'
}

export interface SavingAccount {
  id: string;
  memberId: string;
  accountType: AccountType;
  balance: number;
  interestRate: number;
  status: 'active' | 'closed';
  createdAt: string;
}

export enum TransactionType {
  DEPOSIT = 'deposit',
  WITHDRAWAL = 'withdrawal',
  LOAN_DISBURSEMENT = 'loan_disbursement',
  LOAN_REPAYMENT = 'loan_repayment',
  INTEREST_CREDIT = 'interest_credit'
}

export interface Transaction {
  id: string;
  accountId?: string;
  loanId?: string;
  amount: number;
  type: TransactionType;
  method: 'cash' | 'mobile_money' | 'transfer';
  reference: string;
  timestamp: string;
  performedBy: string;
}
