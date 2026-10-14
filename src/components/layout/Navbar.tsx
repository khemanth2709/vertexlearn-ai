import React, { useState, useRef, useEffect } from 'react';
import { useLMS } from '../../context/LMSContext';
import { 
  Bell, 
  Search, 
  ShieldCheck, 
  LogOut, 
  Sparkles, 
  CheckCheck, 
  FileText, 
  Award, 
  CalendarCheck, 
  ChevronDown,
  User as UserIcon,
  Menu,
  GraduationCap,
  BookOpen,
  ArrowRight,
  Layers,
  Keyboard
} from 'lucide-react';
import { VertexLearnLogo } from '../common/VertexLearnLogo';

interface NavbarProps {
  onToggleSidebar: () => void;
  onOpenShortcuts?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, onOpenShortcuts }) => {
  const { 
    user, 
    logout, 
    notifications, 
    unreadNotifsCount, 
    markNotifAsRead, 
    markAllNotifsAsRead, 
    currentView,
    setCurrentView
  } = useLMS();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [mobilePublicNavOpen, setMobilePublicNavOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'grade': return <Award className="w-4 h-4 text-emerald-400" />;
      case 'assignment': return <FileText className="w-4 h-4 text-indigo-400" />;
      case 'attendance': return <CalendarCheck className="w-4 h-4 text-sky-400" />;
      case 'compliance': return <ShieldCheck className="w-4 h-4 text-amber-400" />;
      default: return <Bell className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <header className="h-16 bg-white border-b border-[#E5E7EB] px-4 lg:px-6 flex items-center justify-between sticky top-0 z-30 transition-colors text-[#1F2937] shadow-xs">
      
      {/* Left: Mobile Toggle & Brand */}
      <div className="flex items-center gap-3">
        {user ? (
          <button 
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-lg text-[#4B5563] hover:text-[#1F2937] hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        ) : (
          <button 
            onClick={() => setMobilePublicNavOpen(!mobilePublicNavOpen)}
            className="md:hidden p-2 rounded-lg text-[#4B5563] hover:text-[#1F2937] hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div 
          onClick={() => setCurrentView(user ? 'dashboard' : 'landing')}
          className="flex items-center cursor-pointer select-none"
        >
          <VertexLearnLogo size="md" showSubtitle={true} />
        </div>
      </div>

      {/* Center Nav Links for Unauthenticated Visitors */}
      {!user && (
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-[#4B5563]">
          <button
            onClick={() => setCurrentView('landing')}
            className={`transition-colors hover:text-[#DC2626] cursor-pointer ${currentView === 'landing' ? 'text-[#DC2626] font-bold' : ''}`}
          >
            Home
          </button>
          <button
            onClick={() => setCurrentView('courses_overview')}
            className={`transition-colors hover:text-[#DC2626] cursor-pointer ${currentView === 'courses_overview' ? 'text-[#DC2626] font-bold' : ''}`}
          >
            Courses Catalog
          </button>
          <button
            onClick={() => setCurrentView('features')}
            className={`transition-colors hover:text-[#DC2626] cursor-pointer ${currentView === 'features' ? 'text-[#DC2626] font-bold' : ''}`}
          >
            Core Engines
          </button>
          <button
            onClick={() => setCurrentView('verify_certificate')}
            className={`transition-colors hover:text-[#DC2626] cursor-pointer flex items-center gap-1 ${currentView === 'verify_certificate' ? 'text-[#DC2626] font-bold' : ''}`}
          >
            <span>📜</span> Verify Certificate
          </button>
          <button
            onClick={() => setCurrentView('about')}
            className={`transition-colors hover:text-[#DC2626] cursor-pointer ${currentView === 'about' ? 'text-[#DC2626] font-bold' : ''}`}
          >
            About
          </button>
          <button
            onClick={() => setCurrentView('contact')}
            className={`transition-colors hover:text-[#DC2626] cursor-pointer ${currentView === 'contact' ? 'text-[#DC2626] font-bold' : ''}`}
          >
            Contact
          </button>
        </nav>
      )}

      {/* Mobile Nav Dropdown for Unauthenticated Visitors */}
      {!user && mobilePublicNavOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b border-[#E5E7EB] p-4 shadow-xl z-50 space-y-2 animate-in fade-in slide-in-from-top-2 duration-150">
          <button
            onClick={() => { setCurrentView('landing'); setMobilePublicNavOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold ${currentView === 'landing' ? 'bg-red-50 text-[#DC2626]' : 'text-[#4B5563] hover:text-[#1F2937]'}`}
          >
            Home
          </button>
          <button
            onClick={() => { setCurrentView('courses_overview'); setMobilePublicNavOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold ${currentView === 'courses_overview' ? 'bg-red-50 text-[#DC2626]' : 'text-[#4B5563] hover:text-[#1F2937]'}`}
          >
            Courses Catalog
          </button>
          <button
            onClick={() => { setCurrentView('features'); setMobilePublicNavOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold ${currentView === 'features' ? 'bg-red-50 text-[#DC2626]' : 'text-[#4B5563] hover:text-[#1F2937]'}`}
          >
            Core Engines
          </button>
          <button
            onClick={() => { setCurrentView('verify_certificate'); setMobilePublicNavOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold ${currentView === 'verify_certificate' ? 'bg-red-50 text-[#DC2626]' : 'text-[#4B5563] hover:text-[#1F2937]'}`}
          >
            📜 Verify Certificate
          </button>
          <button
            onClick={() => { setCurrentView('about'); setMobilePublicNavOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold ${currentView === 'about' ? 'bg-red-50 text-[#DC2626]' : 'text-[#4B5563] hover:text-[#1F2937]'}`}
          >
            About
          </button>
          <button
            onClick={() => { setCurrentView('contact'); setMobilePublicNavOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold ${currentView === 'contact' ? 'bg-red-50 text-[#DC2626]' : 'text-[#4B5563] hover:text-[#1F2937]'}`}
          >
            Contact
          </button>
        </div>
      )}

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">

        {/* Next-Gen Expansion Hub Launcher */}
        {user && (
          <button
            onClick={() => setCurrentView('expansion_hub')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all text-xs cursor-pointer ${
              currentView === 'expansion_hub'
                ? 'bg-[#DC2626] text-white border-[#DC2626] shadow-sm'
                : 'bg-white hover:bg-red-50 text-[#DC2626] border-red-200'
            }`}
            title="Next-Generation Expansion Capabilities"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#DC2626]" />
            <span className="font-bold">Next-Gen Hub</span>
            <span className="hidden md:inline text-[9px] px-1.5 py-0.2 rounded bg-red-100 text-[#DC2626] uppercase font-mono">v2</span>
          </button>
        )}

        {/* Global Keyboard Shortcuts Help Button */}
        {onOpenShortcuts && (
          <button
            onClick={onOpenShortcuts}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[#4B5563] hover:text-[#DC2626] hover:bg-gray-50 border border-[#E5E7EB] transition-all text-xs group cursor-pointer"
            title="Keyboard Shortcuts (Ctrl + / or ?)"
            aria-label="View Keyboard Shortcuts"
          >
            <Keyboard className="w-4 h-4 text-[#4B5563] group-hover:text-[#DC2626] transition-colors" />
            <span className="hidden lg:inline text-[11px] font-medium text-[#4B5563] group-hover:text-[#1F2937]">Shortcuts</span>
            <kbd className="hidden lg:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded bg-gray-100 text-[#4B5563] border border-[#E5E7EB]">
              Ctrl+/
            </kbd>
          </button>
        )}

        {/* Real-time Notifications Bell (For Authenticated Users) */}
        {user && (
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative p-2 rounded-xl text-[#4B5563] hover:text-[#1F2937] hover:bg-gray-100 border border-[#E5E7EB] transition-colors cursor-pointer"
              aria-label="View notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#DC2626] text-white rounded-full text-[10px] font-black flex items-center justify-center shadow-xs">
                  {unreadNotifsCount}
                </span>
              )}
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-[#E5E7EB] rounded-2xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="p-3.5 border-b border-[#E5E7EB] bg-[#F9FAFB] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-xs text-[#1F2937] uppercase tracking-wider">
                      Activity Notifications
                    </h3>
                    {unreadNotifsCount > 0 && (
                      <span className="text-[10px] font-semibold bg-red-100 text-[#DC2626] px-1.5 py-0.5 rounded-full">
                        {unreadNotifsCount} new
                      </span>
                    )}
                  </div>
                  {unreadNotifsCount > 0 && (
                    <button
                      onClick={markAllNotifsAsRead}
                      className="text-[11px] text-[#4B5563] hover:text-[#DC2626] flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-[#E5E7EB]">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-[#4B5563]">
                      No notifications right now.
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          markNotifAsRead(n.id);
                          if (n.linkAction) {
                            setCurrentView(n.linkAction as any);
                            setIsNotifOpen(false);
                          }
                        }}
                        className={`p-3.5 hover:bg-gray-50 cursor-pointer transition-colors flex gap-3 ${
                          !n.read ? 'bg-red-50/50' : ''
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {getNotifIcon(n.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <h4 className={`text-xs font-semibold ${!n.read ? 'text-[#1F2937]' : 'text-[#4B5563]'}`}>
                              {n.title}
                            </h4>
                            <span className="text-[10px] text-[#4B5563] whitespace-nowrap">
                              {n.timestamp}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#4B5563] mt-0.5 leading-relaxed">
                            {n.message}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Authenticated User Pill / Sign In Buttons */}
        {user ? (
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 p-1.5 pl-2 rounded-xl bg-white hover:bg-gray-50 border border-[#E5E7EB] transition-all text-left cursor-pointer"
            >
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="w-7 h-7 rounded-lg object-cover border border-[#E5E7EB]"
              />
              <div className="hidden sm:block text-left pr-1">
                <div className="text-xs font-semibold text-[#1F2937] leading-none truncate max-w-[110px]">
                  {user.name}
                </div>
                <div className="text-[10px] text-[#DC2626] font-bold uppercase mt-0.5">
                  {user.role}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[#4B5563]" />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-[#E5E7EB] rounded-2xl shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="p-3 border-b border-[#E5E7EB]">
                  <div className="font-semibold text-sm text-[#1F2937]">{user.name}</div>
                  <div className="text-xs text-[#4B5563] truncate">{user.email}</div>
                  <div className="text-[11px] text-[#4B5563] mt-1 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626]"></span>
                    {user.department}
                  </div>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setCurrentView('dashboard');
                      setIsProfileOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-[#4B5563] hover:text-[#1F2937] hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <UserIcon className="w-4 h-4 text-[#4B5563]" />
                    My Workspace Dashboard
                  </button>
                  <button
                    onClick={() => {
                      setCurrentView('compliance');
                      setIsProfileOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-[#4B5563] hover:text-[#1F2937] hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <Award className="w-4 h-4 text-[#DC2626]" />
                    Official Certificates
                  </button>
                </div>

                <div className="pt-1 border-t border-[#E5E7EB]">
                  <button
                    onClick={() => {
                      logout();
                      setIsProfileOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-[#DC2626] hover:bg-red-50 transition-colors font-semibold cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentView('login')}
              className="text-xs font-semibold text-[#4B5563] hover:text-[#DC2626] px-3 py-2 rounded-xl transition-colors cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={() => setCurrentView('register')}
              className="bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-md shadow-red-600/20 flex items-center gap-1.5 cursor-pointer"
            >
              <GraduationCap className="w-4 h-4" /> Register
            </button>
          </div>
        )}

      </div>
    </header>
  );
};
