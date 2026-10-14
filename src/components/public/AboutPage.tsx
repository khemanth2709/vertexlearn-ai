import React from 'react';
import { useLMS } from '../../context/LMSContext';
import { ShieldCheck, Database, Server, Cpu, Award, Users, CheckCircle2, ArrowRight } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { setCurrentView } = useLMS();

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-16 text-[#1F2937]">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-extrabold text-[#1F2937] tracking-tight">
          About VertexLearn AI
        </h1>
        <p className="text-sm text-[#4B5563] max-w-xl mx-auto leading-relaxed">
          An institutional Learning Management System engineered for high-assurance academic standards, scalable multi-user isolation, and automated grading pipelines.
        </p>
      </div>

      {/* Architecture Stack */}
      <div className="bg-white border border-[#E5E7EB] rounded-3xl p-8 space-y-6 shadow-xs">
        <h2 className="text-lg font-bold text-[#1F2937] flex items-center gap-2">
          <Server className="w-5 h-5 text-[#DC2626]" />
          Technical Stack & Infrastructure
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] space-y-1.5">
            <div className="font-bold text-[#1F2937] text-sm">Frontend Architecture</div>
            <p className="text-[#4B5563]">React.js + Vite, TypeScript, Tailwind CSS, Recharts for analytics, responsive design.</p>
          </div>
          <div className="p-4 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] space-y-1.5">
            <div className="font-bold text-[#1F2937] text-sm">Backend Engine</div>
            <p className="text-[#4B5563]">Node.js, Express.js REST API, Socket.IO real-time channels, JWT access/refresh rotation.</p>
          </div>
          <div className="p-4 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] space-y-1.5">
            <div className="font-bold text-[#1F2937] text-sm">Database & Relational Model</div>
            <p className="text-[#4B5563]">PostgreSQL with Prisma ORM, pgvector for high-dimensional semantic search, indexed foreign keys.</p>
          </div>
          <div className="p-4 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] space-y-1.5">
            <div className="font-bold text-[#1F2937] text-sm">Cloud Object Vault</div>
            <p className="text-[#4B5563]">AWS S3 presigned storage for videos, assignment archives, SCORM packages & official certificates.</p>
          </div>
        </div>
      </div>

      {/* Governance & Users Scale */}
      <div className="bg-white border border-[#E5E7EB] rounded-3xl p-8 space-y-6 shadow-xs">
        <h2 className="text-lg font-bold text-[#1F2937] flex items-center gap-2">
          <Users className="w-5 h-5 text-[#DC2626]" />
          Multi-User Role Boundaries
        </h2>

        <div className="space-y-3 text-xs text-[#4B5563] leading-relaxed">
          <div className="p-3 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] flex items-start gap-3">
            <div className="w-6 h-6 rounded bg-red-50 text-[#DC2626] border border-red-200 flex items-center justify-center font-bold shrink-0 mt-0.5">1</div>
            <div>
              <span className="font-bold text-[#1F2937]">Administrator (Meera Patel): </span>
              Comprehensive audit logging, student performance segmentation (90-100%, 70-89%, 40-69%, &lt;40%), faculty management, and system-wide telemetry.
            </div>
          </div>

          <div className="p-3 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] flex items-start gap-3">
            <div className="w-6 h-6 rounded bg-red-50 text-[#DC2626] border border-red-200 flex items-center justify-center font-bold shrink-0 mt-0.5">9</div>
            <div>
              <span className="font-bold text-[#1F2937]">Specialized Instructors: </span>
              Author courses, upload multimedia, create quizzes with objective and subjective rubrics, review automated grading outputs, and broadcast attendance sessions.
            </div>
          </div>

          <div className="p-3 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] flex items-start gap-3">
            <div className="w-6 h-6 rounded bg-red-50 text-[#DC2626] border border-red-200 flex items-center justify-center font-bold shrink-0 mt-0.5">1.8k</div>
            <div>
              <span className="font-bold text-[#1F2937]">Enrolled Students: </span>
              Strictly isolated data boundaries. Each student sees only their own enrolled courses, grades, attendance records, learning gaps, and context-aware AI Tutor.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
