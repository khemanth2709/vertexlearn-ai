import React from 'react';
import { useLMS } from '../../context/LMSContext';

export const AdminFacultyManagement: React.FC = () => {
  const { instructorsList, courses } = useLMS();

  return (
    <div className="space-y-6 text-[#1F2937]">
      
      {/* Header */}
      <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 lg:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-50 text-[#DC2626] border border-red-200 text-xs font-semibold mb-2">
            <span>👨‍🏫</span> Institutional Faculty Directorate
          </div>
          <h1 className="text-2xl font-bold text-[#1F2937]">
            Specialized Faculty Roster (Exactly 9 Instructors)
          </h1>
          <p className="text-xs text-[#4B5563] mt-1">
            Governed by the Administrator. Each instructor authors assigned curricula and manages evaluation queues.
          </p>
        </div>

        <div className="text-right">
          <div className="text-xs text-[#6B7280]">Configured Faculty Seats</div>
          <div className="text-2xl font-extrabold text-[#1F2937] mt-0.5">{instructorsList.length} of 9 Active</div>
        </div>
      </div>

      {/* 9 Instructors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {instructorsList.map((inst, index) => {
          const prof = inst.instructorProfile;
          const assignedCourses = courses.filter(c => c.instructorId === inst.id || prof?.assignedCourseIds.includes(c.id));

          return (
            <div 
              key={inst.id} 
              className="bg-white border border-[#E5E7EB] rounded-3xl p-6 space-y-4 hover:border-[#DC2626]/40 transition-all flex flex-col justify-between shadow-xs group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold text-[#DC2626] px-2 py-0.5 rounded-full bg-red-50 border border-red-200">
                    Faculty Seat #{index + 1} &bull; {prof?.facultyId}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <span>✅</span> Active
                  </span>
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <img src={inst.avatar} alt={inst.name} className="w-12 h-12 rounded-2xl object-cover border border-[#E5E7EB]" />
                  <div>
                    <h3 className="font-bold text-[#1F2937] text-base leading-tight">
                      {inst.name}
                    </h3>
                    <div className="text-xs text-[#6B7280] mt-0.5">{inst.title}</div>
                  </div>
                </div>

                <div className="p-3 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] space-y-1.5 text-xs text-[#4B5563]">
                  <div>
                    <span className="font-semibold text-[#1F2937]">Dept: </span>
                    {inst.department}
                  </div>
                  <div>
                    <span className="font-semibold text-[#1F2937]">Specialization: </span>
                    <span className="text-[#DC2626] font-medium">{prof?.specialization}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span>🕒</span>
                    <span>Office: {prof?.officeHours}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span>✉️</span>
                    <span className="font-mono text-[11px] text-[#4B5563]">{inst.email}</span>
                  </div>
                </div>
              </div>

              {/* Assigned Courses & Evaluation Queue */}
              <div className="pt-3 border-t border-[#E5E7EB] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#6B7280] font-medium">Assigned Courses</span>
                  <span className="text-[#1F2937] font-bold">{assignedCourses.length} Curricula</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#6B7280] font-medium">Pending Evaluations</span>
                  <span className="text-amber-700 font-bold">{prof?.pendingEvaluationsCount || 0} Submissions</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
