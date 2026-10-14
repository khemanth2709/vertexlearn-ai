import React, { useState } from 'react';
import { 
  TrendingDown, 
  AlertTriangle, 
  ShieldAlert, 
  Users, 
  Sparkles, 
  CheckCircle2, 
  Search, 
  Filter, 
  Mail, 
  Calendar, 
  BookOpen, 
  Clock, 
  ChevronRight, 
  BarChart3, 
  ArrowUpRight, 
  UserX, 
  FileText, 
  Activity, 
  Zap, 
  X
} from 'lucide-react';
import { useLMS } from '../../context/LMSContext';
import { StudentTelemetrySignal } from '../../types/lms';

export const PredictiveAnalyticsModule: React.FC = () => {
  const { user, recordAuditLog } = useLMS();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState<string>('ALL');
  const [selectedStudent, setSelectedStudent] = useState<StudentTelemetrySignal | null>(null);
  const [remediationSuccessToast, setRemediationSuccessToast] = useState<string | null>(null);

  // Student Telemetry Signals Mock Dataset
  const [students, setStudents] = useState<StudentTelemetrySignal[]>([
    {
      studentId: 'stu-01',
      studentName: 'Vikram Seth',
      rollNumber: 'STU-2026-0412',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      department: 'Computer Science & Engineering',
      year: '3rd Year',
      riskScore: 86, // Critical
      riskTier: 'CRITICAL',
      factors: {
        inactivityDays: 16,
        videoDropOffRatePercent: 78,
        failedQuizCount: 3,
        lateSubmissionCount: 2,
        forumParticipationScore: 12
      },
      suggestedInterventions: [
        'Assign Supplementary Video Module: "Graph Adjacency Lists & DFS/BFS Review"',
        'Schedule 1-on-1 Office Hours with Prof. Rohit Verma',
        'Trigger Automated Academic Retention SMS & Email Nudge'
      ],
      advisorFlagged: true,
      remediationAssigned: false
    },
    {
      studentId: 'stu-02',
      studentName: 'Neha Kapoor',
      rollNumber: 'STU-2026-0881',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      department: 'Data Science & Artificial Intelligence',
      year: '2nd Year',
      riskScore: 68, // High
      riskTier: 'HIGH',
      factors: {
        inactivityDays: 9,
        videoDropOffRatePercent: 54,
        failedQuizCount: 2,
        lateSubmissionCount: 1,
        forumParticipationScore: 35
      },
      suggestedInterventions: [
        'Recommend Interactive Code Kata: "PyTorch Tensor Operations & Broadcasting"',
        'Pair with Peer Study Pod Alpha for collaborative assignments'
      ],
      advisorFlagged: true,
      remediationAssigned: false
    },
    {
      studentId: 'stu-03',
      studentName: 'Kabir Das',
      rollNumber: 'STU-2026-0119',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      department: 'Information Technology',
      year: '4th Year',
      riskScore: 42, // Moderate
      riskTier: 'MODERATE',
      factors: {
        inactivityDays: 5,
        videoDropOffRatePercent: 32,
        failedQuizCount: 1,
        lateSubmissionCount: 1,
        forumParticipationScore: 50
      },
      suggestedInterventions: [
        'Send gentle automated reminder for upcoming Distributed Systems assignment deadline'
      ],
      advisorFlagged: false,
      remediationAssigned: false
    },
    {
      studentId: 'stu-04',
      studentName: 'Aarav Sharma',
      rollNumber: 'STU-2026-0104',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      department: 'Computer Science & Engineering',
      year: '3rd Year',
      riskScore: 14, // Low
      riskTier: 'LOW',
      factors: {
        inactivityDays: 0,
        videoDropOffRatePercent: 8,
        failedQuizCount: 0,
        lateSubmissionCount: 0,
        forumParticipationScore: 94
      },
      suggestedInterventions: [
        'Eligible for Teaching Assistant (TA) nomination and honors cohort recognition'
      ],
      advisorFlagged: false,
      remediationAssigned: false
    }
  ]);

  // Dispatch Remediation Plan Action
  const handleAssignRemediation = (student: StudentTelemetrySignal) => {
    setStudents(prev => prev.map(s => s.studentId === student.studentId ? {
      ...s,
      remediationAssigned: true,
      riskScore: Math.max(10, s.riskScore - 20)
    } : s));

    recordAuditLog('USER_CREATED', `Dispatched AI Remediation Plan for student ${student.studentName} (${student.rollNumber})`);
    setRemediationSuccessToast(`Dispatched personalized remediation pathway & invited ${student.studentName} to instructor office hours.`);
    setTimeout(() => setRemediationSuccessToast(null), 4000);
  };

  // Filter students
  const filteredStudents = students.filter(s => {
    const matchesSearch = s.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTier = selectedTier === 'ALL' || s.riskTier === selectedTier;
    return matchesSearch && matchesTier;
  });

  return (
    <div className="space-y-6 text-[#1F2937]">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-[#DC2626] border border-red-200">
                <AlertTriangle className="w-3.5 h-3.5 text-[#DC2626]" />
                Predictive Machine Learning Early Warning System
              </span>
              <span className="text-xs text-[#4B5563] font-mono">
                Behavioral Telemetry Model • Random Forest Dropout Classifier
              </span>
            </div>
            <h1 className="text-2xl font-bold text-[#1F2937] flex items-center gap-2.5">
              <span>Predictive At-Risk Student Analytics & Cohort Intelligence</span>
            </h1>
            <p className="text-sm text-[#4B5563] mt-1 max-w-3xl">
              Proactive machine learning model analyzing student platform telemetry—including video drop-off rates, login cadence, quiz failure trends, and assignment timeliness—to flag lagging students weeks before final exams.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] text-center min-w-[120px]">
              <div className="text-xs text-[#4B5563]">Critical At-Risk</div>
              <div className="text-xl font-bold text-[#DC2626]">
                {students.filter(s => s.riskTier === 'CRITICAL').length}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] text-center min-w-[120px]">
              <div className="text-xs text-[#4B5563]">High Risk</div>
              <div className="text-xl font-bold text-amber-600">
                {students.filter(s => s.riskTier === 'HIGH').length}
              </div>
            </div>
          </div>
        </div>

        {/* Tier Tabs */}
        <div className="flex items-center gap-2 mt-6 border-t border-[#E5E7EB] pt-4 overflow-x-auto">
          {['ALL', 'CRITICAL', 'HIGH', 'MODERATE', 'LOW'].map((tier) => (
            <button
              key={tier}
              onClick={() => setSelectedTier(tier)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedTier === tier
                  ? 'bg-[#DC2626] text-white shadow-xs'
                  : 'bg-[#F9FAFB] border border-[#E5E7EB] text-[#4B5563] hover:text-[#1F2937] hover:bg-white'
              }`}
            >
              {tier === 'ALL' ? 'All Cohort Students' : `${tier} Risk (${students.filter(s => s.riskTier === tier).length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Left Roster & Right Diagnostic Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left 7-8 Columns: Student Roster with Risk Metrics */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Search bar */}
          <div className="p-3.5 rounded-2xl bg-white border border-[#E5E7EB] flex items-center gap-3 shadow-xs">
            <Search className="w-4 h-4 text-[#4B5563] shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search at-risk students by name, roll number, or department..."
              className="w-full bg-transparent text-xs text-[#1F2937] placeholder-[#4B5563] focus:outline-none"
            />
          </div>

          {/* Student Cards */}
          <div className="space-y-3">
            {filteredStudents.map((st) => {
              const isCritical = st.riskTier === 'CRITICAL';
              const isHigh = st.riskTier === 'HIGH';
              const isModerate = st.riskTier === 'MODERATE';

              return (
                <div
                  key={st.studentId}
                  className={`p-5 rounded-2xl border transition-all ${
                    isCritical
                      ? 'bg-red-50/40 border-[#DC2626] shadow-xs'
                      : isHigh
                      ? 'bg-amber-50/40 border-amber-300'
                      : 'bg-white border-[#E5E7EB] hover:border-gray-300 shadow-xs'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    
                    {/* Student Info */}
                    <div className="flex items-center gap-3.5">
                      <img
                        src={st.avatar}
                        alt={st.studentName}
                        className="w-12 h-12 rounded-2xl object-cover border border-[#E5E7EB]"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-[#1F2937]">{st.studentName}</h3>
                          <span className="text-xs font-mono text-[#4B5563]">{st.rollNumber}</span>
                          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                            isCritical
                              ? 'bg-red-50 text-[#DC2626] border border-red-200'
                              : isHigh
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : isModerate
                              ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}>
                            {st.riskTier} RISK ({st.riskScore}%)
                          </span>
                        </div>
                        <div className="text-xs text-[#4B5563] mt-0.5">
                          {st.department} • {st.year}
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setSelectedStudent(st)}
                        className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#F9FAFB] border border-[#E5E7EB] text-[#4B5563] hover:text-[#1F2937] hover:bg-gray-100 transition-colors cursor-pointer"
                      >
                        Inspect Telemetry
                      </button>

                      <button
                        onClick={() => handleAssignRemediation(st)}
                        disabled={st.remediationAssigned}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          st.remediationAssigned
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-[#DC2626] hover:bg-[#B91C1C] text-white shadow-xs'
                        }`}
                      >
                        {st.remediationAssigned ? '✓ Remediation Active' : 'Dispatch Remediation Plan'}
                      </button>
                    </div>

                  </div>

                  {/* Telemetry Breakdown Bars */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-4 pt-4 border-t border-[#E5E7EB] text-xs">
                    <div className="p-2 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB]">
                      <div className="text-[10px] text-[#4B5563]">Inactivity</div>
                      <div className={`font-bold font-mono mt-0.5 ${st.factors.inactivityDays > 7 ? 'text-[#DC2626]' : 'text-[#1F2937]'}`}>
                        {st.factors.inactivityDays} Days
                      </div>
                    </div>

                    <div className="p-2 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB]">
                      <div className="text-[10px] text-[#4B5563]">Video Drop-Off</div>
                      <div className={`font-bold font-mono mt-0.5 ${st.factors.videoDropOffRatePercent > 50 ? 'text-[#DC2626]' : 'text-[#1F2937]'}`}>
                        {st.factors.videoDropOffRatePercent}%
                      </div>
                    </div>

                    <div className="p-2 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB]">
                      <div className="text-[10px] text-[#4B5563]">Failed Quizzes</div>
                      <div className={`font-bold font-mono mt-0.5 ${st.factors.failedQuizCount > 1 ? 'text-[#DC2626]' : 'text-[#1F2937]'}`}>
                        {st.factors.failedQuizCount} Failed
                      </div>
                    </div>

                    <div className="p-2 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB]">
                      <div className="text-[10px] text-[#4B5563]">Late Homework</div>
                      <div className={`font-bold font-mono mt-0.5 ${st.factors.lateSubmissionCount > 0 ? 'text-amber-600' : 'text-[#1F2937]'}`}>
                        {st.factors.lateSubmissionCount} Overdue
                      </div>
                    </div>

                    <div className="p-2 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB]">
                      <div className="text-[10px] text-[#4B5563]">Forum Score</div>
                      <div className="font-bold font-mono text-[#DC2626] mt-0.5">
                        {st.factors.forumParticipationScore} / 100
                      </div>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

        </div>

        {/* Right 4-5 Columns: Diagnostic Inspector / Deep-Dive */}
        <div className="lg:col-span-4 space-y-4">
          
          <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#1F2937] flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#DC2626]" />
                <span>Diagnostic Telemetry Inspector</span>
              </h3>
              {selectedStudent && (
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="text-xs text-[#4B5563] hover:text-[#1F2937] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {selectedStudent ? (
              <div className="space-y-4 text-xs">
                {/* Header */}
                <div className="p-3.5 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] flex items-center gap-3">
                  <img src={selectedStudent.avatar} alt="Avatar" className="w-10 h-10 rounded-xl object-cover border border-[#E5E7EB]" />
                  <div>
                    <div className="font-bold text-[#1F2937]">{selectedStudent.studentName}</div>
                    <div className="text-[11px] text-[#DC2626] font-mono">
                      Risk Level: {selectedStudent.riskTier} ({selectedStudent.riskScore}%)
                    </div>
                  </div>
                </div>

                {/* AI Root Cause Analysis */}
                <div className="space-y-2">
                  <div className="font-bold text-[#1F2937] text-xs">ML Root Cause Decomposition:</div>
                  <div className="space-y-1.5 text-[#4B5563]">
                    <div className="p-2.5 rounded-xl bg-red-50 border border-red-200">
                      ⚠️ <strong>Steep Video Drop-off:</strong> Student stops watching lectures at minute 14/45 on average. Key conceptual topics missed.
                    </div>
                    <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200">
                      ⚠️ <strong>Struggling with Pointer Logic:</strong> Failed Quizzes 2 and 3 specifically targeted binary tree pointer manipulations.
                    </div>
                  </div>
                </div>

                {/* Recommended Interventions */}
                <div className="space-y-2 pt-2 border-t border-[#E5E7EB]">
                  <div className="font-bold text-[#1F2937] text-xs flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#DC2626]" />
                    <span>Personalized Remediation Interventions:</span>
                  </div>
                  {selectedStudent.suggestedInterventions.map((intv, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] flex items-start gap-2 text-[#4B5563]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{intv}</span>
                    </div>
                  ))}
                </div>

                {/* Trigger Action */}
                <div className="pt-2">
                  <button
                    onClick={() => handleAssignRemediation(selectedStudent)}
                    className="w-full py-2.5 rounded-xl text-xs font-bold bg-[#DC2626] hover:bg-[#B91C1C] text-white transition-colors cursor-pointer shadow-xs"
                  >
                    Execute AI Remediation Pathway
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-[#4B5563] space-y-2">
                <Users className="w-8 h-8 mx-auto text-gray-400" />
                <p className="text-xs">Click "Inspect Telemetry" on any student to review ML root cause factor breakdowns and assign customized remediation.</p>
              </div>
            )}
          </div>

          {/* Model Health Stats */}
          <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] space-y-3 text-xs shadow-xs">
            <h4 className="font-bold text-[#4B5563] uppercase tracking-wider text-[10px]">
              Model Accuracy & Validation
            </h4>
            <div className="flex justify-between text-[#4B5563]">
              <span>Classifier Accuracy (AUC-ROC):</span>
              <span className="font-mono text-emerald-700 font-bold">0.942</span>
            </div>
            <div className="flex justify-between text-[#4B5563]">
              <span>Telemetry Sample Cadence:</span>
              <span className="font-mono text-[#1F2937]">Every 6 Hours</span>
            </div>
            <div className="flex justify-between text-[#4B5563]">
              <span>Intervention Success Rate:</span>
              <span className="font-mono text-emerald-700 font-bold">81.6% retention</span>
            </div>
          </div>

        </div>

      </div>

      {/* Remediation Dispatched Toast */}
      {remediationSuccessToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl bg-white border border-emerald-500 text-[#1F2937] text-xs font-medium shadow-xl animate-fade-in flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{remediationSuccessToast}</span>
        </div>
      )}
    </div>
  );
};
