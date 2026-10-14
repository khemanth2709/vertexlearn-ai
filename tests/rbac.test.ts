import { describe, it, expect } from 'vitest';
import {
  hasRoleAccess,
  isPublicLMSView,
  evaluateRouteAccess,
  verifyCourseOwnership,
  checkCapability,
  PUBLIC_LMS_VIEWS
} from '../src/utils/rbacUtils';
import { UserRole } from '../src/types/lms';

describe('Role-Based Access Control (RBAC) & Security Validation', () => {
  describe('isPublicLMSView', () => {
    it('identifies public views that allow anonymous access', () => {
      expect(isPublicLMSView('landing')).toBe(true);
      expect(isPublicLMSView('login')).toBe(true);
      expect(isPublicLMSView('register')).toBe(true);
      expect(isPublicLMSView('courses_overview')).toBe(true);
      expect(isPublicLMSView('about')).toBe(true);
      expect(isPublicLMSView('features')).toBe(true);
      expect(isPublicLMSView('contact')).toBe(true);
      expect(isPublicLMSView('forgot_password')).toBe(true);
    });

    it('identifies protected views that require authentication and role authorization', () => {
      expect(isPublicLMSView('dashboard')).toBe(false);
      expect(isPublicLMSView('admin_audit')).toBe(false);
      expect(isPublicLMSView('admin_students')).toBe(false);
      expect(isPublicLMSView('admin_instructors')).toBe(false);
      expect(isPublicLMSView('course_builder')).toBe(false);
      expect(isPublicLMSView('compliance')).toBe(false);
      expect(isPublicLMSView('analytics')).toBe(false);
      expect(isPublicLMSView('permissions_matrix')).toBe(false);
    });
  });

  describe('hasRoleAccess', () => {
    it('returns false when user role is undefined or null', () => {
      expect(hasRoleAccess(undefined)).toBe(false);
      expect(hasRoleAccess(null)).toBe(false);
    });

    it('returns true when no allowed roles are restricted (all authenticated roles welcome)', () => {
      expect(hasRoleAccess('STUDENT', [])).toBe(true);
      expect(hasRoleAccess('INSTRUCTOR', undefined)).toBe(true);
      expect(hasRoleAccess('ADMIN', [])).toBe(true);
    });

    it('correctly matches single and multiple allowed roles (case-insensitive)', () => {
      expect(hasRoleAccess('STUDENT', ['STUDENT'])).toBe(true);
      expect(hasRoleAccess('student', ['STUDENT'])).toBe(true);
      expect(hasRoleAccess('STUDENT', ['INSTRUCTOR', 'ADMIN'])).toBe(false);
      expect(hasRoleAccess('INSTRUCTOR', ['INSTRUCTOR', 'ADMIN'])).toBe(true);
      expect(hasRoleAccess('ADMIN', ['ADMIN'])).toBe(true);
      expect(hasRoleAccess('ADMIN', ['STUDENT'])).toBe(false);
    });
  });

  describe('evaluateRouteAccess (Zero-Redirect 403 Forbidden Enforcement)', () => {
    const studentUser = { id: 'u_1', email: 'student@vertexlearn.ai', role: 'STUDENT' as UserRole };
    const instructorUser = { id: 'u_2', email: 'instructor@vertexlearn.ai', role: 'INSTRUCTOR' as UserRole };
    const adminUser = { id: 'u_3', email: 'admin@vertexlearn.ai', role: 'ADMIN' as UserRole };

    it('allows unauthenticated access to public views with HTTP 200', () => {
      const result = evaluateRouteAccess(null, 'landing');
      expect(result.allowed).toBe(true);
      expect(result.httpStatus).toBe(200);
      expect(result.errorCode).toBeUndefined();
    });

    it('strictly returns 403 Forbidden with 403.1 (AUTH_REQUIRED) for anonymous access to protected views', () => {
      const result = evaluateRouteAccess(null, 'dashboard');
      expect(result.allowed).toBe(false);
      expect(result.httpStatus).toBe(403);
      expect(result.errorCode).toBe('403.1 (AUTH_REQUIRED)');
      expect(result.reasonTitle).toContain('Institutional Authentication Required');
    });

    it('strictly returns 403 Forbidden with 403.3 (ROLE_DENIED) when role is unauthorized (e.g. Student -> Admin Audit)', () => {
      const result = evaluateRouteAccess(studentUser, 'admin_audit', ['ADMIN']);
      expect(result.allowed).toBe(false);
      expect(result.httpStatus).toBe(403);
      expect(result.errorCode).toBe('403.3 (ROLE_DENIED)');
      expect(result.reasonTitle).toContain('Insufficient Role Privileges');
      expect(result.reasonDescription).toContain('STUDENT');
    });

    it('strictly returns 403 Forbidden with 403.3 (ROLE_DENIED) when student attempts instructor route', () => {
      const result = evaluateRouteAccess(studentUser, 'course_builder', ['INSTRUCTOR', 'ADMIN']);
      expect(result.allowed).toBe(false);
      expect(result.httpStatus).toBe(403);
      expect(result.errorCode).toBe('403.3 (ROLE_DENIED)');
    });

    it('grants HTTP 200 OK access to instructor accessing course builder', () => {
      const result = evaluateRouteAccess(instructorUser, 'course_builder', ['INSTRUCTOR', 'ADMIN']);
      expect(result.allowed).toBe(true);
      expect(result.httpStatus).toBe(200);
      expect(result.errorCode).toBeUndefined();
    });

    it('grants HTTP 200 OK access to admin accessing all restricted modules', () => {
      const result = evaluateRouteAccess(adminUser, 'admin_audit', ['ADMIN']);
      expect(result.allowed).toBe(true);
      expect(result.httpStatus).toBe(200);
    });
  });

  describe('verifyCourseOwnership', () => {
    it('always permits Admin to manage or mutate any course', () => {
      expect(verifyCourseOwnership('ADMIN', 'admin_1', 'inst_99').allowed).toBe(true);
      expect(verifyCourseOwnership('admin', 'admin_1', 'inst_99').allowed).toBe(true);
    });

    it('permits Instructor to manage their own course (matching instructor ID)', () => {
      const result = verifyCourseOwnership('INSTRUCTOR', 'inst_42', 'inst_42');
      expect(result.allowed).toBe(true);
    });

    it('denies Instructor from modifying a course owned by another instructor', () => {
      const result = verifyCourseOwnership('INSTRUCTOR', 'inst_42', 'inst_99');
      expect(result.allowed).toBe(false);
      expect(result.reason).toContain('Forbidden: You do not own this course');
    });

    it('strictly denies Student from course modifications', () => {
      const result = verifyCourseOwnership('STUDENT', 'stu_1', 'stu_1');
      expect(result.allowed).toBe(false);
      expect(result.reason).toContain('Only instructors and platform administrators');
    });
  });

  describe('checkCapability (Section 11 Permissions Matrix)', () => {
    it('enforces student capabilities', () => {
      expect(checkCapability('STUDENT', 'ENROLL_COURSE')).toBe(true);
      expect(checkCapability('STUDENT', 'SUBMIT_ASSIGNMENT')).toBe(true);
      expect(checkCapability('STUDENT', 'ATTEMPT_QUIZ')).toBe(true);
      expect(checkCapability('STUDENT', 'USE_AI_TUTOR')).toBe(true);
      expect(checkCapability('STUDENT', 'CREATE_COURSE')).toBe(false);
      expect(checkCapability('STUDENT', 'GRADE_ASSIGNMENT')).toBe(false);
      expect(checkCapability('STUDENT', 'MANAGE_USERS')).toBe(false);
    });

    it('enforces instructor capabilities with ownership check', () => {
      expect(checkCapability('INSTRUCTOR', 'ENROLL_COURSE')).toBe(false);
      expect(checkCapability('INSTRUCTOR', 'USE_AI_TUTOR')).toBe(true);
      expect(checkCapability('INSTRUCTOR', 'CREATE_COURSE')).toBe(true);
      // Own course grading vs other course grading
      expect(checkCapability('INSTRUCTOR', 'GRADE_ASSIGNMENT', true)).toBe(true);
      expect(checkCapability('INSTRUCTOR', 'GRADE_ASSIGNMENT', false)).toBe(false);
      expect(checkCapability('INSTRUCTOR', 'VIEW_OWN_ANALYTICS')).toBe(true);
      expect(checkCapability('INSTRUCTOR', 'VIEW_PLATFORM_ANALYTICS')).toBe(false);
      expect(checkCapability('INSTRUCTOR', 'MANAGE_USERS')).toBe(false);
    });

    it('enforces admin platform-wide capabilities', () => {
      expect(checkCapability('ADMIN', 'CREATE_COURSE')).toBe(true);
      expect(checkCapability('ADMIN', 'GRADE_ASSIGNMENT')).toBe(true);
      expect(checkCapability('ADMIN', 'VIEW_OWN_ANALYTICS')).toBe(true);
      expect(checkCapability('ADMIN', 'VIEW_PLATFORM_ANALYTICS')).toBe(true);
      expect(checkCapability('ADMIN', 'MANAGE_USERS')).toBe(true);
    });
  });
});
