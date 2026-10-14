import { useEffect, useState, useCallback } from 'react';
import { useLMS, LMSView } from '../context/LMSContext';

export interface ShortcutDefinition {
  key: string;
  code?: string;
  modifiers?: {
    ctrlOrMeta?: boolean;
    alt?: boolean;
    shift?: boolean;
  };
  description: string;
  targetView?: LMSView;
  action?: () => void;
  allowedRoles?: Array<'STUDENT' | 'INSTRUCTOR' | 'ADMIN'>;
  category: 'Navigation' | 'Actions' | 'Help';
}

export const LMS_SHORTCUTS: ShortcutDefinition[] = [
  {
    key: 'd',
    modifiers: { alt: true },
    description: 'Jump to Learning Dashboard',
    targetView: 'dashboard',
    allowedRoles: ['STUDENT', 'INSTRUCTOR', 'ADMIN'],
    category: 'Navigation'
  },
  {
    key: 'c',
    modifiers: { alt: true },
    description: 'Jump to Courses & Catalog',
    targetView: 'courses',
    allowedRoles: ['STUDENT', 'INSTRUCTOR', 'ADMIN'],
    category: 'Navigation'
  },
  {
    key: 'm',
    modifiers: { alt: true },
    description: 'Jump to Cohort Discussions & Messaging',
    targetView: 'messaging',
    allowedRoles: ['STUDENT', 'INSTRUCTOR', 'ADMIN'],
    category: 'Navigation'
  },
  {
    key: 'a',
    modifiers: { alt: true },
    description: 'Jump to Assignments & Code Runner',
    targetView: 'assignments',
    allowedRoles: ['STUDENT', 'INSTRUCTOR', 'ADMIN'],
    category: 'Navigation'
  },
  {
    key: 't',
    modifiers: { alt: true },
    description: 'Jump to Classroom Attendance',
    targetView: 'attendance',
    allowedRoles: ['STUDENT', 'INSTRUCTOR', 'ADMIN'],
    category: 'Navigation'
  },
  {
    key: 'p',
    modifiers: { alt: true },
    description: 'Jump to Performance Analytics',
    targetView: 'analytics',
    allowedRoles: ['INSTRUCTOR', 'ADMIN'],
    category: 'Navigation'
  },
  {
    key: 'e',
    modifiers: { alt: true },
    description: 'Jump to Next-Gen Expansion Suite',
    targetView: 'expansion_hub',
    allowedRoles: ['STUDENT', 'INSTRUCTOR', 'ADMIN'],
    category: 'Navigation'
  },
  {
    key: 's',
    modifiers: { alt: true },
    description: 'Jump to Virtual Study Rooms & WebRTC',
    targetView: 'study_rooms',
    allowedRoles: ['STUDENT', 'INSTRUCTOR', 'ADMIN'],
    category: 'Navigation'
  },
  {
    key: 'v',
    modifiers: { alt: true },
    description: 'Jump to Voice AI Technical Tutor',
    targetView: 'voice_tutor',
    allowedRoles: ['STUDENT', 'INSTRUCTOR', 'ADMIN'],
    category: 'Navigation'
  },
  {
    key: '/',
    modifiers: { ctrlOrMeta: true },
    description: 'Toggle Keyboard Shortcuts Cheat Sheet',
    category: 'Help'
  },
  {
    key: '?',
    modifiers: { shift: true },
    description: 'Open Keyboard Shortcuts Help',
    category: 'Help'
  }
];

export interface UseKeyboardNavigationOptions {
  onToggleHelpModal?: () => void;
  enabled?: boolean;
}

/**
 * Handles global keydown events to navigate quickly between LMS modules.
 * Ignores keystrokes inside inputs, textareas, contenteditable, or select elements
 * unless combination has Ctrl/Cmd or Alt modifier.
 */
export function useKeyboardNavigation(options: UseKeyboardNavigationOptions = {}) {
  const { currentView, setCurrentView, user } = useLMS();
  const [activeShortcutToast, setActiveShortcutToast] = useState<{
    keyLabel: string;
    title: string;
  } | null>(null);

  const showToast = useCallback((keyLabel: string, title: string) => {
    setActiveShortcutToast({ keyLabel, title });
    const timer = setTimeout(() => {
      setActiveShortcutToast(null);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (options.enabled === false) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger if user is typing inside an editable field unless Alt/Cmd key is held
      const target = event.target as HTMLElement | null;
      const isInput =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable);

      const isCtrlOrMeta = event.ctrlKey || event.metaKey;
      const isAlt = event.altKey;
      const isShift = event.shiftKey;
      const key = event.key.toLowerCase();

      // Help Modal triggers: Cmd+/ or Ctrl+/ or '?' (Shift+/)
      if (
        (isCtrlOrMeta && (key === '/' || event.code === 'Slash')) ||
        (event.key === '?' && !isInput)
      ) {
        event.preventDefault();
        if (options.onToggleHelpModal) {
          options.onToggleHelpModal();
        }
        return;
      }

      // If typing in an input and neither Alt nor Ctrl/Meta was pressed, skip navigation
      if (isInput && !isAlt && !isCtrlOrMeta) {
        return;
      }

      // Navigation shortcuts (Alt + Key, or simple sequence when not in input)
      // Main requested modules: Dashboard (Alt+D), Courses (Alt+C), Messaging (Alt+M)
      if (isAlt && !isCtrlOrMeta) {
        if (key === 'd') {
          event.preventDefault();
          if (user) {
            setCurrentView('dashboard');
            showToast('Alt + D', 'Navigated to Dashboard');
          } else {
            setCurrentView('landing');
            showToast('Alt + D', 'Navigated to Home');
          }
        } else if (key === 'c') {
          event.preventDefault();
          if (user) {
            setCurrentView('courses');
            showToast('Alt + C', 'Navigated to Courses & Catalog');
          } else {
            setCurrentView('courses_overview');
            showToast('Alt + C', 'Navigated to Courses Overview');
          }
        } else if (key === 'm') {
          event.preventDefault();
          if (user) {
            setCurrentView('messaging');
            showToast('Alt + M', 'Navigated to Cohort Discussions');
          }
        } else if (key === 'a') {
          event.preventDefault();
          if (user) {
            setCurrentView('assignments');
            showToast('Alt + A', 'Navigated to Assignments');
          }
        } else if (key === 't') {
          event.preventDefault();
          if (user) {
            setCurrentView('attendance');
            showToast('Alt + T', 'Navigated to Attendance Check-in');
          }
        } else if (key === 'p') {
          event.preventDefault();
          if (user && (user.role === 'INSTRUCTOR' || user.role === 'ADMIN')) {
            setCurrentView('analytics');
            showToast('Alt + P', 'Navigated to Analytics');
          }
        }
      }

      // Quick number key navigation for authenticated users when not in input
      if (!isInput && !isCtrlOrMeta && !isAlt && !isShift && user) {
        switch (event.key) {
          case '1':
            event.preventDefault();
            setCurrentView('dashboard');
            showToast('1', 'Dashboard');
            break;
          case '2':
            event.preventDefault();
            setCurrentView('courses');
            showToast('2', 'Courses Catalog');
            break;
          case '3':
            event.preventDefault();
            setCurrentView('messaging');
            showToast('3', 'Cohort Messaging');
            break;
          case '4':
            event.preventDefault();
            setCurrentView('assignments');
            showToast('4', 'Assignments');
            break;
          case '5':
            event.preventDefault();
            setCurrentView('attendance');
            showToast('5', 'Attendance Check-in');
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [user, setCurrentView, showToast, options]);

  return {
    activeShortcutToast,
    clearToast: () => setActiveShortcutToast(null)
  };
}
