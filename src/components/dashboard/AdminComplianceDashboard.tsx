import React, { useState, useEffect } from 'react';
import { useLMS } from '../../context/LMSContext';
import { AdminDashboardSkeleton } from './DashboardSkeleton';
import { 
  ShieldCheck, 
  Building2, 
  RefreshCw, 
  Users, 
  AlertTriangle, 
  CheckCircle2, 
  Download, 
  Send, 
  ExternalLink,
  Award,
  Lock,
  Layers
} from 'lucide-react';

export const AdminComplianceDashboard: React.FC = () => {
  const { 
    user, 
    certificates, 
    renewCertificate,
    addNotification 
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

  const [reminderDispatched, setReminderDispatched] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'departments' | 'audit_ledger' | 'hris'>('overview');

  const [hrisIntegrations, setHrisIntegrations] = useState([
    { id: 'hris_workday', provider: 'Workday', status: 'connected', lastSync: '10 min ago', syncedUsersCount: 1842, autoAssignRulesCount: 6 },
    { id: 'hris_okta', provider: 'Okta', status: 'connected', lastSync: 'Live Continuous', syncedUsersCount: 1842, autoAssignRulesCount: 4 },
    { id: 'hris_bamboo', provider: 'BambooHR', status: 'connected', lastSync: '1 hour ago', syncedUsersCount: 312, autoAssignRulesCount: 2 }
  ]);

  const triggerHRISSync = (providerId: string) => {
    setHrisIntegrations(prev => prev.map(h => h.id === providerId ? { ...h, status: 'syncing' } : h));
    setTimeout(() => {
      setHrisIntegrations(prev => prev.map(h => h.id === providerId ? { ...h, status: 'connected', lastSync: 'Just now' } : h));
      addNotification({
        title: 'HRIS Directory Synchronized',
        message: 'Organizational hierarchy and student roster synchronized.',
        type: 'announcement'
      });
    }, 1200);
  };

  const complianceMetrics = [
    { title: 'SOC 2 Type II Audit Readiness', rate: 94.2, certified: 1176, total: 1248, status: 'Auditor Approved' },
    { title: 'ISO 27001 Information Security', rate: 91.8, certified: 1146, total: 1248, status: 'On Track' },
    { title: 'GDPR / CCPA Customer Data Privacy', rate: 98.4, certified: 1228, total: 1248, status: 'Exemplary' },
    { title: 'Anti-Phishing & Zero Trust Security', rate: 88.5, certified: 1104, total: 1248, status: 'Action Needed' }
  ];

  const departmentData = [
    { name: 'Cloud Platform Engineering', totalStaff: 420, completedStaff: 403, rate: 96, riskLevel: 'Low' },
    { name: 'Data & Artificial Intelligence', totalStaff: 280, completedStaff: 268, rate: 95, riskLevel: 'Low' },
    { name: 'Cyber Security & Governance', totalStaff: 110, completedStaff: 110, rate: 100, riskLevel: 'Zero' },
    { name: 'Product & Design', totalStaff: 210, completedStaff: 184, rate: 88, riskLevel: 'Medium' },
    { name: 'Finance & Legal Operations', totalStaff: 228, completedStaff: 211, rate: 92, riskLevel: 'Low' }
  ];

  const handleDispatchReminders = () => {
    setReminderDispatched(true);
    addNotification({
      title: 'Automated Recertification Pushes Dispatched',
      message: 'Email & in-app alerts dispatched to 72 employees with compliance modules expiring within 30 days.',
      type: 'compliance'
    });
    setTimeout(() => setReminderDispatched(false), 3000);
  };

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Certificate ID,Student Name,Course,Issued Date,Expires Date,Status\n" +
      certificates.map(c => `${c.certificateNumber},${c.studentName},${c.courseTitle},${c.issuedAt},${c.expiresAt},${c.status}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `vertexlearn_compliance_audit_ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return <AdminDashboardSkeleton />;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200 text-[#1F2937]">
      
      {/* Top Banner */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-50 text-[#DC2626] border border-red-200 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" /> Corporate Governance & Regulatory Console
            </div>
            <button
              onClick={handleManualRefresh}
              title="Refresh compliance telemetry"
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#F9FAFB] hover:bg-gray-100 text-[#4B5563] hover:text-[#1F2937] text-xs border border-[#E5E7EB] transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" /> Sync Telemetry
            </button>
          </div>
          <h1 className="text-2xl font-bold text-[#1F2937]">
            Enterprise Compliance & HRIS Management
          </h1>
          <p className="text-xs text-[#4B5563] mt-1">
            Real-time audit telemetry, HRIS automated onboarding provisioning, and workforce skill gap analytics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="bg-[#F9FAFB] hover:bg-gray-100 text-[#1F2937] text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2 border border-[#E5E7EB] cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#4B5563]" /> Export Audit CSV
          </button>
          <button
            onClick={handleDispatchReminders}
            disabled={reminderDispatched}
            className="bg-[#DC2626] hover:bg-[#B91C1C] disabled:bg-gray-300 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            {reminderDispatched ? 'Reminders Dispatched!' : 'Broadcast Expiry Reminders'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#E5E7EB] gap-6 text-xs font-semibold text-[#4B5563]">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 transition-colors cursor-pointer ${activeTab === 'overview' ? 'text-[#DC2626] border-b-2 border-[#DC2626] font-bold' : 'hover:text-[#1F2937]'}`}
        >
          Compliance Standards
        </button>
        <button
          onClick={() => setActiveTab('departments')}
          className={`pb-3 transition-colors cursor-pointer ${activeTab === 'departments' ? 'text-[#DC2626] border-b-2 border-[#DC2626] font-bold' : 'hover:text-[#1F2937]'}`}
        >
          Department Leaderboard & Risk
        </button>
        <button
          onClick={() => setActiveTab('hris')}
          className={`pb-3 transition-colors cursor-pointer ${activeTab === 'hris' ? 'text-[#DC2626] border-b-2 border-[#DC2626] font-bold' : 'hover:text-[#1F2937]'}`}
        >
          HRIS & SSO Integrations
        </button>
        <button
          onClick={() => setActiveTab('audit_ledger')}
          className={`pb-3 transition-colors cursor-pointer ${activeTab === 'audit_ledger' ? 'text-[#DC2626] border-b-2 border-[#DC2626] font-bold' : 'hover:text-[#1F2937]'}`}
        >
          Official Certificate Audit Ledger ({certificates.length})
        </button>
      </div>

      {/* TAB 1: Compliance Standards */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {complianceMetrics.map((item, idx) => (
              <div key={idx} className="bg-white border border-[#E5E7EB] rounded-2xl p-5 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#1F2937] truncate">{item.title}</span>
                  <span className="text-[10px] font-semibold bg-red-50 text-[#DC2626] border border-red-200 px-2 py-0.5 rounded-full">
                    {item.status}
                  </span>
                </div>
                <div className="text-3xl font-extrabold text-[#1F2937]">
                  {item.rate}%
                </div>
                <div className="space-y-1">
                  <div className="w-full bg-[#E5E7EB] rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-2 rounded-full ${item.rate >= 95 ? 'bg-[#DC2626]' : item.rate >= 90 ? 'bg-red-500' : 'bg-red-400'}`} 
                      style={{ width: `${item.rate}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-[#4B5563] pt-1">
                    <span>{item.certified} Certified</span>
                    <span>{item.total - item.certified} Overdue / In Progress</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Audit Verification Banner */}
          <div className="p-6 bg-white border border-[#E5E7EB] rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-[#DC2626]">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#1F2937]">
                  Cryptographically Signed Audit Certificates
                </h3>
                <p className="text-xs text-[#4B5563] max-w-xl mt-0.5">
                  Every employee credential carries a verifiable SHA-256 hash stored in the Cloud Storage Vault, allowing external SOC 2 and ISO 27001 auditors to validate training compliance in 1 click.
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('audit_ledger')}
              className="bg-red-50 hover:bg-red-100 text-[#DC2626] border border-red-200 text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap cursor-pointer"
            >
              Inspect Ledger &rarr;
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: Department Leaderboard */}
      {activeTab === 'departments' && (
        <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-xs">
          <div className="p-5 border-b border-[#E5E7EB]">
            <h3 className="font-bold text-[#1F2937] text-sm">
              Workforce Compliance by Organizational Unit
            </h3>
            <p className="text-xs text-[#4B5563] mt-0.5">
              Tracks department-level completion against regulatory threshold requirements.
            </p>
          </div>

          <div className="divide-y divide-[#E5E7EB]">
            {departmentData.map((dept, i) => (
              <div key={i} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#F9FAFB] transition-colors">
                <div className="space-y-1">
                  <div className="font-semibold text-[#1F2937] text-sm flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#DC2626]" />
                    {dept.name}
                  </div>
                  <div className="text-xs text-[#4B5563]">
                    {dept.completedStaff} of {dept.totalStaff} staff compliant ({dept.totalStaff - dept.completedStaff} pending)
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="w-36 text-right">
                    <div className="text-sm font-bold text-[#1F2937]">{dept.rate}%</div>
                    <div className="w-full bg-[#E5E7EB] rounded-full h-1.5 mt-1 overflow-hidden">
                      <div 
                        className={`h-1.5 rounded-full ${dept.rate >= 95 ? 'bg-[#DC2626]' : 'bg-red-400'}`} 
                        style={{ width: `${dept.rate}%` }}
                      />
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    dept.riskLevel === 'Zero' 
                      ? 'bg-red-50 text-[#DC2626] border-red-200' 
                      : dept.riskLevel === 'Low'
                        ? 'bg-gray-100 text-[#4B5563] border-[#E5E7EB]'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    {dept.riskLevel} Risk
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: HRIS Integrations */}
      {activeTab === 'hris' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {hrisIntegrations.map((hris) => (
              <div key={hris.id} className="bg-white border border-[#E5E7EB] rounded-2xl p-5 space-y-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers className="w-5 h-5 text-[#DC2626]" />
                    <h4 className="font-bold text-[#1F2937] text-sm">{hris.provider}</h4>
                  </div>
                  <span className="text-[10px] font-semibold bg-red-50 text-[#DC2626] border border-red-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Connected
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-[#4B5563]">
                  <div className="flex justify-between">
                    <span>Synced Employees:</span>
                    <span className="font-semibold text-[#1F2937]">{hris.syncedUsersCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Auto-Assign Tracks:</span>
                    <span className="font-semibold text-[#1F2937]">{hris.autoAssignRulesCount} Rules</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Directory Sync:</span>
                    <span className="text-[#4B5563]">{hris.lastSync}</span>
                  </div>
                </div>

                <button
                  onClick={() => triggerHRISSync(hris.id)}
                  disabled={hris.status === 'syncing'}
                  className="w-full bg-[#F9FAFB] hover:bg-gray-100 disabled:opacity-50 text-[#1F2937] text-xs font-semibold py-2 rounded-xl transition-colors flex items-center justify-center gap-2 border border-[#E5E7EB] cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${hris.status === 'syncing' ? 'animate-spin' : ''}`} />
                  {hris.status === 'syncing' ? 'Pulling Records...' : 'Sync Directory Now'}
                </button>
              </div>
            ))}
          </div>

          <div className="p-5 bg-white border border-[#E5E7EB] rounded-2xl space-y-2 shadow-xs">
            <h4 className="font-bold text-[#1F2937] text-xs uppercase tracking-wider">
              Automated Day-1 Onboarding Trigger Rules
            </h4>
            <p className="text-xs text-[#4B5563] leading-relaxed">
              When Workday or Okta provisions a new user with title containing "Engineer", the system automatically assigns <span className="text-[#DC2626] font-semibold">Advanced AI, RAG & Vector Databases</span> and <span className="text-[#DC2626] font-semibold">SOC 2 Type II Certification</span> with 14-day completion milestones.
            </p>
          </div>
        </div>
      )}

      {/* TAB 4: Audit Ledger */}
      {activeTab === 'audit_ledger' && (
        <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-xs">
          <div className="p-5 border-b border-[#E5E7EB] flex items-center justify-between">
            <div>
              <h3 className="font-bold text-[#1F2937] text-sm">
                Issued Compliance Credentials & Audit Register
              </h3>
              <p className="text-xs text-[#4B5563] mt-0.5">
                Immutable record of all certificates generated across departments.
              </p>
            </div>
            <button
              onClick={handleExportCSV}
              className="text-xs text-[#DC2626] hover:text-[#B91C1C] font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> Export Ledger
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#1F2937]">
              <thead className="bg-[#F9FAFB] text-[#4B5563] uppercase text-[10px] font-semibold border-b border-[#E5E7EB]">
                <tr>
                  <th className="p-4">Certificate ID</th>
                  <th className="p-4">Recipient</th>
                  <th className="p-4">Course Title</th>
                  <th className="p-4">Issued</th>
                  <th className="p-4">Expires</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {certificates.map((cert) => (
                  <tr key={cert.id} className="hover:bg-[#F9FAFB] transition-colors">
                    <td className="p-4 font-mono text-[#DC2626] font-medium">
                      {cert.certificateNumber}
                    </td>
                    <td className="p-4 font-semibold text-[#1F2937]">
                      {cert.studentName}
                    </td>
                    <td className="p-4 max-w-xs truncate text-[#4B5563]">
                      {cert.courseTitle}
                    </td>
                    <td className="p-4 text-[#4B5563]">
                      {cert.issuedAt}
                    </td>
                    <td className="p-4 text-[#4B5563]">
                      {cert.expiresAt}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        cert.status === 'active' 
                          ? 'bg-red-50 text-[#DC2626] border border-red-200' 
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {cert.status === 'active' ? 'Active' : 'Expiring Soon'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => renewCertificate(cert.id)}
                        className="text-xs text-[#DC2626] hover:text-[#B91C1C] font-semibold cursor-pointer"
                      >
                        Recertify &rarr;
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
