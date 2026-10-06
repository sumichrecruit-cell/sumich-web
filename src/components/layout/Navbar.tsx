import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Shield, Phone, ChevronDown, User, LogOut, Menu, X, Bell } from 'lucide-react';
import { SumichLogo } from '../common/SumichLogo';

export const Navbar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    currentUser,
    logout,
    switchUser,
    users,
    setQuoteModalOpen,
    setCallModalOpen,
    setAuthModalOpen,
    setAuthInitialMode,
    unreadCount,
    companyInfo,
    quotationBranding
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);

  const getDashboardViewForRole = (role?: string) => {
    switch (role) {
      case 'admin': return 'admin-portal';
      case 'guard': return 'guard-dashboard';
      case 'jobseeker': return 'seeker-dashboard';
      case 'client': return 'client-dashboard';
      default: return 'client-dashboard';
    }
  };

  const getRoleBadgeLabel = (user: typeof currentUser) => {
    if (!user) return '';
    if (user.role === 'admin') {
      if (user.subRole === 'super_admin') return 'Super Admin';
      if (user.subRole === 'recruitment_officer') return 'Recruitment';
      if (user.subRole === 'operations_officer') return 'Operations';
      if (user.subRole === 'content_manager') return 'Content Mgr';
      return 'Admin';
    }
    if (user.role === 'guard') return 'Staff / Guard';
    if (user.role === 'jobseeker') return 'Job Seeker';
    return 'Client';
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top micro-bar for quick emergency line & fast demo switcher */}
      <div className="bg-slate-950 text-slate-300 text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-amber-400 font-semibold uppercase tracking-wider text-[11px]">24/7 Security Dispatch:</span>
            <button
              onClick={() => setCallModalOpen(true)}
              className="hover:text-amber-400 font-medium transition-colors flex items-center gap-1.5"
            >
              <Phone className="w-3 h-3 text-amber-400" />
              <span>{companyInfo.phones[0]}</span>
              <span className="text-slate-500">/</span>
              <span>{companyInfo.phones[1]}</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Demo Switcher helper */}
            <div className="relative">
              <button
                onClick={() => setRoleSwitcherOpen(!roleSwitcherOpen)}
                className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px] bg-slate-900 border border-slate-800 px-2 py-0.5 rounded transition-colors"
                title="Switch demo account to preview different portals"
              >
                <span>Demo Switcher</span>
                <ChevronDown className="w-3 h-3 text-amber-400" />
              </button>

              {roleSwitcherOpen && (
                <div
                  className="absolute right-0 mt-1 w-64 bg-slate-900 border border-slate-700 rounded-lg shadow-xl py-2 z-50 text-xs"
                  onMouseLeave={() => setRoleSwitcherOpen(false)}
                >
                  <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 border-b border-slate-800">
                    Switch Test Persona:
                  </div>
                  {users.map(u => (
                    <button
                      key={u.id}
                      onClick={() => {
                        switchUser(u.id);
                        setRoleSwitcherOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 hover:bg-slate-800 flex items-center justify-between transition-colors ${
                        currentUser?.id === u.id ? 'text-amber-400 font-semibold bg-slate-800/60' : 'text-slate-300'
                      }`}
                    >
                      <span className="truncate">{u.name}</span>
                      <span className="text-[10px] text-slate-400 ml-2 shrink-0 capitalize">{u.subRole || u.role}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {currentUser && (
              <span className="hidden md:inline text-slate-400 text-[11px]">
                Active: <span className="text-amber-400 font-medium">{currentUser.name}</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Zone 1: Brand Wordmark */}
          <button
            onClick={() => setCurrentView('home')}
            className="flex items-center gap-3 text-left group focus:outline-none"
          >
            <div className="w-11 h-11 rounded-lg bg-slate-950 flex items-center justify-center text-amber-400 border border-amber-500/40 shadow-sm group-hover:border-amber-400 transition-colors p-1 overflow-hidden">
              {companyInfo?.logoDataUrl || quotationBranding?.logoDataUrl ? (
                <img
                  src={companyInfo?.logoDataUrl || quotationBranding?.logoDataUrl}
                  alt={companyInfo?.name || "SUMICH Logo"}
                  className="w-full h-full object-contain"
                />
              ) : (
                <SumichLogo className="w-8 h-9" />
              )}
            </div>
            <div>
              <div className="text-lg sm:text-xl font-bold tracking-tight text-slate-950 leading-tight">
                {companyInfo.name ? (
                  <>
                    {companyInfo.name.split(' ').slice(0, 2).join(' ')}{' '}
                    <span className="text-amber-600">{companyInfo.name.split(' ').slice(2).join(' ')}</span>
                  </>
                ) : (
                  <>SUMICH <span className="text-amber-600">SOLUTIONS</span></>
                )}
              </div>
              <div className="text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase text-slate-500">
                {companyInfo.tagline || "Security & Guarding Services"}
              </div>
            </div>
          </button>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-slate-700">
            <button
              onClick={() => setCurrentView('home')}
              className={`transition-colors hover:text-amber-600 py-1 border-b-2 ${
                currentView === 'home' ? 'border-amber-500 text-slate-950' : 'border-transparent'
              }`}
            >
              HOME
            </button>
            <button
              onClick={() => setCurrentView('about')}
              className={`transition-colors hover:text-amber-600 py-1 border-b-2 ${
                currentView === 'about' ? 'border-amber-500 text-slate-950' : 'border-transparent'
              }`}
            >
              ABOUT US
            </button>
            <button
              onClick={() => setCurrentView('services')}
              className={`transition-colors hover:text-amber-600 py-1 border-b-2 ${
                currentView === 'services' ? 'border-amber-500 text-slate-950' : 'border-transparent'
              }`}
            >
              SERVICES
            </button>
            <button
              onClick={() => setCurrentView('careers')}
              className={`transition-colors hover:text-amber-600 py-1 border-b-2 ${
                currentView === 'careers' ? 'border-amber-500 text-slate-950' : 'border-transparent'
              }`}
            >
              CAREERS
            </button>
            {currentUser && (
              <button
                onClick={() => setCurrentView(getDashboardViewForRole(currentUser.role))}
                className={`transition-colors hover:text-amber-600 py-1 border-b-2 flex items-center gap-1.5 ${
                  currentView.includes('dashboard') || currentView === 'admin-portal'
                    ? 'border-amber-500 text-slate-950'
                    : 'border-transparent'
                }`}
              >
                <span>{currentUser.role === 'admin' ? 'ADMIN PORTAL' : 'MY DASHBOARD'}</span>
                {unreadCount > 0 && (
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                )}
              </button>
            )}
          </nav>

          {/* Zone 3: Primary Action Controls */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => setCallModalOpen(true)}
              className="px-3.5 py-2.5 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              <Phone className="w-3.5 h-3.5 text-amber-600" />
              <span>CALL US</span>
            </button>

            <button
              onClick={() => setQuoteModalOpen(true)}
              className="px-4 py-2.5 text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 shadow-sm hover:shadow rounded-lg transition-all transform active:scale-95 whitespace-nowrap"
            >
              REQUEST A QUOTE
            </button>

            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-slate-600" />
                  <span className="max-w-[120px] truncate">{currentUser.name.split(' ')[0]}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-800 font-bold">
                    {getRoleBadgeLabel(currentUser)}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 text-xs"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-100">
                      <div className="font-bold text-slate-900">{currentUser.name}</div>
                      <div className="text-slate-500 truncate text-[11px]">{currentUser.email}</div>
                      <div className="text-[10px] text-amber-700 font-medium mt-1">
                        Role: {getRoleBadgeLabel(currentUser)}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setCurrentView(getDashboardViewForRole(currentUser.role));
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 font-medium text-slate-700 flex items-center gap-2"
                    >
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>{currentUser.role === 'admin' ? 'Open Admin Portal' : 'Open Dashboard'}</span>
                    </button>
                    {unreadCount > 0 && (
                      <div className="px-4 py-1.5 text-[11px] text-amber-800 font-medium flex items-center gap-1.5 bg-amber-50">
                        <Bell className="w-3 h-3 text-amber-600" />
                        <span>{unreadCount} new notification(s)</span>
                      </div>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-rose-50 font-medium text-rose-600 flex items-center gap-2 border-t border-slate-100"
                    >
                      <LogOut className="w-3.5 h-3.5 text-rose-500" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => {
                  setAuthInitialMode('signin');
                  setAuthModalOpen(true);
                }}
                className="px-3.5 py-2.5 text-xs font-semibold text-slate-900 border border-slate-300 hover:border-slate-900 rounded-lg transition-colors whitespace-nowrap"
              >
                REGISTER / SIGN IN
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={() => setQuoteModalOpen(true)}
              className="px-2.5 py-1.5 text-xs font-bold text-slate-950 bg-amber-500 rounded-md"
            >
              QUOTE
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-slate-950 rounded-lg hover:bg-slate-100"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <div className="space-y-1">
            <button
              onClick={() => {
                setCurrentView('home');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-md font-semibold text-sm ${
                currentView === 'home' ? 'bg-amber-50 text-amber-900' : 'text-slate-800'
              }`}
            >
              HOME
            </button>
            <button
              onClick={() => {
                setCurrentView('about');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-md font-semibold text-sm ${
                currentView === 'about' ? 'bg-amber-50 text-amber-900' : 'text-slate-800'
              }`}
            >
              ABOUT US
            </button>
            <button
              onClick={() => {
                setCurrentView('services');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-md font-semibold text-sm ${
                currentView === 'services' ? 'bg-amber-50 text-amber-900' : 'text-slate-800'
              }`}
            >
              SERVICES
            </button>
            <button
              onClick={() => {
                setCurrentView('careers');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-md font-semibold text-sm ${
                currentView === 'careers' ? 'bg-amber-50 text-amber-900' : 'text-slate-800'
              }`}
            >
              CAREERS
            </button>
            {currentUser && (
              <button
                onClick={() => {
                  setCurrentView(getDashboardViewForRole(currentUser.role));
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-md font-semibold text-sm bg-slate-900 text-amber-400 flex items-center justify-between"
              >
                <span>{currentUser.role === 'admin' ? 'ADMIN PORTAL' : 'MY DASHBOARD'}</span>
                <span className="text-xs bg-amber-500/30 text-amber-300 px-2 py-0.5 rounded">
                  {getRoleBadgeLabel(currentUser)}
                </span>
              </button>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => {
                setCallModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 text-xs font-semibold text-slate-800 bg-slate-100 rounded-lg flex items-center justify-center gap-2"
            >
              <Phone className="w-3.5 h-3.5 text-amber-600" />
              <span>CALL US: {companyInfo.phones[0]}</span>
            </button>
            <button
              onClick={() => {
                setQuoteModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 text-xs font-bold text-slate-950 bg-amber-500 rounded-lg"
            >
              REQUEST A QUOTE
            </button>

            {currentUser ? (
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 text-xs font-semibold text-rose-600 border border-rose-200 rounded-lg text-center"
              >
                Sign Out ({currentUser.name})
              </button>
            ) : (
              <button
                onClick={() => {
                  setAuthInitialMode('signin');
                  setAuthModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 text-xs font-semibold text-slate-800 border border-slate-300 rounded-lg text-center"
              >
                REGISTER / SIGN IN
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
