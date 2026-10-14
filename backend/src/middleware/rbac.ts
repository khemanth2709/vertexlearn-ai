import { Request, Response, NextFunction } from 'express';

export type UserRoleType = 'student' | 'instructor' | 'admin';

/**
 * Section 11: User Roles & Permissions Matrix Definition
 */
export interface CapabilityPermission {
  capability: string;
  student: boolean;
  instructor: boolean | string; // true, false, or 'own course' / 'as reviewer'
  admin: boolean | string;      // true, or 'any course' / 'platform-wide'
  enforcementLayer: 'API Middleware (requireRole)' | 'Service Layer (ownership check)' | 'Dual Layer (Role + Ownership)';
}

export const PERMISSIONS_MATRIX: CapabilityPermission[] = [
  {
    capability: 'Register / Login',
    student: true,
    instructor: true,
    admin: true,
    enforcementLayer: 'API Middleware (requireRole)'
  },
  {
    capability: 'Browse course catalog',
    student: true,
    instructor: true,
    admin: true,
    enforcementLayer: 'API Middleware (requireRole)'
  },
  {
    capability: 'Enroll in a course',
    student: true,
    instructor: false,
    admin: false,
    enforcementLayer: 'API Middleware (requireRole)'
  },
  {
    capability: 'Watch lectures / track progress',
    student: true,
    instructor: false,
    admin: false,
    enforcementLayer: 'API Middleware (requireRole)'
  },
  {
    capability: 'Create notes/bookmarks',
    student: true,
    instructor: false,
    admin: false,
    enforcementLayer: 'API Middleware (requireRole)'
  },
  {
    capability: 'Submit assignments',
    student: true,
    instructor: false,
    admin: false,
    enforcementLayer: 'API Middleware (requireRole)'
  },
  {
    capability: 'Attempt quizzes',
    student: true,
    instructor: false,
    admin: false,
    enforcementLayer: 'API Middleware (requireRole)'
  },
  {
    capability: 'Use AI tutor chat',
    student: true,
    instructor: 'Yes (as reviewer)',
    admin: false,
    enforcementLayer: 'API Middleware (requireRole)'
  },
  {
    capability: 'Create/edit own course',
    student: false,
    instructor: 'Yes (own course)',
    admin: 'Yes (any course)',
    enforcementLayer: 'Dual Layer (Role + Ownership)'
  },
  {
    capability: 'Upload lecture material',
    student: false,
    instructor: 'Yes (own course)',
    admin: true,
    enforcementLayer: 'Dual Layer (Role + Ownership)'
  },
  {
    capability: 'Create/approve AI-generated quiz',
    student: false,
    instructor: 'Yes (own course)',
    admin: true,
    enforcementLayer: 'Dual Layer (Role + Ownership)'
  },
  {
    capability: 'Grade assignments',
    student: false,
    instructor: 'Yes (own course)',
    admin: true,
    enforcementLayer: 'Dual Layer (Role + Ownership)'
  },
  {
    capability: 'View own-course analytics',
    student: false,
    instructor: true,
    admin: true,
    enforcementLayer: 'Dual Layer (Role + Ownership)'
  },
  {
    capability: 'View platform-wide analytics',
    student: false,
    instructor: false,
    admin: true,
    enforcementLayer: 'API Middleware (requireRole)'
  },
  {
    capability: 'Approve/reject submitted courses',
    student: false,
    instructor: false,
    admin: true,
    enforcementLayer: 'API Middleware (requireRole)'
  },
  {
    capability: 'Manage user roles',
    student: false,
    instructor: false,
    admin: true,
    enforcementLayer: 'API Middleware (requireRole)'
  },
  {
    capability: 'Suspend/delete accounts',
    student: false,
    instructor: false,
    admin: true,
    enforcementLayer: 'API Middleware (requireRole)'
  },
  {
    capability: 'Moderate forum content',
    student: false,
    instructor: 'Yes (own course threads)',
    admin: 'Yes (platform-wide)',
    enforcementLayer: 'Dual Layer (Role + Ownership)'
  },
  {
    capability: 'Manage revenue/subscriptions',
    student: false,
    instructor: false,
    admin: true,
    enforcementLayer: 'API Middleware (requireRole)'
  }
];

/**
 * Middleware: requireRole()
 * Enforces role checks at the API gateway / express route layer
 */
export const requireRole = (...allowedRoles: UserRoleType[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication token required before role verification'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Forbidden',
        message: `Role '${req.user.role}' is not authorized. Allowed roles: [${allowedRoles.join(', ')}]`,
        requiredRoles: allowedRoles,
        userRole: req.user.role
      });
    }

    next();
  };
};

/**
 * Service Layer / Helper: verifyCourseOwnership()
 * Enforces that an instructor owns the course, while admins bypass ownership check.
 */
export async function verifyCourseOwnership(
  courseId: string,
  userId: string,
  userRole: UserRoleType,
  findCourseInstructorId: (id: string) => Promise<string | null>
): Promise<{ allowed: boolean; reason?: string }> {
  // Admins have platform-wide access
  if (userRole === 'admin') {
    return { allowed: true };
  }

  // Only instructors can own courses; students cannot
  if (userRole !== 'instructor') {
    return {
      allowed: false,
      reason: 'Only instructors and platform administrators can modify course contents.'
    };
  }

  const instructorId = await findCourseInstructorId(courseId);
  if (!instructorId) {
    return { allowed: false, reason: 'Course not found.' };
  }

  if (instructorId !== userId) {
    return {
      allowed: false,
      reason: 'Forbidden: You do not own this course. Mutation denied at service layer.'
    };
  }

  return { allowed: true };
}
