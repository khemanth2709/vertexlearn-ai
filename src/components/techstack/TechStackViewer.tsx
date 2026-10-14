import React, { useState, useMemo } from 'react';
import { useLMS } from '../../context/LMSContext';

export interface TechStackItem {
  id: string;
  layer: string;
  technology: string;
  notes: string;
  category: 'Frontend' | 'Backend' | 'Database' | 'Storage' | 'AI & LLM' | 'Security & Media' | 'DevOps & CI/CD' | 'Observability' | 'Testing';
  categoryTier: 'Tier 1: Client & Presentation' | 'Tier 2: Core Microservices' | 'Tier 3: Persistence & Caching' | 'Tier 4: Media, Speech & Identity' | 'Tier 5: DevOps & Infrastructure' | 'Tier 6: Observability & Quality';
  icon: string;
  accentColor: string;
  versionOrStandard: string;
  monorepoPath: string;
  whyChosen: string[];
  keyCapabilities: string[];
  sampleConfigTitle: string;
  sampleConfigCode: string;
  performanceTarget: string;
  roadmapWeek: 'Week 1' | 'Week 2' | 'Week 3' | 'Week 4';
}

export const TECH_STACK_ITEMS: TechStackItem[] = [
  {
    id: 'frontend',
    layer: 'Frontend',
    technology: 'React 18 + TypeScript, Vite',
    notes: 'Fast dev server, strong typing',
    category: 'Frontend',
    categoryTier: 'Tier 1: Client & Presentation',
    icon: 'react',
    accentColor: 'from-cyan-500 to-blue-600',
    versionOrStandard: 'React 18.3 / Vite 5.x / TypeScript 5.4',
    monorepoPath: 'frontend/src/',
    whyChosen: [
      'Sub-second hot-module replacement (HMR) powered by native ES modules in Vite.',
      'Strict TypeScript interfaces across all LMS entities, quizzes, and chat messages.',
      'Concurrent React rendering for buttery-smooth video player and chat streaming.'
    ],
    keyCapabilities: [
      'Component-driven architecture for Student, Instructor, and Admin dashboards',
      'Zero layout shift course catalog and interactive video chapter timeline',
      'Tree-shakeable client bundles compiled for optimal LCP (<1.2s)'
    ],
    sampleConfigTitle: 'vite.config.ts (Build & Proxy Setup)',
    sampleConfigCode: `// frontend/vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api/v1': {
        target: 'http://localhost:5000',
        changeOrigin: true
      },
      '/ai/v1': {
        target: 'http://localhost:8000',
        changeOrigin: true
      }
    }
  },
  build: {
    target: 'esnext',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          video: ['video.js', 'hls.js'],
          charts: ['recharts', 'lucide-react']
        }
      }
    }
  }
});`,
    performanceTarget: 'Initial bundle <180KB gzip, HMR reload <80ms',
    roadmapWeek: 'Week 1'
  },
  {
    id: 'state_management',
    layer: 'State Management',
    technology: 'Redux Toolkit (or Zustand)',
    notes: 'Predictable global state for auth/course/session data',
    category: 'Frontend',
    categoryTier: 'Tier 1: Client & Presentation',
    icon: 'zustand',
    accentColor: 'from-purple-500 to-indigo-600',
    versionOrStandard: 'Zustand 4.5+ with devtools & persist middleware',
    monorepoPath: 'frontend/src/store/',
    whyChosen: [
      'Zero boilerplate compared to classical Redux; negligible runtime weight (~1.2kB).',
      'Atomic selector subscriptions avoid unnecessary re-renders during high-frequency chat streams and video tick updates.',
      'Seamless localStorage synchronization for active student session tokens.'
    ],
    keyCapabilities: [
      'Auth Slice: Access token, decoded JWT claims, role state',
      'Player Slice: Active lecture playback position, bookmarks, playback rate',
      'AI Tutor Slice: Real-time SSE streaming token buffer and grounded citation pills'
    ],
    sampleConfigTitle: 'useAuthStore.ts (Zustand Global State)',
    sampleConfigCode: `// frontend/src/store/useAuthStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AuthState {
  user: { id: string; email: string; role: 'student' | 'instructor' | 'admin' } | null;
  accessToken: string | null;
  setAuth: (user: AuthState['user'], token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      setAuth: (user, accessToken) => set({ user, accessToken }),
      logout: () => set({ user: null, accessToken: null })
    }),
    { name: 'lms_auth_session' }
  )
);`,
    performanceTarget: 'Zero selector re-render overhead; state updates in <1ms',
    roadmapWeek: 'Week 1'
  },
  {
    id: 'styling',
    layer: 'Styling',
    technology: 'Tailwind CSS',
    notes: 'Utility-first, fast to theme (incl. dark mode)',
    category: 'Frontend',
    categoryTier: 'Tier 1: Client & Presentation',
    icon: 'tailwind',
    accentColor: 'from-sky-400 to-cyan-600',
    versionOrStandard: 'Tailwind CSS v3.4+ / @tailwindcss/typography',
    monorepoPath: 'frontend/src/styles/',
    whyChosen: [
      'Atomic CSS output guaranteeing tiny production stylesheets (<18KB total).',
      'Effortless dark mode theming with crisp contrast designed for high readability.',
      'Standardized spacing and typographic scale across all three role portals.'
    ],
    keyCapabilities: [
      'Semantic color tokens (deep obsidian bg, electric cyan accents, emerald success states)',
      'Rich typography styles for AI Markdown tutor answers and markdown lesson contents',
      'Responsive design breakpoints for mobile learner tablets and multi-monitor instructor dashboards'
    ],
    sampleConfigTitle: 'tailwind.config.js (Theme Tokens)',
    sampleConfigCode: `// frontend/tailwind.config.js
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          950: '#050c18',
          900: '#0a1628',
          800: '#112240',
          accent: '#22d3ee'
        }
      }
    }
  },
  plugins: [require('@tailwindcss/typography')]
};`,
    performanceTarget: 'CSS bundle <16KB gzipped; zero runtime layout recalculation',
    roadmapWeek: 'Week 1'
  },
  {
    id: 'data_fetching',
    layer: 'Frontend Data Fetching',
    technology: 'TanStack Query (React Query)',
    notes: 'Caching, retries, background refetch',
    category: 'Frontend',
    categoryTier: 'Tier 1: Client & Presentation',
    icon: 'tanstack',
    accentColor: 'from-amber-500 to-red-500',
    versionOrStandard: 'TanStack Query v5.x',
    monorepoPath: 'frontend/src/services/',
    whyChosen: [
      'Eliminates async state boilerplate (loading, error, cached state).',
      'Intelligent stale-while-revalidate background updates when course lectures or quizzes are graded.',
      'Built-in exponential backoff retries for resilient API communications.'
    ],
    keyCapabilities: [
      'Automatic query invalidation upon assignment submission or quiz attempt completion',
      'Optimistic updates for course bookmarks, discussion likes, and note creation',
      'Window focus refetching keeps student progress synced across multiple tabs'
    ],
    sampleConfigTitle: 'useCourseQuery.ts (Query Hook)',
    sampleConfigCode: `// frontend/src/services/courseQueries.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from './apiClient';

export function useCourse(courseId: string) {
  return useQuery({
    queryKey: ['courses', courseId],
    queryFn: () => api.get(\`/api/v1/courses/\${courseId}\`).then(res => res.data),
    staleTime: 5 * 60 * 1000 // 5 minutes fresh
  });
}

export function useEnrollCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (courseId: string) => api.post(\`/api/v1/enrollments/\${courseId}\`),
    onSuccess: (_, courseId) => {
      queryClient.invalidateQueries({ queryKey: ['courses', courseId] });
      queryClient.invalidateQueries({ queryKey: ['my_enrollments'] });
    }
  });
}`,
    performanceTarget: 'Instant UI from cache (0ms perceived latency); auto-sync',
    roadmapWeek: 'Week 1'
  },
  {
    id: 'backend_core',
    layer: 'Backend (Core LMS)',
    technology: 'Node.js + Express (or NestJS) + TypeScript',
    notes: 'REST APIs, RBAC middleware',
    category: 'Backend',
    categoryTier: 'Tier 2: Core Microservices',
    icon: 'node',
    accentColor: 'from-emerald-500 to-teal-600',
    versionOrStandard: 'Node.js 20 LTS / Express 4.19 / TypeScript 5.x',
    monorepoPath: 'backend/src/',
    whyChosen: [
      'Unified TypeScript language across frontend and backend shared types/DTOs.',
      'High I/O concurrency handling thousands of simultaneous video checkpoint pings.',
      'Extensive middleware ecosystem for rate-limiting, CORS, and role-based access control.'
    ],
    keyCapabilities: [
      'Modular clean architecture: modules/auth, courses, enrollments, quizzes, assignments',
      'Strict RBAC middleware (requireRole, requireOwnership) enforcing permissions matrix',
      'Transaction management for atomic enrollment and multi-part quiz auto-grading'
    ],
    sampleConfigTitle: 'server.ts & rbacMiddleware.ts',
    sampleConfigCode: `// backend/src/middleware/rbac.ts
import { Request, Response, NextFunction } from 'express';

export function requireRole(...allowedRoles: Array<'student' | 'instructor' | 'admin'>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;
    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Insufficient role permissions for this endpoint'
      });
    }
    next();
  };
}`,
    performanceTarget: 'API response times <35ms p95; handles 2,500+ req/sec',
    roadmapWeek: 'Week 1'
  },
  {
    id: 'backend_ai',
    layer: 'Backend (AI Service)',
    technology: 'Python + FastAPI',
    notes: 'Best ecosystem fit for RAG/embedding pipelines',
    category: 'Backend',
    categoryTier: 'Tier 2: Core Microservices',
    icon: 'python',
    accentColor: 'from-blue-500 to-cyan-500',
    versionOrStandard: 'Python 3.11 / FastAPI 0.110+ / Pydantic v2',
    monorepoPath: 'ai-service/app/',
    whyChosen: [
      'First-class support for scientific computing, text chunking, and embedding libraries.',
      'Asynchronous ASGI server with native Server-Sent Events (SSE) streaming for real-time AI Tutor responses.',
      'Auto-generated OpenAPI 3.0 documentation and Pydantic validation.'
    ],
    keyCapabilities: [
      'RAG pipeline: Recursive transcript chunking, embedding generation & pgvector similarity retriever',
      'AI Tutor streaming router with strict source-grounded citations [Lesson X, timestamp Y]',
      'Generative endpoints for flashcards, lesson summaries, and adaptive quiz generation'
    ],
    sampleConfigTitle: 'ai-service/app/routers/chat.py',
    sampleConfigCode: `# ai-service/app/routers/chat.py
from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from app.rag.retriever import retrieve_context_chunks
from app.core.anthropic_client import stream_tutor_response

router = APIRouter(prefix="/ai/v1", tags=["AI Tutor"])

@router.post("/chat")
async def chat_with_tutor(payload: ChatRequest):
    # 1. Retrieve top-k lecture chunks from pgvector
    relevant_chunks = await retrieve_context_chunks(
        course_id=payload.course_id,
        query=payload.question,
        limit=5
    )
    # 2. Stream grounded answer with citations
    return StreamingResponse(
        stream_tutor_response(payload.question, relevant_chunks, payload.difficulty_mode),
        media_type="text/event-stream"
    )`,
    performanceTarget: 'TTFT (Time-to-first-token) <650ms; streaming 45 tok/sec',
    roadmapWeek: 'Week 3'
  },
  {
    id: 'database',
    layer: 'Database',
    technology: 'PostgreSQL 15+',
    notes: 'Relational integrity for LMS entities',
    category: 'Database',
    categoryTier: 'Tier 3: Persistence & Caching',
    icon: 'postgres',
    accentColor: 'from-blue-600 to-indigo-700',
    versionOrStandard: 'PostgreSQL 15.6+ with ACID guarantees',
    monorepoPath: 'backend/src/db/',
    whyChosen: [
      'Bulletproof relational integrity for users, enrollments, course hierarchies, and grading.',
      'Robust JSONB columns for flexible quiz option payloads and grading rubrics.',
      'Native support for the pgvector extension within the same reliable storage engine.'
    ],
    keyCapabilities: [
      'Foreign key constraints preventing orphan progress or enrollment records',
      'Partition-ready design for high-volume lecture watch sessions and analytics events',
      'Composite indexes for instantaneous sub-10ms catalog filtering and progress lookups'
    ],
    sampleConfigTitle: '001_create_schema.sql (Postgres Migration)',
    sampleConfigCode: `-- backend/src/db/migrations/001_initial_lms_schema.sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(32) NOT NULL CHECK (role IN ('student', 'instructor', 'admin')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    instructor_id UUID REFERENCES users(id) ON DELETE RESTRICT,
    title VARCHAR(255) NOT NULL,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_courses_published ON courses(is_published, created_at DESC);`,
    performanceTarget: 'Transaction latency <4ms; 100% ACID compliance',
    roadmapWeek: 'Week 1'
  },
  {
    id: 'vector_store',
    layer: 'Vector Store',
    technology: 'pgvector (Postgres extension)',
    notes: 'Avoids running a separate vector DB at this scale',
    category: 'Database',
    categoryTier: 'Tier 3: Persistence & Caching',
    icon: 'vector',
    accentColor: 'from-violet-500 to-purple-700',
    versionOrStandard: 'pgvector v0.6+ (vector(1536) / HNSW indexing)',
    monorepoPath: 'ai-service/app/rag/',
    whyChosen: [
      'Eliminates operational cost and synchronizing complexity of a secondary vector DB (Pinecone/Milvus).',
      'Enables transactional consistency: deleting or updating a lesson automatically cascades to its vectors.',
      'HNSW (Hierarchical Navigable Small World) indexing delivers sub-10ms approximate nearest neighbor queries.'
    ],
    keyCapabilities: [
      'Cosine distance (`<=>`) matching between user query embeddings and lecture chunks',
      'Multi-tenant metadata filtering (e.g. `course_id = :id AND is_active = true`) in a single SQL query',
      'Seamless indexing of 100,000+ course transcript snippets with minimal RAM overhead'
    ],
    sampleConfigTitle: 'schema_vector.sql (HNSW Indexing)',
    sampleConfigCode: `-- ai-service/rag/schema.sql
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE document_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    lecture_id UUID NOT NULL REFERENCES lectures(id) ON DELETE CASCADE,
    chunk_index INT NOT NULL,
    content TEXT NOT NULL,
    timestamp_start_sec INT NOT NULL,
    timestamp_end_sec INT NOT NULL,
    embedding vector(1536) NOT NULL
);

-- HNSW index for ultra-fast cosine similarity retrieval
CREATE INDEX idx_chunks_hnsw 
ON document_chunks USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);`,
    performanceTarget: 'Similarity search query latency <12ms across 100k chunks',
    roadmapWeek: 'Week 3'
  },
  {
    id: 'cache_queue',
    layer: 'Cache / Queue',
    technology: 'Redis + BullMQ (Node) / Celery (Python)',
    notes: 'Caching + background jobs',
    category: 'Storage',
    categoryTier: 'Tier 3: Persistence & Caching',
    icon: 'redis',
    accentColor: 'from-red-500 to-rose-600',
    versionOrStandard: 'Redis 7.2 / BullMQ 5.x / Celery 5.3',
    monorepoPath: 'backend/src/jobs/',
    whyChosen: [
      'In-memory key-value store with sub-millisecond read latency for hot course data and rate-limits.',
      'BullMQ provides robust distributed job scheduling, exponential retry policies, and dead-letter queues.',
      'Decouples CPU-heavy operations (video encoding, PDF generation, transcript chunking) from web requests.'
    ],
    keyCapabilities: [
      'Session token blacklist and distributed API rate limiter (sliding window)',
      'Queue: lecture-transcription-queue, certificate-render-queue, daily-streak-cron',
      'Pub/Sub capabilities for real-time notifications and system-wide broadcast alerts'
    ],
    sampleConfigTitle: 'worker.ts (BullMQ Job Processor)',
    sampleConfigCode: `// backend/src/jobs/certificateWorker.ts
import { Worker, Queue } from 'bullmq';
import { redisConnection } from '../config/redis';
import { generateCertificatePdf } from '../services/pdfService';

export const certQueue = new Queue('certificate-generation', { connection: redisConnection });

export const certWorker = new Worker(
  'certificate-generation',
  async (job) => {
    const { studentId, courseId, completionDate } = job.data;
    const pdfUrl = await generateCertificatePdf(studentId, courseId, completionDate);
    return { pdfUrl };
  },
  { connection: redisConnection, concurrency: 5 }
);`,
    performanceTarget: 'Cache hit latency <1.5ms; queue throughput 500+ jobs/min',
    roadmapWeek: 'Week 1'
  },
  {
    id: 'object_storage',
    layer: 'Object Storage',
    technology: 'AWS S3 (or MinIO for local dev)',
    notes: 'Video, PDFs, certificates',
    category: 'Storage',
    categoryTier: 'Tier 3: Persistence & Caching',
    icon: 's3',
    accentColor: 'from-amber-600 to-orange-700',
    versionOrStandard: 'AWS S3 / S3-Compatible API (MinIO for Dev)',
    monorepoPath: 'infra/docker-compose.yml',
    whyChosen: [
      'Virtually unlimited scalable storage with 99.999999999% (11 9s) durability.',
      'Local dev parity with MinIO container eliminates cloud costs during development.',
      'Direct-to-S3 pre-signed upload URLs prevent multi-gigabyte video uploads from choking the Node.js API.'
    ],
    keyCapabilities: [
      'Presigned PUT URLs for direct instructor video lecture uploads',
      'Public-read / CloudFront CDN origin access identity for encrypted course assets',
      'Lifecycle policies automatically transitioning older assignment attachments to Glacier'
    ],
    sampleConfigTitle: 's3UploadService.ts (Presigned URLs)',
    sampleConfigCode: `// backend/src/services/s3Service.ts
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3 = new S3Client({ region: process.env.AWS_REGION || 'us-east-1' });

export async function getPresignedUploadUrl(key: string, contentType: string) {
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
    ContentType: contentType
  });
  // Valid for 15 minutes
  return getSignedUrl(s3, command, { expiresIn: 900 });
}`,
    performanceTarget: 'Zero backend bandwidth consumed on media uploads',
    roadmapWeek: 'Week 2'
  },
  {
    id: 'llm_provider',
    layer: 'LLM Provider',
    technology: 'Anthropic API (Claude models)',
    notes: 'Chat, summarization, quiz generation',
    category: 'AI & LLM',
    categoryTier: 'Tier 2: Core Microservices',
    icon: 'claude',
    accentColor: 'from-amber-500 to-orange-600',
    versionOrStandard: 'Claude 3.5 Sonnet / Claude 3 Haiku',
    monorepoPath: 'ai-service/app/core/',
    whyChosen: [
      'Superior reasoning, high nuance, and strict adherence to grounding system prompts (eliminates hallucinations).',
      'Claude 3.5 Sonnet delivers exceptional multi-step pedagogical explanations and code breakdown.',
      'Claude 3 Haiku provides rapid sub-300ms latency for low-cost automated flashcard and quiz generation.'
    ],
    keyCapabilities: [
      'AI Tutor: Socratic dialogue with timestamp-anchored citations from course transcripts',
      'Quiz Generator: Automatic extraction of 5 multiple-choice questions per lecture with distractors',
      'Study Plan Synthesizer: Personalized schedule recommendations calibrated to student test weaknesses'
    ],
    sampleConfigTitle: 'anthropic_client.py (Tutor Streaming)',
    sampleConfigCode: `# ai-service/app/core/anthropic_client.py
import os
from anthropic import AsyncAnthropic

client = AsyncAnthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))

SYSTEM_PROMPT = """You are an expert AI Learning Tutor.
Answer student questions strictly based on the provided course lecture context chunks.
Always include accurate source citations formatted as [Lesson X, 04:32].
If the context does not contain the answer, politely guide the student to ask relevant course topics."""

async def stream_tutor_response(question: str, context: str, mode: str):
    async with client.messages.stream(
        model="claude-3-5-sonnet-20241022",
        max_tokens=1024,
        system=f"{SYSTEM_PROMPT}\\nPedagogical Mode: {mode}",
        messages=[{"role": "user", "content": f"Context:\\n{context}\\n\\nStudent Question: {question}"}]
    ) as stream:
        async for text in stream.text_stream:
            yield f"data: {text}\\n\\n"`,
    performanceTarget: 'Streaming start <600ms; strict anti-hallucination compliance',
    roadmapWeek: 'Week 3'
  },
  {
    id: 'auth',
    layer: 'Auth',
    technology: 'JWT (access + refresh), bcrypt/argon2',
    notes: 'Stateless auth',
    category: 'Security & Media',
    categoryTier: 'Tier 4: Media, Speech & Identity',
    icon: 'lock',
    accentColor: 'from-emerald-400 to-cyan-500',
    versionOrStandard: 'Argon2id / RS256 or HS256 JWT tokens',
    monorepoPath: 'backend/src/modules/auth/',
    whyChosen: [
      'Stateless JWT access tokens eliminate per-request database lookups across API endpoints.',
      'Argon2id password hashing is memory-hard and state-of-the-art against GPU/ASIC brute-force attacks.',
      'Dual-token rotation (15m short-lived access token, 7d refresh token in httpOnly cookie).'
    ],
    keyCapabilities: [
      'Granular claims payload: `{ userId, role, permissions, exp, iat }`',
      'Silent token refresh handling without interrupting active lecture viewing',
      'Instant logout with Redis-backed revocation blacklist for emergency account lockouts'
    ],
    sampleConfigTitle: 'tokenService.ts (JWT Issuance & Verification)',
    sampleConfigCode: `// backend/src/modules/auth/tokenService.ts
import jwt from 'jsonwebtoken';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

export function issueTokens(user: { id: string; role: string }) {
  const accessToken = jwt.sign(
    { sub: user.id, role: user.role },
    ACCESS_SECRET,
    { expiresIn: '15m' }
  );
  const refreshToken = jwt.sign(
    { sub: user.id },
    REFRESH_SECRET,
    { expiresIn: '7d' }
  );
  return { accessToken, refreshToken };
}`,
    performanceTarget: 'Token verification <0.2ms; zero database roundtrip on API calls',
    roadmapWeek: 'Week 1'
  },
  {
    id: 'video_delivery',
    layer: 'Video Delivery',
    technology: 'HLS via a CDN in front of S3',
    notes: 'Progressive/adaptive streaming',
    category: 'Security & Media',
    categoryTier: 'Tier 4: Media, Speech & Identity',
    icon: 'video',
    accentColor: 'from-red-500 to-indigo-600',
    versionOrStandard: 'HTTP Live Streaming (HLS RFC 8216) / CloudFront CDN',
    monorepoPath: 'infra/nginx/',
    whyChosen: [
      'Adaptive bitrate streaming automatically scales resolution (360p, 720p, 1080p) to match user bandwidth.',
      'Edge CDN caching prevents bandwidth spikes on origin storage and guarantees instant playback start (<400ms).',
      'Segmented .ts/.m4s chunks prevent piracy by avoiding exposing single downloadable raw video files.'
    ],
    keyCapabilities: [
      'Multi-bitrate variant playlists (.m3u8 master manifest)',
      'Signed CDN cookies/URLs for copyrighted instructor course material',
      'Playback resume with exact timestamp synchronization across device transitions'
    ],
    sampleConfigTitle: 'ffmpeg_hls.sh (Adaptive Transcode Pipeline)',
    sampleConfigCode: `#!/bin/bash
# Transcode lecture mp4 to HLS multi-bitrate ladder
ffmpeg -i input_lecture.mp4 \\
  -filter_complex \\
  "[0:v]split=3[v1][v2][v3]; \\
   [v1]scale=w=1920:h=1080[v1out]; \\
   [v2]scale=w=1280:h=720[v2out]; \\
   [v3]scale=w=854:h=480[v3out]" \\
  -map "[v1out]" -c:v:0 libx264 -b:v:0 4500k \\
  -map "[v2out]" -c:v:1 libx264 -b:v:1 2200k \\
  -map "[v3out]" -c:v:2 libx264 -b:v:2 800k \\
  -map a:0 -c:a aac -b:a 128k \\
  -f hls -hls_time 6 -hls_playlist_type vod \\
  -master_pl_name master.m3u8 \\
  -var_stream_map "v:0,a:0 v:1,a:0 v:2,a:0" \\
  lecture_%v.m3u8`,
    performanceTarget: 'Buffer start <400ms; adaptive switching across 480p-1080p',
    roadmapWeek: 'Week 2'
  },
  {
    id: 'stt',
    layer: 'Speech-to-Text',
    technology: 'Whisper (self-hosted) or managed STT API',
    notes: 'Lecture transcription',
    category: 'Security & Media',
    categoryTier: 'Tier 4: Media, Speech & Identity',
    icon: 'mic',
    accentColor: 'from-teal-400 to-emerald-600',
    versionOrStandard: 'OpenAI Whisper large-v3 / faster-whisper',
    monorepoPath: 'ai-service/app/rag/transcribe.py',
    whyChosen: [
      'Industry-leading word error rate (WER <4%) across technical and accented speech.',
      'Produces word-level and sentence-level timestamps essential for precise video jump links in AI citations.',
      'Self-hosted faster-whisper on GPU reduces transcription costs to near zero for high-volume uploads.'
    ],
    keyCapabilities: [
      'Automatic caption (WebVTT / SRT) generation for accessible video player controls',
      'Feeds timestamped text directly into the RAG vector ingestion pipeline',
      'Multi-language transcription and automatic translation capabilities'
    ],
    sampleConfigTitle: 'transcribe.py (faster-whisper pipeline)',
    sampleConfigCode: `# ai-service/app/rag/transcribe.py
from faster_whisper import WhisperModel

model = WhisperModel("medium.en", device="cuda", compute_type="float16")

def transcribe_lecture_audio(audio_path: str):
    segments, info = model.transcribe(audio_path, beam_size=5)
    transcription_data = []
    
    for segment in segments:
        transcription_data.append({
            "start": round(segment.start, 2),
            "end": round(segment.end, 2),
            "text": segment.text.strip()
        })
    return transcription_data`,
    performanceTarget: '1 hour of lecture audio transcribed in ~3.2 minutes on GPU',
    roadmapWeek: 'Week 3'
  },
  {
    id: 'pdf_gen',
    layer: 'PDF Generation',
    technology: 'Puppeteer / pdf-lib',
    notes: 'Certificates',
    category: 'Security & Media',
    categoryTier: 'Tier 4: Media, Speech & Identity',
    icon: 'file',
    accentColor: 'from-rose-500 to-red-600',
    versionOrStandard: 'pdf-lib v1.17+ / Puppeteer Core v22',
    monorepoPath: 'backend/src/utils/pdfGenerator.ts',
    whyChosen: [
      'Pixel-perfect vector certificate rendering with custom fonts, instructor signatures, and golden seals.',
      'pdf-lib provides fast, low-memory direct PDF manipulation without launching headless Chrome.',
      'Puppeteer handles rich CSS-driven certificate templates with QR code verification stamps.'
    ],
    keyCapabilities: [
      'Cryptographically verifiable certificate hash embedded as an on-page QR code',
      'Automated background generation upon completing 100% of lectures and passing final quiz',
      'Exports directly to AWS S3 bucket with permanent CDN download URL'
    ],
    sampleConfigTitle: 'certificateRenderer.ts',
    sampleConfigCode: `// backend/src/utils/pdfGenerator.ts
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export async function createCertificatePdf(studentName: string, courseTitle: string, certId: string) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([842, 595]); // A4 Landscape
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  page.drawText('CERTIFICATE OF COMPLETION', {
    x: 220, y: 480, size: 28, font, color: rgb(0.08, 0.18, 0.36)
  });
  page.drawText(\`Awarded to: \${studentName}\`, {
    x: 280, y: 340, size: 22, font, color: rgb(0.1, 0.1, 0.1)
  });
  page.drawText(\`Course: \${courseTitle}\`, {
    x: 250, y: 280, size: 16, font, color: rgb(0.3, 0.3, 0.3)
  });
  page.drawText(\`Verification ID: \${certId}\`, {
    x: 50, y: 40, size: 10, font, color: rgb(0.5, 0.5, 0.5)
  });
  
  return await pdfDoc.save();
}`,
    performanceTarget: 'Generation time <120ms; file size <95KB vector PDF',
    roadmapWeek: 'Week 2'
  },
  {
    id: 'containerization',
    layer: 'Containerization',
    technology: 'Docker + Docker Compose',
    notes: 'Local dev parity with prod',
    category: 'DevOps & CI/CD',
    categoryTier: 'Tier 5: DevOps & Infrastructure',
    icon: 'docker',
    accentColor: 'from-blue-500 to-sky-600',
    versionOrStandard: 'Docker 26.x / Docker Compose v2.27',
    monorepoPath: 'infra/docker-compose.yml',
    whyChosen: [
      'Eliminates the "works on my machine" syndrome across PostgreSQL, pgvector, Redis, and MinIO.',
      'Single command (`docker compose up -d`) spins up the entire LMS infrastructure in under 45 seconds.',
      'Multi-stage Dockerfiles create featherweight production runtime images (<90MB).'
    ],
    keyCapabilities: [
      'Orchestrates 6 core local containers: backend, ai-service, postgres-pgvector, redis, minio, nginx',
      'Persistent volume mounts for local development databases and object storage buckets',
      'Production-parity environment variable isolation'
    ],
    sampleConfigTitle: 'infra/docker-compose.yml',
    sampleConfigCode: `# infra/docker-compose.yml
version: '3.8'

services:
  postgres:
    image: pgvector/pgvector:pg15
    environment:
      POSTGRES_DB: lms_db
      POSTGRES_USER: lms_user
      POSTGRES_PASSWORD: secret_password
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  backend:
    build:
      context: ../backend
      dockerfile: Dockerfile
    ports:
      - "5000:5000"
    depends_on:
      - postgres
      - redis

  ai-service:
    build:
      context: ../ai-service
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    depends_on:
      - postgres

volumes:
  pgdata:`,
    performanceTarget: 'Cold start complete environment <45s; zero config drift',
    roadmapWeek: 'Week 1'
  },
  {
    id: 'orchestration',
    layer: 'Orchestration (optional)',
    technology: 'Kubernetes (minikube / managed K8s)',
    notes: 'Only if scaling beyond single-node deploy',
    category: 'DevOps & CI/CD',
    categoryTier: 'Tier 5: DevOps & Infrastructure',
    icon: 'k8s',
    accentColor: 'from-indigo-500 to-blue-700',
    versionOrStandard: 'Kubernetes v1.29+ / Helm 3',
    monorepoPath: 'infra/k8s/',
    whyChosen: [
      'Horizontal Pod Autoscaling (HPA) automatically scales the AI Tutor pods during study peak hours.',
      'Rolling zero-downtime updates and automated health-check restarts.',
      'Declarative GitOps deployments managed via Helm charts.'
    ],
    keyCapabilities: [
      'Separate node pools for compute-heavy AI/Whisper workers vs high-IOPS PostgreSQL storage',
      'Ingress controller with automated Let’s Encrypt SSL certificate provisioning',
      'Secrets encryption at rest with AWS KMS or HashiCorp Vault'
    ],
    sampleConfigTitle: 'infra/k8s/ai-tutor-deployment.yaml',
    sampleConfigCode: `# infra/k8s/ai-service-hpa.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: ai-tutor-scaler
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: ai-service
  minReplicas: 2
  maxReplicas: 12
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70`,
    performanceTarget: 'Auto-scale from 2 to 12 pods in <90 seconds',
    roadmapWeek: 'Week 4'
  },
  {
    id: 'cicd',
    layer: 'CI/CD',
    technology: 'GitHub Actions',
    notes: 'Lint, test, build, deploy pipeline',
    category: 'DevOps & CI/CD',
    categoryTier: 'Tier 5: DevOps & Infrastructure',
    icon: 'github',
    accentColor: 'from-slate-600 to-indigo-800',
    versionOrStandard: 'GitHub Actions (Ubuntu-latest runner)',
    monorepoPath: '.github/workflows/',
    whyChosen: [
      'Zero-infrastructure automated pipelines tightly bound to pull requests and merges.',
      'Parallel job matrix runs TypeScript typecheck, Python lint, and unit tests concurrently.',
      'Automated preview environments for each PR and staging deployment on merge to main.'
    ],
    keyCapabilities: [
      'Path-filtered triggers: only builds `ai-service` when files in `ai-service/**` change',
      'Docker image building with automated GitHub Container Registry (GHCR) caching',
      'Automated semantic releases and changelog generation'
    ],
    sampleConfigTitle: '.github/workflows/ci.yml',
    sampleConfigCode: `# .github/workflows/ci.yml
name: Monorepo CI Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  backend-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: cd backend && npm ci
      - run: cd backend && npm test

  ai-service-lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      - run: cd ai-service && pip install -r requirements.txt
      - run: cd ai-service && pytest`,
    performanceTarget: 'Total pipeline execution time <3 minutes with layer caching',
    roadmapWeek: 'Week 1'
  },
  {
    id: 'monitoring',
    layer: 'Monitoring',
    technology: 'Prometheus + Grafana (or hosted APM)',
    notes: 'Metrics, health checks',
    category: 'Observability',
    categoryTier: 'Tier 6: Observability & Quality',
    icon: 'grafana',
    accentColor: 'from-orange-500 to-amber-600',
    versionOrStandard: 'Prometheus v2.50+ / Grafana 10.x',
    monorepoPath: 'backend/src/middleware/metrics.ts',
    whyChosen: [
      'Industry standard open-source time-series metric collection and real-time dashboarding.',
      'Exposes critical telemetry: HTTP error rates (5xx), AI Tutor token generation latencies, and BullMQ queue backlogs.',
      'Configurable alertmanager alerts dispatching to Slack / PagerDuty upon SLA breaches.'
    ],
    keyCapabilities: [
      'RED method tracking: Rate (req/s), Errors (%), Duration (p50/p95/p99)',
      'Custom metrics: active student watch sessions, LLM prompt tokens consumed, cache hit ratio',
      'Database connection pool saturation and query execution duration gauges'
    ],
    sampleConfigTitle: 'metrics.ts (prom-client middleware)',
    sampleConfigCode: `// backend/src/middleware/metrics.ts
import client from 'prom-client';

client.collectDefaultMetrics({ prefix: 'lms_' });

export const httpRequestDuration = new client.Histogram({
  name: 'lms_http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 2, 5]
});

export const aiTutorLatency = new client.Histogram({
  name: 'lms_ai_tutor_ttft_seconds',
  help: 'Time to first token for AI tutor completions',
  buckets: [0.2, 0.5, 0.8, 1.2, 2.0]
});`,
    performanceTarget: 'Scrape overhead <0.5% CPU; instant alert notifications <10s',
    roadmapWeek: 'Week 4'
  },
  {
    id: 'logging',
    layer: 'Logging',
    technology: 'Winston (Node) / structlog (Python)',
    notes: 'Structured logs, centralized via Loki/CloudWatch',
    category: 'Observability',
    categoryTier: 'Tier 6: Observability & Quality',
    icon: 'log',
    accentColor: 'from-slate-500 to-zinc-700',
    versionOrStandard: 'Winston 3.13 / Structlog 24.1 (JSON Output)',
    monorepoPath: 'backend/src/utils/logger.ts',
    whyChosen: [
      'Structured JSON log format enables effortless querying in Grafana Loki or AWS CloudWatch Insights.',
      'Correlates traces via unique `x-request-id` headers traversing frontend -> Node.js -> Python AI service.',
      'Prevents PII or student password leakage via built-in sanitization redactors.'
    ],
    keyCapabilities: [
      'Log levels: DEBUG, INFO, WARN, ERROR, AUDIT (for compliance/FERPA actions)',
      'Automatic metadata injection: timestamp, environment, service name, git commit sha',
      'Asynchronous non-blocking transport buffers to avoid slowing down API requests'
    ],
    sampleConfigTitle: 'logger.ts (Winston JSON Structured Logger)',
    sampleConfigCode: `// backend/src/utils/logger.ts
import winston from 'winston';

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'core-lms-service' },
  transports: [
    new winston.transports.Console()
  ]
});

// Example usage
logger.info('Student completed quiz assessment', {
  studentId: 'usr_8923',
  quizId: 'qz_441',
  score: 95,
  passed: true
});`,
    performanceTarget: 'Log ingestion throughput >50,000 events/sec without blocking',
    roadmapWeek: 'Week 4'
  },
  {
    id: 'testing',
    layer: 'Testing',
    technology: 'Jest, Supertest, Pytest, Playwright',
    notes: 'Backend, AI service, frontend/E2E',
    category: 'Testing',
    categoryTier: 'Tier 6: Observability & Quality',
    icon: 'test',
    accentColor: 'from-emerald-500 to-green-600',
    versionOrStandard: 'Jest 29 / Supertest 6 / Pytest 8 / Playwright 1.43',
    monorepoPath: 'backend/tests/ & ai-service/tests/',
    whyChosen: [
      'Full test pyramid coverage: fast unit tests (Jest/Pytest), API integration (Supertest), and critical user flow E2E (Playwright).',
      'Ensures critical educational milestones (quiz grading, progress tracking, AI Tutor groundings) never regress.',
      'Headless browser testing guarantees cross-browser video player fidelity on Chromium, Firefox, and WebKit.'
    ],
    keyCapabilities: [
      'Unit Tests: Quiz auto-grading engine, certificate checksum calculations',
      'Integration Tests: Auth JWT issuance, RBAC permission gate checks, enrollment transactions',
      'E2E Tests: Full student loop — Registration -> Course Catalog -> Video Playback -> AI Tutor question -> Certificate earned'
    ],
    sampleConfigTitle: 'auth.test.ts & tutor_test.py',
    sampleConfigCode: `// backend/tests/auth.test.ts
import request from 'supertest';
import app from '../src/server';

describe('POST /api/v1/auth/login', () => {
  it('should return 200 and JWT tokens for valid credentials', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'student@example.com', password: 'ValidPassword123!' });
      
    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeDefined();
    expect(res.body.user.role).toBe('student');
  });

  it('should reject invalid passwords with 401 Unauthorized', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'student@example.com', password: 'WrongPassword' });
      
    expect(res.status).toBe(401);
  });
});`,
    performanceTarget: 'Unit test suite <15s; 100% critical route test coverage',
    roadmapWeek: 'Week 4'
  }
];

export const CATEGORIES = [
  'ALL',
  'Frontend',
  'Backend',
  'Database',
  'Storage',
  'AI & LLM',
  'Security & Media',
  'DevOps & CI/CD',
  'Observability',
  'Testing'
] as const;

export const TIERS = [
  'ALL',
  'Tier 1: Client & Presentation',
  'Tier 2: Core Microservices',
  'Tier 3: Persistence & Caching',
  'Tier 4: Media, Speech & Identity',
  'Tier 5: DevOps & Infrastructure',
  'Tier 6: Observability & Quality'
] as const;

export const TechStackViewer: React.FC = () => {
  const { setCurrentView } = useLMS();

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedTier, setSelectedTier] = useState<string>('ALL');
  const [selectedItem, setSelectedItem] = useState<TechStackItem>(TECH_STACK_ITEMS[0]);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedMarkdown, setCopiedMarkdown] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'grid' | 'table' | 'topology'>('grid');

  // Filtered items
  const filteredItems = useMemo(() => {
    return TECH_STACK_ITEMS.filter((item) => {
      const matchesSearch =
        searchQuery === '' ||
        item.layer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.technology.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.keyCapabilities.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCat = selectedCategory === 'ALL' || item.category === selectedCategory;
      const matchesTier = selectedTier === 'ALL' || item.categoryTier === selectedTier;

      return matchesSearch && matchesCat && matchesTier;
    });
  }, [searchQuery, selectedCategory, selectedTier]);

  const copyMarkdownTable = () => {
    const header = '| Layer | Technology | Notes |\n| :--- | :--- | :--- |\n';
    const rows = TECH_STACK_ITEMS.map((item) => `| **${item.layer}** | ${item.technology} | ${item.notes} |`).join('\n');
    navigator.clipboard.writeText(header + rows);
    setCopiedMarkdown(true);
    setTimeout(() => setCopiedMarkdown(false), 2000);
  };

  const copyCurrentSnippet = () => {
    navigator.clipboard.writeText(selectedItem.sampleConfigCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const exportJsonSpec = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(TECH_STACK_ITEMS, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'lms_suggested_tech_stack_section_13.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16 text-[#1F2937]">
      {/* HEADER SECTION */}
      <div className="relative overflow-hidden rounded-3xl bg-white border border-[#E5E7EB] p-8 shadow-xs">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-[#DC2626] text-xs font-bold tracking-wide uppercase">
              <span>📚</span> Section 13 — System Architecture Blueprint
            </div>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-[#111827] tracking-tight">
              Suggested Technology Stack
            </h1>
            <p className="text-[#4B5563] text-sm leading-relaxed">
              Complete production architectural specification spanning 21 battle-tested technologies across 7 tiers — optimized for sub-second reactive UX, PostgreSQL + pgvector RAG embeddings, resilient BullMQ task queues, and Claude-powered AI tutoring.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-[#4B5563]">
              <span className="flex items-center gap-1.5 text-[#111827] font-semibold">
                <span>✅</span> 21 Core Layers
              </span>
              <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                <span>⚡</span> Zero Single Point of Failure
              </span>
              <span className="flex items-center gap-1.5 text-blue-700 font-semibold">
                <span>📦</span> Monorepo Aligned (Sec 10)
              </span>
              <span className="flex items-center gap-1.5 text-[#DC2626] font-semibold">
                <span>🔥</span> 4-Week Delivery Ready (Sec 12)
              </span>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap lg:flex-col gap-2.5 shrink-0">
            <button
              onClick={copyMarkdownTable}
              className="px-4 py-2.5 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-white font-bold text-xs flex items-center gap-2 transition-all shadow-xs active:scale-95 cursor-pointer"
            >
              <span>{copiedMarkdown ? '✔️' : '📋'}</span>
              {copiedMarkdown ? 'Copied Table!' : 'Copy Markdown Table'}
            </button>
            <button
              onClick={exportJsonSpec}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-[#F9FAFB] text-[#374151] border border-[#D1D5DB] font-semibold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-xs"
            >
              <span>📥</span> Export JSON Spec
            </button>
            <button
              onClick={() => setCurrentView('architecture')}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-[#F9FAFB] text-[#DC2626] border border-red-200 font-semibold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-xs"
            >
              <span>↗️</span> View Architecture (Sec 9)
            </button>
          </div>
        </div>
      </div>

      {/* VIEW SUB-TABS */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E5E7EB] pb-4">
        <div className="flex items-center gap-2 bg-[#F3F4F6] p-1 rounded-2xl border border-[#E5E7EB]">
          <button
            onClick={() => setActiveSubTab('grid')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'grid'
                ? 'bg-white text-[#111827] shadow-xs'
                : 'text-[#6B7280] hover:text-[#111827]'
            }`}
          >
            <span>📚</span> Deep Interactive Cards
          </button>
          <button
            onClick={() => setActiveSubTab('table')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'table'
                ? 'bg-white text-[#111827] shadow-xs'
                : 'text-[#6B7280] hover:text-[#111827]'
            }`}
          >
            <span>📄</span> Full Matrix Table
          </button>
          <button
            onClick={() => setActiveSubTab('topology')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'topology'
                ? 'bg-white text-[#111827] shadow-xs'
                : 'text-[#6B7280] hover:text-[#111827]'
            }`}
          >
            <span>🔀</span> Architecture Topology
          </button>
        </div>

        {/* Search bar */}
        <div className="relative min-w-[280px]">
          <span className="text-[#9CA3AF] text-sm absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">🔍</span>
          <input
            type="text"
            placeholder="Search technologies, notes, layers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-[#D1D5DB] text-xs text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-[#DC2626] focus:ring-1 focus:ring-[#DC2626] transition-colors"
          />
        </div>
      </div>

      {/* FILTER CONTROLS */}
      <div className="space-y-3">
        {/* Tier filter */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-[#4B5563] font-medium flex items-center gap-1.5 mr-1">
            <span>🏷️</span> Tier:
          </span>
          {TIERS.map((tier) => (
            <button
              key={tier}
              onClick={() => setSelectedTier(tier)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedTier === tier
                  ? 'bg-[#DC2626] text-white shadow-xs'
                  : 'bg-white text-[#4B5563] hover:text-[#111827] hover:bg-[#F9FAFB] border border-[#E5E7EB]'
              }`}
            >
              {tier}
            </button>
          ))}
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-[#4B5563] font-medium flex items-center gap-1.5 mr-1">
            <span>📦</span> Category:
          </span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#111827] text-white font-bold shadow-xs'
                  : 'bg-white text-[#4B5563] hover:text-[#111827] hover:bg-[#F9FAFB] border border-[#E5E7EB]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* SUB-TAB 1: DEEP INTERACTIVE CARDS & CODE INSPECTOR */}
      {activeSubTab === 'grid' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT COLUMN: LIST OF CARDS */}
          <div className="lg:col-span-5 space-y-3 max-h-[760px] overflow-y-auto pr-1">
            <div className="text-xs font-bold text-[#6B7280] uppercase tracking-wider px-1 flex items-center justify-between">
              <span>Layers ({filteredItems.length})</span>
              <span className="text-[#DC2626] font-semibold lowercase">click to inspect architecture</span>
            </div>

            {filteredItems.map((item) => {
              const isSelected = selectedItem.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer text-left ${
                    isSelected
                      ? 'bg-red-50/40 border-[#DC2626] ring-1 ring-[#DC2626] shadow-xs'
                      : 'bg-white border-[#E5E7EB] hover:bg-[#F9FAFB] hover:border-[#D1D5DB]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#F3F4F6] text-[#4B5563] border border-[#E5E7EB]">
                          {item.category}
                        </span>
                        <span className="text-[10px] font-semibold text-[#DC2626]">
                          {item.roadmapWeek}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-[#111827] flex items-center gap-1.5">
                        {item.layer}
                      </h3>
                      <p className="text-xs font-semibold text-[#B91C1C]">
                        {item.technology}
                      </p>
                    </div>

                    <div className="shrink-0 flex flex-col items-end gap-1">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F3F4F6] text-[#6B7280] font-mono border border-[#E5E7EB]">
                        {item.monorepoPath.split('/')[0]}/
                      </span>
                    </div>
                  </div>

                  <p className="mt-2 text-xs text-[#6B7280] line-clamp-1">
                    {item.notes}
                  </p>
                </div>
              );
            })}

            {filteredItems.length === 0 && (
              <div className="text-center py-12 bg-white rounded-2xl border border-[#E5E7EB] p-6 space-y-2">
                <span className="text-3xl block">🏷️</span>
                <p className="text-sm text-[#6B7280]">No technology layers match your search query.</p>
                <button
                  onClick={() => { setSearchQuery(''); setSelectedCategory('ALL'); setSelectedTier('ALL'); }}
                  className="text-xs text-[#DC2626] underline font-semibold cursor-pointer"
                >
                  Reset all filters
                </button>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: DEEP DETAILS & SAMPLE CONFIGURATION */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 space-y-6 shadow-xs">
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E7EB] pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-red-50 text-[#DC2626] border border-red-200">
                      {selectedItem.categoryTier}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#F3F4F6] text-[#374151] border border-[#E5E7EB]">
                      Delivered in {selectedItem.roadmapWeek}
                    </span>
                  </div>
                  <h2 className="text-2xl font-black text-[#111827] mt-2">
                    {selectedItem.layer}
                  </h2>
                  <p className="text-[#DC2626] font-semibold text-sm mt-0.5">
                    {selectedItem.technology}
                  </p>
                </div>

                <div className="text-left sm:text-right space-y-1">
                  <div className="text-xs text-[#6B7280]">Monorepo Location</div>
                  <div className="text-xs font-mono font-bold text-[#111827] bg-[#F9FAFB] px-2.5 py-1 rounded-lg border border-[#E5E7EB] inline-block">
                    {selectedItem.monorepoPath}
                  </div>
                </div>
              </div>

              {/* Official Notes & Version */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#F9FAFB] rounded-2xl p-4 border border-[#E5E7EB] space-y-1">
                  <div className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">
                    Official Specification Note
                  </div>
                  <div className="text-sm font-semibold text-[#111827]">
                    {selectedItem.notes}
                  </div>
                </div>
                <div className="bg-[#F9FAFB] rounded-2xl p-4 border border-[#E5E7EB] space-y-1">
                  <div className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">
                    Standard / Package Target
                  </div>
                  <div className="text-sm font-semibold text-emerald-700">
                    {selectedItem.versionOrStandard}
                  </div>
                </div>
              </div>

              {/* Architectural Rationale & Why Chosen */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-[#374151] uppercase tracking-wider flex items-center gap-2">
                  <span>✔️</span> Architectural Rationale
                </h3>
                <ul className="space-y-1.5 text-xs text-[#4B5563]">
                  {selectedItem.whyChosen.map((w, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-[#F9FAFB] p-2.5 rounded-xl border border-[#E5E7EB]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626] mt-1.5 shrink-0" />
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Key Capabilities */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-[#374151] uppercase tracking-wider flex items-center gap-2">
                  <span>✨</span> Key Capabilities in LMS
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {selectedItem.keyCapabilities.map((cap, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-[#374151] bg-[#F9FAFB] px-3 py-2 rounded-xl border border-[#E5E7EB]">
                      <span className="text-emerald-600 font-bold shrink-0">✅</span>
                      <span>{cap}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Performance Target SLA */}
              <div className="bg-red-50 border border-red-200 rounded-2xl p-3.5 flex items-center justify-between text-xs">
                <span className="font-bold text-[#DC2626] flex items-center gap-2">
                  <span>📈</span> Target Performance SLA
                </span>
                <span className="font-mono font-bold text-emerald-800">
                  {selectedItem.performanceTarget}
                </span>
              </div>

              {/* Code Snippet Box */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#374151] flex items-center gap-2">
                    <span>💻</span>
                    {selectedItem.sampleConfigTitle}
                  </span>
                  <button
                    onClick={copyCurrentSnippet}
                    className="text-xs text-[#4B5563] hover:text-[#111827] flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#F3F4F6] hover:bg-[#E5E7EB] transition-colors cursor-pointer border border-[#E5E7EB]"
                  >
                    <span>{copiedCode ? '✔️' : '📋'}</span>
                    {copiedCode ? 'Copied!' : 'Copy Code'}
                  </button>
                </div>

                <div className="relative rounded-2xl bg-[#111827] border border-[#374151] p-4 font-mono text-xs text-[#F3F4F6] overflow-x-auto max-h-72">
                  <pre>{selectedItem.sampleConfigCode}</pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: FULL MATRIX TABLE VIEW */}
      {activeSubTab === 'table' && (
        <div className="bg-white border border-[#E5E7EB] rounded-3xl overflow-hidden shadow-xs">
          <div className="p-5 border-b border-[#E5E7EB] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-[#111827] flex items-center gap-2">
                <span>📄</span> Complete Technology Stack Matrix (Section 13)
              </h2>
              <p className="text-xs text-[#6B7280] mt-1">
                Showing all 21 architectural components mapped with notes, tiers, and target locations.
              </p>
            </div>
            <button
              onClick={copyMarkdownTable}
              className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-[#DC2626] border border-red-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <span>📋</span> Copy Markdown Table
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F9FAFB] text-[#4B5563] border-b border-[#E5E7EB] uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4 font-bold">#</th>
                  <th className="py-3.5 px-4 font-bold">Layer</th>
                  <th className="py-3.5 px-4 font-bold">Technology</th>
                  <th className="py-3.5 px-4 font-bold">Notes</th>
                  <th className="py-3.5 px-4 font-bold">Category</th>
                  <th className="py-3.5 px-4 font-bold">Monorepo Path</th>
                  <th className="py-3.5 px-4 font-bold text-right">Roadmap</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB] text-[#374151]">
                {filteredItems.map((item, index) => (
                  <tr
                    key={item.id}
                    className="hover:bg-[#F9FAFB] transition-colors cursor-pointer"
                    onClick={() => { setSelectedItem(item); setActiveSubTab('grid'); }}
                  >
                    <td className="py-3 px-4 font-mono text-[#9CA3AF]">{index + 1}</td>
                    <td className="py-3 px-4 font-bold text-[#111827] flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#DC2626]" />
                      {item.layer}
                    </td>
                    <td className="py-3 px-4 font-semibold text-[#DC2626]">{item.technology}</td>
                    <td className="py-3 px-4 text-[#4B5563]">{item.notes}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#F3F4F6] text-[#4B5563] border border-[#E5E7EB]">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-[#111827]">{item.monorepoPath}</td>
                    <td className="py-3 px-4 text-right">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-50 text-[#DC2626] border border-red-200">
                        {item.roadmapWeek}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: ARCHITECTURE TOPOLOGY DIAGRAM */}
      {activeSubTab === 'topology' && (
        <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E7EB] pb-4">
            <div>
              <h2 className="text-lg font-bold text-[#111827] flex items-center gap-2">
                <span>🔀</span> End-to-End Stack Interconnection Topology
              </h2>
              <p className="text-xs text-[#6B7280] mt-1">
                Visual flow of client interactions through reverse proxies, Node.js REST services, FastAPI vector pipelines, and persistent storage.
              </p>
            </div>
            <button
              onClick={() => setCurrentView('architecture')}
              className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-[#DC2626] border border-red-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <span>↗️</span> High-Level Diagram (Sec 9)
            </button>
          </div>

          {/* Interactive Topology Graph */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* TIER 1: CLIENT PRESENTATION */}
            <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-2">
                <span className="text-xs font-extrabold text-[#DC2626] uppercase tracking-wider">
                  Client & Presentation
                </span>
                <span className="text-[10px] bg-red-100 text-[#DC2626] px-2 py-0.5 rounded font-bold">Tier 1</span>
              </div>

              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-white border border-[#E5E7EB] shadow-2xs">
                  <div className="text-xs font-bold text-[#111827]">React 18 SPA + Vite</div>
                  <div className="text-[11px] text-[#6B7280]">TypeScript 5.4, Concurrent UI</div>
                </div>
                <div className="p-3 rounded-xl bg-white border border-[#E5E7EB] shadow-2xs">
                  <div className="text-xs font-bold text-[#111827]">Zustand + TanStack Query</div>
                  <div className="text-[11px] text-[#6B7280]">Global Auth, Video state, SWR Caching</div>
                </div>
                <div className="p-3 rounded-xl bg-white border border-[#E5E7EB] shadow-2xs">
                  <div className="text-xs font-bold text-[#111827]">Tailwind CSS</div>
                  <div className="text-[11px] text-[#6B7280]">Utility-first, Clean Theme</div>
                </div>
              </div>

              <div className="text-center pt-2 text-[11px] text-[#DC2626] font-mono flex items-center justify-center gap-1 font-semibold">
                <span>HTTPS / REST & SSE</span>
                <span>➡️</span>
              </div>
            </div>

            {/* TIER 2: GATEWAY & MICROSERVICES */}
            <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-2">
                <span className="text-xs font-extrabold text-[#374151] uppercase tracking-wider">
                  Gateway & Microservices
                </span>
                <span className="text-[10px] bg-[#E5E7EB] text-[#374151] px-2 py-0.5 rounded font-bold">Tier 2</span>
              </div>

              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-white border border-[#E5E7EB] shadow-2xs">
                  <div className="text-xs font-bold text-[#111827]">NGINX Reverse Proxy</div>
                  <div className="text-[11px] text-[#6B7280]">SSL termination, Path routing, Rate limits</div>
                </div>
                <div className="p-3 rounded-xl bg-white border border-[#E5E7EB] shadow-2xs">
                  <div className="text-xs font-bold text-[#111827]">Core LMS: Node.js + Express</div>
                  <div className="text-[11px] text-[#6B7280]">RBAC, Courses, Quizzes, Grading, Auth</div>
                </div>
                <div className="p-3 rounded-xl bg-white border border-[#E5E7EB] shadow-2xs">
                  <div className="text-xs font-bold text-[#111827]">AI Service: Python + FastAPI</div>
                  <div className="text-[11px] text-[#6B7280]">RAG pipeline, SSE stream, Embeddings</div>
                </div>
              </div>

              <div className="text-center pt-2 text-[11px] text-[#374151] font-mono flex items-center justify-center gap-1 font-semibold">
                <span>TCP / SQL / Vectors</span>
                <span>➡️</span>
              </div>
            </div>

            {/* TIER 3: DATA, QUEUES & EXTERNAL APIS */}
            <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-2">
                <span className="text-xs font-extrabold text-emerald-700 uppercase tracking-wider">
                  Storage, Queues & LLM
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">Tier 3</span>
              </div>

              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-white border border-[#E5E7EB] shadow-2xs">
                  <div className="text-xs font-bold text-[#111827]">PostgreSQL 15 + pgvector</div>
                  <div className="text-[11px] text-[#6B7280]">Relational LMS tables & 1536-dim embeddings</div>
                </div>
                <div className="p-3 rounded-xl bg-white border border-[#E5E7EB] shadow-2xs">
                  <div className="text-xs font-bold text-[#111827]">Redis + BullMQ</div>
                  <div className="text-[11px] text-[#6B7280]">Cache, rate limiting, async jobs, daily streaks</div>
                </div>
                <div className="p-3 rounded-xl bg-white border border-[#E5E7EB] shadow-2xs">
                  <div className="text-xs font-bold text-[#111827]">AWS S3 + CloudFront CDN + Anthropic API</div>
                  <div className="text-[11px] text-[#6B7280]">HLS video delivery, PDFs, Claude 3.5 Sonnet</div>
                </div>
              </div>

              <div className="text-center pt-2 text-[11px] text-emerald-700 font-mono flex items-center justify-center gap-1 font-semibold">
                <span>✅</span>
                <span>Synchronous & Async Verified</span>
              </div>
            </div>
          </div>

          {/* Quick Cross-Reference Banner */}
          <div className="bg-[#F9FAFB] rounded-2xl p-4 border border-[#E5E7EB] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center shrink-0 text-lg">
                ⚡
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#111827]">Direct Correlation with 4-Week Roadmap (Section 12)</h4>
                <p className="text-[11px] text-[#6B7280]">
                  Each technology has a designated delivery window: Week 1 (Core DB/Auth), Week 2 (Video/HLS), Week 3 (AI RAG/FastAPI), Week 4 (K8s/CI/CD/Monitoring).
                </p>
              </div>
            </div>
            <button
              onClick={() => setCurrentView('roadmap')}
              className="px-4 py-2 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-white font-bold text-xs shrink-0 cursor-pointer transition-colors shadow-xs"
            >
              Inspect 4-Week Roadmap
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
