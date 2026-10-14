import React from 'react';

/**
 * High-fidelity Skeleton Loaders for Student, Instructor, and Admin Dashboards
 * Strictly styled with the clean light theme: pure white (#FFFFFF), off-white (#F9FAFB), and soft gray borders (#E5E7EB).
 */

export const StudentDashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse" aria-busy="true" aria-label="Loading student dashboard">
      {/* Top Welcome Hero Banner Skeleton */}
      <div className="rounded-3xl bg-white border border-[#E5E7EB] p-6 lg:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
        <div className="space-y-3 max-w-xl flex-1">
          {/* Badge */}
          <div className="h-6 w-48 bg-gray-200 rounded-full" />
          {/* Name Header */}
          <div className="h-9 w-72 bg-gray-300 rounded-xl" />
          {/* Subtitle */}
          <div className="h-4 w-full max-w-md bg-gray-200 rounded" />
          <div className="h-4 w-3/4 bg-gray-200 rounded" />
        </div>

        {/* Quick Resume Card Skeleton */}
        <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl p-5 min-w-[280px] space-y-3">
          <div className="flex justify-between items-center">
            <div className="h-4 w-28 bg-gray-200 rounded" />
            <div className="h-4 w-12 bg-gray-200 rounded" />
          </div>
          <div className="h-5 w-40 bg-gray-300 rounded" />
          <div className="h-2 w-full bg-gray-200 rounded-full" />
          <div className="h-8 w-full bg-gray-300 rounded-xl" />
        </div>
      </div>

      {/* Recommended Action Skeleton */}
      <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-10 h-10 rounded-xl bg-gray-200 shrink-0" />
          <div className="space-y-2 flex-1">
            <div className="h-4 w-44 bg-gray-300 rounded" />
            <div className="h-3 w-64 bg-gray-200 rounded" />
          </div>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="h-8 w-28 bg-gray-200 rounded-xl" />
          <div className="h-8 w-32 bg-gray-300 rounded-xl" />
        </div>
      </div>

      {/* Metrics Row Skeleton (4 Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white border border-[#E5E7EB] rounded-2xl p-5 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="h-3 w-24 bg-gray-200 rounded" />
              <div className="w-5 h-5 rounded-lg bg-gray-200" />
            </div>
            <div className="h-8 w-16 bg-gray-300 rounded" />
            <div className="h-3 w-28 bg-gray-200 rounded" />
          </div>
        ))}
      </div>

      {/* Main Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Enrolled Courses Skeleton */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-6 w-48 bg-gray-300 rounded" />
            <div className="h-4 w-20 bg-gray-200 rounded" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white border border-[#E5E7EB] rounded-2xl p-5 space-y-4 shadow-xs">
                <div className="h-28 w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl" />
                <div className="space-y-2">
                  <div className="h-5 w-3/4 bg-gray-300 rounded" />
                  <div className="h-3 w-1/2 bg-gray-200 rounded" />
                </div>
                <div className="h-2 w-full bg-gray-200 rounded-full" />
                <div className="h-9 w-full bg-gray-300 rounded-xl" />
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Diagnostics & Attendance Skeleton */}
        <div className="space-y-4">
          <div className="h-6 w-40 bg-gray-300 rounded" />
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 space-y-4 shadow-xs">
            <div className="h-4 w-32 bg-gray-300 rounded" />
            <div className="h-20 w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl" />
            <div className="space-y-2">
              <div className="h-3 w-full bg-gray-200 rounded" />
              <div className="h-3 w-4/5 bg-gray-200 rounded" />
            </div>
            <div className="h-9 w-full bg-gray-300 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const InstructorDashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse" aria-busy="true" aria-label="Loading instructor dashboard">
      {/* Header Banner Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-xs">
        <div className="space-y-2">
          <div className="h-5 w-44 bg-gray-200 rounded-full" />
          <div className="h-8 w-64 bg-gray-300 rounded-xl" />
          <div className="h-3 w-80 bg-gray-200 rounded" />
        </div>
        <div className="flex gap-3">
          <div className="h-10 w-36 bg-gray-200 rounded-xl" />
          <div className="h-10 w-40 bg-gray-300 rounded-xl" />
        </div>
      </div>

      {/* Metrics Row Skeleton (4 Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white border border-[#E5E7EB] rounded-2xl p-5 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="h-3 w-24 bg-gray-200 rounded" />
              <div className="w-5 h-5 rounded-lg bg-gray-200" />
            </div>
            <div className="h-8 w-20 bg-gray-300 rounded" />
            <div className="h-3 w-28 bg-gray-200 rounded" />
          </div>
        ))}
      </div>

      {/* Submissions & Courses Skeleton Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Submission Grading Queue Skeleton */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-6 w-52 bg-gray-300 rounded" />
            <div className="h-4 w-20 bg-gray-200 rounded" />
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden divide-y divide-[#E5E7EB] shadow-xs">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0" />
                  <div className="space-y-1.5 flex-1">
                    <div className="h-4 w-36 bg-gray-300 rounded" />
                    <div className="h-3 w-48 bg-gray-200 rounded" />
                  </div>
                </div>
                <div className="h-8 w-24 bg-gray-300 rounded-xl" />
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Active Courses Directed Skeleton */}
        <div className="space-y-4">
          <div className="h-6 w-44 bg-gray-300 rounded" />
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 space-y-4 shadow-xs">
            <div className="h-4 w-32 bg-gray-300 rounded" />
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="p-3 bg-[#F9FAFB] rounded-xl space-y-2 border border-[#E5E7EB]">
                  <div className="h-4 w-3/4 bg-gray-300 rounded" />
                  <div className="h-3 w-1/2 bg-gray-200 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AdminDashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse" aria-busy="true" aria-label="Loading admin dashboard">
      {/* Top Banner Skeleton */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div className="space-y-2">
          <div className="h-5 w-56 bg-gray-200 rounded-full" />
          <div className="h-8 w-80 bg-gray-300 rounded-xl" />
          <div className="h-3 w-96 bg-gray-200 rounded" />
        </div>
        <div className="flex gap-3">
          <div className="h-10 w-32 bg-gray-200 rounded-xl" />
          <div className="h-10 w-44 bg-gray-300 rounded-xl" />
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="flex gap-2 border-b border-[#E5E7EB] pb-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-8 w-28 bg-gray-200 rounded-lg" />
        ))}
      </div>

      {/* Compliance Metrics Grid Skeleton (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white border border-[#E5E7EB] rounded-2xl p-5 space-y-3 shadow-xs">
            <div className="h-4 w-32 bg-gray-200 rounded" />
            <div className="h-8 w-20 bg-gray-300 rounded" />
            <div className="h-2 w-full bg-gray-200 rounded-full" />
            <div className="h-3 w-28 bg-gray-200 rounded" />
          </div>
        ))}
      </div>

      {/* HRIS Integrations & Table Skeleton */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 space-y-4 shadow-xs">
        <div className="flex justify-between items-center">
          <div className="h-6 w-60 bg-gray-300 rounded" />
          <div className="h-4 w-24 bg-gray-200 rounded" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] space-y-3">
              <div className="h-4 w-24 bg-gray-200 rounded" />
              <div className="h-6 w-32 bg-gray-300 rounded" />
              <div className="h-8 w-full bg-gray-200 rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

