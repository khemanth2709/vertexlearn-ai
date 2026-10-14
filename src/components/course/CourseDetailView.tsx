import React from 'react';
import { useLMS } from '../../context/LMSContext';
import { findCourseById } from '../../data/coursesData';
import { parseYouTubeUrl } from '../../utils/youtubeUtils';

export const CourseDetailView: React.FC = () => {
  const { 
    activeCourseId, 
    courses, 
    user, 
    setCurrentView, 
    setActiveCourseId, 
    setActiveModuleIndex, 
    enrollInCourse, 
    calculateCourseProgress,
    getModuleProgress
  } = useLMS();

  // Find the active course in context or fallback
  const course = courses.find(c => c.id === activeCourseId) || findCourseById(activeCourseId) || courses[0];

  if (!course) {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-gray-600">Course not found.</p>
        <button
          onClick={() => setCurrentView('courses')}
          className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-semibold cursor-pointer"
        >
          ⬅️ Back to Course Catalog
        </button>
      </div>
    );
  }

  const isEnrolled = user?.enrolledCourseIds?.includes(course.id);
  const progressPercent = isEnrolled ? calculateCourseProgress(course.id) : 0;
  const youtubeInfo = parseYouTubeUrl(course.referenceUrl || (course.modules[0]?.url || course.modules[0]?.resourceUrl));

  const handleEnrollOrContinue = () => {
    if (!isEnrolled) {
      enrollInCourse(course.id);
    }
    setActiveCourseId(course.id);
    setActiveModuleIndex(0);
    setCurrentView('course_player');
  };

  const handleOpenLesson = (moduleIndex: number) => {
    if (!isEnrolled) {
      enrollInCourse(course.id);
    }
    setActiveCourseId(course.id);
    setActiveModuleIndex(moduleIndex);
    setCurrentView('course_player');
  };

  return (
    <div className="space-y-6 text-[#1F2937] max-w-5xl mx-auto">
      
      {/* Navigation Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentView('courses')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#4B5563] hover:text-[#1F2937] bg-white border border-[#E5E7EB] hover:border-gray-300 px-3.5 py-2 rounded-xl transition-all cursor-pointer shadow-xs"
        >
          <span>⬅️</span> Back to Catalog
        </button>

        <div className="flex items-center gap-2">
          {isEnrolled ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-700 border border-green-200 text-xs font-semibold">
              <span>✅</span> Enrolled
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold">
              <span>⚪</span> Not Enrolled
            </span>
          )}
        </div>
      </div>

      {/* Main Course Header Card */}
      <div className="bg-white border border-[#E5E7EB] rounded-3xl overflow-hidden shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-3">
          
          {/* Course Thumbnail */}
          <div className="relative h-64 md:h-auto bg-gray-100 overflow-hidden">
            <img 
              src={course.thumbnail} 
              alt={course.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 bg-white/95 px-2.5 py-1 rounded-md text-[11px] font-mono font-bold text-[#DC2626] border border-[#E5E7EB]">
              {course.code}
            </div>
            <div className="absolute top-3 right-3 bg-white/95 px-2.5 py-0.5 rounded text-[11px] font-semibold text-[#1F2937] border border-[#E5E7EB]">
              {course.level}
            </div>
          </div>

          {/* Course Information */}
          <div className="p-6 md:p-8 md:col-span-2 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <span className="px-2.5 py-0.5 bg-red-50 text-[#DC2626] font-semibold rounded-md border border-red-200">
                  {course.category}
                </span>
                {course.rating && (
                  <span className="px-2.5 py-0.5 bg-yellow-50 text-yellow-800 font-semibold rounded-md border border-yellow-200">
                    ⭐ {course.rating.toFixed(1)}
                  </span>
                )}
                <span className="text-[#4B5563]">
                  ⏱️ {course.estimatedHours} Hours Instruction
                </span>
                <span className="text-[#4B5563]">
                  📖 {course.modules.length} Lessons
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] tracking-tight">
                {course.title}
              </h1>

              <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">
                {course.description}
              </p>

              {/* Verified Instructor */}
              <div className="pt-2 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-sm font-bold text-[#DC2626]">
                  👤
                </div>
                <div>
                  <div className="text-xs font-bold text-[#1F2937]">{course.instructorName}</div>
                  <div className="text-[11px] text-[#4B5563]">{course.instructorTitle}</div>
                </div>
              </div>
            </div>

            {/* Enrollment Action & Progress */}
            <div className="pt-4 border-t border-[#E5E7EB] space-y-3">
              {isEnrolled && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-[#4B5563]">
                    <span>Current Progress</span>
                    <span className="font-bold text-[#DC2626]">{progressPercent}%</span>
                  </div>
                  <div className="w-full bg-[#E5E7EB] rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-[#DC2626] h-2 rounded-full transition-all"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  onClick={handleEnrollOrContinue}
                  className="px-6 py-3 bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isEnrolled ? (
                    <>
                      <span>▶️</span> Continue Learning
                    </>
                  ) : (
                    <>
                      <span>🎓</span> Enroll in Course
                    </>
                  )}
                </button>

                {course.referenceUrl && (
                  <a
                    href={course.referenceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-3 bg-red-50 hover:bg-red-100 text-[#DC2626] border border-red-200 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5"
                    title="Open YouTube video/playlist in YouTube"
                  >
                    <span>📺</span> Watch on YouTube <span>↗️</span>
                  </a>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Configured Resource Section */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[#1F2937] flex items-center gap-2">
            <span>📺</span> Configured YouTube Learning Resource
          </h2>
          <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-red-50 text-[#DC2626] border border-red-200 font-semibold">
            External YouTube link
          </span>
        </div>

        <p className="text-xs text-[#4B5563]">
          This course links directly to the accredited YouTube video and playlist curriculum. All parameters and playlist structures are preserved.
        </p>

        {course.referenceUrl && (
          <div className="p-3 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs">
            <div className="truncate text-[#1F2937] max-w-2xl">
              <span className="text-[#DC2626] font-semibold">Resource URL: </span>
              {course.referenceUrl}
            </div>
            <a
              href={course.referenceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[#DC2626] hover:text-[#B91C1C] font-semibold text-xs shrink-0"
            >
              Open Direct ↗️
            </a>
          </div>
        )}
      </div>

      {/* Course Curriculum & Lessons List */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
          <div>
            <h2 className="text-lg font-bold text-[#1F2937] flex items-center gap-2">
              <span>📖</span> Course Curriculum & Lessons
            </h2>
            <p className="text-xs text-[#4B5563] mt-0.5">
              Click any lesson to open the learning page immediately.
            </p>
          </div>
          <span className="text-xs text-[#4B5563] font-semibold">
            {course.modules.length} Lessons Available
          </span>
        </div>

        <div className="divide-y divide-[#E5E7EB]">
          {course.modules.map((mod, index) => {
            const modProgress = getModuleProgress(course.id, mod.id);
            const isCompleted = modProgress?.completed;

            return (
              <div 
                key={mod.id}
                onClick={() => handleOpenLesson(index)}
                className="py-3.5 px-4 rounded-xl hover:bg-[#F9FAFB] transition-colors flex items-center justify-between gap-4 cursor-pointer group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                    isCompleted 
                      ? 'bg-green-50 text-green-700 border border-green-200' 
                      : 'bg-red-50 text-[#DC2626] border border-red-200'
                  }`}>
                    {isCompleted ? '✅' : `${index + 1}`}
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-xs sm:text-sm font-bold text-[#1F2937] group-hover:text-[#DC2626] transition-colors truncate">
                      {mod.title}
                    </h3>
                    <div className="flex items-center gap-2 text-[11px] text-[#4B5563] mt-0.5">
                      <span>{mod.type === 'video' ? '📺 Video Lesson' : mod.type === 'pdf' ? '📄 Technical Guide' : '📝 Quiz'}</span>
                      <span>&bull;</span>
                      <span>⏱️ {mod.duration}</span>
                      {mod.url && (
                        <>
                          <span>&bull;</span>
                          <span className="text-[#DC2626] truncate max-w-xs">YouTube Resource</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {isCompleted ? (
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-green-50 text-green-700 font-semibold border border-green-200">
                      Completed
                    </span>
                  ) : (
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-gray-100 text-[#4B5563] font-semibold group-hover:bg-red-50 group-hover:text-[#DC2626] transition-colors">
                      Start Lesson ▶️
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
