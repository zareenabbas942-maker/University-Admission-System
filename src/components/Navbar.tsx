import React, { useState } from 'react';
import {
  GraduationCap,
  Home,
  Building2,
  Award,
  BellRing,
  Calculator,
  UserCheck,
  LogOut,
  User as UserIcon,
  Shield,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openAuthModal: (role?: 'student' | 'admin', mode?: 'login' | 'signup') => void;
  openCalculator: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  openAuthModal,
  openCalculator
}) => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'departments', label: 'Departments', icon: Building2 },
    { id: 'merit-lists', label: 'Merit Lists', icon: Award },
    { id: 'announcements', label: 'Announcements', icon: BellRing }
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800 text-slate-100 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-emerald-500 p-0.5 shadow-lg group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <GraduationCap className="w-7 h-7 text-indigo-400 group-hover:rotate-6 transition-transform" />
              </div>
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                APEX UNIVERSITY
              </span>
              <span className="block text-xs font-semibold tracking-wider text-emerald-400 uppercase">
                Admission Portal 2026
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-800/60 p-1.5 rounded-full border border-slate-700/50">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}

            {/* Calculate Aggregate Action Pill */}
            <button
              id="calc-aggregate-btn"
              onClick={openCalculator}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 transition-all ml-1"
            >
              <Calculator className="w-4 h-4 text-emerald-400" />
              Aggregate Calculator
            </button>
          </nav>

          {/* User Auth Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  id="user-profile-menu-btn"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 hover:border-slate-600 transition-all text-left"
                >
                  <img
                    src={user.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100'}
                    alt={user.name}
                    className="w-9 h-9 rounded-lg object-cover ring-2 ring-indigo-500/50"
                  />
                  <div>
                    <span className="block text-sm font-semibold text-white leading-tight">
                      {user.name}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400">
                      {user.role === 'admin' ? (
                        <span className="text-amber-400 font-bold flex items-center gap-1">
                          <Shield className="w-3 h-3" /> Admin
                        </span>
                      ) : (
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <UserCheck className="w-3 h-3" /> Student
                        </span>
                      )}
                    </span>
                  </div>
                </button>

                {/* Profile Dropdown */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl py-2 z-50">
                    <div className="px-4 py-2 border-b border-slate-700/60">
                      <p className="text-xs text-slate-400">Signed in as</p>
                      <p className="text-sm font-bold text-white truncate">{user.email}</p>
                    </div>

                    {user.role === 'admin' ? (
                      <button
                        id="portal-link-admin"
                        onClick={() => {
                          setActiveTab('admin-portal');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm font-medium text-amber-300 hover:bg-slate-700 flex items-center gap-2"
                      >
                        <Shield className="w-4 h-4" /> Admin Dashboard
                      </button>
                    ) : (
                      <button
                        id="portal-link-student"
                        onClick={() => {
                          setActiveTab('student-portal');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm font-medium text-emerald-300 hover:bg-slate-700 flex items-center gap-2"
                      >
                        <UserIcon className="w-4 h-4" /> Student Portal
                      </button>
                    )}

                    <button
                      id="logout-btn"
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm font-medium text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 border-t border-slate-700/60 mt-1"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  id="student-login-btn"
                  onClick={() => openAuthModal('student', 'login')}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-200 hover:text-white hover:bg-slate-800 border border-slate-700 transition-all"
                >
                  Student Portal
                </button>
                <button
                  id="admin-login-btn"
                  onClick={() => openAuthModal('admin', 'login')}
                  className="px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white shadow-md shadow-amber-600/20 transition-all flex items-center gap-1.5"
                >
                  <Shield className="w-4 h-4" /> Admin Portal
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              id="mobile-calc-btn"
              onClick={openCalculator}
              className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
              title="Calculator"
            >
              <Calculator className="w-5 h-5" />
            </button>

            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-6 space-y-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium ${
                  activeTab === item.id ? 'bg-indigo-600 text-white' : 'text-slate-300 bg-slate-800/50'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            );
          })}

          <div className="pt-2 border-t border-slate-800">
            {user ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-3 bg-slate-800 rounded-xl">
                  <img src={user.profileImage} alt="" className="w-10 h-10 rounded-lg object-cover" />
                  <div>
                    <p className="font-bold text-white text-sm">{user.name}</p>
                    <p className="text-xs text-slate-400">{user.email}</p>
                  </div>
                </div>

                {user.role === 'admin' ? (
                  <button
                    onClick={() => {
                      setActiveTab('admin-portal');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-center py-2.5 rounded-xl bg-amber-600 font-bold text-white text-sm"
                  >
                    Go to Admin Dashboard
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setActiveTab('student-portal');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-center py-2.5 rounded-xl bg-emerald-600 font-bold text-white text-sm"
                  >
                    Go to Student Portal
                  </button>
                )}

                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center py-2 rounded-xl bg-rose-500/10 text-rose-400 font-medium text-sm"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    openAuthModal('student', 'login');
                    setMobileMenuOpen(false);
                  }}
                  className="py-2.5 bg-indigo-600 text-white rounded-xl font-semibold text-sm"
                >
                  Student Login
                </button>
                <button
                  onClick={() => {
                    openAuthModal('admin', 'login');
                    setMobileMenuOpen(false);
                  }}
                  className="py-2.5 bg-amber-600 text-white rounded-xl font-semibold text-sm"
                >
                  Admin Portal
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
