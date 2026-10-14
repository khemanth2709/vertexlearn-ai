import React, { useState, useRef, useEffect } from 'react';
import { useLMS } from '../../context/LMSContext';
import { AITutorMode } from '../../types/lms';
import { audioTranscriber } from '../../services/transcriptionService';
import { 
  Sparkles, 
  X, 
  Send, 
  Bot, 
  Loader2, 
  BookOpen, 
  Lightbulb, 
  Lock, 
  Target, 
  RotateCcw,
  ShieldAlert,
  ExternalLink,
  ChevronRight,
  Info,
  Mic,
  MicOff,
  Square,
  Radio
} from 'lucide-react';

interface ModeConfig {
  id: AITutorMode;
  label: string;
  badge: string;
  icon: React.FC<{ className?: string }>;
  description: string;
  color: string;
  activeBg: string;
  quickPrompts: string[];
}

const MODES: ModeConfig[] = [
  {
    id: 'study',
    label: 'Study',
    badge: 'Full Explanations',
    icon: BookOpen,
    description: 'Deep dives, conceptual explanations, architectural diagrams & course citations.',
    color: 'text-cyan-400',
    activeBg: 'bg-cyan-600 text-white shadow-cyan-600/30',
    quickPrompts: [
      'Explain React Fiber & Virtual DOM reconciliation',
      'Deep dive: pgvector cosine vs L2 distance',
      'How does libuv event loop handle concurrency?',
      'Explain CSS Specificity & Cascade hierarchy'
    ]
  },
  {
    id: 'homework',
    label: 'Homework',
    badge: 'Hints Only',
    icon: Lightbulb,
    description: 'Socratic hints and progressive scaffolding. Will never provide direct solutions.',
    color: 'text-amber-400',
    activeBg: 'bg-amber-600 text-white shadow-amber-600/30',
    quickPrompts: [
      'Give me a hint for vector indexing assignment',
      'How should I structure my API error handling?',
      'What edge cases am I missing in binary search?',
      'Hint on managing state without mutating arrays'
    ]
  },
  {
    id: 'exam',
    label: 'Exam',
    badge: 'Locked',
    icon: Lock,
    description: 'Testing integrity mode. AI assistance is disabled during active examinations.',
    color: 'text-rose-400',
    activeBg: 'bg-rose-600 text-white shadow-rose-600/30',
    quickPrompts: []
  },
  {
    id: 'review',
    label: 'Review',
    badge: 'Retrieval Drills',
    icon: Target,
    description: 'Active recall challenges, flashcard drills & spaced repetition diagnostics.',
    color: 'text-emerald-400',
    activeBg: 'bg-emerald-600 text-white shadow-emerald-600/30',
    quickPrompts: [
      'Drill me on JavaScript closures & scoping',
      'Quiz me on DSA QuickSort vs MergeSort',
      'Test my knowledge on MERN MongoDB aggregation',
      'Challenge me on HTTP/3 vs HTTP/2 protocols'
    ]
  }
];

export const AITutorWidget: React.FC = () => {
  const { 
    isAITutorOpen, 
    setIsAITutorOpen, 
    aiTutorMode,
    setAiTutorMode,
    aiChatHistory, 
    askAITutor, 
    resetAiChatHistory,
    user 
  } = useLMS();

  const [input, setInput] = useState('');
  const [explanationDepth, setExplanationDepth] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcriptionNotice, setTranscriptionNotice] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  const currentModeConfig = MODES.find(m => m.id === aiTutorMode) || MODES[0];

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiChatHistory, isAITutorOpen, isTyping]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping || aiTutorMode === 'exam') return;

    const question = `[Depth: ${explanationDepth}] ${input}`;
    setInput('');
    setIsTyping(true);
    await askAITutor(question, aiTutorMode);
    setIsTyping(false);
  };

  const handleToggleVoiceRecording = async () => {
    if (aiTutorMode === 'exam') return;

    if (isRecording) {
      setIsTranscribing(true);
      setIsRecording(false);
      try {
        const result = await audioTranscriber.stopRecordingAndTranscribe();
        if (result.text) {
          setInput((prev) => (prev ? `${prev} ${result.text}` : result.text));
          setTranscriptionNotice('Transcribed via gemini-3.5-transcribe');
          setTimeout(() => setTranscriptionNotice(null), 4000);
        }
      } catch (err: any) {
        console.error('Audio transcription failed:', err);
        setTranscriptionNotice('Recording completed');
        setTimeout(() => setTranscriptionNotice(null), 3000);
      } finally {
        setIsTranscribing(false);
      }
    } else {
      try {
        await audioTranscriber.startRecording();
        setIsRecording(true);
        setTranscriptionNotice('Listening... Speak into microphone. Click Stop to transcribe.');
      } catch (err: any) {
        console.error('Microphone error:', err);
        setTranscriptionNotice('Microphone access denied or unavailable in browser');
        setTimeout(() => setTranscriptionNotice(null), 4000);
      }
    }
  };

  const handleQuickPrompt = async (prompt: string) => {
    if (isTyping || aiTutorMode === 'exam') return;
    setIsTyping(true);
    await askAITutor(prompt, aiTutorMode);
    setIsTyping(false);
  };

  if (!user) return null;

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsAITutorOpen(!isAITutorOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#DC2626] hover:bg-[#B91C1C] text-white rounded-2xl shadow-xl flex items-center justify-center transition-all hover:scale-105 z-40 group cursor-pointer"
        title="Open VertexLearn AI Technical Tutor (Voice & Text)"
        aria-label="Toggle AI Tutor"
      >
        {isAITutorOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <div className="relative">
            <Sparkles className="w-6 h-6 text-white group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-white border-2 border-[#DC2626] animate-pulse"></span>
          </div>
        )}
      </button>

      {/* Floating Chat Modal */}
      {isAITutorOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 w-[420px] max-w-[calc(100vw-2rem)] h-[620px] max-h-[calc(100vh-7.5rem)] bg-white border border-[#E5E7EB] rounded-3xl shadow-2xl flex flex-col overflow-hidden z-40 animate-in slide-in-from-bottom-4 duration-200 text-[#1F2937]">
          
          {/* Header */}
          <div className="p-3.5 border-b border-[#E5E7EB] bg-[#F9FAFB] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-[#DC2626] shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-xs text-[#1F2937]">VertexLearn AI Tutor</h3>
                  <span className="text-[10px] px-1.5 py-0.2 rounded font-mono font-semibold bg-red-50 text-[#DC2626] border border-red-200">
                    RAG v2.4
                  </span>
                </div>
                <div className="text-[10px] text-[#4B5563] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626] inline-block"></span>
                  Pedagogical Mode: <strong className="text-[#1F2937] capitalize">{currentModeConfig.label}</strong>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={resetAiChatHistory}
                title="Reset conversation"
                className="p-1.5 rounded-lg text-[#4B5563] hover:text-[#1F2937] hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsAITutorOpen(false)}
                title="Close AI Tutor"
                className="p-1.5 rounded-lg text-[#4B5563] hover:text-[#1F2937] hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mode Selector Tabs (Study, Homework, Exam, Review) */}
          <div className="p-2 bg-white border-b border-[#E5E7EB] flex items-center gap-1">
            {MODES.map((mode) => {
              const Icon = mode.icon;
              const isActive = aiTutorMode === mode.id;

              return (
                <button
                  key={mode.id}
                  onClick={() => setAiTutorMode(mode.id)}
                  className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    isActive 
                      ? 'bg-[#DC2626] text-white shadow-xs font-bold' 
                      : 'text-[#4B5563] hover:text-[#1F2937] hover:bg-gray-100'
                  }`}
                  title={`${mode.label} Mode: ${mode.description}`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{mode.label}</span>
                </button>
              );
            })}
          </div>

          {/* Mode Description Banner */}
          <div className="px-3.5 py-1.5 bg-[#F9FAFB] border-b border-[#E5E7EB] flex items-center justify-between text-[10px] text-[#4B5563]">
            <div className="flex items-center gap-1.5 truncate">
              <Info className="w-3 h-3 shrink-0 text-[#DC2626]" />
              <span className="truncate">{currentModeConfig.description}</span>
            </div>
            <span className="text-[9px] font-bold uppercase tracking-wider shrink-0 px-1.5 py-0.5 rounded bg-red-50 text-[#DC2626] border border-red-200">
              {currentModeConfig.badge}
            </span>
          </div>

          {/* Explanation Depth Control & Pedagogical Actions */}
          {aiTutorMode !== 'exam' && (
            <div className="px-3 py-1.5 bg-white border-b border-[#E5E7EB] flex items-center justify-between gap-2 text-[10px]">
              <div className="flex items-center gap-1">
                <span className="text-[#4B5563] font-semibold mr-1">Depth:</span>
                {(['Beginner', 'Intermediate', 'Advanced'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setExplanationDepth(lvl)}
                    className={`px-2 py-0.5 rounded-md font-semibold transition-colors cursor-pointer ${
                      explanationDepth === lvl
                        ? 'bg-[#DC2626] text-white'
                        : 'bg-[#F9FAFB] text-[#4B5563] hover:text-[#1F2937] border border-[#E5E7EB]'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleQuickPrompt('Generate a personalized study plan based on my quiz scores and weak topics.')}
                  disabled={isTyping}
                  className="px-2 py-0.5 rounded-md bg-[#F9FAFB] hover:bg-gray-100 border border-[#E5E7EB] text-[#DC2626] text-[10px] font-semibold transition-colors cursor-pointer"
                  title="Generate dynamic study plan"
                >
                  Study Plan
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickPrompt('Generate 5 flashcard Q&A drill pairs for spaced revision of this course.')}
                  disabled={isTyping}
                  className="px-2 py-0.5 rounded-md bg-[#F9FAFB] hover:bg-gray-100 border border-[#E5E7EB] text-[#DC2626] text-[10px] font-semibold transition-colors cursor-pointer"
                  title="Generate spaced repetition flashcards"
                >
                  Flashcards
                </button>
              </div>
            </div>
          )}

          {/* Quick Prompts Carousel */}
          {aiTutorMode !== 'exam' && currentModeConfig.quickPrompts.length > 0 && (
            <div className="px-3 py-2 bg-[#F9FAFB] border-b border-[#E5E7EB] flex gap-1.5 overflow-x-auto text-[10px] no-scrollbar">
              {currentModeConfig.quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickPrompt(prompt)}
                  disabled={isTyping}
                  className="px-2.5 py-1 rounded-lg bg-white hover:bg-gray-100 text-[#4B5563] hover:text-[#1F2937] whitespace-nowrap border border-[#E5E7EB] transition-colors flex items-center gap-1 disabled:opacity-50 cursor-pointer"
                >
                  <span>{prompt}</span>
                  <ChevronRight className="w-3 h-3 text-[#DC2626]" />
                </button>
              ))}
            </div>
          )}

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#F9FAFB] text-xs">
            {aiChatHistory.map((msg, i) => (
              <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                {msg.role === 'assistant' && msg.mode && (
                  <div className="text-[9px] font-bold text-[#4B5563] uppercase tracking-wider mb-1 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626]"></span>
                    {msg.mode} mode
                  </div>
                )}

                <div className={`max-w-[88%] rounded-2xl p-3.5 leading-relaxed text-xs ${
                  msg.role === 'user'
                    ? 'bg-[#DC2626] text-white rounded-br-none shadow-xs'
                    : 'bg-white border border-[#E5E7EB] text-[#1F2937] rounded-bl-none shadow-xs whitespace-pre-wrap'
                }`}>
                  {msg.content}

                  {msg.citations && msg.citations.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-[#E5E7EB] text-[10px] text-[#DC2626] space-y-0.5">
                      <div className="text-[9px] font-bold uppercase tracking-wider text-[#4B5563]">Citations & Grounding:</div>
                      {msg.citations.map((c, cIdx) => (
                        <div key={cIdx} className="flex items-center gap-1 font-mono text-[10px]">
                          <span>•</span>
                          <span>{c}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="text-[9px] text-[#4B5563] mt-1 px-1">
                  {msg.timestamp}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="p-3 bg-white border border-[#E5E7EB] rounded-2xl rounded-bl-none text-[#4B5563] flex items-center gap-2 text-xs shadow-xs">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#DC2626]" />
                  <span>
                    {aiTutorMode === 'homework' 
                      ? 'Synthesizing pedagogical hints...' 
                      : aiTutorMode === 'review' 
                      ? 'Generating active retrieval drill...' 
                      : 'Consulting curriculum knowledge base...'}
                  </span>
                </div>
              </div>
            )}

            {/* Exam Mode Lock Card */}
            {aiTutorMode === 'exam' && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-[#1F2937] space-y-2 text-xs">
                <div className="flex items-center gap-2 text-[#DC2626] font-bold text-xs">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>Exam Proctoring Integrity Lock Active</span>
                </div>
                <p className="text-[11px] text-[#4B5563] leading-relaxed">
                  Real-time AI assistance is disabled during active assessments to maintain accreditation standards and verify unassisted student mastery.
                </p>
                <div className="pt-1 flex gap-2">
                  <button
                    onClick={() => setAiTutorMode('study')}
                    className="px-3 py-1.5 rounded-lg bg-[#DC2626] hover:bg-[#B91C1C] text-white text-[11px] font-semibold transition-colors cursor-pointer"
                  >
                    Switch to Study Mode
                  </button>
                  <button
                    onClick={() => setAiTutorMode('review')}
                    className="px-3 py-1.5 rounded-lg bg-white border border-[#E5E7EB] text-[#1F2937] text-[11px] font-semibold transition-colors cursor-pointer"
                  >
                    Review Drills
                  </button>
                </div>
              </div>
            )}

            <div ref={endRef} />
          </div>

          {/* Voice Transcription Status Banner */}
          {(isRecording || isTranscribing || transcriptionNotice) && (
            <div className={`px-3.5 py-1.5 text-[11px] font-medium flex items-center justify-between border-t border-[#E5E7EB] transition-colors ${
              isRecording 
                ? 'bg-red-50 text-[#DC2626] border-red-200' 
                : isTranscribing 
                ? 'bg-gray-100 text-[#1F2937] border-gray-200' 
                : 'bg-[#F9FAFB] text-[#4B5563]'
            }`}>
              <div className="flex items-center gap-2 truncate">
                {isRecording ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-[#DC2626] animate-ping"></span>
                    <Radio className="w-3.5 h-3.5 text-[#DC2626] shrink-0" />
                    <span className="font-semibold text-[#DC2626]">Recording mic... Speak now</span>
                  </>
                ) : isTranscribing ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 text-[#DC2626] animate-spin shrink-0" />
                    <span>Transcribing via <strong>gemini-3.5-transcribe</strong>...</span>
                  </>
                ) : (
                  <span>{transcriptionNotice}</span>
                )}
              </div>

              {isRecording && (
                <button
                  type="button"
                  onClick={handleToggleVoiceRecording}
                  className="px-2 py-0.5 rounded bg-[#DC2626] hover:bg-[#B91C1C] text-white font-bold text-[10px] uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Stop & Transcribe
                </button>
              )}
            </div>
          )}

          {/* Input Box */}
          <form onSubmit={handleSubmit} className="p-3 border-t border-[#E5E7EB] bg-white flex items-center gap-2">
            {aiTutorMode === 'exam' ? (
              <div className="flex-1 bg-[#F9FAFB] border border-red-200 rounded-xl px-3.5 py-2 text-xs text-[#DC2626] flex items-center gap-2 italic">
                <Lock className="w-3.5 h-3.5 shrink-0" />
                <span>AI Tutor input locked in Exam Mode</span>
              </div>
            ) : (
              <input 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  aiTutorMode === 'homework'
                    ? 'Ask for a hint on your code or assignment...'
                    : aiTutorMode === 'review'
                    ? 'Request a quick topic drill or flashcard...'
                    : 'Ask about concepts, algorithms, or speak with microphone...'
                }
                className="flex-1 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-3.5 py-2 text-xs text-[#1F2937] placeholder-gray-400 focus:outline-none focus:border-[#DC2626] transition-colors"
              />
            )}

            {/* Audio Microphone Input Button */}
            {aiTutorMode !== 'exam' && (
              <button
                type="button"
                onClick={handleToggleVoiceRecording}
                disabled={isTranscribing}
                className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                  isRecording
                    ? 'bg-[#DC2626] text-white shadow-md animate-pulse'
                    : isTranscribing
                    ? 'bg-gray-200 text-[#1F2937]'
                    : 'bg-[#F9FAFB] text-[#4B5563] hover:text-[#1F2937] hover:bg-gray-100 border border-[#E5E7EB]'
                }`}
                title={isRecording ? 'Click to stop and transcribe' : 'Record voice'}
                aria-label="Microphone Audio Input"
              >
                {isRecording ? (
                  <Square className="w-3.5 h-3.5 fill-current" />
                ) : isTranscribing ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#DC2626]" />
                ) : (
                  <Mic className="w-3.5 h-3.5 text-[#DC2626]" />
                )}
              </button>
            )}

            <button
              type="submit"
              disabled={isTyping || !input.trim() || aiTutorMode === 'exam' || isRecording}
              className="w-8 h-8 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] disabled:opacity-40 text-white flex items-center justify-center transition-colors shadow-xs shrink-0 cursor-pointer disabled:cursor-not-allowed"
              title={aiTutorMode === 'exam' ? 'Locked during exams' : 'Send message'}
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

        </div>
      )}
    </>
  );
};
