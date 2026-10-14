import React, { useState, useRef, useEffect } from 'react';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Monitor, 
  Hand, 
  MessageSquare, 
  Users, 
  Grid, 
  PenTool, 
  Sparkles, 
  Share2, 
  RotateCcw, 
  Download, 
  Eraser, 
  Square, 
  Circle, 
  Minus, 
  Type, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  PhoneOff, 
  ShieldCheck,
  Radio,
  Sliders,
  ChevronRight
} from 'lucide-react';
import { useLMS } from '../../context/LMSContext';
import { StudyRoomParticipant, BreakoutPod, WhiteboardElement } from '../../types/lms';

export const StudyRoomsModule: React.FC = () => {
  const { user, courses } = useLMS();

  // Active Room State
  const [activeTab, setActiveTab] = useState<'video' | 'whiteboard' | 'pods' | 'chat'>('video');
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [activeSpeakerId, setActiveSpeakerId] = useState<string>('part-1');
  const [selectedPodId, setSelectedPodId] = useState<string | null>(null);

  // Whiteboard Canvas State
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [tool, setTool] = useState<'pencil' | 'rect' | 'circle' | 'line' | 'eraser' | 'text'>('pencil');
  const [strokeColor, setStrokeColor] = useState<string>('#6366f1'); // Indigo
  const [strokeWidth, setStrokeWidth] = useState<number>(3);
  const [isDrawing, setIsDrawing] = useState(false);
  const [elements, setElements] = useState<WhiteboardElement[]>([]);
  const [history, setHistory] = useState<WhiteboardElement[][]>([]);

  // Room Chat State
  const [chatMessages, setChatMessages] = useState<Array<{
    id: string;
    senderName: string;
    senderRole: string;
    avatar: string;
    text: string;
    timestamp: string;
    isSystem?: boolean;
  }>>([
    {
      id: 'm1',
      senderName: 'Prof. Rohit Verma',
      senderRole: 'INSTRUCTOR',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      text: 'Welcome everyone! Today we are live streaming distributed consensus algorithms and sketching the Raft leader election state machine on the whiteboard.',
      timestamp: '10:02 AM'
    },
    {
      id: 'm2',
      senderName: 'Aarav Sharma',
      senderRole: 'STUDENT',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
      text: 'Question regarding log replication: what happens during network partition?',
      timestamp: '10:05 AM'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');

  // Participants Mock Data
  const [participants, setParticipants] = useState<StudyRoomParticipant[]>([
    {
      id: 'part-1',
      name: user?.name || 'Current User',
      role: user?.role || 'STUDENT',
      avatar: user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      isMuted: false,
      isVideoOn: true,
      isHandRaised: false,
      isScreenSharing: false,
      joinedAt: '10:00 AM'
    },
    {
      id: 'part-2',
      name: 'Prof. Rohit Verma',
      role: 'INSTRUCTOR',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      isMuted: false,
      isVideoOn: true,
      isHandRaised: false,
      isScreenSharing: false,
      joinedAt: '09:55 AM'
    },
    {
      id: 'part-3',
      name: 'Ananya Deshmukh',
      role: 'STUDENT',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      isMuted: true,
      isVideoOn: true,
      isHandRaised: true,
      isScreenSharing: false,
      joinedAt: '10:01 AM'
    },
    {
      id: 'part-4',
      name: 'Rohan Mehta',
      role: 'STUDENT',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      isMuted: true,
      isVideoOn: false,
      isHandRaised: false,
      isScreenSharing: false,
      joinedAt: '10:03 AM'
    },
    {
      id: 'part-5',
      name: 'Priya Iyer',
      role: 'STUDENT',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
      isMuted: false,
      isVideoOn: true,
      isHandRaised: false,
      isScreenSharing: false,
      joinedAt: '10:04 AM'
    },
    {
      id: 'part-6',
      name: 'Devansh Rao',
      role: 'STUDENT',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      isMuted: true,
      isVideoOn: true,
      isHandRaised: false,
      isScreenSharing: false,
      joinedAt: '10:06 AM'
    }
  ]);

  // Breakout Pods
  const [breakoutPods, setBreakoutPods] = useState<BreakoutPod[]>([
    {
      id: 'pod-1',
      name: 'Pod Alpha: Raft & Paxos Simulation',
      topic: 'Consensus Quorum & Heartbeat Implementation',
      participantIds: ['part-1', 'part-3'],
      maxCapacity: 4
    },
    {
      id: 'pod-2',
      name: 'Pod Beta: Vector Embeddings & RAG',
      topic: 'HNSW Indexing & Cosine Distance Benchmarking',
      participantIds: ['part-4', 'part-5'],
      maxCapacity: 4
    },
    {
      id: 'pod-3',
      name: 'Pod Gamma: Compiler AST Transformations',
      topic: 'Code Similarity Tree Isomorphism & Babel AST',
      participantIds: ['part-6'],
      maxCapacity: 4
    }
  ]);

  // Draw Whiteboard
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear
    ctx.fillStyle = '#0f172a'; // Slate-900 background
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Grid Pattern
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    const gridSize = 30;
    for (let x = 0; x < canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw Elements
    elements.forEach(elem => {
      ctx.strokeStyle = elem.color;
      ctx.fillStyle = elem.color;
      ctx.lineWidth = elem.strokeWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (elem.type === 'pencil' && elem.points && elem.points.length > 1) {
        ctx.beginPath();
        ctx.moveTo(elem.points[0].x, elem.points[0].y);
        for (let i = 1; i < elem.points.length; i++) {
          ctx.lineTo(elem.points[i].x, elem.points[i].y);
        }
        ctx.stroke();
      } else if (elem.type === 'rect' && elem.x !== undefined && elem.y !== undefined && elem.width && elem.height) {
        ctx.strokeRect(elem.x, elem.y, elem.width, elem.height);
      } else if (elem.type === 'circle' && elem.x !== undefined && elem.y !== undefined && elem.width) {
        ctx.beginPath();
        ctx.arc(elem.x, elem.y, Math.abs(elem.width / 2), 0, Math.PI * 2);
        ctx.stroke();
      } else if (elem.type === 'line' && elem.points && elem.points.length === 2) {
        ctx.beginPath();
        ctx.moveTo(elem.points[0].x, elem.points[0].y);
        ctx.lineTo(elem.points[1].x, elem.points[1].y);
        ctx.stroke();
      } else if (elem.type === 'text' && elem.x !== undefined && elem.y !== undefined && elem.text) {
        ctx.font = '16px monospace';
        ctx.fillText(elem.text, elem.x, elem.y);
      }
    });
  }, [elements, activeTab]);

  // Audio indicator simulation
  useEffect(() => {
    const interval = setInterval(() => {
      const candidates = ['part-1', 'part-2', 'part-5'];
      const nextSpeaker = candidates[Math.floor(Math.random() * candidates.length)];
      setActiveSpeakerId(nextSpeaker);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  // Canvas Mouse Handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (activeTab !== 'whiteboard') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);

    if (tool === 'pencil' || tool === 'eraser') {
      const newElem: WhiteboardElement = {
        id: `elem-${Date.now()}`,
        type: 'pencil',
        points: [{ x, y }],
        color: tool === 'eraser' ? '#0f172a' : strokeColor,
        strokeWidth: tool === 'eraser' ? 24 : strokeWidth
      };
      setElements(prev => [...prev, newElem]);
    } else if (tool === 'rect') {
      const newElem: WhiteboardElement = {
        id: `elem-${Date.now()}`,
        type: 'rect',
        x,
        y,
        width: 1,
        height: 1,
        color: strokeColor,
        strokeWidth
      };
      setElements(prev => [...prev, newElem]);
    } else if (tool === 'circle') {
      const newElem: WhiteboardElement = {
        id: `elem-${Date.now()}`,
        type: 'circle',
        x,
        y,
        width: 1,
        height: 1,
        color: strokeColor,
        strokeWidth
      };
      setElements(prev => [...prev, newElem]);
    } else if (tool === 'text') {
      const text = prompt('Enter annotation text:') || '';
      if (text) {
        setElements(prev => [
          ...prev,
          {
            id: `elem-${Date.now()}`,
            type: 'text',
            x,
            y,
            text,
            color: strokeColor,
            strokeWidth
          }
        ]);
      }
      setIsDrawing(false);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || activeTab !== 'whiteboard') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setElements(prev => {
      if (prev.length === 0) return prev;
      const last = prev[prev.length - 1];
      if (last.type === 'pencil' && last.points) {
        return [
          ...prev.slice(0, -1),
          { ...last, points: [...last.points, { x, y }] }
        ];
      } else if (last.type === 'rect' && last.x !== undefined && last.y !== undefined) {
        return [
          ...prev.slice(0, -1),
          { ...last, width: x - last.x, height: y - last.y }
        ];
      } else if (last.type === 'circle' && last.x !== undefined && last.y !== undefined) {
        const radius = Math.sqrt(Math.pow(x - last.x, 2) + Math.pow(y - last.y, 2));
        return [
          ...prev.slice(0, -1),
          { ...last, width: radius * 2, height: radius * 2 }
        ];
      }
      return prev;
    });
  };

  const handleMouseUp = () => {
    if (isDrawing) {
      setIsDrawing(false);
      setHistory(prev => [...prev, [...elements]]);
    }
  };

  const handleUndo = () => {
    if (elements.length === 0) return;
    setElements(prev => prev.slice(0, -1));
  };

  const handleClearWhiteboard = () => {
    setHistory(prev => [...prev, [...elements]]);
    setElements([]);
  };

  const handleExportPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `VertexLearn-Whiteboard-${Date.now()}.png`;
    a.click();
  };

  // Chat send
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setChatMessages(prev => [
      ...prev,
      {
        id: `msg-${Date.now()}`,
        senderName: user?.name || 'You',
        senderRole: user?.role || 'STUDENT',
        avatar: user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
        text: newMessage.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setNewMessage('');
  };

  return (
    <div className="space-y-6 text-[#1F2937]">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-600" />
                Live WebRTC Room Active
              </span>
              <span className="text-xs text-[#4B5563] font-mono">
                Room #VL-CONF-8092 • SFU Mesh Mode
              </span>
            </div>
            <h1 className="text-2xl font-bold text-[#1F2937] flex items-center gap-2.5">
              <span>Real-Time Collaborative Study Room & Virtual Classroom</span>
            </h1>
            <p className="text-sm text-[#4B5563] mt-1 max-w-3xl">
              Peer-to-peer audio/video streaming, synchronized interactive whiteboard canvas, automated breakout pods, and integrated cohort chat for live lecture and code collaboration.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {participants.slice(0, 4).map(p => (
                <img
                  key={p.id}
                  src={p.avatar}
                  alt={p.name}
                  className="w-9 h-9 rounded-full border-2 border-white object-cover shadow-xs"
                  title={p.name}
                />
              ))}
              {participants.length > 4 && (
                <div className="w-9 h-9 rounded-full border-2 border-white bg-[#F9FAFB] text-[#4B5563] text-xs font-bold flex items-center justify-center">
                  +{participants.length - 4}
                </div>
              )}
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-[#1F2937]">{participants.length} Active Peers</div>
              <div className="text-[11px] text-emerald-600 flex items-center gap-1 justify-end font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                24ms Ping
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 mt-6 border-t border-[#E5E7EB] pt-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab('video')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'video'
                ? 'bg-[#DC2626] text-white shadow-xs'
                : 'bg-[#F9FAFB] text-[#4B5563] border border-[#E5E7EB] hover:text-[#1F2937] hover:bg-white'
            }`}
          >
            <Grid className="w-4 h-4" />
            <span>Video Conference Grid ({participants.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('whiteboard')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'whiteboard'
                ? 'bg-[#DC2626] text-white shadow-xs'
                : 'bg-[#F9FAFB] text-[#4B5563] border border-[#E5E7EB] hover:text-[#1F2937] hover:bg-white'
            }`}
          >
            <PenTool className="w-4 h-4" />
            <span>Synchronized Whiteboard ({elements.length} strokes)</span>
          </button>

          <button
            onClick={() => setActiveTab('pods')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'pods'
                ? 'bg-[#DC2626] text-white shadow-xs'
                : 'bg-[#F9FAFB] text-[#4B5563] border border-[#E5E7EB] hover:text-[#1F2937] hover:bg-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Breakout Pods ({breakoutPods.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'chat'
                ? 'bg-[#DC2626] text-white shadow-xs'
                : 'bg-[#F9FAFB] text-[#4B5563] border border-[#E5E7EB] hover:text-[#1F2937] hover:bg-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Study Chat ({chatMessages.length})</span>
          </button>
        </div>
      </div>

      {/* Main Viewport Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left / Center 3 Columns: Active Feature */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* TAB 1: VIDEO CONFERENCING GRID */}
          {activeTab === 'video' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {participants.map((p) => {
                  const isSpeaking = activeSpeakerId === p.id;
                  const isCurrentUser = p.id === 'part-1';

                  return (
                    <div
                      key={p.id}
                      className={`relative aspect-video rounded-2xl overflow-hidden bg-[#F9FAFB] border transition-all ${
                        isSpeaking
                          ? 'border-[#DC2626] ring-2 ring-[#DC2626]/20 shadow-md'
                          : 'border-[#E5E7EB] hover:border-gray-300'
                      }`}
                    >
                      {/* Video Stream or Avatar Placeholder */}
                      {p.isVideoOn ? (
                        <div className="relative w-full h-full">
                          <img
                            src={p.avatar}
                            alt={p.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-x-0 bottom-0 h-14 bg-black/60" />
                        </div>
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-[#F9FAFB] p-4">
                          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-[#1F2937] text-xl font-bold border border-[#E5E7EB] shadow-xs">
                            {p.name.charAt(0)}
                          </div>
                          <span className="text-xs text-[#4B5563] mt-2 font-medium">Camera Disabled</span>
                        </div>
                      )}

                      {/* Participant Top Overlay */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 shadow-xs ${
                          p.role === 'INSTRUCTOR'
                            ? 'bg-[#DC2626] text-white'
                            : 'bg-white/90 text-[#1F2937] border border-[#E5E7EB]'
                        }`}>
                          {p.role === 'INSTRUCTOR' ? 'Host / Instructor' : 'Cohort Student'}
                        </span>

                        {p.isHandRaised && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500 text-white font-bold flex items-center gap-1 animate-bounce shadow-xs">
                            <Hand className="w-3 h-3" />
                            Hand Raised
                          </span>
                        )}
                      </div>

                      {/* Participant Bottom Bar */}
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                        <div className="flex items-center gap-2 truncate">
                          <span className="text-xs font-bold truncate drop-shadow">
                            {p.name} {isCurrentUser && '(You)'}
                          </span>
                          {isSpeaking && (
                            <span className="text-[10px] text-emerald-300 font-mono font-bold flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                              Speaking
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span className={`p-1 rounded-md text-xs ${p.isMuted ? 'bg-[#DC2626] text-white' : 'bg-black/60 text-emerald-400'}`}>
                            {p.isMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                          </span>
                          <span className={`p-1 rounded-md text-xs ${!p.isVideoOn ? 'bg-[#DC2626] text-white' : 'bg-black/60 text-white'}`}>
                            {!p.isVideoOn ? <VideoOff className="w-3.5 h-3.5" /> : <Video className="w-3.5 h-3.5" />}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* In-Call Controls Bar */}
              <div className="p-4 rounded-2xl bg-white border border-[#E5E7EB] flex flex-wrap items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setIsMuted(!isMuted);
                      setParticipants(prev => prev.map(p => p.id === 'part-1' ? { ...p, isMuted: !isMuted } : p));
                    }}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isMuted ? 'bg-[#DC2626] text-white' : 'bg-[#F9FAFB] text-[#1F2937] border border-[#E5E7EB] hover:bg-gray-100'
                    }`}
                  >
                    {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-emerald-600" />}
                    <span>{isMuted ? 'Unmute Mic' : 'Mute Mic'}</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsVideoOn(!isVideoOn);
                      setParticipants(prev => prev.map(p => p.id === 'part-1' ? { ...p, isVideoOn: !isVideoOn } : p));
                    }}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      !isVideoOn ? 'bg-[#DC2626] text-white' : 'bg-[#F9FAFB] text-[#1F2937] border border-[#E5E7EB] hover:bg-gray-100'
                    }`}
                  >
                    {!isVideoOn ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4 text-[#DC2626]" />}
                    <span>{isVideoOn ? 'Turn Off Video' : 'Turn On Video'}</span>
                  </button>

                  <button
                    onClick={() => setIsScreenSharing(!isScreenSharing)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isScreenSharing ? 'bg-[#1F2937] text-white' : 'bg-[#F9FAFB] text-[#1F2937] border border-[#E5E7EB] hover:bg-gray-100'
                    }`}
                  >
                    <Monitor className="w-4 h-4 text-[#4B5563]" />
                    <span>{isScreenSharing ? 'Stop Screen Share' : 'Share Screen'}</span>
                  </button>

                  <button
                    onClick={() => {
                      const next = !isHandRaised;
                      setIsHandRaised(next);
                      setParticipants(prev => prev.map(p => p.id === 'part-1' ? { ...p, isHandRaised: next } : p));
                    }}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isHandRaised ? 'bg-amber-600 text-white animate-pulse' : 'bg-[#F9FAFB] text-[#1F2937] border border-[#E5E7EB] hover:bg-gray-100'
                    }`}
                  >
                    <Hand className="w-4 h-4 text-amber-500" />
                    <span>{isHandRaised ? 'Lower Hand' : 'Raise Hand'}</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('whiteboard')}
                    className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold bg-[#F9FAFB] text-[#1F2937] border border-[#E5E7EB] hover:bg-white hover:border-[#DC2626] transition-all cursor-pointer"
                  >
                    <PenTool className="w-4 h-4 text-[#DC2626]" />
                    <span>Switch to Whiteboard</span>
                  </button>

                  <button
                    onClick={() => alert('Leaving study room session...')}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#DC2626] text-white hover:bg-[#B91C1C] transition-all cursor-pointer shadow-xs"
                  >
                    <PhoneOff className="w-4 h-4" />
                    <span>Leave Call</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SYNCHRONIZED INTERACTIVE WHITEBOARD */}
          {activeTab === 'whiteboard' && (
            <div className="space-y-4">
              {/* Whiteboard Toolbar */}
              <div className="p-3.5 rounded-2xl bg-white border border-[#E5E7EB] flex flex-wrap items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setTool('pencil')}
                    className={`p-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                      tool === 'pencil' ? 'bg-[#DC2626] text-white' : 'text-[#4B5563] hover:bg-[#F9FAFB] hover:text-[#1F2937]'
                    }`}
                    title="Freehand Pencil"
                  >
                    <PenTool className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setTool('rect')}
                    className={`p-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                      tool === 'rect' ? 'bg-[#DC2626] text-white' : 'text-[#4B5563] hover:bg-[#F9FAFB] hover:text-[#1F2937]'
                    }`}
                    title="Rectangle / Box"
                  >
                    <Square className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setTool('circle')}
                    className={`p-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                      tool === 'circle' ? 'bg-[#DC2626] text-white' : 'text-[#4B5563] hover:bg-[#F9FAFB] hover:text-[#1F2937]'
                    }`}
                    title="Circle / Node"
                  >
                    <Circle className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setTool('text')}
                    className={`p-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                      tool === 'text' ? 'bg-[#DC2626] text-white' : 'text-[#4B5563] hover:bg-[#F9FAFB] hover:text-[#1F2937]'
                    }`}
                    title="Add Text Label"
                  >
                    <Type className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setTool('eraser')}
                    className={`p-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                      tool === 'eraser' ? 'bg-[#DC2626] text-white' : 'text-[#4B5563] hover:bg-[#F9FAFB] hover:text-[#1F2937]'
                    }`}
                    title="Eraser"
                  >
                    <Eraser className="w-4 h-4" />
                  </button>

                  <div className="h-6 w-px bg-[#E5E7EB] mx-1" />

                  {/* Color Swatches */}
                  {['#DC2626', '#1F2937', '#4B5563', '#10b981', '#f59e0b', '#2563eb'].map((color) => (
                    <button
                      key={color}
                      onClick={() => setStrokeColor(color)}
                      className={`w-6 h-6 rounded-full border-2 transition-transform cursor-pointer ${
                        strokeColor === color ? 'scale-125 border-[#1F2937]' : 'border-transparent hover:scale-110'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}

                  <div className="h-6 w-px bg-[#E5E7EB] mx-1" />

                  {/* Stroke Width Slider */}
                  <div className="flex items-center gap-2 text-xs text-[#4B5563]">
                    <span className="text-[10px] font-mono">Width: {strokeWidth}px</span>
                    <input
                      type="range"
                      min={1}
                      max={12}
                      value={strokeWidth}
                      onChange={(e) => setStrokeWidth(Number(e.target.value))}
                      className="w-16 h-1 bg-gray-200 rounded-lg cursor-pointer accent-[#DC2626]"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleUndo}
                    className="p-2 rounded-xl text-xs text-[#4B5563] bg-[#F9FAFB] border border-[#E5E7EB] hover:bg-gray-100 transition-colors cursor-pointer"
                    title="Undo Stroke"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleClearWhiteboard}
                    className="px-3 py-1.5 rounded-xl text-xs text-[#DC2626] bg-red-50 border border-red-200 hover:bg-red-100 transition-colors cursor-pointer"
                  >
                    Clear Canvas
                  </button>

                  <button
                    onClick={handleExportPNG}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-[#DC2626] hover:bg-[#B91C1C] transition-colors cursor-pointer shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export PNG</span>
                  </button>
                </div>
              </div>

              {/* HTML5 Canvas Element */}
              <div className="rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-xs relative bg-white">
                <canvas
                  ref={canvasRef}
                  width={900}
                  height={520}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  className="w-full h-[520px] cursor-crosshair block bg-white"
                />

                {/* Whiteboard Floating Status */}
                <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#E5E7EB] text-[11px] text-[#4B5563] flex items-center gap-2 shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Canvas synchronized with 6 cohort participants</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: BREAKOUT PODS */}
          {activeTab === 'pods' && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-[#1F2937]">Cohort Breakout Pods</h3>
                    <p className="text-xs text-[#4B5563] mt-0.5">
                      Sub-divided virtual study pods for focused algorithm pairing and hands-on coding challenges.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const name = prompt('Enter Pod Name:');
                      const topic = prompt('Enter Pod Topic:');
                      if (name && topic) {
                        setBreakoutPods(prev => [
                          ...prev,
                          {
                            id: `pod-${Date.now()}`,
                            name,
                            topic,
                            participantIds: [],
                            maxCapacity: 4
                          }
                        ]);
                      }
                    }}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#DC2626] text-white hover:bg-[#B91C1C] transition-colors cursor-pointer shadow-xs"
                  >
                    + Create New Pod
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {breakoutPods.map((pod) => {
                    const podParticipants = participants.filter(p => pod.participantIds.includes(p.id));
                    const isUserInPod = pod.participantIds.includes('part-1');

                    return (
                      <div
                        key={pod.id}
                        className={`p-5 rounded-2xl border transition-all ${
                          isUserInPod
                            ? 'bg-red-50/40 border-[#DC2626] shadow-xs'
                            : 'bg-[#F9FAFB] border-[#E5E7EB] hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-white text-[#1F2937] border border-[#E5E7EB]">
                            {pod.participantIds.length} / {pod.maxCapacity} Members
                          </span>
                          {isUserInPod && (
                            <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              Your Pod
                            </span>
                          )}
                        </div>

                        <h4 className="text-sm font-bold text-[#1F2937]">{pod.name}</h4>
                        <p className="text-xs text-[#4B5563] mt-1 line-clamp-2">{pod.topic}</p>

                        <div className="mt-4 pt-4 border-t border-[#E5E7EB]">
                          <div className="text-[10px] uppercase font-bold text-[#4B5563] mb-2">Members:</div>
                          <div className="space-y-1.5 min-h-[60px]">
                            {podParticipants.map((p) => (
                              <div key={p.id} className="flex items-center gap-2 text-xs text-[#1F2937]">
                                <img src={p.avatar} alt={p.name} className="w-5 h-5 rounded-full object-cover" />
                                <span className="truncate">{p.name}</span>
                              </div>
                            ))}
                            {podParticipants.length === 0 && (
                              <div className="text-xs text-[#4B5563] italic">No members assigned yet</div>
                            )}
                          </div>

                          <div className="mt-4">
                            {isUserInPod ? (
                              <button
                                onClick={() => {
                                  setBreakoutPods(prev => prev.map(item => ({
                                    ...item,
                                    participantIds: item.participantIds.filter(id => id !== 'part-1')
                                  })));
                                }}
                                className="w-full py-2 rounded-xl text-xs font-bold bg-[#F9FAFB] border border-[#E5E7EB] text-[#4B5563] hover:text-[#1F2937] hover:bg-gray-100 transition-colors cursor-pointer"
                              >
                                Leave Pod
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  setBreakoutPods(prev => prev.map(item => ({
                                    ...item,
                                    participantIds: item.id === pod.id 
                                      ? [...item.participantIds.filter(id => id !== 'part-1'), 'part-1']
                                      : item.participantIds.filter(id => id !== 'part-1')
                                  })));
                                }}
                                className="w-full py-2 rounded-xl text-xs font-bold bg-[#DC2626] text-white hover:bg-[#B91C1C] transition-colors cursor-pointer shadow-xs"
                              >
                                Join Pod Session
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CHAT */}
          {activeTab === 'chat' && (
            <div className="bg-white rounded-2xl border border-[#E5E7EB] flex flex-col h-[560px] overflow-hidden shadow-xs">
              <div className="p-4 border-b border-[#E5E7EB] bg-[#F9FAFB] flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#1F2937] flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-[#DC2626]" />
                    <span>Live Classroom Study Chat</span>
                  </h3>
                  <p className="text-[11px] text-[#4B5563]">Questions asked here can be upvoted by peers and answered live by the instructor.</p>
                </div>
                <span className="text-xs text-emerald-700 font-bold px-2 py-1 rounded-md bg-emerald-50 border border-emerald-200">
                  Encrypted SFU Feed
                </span>
              </div>

              {/* Message Feed */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className="flex items-start gap-3">
                    <img src={msg.avatar} alt={msg.senderName} className="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#1F2937]">{msg.senderName}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                          msg.senderRole === 'INSTRUCTOR' ? 'bg-red-50 text-[#DC2626] border border-red-200' : 'bg-gray-100 text-[#4B5563]'
                        }`}>
                          {msg.senderRole}
                        </span>
                        <span className="text-[10px] text-[#4B5563]">{msg.timestamp}</span>
                      </div>
                      <p className="text-xs text-[#1F2937] mt-1 bg-[#F9FAFB] p-3 rounded-xl border border-[#E5E7EB] leading-relaxed">
                        {msg.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-[#E5E7EB] bg-[#F9FAFB] flex items-center gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Ask a technical question to the room or share code snippet..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white border border-[#E5E7EB] text-[#1F2937] text-xs placeholder-[#4B5563] focus:outline-none focus:border-[#DC2626]"
                />
                <button
                  type="submit"
                  className="p-2.5 rounded-xl bg-[#DC2626] text-white hover:bg-[#B91C1C] transition-colors cursor-pointer shadow-xs"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

        </div>

        {/* Right 1 Column: Room Sidebar & Telemetry */}
        <div className="space-y-4">
          
          {/* Lecture Metadata Card */}
          <div className="p-4 rounded-2xl bg-white border border-[#E5E7EB] space-y-3 shadow-xs">
            <h4 className="text-xs font-bold text-[#4B5563] uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#DC2626]" />
              <span>Session Details</span>
            </h4>

            <div>
              <div className="text-sm font-bold text-[#1F2937]">Distributed Consensus & Raft</div>
              <div className="text-xs text-[#DC2626] font-medium">CS-401 • Advanced Systems</div>
            </div>

            <div className="space-y-2 pt-2 border-t border-[#E5E7EB] text-xs">
              <div className="flex justify-between text-[#4B5563]">
                <span>Instructor:</span>
                <span className="text-[#1F2937] font-medium">Prof. Rohit Verma</span>
              </div>
              <div className="flex justify-between text-[#4B5563]">
                <span>Room Protocol:</span>
                <span className="text-emerald-700 font-mono font-medium">WebRTC SFU (P2P)</span>
              </div>
              <div className="flex justify-between text-[#4B5563]">
                <span>Bitrate:</span>
                <span className="text-[#1F2937] font-mono">1.8 Mbps / 1080p30</span>
              </div>
              <div className="flex justify-between text-[#4B5563]">
                <span>Audio Codec:</span>
                <span className="text-[#1F2937] font-mono">Opus 48kHz Stereo</span>
              </div>
            </div>
          </div>

          {/* Active Hand Raises Queue */}
          <div className="p-4 rounded-2xl bg-white border border-[#E5E7EB] space-y-3 shadow-xs">
            <h4 className="text-xs font-bold text-amber-700 uppercase tracking-wider flex items-center gap-1.5">
              <Hand className="w-4 h-4" />
              <span>Hand-Raise Queue ({participants.filter(p => p.isHandRaised).length})</span>
            </h4>

            <div className="space-y-2">
              {participants.filter(p => p.isHandRaised).map((p) => (
                <div key={p.id} className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src={p.avatar} alt={p.name} className="w-6 h-6 rounded-full object-cover" />
                    <span className="text-xs font-bold text-[#1F2937]">{p.name}</span>
                  </div>
                  <button
                    onClick={() => {
                      alert(`Spotlight granted to ${p.name}`);
                    }}
                    className="text-[10px] font-bold px-2 py-1 rounded bg-[#DC2626] text-white hover:bg-[#B91C1C] transition-colors"
                  >
                    Spotlight
                  </button>
                </div>
              ))}
              {participants.filter(p => p.isHandRaised).length === 0 && (
                <div className="text-xs text-[#4B5563] italic py-2 text-center">
                  No active hand raises at the moment
                </div>
              )}
            </div>
          </div>

          {/* Mini Study Pod Shortcut */}
          <div className="p-4 rounded-2xl bg-[#F9FAFB] border border-[#E5E7EB] space-y-3 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold text-[#DC2626]">
              <Sparkles className="w-4 h-4 text-[#DC2626]" />
              <span>AI Real-Time Transcription</span>
            </div>
            <p className="text-xs text-[#4B5563] leading-relaxed italic">
              "When a follower node misses three consecutive heartbeats, it transitions to the candidate state, increments its term counter, and dispatches RequestVote RPCs."
            </p>
            <div className="text-[10px] text-[#4B5563] font-mono text-right">
              Live Transcript • Auto-generating notes
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
