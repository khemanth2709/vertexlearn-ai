import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';

export const CoursesOverviewPage: React.FC = () => {
  const { courses, setCurrentView, setActiveCourseId, user } = useLMS();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...Array.from(new Set(courses.map(c => c.category)))];

  const filtered = courses.filter(c => {
    const matchesCat = selectedCategory === 'All' || c.category === selectedCategory;
    const matchesQuery = 
      c.title.toLowerCase().includes(search.toLowerCase()) || 
      c.description.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const handleCourseClick = (courseId: string) => {
    setActiveCourseId(courseId);
    if (user) {
      setCurrentView('course_detail');
    } else {
      setCurrentView('login');
    }
  };

  return (
    <div className="space-y-8 pb-12 text-[#1F2937]">
      <div className="bg-white border border-[#E5E7EB] rounded-3xl p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-50 text-[#DC2626] border border-red-200 text-xs font-semibold mb-2">
            <span>🎓</span> Institutional Technical Curricula
          </div>
          <h1 className="text-2xl font-bold text-[#1F2937]">
            Curriculum & Courses Overview
          </h1>
          <p className="text-xs text-[#4B5563] mt-1">
            Browse all 13 accredited technical tracks taught by specialized faculty instructors.
          </p>
        </div>

        <button
          onClick={() => setCurrentView('register')}
          className="bg-[#DC2626] hover:bg-[#B91C1C] text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-2 self-start cursor-pointer"
        >
          Register to Enroll <span>➡️</span>
        </button>
      </div>

      {/* Categories & Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat 
                  ? 'bg-[#DC2626] text-white' 
                  : 'bg-white text-[#4B5563] border border-[#E5E7EB] hover:border-gray-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <span className="absolute left-3 top-2.5 text-xs text-[#4B5563]">🔍</span>
          <input
            type="text"
            placeholder="Search curricula..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-[#E5E7EB] rounded-xl pl-8 pr-3 py-2 text-xs text-[#1F2937] placeholder-gray-400 focus:outline-none focus:border-[#DC2626]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filtered.map((c) => (
          <div 
            key={c.id} 
            className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-xs flex flex-col group hover:border-red-300 transition-all cursor-pointer"
            onClick={() => handleCourseClick(c.id)}
          >
            <div className="h-44 relative bg-gray-100 overflow-hidden">
              <img src={c.thumbnail} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-3 left-3 bg-white/95 px-2 py-0.5 rounded text-[10px] font-bold text-[#DC2626] border border-[#E5E7EB]">
                {c.code}
              </div>
              <div className="absolute top-3 right-3 bg-[#DC2626] text-white px-2 py-0.5 rounded text-[10px] font-bold">
                {c.level}
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col space-y-3">
              <div>
                <span className="text-[10px] font-bold text-[#DC2626] uppercase tracking-wider">
                  {c.category} &bull; {c.estimatedHours} Hours
                </span>
                <h3 className="font-bold text-[#1F2937] text-base mt-1 line-clamp-1 group-hover:text-[#DC2626] transition-colors">
                  {c.title}
                </h3>
                <p className="text-xs text-[#4B5563] line-clamp-2 mt-1">
                  {c.description}
                </p>
              </div>

              {c.referenceUrl && (
                <div className="text-[11px] text-[#DC2626] font-semibold flex items-center gap-1">
                  <span>📺</span> YouTube Curriculum Configured <span>↗️</span>
                </div>
              )}

              <div className="mt-auto pt-3 border-t border-[#E5E7EB] flex items-center justify-between text-xs text-[#4B5563]">
                <span>👤 {c.instructorName}</span>
                <span className="font-semibold text-[#1F2937]">{c.modules.length} Lessons</span>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCourseClick(c.id);
                }}
                className="w-full bg-[#F9FAFB] hover:bg-[#DC2626] hover:text-white text-[#1F2937] border border-[#E5E7EB] hover:border-[#DC2626] text-xs font-semibold py-2 rounded-xl transition-colors cursor-pointer"
              >
                {user ? 'Open Course Details ➡️' : 'Register to Access Lessons & AI Tutor'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
