import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';

export const AdminAuditLogs: React.FC = () => {
  const { auditLogs } = useLMS();
  const [filterAction, setFilterAction] = useState<string>('ALL');
  const [search, setSearch] = useState('');

  const actions = ['ALL', 'LOGIN', 'LOGOUT', 'REGISTRATION', 'SECURITY_403_FORBIDDEN', 'COURSE_CREATED', 'ASSIGNMENT_SUBMITTED', 'QUIZ_SUBMITTED', 'GRADE_UPDATED', 'ATTENDANCE_MARKED', 'PASSWORD_RESET'];

  const filtered = auditLogs.filter(log => {
    const matchesAction = filterAction === 'ALL' || log.action === filterAction;
    const matchesSearch = log.userName.toLowerCase().includes(search.toLowerCase()) || 
                          log.details.toLowerCase().includes(search.toLowerCase()) ||
                          log.action.toLowerCase().includes(search.toLowerCase());
    return matchesAction && matchesSearch;
  });

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Log ID,User ID,User Name,Role,Action,Timestamp,IP Address,Details\n" +
      auditLogs.map(l => `${l.id},${l.userId},"${l.userName}",${l.userRole},${l.action},${l.timestamp},${l.ipAddress},"${l.details.replace(/"/g, '""')}"`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `vertexlearn_audit_trail_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 text-[#1F2937]">
      
      {/* Header */}
      <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 lg:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-50 text-[#DC2626] border border-red-200 text-xs font-semibold mb-2">
            <span>📜</span> Immutable Security Audit Ledger
          </div>
          <h1 className="text-2xl font-bold text-[#1F2937]">
            System Event & Activity Audit Trail
          </h1>
          <p className="text-xs text-[#4B5563] mt-1">
            Cryptographically sealed event ledger logging authentication, assessment submissions, grade adjustments, and administrative overrides.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="bg-white hover:bg-[#F9FAFB] text-[#1F2937] text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2 border border-[#E5E7EB] self-start shadow-xs cursor-pointer"
        >
          <span>📥</span> Export Audit CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 text-xs">
          {actions.map((act) => (
            <button
              key={act}
              onClick={() => setFilterAction(act)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                filterAction === act
                  ? 'bg-[#DC2626] text-white shadow-xs'
                  : 'bg-white text-[#4B5563] hover:text-[#1F2937] border border-[#E5E7EB]'
              }`}
            >
              {act.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <span className="absolute left-3 top-2 text-xs">🔍</span>
          <input 
            type="text"
            placeholder="Search audit trail..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl pl-9 pr-3 py-1.5 text-xs text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:border-[#DC2626]"
          />
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white border border-[#E5E7EB] rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#1F2937]">
            <thead className="bg-[#F9FAFB] text-[#4B5563] uppercase text-[10px] font-semibold border-b border-[#E5E7EB]">
              <tr>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Action Event</th>
                <th className="p-4">Principal Identity</th>
                <th className="p-4">Role</th>
                <th className="p-4">IP Address</th>
                <th className="p-4">Audit Metadata & Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB] font-mono text-[11px]">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-[#F9FAFB] transition-colors">
                  <td className="p-4 text-[#6B7280] whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      log.action === 'SECURITY_403_FORBIDDEN'
                        ? 'bg-red-50 border-red-200 text-[#DC2626]'
                        : log.action === 'PASSWORD_RESET'
                        ? 'bg-amber-50 border-amber-200 text-amber-700'
                        : log.action === 'REGISTRATION'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                        : 'bg-[#F9FAFB] border-[#E5E7EB] text-[#1F2937]'
                    }`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="p-4 font-sans font-semibold text-[#1F2937] whitespace-nowrap">
                    {log.userName}
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <span className={`text-[10px] font-bold uppercase ${
                      log.userRole === 'ADMIN' ? 'text-[#DC2626]' : log.userRole === 'INSTRUCTOR' ? 'text-emerald-700' : 'text-[#4B5563]'
                    }`}>
                      {log.userRole}
                    </span>
                  </td>
                  <td className="p-4 text-[#6B7280] whitespace-nowrap">
                    {log.ipAddress}
                  </td>
                  <td className="p-4 font-sans text-[#4B5563] max-w-md truncate">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
