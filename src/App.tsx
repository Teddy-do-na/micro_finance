import React, { useState, useEffect } from 'react';
import { auth, loginWithGoogle, logout, db, registerWithEmail, loginWithEmail } from './firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, query, onSnapshot, orderBy, limit, doc, getDoc, setDoc, getDocFromServer } from 'firebase/firestore';
import { 
  Users, 
  Wallet, 
  BarChart3, 
  FileText, 
  Settings, 
  LayoutDashboard, 
  PiggyBank, 
  Calculator, 
  ChevronRight,
  Landmark,
  TrendingUp,
  Wifi,
  LogOut,
  Bell,
  Mail,
  Lock,
  User as UserIcon,
  Briefcase,
  Eye,
  EyeOff
} from 'lucide-react';
import { cn } from './lib/utils';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { MemberList } from './components/MemberList';
import { LoanList } from './components/LoanList';
import { SavingsList } from './components/SavingsList';
import { Treasury } from './components/Treasury';
import { Accounting } from './components/Accounting';
import { Member, Loan, SavingAccount, Transaction, UserProfile, UserRole } from './types';

// --- Firestore Error Handling Protocols ---
enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    providerInfo?: any[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      providerInfo: auth.currentUser?.providerData?.map(p => ({ providerId: p.providerId, email: p.email })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error Detailed: ', JSON.stringify(errInfo, null, 2));
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [currentView, setCurrentView] = useState<'dashboard' | 'members' | 'loans' | 'savings' | 'cash' | 'reports' | 'settings'>('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cmcc-dark-mode');
      return saved ? JSON.parse(saved) : window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('cmcc-dark-mode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  // Form states
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: '' as UserRole | ''
  });

  // Verify connection on boot
  useEffect(() => {
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, 'system', 'connection-test'));
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Firebase Connection Error: Client is offline or config is invalid.");
        }
      }
    }
    testConnection();
  }, []);

  const handleRoleSelection = async (role: UserRole) => {
    if (!user) return;
    setAuthLoading(true);
    const path = `users/${user.uid}`;
    const newProfile: UserProfile = {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || 'Utilisateur',
      role,
      agency: 'Bangui Centre'
    };
    try {
      await setDoc(doc(db, 'users', user.uid), newProfile);
      setUserProfile(newProfile);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, path);
      setAuthError("Erreur lors de la création du profil. Vérifiez vos permissions.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (authLoading) return;
    setAuthError(null);
    setAuthLoading(true);

    try {
      if (authMode === 'signup') {
        if (!formData.role) throw new Error("Veuillez choisir un profil");
        const name = `${formData.lastName} ${formData.firstName}`.trim();
        console.log("Starting registration for:", formData.email);
        const res = await registerWithEmail(formData.email, formData.password, name);
        console.log("Registration successful, creating profile...");
        
        // Auto-create profile on signup
        const newProfile: UserProfile = {
          uid: res.user.uid,
          email: formData.email,
          displayName: name,
          role: formData.role as UserRole,
          agency: 'Bangui Centre'
        };
        const path = `users/${res.user.uid}`;
        try {
          await setDoc(doc(db, 'users', res.user.uid), newProfile);
          console.log("Profile created successfully");
          setUserProfile(newProfile);
        } catch (e) {
          handleFirestoreError(e, OperationType.WRITE, path);
          setAuthError("Compte créé mais erreur lors de la configuration du profil. Veuillez contacter l'administrateur.");
        }
      } else {
        await loginWithEmail(formData.email, formData.password);
      }
    } catch (error: any) {
      console.error("Auth error catch:", error);
      if (error.code === 'auth/email-already-in-use') {
        setAuthError("Cet email est déjà utilisé par un autre compte professionnel.");
      } else if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
        setAuthError("Identifiants incorrects ou accès non autorisé.");
      } else if (error.code === 'auth/weak-password') {
        setAuthError("Le mot de passe doit contenir au moins 6 caractères pour votre sécurité.");
      } else if (error.message) {
        setAuthError(error.message);
      } else {
        setAuthError("Une erreur est survenue lors de l'authentification.");
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (authLoading) return;
    setAuthError(null);
    setAuthLoading(true);
    try {
      await loginWithGoogle();
    } catch (error: any) {
      setAuthError("Erreur de connexion Google.");
    } finally {
      setAuthLoading(false);
    }
  };

  // State for data
  const [members, setMembers] = useState<Member[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [savings, setSavings] = useState<SavingAccount[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const path = `users/${u.uid}`;
        try {
          const userDoc = await getDoc(doc(db, 'users', u.uid));
          if (userDoc.exists()) {
            setUserProfile(userDoc.data() as UserProfile);
          } else {
            setUserProfile(null);
          }
        } catch (e) {
          handleFirestoreError(e, OperationType.GET, path);
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user) return;

    const pathMembers = 'members';
    const qMembers = query(collection(db, pathMembers), orderBy('createdAt', 'desc'), limit(100));
    const unsubMembers = onSnapshot(qMembers, (snapshot) => {
      setMembers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Member)));
    }, (error) => handleFirestoreError(error, OperationType.LIST, pathMembers));

    const pathLoans = 'loans';
    const qLoans = query(collection(db, pathLoans), orderBy('createdAt', 'desc'), limit(100));
    const unsubLoans = onSnapshot(qLoans, (snapshot) => {
      setLoans(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Loan)));
    }, (error) => handleFirestoreError(error, OperationType.LIST, pathLoans));

    const pathTx = 'transactions';
    const qTx = query(collection(db, pathTx), orderBy('timestamp', 'desc'), limit(100));
    const unsubTx = onSnapshot(qTx, (snapshot) => {
      setTransactions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Transaction)));
    }, (error) => handleFirestoreError(error, OperationType.LIST, pathTx));

    return () => {
      unsubMembers();
      unsubLoans();
      unsubTx();
    };
  }, [user]);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#060B18]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <div className="font-black text-emerald-500/40 uppercase tracking-[0.4em] text-[10px]">CMCC Microfinance</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#020617] overflow-y-auto font-sans relative">
        {/* Background Image / Artistic Layer */}
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2070')] bg-cover bg-center opacity-20 transition-opacity duration-1000" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#020617] via-[#020617]/90 to-[#06231C]/40" />
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] [background-size:60px_60px]" />
        </div>

        {/* Left Content Pane - Branding */}
        <div className="hidden lg:flex lg:w-7/12 relative flex-col justify-between p-12 xl:p-24 z-10 h-screen sticky top-0">
          <div className="relative">
            <div className="flex items-center gap-5 mb-16 xl:mb-24">
              <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-[0_0_40px_rgba(16,185,129,0.3)]">
                <LayoutDashboard className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-white text-3xl font-black tracking-tighter uppercase leading-none italic">CMCC.RCA</h1>
                <p className="text-emerald-500/60 text-[10px] font-black uppercase tracking-[0.4em] mt-1">Crédit Centrafrique • Bangui</p>
              </div>
            </div>

            <div className="space-y-10">
              <div className="space-y-4">
                <span className="inline-block px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-[10px] font-black uppercase tracking-widest">Institution Certifiée</span>
                <h2 className="text-white text-5xl xl:text-7xl font-[900] leading-[0.9] tracking-tighter max-w-xl">
                  L'Elite de la <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">Micro-Finance</span> <br/>
                  en RCA<span className="text-emerald-500">.</span>
                </h2>
              </div>
              <p className="text-slate-400 text-lg xl:text-xl max-w-sm font-medium opacity-60 leading-relaxed">
                Connectez-vous pour accéder au portail métier de la COOPÉRATIVE DE MICRO-FINANCE.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-10">
            {[
              { label: 'Dépôts', value: '4.2B' },
              { label: 'Membres', value: '12K+' },
              { label: 'Crédits', value: '1.8B' }
            ].map((stat, i) => (
              <div key={i} className="space-y-1">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
                <div className="text-2xl font-black text-white">{stat.value} <span className="text-emerald-500 text-xs italic">XAF</span></div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Auth Pane */}
        <div className="flex-1 flex flex-col justify-center min-h-screen p-6 sm:p-12 lg:p-24 bg-white dark:bg-[#020617] relative z-20 transition-colors duration-500 shadow-none lg:shadow-[-40px_0_100px_rgba(0,0,0,0.5)]">
          <div className="max-w-md w-full mx-auto space-y-8 xl:space-y-10 py-12 lg:py-0">
            <header className="space-y-2">
              <div className="lg:hidden flex items-center justify-between gap-4 mb-12">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                    <LayoutDashboard className="w-5 h-5" />
                  </div>
                  <h1 className="text-slate-900 dark:text-white font-black text-xl italic tracking-tighter">CMCC<span className="text-emerald-500">.</span>RCA</h1>
                </div>
                <div className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] bg-slate-100 dark:bg-white/5 px-3 py-1 rounded-full">v2.6.4</div>
              </div>
              <h3 className="text-slate-900 dark:text-white text-3xl sm:text-4xl font-black tracking-tight leading-none italic underline decoration-emerald-500 decoration-8 underline-offset-8">
                {authMode === 'login' ? 'Portail Accès' : 'Nouveau Compte'}
              </h3>
              <p className="hidden lg:block text-slate-400 dark:text-slate-500 font-bold text-sm tracking-tight opacity-70 uppercase mt-4">Système d'Information • v2.6</p>
            </header>

            {/* Mode Switcher */}
            <div className="bg-slate-100 dark:bg-white/5 p-1 rounded-2xl flex gap-1 border border-slate-200 dark:border-white/10">
               <button 
                onClick={() => setAuthMode('login')}
                className={cn(
                  "flex-1 py-3 px-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all",
                  authMode === 'login' ? "bg-white dark:bg-[#1e293b] text-slate-900 dark:text-white shadow-xl" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                )}
               >
                 Connexion
               </button>
               <button 
                onClick={() => setAuthMode('signup')}
                className={cn(
                  "flex-1 py-3 px-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all",
                  authMode === 'signup' ? "bg-white dark:bg-[#1e293b] text-slate-900 dark:text-white shadow-xl" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                )}
               >
                 Inscription
               </button>
            </div>

            {authError && (
              <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 dark:text-rose-400 font-black text-[10px] rounded-xl uppercase tracking-widest text-center shadow-lg animate-shake">
                {authError}
              </div>
            )}

            <form onSubmit={handleAuth} className="space-y-6">
              {authMode === 'signup' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest ml-1">Nom</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <UserIcon className="h-4 w-4 text-slate-400" />
                      </div>
                      <input 
                        required
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        type="text" 
                        placeholder="Ex: KOMTA" 
                        className="block w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-slate-900 dark:text-white text-sm placeholder:text-slate-300 dark:placeholder:text-slate-700 focus:ring-2 focus:ring-emerald-500/50 transition-all outline-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest ml-1">Prénom</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <UserIcon className="h-4 w-4 text-slate-400" />
                      </div>
                      <input 
                        required
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        type="text" 
                        placeholder="Ex: Teddy" 
                        className="block w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-slate-900 dark:text-white text-sm placeholder:text-slate-300 dark:placeholder:text-slate-700 focus:ring-2 focus:ring-emerald-500/50 transition-all outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest ml-1">Adresse Professionnelle</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-slate-400" />
                  </div>
                  <input 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    type="email" 
                    placeholder="votre.nom@cmcc.cf" 
                    className="block w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-slate-900 dark:text-white text-sm placeholder:text-slate-300 dark:placeholder:text-slate-700 focus:ring-2 focus:ring-emerald-500/50 transition-all outline-none"
                  />
                </div>
              </div>

              {authMode === 'signup' && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest ml-1">Rôle Système</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Briefcase className="h-4 w-4 text-slate-400" />
                    </div>
                    <select
                      required
                      value={formData.role}
                      onChange={(e) => setFormData({...formData, role: e.target.value as UserRole})}
                      className="block w-full pl-12 pr-10 py-4 bg-slate-50 dark:bg-[#1a2135] border border-slate-200 dark:border-white/10 rounded-2xl text-slate-900 dark:text-white text-sm appearance-none focus:ring-2 focus:ring-emerald-500/50 transition-all outline-none cursor-pointer"
                    >
                      <option value="" disabled>Sélectionner un profil</option>
                      <option value={UserRole.DIRECTOR}>Direction / Manager</option>
                      <option value={UserRole.CREDIT_MANAGER}>Gestionnaire de Crédit</option>
                      <option value={UserRole.CASHIER}>Caissier / Caisse</option>
                      <option value={UserRole.ACCOUNTANT}>Comptable</option>
                      <option value={UserRole.SAVINGS_MANAGER}>Gestionnaire d'Épargne</option>
                      <option value={UserRole.SECRETARY}>Agent Secrétariat</option>
                      <option value={UserRole.AUDITOR}>Auditeur / Réviseur</option>
                      <option value={UserRole.SUPER_ADMIN}>Administrateur Général</option>
                      <option value={UserRole.MEMBER}>Membre / Client</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest ml-1">Clé d'accès Sécurisée</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-slate-400" />
                  </div>
                  <input 
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    className="block w-full pl-12 pr-12 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500/50 transition-all outline-none"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-emerald-500 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button 
                type="submit"
                disabled={authLoading}
                className="w-full py-5 bg-emerald-500 hover:bg-emerald-600 text-white dark:text-slate-900 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-xl hover:shadow-emerald-500/20 active:scale-95 transition-all disabled:opacity-50"
              >
                {authLoading ? "Synchronisation..." : authMode === 'login' ? "Entrer dans le système" : "Générer l'accès"}
              </button>
            </form>

            <div className="pt-4 flex flex-col items-center gap-6">
              <div className="flex items-center gap-4 w-full">
                <div className="h-px flex-1 bg-slate-100 dark:bg-white/5" />
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">Authentification Google</span>
                <div className="h-px flex-1 bg-slate-100 dark:bg-white/5" />
              </div>

              <button 
                onClick={handleGoogleLogin}
                type="button"
                className="w-full py-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white rounded-2xl font-black text-[9px] uppercase tracking-[0.2em] shadow-sm hover:bg-slate-50 dark:hover:bg-white/10 transition-all flex items-center justify-center gap-3"
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-4 h-4" alt="Google" />
                Google Workspace Business
              </button>
            </div>

            <footer className="text-center pt-10">
               <p className="text-slate-400 dark:text-slate-700 text-[8px] font-black uppercase tracking-[0.3em] leading-relaxed">
                  © 2026 COOPÉRATIVE DE MICRO-FINANCE <br/>
                  CRÉDIT CENTRAFRIQUE (CMCC.RCA)
               </p>
            </footer>
          </div>
        </div>
      </div>
    );
  }

  if (user && !userProfile && !loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#060B18] p-8 text-center overflow-hidden font-sans relative">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10B981_1px,transparent_1px)] [background-size:32px_32px]" />
        
        <div className="relative z-10 max-w-4xl w-full">
          <div className="w-16 h-16 bg-amber-400 rounded-2xl flex items-center justify-center text-slate-900 font-black text-xl mb-8 shadow-xl mx-auto italic">
            CMCC
          </div>
          
          <h2 className="text-white text-5xl font-black mb-2 tracking-tighter leading-tight">Configuration Profil</h2>
          
          {authError && (
            <div className="max-w-xs mx-auto p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 font-black text-[9px] rounded-lg uppercase tracking-widest text-center shadow-lg animate-shake mb-6">
              {authError}
            </div>
          )}

          <p className="text-slate-500 font-bold text-sm mb-12 max-w-lg mx-auto uppercase tracking-widest opacity-60">
            DÉFINIR VOTRE ACCÈS MÉTIER
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { role: UserRole.DIRECTOR, label: 'Direction', sub: 'Pilotage & Stratégie', icon: FileText },
              { role: UserRole.CREDIT_MANAGER, label: 'Crédit', sub: 'Gestion des Prêts', icon: Wallet },
              { role: UserRole.CASHIER, label: 'Caisse', sub: 'Flux de Trésorerie', icon: PiggyBank },
              { role: UserRole.ACCOUNTANT, label: 'Comptabilité', sub: 'États Financiers', icon: Calculator },
              { role: UserRole.SAVINGS_MANAGER, label: 'Épargne', sub: 'Gestion Dépôts', icon: Landmark },
              { role: UserRole.SECRETARY, label: 'Secrétariat', sub: 'Adhésion Membres', icon: Users },
              { role: UserRole.AUDITOR, label: 'Audit', sub: 'Contrôle & Risques', icon: Eye },
              { role: UserRole.SUPER_ADMIN, label: 'Super Admin', sub: 'Sécurité Système', icon: Settings },
              { role: UserRole.MEMBER, label: 'Espace Membre', sub: 'Client Final', icon: UserIcon },
            ].map((item) => (
              <button
                key={item.role}
                onClick={() => handleRoleSelection(item.role)}
                disabled={authLoading}
                className="group relative bg-[#0B1224] border border-white/5 p-8 rounded-3xl hover:bg-slate-800 transition-all text-left shadow-lg"
              >
                <div className="relative z-10">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-4 group-hover:bg-amber-400/20">
                    <item.icon className="w-5 h-5 text-amber-400" />
                  </div>
                  <p className="text-white font-black text-lg mb-1 group-hover:text-amber-400 transition-colors">
                    {item.label}
                  </p>
                  <p className="text-slate-600 text-[8px] font-black uppercase tracking-[0.2em]">
                    {item.sub}
                  </p>
                </div>
              </button>
            ))}
          </div>

          <button 
            onClick={logout}
            className="mt-12 text-slate-600 hover:text-rose-400 transition-colors font-black text-[9px] uppercase tracking-widest flex items-center gap-2 mx-auto"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sortie du système
          </button>
        </div>
      </div>
    );
  }

  return (
    <Layout 
      currentView={currentView} 
      onViewChange={setCurrentView} 
      user={user} 
      userProfile={userProfile || undefined} 
      onLogout={logout}
      isDarkMode={isDarkMode}
      onToggleDarkMode={toggleDarkMode}
    >
      {currentView === 'dashboard' && (
        <Dashboard 
          members={members} 
          loans={loans} 
          transactions={transactions} 
          isDarkMode={isDarkMode} 
          userProfile={userProfile || undefined}
          onViewChange={setCurrentView}
          onAction={(actionId) => {
            console.log("Action triggered:", actionId);
            // Handle specific actions that don't just change view
          }}
        />
      )}
      {currentView === 'members' && <MemberList members={members} userProfile={userProfile || undefined} />}
      {currentView === 'loans' && <LoanList loans={loans} members={members} userProfile={userProfile || undefined} />}
      {currentView === 'savings' && <SavingsList members={members} userProfile={userProfile || undefined} />}
      {currentView === 'cash' && <Treasury transactions={transactions} userProfile={userProfile || undefined} />}
      {currentView === 'reports' && <Accounting transactions={transactions} userProfile={userProfile || undefined} />}
      {currentView === 'settings' && <div className="p-8 border border-[var(--border)] bg-[var(--bg-card)] rounded-3xl">Configuration du système</div>}
    </Layout>
  );
}
