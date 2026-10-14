import React, { useState, useEffect } from 'react';
import { useLMS } from '../../context/LMSContext';
import { StudentDashboardSkeleton } from './DashboardSkeleton';
import { CircularProgressBar } from '../common/CircularProgressBar';
import { StreakTracker } from '../student/StreakTracker';
import { CodeExecutionSandbox } from '../common/CodeExecutionSandbox';
import { ArchitectureApiBlueprint } from '../common/ArchitectureApiBlueprint';
import { AILearningMilestones } from './AILearningMilestones';
import { 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  CalendarCheck, 
  Award, 
  ArrowRight, 
  PlayCircle, 
  FileText, 
  Sparkles,
  QrCode,
  Target,
  RefreshCw,
  Terminal,
  Database,
  Bot,
  Layers,
  ChevronRight,
  ShieldCheck,
  Video
} from 'lucide-react';
import { CertificateModal } from '../certificate/CertificateModal';
import { CertificateData } from '../certificate/CertificateTemplate';

export const StudentDashboard: React.FC = () => {
  const { 
    user, 
    courses, 
    setCurrentView, 
    setActiveCourseId, 
    calculateCourseProgress, 
    certificates, 
    getStudentAttendanceRate,
    checkInAttendance,
    attendanceSessions,
    attendanceRecords,
    setIsAITutorOpen,
    setAiTutorMode
  } = useLMS();

  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'courses' | 'code_sandbox' | 'architecture_blueprint' | 'certificates'>('courses');
  const [attendanceFeedback, setAttendanceFeedback] = useState<string | null>(null);
  const [selectedCertData, setSelectedCertData] = useState<CertificateData | null>(null);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);

  // Perceived performance simulation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, []);

  const handleManualRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 400);
  };

  const enrolledCourses = courses.filter(c => user?.enrolledCourseIds.includes(c.id));
  const primaryCourse = enrolledCourses[0] || courses[0];
  const primaryProgress = primaryCourse ? calculateCourseProgress(primaryCourse.id) : 0;
  const attendanceRate = getStudentAttendanceRate();
  const profile = user?.studentProfile;
  const nextAction = profile?.nextRecommendedAction;
  const activeSession = attendanceSessions.find(s => s.isActive) || attendanceSessions[0];

  const isCheckedIn = attendanceRecords.some(
    r => r.sessionId === activeSession?.id && (r.studentId === user?.id || !user)
  );

  const handleResumeCourse = (courseId: string) => {
    setActiveCourseId(courseId);
    setCurrentView('course_player');
  };

  const handleCheckInAttendance = () => {
    if (!activeSession) return;
    const result = checkInAttendance(activeSession.id, 'Manual');
    if (result.success) {
      setAttendanceFeedback(`Marked PRESENT for "${activeSession.topic}". Attendance verified.`);
    } else {
      setAttendanceFeedback(result.message);
    }
  };

  if (isLoading) {
    return <StudentDashboardSkeleton />;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-white min-h-screen text-[#1F2937] space-y-8 rounded-3xl border border-[#E5E7EB] shadow-xs">
      
      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E5E7EB]">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-[#DC2626] border border-red-200 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#DC2626]" />
              Batch 2026 &bull; {user?.department || 'Computer Science'}
            </span>
            <span className="text-xs text-[#4B5563]">
              Roll No: <strong className="text-[#1F2937]">{profile?.studentRollNumber || 'STU-2026-0104'}</strong>
            </span>
            <button
              onClick={handleManualRefresh}
              title="Sync telemetry"
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#F9FAFB] hover:bg-gray-100 text-[#4B5563] hover:text-[#1F2937] text-xs border border-[#E5E7EB] transition-colors cursor-pointer ml-1"
            >
              <RefreshCw className="w-3 h-3" /> Sync
            </button>
          </div>

          <h1 className="text-3xl lg:text-4xl font-extrabold text-[#1F2937] tracking-tight">
            My Learning Dashboard
          </h1>
          <p className="text-[#4B5563] text-sm mt-1">
            Welcome back, <span className="text-[#1F2937] font-semibold">{user?.name || 'Student'}</span>. Track your courses, live streaks, automated code assessments, and AI Tutor milestones.
          </p>
        </div>

        {/* Quick AI Tutor Launcher & Academic GPA Pill */}
        <div className="flex items-center gap-3">
          <div className="bg-[#F9FAFB] border border-[#E5E7EB] px-4 py-2 rounded-2xl text-right shadow-xs">
            <div className="text-[10px] text-[#4B5563] uppercase font-semibold">GPA / Academic Standing</div>
            <div className="text-base font-bold text-[#DC2626]">
              {profile?.gpa || 3.92} / 4.0 <span className="text-xs text-[#4B5563] font-normal">({profile?.overallScore || 94}%)</span>
            </div>
          </div>

          <button
            onClick={() => {
              setAiTutorMode('study');
              setIsAITutorOpen(true);
            }}
            className="bg-[#DC2626] hover:bg-[#B91C1C] text-white font-semibold text-xs px-4 py-3 rounded-2xl flex items-center gap-2 transition-all shadow-sm cursor-pointer"
          >
            <Bot className="w-4 h-4 text-white" />
            <span>Ask AI Tutor</span>
          </button>
        </div>
      </div>

      {/* Metric Counters Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#F9FAFB] p-5 rounded-2xl border border-[#E5E7EB] space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-[#4B5563] text-xs font-medium">
            <span>Enrolled Courses</span>
            <BookOpen className="w-4 h-4 text-[#DC2626]" />
          </div>
          <div className="text-2xl font-bold text-[#1F2937]">{enrolledCourses.length}</div>
          <div className="text-[11px] text-[#DC2626] font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Active Enrollment
          </div>
        </div>

        <div className="bg-[#F9FAFB] p-5 rounded-2xl border border-[#E5E7EB] space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-[#4B5563] text-xs font-medium">
            <span>Daily Streak</span>
            <Sparkles className="w-4 h-4 text-[#DC2626]" />
          </div>
          <div className="text-2xl font-bold text-[#1F2937]">5 Days</div>
          <div className="text-[11px] text-[#4B5563]">
            Flame Active &bull; Goal Met
          </div>
        </div>

        <div className="bg-[#F9FAFB] p-5 rounded-2xl border border-[#E5E7EB] space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-[#4B5563] text-xs font-medium">
            <span>Attendance Rate</span>
            <CalendarCheck className="w-4 h-4 text-[#DC2626]" />
          </div>
          <div className="text-2xl font-bold text-[#1F2937]">{attendanceRate}%</div>
          <div className="text-[11px] text-[#4B5563]">
            {isCheckedIn ? 'Present Today' : 'Session Ready'}
          </div>
        </div>

        <div className="bg-[#F9FAFB] p-5 rounded-2xl border border-[#E5E7EB] space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-[#4B5563] text-xs font-medium">
            <span>Certificates Earned</span>
            <Award className="w-4 h-4 text-[#DC2626]" />
          </div>
          <div className="text-2xl font-bold text-[#1F2937]">{certificates.length}</div>
          <div className="text-[11px] text-[#4B5563]">
            Verifiable S3 Credentials
          </div>
        </div>
      </div>

      {/* Interactive Tabs Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E5E7EB] pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('courses')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'courses' 
                ? 'bg-[#DC2626] text-white shadow-xs font-bold' 
                : 'bg-[#F9FAFB] text-[#4B5563] hover:text-[#1F2937] hover:bg-gray-100 border border-[#E5E7EB]'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>My Enrolled Courses ({enrolledCourses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('code_sandbox')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'code_sandbox' 
                ? 'bg-[#DC2626] text-white shadow-xs font-bold' 
                : 'bg-[#F9FAFB] text-[#4B5563] hover:text-[#1F2937] hover:bg-gray-100 border border-[#E5E7EB]'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>Judge0 Code Sandbox</span>
          </button>

          <button
            onClick={() => setActiveTab('architecture_blueprint')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'architecture_blueprint' 
                ? 'bg-[#DC2626] text-white shadow-xs font-bold' 
                : 'bg-[#F9FAFB] text-[#4B5563] hover:text-[#1F2937] hover:bg-gray-100 border border-[#E5E7EB]'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>API Blueprint</span>
          </button>

          <button
            onClick={() => setActiveTab('certificates')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'certificates' 
                ? 'bg-[#991B1B] text-white shadow-xs font-bold' 
                : 'bg-[#F9FAFB] text-[#4B5563] hover:text-[#1F2937] hover:bg-gray-100 border border-[#E5E7EB]'
            }`}
          >
            <span>📜</span>
            <span>Accredited Certificates ({certificates.length})</span>
          </button>
        </div>

        <button
          onClick={() => setCurrentView('courses')}
          className="text-xs text-[#DC2626] hover:text-[#B91C1C] font-semibold flex items-center gap-1 cursor-pointer"
        >
          <span>Explore All 13 Catalog Courses</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Tab Views */}
      {activeTab === 'courses' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left 2 Columns: Enrolled Courses Grid */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {enrolledCourses.map((course) => {
                const progressPercentage = calculateCourseProgress(course.id);
                return (
                  <div 
                    key={course.id} 
                    className="bg-[#F9FAFB] p-6 rounded-2xl border border-[#E5E7EB] shadow-xs hover:border-[#DC2626]/40 transition-all flex flex-col justify-between group"
                  >
                    <div>
                      {/* Top Category & Circular Progress Bar */}
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#DC2626] bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
                            {course.category} &bull; {course.level}
                          </span>
                          <h3 className="text-xl font-semibold mb-2 text-[#1F2937] group-hover:text-[#DC2626] transition-colors mt-2">
                            {course.title}
                          </h3>
                        </div>

                        {/* Circular Progress Ring */}
                        <CircularProgressBar 
                          percentage={progressPercentage} 
                          size={52} 
                          strokeWidth={4.5} 
                        />
                      </div>

                      <p className="text-[#4B5563] text-sm mb-4 line-clamp-2 leading-relaxed">
                        {course.description}
                      </p>

                      <div className="flex items-center justify-between text-xs text-[#4B5563] mb-2 font-medium">
                        <span>{course.modules.length} Modules &bull; {course.estimatedHours}h Total</span>
                        <span className="text-[#DC2626] font-bold">{progressPercentage}% Completed</span>
                      </div>

                      {/* Full-width Linear Progress Bar */}
                      <div className="w-full bg-[#E5E7EB] h-2 rounded-full overflow-hidden mb-4">
                        <div 
                          className="bg-[#DC2626] h-full transition-all duration-500" 
                          style={{ width: `${progressPercentage || 0}%` }}
                        />
                      </div>
                    </div>

                    {/* Continue Learning Button */}
                    <button 
                      onClick={() => handleResumeCourse(course.id)}
                      className="w-full bg-[#DC2626] hover:bg-[#B91C1C] text-white py-2.5 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer mt-2"
                    >
                      <PlayCircle className="w-4 h-4" />
                      <span>{progressPercentage > 0 ? 'Continue Learning' : 'Start Course'}</span>
                    </button>
                  </div>
                );
              })}
            </div>

            {/* AI Learning Milestones Graph */}
            <div className="pt-2">
              <AILearningMilestones />
            </div>
          </div>

          {/* Right Column: Streak Tracker, Live Attendance & AI Recommendations */}
          <div className="space-y-6">
            
            {/* Daily Streak Tracker */}
            <StreakTracker streakCount={5} motivatingLabel="You're on fire! 5-day continuous learning streak." />

            {/* Recommended Next Action Banner */}
            {nextAction && (
              <div className="bg-[#F9FAFB] p-5 rounded-2xl border border-[#E5E7EB] space-y-3 shadow-xs">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-red-50 text-[#DC2626] flex items-center justify-center">
                    <Target className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#DC2626]">AI Study Engine</span>
                    <h4 className="text-xs font-bold text-[#1F2937]">{nextAction.title}</h4>
                  </div>
                </div>
                <p className="text-xs text-[#4B5563] leading-relaxed">
                  {nextAction.description}
                </p>
                <button
                  onClick={() => setCurrentView('assignments')}
                  className="w-full bg-white hover:bg-gray-50 border border-[#E5E7EB] text-[#1F2937] text-xs py-2 rounded-xl font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Resolve Topic</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Live Attendance Check-In Card */}
            <div className="bg-[#F9FAFB] p-5 rounded-2xl border border-[#E5E7EB] space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-[#1F2937] text-sm flex items-center gap-2">
                  <CalendarCheck className="w-4 h-4 text-[#DC2626]" />
                  Live Attendance Check-In
                </h3>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                  isCheckedIn 
                    ? 'bg-red-50 text-[#DC2626] border-red-200' 
                    : 'bg-gray-100 text-[#4B5563] border-[#E5E7EB]'
                }`}>
                  {isCheckedIn ? 'Present Verified' : 'Session Ready'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white border border-[#E5E7EB] space-y-1 text-xs">
                <div className="font-semibold text-[#1F2937]">{activeSession?.topic || 'Distributed Systems & Web Engines'}</div>
                <div className="text-[11px] text-[#4B5563]">{activeSession?.startTime || '09:00 AM'} - {activeSession?.endTime || '10:30 AM'}</div>
                <div className="text-[10px] text-[#DC2626] font-medium">{activeSession?.instructorName || 'Dr. Elena Vance'}</div>
              </div>

              {attendanceFeedback && (
                <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl text-xs text-[#DC2626] flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#DC2626] shrink-0" />
                  <span>{attendanceFeedback}</span>
                </div>
              )}

              <button
                onClick={handleCheckInAttendance}
                disabled={isCheckedIn}
                className={`w-full py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 text-xs font-semibold cursor-pointer ${
                  isCheckedIn 
                    ? 'bg-gray-100 text-[#4B5563] border border-[#E5E7EB] cursor-default' 
                    : 'bg-[#DC2626] hover:bg-[#B91C1C] text-white shadow-xs'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" /> 
                {isCheckedIn ? 'Attendance Recorded (PRESENT)' : '1-Click Attendance Check-In'}
              </button>
            </div>

          </div>

        </div>
      )}

      {/* Tab 2: Code Execution Sandbox */}
      {activeTab === 'code_sandbox' && (
        <div className="space-y-4">
          <CodeExecutionSandbox />
        </div>
      )}

      {/* Tab 3: Full-Stack Architecture & API Blueprint */}
      {activeTab === 'architecture_blueprint' && (
        <div className="space-y-4">
          <ArchitectureApiBlueprint />
        </div>
      )}

      {/* Tab 4: Accredited Certificates */}
      {activeTab === 'certificates' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-[#1F2937]">
                Academic Accreditation & Course Certificates
              </h3>
              <p className="text-xs text-[#4B5563] mt-0.5">
                Certificates are issued strictly upon 100% completion of course lessons, quizzes, and laboratory milestones.
              </p>
            </div>
            <button
              onClick={() => setCurrentView('verify_certificate')}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-[#1F2937] text-xs font-semibold rounded-xl transition-colors cursor-pointer shrink-0 flex items-center gap-1.5"
            >
              <span>🔍</span> Public Verification Portal
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courses.map(course => {
              const progress = calculateCourseProgress(course.id);
              const isEnrolled = enrolledCourses.some(c => c.id === course.id);
              const isEligible = isEnrolled && progress === 100;

              return (
                <div
                  key={course.id}
                  className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-xs flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-[#991B1B] uppercase tracking-wider">
                        {course.category}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                          isEligible
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {isEligible ? 'Accredited (100%)' : isEnrolled ? `${progress}% In Progress` : 'Not Enrolled'}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-[#1F2937] leading-snug">
                      {course.title}
                    </h4>
                    <p className="text-xs text-[#4B5563] line-clamp-2">
                      {course.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#E5E7EB] flex items-center justify-between gap-2">
                    <div className="text-[11px] text-[#4B5563]">
                      Instructor: <strong className="text-[#1F2937]">{course.instructorName || 'Dr. Priya Sharma'}</strong>
                    </div>

                    {isEligible ? (
                      <button
                        onClick={() => {
                          const certCode = course.code ? course.code.replace(/[^a-zA-Z0-9]/g, '') : course.id.replace('c_', '').toUpperCase();
                          const certId = `VXAI-${certCode}-2026-${Math.floor(1000 + Math.random() * 9000)}`;
                          setSelectedCertData({
                            certificateId: certId,
                            recipientName: user?.name || 'Ananya Sharma',
                            courseTitle: course.title,
                            courseCode: course.code,
                            issueDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
                            directorName: 'Dr. Priya Sharma',
                            directorTitle: 'CEO & Academic Dean',
                            instructorName: course.instructorName || 'Rahul Verma',
                            instructorTitle: course.instructorTitle || 'Head of Academic Programs',
                            verificationUrl: `${window.location.origin}/verify/${certId}`
                          });
                          setIsCertModalOpen(true);
                        }}
                        className="px-3.5 py-1.5 bg-[#991B1B] hover:bg-[#7F1D1D] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                      >
                        <span>📜</span> View & Download A4 PDF
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setActiveCourseId(course.id);
                          setCurrentView('course_player');
                        }}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <span>🔒</span> {isEnrolled ? `Resume Course (${progress}%)` : 'Enroll in Course'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Official A4 Certificate Modal Preview & Download */}
      {selectedCertData && (
        <CertificateModal
          isOpen={isCertModalOpen}
          onClose={() => setIsCertModalOpen(false)}
          data={selectedCertData}
          onViewVerification={() => setCurrentView('verify_certificate')}
        />
      )}

    </div>
  );
};
