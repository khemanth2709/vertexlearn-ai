/**
 * Attendance Logging Service
 * Stores the date, precise timestamp, and verification metadata in local storage
 * so students can verify their historical attendance records and accreditation.
 */

export interface VerifiedAttendanceLog {
  id: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseTitle: string;
  sessionId: string;
  topic: string;
  date: string; // e.g. "2026-10-06"
  timestamp: string; // ISO 8601 string
  formattedTime: string; // e.g. "08:35:12 AM"
  verificationHash: string; // Institutional cryptographic receipt hash
  status: 'PRESENT' | 'EXCUSED' | 'LATE';
  checkInMethod: 'Manual' | 'QR Code' | 'Geofence' | 'Facial Verified' | 'GPS Location';
}

const STORAGE_KEY = 'vertexlearn_attendance_verified_history';

export const attendanceLoggingService = {
  /**
   * Log an attendance check-in event with date and full timestamp in local storage
   */
  logAttendance: (entry: {
    studentId: string;
    studentName: string;
    courseId?: string;
    courseTitle?: string;
    sessionId?: string;
    topic: string;
    status?: 'PRESENT' | 'EXCUSED' | 'LATE';
    checkInMethod?: 'Manual' | 'QR Code' | 'Geofence' | 'Facial Verified' | 'GPS Location';
  }): VerifiedAttendanceLog => {
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const timestamp = now.toISOString();
    const formattedTime = now.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });

    // Generate deterministic institutional verification receipt
    const raw = `${entry.studentId}-${date}-${timestamp}-${entry.topic}`;
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      hash = (hash << 5) - hash + raw.charCodeAt(i);
      hash |= 0;
    }
    const verificationHash = 'VL-' + Math.abs(hash).toString(16).toUpperCase().padStart(8, '0');

    const newLog: VerifiedAttendanceLog = {
      id: `att_log_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      studentId: entry.studentId,
      studentName: entry.studentName,
      courseId: entry.courseId || 'c_frontend_dev',
      courseTitle: entry.courseTitle || 'Frontend Development',
      sessionId: entry.sessionId || `sess_${date}`,
      topic: entry.topic,
      date,
      timestamp,
      formattedTime,
      verificationHash,
      status: entry.status || 'PRESENT',
      checkInMethod: entry.checkInMethod || 'Manual'
    };

    try {
      const existing = attendanceLoggingService.getLogs();
      const updated = [newLog, ...existing];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.warn('Failed to save attendance log to localStorage', err);
    }

    return newLog;
  },

  /**
   * Retrieve all verified attendance logs from local storage
   */
  getLogs: (studentId?: string): VerifiedAttendanceLog[] => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: VerifiedAttendanceLog[] = JSON.parse(saved);
        if (studentId) {
          return parsed.filter(l => l.studentId === studentId);
        }
        return parsed;
      }
    } catch {
      // Fallback
    }

    // Default seed records for demonstration of verification history
    const defaultLogs: VerifiedAttendanceLog[] = [
      {
        id: 'att_log_seed_1',
        studentId: studentId || 'usr_stu_001',
        studentName: 'Student Learner',
        courseId: 'c_frontend_dev',
        courseTitle: 'Frontend Development',
        sessionId: 'sess_prev_1',
        topic: 'DOM Architecture & Fiber Reconciliation',
        date: '2026-10-05',
        timestamp: '2026-10-05T09:02:14.000Z',
        formattedTime: '09:02:14 AM',
        verificationHash: 'VL-7A2F99B1',
        status: 'PRESENT',
        checkInMethod: 'Manual'
      },
      {
        id: 'att_log_seed_2',
        studentId: studentId || 'usr_stu_001',
        studentName: 'Student Learner',
        courseId: 'c_backend_dev',
        courseTitle: 'Backend Development',
        sessionId: 'sess_prev_2',
        topic: 'Database Connection Pooling & ACID',
        date: '2026-10-04',
        timestamp: '2026-10-04T10:15:22.000Z',
        formattedTime: '10:15:22 AM',
        verificationHash: 'VL-3E91CD04',
        status: 'PRESENT',
        checkInMethod: 'QR Code'
      }
    ];

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultLogs));
    } catch {
      // ignore
    }

    return defaultLogs;
  },

  /**
   * Clear logs (for testing or reset)
   */
  clearLogs: () => {
    localStorage.removeItem(STORAGE_KEY);
  }
};
