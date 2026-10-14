import React, { useState, useEffect } from 'react';
import { useLMS } from '../../context/LMSContext';
import { AttendanceRecord } from '../../types/lms';
import { 
  attendanceLoggingService, 
  VerifiedAttendanceLog 
} from '../../services/attendanceLoggingService';
import { 
  CalendarCheck, 
  QrCode, 
  CheckCircle2, 
  Clock, 
  Download, 
  Plus, 
  ShieldCheck, 
  Smartphone, 
  Sparkles, 
  Users,
  AlertCircle,
  Database,
  Hash,
  X,
  History,
  Check
} from 'lucide-react';

export const AttendanceModule: React.FC = () => {
  const { 
    attendanceRecords, 
    checkInAttendance, 
    getStudentAttendanceRate, 
    attendanceSessions,
    user, 
    courses 
  } = useLMS();

  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const activeSession = attendanceSessions[0];
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id || '');
  const [sessionTopic, setSessionTopic] = useState('Lecture: Modern Frontend DOM & Full-Stack Systems');
  const [sessionTime, setSessionTime] = useState('11:00 AM - 12:30 PM');
  
  // Local storage verified logs state
  const [verifiedLogs, setVerifiedLogs] = useState<VerifiedAttendanceLog[]>([]);
  const [activeLedgerTab, setActiveLedgerTab] = useState<'sessions' | 'verified_storage'>('sessions');

  // Confirmation Toast state
  const [toastMessage, setToastMessage] = useState<{
    title: string;
    description: string;
    timestamp: string;
    hash: string;
  } | null>(null);

  const attendanceRate = getStudentAttendanceRate();
  const isInstructorOrAdmin = user?.role === 'INSTRUCTOR' || user?.role === 'ADMIN';

  // Load verified local storage attendance history
  useEffect(() => {
    const logs = attendanceLoggingService.getLogs(user?.id);
    setVerifiedLogs(logs);
  }, [user]);

  // Handle Mark Attendance with local storage logging and confirmation toast
  const handleMarkAttendance = (method: AttendanceRecord['checkInMethod'] = 'Manual') => {
    const topic = activeSession?.topic || sessionTopic;
    const course = courses.find(c => c.id === activeSession?.courseId) || courses[0];

    // 1. Update LMS context attendance state
    checkInAttendance(activeSession?.id || 'att_sess_01', method);

    // 2. Log date, timestamp and cryptographic receipt to local storage
    const loggedEntry = attendanceLoggingService.logAttendance({
      studentId: user?.id || 'usr_stu_001',
      studentName: user?.name || 'Student Learner',
      courseId: course?.id || 'c_frontend_dev',
      courseTitle: course?.title || 'Frontend Development',
      sessionId: activeSession?.id || `sess_${Date.now()}`,
      topic,
      status: 'PRESENT',
      checkInMethod: method
    });

    // 3. Update local state logs for immediate student verification
    setVerifiedLogs(attendanceLoggingService.getLogs(user?.id));

    // 4. Trigger confirmation toast
    setToastMessage({
      title: 'Attendance Successfully Marked & Verified!',
      description: `Recorded PRESENT for "${topic}". Timestamp & cryptographic proof saved in local storage.`,
      timestamp: `${loggedEntry.date} at ${loggedEntry.formattedTime}`,
      hash: loggedEntry.verificationHash
    });

    // Auto-dismiss toast after 6 seconds
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 6000);

    return () => clearTimeout(timer);
  };

  const handleExportAttendanceCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Record ID,Course Title,Date,Time Slot,Topic,Status,Check-in Method,Check-in Time\n" +
      attendanceRecords.map(r => `${r.id},"${r.courseTitle}",${r.date},"${r.timeSlot}","${r.topic}",${r.status},${r.checkInMethod},${r.checkInTime || 'N/A'}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `attendance_ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 text-[#1F2937]">
      
      {/* Toast Notification Banner when Attendance is Marked */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 max-w-md w-full animate-in slide-in-from-top-4 duration-300">
          <div className="bg-white border-2 border-[#DC2626] rounded-2xl p-4 shadow-xl text-[#1F2937] space-y-2">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-[#DC2626] shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-[#DC2626]" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-[#1F2937] tracking-tight">
                    {toastMessage.title}
                  </h4>
                  <div className="text-[11px] text-[#DC2626] font-mono">
                    Timestamp: {toastMessage.timestamp}
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setToastMessage(null)}
                className="text-[#4B5563] hover:text-[#1F2937] p-1 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <p className="text-[11px] text-[#4B5563] leading-relaxed pl-1">
              {toastMessage.description}
            </p>

            <div className="pt-1.5 border-t border-[#E5E7EB] flex items-center justify-between text-[10px]">
              <span className="text-[#4B5563] font-mono">Proof Hash: <strong className="text-[#DC2626]">{toastMessage.hash}</strong></span>
              <span className="text-green-700 font-semibold bg-green-50 px-2 py-0.5 rounded border border-green-200">
                Saved in Local Storage
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-50 text-[#DC2626] border border-red-200 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Biometric & Dynamic QR Tracking
          </div>
          <h1 className="text-2xl font-bold text-[#1F2937] flex items-center gap-2">
            <CalendarCheck className="w-6 h-6 text-[#DC2626]" />
            Attendance Tracking & Verification Module
          </h1>
          <p className="text-xs text-[#4B5563] mt-1">
            Automated session check-in with verified date and timestamp persistence stored directly in local storage for student auditability.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportAttendanceCSV}
            className="bg-[#F9FAFB] hover:bg-gray-100 text-[#1F2937] text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2 border border-[#E5E7EB] cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#4B5563]" /> Export CSV Ledger
          </button>

          <button
            onClick={() => setIsQrModalOpen(true)}
            className="bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <QrCode className="w-4 h-4" />
            {isInstructorOrAdmin ? 'Broadcast Session QR Code' : 'Scan Live QR Token'}
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 space-y-1 shadow-xs">
          <div className="text-xs font-medium text-[#4B5563] flex items-center justify-between">
            <span>Overall Attendance Rate</span>
            <CheckCircle2 className="w-4 h-4 text-[#DC2626]" />
          </div>
          <div className="text-3xl font-extrabold text-[#1F2937]">{attendanceRate}%</div>
          <div className="text-[11px] text-[#DC2626] font-medium">Institutional threshold: 75%</div>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 space-y-1 shadow-xs">
          <div className="text-xs font-medium text-[#4B5563] flex items-center justify-between">
            <span>Sessions Attended</span>
            <CalendarCheck className="w-4 h-4 text-green-600" />
          </div>
          <div className="text-3xl font-extrabold text-[#1F2937]">{attendanceRecords.length}</div>
          <div className="text-[11px] text-green-700 font-medium">Across current academic term</div>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 space-y-1 shadow-xs">
          <div className="text-xs font-medium text-[#4B5563] flex items-center justify-between">
            <span>Local Storage Verified Logs</span>
            <Database className="w-4 h-4 text-[#DC2626]" />
          </div>
          <div className="text-3xl font-extrabold text-[#1F2937]">{verifiedLogs.length}</div>
          <div className="text-[11px] text-[#4B5563]">Timestamped student entries</div>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 space-y-1 shadow-xs">
          <div className="text-xs font-medium text-[#4B5563] flex items-center justify-between">
            <span>Audit Readiness</span>
            <ShieldCheck className="w-4 h-4 text-green-600" />
          </div>
          <div className="text-3xl font-extrabold text-[#1F2937]">100%</div>
          <div className="text-[11px] text-green-700 font-medium">Cryptographically verifiable</div>
        </div>
      </div>

      {/* Interactive Active Session Check-In Card */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E5E7EB] pb-3">
          <div>
            <h3 className="font-bold text-[#1F2937] text-base flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#DC2626]" />
              Active Lecture Session Check-In
            </h3>
            <p className="text-xs text-[#4B5563]">
              Click 'Mark Attendance' below to verify your presence. The date, exact timestamp, and proof hash will be logged in local storage.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-[#DC2626] border border-red-200">
            <span className="w-2 h-2 rounded-full bg-[#DC2626] animate-pulse"></span> Live Check-In Window Open
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] space-y-1">
            <div className="text-[10px] uppercase font-semibold text-[#4B5563]">Topic</div>
            <div className="font-bold text-[#1F2937] text-sm">{activeSession?.topic || sessionTopic}</div>
            <div className="text-xs text-[#DC2626] font-medium">{activeSession?.instructorName || 'Dr. Elena Vance'}</div>
          </div>

          <div className="p-4 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] space-y-1">
            <div className="text-[10px] uppercase font-semibold text-[#4B5563]">Time Window</div>
            <div className="font-bold text-[#1F2937] text-sm">{activeSession?.startTime || '09:00 AM'} - {activeSession?.endTime || '10:30 AM'}</div>
            <div className="text-xs text-[#4B5563]">Geofence: Engineering Campus Hall A</div>
          </div>

          <div className="p-4 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] flex flex-col justify-center gap-2">
            {/* The Mark Attendance Button with Toast Confirmation & Local Storage Logging */}
            <button
              onClick={() => handleMarkAttendance('Manual')}
              className="w-full bg-[#DC2626] hover:bg-[#B91C1C] text-white font-bold text-xs py-3 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" /> Mark Attendance
            </button>
            <div className="text-center text-[10px] text-[#4B5563]">
              Logs date, time & hash to local storage
            </div>
          </div>
        </div>
      </div>

      {/* Attendance History Ledger with Tabs for Sessions vs Local Storage Audit Log */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-xs">
        <div className="p-5 border-b border-[#E5E7EB] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#F9FAFB]">
          <div>
            <h3 className="font-bold text-[#1F2937] text-sm">
              Attendance Records & Verification Ledger
            </h3>
            <p className="text-xs text-[#4B5563] mt-0.5">
              Verify your attendance history and cryptographic receipts stored in local storage.
            </p>
          </div>
          
          {/* Tab Switcher */}
          <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-xl border border-[#E5E7EB]">
            <button
              onClick={() => setActiveLedgerTab('sessions')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeLedgerTab === 'sessions'
                  ? 'bg-[#DC2626] text-white'
                  : 'text-[#4B5563] hover:text-[#1F2937]'
              }`}
            >
              Curriculum Sessions ({attendanceRecords.length})
            </button>
            <button
              onClick={() => setActiveLedgerTab('verified_storage')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                activeLedgerTab === 'verified_storage'
                  ? 'bg-[#DC2626] text-white'
                  : 'text-[#4B5563] hover:text-[#1F2937]'
              }`}
            >
              <History className="w-3.5 h-3.5" /> Local Storage Log ({verifiedLogs.length})
            </button>
          </div>
        </div>

        {/* Tab 1: Curriculum Sessions */}
        {activeLedgerTab === 'sessions' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#1F2937]">
              <thead className="bg-[#F9FAFB] text-[#4B5563] uppercase text-[10px] font-semibold border-b border-[#E5E7EB]">
                <tr>
                  <th className="p-4">Session Date</th>
                  <th className="p-4">Course & Topic</th>
                  <th className="p-4">Time Slot</th>
                  <th className="p-4">Verification Method</th>
                  <th className="p-4">Recorded At</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {attendanceRecords.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-mono text-[#4B5563] whitespace-nowrap">
                      {r.date}
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-[#1F2937] truncate max-w-sm">
                        {r.topic}
                      </div>
                      <div className="text-[10px] text-[#4B5563] truncate">
                        {r.courseTitle}
                      </div>
                    </td>
                    <td className="p-4 text-[#4B5563] whitespace-nowrap">
                      {r.timeSlot}
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium bg-[#F9FAFB] border border-[#E5E7EB] text-[#1F2937]">
                        {r.checkInMethod === 'QR Code' ? <QrCode className="w-3 h-3 text-[#DC2626]" /> : <Smartphone className="w-3 h-3 text-green-600" />}
                        {r.checkInMethod}
                      </span>
                    </td>
                    <td className="p-4 text-[#4B5563] whitespace-nowrap font-mono">
                      {r.checkInTime || '09:00 AM'}
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-50 text-green-700 border border-green-200">
                        PRESENT
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Verified Local Storage Log with Date & Precise Timestamp */}
        {activeLedgerTab === 'verified_storage' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#1F2937]">
              <thead className="bg-[#F9FAFB] text-[#DC2626] uppercase text-[10px] font-semibold border-b border-[#E5E7EB]">
                <tr>
                  <th className="p-4">Date</th>
                  <th className="p-4">Exact Timestamp (ISO 8601)</th>
                  <th className="p-4">Topic / Session</th>
                  <th className="p-4">Verification Hash</th>
                  <th className="p-4">Method</th>
                  <th className="p-4">Audit Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {verifiedLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-mono text-[#1F2937] font-semibold whitespace-nowrap">
                      {log.date}
                    </td>
                    <td className="p-4 font-mono text-[#4B5563] whitespace-nowrap text-[11px]">
                      <div>{log.formattedTime}</div>
                      <div className="text-[10px] text-gray-400">{log.timestamp}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-[#1F2937] truncate max-w-xs">{log.topic}</div>
                      <div className="text-[10px] text-[#4B5563]">{log.courseTitle}</div>
                    </td>
                    <td className="p-4 font-mono text-[#DC2626] text-[11px] whitespace-nowrap">
                      <span className="bg-[#F9FAFB] px-2 py-1 rounded border border-red-200">
                        {log.verificationHash}
                      </span>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <span className="text-[#1F2937] text-[11px]">{log.checkInMethod}</span>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-50 text-green-700 border border-green-200 flex items-center gap-1 w-fit">
                        <Check className="w-3 h-3" /> Verified Local
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* QR Code Dynamic Modal */}
      {isQrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white border-2 border-[#DC2626] rounded-2xl max-w-md w-full p-6 space-y-4 text-center relative shadow-xl">
            <div className="flex justify-between items-center border-b border-[#E5E7EB] pb-3">
              <h3 className="font-bold text-[#1F2937] text-base flex items-center gap-2">
                <QrCode className="w-5 h-5 text-[#DC2626]" />
                Dynamic Attendance QR Beacon
              </h3>
              <button 
                onClick={() => setIsQrModalOpen(false)}
                className="text-[#4B5563] hover:text-[#1F2937] text-xs cursor-pointer"
              >
                Close
              </button>
            </div>

            <p className="text-xs text-[#4B5563]">
              Scan below to mark attendance. The cryptographic timestamp is permanently verified in local storage.
            </p>

            <div className="bg-[#F9FAFB] p-6 rounded-2xl mx-auto w-56 h-56 flex flex-col items-center justify-center border border-[#E5E7EB] shadow-xs relative overflow-hidden">
              <div className="grid grid-cols-6 gap-1 w-44 h-44">
                {Array.from({ length: 36 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`rounded-xs ${
                      (i === 0 || i === 5 || i === 30 || i === 35 || i % 3 === 0 || i % 7 === 0) 
                        ? 'bg-[#1F2937]' 
                        : 'bg-transparent'
                    }`} 
                  />
                ))}
              </div>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-10 h-10 bg-[#DC2626] rounded-lg flex items-center justify-center text-white shadow-md">
                  <ShieldCheck className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="text-[11px] font-mono text-[#DC2626] font-semibold">
              BEACON TOKEN: #VL-ATT-{Math.floor(100000 + Math.random() * 900000)} (Active)
            </div>

            <button
              onClick={() => {
                handleMarkAttendance('QR Code');
                setIsQrModalOpen(false);
              }}
              className="w-full bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-bold py-2.5 rounded-xl transition-colors shadow-xs cursor-pointer"
            >
              Simulate Scan & Mark Attendance
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
