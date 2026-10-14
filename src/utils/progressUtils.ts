import { CourseModule, PerformanceCategory, UserRole } from '../types/lms';

/**
 * Calculates course completion percentage (0 - 100).
 * Handles edge cases: empty course, missing modules, null/undefined sets.
 */
export function calculateCourseProgress(
  modules: Array<{ id: string }> | undefined | null,
  completedModuleIds: Set<string> | string[] = []
): number {
  if (!modules || modules.length === 0) {
    return 0;
  }

  const completedSet = completedModuleIds instanceof Set 
    ? completedModuleIds 
    : new Set(completedModuleIds);

  let completedCount = 0;
  for (const mod of modules) {
    if (completedSet.has(mod.id)) {
      completedCount++;
    }
  }

  const percentage = (completedCount / modules.length) * 100;
  return Math.min(100, Math.max(0, Math.round(percentage)));
}

/**
 * Determines whether a specific module in a course is unlocked for a given user.
 * - Module 0 is always unlocked.
 * - Instructors and Admins bypass locking (can view any module).
 * - For Students, module index N is unlocked only if module N-1 is completed.
 */
export function isModuleUnlocked(
  moduleIndex: number,
  modules: Array<{ id: string }> | undefined | null,
  completedModuleIds: Set<string> | string[] = [],
  userRole?: UserRole | string
): boolean {
  if (!modules || modules.length === 0 || moduleIndex < 0 || moduleIndex >= modules.length) {
    return false;
  }

  // Instructors and Admins bypass sequential lock
  if (userRole === 'INSTRUCTOR' || userRole === 'ADMIN' || userRole === 'instructor' || userRole === 'admin') {
    return true;
  }

  // First module is always accessible to enrolled students
  if (moduleIndex === 0) {
    return true;
  }

  const completedSet = completedModuleIds instanceof Set 
    ? completedModuleIds 
    : new Set(completedModuleIds);

  const prevModule = modules[moduleIndex - 1];
  return completedSet.has(prevModule.id);
}

/**
 * Calculates overall weighted score across multiple assessments.
 * If weights are omitted, computes a simple arithmetic mean.
 */
export function calculateOverallScore(scores: number[], weights?: number[]): number {
  if (!scores || scores.length === 0) {
    return 0;
  }

  if (weights && weights.length === scores.length) {
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    if (totalWeight === 0) return 0;
    const weightedSum = scores.reduce((sum, score, idx) => sum + (score * weights[idx]), 0);
    return Math.min(100, Math.max(0, Math.round(weightedSum / totalWeight)));
  }

  const sum = scores.reduce((acc, curr) => acc + curr, 0);
  return Math.min(100, Math.max(0, Math.round(sum / scores.length)));
}

/**
 * Calculates student attendance percentage.
 */
export function calculateAttendanceRate(attendedSessions: number, totalSessions: number): number {
  if (totalSessions <= 0) {
    return 100; // Default baseline when no sessions held yet
  }
  const rate = (attendedSessions / totalSessions) * 100;
  return Math.min(100, Math.max(0, Math.round(rate * 10) / 10));
}

/**
 * Determines a student's performance classification category
 * based on overall score and attendance rate.
 */
export function determinePerformanceCategory(
  overallScore: number,
  attendanceRate: number
): PerformanceCategory {
  if (overallScore < 50 || attendanceRate < 60) {
    return 'AT_RISK';
  }
  if (overallScore >= 85 && attendanceRate >= 85) {
    return 'EXCELLENT';
  }
  if (overallScore >= 70 && attendanceRate >= 70) {
    return 'GOOD';
  }
  return 'NEEDS_IMPROVEMENT';
}

/**
 * Calculates current active streak in consecutive days given ISO date strings.
 */
export function calculateLearningStreak(activityDates: string[]): number {
  if (!activityDates || activityDates.length === 0) {
    return 0;
  }

  const uniqueDateStrings = Array.from(
    new Set(activityDates.filter(Boolean).map(d => d.split('T')[0]))
  )
    .sort()
    .reverse();

  if (uniqueDateStrings.length === 0) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const mostRecent = new Date(uniqueDateStrings[0]);
  mostRecent.setHours(0, 0, 0, 0);

  const diffMs = today.getTime() - mostRecent.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  // If most recent activity was more than 1 day ago (neither today nor yesterday), streak is broken
  if (diffDays > 1) {
    return 0;
  }

  let streak = 1;
  let currentDate = mostRecent;

  for (let i = 1; i < uniqueDateStrings.length; i++) {
    const prevDate = new Date(uniqueDateStrings[i]);
    prevDate.setHours(0, 0, 0, 0);

    const dayDiff = Math.round((currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
    if (dayDiff === 1) {
      streak++;
      currentDate = prevDate;
    } else {
      break;
    }
  }

  return streak;
}
