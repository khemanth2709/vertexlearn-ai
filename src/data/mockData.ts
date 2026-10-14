import { 
  User, 
  Course, 
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
  QuizAttempt 
} from '../types/lms';
import { OFFICIAL_COURSES } from './coursesData';

// EXACTLY ONE ADMINISTRATOR (Meera: Platform Admin)
export const SEED_ADMIN: User = {
  id: 'usr_admin_001',
  name: 'Meera Patel',
  email: 'meera@vertexon.ai',
  role: 'ADMIN',
  avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
  department: 'Platform Operations & Academic Governance',
  title: 'Platform Administrator & Course Approval Lead',
  joinedDate: '2023-01-10',
  enrolledCourseIds: ['c_rag_ai', 'c_fullstack_pg', 'c_soc2_compliance']
};

// INSTRUCTORS (Including Rohit: Working Professional & DSA Lead)
export const SEED_INSTRUCTORS: User[] = [
  {
    id: 'usr_inst_rohit',
    name: 'Rohit Verma',
    email: 'rohit@vertexon.ai',
    role: 'INSTRUCTOR',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
    department: 'Computer Science & Software Architecture',
    title: 'Working Professional & Lead DSA Instructor',
    joinedDate: '2024-01-15',
    enrolledCourseIds: ['c_dsa_dev', 'c_backend_dev'],
    instructorProfile: {
      facultyId: 'FAC-DSA-01',
      officeHours: 'Mon & Thu 7:00 PM - 9:00 PM IST',
      specialization: 'Data Structures, Algorithms & High-Scale Microservices',
      assignedCourseIds: ['c_dsa_dev', 'c_backend_dev'],
      pendingEvaluationsCount: 4
    }
  },
  {
    id: 'usr_inst_001',
    name: 'Dr. Elena Vance',
    email: 'elena.vance@vertexlearn.ai',
    role: 'INSTRUCTOR',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
    department: 'Artificial Intelligence & Machine Learning',
    title: 'Distinguished Professor & AI Lead',
    joinedDate: '2024-01-15',
    enrolledCourseIds: ['c_rag_ai'],
    instructorProfile: {
      facultyId: 'FAC-AI-01',
      officeHours: 'Mon & Wed 2:00 PM - 4:00 PM EST',
      specialization: 'Vector Embeddings, RAG Pipelines & Semantic Search',
      assignedCourseIds: ['c_rag_ai'],
      pendingEvaluationsCount: 3
    }
  },
  {
    id: 'usr_inst_002',
    name: 'Prof. Alan Turing',
    email: 'alan.turing@vertexlearn.ai',
    role: 'INSTRUCTOR',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
    department: 'Computer Science & Theoretical Foundations',
    title: 'Chair of Computational Complexity',
    joinedDate: '2023-08-01',
    enrolledCourseIds: ['c_comp_theory'],
    instructorProfile: {
      facultyId: 'FAC-CS-02',
      officeHours: 'Tue & Thu 10:00 AM - 12:00 PM EST',
      specialization: 'Automata, Turing Machines & Decidability',
      assignedCourseIds: ['c_comp_theory'],
      pendingEvaluationsCount: 1
    }
  },
  {
    id: 'usr_inst_003',
    name: 'Dr. Ada Lovelace',
    email: 'ada.lovelace@vertexlearn.ai',
    role: 'INSTRUCTOR',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250',
    department: 'Software Engineering & Compilers',
    title: 'Professor of Algorithm Optimization',
    joinedDate: '2023-09-12',
    enrolledCourseIds: ['c_algorithms_opt'],
    instructorProfile: {
      facultyId: 'FAC-SE-03',
      officeHours: 'Wed 1:00 PM - 3:00 PM EST',
      specialization: 'AST Generation, Intermediate Code & Optimization',
      assignedCourseIds: ['c_algorithms_opt'],
      pendingEvaluationsCount: 2
    }
  },
  {
    id: 'usr_inst_004',
    name: 'Prof. Linus Torvalds',
    email: 'linus.torvalds@vertexlearn.ai',
    role: 'INSTRUCTOR',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=250',
    department: 'Systems & Computer Architecture',
    title: 'Distinguished Fellow in Kernel Engineering',
    joinedDate: '2023-10-01',
    enrolledCourseIds: ['c_os_kernels'],
    instructorProfile: {
      facultyId: 'FAC-SYS-04',
      officeHours: 'Mon 3:00 PM - 5:00 PM EST',
      specialization: 'Unix Kernels, Memory Management & Sockets',
      assignedCourseIds: ['c_os_kernels'],
      pendingEvaluationsCount: 4
    }
  },
  {
    id: 'usr_inst_005',
    name: 'Dr. Grace Hopper',
    email: 'grace.hopper@vertexlearn.ai',
    role: 'INSTRUCTOR',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=250',
    department: 'Data Systems & Relational Engines',
    title: 'Professor of Database Internals',
    joinedDate: '2024-02-10',
    enrolledCourseIds: ['c_fullstack_pg'],
    instructorProfile: {
      facultyId: 'FAC-DB-05',
      officeHours: 'Tue 1:00 PM - 3:00 PM EST',
      specialization: 'PostgreSQL, Drizzle ORM & ACID Transactions',
      assignedCourseIds: ['c_fullstack_pg'],
      pendingEvaluationsCount: 2
    }
  },
  {
    id: 'usr_inst_006',
    name: 'Prof. Claude Shannon',
    email: 'claude.shannon@vertexlearn.ai',
    role: 'INSTRUCTOR',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250',
    department: 'Cyber Security & Information Assurance',
    title: 'Director of Cryptographic Research',
    joinedDate: '2024-03-01',
    enrolledCourseIds: ['c_soc2_compliance'],
    instructorProfile: {
      facultyId: 'FAC-SEC-06',
      officeHours: 'Thu 2:00 PM - 4:00 PM EST',
      specialization: 'Zero Trust, SOC 2, TLS 1.3 & Public Key Crypto',
      assignedCourseIds: ['c_soc2_compliance'],
      pendingEvaluationsCount: 1
    }
  },
  {
    id: 'usr_inst_007',
    name: 'Dr. Margaret Hamilton',
    email: 'margaret.hamilton@vertexlearn.ai',
    role: 'INSTRUCTOR',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250',
    department: 'Cloud Native & Distributed Systems',
    title: 'Chair of Mission-Critical Reliability',
    joinedDate: '2024-03-15',
    enrolledCourseIds: ['c_k8s_microservices'],
    instructorProfile: {
      facultyId: 'FAC-CLOUD-07',
      officeHours: 'Fri 10:00 AM - 12:00 PM EST',
      specialization: 'Kubernetes Orchestration, Raft & Fault Tolerance',
      assignedCourseIds: ['c_k8s_microservices'],
      pendingEvaluationsCount: 0
    }
  },
  {
    id: 'usr_inst_008',
    name: 'Prof. Donald Knuth',
    email: 'donald.knuth@vertexlearn.ai',
    role: 'INSTRUCTOR',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=250',
    department: 'Algorithms & Discrete Mathematics',
    title: 'Professor Emeritus of Algorithmics',
    joinedDate: '2023-06-15',
    enrolledCourseIds: ['c_algorithms_opt'],
    instructorProfile: {
      facultyId: 'FAC-ALG-08',
      officeHours: 'Mon 11:00 AM - 1:00 PM EST',
      specialization: 'Graph Algorithms, Combinatorics & Analysis',
      assignedCourseIds: ['c_algorithms_opt'],
      pendingEvaluationsCount: 2
    }
  },
  {
    id: 'usr_inst_009',
    name: 'Dr. Barbara Liskov',
    email: 'barbara.liskov@vertexlearn.ai',
    role: 'INSTRUCTOR',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=250',
    department: 'Software Architecture & System Design',
    title: 'Distinguished Professor of Object Systems',
    joinedDate: '2024-04-01',
    enrolledCourseIds: ['c_fullstack_pg'],
    instructorProfile: {
      facultyId: 'FAC-ARCH-09',
      officeHours: 'Thu 3:00 PM - 5:00 PM EST',
      specialization: 'Subtyping, Modular Programming & Microservices',
      assignedCourseIds: ['c_fullstack_pg'],
      pendingEvaluationsCount: 1
    }
  }
];

// SAMPLE INITIAL STUDENT ACCOUNTS (Ananya: Final-Year B.Tech Student)
export const SEED_STUDENTS: User[] = [
  {
    id: 'usr_stu_ananya',
    name: 'Ananya Sharma',
    email: 'ananya@vertexon.ai',
    role: 'STUDENT',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    department: 'Computer Science & Engineering',
    title: 'Final-Year B.Tech Student',
    joinedDate: '2025-08-20',
    enrolledCourseIds: ['c_frontend_dev', 'c_backend_dev', 'c_mern_stack', 'c_dsa_dev'],
    studentProfile: {
      studentRollNumber: 'BTECH-2026-0842',
      phone: '+91 98765 43210',
      year: '4th Year',
      section: 'Section B',
      gpa: 3.88,
      overallScore: 92,
      attendanceRate: 95,
      performanceCategory: 'EXCELLENT',
      missingLessons: [],
      incompleteModules: ['Module 3: Dynamic Programming'],
      failedQuizzes: [],
      pendingAssignments: ['asg_1_frontend'],
      overdueAssignments: [],
      weakTopics: ['Graph Traversals (Dijkstra)', 'React Reconciliation (Fiber)'],
      nextRecommendedAction: {
        priority: 'HIGH',
        title: 'Review DSA Graph Traversals with AI Tutor',
        description: 'Resolve lingering doubts on Dijkstra before the midterm evaluation.',
        actionLink: 'course_player'
      }
    }
  },
  {
    id: 'usr_stu_001',
    name: 'Kandula Hemanth',
    email: 'hemanthchowdarykandhula@gmail.com',
    role: 'STUDENT',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    department: 'Computer Science & Engineering',
    title: 'Undergraduate Senior',
    joinedDate: '2026-10-14',
    enrolledCourseIds: ['c_frontend', 'c_python', 'c_backend', 'c_dsa'],
    studentProfile: {
      studentRollNumber: '23U91A1214',
      phone: '+1 (555) 234-5678',
      year: '3rd Year',
      section: 'Section A',
      gpa: 3.92,
      overallScore: 94,
      attendanceRate: 96,
      performanceCategory: 'EXCELLENT',
      dailyStreak: 1,
      missingLessons: [],
      incompleteModules: [],
      failedQuizzes: [],
      pendingAssignments: ['asg_1_frontend'],
      overdueAssignments: [],
      weakTopics: [],
      nextRecommendedAction: {
        priority: 'NORMAL',
        title: 'Review Accredited Frontend Certificate',
        description: 'Verify your DOM and React competency to complete Frontend Development.',
        actionLink: 'dashboard'
      }
    }
  },
  {
    id: 'usr_stu_002',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@vertexlearn.ai',
    role: 'STUDENT',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=250',
    department: 'Information Technology',
    title: 'Undergraduate Junior',
    joinedDate: '2025-08-22',
    enrolledCourseIds: ['c_frontend_dev', 'c_backend_dev', 'c_dsa'],
    studentProfile: {
      studentRollNumber: 'STU-2026-0412',
      phone: '+1 (555) 987-6543',
      year: '3rd Year',
      section: 'Section B',
      gpa: 2.14,
      overallScore: 38,
      attendanceRate: 64,
      performanceCategory: 'AT_RISK',
      missingLessons: ['Lesson 2.1: Sockets', 'Lesson 3.2: Vectors'],
      incompleteModules: ['Module 3: Vector Databases', 'Module 2: RBAC Middleware'],
      failedQuizzes: ['Quiz 2: pgvector HNSW'],
      pendingAssignments: ['Assignment 4: Database Pooling'],
      overdueAssignments: ['Assignment 1: Retrieval Pipeline'],
      weakTopics: ['JavaScript Functions', 'React Hooks', 'SQL Joins'],
      nextRecommendedAction: {
        priority: 'HIGH',
        title: 'Immediate Remediation: Submit Assignment 1 & Retake Quiz 2',
        description: 'Academic advisor alert triggered. Schedule an office hour with Dr. Elena Vance.',
        actionLink: 'assignments'
      }
    }
  },
  {
    id: 'usr_stu_003',
    name: 'Priya Patel',
    email: 'priya.patel@vertexlearn.ai',
    role: 'STUDENT',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250',
    department: 'Data Science & Analytics',
    title: 'Undergraduate Senior',
    joinedDate: '2025-08-20',
    enrolledCourseIds: ['c_rag_ai', 'c_soc2_compliance'],
    studentProfile: {
      studentRollNumber: 'STU-2026-0219',
      phone: '+1 (555) 432-1098',
      year: '4th Year',
      section: 'Section A',
      gpa: 3.65,
      overallScore: 84,
      attendanceRate: 91,
      performanceCategory: 'GOOD',
      missingLessons: [],
      incompleteModules: ['Module 4: Final Assessment'],
      failedQuizzes: [],
      pendingAssignments: ['Assignment 2: SOC 2 Case Study'],
      overdueAssignments: [],
      weakTopics: ['BM25 Token Inversion'],
      nextRecommendedAction: {
        priority: 'NORMAL',
        title: 'Complete SOC 2 Refresher Exam',
        description: 'Your annual regulatory certification is due within 21 days.',
        actionLink: 'compliance'
      }
    }
  },
  {
    id: 'usr_stu_004',
    name: 'David Kim',
    email: 'david.kim@vertexlearn.ai',
    role: 'STUDENT',
    avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=250',
    department: 'Software Engineering',
    title: 'Undergraduate Sophomore',
    joinedDate: '2025-08-25',
    enrolledCourseIds: ['c_fullstack_pg'],
    studentProfile: {
      studentRollNumber: 'STU-2026-0683',
      phone: '+1 (555) 789-0123',
      year: '2nd Year',
      section: 'Section C',
      gpa: 2.85,
      overallScore: 58,
      attendanceRate: 72,
      performanceCategory: 'NEEDS_IMPROVEMENT',
      missingLessons: ['Lesson 1.3: Middleware'],
      incompleteModules: ['Module 2: Transaction Isolation'],
      failedQuizzes: ['Quiz 1: HTTP Headers'],
      pendingAssignments: ['Assignment 2: JWT Middleware'],
      overdueAssignments: [],
      weakTopics: ['Express Middleware Pipeline', 'JWT Bearer Parsing'],
      nextRecommendedAction: {
        priority: 'HIGH',
        title: 'Review Express Middleware Fundamentals',
        description: 'Complete the guided practice sandbox with the AI Tutor before attempting Quiz 2.',
        actionLink: 'courses'
      }
    }
  },
  {
    id: 'usr_stu_005',
    name: 'Maya Lin',
    email: 'maya.lin@vertexlearn.ai',
    role: 'STUDENT',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
    department: 'Artificial Intelligence',
    title: 'Undergraduate Senior',
    joinedDate: '2025-08-18',
    enrolledCourseIds: ['c_rag_ai', 'c_k8s_microservices'],
    studentProfile: {
      studentRollNumber: 'STU-2026-0042',
      phone: '+1 (555) 345-6789',
      year: '4th Year',
      section: 'Section A',
      gpa: 3.98,
      overallScore: 98,
      attendanceRate: 100,
      performanceCategory: 'EXCELLENT',
      missingLessons: [],
      incompleteModules: [],
      failedQuizzes: [],
      pendingAssignments: [],
      overdueAssignments: [],
      weakTopics: [],
      nextRecommendedAction: {
        priority: 'NORMAL',
        title: 'Explore Advanced Electives: Kubernetes Ingress Controller',
        description: 'All core tracks completed with distinction. Explore elective research papers.',
        actionLink: 'courses'
      }
    }
  }
];

export const INITIAL_COURSES: Course[] = OFFICIAL_COURSES;

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'asg_1_frontend',
    courseId: 'c_frontend_dev',
    courseTitle: 'Frontend Development',
    instructorId: 'usr_inst_001',
    title: 'Assignment 1: Responsive DOM & React Component Lifecycle',
    description: 'Implement a high-performance React component tree utilizing modern DOM event listeners, memoization hooks, and Core Web Vitals optimization.',
    dueDate: '2026-10-18',
    maxScore: 100,
    allowAutomatedGrading: true,
    instructions: 'Upload your React component code (.tsx, .jsx). Automated unit tests and accessibility linters will evaluate your solution.',
    allowedFileTypes: ['.ts', '.tsx', '.js', '.jsx'],
    maxFileSizeMb: 25,
    rubrics: [
      { criterion: 'Component Hierarchy & State Management', maxPoints: 40, description: 'Clean decomposition without unnecessary re-renders.' },
      { criterion: 'DOM Accessibility (ARIA) & Semantic Tags', maxPoints: 30, description: 'Meets WCAG 2.2 AA accessibility guidelines.' },
      { criterion: 'Event Listener Cleanup & Performance', maxPoints: 30, description: 'Zero memory leaks from passive window resize/scroll listeners.' }
    ]
  },
  {
    id: 'asg_2_dsa',
    courseId: 'c_dsa',
    courseTitle: 'Data Structures and Algorithms',
    instructorId: 'usr_inst_008',
    title: 'Assignment 2: Graph Traversal & Dijkstra Shortest Path Implementation',
    description: 'Construct an adjacency list graph representation and implement Dijkstra shortest path with an indexed min-heap priority queue.',
    dueDate: '2026-10-25',
    maxScore: 100,
    allowAutomatedGrading: true,
    instructions: 'Provide either a TypeScript or Python code solution. Automated test harnesses evaluate time complexity on 50,000-node graphs.',
    allowedFileTypes: ['.ts', '.js', '.py'],
    maxFileSizeMb: 10,
    rubrics: [
      { criterion: 'Algorithmic Correctness', maxPoints: 40, description: 'Correct shortest path distance on non-negative weighted graphs.' },
      { criterion: 'Time Complexity: O((V + E) log V)', maxPoints: 35, description: 'Priority queue avoids linear scans for min distance.' },
      { criterion: 'Edge Case Handling (Disconnected Components)', maxPoints: 25, description: 'Handles unreachable nodes and single-node graphs gracefully.' }
    ]
  }
];

export const INITIAL_SUBMISSIONS: Submission[] = [
  {
    id: 'sub_1',
    assignmentId: 'asg_1_frontend',
    courseId: 'c_frontend_dev',
    studentId: 'usr_stu_001',
    studentName: 'Kandula Hemanth',
    studentRollNumber: '23U91A1214',
    studentAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    submittedAt: '2026-10-04 14:32',
    fileName: 'frontend_dom_lifecycle.tsx',
    fileSize: '4.2 KB',
    codeSnippet: `export function ResponsiveDataGrid({ items, filter }: { items: Item[]; filter: string }) {
  const filtered = useMemo(() => items.filter(i => i.title.includes(filter)), [items, filter]);
  return (
    <ul role="list" className="divide-y divide-[#E5E7EB]">
      {filtered.map(item => (
        <li key={item.id} role="listitem" className="p-3 hover:bg-[#F9FAFB]">
          <span className="font-semibold text-[#1F2937]">{item.title}</span>
        </li>
      ))}
    </ul>
  );
}`,
    status: 'graded',
    score: 98,
    feedback: 'Outstanding frontend submission! Perfect ARIA role semantics, useMemo optimization, and clean component decoupling.',
    evaluatorName: 'Dr. Elena Vance (Automated Test Harness)',
    evaluatedAt: '2026-10-04 14:34',
    automatedCheckResults: [
      { testName: 'Test 1: Semantic HTML5 Element Validation', passed: true, output: 'Verified role="list" and role="listitem" semantics' },
      { testName: 'Test 2: Re-render Benchmark (<2ms under 10k items)', passed: true, output: 'useMemo benchmark passed in 1.2ms' },
      { testName: 'Test 3: WCAG 2.2 AA Contrast Ratio', passed: true, output: 'Contrast ratio 7.4:1 exceeds AA threshold' },
      { testName: 'Test 4: Keyboard Navigation & Focus Rings', passed: true, output: 'Focus traversal verified without traps' }
    ]
  }
];

export const INITIAL_ATTENDANCE_SESSIONS: AttendanceSession[] = [
  {
    id: 'att_sess_01',
    courseId: 'c_frontend_dev',
    courseTitle: 'Frontend Development',
    instructorId: 'usr_inst_001',
    instructorName: 'Dr. Elena Vance',
    date: '2026-10-05',
    startTime: '11:00 AM',
    endTime: '12:30 PM',
    topic: 'Lecture 1: Modern DOM Architecture & Core Web Vitals',
    qrToken: 'TOKEN-VTX-ATT-889104',
    tokenExpiresAt: '12:30 PM',
    isActive: true
  }
];

export const INITIAL_ATTENDANCE_RECORDS: AttendanceRecord[] = [
  {
    id: 'att_rec_01',
    sessionId: 'att_sess_01',
    courseId: 'c_frontend_dev',
    courseTitle: 'Frontend Development',
    studentId: 'usr_stu_001',
    studentName: 'Kandula Hemanth',
    date: '2026-10-05',
    timeSlot: '11:00 AM - 12:30 PM',
    topic: 'Lecture 1: Modern DOM Architecture & Core Web Vitals',
    status: 'PRESENT',
    checkInMethod: 'QR Code',
    checkInTime: '11:02 AM'
  },
  {
    id: 'att_rec_02',
    sessionId: 'att_sess_01',
    courseId: 'c_frontend_dev',
    courseTitle: 'Frontend Development',
    studentId: 'usr_stu_002',
    studentName: 'Rahul Sharma',
    date: '2026-10-05',
    timeSlot: '11:00 AM - 12:30 PM',
    topic: 'Lecture 1: Modern DOM Architecture & Core Web Vitals',
    status: 'ABSENT',
    checkInMethod: 'Manual'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log_001',
    userId: 'usr_admin_001',
    userName: 'Marcus Brody',
    userRole: 'ADMIN',
    action: 'LOGIN',
    timestamp: '2026-10-05 08:00:12',
    ipAddress: '192.168.1.104',
    details: 'Administrator session authenticated via secure credentials challenge'
  },
  {
    id: 'log_002',
    userId: 'usr_inst_001',
    userName: 'Dr. Elena Vance',
    userRole: 'INSTRUCTOR',
    action: 'COURSE_UPDATED',
    timestamp: '2026-10-05 08:15:33',
    ipAddress: '10.0.4.12',
    details: 'Updated module rubric thresholds for c_rag_ai'
  },
  {
    id: 'log_003',
    userId: 'usr_stu_001',
    userName: 'Kandula Hemanth',
    userRole: 'STUDENT',
    action: 'ASSIGNMENT_SUBMITTED',
    timestamp: '2026-10-04 14:32:05',
    ipAddress: '172.16.8.99',
    details: 'Submitted source code archive for Assignment 1 (Auto-evaluated score: 96/100)'
  },
  {
    id: 'log_004',
    userId: 'usr_stu_001',
    userName: 'Kandula Hemanth',
    userRole: 'STUDENT',
    action: 'ATTENDANCE_MARKED',
    timestamp: '2026-10-05 11:02:18',
    ipAddress: '172.16.8.99',
    details: 'Checked into session att_sess_01 via dynamic QR cryptographic beacon'
  }
];

export const INITIAL_CHANNELS: ChatChannel[] = [
  {
    id: 'ch_announcements',
    name: 'announcements-all',
    description: 'Official university announcements, academic schedules, and registrar notices.',
    unreadCount: 1
  },
  {
    id: 'ch_rag_cohort',
    name: 'ai-rag-cohort-2026',
    description: 'Technical discussions on embeddings, pgvector, and LLM inference pipelines.',
    unreadCount: 2
  },
  {
    id: 'ch_fullstack_help',
    name: 'fullstack-dev-support',
    description: 'Peer coding assistance, assignment clarifications, and Node.js best practices.',
    unreadCount: 0
  }
];

export const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg_1',
    senderId: 'usr_inst_001',
    senderName: 'Dr. Elena Vance',
    senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
    senderRole: 'INSTRUCTOR',
    text: 'Welcome everyone to the fall semester! Please note that the automated test harness runs continuously for Assignment 1. Ensure your vector index operator matches the cosine distance specification (<=>).',
    timestamp: 'Today at 08:30 AM',
    channelId: 'ch_rag_cohort'
  },
  {
    id: 'msg_2',
    senderId: 'usr_stu_001',
    senderName: 'Kandula Hemanth',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    senderRole: 'STUDENT',
    text: 'Thanks Dr. Vance! The automated grading suite verified my submission in under 2 seconds. The ef_search benchmark held under 4ms.',
    timestamp: 'Today at 09:12 AM',
    channelId: 'ch_rag_cohort'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_1',
    title: 'Assignment Graded: Vector Search Pipeline',
    message: 'Your submission scored 96/100. Automated tests: 4/4 passed. Zero cross-tenant leaks.',
    type: 'grade',
    timestamp: '15 minutes ago',
    read: false,
    linkAction: 'assignments'
  },
  {
    id: 'notif_2',
    title: 'Attendance Confirmed via QR Token',
    message: 'Verified present for "pgvector HNSW Tuning & Realtime Benchmarking" at 11:02 AM.',
    type: 'attendance',
    timestamp: '2 hours ago',
    read: false,
    linkAction: 'attendance'
  }
];

export const INITIAL_CERTIFICATES: ComplianceCertificate[] = [
  {
    id: 'cert_fe_2026',
    certificateNumber: 'VXAI-FE-2026-00412',
    courseId: 'c_frontend',
    courseTitle: 'Frontend Development',
    studentId: 'usr_stu_1791984755232',
    studentName: 'Kandula Hemanth',
    issuedAt: '2026-10-14',
    expiresAt: '2028-10-14',
    status: 'active',
    issuer: 'VertexLearn AI Corporate Accreditation Directorate',
    signatureUrl: 'Dr. Priya Sharma & Rahul Verma'
  }
];

export const INITIAL_CLOUD_FILES: CloudFile[] = [
  {
    id: 'file_1',
    name: 'pgvector_hnsw_production_benchmarks_2026.pdf',
    bucket: 'courses',
    size: '3.8 MB',
    sizeBytes: 3984588,
    uploadedBy: 'Dr. Elena Vance',
    uploadedAt: '2026-10-01 10:14',
    mimeType: 'application/pdf',
    virusScanStatus: 'Clean',
    sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
  },
  {
    id: 'file_2',
    name: 'enterprise_rag_sim_v2.4.zip',
    bucket: 'scorm',
    size: '14.2 MB',
    sizeBytes: 14889779,
    uploadedBy: 'Dr. Elena Vance',
    uploadedAt: '2026-09-28 16:30',
    mimeType: 'application/zip',
    virusScanStatus: 'Clean',
    sha256Hash: 'a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e'
  }
];
