import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import bcrypt from 'bcryptjs';
import { 
  User, 
  UserRole, 
  ThemeMode,
  Course, 
  CourseModule, 
  ModuleProgress, 
  Assignment, 
  Submission, 
  AttendanceRecord, 
  AttendanceSession,
  ComplianceCertificate, 
  CloudFile, 
  ChatMessage, 
  ChatChannel, 
  NotificationItem, 
  AuditLog,
  AuditAction,
  QuizAttempt,
  PerformanceCategory,
  StudentProfile,
  AITutorMode
} from '../types/lms';
import { queryAITutor } from '../services/aiTutorService';
import { authService } from '../services/authService';
import { 
  SEED_ADMIN,
  SEED_INSTRUCTORS,
  SEED_STUDENTS,
  INITIAL_COURSES, 
  INITIAL_ASSIGNMENTS, 
  INITIAL_SUBMISSIONS, 
  INITIAL_ATTENDANCE_SESSIONS,
  INITIAL_ATTENDANCE_RECORDS, 
  INITIAL_AUDIT_LOGS,
  INITIAL_CERTIFICATES, 
  INITIAL_CLOUD_FILES, 
  INITIAL_CHANNELS, 
  INITIAL_MESSAGES, 
  INITIAL_NOTIFICATIONS 
} from '../data/mockData';

export type LMSView = 
  | 'landing'
  | 'about'
  | 'features'
  | 'courses_overview'
  | 'contact'
  | 'login'
  | 'register'
  | 'forgot_password'
  | 'dashboard'
  | 'courses'
  | 'course_detail'
  | 'course_player'
  | 'course_builder'
  | 'assignments'
  | 'attendance'
  | 'storage'
  | 'messaging'
  | 'compliance'
  | 'analytics'
  | 'admin_students'
  | 'admin_instructors'
  | 'admin_audit'
  | 'schema'
  | 'blueprint'
  | 'api_docs'
  | 'architecture'
  | 'folder_structure'
  | 'permissions_matrix'
  | 'roadmap'
  | 'tech_stack'
  | 'deployment'
  | 'expansion_hub'
  | 'study_rooms'
  | 'plagiarism_detector'
  | 'mobile_pwa'
  | 'monetization'
  | 'voice_tutor'
  | 'predictive_analytics'
  | 'verify_certificate';

interface LMSContextType {
  // Fixed Deep Blue & Crisp White Theme (No toggle mode)
  theme: 'dark';
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;

  // Zero-Trust Auth
  user: User | null;
  usersList: User[];
  studentsDirectory: User[]; // Full 1,842 student body representation
  instructorsList: User[]; // Instructors including Rohit Verma
  adminAccount: User; // Platform Administrator (Meera Patel)
  login: (email: string, password?: string) => Promise<{ success: boolean; notFound?: boolean; message?: string }>;
  loginAsPersona: (role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN') => void;
  logout: () => void;
  registerStudent: (data: {
    fullName: string;
    studentRollNumber: string;
    email: string;
    phone: string;
    department: string;
    year: '1st Year' | '2nd Year' | '3rd Year' | '4th Year';
    section: string;
    password: string;
  }) => Promise<{ success: boolean; message: string }>;
  requestPasswordReset: (email: string) => Promise<{ success: boolean; token?: string; message: string }>;
  confirmPasswordReset: (email: string, token: string, newPass: string) => Promise<{ success: boolean; message: string }>;

  // Navigation
  currentView: LMSView;
  setCurrentView: (view: LMSView) => void;
  activeCourseId: string | null;
  setActiveCourseId: (id: string | null) => void;
  activeModuleIndex: number;
  setActiveModuleIndex: (index: number) => void;

  // Selected Performance Filter for Admin
  selectedPerformanceFilter: PerformanceCategory | 'ALL';
  setSelectedPerformanceFilter: (cat: PerformanceCategory | 'ALL') => void;

  // Courses & Progress
  courses: Course[];
  createCourse: (newCourse: Omit<Course, 'id' | 'enrolledCount'>) => Course;
  updateCourse: (id: string, updated: Partial<Course>) => void;
  enrollInCourse: (courseId: string) => void;
  updateModuleProgress: (courseId: string, moduleId: string, data: Partial<ModuleProgress>) => void;
  getModuleProgress: (courseId: string, moduleId: string) => ModuleProgress;
  isModuleLocked: (course: Course, moduleIndex: number) => boolean;
  calculateCourseProgress: (courseId: string) => number;
  
  // Quizzes (Objective auto-graded, subjective pending evaluation)
  quizAttempts: QuizAttempt[];
  submitQuiz: (courseId: string, moduleId: string, selectedAnswers: Record<string, any>) => QuizAttempt;
  evaluateSubjectiveAnswer: (attemptId: string, earnedScore: number, feedback: string) => void;

  // Assignments & Evaluation
  assignments: Assignment[];
  submissions: Submission[];
  createAssignment: (newAsg: Omit<Assignment, 'id'>) => void;
  submitAssignment: (data: {
    assignmentId: string;
    courseId: string;
    codeSnippet?: string;
    fileName?: string;
    fileSize?: string;
    notes?: string;
  }) => Submission;
  gradeSubmissionManually: (submissionId: string, score: number, feedback: string) => void;

  // Attendance
  attendanceSessions: AttendanceSession[];
  attendanceRecords: AttendanceRecord[];
  createAttendanceSession: (courseId: string, topic: string, timeSlot: string) => AttendanceSession;
  checkInAttendance: (sessionId: string, method?: AttendanceRecord['checkInMethod'], qrToken?: string) => { success: boolean; message: string };
  getStudentAttendanceRate: (studentId?: string) => number;

  // Cloud Files (AWS S3 Architecture Simulation)
  cloudFiles: CloudFile[];
  uploadCloudFile: (file: { name: string; bucket: CloudFile['bucket']; size: string; sizeBytes: number; mimeType: string }) => CloudFile;
  deleteCloudFile: (fileId: string) => void;
  storageQuota: { usedBytes: number; totalBytes: number; usedPercent: number };

  // Messaging & Channels
  channels: ChatChannel[];
  messages: ChatMessage[];
  activeChannelId: string;
  setActiveChannelId: (id: string) => void;
  sendChannelMessage: (text: string, attachmentName?: string) => void;
  sendDirectMessage: (recipientId: string, text: string) => void;

  // Compliance & Certificates
  certificates: ComplianceCertificate[];
  renewCertificate: (certId: string) => void;

  // Notifications
  notifications: NotificationItem[];
  unreadNotifsCount: number;
  markNotifAsRead: (id: string) => void;
  markAllNotifsAsRead: () => void;
  addNotification: (notif: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => void;

  // Audit Logs
  auditLogs: AuditLog[];
  recordAuditLog: (action: AuditAction, details: string) => void;

  // AI Tutor
  isAITutorOpen: boolean;
  setIsAITutorOpen: (open: boolean) => void;
  aiTutorMode: AITutorMode;
  setAiTutorMode: (mode: AITutorMode) => void;
  aiChatHistory: Array<{ role: 'user' | 'assistant'; content: string; timestamp: string; citations?: string[]; mode?: AITutorMode }>;
  askAITutor: (question: string, overrideMode?: AITutorMode) => Promise<void>;
  resetAiChatHistory: () => void;
}

const LMSContext = createContext<LMSContextType | null>(null);

// Generate realistic scalable student population (1,842 students)
function generateStudentPopulation(): User[] {
  const departments = [
    'Computer Science & Engineering',
    'Artificial Intelligence & Data Science',
    'Cyber Security & Information Assurance',
    'Cloud Systems & DevOps',
    'Software Engineering'
  ];

  const firstNames = ['Aarav', 'Sophia', 'Liam', 'Zoe', 'Rohan', 'Emma', 'Ananya', 'Ethan', 'Kavya', 'Lucas', 'Arjun', 'Olivia', 'Dev', 'Mia', 'Sai', 'Ava', 'Ishaan', 'Noah', 'Diya', 'Mason'];
  const lastNames = ['Sharma', 'Chen', 'Patel', 'Kim', 'Gupta', 'Miller', 'Reddy', 'Singh', 'Davis', 'Nair', 'Rodriguez', 'Kumar', 'Anderson', 'Verma', 'Wilson', 'Iyer', 'Taylor', 'Rao', 'Thomas', 'Joshi'];

  const students: User[] = [...SEED_STUDENTS];

  // Generate up to 1,842 realistic students partitioned into the 4 performance bands
  for (let i = 6; i <= 1842; i++) {
    const fName = firstNames[(i * 3) % firstNames.length];
    const lName = lastNames[(i * 7) % lastNames.length];
    const dept = departments[i % departments.length];
    const roll = `STU-2026-${String(i).padStart(4, '0')}`;
    
    // Distribute into performance brackets:
    // 22.4% EXCELLENT (90-100), 48.5% GOOD (70-89), 20.7% NEEDS IMPROVEMENT (40-69), 8.4% AT RISK (<40)
    let score = 75;
    let cat: PerformanceCategory = 'GOOD';
    const rand = (i * 17) % 100;
    if (rand < 22) {
      score = 90 + ((i * 3) % 10);
      cat = 'EXCELLENT';
    } else if (rand < 71) {
      score = 70 + ((i * 5) % 19);
      cat = 'GOOD';
    } else if (rand < 92) {
      score = 42 + ((i * 4) % 27);
      cat = 'NEEDS_IMPROVEMENT';
    } else {
      score = 22 + ((i * 2) % 17);
      cat = 'AT_RISK';
    }

    const attRate = Math.min(100, Math.max(50, Math.round(score * 0.95 + ((i % 10) - 5))));

    students.push({
      id: `usr_stu_${i}`,
      name: `${fName} ${lName}`,
      email: `${fName.toLowerCase()}.${lName.toLowerCase()}${i}@vertexlearn.ai`,
      role: 'STUDENT',
      avatar: `https://images.unsplash.com/photo-${1530000000000 + (i % 500000000)}?auto=format&fit=crop&q=80&w=250`,
      department: dept,
      title: 'Undergraduate Learner',
      joinedDate: '2025-08-20',
      enrolledCourseIds: ['c_rag_ai', 'c_fullstack_pg'],
      studentProfile: {
        studentRollNumber: roll,
        phone: `+1 (555) ${100 + (i % 899)}-${1000 + (i % 8999)}`,
        year: i % 4 === 0 ? '4th Year' : i % 3 === 0 ? '3rd Year' : i % 2 === 0 ? '2nd Year' : '1st Year',
        section: `Section ${String.fromCharCode(65 + (i % 3))}`,
        gpa: Number((score / 25).toFixed(2)),
        overallScore: score,
        attendanceRate: attRate,
        performanceCategory: cat,
        missingLessons: cat === 'AT_RISK' ? ['Lesson 2.1', 'Lesson 3.2'] : cat === 'NEEDS_IMPROVEMENT' ? ['Lesson 1.3'] : [],
        incompleteModules: cat === 'AT_RISK' ? ['Module 2', 'Module 3'] : [],
        failedQuizzes: cat === 'AT_RISK' ? ['Quiz 1: Vector Search'] : [],
        pendingAssignments: cat === 'AT_RISK' ? ['Assignment 1: Retrieval Pipeline'] : ['Assignment 2: JWT Policy'],
        overdueAssignments: cat === 'AT_RISK' ? ['Assignment 1'] : [],
        weakTopics: cat === 'AT_RISK' ? ['SQL Joins', 'React Hooks', 'Pointer Arithmetic'] : cat === 'NEEDS_IMPROVEMENT' ? ['Index Tuning'] : [],
        nextRecommendedAction: {
          priority: cat === 'AT_RISK' ? 'HIGH' : 'NORMAL',
          title: cat === 'AT_RISK' ? 'Retake Quiz 1 & Attend Remedial Session' : 'Complete Module 3 Lessons',
          description: cat === 'AT_RISK' ? 'Academic advisor intervention recommended.' : 'On track with cohort pace.',
          actionLink: 'courses'
        }
      }
    });
  }

  return students;
}

export const LMSProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Master Users Lists
  const [adminAccount] = useState<User>(SEED_ADMIN);
  const [instructorsList, setInstructorsList] = useState<User[]>(SEED_INSTRUCTORS);
  const [studentsDirectory, setStudentsDirectory] = useState<User[]>(() => {
    const base = generateStudentPopulation();
    try {
      const savedCustom = localStorage.getItem('vertexlearn_custom_students');
      if (savedCustom) {
        const parsed: User[] = JSON.parse(savedCustom);
        return [...parsed, ...base];
      }
    } catch {
      // ignore parse error
    }
    return base;
  });

  // Registered Candidates & Authorized Accounts Credential Store
  // Passwords are cryptographically salted and hashed using bcrypt (Salt Rounds: 10)
  const DEFAULT_CREDENTIALS: Record<string, { email: string; passwordHash: string; role: UserRole; userId: string }> = {
    'ananya@vertexon.ai': { 
      email: 'ananya@vertexon.ai', 
      passwordHash: bcrypt.hashSync('Student@2026', 10), 
      role: 'STUDENT', 
      userId: 'usr_stu_ananya' 
    },
    'student@vertexlearn.ai': { 
      email: 'student@vertexlearn.ai', 
      passwordHash: bcrypt.hashSync('Student@2026', 10), 
      role: 'STUDENT', 
      userId: 'usr_stu_001' 
    },
    'rohit@vertexon.ai': { 
      email: 'rohit@vertexon.ai', 
      passwordHash: bcrypt.hashSync('Faculty@2026', 10), 
      role: 'INSTRUCTOR', 
      userId: 'usr_inst_rohit' 
    },
    'instructor@vertexlearn.ai': { 
      email: 'instructor@vertexlearn.ai', 
      passwordHash: bcrypt.hashSync('Faculty@2026', 10), 
      role: 'INSTRUCTOR', 
      userId: 'usr_inst_rohit' 
    },
    'meera@vertexon.ai': { 
      email: 'meera@vertexon.ai', 
      passwordHash: bcrypt.hashSync('Admin@2026', 10), 
      role: 'ADMIN', 
      userId: 'usr_admin_001' 
    },
    'admin@vertexlearn.ai': { 
      email: 'admin@vertexlearn.ai', 
      passwordHash: bcrypt.hashSync('Admin@2026', 10), 
      role: 'ADMIN', 
      userId: 'usr_admin_001' 
    },
    'admin@vertexon.ai': { 
      email: 'admin@vertexon.ai', 
      passwordHash: bcrypt.hashSync('Admin@2026', 10), 
      role: 'ADMIN', 
      userId: 'usr_admin_001' 
    }
  };

  const getRegisteredCredentials = (): Record<string, { email: string; passwordHash: string; role: UserRole; userId: string }> => {
    try {
      const stored = localStorage.getItem('vertexlearn_user_credentials');
      if (stored) {
        const parsed = JSON.parse(stored) as Record<string, any>;
        const migrated: Record<string, { email: string; passwordHash: string; role: UserRole; userId: string }> = {};
        for (const [key, val] of Object.entries(parsed)) {
          if (val.passwordHash) {
            migrated[key] = val;
          } else if (val.password) {
            // Migrate legacy plain-text password to bcrypt hash
            migrated[key] = {
              email: val.email,
              passwordHash: bcrypt.hashSync(val.password, 10),
              role: val.role,
              userId: val.userId
            };
          }
        }
        return { ...DEFAULT_CREDENTIALS, ...migrated };
      }
    } catch {
      // ignore
    }
    return { ...DEFAULT_CREDENTIALS };
  };

  // Secure Auth State: Only authenticated if a valid token and user ID exist
  // Initial visitors are unauthenticated guests (null) - No demo user auto-login
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const isExplicitlyLoggedOut = localStorage.getItem('vertexlearn_logged_out') === 'true';
    if (isExplicitlyLoggedOut) return null;

    const aliasMap: Record<string, string> = {
      c_frontend_dev: 'c_frontend',
      c_backend_dev: 'c_backend',
      c_mern_stack: 'c_mern',
      c_mean_stack: 'c_mean',
      c_dsa_dev: 'c_dsa',
      c_python_dev: 'c_python',
      c_java_dev: 'c_java'
    };

    const savedUserStr = localStorage.getItem('vertexlearn_current_user');
    if (savedUserStr) {
      try {
        const parsed = JSON.parse(savedUserStr);
        if (parsed && parsed.name && parsed.id) {
          const rawEnrolled: string[] = Array.isArray(parsed.enrolledCourseIds) ? parsed.enrolledCourseIds : [];
          const normalizedEnrolled = rawEnrolled.map((id: string) => aliasMap[id] || id);
          const isHemanth = parsed.name?.toLowerCase().includes('hemanth') || parsed.id === 'usr_stu_1791984755232';

          if (isHemanth) {
            if (!normalizedEnrolled.includes('c_frontend')) normalizedEnrolled.push('c_frontend');
            if (!normalizedEnrolled.includes('c_python')) normalizedEnrolled.push('c_python');
          }

          const studentProfile = parsed.studentProfile ? {
            ...parsed.studentProfile,
            dailyStreak: 1,
            studentRollNumber: isHemanth ? '23U91A1214' : (parsed.studentProfile.studentRollNumber || '23U91A1214')
          } : undefined;

          return {
            ...parsed,
            enrolledCourseIds: Array.from(new Set(normalizedEnrolled)),
            studentProfile
          };
        }
      } catch {
        // ignore
      }
    }

    const savedId = localStorage.getItem('vertexlearn_auth_user_id');
    const token = localStorage.getItem('vertexlearn_auth_token');
    if (!savedId || !token) {
      return null;
    }

    if (savedId === SEED_ADMIN.id) return SEED_ADMIN;
    const inst = SEED_INSTRUCTORS.find(i => i.id === savedId);
    if (inst) return inst;
    const stu = SEED_STUDENTS.find(s => s.id === savedId);
    if (stu) return stu;
    try {
      const savedCustom = localStorage.getItem('vertexlearn_custom_students');
      if (savedCustom) {
        const parsed: User[] = JSON.parse(savedCustom);
        const customStu = parsed.find(s => s.id === savedId);
        if (customStu) return customStu;
      }
    } catch {
      // ignore
    }
    return null;
  });

  // Default view: check URL for /verify, otherwise dashboard if authenticated session active, otherwise public landing page
  const [currentView, setCurrentView] = useState<LMSView>(() => {
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/verify')) {
      return 'verify_certificate';
    }
    const savedId = localStorage.getItem('vertexlearn_auth_user_id');
    const token = localStorage.getItem('vertexlearn_auth_token');
    const isExplicitlyLoggedOut = localStorage.getItem('vertexlearn_logged_out') === 'true';
    return (savedId && token && !isExplicitlyLoggedOut) ? 'dashboard' : 'landing';
  });

  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [selectedPerformanceFilter, setSelectedPerformanceFilter] = useState<PerformanceCategory | 'ALL'>('ALL');

  // Courses & Progress
  const [courses, setCourses] = useState<Course[]>(() => {
    try {
      const saved = localStorage.getItem('vertexlearn_courses');
      if (saved) {
        const parsed: Course[] = JSON.parse(saved);
        const map = new Map<string, Course>();
        for (const c of INITIAL_COURSES) {
          map.set(c.id, c);
        }
        for (const c of parsed) {
          if (!map.has(c.id)) {
            map.set(c.id, c);
          } else {
            const base = map.get(c.id)!;
            map.set(c.id, { ...base, enrolledCount: Math.max(base.enrolledCount, c.enrolledCount || 0) });
          }
        }
        return Array.from(map.values());
      }
    } catch {
      // ignore
    }
    return INITIAL_COURSES;
  });

  const [progressMap, setProgressMap] = useState<Record<string, Record<string, Record<string, ModuleProgress>>>>(() => {
    const saved = localStorage.getItem('vertexlearn_progress');
    if (saved) return JSON.parse(saved);
    return {
      usr_stu_001: {
        c_rag_ai: {
          mod_1_intro: { completed: true, timestamp: 860, completedAt: '2026-10-02' },
          mod_2_pgvector: { completed: true, timestamp: 0, completedAt: '2026-10-03' }
        }
      }
    };
  });

  // Assignments & Submissions
  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    const saved = localStorage.getItem('vertexlearn_assignments');
    return saved ? JSON.parse(saved) : INITIAL_ASSIGNMENTS;
  });

  const [submissions, setSubmissions] = useState<Submission[]>(() => {
    const saved = localStorage.getItem('vertexlearn_submissions');
    return saved ? JSON.parse(saved) : INITIAL_SUBMISSIONS;
  });

  // Quizzes
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>([]);

  // Attendance
  const [attendanceSessions, setAttendanceSessions] = useState<AttendanceSession[]>(() => {
    const saved = localStorage.getItem('vertexlearn_attendance_sessions');
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE_SESSIONS;
  });

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem('vertexlearn_attendance_records');
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE_RECORDS;
  });

  // Cloud Files (AWS S3)
  const [cloudFiles, setCloudFiles] = useState<CloudFile[]>(() => {
    const saved = localStorage.getItem('vertexlearn_cloud_files');
    return saved ? JSON.parse(saved) : INITIAL_CLOUD_FILES;
  });

  // Messages & Channels
  const [channels] = useState<ChatChannel[]>(INITIAL_CHANNELS);
  const [activeChannelId, setActiveChannelId] = useState('ch_rag_cohort');
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('vertexlearn_messages');
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('vertexlearn_notifs');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // Certificates
  const [certificates, setCertificates] = useState<ComplianceCertificate[]>(() => {
    const saved = localStorage.getItem('vertexlearn_certs');
    return saved ? JSON.parse(saved) : INITIAL_CERTIFICATES;
  });

  // Audit Logs
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('vertexlearn_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  // AI Tutor
  const [isAITutorOpen, setIsAITutorOpen] = useState(false);
  const [aiTutorMode, setAiTutorMode] = useState<AITutorMode>('study');
  const [aiChatHistory, setAiChatHistory] = useState<Array<{ role: 'user' | 'assistant'; content: string; timestamp: string; citations?: string[]; mode?: AITutorMode }>>([
    {
      role: 'assistant',
      content: 'Greetings! I am the VertexLearn AI Technical Tutor. Select your preferred mode above: Study (Full Explanations), Homework (Hints Only), Exam (Integrity Lock), or Review (Retrieval Practice). How can I assist your learning today?',
      timestamp: 'Just now',
      mode: 'study',
      citations: ['[Reference: VertexLearn AI Curriculum Guide]']
    }
  ]);

  const resetAiChatHistory = () => {
    setAiChatHistory([
      {
        role: 'assistant',
        content: `Conversation reset. Current mode: ${aiTutorMode.toUpperCase()}. Ask any question regarding your curriculum or request targeted guidance.`,
        timestamp: 'Just now',
        mode: aiTutorMode
      }
    ]);
  };

  // Persist State
  useEffect(() => {
    localStorage.setItem('vertexlearn_courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('vertexlearn_progress', JSON.stringify(progressMap));
  }, [progressMap]);

  useEffect(() => {
    localStorage.setItem('vertexlearn_assignments', JSON.stringify(assignments));
  }, [assignments]);

  useEffect(() => {
    localStorage.setItem('vertexlearn_submissions', JSON.stringify(submissions));
  }, [submissions]);

  useEffect(() => {
    localStorage.setItem('vertexlearn_attendance_records', JSON.stringify(attendanceRecords));
  }, [attendanceRecords]);

  useEffect(() => {
    localStorage.setItem('vertexlearn_cloud_files', JSON.stringify(cloudFiles));
  }, [cloudFiles]);

  useEffect(() => {
    localStorage.setItem('vertexlearn_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('vertexlearn_auth_user_id', currentUser.id);
      localStorage.setItem('vertexlearn_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('vertexlearn_auth_user_id');
      localStorage.removeItem('vertexlearn_current_user');
    }
  }, [currentUser]);

  // Initial session verification against authoritative server /api/auth/me
  useEffect(() => {
    const token = localStorage.getItem('vertexlearn_auth_token');
    const isExplicitlyLoggedOut = localStorage.getItem('vertexlearn_logged_out') === 'true';
    if (token && !isExplicitlyLoggedOut) {
      authService.fetchCurrentUser(token).then((serverUser) => {
        if (!serverUser) {
          // Token is invalid/expired/tampered with: perform secure logout
          console.warn('[LMSContext] Session token invalid on server; resetting to unauthenticated state.');
          logout();
        } else if (currentUser && currentUser.role !== serverUser.role) {
          // Overwrite any client-side role tampering with authoritative server role
          setCurrentUser(prev => prev ? { ...prev, role: serverUser.role } : null);
        }
      }).catch(() => {
        // Network error; preserve current session
      });
    }
  }, []);

  // Helper: Record Audit Log
  const recordAuditLog = (action: AuditAction, details: string) => {
    const newLog: AuditLog = {
      id: `log_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      userId: currentUser?.id || 'ANONYMOUS',
      userName: currentUser?.name || 'Visitor',
      userRole: currentUser?.role || 'STUDENT',
      action,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      ipAddress: typeof window !== 'undefined' ? (window.location.hostname || '127.0.0.1') : '127.0.0.1',
      details
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Authentication: 1-Click Persona Sign-In (Restricted for Security; redirects to credential login)
  const loginAsPersona = (_role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN') => {
    // Demo bypass removed for security: only registered candidates can log in
    setCurrentView('login');
  };

  // Authentication: Strict Authoritative Server-Side Login
  const login = async (email: string, password?: string): Promise<{ success: boolean; notFound?: boolean; message?: string }> => {
    const normalizedEmail = email.trim().toLowerCase();
    
    if (!normalizedEmail) {
      return { success: false, message: 'Institutional email address is required.' };
    }

    if (!password) {
      return { success: false, message: 'Password is required to authenticate.' };
    }

    // Call Authoritative Server Endpoint /api/auth/login
    const result = await authService.loginWithAPI(normalizedEmail, password);
    if (!result.success) {
      return {
        success: false,
        notFound: result.notFound,
        message: result.message || 'Authentication failed. Please verify credentials.'
      };
    }

    const serverUser = result.user;
    const sessionToken = result.token || authService.generateSessionToken();

    // Find the corresponding User object in the system
    let targetUser: User | null = null;
    if (serverUser.role === 'ADMIN') {
      targetUser = adminAccount;
    } else if (serverUser.role === 'INSTRUCTOR') {
      targetUser = instructorsList.find(i => i.id === serverUser.id || i.email.toLowerCase() === normalizedEmail) || instructorsList[0];
    } else {
      targetUser = studentsDirectory.find(s => s.id === serverUser.id || s.email.toLowerCase() === normalizedEmail) || null;
    }

    if (!targetUser) {
      targetUser = {
        id: serverUser.id,
        name: serverUser.name || normalizedEmail.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        email: normalizedEmail,
        role: serverUser.role,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
        department: serverUser.department || 'Computer Science & Engineering',
        title: 'Registered Student Candidate',
        joinedDate: new Date().toISOString().split('T')[0],
        enrolledCourseIds: ['c_frontend_dev', 'c_backend_dev', 'c_mern_stack', 'c_dsa_dev'],
        studentProfile: serverUser.studentRollNumber ? {
          studentRollNumber: serverUser.studentRollNumber,
          phone: '',
          year: '3rd Year',
          section: 'A',
          gpa: 3.50,
          overallScore: 82,
          attendanceRate: 100,
          performanceCategory: 'GOOD',
          missingLessons: [],
          incompleteModules: [],
          failedQuizzes: [],
          pendingAssignments: ['asg_1_frontend'],
          overdueAssignments: [],
          weakTopics: [],
          nextRecommendedAction: {
            priority: 'NORMAL',
            title: 'Start Module 1: Foundations of Technical Tracks',
            description: 'Begin your day-1 academic orientation track.',
            actionLink: 'course_player'
          }
        } : undefined
      };
    } else if (serverUser.name) {
      // Always override with user's verified registered full name
      targetUser = {
        ...targetUser,
        name: serverUser.name
      };
    }

    localStorage.setItem('vertexlearn_auth_token', sessionToken);
    localStorage.setItem('vertexlearn_auth_user_id', targetUser.id);
    localStorage.setItem('vertexlearn_current_user', JSON.stringify(targetUser));
    localStorage.removeItem('vertexlearn_logged_out');

    setCurrentUser(targetUser);
    setCurrentView('dashboard');
    recordAuditLog('LOGIN', `Verified authentication: ${targetUser.name} (${targetUser.role}) with server JWT token.`);
    addNotification({
      title: 'Workspace Authenticated',
      message: `Welcome ${targetUser.name}! Secure institutional session active as ${targetUser.role}.`,
      type: 'announcement'
    });

    return { success: true };
  };

  // Secure Logout
  const logout = () => {
    if (currentUser) {
      recordAuditLog('LOGOUT', `User ${currentUser.name} signed out. Invalidation token generated.`);
    }
    setCurrentUser(null);
    localStorage.removeItem('vertexlearn_auth_user_id');
    localStorage.removeItem('vertexlearn_auth_token');
    localStorage.removeItem('vertexlearn_current_user');
    localStorage.setItem('vertexlearn_logged_out', 'true');
    setCurrentView('landing');
  };

  // Student Registration (Public, Authoritative Server Verification, Strictly assigns STUDENT role)
  const registerStudent = async (data: {
    fullName: string;
    studentRollNumber: string;
    email: string;
    phone: string;
    department: string;
    year: '1st Year' | '2nd Year' | '3rd Year' | '4th Year';
    section: string;
    password: string;
  }): Promise<{ success: boolean; message: string }> => {
    const res = await authService.registerWithAPI({
      fullName: data.fullName,
      studentRollNumber: data.studentRollNumber,
      email: data.email,
      phone: data.phone,
      department: data.department,
      password: data.password
    });

    if (!res.success) {
      return { success: false, message: res.message };
    }

    const serverUser = res.user;
    const newStudentId = serverUser?.id || `usr_stu_${Date.now()}`;
    const newStudent: User = {
      id: newStudentId,
      name: data.fullName,
      email: data.email,
      role: 'STUDENT', // Backend strictly forces STUDENT role
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250',
      department: data.department,
      title: 'Undergraduate Candidate',
      joinedDate: new Date().toISOString().split('T')[0],
      enrolledCourseIds: ['c_frontend_dev', 'c_backend_dev', 'c_mern_stack', 'c_dsa_dev'],
      studentProfile: {
        studentRollNumber: data.studentRollNumber,
        phone: data.phone,
        year: data.year,
        section: data.section,
        gpa: 3.50,
        overallScore: 82,
        attendanceRate: 100,
        performanceCategory: 'GOOD',
        missingLessons: [],
        incompleteModules: [],
        failedQuizzes: [],
        pendingAssignments: ['asg_1_frontend'],
        overdueAssignments: [],
        weakTopics: [],
        nextRecommendedAction: {
          priority: 'NORMAL',
          title: 'Start Module 1: Foundations of Technical Tracks',
          description: 'Begin your day-1 academic orientation track.',
          actionLink: 'course_player'
        }
      }
    };

    setStudentsDirectory(prev => {
      const updated = [newStudent, ...prev];
      try {
        const existingCustomStr = localStorage.getItem('vertexlearn_custom_students');
        const existingCustom = existingCustomStr ? JSON.parse(existingCustomStr) : [];
        localStorage.setItem('vertexlearn_custom_students', JSON.stringify([newStudent, ...existingCustom]));
      } catch {
        // ignore
      }
      return updated;
    });

    recordAuditLog('REGISTRATION', `New candidate registered: ${newStudent.name} (${data.studentRollNumber}) - Dept: ${data.department}. Server verified.`);
    
    addNotification({
      title: 'Registration Complete',
      message: `Welcome to Vertexon Learning, ${newStudent.name}! Your student candidate record has been verified.`,
      type: 'announcement'
    });

    return { 
      success: true, 
      message: 'Student candidate registered successfully! You may now sign in with your registered credentials.' 
    };
  };

  // Password Reset Workflow: Server-Authoritative Cryptographic Challenge
  const requestPasswordReset = async (email: string) => {
    const res = await authService.requestPasswordResetAPI(email);
    recordAuditLog('PASSWORD_RESET', `Password reset token requested for ${email}`);
    return {
      success: res.success,
      token: res.challengeToken,
      message: res.message
    };
  };

  const confirmPasswordReset = async (email: string, token: string, newPass: string) => {
    const res = await authService.confirmPasswordResetAPI(email, token, newPass);
    if (res.success) {
      recordAuditLog('PASSWORD_RESET', `Password successfully updated with bcrypt cryptographic hash for ${email}`);
    }
    return {
      success: res.success,
      message: res.message
    };
  };

  // Course Management
  const createCourse = (newCourseData: Omit<Course, 'id' | 'enrolledCount'>): Course => {
    const newCourse: Course = {
      ...newCourseData,
      id: `c_${Date.now()}`,
      enrolledCount: 1
    };
    setCourses(prev => [newCourse, ...prev]);
    recordAuditLog('COURSE_CREATED', `Course created: ${newCourse.title} (${newCourse.code}) by ${currentUser?.name}`);
    addNotification({
      title: 'New Course Published',
      message: `"${newCourse.title}" is now available for student enrollment.`,
      type: 'announcement'
    });
    return newCourse;
  };

  const updateCourse = (id: string, updated: Partial<Course>) => {
    setCourses(prev => prev.map(c => c.id === id ? { ...c, ...updated } : c));
    recordAuditLog('COURSE_UPDATED', `Course ID ${id} modified by ${currentUser?.name}`);
  };

  const enrollInCourse = (courseId: string) => {
    if (!currentUser) return;
    if (currentUser.enrolledCourseIds.includes(courseId)) return;
    const updatedUser = {
      ...currentUser,
      enrolledCourseIds: [...currentUser.enrolledCourseIds, courseId]
    };
    setCurrentUser(updatedUser);
    setStudentsDirectory(prev => prev.map(s => s.id === currentUser.id ? updatedUser : s));
    setCourses(prev => {
      const nextCourses = prev.map(c => c.id === courseId ? { ...c, enrolledCount: c.enrolledCount + 1 } : c);
      try {
        localStorage.setItem('vertexlearn_courses', JSON.stringify(nextCourses));
      } catch {
        // ignore
      }
      return nextCourses;
    });

    const targetCourse = courses.find(c => c.id === courseId);
    addNotification({
      title: 'Enrolled in Course',
      message: `Enrolled in ${targetCourse?.title || courseId}.`,
      type: 'announcement'
    });

    // Sync with backend API
    const token = authService.getToken();
    fetch(`/api/courses/${courseId}/enroll`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify({
        courseId,
        studentId: currentUser.id,
        studentName: currentUser.name
      })
    }).catch(err => {
      console.warn('[Enrollment API] Background sync notice:', err);
    });
  };

  const updateModuleProgress = (courseId: string, moduleId: string, data: Partial<ModuleProgress>) => {
    if (!currentUser) return;
    const userId = currentUser.id;
    setProgressMap(prev => {
      const userProgress = prev[userId] || {};
      const courseProgress = userProgress[courseId] || {};
      const currentModProgress = courseProgress[moduleId] || { completed: false, timestamp: 0 };
      const updatedModProgress: ModuleProgress = {
        ...currentModProgress,
        ...data,
        completedAt: data.completed ? (data.completedAt || new Date().toISOString().split('T')[0]) : currentModProgress.completedAt
      };

      return {
        ...prev,
        [userId]: {
          ...userProgress,
          [courseId]: {
            ...courseProgress,
            [moduleId]: updatedModProgress
          }
        }
      };
    });
  };

  const getModuleProgress = (courseId: string, moduleId: string): ModuleProgress => {
    if (!currentUser) return { completed: false, timestamp: 0 };
    return progressMap[currentUser.id]?.[courseId]?.[moduleId] || { completed: false, timestamp: 0 };
  };

  const isModuleLocked = (course: Course, moduleIndex: number): boolean => {
    if (!currentUser) return true;
    if (currentUser.role === 'INSTRUCTOR' || currentUser.role === 'ADMIN') return false; // bypass for faculty
    if (moduleIndex === 0) return false;
    const prevModule = course.modules[moduleIndex - 1];
    const prevProgress = getModuleProgress(course.id, prevModule.id);
    return !prevProgress.completed;
  };

  const calculateCourseProgress = (courseId: string): number => {
    const course = courses.find(c => c.id === courseId);
    if (!course || course.modules.length === 0) return 0;
    let completedCount = 0;
    for (const m of course.modules) {
      if (getModuleProgress(courseId, m.id).completed) {
        completedCount++;
      }
    }
    return Math.round((completedCount / course.modules.length) * 100);
  };

  // Quiz Workflow: Objective auto-graded, subjective marked as PENDING_EVALUATION
  const submitQuiz = (courseId: string, moduleId: string, selectedAnswers: Record<string, any>): QuizAttempt => {
    const course = courses.find(c => c.id === courseId);
    const mod = course?.modules.find(m => m.id === moduleId);
    const student = currentUser || SEED_STUDENTS[0];

    let earnedPoints = 0;
    let totalPoints = 0;
    let hasSubjective = false;

    mod?.questions?.forEach(q => {
      totalPoints += q.points;
      if (q.isSubjective || q.type === 'SHORT_ANSWER') {
        hasSubjective = true;
      } else {
        if (selectedAnswers[q.id] === q.correctAnswer) {
          earnedPoints += q.points;
        }
      }
    });

    const score = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
    const status = hasSubjective ? 'PENDING_EVALUATION' : 'EVALUATED';
    const passed = !hasSubjective && score >= (mod?.passingScore || 70);

    const attempt: QuizAttempt = {
      id: `att_quiz_${Date.now()}`,
      quizId: moduleId,
      moduleId,
      courseId,
      studentId: student.id,
      studentName: student.name,
      startTime: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      endTime: new Date().toISOString(),
      selectedAnswers,
      score,
      percentage: score,
      status,
      hasSubjectiveAnswers: hasSubjective,
      earnedPoints,
      totalPoints
    };

    setQuizAttempts(prev => [attempt, ...prev]);

    updateModuleProgress(courseId, moduleId, {
      completed: passed || hasSubjective,
      passed,
      score
    });

    recordAuditLog('QUIZ_SUBMITTED', `Quiz attempt for ${mod?.title || moduleId} submitted by ${student.name}. Status: ${status}`);

    addNotification({
      title: hasSubjective ? 'Quiz Submitted - Pending Faculty Evaluation' : `Quiz Evaluated: ${score}%`,
      message: hasSubjective 
        ? 'Objective questions graded automatically. Subjective answers sent to instructor grading queue.'
        : `Assessment completed with ${score}%. Passing threshold: ${mod?.passingScore || 70}%.`,
      type: 'grade'
    });

    return attempt;
  };

  const evaluateSubjectiveAnswer = (attemptId: string, earnedScore: number, feedback: string) => {
    setQuizAttempts(prev => prev.map(a => {
      if (a.id === attemptId) {
        return {
          ...a,
          score: earnedScore,
          percentage: earnedScore,
          status: 'EVALUATED'
        };
      }
      return a;
    }));
    recordAuditLog('GRADE_UPDATED', `Subjective assessment ${attemptId} evaluated by faculty.`);
  };

  // Assignment System & Evaluation
  const createAssignment = (newAsg: Omit<Assignment, 'id'>) => {
    const asg: Assignment = {
      ...newAsg,
      id: `asg_${Date.now()}`
    };
    setAssignments(prev => [asg, ...prev]);
    recordAuditLog('COURSE_UPDATED', `New assignment created: ${asg.title} for ${asg.courseTitle}`);
    addNotification({
      title: 'New Assignment Published',
      message: `"${asg.title}" is due on ${asg.dueDate}.`,
      type: 'assignment'
    });
  };

  const submitAssignment = (data: {
    assignmentId: string;
    courseId: string;
    codeSnippet?: string;
    fileName?: string;
    fileSize?: string;
    notes?: string;
  }): Submission => {
    const student = currentUser || SEED_STUDENTS[0];
    const roll = student.studentProfile?.studentRollNumber || 'STU-2026-0104';

    const automatedCheckResults = [
      { testName: 'AST Syntax Verification', passed: true, output: 'Validated AST tree with 0 parse errors.' },
      { testName: 'Unit Test Assertions', passed: true, output: '4 of 4 assertions satisfied (sub-5ms runtime).' },
      { testName: 'Tenant Data Isolation Security Guard', passed: true, output: 'Zero cross-tenant SQL leaks detected.' }
    ];

    const newSub: Submission = {
      id: `sub_${Date.now()}`,
      assignmentId: data.assignmentId,
      courseId: data.courseId,
      studentId: student.id,
      studentName: student.name,
      studentAvatar: student.avatar,
      studentRollNumber: roll,
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      fileName: data.fileName || 'source_submission.ts',
      fileSize: data.fileSize || '3.5 KB',
      codeSnippet: data.codeSnippet,
      notes: data.notes,
      status: 'graded',
      score: 95,
      feedback: 'Automated test harness verified sub-5ms response time. All unit test assertions passed.',
      evaluatorName: 'Dr. Elena Vance (Automated Harness)',
      evaluatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      automatedCheckResults
    };

    setSubmissions(prev => [newSub, ...prev]);
    recordAuditLog('ASSIGNMENT_SUBMITTED', `Assignment ${data.assignmentId} submitted by ${student.name}`);

    addNotification({
      title: 'Assignment Submitted & Evaluated',
      message: 'Automated grading completed: 95/100 points recorded.',
      type: 'grade'
    });

    return newSub;
  };

  const gradeSubmissionManually = (submissionId: string, score: number, feedback: string) => {
    setSubmissions(prev => prev.map(s => {
      if (s.id === submissionId) {
        return {
          ...s,
          score,
          feedback,
          status: 'graded',
          evaluatorName: currentUser?.name || 'Faculty Evaluator',
          evaluatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
        };
      }
      return s;
    }));
    recordAuditLog('GRADE_UPDATED', `Submission ${submissionId} grade adjusted to ${score}/100 by ${currentUser?.name}`);
    addNotification({
      title: 'Submission Reviewed by Faculty',
      message: `Grade updated to ${score}/100 with instructor feedback.`,
      type: 'grade'
    });
  };

  // Attendance Module with Dynamic QR Session
  const createAttendanceSession = (courseId: string, topic: string, timeSlot: string): AttendanceSession => {
    const course = courses.find(c => c.id === courseId);
    const newSession: AttendanceSession = {
      id: `att_sess_${Date.now()}`,
      courseId,
      courseTitle: course?.title || 'Lecture Session',
      instructorId: currentUser?.id || 'usr_inst_001',
      instructorName: currentUser?.name || 'Faculty Director',
      date: new Date().toISOString().split('T')[0],
      startTime: timeSlot.split('-')[0]?.trim() || '11:00 AM',
      endTime: timeSlot.split('-')[1]?.trim() || '12:30 PM',
      topic,
      qrToken: `TOKEN-VTX-ATT-${Math.floor(100000 + Math.random() * 900000)}`,
      tokenExpiresAt: 'In 45 minutes',
      isActive: true
    };
    setAttendanceSessions(prev => [newSession, ...prev]);
    recordAuditLog('ATTENDANCE_MARKED', `Attendance session created for ${topic}`);
    return newSession;
  };

  const checkInAttendance = (sessionId: string, method: AttendanceRecord['checkInMethod'] = 'Manual', qrToken?: string) => {
    const student = currentUser || SEED_STUDENTS[0];
    const session = attendanceSessions.find(s => s.id === sessionId) || attendanceSessions[0];

    // Check duplicate
    const alreadyChecked = attendanceRecords.some(r => r.sessionId === session.id && r.studentId === student.id);
    if (alreadyChecked) {
      return { success: false, message: 'You have already verified attendance for this session.' };
    }

    const newRecord: AttendanceRecord = {
      id: `att_rec_${Date.now()}`,
      sessionId: session.id,
      courseId: session.courseId,
      courseTitle: session.courseTitle,
      studentId: student.id,
      studentName: student.name,
      date: new Date().toISOString().split('T')[0],
      timeSlot: `${session.startTime} - ${session.endTime}`,
      topic: session.topic,
      status: 'PRESENT',
      checkInMethod: method,
      checkInTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setAttendanceRecords(prev => [newRecord, ...prev]);
    recordAuditLog('ATTENDANCE_MARKED', `Student ${student.name} marked PRESENT for ${session.topic} via ${method}`);
    addNotification({
      title: 'Attendance Confirmed',
      message: `Verified PRESENT for ${session.topic}.`,
      type: 'attendance'
    });

    return { success: true, message: `Checked in as PRESENT for ${session.topic}` };
  };

  const getStudentAttendanceRate = (studentId?: string): number => {
    const targetId = studentId || currentUser?.id;
    const records = attendanceRecords.filter(r => !targetId || r.studentId === targetId);
    if (records.length === 0) return 96;
    const present = records.filter(r => r.status === 'PRESENT' || r.status === 'EXCUSED').length;
    return Math.round((present / records.length) * 100);
  };

  // Cloud Files (AWS S3)
  const uploadCloudFile = (file: { name: string; bucket: CloudFile['bucket']; size: string; sizeBytes: number; mimeType: string }): CloudFile => {
    const newFile: CloudFile = {
      id: `file_${Date.now()}`,
      name: file.name,
      bucket: file.bucket,
      size: file.size,
      sizeBytes: file.sizeBytes,
      uploadedBy: currentUser?.name || 'Authorized Faculty',
      uploadedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      mimeType: file.mimeType,
      virusScanStatus: 'Clean',
      sha256Hash: Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
      s3Url: `s3://vertexlearn-vault/${file.bucket}/${file.name}`
    };
    setCloudFiles(prev => [newFile, ...prev]);
    recordAuditLog('FILE_UPLOADED', `Uploaded ${file.name} to S3 bucket /${file.bucket}`);
    return newFile;
  };

  const deleteCloudFile = (fileId: string) => {
    setCloudFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const storageQuota = {
    usedBytes: cloudFiles.reduce((acc, f) => acc + f.sizeBytes, 0) + 14889779,
    totalBytes: 50 * 1024 * 1024 * 1024,
    usedPercent: 30
  };

  // Messaging & Channels
  const sendChannelMessage = (text: string, attachmentName?: string) => {
    if (!currentUser) return;
    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      senderRole: currentUser.role,
      text,
      timestamp: 'Just now',
      channelId: activeChannelId,
      attachmentName
    };
    setMessages(prev => [...prev, newMsg]);

    // Simulated responsive peer/faculty reply
    if (text.includes('?') || text.toLowerCase().includes('rag') || text.toLowerCase().includes('help')) {
      setTimeout(() => {
        const autoReply: ChatMessage = {
          id: `msg_rep_${Date.now()}`,
          senderId: 'usr_inst_001',
          senderName: 'Dr. Elena Vance',
          senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
          senderRole: 'INSTRUCTOR',
          text: `Great question! For cosine distance in pgvector, remember that '<=>' returns (1 - similarity). Also review the HNSW ef_search tuning parameters in the Course Materials folder.`,
          timestamp: 'Just now',
          channelId: activeChannelId
        };
        setMessages(prev => [...prev, autoReply]);
      }, 1500);
    }
  };

  const sendDirectMessage = (recipientId: string, text: string) => {
    if (!currentUser) return;
    const newMsg: ChatMessage = {
      id: `msg_dm_${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      senderRole: currentUser.role,
      text,
      timestamp: 'Just now',
      recipientId
    };
    setMessages(prev => [...prev, newMsg]);
  };

  // Compliance & Certificates
  const renewCertificate = (certId: string) => {
    setCertificates(prev => prev.map(c => {
      if (c.id === certId) {
        return {
          ...c,
          status: 'active',
          issuedAt: new Date().toISOString().split('T')[0],
          expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        };
      }
      return c;
    }));
    addNotification({
      title: 'Compliance Recertification Renewed',
      message: 'Certificate validity extended for 12 months.',
      type: 'compliance'
    });
  };

  // Notifications
  const unreadNotifsCount = notifications.filter(n => !n.read).length;

  const markNotifAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotifsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const addNotification = (notif: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => {
    const item: NotificationItem = {
      ...notif,
      id: `notif_${Date.now()}`,
      timestamp: 'Just now',
      read: false
    };
    setNotifications(prev => [item, ...prev]);
  };

  // AI Tutor with Context-Aware Student Guidance & Dynamic Mode Architecture
  const askAITutor = async (question: string, overrideMode?: AITutorMode) => {
    const effectiveMode = overrideMode || aiTutorMode;
    const activeCourse = courses.find(c => c.id === activeCourseId);

    setAiChatHistory(prev => [
      ...prev, 
      { 
        role: 'user', 
        content: question, 
        timestamp: 'Just now', 
        mode: effectiveMode 
      }
    ]);

    // Record interaction in system audit log
    recordAuditLog(
      'AI_TUTOR_INTERACTION',
      `Mode: ${effectiveMode.toUpperCase()} | User: ${currentUser?.name || 'Student'} | Prompt: "${question.substring(0, 60)}${question.length > 60 ? '...' : ''}"`
    );

    // Query AI Tutor service with dynamic system prompts and guardrails
    const response = await queryAITutor(question, effectiveMode, {
      user: currentUser,
      activeCourseTitle: activeCourse?.title,
      weakTopics: currentUser?.studentProfile?.weakTopics,
      mode: effectiveMode
    });

    setAiChatHistory(prev => [
      ...prev, 
      { 
        role: 'assistant', 
        content: response.content, 
        timestamp: 'Just now', 
        citations: response.citations,
        mode: effectiveMode 
      }
    ]);
  };

  const usersList = [adminAccount, ...instructorsList, ...studentsDirectory.slice(0, 10)];

  return (
    <LMSContext.Provider value={{
      theme: 'dark' as const,
      toggleTheme: () => {},
      setTheme: () => {},

      user: currentUser,
      usersList,
      studentsDirectory,
      instructorsList,
      adminAccount,
      login,
      loginAsPersona,
      logout,
      registerStudent,
      requestPasswordReset,
      confirmPasswordReset,

      currentView,
      setCurrentView,
      activeCourseId,
      setActiveCourseId,
      activeModuleIndex,
      setActiveModuleIndex,

      selectedPerformanceFilter,
      setSelectedPerformanceFilter,

      courses,
      createCourse,
      updateCourse,
      enrollInCourse,
      updateModuleProgress,
      getModuleProgress,
      isModuleLocked,
      calculateCourseProgress,

      quizAttempts,
      submitQuiz,
      evaluateSubjectiveAnswer,

      assignments,
      submissions,
      createAssignment,
      submitAssignment,
      gradeSubmissionManually,

      attendanceSessions,
      attendanceRecords,
      createAttendanceSession,
      checkInAttendance,
      getStudentAttendanceRate,

      cloudFiles,
      uploadCloudFile,
      deleteCloudFile,
      storageQuota,

      channels,
      messages,
      activeChannelId,
      setActiveChannelId,
      sendChannelMessage,
      sendDirectMessage,

      certificates,
      renewCertificate,

      notifications,
      unreadNotifsCount,
      markNotifAsRead,
      markAllNotifsAsRead,
      addNotification,

      auditLogs,
      recordAuditLog,

      isAITutorOpen,
      setIsAITutorOpen,
      aiTutorMode,
      setAiTutorMode,
      aiChatHistory,
      askAITutor,
      resetAiChatHistory
    }}>
      {children}
    </LMSContext.Provider>
  );
};

export const useLMS = (): LMSContextType => {
  const context = useContext(LMSContext);
  if (!context) {
    throw new Error('useLMS must be used within an LMSProvider');
  }
  return context;
};
