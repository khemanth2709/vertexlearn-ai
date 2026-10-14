export type UserRole = 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';

export type ThemeMode = 'dark' | 'light';

export type PerformanceCategory = 'EXCELLENT' | 'GOOD' | 'NEEDS_IMPROVEMENT' | 'AT_RISK';

export interface StudentProfile {
  studentRollNumber: string; // e.g. STU-2026-0104
  phone: string;
  year: '1st Year' | '2nd Year' | '3rd Year' | '4th Year';
  section: string; // e.g. "Section A"
  gpa: number; // e.g. 3.82
  overallScore: number; // e.g. 92
  attendanceRate: number; // e.g. 96%
  performanceCategory: PerformanceCategory;
  missingLessons: string[];
  incompleteModules: string[];
  failedQuizzes: string[];
  pendingAssignments: string[];
  overdueAssignments: string[];
  weakTopics: string[];
  nextRecommendedAction: {
    priority: 'HIGH' | 'MEDIUM' | 'NORMAL';
    title: string;
    description: string;
    actionLink: string;
  };
}

export interface InstructorProfile {
  facultyId: string; // e.g. FAC-2026-09
  officeHours: string;
  specialization: string;
  assignedCourseIds: string[];
  pendingEvaluationsCount: number;
}

export interface User {
  id: string; // UUID
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  department: string;
  title: string;
  joinedDate: string;
  studentProfile?: StudentProfile;
  instructorProfile?: InstructorProfile;
  enrolledCourseIds: string[];
}

export type ModuleType = 'video' | 'pdf' | 'scorm_xapi' | 'quiz' | 'interactive';

export type QuestionType = 'MCQ' | 'MULTIPLE_SELECT' | 'TRUE_FALSE' | 'SHORT_ANSWER';

export interface QuizQuestion {
  id: string;
  question: string;
  type: QuestionType;
  options?: string[]; // for MCQ, Multiple Select, True/False
  correctAnswer?: number | number[]; // index of options
  shortAnswerKeywords?: string[]; // for subjective grading hint
  points: number;
  explanation: string;
  isSubjective?: boolean;
}

export interface CourseModule {
  id: string;
  title: string;
  type: ModuleType;
  duration: string;
  description?: string;
  url?: string;
  resourceUrl?: string;
  resourceType?: 'video' | 'article' | 'external_link' | 'document';
  content?: string;
  scormPackageName?: string;
  questions?: QuizQuestion[];
  passingScore?: number; // e.g. 75%
}

export interface Course {
  id: string;
  title: string;
  code: string;
  description: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  thumbnail: string;
  instructorId: string;
  instructorName: string;
  instructorTitle: string;
  estimatedHours: number;
  modules: CourseModule[];
  tags: string[];
  isComplianceCourse?: boolean;
  complianceValidityMonths?: number;
  enrolledCount: number;
  referenceUrl?: string;
  rating?: number;
}

export interface ModuleProgress {
  completed: boolean;
  timestamp: number; // in seconds
  score?: number;
  passed?: boolean;
  completedAt?: string;
}

export interface AssignmentRubric {
  criterion: string;
  maxPoints: number;
  description: string;
}

export interface Assignment {
  id: string;
  courseId: string;
  courseTitle: string;
  instructorId: string;
  title: string;
  description: string;
  dueDate: string;
  maxScore: number;
  rubrics: AssignmentRubric[];
  allowAutomatedGrading: boolean;
  instructions: string;
  allowedFileTypes: string[];
  maxFileSizeMb: number;
}

export interface Submission {
  id: string;
  assignmentId: string;
  courseId: string;
  studentId: string;
  studentName: string;
  studentAvatar: string;
  studentRollNumber: string;
  submittedAt: string;
  fileName?: string;
  fileSize?: string;
  fileUrl?: string;
  codeSnippet?: string;
  notes?: string;
  status: 'submitted' | 'grading_in_progress' | 'graded';
  score?: number;
  feedback?: string;
  evaluatorName?: string;
  evaluatedAt?: string;
  automatedCheckResults?: {
    testName: string;
    passed: boolean;
    output: string;
  }[];
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  moduleId: string;
  courseId: string;
  studentId: string;
  studentName: string;
  startTime: string;
  endTime: string;
  selectedAnswers: Record<string, any>;
  score: number;
  percentage: number;
  status: 'PENDING_EVALUATION' | 'EVALUATED';
  hasSubjectiveAnswers: boolean;
  earnedPoints: number;
  totalPoints: number;
}

export interface AttendanceRecord {
  id: string;
  sessionId: string;
  courseId: string;
  courseTitle: string;
  studentId: string;
  studentName: string;
  date: string;
  timeSlot: string;
  topic: string;
  status: 'PRESENT' | 'LATE' | 'ABSENT' | 'EXCUSED';
  checkInMethod: 'QR Code' | 'Manual' | 'Facial Verified' | 'GPS Location';
  checkInTime?: string;
}

export interface AttendanceSession {
  id: string;
  courseId: string;
  courseTitle: string;
  instructorId: string;
  instructorName: string;
  date: string;
  startTime: string;
  endTime: string;
  topic: string;
  qrToken: string;
  tokenExpiresAt: string;
  isActive: boolean;
}

export interface ComplianceCertificate {
  id: string;
  certificateNumber: string;
  courseId: string;
  courseTitle: string;
  studentId: string;
  studentName: string;
  issuedAt: string;
  expiresAt: string;
  status: 'active' | 'expiring_soon' | 'expired';
  issuer: string;
  signatureUrl?: string;
}

export interface CloudFile {
  id: string;
  name: string;
  bucket: 'courses' | 'assignments' | 'submissions' | 'certificates' | 'profiles' | 'scorm';
  size: string;
  sizeBytes: number;
  uploadedBy: string;
  uploadedAt: string;
  mimeType: string;
  virusScanStatus: 'Clean' | 'Scanning' | 'Quarantined';
  sha256Hash: string;
  s3Url?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderRole: UserRole;
  text: string;
  timestamp: string;
  channelId?: string;
  recipientId?: string;
  attachmentName?: string;
}

export interface ChatChannel {
  id: string;
  name: string;
  description: string;
  unreadCount: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'assignment' | 'grade' | 'compliance' | 'attendance' | 'announcement';
  timestamp: string;
  read: boolean;
  linkAction?: string;
}

export type AuditAction = 
  | 'LOGIN'
  | 'LOGOUT'
  | 'REGISTRATION'
  | 'PASSWORD_RESET'
  | 'SECURITY_403_FORBIDDEN'
  | 'COURSE_CREATED'
  | 'COURSE_UPDATED'
  | 'QUIZ_CREATED'
  | 'QUIZ_SUBMITTED'
  | 'ASSIGNMENT_SUBMITTED'
  | 'GRADE_UPDATED'
  | 'ATTENDANCE_MARKED'
  | 'FILE_UPLOADED'
  | 'USER_CREATED'
  | 'USER_DISABLED'
  | 'AI_TUTOR_INTERACTION';

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: AuditAction;
  timestamp: string;
  ipAddress: string;
  details: string;
}

export type AITutorMode = 'study' | 'homework' | 'exam' | 'review';

export interface UseCaseItem {
  id: string;
  domain: string;
  actor: string;
  title: string;
  description: string;
  implemented: boolean;
  status: 'VERIFIED' | 'PASS' | 'ACTIVE';
}

export interface TestCaseItem {
  id: string;
  domain: string;
  scenario: string;
  expected: string;
  status: 'PASSED' | 'RUNNING' | 'PENDING';
  latencyMs?: number;
}

// ==========================================
// Next-Generation Expansion Features Types
// ==========================================

// 1. Collaborative Study Rooms & WebRTC
export interface StudyRoomParticipant {
  id: string;
  name: string;
  role: UserRole;
  avatar: string;
  isMuted: boolean;
  isVideoOn: boolean;
  isHandRaised: boolean;
  isScreenSharing: boolean;
  podId?: string; // Breakout pod
  joinedAt: string;
}

export interface BreakoutPod {
  id: string;
  name: string;
  topic: string;
  participantIds: string[];
  maxCapacity: number;
}

export interface WhiteboardElement {
  id: string;
  type: 'pencil' | 'rect' | 'circle' | 'line' | 'text';
  points?: { x: number; y: number }[];
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  color: string;
  strokeWidth: number;
  text?: string;
}

export interface StudyRoom {
  id: string;
  title: string;
  courseId: string;
  courseTitle: string;
  hostName: string;
  hostId: string;
  participants: StudyRoomParticipant[];
  breakoutPods: BreakoutPod[];
  whiteboardElements: WhiteboardElement[];
  isRecording: boolean;
  createdAt: string;
}

// 2. AI Plagiarism & Code Similarity Engine
export interface TokenMatchRange {
  studentSnippet: string;
  sourceSnippet: string;
  studentLineStart: number;
  studentLineEnd: number;
  sourceLineStart: number;
  sourceLineEnd: number;
  matchPercentage: number;
}

export interface PlagiarismReport {
  id: string;
  submissionId: string;
  studentName: string;
  assignmentTitle: string;
  language: 'python' | 'javascript' | 'text';
  overallSimilarityPercent: number; // 0 - 100
  astStructuralScore: number; // 0 - 100 AST isomorphism
  embeddingCosineDistance: number; // 0 - 1.0
  matchedSource: {
    sourceType: 'PEER_SUBMISSION' | 'HISTORICAL_CORPUS' | 'ONLINE_REPOSITORY';
    title: string;
    authorOrUrl: string;
    cohortYear: string;
  };
  tokenMatches: TokenMatchRange[];
  astNotes: string[];
  status: 'FLAGGED' | 'CLEARED' | 'UNDER_REVIEW' | 'REWORK_REQUESTED';
  evaluatedAt: string;
}

// 3. Mobile PWA & Offline Sync
export interface OfflineCachedItem {
  id: string;
  title: string;
  courseTitle: string;
  type: 'video_lecture' | 'pdf_slides' | 'coding_lab' | 'flashcards';
  sizeBytes: number;
  cachedAt: string;
  isAvailableOffline: boolean;
  offlineProgressPercent: number;
}

export interface PendingSyncItem {
  id: string;
  type: 'QUIZ_SUBMISSION' | 'CODE_RUN_LOG' | 'STUDY_NOTE' | 'ATTENDANCE_CHECKIN';
  payload: Record<string, any>;
  createdOfflineAt: string;
  synced: boolean;
}

// 4. Monetization & Subscriptions
export interface SubscriptionPlan {
  id: string;
  name: string;
  priceUSD: number;
  billingInterval: 'month' | 'year';
  description: string;
  features: string[];
  popular?: boolean;
}

export interface CouponCode {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  maxUses: number;
  usedCount: number;
  validUntil: string;
  active: boolean;
}

export interface InstructorPayoutRecord {
  id: string;
  instructorId: string;
  period: string;
  grossSales: number;
  platformCutPercent: number;
  instructorSharePercent: number;
  netPayoutAmount: number;
  status: 'PAID' | 'PROCESSING' | 'PENDING';
  transferMethod: string;
  processedAt: string;
}

// 5. Voice Tutor Interaction
export interface VoiceTutorSettings {
  voiceLocale: 'en-US' | 'en-GB' | 'en-IN' | 'es-ES' | 'fr-FR';
  speechRate: number; // 0.8 to 1.5
  speechPitch: number; // 0.8 to 1.2
  autoReadResponses: boolean;
  continuousListening: boolean;
}

// 6. Predictive At-Risk Student Analytics
export interface StudentTelemetrySignal {
  studentId: string;
  studentName: string;
  rollNumber: string;
  avatar: string;
  department: string;
  year: string;
  riskScore: number; // 0 - 100
  riskTier: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  factors: {
    inactivityDays: number;
    videoDropOffRatePercent: number;
    failedQuizCount: number;
    lateSubmissionCount: number;
    forumParticipationScore: number;
  };
  suggestedInterventions: string[];
  advisorFlagged: boolean;
  remediationAssigned: boolean;
}
