import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';
import { User } from '../../types/lms';

export const AdminStudentsSegmentation: React.FC = () => {
  const { 
    studentsDirectory, 
    selectedPerformanceFilter, 
    setSelectedPerformanceFilter,
    addNotification 
  } = useLMS();

  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStudentModal, setSelectedStudentModal] = useState<User | null>(null);
  const pageSize = 15;

  // Filter students based on category and search
  const filtered = studentsDirectory.filter(s => {
    const prof = s.studentProfile;
    if (!prof) return false;
    const matchesCategory = selectedPerformanceFilter === 'ALL' || prof.performanceCategory === selectedPerformanceFilter;
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || 
                          prof.studentRollNumber.toLowerCase().includes(search.toLowerCase()) ||
                          s.department.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginatedStudents = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Calculate bracket aggregates across all 1,842 students
  const excellentCount = studentsDirectory.filter(s => s.studentProfile?.performanceCategory === 'EXCELLENT').length;
  const goodCount = studentsDirectory.filter(s => s.studentProfile?.performanceCategory === 'GOOD').length;
  const needsImprovementCount = studentsDirectory.filter(s => s.studentProfile?.performanceCategory === 'NEEDS_IMPROVEMENT').length;
  const atRiskCount = studentsDirectory.filter(s => s.studentProfile?.performanceCategory === 'AT_RISK').length;

  const handleSendAdvisorAlert = (student: User) => {
    addNotification({
      title: 'Advisor Intervention Dispatched',
      message: `Academic support alert routed for ${student.name} (${student.studentProfile?.studentRollNumber}).`,
      type: 'announcement'
    });
    setSelectedStudentModal(null);
  };

  return (
    <div className="space-y-6 text-[#1F2937]">
      
      {/* Top Banner */}
      <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 lg:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-50 text-[#DC2626] border border-red-200 text-xs font-semibold mb-2">
            <span>👥</span> Institutional Academic Performance Segmentation
          </div>
          <h1 className="text-2xl font-bold text-[#1F2937]">
            Student Performance Brackets ({studentsDirectory.length} Enrolled)
          </h1>
          <p className="text-xs text-[#4B5563] mt-1">
            Real-time categorization based on assessment scores, attendance thresholds, and learning gaps.
          </p>
        </div>

        <div className="text-right">
          <div className="text-xs text-[#6B7280]">Total Monitored Cohort</div>
          <div className="text-2xl font-extrabold text-[#1F2937] mt-0.5">{studentsDirectory.length} Learners</div>
        </div>
      </div>

      {/* 4 Interactive Clickable Performance Tiers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Tier 1: Excellent */}
        <div 
          onClick={() => {
            setSelectedPerformanceFilter(selectedPerformanceFilter === 'EXCELLENT' ? 'ALL' : 'EXCELLENT');
            setCurrentPage(1);
          }}
          className={`p-5 rounded-2xl border cursor-pointer transition-all space-y-2 shadow-xs ${
            selectedPerformanceFilter === 'EXCELLENT'
              ? 'bg-emerald-50 border-emerald-500'
              : 'bg-white border-[#E5E7EB] hover:border-emerald-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-emerald-700 flex items-center gap-1.5">
              <span>🏆</span> EXCELLENT
            </span>
            <span className="text-[#6B7280]">90–100%</span>
          </div>
          <div className="text-3xl font-extrabold text-[#1F2937]">{excellentCount}</div>
          <div className="text-[11px] text-[#4B5563] flex justify-between">
            <span>High Achievers</span>
            <span className="text-emerald-700 font-bold">{Math.round((excellentCount / studentsDirectory.length) * 100)}%</span>
          </div>
        </div>

        {/* Tier 2: Good */}
        <div 
          onClick={() => {
            setSelectedPerformanceFilter(selectedPerformanceFilter === 'GOOD' ? 'ALL' : 'GOOD');
            setCurrentPage(1);
          }}
          className={`p-5 rounded-2xl border cursor-pointer transition-all space-y-2 shadow-xs ${
            selectedPerformanceFilter === 'GOOD'
              ? 'bg-blue-50 border-blue-500'
              : 'bg-white border-[#E5E7EB] hover:border-blue-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-blue-700 flex items-center gap-1.5">
              <span>✅</span> GOOD
            </span>
            <span className="text-[#6B7280]">70–89%</span>
          </div>
          <div className="text-3xl font-extrabold text-[#1F2937]">{goodCount}</div>
          <div className="text-[11px] text-[#4B5563] flex justify-between">
            <span>Standard Progression</span>
            <span className="text-blue-700 font-bold">{Math.round((goodCount / studentsDirectory.length) * 100)}%</span>
          </div>
        </div>

        {/* Tier 3: Needs Improvement */}
        <div 
          onClick={() => {
            setSelectedPerformanceFilter(selectedPerformanceFilter === 'NEEDS_IMPROVEMENT' ? 'ALL' : 'NEEDS_IMPROVEMENT');
            setCurrentPage(1);
          }}
          className={`p-5 rounded-2xl border cursor-pointer transition-all space-y-2 shadow-xs ${
            selectedPerformanceFilter === 'NEEDS_IMPROVEMENT'
              ? 'bg-amber-50 border-amber-500'
              : 'bg-white border-[#E5E7EB] hover:border-amber-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-amber-700 flex items-center gap-1.5">
              <span>⚠️</span> NEEDS IMPROVEMENT
            </span>
            <span className="text-[#6B7280]">40–69%</span>
          </div>
          <div className="text-3xl font-extrabold text-[#1F2937]">{needsImprovementCount}</div>
          <div className="text-[11px] text-[#4B5563] flex justify-between">
            <span>AI Practice Triggered</span>
            <span className="text-amber-700 font-bold">{Math.round((needsImprovementCount / studentsDirectory.length) * 100)}%</span>
          </div>
        </div>

        {/* Tier 4: At Risk */}
        <div 
          onClick={() => {
            setSelectedPerformanceFilter(selectedPerformanceFilter === 'AT_RISK' ? 'ALL' : 'AT_RISK');
            setCurrentPage(1);
          }}
          className={`p-5 rounded-2xl border cursor-pointer transition-all space-y-2 shadow-xs ${
            selectedPerformanceFilter === 'AT_RISK'
              ? 'bg-red-50 border-[#DC2626]'
              : 'bg-white border-[#E5E7EB] hover:border-red-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-[#DC2626] flex items-center gap-1.5">
              <span>🚨</span> AT RISK
            </span>
            <span className="text-[#6B7280]">&lt; 40%</span>
          </div>
          <div className="text-3xl font-extrabold text-[#1F2937]">{atRiskCount}</div>
          <div className="text-[11px] text-[#4B5563] flex justify-between">
            <span>Advisor Review Required</span>
            <span className="text-[#DC2626] font-bold">{Math.round((atRiskCount / studentsDirectory.length) * 100)}%</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="font-semibold text-[#6B7280] whitespace-nowrap">Filter Tier:</span>
          {(['ALL', 'EXCELLENT', 'GOOD', 'NEEDS_IMPROVEMENT', 'AT_RISK'] as const).map((tier) => (
            <button
              key={tier}
              onClick={() => {
                setSelectedPerformanceFilter(tier);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                selectedPerformanceFilter === tier
                  ? 'bg-[#DC2626] text-white shadow-xs'
                  : 'bg-white text-[#4B5563] hover:text-[#1F2937] border border-[#E5E7EB]'
              }`}
            >
              {tier.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <span className="absolute left-3 top-2.5 text-xs">🔍</span>
          <input 
            type="text"
            placeholder="Search by student name, roll #..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl pl-9 pr-3 py-2 text-xs text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:border-[#DC2626]"
          />
        </div>
      </div>

      {/* Students Data Table */}
      <div className="bg-white border border-[#E5E7EB] rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#1F2937]">
            <thead className="bg-[#F9FAFB] text-[#4B5563] uppercase text-[10px] font-semibold border-b border-[#E5E7EB]">
              <tr>
                <th className="p-4">Student Name & Roll #</th>
                <th className="p-4">Department & Year</th>
                <th className="p-4">Overall Score</th>
                <th className="p-4">Attendance</th>
                <th className="p-4">Status Bracket</th>
                <th className="p-4">Identified Learning Gaps</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {paginatedStudents.map((s) => {
                const prof = s.studentProfile;
                const cat = prof?.performanceCategory;

                return (
                  <tr key={s.id} className="hover:bg-[#F9FAFB] transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={s.avatar} alt={s.name} className="w-8 h-8 rounded-full object-cover border border-[#E5E7EB]" />
                        <div>
                          <div className="font-semibold text-[#1F2937]">{s.name}</div>
                          <div className="text-[10px] font-mono text-[#6B7280]">{prof?.studentRollNumber}</div>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="text-[#1F2937] truncate max-w-xs">{s.department}</div>
                      <div className="text-[10px] text-[#6B7280]">{prof?.year} &bull; {prof?.section}</div>
                    </td>

                    <td className="p-4">
                      <span className="font-bold text-[#1F2937] text-sm">{prof?.overallScore}%</span>
                      <div className="text-[10px] text-[#6B7280]">GPA {prof?.gpa}</div>
                    </td>

                    <td className="p-4">
                      <span className={`font-semibold ${
                        (prof?.attendanceRate || 0) < 75 ? 'text-[#DC2626]' : 'text-emerald-700'
                      }`}>
                        {prof?.attendanceRate}%
                      </span>
                    </td>

                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        cat === 'EXCELLENT'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : cat === 'GOOD'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : cat === 'NEEDS_IMPROVEMENT'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-red-50 text-[#DC2626] border-red-200'
                      }`}>
                        {cat?.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="p-4 max-w-xs">
                      {prof?.weakTopics && prof.weakTopics.length > 0 ? (
                        <div className="truncate text-[11px] text-[#4B5563]">
                          Weak: <span className="text-[#DC2626] font-medium">{prof.weakTopics.join(', ')}</span>
                        </div>
                      ) : (
                        <span className="text-emerald-700 text-[11px] font-medium">On target pace</span>
                      )}
                      {prof?.missingLessons && prof.missingLessons.length > 0 && (
                        <div className="text-[10px] text-[#6B7280] truncate">
                          Missing: {prof.missingLessons.join(', ')}
                        </div>
                      )}
                    </td>

                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedStudentModal(s)}
                        className="bg-white hover:bg-[#F9FAFB] text-[#1F2937] border border-[#E5E7EB] px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors inline-flex items-center gap-1 shadow-xs cursor-pointer"
                      >
                        <span>👁️</span> Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 bg-[#F9FAFB] border-t border-[#E5E7EB] flex items-center justify-between text-xs text-[#6B7280]">
          <div>
            Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filtered.length)} of {filtered.length} students
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg bg-white border border-[#E5E7EB] text-[#4B5563] hover:text-[#1F2937] disabled:opacity-40 cursor-pointer"
            >
              ◀️
            </button>
            <span className="text-[#1F2937] font-semibold">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg bg-white border border-[#E5E7EB] text-[#4B5563] hover:text-[#1F2937] disabled:opacity-40 cursor-pointer"
            >
              ▶️
            </button>
          </div>
        </div>
      </div>

      {/* Student Learning Gap Details Modal */}
      {selectedStudentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-150">
          <div className="bg-white border border-[#E5E7EB] rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl relative text-[#1F2937]">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
              <div className="flex items-center gap-3">
                <img src={selectedStudentModal.avatar} alt={selectedStudentModal.name} className="w-10 h-10 rounded-full object-cover border border-[#E5E7EB]" />
                <div>
                  <h3 className="font-bold text-[#1F2937] text-base leading-tight">
                    {selectedStudentModal.name}
                  </h3>
                  <div className="text-xs text-[#6B7280] font-mono">
                    {selectedStudentModal.studentProfile?.studentRollNumber} &bull; {selectedStudentModal.department}
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setSelectedStudentModal(null)}
                className="p-1 text-[#6B7280] hover:text-[#1F2937] rounded-lg cursor-pointer text-base"
              >
                ✕
              </button>
            </div>

            {/* Performance Stats */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB]">
                <div className="text-[10px] text-[#6B7280] uppercase font-semibold">Overall Score</div>
                <div className="text-xl font-bold text-[#1F2937] mt-0.5">{selectedStudentModal.studentProfile?.overallScore}%</div>
              </div>
              <div className="p-3 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB]">
                <div className="text-[10px] text-[#6B7280] uppercase font-semibold">Attendance</div>
                <div className="text-xl font-bold text-emerald-700 mt-0.5">{selectedStudentModal.studentProfile?.attendanceRate}%</div>
              </div>
              <div className="p-3 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB]">
                <div className="text-[10px] text-[#6B7280] uppercase font-semibold">GPA</div>
                <div className="text-xl font-bold text-[#DC2626] mt-0.5">{selectedStudentModal.studentProfile?.gpa}</div>
              </div>
            </div>

            {/* What this student is missing */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#1F2937] uppercase tracking-wider">
                Intelligent Learning Gaps Diagnostics
              </h4>
              <div className="p-4 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] space-y-2 text-xs">
                <div>
                  <span className="font-semibold text-[#DC2626]">Missing Modules/Lessons: </span>
                  <span className="text-[#4B5563]">
                    {selectedStudentModal.studentProfile?.missingLessons.join(', ') || 'None (Completed)'}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-amber-700">Pending/Overdue Assignments: </span>
                  <span className="text-[#4B5563]">
                    {selectedStudentModal.studentProfile?.pendingAssignments.join(', ') || 'None'}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-[#1F2937]">Weak Topics Identified: </span>
                  <span className="text-[#4B5563]">
                    {selectedStudentModal.studentProfile?.weakTopics.join(', ') || 'None (Strong mastery)'}
                  </span>
                </div>
              </div>
            </div>

            {/* Recommended Next Action */}
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl space-y-1">
              <div className="text-[10px] font-bold text-[#DC2626] uppercase tracking-wider flex items-center gap-1">
                <span>✨</span> AI Recommended Next Action
              </div>
              <div className="text-xs font-bold text-[#1F2937]">
                {selectedStudentModal.studentProfile?.nextRecommendedAction.title}
              </div>
              <p className="text-[11px] text-[#4B5563]">
                {selectedStudentModal.studentProfile?.nextRecommendedAction.description}
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setSelectedStudentModal(null)}
                className="flex-1 bg-white hover:bg-[#F9FAFB] text-[#4B5563] text-xs font-semibold py-2.5 rounded-xl transition-colors border border-[#E5E7EB] cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => handleSendAdvisorAlert(selectedStudentModal)}
                className="flex-1 bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-semibold py-2.5 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>📤</span> Trigger Advisor Action
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
