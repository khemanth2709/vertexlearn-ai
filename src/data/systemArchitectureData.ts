export interface SystemComponent {
  id: string;
  name: string;
  type: 'client' | 'gateway' | 'microservice' | 'datastore' | 'external';
  tech: string;
  description: string;
  responsibilities: string[];
  connections: string[];
}

export interface RequestFlowStep {
  step: number;
  actor: string;
  action: string;
  data: string;
  detail: string;
}

export interface BackgroundJob {
  id: string;
  name: string;
  trigger: 'Upload' | 'Content Creation' | 'Nightly Cron' | 'Daily Cron' | 'Course 100%' | 'Event Driven';
  queue: 'BullMQ' | 'Celery';
  frequency: string;
  description: string;
  payload: Record<string, any>;
  durationEstimate: string;
}

export interface CacheRule {
  target: string;
  layer: 'Redis' | 'CloudFront CDN' | 'In-Memory Gateway';
  ttl: string;
  invalidation: string;
  purpose: string;
}

export const SYSTEM_COMPONENTS: SystemComponent[] = [
  {
    id: 'client_apps',
    name: 'Client Apps',
    type: 'client',
    tech: 'React SPA (TypeScript, Tailwind CSS, Vite)',
    description: 'Unified single-page application rendering role-tailored views for Students, Instructors, and Platform Admins.',
    responsibilities: [
      'Student learning portal, video player, and interactive AI Tutor widget',
      'Instructor course authoring, module structuring, and subjective evaluation',
      'Platform Admin compliance dashboard, user management, and course approval workflow',
      'Client-side token storage (access token in memory, refresh token in httpOnly cookie)'
    ],
    connections: ['api_gateway']
  },
  {
    id: 'api_gateway',
    name: 'API Gateway',
    type: 'gateway',
    tech: 'NGINX / Reverse Proxy',
    description: 'Frontline ingress controller handling SSL termination, rate limiting, and unified routing to internal microservices.',
    responsibilities: [
      'SSL/TLS 1.3 termination with zero-trust cipher suites',
      'Route dispatching to Core LMS, AI Tutor, and Notification services',
      'Token bucket rate limiting (/auth: 10 req/min, /ai: 20 req/min, authenticated: 100 req/min)',
      'CORS header negotiation and HTTP request sanitization'
    ],
    connections: ['core_lms_svc', 'ai_tutor_svc', 'notification_svc']
  },
  {
    id: 'core_lms_svc',
    name: 'Core LMS Service',
    type: 'microservice',
    tech: 'Node.js / Express / TypeScript',
    description: 'Primary transactional application service orchestrating business domain logic and authoritative state mutations.',
    responsibilities: [
      'JWT Authentication & refresh token rotation (Argon2 password hashing)',
      'Course catalog lifecycle (drafting, syllabus management, Admin approvals)',
      'Student enrollments and second-level video progress tracking',
      'Assignments rubric management and manual grading workflows',
      'Objective quiz submission grading and attempt tracking'
    ],
    connections: ['postgres_primary', 'redis_cache', 's3_storage']
  },
  {
    id: 'ai_tutor_svc',
    name: 'AI Tutor Service',
    type: 'microservice',
    tech: 'Python / FastAPI & Node.js Gemini SDK',
    description: 'High-performance AI engine managing vector search, RAG contextual retrieval, and pedagogical tutoring modes.',
    responsibilities: [
      'pgvector cosine-similarity semantic vector search over document_chunks',
      'Context assembly and prompt engineering (Study, Homework, Exam, Review modes)',
      'Streaming inference calls to external LLM provider',
      'Automated quiz generation from lecture transcripts and module flashcard extraction',
      'Personalized study plan synthesis and topic mastery calculations'
    ],
    connections: ['pgvector_store', 'redis_cache', 'external_llm']
  },
  {
    id: 'notification_svc',
    name: 'Notification Service',
    type: 'microservice',
    tech: 'Node.js Worker (BullMQ / Redis)',
    description: 'Asynchronous event consumer delivering transactional emails, reminders, and real-time alerts.',
    responsibilities: [
      'Email dispatch for student verification, password resets, and grading announcements',
      'Daily learning streak calculation and student retention reminders',
      'Assignment deadline notifications and certificate issuance alerts',
      'Instructor triage escalation tickets from the AI tutor widget'
    ],
    connections: ['redis_cache', 'postgres_primary']
  },
  {
    id: 'postgres_primary',
    name: 'PostgreSQL (Primary DB)',
    type: 'datastore',
    tech: 'PostgreSQL 15+ Relational Store',
    description: 'Authoritative relational system of record ensuring ACID consistency across all 32 platform entities.',
    responsibilities: [
      'Identity and RBAC mappings (users, roles, user_roles)',
      'Curricula hierarchy (courses, modules, lectures)',
      'Enrollment records, lecture playback bookmarks, and student notes',
      'Assignments, JSONB rubrics, submissions, and grades',
      'Immutable regulatory audit logs'
    ],
    connections: []
  },
  {
    id: 'pgvector_store',
    name: 'Vector Store (pgvector)',
    type: 'datastore',
    tech: 'PostgreSQL pgvector extension (1536-dim)',
    description: 'High-performance vector database co-located inside PostgreSQL for course transcript chunks and semantic embeddings.',
    responsibilities: [
      'Stores 1536-dimensional vector embeddings generated from lecture chunks',
      'IVFFlat cosine-distance index for sub-10ms nearest neighbor search',
      'Course-scoped vector retrieval guaranteeing zero out-of-curriculum hallucination',
      'Direct relational joins between vector chunks and lecture entities'
    ],
    connections: []
  },
  {
    id: 'redis_cache',
    name: 'Redis (Cache + Queue)',
    type: 'datastore',
    tech: 'Redis 7.2 In-Memory Key-Value',
    description: 'Low-latency distributed cache and persistent message broker powering asynchronous background job queues.',
    responsibilities: [
      'Job queues: BullMQ & Celery for video transcripts, embeddings, and notifications',
      'Course catalog cache (TTL 5 min, invalidated on admin approval)',
      'Course leaderboard cache (TTL 60s)',
      'Sliding window rate limit counters per IP/user'
    ],
    connections: []
  },
  {
    id: 's3_storage',
    name: 'Object Storage (AWS S3 / GCS)',
    type: 'external',
    tech: 'Cloud Object Storage + CDN',
    description: 'Highly durable binary artifact vault fronted by a global Content Delivery Network.',
    responsibilities: [
      'Lecture video streams (HLS/MP4)',
      'Course PDF syllabi and instructor slide decks',
      'Student code submissions and assignment uploads',
      'Cryptographically signed completion certificate PDFs'
    ],
    connections: []
  },
  {
    id: 'external_llm',
    name: 'External LLM Provider',
    type: 'external',
    tech: 'Google Gemini 3.8 Flash / Claude Anthropic API',
    description: 'Large language model inference endpoint powering intelligent tutoring, summarization, and draft creation.',
    responsibilities: [
      'RAG grounded contextual answer synthesis with exact module/time citations',
      'Socratic hints generation in Homework mode',
      'Pedagogical topic summarization and auto-generated assessment generation',
      'Zero student data retention for external model training'
    ],
    connections: []
  }
];

export const AI_TUTOR_REQUEST_FLOW: RequestFlowStep[] = [
  {
    step: 1,
    actor: 'Student Client (React SPA)',
    action: 'Dispatches Question Payload',
    data: 'POST /api/v1/ai/chat/sessions/:id/messages { "message": "Why does quicksort degrade to O(n^2) on sorted input?" }',
    detail: 'Authenticated request includes Bearer JWT and current course_id (c_dsa_dev) context.'
  },
  {
    step: 2,
    actor: 'API Gateway & AI Tutor Service',
    action: 'Embeds Question & Performs Cosine Similarity Vector Search',
    data: 'query_embedding = embed_model(question) -> SELECT * FROM document_chunks WHERE course_id = $1 ORDER BY embedding <=> query_embedding LIMIT 3;',
    detail: 'AI Tutor Service retrieves the top-k most relevant lecture transcript chunks from the pgvector store filtered strictly by the enrolled course.'
  },
  {
    step: 3,
    actor: 'AI Tutor Service -> LLM Provider',
    action: 'Assembles Context Prompt & Executes Inference Call',
    data: 'System Instruction + Retrieved Transcripts Chunks + Student Question -> External LLM API',
    detail: 'Enforces tutoring mode guardrails (Study, Homework, or Review) and requires explicit timestamp and lecture title citations.'
  },
  {
    step: 4,
    actor: 'AI Tutor Service -> PostgreSQL & Client',
    action: 'Stores Message Utterance & Returns Cited Reply to Student',
    data: 'INSERT INTO ai_chat_messages; HTTP 200 { "reply": "...", "sources": [{"lecture_id": "uuid", "timestamp_seconds": 842}], "mode": "intermediate" }',
    detail: 'Client updates the floating AI Tutor chat widget with rendered Markdown and one-click timestamp jump buttons.'
  },
  {
    step: 5,
    actor: 'Redis Queue -> Background Worker',
    action: 'Asynchronous Per-Topic Mastery Score Update',
    data: 'BullMQ job: updateStudentTopicMastery({ student_id, topic: "Sorting Algorithms", confidence: 0.88 })',
    detail: 'Background worker analyzes student comprehension from the exchange, dynamically updating the adaptive study plan and recommendation scores.'
  }
];

export const BACKGROUND_JOBS: BackgroundJob[] = [
  {
    id: 'job_transcription',
    name: 'Video Transcription (Speech-to-Text)',
    trigger: 'Upload',
    queue: 'Celery',
    frequency: 'On Lecture Video Upload',
    description: 'Extracts audio track from uploaded video and generates verbatim time-stamped text transcript using gemini-3.5-transcribe.',
    payload: { lecture_id: 'lec_dsa_201', video_s3_key: 'lectures/sorting_part2.mp4', language: 'en' },
    durationEstimate: '45 - 90 seconds'
  },
  {
    id: 'job_chunking_embeddings',
    name: 'Document Chunking + Embedding Generation',
    trigger: 'Content Creation',
    queue: 'Celery',
    frequency: 'Triggered after Lecture Transcription or PDF Upload',
    description: 'Partitions lecture transcript into 500-token chunks with 50-token overlap, calculates 1536-dimensional embeddings, and inserts into document_chunks table.',
    payload: { lecture_id: 'lec_dsa_201', chunk_size: 500, overlap: 50, vector_dim: 1536 },
    durationEstimate: '10 - 25 seconds'
  },
  {
    id: 'job_nightly_recommendations',
    name: 'Nightly Recommendation-Score Recalculation',
    trigger: 'Nightly Cron',
    queue: 'BullMQ',
    frequency: 'Daily at 02:00 AM UTC',
    description: 'Scans student quiz attempt scores, completed modules, and topic weaknesses to recalculate personalized next-course recommendation matrix.',
    payload: { batch_size: 250, algorithm: 'collaborative_and_content_similarity' },
    durationEstimate: '8 minutes (1,842 students)'
  },
  {
    id: 'job_streak_eval',
    name: 'Streak Evaluation (Daily Retention Cron)',
    trigger: 'Daily Cron',
    queue: 'BullMQ',
    frequency: 'Daily at 00:05 AM UTC',
    description: 'Evaluates daily learning events; increments streak counter for active learners, resets streak for inactive days, and pushes streak milestone alerts.',
    payload: { grace_period_hours: 4 },
    durationEstimate: '45 seconds'
  },
  {
    id: 'job_cert_generation',
    name: 'Certificate PDF Generation on Course Completion',
    trigger: 'Course 100%',
    queue: 'BullMQ',
    frequency: 'Triggered upon 100% Lecture and Assessment Completion',
    description: 'Generates cryptographically signed high-resolution PDF certificate with unique verification URL, uploads to S3, and emails student.',
    payload: { user_id: 'f47ac10b', course_id: 'c_dsa_dev', template: 'verified_gold' },
    durationEstimate: '3.2 seconds'
  },
  {
    id: 'job_notification_dispatch',
    name: 'Email & In-App Notification Dispatch',
    trigger: 'Event Driven',
    queue: 'BullMQ',
    frequency: 'Continuous Event Stream',
    description: 'Dispatches transactional emails (SES/SendGrid) and in-app alerts for grade releases, announcements, and administrative reviews.',
    payload: { channels: ['in_app', 'email'], priority: 'normal' },
    durationEstimate: 'Sub-second'
  }
];

export const CACHING_STRATEGY_RULES: CacheRule[] = [
  {
    target: 'Course Catalog Listings',
    layer: 'Redis',
    ttl: '5 minutes (300 seconds)',
    invalidation: 'Instant eviction upon instructor course update or platform admin approval/rejection event.',
    purpose: 'Eliminates redundant database queries for public and authenticated course browsing under high traffic spikes.'
  },
  {
    target: 'Course Leaderboard Reads',
    layer: 'Redis',
    ttl: '60 seconds',
    invalidation: 'Periodic sliding cache eviction; recomputed asynchronously from quiz accuracy scores.',
    purpose: 'Delivers sub-5ms leaderboard responses to thousands of concurrent competitive learners.'
  },
  {
    target: 'Video Streams & Static Slide PDFs',
    layer: 'CloudFront CDN',
    ttl: '24 hours (86,400 seconds) edge cache',
    invalidation: 'Versioned asset URL hashes (/lectures/v2/lec_01.mp4) ensure immediate client-side cache busting on updates.',
    purpose: 'Reduces origin S3 egress costs and guarantees buffer-free 1080p video streaming globally.'
  }
];
