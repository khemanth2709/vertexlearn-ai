export interface DDLTable {
  name: string;
  category: 'USERS & AUTH' | 'COURSES' | 'ENROLLMENT & PROGRESS' | 'ASSIGNMENTS' | 'QUIZZES' | 'GAMIFICATION' | 'AI TUTOR & VECTOR STORE' | 'RECOMMENDATIONS' | 'DISCUSSIONS & COMMS' | 'ADMIN & GOVERNANCE';
  description: string;
  columnsCount: number;
  primaryKey: string;
  foreignKeys: string[];
  ddl: string;
  sampleRowsCount: number;
  sampleData: Array<Record<string, any>>;
}

export const POSTGRESQL_CORE_TABLES: DDLTable[] = [
  // USERS & AUTH
  {
    name: 'users',
    category: 'USERS & AUTH',
    description: 'System of record for platform identity, authentication, profile metadata, and active state across all tenants.',
    columnsCount: 8,
    primaryKey: 'id UUID (gen_random_uuid())',
    foreignKeys: [],
    ddl: `CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(180) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);`,
    sampleRowsCount: 1845,
    sampleData: [
      { id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479', full_name: 'Ananya Sharma', email: 'ananya@student.vertexon.ai', password_hash: '$2b$12$e8Y...[argon2]', is_active: true, created_at: '2024-01-15T09:00:00Z' },
      { id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d', full_name: 'Rohit Verma', email: 'rohit@vertexon.ai', password_hash: '$2b$12$q7W...[argon2]', is_active: true, created_at: '2023-08-01T10:30:00Z' },
      { id: '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed', full_name: 'Meera Patel', email: 'meera@vertexon.ai', password_hash: '$2b$12$k1M...[argon2]', is_active: true, created_at: '2023-01-10T08:15:00Z' }
    ]
  },
  {
    name: 'roles',
    category: 'USERS & AUTH',
    description: 'Global authority role definitions (student, instructor, admin, ta, auditor).',
    columnsCount: 2,
    primaryKey: 'id SERIAL',
    foreignKeys: [],
    ddl: `CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30) UNIQUE NOT NULL -- student, instructor, admin
);`,
    sampleRowsCount: 5,
    sampleData: [
      { id: 1, name: 'student' },
      { id: 2, name: 'instructor' },
      { id: 3, name: 'admin' },
      { id: 4, name: 'ta' },
      { id: 5, name: 'auditor' }
    ]
  },
  {
    name: 'user_roles',
    category: 'USERS & AUTH',
    description: 'Many-to-many relationship mapping users to designated roles with cascading deletion.',
    columnsCount: 2,
    primaryKey: '(user_id, role_id)',
    foreignKeys: ['user_id -> users(id)', 'role_id -> roles(id)'],
    ddl: `CREATE TABLE user_roles (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role_id INT REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);`,
    sampleRowsCount: 1850,
    sampleData: [
      { user_id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479', role_id: 1 },
      { user_id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d', role_id: 2 },
      { user_id: '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed', role_id: 3 }
    ]
  },

  // COURSES
  {
    name: 'courses',
    category: 'COURSES',
    description: 'Authoritative curriculum catalog with approval status, instructor assignment, and difficulty tiers.',
    columnsCount: 10,
    primaryKey: 'id UUID (gen_random_uuid())',
    foreignKeys: ['instructor_id -> users(id)'],
    ddl: `CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    instructor_id UUID REFERENCES users(id),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(80),
    difficulty VARCHAR(20), -- beginner/intermediate/advanced
    thumbnail_url TEXT,
    price NUMERIC(10,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'pending', -- pending/approved/rejected/archived
    created_at TIMESTAMPTZ DEFAULT now()
);`,
    sampleRowsCount: 11,
    sampleData: [
      { id: 'c001-dsa-dev', instructor_id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d', title: 'DATA STRUCTURES AND ALGORITHMS', difficulty: 'intermediate', category: 'Core CS', price: 0.00, status: 'approved' },
      { id: 'c002-fullstack-mern', instructor_id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d', title: 'FULL STACK USING MERN', difficulty: 'advanced', category: 'Web Development', price: 49.99, status: 'approved' },
      { id: 'c003-py-prog', instructor_id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d', title: 'PYTHON PROGRAMMING', difficulty: 'beginner', category: 'Programming', price: 0.00, status: 'approved' }
    ]
  },
  {
    name: 'modules',
    category: 'COURSES',
    description: 'Ordered structural units / chapters partitioning each course curriculum.',
    columnsCount: 4,
    primaryKey: 'id UUID (gen_random_uuid())',
    foreignKeys: ['course_id -> courses(id) ON DELETE CASCADE'],
    ddl: `CREATE TABLE modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    order_index INT NOT NULL
);`,
    sampleRowsCount: 52,
    sampleData: [
      { id: 'm101-dsa-arrays', course_id: 'c001-dsa-dev', title: 'Module 1: Dynamic Arrays & Two Pointers', order_index: 1 },
      { id: 'm102-dsa-linkedlist', course_id: 'c001-dsa-dev', title: 'Module 2: Singly & Doubly Linked Lists', order_index: 2 },
      { id: 'm103-dsa-trees', course_id: 'c001-dsa-dev', title: 'Module 3: Binary Search Trees & AVL Balancing', order_index: 3 }
    ]
  },
  {
    name: 'lectures',
    category: 'COURSES',
    description: 'Individual video & reading lectures containing full transcripts for RAG chunking and duration metrics.',
    columnsCount: 8,
    primaryKey: 'id UUID (gen_random_uuid())',
    foreignKeys: ['module_id -> modules(id) ON DELETE CASCADE'],
    ddl: `CREATE TABLE lectures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    video_url TEXT,
    transcript TEXT,
    duration_seconds INT,
    order_index INT NOT NULL,
    resource_urls TEXT[] -- PDFs, slides
);`,
    sampleRowsCount: 184,
    sampleData: [
      { id: 'lec-201', module_id: 'm101-dsa-arrays', title: 'Sliding Window Algorithm Deep Dive', duration_seconds: 1840, order_index: 1, resource_urls: ['s3://vertexon/slides/lec201.pdf'] },
      { id: 'lec-202', module_id: 'm101-dsa-arrays', title: 'Prefix Sums and 2D Range Queries', duration_seconds: 2100, order_index: 2, resource_urls: ['s3://vertexon/code/prefix_sum.cpp'] }
    ]
  },

  // ENROLLMENT & PROGRESS
  {
    name: 'enrollments',
    category: 'ENROLLMENT & PROGRESS',
    description: 'Tracks user course subscriptions and real-time aggregate percent completion.',
    columnsCount: 5,
    primaryKey: 'id UUID (gen_random_uuid())',
    foreignKeys: ['user_id -> users(id)', 'course_id -> courses(id)'],
    ddl: `CREATE TABLE enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    course_id UUID REFERENCES courses(id),
    enrolled_at TIMESTAMPTZ DEFAULT now(),
    progress_percent NUMERIC(5,2) DEFAULT 0,
    UNIQUE (user_id, course_id)
);`,
    sampleRowsCount: 4210,
    sampleData: [
      { id: 'enr-901', user_id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479', course_id: 'c001-dsa-dev', enrolled_at: '2024-02-01T00:00:00Z', progress_percent: 78.50 },
      { id: 'enr-902', user_id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479', course_id: 'c002-fullstack-mern', enrolled_at: '2024-02-15T00:00:00Z', progress_percent: 45.00 }
    ]
  },
  {
    name: 'lecture_progress',
    category: 'ENROLLMENT & PROGRESS',
    description: 'Granular video second-level playback position tracking for resume-from-last-position functionality.',
    columnsCount: 6,
    primaryKey: 'id UUID (gen_random_uuid())',
    foreignKeys: ['enrollment_id -> enrollments(id) ON DELETE CASCADE', 'lecture_id -> lectures(id)'],
    ddl: `CREATE TABLE lecture_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    enrollment_id UUID REFERENCES enrollments(id) ON DELETE CASCADE,
    lecture_id UUID REFERENCES lectures(id),
    watched_seconds INT DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE,
    last_watched_at TIMESTAMPTZ
);`,
    sampleRowsCount: 14800,
    sampleData: [
      { id: 'lp-01', enrollment_id: 'enr-901', lecture_id: 'lec-201', watched_seconds: 1840, completed: true, last_watched_at: '2024-03-01T14:22:00Z' },
      { id: 'lp-02', enrollment_id: 'enr-901', lecture_id: 'lec-202', watched_seconds: 640, completed: false, last_watched_at: '2024-03-02T19:10:00Z' }
    ]
  },
  {
    name: 'notes',
    category: 'ENROLLMENT & PROGRESS',
    description: 'Timestamped student annotations tied to lecture playback seconds for contextual revision.',
    columnsCount: 6,
    primaryKey: 'id UUID (gen_random_uuid())',
    foreignKeys: ['user_id -> users(id)', 'lecture_id -> lectures(id)'],
    ddl: `CREATE TABLE notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    lecture_id UUID REFERENCES lectures(id),
    timestamp_seconds INT,
    content TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);`,
    sampleRowsCount: 890,
    sampleData: [
      { id: 'note-01', user_id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479', lecture_id: 'lec-201', timestamp_seconds: 420, content: 'Remember: Two pointers shrink only when sum exceeds target window.', created_at: '2024-03-01T14:10:00Z' }
    ]
  },
  {
    name: 'bookmarks',
    category: 'ENROLLMENT & PROGRESS',
    description: 'Bookmarked lecture moments saved by students for fast one-click review.',
    columnsCount: 5,
    primaryKey: 'id UUID (gen_random_uuid())',
    foreignKeys: ['user_id -> users(id)', 'lecture_id -> lectures(id)'],
    ddl: `CREATE TABLE bookmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    lecture_id UUID REFERENCES lectures(id),
    timestamp_seconds INT,
    created_at TIMESTAMPTZ DEFAULT now()
);`,
    sampleRowsCount: 610,
    sampleData: [
      { id: 'bm-01', user_id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479', lecture_id: 'lec-201', timestamp_seconds: 812, created_at: '2024-03-01T14:15:00Z' }
    ]
  },

  // ASSIGNMENTS
  {
    name: 'assignments',
    category: 'ASSIGNMENTS',
    description: 'Course assignments with structured JSONB grading rubrics and strict submission deadlines.',
    columnsCount: 6,
    primaryKey: 'id UUID (gen_random_uuid())',
    foreignKeys: ['course_id -> courses(id)'],
    ddl: `CREATE TABLE assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES courses(id),
    title VARCHAR(200),
    instructions TEXT,
    rubric JSONB,
    due_date TIMESTAMPTZ
);`,
    sampleRowsCount: 42,
    sampleData: [
      { id: 'asg-301', course_id: 'c001-dsa-dev', title: 'Implement Balanced Red-Black Tree in C++', instructions: 'Implement insert and delete operations with O(log N) rebalancing.', rubric: { correctness: 60, time_complexity: 20, memory_safety: 20 }, due_date: '2024-04-10T23:59:59Z' }
    ]
  },
  {
    name: 'assignment_submissions',
    category: 'ASSIGNMENTS',
    description: 'Student project submissions containing file artifacts, git URLs, grades, and instructor feedback.',
    columnsCount: 7,
    primaryKey: 'id UUID (gen_random_uuid())',
    foreignKeys: ['assignment_id -> assignments(id)', 'user_id -> users(id)'],
    ddl: `CREATE TABLE assignment_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID REFERENCES assignments(id),
    user_id UUID REFERENCES users(id),
    file_url TEXT,
    submitted_at TIMESTAMPTZ DEFAULT now(),
    grade NUMERIC(5,2),
    feedback TEXT
);`,
    sampleRowsCount: 384,
    sampleData: [
      { id: 'sub-401', assignment_id: 'asg-301', user_id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479', file_url: 's3://vertexon/submissions/rb_tree_ananya.cpp', submitted_at: '2024-04-08T18:30:00Z', grade: 96.00, feedback: 'Flawless tree rotations and zero memory leaks.' }
    ]
  },

  // QUIZZES
  {
    name: 'quizzes',
    category: 'QUIZZES',
    description: 'Assessment modules supporting human-authored and AI-generated tests derived from lecture transcripts.',
    columnsCount: 5,
    primaryKey: 'id UUID (gen_random_uuid())',
    foreignKeys: ['module_id -> modules(id)', 'generated_from_lecture_id -> lectures(id)'],
    ddl: `CREATE TABLE quizzes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id UUID REFERENCES modules(id),
    title VARCHAR(200),
    is_ai_generated BOOLEAN DEFAULT FALSE,
    generated_from_lecture_id UUID REFERENCES lectures(id)
);`,
    sampleRowsCount: 78,
    sampleData: [
      { id: 'q-501', module_id: 'm101-dsa-arrays', title: 'Two Pointers & Array Partitioning Mastery', is_ai_generated: true, generated_from_lecture_id: 'lec-201' }
    ]
  },
  {
    name: 'quiz_questions',
    category: 'QUIZZES',
    description: 'Individual assessment questions with MCQ, multi-select, and short-answer support.',
    columnsCount: 5,
    primaryKey: 'id UUID (gen_random_uuid())',
    foreignKeys: ['quiz_id -> quizzes(id) ON DELETE CASCADE'],
    ddl: `CREATE TABLE quiz_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
    question_text TEXT,
    question_type VARCHAR(20), -- mcq/multi_select/short_answer
    order_index INT
);`,
    sampleRowsCount: 390,
    sampleData: [
      { id: 'qq-601', quiz_id: 'q-501', question_text: 'What is the optimal time complexity of the Two-Sum problem on sorted input?', question_type: 'mcq', order_index: 1 }
    ]
  },
  {
    name: 'quiz_options',
    category: 'QUIZZES',
    description: 'Multiple choice options tied to quiz questions with ground-truth correctness flags.',
    columnsCount: 4,
    primaryKey: 'id UUID (gen_random_uuid())',
    foreignKeys: ['question_id -> quiz_questions(id) ON DELETE CASCADE'],
    ddl: `CREATE TABLE quiz_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID REFERENCES quiz_questions(id) ON DELETE CASCADE,
    option_text TEXT,
    is_correct BOOLEAN DEFAULT FALSE
);`,
    sampleRowsCount: 1560,
    sampleData: [
      { id: 'qo-701', question_id: 'qq-601', option_text: 'O(N) time and O(1) auxiliary space', is_correct: true },
      { id: 'qo-702', question_id: 'qq-601', option_text: 'O(N log N) time and O(N) auxiliary space', is_correct: false },
      { id: 'qo-703', question_id: 'qq-601', option_text: 'O(N^2) brute force', is_correct: false }
    ]
  },
  {
    name: 'quiz_attempts',
    category: 'QUIZZES',
    description: 'Historical records of student quiz attempts with timestamp boundaries and normalized scores.',
    columnsCount: 6,
    primaryKey: 'id UUID (gen_random_uuid())',
    foreignKeys: ['quiz_id -> quizzes(id)', 'user_id -> users(id)'],
    ddl: `CREATE TABLE quiz_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID REFERENCES quizzes(id),
    user_id UUID REFERENCES users(id),
    score NUMERIC(5,2),
    started_at TIMESTAMPTZ DEFAULT now(),
    submitted_at TIMESTAMPTZ
);`,
    sampleRowsCount: 1250,
    sampleData: [
      { id: 'qa-801', quiz_id: 'q-501', user_id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479', score: 100.00, started_at: '2024-03-05T10:00:00Z', submitted_at: '2024-03-05T10:14:32Z' }
    ]
  },
  {
    name: 'quiz_answers',
    category: 'QUIZZES',
    description: 'Detailed answer responses for each question inside a quiz attempt with automated evaluation.',
    columnsCount: 6,
    primaryKey: 'id UUID (gen_random_uuid())',
    foreignKeys: ['attempt_id -> quiz_attempts(id) ON DELETE CASCADE', 'question_id -> quiz_questions(id)'],
    ddl: `CREATE TABLE quiz_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attempt_id UUID REFERENCES quiz_attempts(id) ON DELETE CASCADE,
    question_id UUID REFERENCES quiz_questions(id),
    selected_option_ids UUID[],
    text_answer TEXT,
    is_correct BOOLEAN
);`,
    sampleRowsCount: 6250,
    sampleData: [
      { id: 'qans-901', attempt_id: 'qa-801', question_id: 'qq-601', selected_option_ids: ['qo-701'], text_answer: null, is_correct: true }
    ]
  },

  // GAMIFICATION
  {
    name: 'certificates',
    category: 'GAMIFICATION',
    description: 'Verifiable credentials generated upon 100% course completion with cryptographic issuance verification.',
    columnsCount: 5,
    primaryKey: 'id UUID (gen_random_uuid())',
    foreignKeys: ['user_id -> users(id)', 'course_id -> courses(id)'],
    ddl: `CREATE TABLE certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    course_id UUID REFERENCES courses(id),
    certificate_url TEXT,
    issued_at TIMESTAMPTZ DEFAULT now()
);`,
    sampleRowsCount: 420,
    sampleData: [
      { id: 'cert-001', user_id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479', course_id: 'c001-dsa-dev', certificate_url: 'https://vertexon.ai/verify/CERT-DSA-2026-0941', issued_at: '2024-03-10T12:00:00Z' }
    ]
  },
  {
    name: 'badges',
    category: 'GAMIFICATION',
    description: 'Gamification badge taxonomy (First Course Completed, 7-Day Streak, Quiz Perfect Score).',
    columnsCount: 4,
    primaryKey: 'id SERIAL',
    foreignKeys: [],
    ddl: `CREATE TABLE badges (
    id SERIAL PRIMARY KEY,
    name VARCHAR(80),
    description TEXT,
    icon_url TEXT
);`,
    sampleRowsCount: 12,
    sampleData: [
      { id: 1, name: '7-Day Streak', description: 'Maintained active daily learning for 7 consecutive days', icon_url: '/badges/streak-7.svg' },
      { id: 2, name: 'Algorithm Wizard', description: 'Achieved 100% score on all advanced DSA modules', icon_url: '/badges/algo-wizard.svg' },
      { id: 3, name: 'First Course Completed', description: 'Graduated from your first complete curriculum', icon_url: '/badges/first-grad.svg' }
    ]
  },
  {
    name: 'user_badges',
    category: 'GAMIFICATION',
    description: 'User badge unlocks with earn date tracking.',
    columnsCount: 3,
    primaryKey: '(user_id, badge_id)',
    foreignKeys: ['user_id -> users(id)', 'badge_id -> badges(id)'],
    ddl: `CREATE TABLE user_badges (
    user_id UUID REFERENCES users(id),
    badge_id INT REFERENCES badges(id),
    earned_at TIMESTAMPTZ DEFAULT now(),
    PRIMARY KEY (user_id, badge_id)
);`,
    sampleRowsCount: 1680,
    sampleData: [
      { user_id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479', badge_id: 1, earned_at: '2024-02-28T09:12:00Z' },
      { user_id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479', badge_id: 2, earned_at: '2024-03-05T10:15:00Z' }
    ]
  },
  {
    name: 'streaks',
    category: 'GAMIFICATION',
    description: 'Daily active learning streak counter feeding student engagement KPIs and retention incentives.',
    columnsCount: 4,
    primaryKey: 'user_id UUID',
    foreignKeys: ['user_id -> users(id)'],
    ddl: `CREATE TABLE streaks (
    user_id UUID PRIMARY KEY REFERENCES users(id),
    current_streak INT DEFAULT 0,
    longest_streak INT DEFAULT 0,
    last_active_date DATE
);`,
    sampleRowsCount: 1842,
    sampleData: [
      { user_id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479', current_streak: 14, longest_streak: 21, last_active_date: '2026-10-07' }
    ]
  },

  // AI TUTOR & VECTOR STORE (pgvector)
  {
    name: 'ai_chat_sessions',
    category: 'AI TUTOR & VECTOR STORE',
    description: 'Context-aware conversational session state grounded by course ID and explanation mode (beginner / intermediate / advanced).',
    columnsCount: 5,
    primaryKey: 'id UUID (gen_random_uuid())',
    foreignKeys: ['user_id -> users(id)', 'course_id -> courses(id)'],
    ddl: `CREATE TABLE ai_chat_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    course_id UUID REFERENCES courses(id),
    mode VARCHAR(20) DEFAULT 'intermediate',
    created_at TIMESTAMPTZ DEFAULT now()
);`,
    sampleRowsCount: 890,
    sampleData: [
      { id: 'sess-01', user_id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479', course_id: 'c001-dsa-dev', mode: 'intermediate', created_at: '2024-03-01T15:00:00Z' }
    ]
  },
  {
    name: 'ai_chat_messages',
    category: 'AI TUTOR & VECTOR STORE',
    description: 'Chat utterances preserving RAG grounded citations and source lecture UUIDs.',
    columnsCount: 6,
    primaryKey: 'id UUID (gen_random_uuid())',
    foreignKeys: ['session_id -> ai_chat_sessions(id) ON DELETE CASCADE'],
    ddl: `CREATE TABLE ai_chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES ai_chat_sessions(id) ON DELETE CASCADE,
    sender VARCHAR(10), -- user/ai
    content TEXT,
    source_lecture_ids UUID[],
    created_at TIMESTAMPTZ DEFAULT now()
);`,
    sampleRowsCount: 3420,
    sampleData: [
      { id: 'msg-01', session_id: 'sess-01', sender: 'user', content: 'Why do we need a dummy head in a linked list deletion algorithm?', source_lecture_ids: null, created_at: '2024-03-01T15:01:00Z' },
      { id: 'msg-02', session_id: 'sess-01', sender: 'ai', content: 'A dummy head eliminates boundary checks when removing the first element, guaranteeing uniform O(1) node pointer rewrites.', source_lecture_ids: ['lec-201'], created_at: '2024-03-01T15:01:03Z' }
    ]
  },
  {
    name: 'document_chunks',
    category: 'AI TUTOR & VECTOR STORE',
    description: 'pgvector embedding store (1536-dim vector) containing chunked course transcripts for cosine-distance RAG search.',
    columnsCount: 6,
    primaryKey: 'id UUID (gen_random_uuid())',
    foreignKeys: ['course_id -> courses(id)', 'lecture_id -> lectures(id)'],
    ddl: `CREATE EXTENSION IF NOT EXISTS vector;
 
CREATE TABLE document_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES courses(id),
    lecture_id UUID REFERENCES lectures(id),
    chunk_text TEXT,
    embedding VECTOR(1536),
    created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX ON document_chunks USING ivfflat (embedding vector_cosine_ops);`,
    sampleRowsCount: 18450,
    sampleData: [
      { id: 'chunk-001', course_id: 'c001-dsa-dev', lecture_id: 'lec-201', chunk_text: 'Two-pointer sliding window operates in O(N) by expanding the right pointer and contracting left pointer...', embedding: '[0.0142, -0.0381, 0.0891, ... 1536 dimensions]', created_at: '2024-01-20T00:00:00Z' }
    ]
  },

  // RECOMMENDATIONS & STUDY PLANS
  {
    name: 'study_plans',
    category: 'RECOMMENDATIONS',
    description: 'Dynamic personalized schedules created from student weak-topic areas and quiz performance.',
    columnsCount: 5,
    primaryKey: 'id UUID (gen_random_uuid())',
    foreignKeys: ['user_id -> users(id)', 'course_id -> courses(id)'],
    ddl: `CREATE TABLE study_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    course_id UUID REFERENCES courses(id),
    plan_json JSONB,
    generated_at TIMESTAMPTZ DEFAULT now()
);`,
    sampleRowsCount: 620,
    sampleData: [
      { id: 'sp-01', user_id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479', course_id: 'c001-dsa-dev', plan_json: { targetDays: 14, weakAreas: ['Graph BFS', 'Dynamic Programming Memoization'], dailyMinutes: 45 }, generated_at: '2024-03-01T08:00:00Z' }
    ]
  },
  {
    name: 'flashcards',
    category: 'RECOMMENDATIONS',
    description: 'AI-generated Q/A revision cards per module for spaced active recall.',
    columnsCount: 4,
    primaryKey: 'id UUID (gen_random_uuid())',
    foreignKeys: ['module_id -> modules(id)'],
    ddl: `CREATE TABLE flashcards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id UUID REFERENCES modules(id),
    question TEXT,
    answer TEXT
);`,
    sampleRowsCount: 260,
    sampleData: [
      { id: 'fc-01', module_id: 'm101-dsa-arrays', question: 'What is the auxiliary space of Merge Sort vs Quick Sort in standard arrays?', answer: 'Merge Sort requires O(N) auxiliary array space; Quick Sort requires O(log N) stack recursion space.' }
    ]
  },
  {
    name: 'recommendations',
    category: 'RECOMMENDATIONS',
    description: 'Rule-based and embedding similarity suggestions steering learners to optimal next curriculums.',
    columnsCount: 6,
    primaryKey: 'id UUID (gen_random_uuid())',
    foreignKeys: ['user_id -> users(id)', 'recommended_course_id -> courses(id)'],
    ddl: `CREATE TABLE recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    recommended_course_id UUID REFERENCES courses(id),
    reason TEXT,
    score NUMERIC(5,2),
    created_at TIMESTAMPTZ DEFAULT now()
);`,
    sampleRowsCount: 1420,
    sampleData: [
      { id: 'rec-01', user_id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479', recommended_course_id: 'c002-fullstack-mern', reason: 'High performance in Java and Algorithms unlocks full stack engineering pathways.', score: 0.94, created_at: '2024-03-04T00:00:00Z' }
    ]
  },

  // DISCUSSIONS, ANNOUNCEMENTS, NOTIFICATIONS
  {
    name: 'discussion_threads',
    category: 'DISCUSSIONS & COMMS',
    description: 'Course-specific threaded forums for student and instructor discourse.',
    columnsCount: 5,
    primaryKey: 'id UUID (gen_random_uuid())',
    foreignKeys: ['course_id -> courses(id)', 'created_by -> users(id)'],
    ddl: `CREATE TABLE discussion_threads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES courses(id),
    created_by UUID REFERENCES users(id),
    title VARCHAR(200),
    created_at TIMESTAMPTZ DEFAULT now()
);`,
    sampleRowsCount: 310,
    sampleData: [
      { id: 'dt-01', course_id: 'c001-dsa-dev', created_by: 'f47ac10b-58cc-4372-a567-0e02b2c3d479', title: 'Kadane algorithm handling all-negative integer arrays', created_at: '2024-03-02T11:00:00Z' }
    ]
  },
  {
    name: 'discussion_posts',
    category: 'DISCUSSIONS & COMMS',
    description: 'Granular replies within discussion threads with moderation flag capabilities.',
    columnsCount: 6,
    primaryKey: 'id UUID (gen_random_uuid())',
    foreignKeys: ['thread_id -> discussion_threads(id) ON DELETE CASCADE', 'user_id -> users(id)'],
    ddl: `CREATE TABLE discussion_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    thread_id UUID REFERENCES discussion_threads(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    content TEXT,
    is_flagged BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT now()
);`,
    sampleRowsCount: 1420,
    sampleData: [
      { id: 'dp-01', thread_id: 'dt-01', user_id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d', content: 'Initialize max_so_far to arr[0] instead of 0 to safely capture the largest single negative value.', is_flagged: false, created_at: '2024-03-02T11:15:00Z' }
    ]
  },
  {
    name: 'announcements',
    category: 'DISCUSSIONS & COMMS',
    description: 'Broadcast notices published by course instructors visible to all enrolled learners.',
    columnsCount: 5,
    primaryKey: 'id UUID (gen_random_uuid())',
    foreignKeys: ['course_id -> courses(id)', 'posted_by -> users(id)'],
    ddl: `CREATE TABLE announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES courses(id),
    posted_by UUID REFERENCES users(id),
    content TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);`,
    sampleRowsCount: 85,
    sampleData: [
      { id: 'ann-01', course_id: 'c001-dsa-dev', posted_by: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d', content: 'Live doubt clarification clinic this Thursday 7:00 PM IST on binary search trees.', created_at: '2024-03-01T09:00:00Z' }
    ]
  },
  {
    name: 'notifications',
    category: 'DISCUSSIONS & COMMS',
    description: 'In-app real-time alerts across assignments, grading, certificates, and system notices.',
    columnsCount: 6,
    primaryKey: 'id UUID (gen_random_uuid())',
    foreignKeys: ['user_id -> users(id)'],
    ddl: `CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    title VARCHAR(150),
    body TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT now()
);`,
    sampleRowsCount: 4500,
    sampleData: [
      { id: 'notif-01', user_id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479', title: 'Assignment Evaluated', body: 'Red-Black Tree submission awarded 96/100 by Rohit Verma.', is_read: false, created_at: '2024-04-09T10:00:00Z' }
    ]
  },

  // ADMIN / GOVERNANCE
  {
    name: 'course_approvals',
    category: 'ADMIN & GOVERNANCE',
    description: 'Audit trail of platform admin course review decisions (pending, approved, rejected) with rationale.',
    columnsCount: 6,
    primaryKey: 'id UUID (gen_random_uuid())',
    foreignKeys: ['course_id -> courses(id)', 'reviewed_by -> users(id)'],
    ddl: `CREATE TABLE course_approvals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES courses(id),
    reviewed_by UUID REFERENCES users(id),
    decision VARCHAR(20), -- approved/rejected
    comment TEXT,
    reviewed_at TIMESTAMPTZ DEFAULT now()
);`,
    sampleRowsCount: 38,
    sampleData: [
      { id: 'appr-01', course_id: 'c001-dsa-dev', reviewed_by: '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed', decision: 'approved', comment: 'Meets high pedagogical standard and complete GeeksforGeeks curriculum grounding.', reviewed_at: '2024-01-18T14:00:00Z' }
    ]
  },
  {
    name: 'payments',
    category: 'ADMIN & GOVERNANCE',
    description: 'Financial ledger recording course enrollments, subscription fees, and transaction states.',
    columnsCount: 6,
    primaryKey: 'id UUID (gen_random_uuid())',
    foreignKeys: ['user_id -> users(id)', 'course_id -> courses(id)'],
    ddl: `CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    course_id UUID REFERENCES courses(id),
    amount NUMERIC(10,2),
    status VARCHAR(20), -- success/failed/refunded
    created_at TIMESTAMPTZ DEFAULT now()
);`,
    sampleRowsCount: 1840,
    sampleData: [
      { id: 'pay-01', user_id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479', course_id: 'c002-fullstack-mern', amount: 49.99, status: 'success', created_at: '2024-02-15T12:00:00Z' }
    ]
  },
  {
    name: 'audit_logs',
    category: 'ADMIN & GOVERNANCE',
    description: 'Append-only regulatory and security audit trail capturing all user actions, logins, and permission changes.',
    columnsCount: 7,
    primaryKey: 'id UUID (gen_random_uuid())',
    foreignKeys: ['actor_id -> users(id)'],
    ddl: `CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES users(id),
    action VARCHAR(100),
    entity VARCHAR(50),
    entity_id UUID,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);`,
    sampleRowsCount: 8400,
    sampleData: [
      { id: 'aud-01', actor_id: '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed', action: 'COURSE_APPROVED', entity: 'courses', entity_id: 'c001-dsa-dev', metadata: { reviewer: 'Meera Patel', status: 'approved' }, created_at: '2024-01-18T14:00:00Z' }
    ]
  },
  {
    name: 'attendance_records',
    category: 'ENROLLMENT & PROGRESS',
    description: 'Cryptographic attendance check-ins with unique composite constraint (session_id, student_id) preventing concurrent race conditions and duplicate logs.',
    columnsCount: 7,
    primaryKey: 'id UUID (gen_random_uuid())',
    foreignKeys: ['student_id -> users(id) ON DELETE CASCADE'],
    ddl: `CREATE TABLE attendance_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id VARCHAR(100) NOT NULL,
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id VARCHAR(100) NOT NULL,
    status VARCHAR(20) DEFAULT 'present',
    verified_at TIMESTAMPTZ DEFAULT now(),
    ip_address INET,
    CONSTRAINT uq_session_student UNIQUE (session_id, student_id)
);
CREATE INDEX idx_attendance_student ON attendance_records (student_id);
CREATE INDEX idx_attendance_session ON attendance_records (session_id);`,
    sampleRowsCount: 1420,
    sampleData: [
      { id: 'att-rec-01', session_id: 'att_001', student_id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479', course_id: 'c001-dsa-dev', status: 'present', verified_at: '2026-10-09T09:05:00Z', ip_address: '192.168.1.45' }
    ]
  }
];

export const INDEXING_STRATEGY = [
  {
    type: 'B-tree Foreign Key Indexes & Cascades',
    target: 'All Foreign Keys (user_id, course_id, module_id, lecture_id)',
    definition: 'CREATE INDEX idx_fk_* ON <table> (fk_column);',
    purpose: 'Enforces sub-300ms join performance and ensures ON DELETE CASCADE rules execute without full table scans or locking bottlenecks.'
  },
  {
    type: 'Composite Unique Index & Upsert Lock',
    target: 'attendance_records(session_id, student_id)',
    definition: 'CREATE UNIQUE INDEX idx_attendance_session_student ON attendance_records (session_id, student_id);',
    purpose: 'Eliminates race conditions in concurrent attendance check-ins, guaranteeing atomic idempotent upsert operations.'
  },
  {
    type: 'Composite Unique Index',
    target: 'enrollments(user_id, course_id)',
    definition: 'CREATE UNIQUE INDEX idx_enrollments_user_course ON enrollments (user_id, course_id);',
    purpose: 'Enforces idempotency and guarantees sub-millisecond lookup for student enrollment status checks.'
  },
  {
    type: 'pgvector ivfflat Index',
    target: 'document_chunks(embedding)',
    definition: 'CREATE INDEX idx_chunks_ivfflat ON document_chunks USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);',
    purpose: 'Accelerates approximate nearest-neighbor semantic search for AI Tutor RAG retrieval to under 10 seconds doubt resolution.'
  },
  {
    type: 'Partial B-Tree Index',
    target: "courses(status) WHERE status = 'pending'",
    definition: "CREATE INDEX idx_courses_pending ON courses (status) WHERE status = 'pending';",
    purpose: 'Optimizes platform admin governance queues so pending submissions are instantly filtered without table scans.'
  },
  {
    type: 'GIN Full-Text Search Index',
    target: 'discussion_posts(content)',
    definition: "CREATE INDEX idx_discussion_posts_gin ON discussion_posts USING gin(to_tsvector('english', content));",
    purpose: 'Provides instantaneous multi-term keyword search across thousands of course discussion threads.'
  }
];
