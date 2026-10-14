import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';
import { 
  courseCatalogService, 
  CourseCatalogEntry 
} from '../../services/courseCatalogService';

export const CourseCatalog: React.FC = () => {
  const { 
    courses, 
    user, 
    setCurrentView, 
    setActiveCourseId, 
    setActiveModuleIndex,
    enrollInCourse, 
    calculateCourseProgress,
    setIsAITutorOpen,
    setAiTutorMode,
    askAITutor
  } = useLMS();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>(null);

  const categories = courseCatalogService.getCategories();
  const catalogStats = courseCatalogService.getStats();

  // Filter based on courseCatalogService
  const filteredCatalog = courseCatalogService.filterCourses({
    query: search,
    category: selectedCategory
  });

  const handleOpenCourseDetail = (courseId: string) => {
    setActiveCourseId(courseId);
    setCurrentView('course_detail');
  };

  const handleOpenLessonPlayer = (courseId: string, moduleIndex = 0) => {
    setActiveCourseId(courseId);
    setActiveModuleIndex(moduleIndex);
    setCurrentView('course_player');
  };

  const handleEnrollAndContinue = (course: CourseCatalogEntry) => {
    enrollInCourse(course.id);
    setActiveCourseId(course.id);
    setActiveModuleIndex(0);
    setCurrentView('course_player');
  };

  const handleAskAITutorAboutCourse = (course: CourseCatalogEntry) => {
    setAiTutorMode('study');
    setIsAITutorOpen(true);
    askAITutor(`Explain the core learning objectives, key concepts, and curriculum of ${course.title} (${course.shortTitle}).`, 'study');
  };

  const toggleExpand = (courseId: string) => {
    setExpandedCourseId(prev => prev === courseId ? null : courseId);
  };

  return (
    <div className="space-y-6 text-[#1F2937]">
      
      {/* Header Banner */}
      <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 lg:p-8 relative overflow-hidden shadow-xs">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-[#DC2626] text-xs font-semibold">
            <span>🎓</span> Accredited Technical Engineering Curricula
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] tracking-tight">
            Official Course Curriculum & Catalog
          </h1>
          <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">
            Explore all 13 official technical tracks: <strong>Frontend</strong>, <strong>Backend</strong>, <strong>MERN Stack</strong>, <strong>MEAN Stack</strong>, <strong>DSA</strong>, <strong>Java</strong>, <strong>Python</strong>, <strong>Data Analytics</strong>, <strong>Data Engineering</strong>, <strong>Machine Learning</strong>, <strong>Artificial Intelligence</strong>, <strong>Data Science</strong>, and <strong>Web Development</strong>. Complete with YouTube playlists, interactive labs, and Socratic AI guidance.
          </p>

          {/* Metric Highlights */}
          <div className="pt-2 flex flex-wrap gap-4 text-xs text-[#4B5563]">
            <div className="flex items-center gap-1.5 bg-[#F9FAFB] px-3 py-1.5 rounded-xl border border-[#E5E7EB]">
              <span>📖</span>
              <span><strong className="text-[#1F2937]">{catalogStats.totalCourses}</strong> Core Tracks</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#F9FAFB] px-3 py-1.5 rounded-xl border border-[#E5E7EB]">
              <span>⏱️</span>
              <span><strong className="text-[#1F2937]">{catalogStats.totalHours}+</strong> Total Instruction Hours</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#F9FAFB] px-3 py-1.5 rounded-xl border border-[#E5E7EB]">
              <span>📁</span>
              <span><strong className="text-[#1F2937]">{catalogStats.categoriesCount}</strong> Engineering Categories</span>
            </div>
          </div>
        </div>

        {(user?.role === 'INSTRUCTOR' || user?.role === 'ADMIN') && (
          <div className="mt-4 sm:mt-0 sm:absolute sm:top-8 sm:right-8">
            <button
              onClick={() => setCurrentView('course_builder')}
              className="bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <span>➕</span> Studio: Create Course
            </button>
          </div>
        )}
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Category Filter Pills (All 13 categories) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#DC2626] text-white shadow-xs'
                  : 'bg-white text-[#4B5563] hover:text-[#1F2937] border border-[#E5E7EB] hover:border-gray-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full lg:w-80 shrink-0">
          <span className="absolute left-3 top-2.5 text-xs text-[#4B5563]">🔍</span>
          <input 
            type="text"
            placeholder="Search tracks, keywords, codes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-[#E5E7EB] rounded-xl pl-8 pr-3 py-2 text-xs text-[#1F2937] placeholder-gray-400 focus:outline-none focus:border-[#DC2626] transition-colors shadow-xs"
          />
        </div>
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCatalog.map((catalogCourse) => {
          const lmsCourse = courses.find(c => c.id === catalogCourse.id) || courses[0];
          const isEnrolled = user?.enrolledCourseIds?.includes(catalogCourse.id);
          const progress = isEnrolled ? calculateCourseProgress(catalogCourse.id) : 0;
          const isExpanded = expandedCourseId === catalogCourse.id;

          return (
            <div 
              key={catalogCourse.id}
              className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden hover:border-red-300 transition-all flex flex-col group shadow-xs cursor-pointer"
              onClick={() => handleOpenCourseDetail(catalogCourse.id)}
            >
              {/* Thumbnail Header */}
              <div className="h-44 relative overflow-hidden bg-gray-100">
                <img 
                  src={catalogCourse.thumbnail} 
                  alt={catalogCourse.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Code Pill */}
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-md text-[10px] font-mono font-bold text-[#DC2626] border border-[#E5E7EB]">
                  {catalogCourse.code}
                </div>

                {/* Level Badge */}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-0.5 rounded text-[10px] font-semibold text-[#1F2937] border border-[#E5E7EB]">
                  {catalogCourse.level}
                </div>

                {/* Enrolled Status Badge */}
                {isEnrolled ? (
                  <div className={`absolute bottom-3 right-3 ${
                    progress === 100 ? 'bg-green-600' : 'bg-[#DC2626]'
                  } text-white px-2.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 shadow-xs`}>
                    {progress === 100 ? (
                      <>
                        <span>✅</span> Accredited Complete
                      </>
                    ) : (
                      <>
                        <span>⏱️</span> {progress}% In Progress
                      </>
                    )}
                  </div>
                ) : (
                  <div className="absolute bottom-3 right-3 bg-white/90 text-[#4B5563] border border-[#E5E7EB] px-2.5 py-0.5 rounded text-[10px] font-semibold shadow-xs">
                    Not Enrolled
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-6 flex flex-col flex-1 space-y-4" onClick={(e) => e.stopPropagation()}>
                <div>
                  <div className="flex items-center justify-between text-[11px] text-[#4B5563] font-medium mb-1">
                    <span className="text-[#DC2626] uppercase tracking-wider font-semibold">
                      {catalogCourse.category}
                    </span>
                    <span className="flex items-center gap-1 text-[#4B5563]">
                      <span>⏱️</span> {catalogCourse.estimatedHours} Hours
                    </span>
                  </div>

                  <h3 
                    onClick={() => handleOpenCourseDetail(catalogCourse.id)}
                    className="font-bold text-[#1F2937] text-base line-clamp-1 group-hover:text-[#DC2626] transition-colors cursor-pointer"
                  >
                    {catalogCourse.title}
                  </h3>

                  <p className="text-xs text-[#4B5563] line-clamp-2 mt-1.5 leading-relaxed">
                    {catalogCourse.description}
                  </p>

                  {/* Configured Resource with external URL preserved */}
                  <div className="pt-2.5">
                    <a
                      href={catalogCourse.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[11px] text-[#DC2626] hover:text-[#B91C1C] font-semibold transition-colors bg-red-50 hover:bg-red-100 border border-red-200 px-2.5 py-1 rounded-lg"
                      title="Open full YouTube video / playlist link"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span>📺</span>
                      <span>Configured YouTube Resource</span>
                      <span>↗️</span>
                    </a>
                  </div>
                </div>

                {/* Key Topics / Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {catalogCourse.tags.map((tag) => (
                    <span key={tag} className="text-[10px] font-medium bg-[#F9FAFB] text-[#4B5563] px-2 py-0.5 rounded border border-[#E5E7EB]">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Verified Metadata Row: Instructor, Rating, Lessons */}
                <div className="pt-2 flex items-center justify-between text-[11px] text-[#4B5563] border-t border-[#E5E7EB]">
                  <span className="truncate">👤 {catalogCourse.instructorName}</span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-yellow-700 font-semibold">⭐ {catalogCourse.rating.toFixed(1)}</span>
                    <span>&bull;</span>
                    <span>📖 {catalogCourse.modulesCount} Lessons</span>
                  </div>
                </div>

                {/* Expandable Syllabus & Learning Outcomes */}
                <div className="border-t border-[#E5E7EB] pt-2 text-xs">
                  <button
                    onClick={() => toggleExpand(catalogCourse.id)}
                    className="w-full flex items-center justify-between text-[11px] text-[#4B5563] hover:text-[#1F2937] transition-colors py-1 cursor-pointer"
                  >
                    <span className="font-semibold flex items-center gap-1.5">
                      <span>📋</span>
                      {isExpanded ? 'Hide Curriculum Details' : 'View Curriculum Details'}
                    </span>
                    <span>{isExpanded ? '▴' : '▾'}</span>
                  </button>

                  {isExpanded && (
                    <div className="mt-2 space-y-2 p-3 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] text-[11px]">
                      <div>
                        <div className="font-bold text-[#1F2937] mb-1">Curriculum Topics:</div>
                        <ul className="list-disc list-inside space-y-0.5 text-[#4B5563]">
                          {catalogCourse.keyTopics.map((topic, i) => (
                            <li key={i}>{topic}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="pt-1 border-t border-[#E5E7EB]">
                        <div className="font-bold text-[#1F2937] mb-1">Target Outcomes:</div>
                        <ul className="list-disc list-inside space-y-0.5 text-[#4B5563]">
                          {catalogCourse.learningOutcomes.map((outc, i) => (
                            <li key={i}>{outc}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Controls */}
                <div className="mt-auto pt-4 border-t border-[#E5E7EB] space-y-2.5">
                  <div className="flex items-center justify-between text-xs text-[#4B5563]">
                    <button
                      onClick={() => handleOpenCourseDetail(catalogCourse.id)}
                      className="text-xs text-[#DC2626] hover:text-[#B91C1C] font-semibold cursor-pointer underline underline-offset-2"
                    >
                      Course Details ℹ️
                    </button>
                    <button
                      onClick={() => handleAskAITutorAboutCourse(catalogCourse)}
                      className="inline-flex items-center gap-1 text-[11px] text-[#DC2626] hover:text-[#B91C1C] font-semibold cursor-pointer"
                      title="Ask AI Tutor about this course"
                    >
                      <span>🤖</span> Ask AI Tutor
                    </button>
                  </div>

                  {isEnrolled ? (
                    <div>
                      <div className="flex justify-between text-[10px] text-[#4B5563] mb-1">
                        <span>Course Progress</span>
                        <span className="text-[#DC2626] font-bold">{progress}%</span>
                      </div>
                      <div className="w-full bg-[#E5E7EB] rounded-full h-1.5 overflow-hidden mb-2">
                        <div 
                          className="bg-[#DC2626] h-1.5 rounded-full" 
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleOpenLessonPlayer(catalogCourse.id, 0)}
                          className="w-full bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-semibold py-2 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <span>▶️</span> Continue
                        </button>
                        <button
                          onClick={() => handleOpenCourseDetail(catalogCourse.id)}
                          className="w-full bg-[#F9FAFB] hover:bg-gray-100 text-[#1F2937] border border-[#E5E7EB] text-xs font-semibold py-2 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleEnrollAndContinue(catalogCourse)}
                        className="w-full bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-semibold py-2 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span>🎓</span> Enroll
                      </button>
                      <button
                        onClick={() => handleOpenCourseDetail(catalogCourse.id)}
                        className="w-full bg-[#F9FAFB] hover:bg-gray-100 text-[#1F2937] border border-[#E5E7EB] text-xs font-semibold py-2 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
                      >
                        View Details
                      </button>
                    </div>
                  )}
                </div>

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
