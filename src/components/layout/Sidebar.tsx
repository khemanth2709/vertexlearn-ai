import React from 'react';
import { useLMS, LMSView } from '../../context/LMSContext';
import { 
  LayoutDashboard, 
  BookOpen, 
  FileText, 
  CalendarCheck, 
  MessageSquare, 
  ShieldCheck, 
  BarChart3, 
  PlusCircle, 
  X, 
  Users, 
  Award, 
  ScrollText, 
  UserCheck, 
  PlayCircle, 
  Terminal, 
  LogOut,
  Keyboard,
  Sparkles,
  Video,
  ShieldAlert,
  Smartphone,
  CreditCard,
  Mic,
  TrendingDown
} from 'lucide-react';
import { VertexLearnLogo } from '../common/VertexLearnLogo';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenShortcuts?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onOpenShortcuts }) => {
  const { 
    currentView, 
    setCurrentView, 
    user, 
    assignments, 
    certificates,
    logout
  } = useLMS();

  if (!user) return null;

  const role = user.role;

  const navItems: Array<{
    id: LMSView;
    label: string;
    icon: React.ReactNode;
    shortcutHint?: string;
    badge?: string | number;
    badgeColor?: string;
    allowedRoles: Array<'STUDENT' | 'INSTRUCTOR' | 'ADMIN'>;
  }> = [
    {
      id: 'dashboard',
      label: 'Learning Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
      shortcutHint: 'Alt+D',
      allowedRoles: ['STUDENT', 'INSTRUCTOR', 'ADMIN']
    },
    {
      id: 'courses',
      label: 'Courses & Catalog',
      icon: <BookOpen className="w-4 h-4" />,
      shortcutHint: 'Alt+C',
      allowedRoles: ['STUDENT', 'INSTRUCTOR', 'ADMIN']
    },
    {
      id: 'course_player',
      label: 'Interactive Player',
      icon: <PlayCircle className="w-4 h-4" />,
      allowedRoles: ['STUDENT', 'INSTRUCTOR', 'ADMIN']
    },
    {
      id: 'course_builder',
      label: 'Course Authoring Studio',
      icon: <PlusCircle className="w-4 h-4" />,
      badge: 'Authoring',
      badgeColor: 'bg-red-50 text-[#DC2626] border border-red-200',
      allowedRoles: ['INSTRUCTOR', 'ADMIN']
    },
    {
      id: 'assignments',
      label: role === 'INSTRUCTOR' ? 'Submissions & Grading' : 'Assignments & Code Runner',
      icon: <FileText className="w-4 h-4" />,
      shortcutHint: 'Alt+A',
      badge: assignments.length,
      badgeColor: 'bg-gray-100 text-[#4B5563] border border-[#E5E7EB]',
      allowedRoles: ['STUDENT', 'INSTRUCTOR', 'ADMIN']
    },
    {
      id: 'attendance',
      label: role === 'INSTRUCTOR' ? 'Classroom Attendance' : 'Live Attendance Check-In',
      icon: <CalendarCheck className="w-4 h-4" />,
      shortcutHint: 'Alt+T',
      badge: 'Active',
      badgeColor: 'bg-red-50 text-[#DC2626] border border-red-200',
      allowedRoles: ['STUDENT', 'INSTRUCTOR', 'ADMIN']
    },
    {
      id: 'compliance',
      label: 'Certificates & Credentials',
      icon: <Award className="w-4 h-4" />,
      badge: certificates.length,
      badgeColor: 'bg-gray-100 text-[#4B5563] border border-[#E5E7EB]',
      allowedRoles: ['STUDENT', 'INSTRUCTOR', 'ADMIN']
    },
    {
      id: 'messaging',
      label: 'Cohort Discussions',
      icon: <MessageSquare className="w-4 h-4" />,
      shortcutHint: 'Alt+M',
      allowedRoles: ['STUDENT', 'INSTRUCTOR', 'ADMIN']
    },
    {
      id: 'analytics',
      label: 'Performance Analytics',
      icon: <BarChart3 className="w-4 h-4" />,
      shortcutHint: 'Alt+P',
      allowedRoles: ['INSTRUCTOR', 'ADMIN']
    },
    {
      id: 'admin_students',
      label: 'Student Directory & Cohorts',
      icon: <Users className="w-4 h-4" />,
      badge: '1,842',
      badgeColor: 'bg-gray-100 text-[#4B5563] border border-[#E5E7EB]',
      allowedRoles: ['ADMIN']
    },
    {
      id: 'admin_instructors',
      label: 'Faculty Management',
      icon: <UserCheck className="w-4 h-4" />,
      allowedRoles: ['ADMIN']
    },
    {
      id: 'admin_audit',
      label: 'System Audit Logs',
      icon: <ScrollText className="w-4 h-4" />,
      allowedRoles: ['ADMIN']
    },
    {
      id: 'expansion_hub',
      label: 'Next-Gen Expansion Suite',
      icon: <Sparkles className="w-4 h-4" />,
      badge: 'v2 Suite',
      badgeColor: 'bg-red-50 text-[#DC2626] border border-red-200',
      allowedRoles: ['STUDENT', 'INSTRUCTOR', 'ADMIN']
    },
    {
      id: 'study_rooms',
      label: 'Virtual Study Rooms & WebRTC',
      icon: <Video className="w-4 h-4" />,
      badge: 'Live',
      badgeColor: 'bg-red-50 text-[#DC2626] border border-red-200',
      allowedRoles: ['STUDENT', 'INSTRUCTOR', 'ADMIN']
    },
    {
      id: 'plagiarism_detector',
      label: 'AI Plagiarism & AST Engine',
      icon: <ShieldAlert className="w-4 h-4" />,
      allowedRoles: ['INSTRUCTOR', 'ADMIN']
    },
    {
      id: 'mobile_pwa',
      label: 'Mobile App & PWA Vault',
      icon: <Smartphone className="w-4 h-4" />,
      allowedRoles: ['STUDENT', 'INSTRUCTOR', 'ADMIN']
    },
    {
      id: 'monetization',
      label: 'Subscriptions & Payouts',
      icon: <CreditCard className="w-4 h-4" />,
      allowedRoles: ['STUDENT', 'INSTRUCTOR', 'ADMIN']
    },
    {
      id: 'voice_tutor',
      label: 'Voice AI Technical Tutor',
      icon: <Mic className="w-4 h-4" />,
      badge: 'Voice',
      badgeColor: 'bg-red-50 text-[#DC2626] border border-red-200',
      allowedRoles: ['STUDENT', 'INSTRUCTOR', 'ADMIN']
    },
    {
      id: 'predictive_analytics',
      label: 'Predictive At-Risk Analytics',
      icon: <TrendingDown className="w-4 h-4" />,
      badge: 'ML Alert',
      badgeColor: 'bg-red-50 text-[#DC2626] border border-red-200',
      allowedRoles: ['INSTRUCTOR', 'ADMIN']
    }
  ];

  return (
    <>
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      <aside className={`
        fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#F9FAFB] border-r border-[#E5E7EB] flex flex-col transition-all duration-300 ease-in-out text-[#1F2937]
        lg:static lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        
        {/* Mobile Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-[#E5E7EB] bg-white lg:hidden">
          <VertexLearnLogo size="sm" showSubtitle={true} />
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#4B5563] hover:text-[#1F2937] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Identity Card */}
        <div className="p-4 mx-3 my-3 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs">
          <div className="flex items-center gap-3">
            <img 
              src={user.avatar} 
              alt="Avatar" 
              className="w-10 h-10 rounded-xl object-cover border border-[#E5E7EB]" 
            />
            <div className="truncate flex-1">
              <div className="text-xs font-bold text-[#1F2937] truncate">{user.name}</div>
              <div className="text-[10px] text-[#DC2626] font-bold uppercase truncate flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626] shrink-0"></span>
                <span>{user.role}</span>
              </div>
              <div className="text-[10px] text-[#4B5563] truncate mt-0.5">
                {user.studentProfile?.studentRollNumber || user.instructorProfile?.facultyId || user.department}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          <div className="text-[10px] font-bold text-[#4B5563] uppercase tracking-wider px-3 mb-2">
            Platform Modules
          </div>

          {navItems.map((item) => {
            if (!item.allowedRoles.includes(role)) return null;
            const isActive = currentView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentView(item.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#DC2626] text-white shadow-xs font-bold'
                    : 'text-[#4B5563] hover:text-[#1F2937] hover:bg-gray-200/60'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <span className={isActive ? 'text-white' : 'text-[#4B5563]'}>
                    {item.icon}
                  </span>
                  <span className="truncate">{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {item.shortcutHint && (
                    <kbd className={`hidden group-hover:inline-block text-[9px] font-mono px-1 py-0.5 rounded border transition-colors ${
                      isActive 
                        ? 'bg-red-700 border-red-500 text-white' 
                        : 'bg-white border-[#E5E7EB] text-[#4B5563]'
                    }`}>
                      {item.shortcutHint}
                    </kbd>
                  )}
                  {item.badge !== undefined && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold shrink-0 ${item.badgeColor || 'bg-gray-100 text-[#4B5563] border border-[#E5E7EB]'}`}>
                      {item.badge}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </nav>

        {/* Bottom User Controls */}
        <div className="p-3 mx-3 mb-3 border-t border-[#E5E7EB] space-y-1">
          {onOpenShortcuts && (
            <button
              onClick={() => {
                onOpenShortcuts();
                onClose();
              }}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-[#4B5563] hover:text-[#DC2626] hover:bg-gray-100 rounded-xl transition-colors cursor-pointer group"
              title="Keyboard Shortcuts Cheat Sheet"
            >
              <div className="flex items-center gap-2">
                <Keyboard className="w-4 h-4 text-[#4B5563] group-hover:text-[#DC2626]" />
                <span>Shortcuts</span>
              </div>
              <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white text-[#4B5563] border border-[#E5E7EB]">
                Ctrl+/
              </kbd>
            </button>
          )}

          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-[#DC2626] hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

      </aside>
    </>
  );
};
