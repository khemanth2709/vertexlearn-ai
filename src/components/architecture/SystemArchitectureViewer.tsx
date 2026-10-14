import React, { useState } from 'react';
import {
  SYSTEM_COMPONENTS,
  AI_TUTOR_REQUEST_FLOW,
  BACKGROUND_JOBS,
  CACHING_STRATEGY_RULES,
  SystemComponent,
  BackgroundJob
} from '../../data/systemArchitectureData';

export const SystemArchitectureViewer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'diagram' | 'flow' | 'jobs' | 'caching' | 'ascii'>('diagram');
  const [selectedComponentId, setSelectedComponentId] = useState<string>('ai_tutor_svc');
  const [diagramFilter, setDiagramFilter] = useState<'all' | 'data_plane' | 'ai_rag' | 'cache_jobs'>('all');

  // Request Flow Simulator State
  const [currentFlowStep, setCurrentFlowStep] = useState<number>(1);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulatedPrompt, setSimulatedPrompt] = useState<string>(
    'Why does quicksort degrade to O(n^2) on sorted input?'
  );
  const [flowLog, setFlowLog] = useState<string[]>([
    'System ready. Click "Run End-to-End Simulation" to observe packet flow across Gateway, pgvector, and LLM.'
  ]);

  // Background Job Trigger Simulation
  const [jobStates, setJobStates] = useState<Record<string, { status: 'idle' | 'running' | 'completed'; lastRun?: string; duration?: string }>>({
    job_transcription: { status: 'idle' },
    job_chunking_embeddings: { status: 'idle' },
    job_nightly_recommendations: { status: 'idle' },
    job_streak_eval: { status: 'idle' },
    job_cert_generation: { status: 'idle' },
    job_notification_dispatch: { status: 'idle' }
  });

  // Caching Simulator State
  const [cacheSimKey, setCacheSimKey] = useState<string>('courses:catalog:c_dsa_dev');
  const [cacheSimResult, setCacheSimResult] = useState<{
    status: 'HIT' | 'MISS' | 'EVICTED' | 'PURGED';
    latencyMs: number;
    layer: string;
    details: string;
  } | null>(null);

  const selectedComponent = SYSTEM_COMPONENTS.find((c) => c.id === selectedComponentId) || SYSTEM_COMPONENTS[0];

  // Request Flow Runner
  const runSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setCurrentFlowStep(1);
    setFlowLog(['[00:00.000] Initializing RAG query pipeline...']);

    const delays = [800, 1600, 2600, 3600, 4600];

    delays.forEach((delay, index) => {
      setTimeout(() => {
        const stepNum = index + 1;
        setCurrentFlowStep(stepNum);
        const stepData = AI_TUTOR_REQUEST_FLOW[index];
        setFlowLog((prev) => [
          ...prev,
          `[+${delay}ms] Step ${stepNum}: [${stepData.actor}] -> ${stepData.action}`
        ]);

        if (stepNum === 5) {
          setIsSimulating(false);
          setFlowLog((prev) => [
            ...prev,
            '[Complete] Request fulfilled in 412ms. Async topic mastery re-calculated in Redis queue.'
          ]);
        }
      }, delay);
    });
  };

  const triggerJob = (jobId: string, durationEst: string) => {
    setJobStates((prev) => ({
      ...prev,
      [jobId]: { status: 'running', lastRun: 'Just now' }
    }));

    setTimeout(() => {
      setJobStates((prev) => ({
        ...prev,
        [jobId]: {
          status: 'completed',
          lastRun: new Date().toLocaleTimeString(),
          duration: durationEst
        }
      }));
    }, 1500);
  };

  const testCacheLookup = (action: 'READ' | 'EVICT' | 'CDN_HIT') => {
    if (action === 'READ') {
      const isHit = Math.random() > 0.3;
      setCacheSimResult({
        status: isHit ? 'HIT' : 'MISS',
        latencyMs: isHit ? 3.2 : 54.8,
        layer: 'Redis Distributed Cache (db 0)',
        details: isHit
          ? 'Cache Hit: Serving pre-serialized JSON catalog directly from RAM (0 database roundtrips).'
          : 'Cache Miss: Fetched authoritative rows from PostgreSQL primary and primed Redis with TTL 300s.'
      });
    } else if (action === 'EVICT') {
      setCacheSimResult({
        status: 'EVICTED',
        latencyMs: 1.1,
        layer: 'Redis Cache Invalidation Event',
        details: 'Admin Course Approval event broadcasted via Redis Pub/Sub: purged key courses:catalog:* immediately.'
      });
    } else {
      setCacheSimResult({
        status: 'HIT',
        latencyMs: 12.4,
        layer: 'CloudFront Edge PoP (SIN-SG)',
        details: 'Edge CDN Cache Hit: Byte-range MP4 chunks served directly from regional edge server cache.'
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16 text-[#1F2937]">
      {/* Hero Header */}
      <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-[#DC2626] border border-red-200">
              <span>🏗️</span> Section 9: System Architecture & Distributed Infrastructure
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] tracking-tight">
              Cloud Architecture, RAG Pipeline & Job Queue
            </h1>
            <p className="text-sm text-[#4B5563] max-w-2xl leading-relaxed">
              Explore the multi-tier microservices architecture of Vertexon LMS-AI. Discover the high-level component topology, test the 5-step interactive AI Tutor RAG flow, inspect background asynchronous queues (Celery/BullMQ), and monitor the distributed multi-layer caching strategy.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            <div className="p-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl text-center min-w-[100px]">
              <div className="text-xl font-bold text-[#DC2626]">10</div>
              <div className="text-[11px] text-[#6B7280]">Core Services</div>
            </div>
            <div className="p-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl text-center min-w-[100px]">
              <div className="text-xl font-bold text-emerald-600">5 Steps</div>
              <div className="text-[11px] text-[#6B7280]">RAG Request Flow</div>
            </div>
            <div className="p-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl text-center min-w-[100px]">
              <div className="text-xl font-bold text-amber-600">6 Jobs</div>
              <div className="text-[11px] text-[#6B7280]">Async Workers</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 border-t border-[#E5E7EB] mt-6 pt-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab('diagram')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'diagram'
                ? 'bg-[#DC2626] text-white shadow-xs'
                : 'bg-[#F9FAFB] text-[#4B5563] hover:text-[#1F2937] border border-[#E5E7EB]'
            }`}
          >
            <span>🧩</span> 9.1 Component Topology & Nodes
          </button>
          <button
            onClick={() => setActiveTab('flow')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'flow'
                ? 'bg-[#DC2626] text-white shadow-xs'
                : 'bg-[#F9FAFB] text-[#4B5563] hover:text-[#1F2937] border border-[#E5E7EB]'
            }`}
          >
            <span>⚡</span> 9.2 AI Tutor Request Flow (RAG Simulator)
          </button>
          <button
            onClick={() => setActiveTab('jobs')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'jobs'
                ? 'bg-[#DC2626] text-white shadow-xs'
                : 'bg-[#F9FAFB] text-[#4B5563] hover:text-[#1F2937] border border-[#E5E7EB]'
            }`}
          >
            <span>⏱️</span> 9.3 Asynchronous Background Jobs
          </button>
          <button
            onClick={() => setActiveTab('caching')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'caching'
                ? 'bg-[#DC2626] text-white shadow-xs'
                : 'bg-[#F9FAFB] text-[#4B5563] hover:text-[#1F2937] border border-[#E5E7EB]'
            }`}
          >
            <span>🚀</span> 9.4 Multi-Layer Caching Strategy
          </button>
          <button
            onClick={() => setActiveTab('ascii')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'ascii'
                ? 'bg-[#DC2626] text-white shadow-xs'
                : 'bg-[#F9FAFB] text-[#4B5563] hover:text-[#1F2937] border border-[#E5E7EB]'
            }`}
          >
            <span>📜</span> ASCII Architecture Blueprint
          </button>
        </div>
      </div>

      {/* TAB 1: INTERACTIVE TOPOLOGY & NODES */}
      {activeTab === 'diagram' && (
        <div className="space-y-6">
          {/* Subheader & Controls */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <span className="text-xs font-bold text-[#6B7280] mr-2 flex items-center gap-1.5">
                <span>🧭</span> Filter Topology:
              </span>
              {[
                { id: 'all', label: 'All 10 Components' },
                { id: 'data_plane', label: 'Transactional Data Plane' },
                { id: 'ai_rag', label: 'AI & Vector Retrieval' },
                { id: 'cache_jobs', label: 'Queue & Cache Subsystem' }
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setDiagramFilter(f.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    diagramFilter === f.id
                      ? 'bg-red-50 text-[#DC2626] border border-red-200'
                      : 'bg-[#F9FAFB] text-[#4B5563] hover:text-[#1F2937] border border-[#E5E7EB]'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="text-xs text-[#6B7280] flex items-center gap-1.5">
              <span>ℹ️</span> Click any node to inspect technical specs and operational duties
            </div>
          </div>

          {/* Interactive Visual Topology Map */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Visual Node Graph (8 Columns) */}
            <div className="lg:col-span-8 bg-white border border-[#E5E7EB] rounded-3xl p-6 space-y-6 shadow-xs relative overflow-hidden">
              <div className="text-xs font-bold text-[#6B7280] uppercase tracking-wider flex items-center justify-between">
                <span>Multi-Tier Topology Diagram</span>
                <span className="text-[#DC2626] font-mono text-[11px]">HTTPS / gRPC / pgvector / BullMQ</span>
              </div>

              {/* TIER 1: CLIENT APPS */}
              <div className="flex justify-center">
                <div
                  onClick={() => setSelectedComponentId('client_apps')}
                  className={`w-full max-w-md p-4 rounded-2xl border cursor-pointer transition-all ${
                    selectedComponentId === 'client_apps'
                      ? 'bg-red-50/60 border-[#DC2626] shadow-xs scale-[1.01]'
                      : 'bg-[#F9FAFB] border-[#E5E7EB] hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 text-lg">
                        🌐
                      </div>
                      <div>
                        <div className="text-sm font-bold text-[#1F2937]">Client Apps (React SPA)</div>
                        <div className="text-xs text-[#6B7280]">Student / Instructor / Admin Dashboards</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                      Tier 1: Front
                    </span>
                  </div>
                </div>
              </div>

              {/* DOWN ARROW */}
              <div className="flex justify-center -my-2 text-[#6B7280]">
                <div className="flex flex-col items-center">
                  <div className="w-0.5 h-4 bg-gray-300"></div>
                  <div className="text-[10px] font-mono text-[#DC2626] px-2 py-0.5 rounded bg-[#F9FAFB] border border-[#E5E7EB]">
                    HTTPS (REST / JSON)
                  </div>
                  <div className="w-0.5 h-4 bg-gray-300"></div>
                </div>
              </div>

              {/* TIER 2: API GATEWAY */}
              <div className="flex justify-center">
                <div
                  onClick={() => setSelectedComponentId('api_gateway')}
                  className={`w-full max-w-md p-4 rounded-2xl border cursor-pointer transition-all ${
                    selectedComponentId === 'api_gateway'
                      ? 'bg-red-50/60 border-[#DC2626] shadow-xs scale-[1.01]'
                      : 'bg-[#F9FAFB] border-[#E5E7EB] hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 border border-purple-200 text-lg">
                        📡
                      </div>
                      <div>
                        <div className="text-sm font-bold text-[#1F2937]">API Gateway (NGINX)</div>
                        <div className="text-xs text-[#6B7280]">SSL Termination • Token Bucket Rate Limit • Routing</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                      Ingress
                    </span>
                  </div>
                </div>
              </div>

              {/* FORK ARROWS */}
              <div className="flex justify-center -my-2">
                <div className="w-4/5 border-t-2 border-gray-300 flex justify-between relative pt-3">
                  <div className="w-0.5 h-3 bg-gray-300 absolute left-0 top-0"></div>
                  <div className="w-0.5 h-3 bg-gray-300 absolute left-1/2 top-0"></div>
                  <div className="w-0.5 h-3 bg-gray-300 absolute right-0 top-0"></div>
                </div>
              </div>

              {/* TIER 3: MICROSERVICES */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Core LMS */}
                <div
                  onClick={() => setSelectedComponentId('core_lms_svc')}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    selectedComponentId === 'core_lms_svc'
                      ? 'bg-red-50/60 border-[#DC2626] shadow-xs scale-[1.01]'
                      : 'bg-[#F9FAFB] border-[#E5E7EB] hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span>🖥️</span>
                    <span className="text-xs font-bold text-[#1F2937]">Core LMS Service</span>
                  </div>
                  <div className="text-[11px] text-[#6B7280]">Node.js / Express</div>
                  <div className="text-[10px] text-[#9CA3AF] mt-1">Auth, Courses, Quizzes, Grading</div>
                </div>

                {/* AI Tutor Service */}
                <div
                  onClick={() => setSelectedComponentId('ai_tutor_svc')}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    selectedComponentId === 'ai_tutor_svc'
                      ? 'bg-red-50/60 border-[#DC2626] shadow-xs scale-[1.01]'
                      : 'bg-[#F9FAFB] border-[#E5E7EB] hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span>✨</span>
                    <span className="text-xs font-bold text-[#1F2937]">AI Tutor Service</span>
                  </div>
                  <div className="text-[11px] text-[#6B7280]">Python FastAPI & Node SDK</div>
                  <div className="text-[10px] text-[#9CA3AF] mt-1">RAG Pipeline, Vector Search</div>
                </div>

                {/* Notification Service */}
                <div
                  onClick={() => setSelectedComponentId('notification_svc')}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    selectedComponentId === 'notification_svc'
                      ? 'bg-red-50/60 border-[#DC2626] shadow-xs scale-[1.01]'
                      : 'bg-[#F9FAFB] border-[#E5E7EB] hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span>🔔</span>
                    <span className="text-xs font-bold text-[#1F2937]">Notification Service</span>
                  </div>
                  <div className="text-[11px] text-[#6B7280]">BullMQ / Redis Worker</div>
                  <div className="text-[10px] text-[#9CA3AF] mt-1">Emails, Push, Streaks, Alerts</div>
                </div>
              </div>

              {/* TIER 4: DATA STORES & ASYNC BROKERS */}
              <div className="pt-2 border-t border-[#E5E7EB]">
                <div className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-3">
                  Persistence, Embeddings & Queue Tier
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* PostgreSQL Primary */}
                  <div
                    onClick={() => setSelectedComponentId('postgres_primary')}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                      selectedComponentId === 'postgres_primary'
                        ? 'bg-red-50/60 border-[#DC2626] shadow-xs'
                        : 'bg-[#F9FAFB] border-[#E5E7EB] hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>🗄️</span>
                      <div className="text-xs font-bold text-[#1F2937]">PostgreSQL (Primary)</div>
                    </div>
                    <div className="text-[10px] text-[#6B7280] mt-1">32 Entities • Relational ACID</div>
                  </div>

                  {/* pgvector Store */}
                  <div
                    onClick={() => setSelectedComponentId('pgvector_store')}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                      selectedComponentId === 'pgvector_store'
                        ? 'bg-red-50/60 border-[#DC2626] shadow-xs'
                        : 'bg-[#F9FAFB] border-[#E5E7EB] hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>⚡</span>
                      <div className="text-xs font-bold text-[#1F2937]">Vector Store (pgvector)</div>
                    </div>
                    <div className="text-[10px] text-[#6B7280] mt-1">1536-dim Chunks • Cosine Distance</div>
                  </div>

                  {/* Redis Cache & Queue */}
                  <div
                    onClick={() => setSelectedComponentId('redis_cache')}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                      selectedComponentId === 'redis_cache'
                        ? 'bg-red-50/60 border-[#DC2626] shadow-xs'
                        : 'bg-[#F9FAFB] border-[#E5E7EB] hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>🔄</span>
                      <div className="text-xs font-bold text-[#1F2937]">Redis (Cache + Queue)</div>
                    </div>
                    <div className="text-[10px] text-[#6B7280] mt-1">BullMQ/Celery Jobs • Session TTL</div>
                  </div>
                </div>
              </div>

              {/* TIER 5: EXTERNAL PROVIDERS */}
              <div className="pt-2 border-t border-[#E5E7EB]">
                <div className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-3">
                  External Infrastructure & Object Storage
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* S3 Storage */}
                  <div
                    onClick={() => setSelectedComponentId('s3_storage')}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                      selectedComponentId === 's3_storage'
                        ? 'bg-red-50/60 border-[#DC2626] shadow-xs'
                        : 'bg-[#F9FAFB] border-[#E5E7EB] hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>💾</span>
                      <div className="text-xs font-bold text-[#1F2937]">Object Storage (S3 / GCS)</div>
                    </div>
                    <div className="text-[10px] text-[#6B7280] mt-1">HLS Video, Assignment PDFs, Certs</div>
                  </div>

                  {/* External LLM */}
                  <div
                    onClick={() => setSelectedComponentId('external_llm')}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                      selectedComponentId === 'external_llm'
                        ? 'bg-red-50/60 border-[#DC2626] shadow-xs'
                        : 'bg-[#F9FAFB] border-[#E5E7EB] hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>🤖</span>
                      <div className="text-xs font-bold text-[#1F2937]">External LLM Provider</div>
                    </div>
                    <div className="text-[10px] text-[#6B7280] mt-1">Google Gemini 3.8 / Anthropic Claude</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Component Detail Drawer (4 Columns) */}
            <div className="lg:col-span-4 bg-white border border-[#E5E7EB] rounded-3xl p-6 space-y-5 shadow-xs flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
                  <div>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-red-50 text-[#DC2626] border border-red-200">
                      {selectedComponent.type.toUpperCase()}
                    </span>
                    <h3 className="text-lg font-bold text-[#1F2937] mt-1">{selectedComponent.name}</h3>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] text-xl">
                    ⚙️
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Tech Stack</div>
                  <div className="text-xs font-mono text-[#1F2937] bg-[#F9FAFB] p-2.5 rounded-xl border border-[#E5E7EB]">
                    {selectedComponent.tech}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Description</div>
                  <p className="text-xs text-[#4B5563] leading-relaxed bg-[#F9FAFB] p-3 rounded-xl border border-[#E5E7EB]">
                    {selectedComponent.description}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">
                    Core Architectural Responsibilities
                  </div>
                  <ul className="space-y-1.5">
                    {selectedComponent.responsibilities.map((resp, i) => (
                      <li key={i} className="text-xs text-[#4B5563] flex items-start gap-2 bg-[#F9FAFB] p-2 rounded-lg border border-[#E5E7EB]">
                        <span className="text-[#DC2626] mt-0.5 shrink-0">✓</span>
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {selectedComponent.connections.length > 0 && (
                <div className="pt-3 border-t border-[#E5E7EB]">
                  <div className="text-[10px] font-mono text-[#6B7280] mb-1.5">Downstream Dispatches:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedComponent.connections.map((cId) => (
                      <button
                        key={cId}
                        onClick={() => setSelectedComponentId(cId)}
                        className="text-[10px] font-mono px-2 py-1 rounded bg-[#F9FAFB] hover:bg-gray-100 text-[#DC2626] border border-[#E5E7EB] flex items-center gap-1 transition-colors"
                      >
                        {cId} <span>→</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: AI TUTOR REQUEST FLOW (RAG SIMULATOR) */}
      {activeTab === 'flow' && (
        <div className="space-y-6">
          {/* Flow Controls */}
          <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 space-y-4 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
                  <span>⚡</span> Section 9.2 Request Flow Walkthrough
                </div>
                <h2 className="text-xl font-bold text-[#1F2937] mt-1">End-to-End RAG Ingestion & Inference Lifecycle</h2>
                <p className="text-xs text-[#6B7280] mt-1 max-w-2xl">
                  Simulate the exact packet path from the student asking a lecture question to embedding generation, pgvector cosine search, LLM context synthesis, and asynchronous topic mastery updates.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={runSimulation}
                  disabled={isSimulating}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    isSimulating
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs'
                  }`}
                >
                  {isSimulating ? (
                    <>
                      <span className="animate-spin">🔄</span> Simulating Flow...
                    </>
                  ) : (
                    <>
                      <span>▶️</span> Run End-to-End Simulation
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Test Input */}
            <div className="bg-[#F9FAFB] p-4 rounded-2xl border border-[#E5E7EB] flex flex-col sm:flex-row items-center gap-3">
              <span className="text-xs font-bold text-[#6B7280] shrink-0">Sample Question:</span>
              <input
                type="text"
                value={simulatedPrompt}
                onChange={(e) => setSimulatedPrompt(e.target.value)}
                className="w-full bg-white border border-[#E5E7EB] rounded-xl px-3 py-1.5 text-xs text-[#1F2937] focus:outline-none focus:border-[#DC2626]"
                placeholder="Ask a question..."
              />
              <span className="text-[11px] font-mono text-[#DC2626] shrink-0 px-2.5 py-1 bg-red-50 rounded-lg border border-red-200">
                Course: DSA Masterclass (c_dsa_dev)
              </span>
            </div>
          </div>

          {/* Step-by-Step Interactive Pipeline Cards */}
          <div className="space-y-3">
            {AI_TUTOR_REQUEST_FLOW.map((step) => {
              const isActive = currentFlowStep === step.step;
              const isPast = currentFlowStep > step.step;

              return (
                <div
                  key={step.step}
                  onClick={() => setCurrentFlowStep(step.step)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-50/50 border-emerald-500 shadow-xs scale-[1.01]'
                      : isPast
                      ? 'bg-white border-emerald-200 text-[#1F2937]'
                      : 'bg-[#F9FAFB] border-[#E5E7EB] opacity-70'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div
                        className={`w-8 h-8 rounded-xl font-bold flex items-center justify-center shrink-0 text-xs border ${
                          isActive
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : isPast
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : 'bg-white text-gray-500 border-gray-200'
                        }`}
                      >
                        {isPast ? '✓' : step.step}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#1F2937]">{step.action}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-[#6B7280] border border-[#E5E7EB]">
                            {step.actor}
                          </span>
                        </div>
                        <p className="text-xs text-[#4B5563] leading-relaxed">{step.detail}</p>
                      </div>
                    </div>

                    <div className="w-full md:w-auto md:max-w-md bg-[#F9FAFB] p-2.5 rounded-xl border border-[#E5E7EB] text-[11px] font-mono text-[#1F2937] overflow-x-auto">
                      <code>{step.data}</code>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Simulation Output Log Console */}
          <div className="bg-white border border-[#E5E7EB] rounded-3xl p-5 space-y-2 shadow-xs">
            <div className="flex items-center justify-between text-xs font-bold text-[#6B7280] border-b border-[#E5E7EB] pb-2">
              <span className="flex items-center gap-1.5">
                <span>💻</span> Live Execution Trace Log
              </span>
              <span className="text-[11px] text-[#9CA3AF] font-mono">Status: {isSimulating ? 'TRANSMITTING' : 'IDLE'}</span>
            </div>
            <div className="font-mono text-xs space-y-1 text-[#4B5563] max-h-48 overflow-y-auto pt-2 bg-[#F9FAFB] p-3 rounded-xl border border-[#E5E7EB]">
              {flowLog.map((log, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-emerald-600">›</span>
                  <span className={log.includes('Complete') ? 'text-emerald-700 font-bold' : ''}>{log}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ASYNCHRONOUS BACKGROUND JOBS */}
      {activeTab === 'jobs' && (
        <div className="space-y-6">
          <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 space-y-4 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="text-xs font-bold text-amber-700 uppercase tracking-wider flex items-center gap-1.5">
                  <span>⏱️</span> Section 9.3 Background Job Queues
                </div>
                <h2 className="text-xl font-bold text-[#1F2937] mt-1">Celery & BullMQ Distributed Task Workers</h2>
                <p className="text-xs text-[#6B7280] mt-1 max-w-2xl">
                  Heavy computation, speech-to-text transcription, vector chunking, cron retention streaks, and high-resolution certificate generation run asynchronously outside the synchronous HTTP request-response cycle.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-[#F9FAFB] border border-[#E5E7EB] text-right">
                <div className="text-xs font-bold text-[#1F2937]">Redis Broker</div>
                <div className="text-[11px] font-mono text-amber-700">redis://lms-cluster:6379/1</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {BACKGROUND_JOBS.map((job) => {
              const state = jobStates[job.id] || { status: 'idle' };

              return (
                <div
                  key={job.id}
                  className="bg-white border border-[#E5E7EB] rounded-2xl p-5 space-y-4 flex flex-col justify-between hover:border-gray-300 transition-all shadow-xs"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-bold text-[#1F2937]">{job.name}</span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                          job.queue === 'Celery'
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {job.queue}
                      </span>
                    </div>

                    <p className="text-xs text-[#4B5563] leading-relaxed min-h-[48px]">{job.description}</p>

                    <div className="space-y-1.5 pt-2 border-t border-[#E5E7EB] text-[11px]">
                      <div className="flex justify-between text-[#6B7280]">
                        <span>Trigger:</span>
                        <span className="text-[#1F2937] font-medium">{job.frequency}</span>
                      </div>
                      <div className="flex justify-between text-[#6B7280]">
                        <span>Estimated Duration:</span>
                        <span className="text-[#DC2626] font-mono font-bold">{job.durationEstimate}</span>
                      </div>
                    </div>

                    {/* Payload Preview */}
                    <div className="bg-[#F9FAFB] p-2.5 rounded-xl border border-[#E5E7EB] text-[10px] font-mono text-[#4B5563] overflow-x-auto">
                      <div className="text-[9px] text-[#9CA3AF] mb-1">Queue Payload Schema:</div>
                      <code>{JSON.stringify(job.payload, null, 1)}</code>
                    </div>
                  </div>

                  {/* Worker Action Button */}
                  <div className="pt-3 border-t border-[#E5E7EB] flex items-center justify-between">
                    <div className="text-[10px] text-[#6B7280]">
                      {state.status === 'completed' && (
                        <span className="text-emerald-600 flex items-center gap-1 font-semibold">
                          <span>✓</span> Ran in {state.duration}
                        </span>
                      )}
                      {state.status === 'running' && (
                        <span className="text-amber-600 flex items-center gap-1 animate-pulse font-semibold">
                          <span className="animate-spin">🔄</span> Worker active...
                        </span>
                      )}
                      {state.status === 'idle' && <span>Worker idle</span>}
                    </div>

                    <button
                      onClick={() => triggerJob(job.id, job.durationEstimate)}
                      disabled={state.status === 'running'}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                        state.status === 'running'
                          ? 'bg-gray-100 text-gray-400'
                          : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
                      }`}
                    >
                      <span>▶️</span> Dispatch Task
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: MULTI-LAYER CACHING STRATEGY */}
      {activeTab === 'caching' && (
        <div className="space-y-6">
          <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 space-y-4 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="text-xs font-bold text-sky-700 uppercase tracking-wider flex items-center gap-1.5">
                  <span>🚀</span> Section 9.4 Caching Architecture
                </div>
                <h2 className="text-xl font-bold text-[#1F2937] mt-1">Multi-Layer Cache & Invalidation Policies</h2>
                <p className="text-xs text-[#6B7280] mt-1 max-w-2xl">
                  High-throughput low-latency caching tiers combining in-memory Redis clusters for transactional data and AWS CloudFront edge points of presence for video streams and syllabi.
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => testCacheLookup('READ')}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#DC2626] text-white hover:bg-red-700 transition-all flex items-center gap-1.5 shadow-xs"
                >
                  <span>🔍</span> Simulate Read
                </button>
                <button
                  onClick={() => testCacheLookup('EVICT')}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-red-50 text-[#DC2626] hover:bg-red-100 border border-red-200 transition-all flex items-center gap-1.5"
                >
                  <span>🗑️</span> Purge Cache
                </button>
              </div>
            </div>

            {/* Cache Simulation Result Banner */}
            {cacheSimResult && (
              <div className="bg-[#F9FAFB] p-4 rounded-2xl border border-[#E5E7EB] space-y-1.5 animate-in fade-in duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                        cacheSimResult.status === 'HIT'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : cacheSimResult.status === 'MISS'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}
                    >
                      {cacheSimResult.status}
                    </span>
                    <span className="text-xs text-[#1F2937] font-semibold">{cacheSimResult.layer}</span>
                  </div>
                  <span className="text-xs font-mono text-[#DC2626] font-bold">{cacheSimResult.latencyMs} ms latency</span>
                </div>
                <p className="text-xs text-[#4B5563] leading-relaxed">{cacheSimResult.details}</p>
              </div>
            )}
          </div>

          {/* Caching Rules Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {CACHING_STRATEGY_RULES.map((rule, idx) => (
              <div
                key={idx}
                className="bg-white border border-[#E5E7EB] rounded-2xl p-5 space-y-3.5 flex flex-col justify-between shadow-xs hover:border-gray-300 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-sm font-bold text-[#1F2937]">{rule.target}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200">
                      {rule.layer}
                    </span>
                  </div>

                  <p className="text-xs text-[#4B5563] leading-relaxed">{rule.purpose}</p>

                  <div className="space-y-1.5 pt-2 border-t border-[#E5E7EB] text-xs">
                    <div className="flex justify-between text-[#6B7280]">
                      <span>Time-To-Live (TTL):</span>
                      <span className="text-[#DC2626] font-mono font-bold">{rule.ttl}</span>
                    </div>
                  </div>

                  <div className="bg-[#F9FAFB] p-2.5 rounded-xl border border-[#E5E7EB] text-[11px] text-[#4B5563] space-y-1">
                    <div className="text-[10px] uppercase font-bold text-[#6B7280]">Invalidation Trigger:</div>
                    <p className="leading-snug">{rule.invalidation}</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setCacheSimKey(rule.target);
                    testCacheLookup(rule.layer.includes('CDN') ? 'CDN_HIT' : 'READ');
                  }}
                  className="w-full py-2 rounded-xl text-xs font-bold bg-[#F9FAFB] hover:bg-gray-100 text-[#DC2626] border border-[#E5E7EB] transition-all text-center"
                >
                  Test Cache Probe
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: RAW ASCII BLUEPRINT */}
      {activeTab === 'ascii' && (
        <div className="space-y-4">
          <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#1F2937]">Full ASCII Architectural Component Topology</h3>
                <p className="text-xs text-[#6B7280]">Verbatim system specification diagram for engineering audits.</p>
              </div>
              <button
                onClick={() => {
                  const asciiText = `
                         +---------------------------+
                         |        Client Apps         |
                         |  React SPA (Student /      |
                         |  Instructor / Admin views)  |
                         +--------------+--------------+
                                        | HTTPS (REST/JSON)
                                        v
                         +---------------------------+
                         |        API Gateway         |
                         |  (NGINX / reverse proxy)   |
                         |  SSL termination, rate limit|
                         +--------------+--------------+
                                        |
          +-----------------------------+-----------------------------+
          v                             v                             v
+----------------------+   +---------------------------+   +----------------------+
|  Core LMS Service      |   |   AI Tutor Service          |   |  Notification Service |
|  (Node.js / Express)   |   |  (Python / FastAPI)         |   |  (Node.js worker)     |
|  Auth, Courses,        |   |  RAG pipeline, LLM calls,   |   |  Email + in-app push, |
|  Enrollment, Quizzes,  |   |  embeddings, quiz-gen,      |   |  reminders, streaks   |
|  Assignments, Admin    |   |  recommendation logic       |   |                       |
+-----------+------------+   +--------------+---------------+   +-----------+-----------+
            |                              |                                |
            v                              v                                v
+----------------------+   +---------------------------+   +----------------------+
|  PostgreSQL (primary)  |   |  Vector Store (pgvector)    |   |  Redis (cache+queue)  |
|  users, courses,       |   |  document_chunks with       |   |  BullMQ/Celery jobs,  |
|  quizzes, submissions  |   |  embeddings for RAG         |   |  session cache, limits |
+----------------------+   +---------------------------+   +----------------------+
 
          +----------------------------+          +----------------------------+
          |   Object Storage (S3)       |          |   External LLM Provider     |
          |  video, PDFs, certs,        |          |  (Anthropic / Gemini API)   |
          |  flashcard exports          |          |  Chat + summarization       |
          +----------------------------+          +----------------------------+
                  `;
                  navigator.clipboard.writeText(asciiText);
                }}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#F9FAFB] text-[#DC2626] hover:bg-red-50 border border-[#E5E7EB] transition-colors"
              >
                Copy ASCII Diagram
              </button>
            </div>

            <pre className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl p-6 text-xs text-[#1F2937] font-mono overflow-x-auto leading-relaxed shadow-inner">
{`                         +---------------------------+
                         |        Client Apps         |
                         |  React SPA (Student /      |
                         |  Instructor / Admin views)  |
                         +--------------+--------------+
                                        | HTTPS (REST/JSON)
                                        v
                         +---------------------------+
                         |        API Gateway         |
                         |  (NGINX / reverse proxy)   |
                         |  SSL termination, rate limit|
                         +--------------+--------------+
                                        |
          +-----------------------------+-----------------------------+
          v                             v                             v
+----------------------+   +---------------------------+   +----------------------+
|  Core LMS Service      |   |   AI Tutor Service          |   |  Notification Service |
|  (Node.js / Express)   |   |  (Python / FastAPI)         |   |  (Node.js worker)     |
|  Auth, Courses,        |   |  RAG pipeline, LLM calls,   |   |  Email + in-app push, |
|  Enrollment, Quizzes,  |   |  embeddings, quiz-gen,      |   |  reminders, streaks   |
|  Assignments, Admin    |   |  recommendation logic       |   |                       |
+-----------+------------+   +--------------+---------------+   +-----------+-----------+
            |                              |                                |
            v                              v                                v
+----------------------+   +---------------------------+   +----------------------+
|  PostgreSQL (primary)  |   |  Vector Store (pgvector)    |   |  Redis (cache+queue)  |
|  users, courses,       |   |  document_chunks with       |   |  BullMQ/Celery jobs,  |
|  quizzes, submissions  |   |  embeddings for RAG         |   |  session cache, limits |
+----------------------+   +---------------------------+   +----------------------+
 
          +----------------------------+          +----------------------------+
          |   Object Storage (S3)       |          |   External LLM Provider     |
          |  video, PDFs, certs,        |          |  (Anthropic / Gemini API)   |
          |  flashcard exports          |          |  Chat + summarization       |
          +----------------------------+          +----------------------------+`}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

