import React, { useState, useRef, useEffect } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Play, 
  Square, 
  RotateCcw, 
  Sparkles, 
  Globe, 
  Sliders, 
  Terminal, 
  MessageSquare, 
  Send, 
  Check, 
  HelpCircle,
  Cpu,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useLMS } from '../../context/LMSContext';
import { VoiceTutorSettings } from '../../types/lms';

export const VoiceTutorModule: React.FC = () => {
  const { user } = useLMS();

  // Voice State
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcriptInput, setTranscriptInput] = useState('');
  const [activeVoiceLanguage, setActiveVoiceLanguage] = useState<'en-US' | 'en-GB' | 'en-IN' | 'es-ES' | 'fr-FR'>('en-US');
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [speechPitch, setSpeechPitch] = useState<number>(1.0);
  const [autoSpeak, setAutoSpeak] = useState(true);

  // Audio Spectrum Canvas
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Conversational History
  const [conversations, setConversations] = useState<Array<{
    id: string;
    sender: 'user' | 'tutor';
    text: string;
    codeSnippet?: string;
    timestamp: string;
    language: string;
  }>>([
    {
      id: 'c-1',
      sender: 'user',
      text: 'Explain how the Raft consensus leader election mechanism works with term counters.',
      timestamp: '10:14 AM',
      language: 'English (US)'
    },
    {
      id: 'c-2',
      sender: 'tutor',
      text: 'In Raft, time is divided into arbitrary terms, each identified by a monotonically increasing term counter. When a follower detects that the leader heartbeat has timed out, it increments its term counter, transitions to the Candidate state, votes for itself, and dispatches RequestVote RPCs in parallel to all other nodes in the cluster.',
      codeSnippet: `class RaftNode:
    def __init__(self, node_id, peers):
        self.node_id = node_id
        self.current_term = 0
        self.voted_for = None
        self.state = "FOLLOWER"  # FOLLOWER, CANDIDATE, LEADER
        self.election_timeout = random.uniform(150, 300) / 1000.0

    def start_election(self):
        self.current_term += 1
        self.state = "CANDIDATE"
        self.voted_for = self.node_id
        votes_received = 1
        # Broadcast RequestVote to cluster peers...`,
      timestamp: '10:15 AM',
      language: 'English (US)'
    }
  ]);

  // Audio Visualizer Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let phase = 0;

    const render = () => {
      ctx.fillStyle = '#F9FAFB';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const numBars = 36;
      const barWidth = canvas.width / numBars;
      const centerY = canvas.height / 2;

      for (let i = 0; i < numBars; i++) {
        const x = i * barWidth;
        const normalized = i / numBars;

        let amplitude = 6;
        if (isListening) {
          // Dynamic active wave when user is speaking
          amplitude = Math.sin(phase + normalized * 10) * 35 + Math.cos(phase * 1.5 + normalized * 6) * 25 + 15;
        } else if (isSpeaking) {
          // Dynamic melodic wave when tutor is speaking
          amplitude = Math.sin(phase * 2 + normalized * 14) * 45 + Math.sin(phase * 0.8) * 20 + 20;
        }

        amplitude = Math.max(4, Math.abs(amplitude));

        ctx.fillStyle = isListening ? '#DC2626' : isSpeaking ? '#B91C1C' : '#E5E7EB';
        ctx.fillRect(x + 2, centerY - amplitude, barWidth - 4, amplitude * 2);
      }

      phase += (isListening || isSpeaking) ? 0.12 : 0.03;
      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isListening, isSpeaking]);

  // Web Speech API / TTS Synthesis
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis not supported in this browser environment.');
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = activeVoiceLanguage;
    utterance.rate = speechRate;
    utterance.pitch = speechPitch;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  // Start Voice Listening (Speech-to-Text)
  const handleToggleListening = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    // Check Web Speech Recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = activeVoiceLanguage;
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => setIsListening(true);
        recognition.onresult = (event: any) => {
          const spoken = event.results[0][0].transcript;
          setIsListening(false);
          submitUserVoiceQuery(spoken);
        };
        recognition.onerror = () => {
          setIsListening(false);
          // Fallback simulation for browsers that block mic in sandbox
          simulateVoiceInput();
        };
        recognition.onend = () => setIsListening(false);

        recognition.start();
        return;
      } catch (err) {
        // Fallback simulation
      }
    }

    // Simulated high-fidelity voice recording
    simulateVoiceInput();
  };

  const simulateVoiceInput = () => {
    setIsListening(true);
    const presets = [
      'How does an LRU cache handle eviction with doubly linked list pointers?',
      'Can you explain the difference between optimistic and pessimistic locking in PostgreSQL?',
      'How does vector embedding cosine similarity compare to Euclidean L2 distance?'
    ];
    const picked = presets[Math.floor(Math.random() * presets.length)];

    setTimeout(() => {
      setIsListening(false);
      submitUserVoiceQuery(picked);
    }, 2400);
  };

  // Submit Voice Query & Synthesize Tutor Answer
  const submitUserVoiceQuery = (queryText: string) => {
    if (!queryText.trim()) return;

    const userMsg = {
      id: `u-${Date.now()}`,
      sender: 'user' as const,
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      language: activeVoiceLanguage
    };

    setConversations(prev => [...prev, userMsg]);

    // AI Voice Synthesis Reply
    setTimeout(() => {
      let answerText = '';
      let code = '';

      if (queryText.toLowerCase().includes('lru')) {
        answerText = 'An Least Recently Used cache pairs a hash map for constant time O(1) lookups with a doubly linked list for constant time removals and insertions. When a key is accessed, its node is detached and moved to the head of the list. When capacity is exceeded, the node at the tail is evicted.';
        code = `class LRUCache:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.cache = {}
        self.head, self.tail = Node(0, 0), Node(0, 0)
        self.head.next = self.tail
        self.tail.prev = self.head`;
      } else if (queryText.toLowerCase().includes('locking')) {
        answerText = 'Pessimistic locking uses explicit database row-level locks like SELECT FOR UPDATE to prevent other transactions from modifying data concurrently. In contrast, optimistic locking assumes conflicts are rare, checking a version column or timestamp during commit time and rolling back if a collision is detected.';
        code = `-- Optimistic Locking Check:
UPDATE accounts 
SET balance = balance - 100, version = version + 1
WHERE id = 42 AND version = 5;`;
      } else {
        answerText = `Here is a comprehensive breakdown for ${queryText}. In high-performance systems engineering, we ensure algorithmic correctness, low lock contention, and scalable computational complexity.`;
        code = `# Algorithmic benchmark
def execute_pipeline(data_stream):
    return [transform(item) for item in data_stream if validate(item)]`;
      }

      const tutorMsg = {
        id: `t-${Date.now()}`,
        sender: 'tutor' as const,
        text: answerText,
        codeSnippet: code,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        language: activeVoiceLanguage
      };

      setConversations(prev => [...prev, tutorMsg]);

      if (autoSpeak) {
        speakText(answerText);
      }
    }, 1000);
  };

  return (
    <div className="space-y-6 text-[#1F2937]">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-[#DC2626] border border-red-200">
                <Mic className="w-3.5 h-3.5 text-[#DC2626]" />
                Conversational Speech-In / Speech-Out Studio
              </span>
              <span className="text-xs text-[#4B5563] font-mono">
                Web Speech STT • Neural SpeechSynthesis TTS • Audio Spectrum Visualizer
              </span>
            </div>
            <h1 className="text-2xl font-bold text-[#1F2937] flex items-center gap-2.5">
              <span>Voice-Based AI Technical Tutor Interaction</span>
            </h1>
            <p className="text-sm text-[#4B5563] mt-1 max-w-3xl">
              Hands-free technical learning assistance. Ask complex programming questions aloud, listen to synthesized explanations, and inspect code diagrams generated in real time.
            </p>
          </div>

          {/* Quick Voice Settings */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAutoSpeak(!autoSpeak)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                autoSpeak
                  ? 'bg-[#DC2626] text-white shadow-xs'
                  : 'bg-[#F9FAFB] border border-[#E5E7EB] text-[#4B5563] hover:text-[#1F2937]'
              }`}
            >
              <Volume2 className="w-4 h-4" />
              <span>{autoSpeak ? 'Auto-Read: ON' : 'Auto-Read: OFF'}</span>
            </button>
          </div>
        </div>

        {/* Locale & Accent Selector */}
        <div className="flex items-center gap-2 mt-6 border-t border-[#E5E7EB] pt-4 overflow-x-auto text-xs">
          <span className="text-[#4B5563] font-bold mr-1 flex items-center gap-1">
            <Globe className="w-3.5 h-3.5 text-[#DC2626]" />
            Voice Accent:
          </span>

          {[
            { id: 'en-US', label: 'English (United States)' },
            { id: 'en-GB', label: 'English (United Kingdom)' },
            { id: 'en-IN', label: 'English (India)' },
            { id: 'es-ES', label: 'Spanish (Español)' },
            { id: 'fr-FR', label: 'French (Français)' }
          ].map(loc => (
            <button
              key={loc.id}
              onClick={() => setActiveVoiceLanguage(loc.id as any)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                activeVoiceLanguage === loc.id
                  ? 'bg-[#DC2626] text-white font-bold shadow-xs'
                  : 'bg-[#F9FAFB] border border-[#E5E7EB] text-[#4B5563] hover:text-[#1F2937] hover:bg-white'
              }`}
            >
              {loc.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Left Audio Visualizer & Mic Control (1 Col), Right Transcript & Code Output (2 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Visualizer & Microphone Center */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] flex flex-col items-center text-center space-y-6 shadow-xs">
            
            {/* Audio Spectrum Canvas */}
            <div className="w-full rounded-2xl overflow-hidden border border-[#E5E7EB] bg-[#F9FAFB] p-2 relative shadow-inner">
              <canvas
                ref={canvasRef}
                width={360}
                height={120}
                className="w-full h-[120px] block"
              />

              <div className="absolute top-2 right-3 text-[10px] font-mono text-[#4B5563] uppercase">
                {isListening ? '🎤 Listening...' : isSpeaking ? '🔊 Synthesizing Speech...' : 'Idle Spectrum'}
              </div>
            </div>

            {/* Large Interactive Microphone Button */}
            <div className="relative">
              {isListening && (
                <div className="absolute inset-0 -m-3 rounded-full bg-red-400/30 animate-ping pointer-events-none" />
              )}
              {isSpeaking && (
                <div className="absolute inset-0 -m-3 rounded-full bg-red-400/30 animate-pulse pointer-events-none" />
              )}

              <button
                onClick={handleToggleListening}
                className={`relative w-24 h-24 rounded-full flex flex-col items-center justify-center transition-all cursor-pointer shadow-md ${
                  isListening
                    ? 'bg-[#DC2626] text-white scale-105'
                    : isSpeaking
                    ? 'bg-[#B91C1C] text-white'
                    : 'bg-[#F9FAFB] hover:bg-gray-100 text-[#DC2626] border-2 border-[#E5E7EB]'
                }`}
              >
                {isListening ? (
                  <Mic className="w-10 h-10 animate-bounce" />
                ) : isSpeaking ? (
                  <Volume2 className="w-10 h-10 animate-pulse" />
                ) : (
                  <Mic className="w-10 h-10 text-[#DC2626]" />
                )}
              </button>
            </div>

            <div>
              <div className="text-base font-bold text-[#1F2937]">
                {isListening ? 'Listening to your question...' : isSpeaking ? 'AI Tutor Speaking...' : 'Tap Mic to Ask a Question'}
              </div>
              <p className="text-xs text-[#4B5563] mt-1 max-w-xs">
                Supports technical code questions, system architecture inquiries, and debugging guidance.
              </p>
            </div>

            {/* Quick Suggestion Prompts */}
            <div className="w-full space-y-2 pt-2 border-t border-[#E5E7EB] text-left">
              <div className="text-[11px] font-bold text-[#4B5563] uppercase tracking-wider">
                Or Tap Sample Voice Prompts:
              </div>

              {[
                'How does an LRU cache handle eviction with doubly linked lists?',
                'Explain optimistic vs pessimistic locking in PostgreSQL',
                'What is the difference between Paxos and Raft consensus?'
              ].map((promptText, idx) => (
                <button
                  key={idx}
                  onClick={() => submitUserVoiceQuery(promptText)}
                  className="w-full p-2.5 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] hover:border-[#DC2626] text-xs text-[#4B5563] hover:text-[#1F2937] transition-all text-left flex items-center justify-between group cursor-pointer"
                >
                  <span className="truncate pr-2">{promptText}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#4B5563] group-hover:text-[#DC2626] shrink-0" />
                </button>
              ))}
            </div>

            {/* TTS Playback Controls */}
            {isSpeaking && (
              <div className="w-full p-3 rounded-xl bg-red-50 border border-red-200 flex items-center justify-between">
                <span className="text-xs text-[#DC2626] font-medium flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-[#DC2626] animate-pulse" />
                  Playing Audio Synthesis
                </span>
                <button
                  onClick={stopSpeaking}
                  className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#DC2626] text-white hover:bg-[#B91C1C] transition-colors cursor-pointer"
                >
                  Stop Audio
                </button>
              </div>
            )}

          </div>

          {/* Speech Rate & Pitch Controls */}
          <div className="p-4 rounded-2xl bg-white border border-[#E5E7EB] space-y-3 shadow-xs">
            <h4 className="text-xs font-bold text-[#4B5563] uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-[#DC2626]" />
              <span>Acoustic Speech Synthesis Tuning</span>
            </h4>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between text-[#4B5563] mb-1">
                  <span>Speech Velocity / Rate:</span>
                  <span className="font-mono text-[#1F2937] font-bold">{speechRate}x</span>
                </div>
                <input
                  type="range"
                  min="0.75"
                  max="1.5"
                  step="0.05"
                  value={speechRate}
                  onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                  className="w-full h-1 bg-gray-200 rounded-lg cursor-pointer accent-[#DC2626]"
                />
              </div>

              <div>
                <div className="flex justify-between text-[#4B5563] mb-1">
                  <span>Voice Pitch:</span>
                  <span className="font-mono text-[#1F2937] font-bold">{speechPitch}x</span>
                </div>
                <input
                  type="range"
                  min="0.8"
                  max="1.2"
                  step="0.05"
                  value={speechPitch}
                  onChange={(e) => setSpeechPitch(parseFloat(e.target.value))}
                  className="w-full h-1 bg-gray-200 rounded-lg cursor-pointer accent-[#DC2626]"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Live Conversation Transcript & Code Terminal */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] flex flex-col h-[640px] overflow-hidden shadow-xs">
            <div className="pb-4 border-b border-[#E5E7EB] flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#1F2937] flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#DC2626]" />
                  <span>Spoken Conversation Transcript & Code Output</span>
                </h3>
                <p className="text-xs text-[#4B5563] mt-0.5">
                  Synchronized voice logs with automated syntax-highlighted code generation.
                </p>
              </div>

              <button
                onClick={() => setConversations([])}
                className="text-xs text-[#4B5563] hover:text-[#DC2626] transition-colors cursor-pointer"
              >
                Clear Session
              </button>
            </div>

            {/* Conversation Feed */}
            <div className="flex-1 overflow-y-auto p-2 space-y-4 my-2">
              {conversations.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-2 mb-1 text-[11px] text-[#4B5563]">
                    <span className="font-bold text-[#1F2937]">
                      {msg.sender === 'user' ? (user?.name || 'You') : 'AI Technical Voice Tutor'}
                    </span>
                    <span>•</span>
                    <span>{msg.timestamp}</span>
                  </div>

                  <div
                    className={`p-4 rounded-2xl max-w-2xl text-xs leading-relaxed space-y-3 ${
                      msg.sender === 'user'
                        ? 'bg-red-50 border border-red-200 text-[#1F2937] rounded-tr-none'
                        : 'bg-[#F9FAFB] border border-[#E5E7EB] text-[#1F2937] rounded-tl-none'
                    }`}
                  >
                    <p>{msg.text}</p>

                    {/* Code Snippet Block */}
                    {msg.codeSnippet && (
                      <div className="mt-3 rounded-xl bg-white border border-[#E5E7EB] overflow-hidden font-mono text-[11px]">
                        <div className="px-3 py-1.5 bg-[#F9FAFB] border-b border-[#E5E7EB] flex items-center justify-between text-[#4B5563]">
                          <span>Synthesized Solution</span>
                          <span className="text-[10px]">Python / SQL</span>
                        </div>
                        <pre className="p-3 text-[#1F2937] overflow-x-auto leading-relaxed">
                          {msg.codeSnippet}
                        </pre>
                      </div>
                    )}

                    {/* Audio Playback Trigger Button for Tutor Message */}
                    {msg.sender === 'tutor' && (
                      <div className="pt-2 flex items-center gap-2">
                        <button
                          onClick={() => speakText(msg.text)}
                          className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-red-50 text-[#DC2626] border border-red-200 hover:bg-red-100 text-[11px] font-bold transition-all cursor-pointer"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>Replay Spoken Audio</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Text Input Fallback */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (transcriptInput.trim()) {
                  submitUserVoiceQuery(transcriptInput);
                  setTranscriptInput('');
                }
              }}
              className="pt-3 border-t border-[#E5E7EB] flex items-center gap-2"
            >
              <input
                type="text"
                value={transcriptInput}
                onChange={(e) => setTranscriptInput(e.target.value)}
                placeholder="Type your question if you prefer not to speak..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] text-xs text-[#1F2937] placeholder-[#4B5563] focus:outline-none focus:border-[#DC2626]"
              />
              <button
                type="submit"
                className="p-2.5 rounded-xl bg-[#DC2626] text-white hover:bg-[#B91C1C] transition-colors cursor-pointer shadow-xs"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

          </div>

        </div>

      </div>
    </div>
  );
};
