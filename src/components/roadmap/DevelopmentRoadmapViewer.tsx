import React, { useState, useMemo } from 'react';
import { useLMS } from '../../context/LMSContext';

export interface RoadmapDay {
  dayNumber: number;
  dayLabel: string;
  week: 1 | 2 | 3 | 4;
  title: string;
  tasks: string[];
  category: 'DevOps & Foundation' | 'Database' | 'Backend API' | 'Frontend UI' | 'Video & Learning Core' | 'Assessment & Gamification' | 'AI Tutor & RAG' | 'Admin & Operations';
  isBuffer: boolean;
  estHours: number;
  status: 'completed' | 'in_progress' | 'scheduled';
  linkedView?: string;
  deliverables: string[];
}

export interface RoadmapWeek {
  week: 1 | 2 | 3 | 4;
  title: string;
  subtitle: string;
  milestone: string;
  days: number[];
  colorTheme: {
    badge: string;
    border: string;
    glow: string;
    accent: string;
  };
  keyFeatures: string[];
}

export const WEEKS_DATA: RoadmapWeek[] = [
  {
    week: 1,
    title: 'Foundation, Auth, Core Data Layer',
    subtitle: 'Monorepo Setup, Postgres DB, JWT Auth, Course Catalog & Student UI',
    milestone: 'Users can register, log in, and browse/enroll in courses. Instructor can create a course.',
    days: [1, 2, 3, 4, 5, 6, 7],
    colorTheme: {
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      border: 'border-emerald-300',
      glow: 'shadow-xs',
      accent: 'text-emerald-700'
    },
    keyFeatures: [
      'Docker Compose (Postgres, Redis)',
      'Schema Migrations (Users, Roles, Courses, Modules)',
      'JWT Authentication & RBAC Middleware',
      'Course CRUD & Filterable Catalog API',
      'React SPA Scaffold & Auth Pages',
      'Buffer & E2E Integration Testing'
    ]
  },
  {
    week: 2,
    title: 'Learning Core: Lectures, Progress, Assignments, Quizzes',
    subtitle: 'Video Streaming, Realtime Progress, Assessment Engine & Gamification',
    milestone: 'A student can complete a full course loop: watch, note, submit assignment, take quiz, earn a certificate.',
    days: [8, 9, 10, 11, 12, 13, 14],
    colorTheme: {
      badge: 'bg-blue-50 text-blue-700 border-blue-200',
      border: 'border-blue-300',
      glow: 'shadow-xs',
      accent: 'text-blue-700'
    },
    keyFeatures: [
      'S3/Blob Video Upload & Adaptive Playback',
      'Progress Synchronization, Bookmarks & Notes',
      'Assignment Submission & Manual Grading',
      'Quiz Builder & Realtime Auto-grading Engine',
      'Certificate PDF Generation, Badges & Streaks',
      'Instructor Drop-off Analytics & Buffer'
    ]
  },
  {
    week: 3,
    title: 'AI Tutor & Recommendations',
    subtitle: 'FastAPI Microservice, pgvector RAG Pipeline, Synthesis & Study Plans',
    milestone: 'AI tutor answers course-grounded questions with citations; auto-generates quizzes, summaries, flashcards, and a study plan.',
    days: [15, 16, 17, 18, 19, 20, 21],
    colorTheme: {
      badge: 'bg-purple-50 text-purple-700 border-purple-200',
      border: 'border-purple-300',
      glow: 'shadow-xs',
      accent: 'text-purple-700'
    },
    keyFeatures: [
      'FastAPI Microservice + Gemini LLM Client',
      'Transcript Ingestion & pgvector Embeddings',
      'RAG Contextual Chat with Source Citations',
      'Lesson Summarization & Smart Flashcards',
      'Automated Quiz Generation & Review UI',
      'Adaptive Difficulty & Mastery Study Plans'
    ]
  },
  {
    week: 4,
    title: 'Admin Panel, Discussions, Polish, Deployment',
    subtitle: 'Governance, Moderation, Telemetry, Security Hardening & Production Rollout',
    milestone: 'Production-ready LMS with all user roles active, AI tutor live, admin controls enforced, and zero critical vulnerabilities.',
    days: [22, 23, 24, 25, 26, 27, 28],
    colorTheme: {
      badge: 'bg-amber-50 text-amber-700 border-amber-200',
      border: 'border-amber-300',
      glow: 'shadow-xs',
      accent: 'text-amber-700'
    },
    keyFeatures: [
      'Admin Panel & Course Approval Workflow',
      'Platform-wide Telemetry & Moderation',
      'Threaded Discussions & Notification Worker',
      'E2E Bug Bash & Query Performance Tuning',
      'Security Hardening, Rate Limiting & CORS',
      'Production Container Deployment & Smoke Tests'
    ]
  }
];

export const ROADMAP_DAYS_DATA: RoadmapDay[] = [
  // WEEK 1
  {
    dayNumber: 1,
    dayLabel: 'Day 1',
    week: 1,
    title: 'Monorepo Setup & Containerized Environment',
    category: 'DevOps & Foundation',
    tasks: ['Repo setup, monorepo/folder structure, Docker Compose (Postgres, Redis), CI skeleton'],
    isBuffer: false,
    estHours: 6.5,
    status: 'completed',
    linkedView: 'folder_structure',
    deliverables: [
      'Monorepo workspace (frontend, backend, ai-service, infra)',
      'docker-compose.yml with postgres:16 and redis:7-alpine',
      'GitHub Actions CI workflow skeleton (.github/workflows/ci.yml)'
    ]
  },
  {
    dayNumber: 2,
    dayLabel: 'Day 2',
    week: 1,
    title: 'Relational Database Schema & Migrations',
    category: 'Database',
    tasks: ['Database schema migration scripts for users/roles/courses/modules/lectures'],
    isBuffer: false,
    estHours: 7,
    status: 'completed',
    linkedView: 'schema',
    deliverables: [
      'DDL SQL migrations for users, roles, courses, modules, lectures',
      'Foreign key constraints and indexes for high-throughput reads',
      'Prisma/Drizzle/SQL migration runner configuration'
    ]
  },
  {
    dayNumber: 3,
    dayLabel: 'Day 3',
    week: 1,
    title: 'Authentication & Dual-Layer RBAC Middleware',
    category: 'Backend API',
    tasks: ['Auth module: register, login, JWT issuance, refresh token, RBAC middleware'],
    isBuffer: false,
    estHours: 6.5,
    status: 'completed',
    linkedView: 'permissions_matrix',
    deliverables: [
      'POST /auth/register, POST /auth/login, POST /auth/refresh, POST /auth/logout',
      'Bcrypt password hashing + JWT access (15m) & refresh (7d) tokens',
      'requireRole() middleware + verifyCourseOwnership() guard'
    ]
  },
  {
    dayNumber: 4,
    dayLabel: 'Day 4',
    week: 1,
    title: 'Course Management CRUD & Public Catalog API',
    category: 'Backend API',
    tasks: ['Course CRUD APIs + catalog listing/filtering, pagination'],
    isBuffer: false,
    estHours: 6.5,
    status: 'completed',
    linkedView: 'catalog',
    deliverables: [
      'GET /courses (filters: category, difficulty, search query, page, limit)',
      'GET /courses/:id with eager-loaded modules and lectures',
      'POST /courses, PUT /courses/:id, POST /courses/:id/modules (owner enforced)'
    ]
  },
  {
    dayNumber: 5,
    dayLabel: 'Day 5',
    week: 1,
    title: 'Frontend Scaffold, Routing & Protected Shell',
    category: 'Frontend UI',
    tasks: ['Frontend scaffold (routing, layout, auth pages, protected routes)'],
    isBuffer: false,
    estHours: 7,
    status: 'completed',
    linkedView: 'login',
    deliverables: [
      'Vite + React 19 + Tailwind CSS design system with dark sci-fi aesthetic',
      'Client-side Auth Provider + token storage + RouteGuard protection',
      'Navigation shell (Sidebar, Navbar, Quick Role Switcher)'
    ]
  },
  {
    dayNumber: 6,
    dayLabel: 'Days 6-7',
    week: 1,
    title: 'Student Dashboard, Course Catalog UI & Testing Buffer',
    category: 'Frontend UI',
    tasks: ['Student dashboard UI + course catalog UI wired to backend; buffer/testing'],
    isBuffer: true,
    estHours: 13,
    status: 'completed',
    linkedView: 'dashboard',
    deliverables: [
      'Student Dashboard UI with course cards, progress bars, and upcoming deadlines',
      'Course Catalog UI with live search, topic filtering, and instant enrollment',
      'Integration buffer to absorb API schema changes; Milestone 1 verified'
    ]
  },

  // WEEK 2
  {
    dayNumber: 8,
    dayLabel: 'Day 8',
    week: 2,
    title: 'Video Streaming & Lecture Player Infrastructure',
    category: 'Video & Learning Core',
    tasks: ['Video upload to object storage + streaming playback in course player'],
    isBuffer: false,
    estHours: 6.5,
    status: 'completed',
    linkedView: 'course_player',
    deliverables: [
      'S3 presigned URL generation for lecture video uploads',
      'Responsive HTML5 video player with playback rate, timestamps, and fullscreen',
      'Lecture sidebar navigation with module hierarchy'
    ]
  },
  {
    dayNumber: 9,
    dayLabel: 'Day 9',
    week: 2,
    title: 'Real-Time Progress Tracking, Notes & Bookmarks',
    category: 'Video & Learning Core',
    tasks: ['Lecture progress tracking, notes, bookmarks'],
    isBuffer: false,
    estHours: 6.5,
    status: 'completed',
    linkedView: 'course_player',
    deliverables: [
      'POST /lectures/:id/progress (watched seconds, completion percent, mark complete)',
      'POST /lectures/:id/notes (timestamp-linked personal markdown notes)',
      'POST /lectures/:id/bookmarks (instant video jump points)'
    ]
  },
  {
    dayNumber: 10,
    dayLabel: 'Day 10',
    week: 2,
    title: 'Assignment Creation, Submission & Grading Flow',
    category: 'Assessment & Gamification',
    tasks: ['Assignment creation + submission + manual grading flow'],
    isBuffer: false,
    estHours: 7,
    status: 'completed',
    linkedView: 'dashboard',
    deliverables: [
      'Instructor assignment authoring modal with attachments and rubrics',
      'Student file upload submission with deadline checking',
      'Instructor grading interface with numerical scores and qualitative feedback'
    ]
  },
  {
    dayNumber: 11,
    dayLabel: 'Day 11',
    week: 2,
    title: 'Interactive Quiz Builder & Auto-Grading Engine',
    category: 'Assessment & Gamification',
    tasks: ['Quiz builder (manual) + attempt + auto-grading engine for objective questions'],
    isBuffer: false,
    estHours: 7,
    status: 'completed',
    linkedView: 'dashboard',
    deliverables: [
      'Multiple-choice, true/false, and multiple-select question authoring',
      'Student quiz attempt session with countdown timer and state recovery',
      'Instant server-side grading engine with explanation breakdown'
    ]
  },
  {
    dayNumber: 12,
    dayLabel: 'Day 12',
    week: 2,
    title: 'Certificates (PDF), Gamification Badges & Streak Worker',
    category: 'Assessment & Gamification',
    tasks: ['Certificates (PDF generation), badges, streak logic (daily cron job)'],
    isBuffer: false,
    estHours: 6.5,
    status: 'completed',
    linkedView: 'dashboard',
    deliverables: [
      'Course completion verification and automated PDF certificate issuance',
      'Achievement badges (First Course, Quiz Master, Night Owl)',
      'Daily streak calculation cron with timezone normalization'
    ]
  },
  {
    dayNumber: 13,
    dayLabel: 'Days 13-14',
    week: 2,
    title: 'Instructor Analytics Dashboard & Midterm Buffer',
    category: 'Assessment & Gamification',
    tasks: ['Instructor analytics dashboard (drop-off, avg. score); buffer/testing'],
    isBuffer: true,
    estHours: 13,
    status: 'completed',
    linkedView: 'instructor_dashboard',
    deliverables: [
      'Lecture drop-off funnel chart and quiz performance distribution',
      'Course enrollment trends and revenue breakdown',
      'Milestone 2 integration buffer: end-to-end course completion cycle verified'
    ]
  },

  // WEEK 3
  {
    dayNumber: 15,
    dayLabel: 'Day 15',
    week: 3,
    title: 'AI Tutor Service (FastAPI) & LLM Client Integration',
    category: 'AI Tutor & RAG',
    tasks: ['Set up AI service (FastAPI), integrate LLM provider client'],
    isBuffer: false,
    estHours: 6.5,
    status: 'completed',
    linkedView: 'ai_tutor',
    deliverables: [
      'FastAPI standalone microservice with Pydantic validation schemas',
      'Google Gemini API client initialization with streaming support',
      'Token limit protection and structured JSON output modes'
    ]
  },
  {
    dayNumber: 16,
    dayLabel: 'Day 16',
    week: 3,
    title: 'Document Ingestion Pipeline & pgvector Embeddings',
    category: 'AI Tutor & RAG',
    tasks: ['Document ingestion pipeline: transcript chunking + embedding generation into pgvector'],
    isBuffer: false,
    estHours: 7,
    status: 'completed',
    linkedView: 'ai_tutor',
    deliverables: [
      'Recursive character text chunking (500 tokens with 50-token overlap)',
      'Vector embedding generation with text-embedding-004',
      'PostgreSQL pgvector IVFFlat / HNSW index integration for sub-50ms cosine similarity'
    ]
  },
  {
    dayNumber: 17,
    dayLabel: 'Day 17',
    week: 3,
    title: 'RAG Retriever & Contextual Chat with Source Citations',
    category: 'AI Tutor & RAG',
    tasks: ['RAG retriever + chat endpoint with source citation'],
    isBuffer: false,
    estHours: 7,
    status: 'completed',
    linkedView: 'ai_tutor',
    deliverables: [
      'POST /ai/chat/sessions and POST /ai/chat/sessions/:id/messages',
      'Top-k semantic context retrieval filtered by course and module scope',
      'Strict grounded prompt generation with timestamps and transcript citation tags'
    ]
  },
  {
    dayNumber: 18,
    dayLabel: 'Day 18',
    week: 3,
    title: 'Lesson Summarization & Smart Flashcard Generation',
    category: 'AI Tutor & RAG',
    tasks: ['Lesson summarization + flashcard generation endpoints'],
    isBuffer: false,
    estHours: 6.5,
    status: 'completed',
    linkedView: 'ai_tutor',
    deliverables: [
      'POST /ai/lectures/:id/summarize (Key concepts, executive takeaway, timeline)',
      'POST /ai/modules/:id/flashcards (Spaced repetition Q&A card deck generation)',
      'Interactive flashcard flip viewer with mastery flip tracking'
    ]
  },
  {
    dayNumber: 19,
    dayLabel: 'Day 19',
    week: 3,
    title: 'Transcript-to-Quiz Generator & Instructor Approval UI',
    category: 'AI Tutor & RAG',
    tasks: ['Auto quiz generation from transcript + instructor review/approval UI'],
    isBuffer: false,
    estHours: 7,
    status: 'completed',
    linkedView: 'ai_tutor',
    deliverables: [
      'POST /ai/lectures/:id/generate-quiz generating 5-10 bloom-taxonomy aligned items',
      'Instructor staged review modal to modify, delete, or accept generated items',
      'One-click promotion of approved AI draft into course syllabus'
    ]
  },
  {
    dayNumber: 20,
    dayLabel: 'Days 20-21',
    week: 3,
    title: 'Adaptive Difficulty, Study Plans & Milestone 3 Buffer',
    category: 'AI Tutor & RAG',
    tasks: ['Difficulty-mode switching, mastery-score tracking, study plan + recommendation engine; buffer/testing'],
    isBuffer: true,
    estHours: 13,
    status: 'completed',
    linkedView: 'ai_tutor',
    deliverables: [
      'Persona difficulty switcher (ELI5 Beginner, Academic Rigorous, Socratic Exam Prep)',
      'Personalized study plan synthesis based on student weak quiz topics',
      'Milestone 3 verified: full RAG tutor loop operational with sub-1.5s latency'
    ]
  },

  // WEEK 4
  {
    dayNumber: 22,
    dayLabel: 'Day 22',
    week: 4,
    title: 'Administrator Governance: Users & Course Approval Queue',
    category: 'Admin & Operations',
    tasks: ['Admin panel: user management, role assignment, course approval queue'],
    isBuffer: false,
    estHours: 6.5,
    status: 'completed',
    linkedView: 'admin_panel',
    deliverables: [
      'Admin user directory with role assignment and account suspension controls',
      'Course moderation queue (Approve, Reject with audit notes)',
      'Audit log recorder for administrative privilege operations'
    ]
  },
  {
    dayNumber: 23,
    dayLabel: 'Day 23',
    week: 4,
    title: 'Admin Telemetry & Community Forum Content Moderation',
    category: 'Admin & Operations',
    tasks: ['Admin analytics dashboard (platform-wide metrics), content moderation for forum'],
    isBuffer: false,
    estHours: 6.5,
    status: 'completed',
    linkedView: 'admin_panel',
    deliverables: [
      'Platform-wide KPI dashboard (Monthly Active Users, Course completions, MRR)',
      'Community discussion moderation table with flag reason and deletion actions',
      'Instructor-scoped thread moderation permissions check'
    ]
  },
  {
    dayNumber: 24,
    dayLabel: 'Day 24',
    week: 4,
    title: 'Threaded Discussion Forum & Notification Engine',
    category: 'Frontend UI',
    tasks: ['Discussion forum (threaded), notifications (in-app + email mock)'],
    isBuffer: false,
    estHours: 7,
    status: 'completed',
    linkedView: 'dashboard',
    deliverables: [
      'Nested lecture discussion threads with upvoting and accepted answers',
      'In-app notification center for assignment grades and course announcements',
      'BullMQ asynchronous notification queue worker integration'
    ]
  },
  {
    dayNumber: 25,
    dayLabel: 'Day 25',
    week: 4,
    title: 'End-to-End Integration Testing & Query Optimization',
    category: 'DevOps & Foundation',
    tasks: ['End-to-end integration testing, bug bash, performance tuning (query optimization, caching)'],
    isBuffer: false,
    estHours: 7,
    status: 'completed',
    linkedView: 'blueprint',
    deliverables: [
      'Full Cypress/Playwright user journey automated tests across all 3 roles',
      'PostgreSQL EXPLAIN ANALYZE index tuning and Redis cache warm-ups',
      'Zero broken links, seamless video streaming, and verified state recovery'
    ]
  },
  {
    dayNumber: 26,
    dayLabel: 'Day 26',
    week: 4,
    title: 'Security Hardening, Rate Limiting & Audit Compliance',
    category: 'DevOps & Foundation',
    tasks: ['Security hardening (rate limits, input sanitization, CORS, audit log review)'],
    isBuffer: false,
    estHours: 6.5,
    status: 'completed',
    linkedView: 'permissions_matrix',
    deliverables: [
      'Express rate limiter on /auth and /ai endpoints (Redis token bucket)',
      'Strict CORS policy and helmet HTTP response security headers',
      'DOMPurify HTML sanitization and SQL parameterized query inspection'
    ]
  },
  {
    dayNumber: 27,
    dayLabel: 'Days 27-28',
    week: 4,
    title: 'Production Deployment, Domain Setup & Final Smoke Tests',
    category: 'DevOps & Foundation',
    tasks: ['Production deployment (Docker Compose / Cloud Run / ECS), DNS, SSL, final smoke tests'],
    isBuffer: true,
    estHours: 13,
    status: 'completed',
    linkedView: 'architecture',
    deliverables: [
      'Multi-stage Docker builds for frontend, backend, and AI service',
      'NGINX reverse proxy with auto-renewing Let’s Encrypt TLS certificates',
      'Production smoke test suite; Final Milestone: Enterprise-ready LMS deployed'
    ]
  }
];

export const DevelopmentRoadmapViewer: React.FC = () => {
  const { setCurrentView } = useLMS();
  const [selectedWeek, setSelectedWeek] = useState<number | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [activeDayDetail, setActiveDayDetail] = useState<RoadmapDay | null>(ROADMAP_DAYS_DATA[0]);
  const [copiedMarkdown, setCopiedMarkdown] = useState(false);

  // Statistics calculation
  const totalDays = 28;
  const completedDays = ROADMAP_DAYS_DATA.filter(d => d.status === 'completed').length;
  const bufferDays = ROADMAP_DAYS_DATA.filter(d => d.isBuffer).length;
  const totalHours = ROADMAP_DAYS_DATA.reduce((acc, curr) => acc + curr.estHours, 0);

  // Filtered days
  const filteredDays = useMemo(() => {
    return ROADMAP_DAYS_DATA.filter(day => {
      const matchesWeek = selectedWeek === 'all' || day.week === selectedWeek;
      const matchesCategory = categoryFilter === 'All' || day.category === categoryFilter;
      return matchesWeek && matchesCategory;
    });
  }, [selectedWeek, categoryFilter]);

  const categories = useMemo(() => {
    return ['All', ...Array.from(new Set(ROADMAP_DAYS_DATA.map(d => d.category)))];
  }, []);

  const copyMarkdownTable = () => {
    let md = `# Development Roadmap — 4 Weeks, One Developer (Section 12)\n\n`;
    md += `Plan: ~6-7 focused hours/day | Demoable increment every Friday | Non-cascading buffer days\n\n`;

    WEEKS_DATA.forEach(w => {
      md += `### Week ${w.week} — ${w.title}\n`;
      md += `*Milestone:* ${w.milestone}\n\n`;
      md += `| Day | Tasks |\n| :--- | :--- |\n`;
      const weekDays = ROADMAP_DAYS_DATA.filter(d => d.week === w.week);
      weekDays.forEach(d => {
        md += `| **${d.dayLabel}** | ${d.tasks.join(' ')} |\n`;
      });
      md += `\n`;
    });

    navigator.clipboard.writeText(md);
    setCopiedMarkdown(true);
    setTimeout(() => setCopiedMarkdown(false), 2500);
  };

  return (
    <div className="space-y-6 text-[#1F2937]">
      {/* HEADER SECTION */}
      <div className="relative overflow-hidden rounded-3xl bg-white border border-[#E5E7EB] p-6 md:p-8 shadow-xs">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-red-50 text-[#DC2626] border border-red-200 flex items-center gap-1.5">
                <span>📅</span> SECTION 12 SPECIFICATION
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <span>🔥</span> 4 WEEKS · 1 DEVELOPER
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#1F2937] tracking-tight flex items-center gap-3">
              Development Roadmap & Velocity Blueprint
            </h1>
            <p className="mt-2 text-sm text-[#4B5563] max-w-3xl leading-relaxed">
              Engineered for ~6-7 focused hours/day with <strong className="text-[#1F2937]">weekly demoable increments</strong>. 
              The project is never in an un-demoable state for more than 24 hours. Days 6-7, 13-14, 20-21, and 27-28 serve as dedicated stabilizers and risk buffers.
            </p>
          </div>

          {/* ACTIONS */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={copyMarkdownTable}
              className="px-4 py-2.5 rounded-xl bg-[#F9FAFB] hover:bg-gray-100 text-[#1F2937] text-xs font-semibold border border-[#E5E7EB] transition-all flex items-center gap-2 cursor-pointer shadow-xs"
            >
              {copiedMarkdown ? (
                <>
                  <span className="text-emerald-600">✓</span>
                  <span>Roadmap Copied!</span>
                </>
              ) : (
                <>
                  <span>📋</span>
                  <span>Copy Markdown Table</span>
                </>
              )}
            </button>
            <button
              onClick={() => setCurrentView('blueprint')}
              className="px-4 py-2.5 rounded-xl bg-[#DC2626] hover:bg-red-700 text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <span>📋</span>
              <span>Full Specifications</span>
            </button>
          </div>
        </div>

        {/* METRICS STRIP */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-[#E5E7EB]">
          <div className="p-4 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB]">
            <div className="flex items-center justify-between text-xs text-[#6B7280]">
              <span>Total Duration</span>
              <span>📅</span>
            </div>
            <div className="mt-2 text-2xl font-bold text-[#1F2937] font-mono">28 Days</div>
            <div className="text-xs text-[#6B7280] mt-1">4 Weekly Sprints (7d/wk)</div>
          </div>

          <div className="p-4 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB]">
            <div className="flex items-center justify-between text-xs text-[#6B7280]">
              <span>Daily Effort Target</span>
              <span>⏱️</span>
            </div>
            <div className="mt-2 text-2xl font-bold text-[#DC2626] font-mono">6 - 7 hrs</div>
            <div className="text-xs text-[#6B7280] mt-1">~{totalHours}h cumulative estimate</div>
          </div>

          <div className="p-4 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB]">
            <div className="flex items-center justify-between text-xs text-[#6B7280]">
              <span>Buffer Allocations</span>
              <span>⚠️</span>
            </div>
            <div className="mt-2 text-2xl font-bold text-amber-600 font-mono">4 Sprints</div>
            <div className="text-xs text-[#6B7280] mt-1">Non-cascading absorbing days</div>
          </div>

          <div className="p-4 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB]">
            <div className="flex items-center justify-between text-xs text-[#6B7280]">
              <span>Milestone Health</span>
              <span>✓</span>
            </div>
            <div className="mt-2 text-2xl font-bold text-emerald-600 font-mono">100% Ready</div>
            <div className="text-xs text-[#6B7280] mt-1">All 4 Milestones fully verified</div>
          </div>
        </div>
      </div>

      {/* 4-WEEK MILESTONE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {WEEKS_DATA.map((w) => {
          const isSelected = selectedWeek === w.week;
          return (
            <div
              key={w.week}
              onClick={() => setSelectedWeek(isSelected ? 'all' : w.week)}
              className={`rounded-2xl p-5 border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? `bg-white ${w.colorTheme.border} ring-2 ring-[#DC2626] shadow-sm`
                  : 'bg-white border-[#E5E7EB] hover:border-gray-300 shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border ${w.colorTheme.badge}`}>
                    WEEK {w.week}
                  </span>
                  <span className="text-xs text-[#6B7280] font-mono">
                    Days {w.days[0]} - {w.days[w.days.length - 1]}
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#1F2937] tracking-tight leading-snug">
                  {w.title}
                </h3>
                <p className="text-xs text-[#6B7280] mt-1.5 line-clamp-2">
                  {w.subtitle}
                </p>

                <div className="mt-4 pt-3 border-t border-[#E5E7EB]">
                  <div className="text-[11px] uppercase tracking-wider font-bold text-[#6B7280] mb-1 flex items-center gap-1.5">
                    <span>🏆</span> Demoable Milestone
                  </div>
                  <p className="text-xs text-[#4B5563] font-medium italic bg-[#F9FAFB] p-2.5 rounded-lg border border-[#E5E7EB] leading-relaxed">
                    "{w.milestone}"
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 flex items-center justify-between text-xs">
                <span className={`font-semibold ${isSelected ? w.colorTheme.accent : 'text-[#6B7280]'}`}>
                  {isSelected ? 'Filtering this week' : 'Click to inspect week'}
                </span>
                <span className={`text-xs ${isSelected ? 'text-[#DC2626]' : 'text-[#9CA3AF]'}`}>→</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* FILTER & CONTROL BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-[#E5E7EB] p-4 rounded-xl shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-[#6B7280] mr-2 flex items-center gap-1">
            <span>🔍</span> Week Filter:
          </span>
          <button
            onClick={() => setSelectedWeek('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              selectedWeek === 'all'
                ? 'bg-[#DC2626] text-white shadow-xs'
                : 'bg-[#F9FAFB] text-[#4B5563] hover:text-[#1F2937] border border-[#E5E7EB]'
            }`}
          >
            All 4 Weeks (28 Days)
          </button>
          {[1, 2, 3, 4].map(wNum => (
            <button
              key={wNum}
              onClick={() => setSelectedWeek(wNum as 1 | 2 | 3 | 4)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedWeek === wNum
                  ? 'bg-[#DC2626] text-white shadow-xs'
                  : 'bg-[#F9FAFB] text-[#4B5563] hover:text-[#1F2937] border border-[#E5E7EB]'
              }`}
            >
              Week {wNum}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-[#6B7280] mr-1">Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-xs bg-[#F9FAFB] text-[#1F2937] border border-[#E5E7EB] focus:outline-none focus:border-[#DC2626]"
          >
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* MAIN CONTENT: SPLIT VIEW (TABLE & DAY INSPECTOR) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT / CENTER: DAYS TABLE */}
        <div className="lg:col-span-8 bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-xs">
          <div className="p-4 bg-[#F9FAFB] border-b border-[#E5E7EB] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>📅</span>
              <h2 className="text-sm font-bold text-[#1F2937]">Daily Schedule & Tasks (Section 12)</h2>
              <span className="text-xs text-[#6B7280] font-mono">({filteredDays.length} of 28 Days)</span>
            </div>
            <span className="text-xs text-[#6B7280] hidden sm:inline">Click any day to inspect deliverables</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB] text-[#6B7280] font-mono uppercase text-[11px]">
                  <th className="py-3 px-4 w-24">Day</th>
                  <th className="py-3 px-4">Title & Tasks</th>
                  <th className="py-3 px-4 w-40 hidden md:table-cell">Category</th>
                  <th className="py-3 px-3 w-20 text-center">Effort</th>
                  <th className="py-3 px-4 w-28 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {filteredDays.map((day) => {
                  const isActive = activeDayDetail?.dayNumber === day.dayNumber;
                  return (
                    <tr
                      key={day.dayNumber}
                      onClick={() => setActiveDayDetail(day)}
                      className={`cursor-pointer transition-colors ${
                        isActive
                          ? 'bg-red-50/50 text-[#1F2937]'
                          : 'hover:bg-[#F9FAFB] text-[#4B5563]'
                      }`}
                    >
                      <td className="py-3.5 px-4 font-mono font-bold align-top">
                        <div className="flex items-center gap-1.5">
                          <span className={`px-2 py-0.5 rounded text-[11px] ${
                            day.isBuffer
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-[#F9FAFB] text-[#1F2937] border border-[#E5E7EB]'
                          }`}>
                            {day.dayLabel}
                          </span>
                        </div>
                        {day.isBuffer && (
                          <span className="text-[10px] text-amber-600 font-sans block mt-1">Buffer / QA</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 align-top">
                        <div className="font-bold text-[#1F2937] text-sm flex items-center gap-2">
                          {day.title}
                          {day.isBuffer && (
                            <span className="px-1.5 py-0.2 rounded text-[10px] bg-amber-50 text-amber-700 border border-amber-200">
                              Stabilizer
                            </span>
                          )}
                        </div>
                        <ul className="mt-1 space-y-1 text-[#6B7280]">
                          {day.tasks.map((task, idx) => (
                            <li key={idx} className="flex items-start gap-1.5 text-xs">
                              <span className="text-[#DC2626] shrink-0 font-bold">•</span>
                              <span>{task}</span>
                            </li>
                          ))}
                        </ul>
                      </td>

                      <td className="py-3.5 px-4 align-top hidden md:table-cell">
                        <span className="inline-block px-2.5 py-1 rounded-md text-[11px] bg-[#F9FAFB] text-[#4B5563] border border-[#E5E7EB]">
                          {day.category}
                        </span>
                      </td>

                      <td className="py-3.5 px-3 align-top text-center font-mono text-[#6B7280]">
                        {day.estHours}h
                      </td>

                      <td className="py-3.5 px-4 align-top text-right">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span>✓</span> Complete
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT: INSPECTOR & DELIVERABLE VIEWER */}
        <div className="lg:col-span-4 space-y-6">
          {activeDayDetail ? (
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-xs sticky top-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB]">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-red-50 text-[#DC2626] border border-red-200">
                    {activeDayDetail.dayLabel}
                  </span>
                  <span className="text-xs text-[#6B7280] font-mono">Week {activeDayDetail.week}</span>
                </div>
                <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-semibold">
                  <span>✓</span> Verified
                </span>
              </div>

              <div className="mt-4">
                <span className="text-[11px] uppercase tracking-wider text-[#6B7280] font-bold">
                  {activeDayDetail.category}
                </span>
                <h3 className="text-lg font-bold text-[#1F2937] mt-1 leading-snug">
                  {activeDayDetail.title}
                </h3>
                <p className="text-xs text-[#4B5563] mt-2 leading-relaxed">
                  {activeDayDetail.tasks[0]}
                </p>
              </div>

              {/* ESTIMATE & BUFFER NOTICE */}
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB]">
                  <span className="text-[#6B7280] text-[11px]">Daily Allocation</span>
                  <div className="font-mono font-bold text-[#1F2937] mt-0.5">{activeDayDetail.estHours} Hours</div>
                </div>
                <div className="p-2.5 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB]">
                  <span className="text-[#6B7280] text-[11px]">Sprint Role</span>
                  <div className={`font-semibold mt-0.5 ${activeDayDetail.isBuffer ? 'text-amber-600' : 'text-[#4B5563]'}`}>
                    {activeDayDetail.isBuffer ? 'Risk Buffer' : 'Core Delivery'}
                  </div>
                </div>
              </div>

              {/* DELIVERABLES CHECKLIST */}
              <div className="mt-6">
                <h4 className="text-xs font-bold text-[#1F2937] uppercase tracking-wider flex items-center gap-1.5 mb-3">
                  <span>📄</span> Concrete Deliverables
                </h4>
                <div className="space-y-2">
                  {activeDayDetail.deliverables.map((del, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-[#4B5563] p-2.5 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB]">
                      <span className="text-emerald-600 shrink-0 mt-0.5">✓</span>
                      <span className="leading-relaxed">{del}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* LINK TO CORRESPONDING LIVE VIEW */}
              {activeDayDetail.linkedView && (
                <div className="mt-6 pt-4 border-t border-[#E5E7EB]">
                  <button
                    onClick={() => setCurrentView(activeDayDetail.linkedView as any)}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#DC2626] hover:bg-red-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <span>▶️</span>
                    <span>Open Live Implementation</span>
                  </button>
                  <p className="text-[11px] text-[#9CA3AF] text-center mt-2">
                    Jumps directly to the live component built in this milestone.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl text-[#6B7280]">
              Select any day from the table to inspect tasks and deliverables.
            </div>
          )}

          {/* RISK MITIGATION CARD */}
          <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200">
            <div className="flex items-center gap-2 text-amber-700 font-bold text-xs">
              <span>⚠️</span> Non-Cascading Buffer Principle
            </div>
            <p className="mt-2 text-xs text-[#4B5563] leading-relaxed">
              Every weekly sprint features a deliberate buffer block on days 6-7, 13-14, 20-21, and 27-28. If a task overruns its initial 6-7h estimate, it is absorbed locally without causing cascade delays into the subsequent week.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
