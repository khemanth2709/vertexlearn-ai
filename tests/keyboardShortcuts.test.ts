import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { LMS_SHORTCUTS } from '../src/hooks/useKeyboardNavigation';

describe('Global Keyboard Shortcuts Definition & Configuration', () => {
  it('defines shortcut configurations for primary modules (Dashboard, Courses, Messaging)', () => {
    const dashboardShortcut = LMS_SHORTCUTS.find(s => s.targetView === 'dashboard');
    const coursesShortcut = LMS_SHORTCUTS.find(s => s.targetView === 'courses');
    const messagingShortcut = LMS_SHORTCUTS.find(s => s.targetView === 'messaging');

    expect(dashboardShortcut).toBeDefined();
    expect(dashboardShortcut?.key).toBe('d');
    expect(dashboardShortcut?.modifiers?.alt).toBe(true);

    expect(coursesShortcut).toBeDefined();
    expect(coursesShortcut?.key).toBe('c');
    expect(coursesShortcut?.modifiers?.alt).toBe(true);

    expect(messagingShortcut).toBeDefined();
    expect(messagingShortcut?.key).toBe('m');
    expect(messagingShortcut?.modifiers?.alt).toBe(true);
  });

  it('includes help dialog shortcuts for quick reference', () => {
    const helpShortcuts = LMS_SHORTCUTS.filter(s => s.category === 'Help');
    expect(helpShortcuts.length).toBeGreaterThanOrEqual(2);
    
    const slashShortcut = helpShortcuts.find(s => s.key === '/');
    expect(slashShortcut?.modifiers?.ctrlOrMeta).toBe(true);

    const questionShortcut = helpShortcuts.find(s => s.key === '?');
    expect(questionShortcut?.modifiers?.shift).toBe(true);
  });

  it('restricts role-specific shortcuts appropriately', () => {
    const analyticsShortcut = LMS_SHORTCUTS.find(s => s.targetView === 'analytics');
    expect(analyticsShortcut?.allowedRoles).toEqual(['INSTRUCTOR', 'ADMIN']);
    expect(analyticsShortcut?.allowedRoles?.includes('STUDENT' as any)).toBe(false);
  });
});
