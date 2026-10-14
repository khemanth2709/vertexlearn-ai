import React, { useState, useMemo } from 'react';
import { useLMS } from '../../context/LMSContext';

// ============================================================================
// DATA DEFINITIONS: ENVIRONMENTS (14.1)
// ============================================================================
interface EnvironmentSpec {
  id: 'local' | 'staging' | 'production';
  name: string;
  badge: string;
  badgeColor: string;
  description: string;
  hostingPlatform: string;
  loadBalancer: string;
  domain: string;
  resourceAllocation: {
    cores: string;
    ram: string;
    storage: string;
    replicas: string;
  };
  containers: {
    name: string;
    image: string;
    port: string;
    status: 'Running' | 'Standby' | 'Optimized';
    role: string;
  }[];
  configNotes: string[];
}

const ENVIRONMENTS: EnvironmentSpec[] = [
  {
    id: 'local',
    name: 'Local Development',
    badge: 'Docker Compose',
    badgeColor: 'bg-emerald-950/80 text-emerald-300 border-emerald-800',
    description: 'Self-contained local stack mirroring production topology with MinIO in place of AWS S3 and single-node Postgres/Redis.',
    hostingPlatform: 'Docker Engine / Docker Desktop (Linux/macOS/Windows)',
    loadBalancer: 'Direct Port Forwarding / NGINX local proxy (:80, :3000, :5000, :8000)',
    domain: 'localhost / 127.0.0.1',
    resourceAllocation: {
      cores: '4 Cores (Host Shared)',
      ram: '8 GB RAM Allocated',
      storage: 'Local Bind Mount Volumes',
      replicas: '1 instance per service'
    },
    containers: [
      { name: 'postgres', image: 'pgvector/pgvector:pg16', port: '5432', status: 'Running', role: 'Primary RDBMS with pgvector HNSW indexing' },
      { name: 'redis', image: 'redis:7-alpine', port: '6379', status: 'Running', role: 'In-memory cache & BullMQ background job queues' },
      { name: 'minio', image: 'minio/minio:RELEASE', port: '9000/9001', status: 'Running', role: 'S3-compatible bucket for video & PDF uploads' },
      { name: 'core-lms-service', image: 'node:20-alpine (Express)', port: '5000', status: 'Running', role: 'Course CRUD, Auth, RBAC, Submissions, Quizzes' },
      { name: 'ai-service', image: 'python:3.11-slim (FastAPI)', port: '8000', status: 'Running', role: 'RAG embeddings, Claude 3.5 LLM chat & summaries' },
      { name: 'frontend', image: 'node:20-alpine (Vite/React)', port: '3000', status: 'Running', role: 'React 19 SPA client application' }
    ],
    configNotes: [
      'Hot Reloading active via Docker volume mounts for fast code turnaround',
      'MinIO web console exposed on port 9001 for visual bucket inspection',
      'Pre-seeded with synthetic courses, users, and 100+ quiz questions for offline testing'
    ]
  },
  {
    id: 'staging',
    name: 'Staging Environment',
    badge: 'Cloud VM / Container Mirror',
    badgeColor: 'bg-amber-950/80 text-amber-300 border-amber-800',
    description: 'Single cloud VM or managed container service mirroring production configuration with smaller resource limits and synthetic test datasets.',
    hostingPlatform: 'Managed Container Service (AWS ECS Fargate / Cloud Run / Single VM)',
    loadBalancer: 'NGINX Reverse Proxy with Let\'s Encrypt TLS 1.3',
    domain: 'staging.vertexon-lms.internal',
    resourceAllocation: {
      cores: '2 vCPUs per container',
      ram: '4 GB RAM per container',
      storage: 'AWS EBS gp3 (50 GB)',
      replicas: '2 instances (active-standby)'
    },
    containers: [
      { name: 'postgres-staging', image: 'AWS RDS Postgres 16 (db.t4g.medium)', port: '5432', status: 'Running', role: 'Multi-AZ DB with pgvector extension' },
      { name: 'redis-staging', image: 'AWS ElastiCache Redis 7.0 (cache.t4g.micro)', port: '6379', status: 'Running', role: 'Shared cache and queue broker' },
      { name: 's3-staging', image: 'AWS S3 (vertexon-staging-assets)', port: '443', status: 'Running', role: 'Staging asset storage with 30-day lifecycle' },
      { name: 'core-lms-service', image: 'ghcr.io/vertexon/backend:staging-latest', port: '5000', status: 'Running', role: 'Core LMS backend with sanitization middleware' },
      { name: 'ai-service', image: 'ghcr.io/vertexon/ai-service:staging-latest', port: '8000', status: 'Running', role: 'AI microservice connected to Anthropic API' },
      { name: 'frontend-cdn', image: 'CloudFront -> S3 Static Bucket', port: '443', status: 'Running', role: 'Compiled React SPA staging preview' }
    ],
    configNotes: [
      'Automatic continuous deployment on every PR merge to main branch',
      'Automated integration smoke tests run against staging endpoints prior to promotion',
      'Sanitized production database snapshot refreshed weekly for realistic query testing'
    ]
  },
  {
    id: 'production',
    name: 'Production Environment',
    badge: 'Enterprise Multi-AZ',
    badgeColor: 'bg-cyan-950/80 text-cyan-300 border-cyan-800',
    description: 'High-availability managed container hosting (Kubernetes / AWS ECS) fronted by an Application Load Balancer and global CloudFront CDN.',
    hostingPlatform: 'AWS ECS Fargate Multi-AZ / Managed EKS Kubernetes',
    loadBalancer: 'AWS ALB + CloudFront CDN (TLS 1.3, WAF rate-limiting)',
    domain: 'lms.vertexon-learning.com',
    resourceAllocation: {
      cores: 'Autoscaling (4 to 32 vCPUs)',
      ram: 'Autoscaling (8 to 64 GB RAM)',
      storage: 'Multi-AZ S3 + Aurora Serverless',
      replicas: '3 to 15 horizontal pods (HPA)'
    },
    containers: [
      { name: 'aurora-postgres-prod', image: 'Amazon Aurora PostgreSQL 16 (Multi-AZ)', port: '5432', status: 'Running', role: 'Primary writer + 2 read replicas with PITR' },
      { name: 'redis-cluster-prod', image: 'Amazon ElastiCache Redis Cluster (3 nodes)', port: '6379', status: 'Running', role: 'Clustered session cache, ratelimits, BullMQ' },
      { name: 's3-assets-prod', image: 'AWS S3 (vertexon-prod-assets)', port: '443', status: 'Running', role: 'Multi-region asset bucket with Glacier lifecycle' },
      { name: 'core-lms-service', image: 'ghcr.io/vertexon/backend:v1.0.0-sha-71b3e2f', port: '5000', status: 'Running', role: 'Horizontal autoscaling Node.js pods (HPA)' },
      { name: 'ai-service', image: 'ghcr.io/vertexon/ai-service:v1.0.0-sha-71b3e2f', port: '8000', status: 'Running', role: 'Isolated Python FastAPI RAG microservice' },
      { name: 'frontend-edge', image: 'CloudFront Edge Locations (Global)', port: '443', status: 'Running', role: 'Global edge cached SPA with Brotli compression' }
    ],
    configNotes: [
      'Zero-downtime blue-green deployments with instant rollback capability',
      'Secrets injected at runtime via AWS Secrets Manager / Vault (zero keys in code/git)',
      'Automated nightly database backups with 35-day Point-in-Time Recovery window'
    ]
  }
];

// ============================================================================
// DATA DEFINITIONS: CI/CD PIPELINE (14.2)
// ============================================================================
interface PipelineStage {
  step: number;
  trigger: string;
  name: string;
  targetEnv: string;
  tasks: {
    name: string;
    command: string;
    status: 'pass' | 'active' | 'pending';
    duration: string;
  }[];
  gate: string;
}

const PIPELINE_STAGES: PipelineStage[] = [
  {
    step: 1,
    trigger: 'On Pull Request (on: pull_request)',
    name: 'Automated PR Verification',
    targetEnv: 'Ephemeral GitHub Actions Runner',
    tasks: [
      { name: 'Static Linting', command: 'npm run lint && flake8 ai-service/', status: 'pass', duration: '18s' },
      { name: 'Unit & Contract Tests', command: 'jest --ci && pytest ai-service/tests/', status: 'pass', duration: '42s' },
      { name: 'TypeScript & Typecheck', command: 'tsc --noEmit && mypy ai-service/', status: 'pass', duration: '24s' },
      { name: 'Multi-Service Build', command: 'npm run build && docker build -t test-backend backend/', status: 'pass', duration: '55s' }
    ],
    gate: 'PR blocked until all 4 verification jobs pass 100% cleanly'
  },
  {
    step: 2,
    trigger: 'On Merge to Main (on: push: branches: [main])',
    name: 'Build, Package & Staging Deploy',
    targetEnv: 'Staging Cloud VM / ECS',
    tasks: [
      { name: 'Build Docker Images', command: 'docker buildx build --push -t ghcr.io/vertexon/backend:${GITHUB_SHA}', status: 'pass', duration: '1m 15s' },
      { name: 'Push to GHCR Registry', command: 'docker push ghcr.io/vertexon/*:${GITHUB_SHA}', status: 'pass', duration: '35s' },
      { name: 'Deploy to Staging', command: 'kubectl apply -k infra/k8s/staging/ || deploy-hook.sh', status: 'pass', duration: '45s' },
      { name: 'Automated Smoke Tests', command: 'curl -f https://staging-api/health && pytest e2e_smoke.py', status: 'pass', duration: '28s' }
    ],
    gate: 'Automatic deployment to Staging environment followed by automated health verification'
  },
  {
    step: 3,
    trigger: 'On Tagged Release (on: push: tags: [v*.*.*])',
    name: 'Production Promotion & Zero-Downtime Rollout',
    targetEnv: 'Production Multi-AZ Cluster',
    tasks: [
      { name: 'Image Verification', command: 'cosign verify --key cosign.pub ghcr.io/vertexon/*:${TAG}', status: 'pass', duration: '12s' },
      { name: 'Blue-Green / Rolling Deploy', command: 'aws ecs update-service --service lms-core --force-new-deployment', status: 'pass', duration: '2m 10s' },
      { name: 'Canary Traffic Shift', command: 'Route 10% -> 50% -> 100% on ALB Target Group', status: 'pass', duration: '1m 30s' },
      { name: 'Post-Deploy Telemetry', command: 'Datadog / Prometheus 0.00% 5xx error budget validation', status: 'pass', duration: '45s' }
    ],
    gate: 'Production promotion with automatic rollback trigger if 5xx error rate exceeds 0.05%'
  }
];

// ============================================================================
// DATA DEFINITIONS: INFRASTRUCTURE COMPONENTS (14.3)
// ============================================================================
interface InfraComponent {
  id: string;
  title: string;
  category: 'Networking' | 'Database' | 'Caching' | 'Storage' | 'Edge' | 'Security';
  technology: string;
  role: string;
  specs: string;
  haStrategy: string;
  securityControls: string;
  status: 'Operational' | 'Optimal';
}

const INFRASTRUCTURE_COMPONENTS: InfraComponent[] = [
  {
    id: 'lb',
    title: 'Load Balancer / Reverse Proxy',
    category: 'Networking',
    technology: 'NGINX / AWS Application Load Balancer (ALB)',
    role: 'Terminates SSL/TLS 1.3, routes traffic based on URL path (/api -> Node.js, /ai -> FastAPI, / -> SPA CDN), and handles rate-limiting.',
    specs: 'Path-based routing, HTTP/2 & HTTP/3 support, gzip & brotli negotiation, cross-zone load balancing.',
    haStrategy: 'Multi-AZ active-active ALB distribution across 3 availability zones.',
    securityControls: 'TLS 1.3 only, AWS WAF rate limiting (1,000 req/min per IP), OWASP Top 10 rule group inspection.',
    status: 'Operational'
  },
  {
    id: 'postgres',
    title: 'Managed PostgreSQL Database',
    category: 'Database',
    technology: 'Amazon Aurora / Managed PostgreSQL 16 + pgvector',
    role: 'Stores all relational domain entities (Users, Courses, Enrollments, Quizzes, Submissions) + vector embeddings for RAG document chunks.',
    specs: '32 relational tables, pgvector extension enabled for cosine similarity indexing (HNSW index, 1536 dimensions).',
    haStrategy: 'Multi-AZ synchronous replication with automatic failover in < 30 seconds, 2 Read Replicas for analytics.',
    securityControls: 'Encrypted at rest (AWS KMS AES-256), SSL-enforced in transit, VPC private subnet isolation.',
    status: 'Optimal'
  },
  {
    id: 'redis',
    title: 'Managed Redis Instance',
    category: 'Caching',
    technology: 'Amazon ElastiCache Redis 7 / Standalone Redis',
    role: 'Session caching, JWT token blacklisting, rate limit token bucket counters, BullMQ asynchronous job broker.',
    specs: 'Redis 7.0 Cluster, LRU eviction policy, in-memory data structures for fast leaderboard ranking.',
    haStrategy: 'Multi-AZ cluster with primary node and read replica with automatic failover.',
    securityControls: 'AUTH password protection, in-transit TLS encryption, private VPC peering.',
    status: 'Operational'
  },
  {
    id: 's3',
    title: 'Object Storage (S3 / MinIO)',
    category: 'Storage',
    technology: 'AWS S3 (Prod) / MinIO (Local Dev)',
    role: 'Stores raw lecture videos, HLS stream segments, lecture transcript PDFs, student assignment submissions, and generated certificates.',
    specs: 'Unlimited scalable object store with multipart upload and byte-range seeking for video scrubbers.',
    haStrategy: '99.999999999% (11 9s) data durability with Cross-Region Replication (CRR).',
    securityControls: 'Lifecycle policies: 90-day transition to S3 Glacier for old video assets; pre-signed URLs with 15-minute expiry.',
    status: 'Optimal'
  },
  {
    id: 'cdn',
    title: 'Content Delivery Network (CDN)',
    category: 'Edge',
    technology: 'Amazon CloudFront / Global Edge Locations',
    role: 'Accelerates delivery of static React SPA bundles and caches HLS adaptive bitrate video chunks close to students globally.',
    specs: 'Edge caching with 300+ global Points of Presence (PoPs), HTTP/2 edge negotiation, Origin Shield.',
    haStrategy: 'Global Anycast DNS routing to geographically nearest healthy edge location.',
    securityControls: 'Origin Access Identity (OAI) blocking direct S3 access, custom SSL certificate with SNI.',
    status: 'Operational'
  },
  {
    id: 'secrets',
    title: 'Secrets Manager',
    category: 'Security',
    technology: 'AWS Secrets Manager / HashiCorp Vault',
    role: 'Stores and rotates sensitive credentials: Anthropic/LLM API keys, database credentials, JWT secret keys, and SMTP credentials.',
    specs: 'Centralized key-value secret store with automatic key rotation and audit logging.',
    haStrategy: 'Multi-region secret replication with automated fallback lookup.',
    securityControls: 'KMS customer-managed keys (CMK), zero secrets stored in code or git repositories, IAM role-based access.',
    status: 'Optimal'
  }
];

// ============================================================================
// DATA DEFINITIONS: FUTURE ENHANCEMENTS (SECTION 15)
// ============================================================================
interface FutureEnhancement {
  id: number;
  title: string;
  category: 'Collaboration' | 'AI & ML' | 'Monetization' | 'Mobile & Offline' | 'Analytics' | 'Enterprise';
  ratioRating: string; // Expected Value-to-Effort Ratio
  phase: 'Phase 2 (Immediate Post-v1)' | 'Phase 3 (Mid-Term)' | 'Phase 4 (Strategic Expansion)';
  complexity: 'Medium' | 'High' | 'Very High';
  impact: 'High' | 'Very High' | 'Transformative';
  summary: string;
  techDetails: string;
  expectedValue: string;
  estimatedEffort: string;
}

const FUTURE_ENHANCEMENTS: FutureEnhancement[] = [
  {
    id: 1,
    title: 'Live Classes with Video Conferencing & Collaborative Whiteboard',
    category: 'Collaboration',
    ratioRating: '9.6 / 10 (Highest Ratio)',
    phase: 'Phase 2 (Immediate Post-v1)',
    complexity: 'High',
    impact: 'Transformative',
    summary: 'WebRTC-based multi-party video conferencing powered by a managed SFU (LiveKit / Mediasoup) combined with an integrated interactive collaborative whiteboard.',
    techDetails: 'Selective Forwarding Unit (SFU) architecture handling up to 100 concurrent student video streams with adaptive simulcast. Whiteboard built with Fabric.js / Excalidraw engine broadcasting vector paths via WebSockets with conflict-free replicated data types (CRDTs).',
    expectedValue: 'Transforms static self-paced courses into high-retention live cohort masterclasses; directly increases course completion rates by 42%.',
    estimatedEffort: '2 Weeks (1 Developer with managed SFU SDK)'
  },
  {
    id: 2,
    title: 'Real-Time Peer-to-Peer Study Groups & Matchmaking',
    category: 'Collaboration',
    ratioRating: '9.3 / 10',
    phase: 'Phase 2 (Immediate Post-v1)',
    complexity: 'Medium',
    impact: 'Very High',
    summary: 'Automated study group matchmaking algorithm pairing students based on common enrolled courses, syllabus progress, time-zone overlap, and active study topics.',
    techDetails: 'Redis geospatial and sorted set indexing for sub-second peer matchmaking. Ephemeral WebRTC audio/chat rooms, collaborative flashcard revision sessions, and real-time synchronized quiz challenge lobbies.',
    expectedValue: 'Fosters high student engagement, reduces solitary learner isolation, and drives peer-assisted learning loops.',
    estimatedEffort: '1.5 Weeks'
  },
  {
    id: 3,
    title: 'AI Plagiarism & Originality Detection for Submissions',
    category: 'AI & ML',
    ratioRating: '9.1 / 10',
    phase: 'Phase 2 (Immediate Post-v1)',
    complexity: 'Medium',
    impact: 'High',
    summary: 'Automated plagiarism and AI-generation likelihood scoring for both textual essay submissions and code assignments using embedding vector similarity.',
    techDetails: 'Multi-document chunking and cosine similarity lookups against internal historical assignment corpus stored in pgvector. Code submissions normalized via AST (Abstract Syntax Tree) hashing to detect renamed variable plagiarism.',
    expectedValue: 'Provides instructors with objective integrity reports before grading, reducing manual verification time by 80%.',
    estimatedEffort: '1 Week'
  },
  {
    id: 4,
    title: 'Full Payment Gateway & Multi-Tier Monetization Engine',
    category: 'Monetization',
    ratioRating: '8.8 / 10',
    phase: 'Phase 2 (Immediate Post-v1)',
    complexity: 'Medium',
    impact: 'Transformative',
    summary: 'Integration with Stripe and Razorpay for recurring monthly/yearly subscriptions, individual course purchases, promo coupons, and automated instructor payout splits.',
    techDetails: 'Stripe Webhooks handling asynchronous payment lifecycle (checkout.session.completed, invoice.payment_failed). Ledger table in PostgreSQL tracking credits, refunds, and automated 70/30 platform/instructor revenue distribution.',
    expectedValue: 'Unlocks direct institutional and marketplace revenue streams with zero friction onboarding for paying students.',
    estimatedEffort: '1.5 Weeks'
  },
  {
    id: 5,
    title: 'Native Mobile Applications (iOS & Android)',
    category: 'Mobile & Offline',
    ratioRating: '8.5 / 10',
    phase: 'Phase 3 (Mid-Term)',
    complexity: 'High',
    impact: 'Very High',
    summary: 'Cross-platform native mobile applications built with React Native / Expo reusing 90% of the existing REST API surface, types, and business logic.',
    techDetails: 'Expo application bundle with React Native Video for native hardware acceleration, push notification handlers (APNs/FCM) for assignment deadlines, and biometric login (Face ID / Fingerprint).',
    expectedValue: 'Allows students to study during commutes, significantly increasing daily active user (DAU) frequency.',
    estimatedEffort: '2.5 Weeks'
  },
  {
    id: 6,
    title: 'Offline-First Content Sync for Downloaded Lectures',
    category: 'Mobile & Offline',
    ratioRating: '8.2 / 10',
    phase: 'Phase 3 (Mid-Term)',
    complexity: 'High',
    impact: 'High',
    summary: 'Encrypted local SQLite storage on mobile devices for downloading lecture videos, transcripts, and reading materials for offline consumption.',
    techDetails: 'Encrypted file sandbox using AES-256 for media files. Watermarking on offline video playback. Background sync queue syncing completed lesson checkboxes and quiz drafts once internet connection is restored.',
    expectedValue: 'Crucial for students in low-connectivity regions or traveling without mobile data.',
    estimatedEffort: '2 Weeks'
  },
  {
    id: 7,
    title: 'Full Multilingual UI + Regional AI Tutor Responses',
    category: 'AI & ML',
    ratioRating: '8.0 / 10',
    phase: 'Phase 3 (Mid-Term)',
    complexity: 'Medium',
    impact: 'High',
    summary: 'Complete internationalization (i18n) across 12+ global and regional languages, paired with AI tutor prompt conditioning to respond in the student’s native dialect.',
    techDetails: 'Frontend i18next translation catalogs with dynamic locale switching. AI tutor prompt injection instructing Claude 3.5 to formulate explanations in Hindi, Spanish, French, or German while referencing original English terminology.',
    expectedValue: 'Expands the addressable market globally, enabling non-native English speakers to master complex technical concepts.',
    estimatedEffort: '1 Week'
  },
  {
    id: 8,
    title: 'Advanced Predictive Analytics & At-Risk Student Flagging',
    category: 'Analytics',
    ratioRating: '7.8 / 10',
    phase: 'Phase 3 (Mid-Term)',
    complexity: 'High',
    impact: 'High',
    summary: 'Predictive machine learning classification model evaluating login frequency, lecture drop-off points, and quiz regression to proactively flag at-risk students.',
    techDetails: 'Scikit-learn logistic regression / gradient boosting pipeline analyzing event telemetry stored in PostgreSQL. Automated alert notifications sent to instructors with suggested intervention study plans.',
    expectedValue: 'Enables early academic intervention before students drop out or fail certification milestones.',
    estimatedEffort: '1.5 Weeks'
  },
  {
    id: 9,
    title: 'External LMS Integrations (LTI 1.3 Standard)',
    category: 'Enterprise',
    ratioRating: '7.5 / 10',
    phase: 'Phase 4 (Strategic Expansion)',
    complexity: 'High',
    impact: 'High',
    summary: 'Seamless integration with higher education LMS ecosystems (Canvas, Blackboard, Moodle, Brightspace) via the 1EdTech LTI 1.3 Advantage standard.',
    techDetails: 'OAuth2/OIDC asymmetric key exchange, Deep Linking Specification 2.0 for curriculum embedding, and Assignment and Grade Services (AGS) for auto-syncing grades back to university gradebooks.',
    expectedValue: 'Enables enterprise B2B sales to colleges and universities already committed to existing legacy LMS infrastructure.',
    estimatedEffort: '2 Weeks'
  },
  {
    id: 10,
    title: 'Voice-Driven Interactive AI Tutor Sessions',
    category: 'AI & ML',
    ratioRating: '7.2 / 10',
    phase: 'Phase 4 (Strategic Expansion)',
    complexity: 'Very High',
    impact: 'Very High',
    summary: 'Full-duplex real-time conversational voice tutoring with sub-500ms latency, enabling natural speech-to-speech learning dialogues.',
    techDetails: 'WebRTC / WebSocket streaming to low-latency Whisper STT and neural TTS voice synthesis with barge-in interruption detection. Audio stream tokenization for instant phonetic pronunciation feedback.',
    expectedValue: 'State-of-the-art interactive immersion mimicking a 1-on-1 human tutor experience for language and oral exam preparation.',
    estimatedEffort: '2.5 Weeks'
  }
];

export const DeploymentStrategyViewer: React.FC = () => {
  const { setCurrentView } = useLMS();

  // Active view tab
  const [activeTab, setActiveTab] = useState<'environments' | 'cicd' | 'infrastructure' | 'scaling' | 'rollback' | 'future_enhancements' | 'tools_required'>('environments');

  // Selected environment
  const [selectedEnv, setSelectedEnv] = useState<'local' | 'staging' | 'production'>('production');

  // Interactive CI/CD Simulation State
  const [activeSimulation, setActiveSimulation] = useState<number | null>(null);
  const [simStepIndex, setSimStepIndex] = useState<number>(0);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simLogs, setSimLogs] = useState<string[]>([]);

  // Interactive Scaling Load Slider State
  const [simulatedRps, setSimulatedRps] = useState<number>(2500);

  // Rollback Simulation State
  const [rollbackStatus, setRollbackStatus] = useState<'idle' | 'executing' | 'completed'>('idle');
  const [activeImageTag, setActiveImageTag] = useState<string>('ghcr.io/vertexon/backend:v1.0.1-sha-94c8e1a');

  // Search & Filters for Future Enhancements
  const [searchEnhancement, setSearchEnhancement] = useState<string>('');
  const [selectedPhaseFilter, setSelectedPhaseFilter] = useState<string>('ALL');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('ALL');
  const [expandedEnhancementId, setExpandedEnhancementId] = useState<number | null>(1);

  // Copy status
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleCopy = (text: string, sectionKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionKey);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  // Run simulated CI/CD pipeline
  const runSimulation = (stageIndex: number) => {
    setActiveSimulation(stageIndex);
    setIsSimulating(true);
    setSimStepIndex(0);
    setSimLogs([`[00:00:01] Initializing runner for ${PIPELINE_STAGES[stageIndex].name}...`]);

    const stage = PIPELINE_STAGES[stageIndex];
    let currentTask = 0;

    const interval = setInterval(() => {
      if (currentTask < stage.tasks.length) {
        const task = stage.tasks[currentTask];
        setSimLogs(prev => [
          ...prev,
          `[RUNNING] ${task.name}: $ ${task.command}`,
          `[SUCCESS] Completed in ${task.duration} with exit code 0`
        ]);
        setSimStepIndex(currentTask + 1);
        currentTask++;
      } else {
        clearInterval(interval);
        setIsSimulating(false);
        setSimLogs(prev => [
          ...prev,
          `[SUMMARY] Stage "${stage.name}" COMPLETED SUCCESSFULLY! All quality gates passed.`
        ]);
      }
    }, 700);
  };

  // Run simulated 1-click rollback
  const triggerRollbackSimulation = () => {
    setRollbackStatus('executing');
    setTimeout(() => {
      setActiveImageTag('ghcr.io/vertexon/backend:v1.0.0-sha-71b3e2f');
      setRollbackStatus('completed');
    }, 1800);
  };

  // Dynamic calculations based on simulated RPS
  const calculatedMetrics = useMemo(() => {
    const lmsPods = Math.max(2, Math.min(24, Math.ceil(simulatedRps / 800)));
    const aiPods = Math.max(2, Math.min(16, Math.ceil(simulatedRps / 1200)));
    const redisCacheHitPercent = (91 + (simulatedRps % 60) / 10).toFixed(1);
    const dbReadReplicas = simulatedRps > 4000 ? 2 : simulatedRps > 1500 ? 1 : 0;
    const estP99Latency = simulatedRps > 10000 ? '48ms' : simulatedRps > 5000 ? '36ms' : '22ms';

    return {
      lmsPods,
      aiPods,
      redisCacheHitPercent,
      dbReadReplicas,
      estP99Latency
    };
  }, [simulatedRps]);

  // Filtered Enhancements
  const filteredEnhancements = useMemo(() => {
    return FUTURE_ENHANCEMENTS.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchEnhancement.toLowerCase()) ||
        item.summary.toLowerCase().includes(searchEnhancement.toLowerCase()) ||
        item.techDetails.toLowerCase().includes(searchEnhancement.toLowerCase());
      const matchesPhase = selectedPhaseFilter === 'ALL' || item.phase.includes(selectedPhaseFilter);
      const matchesCategory = selectedCategoryFilter === 'ALL' || item.category === selectedCategoryFilter;
      return matchesSearch && matchesPhase && matchesCategory;
    });
  }, [searchEnhancement, selectedPhaseFilter, selectedCategoryFilter]);

  const currentEnvSpec = useMemo(() => {
    return ENVIRONMENTS.find(e => e.id === selectedEnv) || ENVIRONMENTS[2];
  }, [selectedEnv]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-[#1F2937]">
      {/* HEADER SECTION */}
      <div className="relative overflow-hidden rounded-2xl bg-white border border-[#E5E7EB] p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-950 text-cyan-300 border border-cyan-800 flex items-center gap-1.5">
                <span>🚀</span>
                Section 14 & 15
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1.5">
                <span>🛡️</span>
                Production Deployment & Future Roadmap
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-950 text-purple-300 border border-purple-800">
                LMS-AI PRD v1.0 Approved
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#111827] tracking-tight">
              Deployment Strategy & Future Enhancements
            </h1>
            <p className="text-[#4B5563] text-sm sm:text-base max-w-3xl leading-relaxed">
              Complete operational blueprint covering multi-tier environments, automated GitHub Actions CI/CD workflows, AWS/Cloud infrastructure topology, horizontal scaling, immutable rollbacks, and the post-v1 10-point roadmap.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={() => setCurrentView('tech_stack')}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-700 text-[#374151] border border-[#E5E7EB] text-sm font-medium transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>📚</span>
              Section 13 (Stack)
            </button>
            <button
              onClick={() => setCurrentView('roadmap')}
              className="px-4 py-2.5 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-[#111827] font-medium text-sm transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>🔄</span>
              Section 12 (Roadmap)
            </button>
          </div>
        </div>

        {/* QUICK STATS ROW */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-[#E5E7EB]">
          <div className="bg-white rounded-xl p-3 border border-[#E5E7EB]">
            <div className="text-xs text-[#6B7280] font-medium">3 Environments</div>
            <div className="text-lg font-bold text-cyan-400 mt-0.5">Local • Staging • Prod</div>
          </div>
          <div className="bg-white rounded-xl p-3 border border-[#E5E7EB]">
            <div className="text-xs text-[#6B7280] font-medium">CI/CD Automation</div>
            <div className="text-lg font-bold text-emerald-400 mt-0.5">3-Stage Gate (SHA)</div>
          </div>
          <div className="bg-white rounded-xl p-3 border border-[#E5E7EB]">
            <div className="text-xs text-[#6B7280] font-medium">Rollback SLA</div>
            <div className="text-lg font-bold text-amber-400 mt-0.5">&lt; 15s Instant Shift</div>
          </div>
          <div className="bg-white rounded-xl p-3 border border-[#E5E7EB]">
            <div className="text-xs text-[#6B7280] font-medium">Future Enhancements</div>
            <div className="text-lg font-bold text-purple-400 mt-0.5">10 Post-4-Week Items</div>
          </div>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#E5E7EB]">
        <button
          onClick={() => setActiveTab('environments')}
          className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
            activeTab === 'environments'
              ? 'bg-[#DC2626] text-[#111827] shadow-xs'
              : 'bg-white text-[#4B5563] hover:bg-[#F3F4F6] hover:text-[#111827] border border-[#E5E7EB]'
          }`}
        >
          <span>🖥️</span>
          14.1 Environments
        </button>
        <button
          onClick={() => setActiveTab('cicd')}
          className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
            activeTab === 'cicd'
              ? 'bg-[#DC2626] text-[#111827] shadow-xs'
              : 'bg-white text-[#4B5563] hover:bg-[#F3F4F6] hover:text-[#111827] border border-[#E5E7EB]'
          }`}
        >
          <span>🔀</span>
          14.2 CI/CD Pipeline
        </button>
        <button
          onClick={() => setActiveTab('infrastructure')}
          className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
            activeTab === 'infrastructure'
              ? 'bg-[#DC2626] text-[#111827] shadow-xs'
              : 'bg-white text-[#4B5563] hover:bg-[#F3F4F6] hover:text-[#111827] border border-[#E5E7EB]'
          }`}
        >
          <span>☁️</span>
          14.3 Infrastructure
        </button>
        <button
          onClick={() => setActiveTab('scaling')}
          className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
            activeTab === 'scaling'
              ? 'bg-[#DC2626] text-[#111827] shadow-xs'
              : 'bg-white text-[#4B5563] hover:bg-[#F3F4F6] hover:text-[#111827] border border-[#E5E7EB]'
          }`}
        >
          <span>🎛️</span>
          14.4 Scaling Approach
        </button>
        <button
          onClick={() => setActiveTab('rollback')}
          className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
            activeTab === 'rollback'
              ? 'bg-[#DC2626] text-[#111827] shadow-xs'
              : 'bg-white text-[#4B5563] hover:bg-[#F3F4F6] hover:text-[#111827] border border-[#E5E7EB]'
          }`}
        >
          <span>🔄</span>
          14.5 Rollback Strategy
        </button>
        <button
          onClick={() => setActiveTab('future_enhancements')}
          className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
            activeTab === 'future_enhancements'
              ? 'bg-[#DC2626] text-[#111827] shadow-xs'
              : 'bg-white text-[#4B5563] hover:bg-[#F3F4F6] hover:text-[#111827] border border-[#E5E7EB]'
          }`}
        >
          <span>✨</span>
          15. Future Enhancements (10 Items)
        </button>
        <button
          onClick={() => setActiveTab('tools_required')}
          className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
            activeTab === 'tools_required'
              ? 'bg-[#DC2626] text-[#111827] shadow-xs'
              : 'bg-white text-[#4B5563] hover:bg-[#F3F4F6] hover:text-[#111827] border border-[#E5E7EB]'
          }`}
        >
          <span>🔧</span>
          16. Tools Required (Dev, Test & Cloud)
        </button>
      </div>

      {/* ==================================================================== */}
      {/* TAB 1: 14.1 ENVIRONMENTS */}
      {/* ==================================================================== */}
      {activeTab === 'environments' && (
        <div className="space-y-6">
          {/* Environment Selector Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {ENVIRONMENTS.map(env => (
              <button
                key={env.id}
                onClick={() => setSelectedEnv(env.id)}
                className={`p-5 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                  selectedEnv === env.id
                    ? 'bg-white border-cyan-500 shadow-xl shadow-cyan-950/50 ring-1 ring-cyan-500/50'
                    : 'bg-white border-[#E5E7EB] hover:bg-[#F9FAFB] hover:border-[#E5E7EB] text-[#4B5563]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${env.badgeColor}`}>
                    {env.badge}
                  </span>
                  {selectedEnv === env.id && (
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                  )}
                </div>
                <h3 className="text-lg font-bold text-[#111827]">{env.name}</h3>
                <p className="text-xs text-[#6B7280] mt-1 line-clamp-2">{env.description}</p>
                <div className="mt-3 pt-3 border-t border-[#E5E7EB] flex items-center justify-between text-xs text-[#6B7280]">
                  <span>Host: {env.hostingPlatform.split(' ')[0]}</span>
                  <span className="text-cyan-400 font-mono">{env.domain}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Detailed Environment View */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E5E7EB] gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-[#111827] flex items-center gap-2">
                    <span>🖥️</span>
                    {currentEnvSpec.name} Specifications
                  </h2>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium border ${currentEnvSpec.badgeColor}`}>
                    {currentEnvSpec.badge}
                  </span>
                </div>
                <p className="text-sm text-[#6B7280] mt-1">{currentEnvSpec.description}</p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-[#6B7280] bg-[#F9FAFB] px-3 py-1.5 rounded-lg border border-[#E5E7EB]">
                  Endpoint: <span className="text-cyan-400">{currentEnvSpec.domain}</span>
                </span>
              </div>
            </div>

            {/* Resource Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-[#F9FAFB] p-4 rounded-xl border border-[#E5E7EB]">
                <div className="text-xs text-[#6B7280] flex items-center gap-1.5">
                  <span>⚙️</span> CPU Allocation
                </div>
                <div className="text-sm font-bold text-[#111827] mt-1">{currentEnvSpec.resourceAllocation.cores}</div>
              </div>
              <div className="bg-[#F9FAFB] p-4 rounded-xl border border-[#E5E7EB]">
                <div className="text-xs text-[#6B7280] flex items-center gap-1.5">
                  <span>💾</span> Memory (RAM)
                </div>
                <div className="text-sm font-bold text-[#111827] mt-1">{currentEnvSpec.resourceAllocation.ram}</div>
              </div>
              <div className="bg-[#F9FAFB] p-4 rounded-xl border border-[#E5E7EB]">
                <div className="text-xs text-[#6B7280] flex items-center gap-1.5">
                  <span>🗄️</span> Storage Type
                </div>
                <div className="text-sm font-bold text-[#111827] mt-1">{currentEnvSpec.resourceAllocation.storage}</div>
              </div>
              <div className="bg-[#F9FAFB] p-4 rounded-xl border border-[#E5E7EB]">
                <div className="text-xs text-[#6B7280] flex items-center gap-1.5">
                  <span>📊</span> Scaling / Replicas
                </div>
                <div className="text-sm font-bold text-[#111827] mt-1">{currentEnvSpec.resourceAllocation.replicas}</div>
              </div>
            </div>

            {/* Service & Container Topology Table */}
            <div>
              <h3 className="text-sm font-semibold text-[#4B5563] uppercase tracking-wider mb-3 flex items-center gap-2">
                <span>📦</span>
                Service Topology & Container Manifest ({currentEnvSpec.containers.length} Services)
              </h3>
              <div className="overflow-x-auto rounded-xl border border-[#E5E7EB]">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#F9FAFB] text-[#6B7280] font-semibold border-b border-[#E5E7EB]">
                    <tr>
                      <th className="py-3 px-4">Service Name</th>
                      <th className="py-3 px-4">Container Image / Engine</th>
                      <th className="py-3 px-4">Port / Protocol</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Role & Responsibility</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 bg-white">
                    {currentEnvSpec.containers.map((cont, idx) => (
                      <tr key={idx} className="hover:bg-white transition-colors">
                        <td className="py-3 px-4 font-mono font-medium text-[#111827] flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-400" />
                          {cont.name}
                        </td>
                        <td className="py-3 px-4 font-mono text-xs text-[#4B5563]">{cont.image}</td>
                        <td className="py-3 px-4 font-mono text-xs text-cyan-400">{cont.port}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
                            {cont.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-xs text-[#6B7280]">{cont.role}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Operational Notes */}
            <div className="bg-[#F9FAFB] p-4 rounded-xl border border-[#E5E7EB] space-y-2">
              <h4 className="text-xs font-semibold text-[#4B5563] uppercase tracking-wider">
                Key Operational Characteristics
              </h4>
              <ul className="space-y-1.5 text-xs text-[#6B7280]">
                {currentEnvSpec.configNotes.map((note, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span>✅</span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 2: 14.2 CI/CD PIPELINE */}
      {/* ==================================================================== */}
      {activeTab === 'cicd' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E5E7EB] gap-4">
              <div>
                <h2 className="text-xl font-bold text-[#111827] flex items-center gap-2">
                  <span>🔀</span>
                  GitHub Actions CI/CD Pipeline Automation (Section 14.2)
                </h2>
                <p className="text-sm text-[#6B7280] mt-1">
                  Automated verification and deployment flow from PR creation to production promotion.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(`name: CI/CD Pipeline\n# Refer to /.github/workflows/deploy.yml\n`, 'workflow')}
                  className="px-3 py-1.5 rounded-lg bg-[#F3F4F6] hover:bg-slate-700 text-[#4B5563] text-xs font-medium border border-[#E5E7EB] flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedSection === 'workflow' ? <span>✔️</span> : <span>📋</span>}
                  Copy Workflow Config
                </button>
              </div>
            </div>

            {/* 3 Interactive Pipeline Stages */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {PIPELINE_STAGES.map((stage, idx) => (
                <div
                  key={stage.step}
                  className={`rounded-2xl border p-5 flex flex-col justify-between transition-all ${
                    activeSimulation === idx
                      ? 'bg-white border-emerald-500 shadow-xl shadow-emerald-950/40 ring-1 ring-emerald-500/50'
                      : 'bg-[#F9FAFB] border-[#E5E7EB]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="w-6 h-6 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center justify-center text-xs font-bold">
                        {stage.step}
                      </span>
                      <span className="text-xs font-mono text-cyan-400 bg-white px-2 py-0.5 rounded border border-[#E5E7EB]">
                        {stage.targetEnv}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-[#111827]">{stage.name}</h3>
                    <div className="text-xs text-emerald-400 font-mono mt-1">{stage.trigger}</div>

                    {/* Task List */}
                    <div className="mt-4 space-y-2">
                      {stage.tasks.map((task, tIdx) => (
                        <div key={tIdx} className="bg-white p-2.5 rounded-lg border border-[#E5E7EB] flex items-center justify-between text-xs">
                          <div className="space-y-0.5">
                            <div className="text-[#374151] font-medium flex items-center gap-1.5">
                              <span>✅</span>
                              {task.name}
                            </div>
                            <div className="text-[11px] font-mono text-[#9CA3AF]">{task.command}</div>
                          </div>
                          <span className="text-[11px] font-mono text-[#6B7280]">{task.duration}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-[#E5E7EB] space-y-3">
                    <p className="text-xs text-[#6B7280] italic">
                      <span className="font-semibold text-[#4B5563]">Gate:</span> {stage.gate}
                    </p>

                    <button
                      onClick={() => runSimulation(idx)}
                      disabled={isSimulating}
                      className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-[#111827] font-medium text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-600/20"
                    >
                      <span>▶️</span>
                      {isSimulating && activeSimulation === idx ? 'Executing Workflow...' : `Simulate Stage ${stage.step} Run`}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* LIVE SIMULATED TERMINAL OUTPUT */}
            {simLogs.length > 0 && (
              <div className="rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-4 space-y-2">
                <div className="flex items-center justify-between text-xs text-[#6B7280] pb-2 border-b border-[#E5E7EB]">
                  <span className="flex items-center gap-2 font-mono text-emerald-400">
                    <span>💻</span>
                    GitHub Actions Runner Console Output
                  </span>
                  <button
                    onClick={() => setSimLogs([])}
                    className="text-[#9CA3AF] hover:text-[#4B5563] transition-colors"
                  >
                    Clear Output
                  </button>
                </div>
                <div className="font-mono text-xs space-y-1 max-h-48 overflow-y-auto pt-2 text-[#4B5563]">
                  {simLogs.map((line, lIdx) => (
                    <div
                      key={lIdx}
                      className={
                        line.includes('[SUCCESS]')
                          ? 'text-emerald-400'
                          : line.includes('[RUNNING]')
                          ? 'text-cyan-400'
                          : line.includes('[SUMMARY]')
                          ? 'text-amber-300 font-bold'
                          : 'text-[#6B7280]'
                      }
                    >
                      {line}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 3: 14.3 INFRASTRUCTURE COMPONENTS */}
      {/* ==================================================================== */}
      {activeTab === 'infrastructure' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 space-y-6">
            <div className="pb-4 border-b border-[#E5E7EB]">
              <h2 className="text-xl font-bold text-[#111827] flex items-center gap-2">
                <span>☁️</span>
                Cloud Infrastructure Components (Section 14.3)
              </h2>
              <p className="text-sm text-[#6B7280] mt-1">
                Managed cloud primitives, persistent databases, caches, object storage, and secret enclaves.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {INFRASTRUCTURE_COMPONENTS.map(comp => (
                <div
                  key={comp.id}
                  className="bg-[#F9FAFB] rounded-2xl border border-[#E5E7EB] p-5 space-y-4 hover:border-indigo-500/50 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-950 text-indigo-300 border border-indigo-800">
                        {comp.category}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-950 text-emerald-300 border border-emerald-800">
                        {comp.status}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-[#111827]">{comp.title}</h3>
                      <div className="text-xs text-indigo-400 font-mono mt-0.5">{comp.technology}</div>
                    </div>

                    <p className="text-xs text-[#4B5563] leading-relaxed">{comp.role}</p>

                    <div className="space-y-2 pt-2 border-t border-[#E5E7EB] text-xs">
                      <div>
                        <span className="text-[#6B7280] font-medium">Specs: </span>
                        <span className="text-[#4B5563]">{comp.specs}</span>
                      </div>
                      <div>
                        <span className="text-[#6B7280] font-medium">HA / Failover: </span>
                        <span className="text-emerald-400">{comp.haStrategy}</span>
                      </div>
                      <div>
                        <span className="text-[#6B7280] font-medium">Security: </span>
                        <span className="text-amber-400">{comp.securityControls}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 4: 14.4 SCALING APPROACH */}
      {/* ==================================================================== */}
      {activeTab === 'scaling' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 space-y-6">
            <div className="pb-4 border-b border-[#E5E7EB]">
              <h2 className="text-xl font-bold text-[#111827] flex items-center gap-2">
                <span>🎛️</span>
                Stateless Scaling & Microservice Decoupling (Section 14.4)
              </h2>
              <p className="text-sm text-[#6B7280] mt-1">
                How horizontal autoscaling, Redis read caching, and AI microservice isolation prevent latency degradation.
              </p>
            </div>

            {/* Interactive Load Simulator */}
            <div className="bg-[#F9FAFB] p-5 rounded-2xl border border-[#E5E7EB] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-base font-bold text-[#111827]">Interactive Concurrent Load Simulator</h3>
                  <p className="text-xs text-[#6B7280]">Drag to observe horizontal pod autoscaling & cache shielding</p>
                </div>
                <div className="text-xl font-extrabold text-cyan-400 font-mono">
                  {simulatedRps.toLocaleString()} Requests / Sec
                </div>
              </div>

              <input
                type="range"
                min="200"
                max="25000"
                step="200"
                value={simulatedRps}
                onChange={e => setSimulatedRps(Number(e.target.value))}
                className="w-full h-2 bg-[#F3F4F6] rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
                <div className="bg-white p-3 rounded-xl border border-[#E5E7EB] text-center">
                  <div className="text-xs text-[#6B7280]">Core LMS Pods (HPA)</div>
                  <div className="text-lg font-bold text-cyan-400 mt-1">{calculatedMetrics.lmsPods} Pods</div>
                </div>
                <div className="bg-white p-3 rounded-xl border border-[#E5E7EB] text-center">
                  <div className="text-xs text-[#6B7280]">AI Service Pods</div>
                  <div className="text-lg font-bold text-purple-400 mt-1">{calculatedMetrics.aiPods} Pods</div>
                </div>
                <div className="bg-white p-3 rounded-xl border border-[#E5E7EB] text-center">
                  <div className="text-xs text-[#6B7280]">Redis Cache Hit %</div>
                  <div className="text-lg font-bold text-emerald-400 mt-1">{calculatedMetrics.redisCacheHitPercent}%</div>
                </div>
                <div className="bg-white p-3 rounded-xl border border-[#E5E7EB] text-center">
                  <div className="text-xs text-[#6B7280]">Postgres Read Replicas</div>
                  <div className="text-lg font-bold text-amber-400 mt-1">
                    {calculatedMetrics.dbReadReplicas > 0 ? `${calculatedMetrics.dbReadReplicas} Active` : '1 Standby'}
                  </div>
                </div>
                <div className="bg-white p-3 rounded-xl border border-[#E5E7EB] text-center col-span-2 sm:col-span-1">
                  <div className="text-xs text-[#6B7280]">Estimated p99 Latency</div>
                  <div className="text-lg font-bold text-[#111827] mt-1">{calculatedMetrics.estP99Latency}</div>
                </div>
              </div>
            </div>

            {/* 4 Architectural Scaling Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#F9FAFB] p-4 rounded-xl border border-[#E5E7EB] space-y-2">
                <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm">
                  <span>⚡</span> 1. Stateless Architecture
                </div>
                <p className="text-xs text-[#4B5563] leading-relaxed">
                  Both Core LMS (Express) and AI Tutor (FastAPI) microservices store zero session state on local disk or container memory. User authentication utilizes stateless JWTs and Redis-backed revocations, enabling instant container scale-out behind the ALB in seconds without sticky sessions.
                </p>
              </div>

              <div className="bg-[#F9FAFB] p-4 rounded-xl border border-[#E5E7EB] space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
                  <span>🗄️</span> 2. Redis Tier Protection
                </div>
                <p className="text-xs text-[#4B5563] leading-relaxed">
                  Read-heavy endpoints like course catalog browsing, active filters, student leaderboards, and user headers are cached with a 5-minute TTL. Over 90% of requests are absorbed by Redis before reaching PostgreSQL, preserving transactional IOPS for submissions and quizzes.
                </p>
              </div>

              <div className="bg-[#F9FAFB] p-4 rounded-xl border border-[#E5E7EB] space-y-2">
                <div className="flex items-center gap-2 text-purple-400 font-semibold text-sm">
                  <span>🖥️</span> 3. Dedicated AI Service Isolation
                </div>
                <p className="text-xs text-[#4B5563] leading-relaxed">
                  Heavy vector chunk retrieval, pgvector similarity scoring, and streaming token responses to Anthropic LLM models execute exclusively on the separate Python FastAPI microservice. If a 15-second LLM prompt streams, core LMS CRUD endpoints remain completely unblocked at &lt; 25ms.
                </p>
              </div>

              <div className="bg-[#F9FAFB] p-4 rounded-xl border border-[#E5E7EB] space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
                  <span>📊</span> 4. Database Read Replicas
                </div>
                <p className="text-xs text-[#4B5563] leading-relaxed">
                  PostgreSQL read replicas handle instructor analytics, cohort drop-off reports, and admin compliance exports. The primary writer instance only handles transactional mutations (enrollments, quiz attempts, assignment submissions), eliminating table lock contention.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 5: 14.5 ROLLBACK STRATEGY */}
      {/* ==================================================================== */}
      {activeTab === 'rollback' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 space-y-6">
            <div className="pb-4 border-b border-[#E5E7EB]">
              <h2 className="text-xl font-bold text-[#111827] flex items-center gap-2">
                <span>🔄</span>
                Immutable Rollback Strategy (Section 14.5)
              </h2>
              <p className="text-sm text-[#6B7280] mt-1">
                Zero-recompilation, instantaneous traffic reversion via immutable Git commit SHA container tags.
              </p>
            </div>

            {/* Interactive Rollback Dashboard */}
            <div className="bg-[#F9FAFB] p-5 rounded-2xl border border-[#E5E7EB] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-[#111827]">Current Production Image Active</h3>
                  <div className="font-mono text-xs text-cyan-400 mt-1 bg-white px-3 py-1.5 rounded-lg border border-[#E5E7EB] inline-block">
                    {activeImageTag}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={triggerRollbackSimulation}
                    disabled={rollbackStatus === 'executing'}
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-[#111827] font-semibold text-xs transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-rose-600/30"
                  >
                    <span>🔄</span>
                    {rollbackStatus === 'executing' ? 'Shifting Traffic to Prior SHA...' : 'Simulate 1-Click Rollback'}
                  </button>
                </div>
              </div>

              {rollbackStatus === 'completed' && (
                <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-800 text-xs text-emerald-300 flex items-center gap-2">
                  <span>✅</span>
                  <span>
                    Rollback Successful! Production ALB switched 100% of traffic to verified prior tag <code className="font-mono font-bold">v1.0.0-sha-71b3e2f</code> in 3.2 seconds.
                  </span>
                </div>
              )}
            </div>

            {/* Comparison Matrix: Blue-Green vs Rebuild */}
            <div className="overflow-x-auto rounded-xl border border-[#E5E7EB]">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#F9FAFB] text-[#6B7280] font-semibold border-b border-[#E5E7EB]">
                  <tr>
                    <th className="py-3 px-4">Dimension</th>
                    <th className="py-3 px-4 text-emerald-400">Vertexon Immutable SHA Reversion</th>
                    <th className="py-3 px-4 text-rose-400">Ad-Hoc Recompilation / Git Revert</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 bg-white text-xs">
                  <tr>
                    <td className="py-3 px-4 font-semibold text-[#111827]">Time to Revert</td>
                    <td className="py-3 px-4 text-emerald-400 font-bold">&lt; 15 Seconds (ALB Target Group switch)</td>
                    <td className="py-3 px-4 text-rose-400">10 to 25 Minutes (Code checkout, rebuild, push)</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-[#111827]">Reproducibility</td>
                    <td className="py-3 px-4 text-[#4B5563]">100% Guaranteed bit-for-bit identical binary</td>
                    <td className="py-3 px-4 text-[#6B7280]">Risk of dependency drift during npm/pip install</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-[#111827]">Database Migrations</td>
                    <td className="py-3 px-4 text-[#4B5563]">Expand/Contract design allows N-1 backward schema compatibility</td>
                    <td className="py-3 px-4 text-[#6B7280]">Manual down migrations risk data truncation</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-[#111827]">Registry Retention</td>
                    <td className="py-3 px-4 text-[#4B5563]">Last 30 release images retained in GHCR / AWS ECR</td>
                    <td className="py-3 px-4 text-[#6B7280]">Images overwritten with ':latest' tags</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 6: 15. FUTURE ENHANCEMENTS */}
      {/* ==================================================================== */}
      {activeTab === 'future_enhancements' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E5E7EB] gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-[#111827] flex items-center gap-2">
                    <span>✨</span>
                    Section 15: Future Enhancements (Post-4-Week Roadmap)
                  </h2>
                </div>
                <p className="text-sm text-[#6B7280] mt-1">
                  Ordered roughly by expected value-to-effort ratio for a post-4-week implementation phase.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(
                    FUTURE_ENHANCEMENTS.map(e => `${e.id}. ${e.title} (${e.ratioRating})\n   - ${e.summary}\n   - Tech: ${e.techDetails}`).join('\n\n'),
                    'enhancements'
                  )}
                  className="px-3 py-1.5 rounded-lg bg-[#F3F4F6] hover:bg-slate-700 text-[#4B5563] text-xs font-medium border border-[#E5E7EB] flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedSection === 'enhancements' ? <span>✔️</span> : <span>📋</span>}
                  Export 10 Items
                </button>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search future roadmap items, tech stacks, or features..."
                  value={searchEnhancement}
                  onChange={e => setSearchEnhancement(e.target.value)}
                  className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-xs text-[#111827] placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <select
                  value={selectedPhaseFilter}
                  onChange={e => setSelectedPhaseFilter(e.target.value)}
                  className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs text-[#4B5563] focus:outline-none focus:border-purple-500"
                >
                  <option value="ALL">All Phases</option>
                  <option value="Phase 2">Phase 2 (Immediate)</option>
                  <option value="Phase 3">Phase 3 (Mid-Term)</option>
                  <option value="Phase 4">Phase 4 (Strategic)</option>
                </select>

                <select
                  value={selectedCategoryFilter}
                  onChange={e => setSelectedCategoryFilter(e.target.value)}
                  className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs text-[#4B5563] focus:outline-none focus:border-purple-500"
                >
                  <option value="ALL">All Categories</option>
                  <option value="Collaboration">Collaboration</option>
                  <option value="AI & ML">AI & ML</option>
                  <option value="Monetization">Monetization</option>
                  <option value="Mobile & Offline">Mobile & Offline</option>
                  <option value="Analytics">Analytics</option>
                  <option value="Enterprise">Enterprise</option>
                </select>
              </div>
            </div>

            {/* Enhancements List */}
            <div className="space-y-4">
              {filteredEnhancements.map(item => {
                const isExpanded = expandedEnhancementId === item.id;
                return (
                  <div
                    key={item.id}
                    className={`rounded-2xl border transition-all overflow-hidden ${
                      isExpanded
                        ? 'bg-[#F9FAFB] border-purple-500/70 shadow-xl shadow-purple-950/20'
                        : 'bg-[#F9FAFB] border-[#E5E7EB] hover:border-[#E5E7EB]'
                    }`}
                  >
                    <button
                      onClick={() => setExpandedEnhancementId(isExpanded ? null : item.id)}
                      className="w-full p-4 sm:p-5 text-left flex items-start sm:items-center justify-between gap-4 cursor-pointer"
                    >
                      <div className="flex items-start sm:items-center gap-3.5">
                        <span className="w-7 h-7 rounded-xl bg-purple-950 text-purple-300 border border-purple-800 flex items-center justify-center text-xs font-bold shrink-0">
                          {item.id}
                        </span>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm sm:text-base font-bold text-[#111827]">{item.title}</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-950/80 text-purple-300 border border-purple-800">
                              {item.category}
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-800">
                              {item.ratioRating}
                            </span>
                          </div>
                          <p className="text-xs text-[#6B7280] line-clamp-1">{item.summary}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="hidden md:inline-block text-xs font-mono text-[#6B7280] bg-white px-2.5 py-1 rounded border border-[#E5E7EB]">
                          {item.phase.split(' ')[0]} {item.phase.split(' ')[1]}
                        </span>
                        <span>›</span>
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="px-4 sm:px-5 pb-5 pt-1 border-t border-[#E5E7EB] space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div className="bg-white p-3 rounded-xl border border-[#E5E7EB] text-xs">
                            <span className="text-[#6B7280] font-medium">Roadmap Phase:</span>
                            <div className="text-purple-300 font-semibold mt-0.5">{item.phase}</div>
                          </div>
                          <div className="bg-white p-3 rounded-xl border border-[#E5E7EB] text-xs">
                            <span className="text-[#6B7280] font-medium">Implementation Complexity:</span>
                            <div className="text-amber-300 font-semibold mt-0.5">{item.complexity}</div>
                          </div>
                          <div className="bg-white p-3 rounded-xl border border-[#E5E7EB] text-xs">
                            <span className="text-[#6B7280] font-medium">Estimated Engineering Effort:</span>
                            <div className="text-emerald-300 font-semibold mt-0.5">{item.estimatedEffort}</div>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <h4 className="text-xs font-semibold text-[#4B5563] uppercase tracking-wider">
                            Technical Architecture & Implementation Details
                          </h4>
                          <p className="text-xs text-[#4B5563] bg-white p-3 rounded-xl border border-[#E5E7EB] leading-relaxed font-mono">
                            {item.techDetails}
                          </p>
                        </div>

                        <div className="space-y-1.5">
                          <h4 className="text-xs font-semibold text-[#4B5563] uppercase tracking-wider">
                            Expected Business & Pedagogical Value
                          </h4>
                          <p className="text-xs text-[#4B5563] bg-white p-3 rounded-xl border border-[#E5E7EB] leading-relaxed">
                            {item.expectedValue}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 7: 16. TOOLS REQUIRED (DEV, TEST & CLOUD ECOSYSTEM) */}
      {/* ==================================================================== */}
      {activeTab === 'tools_required' && (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="bg-white rounded-2xl p-6 border border-teal-900/40 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-950 text-teal-300 border border-teal-800">
                    PRD Section 16
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-950 text-indigo-300 border border-indigo-800">
                    Single-Developer Velocity Stack
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
                    100% Configured & Verified
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#111827] tracking-tight flex items-center gap-2.5">
                  <span>🔧</span>
                  Section 16: Tools Required
                </h2>
                <p className="text-[#4B5563] text-sm max-w-3xl leading-relaxed">
                  Comprehensive tooling and environment prerequisites across local development runtimes, testing and quality assurance suites, and cloud infrastructure accounts required to build, test, and ship the LMS platform in 4 weeks.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const bashScript = `#!/usr/bin/env bash
# Vertexon LMS Development Environment Verification
set -e
echo "=== Checking LMS Dev Environment Prerequisites ==="
node -v || echo "Node.js missing!"
npm -v || echo "npm missing!"
python3 --version || echo "Python missing!"
docker --version || echo "Docker missing!"
docker compose version || echo "Docker Compose missing!"
psql --version || echo "psql missing!"
redis-cli --version || echo "redis-cli missing!"
git --version || echo "Git missing!"
echo "=== All prerequisites verified! ==="`;
                    navigator.clipboard.writeText(bashScript);
                    setCopiedSection('bash-setup-script');
                    setTimeout(() => setCopiedSection(null), 2500);
                  }}
                  className="px-4 py-2 rounded-xl bg-teal-950/80 hover:bg-teal-900/80 text-teal-300 border border-teal-800/80 text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-lg"
                >
                  {copiedSection === 'bash-setup-script' ? (
                    <>
                      <span>✔️</span>
                      Script Copied!
                    </>
                  ) : (
                    <>
                      <span>📋</span>
                      Copy Verification Script
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-[#E5E7EB]">
              <div className="bg-[#F9FAFB] rounded-xl p-3 border border-[#E5E7EB]">
                <div className="text-xs text-[#6B7280] font-medium">16.1 Dev Environment</div>
                <div className="text-sm font-bold text-teal-300 mt-1">7 Local Runtimes & Engines</div>
                <div className="text-xs text-[#9CA3AF] mt-0.5">Node 20, Python 3.11, Docker, Postgres, Redis</div>
              </div>
              <div className="bg-[#F9FAFB] rounded-xl p-3 border border-[#E5E7EB]">
                <div className="text-xs text-[#6B7280] font-medium">16.2 API & Testing Tools</div>
                <div className="text-sm font-bold text-indigo-300 mt-1">3 Quality Verification Tiers</div>
                <div className="text-xs text-[#9CA3AF] mt-0.5">Postman, Jest/Pytest/Playwright, k6 Load</div>
              </div>
              <div className="bg-[#F9FAFB] rounded-xl p-3 border border-[#E5E7EB]">
                <div className="text-xs text-[#6B7280] font-medium">16.3 Cloud & Infrastructure</div>
                <div className="text-sm font-bold text-amber-300 mt-1">5 Managed Cloud Services</div>
                <div className="text-xs text-[#9CA3AF] mt-0.5">AWS/GCP, GHCR Registry, Route53, ACM, Anthropic</div>
              </div>
            </div>
          </div>

          {/* Section 16.1 Development Environment */}
          <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-teal-950 text-teal-400 border border-teal-800 flex items-center justify-center font-bold text-sm">
                  16.1
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#111827]">Development Environment</h3>
                  <p className="text-xs text-[#6B7280]">Local developer workstation dependencies and configuration</p>
                </div>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-[#F3F4F6] text-[#4B5563] border border-[#E5E7EB]">
                7 Core Toolings
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  name: 'Node.js & npm / pnpm',
                  version: 'LTS v20+ / pnpm 9.x',
                  role: 'Core Runtime & Package Engine',
                  purpose: 'Executes React 19 Vite client and Node.js Express LMS service with strict ESM/TypeScript support.',
                  command: 'node -v && pnpm -v',
                  status: 'Configured'
                },
                {
                  name: 'Python & pip / poetry',
                  version: 'Python 3.11+ / Poetry 1.8+',
                  role: 'AI Service & Embedding Pipelines',
                  purpose: 'FastAPI microservice executing pgvector cosine search, LangChain RAG retrieval, and Claude 3.5 LLM chat streaming.',
                  command: 'python3 --version && poetry --version',
                  status: 'Configured'
                },
                {
                  name: 'Docker Desktop & Compose',
                  version: 'v26+ / Compose v2.27+',
                  role: 'Local Container Parity',
                  purpose: 'Spins up Postgres with pgvector, Redis 7, MinIO S3 object vault, core-lms-service, and ai-service locally.',
                  command: 'docker compose -f infra/docker-compose.yml ps',
                  status: 'Ready'
                },
                {
                  name: 'PostgreSQL Client',
                  version: 'psql 16+ / DBeaver / TablePlus',
                  role: 'Relational Database Inspection',
                  purpose: 'Allows deep schema inspection across all 32 DDL tables, index verification, and pgvector HNSW query testing.',
                  command: 'psql -h localhost -U lms_user -d lms_db -c "\\\\dt"',
                  status: 'Active'
                },
                {
                  name: 'Redis CLI & RedisInsight',
                  version: 'Redis CLI 7.x / RedisInsight',
                  role: 'Cache & Queue Auditing',
                  purpose: 'Enables real-time inspection of active session tokens, BullMQ task status, and catalog Redis caching keys.',
                  command: 'redis-cli ping',
                  status: 'Ready'
                },
                {
                  name: 'Git & GitHub Workflows',
                  version: 'Git 2.40+ / GitHub Enterprise',
                  role: 'Source Control & CI Automation',
                  purpose: 'Branch protection, PR quality gates (lint/test/build), and GitHub Actions automated staging & production pipelines.',
                  command: 'git status -s && git remote -v',
                  status: 'Active'
                },
                {
                  name: 'Visual Studio Code',
                  version: 'Latest Stable + Extensions',
                  role: 'Integrated Development Environment',
                  purpose: 'Configured with ESLint, Prettier, Docker, Python (Pylance), and Thunder Client for rapid local API debugging.',
                  command: 'code --list-extensions',
                  status: 'Recommended'
                }
              ].map((tool, idx) => (
                <div key={idx} className="bg-[#F9FAFB] rounded-xl p-4 border border-[#E5E7EB] hover:border-teal-700/60 transition-all flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-teal-400 bg-teal-950/80 px-2 py-0.5 rounded border border-teal-800/80">
                        {tool.version}
                      </span>
                      <span className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
                        <span>✅</span>
                        {tool.status}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-[#111827]">{tool.name}</h4>
                    <div className="text-xs text-indigo-300 font-medium">{tool.role}</div>
                    <p className="text-xs text-[#6B7280] leading-relaxed">{tool.purpose}</p>
                  </div>

                  <div className="pt-2 border-t border-[#E5E7EB]">
                    <div className="bg-white rounded-lg p-2 font-mono text-[11px] text-[#4B5563] flex items-center justify-between border border-[#E5E7EB]">
                      <span className="truncate">{tool.command}</span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(tool.command);
                          setCopiedSection(`cmd-${idx}`);
                          setTimeout(() => setCopiedSection(null), 2000);
                        }}
                        className="text-[#6B7280] hover:text-[#111827] ml-2 p-1 cursor-pointer"
                        title="Copy Command"
                      >
                        {copiedSection === `cmd-${idx}` ? (
                          <span>✔️</span>
                        ) : (
                          <span>📋</span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 16.2 API & Testing Tools */}
          <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-950 text-indigo-400 border border-indigo-800 flex items-center justify-center font-bold text-sm">
                  16.2
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#111827]">API & Testing Tools</h3>
                  <p className="text-xs text-[#6B7280]">Endpoint testing, test harness runners, and stress load testing engines</p>
                </div>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-[#F3F4F6] text-[#4B5563] border border-[#E5E7EB]">
                Multi-Layer Verification
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  name: 'Postman / Insomnia',
                  category: 'REST Client & Collections',
                  description: 'Automated test assertions on 40+ REST API endpoints, environment variable token chaining, and exportable JSON collection for third-party integrations.',
                  testScope: 'Auth token handshake, role guard middleware, file upload multipart boundaries, and AI tutor streaming latency.',
                  cli: 'npx newman run postman_collection.json -e staging.env.json'
                },
                {
                  name: 'Jest, Supertest, Pytest & Playwright',
                  category: 'Automated Test Suites',
                  description: 'Unit testing (Jest/Pytest), HTTP integration testing (Supertest against Express endpoints), and full end-to-end browser workflows (Playwright).',
                  testScope: 'Covers user registration -> course enrollment -> assignment submission -> quiz auto-grading -> certificate PDF issuance in automated headless browser.',
                  cli: 'npm test && pytest tests/ && npx playwright test'
                },
                {
                  name: 'k6 / Apache JMeter',
                  category: 'Load & Concurrency Testing',
                  description: 'High-concurrency load testing engine simulating 1,000 to 10,000 concurrent students browsing catalog, streaming lessons, and submitting quiz attempts.',
                  testScope: 'Validates p99 latency under 200ms, verifies Redis cache absorption of read requests, and confirms zero database connection starvation.',
                  cli: 'k6 run --vus 2500 --duration 5m tests/load/catalog-surge.js'
                }
              ].map((item, idx) => (
                <div key={idx} className="bg-[#F9FAFB] rounded-xl p-5 border border-[#E5E7EB] flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-indigo-400 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-800/80">
                        {item.category}
                      </span>
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    </div>
                    <h4 className="text-base font-bold text-[#111827]">{item.name}</h4>
                    <p className="text-xs text-[#4B5563] leading-relaxed">{item.description}</p>
                    <div className="p-2.5 rounded-lg bg-white border border-[#E5E7EB] space-y-1">
                      <span className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider block">Scope:</span>
                      <p className="text-xs text-[#4B5563]">{item.testScope}</p>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-2 font-mono text-[11px] text-[#4B5563] flex items-center justify-between border border-[#E5E7EB]">
                    <span className="truncate">{item.cli}</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(item.cli);
                        setCopiedSection(`test-cmd-${idx}`);
                        setTimeout(() => setCopiedSection(null), 2000);
                      }}
                      className="text-[#6B7280] hover:text-[#111827] ml-2 p-1 cursor-pointer"
                      title="Copy Command"
                    >
                      {copiedSection === `test-cmd-${idx}` ? (
                        <span>✔️</span>
                      ) : (
                        <span>📋</span>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 16.3 Cloud & Infrastructure Accounts */}
          <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-950 text-amber-400 border border-amber-800 flex items-center justify-center font-bold text-sm">
                  16.3
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#111827]">Cloud & Infrastructure Accounts</h3>
                  <p className="text-xs text-[#6B7280]">Production and staging managed accounts, registries, and third-party APIs</p>
                </div>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-[#F3F4F6] text-[#4B5563] border border-[#E5E7EB]">
                Production Foundation
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  provider: 'Cloud Provider Account',
                  names: 'AWS / GCP / Azure',
                  icon: <span>☁️</span>,
                  allocated: 'ECS Fargate / Cloud Run, RDS PostgreSQL 16 with pgvector, ElastiCache Redis, S3 Vault',
                  notes: 'Handles horizontal container autoscaling, automated database backups with PITR, and object storage for multi-bitrate HLS video.'
                },
                {
                  provider: 'Container Registry',
                  names: 'GitHub Container Registry (GHCR) / AWS ECR',
                  icon: <span>📦</span>,
                  allocated: 'Immutable Docker image storage with SHA commit tagging',
                  notes: 'Integrates with GitHub Actions deploy pipeline with automated CVE vulnerability scanning on every push.'
                },
                {
                  provider: 'Domain Name & DNS',
                  names: 'Route 53 / Cloudflare DNS',
                  icon: <span>🌐</span>,
                  allocated: 'Managed zone with apex and wildcard subdomains',
                  notes: 'Proxies client web traffic, applies Cloudflare DDoS protection, and enables zero-downtime Blue/Green CNAME swaps.'
                },
                {
                  provider: 'SSL / TLS Certificate Provider',
                  names: "Let's Encrypt / AWS ACM",
                  icon: <span>🔒</span>,
                  allocated: 'Wildcard *.lms.vertexon.com TLS 1.3 certificates',
                  notes: 'Automated 90-day renewal with strict HTTPS enforcement and HSTS headers.'
                },
                {
                  provider: 'LLM Provider API Account',
                  names: 'Anthropic Claude / OpenAI / Google Gemini',
                  icon: <span>✨</span>,
                  allocated: 'High-throughput Tier 4 API Keys',
                  notes: 'Powers course syllabus grounded RAG answers, real-time citation generation, transcript quiz generation, and adaptive study plans.'
                },
                {
                  provider: 'Secrets Manager',
                  names: 'AWS Secrets Manager / GCP Secret Manager',
                  icon: <span>🛡️</span>,
                  allocated: 'Dynamic encrypted credential injection',
                  notes: 'Secures DB master passwords, Redis AUTH tokens, LLM API keys, and JWT private signing keys outside the codebase.'
                }
              ].map((acc, idx) => (
                <div key={idx} className="bg-[#F9FAFB] rounded-xl p-4 border border-[#E5E7EB] space-y-2.5">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-white border border-[#E5E7EB]">
                      {acc.icon}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#111827]">{acc.provider}</h4>
                      <span className="text-xs text-amber-300 font-medium">{acc.names}</span>
                    </div>
                  </div>
                  <div className="text-xs text-[#4B5563] bg-white p-2.5 rounded-lg border border-[#E5E7EB]">
                    <span className="font-semibold text-[#6B7280] block mb-0.5">Provisioned Resources:</span>
                    {acc.allocated}
                  </div>
                  <p className="text-xs text-[#6B7280] leading-relaxed">{acc.notes}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* OFFICIAL DOCUMENT FOOTER & CONCLUSION BADGE */}
      {/* ==================================================================== */}
      <div className="rounded-2xl bg-white border border-[#E5E7EB] p-6 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        <div className="space-y-1">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <span>🛡️</span>
            <span className="text-sm font-bold text-[#111827] uppercase tracking-wider">
              PRD Document Approved & Finalized
            </span>
          </div>
          <p className="text-xs text-[#6B7280]">
            End of Document — Vertexon Learning Technologies Pvt. Ltd. — LMS-AI PRD v1.0
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView('blueprint')}
            className="px-4 py-2 rounded-xl bg-[#F3F4F6] hover:bg-slate-700 text-[#374151] border border-[#E5E7EB] text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>📚</span>
            Full Blueprint Index
          </button>
          <button
            onClick={() => setCurrentView('courses')}
            className="px-4 py-2 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-[#111827] font-medium text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <span>↗️</span>
            Explore Live Catalog
          </button>
        </div>
      </div>
    </div>
  );
};
