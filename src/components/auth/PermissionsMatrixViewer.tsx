import React, { useState, useMemo } from 'react';
import { UserRole } from '../../types/lms';
import { useLMS } from '../../context/LMSContext';

export interface CapabilityItem {
  id: string;
  category: 'Auth & Catalog' | 'Student Learning' | 'Authoring & Grading' | 'Administration' | 'Communication';
  capability: string;
  student: 'Yes' | 'No';
  instructor: 'Yes' | 'No' | 'Yes (own course)' | 'Yes (as reviewer)' | 'Yes (own course threads)';
  admin: 'Yes' | 'No' | 'Yes (any course)' | 'Yes (platform-wide)';
  enforcement: 'API Middleware (requireRole)' | 'Dual Layer (Role + Ownership)' | 'Public Gateway';
  middlewareCode: string;
  description: string;
}

export const CAPABILITIES_DATA: CapabilityItem[] = [
  {
    id: 'auth-login',
    category: 'Auth & Catalog',
    capability: 'Register / Login',
    student: 'Yes',
    instructor: 'Yes',
    admin: 'Yes',
    enforcement: 'Public Gateway',
    middlewareCode: 'app.post("/auth/login", authController.login)',
    description: 'Any user can register and authenticate via JWT access/refresh token pairs.'
  },
  {
    id: 'course-catalog',
    category: 'Auth & Catalog',
    capability: 'Browse course catalog',
    student: 'Yes',
    instructor: 'Yes',
    admin: 'Yes',
    enforcement: 'Public Gateway',
    middlewareCode: 'app.get("/courses", courseController.listPublishedCourses)',
    description: 'Public catalog of approved courses with category filtering, search, and pagination.'
  },
  {
    id: 'enroll-course',
    category: 'Student Learning',
    capability: 'Enroll in a course',
    student: 'Yes',
    instructor: 'No',
    admin: 'No',
    enforcement: 'API Middleware (requireRole)',
    middlewareCode: 'requireRole("student")',
    description: 'Students enroll themselves into courses to track progress and unlock lecture modules.'
  },
  {
    id: 'watch-lectures',
    category: 'Student Learning',
    capability: 'Watch lectures / track progress',
    student: 'Yes',
    instructor: 'No',
    admin: 'No',
    enforcement: 'API Middleware (requireRole)',
    middlewareCode: 'requireRole("student"), verifyEnrollment()',
    description: 'Access video stream chunks, send timestamp heartbeat, and track completion progress.'
  },
  {
    id: 'notes-bookmarks',
    category: 'Student Learning',
    capability: 'Create notes/bookmarks',
    student: 'Yes',
    instructor: 'No',
    admin: 'No',
    enforcement: 'API Middleware (requireRole)',
    middlewareCode: 'requireRole("student")',
    description: 'Save synchronized notes and timestamped bookmarks tied to personal student profile.'
  },
  {
    id: 'submit-assignments',
    category: 'Student Learning',
    capability: 'Submit assignments',
    student: 'Yes',
    instructor: 'No',
    admin: 'No',
    enforcement: 'API Middleware (requireRole)',
    middlewareCode: 'requireRole("student"), checkSubmissionDeadline()',
    description: 'Upload assignment solution files (PDF, ZIP, code) before deadline cutoff.'
  },
  {
    id: 'attempt-quizzes',
    category: 'Student Learning',
    capability: 'Attempt quizzes',
    student: 'Yes',
    instructor: 'No',
    admin: 'No',
    enforcement: 'API Middleware (requireRole)',
    middlewareCode: 'requireRole("student"), verifyAttemptLimit()',
    description: 'Take timed course quizzes with automated scoring and feedback on submission.'
  },
  {
    id: 'ai-tutor-chat',
    category: 'Student Learning',
    capability: 'Use AI tutor chat',
    student: 'Yes',
    instructor: 'Yes (as reviewer)',
    admin: 'No',
    enforcement: 'API Middleware (requireRole)',
    middlewareCode: 'requireRole("student", "instructor")',
    description: 'Students get RAG-grounded tutor explanations; instructors review prompts & responses for quality.'
  },
  {
    id: 'create-edit-course',
    category: 'Authoring & Grading',
    capability: 'Create/edit own course',
    student: 'No',
    instructor: 'Yes (own course)',
    admin: 'Yes (any course)',
    enforcement: 'Dual Layer (Role + Ownership)',
    middlewareCode: 'requireRole("instructor", "admin") => verifyCourseOwnership()',
    description: 'Instructors can only edit their own courses; admins can manage and edit any course system-wide.'
  },
  {
    id: 'upload-lectures',
    category: 'Authoring & Grading',
    capability: 'Upload lecture material',
    student: 'No',
    instructor: 'Yes (own course)',
    admin: 'Yes',
    enforcement: 'Dual Layer (Role + Ownership)',
    middlewareCode: 'requireRole("instructor", "admin") => verifyCourseOwnership()',
    description: 'Multipart video upload and transcript ingestion for courses owned by the instructor.'
  },
  {
    id: 'ai-quiz-gen',
    category: 'Authoring & Grading',
    capability: 'Create/approve AI-generated quiz',
    student: 'No',
    instructor: 'Yes (own course)',
    admin: 'Yes',
    enforcement: 'Dual Layer (Role + Ownership)',
    middlewareCode: 'requireRole("instructor", "admin") => verifyCourseOwnership()',
    description: 'Generate questions from lecture transcript embeddings and publish them to students.'
  },
  {
    id: 'grade-assignments',
    category: 'Authoring & Grading',
    capability: 'Grade assignments',
    student: 'No',
    instructor: 'Yes (own course)',
    admin: 'Yes',
    enforcement: 'Dual Layer (Role + Ownership)',
    middlewareCode: 'requireRole("instructor", "admin") => verifyAssignmentCourseOwnership()',
    description: 'Assign scores, leave rubric feedback, and return graded evaluations to students.'
  },
  {
    id: 'own-course-analytics',
    category: 'Authoring & Grading',
    capability: 'View own-course analytics',
    student: 'No',
    instructor: 'Yes',
    admin: 'Yes',
    enforcement: 'Dual Layer (Role + Ownership)',
    middlewareCode: 'requireRole("instructor", "admin") => scopeAnalyticsToOwner()',
    description: 'Inspect retention curves, quiz score distributions, and engagement drop-off for own courses.'
  },
  {
    id: 'platform-analytics',
    category: 'Administration',
    capability: 'View platform-wide analytics',
    student: 'No',
    instructor: 'No',
    admin: 'Yes',
    enforcement: 'API Middleware (requireRole)',
    middlewareCode: 'requireRole("admin")',
    description: 'Global user growth, total storage consumption, active LLM token usage, and system health.'
  },
  {
    id: 'approve-reject-courses',
    category: 'Administration',
    capability: 'Approve/reject submitted courses',
    student: 'No',
    instructor: 'No',
    admin: 'Yes',
    enforcement: 'API Middleware (requireRole)',
    middlewareCode: 'requireRole("admin")',
    description: 'Review pending course submissions from instructors and grant public catalog listing.'
  },
  {
    id: 'manage-user-roles',
    category: 'Administration',
    capability: 'Manage user roles',
    student: 'No',
    instructor: 'No',
    admin: 'Yes',
    enforcement: 'API Middleware (requireRole)',
    middlewareCode: 'requireRole("admin")',
    description: 'Promote users to instructor, grant admin privileges, or adjust institutional department roles.'
  },
  {
    id: 'suspend-accounts',
    category: 'Administration',
    capability: 'Suspend/delete accounts',
    student: 'No',
    instructor: 'No',
    admin: 'Yes',
    enforcement: 'API Middleware (requireRole)',
    middlewareCode: 'requireRole("admin")',
    description: 'Enforce trust & safety, revoke access tokens, and comply with GDPR Right-to-be-Forgotten.'
  },
  {
    id: 'moderate-forums',
    category: 'Communication',
    capability: 'Moderate forum content',
    student: 'No',
    instructor: 'Yes (own course threads)',
    admin: 'Yes (platform-wide)',
    enforcement: 'Dual Layer (Role + Ownership)',
    middlewareCode: 'requireRole("instructor", "admin") => verifyThreadScope()',
    description: 'Delete inappropriate questions, lock discussion threads, and highlight endorsed answers.'
  },
  {
    id: 'manage-subscriptions',
    category: 'Administration',
    capability: 'Manage revenue/subscriptions',
    student: 'No',
    instructor: 'No',
    admin: 'Yes',
    enforcement: 'API Middleware (requireRole)',
    middlewareCode: 'requireRole("admin")',
    description: 'Stripe webhook reconciliations, payout schedules, instructor revenue shares, and invoice logs.'
  }
];

export const PermissionsMatrixViewer: React.FC = () => {
  const { user } = useLMS();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [roleFilter, setRoleFilter] = useState<'All' | 'Student' | 'Instructor' | 'Admin'>('All');
  const [copiedState, setCopiedState] = useState(false);

  // Simulator state
  const [simRole, setSimRole] = useState<'student' | 'instructor' | 'admin' | 'guest'>(
    user ? (user.role.toLowerCase() as 'student' | 'instructor' | 'admin') : 'instructor'
  );
  const [simIsOwner, setSimIsOwner] = useState<boolean>(true);
  const [simCapabilityId, setSimCapabilityId] = useState<string>('create-edit-course');

  const categories = ['All', 'Auth & Catalog', 'Student Learning', 'Authoring & Grading', 'Administration', 'Communication'];

  const filteredCapabilities = useMemo(() => {
    return CAPABILITIES_DATA.filter((cap) => {
      const matchesSearch =
        cap.capability.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cap.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cap.middlewareCode.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat = selectedCategory === 'All' || cap.category === selectedCategory;

      let matchesRole = true;
      if (roleFilter === 'Student') {
        matchesRole = cap.student === 'Yes';
      } else if (roleFilter === 'Instructor') {
        matchesRole = cap.instructor !== 'No';
      } else if (roleFilter === 'Admin') {
        matchesRole = cap.admin !== 'No';
      }

      return matchesSearch && matchesCat && matchesRole;
    });
  }, [searchQuery, selectedCategory, roleFilter]);

  // Selected capability in simulator
  const activeSimCapability = useMemo(() => {
    return CAPABILITIES_DATA.find((c) => c.id === simCapabilityId) || CAPABILITIES_DATA[0];
  }, [simCapabilityId]);

  // Calculate simulator evaluation result
  const simResult = useMemo(() => {
    if (simRole === 'guest') {
      if (activeSimCapability.enforcement === 'Public Gateway') {
        return {
          allowed: true,
          status: 200,
          label: 'Allowed (Public)',
          badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          reason: 'This endpoint does not require an Authorization Bearer JWT.'
        };
      }
      return {
        allowed: false,
        status: 401,
        label: '401 Unauthorized',
        badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
        reason: 'Guest is unauthenticated. Token missing in Authorization header.'
      };
    }

    if (simRole === 'student') {
      if (activeSimCapability.student === 'Yes') {
        return {
          allowed: true,
          status: 200,
          label: 'Allowed (200 OK)',
          badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          reason: 'Student role authorized at middleware layer.'
        };
      }
      return {
        allowed: false,
        status: 403,
        label: '403 Forbidden',
        badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
        reason: 'Students are strictly forbidden from instructor and administrative actions.'
      };
    }

    if (simRole === 'instructor') {
      const perm = activeSimCapability.instructor;
      if (perm === 'No') {
        return {
          allowed: false,
          status: 403,
          label: '403 Forbidden',
          badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
          reason: 'Instructors cannot perform student-only (enroll, take quizzes) or platform admin actions.'
        };
      }
      if (perm === 'Yes (own course)' || perm === 'Yes (own course threads)') {
        if (simIsOwner) {
          return {
            allowed: true,
            status: 200,
            label: 'Allowed (Ownership Verified)',
            badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
            reason: 'Role check passed and Service Layer verified instructor owns this course entity.'
          };
        } else {
          return {
            allowed: false,
            status: 403,
            label: '403 Forbidden (Not Owner)',
            badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
            reason: 'Role check passed, but Service Layer rejected: Instructor does NOT own this course.'
          };
        }
      }
      return {
        allowed: true,
        status: 200,
        label: 'Allowed (200 OK)',
        badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
        reason: 'Instructor authorized for this general capability.'
      };
    }

    if (simRole === 'admin') {
      const perm = activeSimCapability.admin;
      if (perm === 'No') {
        return {
          allowed: false,
          status: 403,
          label: '403 Forbidden',
          badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
          reason: 'Admins do not enroll as students or chat with student tutors directly.'
        };
      }
      return {
        allowed: true,
        status: 200,
        label: 'Allowed (Admin Privilege)',
        badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
        reason: 'Administrator bypasses ownership verification and possesses global platform authority.'
      };
    }

    return { allowed: false, status: 500, label: 'Unknown', badgeColor: 'bg-slate-500/10 text-slate-400 border-slate-500/30', reason: '' };
  }, [simRole, simIsOwner, activeSimCapability]);

  const copyMarkdownTable = () => {
    let md = `| Capability | Student | Instructor | Admin | Enforcement Layer |\n`;
    md += `| :--- | :---: | :---: | :---: | :--- |\n`;
    CAPABILITIES_DATA.forEach((c) => {
      md += `| ${c.capability} | ${c.student} | ${c.instructor} | ${c.admin} | ${c.enforcement} |\n`;
    });
    navigator.clipboard.writeText(md);
    setCopiedState(true);
    setTimeout(() => setCopiedState(false), 2000);
  };

  const renderBadge = (val: string) => {
    if (val === 'Yes') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span>✅</span> Yes
        </span>
      );
    }
    if (val === 'No') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-[#6B7280] border border-gray-200">
          <span>✕</span> No
        </span>
      );
    }
    if (val.includes('own course') || val.includes('threads')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
          <span>✅</span> {val}
        </span>
      );
    }
    if (val.includes('reviewer')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
          <span>✅</span> {val}
        </span>
      );
    }
    if (val.includes('any course') || val.includes('platform-wide')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-[#DC2626] border border-red-200">
          <span>🛡️</span> {val}
        </span>
      );
    }
    return <span className="text-xs text-[#4B5563]">{val}</span>;
  };

  return (
    <div className="space-y-8 text-[#1F2937] animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xs">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-[#DC2626] text-xs font-mono font-semibold">
              <span>🛡️</span> Section 11: Enterprise RBAC Matrix
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] tracking-tight">
              User Roles & Permissions Matrix
            </h1>
            <p className="text-sm text-[#4B5563] leading-relaxed">
              Two-tiered enforcement architecture: <strong className="text-[#DC2626] font-semibold">API Middleware (requireRole)</strong> filters unauthorized roles before database calls, while the <strong className="text-[#DC2626] font-semibold">Service Layer</strong> validates fine-grained entity ownership (e.g. instructor course isolation).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={copyMarkdownTable}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-[#F9FAFB] text-[#1F2937] text-xs font-bold border border-[#E5E7EB] transition-all flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <span>{copiedState ? '✅' : '📋'}</span>
              <span>{copiedState ? 'Copied Markdown!' : 'Copy Markdown Matrix'}</span>
            </button>
            <a
              href="/docs/prd.md"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <span>📄</span> View PRD Doc
            </a>
          </div>
        </div>

        {/* Quick Highlights Counter */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-[#E5E7EB]">
          <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl p-3.5">
            <div className="text-xs text-[#6B7280] font-medium flex items-center gap-1.5">
              <span>👥</span> Defined Roles
            </div>
            <div className="text-xl font-bold text-[#1F2937] mt-1">3 Personas</div>
            <div className="text-[11px] text-[#DC2626] mt-0.5">student • instructor • admin</div>
          </div>
          <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl p-3.5">
            <div className="text-xs text-[#6B7280] font-medium flex items-center gap-1.5">
              <span>✅</span> Total Capabilities
            </div>
            <div className="text-xl font-bold text-[#1F2937] mt-1">{CAPABILITIES_DATA.length} Actions</div>
            <div className="text-[11px] text-emerald-700 mt-0.5">Strictly mapped & tested</div>
          </div>
          <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl p-3.5">
            <div className="text-xs text-[#6B7280] font-medium flex items-center gap-1.5">
              <span>🔒</span> Dual-Layer Checks
            </div>
            <div className="text-xl font-bold text-[#1F2937] mt-1">6 Endpoints</div>
            <div className="text-[11px] text-purple-700 mt-0.5">Role + Ownership mutation guard</div>
          </div>
          <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl p-3.5">
            <div className="text-xs text-[#6B7280] font-medium flex items-center gap-1.5">
              <span>💻</span> Enforcement Guard
            </div>
            <div className="text-xl font-bold text-[#1F2937] mt-1">requireRole()</div>
            <div className="text-[11px] text-amber-700 mt-0.5">Express API middleware</div>
          </div>
        </div>
      </div>

      {/* Interactive Role Simulator & Permission Sandbox */}
      <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 sm:p-7 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E7EB]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg">✨</span>
              <h2 className="text-lg font-bold text-[#1F2937]">Live Role & Ownership Enforcement Simulator</h2>
            </div>
            <p className="text-xs text-[#4B5563] mt-1">
              Select a persona and capability to preview real-time evaluation across API Middleware and Service Layer.
            </p>
          </div>
          <div className="text-xs font-mono px-3 py-1.5 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] text-[#6B7280]">
            Interactive Testbed
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls */}
          <div className="lg:col-span-6 space-y-5">
            {/* Persona Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#1F2937] flex items-center gap-1.5">
                <span>👥</span> Test As Active Persona:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['student', 'instructor', 'admin', 'guest'] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setSimRole(r)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer border ${
                      simRole === r
                        ? 'bg-[#DC2626] text-white border-[#DC2626] shadow-xs'
                        : 'bg-[#F9FAFB] text-[#4B5563] border-[#E5E7EB] hover:text-[#1F2937]'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Ownership Toggle (Only relevant for instructor) */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#1F2937] flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span>🔒</span> Resource Ownership State:
                </span>
                {simRole !== 'instructor' && (
                  <span className="text-[10px] text-[#6B7280] font-normal">
                    (Ignored: Admins bypass, Students never own)
                  </span>
                )}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setSimIsOwner(true)}
                  disabled={simRole !== 'instructor'}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                    simIsOwner && simRole === 'instructor'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                      : 'bg-[#F9FAFB] text-[#6B7280] border-[#E5E7EB] disabled:opacity-40 disabled:cursor-not-allowed'
                  }`}
                >
                  ✓ User Owns Resource
                </button>
                <button
                  onClick={() => setSimIsOwner(false)}
                  disabled={simRole !== 'instructor'}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                    !simIsOwner && simRole === 'instructor'
                      ? 'bg-red-50 text-[#DC2626] border-red-200'
                      : 'bg-[#F9FAFB] text-[#6B7280] border-[#E5E7EB] disabled:opacity-40 disabled:cursor-not-allowed'
                  }`}
                >
                  ✕ Different Instructor Owns
                </button>
              </div>
            </div>

            {/* Capability Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#1F2937] flex items-center gap-1.5">
                <span>🎯</span> Target Capability to Execute:
              </label>
              <select
                value={simCapabilityId}
                onChange={(e) => setSimCapabilityId(e.target.value)}
                className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-3.5 py-2.5 text-xs text-[#1F2937] focus:outline-none focus:border-[#DC2626] transition-colors"
              >
                {CAPABILITIES_DATA.map((c) => (
                  <option key={c.id} value={c.id}>
                    [{c.category}] {c.capability}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Real-time Simulator Evaluation Box */}
          <div className="lg:col-span-6 bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-[#6B7280]">
                  Enforcement Result
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${simResult.badgeColor}`}>
                  {simResult.label}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-[#E5E7EB] space-y-2">
                <div className="text-xs font-bold text-[#1F2937] flex items-center gap-2">
                  <span className="text-[#DC2626]">Target Action:</span> {activeSimCapability.capability}
                </div>
                <div className="text-xs text-[#4B5563] leading-relaxed">
                  {simResult.reason}
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="text-[11px] font-mono text-[#6B7280] uppercase">Simulated Middleware Execution:</div>
                <div className="bg-white rounded-xl p-3 font-mono text-xs text-[#1F2937] border border-[#E5E7EB] overflow-x-auto">
                  <code>{activeSimCapability.middlewareCode}</code>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E5E7EB] flex items-center justify-between text-xs text-[#6B7280]">
              <span className="flex items-center gap-1.5">
                <span>💻</span> Layer: <strong className="text-[#1F2937]">{activeSimCapability.enforcement}</strong>
              </span>
              <span className="font-mono text-[#DC2626] font-bold">HTTP {simResult.status}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Capabilities Table with Filters */}
      <div className="bg-white border border-[#E5E7EB] rounded-3xl overflow-hidden shadow-xs">
        {/* Table Controls Bar */}
        <div className="p-5 sm:p-6 border-b border-[#E5E7EB] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span>🛡️</span>
              <h2 className="text-base font-bold text-[#1F2937]">Section 11 Matrix: All Capabilities</h2>
              <span className="text-xs font-mono text-[#DC2626] bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                {filteredCapabilities.length} / {CAPABILITIES_DATA.length}
              </span>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs">🔍</span>
              <input
                type="text"
                placeholder="Search capability or middleware..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl pl-10 pr-4 py-2 text-xs text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:border-[#DC2626] transition-colors"
              />
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-semibold text-[#6B7280] mr-1 flex items-center gap-1">
                <span>📁</span> Category:
              </span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#DC2626] text-white font-bold'
                      : 'bg-[#F9FAFB] text-[#4B5563] hover:text-[#1F2937] border border-[#E5E7EB]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-[#6B7280] mr-1">Role Filter:</span>
              {(['All', 'Student', 'Instructor', 'Admin'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setRoleFilter(r)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    roleFilter === r
                      ? 'bg-red-50 text-[#DC2626] border border-red-200 font-bold'
                      : 'bg-[#F9FAFB] text-[#4B5563] hover:text-[#1F2937] border border-[#E5E7EB]'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop & Mobile Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB] text-[#4B5563] font-mono text-[11px] uppercase tracking-wider">
                <th className="py-3.5 px-6">Capability Action</th>
                <th className="py-3.5 px-4 text-center">
                  <span className="inline-flex items-center gap-1 text-[#1F2937]">
                    <span>🎓</span> Student
                  </span>
                </th>
                <th className="py-3.5 px-4 text-center">
                  <span className="inline-flex items-center gap-1 text-[#1F2937]">
                    <span>📖</span> Instructor
                  </span>
                </th>
                <th className="py-3.5 px-4 text-center">
                  <span className="inline-flex items-center gap-1 text-[#1F2937]">
                    <span>⚙️</span> Admin
                  </span>
                </th>
                <th className="py-3.5 px-6">Enforcement Layer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {filteredCapabilities.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-[#F9FAFB] transition-colors group cursor-pointer"
                  onClick={() => setSimCapabilityId(item.id)}
                >
                  <td className="py-4 px-6">
                    <div className="font-semibold text-[#1F2937] group-hover:text-[#DC2626] transition-colors">
                      {item.capability}
                    </div>
                    <div className="text-[11px] text-[#4B5563] mt-0.5 line-clamp-1">
                      {item.description}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center whitespace-nowrap">
                    {renderBadge(item.student)}
                  </td>
                  <td className="py-4 px-4 text-center whitespace-nowrap">
                    {renderBadge(item.instructor)}
                  </td>
                  <td className="py-4 px-4 text-center whitespace-nowrap">
                    {renderBadge(item.admin)}
                  </td>
                  <td className="py-4 px-6">
                    <div className="inline-flex items-center gap-1.5 font-mono text-[11px] text-[#1F2937] bg-[#F9FAFB] px-2.5 py-1 rounded-md border border-[#E5E7EB]">
                      <span>💻</span>
                      {item.enforcement}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enforcement Architecture & Code Reference */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Layer 1: API Middleware Explanation */}
        <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-[#DC2626] border border-red-200 flex items-center justify-center text-lg">
              💻
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1F2937]">Layer 1: requireRole() Middleware</h3>
              <p className="text-xs text-[#6B7280] font-mono">backend/src/middleware/rbac.ts</p>
            </div>
          </div>
          <p className="text-xs text-[#4B5563] leading-relaxed">
            Every incoming HTTP request with a Bearer JWT is validated by the Express middleware. If the authenticated persona does not match the route’s allowed roles, execution terminates with <code className="text-[#DC2626] font-mono">403 Forbidden</code> before hitting the database.
          </p>
          <div className="bg-[#F9FAFB] rounded-2xl p-4 font-mono text-xs text-[#1F2937] border border-[#E5E7EB] overflow-x-auto space-y-1">
            <div className="text-[#6B7280]">// Route definitions in backend/src/modules/courses</div>
            <div>router.post('/', requireRole('instructor'), createCourse);</div>
            <div>router.post('/:id/approve', requireRole('admin'), approveCourse);</div>
            <div>router.post('/:id/enroll', requireRole('student'), enrollCourse);</div>
          </div>
        </div>

        {/* Layer 2: Service Layer Ownership */}
        <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center text-lg">
              🗄️
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1F2937]">Layer 2: Service Layer Ownership Check</h3>
              <p className="text-xs text-[#6B7280] font-mono">verifyCourseOwnership(courseId, userId)</p>
            </div>
          </div>
          <p className="text-xs text-[#4B5563] leading-relaxed">
            Role check alone is insufficient for multi-tenant course authoring. Before mutations (updating lectures, publishing quizzes, grading assignments), the service queries <code className="text-[#1F2937] font-mono">courses.instructor_id</code>. Admins bypass; other instructors are rejected.
          </p>
          <div className="bg-[#F9FAFB] rounded-2xl p-4 font-mono text-xs text-[#1F2937] border border-[#E5E7EB] overflow-x-auto space-y-1">
            <div className="text-[#6B7280]">// Service layer execution guard</div>
            <div>if (user.role === 'admin') return true;</div>
            <div>const course = await db.query('SELECT instructor_id FROM courses WHERE id = $1', [courseId]);</div>
            <div>if (course.instructor_id !== user.id) throw new ForbiddenException();</div>
          </div>
        </div>
      </div>
    </div>
  );
};
