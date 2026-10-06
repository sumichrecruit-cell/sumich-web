import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { X, Lock, Mail, User, Shield, AlertCircle, CheckCircle2, KeyRound } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    authModalOpen,
    setAuthModalOpen,
    authInitialMode,
    authInitialRole,
    login,
    register,
    users,
    switchUser
  } = useApp();

  const [mode, setMode] = useState<'signin' | 'register' | 'forgot'>('signin');
  const [role, setRole] = useState<UserRole>('client');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [serviceNumber, setServiceNumber] = useState('');
  const [location, setLocation] = useState('');

  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (authModalOpen) {
      setMode(authInitialMode);
      setRole(authInitialRole || 'client');
      setError('');
      setSuccessMsg('');
      setEmail('');
      setPassword('');
      setName('');
      setPhone('');
      setCompany('');
      setIdNumber('');
      setServiceNumber('');
      setLocation('');
    }
  }, [authModalOpen, authInitialMode, authInitialRole]);

  if (!authModalOpen) return null;

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email) {
      setError('Please provide your email address.');
      return;
    }
    const res = login(email, password);
    if (!res.success) {
      setError(res.message || 'Invalid sign-in credentials.');
    } else {
      setAuthModalOpen(false);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name || !email || !phone) {
      setError('Please provide your Full Name, Email, and Phone Number.');
      return;
    }

    const res = register({
      name,
      email,
      phone,
      role,
      company: role === 'client' ? company : undefined,
      idNumber: role !== 'client' ? idNumber : undefined,
      serviceNumber: role === 'guard' ? (serviceNumber || `SUM-GD-${Math.floor(1000 + Math.random() * 9000)}`) : undefined,
      deploymentSite: role === 'guard' ? 'Vision Plaza Operations' : undefined,
      location: location || 'Nairobi, Kenya'
    });

    if (!res.success) {
      setError(res.message || 'Registration failed. Try again.');
    } else {
      setAuthModalOpen(false);
    }
  };

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please input your registered email address.');
      return;
    }
    const exists = users.some(u => u.email.trim().toLowerCase() === email.trim().toLowerCase());
    if (exists) {
      setSuccessMsg(`A secure password-reset link has been dispatched to ${email}. Check your inbox.`);
      setError('');
    } else {
      setError('No account found under this email address.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="bg-slate-900 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Shield className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-lg font-bold">
                {mode === 'signin' && 'Sign In to Portal'}
                {mode === 'register' && 'Create Your Account'}
                {mode === 'forgot' && 'Reset Portal Password'}
              </h3>
              <p className="text-xs text-slate-400">Sumich Solutions Limited Secure Access</p>
            </div>
          </div>
          <button
            onClick={() => setAuthModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher for Sign In vs Register */}
        {mode !== 'forgot' && (
          <div className="flex border-b border-slate-200 bg-slate-50 p-1">
            <button
              onClick={() => {
                setMode('signin');
                setError('');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
                mode === 'signin' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setMode('register');
                setError('');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
                mode === 'register' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              New Registration
            </button>
          </div>
        )}

        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* SIGN IN FORM */}
          {mode === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Registered Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="e.g. james.mwangi@kenyaenterprises.co.ke"
                    className="w-full pl-9 pr-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot');
                      setError('');
                    }}
                    className="text-xs text-amber-700 hover:text-amber-800 font-semibold"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter account password"
                    className="w-full pl-9 pr-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-sm shadow-sm transition-all"
              >
                SIGN IN TO PORTAL
              </button>

              {/* Instant One-Click Demo Personas */}
              <div className="pt-4 border-t border-slate-200">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 text-center">
                  Quick Demo Access (Select Persona):
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      switchUser('usr-client-01');
                      setAuthModalOpen(false);
                    }}
                    className="p-2 border border-slate-200 rounded-lg hover:border-amber-500 hover:bg-amber-50/40 text-left transition-all"
                  >
                    <div className="font-semibold text-slate-900">Client / Visitor</div>
                    <div className="text-[10px] text-slate-500">James Mwangi</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      switchUser('usr-seeker-01');
                      setAuthModalOpen(false);
                    }}
                    className="p-2 border border-slate-200 rounded-lg hover:border-amber-500 hover:bg-amber-50/40 text-left transition-all"
                  >
                    <div className="font-semibold text-slate-900">Job Seeker</div>
                    <div className="text-[10px] text-slate-500">Faith Wanjiku</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      switchUser('usr-guard-01');
                      setAuthModalOpen(false);
                    }}
                    className="p-2 border border-slate-200 rounded-lg hover:border-amber-500 hover:bg-amber-50/40 text-left transition-all"
                  >
                    <div className="font-semibold text-slate-900">Staff / Guard</div>
                    <div className="text-[10px] text-slate-500">Cpl. Peter Otieno</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      switchUser('usr-admin-01');
                      setAuthModalOpen(false);
                    }}
                    className="p-2 border border-slate-900 bg-slate-950 text-white rounded-lg hover:bg-slate-900 text-left transition-all"
                  >
                    <div className="font-semibold text-amber-400">Super Admin</div>
                    <div className="text-[10px] text-slate-400">Kennedy Omondi</div>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* REGISTER FORM */}
          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Account Type <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('client')}
                    className={`py-2 px-3 text-xs font-bold rounded-lg border text-center transition-colors ${
                      role === 'client'
                        ? 'border-amber-500 bg-amber-500/10 text-slate-950 font-bold'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    Visitor / Client
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('jobseeker')}
                    className={`py-2 px-3 text-xs font-bold rounded-lg border text-center transition-colors ${
                      role === 'jobseeker'
                        ? 'border-amber-500 bg-amber-500/10 text-slate-950 font-bold'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    Job Seeker
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('guard')}
                    className={`py-2 px-3 text-xs font-bold rounded-lg border text-center transition-colors ${
                      role === 'guard'
                        ? 'border-amber-500 bg-amber-500/10 text-slate-950 font-bold'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    Staff / Guard
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="e.g. Brian Ochieng"
                      className="w-full pl-9 pr-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="e.g. brian@example.com"
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="e.g. 0712 345 678"
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                {role === 'client' && (
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Company / Organization Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={company}
                      onChange={e => setCompany(e.target.value)}
                      placeholder="e.g. Nairobi Logistics Hub Ltd"
                      className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                )}

                {role !== 'client' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      National ID / Passport Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={idNumber}
                      onChange={e => setIdNumber(e.target.value)}
                      placeholder="e.g. 28394812"
                      className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                )}

                {role === 'guard' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Guard Service Number (If Assigned)
                    </label>
                    <input
                      type="text"
                      value={serviceNumber}
                      onChange={e => setServiceNumber(e.target.value)}
                      placeholder="e.g. SUM-GD-1099"
                      className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                )}

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Location / County
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    placeholder="e.g. Mombasa Road / Nairobi"
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-sm shadow-sm transition-all"
              >
                CREATE {role.toUpperCase()} ACCOUNT
              </button>
            </form>
          )}

          {/* FORGOT PASSWORD FORM */}
          {mode === 'forgot' && (
            <form onSubmit={handleForgot} className="space-y-4">
              <div className="text-xs text-slate-600 leading-relaxed">
                Enter your registered email address below. We will generate and send a secure verification token to reset your password.
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Registered Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="e.g. user@sumichsecurity.com"
                    className="w-full pl-9 pr-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg text-sm"
              >
                Send Password Reset Link
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setMode('signin');
                    setError('');
                    setSuccessMsg('');
                  }}
                  className="text-xs font-semibold text-amber-700 hover:text-amber-800"
                >
                  Back to Sign In
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
