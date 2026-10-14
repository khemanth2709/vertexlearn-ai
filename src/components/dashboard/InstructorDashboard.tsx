import React, { useState, useEffect } from 'react';
import { useLMS } from '../../context/LMSContext';
import { InstructorDashboardSkeleton } from './DashboardSkeleton';
import { 
  Users, 
  BookOpen, 
  FileCheck2, 
  CheckCircle2, 
  PlusCircle, 
  Clock, 
  Award, 
  ArrowUpRight, 
  CalendarCheck, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  Edit3,
  RefreshCw
} from 'lucide-react';

export const InstructorDashboard: React.FC = () => {
  const { 
    user, 
    courses, 
    submissions, 
    assignments, 
    setCurrentView, 
    setActiveCourseId, 
    gradeSubmissionManually 
  } = useLMS();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 550);
    return () => clearTimeout(timer);
  }, []);

  const handleManualRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 500);
  };

  const [selectedSubForReview, setSelectedSubForReview] = useState<string | null>(null);
  const [overrideScore, setOverrideScore] = useState<number>(98);
  const [feedbackText, setFeedbackText] = useState<string>('');

  const instructorCourses = courses.filter(c => c.instructorName.includes(user?.name.split(' ')[0] || 'Elena') || user?.role === 'ADMIN' || user?.role === 'INSTRUCTOR');

  const handleOpenCourseBuilder = () => {
    setCurrentView('course_builder');
  };

  const handleReviewSubmission = (subId: string) => {
    const sub = submissions.find(s => s.id === subId);
    if (sub) {
      setSelectedSubForReview(subId);
      setOverrideScore(sub.score || 95);
      setFeedbackText(sub.feedback || 'Code meets performance thresholds.');
    }
  };

  const handleSaveGrade = (subId: string) => {
    gradeSubmissionManually(subId, overrideScore, feedbackText);
    setSelectedSubForReview(null);
  };

  if (isLoading) {
    return <InstructorDashboardSkeleton />;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200 text-[#1F2937]">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-50 text-[#DC2626] border border-red-200 text-xs font-semibold">
              <Sparkles className="w-3 h-3 text-[#DC2626]" /> Instructor Faculty Console
            </div>
            <button
              onClick={handleManualRefresh}
              title="Sync faculty records"
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#F9FAFB] hover:bg-gray-100 text-[#4B5563] hover:text-[#1F2937] text-xs border border-[#E5E7EB] transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" /> Sync
            </button>
          </div>
          <h1 className="text-2xl font-bold text-[#1F2937]">
            Instructor Portal: {user?.name}
          </h1>
          <p className="text-xs text-[#4B5563] mt-1">
            Supervise syllabus delivery, automated grading pipelines, and cohort attendance metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView('attendance')}
            className="bg-[#F9FAFB] hover:bg-gray-100 text-[#1F2937] text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2 border border-[#E5E7EB] cursor-pointer"
          >
            <CalendarCheck className="w-4 h-4 text-[#DC2626]" /> Attendance Ledger
          </button>
          <button
            onClick={handleOpenCourseBuilder}
            className="bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" /> Create New Course
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-[#4B5563] text-xs font-medium">
            <span>Enrolled Students</span>
            <Users className="w-4 h-4 text-[#DC2626]" />
          </div>
          <div className="text-2xl font-bold text-[#1F2937]">1,248</div>
          <div className="text-[11px] text-[#DC2626] font-medium flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" /> +14% this quarter
          </div>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-[#4B5563] text-xs font-medium">
            <span>Active Courses</span>
            <BookOpen className="w-4 h-4 text-[#DC2626]" />
          </div>
          <div className="text-2xl font-bold text-[#1F2937]">{courses.length}</div>
          <div className="text-[11px] text-[#4B5563]">
            {courses.reduce((acc, c) => acc + c.modules.length, 0)} total modules
          </div>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-[#4B5563] text-xs font-medium">
            <span>Auto-Graded Submissions</span>
            <FileCheck2 className="w-4 h-4 text-[#DC2626]" />
          </div>
          <div className="text-2xl font-bold text-[#1F2937]">{submissions.length}</div>
          <div className="text-[11px] text-[#4B5563]">
            Avg execution: 1.8 seconds
          </div>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-[#4B5563] text-xs font-medium">
            <span>Cohort Avg Score</span>
            <Award className="w-4 h-4 text-[#DC2626]" />
          </div>
          <div className="text-2xl font-bold text-[#1F2937]">89.6%</div>
          <div className="text-[11px] text-[#DC2626] font-medium">
            Passing threshold: 75%
          </div>
        </div>
      </div>

      {/* Main Sections: Submissions Queue & Course Management */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Submissions & Automated Grading Queue */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#1F2937] flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-[#DC2626]" />
                Automated Grading & Submissions Queue
              </h2>
              <p className="text-xs text-[#4B5563]">
                Live submissions verified by automated AST syntax and unit test runner.
              </p>
            </div>
            <button
              onClick={() => setCurrentView('assignments')}
              className="text-xs text-[#DC2626] hover:text-[#B91C1C] font-semibold cursor-pointer"
            >
              View All Assignments &rarr;
            </button>
          </div>

          <div className="space-y-3">
            {submissions.map((sub) => {
              const asg = assignments.find(a => a.id === sub.assignmentId);
              const isSelected = selectedSubForReview === sub.id;

              return (
                <div 
                  key={sub.id}
                  className="bg-white border border-[#E5E7EB] rounded-2xl p-5 space-y-3 shadow-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <img 
                        src={sub.studentAvatar} 
                        alt={sub.studentName} 
                        className="w-10 h-10 rounded-full object-cover border border-[#E5E7EB]"
                      />
                      <div>
                        <div className="font-semibold text-sm text-[#1F2937] flex items-center gap-2">
                          {sub.studentName}
                          <span className="text-[10px] font-semibold bg-red-50 text-[#DC2626] border border-red-200 px-2 py-0.5 rounded-full">
                            Auto-Graded
                          </span>
                        </div>
                        <div className="text-xs text-[#4B5563]">
                          {asg?.title || 'Assignment'} &bull; Submitted {sub.submittedAt}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-lg font-extrabold text-[#DC2626]">
                          {sub.score}/100
                        </div>
                        <div className="text-[10px] text-[#4B5563]">Auto-Assessed</div>
                      </div>
                      <button
                        onClick={() => handleReviewSubmission(sub.id)}
                        className="p-2 rounded-lg bg-[#F9FAFB] hover:bg-gray-100 border border-[#E5E7EB] text-[#1F2937] text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-[#DC2626]" /> Review
                      </button>
                    </div>
                  </div>

                  {/* Automated Check Output Preview */}
                  {sub.automatedCheckResults && sub.automatedCheckResults.length > 0 && (
                    <div className="p-3 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] space-y-1.5 text-xs">
                      <div className="text-[11px] font-semibold text-[#4B5563] uppercase tracking-wider">
                        Automated Test Harness Results
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                        {sub.automatedCheckResults.map((test, idx) => (
                          <div key={idx} className="flex items-start gap-1.5 text-[#1F2937]">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#DC2626] shrink-0 mt-0.5" />
                            <div className="truncate">
                              <span className="font-medium text-[#1F2937]">{test.testName}: </span>
                              <span className="text-[#4B5563] text-[11px]">{test.output}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Expandable Manual Review & Grade Override Form */}
                  {isSelected && (
                    <div className="p-4 bg-[#F9FAFB] border border-[#DC2626]/40 rounded-xl space-y-3 animate-in fade-in duration-150">
                      <div className="text-xs font-bold text-[#DC2626] uppercase tracking-wider">
                        Instructor Evaluation & Grade Override
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs text-[#4B5563] mb-1">Score (0 - 100)</label>
                          <input 
                            type="number"
                            min="0"
                            max="100"
                            value={overrideScore}
                            onChange={(e) => setOverrideScore(Number(e.target.value))}
                            className="w-full bg-white border border-[#E5E7EB] rounded-lg px-3 py-1.5 text-sm text-[#1F2937] focus:outline-none focus:border-[#DC2626]"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-xs text-[#4B5563] mb-1">Instructor Rubric Feedback</label>
                          <input 
                            type="text"
                            value={feedbackText}
                            onChange={(e) => setFeedbackText(e.target.value)}
                            placeholder="Add personalized technical feedback..."
                            className="w-full bg-white border border-[#E5E7EB] rounded-lg px-3 py-1.5 text-sm text-[#1F2937] focus:outline-none focus:border-[#DC2626]"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          onClick={() => setSelectedSubForReview(null)}
                          className="px-3 py-1.5 rounded-lg text-xs text-[#4B5563] hover:text-[#1F2937] cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSaveGrade(sub.id)}
                          className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-[#DC2626] hover:bg-[#B91C1C] text-white transition-colors cursor-pointer"
                        >
                          Save Grade & Notify Student
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Course Offerings & Actions */}
        <div className="space-y-4">
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[#1F2937] text-sm flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#DC2626]" />
                Managed Courses
              </h3>
              <button
                onClick={handleOpenCourseBuilder}
                className="text-xs text-[#DC2626] hover:text-[#B91C1C] font-semibold cursor-pointer"
              >
                + New Course
              </button>
            </div>

            <div className="space-y-3">
              {instructorCourses.map((c) => (
                <div 
                  key={c.id}
                  className="p-3 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] flex items-center justify-between gap-2 hover:border-[#DC2626]/30 transition-colors"
                >
                  <div className="truncate flex-1">
                    <div className="text-xs font-semibold text-[#1F2937] truncate">
                      {c.title}
                    </div>
                    <div className="text-[11px] text-[#4B5563] mt-0.5">
                      {c.modules.length} Modules &bull; {c.estimatedHours}h estimated
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setActiveCourseId(c.id);
                      setCurrentView('course_player');
                    }}
                    className="p-1.5 rounded-lg text-[#4B5563] hover:text-[#1F2937] hover:bg-white"
                    title="Preview Course"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Attendance Launcher */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 space-y-3 shadow-xs">
            <h3 className="font-bold text-[#1F2937] text-sm flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-[#DC2626]" />
              Live Lecture Check-In Dispatcher
            </h3>
            <p className="text-xs text-[#4B5563] leading-relaxed">
              Broadcast attendance beacon or generate lecture QR code for present/late student recording.
            </p>
            <button
              onClick={() => setCurrentView('attendance')}
              className="w-full bg-red-50 hover:bg-red-100 text-[#DC2626] border border-red-200 text-xs font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              Open Instructor Attendance Console
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
