import React from 'react';
import { 
  Sparkles, 
  Video, 
  ShieldAlert, 
  Smartphone, 
  CreditCard, 
  Mic, 
  TrendingDown, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  Cpu, 
  Globe, 
  Zap, 
  Radio, 
  Activity, 
  Users, 
  HardDrive
} from 'lucide-react';
import { useLMS, LMSView } from '../../context/LMSContext';

export const ExpansionHub: React.FC = () => {
  const { setCurrentView, user } = useLMS();

  const nextGenFeatures: Array<{
    id: LMSView;
    title: string;
    category: string;
    badge: string;
    badgeColor: string;
    icon: React.ReactNode;
    description: string;
    highlights: string[];
    roleTarget: string;
  }> = [
    {
      id: 'study_rooms',
      title: 'Real-Time Collaborative Study Rooms & WebRTC',
      category: 'Virtual Classrooms & SFU Streaming',
      badge: 'Live Mesh SFU',
      badgeColor: 'bg-red-50 text-[#DC2626] border border-red-200',
      icon: <Video className="w-6 h-6 text-[#DC2626]" />,
      description: 'Peer-to-peer virtual classrooms with synchronized HTML5 collaborative whiteboard, breakout pods for algorithm pairing, and live hand-raising queue.',
      highlights: [
        'WebRTC SFU audio/video mesh with active speaker glow',
        'Synchronized whiteboard canvas with shape tools and PNG export',
        'Automated breakout pods for cohort coding exercises'
      ],
      roleTarget: 'Students & Faculty'
    },
    {
      id: 'plagiarism_detector',
      title: 'AI Plagiarism & Code Similarity Detection Engine',
      category: 'Academic Integrity & AST Analysis',
      badge: 'AST Engine',
      badgeColor: 'bg-red-50 text-[#DC2626] border border-red-200',
      icon: <ShieldAlert className="w-6 h-6 text-[#DC2626]" />,
      description: 'Automated integrity checking using Abstract Syntax Tree (AST) isomorphism and semantic embeddings to flag obfuscated variable renaming and copied logic.',
      highlights: [
        'Babel / Python AST structural tree comparison',
        'Side-by-side synchronized diff viewer with token match ranges',
        'Interactive live code similarity scanning sandbox'
      ],
      roleTarget: 'Instructors & Admins'
    },
    {
      id: 'mobile_pwa',
      title: 'Native Mobile Application & PWA Offline Sync',
      category: 'Mobile & Offline-First',
      badge: 'IndexedDB Vault',
      badgeColor: 'bg-red-50 text-[#DC2626] border border-red-200',
      icon: <Smartphone className="w-6 h-6 text-[#DC2626]" />,
      description: 'Cross-platform mobile experience with offline-first synchronization. Download lecture videos and flashcards, take quizzes offline, and auto-sync on reconnect.',
      highlights: [
        'Interactive iPhone 15 Pro & Google Pixel 8 device simulator',
        'CacheStorage & IndexedDB offline content manager',
        'ServiceWorker background sync queue with auto-reconciliation'
      ],
      roleTarget: 'All Platform Users'
    },
    {
      id: 'monetization',
      title: 'Advanced Payment Gateway & Subscriptions',
      category: 'Commercial Monetization',
      badge: 'Stripe & Razorpay',
      badgeColor: 'bg-red-50 text-[#DC2626] border border-red-200',
      icon: <CreditCard className="w-6 h-6 text-[#DC2626]" />,
      description: 'Monetization architecture for tiered student subscriptions, coupon validation engine, multi-currency conversion, and 70/30 instructor revenue payouts.',
      highlights: [
        'Multi-currency pricing in USD, EUR, GBP, and INR',
        'Live checkout simulator with test cards and UPI VPA',
        'Automated 70/30 instructor revenue share disbursement dashboard'
      ],
      roleTarget: 'Instructors & Students'
    },
    {
      id: 'voice_tutor',
      title: 'Voice-Based AI Technical Tutor (Speech-In/Out)',
      category: 'Hands-Free Accessibility',
      badge: 'Neural Speech API',
      badgeColor: 'bg-red-50 text-[#DC2626] border border-red-200',
      icon: <Mic className="w-6 h-6 text-[#DC2626]" />,
      description: 'Conversational technical tutoring using Speech-to-Text and SpeechSynthesis TTS with animated audio frequency spectrum visualizer and multilingual accents.',
      highlights: [
        'Real-time HTML5 canvas audio frequency spectrum visualizer',
        'Speech-to-Text with accent support (US, UK, Indian, Spanish, French)',
        'Synthesized audio explanations with live generated code snippets'
      ],
      roleTarget: 'Students & Faculty'
    },
    {
      id: 'predictive_analytics',
      title: 'Predictive At-Risk Student Analytics & Telemetry',
      category: 'Machine Learning Retention',
      badge: 'ML Retention Model',
      badgeColor: 'bg-red-50 text-[#DC2626] border border-red-200',
      icon: <TrendingDown className="w-6 h-6 text-[#DC2626]" />,
      description: 'Behavioral telemetry engine tracking login cadence, video drop-off rates, and quiz scores to predict at-risk students and dispatch automated AI remediation.',
      highlights: [
        'Behavioral telemetry risk scoring model (0-100%)',
        'Instructor intervention dashboard with root-cause diagnostics',
        '1-Click automated AI remediation pathway generator'
      ],
      roleTarget: 'Faculty & Academic Advisors'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Hero Showcase Banner */}
      <div className="bg-white rounded-3xl p-8 border border-[#E5E7EB] shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider bg-red-50 text-[#DC2626] border border-red-200 mb-4">
            <Sparkles className="w-4 h-4 text-[#DC2626]" />
            VertexLearn AI • Next-Gen Expansion Suite
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1F2937] tracking-tight leading-tight">
            Next-Generation Architecture & Expansion Capabilities
          </h1>

          <p className="text-sm sm:text-base text-[#4B5563] mt-3 leading-relaxed">
            Expanding VertexLearn beyond standard LMS boundaries with 6 production-grade modules: real-time collaborative WebRTC study rooms, compiler-level AST code plagiarism detection, offline-first PWA caching, multi-gateway monetization with instructor revenue sharing, conversational voice tutoring, and predictive ML dropout prevention.
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-6 pt-6 border-t border-[#E5E7EB]">
            <div className="flex items-center gap-2 text-xs text-[#4B5563]">
              <CheckCircle2 className="w-4 h-4 text-[#DC2626]" />
              <span>32-Table Relational Schema Ready</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#4B5563]">
              <CheckCircle2 className="w-4 h-4 text-[#DC2626]" />
              <span>Judge0 Sandbox Integrated</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#4B5563]">
              <CheckCircle2 className="w-4 h-4 text-[#DC2626]" />
              <span>Python FastAPI RAG Connected</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#4B5563]">
              <CheckCircle2 className="w-4 h-4 text-[#DC2626]" />
              <span>Bcrypt Password Encryption Enforced</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of the 6 Next-Gen Capabilities */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {nextGenFeatures.map((feat) => (
          <div
            key={feat.id}
            className="group relative rounded-3xl p-6 bg-white border border-[#E5E7EB] hover:border-[#DC2626]/50 hover:shadow-md transition-all duration-300 flex flex-col justify-between shadow-xs"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-2xl bg-[#F9FAFB] border border-[#E5E7EB] group-hover:scale-105 transition-transform">
                  {feat.icon}
                </div>
                <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full border ${feat.badgeColor}`}>
                  {feat.badge}
                </span>
              </div>

              <div className="text-[11px] font-bold text-[#DC2626] uppercase tracking-wider">
                {feat.category}
              </div>

              <h3 className="text-base font-bold text-[#1F2937] mt-1 group-hover:text-[#DC2626] transition-colors">
                {feat.title}
              </h3>

              <p className="text-xs text-[#4B5563] mt-2 leading-relaxed">
                {feat.description}
              </p>

              {/* Highlights */}
              <div className="mt-4 pt-4 border-t border-[#E5E7EB] space-y-2">
                {feat.highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-[#4B5563]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#DC2626] shrink-0 mt-0.5" />
                    <span className="leading-tight">{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Launch Action */}
            <div className="mt-6 pt-4 border-t border-[#E5E7EB] flex items-center justify-between">
              <span className="text-[10px] text-[#4B5563] font-mono">
                {feat.roleTarget}
              </span>

              <button
                onClick={() => setCurrentView(feat.id)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#DC2626] hover:bg-[#B91C1C] text-white transition-all shadow-xs group-hover:gap-2 cursor-pointer"
              >
                <span>Launch Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
