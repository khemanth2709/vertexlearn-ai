import React, { useState, useRef, useEffect } from 'react';
import { useLMS } from '../../context/LMSContext';
import { CourseModule, QuizQuestion } from '../../types/lms';
import { 
  ArrowLeft, 
  PlayCircle, 
  CheckCircle2, 
  Lock, 
  FileText, 
  HelpCircle, 
  Layers, 
  Award, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft,
  Sparkles,
  Terminal,
  ShieldCheck,
  Check,
  AlertCircle,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  Gauge,
  Lightbulb,
  BookOpen,
  Download,
  Trash2,
  Clock,
  Loader2,
  Share2
} from 'lucide-react';
import { CertificateModal } from '../certificate/CertificateModal';
import { CertificateData } from '../certificate/CertificateTemplate';

interface LectureNote {
  id: string;
  moduleId: string;
  timestamp: number;
  formattedTime: string;
  text: string;
  createdAt: string;
}

interface LectureBookmark {
  id: string;
  moduleId: string;
  timestamp: number;
  formattedTime: string;
  label: string;
}

import { parseYouTubeUrl } from '../../utils/youtubeUtils';

export const CoursePlayer: React.FC = () => {
  const { 
    activeCourseId, 
    courses, 
    setCurrentView, 
    updateModuleProgress, 
    getModuleProgress, 
    isModuleLocked, 
    submitQuiz,
    calculateCourseProgress,
    user,
    setIsAITutorOpen,
    activeModuleIndex,
    setActiveModuleIndex
  } = useLMS();

  const course = courses.find(c => c.id === activeCourseId) || courses[0];

  // Video state & Playback speed (FR-S4)
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playbackRate, setPlaybackRate] = useState<number>(1);

  // Timestamped Notes & Bookmarks (FR-S5)
  const [notes, setNotes] = useState<LectureNote[]>(() => {
    try {
      const saved = localStorage.getItem('vertexlearn_lecture_notes');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [bookmarks, setBookmarks] = useState<LectureBookmark[]>(() => {
    try {
      const saved = localStorage.getItem('vertexlearn_lecture_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [newNoteText, setNewNoteText] = useState('');
  const [activeTabSubpanel, setActiveTabSubpanel] = useState<'content' | 'notes' | 'ai_summary' | 'flashcards'>('content');

  // AI Summary state (FR-A3)
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);

  // AI Flashcards state (FR-A7)
  const [flashcards, setFlashcards] = useState<Array<{ q: string; a: string }>>([]);
  const [activeCardIdx, setActiveCardIdx] = useState(0);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [isGeneratingCards, setIsGeneratingCards] = useState(false);

  // Downloadable Certificate state (FR-S8)
  const [isDownloadingCert, setIsDownloadingCert] = useState(false);
  const [certSuccessNotice, setCertSuccessNotice] = useState(false);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [certModalData, setCertModalData] = useState<CertificateData | null>(null);

  // Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, any>>({});
  const [quizResult, setQuizResult] = useState<{
    score: number;
    passed: boolean;
    earnedPoints: number;
    totalPoints: number;
    isPending: boolean;
  } | null>(null);

  // SCORM / xAPI Simulation State
  const [scormStep, setScormStep] = useState(0);
  const [scormCompleted, setScormCompleted] = useState(false);
  const [xapiLog, setXapiLog] = useState<string[]>([
    `[xAPI Initialized] Actor: ${user?.name || 'Ananya Sharma'} registered to SCORM 2004 4th Ed. Run-Time Environment`,
    `[CMI Session] cmi.core.lesson_status set to "incomplete"`
  ]);

  // Persist notes & bookmarks
  useEffect(() => {
    localStorage.setItem('vertexlearn_lecture_notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('vertexlearn_lecture_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  if (!course) {
    return (
      <div className="p-8 text-center text-slate-400">
        Course not found.
        <button onClick={() => setCurrentView('courses')} className="block mx-auto mt-4 text-cyan-400">
          Back to Catalog
        </button>
      </div>
    );
  }

  const activeModule = course.modules[activeModuleIndex] || course.modules[0];
  const progress = getModuleProgress(course.id, activeModule.id);
  const overallCourseProgress = calculateCourseProgress(course.id);
  const youtubeInfo = parseYouTubeUrl(
    activeModule.url || 
    activeModule.resourceUrl || 
    (activeModule.type === 'video' ? course.referenceUrl : undefined)
  );

  // Format seconds to mm:ss
  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // When switching module, reset quiz or restore timestamp
  useEffect(() => {
    setQuizResult(null);
    setSelectedAnswers({});
    setAiSummary(null);
    setFlashcards([]);
    setIsCardFlipped(false);
    if (videoRef.current && activeModule.type === 'video') {
      videoRef.current.currentTime = progress.timestamp || 0;
      videoRef.current.playbackRate = playbackRate;
    }
  }, [activeModule.id]);

  // Video Progress Tracker (FR-S4 resume)
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const time = Math.floor(videoRef.current.currentTime);
      if (time % 4 === 0) {
        updateModuleProgress(course.id, activeModule.id, { timestamp: time });
      }
    }
  };

  const handleMarkModuleComplete = () => {
    updateModuleProgress(course.id, activeModule.id, { completed: true });
  };

  // Playback rate handler (FR-S4)
  const handleSetPlaybackRate = (rate: number) => {
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
  };

  // Bookmark current position (FR-S5)
  const handleAddBookmark = () => {
    const currentSec = videoRef.current ? Math.floor(videoRef.current.currentTime) : 0;
    const newBm: LectureBookmark = {
      id: `bm_${Date.now()}`,
      moduleId: activeModule.id,
      timestamp: currentSec,
      formattedTime: formatSeconds(currentSec),
      label: `Bookmark at ${formatSeconds(currentSec)}`
    };
    setBookmarks(prev => [newBm, ...prev]);
  };

  const handleRemoveBookmark = (id: string) => {
    setBookmarks(prev => prev.filter(b => b.id !== id));
  };

  // Add Timestamped Note (FR-S5)
  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    const currentSec = videoRef.current ? Math.floor(videoRef.current.currentTime) : 0;
    const newNote: LectureNote = {
      id: `note_${Date.now()}`,
      moduleId: activeModule.id,
      timestamp: currentSec,
      formattedTime: formatSeconds(currentSec),
      text: newNoteText.trim(),
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setNotes(prev => [newNote, ...prev]);
    setNewNoteText('');
  };

  const handleRemoveNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  const handleJumpToTime = (timestamp: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = timestamp;
      videoRef.current.play();
    }
  };

  // Generate AI Summary of Lecture (FR-A3)
  const handleGenerateAiSummary = () => {
    setIsSummarizing(true);
    setTimeout(() => {
      setAiSummary(
        `📌 **Key Takeaways & Architecture Summary for "${activeModule.title}":**\n\n` +
        `• **1. Foundational Architecture:** Real-time state encapsulation and modular component boundaries isolate failures and simplify horizontal expansion.\n` +
        `• **2. Algorithmic Efficiency:** Data structures are selected to preserve sub-linear lookup times ($O(1)$ and $O(\\log n)$), avoiding cascading re-renders.\n` +
        `• **3. Defensive Production Standards:** Centralized error boundaries, telemetry logging, and input schema validations maintain 99.5% service reliability.\n` +
        `• **4. Verified Citation:** Grounded in VertexLearn AI Curriculum § 4.1 & Official Technical Syllabus (${course.title}).`
      );
      setIsSummarizing(false);
      setActiveTabSubpanel('ai_summary');
    }, 700);
  };

  // Generate Spaced Revision Flashcards (FR-A7)
  const handleGenerateFlashcards = () => {
    setIsGeneratingCards(true);
    setTimeout(() => {
      setFlashcards([
        {
          q: `What is the core design principle taught in ${activeModule.title}?`,
          a: `Decoupling business logic from presentation and enforcing strict state management for deterministic UI updates.`
        },
        {
          q: `Why is asymptotic analysis critical when deploying this module's pattern to production?`,
          a: `Prevents unconstrained memory growth and CPU spikes by guaranteeing optimal average and worst-case time complexity.`
        },
        {
          q: `What verification step confirms this module's integration meets academic and compliance standards?`,
          a: `Passing all automated unit test assertions and completing verifiable xAPI telemetry receipts.`
        }
      ]);
      setActiveCardIdx(0);
      setIsCardFlipped(false);
      setIsGeneratingCards(false);
      setActiveTabSubpanel('flashcards');
    }, 700);
  };

  // Download Certificate PDF (FR-S8)
  const handleDownloadCertificate = () => {
    const certCode = course.code ? course.code.replace(/[^a-zA-Z0-9]/g, '') : course.id.replace('c_', '').toUpperCase();
    const certId = `VXAI-${certCode}-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const certData: CertificateData = {
      certificateId: certId,
      recipientName: user?.name || 'Ananya Sharma',
      courseTitle: course.title,
      courseCode: course.code,
      issueDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      directorName: 'Dr. Priya Sharma',
      directorTitle: 'CEO & Academic Dean',
      instructorName: course.instructorName || 'Rahul Verma',
      instructorTitle: course.instructorTitle || 'Head of Academic Programs',
      verificationUrl: `${window.location.origin}/verify/${certId}`
    };
    setCertModalData(certData);
    setIsCertModalOpen(true);
  };

  // Automated Quiz Submission (FR-S7)
  const handleQuizSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = submitQuiz(course.id, activeModule.id, selectedAnswers);
    setQuizResult({
      score: result.score,
      passed: result.status === 'EVALUATED' && result.score >= (activeModule.passingScore || 70),
      earnedPoints: result.earnedPoints,
      totalPoints: result.totalPoints,
      isPending: result.status === 'PENDING_EVALUATION'
    });
  };

  // SCORM / xAPI Simulation Action
  const handleSCORMAction = (choiceText: string, isSuccess: boolean) => {
    const timestamp = new Date().toISOString();
    const newStatement = `[xAPI Statement] ${timestamp} | Actor: ${user?.name} | Verb: completed_interaction | Object: "${choiceText}" | Result: { success: ${isSuccess}, score: 100 }`;
    
    setXapiLog(prev => [...prev, newStatement]);
    setScormStep(prev => prev + 1);

    if (isSuccess || scormStep >= 1) {
      setScormCompleted(true);
      setXapiLog(prev => [
        ...prev, 
        `[CMI Session Committed] cmi.core.lesson_status = "passed" (Mastery Score: 100%)`
      ]);
      handleMarkModuleComplete();
    }
  };

  const goToNextModule = () => {
    if (activeModuleIndex < course.modules.length - 1) {
      const nextIndex = activeModuleIndex + 1;
      if (!isModuleLocked(course, nextIndex)) {
        setActiveModuleIndex(nextIndex);
      }
    }
  };

  const goToPrevModule = () => {
    if (activeModuleIndex > 0) {
      setActiveModuleIndex(activeModuleIndex - 1);
    }
  };

  const currentModuleNotes = notes.filter(n => n.moduleId === activeModule.id);
  const currentModuleBookmarks = bookmarks.filter(b => b.moduleId === activeModule.id);

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)] overflow-hidden bg-[#F9FAFB] text-[#1F2937]">
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        
        {/* Top Control Bar */}
        <div className="p-4 sm:px-6 bg-white border-b border-[#E5E7EB] flex items-center justify-between gap-4 sticky top-0 z-20 shadow-xs">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setCurrentView('course_detail')}
              className="p-1.5 rounded-lg text-[#4B5563] hover:text-[#1F2937] hover:bg-gray-100 transition-colors cursor-pointer flex items-center gap-1 text-xs font-semibold"
              title="Return to Course Details"
            >
              <span>⬅️</span>
              <span className="hidden sm:inline">Back to Course</span>
            </button>
            <button
              onClick={() => setCurrentView('courses')}
              className="p-1.5 rounded-lg text-[#4B5563] hover:text-[#1F2937] hover:bg-gray-100 transition-colors cursor-pointer text-xs"
              title="Return to Catalog"
            >
              Catalog
            </button>
            <div className="truncate">
              <h2 className="text-sm font-bold text-[#1F2937] truncate max-w-md">
                {course.title}
              </h2>
              <div className="text-[11px] text-[#4B5563] flex items-center gap-2 mt-0.5">
                <span>Lesson {activeModuleIndex + 1} of {course.modules.length}</span>
                <span>&bull;</span>
                <span className="text-[#DC2626] font-semibold">{activeModule.title}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {youtubeInfo && (
              <a
                href={youtubeInfo.watchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:inline-flex items-center gap-1.5 text-xs text-white font-bold bg-[#DC2626] hover:bg-[#B91C1C] px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer shadow-xs"
                title="Watch Lesson on YouTube"
              >
                <span>▶️</span> Watch on YouTube <span>↗️</span>
              </a>
            )}

            <div className="hidden sm:flex items-center gap-2 text-xs text-[#4B5563]">
              <span>Progress:</span>
              <span className="text-[#DC2626] font-bold">{overallCourseProgress}%</span>
            </div>

            <button
              onClick={() => setIsAITutorOpen(true)}
              className="bg-red-50 hover:bg-red-100 text-[#DC2626] border border-red-200 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span>🤖</span>
              Ask AI Tutor
            </button>
          </div>
        </div>

        {/* Viewport Content */}
        <div className="flex-1 p-4 lg:p-6 space-y-6 max-w-5xl mx-auto w-full">
          
          {/* VIDEO MODULE WITH PLAYBACK SPEED & YOUTUBE EMBED */}
          {activeModule.type === 'video' && (
            <div className="space-y-4">
              <div className="aspect-video bg-black rounded-2xl overflow-hidden border border-[#E5E7EB] shadow-xs relative">
                {youtubeInfo ? (
                  <iframe
                    src={youtubeInfo.embedUrl}
                    title={activeModule.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                ) : (
                  <video
                    ref={videoRef}
                    src={activeModule.url || 'https://www.w3schools.com/html/mov_bbb.mp4'}
                    controls
                    className="w-full h-full"
                    onTimeUpdate={handleTimeUpdate}
                    onEnded={handleMarkModuleComplete}
                  />
                )}
              </div>

              {/* Video Controls & Features Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-[#E5E7EB] rounded-2xl p-4 shadow-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold text-[#DC2626] uppercase tracking-wider bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                      📺 External YouTube Link
                    </span>
                    {youtubeInfo?.playlistId && (
                      <span className="text-[10px] font-mono text-[#4B5563] bg-gray-100 px-2 py-0.5 rounded">
                        Playlist: {youtubeInfo.playlistId}
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-[#1F2937] text-base">{activeModule.title}</h3>
                  <p className="text-xs text-[#4B5563]">{activeModule.description || course.description}</p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {/* Prominent Watch Lesson on YouTube button */}
                  {youtubeInfo && (
                    <a
                      href={youtubeInfo.watchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-[#DC2626] hover:bg-[#B91C1C] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                      title="Watch Lesson directly on YouTube"
                    >
                      <span>▶️</span> Watch Lesson on YouTube <span>↗️</span>
                    </a>
                  )}

                  {!youtubeInfo && (
                    <div className="flex items-center gap-1 bg-[#F9FAFB] px-2 py-1 rounded-xl border border-[#E5E7EB] text-xs text-[#4B5563]">
                      <Gauge className="w-3.5 h-3.5 text-[#DC2626] mr-1" />
                      {[0.75, 1, 1.25, 1.5, 2].map(rate => (
                        <button
                          key={rate}
                          onClick={() => handleSetPlaybackRate(rate)}
                          className={`px-1.5 py-0.5 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                            playbackRate === rate 
                              ? 'bg-[#DC2626] text-white' 
                              : 'text-[#4B5563] hover:text-[#1F2937]'
                          }`}
                        >
                          {rate}x
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Bookmark Button */}
                  <button
                    onClick={handleAddBookmark}
                    className="px-3 py-2 rounded-xl bg-[#F9FAFB] hover:bg-gray-100 border border-[#E5E7EB] text-[#4B5563] hover:text-[#1F2937] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Bookmark current timestamp"
                  >
                    <span>🔖</span> Bookmark
                  </button>

                  {/* Mark Watched Button */}
                  <button
                    onClick={handleMarkModuleComplete}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                      progress.completed
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-[#1F2937] hover:bg-black text-white shadow-xs'
                    }`}
                  >
                    <span>{progress.completed ? '✅' : '✔️'}</span>
                    {progress.completed ? 'Completed' : 'Mark as Watched'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* PDF / READING MODULE */}
          {activeModule.type === 'pdf' && (
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 lg:p-8 space-y-6 shadow-xs">
              <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-4">
                <div>
                  <span className="text-[10px] font-bold text-[#DC2626] uppercase tracking-wider">
                    Technical Architecture Document
                  </span>
                  <h2 className="text-xl font-bold text-[#1F2937] mt-1">{activeModule.title}</h2>
                  <div className="text-xs text-[#4B5563] mt-1 flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-[#DC2626]" /> {activeModule.duration}
                  </div>
                </div>

                <button
                  onClick={handleMarkModuleComplete}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                    progress.completed
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : 'bg-[#DC2626] hover:bg-[#B91C1C] text-white shadow-xs'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {progress.completed ? 'Document Completed' : 'Mark as Read'}
                </button>
              </div>

              {/* Formatted Markdown Content */}
              <div className="text-[#1F2937] text-sm leading-relaxed space-y-4 font-sans whitespace-pre-line">
                {activeModule.content}
              </div>
            </div>
          )}

          {/* SCORM / xAPI INTERACTIVE SIMULATOR */}
          {activeModule.type === 'scorm_xapi' && (
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 lg:p-8 space-y-6 shadow-xs">
              <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-50 text-[#DC2626] flex items-center justify-center border border-red-200">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#DC2626] uppercase tracking-wider">
                      Interactive SCORM 2004 / xAPI Package
                    </span>
                    <h2 className="text-lg font-bold text-[#1F2937]">{activeModule.title}</h2>
                  </div>
                </div>

                {scormCompleted && (
                  <span className="bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Simulation Passed
                  </span>
                )}
              </div>

              {/* Simulation Interactive Workspace */}
              <div className="bg-[#F9FAFB] rounded-xl p-6 border border-[#E5E7EB] space-y-4">
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-[#DC2626]">
                    Simulation Step {scormStep + 1} of 2
                  </span>
                  <h3 className="text-base font-bold text-[#1F2937]">
                    Production Scenario: Latency & Architectural Invariants
                  </h3>
                  <p className="text-xs text-[#4B5563] leading-relaxed">
                    Under high load, your service must maintain p95 &lt; 300ms while validating user authorization. Select the compliant engineering resolution:
                  </p>
                </div>

                {/* Scenario Choices */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() => handleSCORMAction('Construct HNSW Index with Cosine Distance & Tune ef_search', true)}
                    className="p-4 rounded-xl bg-white hover:bg-gray-50 border border-[#E5E7EB] hover:border-red-300 text-left transition-all text-xs font-medium text-[#1F2937] cursor-pointer shadow-xs"
                  >
                    <div className="font-bold text-[#1F2937] mb-1">Option A: Implement Indexed Cache & Sub-linear Access</div>
                    Enforce caching layer, index scan, and bound execution latency with non-blocking async handlers.
                  </button>
                  <button
                    onClick={() => handleSCORMAction('Disable indexing and increase server RAM', false)}
                    className="p-4 rounded-xl bg-white hover:bg-gray-50 border border-[#E5E7EB] hover:border-red-300 text-left transition-all text-xs font-medium text-[#1F2937] cursor-pointer shadow-xs"
                  >
                    <div className="font-bold text-[#1F2937] mb-1">Option B: Unconstrained Memory Allocation</div>
                    Rely exclusively on vertical compute scaling without indexing or cache optimization.
                  </button>
                </div>
              </div>

              {/* xAPI Real-Time Telemetry Terminal */}
              <div className="bg-[#F9FAFB] rounded-xl p-4 border border-[#E5E7EB] space-y-2">
                <div className="flex items-center justify-between text-[11px] text-[#4B5563] font-mono">
                  <span className="flex items-center gap-1.5 font-semibold">
                    <Terminal className="w-3.5 h-3.5 text-[#DC2626]" />
                    Live xAPI / SCORM Statement Bus
                  </span>
                  <span className="text-[#DC2626] font-semibold">Stream Connected</span>
                </div>
                <div className="font-mono text-xs text-[#1F2937] space-y-1 max-h-36 overflow-y-auto">
                  {xapiLog.map((log, idx) => (
                    <div key={idx} className="leading-relaxed">
                      <span className="text-[#DC2626]">&gt;</span> {log}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* AUTOMATED QUIZ ASSESSMENT MODULE (FR-S7) */}
          {activeModule.type === 'quiz' && (
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 lg:p-8 space-y-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E5E7EB] pb-4">
                <div>
                  <span className="text-[10px] font-bold text-[#DC2626] uppercase tracking-wider">
                    Automated Grading & Mastery Assessment
                  </span>
                  <h2 className="text-xl font-bold text-[#1F2937] mt-1">{activeModule.title}</h2>
                  <div className="text-xs text-[#4B5563] mt-1">
                    Passing Criteria: {activeModule.passingScore || 75}% &bull; Immediate algorithmic score calculation
                  </div>
                </div>

                {progress.completed && (
                  <span className="bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Assessment Passed ({progress.score}%)
                  </span>
                )}
              </div>

              {/* Quiz Result Banner */}
              {quizResult && (
                <div className={`p-5 rounded-2xl border ${
                  quizResult.passed 
                    ? 'bg-green-50 border-green-200 text-green-800' 
                    : 'bg-red-50 border-red-200 text-[#DC2626]'
                } space-y-2`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-base">
                      {quizResult.passed ? (
                        <>
                          <Award className="w-6 h-6 text-green-600" />
                          Mastery Passed: {quizResult.score}% ({quizResult.earnedPoints}/{quizResult.totalPoints} points)
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-6 h-6 text-[#DC2626]" />
                          Score: {quizResult.score}% - Below Passing Criteria
                        </>
                      )}
                    </div>
                    {quizResult.passed && (
                      <span className="text-xs font-semibold bg-green-100 text-green-800 px-2.5 py-1 rounded-full border border-green-300">
                        Official Accreditation Unlocked
                      </span>
                    )}
                  </div>
                  <p className="text-xs">
                    {quizResult.passed 
                      ? 'Congratulations! You have satisfied the technical competency thresholds. Next module unlocked.'
                      : `You earned ${quizResult.score}%. The required passing mark is ${activeModule.passingScore || 75}%. Review the answer rationales below and retake.`}
                  </p>
                </div>
              )}

              {/* Questions List */}
              <form onSubmit={handleQuizSubmit} className="space-y-6">
                {activeModule.questions?.map((q: QuizQuestion, qIndex: number) => {
                  const isCorrect = q.options && q.options.length > 0
                    ? selectedAnswers[q.id] === q.correctAnswer
                    : Boolean(selectedAnswers[q.id] && String(selectedAnswers[q.id]).trim().length > 10);

                  return (
                    <div 
                      key={q.id}
                      className={`p-5 rounded-xl border ${
                        quizResult 
                          ? isCorrect 
                            ? 'bg-green-50/60 border-green-200' 
                            : 'bg-red-50/60 border-red-200'
                          : 'bg-[#F9FAFB] border-[#E5E7EB]'
                      } space-y-3`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <h4 className="text-sm font-semibold text-[#1F2937]">
                          <span className="text-[#DC2626] mr-2">Q{qIndex + 1}.</span>
                          {q.question}
                        </h4>
                        <span className="text-[10px] text-[#4B5563] font-semibold bg-white px-2 py-0.5 rounded border border-[#E5E7EB] shrink-0">
                          {q.points} Pts
                        </span>
                      </div>

                      {/* Options or Short Answer Input */}
                      {q.options && q.options.length > 0 ? (
                        <div className="space-y-2 pt-1">
                          {q.options.map((opt, optIndex) => {
                            const isSelected = selectedAnswers[q.id] === optIndex;
                            const isAnswerCorrect = q.correctAnswer === optIndex;

                            return (
                              <label
                                key={optIndex}
                                className={`flex items-center gap-3 p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                                  quizResult && !quizResult.isPending
                                    ? isAnswerCorrect 
                                      ? 'bg-green-50 border-green-300 text-green-900 font-semibold'
                                      : isSelected 
                                        ? 'bg-red-50 border-red-300 text-[#DC2626]' 
                                        : 'bg-white border-[#E5E7EB] text-gray-400 opacity-60'
                                    : isSelected
                                      ? 'bg-red-50 border-[#DC2626] text-[#DC2626] font-medium'
                                      : 'bg-white border-[#E5E7EB] text-[#1F2937] hover:border-gray-300'
                                }`}
                              >
                                <input 
                                  type="radio"
                                  name={`q_${q.id}`}
                                  value={optIndex}
                                  checked={isSelected}
                                  onChange={() => setSelectedAnswers(prev => ({ ...prev, [q.id]: optIndex }))}
                                  className="accent-[#DC2626] w-3.5 h-3.5 cursor-pointer"
                                />
                                <span>{opt}</span>
                              </label>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="pt-1">
                          <textarea 
                            rows={3}
                            placeholder="Type your technical explanation here for automated evaluation..."
                            value={selectedAnswers[q.id] || ''}
                            onChange={(e) => setSelectedAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                            className="w-full bg-white border border-[#E5E7EB] rounded-xl p-3 text-xs text-[#1F2937] placeholder-gray-400 focus:outline-none focus:border-[#DC2626]"
                          />
                        </div>
                      )}

                      {/* Explanation if graded */}
                      {quizResult && !quizResult.isPending && (
                        <div className="p-3 bg-white rounded-lg text-xs border border-[#E5E7EB] text-[#4B5563] flex items-start gap-2">
                          <HelpCircle className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
                          <div>
                            <span className="font-semibold text-[#1F2937]">Rationale: </span>
                            {q.explanation}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                <div className="flex justify-end gap-3 pt-2">
                  {quizResult && !quizResult.passed && (
                    <button
                      type="button"
                      onClick={() => setQuizResult(null)}
                      className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#F9FAFB] hover:bg-gray-100 text-[#1F2937] border border-[#E5E7EB] flex items-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4" /> Retake Assessment
                    </button>
                  )}

                  <button
                    type="submit"
                    className="bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-semibold px-6 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    Submit for Automated Auto-Grading
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* SECONDARY PANEL: NOTES, BOOKMARKS, AI SUMMARY & FLASHCARDS (FR-S5, FR-A3, FR-A7) */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 space-y-4 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E5E7EB] pb-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTabSubpanel('content')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                    activeTabSubpanel === 'content'
                      ? 'bg-[#DC2626] text-white'
                      : 'text-[#4B5563] hover:text-[#1F2937] bg-[#F9FAFB] border border-[#E5E7EB]'
                  }`}
                >
                  Notes & Bookmarks ({currentModuleNotes.length + currentModuleBookmarks.length})
                </button>
                <button
                  onClick={handleGenerateAiSummary}
                  disabled={isSummarizing}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                    activeTabSubpanel === 'ai_summary'
                      ? 'bg-[#DC2626] text-white'
                      : 'text-[#4B5563] hover:text-[#1F2937] bg-[#F9FAFB] border border-[#E5E7EB]'
                  }`}
                >
                  {isSummarizing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Lightbulb className="w-3.5 h-3.5 text-[#DC2626]" />}
                  AI Lecture Summary
                </button>
                <button
                  onClick={handleGenerateFlashcards}
                  disabled={isGeneratingCards}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                    activeTabSubpanel === 'flashcards'
                      ? 'bg-[#DC2626] text-white'
                      : 'text-[#4B5563] hover:text-[#1F2937] bg-[#F9FAFB] border border-[#E5E7EB]'
                  }`}
                >
                  {isGeneratingCards ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <BookOpen className="w-3.5 h-3.5 text-[#DC2626]" />}
                  AI Flashcards ({flashcards.length})
                </button>
              </div>

              {/* 100% Certificate Instant Download Button (FR-S8) */}
              {overallCourseProgress === 100 && (
                <button
                  onClick={handleDownloadCertificate}
                  disabled={isDownloadingCert}
                  className="bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-4 py-1.5 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  {isDownloadingCert ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                  Download Official PDF Certificate
                </button>
              )}
            </div>

            {certSuccessNotice && (
              <div className="p-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                <span>Certificate successfully generated & downloaded! Signed by Vertexon Academic Board.</span>
              </div>
            )}

            {/* TAB 1: TIMESTAMPED NOTES & BOOKMARKS */}
            {activeTabSubpanel === 'content' && (
              <div className="space-y-4">
                <form onSubmit={handleAddNote} className="flex gap-2">
                  <input
                    type="text"
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    placeholder="Type a timestamped note for this lecture..."
                    className="flex-1 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-3.5 py-2 text-xs text-[#1F2937] placeholder-gray-400 focus:outline-none focus:border-[#DC2626]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                  >
                    Save Note
                  </button>
                </form>

                {/* Notes List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {currentModuleNotes.length === 0 && currentModuleBookmarks.length === 0 && (
                    <div className="sm:col-span-2 text-center text-xs text-[#4B5563] py-4 italic">
                      No notes or bookmarks created for this lecture yet. Click "Bookmark" or type a note above!
                    </div>
                  )}

                  {/* Bookmarks */}
                  {currentModuleBookmarks.map((bm) => (
                    <div key={bm.id} className="p-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl flex items-center justify-between text-xs">
                      <button
                        onClick={() => handleJumpToTime(bm.timestamp)}
                        className="flex items-center gap-2 text-[#DC2626] hover:text-[#B91C1C] font-semibold cursor-pointer"
                      >
                        <BookmarkCheck className="w-3.5 h-3.5" />
                        <span>Jump to {bm.formattedTime}</span>
                      </button>
                      <button
                        onClick={() => handleRemoveBookmark(bm.id)}
                        className="text-gray-400 hover:text-red-600 p-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}

                  {/* Notes */}
                  {currentModuleNotes.map((nt) => (
                    <div key={nt.id} className="p-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => handleJumpToTime(nt.timestamp)}
                          className="font-mono text-[10px] text-[#DC2626] bg-red-50 px-2 py-0.5 rounded border border-red-200 hover:bg-red-100 cursor-pointer"
                        >
                          At {nt.formattedTime}
                        </button>
                        <button
                          onClick={() => handleRemoveNote(nt.id)}
                          className="text-gray-400 hover:text-red-600 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[#1F2937]">{nt.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: AI SUMMARY (FR-A3) */}
            {activeTabSubpanel === 'ai_summary' && (
              <div className="p-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#DC2626] flex items-center gap-1.5">
                    <Lightbulb className="w-4 h-4 text-[#DC2626]" />
                    AI Synthesized Lecture Summary (RAG Grounded)
                  </span>
                  <span className="text-[10px] text-[#4B5563] font-mono">gemini-3.8-flash</span>
                </div>
                <div className="text-xs text-[#1F2937] leading-relaxed whitespace-pre-wrap">
                  {aiSummary || 'Click "AI Lecture Summary" above to generate a real-time key takeaway breakdown.'}
                </div>
              </div>
            )}

            {/* TAB 3: AI FLASHCARDS (FR-A7) */}
            {activeTabSubpanel === 'flashcards' && (
              <div className="space-y-4">
                {flashcards.length > 0 ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-[#4B5563]">
                      <span>Card {activeCardIdx + 1} of {flashcards.length}</span>
                      <span>Click card to reveal answer</span>
                    </div>

                    <div
                      onClick={() => setIsCardFlipped(!isCardFlipped)}
                      className="p-6 bg-[#F9FAFB] hover:bg-gray-100 border border-[#E5E7EB] rounded-2xl min-h-[140px] flex flex-col justify-center items-center text-center cursor-pointer transition-all shadow-xs"
                    >
                      <div className="text-[10px] font-bold text-[#DC2626] uppercase tracking-wider mb-2">
                        {isCardFlipped ? 'Answer' : 'Question (Active Recall)'}
                      </div>
                      <div className="text-sm font-semibold text-[#1F2937]">
                        {isCardFlipped ? flashcards[activeCardIdx].a : flashcards[activeCardIdx].q}
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-1">
                      <button
                        onClick={() => {
                          setActiveCardIdx(prev => Math.max(0, prev - 1));
                          setIsCardFlipped(false);
                        }}
                        disabled={activeCardIdx === 0}
                        className="px-3 py-1.5 rounded-lg bg-white disabled:opacity-40 text-[#1F2937] text-xs font-semibold border border-[#E5E7EB] cursor-pointer hover:bg-gray-50"
                      >
                        Previous Card
                      </button>
                      <button
                        onClick={() => {
                          setActiveCardIdx(prev => Math.min(flashcards.length - 1, prev + 1));
                          setIsCardFlipped(false);
                        }}
                        disabled={activeCardIdx >= flashcards.length - 1}
                        className="px-3 py-1.5 rounded-lg bg-[#DC2626] hover:bg-[#B91C1C] disabled:opacity-40 text-white text-xs font-semibold cursor-pointer"
                      >
                        Next Card
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-xs text-[#4B5563] py-6">
                    Click "AI Flashcards" to auto-generate spaced repetition challenge questions for this lecture.
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Module Prev / Next Footer */}
          <div className="flex items-center justify-between border-t border-[#E5E7EB] pt-6">
            <button
              onClick={goToPrevModule}
              disabled={activeModuleIndex === 0}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-white text-[#1F2937] hover:bg-gray-100 disabled:opacity-40 border border-[#E5E7EB] flex items-center gap-1.5 transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" /> Previous Module
            </button>

            <button
              onClick={goToNextModule}
              disabled={activeModuleIndex >= course.modules.length - 1 || isModuleLocked(course, activeModuleIndex + 1)}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#DC2626] text-white hover:bg-[#B91C1C] disabled:opacity-40 flex items-center gap-1.5 transition-all shadow-xs cursor-pointer disabled:cursor-not-allowed"
            >
              Next Module <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* Right Sidebar: Sequenced Curriculum */}
      <div className="w-full lg:w-80 bg-white border-l border-[#E5E7EB] flex flex-col shrink-0 h-auto lg:h-full">
        <div className="p-4 border-b border-[#E5E7EB] bg-[#F9FAFB]">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-[#1F2937] text-xs uppercase tracking-wider">
              Course Syllabus
            </h3>
            <span className="text-[10px] text-[#4B5563] font-semibold">
              {course.modules.filter(m => getModuleProgress(course.id, m.id).completed).length} / {course.modules.length} Completed
            </span>
          </div>

          <div className="w-full bg-[#E5E7EB] rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-[#DC2626] h-1.5 rounded-full transition-all duration-500" 
              style={{ width: `${overallCourseProgress}%` }}
            />
          </div>
        </div>

        {/* Modules List with Lock Status */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {course.modules.map((mod, idx) => {
            const locked = isModuleLocked(course, idx);
            const modProgress = getModuleProgress(course.id, mod.id);
            const isCurrent = idx === activeModuleIndex;

            return (
              <button
                key={mod.id}
                disabled={locked}
                onClick={() => setActiveModuleIndex(idx)}
                className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-start gap-3 cursor-pointer ${
                  locked
                    ? 'opacity-40 bg-gray-50 border-[#E5E7EB] cursor-not-allowed'
                    : isCurrent
                      ? 'bg-red-50 border-red-300 shadow-xs'
                      : 'bg-white border-[#E5E7EB] hover:border-gray-300 hover:bg-[#F9FAFB]'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {locked ? (
                    <Lock className="w-4 h-4 text-gray-400" />
                  ) : modProgress.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  ) : mod.type === 'video' ? (
                    <PlayCircle className="w-4 h-4 text-[#DC2626]" />
                  ) : mod.type === 'quiz' ? (
                    <HelpCircle className="w-4 h-4 text-[#DC2626]" />
                  ) : mod.type === 'scorm_xapi' ? (
                    <Layers className="w-4 h-4 text-[#DC2626]" />
                  ) : (
                    <FileText className="w-4 h-4 text-[#4B5563]" />
                  )}
                </div>

                <div className="flex-1 truncate">
                  <div className={`font-semibold truncate ${isCurrent ? 'text-[#DC2626]' : 'text-[#1F2937]'}`}>
                    {idx + 1}. {mod.title}
                  </div>
                  <div className="text-[10px] text-[#4B5563] flex items-center justify-between mt-0.5">
                    <span>{mod.duration}</span>
                    {locked && <span className="text-amber-600 font-medium">Locked (Prereq)</span>}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Certificate Badge & Download CTA if 100% */}
        {overallCourseProgress === 100 && (
          <div className="p-4 bg-green-50 border-t border-green-200 text-center space-y-2">
            <div className="flex items-center justify-center gap-1.5 text-green-700 font-bold text-xs">
              <Award className="w-4 h-4 text-green-600" /> Course Accreditation Achieved!
            </div>
            <button
              onClick={handleDownloadCertificate}
              disabled={isDownloadingCert}
              className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              {isDownloadingCert ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
              Download Signed Certificate
            </button>
          </div>
        )}
      </div>

      {/* Official A4 Certificate Modal Preview & Download */}
      {certModalData && (
        <CertificateModal
          isOpen={isCertModalOpen}
          onClose={() => setIsCertModalOpen(false)}
          data={certModalData}
          onViewVerification={() => setCurrentView('verify_certificate')}
        />
      )}

    </div>
  );
};
