import React from 'react';
import { useLMS } from '../../context/LMSContext';
import { 
  ShieldCheck, 
  BookOpen, 
  Sparkles, 
  Users, 
  Award, 
  CheckCircle2, 
  ArrowRight, 
  Layers, 
  Cpu, 
  Activity,
  GraduationCap,
  ChevronRight,
  Briefcase,
  Shield
} from 'lucide-react';
import { VertexLearnLogo } from '../common/VertexLearnLogo';

export const LandingPage: React.FC = () => {
  const { setCurrentView } = useLMS();

  return (
    <div className="space-y-12 pb-16 text-[#1F2937]">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-white border border-[#E5E7EB] p-8 sm:p-14 text-center space-y-6 shadow-xs">
        <div className="flex justify-center mb-1">
          <VertexLearnLogo size="xl" showSubtitle={true} />
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 text-[#991B1B] border border-red-200 text-xs font-semibold">
          <Sparkles className="w-4 h-4 text-[#991B1B]" />
          Official Enterprise Learning Management System &bull; 2026 Academic Edition
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#1F2937] tracking-tight max-w-4xl mx-auto leading-tight">
          Enterprise Learning Management System
        </h1>

        <p className="text-sm sm:text-base text-[#4B5563] max-w-2xl mx-auto leading-relaxed">
          Production-grade academic architecture with strict Role-Based Access Control, hierarchical course authoring, automated assessments with Judge0 code execution, and gamified progress tracking for <strong className="text-[#DC2626]">Students</strong>, <strong className="text-[#1F2937]">Instructors</strong>, and <strong className="text-[#1F2937]">Platform Administrators</strong>.
        </p>

        {/* Action CTAs: Registration and Sign In */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => setCurrentView('register')}
            className="bg-[#DC2626] hover:bg-[#B91C1C] text-white font-semibold text-xs px-6 py-3 rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <GraduationCap className="w-4 h-4" />
            <span>Register as Candidate</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setCurrentView('login')}
            className="bg-[#F9FAFB] hover:bg-gray-100 text-[#1F2937] font-semibold text-xs px-6 py-3 rounded-xl transition-all border border-[#E5E7EB] flex items-center gap-2 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-[#DC2626]" />
            <span>Candidate & Faculty Sign In</span>
          </button>

          <button
            onClick={() => setCurrentView('courses_overview')}
            className="text-xs text-[#DC2626] hover:text-[#B91C1C] font-semibold px-4 py-3 flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            <span>Explore Course Catalog</span>
          </button>
        </div>

        {/* 4 Core Capability Engines Grid */}
        <div className="pt-6 border-t border-[#E5E7EB]">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#DC2626] mb-4">
            Four Core LMS Capability Engines
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 text-left">
            <div className="p-4 rounded-2xl bg-[#F9FAFB] border border-[#E5E7EB] space-y-1.5">
              <div className="w-8 h-8 rounded-lg bg-red-50 text-[#DC2626] flex items-center justify-center border border-red-200">
                <Users className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-[#1F2937]">1. User & RBAC Management</h3>
              <p className="text-[11px] text-[#4B5563] leading-snug">
                Tiered access for Admins, Instructors, and Students with cohort/batch grouping and secure session tokens.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F9FAFB] border border-[#E5E7EB] space-y-1.5">
              <div className="w-8 h-8 rounded-lg bg-red-50 text-[#DC2626] flex items-center justify-center border border-red-200">
                <BookOpen className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-[#1F2937]">2. Course Authoring</h3>
              <p className="text-[11px] text-[#4B5563] leading-snug">
                Hierarchical Courses &rarr; Modules &rarr; Lessons with video players, markdown notes & attachments.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F9FAFB] border border-[#E5E7EB] space-y-1.5">
              <div className="w-8 h-8 rounded-lg bg-red-50 text-[#DC2626] flex items-center justify-center border border-red-200">
                <Cpu className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-[#1F2937]">3. Assessment Engine</h3>
              <p className="text-[11px] text-[#4B5563] leading-snug">
                Automated quiz evaluation, Judge0 code runner sandbox, and instant grading feedback loops.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F9FAFB] border border-[#E5E7EB] space-y-1.5">
              <div className="w-8 h-8 rounded-lg bg-red-50 text-[#DC2626] flex items-center justify-center border border-red-200">
                <Award className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-[#1F2937]">4. Tracking & Gamification</h3>
              <p className="text-[11px] text-[#4B5563] leading-snug">
                Real-time SVG circular progress bars, daily streak tracker, and verifiable certificates.
              </p>
            </div>
          </div>
        </div>

        {/* Secondary CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <button
            onClick={() => setCurrentView('login')}
            className="bg-[#DC2626] hover:bg-[#B91C1C] text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer"
          >
            Sign In with Email <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setCurrentView('register')}
            className="bg-[#F9FAFB] hover:bg-gray-100 text-[#1F2937] font-semibold text-xs px-5 py-2.5 rounded-xl transition-all border border-[#E5E7EB] flex items-center gap-2 cursor-pointer"
          >
            <GraduationCap className="w-4 h-4 text-[#DC2626]" /> Register Student Account
          </button>

          <button
            onClick={() => setCurrentView('courses_overview')}
            className="bg-[#F9FAFB] hover:bg-gray-100 text-[#1F2937] font-semibold text-xs px-5 py-2.5 rounded-xl transition-colors border border-[#E5E7EB] cursor-pointer"
          >
            Browse Course Catalog (11 Tracks)
          </button>
        </div>

        {/* Scalability Badge Bar */}
        <div className="pt-8 border-t border-[#E5E7EB] grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
          <div className="p-3 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB]">
            <div className="text-[11px] text-[#4B5563]">Platform Governance</div>
            <div className="text-base font-bold text-[#1F2937]">Meera Patel</div>
            <div className="text-[10px] text-[#DC2626] font-semibold">Course Approval & SaaS RBAC</div>
          </div>

          <div className="p-3 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB]">
            <div className="text-[11px] text-[#4B5563]">Faculty Directorate</div>
            <div className="text-base font-bold text-[#1F2937]">Rohit Verma</div>
            <div className="text-[10px] text-[#DC2626] font-semibold">DSA Lead & Material Upload</div>
          </div>

          <div className="p-3 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB]">
            <div className="text-[11px] text-[#4B5563]">Active Learners</div>
            <div className="text-base font-bold text-[#1F2937]">Ananya Sharma</div>
            <div className="text-[10px] text-[#DC2626] font-semibold">Final-Year B.Tech Cohort</div>
          </div>

          <div className="p-3 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB]">
            <div className="text-[11px] text-[#4B5563]">AI Tutor Latency</div>
            <div className="text-base font-bold text-[#1F2937]">&lt; 10s Response</div>
            <div className="text-[10px] text-[#4B5563]">RAG Grounded in Curriculum</div>
          </div>
        </div>
      </section>

      {/* Feature Pillar Highlights */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1F2937]">
            Architecture Designed for Institutional Scale
          </h2>
          <p className="text-xs sm:text-sm text-[#4B5563] max-w-xl mx-auto">
            Zero-trust role boundaries, embedded RAG AI tutor, automated grading, and comprehensive analytics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-[#DC2626] flex items-center justify-center border border-red-200">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-[#1F2937] text-base">
              Context-Aware RAG AI Tutor
            </h3>
            <p className="text-xs text-[#4B5563] leading-relaxed">
              Provides Socratic hints, conceptual explanations, active recall challenges, and exam integrity locks grounded in course materials with verbatim citations.
            </p>
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-[#DC2626] flex items-center justify-center border border-red-200">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-[#1F2937] text-base">
              Automated Assessment & Grading
            </h3>
            <p className="text-xs text-[#4B5563] leading-relaxed">
              Quizzes and assignments are scored automatically with rubrics and automated feedback, while subjective tasks are routed to instructors with gradebook curving.
            </p>
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-[#DC2626] flex items-center justify-center border border-red-200">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-[#1F2937] text-base">
              Student Segmentation & Analytics
            </h3>
            <p className="text-xs text-[#4B5563] leading-relaxed">
              Real-time classification across Excellent, Good, Needs Improvement, and At-Risk tiers with content gap detection, at-risk alerts, and live attendance tracking.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Role Access Portal */}
      <section className="bg-white border border-[#E5E7EB] rounded-3xl p-8 space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-[#1F2937]">
              Institutional User Access Portals
            </h3>
            <p className="text-xs text-[#4B5563]">
              Select your authenticated role or register a new verified student account.
            </p>
          </div>

          <button
            onClick={() => setCurrentView('login')}
            className="text-xs font-semibold text-[#DC2626] hover:text-[#B91C1C] flex items-center gap-1 cursor-pointer"
          >
            Launch Sign In Gateway <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div 
            onClick={() => setCurrentView('login')}
            className="p-5 rounded-2xl bg-[#F9FAFB] border border-[#E5E7EB] hover:border-red-300 cursor-pointer transition-all space-y-3 group shadow-xs"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#DC2626] uppercase tracking-wider">Student Workspace</span>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#DC2626] transition-colors" />
            </div>
            <div className="text-sm font-semibold text-[#1F2937]">Undergraduate & Cohort Learners</div>
            <p className="text-xs text-[#4B5563] leading-relaxed">
              Access enrolled lectures, complete interactive quizzes, submit code assignments in Judge0 sandbox, and track daily streaks.
            </p>
            <div className="pt-2 flex items-center justify-between text-xs text-[#DC2626] font-semibold">
              <span>Sign In with Credentials</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          <div 
            onClick={() => setCurrentView('login')}
            className="p-5 rounded-2xl bg-[#F9FAFB] border border-[#E5E7EB] hover:border-red-300 cursor-pointer transition-all space-y-3 group shadow-xs"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#DC2626] uppercase tracking-wider">Faculty Workspace</span>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#DC2626] transition-colors" />
            </div>
            <div className="text-sm font-semibold text-[#1F2937]">Course Instructors & Evaluators</div>
            <p className="text-xs text-[#4B5563] leading-relaxed">
              Author assigned curricula, review automated grading queues, examine drop-off analytics, and verify attendance records.
            </p>
            <div className="pt-2 flex items-center justify-between text-xs text-[#DC2626] font-semibold">
              <span>Faculty Sign In</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          <div 
            onClick={() => setCurrentView('login')}
            className="p-5 rounded-2xl bg-[#F9FAFB] border border-[#E5E7EB] hover:border-red-300 cursor-pointer transition-all space-y-3 group shadow-xs"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#DC2626] uppercase tracking-wider">Admin Workspace</span>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#DC2626] transition-colors" />
            </div>
            <div className="text-sm font-semibold text-[#1F2937]">Academic Governance & Operations</div>
            <p className="text-xs text-[#4B5563] leading-relaxed">
              Inspect student segmentation, approve new courses, audit security events, and manage system-wide compliance logs.
            </p>
            <div className="pt-2 flex items-center justify-between text-xs text-[#DC2626] font-semibold">
              <span>Admin Sign In</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
