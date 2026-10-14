# Product Requirement Document (PRD)
## Vertexon LMS-AI Platform

**Version:** 1.0.0  
**Status:** Approved  
**Target Architecture:** Distributed Microservices (React 19 SPA + Node.js/Express + Python/FastAPI AI Tutor + PostgreSQL + pgvector + Redis)

---

## 1. Executive Summary
Vertexon is an enterprise-grade AI-native Learning Management System (LMS) engineered for higher education and professional corporate training. It combines traditional course management (modules, lectures, assignments, quizzes) with real-time Retrieval-Augmented Generation (RAG) AI tutoring, dynamic assessment synthesis, student progress analytics, and multi-tenant Role-Based Access Control (RBAC).

---

## 2. Key Objectives & Success Metrics
- **99.9% Uptime** across core student learning journeys and assignment submissions.
- **Sub-1500ms AI Response Time** for RAG-grounded tutor replies referencing lecture transcripts and syllabus documents.
- **Zero RBAC Leaks**: Strict role separation between Students, Instructors, and Administrators, backed by dual-layer middleware and service ownership validation.
- **Accreditation Readiness**: Compliant with FERPA, GDPR, and ISO 27001 audit standards.

---

## 3. User Roles & Personas
1. **Student (`student`)**: Enrolls in courses, streams lecture media, creates personal notes and bookmarks, submits assignments, takes auto-graded quizzes, and chats with the course-grounded AI tutor.
2. **Instructor (`instructor`)**: Authors course curricula, uploads lecture transcripts and video metadata, grades submissions, reviews AI-generated quizzes, and monitors own-course completion metrics.
3. **Administrator (`admin`)**: Manages institutional accounts, approves/rejects instructor-submitted courses, oversees compliance audits, manages billing and subscriptions, and views platform-wide telemetry.

---

## 4. User Roles & Permissions Matrix (Section 11)

| Capability | Student | Instructor | Admin | Enforcement Layer |
| :--- | :---: | :---: | :---: | :--- |
| **Register / Login** | Yes | Yes | Yes | API Gateway / Auth Controller |
| **Browse course catalog** | Yes | Yes | Yes | Public Catalog Controller |
| **Enroll in a course** | Yes | No | No | `requireRole(['student'])` |
| **Watch lectures / track progress** | Yes | No | No | `requireRole(['student'])` + Enrollment check |
| **Create notes/bookmarks** | Yes | No | No | `requireRole(['student'])` |
| **Submit assignments** | Yes | No | No | `requireRole(['student'])` + Deadline validation |
| **Attempt quizzes** | Yes | No | No | `requireRole(['student'])` + Attempt limiter |
| **Use AI tutor chat** | Yes | Yes (as reviewer) | No | `requireRole(['student', 'instructor'])` |
| **Create/edit own course** | No | Yes (own course) | Yes (any course) | `requireRole(['instructor', 'admin'])` + `verifyOwnership()` |
| **Upload lecture material** | No | Yes (own course) | Yes | `requireRole(['instructor', 'admin'])` + `verifyOwnership()` |
| **Create/approve AI-generated quiz**| No | Yes (own course) | Yes | `requireRole(['instructor', 'admin'])` + `verifyOwnership()` |
| **Grade assignments** | No | Yes (own course) | Yes | `requireRole(['instructor', 'admin'])` + `verifyOwnership()` |
| **View own-course analytics** | No | Yes | Yes | `requireRole(['instructor', 'admin'])` + Course filter |
| **View platform-wide analytics** | No | No | Yes | `requireRole(['admin'])` |
| **Approve/reject submitted courses**| No | No | Yes | `requireRole(['admin'])` |
| **Manage user roles** | No | No | Yes | `requireRole(['admin'])` |
| **Suspend/delete accounts** | No | No | Yes | `requireRole(['admin'])` |
| **Moderate forum content** | No | Yes (own threads) | Yes (platform-wide) | `requireRole(['instructor', 'admin'])` + Thread ownership |
| **Manage revenue/subscriptions** | No | No | Yes | `requireRole(['admin'])` |

### Enforcement Strategy
- **Layer 1 (API Middleware)**: `requireRole(...roles)` validates JWT claims and drops unauthorized requests before database calls.
- **Layer 2 (Service Layer)**: Mutating operations on courses, lectures, quizzes, and threads require `verifyCourseOwnership(resourceId, userId, userRole)` to guarantee multi-instructor isolation.

---

## 5. System Architecture & Components
- **Frontend SPA**: React 19, TypeScript, Tailwind CSS, Lucide icons, Recharts visualization.
- **Core LMS Service**: Node.js 20, Express, TypeScript, PostgreSQL (relational system of record).
- **AI Tutor Service**: Python 3.11, FastAPI, pgvector (vector embeddings), Google GenAI SDK, Redis (caching and BullMQ queue).
- **Reverse Proxy**: NGINX SSL termination and API gateway routing.
- **Object Storage**: AWS S3 compatible blob storage for course media, student assignment attachments, and transcripts.

---

## 6. Development Roadmap — 4 Weeks, One Developer (Section 12)

The plan assumes ~6-7 focused hours/day. Each week ends with a working, demoable increment — this is deliberate so the project is never in a broken state for more than a day.

### Week 1 — Foundation, Auth, Core Data Layer
| Day | Tasks |
| :--- | :--- |
| **Day 1** | Repo setup, monorepo/folder structure, Docker Compose (Postgres, Redis), CI skeleton |
| **Day 2** | Database schema migration scripts for users/roles/courses/modules/lectures |
| **Day 3** | Auth module: register, login, JWT issuance, refresh token, RBAC middleware |
| **Day 4** | Course CRUD APIs + catalog listing/filtering, pagination |
| **Day 5** | Frontend scaffold (routing, layout, auth pages, protected routes) |
| **Days 6-7** | Student dashboard UI + course catalog UI wired to backend; buffer/testing |
*Milestone:* Users can register, log in, and browse/enroll in courses. Instructor can create a course.

### Week 2 — Learning Core: Lectures, Progress, Assignments, Quizzes
| Day | Tasks |
| :--- | :--- |
| **Day 8** | Video upload to object storage + streaming playback in course player |
| **Day 9** | Lecture progress tracking, notes, bookmarks |
| **Day 10** | Assignment creation + submission + manual grading flow |
| **Day 11** | Quiz builder (manual) + attempt + auto-grading engine for objective questions |
| **Day 12** | Certificates (PDF generation), badges, streak logic (daily cron job) |
| **Days 13-14** | Instructor analytics dashboard (drop-off, avg. score); buffer/testing |
*Milestone:* A student can complete a full course loop: watch, note, submit assignment, take quiz, earn a certificate.

### Week 3 — AI Tutor & Recommendations
| Day | Tasks |
| :--- | :--- |
| **Day 15** | Set up AI service (FastAPI), integrate LLM provider client |
| **Day 16** | Document ingestion pipeline: transcript chunking + embedding generation into pgvector |
| **Day 17** | RAG retriever + chat endpoint with source citation |
| **Day 18** | Lesson summarization + flashcard generation endpoints |
| **Day 19** | Auto quiz generation from transcript + instructor review/approval UI |
| **Days 20-21** | Difficulty-mode switching, mastery-score tracking, study plan + recommendation engine; buffer/testing |
*Milestone:* AI tutor answers course-grounded questions with citations; auto-generates quizzes, summaries, flashcards, and a study plan.

### Week 4 — Admin Panel, Discussions, Polish, Deployment
| Day | Tasks |
| :--- | :--- |
| **Day 22** | Admin panel: user management, role assignment, course approval queue |
| **Day 23** | Admin analytics dashboard (platform-wide metrics), content moderation for forum |
| **Day 24** | Discussion forum (threaded), notifications (in-app + email mock) |
| **Day 25** | End-to-end integration testing, bug bash, performance tuning (query optimization, caching) |
| **Day 26** | Security hardening (rate limits, input sanitization, CORS, audit log review) |
| **Days 27-28** | Production deployment (Docker Compose / Cloud Run / ECS), DNS, SSL, final smoke tests |
*Milestone:* Production-ready LMS with all user roles active, AI tutor live, admin controls enforced, and zero critical vulnerabilities.

### Key Philosophy & Risk Mitigation
- **Demoable Weekly Increments**: Every week closes with an end-to-end usable product increment.
- **Built-in Buffer**: Days 6-7, 13-14, 20-21, and 27-28 act as stabilizing and buffer days within each week to absorb overruns without disrupting subsequent weekly deliverables.
- **Independent Services**: Decoupled AI Tutor microservice ensures LLM API latencies never degrade core course playback and enrollment workflows.

---

## 7. Suggested Technology Stack (Section 13)

| Layer | Technology | Notes |
| :--- | :--- | :--- |
| **Frontend** | React 18 + TypeScript, Vite | Fast dev server, strong typing |
| **State Management** | Redux Toolkit (or Zustand) | Predictable global state for auth/course/session data |
| **Styling** | Tailwind CSS | Utility-first, fast to theme (incl. dark mode) |
| **Frontend Data Fetching** | TanStack Query (React Query) | Caching, retries, background refetch |
| **Backend (Core LMS)** | Node.js + Express (or NestJS) + TypeScript | REST APIs, RBAC middleware |
| **Backend (AI Service)** | Python + FastAPI | Best ecosystem fit for RAG/embedding pipelines |
| **Database** | PostgreSQL 15+ | Relational integrity for LMS entities |
| **Vector Store** | pgvector (Postgres extension) | Avoids running a separate vector DB at this scale |
| **Cache / Queue** | Redis + BullMQ (Node) / Celery (Python) | Caching + background jobs |
| **Object Storage** | AWS S3 (or MinIO for local dev) | Video, PDFs, certificates |
| **LLM Provider** | Anthropic API (Claude models) | Chat, summarization, quiz generation |
| **Auth** | JWT (access + refresh), bcrypt/argon2 | Stateless auth |
| **Video Delivery** | HLS via a CDN in front of S3 | Progressive/adaptive streaming |
| **Speech-to-Text** | Whisper (self-hosted) or managed STT API | Lecture transcription |
| **PDF Generation** | Puppeteer / pdf-lib | Certificates |
| **Containerization** | Docker + Docker Compose | Local dev parity with prod |
| **Orchestration (optional)** | Kubernetes (minikube / managed K8s) | Only if scaling beyond single-node deploy |
| **CI/CD** | GitHub Actions | Lint, test, build, deploy pipeline |
| **Monitoring** | Prometheus + Grafana (or hosted APM) | Metrics, health checks |
| **Logging** | Winston (Node) / structlog (Python) | Structured logs, centralized via Loki/CloudWatch |
| **Testing** | Jest, Supertest, Pytest, Playwright | Backend, AI service, frontend/E2E |

### Architectural Rationale & Stack Cohesion
1. **Separation of Concerns**: Core transactional domain logic (user enrollments, courses, quizzes, assignments) is hosted within a high-throughput Node.js TypeScript service, while heavy numerical compute, vector search orchestration, and LLM streaming are isolated in Python/FastAPI.
2. **Unified Postgres Footprint with pgvector**: Running `pgvector` inside PostgreSQL 15+ eliminates operational overhead of a standalone vector database (Pinecone/Milvus/Qdrant) at early-to-medium scale, ensuring ACID consistency between course chunks and source metadata.
3. **Resilient Background Execution**: BullMQ and Redis offload media transcription (Whisper), certificate rendering (Puppeteer/pdf-lib), and digest emails without blocking incoming HTTP user traffic.
4. **Adaptive Media & Document Streaming**: Video delivery is decoupled via HLS multi-bitrate manifests hosted on S3 and cached edge CDNs (CloudFront), ensuring buffer-free streaming across mobile and low-bandwidth clients.

---

## 8. Deployment Strategy (Section 14)

### 14.1 Environments
- **Local**: Docker Compose spins up Postgres 16 (with `pgvector`), Redis 7, MinIO (S3-compatible object storage), core backend service, ai-service, and frontend client.
- **Staging**: Single cloud VM or managed container service (mirroring production configuration with smaller resource limits and synthetic test datasets).
- **Production**: Managed container hosting (managed Kubernetes or PaaS such as Render, Railway, AWS ECS / Cloud Run) fronted by an Application Load Balancer (ALB) / NGINX reverse proxy and global CloudFront CDN.

### 14.2 CI/CD Pipeline (GitHub Actions)
1. **On Pull Request (`on: pull_request`)**:
   - Automated linting (`eslint`, `ruff`, `flake8`)
   - Unit and integration tests (`jest`, `pytest`, `supertest`)
   - Static type-checking (`tsc --noEmit`, `mypy`)
   - Build validation for frontend, backend, and ai-service
2. **On Merge to Main (`on: push: branches: [main]`)**:
   - Build immutable production Docker images tagged with Git commit SHA
   - Push images to container registry (GHCR / AWS ECR / Google Artifact Registry)
   - Deploy automatically to staging environment
   - Execute automated end-to-end smoke tests and health-check verification
3. **On Tagged Release (`on: push: tags: ['v*']`)**:
   - Promote verified staging container image to production
   - Execute blue-green switch or rolling deployment with zero downtime
   - Monitor real-time error rates, latency percentiles, and automatic rollback triggers

### 14.3 Infrastructure Components
- **Load Balancer / Reverse Proxy**: NGINX or AWS Application Load Balancer (ALB) terminating TLS 1.3, handling path-based reverse proxy routing (`/api` -> backend, `/ai` -> ai-service, `/` -> static frontend), and enforcing DDoS rate limiting.
- **Managed PostgreSQL**: PostgreSQL 15+ with `pgvector` extension enabled, multi-AZ deployment, automated daily snapshots, and Point-In-Time Recovery (PITR).
- **Managed Redis Instance**: High-availability Redis 7 cluster for session persistence, token blacklist, rate limiters, BullMQ background queues, and catalog response caching.
- **S3 Object Storage (or equivalent)**: AWS S3 bucket with lifecycle policies for long-term archiving of legacy video transcripts and certificate assets, backed by signed URLs for authenticated streaming.
- **Content Delivery Network (CDN)**: CloudFront edge distribution in front of static assets and HLS video streaming segments with gzip/brotli compression.
- **Secrets Manager**: AWS Secrets Manager / GCP Secret Manager / Vault for encrypted runtime injection of LLM API keys, database credentials, and JWT asymmetric signing keys.

### 14.4 Scaling Approach
- **Stateless Core LMS & AI Microservices**: Both backend and AI services remain completely stateless, horizontally autoscaling (HPA) behind the load balancer based on CPU/memory utilization and request queue depth.
- **Redis Tier Protection**: Read-heavy endpoints (course catalog browsing, filter queries, leaderboards, user profile headers) are aggressively cached in Redis to absorb traffic spikes before hitting Postgres.
- **AI Service Isolation**: Heavy vector indexing and LLM prompt processing run isolated in the dedicated Python FastAPI service, ensuring slow upstream LLM response times or streaming sockets never degrade core LMS CRUD operations.
- **Database Read Replicas**: Read replicas are provisioned when heavy analytical queries and reporting compete with transactional enrollment and submission writes.

### 14.5 Rollback Strategy
Each deployment image is uniquely tagged with the immutable Git commit SHA. The previous known-good image is retained in the container registry; rolling back is an instantaneous redeployment/traffic shift to the prior verified tag rather than an ad-hoc recompilation.

---

## 9. Future Enhancements (Section 15)

*Ordered roughly by expected value-to-effort ratio for a post-4-week phase:*

1. **Live Classes with Video Conferencing & Collaborative Whiteboard**:
   - WebRTC-based multi-party conferencing via a managed Selective Forwarding Unit (LiveKit / Mediasoup).
   - Real-time collaborative canvas (Fabric.js / Excalidraw engine) with synchronous stroke broadcasting.
2. **Real-Time Peer-to-Peer Study Groups**:
   - Automated matchmaking based on course enrollment, syllabus progression, and overlapping active learning topics.
   - Ephemeral group chat rooms, shared flashcards, and synchronized quiz challenges.
3. **AI Plagiarism & Originality Detection**:
   - Text and code assignment submission analysis using embedding cosine similarity against institutional historical submission corpuses.
   - Synthetic AI generation likelihood scoring with source segment attribution.
4. **Full Payment Gateway & Monetization Engine**:
   - Integration with Stripe, Razorpay, and PayPal for recurring subscription tiers, one-time course sales, promo coupons, and automated instructor revenue share payouts.
5. **Native Mobile Applications (iOS & Android)**:
   - React Native / Expo codebase consuming the existing REST and WebSocket API surface.
   - Native push notifications for assignment deadlines, tutor replies, and streak reminders.
6. **Offline-First Content Sync**:
   - Encrypted local SQLite caching on mobile devices for offline lecture playback and assignment drafting with automatic background sync when reconnected.
7. **Multilingual Localization & Regional AI Tutor Responses**:
   - Full i18n support for UI localization across 12+ languages.
   - Dynamic LLM system prompt switching to respond in the student's regional language while grounding answers in the English syllabus.
8. **Advanced Predictive Analytics & At-Risk Student Flagging**:
   - Machine learning classification identifying early drop-off indicators, quiz score regressions, and low engagement patterns to alert academic advisors.
9. **External LMS Integrations (LTI 1.3 Standard)**:
   - Seamless single sign-on (SSO) and deep linking with Canvas, Blackboard, Moodle, and Google Classroom via the 1EdTech LTI 1.3 Advantage standard.
10. **Voice-Driven Interactive AI Tutor Sessions**:
    - Full-duplex speech-to-speech interaction utilizing ultra-low latency WebSockets for conversational voice tutoring and spoken pronunciation feedback.

---

## 10. Tools Required (Section 16)

### 16.1 Development Environment
- **Node.js (LTS, v20+) and npm/pnpm**: Core runtime for frontend and LMS microservices with high-performance package management.
- **Python 3.11+ and pip/poetry**: Modern asynchronous runtime for FastAPI AI microservice with pgvector, LangChain, and embedding pipelines.
- **Docker Desktop (or Docker Engine + Compose on Linux)**: Local container orchestration replicating staging/production microservices (Postgres, Redis, MinIO, Core API, AI Service).
- **PostgreSQL Client (psql, DBeaver, TablePlus)**: Deep schema inspection, index tuning, and pgvector HNSW vector query verification.
- **Redis CLI or RedisInsight**: In-memory cache inspection, BullMQ background job monitoring, and token blacklist auditing.
- **Git & GitHub Account**: Source control, automated branch protection, PR review flow, and GitHub Actions CI/CD automation.
- **Visual Studio Code**: Recommended extensions: ESLint, Prettier, Docker, Python (Pylance), Thunder Client/Postman for rapid endpoint inspection.

### 16.2 API & Testing Tools
- **Postman or Insomnia**: API endpoint verification, environment variable injection, and automated collection sharing.
- **Jest, Supertest, Pytest, Playwright**: Multi-tier testing suite spanning unit testing (Jest/Pytest), integration HTTP testing (Supertest), and end-to-end browser workflows (Playwright).
- **k6 or Apache JMeter**: Basic and stress load testing, concurrent user throughput simulation, and spike testing prior to production launch.

### 16.3 Cloud & Infrastructure Accounts
- **Cloud Provider Account (AWS, GCP, Azure)**: Managed container hosting (ECS/EKS/Cloud Run), managed PostgreSQL (RDS/Cloud SQL) with pgvector, managed Redis (ElastiCache/MemoryStore), and S3-compatible cloud vaults.
- **Container Registry (Docker Hub, GitHub Container Registry, ECR/GCR)**: Secure automated image storage with vulnerability scanning on merge.
- **Domain Name & DNS Management (Route 53, Cloudflare)**: Zero-downtime routing, SSL termination, and staging/production domain routing.
- **SSL Certificate Provider (Let's Encrypt via Certbot, AWS ACM)**: Automatic TLS 1.3 certificate provisioning and auto-renewal.
- **LLM Provider API Account (Anthropic Claude, OpenAI, Google AI Studio)**: High-throughput API access for Claude 3.5 Sonnet / Gemini models powering grounded RAG, transcript quiz generation, and personalized study planning.

---

End of Document — Vertexon Learning Technologies Pvt. Ltd. — LMS-AI PRD v1.0



