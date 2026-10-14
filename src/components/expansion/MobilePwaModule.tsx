import React, { useState } from 'react';
import { 
  Smartphone, 
  Wifi, 
  WifiOff, 
  Download, 
  CheckCircle2, 
  Bell, 
  RotateCw, 
  HardDrive, 
  Database, 
  CloudOff, 
  Layers, 
  Sparkles, 
  Check, 
  BookOpen, 
  Play, 
  Zap,
  ArrowRight,
  ShieldCheck,
  Tablet,
  Activity,
  Send
} from 'lucide-react';
import { useLMS } from '../../context/LMSContext';
import { OfflineCachedItem, PendingSyncItem } from '../../types/lms';

export const MobilePwaModule: React.FC = () => {
  const { user } = useLMS();

  // Simulated Device Mode
  const [deviceModel, setDeviceModel] = useState<'iphone' | 'pixel' | 'tablet'>('iphone');
  const [isSimulatedOnline, setIsSimulatedOnline] = useState<boolean>(true);
  const [activeMobileTab, setActiveMobileTab] = useState<'home' | 'courses' | 'tutor' | 'offline'>('home');
  const [offlineToast, setOfflineToast] = useState<string | null>(null);

  // Cached Offline Content List
  const [cachedItems, setCachedItems] = useState<OfflineCachedItem[]>([
    {
      id: 'cache-1',
      title: 'Module 1: Distributed Raft Consensus Lecture Video',
      courseTitle: 'Advanced Distributed Systems',
      type: 'video_lecture',
      sizeBytes: 184000000, // 184 MB
      cachedAt: '2026-10-09 14:20',
      isAvailableOffline: true,
      offlineProgressPercent: 100
    },
    {
      id: 'cache-2',
      title: 'Module 2: Vector Search & pgvector HNSW Indexing PDF',
      courseTitle: 'Neural Information Retrieval',
      type: 'pdf_slides',
      sizeBytes: 24500000, // 24.5 MB
      cachedAt: '2026-10-10 08:15',
      isAvailableOffline: true,
      offlineProgressPercent: 100
    },
    {
      id: 'cache-3',
      title: 'Coding Lab 4: Judge0 Python Sandbox Challenge Offline Shell',
      courseTitle: 'Compiler Engineering',
      type: 'coding_lab',
      sizeBytes: 12800000, // 12.8 MB
      cachedAt: '2026-10-10 09:30',
      isAvailableOffline: true,
      offlineProgressPercent: 100
    },
    {
      id: 'cache-4',
      title: 'System Design Flashcards: 250 Interview Patterns',
      courseTitle: 'Enterprise Architect Track',
      type: 'flashcards',
      sizeBytes: 4200000, // 4.2 MB
      cachedAt: '2026-10-08 11:00',
      isAvailableOffline: true,
      offlineProgressPercent: 100
    }
  ]);

  // Background Sync Queue
  const [pendingQueue, setPendingQueue] = useState<PendingSyncItem[]>([
    {
      id: 'sync-1',
      type: 'QUIZ_SUBMISSION',
      payload: { quizId: 'q-101', score: 95, total: 100, completedOffline: true },
      createdOfflineAt: '10:14 AM',
      synced: false
    },
    {
      id: 'sync-2',
      type: 'STUDY_NOTE',
      payload: { note: 'Remember to verify quorum size = (N/2)+1 before election timeout' },
      createdOfflineAt: '10:18 AM',
      synced: false
    }
  ]);

  // Simulating Offline Action
  const handleTakeOfflineQuiz = () => {
    const newItem: PendingSyncItem = {
      id: `sync-${Date.now()}`,
      type: 'QUIZ_SUBMISSION',
      payload: { quizId: 'quiz-fastapi', score: 100, timestamp: Date.now() },
      createdOfflineAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      synced: false
    };

    setPendingQueue(prev => [newItem, ...prev]);
    showToast('Quiz submitted offline. Saved to IndexedDB background sync queue.');
  };

  // Sync Action when reconnected
  const handleSyncAll = () => {
    if (!isSimulatedOnline) {
      showToast('Cannot sync while offline! Please toggle network to Online.');
      return;
    }

    setPendingQueue(prev => prev.map(item => ({ ...item, synced: true })));
    showToast('Background sync complete! All offline progress pushed to PostgreSQL backend.');
  };

  const showToast = (msg: string) => {
    setOfflineToast(msg);
    setTimeout(() => setOfflineToast(null), 3500);
  };

  // Push Notification Dispatcher
  const handleSendPushNotification = (type: string) => {
    if (type === 'deadline') {
      showToast('🔔 Push Notification: "Assignment 2 is due tonight at 11:59 PM. 2 questions remaining!"');
    } else if (type === 'quiz') {
      showToast('🔔 Push Notification: "New Quiz Released: Distributed Consensus & Paxos Node"');
    } else {
      showToast('🔔 Push Notification: "AI Tutor has synthesized an answer to your question."');
    }
  };

  const totalCachedMB = Math.round(
    cachedItems.reduce((acc, curr) => acc + curr.sizeBytes, 0) / (1024 * 1024)
  );

  return (
    <div className="space-y-6 text-[#1F2937]">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-[#DC2626] border border-red-200">
                <Smartphone className="w-3.5 h-3.5 text-[#DC2626]" />
                PWA ServiceWorker & Native Mobile Engine
              </span>
              <span className="text-xs text-[#4B5563] font-mono">
                IndexedDB Persistent Storage • Cache-First Sync Worker
              </span>
            </div>
            <h1 className="text-2xl font-bold text-[#1F2937] flex items-center gap-2.5">
              <span>Native Mobile Application & PWA Offline Sync Architecture</span>
            </h1>
            <p className="text-sm text-[#4B5563] mt-1 max-w-3xl">
              Cross-platform mobile experience with offline-first synchronization. Students download lecture videos and flashcards, take quizzes without internet connectivity, and auto-sync progress upon reconnection.
            </p>
          </div>

          {/* Network State Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                const next = !isSimulatedOnline;
                setIsSimulatedOnline(next);
                showToast(next ? 'Reconnected to internet! Ready to sync.' : 'Disconnected from internet. Operating in Offline-First mode.');
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs ${
                isSimulatedOnline
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-amber-600 text-white hover:bg-amber-700'
              }`}
            >
              {isSimulatedOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
              <span>{isSimulatedOnline ? 'Simulated: ONLINE' : 'Simulated: OFFLINE'}</span>
            </button>
          </div>
        </div>

        {/* Device Picker */}
        <div className="flex items-center gap-2 mt-6 border-t border-[#E5E7EB] pt-4 overflow-x-auto">
          <button
            onClick={() => setDeviceModel('iphone')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              deviceModel === 'iphone'
                ? 'bg-[#DC2626] text-white shadow-xs'
                : 'bg-[#F9FAFB] text-[#4B5563] border border-[#E5E7EB] hover:text-[#1F2937] hover:bg-white'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>iPhone 15 Pro Max Viewport</span>
          </button>

          <button
            onClick={() => setDeviceModel('pixel')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              deviceModel === 'pixel'
                ? 'bg-[#DC2626] text-white shadow-xs'
                : 'bg-[#F9FAFB] text-[#4B5563] border border-[#E5E7EB] hover:text-[#1F2937] hover:bg-white'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Google Pixel 8 Viewport</span>
          </button>

          <button
            onClick={() => setDeviceModel('tablet')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              deviceModel === 'tablet'
                ? 'bg-[#DC2626] text-white shadow-xs'
                : 'bg-[#F9FAFB] text-[#4B5563] border border-[#E5E7EB] hover:text-[#1F2937] hover:bg-white'
            }`}
          >
            <Tablet className="w-4 h-4" />
            <span>iPad / Android Tablet Viewport</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Simulated Device (1-2 cols), Right Offline Cache & Sync Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Simulated Mobile Frame */}
        <div className="lg:col-span-5 flex justify-center">
          <div className={`relative bg-gray-200 rounded-[44px] p-3 border-4 shadow-xl transition-all ${
            deviceModel === 'iphone'
              ? 'border-gray-300 w-[360px] h-[680px]'
              : deviceModel === 'pixel'
              ? 'border-gray-300 w-[360px] h-[680px]'
              : 'border-gray-300 w-[480px] h-[640px]'
          }`}>
            {/* Dynamic Island / Camera Notch */}
            <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-5 bg-gray-300 rounded-full z-30 flex items-center justify-center">
              <span className="w-2.5 h-2.5 rounded-full bg-gray-400 border border-gray-300 mr-2"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>

            {/* Mobile Screen Interior */}
            <div className="w-full h-full bg-[#F9FAFB] rounded-[36px] overflow-hidden flex flex-col text-[#1F2937] pt-8 relative border border-[#E5E7EB]">
              
              {/* Mobile Top Status Bar */}
              <div className="px-5 py-2 flex items-center justify-between text-[11px] text-[#4B5563] font-mono bg-white border-b border-[#E5E7EB]">
                <span>09:41</span>
                <div className="flex items-center gap-1.5">
                  {isSimulatedOnline ? (
                    <span className="text-emerald-700 flex items-center gap-1 text-[10px] font-medium">
                      <Wifi className="w-3 h-3" /> 5G
                    </span>
                  ) : (
                    <span className="text-amber-700 flex items-center gap-1 text-[10px] font-bold">
                      <WifiOff className="w-3 h-3" /> Offline
                    </span>
                  )}
                  <span>100%</span>
                </div>
              </div>

              {/* Mobile App Header */}
              <div className="px-4 py-2 bg-white border-b border-[#E5E7EB] flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-[#DC2626] font-bold uppercase tracking-wider">VertexLearn Mobile</div>
                  <div className="text-xs font-bold truncate">Hello, {user?.name?.split(' ')[0] || 'Student'} 👋</div>
                </div>

                <div className="flex items-center gap-2">
                  <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    isSimulatedOnline ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {isSimulatedOnline ? 'Online' : 'Offline Vault'}
                  </div>
                </div>
              </div>

              {/* Mobile Viewport Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
                
                {/* Offline Warning Banner if disconnected */}
                {!isSimulatedOnline && (
                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-800 flex items-center gap-2">
                    <CloudOff className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Using cached lessons. Changes will auto-sync when online.</span>
                  </div>
                )}

                {/* Daily Streak & Progress Card */}
                <div className="p-3.5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#4B5563] uppercase">Learning Streak</span>
                    <span className="text-[10px] text-amber-600 font-bold">🔥 14 Days</span>
                  </div>
                  <div className="text-sm font-bold mt-1 text-[#1F2937]">CS-401: Distributed Systems</div>
                  <div className="w-full bg-gray-100 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-[#DC2626] h-full w-[72%]" />
                  </div>
                </div>

                {/* Quick Action Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleTakeOfflineQuiz}
                    className="p-3 rounded-xl bg-white border border-[#E5E7EB] hover:bg-gray-50 text-left transition-colors cursor-pointer shadow-xs"
                  >
                    <Zap className="w-4 h-4 text-amber-500 mb-1" />
                    <div className="text-xs font-bold text-[#1F2937]">Take Quiz</div>
                    <div className="text-[10px] text-[#4B5563]">Works 100% Offline</div>
                  </button>

                  <button
                    onClick={() => setActiveMobileTab('offline')}
                    className="p-3 rounded-xl bg-white border border-[#E5E7EB] hover:bg-gray-50 text-left transition-colors cursor-pointer shadow-xs"
                  >
                    <HardDrive className="w-4 h-4 text-[#DC2626] mb-1" />
                    <div className="text-xs font-bold text-[#1F2937]">Offline Vault</div>
                    <div className="text-[10px] text-[#4B5563]">{cachedItems.length} Lessons Saved</div>
                  </button>
                </div>

                {/* Downloaded Modules Preview */}
                <div className="space-y-2">
                  <div className="text-[11px] font-bold text-[#4B5563] uppercase tracking-wider">
                    Downloaded For Offline
                  </div>

                  {cachedItems.slice(0, 2).map(item => (
                    <div key={item.id} className="p-2.5 rounded-xl bg-white border border-[#E5E7EB] flex items-center justify-between shadow-xs">
                      <div className="truncate pr-2">
                        <div className="text-xs font-semibold truncate text-[#1F2937]">{item.title}</div>
                        <div className="text-[10px] text-[#4B5563]">{item.courseTitle}</div>
                      </div>
                      <span className="p-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  ))}
                </div>

                {/* Queue status */}
                {pendingQueue.length > 0 && (
                  <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-[11px] text-[#DC2626] flex items-center justify-between">
                    <span>{pendingQueue.filter(p => !p.synced).length} actions pending sync</span>
                    <button
                      onClick={handleSyncAll}
                      className="text-[10px] font-bold text-[#DC2626] underline cursor-pointer hover:text-[#B91C1C]"
                    >
                      Sync Now
                    </button>
                  </div>
                )}

              </div>

              {/* Mobile Bottom Navigation Bar */}
              <div className="h-14 border-t border-[#E5E7EB] bg-white px-6 flex items-center justify-between">
                <button
                  onClick={() => setActiveMobileTab('home')}
                  className={`flex flex-col items-center gap-0.5 cursor-pointer ${activeMobileTab === 'home' ? 'text-[#DC2626]' : 'text-[#4B5563]'}`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span className="text-[9px] font-bold">Home</span>
                </button>

                <button
                  onClick={() => setActiveMobileTab('courses')}
                  className={`flex flex-col items-center gap-0.5 cursor-pointer ${activeMobileTab === 'courses' ? 'text-[#DC2626]' : 'text-[#4B5563]'}`}
                >
                  <Layers className="w-4 h-4" />
                  <span className="text-[9px] font-bold">Courses</span>
                </button>

                <button
                  onClick={() => setActiveMobileTab('tutor')}
                  className={`flex flex-col items-center gap-0.5 cursor-pointer ${activeMobileTab === 'tutor' ? 'text-[#DC2626]' : 'text-[#4B5563]'}`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span className="text-[9px] font-bold">AI Tutor</span>
                </button>

                <button
                  onClick={() => setActiveMobileTab('offline')}
                  className={`flex flex-col items-center gap-0.5 cursor-pointer ${activeMobileTab === 'offline' ? 'text-[#DC2626]' : 'text-[#4B5563]'}`}
                >
                  <HardDrive className="w-4 h-4" />
                  <span className="text-[9px] font-bold">Vault</span>
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* Right Columns: PWA Offline Storage & Sync Pipeline Inspection */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Storage & Cache Metrics */}
          <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-[#1F2937] flex items-center gap-2">
                  <Database className="w-5 h-5 text-[#DC2626]" />
                  <span>PWA CacheStorage & IndexedDB Manager</span>
                </h3>
                <p className="text-xs text-[#4B5563] mt-0.5">
                  Precached static assets, chunked MP4 video blobs, and offline state replication.
                </p>
              </div>

              <div className="text-right">
                <div className="text-xs text-[#4B5563]">Total Offline Footprint</div>
                <div className="text-xl font-extrabold text-[#DC2626]">{totalCachedMB} MB</div>
              </div>
            </div>

            {/* Cached Items Table */}
            <div className="space-y-2.5">
              {cachedItems.map((item) => (
                <div key={item.id} className="p-3.5 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="truncate">
                    <div className="text-xs font-bold text-[#1F2937] truncate">{item.title}</div>
                    <div className="text-[11px] text-[#4B5563] flex items-center gap-2 mt-0.5">
                      <span>{item.courseTitle}</span>
                      <span>•</span>
                      <span className="font-mono text-[#DC2626] font-medium">
                        {Math.round(item.sizeBytes / (1024 * 1024))} MB
                      </span>
                      <span>•</span>
                      <span>Cached: {item.cachedAt}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      100% Cached
                    </span>

                    <button
                      onClick={() => {
                        setCachedItems(prev => prev.filter(c => c.id !== item.id));
                        showToast(`Removed "${item.title}" from offline storage.`);
                      }}
                      className="text-xs text-[#4B5563] hover:text-[#DC2626] px-2 py-1 rounded bg-white border border-[#E5E7EB] hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Background Sync Queue */}
          <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#1F2937] flex items-center gap-2">
                  <RotateCw className="w-5 h-5 text-[#DC2626]" />
                  <span>ServiceWorker Background Sync Queue ({pendingQueue.length})</span>
                </h3>
                <p className="text-xs text-[#4B5563] mt-0.5">
                  Changes recorded while offline waiting for network reconciliation with the PostgreSQL backend.
                </p>
              </div>

              <button
                onClick={handleSyncAll}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#DC2626] text-white hover:bg-[#B91C1C] transition-colors cursor-pointer shadow-xs"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Replay & Sync Now</span>
              </button>
            </div>

            <div className="space-y-2">
              {pendingQueue.map((item) => (
                <div key={item.id} className="p-3 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full ${item.synced ? 'bg-emerald-500' : 'bg-amber-500 animate-ping'}`} />
                    <div>
                      <div className="font-bold text-[#1F2937]">{item.type}</div>
                      <div className="text-[10px] text-[#4B5563] font-mono">
                        Logged offline at {item.createdOfflineAt}
                      </div>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    item.synced ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {item.synced ? 'SYNCED TO POSTGRESQL' : 'PENDING IN INDEXEDDB'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Push Notification Simulator */}
          <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] space-y-3 shadow-xs">
            <h3 className="text-sm font-bold text-[#1F2937] flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-500" />
              <span>Native Push Notifications Simulator (Web Push API)</span>
            </h3>
            <p className="text-xs text-[#4B5563]">
              Test how lock screen and status bar notifications look on the student's mobile device:
            </p>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleSendPushNotification('deadline')}
                className="px-3 py-2 rounded-xl text-xs font-bold bg-[#F9FAFB] border border-[#E5E7EB] text-[#1F2937] hover:bg-gray-100 transition-colors cursor-pointer"
              >
                Trigger: Assignment Due in 2 Hours
              </button>

              <button
                onClick={() => handleSendPushNotification('quiz')}
                className="px-3 py-2 rounded-xl text-xs font-bold bg-[#F9FAFB] border border-[#E5E7EB] text-[#1F2937] hover:bg-gray-100 transition-colors cursor-pointer"
              >
                Trigger: New Quiz Window Released
              </button>

              <button
                onClick={() => handleSendPushNotification('tutor')}
                className="px-3 py-2 rounded-xl text-xs font-bold bg-[#F9FAFB] border border-[#E5E7EB] text-[#1F2937] hover:bg-gray-100 transition-colors cursor-pointer"
              >
                Trigger: AI Tutor Response Ready
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Floating Status Toast */}
      {offlineToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl bg-white border border-[#E5E7EB] text-[#1F2937] text-xs font-medium shadow-xl animate-fade-in flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#DC2626] shrink-0" />
          <span>{offlineToast}</span>
        </div>
      )}
    </div>
  );
};
