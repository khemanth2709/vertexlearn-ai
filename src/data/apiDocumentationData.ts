export interface APIEndpointDoc {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  endpoint: string;
  category: '8.1 Auth' | '8.2 Courses' | '8.3 Enrollment & Progress' | '8.4 Assignments & Quizzes' | '8.5 AI Tutor' | '8.6 Recommendations & Gamification' | '8.7 Admin';
  description: string;
  role: 'Public' | 'Authenticated' | 'Student' | 'Instructor' | 'Admin';
  rateLimit: string;
  requestSample?: Record<string, any>;
  responseSample: Record<string, any>;
  statusSuccess: number;
}

export const API_DOCUMENTATION: APIEndpointDoc[] = [
  // 8.1 Auth
  {
    method: 'POST',
    endpoint: '/api/v1/auth/register',
    category: '8.1 Auth',
    description: 'Register a new user identity (default role: student). Returns registered user profile with zero-trust token issuance.',
    role: 'Public',
    rateLimit: '10 requests / min / IP',
    requestSample: {
      full_name: 'Ananya Sharma',
      email: 'ananya@student.vertexon.ai',
      password: 'SecurePass123!@#',
      student_roll_number: 'STU-2026-0104',
      department: 'Computer Science & Engineering',
      year: '3rd Year'
    },
    responseSample: {
      success: true,
      user: {
        id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        full_name: 'Ananya Sharma',
        email: 'ananya@student.vertexon.ai',
        role: 'student',
        created_at: '2026-10-07T12:00:00Z'
      },
      message: 'Student account registered successfully. Verification email dispatched.'
    },
    statusSuccess: 201
  },
  {
    method: 'POST',
    endpoint: '/api/v1/auth/login',
    category: '8.1 Auth',
    description: 'Authenticates user via email and password hash verification. Returns short-lived JWT access token + refresh token.',
    role: 'Public',
    rateLimit: '10 requests / min / IP',
    requestSample: {
      email: 'ananya@example.com',
      password: 'SecurePass123'
    },
    responseSample: {
      access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmNDdhYzEwYi01OGNjLTQzNzItYTU2Ny0wZTAyYjJjM2Q0NzkiLCJyb2xlIjoic3R1ZGVudCIsImV4cCI6MTcyODMyMDgwMH0...',
      refresh_token: 'dGhpc2lzYXJlZnJlc2h0b2tlbjIwMjZ2ZXJ0ZXhvbmFp...',
      token_type: 'Bearer',
      expires_in: 900,
      user: {
        id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        full_name: 'Ananya Sharma',
        role: 'student'
      }
    },
    statusSuccess: 200
  },
  {
    method: 'POST',
    endpoint: '/api/v1/auth/refresh',
    category: '8.1 Auth',
    description: 'Issues a fresh 15-minute access token using a valid cryptographically signed refresh token.',
    role: 'Public',
    rateLimit: '10 requests / min / IP',
    requestSample: {
      refresh_token: 'dGhpc2lzYXJlZnJlc2h0b2tlbjIwMjZ2ZXJ0ZXhvbmFp...'
    },
    responseSample: {
      access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmNDdhYzEwYi01OGNjLTQzNzItYTU2Ny0wZTAyYjJjM2Q0NzkiLCJyb2xlIjoic3R1ZGVudCIsImV4cCI6MTcyODMyMTcwMH0...',
      token_type: 'Bearer',
      expires_in: 900
    },
    statusSuccess: 200
  },
  {
    method: 'POST',
    endpoint: '/api/v1/auth/logout',
    category: '8.1 Auth',
    description: 'Revokes the active refresh token session and invalidates Redis JWT session cache.',
    role: 'Authenticated',
    rateLimit: '10 requests / min / IP',
    requestSample: {
      refresh_token: 'dGhpc2lzYXJlZnJlc2h0b2tlbjIwMjZ2ZXJ0ZXhvbmFp...'
    },
    responseSample: {
      success: true,
      message: 'Session revoked successfully.'
    },
    statusSuccess: 200
  },
  {
    method: 'GET',
    endpoint: '/api/v1/auth/me',
    category: '8.1 Auth',
    description: 'Returns the current authenticated user profile, permissions, active enrollments, and academic standing.',
    role: 'Authenticated',
    rateLimit: '100 requests / min / user',
    responseSample: {
      id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
      full_name: 'Ananya Sharma',
      email: 'ananya@student.vertexon.ai',
      role: 'student',
      department: 'Computer Science & Engineering',
      studentProfile: {
        studentRollNumber: 'STU-2026-0104',
        gpa: 3.82,
        attendanceRate: 96,
        performanceCategory: 'EXCELLENT'
      },
      enrolledCourseIds: ['c_dsa_dev', 'c_fullstack_mern', 'c_python_dev']
    },
    statusSuccess: 200
  },

  // 8.2 Courses
  {
    method: 'GET',
    endpoint: '/api/v1/courses',
    category: '8.2 Courses',
    description: 'List, filter, and search course catalog by category, difficulty, search keyword, and pagination.',
    role: 'Public',
    rateLimit: '100 requests / min / user',
    responseSample: {
      total: 11,
      page: 1,
      page_size: 10,
      courses: [
        {
          id: 'c_dsa_dev',
          title: 'DATA STRUCTURES AND ALGORITHMS',
          category: 'Core CS',
          difficulty: 'intermediate',
          instructor_name: 'Rohit Verma',
          price: 0,
          status: 'approved',
          enrolled_count: 1420,
          rating: 4.95,
          thumbnail_url: 'https://images.unsplash.com/photo-1516116211227-bbc832b35a5a'
        }
      ]
    },
    statusSuccess: 200
  },
  {
    method: 'GET',
    endpoint: '/api/v1/courses/:id',
    category: '8.2 Courses',
    description: 'Returns full course metadata, module hierarchy, syllabus objectives, and lecture breakdown.',
    role: 'Public',
    rateLimit: '100 requests / min / user',
    responseSample: {
      id: 'c_dsa_dev',
      title: 'DATA STRUCTURES AND ALGORITHMS',
      instructor_id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
      description: 'Comprehensive curriculum grounded in verified GeeksforGeeks data structures.',
      modules_count: 8,
      lectures_count: 36,
      modules: [
        {
          id: 'mod_dsa_01',
          title: 'Arrays & Two Pointers Algorithm',
          order_index: 1,
          lectures: [
            { id: 'lec_01', title: 'Sliding Window Mastery', duration_seconds: 1840, video_url: 'https://vertexon.ai/stream/lec01.mp4' }
          ]
        }
      ]
    },
    statusSuccess: 200
  },
  {
    method: 'POST',
    endpoint: '/api/v1/courses',
    category: '8.2 Courses',
    description: 'Create a new course curriculum. Initial status defaults to "pending" for admin governance review.',
    role: 'Instructor',
    rateLimit: '100 requests / min / user',
    requestSample: {
      title: 'Advanced Graph Algorithms & Network Flow',
      description: 'Max flow min cut, Dinic algorithm, and push-relabel implementations.',
      category: 'Advanced CS',
      difficulty: 'advanced',
      price: 29.99,
      thumbnail_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5'
    },
    responseSample: {
      id: 'c_graph_flow_01',
      title: 'Advanced Graph Algorithms & Network Flow',
      status: 'pending',
      created_at: '2026-10-07T12:30:00Z',
      message: 'Course submitted to admin governance queue for approval.'
    },
    statusSuccess: 201
  },
  {
    method: 'PUT',
    endpoint: '/api/v1/courses/:id',
    category: '8.2 Courses',
    description: 'Update course metadata, syllabus objectives, or pricing. Enforces instructor ownership.',
    role: 'Instructor',
    rateLimit: '100 requests / min / user',
    requestSample: {
      difficulty: 'advanced',
      price: 39.99
    },
    responseSample: {
      id: 'c_graph_flow_01',
      updated: true,
      updated_at: '2026-10-07T12:35:00Z'
    },
    statusSuccess: 200
  },
  {
    method: 'POST',
    endpoint: '/api/v1/courses/:id/modules',
    category: '8.2 Courses',
    description: 'Add a new chapter or module container into the course curriculum.',
    role: 'Instructor',
    rateLimit: '100 requests / min / user',
    requestSample: {
      title: 'Module 4: Dinic Maximum Bipartite Matching',
      order_index: 4
    },
    responseSample: {
      id: 'mod_dinic_04',
      course_id: 'c_graph_flow_01',
      title: 'Module 4: Dinic Maximum Bipartite Matching',
      order_index: 4
    },
    statusSuccess: 201
  },
  {
    method: 'POST',
    endpoint: '/api/v1/modules/:id/lectures',
    category: '8.2 Courses',
    description: 'Upload lecture video, PDF slides, and transcript. Automatically dispatches RAG chunking job.',
    role: 'Instructor',
    rateLimit: '100 requests / min / user',
    requestSample: {
      title: 'Dinic Level Graphs and Blocking Flows',
      duration_seconds: 2150,
      video_url: 's3://vertexon/lectures/dinic_part1.mp4',
      transcript: 'In this lecture we define level graph constructed by BFS and augment along blocking flows...',
      resource_urls: ['s3://vertexon/slides/dinic_slides.pdf']
    },
    responseSample: {
      id: 'lec_dinic_101',
      module_id: 'mod_dinic_04',
      title: 'Dinic Level Graphs and Blocking Flows',
      vector_chunks_created: 14,
      indexing_job_id: 'job_rag_dinic_101'
    },
    statusSuccess: 201
  },
  {
    method: 'POST',
    endpoint: '/api/v1/courses/:id/approve',
    category: '8.2 Courses',
    description: 'Platform Admin review endpoint to approve or reject newly submitted course curriculums.',
    role: 'Admin',
    rateLimit: '100 requests / min / user',
    requestSample: {
      decision: 'approved',
      comment: 'Complies with syllabus standards and contains full video transcripts for RAG.'
    },
    responseSample: {
      course_id: 'c_graph_flow_01',
      status: 'approved',
      reviewed_by: '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed',
      reviewed_at: '2026-10-07T12:40:00Z'
    },
    statusSuccess: 200
  },

  // 8.3 Enrollment & Progress
  {
    method: 'POST',
    endpoint: '/api/v1/courses/:id/enroll',
    category: '8.3 Enrollment & Progress',
    description: 'Enrolls current student into specified course and initializes progress telemetry.',
    role: 'Student',
    rateLimit: '100 requests / min / user',
    responseSample: {
      enrollment_id: 'enr-901',
      user_id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
      course_id: 'c_dsa_dev',
      enrolled_at: '2026-10-07T12:45:00Z',
      progress_percent: 0.0
    },
    statusSuccess: 201
  },
  {
    method: 'GET',
    endpoint: '/api/v1/enrollments/me',
    category: '8.3 Enrollment & Progress',
    description: 'Lists all enrolled courses for the logged-in student with progress percentages and certificates.',
    role: 'Student',
    rateLimit: '100 requests / min / user',
    responseSample: {
      enrollments: [
        {
          course_id: 'c_dsa_dev',
          title: 'DATA STRUCTURES AND ALGORITHMS',
          progress_percent: 78.5,
          completed_lectures: 28,
          total_lectures: 36,
          last_accessed_at: '2026-10-07T11:20:00Z'
        }
      ]
    },
    statusSuccess: 200
  },
  {
    method: 'POST',
    endpoint: '/api/v1/lectures/:id/progress',
    category: '8.3 Enrollment & Progress',
    description: 'Updates watched seconds playback bookmark and marks lecture completed upon reaching 90%+ duration.',
    role: 'Student',
    rateLimit: '100 requests / min / user',
    requestSample: {
      watched_seconds: 1840,
      completed: true
    },
    responseSample: {
      lecture_id: 'lec_01',
      watched_seconds: 1840,
      completed: true,
      course_progress_updated: 81.2
    },
    statusSuccess: 200
  },
  {
    method: 'POST',
    endpoint: '/api/v1/lectures/:id/notes',
    category: '8.3 Enrollment & Progress',
    description: 'Saves timestamped student lecture annotation linked to video second marker.',
    role: 'Student',
    rateLimit: '100 requests / min / user',
    requestSample: {
      timestamp_seconds: 420,
      content: 'Key condition: Left pointer advances only after total window sum violates constraint.'
    },
    responseSample: {
      id: 'note_891',
      lecture_id: 'lec_01',
      timestamp_seconds: 420,
      created_at: '2026-10-07T12:50:00Z'
    },
    statusSuccess: 201
  },
  {
    method: 'POST',
    endpoint: '/api/v1/lectures/:id/bookmarks',
    category: '8.3 Enrollment & Progress',
    description: 'Adds video timestamp bookmark for rapid review.',
    role: 'Student',
    rateLimit: '100 requests / min / user',
    requestSample: {
      timestamp_seconds: 842
    },
    responseSample: {
      id: 'bm_402',
      lecture_id: 'lec_01',
      timestamp_seconds: 842,
      created_at: '2026-10-07T12:52:00Z'
    },
    statusSuccess: 201
  },

  // 8.4 Assignments & Quizzes
  {
    method: 'POST',
    endpoint: '/api/v1/assignments',
    category: '8.4 Assignments & Quizzes',
    description: 'Create a new course assignment with structured JSONB grading rubric and deadline.',
    role: 'Instructor',
    rateLimit: '100 requests / min / user',
    requestSample: {
      course_id: 'c_dsa_dev',
      title: 'Balanced Red-Black Tree Implementation',
      instructions: 'Implement node rotation, color balancing, and delete fixup in C++.',
      rubric: { correctness: 60, time_complexity: 20, memory_safety: 20 },
      due_date: '2026-10-25T23:59:59Z'
    },
    responseSample: {
      id: 'asg_rb_tree_01',
      title: 'Balanced Red-Black Tree Implementation',
      due_date: '2026-10-25T23:59:59Z',
      created_at: '2026-10-07T13:00:00Z'
    },
    statusSuccess: 201
  },
  {
    method: 'POST',
    endpoint: '/api/v1/assignments/:id/submit',
    category: '8.4 Assignments & Quizzes',
    description: 'Submit assignment artifact (PDF, code file, or repository link) before deadline.',
    role: 'Student',
    rateLimit: '100 requests / min / user',
    requestSample: {
      file_url: 's3://vertexon/submissions/rb_tree_ananya.cpp',
      code_snippet: 'template<typename T> class RedBlackTree { ... };'
    },
    responseSample: {
      submission_id: 'sub_9021',
      assignment_id: 'asg_rb_tree_01',
      submitted_at: '2026-10-07T13:05:00Z',
      status: 'submitted'
    },
    statusSuccess: 201
  },
  {
    method: 'PUT',
    endpoint: '/api/v1/submissions/:id/grade',
    category: '8.4 Assignments & Quizzes',
    description: 'Evaluate assignment submission with numerical score and qualitative rubric feedback.',
    role: 'Instructor',
    rateLimit: '100 requests / min / user',
    requestSample: {
      grade: 96.0,
      feedback: 'Excellent tree rotation logic and zero memory leaks. Full marks for complexity analysis.'
    },
    responseSample: {
      submission_id: 'sub_9021',
      grade: 96.0,
      evaluated_at: '2026-10-07T13:10:00Z',
      evaluator_name: 'Rohit Verma'
    },
    statusSuccess: 200
  },
  {
    method: 'POST',
    endpoint: '/api/v1/quizzes',
    category: '8.4 Assignments & Quizzes',
    description: 'Create quiz assessment container with multiple choice, multi-select, and short answer questions.',
    role: 'Instructor',
    rateLimit: '100 requests / min / user',
    requestSample: {
      module_id: 'mod_dsa_01',
      title: 'Two Pointers & Sliding Window Mastery Quiz',
      questions: [
        {
          question_text: 'What is the optimal time complexity of Two-Sum on sorted arrays?',
          question_type: 'mcq',
          options: [
            { option_text: 'O(N)', is_correct: true },
            { option_text: 'O(N log N)', is_correct: false },
            { option_text: 'O(N^2)', is_correct: false }
          ]
        }
      ]
    },
    responseSample: {
      quiz_id: 'q_two_pointers_01',
      questions_count: 1,
      created_at: '2026-10-07T13:15:00Z'
    },
    statusSuccess: 201
  },
  {
    method: 'POST',
    endpoint: '/api/v1/quizzes/:id/attempt',
    category: '8.4 Assignments & Quizzes',
    description: 'Initiate a student quiz attempt session with recorded start timestamp.',
    role: 'Student',
    rateLimit: '100 requests / min / user',
    responseSample: {
      attempt_id: 'qa_attempt_771',
      quiz_id: 'q_two_pointers_01',
      started_at: '2026-10-07T13:20:00Z',
      time_limit_minutes: 20
    },
    statusSuccess: 201
  },
  {
    method: 'POST',
    endpoint: '/api/v1/attempts/:id/submit',
    category: '8.4 Assignments & Quizzes',
    description: 'Submit quiz responses and immediately trigger automatic grading engine for objective answers.',
    role: 'Student',
    rateLimit: '100 requests / min / user',
    requestSample: {
      answers: {
        'qq-601': ['qo-701']
      }
    },
    responseSample: {
      attempt_id: 'qa_attempt_771',
      score: 100.0,
      earned_points: 10,
      total_points: 10,
      percentage: 100.0,
      submitted_at: '2026-10-07T13:28:15Z',
      passed: true
    },
    statusSuccess: 200
  },

  // 8.5 AI Tutor
  {
    method: 'POST',
    endpoint: '/api/v1/ai/chat/sessions',
    category: '8.5 AI Tutor',
    description: 'Start a context-aware AI Tutor conversational session grounded in the course knowledge base.',
    role: 'Student',
    rateLimit: '20 requests / min / user',
    requestSample: {
      course_id: 'c_dsa_dev',
      mode: 'intermediate'
    },
    responseSample: {
      session_id: 'sess_ai_8901',
      course_id: 'c_dsa_dev',
      mode: 'intermediate',
      created_at: '2026-10-07T13:30:00Z'
    },
    statusSuccess: 201
  },
  {
    method: 'POST',
    endpoint: '/api/v1/ai/chat/sessions/:id/messages',
    category: '8.5 AI Tutor',
    description: 'Send query to AI Tutor. Retrieves course transcript chunks via pgvector RAG and generates cited response.',
    role: 'Student',
    rateLimit: '20 requests / min / user',
    requestSample: {
      message: 'Why does quicksort degrade to O(n^2) on sorted input?'
    },
    responseSample: {
      reply: 'Because the pivot chosen (commonly the first or last element) divides the array into unbalanced partitions of sizes 0 and n-1, producing an arithmetic series sum 1 + 2 + ... + n = O(n^2). Randomizing pivot selection or median-of-three solves this.',
      sources: [
        {
          lecture_id: 'lec-sorting-02',
          lecture_title: 'Sorting Algorithms - Part 2',
          timestamp_seconds: 842
        }
      ],
      mode: 'intermediate'
    },
    statusSuccess: 200
  },
  {
    method: 'POST',
    endpoint: '/api/v1/ai/lectures/:id/summarize',
    category: '8.5 AI Tutor',
    description: 'Synthesizes full lecture transcript into key takeaways, mathematical proofs, and code patterns.',
    role: 'Authenticated',
    rateLimit: '20 requests / min / user',
    responseSample: {
      lecture_id: 'lec_01',
      summary: '1. Two Pointers reduce O(N^2) brute force subarrays to O(N) linear time.\n2. Invariant: Window boundaries only shift forward.\n3. Auxiliary memory is strictly O(1).',
      key_terms: ['Sliding Window', 'Two Pointers', 'Amortized O(N)']
    },
    statusSuccess: 200
  },
  {
    method: 'POST',
    endpoint: '/api/v1/ai/lectures/:id/generate-quiz',
    category: '8.5 AI Tutor',
    description: 'Auto-generates 5 to 10 calibrated assessment questions from lecture transcript for instructor review.',
    role: 'Instructor',
    rateLimit: '20 requests / min / user',
    responseSample: {
      generated_quiz_draft: {
        title: 'Auto-Generated Assessment: Sliding Window',
        questions_count: 5,
        estimated_accuracy: '88% usable without edits',
        questions: [
          {
            question: 'Under what constraint does the sliding window approach fail?',
            options: ['When array contains negative numbers without monotonicity', 'When array is sorted', 'When window size is fixed'],
            correct_index: 0
          }
        ]
      }
    },
    statusSuccess: 200
  },
  {
    method: 'POST',
    endpoint: '/api/v1/ai/modules/:id/flashcards',
    category: '8.5 AI Tutor',
    description: 'Generates spaced revision flashcard pairs (Q/A) for rapid recall.',
    role: 'Student',
    rateLimit: '20 requests / min / user',
    responseSample: {
      flashcards_count: 8,
      cards: [
        { question: 'What is the auxiliary space of Merge Sort vs Quick Sort in standard arrays?', answer: 'Merge Sort requires O(N) auxiliary space; Quick Sort requires O(log N) stack recursion space.' }
      ]
    },
    statusSuccess: 200
  },
  {
    method: 'POST',
    endpoint: '/api/v1/ai/study-plan',
    category: '8.5 AI Tutor',
    description: 'Generates a personalized daily study plan and remediation schedule from student quiz weak areas.',
    role: 'Student',
    rateLimit: '20 requests / min / user',
    responseSample: {
      plan: {
        target_curriculum: 'DATA STRUCTURES AND ALGORITHMS',
        duration_days: 14,
        weak_topics: ['Dynamic Programming Memoization', 'Graph BFS Traversal'],
        daily_schedule: [
          { day: 1, focus: 'Grid Paths & Top-Down Memoization', target_lecture: 'lec_dp_01', practice_minutes: 45 }
        ]
      }
    },
    statusSuccess: 200
  },
  {
    method: 'PUT',
    endpoint: '/api/v1/ai/chat/sessions/:id/mode',
    category: '8.5 AI Tutor',
    description: 'Switch explanation depth between beginner, intermediate, and advanced pedagogical scaffolding.',
    role: 'Student',
    rateLimit: '20 requests / min / user',
    requestSample: {
      mode: 'advanced'
    },
    responseSample: {
      session_id: 'sess_ai_8901',
      mode: 'advanced',
      message: 'Pedagogical scaffolding updated to Advanced (rigorous proofs & asymptotic complexity).'
    },
    statusSuccess: 200
  },

  // 8.6 Recommendations & Gamification
  {
    method: 'GET',
    endpoint: '/api/v1/recommendations/me',
    category: '8.6 Recommendations & Gamification',
    description: 'Returns personalized next course recommendations based on quiz scores and topic vector similarity.',
    role: 'Student',
    rateLimit: '100 requests / min / user',
    responseSample: {
      recommendations: [
        {
          course_id: 'c_fullstack_mern',
          title: 'FULL STACK USING MERN',
          match_score: 0.94,
          reason: 'High performance in Java and Algorithms unlocks full stack engineering pathways.'
        }
      ]
    },
    statusSuccess: 200
  },
  {
    method: 'GET',
    endpoint: '/api/v1/users/me/badges',
    category: '8.6 Recommendations & Gamification',
    description: 'Retrieves all milestones and earned achievement badges for the student.',
    role: 'Student',
    rateLimit: '100 requests / min / user',
    responseSample: {
      total_badges: 4,
      badges: [
        { id: 1, name: '7-Day Streak', earned_at: '2026-10-05T09:00:00Z' },
        { id: 2, name: 'Algorithm Wizard', earned_at: '2026-10-06T14:15:00Z' }
      ]
    },
    statusSuccess: 200
  },
  {
    method: 'GET',
    endpoint: '/api/v1/users/me/streak',
    category: '8.6 Recommendations & Gamification',
    description: 'Returns current streak, longest streak, and daily active activity timestamps.',
    role: 'Student',
    rateLimit: '100 requests / min / user',
    responseSample: {
      current_streak: 14,
      longest_streak: 21,
      last_active_date: '2026-10-07',
      streak_retention_qualified: true
    },
    statusSuccess: 200
  },
  {
    method: 'GET',
    endpoint: '/api/v1/leaderboard/:courseId',
    category: '8.6 Recommendations & Gamification',
    description: 'Fetches cached Redis leaderboard ranking students by quiz accuracy and streak score.',
    role: 'Authenticated',
    rateLimit: '100 requests / min / user',
    responseSample: {
      course_id: 'c_dsa_dev',
      leaderboard: [
        { rank: 1, student_name: 'Ananya Sharma', points: 980, streak: 14 },
        { rank: 2, student_name: 'Vikram Malhotra', points: 940, streak: 11 },
        { rank: 3, student_name: 'Priya Sundaram', points: 915, streak: 9 }
      ]
    },
    statusSuccess: 200
  },

  // 8.7 Admin
  {
    method: 'GET',
    endpoint: '/api/v1/admin/users',
    category: '8.7 Admin',
    description: 'List, filter, and paginate platform users across student, instructor, and admin tiers.',
    role: 'Admin',
    rateLimit: '100 requests / min / user',
    responseSample: {
      total_users: 1845,
      active_students: 1842,
      faculty_count: 9,
      users: [
        { id: 'f47ac10b', name: 'Ananya Sharma', email: 'ananya@student.vertexon.ai', role: 'student', is_active: true }
      ]
    },
    statusSuccess: 200
  },
  {
    method: 'PUT',
    endpoint: '/api/v1/admin/users/:id/role',
    category: '8.7 Admin',
    description: 'Assign or revoke system roles (student, instructor, admin) with audit trail capture.',
    role: 'Admin',
    rateLimit: '100 requests / min / user',
    requestSample: {
      role: 'instructor'
    },
    responseSample: {
      user_id: 'usr_new_faculty',
      assigned_role: 'instructor',
      updated_by: 'Meera Patel',
      timestamp: '2026-10-07T13:40:00Z'
    },
    statusSuccess: 200
  },
  {
    method: 'PUT',
    endpoint: '/api/v1/admin/users/:id/suspend',
    category: '8.7 Admin',
    description: 'Suspend or reinstate user account access for compliance or disciplinary governance.',
    role: 'Admin',
    rateLimit: '100 requests / min / user',
    requestSample: {
      suspended: true,
      reason: 'Academic integrity policy violation under review'
    },
    responseSample: {
      user_id: 'usr_suspended_01',
      is_active: false,
      suspended_at: '2026-10-07T13:42:00Z'
    },
    statusSuccess: 200
  },
  {
    method: 'GET',
    endpoint: '/api/v1/admin/courses/pending',
    category: '8.7 Admin',
    description: 'Fetch administrative approval queue of newly authored instructor curriculums.',
    role: 'Admin',
    rateLimit: '100 requests / min / user',
    responseSample: {
      pending_count: 2,
      courses: [
        { id: 'c_graph_flow_01', title: 'Advanced Graph Algorithms', instructor: 'Rohit Verma', submitted_at: '2026-10-07T12:30:00Z' }
      ]
    },
    statusSuccess: 200
  },
  {
    method: 'GET',
    endpoint: '/api/v1/admin/analytics/overview',
    category: '8.7 Admin',
    description: 'Platform-wide executive metrics: Daily Active Users (DAU), completion rates, revenue, and latency.',
    role: 'Admin',
    rateLimit: '100 requests / min / user',
    responseSample: {
      daily_active_users: 1420,
      completion_rate_percent: 74.2,
      average_doubt_resolution_seconds: 3.4,
      total_revenue_usd: 128450.0,
      api_p95_latency_ms: 182
    },
    statusSuccess: 200
  },
  {
    method: 'GET',
    endpoint: '/api/v1/admin/moderation/flagged-posts',
    category: '8.7 Admin',
    description: 'Retrieve community discussion posts flagged for content moderation.',
    role: 'Admin',
    rateLimit: '100 requests / min / user',
    responseSample: {
      flagged_posts_count: 1,
      posts: [
        { id: 'post_904', thread_id: 'thread_dsa', author: 'Vikram', content: 'Flagged query regarding direct answer posting', flagged_at: '2026-10-07T08:00:00Z' }
      ]
    },
    statusSuccess: 200
  }
];

export const STANDARD_ERROR_FORMAT = {
  error: {
    code: 'VALIDATION_ERROR',
    message: 'email must be a valid email address',
    field: 'email'
  }
};

export const RATE_LIMIT_SPECS = [
  { group: '/api/v1/auth/*', limit: '10 requests / minute / IP', policy: 'Sliding window rate limit to block credential stuffing' },
  { group: '/api/v1/ai/chat/*', limit: '20 requests / minute / user', policy: 'Token bucket rate limit to ensure fair Gemini/RAG compute allocation' },
  { group: 'All other authenticated endpoints', limit: '100 requests / minute / user', policy: 'Token bucket per JWT user identifier' }
];
