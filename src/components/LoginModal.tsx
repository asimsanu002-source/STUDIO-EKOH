import { useState, FormEvent } from 'react';
import { 
  X, 
  User, 
  Lock, 
  LogIn, 
  LogOut, 
  ShieldCheck, 
  Sparkles, 
  Briefcase, 
  AlertCircle, 
  MapPin, 
  ArrowRight,
  TrendingUp,
  Activity
} from 'lucide-react';
import { UserSession } from '../types';

interface LoginModalProps {
  onClose: () => void;
  currentUser: UserSession | null;
  onLogin: (session: UserSession) => void;
  onLogout: () => void;
}

export default function LoginModal({ onClose, currentUser, onLogin, onLogout }: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleLoginSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPass = password.trim();

    if (!trimmedEmail || !trimmedPass) {
      setError('Please provide both email and password.');
      return;
    }

    // Auth Logic:
    // Type 1: Admin
    if (trimmedEmail === 'admin@123' && trimmedPass === '12345') {
      const adminSession: UserSession = {
        email: 'admin@123',
        name: 'Aravind Menon',
        role: 'Admin',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80'
      };
      onLogin(adminSession);
      setSuccessMsg('Successfully logged in as Atelier Admin!');
      return;
    }

    // Type 2: Employees (Sneha Joseph or Rohan Nair)
    if ((trimmedEmail === 'sneha@123' || trimmedEmail === 'sneha@ekoh.com') && trimmedPass === '12345') {
      const employeeSession: UserSession = {
        email: trimmedEmail,
        name: 'Sneha Joseph',
        role: 'Employee',
        employeeId: 'team-2',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80'
      };
      onLogin(employeeSession);
      setSuccessMsg('Successfully logged in as Lead Planner Sneha!');
      return;
    }

    if ((trimmedEmail === 'rohan@123' || trimmedEmail === 'rohan@ekoh.com') && trimmedPass === '12345') {
      const employeeSession: UserSession = {
        email: trimmedEmail,
        name: 'Rohan Nair',
        role: 'Employee',
        employeeId: 'team-3',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80'
      };
      onLogin(employeeSession);
      setSuccessMsg('Successfully logged in as Engineer Rohan Nair!');
      return;
    }

    setError('Invalid email or password. Please review the credentials listed below.');
  };

  const handleQuickFill = (type: 'admin' | 'sneha' | 'rohan') => {
    setError('');
    setSuccessMsg('');
    if (type === 'admin') {
      setEmail('admin@123');
      setPassword('12345');
    } else if (type === 'sneha') {
      setEmail('sneha@123');
      setPassword('12345');
    } else if (type === 'rohan') {
      setEmail('rohan@123');
      setPassword('12345');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#0c0c0c] border border-white/10 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative flex flex-col">
        
        {/* Aesthetic background design grid */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:24px_24px]" />

        {/* Header */}
        <div className="px-6 py-5 border-b border-white/10 flex justify-between items-center relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-primary/10 text-primary border border-primary/20 text-[10px] font-bold uppercase tracking-widest rounded-md flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5" /> Studio Security
            </span>
          </div>
          {currentUser && (
            <button 
              onClick={onClose}
              className="p-1.5 hover:bg-white/10 text-on-surface-variant hover:text-white rounded-full transition-all"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Content Area */}
        <div className="p-6 relative z-10 flex-grow">
          {currentUser ? (
            /* Logged In View */
            <div className="flex flex-col gap-6">
              
              <div className="text-center">
                <h3 className="font-headline text-2xl font-bold text-white">
                  Atelier Session Active
                </h3>
                <p className="font-sans text-xs text-on-surface-variant mt-1">
                  You are logged into the Studio Ekoh central management registry.
                </p>
              </div>

              {/* User Profile Card */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-5 flex items-center gap-4">
                <img 
                  src={currentUser.avatar} 
                  alt={currentUser.name} 
                  className="w-16 h-16 rounded-full object-cover border border-white/15"
                />
                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-headline text-lg font-bold text-white truncate">
                      {currentUser.name}
                    </h4>
                    <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded ${
                      currentUser.role === 'Admin' 
                        ? 'bg-primary/20 text-primary border border-primary/30' 
                        : 'bg-blue-950/40 text-blue-400 border border-blue-800/30'
                    }`}>
                      {currentUser.role}
                    </span>
                  </div>
                  <p className="font-mono text-xs text-on-surface-variant truncate">
                    {currentUser.email}
                  </p>
                  <p className="font-sans text-[11px] text-primary font-medium mt-1">
                    {currentUser.role === 'Admin' ? 'Principal Architect & Overseer' : 'Project Specialist'}
                  </p>
                </div>
              </div>

              {/* Security Privileges details */}
              <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 flex gap-3">
                <Activity className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div className="text-xs font-sans text-on-surface-variant leading-relaxed">
                  <span className="text-white font-bold block mb-1">Authorization Scope:</span>
                  {currentUser.role === 'Admin' ? (
                    <span>
                      Full Administrative override is enabled. You can initiate construction sites, assign workload targets, update diagnostics, and review full employee KPIs.
                    </span>
                  ) : (
                    <span>
                      Specialist access is active. You can log daily construction field reports and mark your assigned tasks as complete to update real-time dashboard statistics.
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => {
                  onLogout();
                  setError('');
                  setSuccessMsg('');
                }}
                className="w-full mt-2 py-3 bg-red-950/40 hover:bg-red-950/60 border border-red-900/30 text-red-400 font-headline text-xs font-bold uppercase tracking-widest rounded-lg shadow-md transition-all flex items-center justify-center gap-2"
              >
                <LogOut className="h-4 w-4" /> Terminate Session
              </button>

            </div>
          ) : (
            /* Login Form View */
            <div className="flex flex-col gap-6">
              
              <div className="text-center">
                <h3 className="font-headline text-2xl font-bold text-white">
                  Studio Portal Login
                </h3>
                <p className="font-sans text-xs text-on-surface-variant mt-1">
                  Authenticate to access construction oversight and task registries.
                </p>
              </div>

              {error && (
                <div className="p-3 bg-red-950/50 border border-red-800 text-red-400 rounded-lg flex items-start gap-2.5 text-xs font-sans leading-relaxed">
                  <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {successMsg && (
                <div className="p-3 bg-emerald-950/50 border border-emerald-800 text-emerald-400 rounded-lg flex items-start gap-2.5 text-xs font-sans leading-relaxed">
                  <ShieldCheck className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                  <span>{successMsg}</span>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block font-headline text-xs font-bold uppercase tracking-wider text-primary mb-1.5 flex items-center gap-1">
                    <User className="h-3.5 w-3.5" /> User Identity / Email
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. admin@123 or employee@ekoh.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 focus:border-primary rounded-lg px-4 py-2.5 font-sans text-sm focus:outline-none focus:ring-1 focus:ring-primary text-white shadow-sm placeholder-white/20"
                  />
                </div>

                <div>
                  <label className="block font-headline text-xs font-bold uppercase tracking-wider text-primary mb-1.5 flex items-center gap-1">
                    <Lock className="h-3.5 w-3.5" /> Security Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="•••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 focus:border-primary rounded-lg px-4 py-2.5 font-sans text-sm focus:outline-none focus:ring-1 focus:ring-primary text-white shadow-sm placeholder-white/20"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-3 bg-primary hover:bg-white text-black font-headline text-xs font-bold uppercase tracking-widest rounded-lg shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-[0.98]"
                >
                  Establish Session <LogIn className="h-4 w-4" />
                </button>
              </form>

              {/* DEMO CREDENTIALS SHORTCUTS */}
              <div className="border-t border-white/10 pt-5 flex flex-col gap-3">
                <span className="font-headline text-[10px] font-bold uppercase tracking-widest text-primary block">
                  Click to Autofill Certified Accounts
                </span>
                
                <div className="flex flex-col gap-2">
                  
                  {/* Admin credentials fill button */}
                  <button
                    onClick={() => handleQuickFill('admin')}
                    className="w-full text-left p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all flex justify-between items-center group"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-headline text-xs font-bold text-white group-hover:text-primary">
                          Type 1: Studio Admin
                        </span>
                        <span className="px-1.5 py-0.2 bg-primary/10 text-primary text-[8px] font-bold uppercase rounded">
                          Owner
                        </span>
                      </div>
                      <p className="font-mono text-[10px] text-on-surface-variant mt-0.5">
                        User: <span className="text-white">admin@123</span> • Pass: <span className="text-white">12345</span>
                      </p>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>

                  {/* Employees credentials fill buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleQuickFill('sneha')}
                      className="text-left p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all flex justify-between items-center group"
                    >
                      <div>
                        <span className="font-headline text-[11px] font-bold text-white block group-hover:text-primary truncate">
                          Type 2: Sneha (Planner)
                        </span>
                        <span className="font-mono text-[9px] text-on-surface-variant block mt-0.5">
                          sneha@123
                        </span>
                      </div>
                    </button>

                    <button
                      onClick={() => handleQuickFill('rohan')}
                      className="text-left p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all flex justify-between items-center group"
                    >
                      <div>
                        <span className="font-headline text-[11px] font-bold text-white block group-hover:text-primary truncate">
                          Type 2: Rohan (Engineer)
                        </span>
                        <span className="font-mono text-[9px] text-on-surface-variant block mt-0.5">
                          rohan@123
                        </span>
                      </div>
                    </button>
                  </div>

                </div>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}
