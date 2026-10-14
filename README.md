# Vertexon LMS-AI Platform

An enterprise-grade, AI-native Learning Management System with deep Retrieval-Augmented Generation (RAG) tutoring, automated assessment generation, and distributed microservices architecture.

## Folder Structure (Section 10)

```text
lms-ai-platform/
|-- frontend/
|   |-- public/
|   |-- src/
|   |   |-- components/
|   |   |   |-- common/
|   |   |   |-- student/
|   |   |   |-- instructor/
|   |   |   |-- admin/
|   |   |   `-- ai-tutor/
|   |   |-- pages/
|   |   |   |-- auth/
|   |   |   |-- dashboard/
|   |   |   |-- course-catalog/
|   |   |   |-- course-player/
|   |   |   |-- quizzes/
|   |   |   `-- admin-panel/
|   |   |-- store/               # Redux Toolkit / Zustand slices
|   |   |-- hooks/
|   |   |-- services/            # API client wrappers (axios)
|   |   |-- layouts/
|   |   |-- utils/
|   |   |-- styles/
|   |   |-- routes/
|   |   `-- App.tsx
|   |-- package.json
|   `-- vite.config.ts
|
|-- backend/
|   |-- src/
|   |   |-- modules/
|   |   |   |-- auth/
|   |   |   |-- users/
|   |   |   |-- courses/
|   |   |   |-- enrollments/
|   |   |   |-- assignments/
|   |   |   |-- quizzes/
|   |   |   |-- gamification/
|   |   |   |-- discussions/
|   |   |   |-- notifications/
|   |   |   `-- admin/
|   |   |-- middleware/          # auth, rbac, rate-limit, error handler
|   |   |-- jobs/                # BullMQ processors
|   |   |-- config/
|   |   |-- db/
|   |   |   |-- migrations/
|   |   |   `-- seeders/
|   |   |-- utils/
|   |   `-- server.ts
|   |-- tests/
|   |-- package.json
|   `-- Dockerfile
|
|-- ai-service/
|   |-- app/
|   |   |-- routers/
|   |   |   |-- chat.py
|   |   |   |-- summarize.py
|   |   |   |-- quiz_gen.py
|   |   |   |-- flashcards.py
|   |   |   `-- study_plan.py
|   |   |-- rag/
|   |   |   |-- chunking.py
|   |   |   |-- embeddings.py
|   |   |   `-- retriever.py
|   |   |-- recommendation/
|   |   |-- models/
|   |   |-- core/                # config, LLM client
|   |   `-- main.py
|   |-- requirements.txt
|   `-- Dockerfile
|
|-- infra/
|   |-- docker-compose.yml
|   |-- k8s/                     # optional, deployment manifests
|   |-- nginx/
|   `-- terraform/               # optional IaC for cloud resources
|
|-- docs/
|   |-- api-spec.yaml            # OpenAPI 3.0
|   `-- architecture.md
|
|-- .github/
|   `-- workflows/
|       |-- ci.yml
|       `-- deploy.yml
|
|-- .env.example
`-- README.md
```

## Quick Start

### Docker Compose
```bash
docker-compose -f infra/docker-compose.yml up --build
```

## Section 14: Deployment Strategy
- **Environments**: Local (Docker Compose), Staging (Cloud VM/ECS mirror), Production (Multi-AZ Managed Containers + ALB + CloudFront CDN).
- **CI/CD Pipeline**: 3-stage GitHub Actions pipeline (`ci.yml` for PR checks, `deploy.yml` for staging and production promotions).
- **Zero-Downtime Rollbacks**: Immutable Docker container tags with Git commit SHAs for instant < 15s traffic shifts.

## Section 15: Future Enhancements (Post-v1)
1. Live WebRTC Classes & Collaborative Whiteboard
2. Real-Time Peer-to-Peer Study Groups
3. AI Plagiarism & Originality Detection
4. Full Payment Gateway & Monetization Engine
5. Native Mobile Apps (React Native)
6. Offline-First Content Sync
7. Full Multilingual UI & Regional AI Responses
8. Predictive Analytics & At-Risk Student Alerts
9. Enterprise LMS Integrations (LTI 1.3)
10. Low-Latency Voice-Driven Conversational AI Tutor

---

End of Document — Vertexon Learning Technologies Pvt. Ltd. — LMS-AI PRD v1.0

