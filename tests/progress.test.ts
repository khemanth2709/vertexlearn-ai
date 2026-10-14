import { describe, it, expect } from 'vitest';
import {
  calculateCourseProgress,
  isModuleUnlocked,
  calculateOverallScore,
  calculateAttendanceRate,
  determinePerformanceCategory,
  calculateLearningStreak
} from '../src/utils/progressUtils';

describe('Progress Calculations & Learning Metrics', () => {
  describe('calculateCourseProgress', () => {
    it('returns 0 for courses with no modules or undefined/null modules', () => {
      expect(calculateCourseProgress([])).toBe(0);
      expect(calculateCourseProgress(undefined)).toBe(0);
      expect(calculateCourseProgress(null)).toBe(0);
    });

    it('returns 0% when no modules are completed', () => {
      const modules = [{ id: 'm1' }, { id: 'm2' }, { id: 'm3' }, { id: 'm4' }];
      expect(calculateCourseProgress(modules, [])).toBe(0);
      expect(calculateCourseProgress(modules, new Set())).toBe(0);
    });

    it('returns 50% when 2 out of 4 modules are completed', () => {
      const modules = [{ id: 'm1' }, { id: 'm2' }, { id: 'm3' }, { id: 'm4' }];
      expect(calculateCourseProgress(modules, ['m1', 'm2'])).toBe(50);
      expect(calculateCourseProgress(modules, new Set(['m1', 'm2']))).toBe(50);
    });

    it('returns 100% when all modules are completed', () => {
      const modules = [{ id: 'm1' }, { id: 'm2' }];
      expect(calculateCourseProgress(modules, ['m1', 'm2'])).toBe(100);
      expect(calculateCourseProgress(modules, new Set(['m1', 'm2', 'm3_unrelated']))).toBe(100);
    });

    it('rounds percentage correctly to the nearest integer', () => {
      const modules = [{ id: 'm1' }, { id: 'm2' }, { id: 'm3' }];
      // 1 / 3 = 33.333% -> 33
      expect(calculateCourseProgress(modules, ['m1'])).toBe(33);
      // 2 / 3 = 66.666% -> 67
      expect(calculateCourseProgress(modules, ['m1', 'm2'])).toBe(67);
    });

    it('clamps values cleanly between 0 and 100', () => {
      const modules = [{ id: 'm1' }];
      expect(calculateCourseProgress(modules, ['m1'])).toBe(100);
    });
  });

  describe('isModuleUnlocked', () => {
    const modules = [{ id: 'm0' }, { id: 'm1' }, { id: 'm2' }, { id: 'm3' }];

    it('always unlocks index 0 for any student', () => {
      expect(isModuleUnlocked(0, modules, [], 'STUDENT')).toBe(true);
      expect(isModuleUnlocked(0, modules, new Set(), 'STUDENT')).toBe(true);
    });

    it('locks subsequent modules if preceding module is not completed', () => {
      expect(isModuleUnlocked(1, modules, [], 'STUDENT')).toBe(false);
      expect(isModuleUnlocked(2, modules, ['m0'], 'STUDENT')).toBe(false);
    });

    it('unlocks module N when module N-1 is completed', () => {
      expect(isModuleUnlocked(1, modules, ['m0'], 'STUDENT')).toBe(true);
      expect(isModuleUnlocked(2, modules, ['m0', 'm1'], 'STUDENT')).toBe(true);
      expect(isModuleUnlocked(3, modules, ['m0', 'm1', 'm2'], 'STUDENT')).toBe(true);
    });

    it('allows Instructors and Admins to bypass module sequential locking', () => {
      expect(isModuleUnlocked(3, modules, [], 'INSTRUCTOR')).toBe(true);
      expect(isModuleUnlocked(3, modules, [], 'ADMIN')).toBe(true);
      expect(isModuleUnlocked(2, modules, [], 'instructor')).toBe(true);
      expect(isModuleUnlocked(2, modules, [], 'admin')).toBe(true);
    });

    it('returns false for negative or out-of-bound indices', () => {
      expect(isModuleUnlocked(-1, modules, ['m0'], 'STUDENT')).toBe(false);
      expect(isModuleUnlocked(10, modules, ['m0', 'm1', 'm2', 'm3'], 'STUDENT')).toBe(false);
    });

    it('returns false if module list is empty or undefined', () => {
      expect(isModuleUnlocked(0, [], [], 'STUDENT')).toBe(false);
      expect(isModuleUnlocked(0, undefined, [], 'STUDENT')).toBe(false);
    });
  });

  describe('calculateOverallScore', () => {
    it('returns 0 for empty scores array', () => {
      expect(calculateOverallScore([])).toBe(0);
    });

    it('computes simple arithmetic average when weights are omitted', () => {
      expect(calculateOverallScore([80, 90, 100])).toBe(90);
      expect(calculateOverallScore([75, 85])).toBe(80);
    });

    it('computes weighted score correctly when weights are provided', () => {
      // 90 * 0.7 + 60 * 0.3 = 63 + 18 = 81
      expect(calculateOverallScore([90, 60], [70, 30])).toBe(81);
    });

    it('handles single score', () => {
      expect(calculateOverallScore([95])).toBe(95);
    });
  });

  describe('calculateAttendanceRate', () => {
    it('returns 100% when no sessions have taken place yet', () => {
      expect(calculateAttendanceRate(0, 0)).toBe(100);
      expect(calculateAttendanceRate(5, 0)).toBe(100);
    });

    it('calculates correct attendance percentages', () => {
      expect(calculateAttendanceRate(10, 10)).toBe(100);
      expect(calculateAttendanceRate(5, 10)).toBe(50);
      expect(calculateAttendanceRate(9, 10)).toBe(90);
    });

    it('rounds to 1 decimal place', () => {
      // 19 / 20 = 95
      expect(calculateAttendanceRate(19, 20)).toBe(95);
      // 2 / 3 = 66.666 -> 66.7
      expect(calculateAttendanceRate(2, 3)).toBe(66.7);
    });
  });

  describe('determinePerformanceCategory', () => {
    it('classifies as EXCELLENT when score and attendance are high (>=85)', () => {
      expect(determinePerformanceCategory(92, 95)).toBe('EXCELLENT');
      expect(determinePerformanceCategory(85, 85)).toBe('EXCELLENT');
    });

    it('classifies as GOOD when score and attendance are >=70 but <85', () => {
      expect(determinePerformanceCategory(75, 80)).toBe('GOOD');
      expect(determinePerformanceCategory(70, 70)).toBe('GOOD');
      expect(determinePerformanceCategory(88, 75)).toBe('GOOD');
    });

    it('classifies as AT_RISK if score < 50 or attendance < 60', () => {
      expect(determinePerformanceCategory(45, 90)).toBe('AT_RISK');
      expect(determinePerformanceCategory(80, 55)).toBe('AT_RISK');
      expect(determinePerformanceCategory(30, 40)).toBe('AT_RISK');
    });

    it('classifies as NEEDS_IMPROVEMENT otherwise', () => {
      expect(determinePerformanceCategory(65, 65)).toBe('NEEDS_IMPROVEMENT');
      expect(determinePerformanceCategory(55, 75)).toBe('NEEDS_IMPROVEMENT');
    });
  });

  describe('calculateLearningStreak', () => {
    it('returns 0 for empty activity logs', () => {
      expect(calculateLearningStreak([])).toBe(0);
    });

    it('calculates streak for consecutive dates including today', () => {
      const today = new Date();
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);

      const dates = [
        today.toISOString(),
        yesterday.toISOString(),
        twoDaysAgo.toISOString()
      ];

      expect(calculateLearningStreak(dates)).toBe(3);
    });

    it('deduplicates multiple activities on the same day', () => {
      const today = new Date();
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);

      const dates = [
        today.toISOString(),
        `${today.toISOString().split('T')[0]}T14:30:00.000Z`,
        yesterday.toISOString()
      ];

      expect(calculateLearningStreak(dates)).toBe(2);
    });

    it('breaks streak when a day is skipped in between', () => {
      const today = new Date();
      const threeDaysAgo = new Date(Date.now() - 72 * 60 * 60 * 1000);

      const dates = [
        today.toISOString(),
        threeDaysAgo.toISOString()
      ];

      expect(calculateLearningStreak(dates)).toBe(1);
    });
  });
});
