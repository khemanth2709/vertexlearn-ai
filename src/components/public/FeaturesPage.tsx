import React from 'react';
import { useLMS } from '../../context/LMSContext';
import { 
  Users, 
  BookOpen, 
  Terminal, 
  BarChart3, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight,
  Database,
  Cpu,
  Award,
  Zap,
  CheckCircle2
} from 'lucide-react';

export const FeaturesPage: React.FC = () => {
  const { setCurrentView } = useLMS();

  const capabilityEngines = [
    {
      engineNumber: 'Engine 01',
      title: 'User & Role Management',
      subtitle: 'Multi-Tier RBAC & Cohort Orchestration',
      icon: <Users className="w-6 h-6 text-[#DC2626]" />,
      color: 'border-[#E5E7EB] bg-white',
      tagColor: 'text-[#DC2626] bg-red-50 border-red-200',
      description: 'Strict multi-tier access control supporting Platform Administrators (system configuration, audit logs, faculty onboarding), Instructors/Creators (curriculum authoring, grading queues), and Students/Learners (enrollment, video lectures, code submissions). Features token-based session management and batch cohort grouping.',
      highlights: [
        'Multi-tier RBAC for Admins, Faculty, and Students',
        'Cohort batch grouping & synchronized learning milestones',
        'Audit logging across sensitive system operations',
        'Strict credential authentication with registered candidate database'
      ]
    },
    {
      engineNumber: 'Engine 02',
      title: 'Course & Content Authoring',
      subtitle: 'Hierarchical Courses → Modules → Lessons',
      icon: <BookOpen className="w-6 h-6 text-[#DC2626]" />,
      color: 'border-[#E5E7EB] bg-white',
      tagColor: 'text-[#DC2626] bg-red-50 border-red-200',
      description: 'Structured nested curriculum hierarchy containing Courses with Modules (chapters) and granular Lessons (units). Supports progressive video streaming, formatted rich text guidelines, downloadable PDF resource attachments, interactive coding exercises, and custom objective quiz assessments.',
      highlights: [
        'Nested Courses → Modules → Lessons structural architecture',
        'Progressive video playback with timestamped notes & bookmarks',
        'AI automated lesson summaries and flashcards generator',
        'Course builder studio with inline rubric & module creation'
      ]
    },
    {
      engineNumber: 'Engine 03',
      title: 'Assessment & Interactive Engine',
      subtitle: 'Automated Quizzes & Code Execution Sandbox',
      icon: <Terminal className="w-6 h-6 text-[#DC2626]" />,
      color: 'border-[#E5E7EB] bg-white',
      tagColor: 'text-[#DC2626] bg-red-50 border-red-200',
      description: 'Automated multiple-choice quiz evaluation with immediate score computation, interactive programming assignment runner (Judge0 API sandbox simulation) with multi-language execution and test case verification, criterion-based grading rubrics, and instant feedback loops with gradebook generation.',
      highlights: [
        'Interactive Judge0 code sandbox (TypeScript, Python, SQL)',
        'Automated test case assertions with runtime & memory telemetry',
        'Instant objective quiz auto-grading & explanations',
        'Criterion rubrics with manual review queues for faculty'
      ]
    },
    {
      engineNumber: 'Engine 04',
      title: 'Tracking, Analytics & Gamification',
      subtitle: 'Streaks, Circular Progress & Verifiable Certificates',
      icon: <Award className="w-6 h-6 text-[#DC2626]" />,
      color: 'border-[#E5E7EB] bg-white',
      tagColor: 'text-[#DC2626] bg-red-50 border-red-200',
      description: 'Real-time linear progress tracking and responsive SVG circular progress rings, daily engagement streak tracking with flame indicators, verifiable accredited PDF certificates with cryptographic verification hashes, and executive analytics dashboards.',
      highlights: [
        'Responsive SVG CircularProgressBar with crimson red accent',
        'Clean StreakTracker with daily milestone engagement',
        'Official certificates with unique hashes & print verification',
        'Real-time student attendance check-in ledger'
      ]
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-16 text-[#1F2937]">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-[#DC2626] border border-red-200 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          Enterprise LMS Specifications
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1F2937] tracking-tight">
          Four Core Capability Engines
        </h1>
        <p className="text-sm text-[#4B5563] max-w-2xl mx-auto leading-relaxed">
          The LMS harmonizes multi-tier role access, structured content authoring, real-time code evaluation sandboxes, and gamified progress tracking.
        </p>
      </div>

      {/* 4 Capability Engines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {capabilityEngines.map((engine) => (
          <div 
            key={engine.engineNumber}
            className="rounded-2xl border border-[#E5E7EB] p-6 sm:p-7 space-y-4 shadow-xs bg-white flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${engine.tagColor}`}>
                  {engine.engineNumber}
                </span>
                <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center">
                  {engine.icon}
                </div>
              </div>

              <h3 className="text-xl font-bold text-[#1F2937] mb-0.5">{engine.title}</h3>
              <p className="text-xs text-[#DC2626] font-medium mb-3">{engine.subtitle}</p>

              <p className="text-xs text-[#4B5563] leading-relaxed mb-4">
                {engine.description}
              </p>

              <div className="space-y-2 pt-2 border-t border-[#E5E7EB]">
                <div className="text-[11px] font-semibold text-[#1F2937] uppercase tracking-wider">Key Functional Features:</div>
                {engine.highlights.map((h, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-[#4B5563]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#DC2626] shrink-0" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Public Action Section */}
      <div className="p-8 rounded-3xl bg-white border border-[#E5E7EB] text-center space-y-5 shadow-xs">
        <h3 className="text-2xl font-bold text-[#1F2937]">Ready to Experience the Platform?</h3>
        <p className="text-xs text-[#4B5563] max-w-lg mx-auto">
          Register your student candidate identity or sign in with your institutional credentials to begin learning.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => setCurrentView('register')}
            className="bg-[#DC2626] hover:bg-[#B91C1C] text-white font-semibold text-xs px-5 py-3 rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <Users className="w-4 h-4" />
            <span>Register Candidate Account</span>
          </button>
          <button
            onClick={() => setCurrentView('login')}
            className="bg-[#F9FAFB] hover:bg-gray-100 text-[#1F2937] border border-[#E5E7EB] font-semibold text-xs px-5 py-3 rounded-xl transition-all flex items-center gap-2 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-[#DC2626]" />
            <span>Institutional Sign In</span>
          </button>
          <button
            onClick={() => setCurrentView('courses_overview')}
            className="bg-[#F9FAFB] hover:bg-gray-100 text-[#1F2937] border border-[#E5E7EB] font-semibold text-xs px-5 py-3 rounded-xl transition-all flex items-center gap-2 cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-[#DC2626]" />
            <span>Browse Courses Catalog</span>
          </button>
        </div>
      </div>

    </div>
  );
};
