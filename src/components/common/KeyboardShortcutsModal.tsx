import React from 'react';
import { 
  Keyboard, 
  X, 
  Command, 
  LayoutDashboard, 
  BookOpen, 
  MessageSquare, 
  FileText, 
  CalendarCheck, 
  BarChart3,
  Sparkles
} from 'lucide-react';
import { LMS_SHORTCUTS } from '../../hooks/useKeyboardNavigation';
import { useLMS } from '../../context/LMSContext';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose
}) => {
  const { user } = useLMS();

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white border border-[#E5E7EB] w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden text-[#1F2937] animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB] bg-[#F9FAFB]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center text-[#DC2626]">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#1F2937] tracking-wide flex items-center gap-2">
                Keyboard Shortcuts
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-red-50 border border-red-200 text-[#DC2626] font-bold">
                  Quick Nav
                </span>
              </h3>
              <p className="text-xs text-[#4B5563]">
                Speed up learning workflows with global key combinations
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#4B5563] hover:text-[#1F2937] hover:bg-gray-100 transition-colors cursor-pointer"
            title="Close (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Shortcuts Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Main Navigation */}
          <div>
            <h4 className="text-xs font-bold text-[#DC2626] uppercase tracking-wider mb-3 flex items-center gap-2">
              <Command className="w-3.5 h-3.5" />
              Primary Module Navigation
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB] hover:border-[#DC2626]/40 transition-colors">
                <div className="flex items-center gap-3 text-sm text-[#1F2937] font-medium">
                  <LayoutDashboard className="w-4 h-4 text-[#DC2626]" />
                  <span>Dashboard</span>
                </div>
                <div className="flex items-center gap-1.5 font-mono text-xs">
                  <kbd className="px-2 py-1 rounded bg-white border border-[#E5E7EB] text-[#1F2937] shadow-xs">Alt</kbd>
                  <span className="text-[#4B5563]">+</span>
                  <kbd className="px-2 py-1 rounded bg-red-50 border border-red-200 text-[#DC2626] font-bold shadow-xs">D</kbd>
                  <span className="text-[#4B5563] text-[11px] ml-2">or key</span>
                  <kbd className="px-2 py-1 rounded bg-white border border-[#E5E7EB] text-[#1F2937] shadow-xs">1</kbd>
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB] hover:border-[#DC2626]/40 transition-colors">
                <div className="flex items-center gap-3 text-sm text-[#1F2937] font-medium">
                  <BookOpen className="w-4 h-4 text-[#DC2626]" />
                  <span>Courses & Catalog</span>
                </div>
                <div className="flex items-center gap-1.5 font-mono text-xs">
                  <kbd className="px-2 py-1 rounded bg-white border border-[#E5E7EB] text-[#1F2937] shadow-xs">Alt</kbd>
                  <span className="text-[#4B5563]">+</span>
                  <kbd className="px-2 py-1 rounded bg-red-50 border border-red-200 text-[#DC2626] font-bold shadow-xs">C</kbd>
                  <span className="text-[#4B5563] text-[11px] ml-2">or key</span>
                  <kbd className="px-2 py-1 rounded bg-white border border-[#E5E7EB] text-[#1F2937] shadow-xs">2</kbd>
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB] hover:border-[#DC2626]/40 transition-colors">
                <div className="flex items-center gap-3 text-sm text-[#1F2937] font-medium">
                  <MessageSquare className="w-4 h-4 text-[#DC2626]" />
                  <span>Cohort Discussions & Messaging</span>
                </div>
                <div className="flex items-center gap-1.5 font-mono text-xs">
                  <kbd className="px-2 py-1 rounded bg-white border border-[#E5E7EB] text-[#1F2937] shadow-xs">Alt</kbd>
                  <span className="text-[#4B5563]">+</span>
                  <kbd className="px-2 py-1 rounded bg-red-50 border border-red-200 text-[#DC2626] font-bold shadow-xs">M</kbd>
                  <span className="text-[#4B5563] text-[11px] ml-2">or key</span>
                  <kbd className="px-2 py-1 rounded bg-white border border-[#E5E7EB] text-[#1F2937] shadow-xs">3</kbd>
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB] hover:border-[#DC2626]/40 transition-colors">
                <div className="flex items-center gap-3 text-sm text-[#1F2937] font-medium">
                  <FileText className="w-4 h-4 text-[#DC2626]" />
                  <span>Assignments & Submissions</span>
                </div>
                <div className="flex items-center gap-1.5 font-mono text-xs">
                  <kbd className="px-2 py-1 rounded bg-white border border-[#E5E7EB] text-[#1F2937] shadow-xs">Alt</kbd>
                  <span className="text-[#4B5563]">+</span>
                  <kbd className="px-2 py-1 rounded bg-red-50 border border-red-200 text-[#DC2626] font-bold shadow-xs">A</kbd>
                  <span className="text-[#4B5563] text-[11px] ml-2">or key</span>
                  <kbd className="px-2 py-1 rounded bg-white border border-[#E5E7EB] text-[#1F2937] shadow-xs">4</kbd>
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB] hover:border-[#DC2626]/40 transition-colors">
                <div className="flex items-center gap-3 text-sm text-[#1F2937] font-medium">
                  <CalendarCheck className="w-4 h-4 text-[#DC2626]" />
                  <span>Attendance Check-In</span>
                </div>
                <div className="flex items-center gap-1.5 font-mono text-xs">
                  <kbd className="px-2 py-1 rounded bg-white border border-[#E5E7EB] text-[#1F2937] shadow-xs">Alt</kbd>
                  <span className="text-[#4B5563]">+</span>
                  <kbd className="px-2 py-1 rounded bg-red-50 border border-red-200 text-[#DC2626] font-bold shadow-xs">T</kbd>
                  <span className="text-[#4B5563] text-[11px] ml-2">or key</span>
                  <kbd className="px-2 py-1 rounded bg-white border border-[#E5E7EB] text-[#1F2937] shadow-xs">5</kbd>
                </div>
              </div>

              {user && (user.role === 'INSTRUCTOR' || user.role === 'ADMIN') && (
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB] hover:border-[#DC2626]/40 transition-colors">
                  <div className="flex items-center gap-3 text-sm text-[#1F2937] font-medium">
                    <BarChart3 className="w-4 h-4 text-[#DC2626]" />
                    <span>Analytics</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-xs">
                    <kbd className="px-2 py-1 rounded bg-white border border-[#E5E7EB] text-[#1F2937] shadow-xs">Alt</kbd>
                    <span className="text-[#4B5563]">+</span>
                    <kbd className="px-2 py-1 rounded bg-red-50 border border-red-200 text-[#DC2626] font-bold shadow-xs">P</kbd>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB] hover:border-[#DC2626]/40 transition-colors">
                <div className="flex items-center gap-3 text-sm text-[#1F2937] font-medium">
                  <Sparkles className="w-4 h-4 text-[#DC2626]" />
                  <span>Next-Gen Expansion Suite</span>
                </div>
                <div className="flex items-center gap-1.5 font-mono text-xs">
                  <kbd className="px-2 py-1 rounded bg-white border border-[#E5E7EB] text-[#1F2937] shadow-xs">Alt</kbd>
                  <span className="text-[#4B5563]">+</span>
                  <kbd className="px-2 py-1 rounded bg-red-50 border border-red-200 text-[#DC2626] font-bold shadow-xs">E</kbd>
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB] hover:border-[#DC2626]/40 transition-colors">
                <div className="flex items-center gap-3 text-sm text-[#1F2937] font-medium">
                  <Sparkles className="w-4 h-4 text-[#DC2626]" />
                  <span>Virtual Study Rooms (WebRTC)</span>
                </div>
                <div className="flex items-center gap-1.5 font-mono text-xs">
                  <kbd className="px-2 py-1 rounded bg-white border border-[#E5E7EB] text-[#1F2937] shadow-xs">Alt</kbd>
                  <span className="text-[#4B5563]">+</span>
                  <kbd className="px-2 py-1 rounded bg-red-50 border border-red-200 text-[#DC2626] font-bold shadow-xs">S</kbd>
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB] hover:border-[#DC2626]/40 transition-colors">
                <div className="flex items-center gap-3 text-sm text-[#1F2937] font-medium">
                  <Sparkles className="w-4 h-4 text-[#DC2626]" />
                  <span>Voice AI Technical Tutor</span>
                </div>
                <div className="flex items-center gap-1.5 font-mono text-xs">
                  <kbd className="px-2 py-1 rounded bg-white border border-[#E5E7EB] text-[#1F2937] shadow-xs">Alt</kbd>
                  <span className="text-[#4B5563]">+</span>
                  <kbd className="px-2 py-1 rounded bg-red-50 border border-red-200 text-[#DC2626] font-bold shadow-xs">V</kbd>
                </div>
              </div>
            </div>
          </div>

          {/* System & Dialog Shortcuts */}
          <div>
            <h4 className="text-xs font-semibold text-[#4B5563] uppercase tracking-wider mb-3">
              Dialogs & Accessibility
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB]">
                <span className="text-sm text-[#1F2937]">Show this shortcuts dialog</span>
                <div className="flex items-center gap-1.5 font-mono text-xs">
                  <kbd className="px-2 py-1 rounded bg-white border border-[#E5E7EB] text-[#1F2937]">Ctrl</kbd>
                  <span className="text-[#4B5563]">/</span>
                  <kbd className="px-2 py-1 rounded bg-white border border-[#E5E7EB] text-[#1F2937]">⌘</kbd>
                  <span className="text-[#4B5563]">+</span>
                  <kbd className="px-2 py-1 rounded bg-red-50 border border-red-200 text-[#DC2626] font-bold">/</kbd>
                  <span className="text-[#4B5563] text-[11px] ml-1">or</span>
                  <kbd className="px-2 py-1 rounded bg-red-50 border border-red-200 text-[#DC2626] font-bold">?</kbd>
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB]">
                <span className="text-sm text-[#1F2937]">Close modal or popup</span>
                <kbd className="px-2 py-1 rounded bg-white border border-[#E5E7EB] text-[#1F2937] font-mono text-xs">
                  Esc
                </kbd>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-[#F9FAFB] border-t border-[#E5E7EB] flex items-center justify-between text-xs text-[#4B5563]">
          <div className="flex items-center gap-2 text-[#DC2626]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Shortcuts are inactive while typing in text inputs</span>
          </div>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg bg-[#DC2626] hover:bg-[#B91C1C] text-white font-medium transition-colors cursor-pointer"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
