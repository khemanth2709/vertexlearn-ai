import React, { useState } from 'react';

interface TreeNode {
  name: string;
  type: 'folder' | 'file';
  description?: string;
  badge?: string;
  children?: TreeNode[];
}

const SPEC_FOLDER_TREE: TreeNode = {
  name: 'lms-ai-platform/',
  type: 'folder',
  description: 'Enterprise Root Workspace',
  children: [
    {
      name: 'frontend/',
      type: 'folder',
      description: 'Client Applications (React SPA, Vite, Tailwind CSS, Recharts)',
      children: [
        {
          name: 'public/',
          type: 'folder',
          description: 'Static assets, logos, and favicon manifests',
          children: [
            { name: 'favicon.ico', type: 'file', description: 'App icon' },
            { name: 'manifest.json', type: 'file', description: 'PWA Web App manifest' }
          ]
        },
        {
          name: 'src/',
          type: 'folder',
          description: 'Frontend source code and React components',
          children: [
            {
              name: 'components/',
              type: 'folder',
              description: 'Atomic & modular React UI components',
              children: [
                {
                  name: 'common/',
                  type: 'folder',
                  description: 'Shared design system: Button, Modal, Card, Badge, Table, Tooltip',
                  badge: 'Design System'
                },
                {
                  name: 'student/',
                  type: 'folder',
                  description: 'FR-S: Dashboard, streak counter, note-taking, submission upload, certificate download',
                  badge: 'Student Module'
                },
                {
                  name: 'instructor/',
                  type: 'folder',
                  description: 'FR-I: Course builder, assignment authoring, rubric grading, quiz approval console',
                  badge: 'Instructor Module'
                },
                {
                  name: 'admin/',
                  type: 'folder',
                  description: 'FR-A: Course approval queue, role delegation, audit log viewer, system telemetry',
                  badge: 'Admin Module'
                },
                {
                  name: 'ai-tutor/',
                  type: 'folder',
                  description: 'FR-A: Socratic RAG chat widget, lecture summarizer, quiz generator, study plan modal',
                  badge: 'AI Tutor'
                }
              ]
            },
            {
              name: 'pages/',
              type: 'folder',
              description: 'Top-level routed screens and views',
              children: [
                { name: 'auth/', type: 'folder', description: 'Login, Register, Password Reset, MFA setup' },
                { name: 'dashboard/', type: 'folder', description: 'Role-specific student / instructor / admin dashboards' },
                { name: 'course-catalog/', type: 'folder', description: 'Category, difficulty, rating filters and course discovery' },
                { name: 'course-player/', type: 'folder', description: 'Video player with timestamp bookmarks, transcripts & notes' },
                { name: 'quizzes/', type: 'folder', description: 'MCQ, multi-select, short-answer testing engine with auto-grading' },
                { name: 'admin-panel/', type: 'folder', description: 'Course moderation, user management, audit trails' }
              ]
            },
            { name: 'store/', type: 'folder', description: 'Redux Toolkit / Zustand global state stores (auth, cart, lms)', badge: 'State' },
            { name: 'hooks/', type: 'folder', description: 'Custom React hooks (useAuth, useQuizTimer, useSpeech, useRAG)' },
            { name: 'services/', type: 'folder', description: 'API client wrappers, Axios/fetch interceptors & JWT handlers' },
            { name: 'layouts/', type: 'folder', description: 'PublicNavbar, StudentSidebar, InstructorHeader layouts' },
            { name: 'utils/', type: 'folder', description: 'Formatting helpers, time calculation, grade weight scoring' },
            { name: 'styles/', type: 'folder', description: 'Tailwind CSS config, custom animations & theme variables' },
            { name: 'routes/', type: 'folder', description: 'Role-based route guards and path definitions' },
            { name: 'App.tsx', type: 'file', description: 'Main application component and view routing' }
          ]
        },
        { name: 'package.json', type: 'file', description: 'Frontend dependencies (React 19, Tailwind, Vite, Recharts)' },
        { name: 'vite.config.ts', type: 'file', description: 'Vite build tool configuration with API proxying' }
      ]
    },
    {
      name: 'backend/',
      type: 'folder',
      description: 'Core LMS Service (Node.js / Express, TypeScript)',
      children: [
        {
          name: 'src/',
          type: 'folder',
          children: [
            {
              name: 'modules/',
              type: 'folder',
              description: 'Domain-driven feature modules',
              children: [
                { name: 'auth/', type: 'folder', description: 'JWT token issuing, argon2/bcrypt hash, refresh tokens' },
                { name: 'users/', type: 'folder', description: 'User profile management, role assignment, streaks' },
                { name: 'courses/', type: 'folder', description: 'Course authoring, modules, lectures, approval workflows' },
                { name: 'enrollments/', type: 'folder', description: 'Student course enrollments, watch progress, bookmarks' },
                { name: 'assignments/', type: 'folder', description: 'Submissions, rubrics, file upload handling, manual grading' },
                { name: 'quizzes/', type: 'folder', description: 'Quiz attempts, auto-grading engine, question bank' },
                { name: 'gamification/', type: 'folder', description: 'Badges award logic, streak maintenance, leaderboard' },
                { name: 'discussions/', type: 'folder', description: 'Course discussion threads, lecture comments, replies' },
                { name: 'notifications/', type: 'folder', description: 'Email alerts, deadline reminders, system announcements' },
                { name: 'admin/', type: 'folder', description: 'Audit logging, user ban/unban, course approve/reject' }
              ]
            },
            { name: 'middleware/', type: 'folder', description: 'JWT authentication, RBAC authorization, rate limiting, error handler' },
            { name: 'jobs/', type: 'folder', description: 'BullMQ queue worker processors (reminders, transcriptions, streaks)' },
            { name: 'config/', type: 'folder', description: 'Database pool, Redis connection, JWT secrets config' },
            {
              name: 'db/',
              type: 'folder',
              children: [
                { name: 'migrations/', type: 'folder', description: 'PostgreSQL 32-table DDL migration scripts' },
                { name: 'seeders/', type: 'folder', description: 'Sample courses, users, and quiz question seeds' }
              ]
            },
            { name: 'utils/', type: 'folder', description: 'Password validation, logger, custom API error classes' },
            { name: 'server.ts', type: 'file', description: 'Express server entry point and middleware assembly' }
          ]
        },
        { name: 'tests/', type: 'folder', description: 'Jest / Supertest API endpoint and unit tests' },
        { name: 'package.json', type: 'file', description: 'Backend dependencies (express, pg, redis, bullmq, zod)' },
        { name: 'Dockerfile', type: 'file', description: 'Multi-stage Docker container build for Core LMS' }
      ]
    },
    {
      name: 'ai-service/',
      type: 'folder',
      description: 'AI Tutor Service (Python / FastAPI, pgvector, Gemini API)',
      children: [
        {
          name: 'app/',
          type: 'folder',
          children: [
            {
              name: 'routers/',
              type: 'folder',
              description: 'FastAPI REST route controllers',
              children: [
                { name: 'chat.py', type: 'file', description: 'RAG conversational chat endpoint with course grounding' },
                { name: 'summarize.py', type: 'file', description: 'Lecture transcript summarization into key takeaways' },
                { name: 'quiz_gen.py', type: 'file', description: 'Automated 5-10 question quiz generation from transcripts' },
                { name: 'flashcards.py', type: 'file', description: 'Spaced repetition flashcard generation (Q/A pairs)' },
                { name: 'study_plan.py', type: 'file', description: 'Personalized adaptive study plan synthesis from quiz gaps' }
              ]
            },
            {
              name: 'rag/',
              type: 'folder',
              description: 'Retrieval-Augmented Generation pipeline',
              children: [
                { name: 'chunking.py', type: 'file', description: 'Semantic text chunker with 512-token sliding window & overlap' },
                { name: 'embeddings.py', type: 'file', description: 'Vector embedding generation via Gemini text-embedding-004' },
                { name: 'retriever.py', type: 'file', description: 'Cosine similarity query execution against pgvector' }
              ]
            },
            { name: 'recommendation/', type: 'folder', description: 'Cosine topic mastery recommendation engine' },
            { name: 'models/', type: 'folder', description: 'Pydantic schemas for request/response payloads' },
            { name: 'core/', type: 'folder', description: 'Gemini client setup, vector store config, environment loading' },
            { name: 'main.py', type: 'file', description: 'FastAPI application factory, CORS and routing setup' }
          ]
        },
        { name: 'requirements.txt', type: 'file', description: 'Python dependencies (fastapi, uvicorn, asyncpg, pgvector)' },
        { name: 'Dockerfile', type: 'file', description: 'Production Python 3.11 container image configuration' }
      ]
    },
    {
      name: 'infra/',
      type: 'folder',
      description: 'Infrastructure as Code & Deployment Configs',
      children: [
        { name: 'docker-compose.yml', type: 'file', description: 'Multi-container orchestration (Postgres, Redis, Core, AI, Nginx)' },
        { name: 'k8s/', type: 'folder', description: 'Kubernetes manifests (deployments, services, configmaps, ingress)' },
        {
          name: 'nginx/',
          type: 'folder',
          children: [
            { name: 'nginx.conf', type: 'file', description: 'Reverse proxy, SSL termination, and /api/v1 routing rules' }
          ]
        },
        { name: 'terraform/', type: 'folder', description: 'Cloud infrastructure provisioning (AWS ECS, RDS, S3, ElastiCache)' }
      ]
    },
    {
      name: 'docs/',
      type: 'folder',
      description: 'System specifications and API definitions',
      children: [
        { name: 'api-spec.yaml', type: 'file', description: 'Complete OpenAPI 3.0 specification for all microservice routes' },
        { name: 'architecture.md', type: 'file', description: 'Comprehensive system architecture and component interactions' }
      ]
    },
    {
      name: '.github/',
      type: 'folder',
      children: [
        {
          name: 'workflows/',
          type: 'folder',
          children: [
            { name: 'ci.yml', type: 'file', description: 'Automated CI/CD workflow testing, linting and artifact build' }
          ]
        }
      ]
    },
    { name: '.env.example', type: 'file', description: 'Environment variable template for all local and production services' },
    { name: 'README.md', type: 'file', description: 'Project overview, architectural guide, and getting started instructions' }
  ]
};

export const FolderStructureViewer: React.FC = () => {
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    'lms-ai-platform/': true,
    'frontend/': true,
    'backend/': true,
    'ai-service/': true,
    'infra/': true,
    'docs/': true,
    '.github/': true,
    'frontend/src/': true,
    'frontend/src/components/': true,
    'frontend/src/pages/': true,
    'backend/src/': true,
    'backend/src/modules/': true,
    'ai-service/app/': true,
    'ai-service/app/routers/': true,
    'ai-service/app/rag/': true
  });

  const [copied, setCopied] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'frontend' | 'backend' | 'ai-service' | 'infra' | 'docs'>('all');

  const toggleFolder = (path: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };

  const expandAll = () => {
    const allPaths: Record<string, boolean> = {};
    const traverse = (node: TreeNode, parentPath: string) => {
      const fullPath = parentPath + node.name;
      if (node.type === 'folder') {
        allPaths[fullPath] = true;
        if (node.children) {
          node.children.forEach(c => traverse(c, fullPath));
        }
      }
    };
    traverse(SPEC_FOLDER_TREE, '');
    setExpandedFolders(allPaths);
  };

  const collapseAll = () => {
    setExpandedFolders({ 'lms-ai-platform/': true });
  };

  const handleCopyStructure = () => {
    const textStructure = `lms-ai-platform/
|-- frontend/
|   |-- public/
|   |-- src/
|   |   |-- components/
|   |   |   |-- common/
|   |   |   |-- student/
|   |   |   |-- instructor/
|   |   |   |-- admin/
|   |   |   \`-- ai-tutor/
|   |   |-- pages/
|   |   |   |-- auth/
|   |   |   |-- dashboard/
|   |   |   |-- course-catalog/
|   |   |   |-- course-player/
|   |   |   |-- quizzes/
|   |   |   \`-- admin-panel/
|   |   |-- store/               # Redux Toolkit / Zustand slices
|   |   |-- hooks/
|   |   |-- services/            # API client wrappers (axios)
|   |   |-- layouts/
|   |   |-- utils/
|   |   |-- styles/
|   |   |-- routes/
|   |   \`-- App.tsx
|   |-- package.json
|   \`-- vite.config.ts
|
|-- backend/
|   |-- src/
|   |   |-- modules/
|   |   |   |-- auth/
|   |   |   |-- users/
|   |   |   |-- courses/
|   |   |   |-- enrollments/
|   |   |   |-- assignments/
|   |   |   |-- quizzes/
|   |   |   |-- gamification/
|   |   |   |-- discussions/
|   |   |   |-- notifications/
|   |   |   \`-- admin/
|   |   |-- middleware/          # auth, rbac, rate-limit, error handler
|   |   |-- jobs/                # BullMQ processors
|   |   |-- config/
|   |   |-- db/
|   |   |   |-- migrations/
|   |   |   \`-- seeders/
|   |   |-- utils/
|   |   \`-- server.ts
|   |-- tests/
|   |-- package.json
|   \`-- Dockerfile
|
|-- ai-service/
|   |-- app/
|   |   |-- routers/
|   |   |   |-- chat.py
|   |   |   |-- summarize.py
|   |   |   |-- quiz_gen.py
|   |   |   |-- flashcards.py
|   |   |   \`-- study_plan.py
|   |   |-- rag/
|   |   |   |-- chunking.py
|   |   |   |-- embeddings.py
|   |   |   \`-- retriever.py
|   |   |-- recommendation/
|   |   |-- models/
|   |   |-- core/                # config, LLM client
|   |   \`-- main.py
|   |-- requirements.txt
|   \`-- Dockerfile
|
|-- infra/
|   |-- docker-compose.yml
|   |-- k8s/                     # optional, deployment manifests
|   |-- nginx/
|   \`-- terraform/               # optional IaC for cloud resources
|
|-- docs/
|   |-- api-spec.yaml            # OpenAPI 3.0
|   \`-- architecture.md
|
|-- .github/
|   \`-- workflows/
|       \`-- ci.yml
|
|-- .env.example
\`-- README.md`;

    navigator.clipboard.writeText(textStructure);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderTree = (node: TreeNode, parentPath: string = '', level: number = 0) => {
    const fullPath = parentPath + node.name;
    const isExpanded = expandedFolders[fullPath] ?? false;

    // Filter logic for top-level modules
    if (level === 1 && activeFilter !== 'all') {
      const folderKey = node.name.replace('/', '');
      if (folderKey !== activeFilter) {
        return null;
      }
    }

    const isFolder = node.type === 'folder';

    return (
      <div key={fullPath} className="select-none">
        <div
          onClick={() => isFolder && toggleFolder(fullPath)}
          className={`flex items-center gap-2 py-1.5 px-2 rounded-lg transition-colors text-xs font-mono group cursor-pointer ${
            isFolder ? 'hover:bg-[#F9FAFB]' : 'hover:bg-[#F9FAFB]'
          }`}
          style={{ paddingLeft: `${Math.max(level * 16, 8)}px` }}
        >
          {isFolder ? (
            <span className="text-[#6B7280] group-hover:text-[#DC2626] transition-colors text-[10px]">
              {isExpanded ? '▼' : '▶'}
            </span>
          ) : (
            <span className="w-3" />
          )}

          {isFolder ? (
            <span className="text-sm shrink-0">📁</span>
          ) : node.name.endsWith('.ts') || node.name.endsWith('.tsx') || node.name.endsWith('.py') ? (
            <span className="text-sm shrink-0">📄</span>
          ) : node.name.endsWith('.json') || node.name.endsWith('.yaml') || node.name.endsWith('.yml') ? (
            <span className="text-sm shrink-0">⚙️</span>
          ) : (
            <span className="text-sm shrink-0">📝</span>
          )}

          <span className={`font-semibold ${
            isFolder ? (level === 0 ? 'text-[#DC2626] font-bold' : 'text-[#1F2937] group-hover:text-[#DC2626]') : 'text-[#1F2937]'
          }`}>
            {node.name}
          </span>

          {node.badge && (
            <span className="ml-1 px-1.5 py-0.5 rounded text-[10px] font-sans font-medium bg-red-50 text-[#DC2626] border border-red-200">
              {node.badge}
            </span>
          )}

          {node.description && (
            <span className="hidden md:inline ml-auto text-[11px] text-[#6B7280] font-sans italic truncate max-w-[340px]">
              {node.description}
            </span>
          )}
        </div>

        {isFolder && isExpanded && node.children && (
          <div className="border-l border-[#E5E7EB] ml-3.5">
            {node.children.map(child => renderTree(child, fullPath, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 text-[#1F2937]">
      {/* Header Banner */}
      <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xs">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
                <span>✅</span> SECTION 10 COMPLIANT
              </span>
              <span className="text-xs text-[#6B7280] font-mono">Clean Monorepo Topology</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] flex items-center gap-3">
              <span className="text-2xl">📁</span>
              Project Folder Structure
            </h2>
            <p className="text-sm text-[#4B5563] mt-2 max-w-2xl leading-relaxed">
              Standardized enterprise microservices monorepo separating React client applications, Express core API services, FastAPI AI RAG pipelines, Docker infrastructure, and OpenAPI documentation.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={handleCopyStructure}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#DC2626] hover:bg-[#B91C1C] text-white transition-all flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <span>{copied ? '✅' : '📋'}</span>
              <span>{copied ? 'Copied ASCII Tree!' : 'Copy Tree Structure'}</span>
            </button>
            <button
              onClick={expandAll}
              className="px-3.5 py-2.5 rounded-xl text-xs font-medium bg-white hover:bg-[#F9FAFB] text-[#1F2937] border border-[#E5E7EB] transition-colors cursor-pointer shadow-xs"
            >
              Expand All
            </button>
            <button
              onClick={collapseAll}
              className="px-3.5 py-2.5 rounded-xl text-xs font-medium bg-white hover:bg-[#F9FAFB] text-[#1F2937] border border-[#E5E7EB] transition-colors cursor-pointer shadow-xs"
            >
              Collapse
            </button>
          </div>
        </div>

        {/* Quick Module Summary Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6 pt-6 border-t border-[#E5E7EB]">
          <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-3">
            <div className="flex items-center gap-2 text-[#1F2937] text-xs font-semibold mb-1">
              <span>🌐</span> frontend/
            </div>
            <p className="text-xs text-[#4B5563]">React SPA + Vite</p>
            <p className="text-[11px] text-[#6B7280] mt-0.5">14 directories, 6 page routes</p>
          </div>

          <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-3">
            <div className="flex items-center gap-2 text-[#1F2937] text-xs font-semibold mb-1">
              <span>🖥️</span> backend/
            </div>
            <p className="text-xs text-[#4B5563]">Node.js Express + TS</p>
            <p className="text-[11px] text-[#6B7280] mt-0.5">10 domain modules, BullMQ</p>
          </div>

          <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-3">
            <div className="flex items-center gap-2 text-[#1F2937] text-xs font-semibold mb-1">
              <span>✨</span> ai-service/
            </div>
            <p className="text-xs text-[#4B5563]">Python FastAPI + RAG</p>
            <p className="text-[11px] text-[#6B7280] mt-0.5">5 routers, pgvector retriever</p>
          </div>

          <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-3">
            <div className="flex items-center gap-2 text-[#1F2937] text-xs font-semibold mb-1">
              <span>⚙️</span> infra/
            </div>
            <p className="text-xs text-[#4B5563]">Docker + NGINX + K8s</p>
            <p className="text-[11px] text-[#6B7280] mt-0.5">Multi-tier compose stack</p>
          </div>

          <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-3 col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2 text-[#1F2937] text-xs font-semibold mb-1">
              <span>📄</span> docs/
            </div>
            <p className="text-xs text-[#4B5563]">OpenAPI 3.0 Specs</p>
            <p className="text-[11px] text-[#6B7280] mt-0.5">api-spec.yaml, arch doc</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {[
          { id: 'all', label: 'All Modules (Full Repository)' },
          { id: 'frontend', label: 'frontend/' },
          { id: 'backend', label: 'backend/' },
          { id: 'ai-service', label: 'ai-service/' },
          { id: 'infra', label: 'infra/' },
          { id: 'docs', label: 'docs/' }
        ].map(filter => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id as any)}
            className={`px-3 py-1.5 rounded-lg font-mono font-medium transition-colors shrink-0 cursor-pointer ${
              activeFilter === filter.id
                ? 'bg-[#DC2626] text-white font-bold'
                : 'bg-white text-[#4B5563] hover:text-[#1F2937] border border-[#E5E7EB]'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Interactive Tree View Panel */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E5E7EB] text-xs text-[#6B7280]">
          <div className="flex items-center gap-2">
            <span>📂</span>
            <span className="font-semibold text-[#1F2937]">Interactive Hierarchy Explorer</span>
          </div>
          <span className="font-mono text-[#6B7280] text-[11px]">Click folders to expand / collapse</span>
        </div>

        <div className="p-2 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] overflow-x-auto">
          {renderTree(SPEC_FOLDER_TREE)}
        </div>
      </div>

      {/* Verifiable Architecture Table */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-xs">
        <h3 className="text-lg font-bold text-[#1F2937] mb-3 flex items-center gap-2">
          <span>🗄️</span>
          Module Responsibility & Mapping Matrix
        </h3>
        <p className="text-xs text-[#4B5563] mb-4">
          Detailed mapping between Section 10 monorepo directory layout and functional responsibilities:
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#F9FAFB] text-[#4B5563] font-mono border-b border-[#E5E7EB]">
              <tr>
                <th className="py-2.5 px-3">Directory Path</th>
                <th className="py-2.5 px-3">Primary Tech Stack</th>
                <th className="py-2.5 px-3">Functional Coverage</th>
                <th className="py-2.5 px-3 text-right">Associated Specs</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB] text-[#1F2937]">
              <tr className="hover:bg-[#F9FAFB]">
                <td className="py-2.5 px-3 font-mono text-[#DC2626] font-semibold">frontend/src/components/</td>
                <td className="py-2.5 px-3">React 19, Tailwind CSS</td>
                <td className="py-2.5 px-3">Student player, instructor editor, admin moderation, AI Socratic chat</td>
                <td className="py-2.5 px-3 text-right font-mono text-emerald-700 font-medium">FR-S1..10, FR-I1..6</td>
              </tr>
              <tr className="hover:bg-[#F9FAFB]">
                <td className="py-2.5 px-3 font-mono text-[#DC2626] font-semibold">backend/src/modules/</td>
                <td className="py-2.5 px-3">Express 4.21, TypeScript, BullMQ</td>
                <td className="py-2.5 px-3">Auth JWT, course approvals, enrollments, auto-grading, streaks</td>
                <td className="py-2.5 px-3 text-right font-mono text-emerald-700 font-medium">API Section 8.1..8.5</td>
              </tr>
              <tr className="hover:bg-[#F9FAFB]">
                <td className="py-2.5 px-3 font-mono text-[#DC2626] font-semibold">ai-service/app/rag/</td>
                <td className="py-2.5 px-3">FastAPI, pgvector, Gemini 2.5</td>
                <td className="py-2.5 px-3">Chunking 512-tokens, embeddings, cosine retrieval, grounded tutoring</td>
                <td className="py-2.5 px-3 text-right font-mono text-emerald-700 font-medium">FR-A1..A8</td>
              </tr>
              <tr className="hover:bg-[#F9FAFB]">
                <td className="py-2.5 px-3 font-mono text-[#DC2626] font-semibold">infra/docker-compose.yml</td>
                <td className="py-2.5 px-3">Docker, NGINX, Postgres, Redis</td>
                <td className="py-2.5 px-3">Multi-service orchestration, health checks, network bridges, volume mounts</td>
                <td className="py-2.5 px-3 text-right font-mono text-emerald-700 font-medium">Section 9 Topology</td>
              </tr>
              <tr className="hover:bg-[#F9FAFB]">
                <td className="py-2.5 px-3 font-mono text-[#DC2626] font-semibold">docs/api-spec.yaml</td>
                <td className="py-2.5 px-3">OpenAPI 3.0.3</td>
                <td className="py-2.5 px-3">Standardized machine-readable contracts for client code generation</td>
                <td className="py-2.5 px-3 text-right font-mono text-emerald-700 font-medium">Swagger / Redoc</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
