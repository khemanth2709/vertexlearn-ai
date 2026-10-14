# Vertexon LMS-AI Platform Architecture (Section 9 & 10)

## 1. High-Level Architecture Topology
The Vertexon LMS-AI platform follows a distributed microservices pattern:

- **Client Tier**: React 19 SPA with TypeScript, Tailwind CSS, and Recharts.
- **Gateway Tier**: NGINX reverse proxy with SSL termination, path-based routing, and rate limiting.
- **Application Tier**:
  - `Core LMS Service` (Node.js/Express, TypeScript): Manages Auth, Course catalog, Enrollments, Assignments, Quizzes, Gamification and RBAC.
  - `AI Tutor Service` (Python/FastAPI): Manages RAG embeddings, vector retrieval, lecture transcript summarization, quiz generation, and personalized study planning.
  - `Notification & Queue Workers` (BullMQ & Celery): Asynchronous job execution for email notifications, certificate rendering, and background indexing.
- **Data & Persistence Tier**:
  - PostgreSQL 16 (Primary RDBMS): 32 tables with foreign key integrity.
  - pgvector: Vector similarity indexing for semantic document chunks ($HNSW$, cosine distance).
  - Redis 7: Cache, session store, and BullMQ/Celery job queues.
  - S3 / MinIO: Object storage for lecture videos, PDFs, and student assignment attachments.

## 2. Directory Structure Conventions
As specified in Section 10:
- `/frontend`: Client single-page application with components, pages, store, and routes.
- `/backend`: Node.js Express core service with modular domain boundaries.
- `/ai-service`: Python FastAPI microservice with RAG and LLM pipeline.
- `/infra`: Docker compose, NGINX reverse proxy, Kubernetes manifests, and Terraform scripts.
- `/docs`: OpenAPI 3.0 specs and architectural blueprints.

## 3. Deployment Environments & CI/CD Strategy (Section 14)
- **Environments**:
  - `Local`: Docker Compose orchestrating Postgres (pgvector), Redis, MinIO, Core LMS backend, AI Service, and Vite frontend.
  - `Staging`: Single cloud VM / container mirror with automated smoke tests following merge to `main`.
  - `Production`: High-availability multi-AZ managed container hosting (ECS/EKS) fronted by ALB and CloudFront CDN.
- **CI/CD Pipeline**:
  - Pull Requests: Automated linting, unit testing, type checking, and multi-service builds.
  - Merge to `main`: Immutable Docker image build tagged with Git commit SHA, pushed to registry, and deployed to Staging.
  - Tagged Release (`v*.*.*`): Zero-downtime Blue-Green traffic shift on Production ALB with instantaneous rollback capability.
- **Scaling & Resilience**:
  - Stateless Core LMS & AI microservices with horizontal autoscaling (HPA).
  - Redis cache shielding read-heavy catalog and leaderboard queries (> 90% hit rate).
  - AI microservice isolation ensuring heavy RAG / LLM streaming never degrades core CRUD latency.
  - PostgreSQL read replicas for intensive analytical queries.

## 4. Post-v1 Strategic Roadmap (Section 15)
10 key enhancements prioritized by expected value-to-effort ratio:
1. Live classes with WebRTC conferencing (SFU) & collaborative whiteboard.
2. Real-time P2P study groups with semantic topic matchmaking.
3. AI plagiarism and originality detection for assignment submissions.
4. Full payment gateway and instructor monetization engine.
5. Native mobile applications (React Native) with offline sync.
6. Encrypted offline-first lecture playback and note syncing.
7. Multilingual localization and regional language AI tutor responses.
8. Predictive learning analytics and at-risk student intervention alerts.
9. Enterprise LMS integrations (LTI 1.3 standard, Canvas, Blackboard).
10. Low-latency voice-driven conversational AI tutoring sessions.

---
End of Document — Vertexon Learning Technologies Pvt. Ltd. — LMS-AI PRD v1.0

