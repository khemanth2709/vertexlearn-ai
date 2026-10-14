import { UserRole } from '../types/lms';

export const PUBLIC_LMS_VIEWS: readonly string[] = [
  'landing',
  'about',
  'features',
  'courses_overview',
  'contact',
  'login',
  'register',
  'forgot_password',
  'verify_certificate'
] as const;

export type RouteAccessResult = {
  allowed: boolean;
  httpStatus: 200 | 403;
  errorCode?: '403.1 (AUTH_REQUIRED)' | '403.3 (ROLE_DENIED)';
  reasonTitle?: string;
  reasonDescription?: string;
};

/**
 * Checks whether a given view name belongs to the public unauthenticated views.
 */
export function isPublicLMSView(view: string): boolean {
  return PUBLIC_LMS_VIEWS.includes(view);
}

/**
 * Validates if a user's role meets the requirement of allowed roles.
 */
export function hasRoleAccess(
  userRole: UserRole | string | undefined | null,
  allowedRoles?: (UserRole | string)[]
): boolean {
  if (!userRole) {
    return false;
  }
  // If no allowedRoles specified, any authenticated role is granted access
  if (!allowedRoles || allowedRoles.length === 0) {
    return true;
  }

  const normalizedUserRole = userRole.toUpperCase();
  return allowedRoles.some(r => r.toUpperCase() === normalizedUserRole);
}

/**
 * Evaluates route access under Zero-Trust RBAC:
 * - Public views: 200 OK
 * - Unauthenticated user on protected route: 403 Forbidden (403.1 AUTH_REQUIRED) - Zero Redirect
 * - Authenticated user with disallowed role: 403 Forbidden (403.3 ROLE_DENIED) - Zero Redirect
 * - Authorized user: 200 OK
 */
export function evaluateRouteAccess(
  user: { id: string; email: string; role: UserRole } | null,
  view: string,
  allowedRoles?: UserRole[]
): RouteAccessResult {
  // 1. Public views require no credentials
  if (isPublicLMSView(view)) {
    return {
      allowed: true,
      httpStatus: 200
    };
  }

  // 2. Unauthenticated user accessing protected view -> 403 Forbidden
  if (!user) {
    return {
      allowed: false,
      httpStatus: 403,
      errorCode: '403.1 (AUTH_REQUIRED)',
      reasonTitle: '403 Forbidden: Institutional Authentication Required',
      reasonDescription: 'Anonymous access to this educational workspace is strictly prohibited. Zero-trust security policy requires verified institutional credentials before entering this module.'
    };
  }

  // 3. User with insufficient role privileges -> 403 Forbidden
  if (allowedRoles && allowedRoles.length > 0 && !hasRoleAccess(user.role, allowedRoles)) {
    return {
      allowed: false,
      httpStatus: 403,
      errorCode: '403.3 (ROLE_DENIED)',
      reasonTitle: '403 Forbidden: Insufficient Role Privileges',
      reasonDescription: `Your active account (${user.email}) has role clearance level "${user.role}". This resource strictly mandates role authorization: [${allowedRoles.join(', ')}].`
    };
  }

  // 4. Authorized
  return {
    allowed: true,
    httpStatus: 200
  };
}

/**
 * Verifies course ownership at the business logic layer.
 * - Platform Admin: unrestricted ownership bypass
 * - Instructor: allowed only if instructorId matches their user ID
 * - Student: strictly false
 */
export function verifyCourseOwnership(
  userRole: UserRole | string,
  userId: string,
  courseInstructorId: string
): { allowed: boolean; reason?: string } {
  const normalizedRole = userRole.toUpperCase();

  if (normalizedRole === 'ADMIN') {
    return { allowed: true };
  }

  if (normalizedRole === 'INSTRUCTOR') {
    if (userId === courseInstructorId) {
      return { allowed: true };
    }
    return {
      allowed: false,
      reason: 'Forbidden: You do not own this course. Mutation denied at service layer.'
    };
  }

  return {
    allowed: false,
    reason: 'Forbidden: Only instructors and platform administrators can modify course contents.'
  };
}

/**
 * Checks capabilities according to Section 11 RBAC matrix
 */
export function checkCapability(
  role: UserRole | string,
  capability:
    | 'ENROLL_COURSE'
    | 'SUBMIT_ASSIGNMENT'
    | 'ATTEMPT_QUIZ'
    | 'USE_AI_TUTOR'
    | 'CREATE_COURSE'
    | 'GRADE_ASSIGNMENT'
    | 'VIEW_OWN_ANALYTICS'
    | 'VIEW_PLATFORM_ANALYTICS'
    | 'MANAGE_USERS',
  isOwner: boolean = false
): boolean {
  const norm = role.toUpperCase();

  switch (capability) {
    case 'ENROLL_COURSE':
    case 'SUBMIT_ASSIGNMENT':
    case 'ATTEMPT_QUIZ':
      return norm === 'STUDENT';

    case 'USE_AI_TUTOR':
      return norm === 'STUDENT' || norm === 'INSTRUCTOR';

    case 'CREATE_COURSE':
      return norm === 'ADMIN' || norm === 'INSTRUCTOR';

    case 'GRADE_ASSIGNMENT':
      return norm === 'ADMIN' || (norm === 'INSTRUCTOR' && isOwner);

    case 'VIEW_OWN_ANALYTICS':
      return norm === 'ADMIN' || norm === 'INSTRUCTOR';

    case 'VIEW_PLATFORM_ANALYTICS':
    case 'MANAGE_USERS':
      return norm === 'ADMIN';

    default:
      return false;
  }
}
