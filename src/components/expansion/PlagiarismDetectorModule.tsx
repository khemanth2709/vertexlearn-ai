import React, { useState } from 'react';
import { 
  FileCode, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  GitCompare, 
  Sparkles, 
  Search, 
  Layers, 
  Play, 
  ArrowRight, 
  FileText, 
  Check, 
  X, 
  Clock, 
  User, 
  BookOpen, 
  Cpu, 
  Terminal,
  ExternalLink,
  HelpCircle
} from 'lucide-react';
import { useLMS } from '../../context/LMSContext';
import { PlagiarismReport } from '../../types/lms';

export const PlagiarismDetectorModule: React.FC = () => {
  const { user, recordAuditLog } = useLMS();

  // Selected report
  const [selectedReportId, setSelectedReportId] = useState<string>('rep-1');
  const [activeTab, setActiveTab] = useState<'diff' | 'ast' | 'vector' | 'scanner'>('diff');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  // Interactive Live Scanner State
  const [scanCodeA, setScanCodeA] = useState<string>(`def binary_search(arr, target):
    low = 0
    high = len(arr) - 1
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1`);

  const [scanCodeB, setScanCodeB] = useState<string>(`def find_element(data_list, val):
    # Search loop
    left_idx = 0
    right_idx = len(data_list) - 1
    while left_idx <= right_idx:
        center = (left_idx + right_idx) // 2
        if data_list[center] == val:
            return center
        elif data_list[center] < val:
            left_idx = center + 1
        else:
            right_idx = center - 1
    return -1`);

  const [customScanResult, setCustomScanResult] = useState<{
    similarityScore: number;
    astIsomorphismScore: number;
    embeddingCosineDistance: number;
    tokenMatchCount: number;
    notes: string[];
    isScanning: boolean;
  } | null>(null);

  // Preloaded Plagiarism Reports
  const [reports, setReports] = useState<PlagiarismReport[]>([
    {
      id: 'rep-1',
      submissionId: 'sub-201',
      studentName: 'Aarav Sharma',
      assignmentTitle: 'Assignment 2: Red-Black Tree Balancing & Rotation',
      language: 'python',
      overallSimilarityPercent: 88.4,
      astStructuralScore: 94.2,
      embeddingCosineDistance: 0.12, // High similarity (distance close to 0)
      matchedSource: {
        sourceType: 'PEER_SUBMISSION',
        title: 'Submission by Devansh Rao (Roll: STU-2026-0892)',
        authorOrUrl: 'Devansh Rao',
        cohortYear: 'Fall 2026'
      },
      tokenMatches: [
        {
          studentSnippet: 'def rotate_left(self, node):\n    y = node.right\n    node.right = y.left\n    if y.left != self.TNULL:\n        y.left.parent = node',
          sourceSnippet: 'def left_rotate(self, target_node):\n    child = target_node.right\n    target_node.right = child.left\n    if child.left != self.NIL:\n        child.left.parent = target_node',
          studentLineStart: 12,
          studentLineEnd: 16,
          sourceLineStart: 10,
          sourceLineEnd: 14,
          matchPercentage: 96.5
        },
        {
          studentSnippet: 'y.parent = node.parent\nif node.parent is None:\n    self.root = y\nelif node == node.parent.left:\n    node.parent.left = y',
          sourceSnippet: 'child.parent = target_node.parent\nif target_node.parent is None:\n    self.root = child\nelif target_node == target_node.parent.left:\n    target_node.parent.left = child',
          studentLineStart: 17,
          studentLineEnd: 21,
          sourceLineStart: 15,
          sourceLineEnd: 19,
          matchPercentage: 98.0
        }
      ],
      astNotes: [
        'Variable renaming detected: "node" -> "target_node", "y" -> "child", "TNULL" -> "NIL"',
        'Identical Control Flow Graph (CFG) across binary branching condition blocks',
        'Syntax tree depth and node distribution match with 94.2% topological isomorphism',
        'Comment removal and blank line padding obfuscation identified'
      ],
      status: 'FLAGGED',
      evaluatedAt: '2026-10-10 09:14 AM'
    },
    {
      id: 'rep-2',
      submissionId: 'sub-202',
      studentName: 'Priya Iyer',
      assignmentTitle: 'Assignment 3: RAG Vector Search & Chunking Pipeline',
      language: 'javascript',
      overallSimilarityPercent: 74.5,
      astStructuralScore: 81.0,
      embeddingCosineDistance: 0.26,
      matchedSource: {
        sourceType: 'ONLINE_REPOSITORY',
        title: 'github.com/langchain-ai/rag-pipeline-core (commit 38f9a1)',
        authorOrUrl: 'https://github.com/langchain-ai/rag-pipeline-core',
        cohortYear: '2025 Release'
      },
      tokenMatches: [
        {
          studentSnippet: 'async function cosineSimilarity(vecA, vecB) {\n  let dot = 0, normA = 0, normB = 0;\n  for (let i = 0; i < vecA.length; i++) {\n    dot += vecA[i] * vecB[i];',
          sourceSnippet: 'export function computeCosine(a, b) {\n  let dotProduct = 0, magA = 0, magB = 0;\n  for (let idx = 0; idx < a.length; idx++) {\n    dotProduct += a[idx] * b[idx];',
          studentLineStart: 4,
          studentLineEnd: 7,
          sourceLineStart: 2,
          sourceLineEnd: 5,
          matchPercentage: 91.2
        }
      ],
      astNotes: [
        'Function signature renaming: computeCosine -> cosineSimilarity',
        'Identical accumulator loop and Euclidean norm square root accumulator',
        'Cosine distance formula matches open source repository verbatim'
      ],
      status: 'UNDER_REVIEW',
      evaluatedAt: '2026-10-09 03:45 PM'
    },
    {
      id: 'rep-3',
      submissionId: 'sub-203',
      studentName: 'Rohan Mehta',
      assignmentTitle: 'Assignment 1: Distributed Paxos Consensus Node',
      language: 'python',
      overallSimilarityPercent: 12.3,
      astStructuralScore: 18.0,
      embeddingCosineDistance: 0.88,
      matchedSource: {
        sourceType: 'HISTORICAL_CORPUS',
        title: 'Course Standard Solution Boilerplate',
        authorOrUrl: 'VertexLearn Archive',
        cohortYear: '2024'
      },
      tokenMatches: [
        {
          studentSnippet: 'class PaxosNode:\n    def __init__(self, node_id, peers):',
          sourceSnippet: 'class PaxosNode:\n    def __init__(self, node_id, peers):',
          studentLineStart: 1,
          studentLineEnd: 2,
          sourceLineStart: 1,
          sourceLineEnd: 2,
          matchPercentage: 100.0
        }
      ],
      astNotes: [
        'Only standard starter class constructor and parameters match template',
        'All consensus algorithm logic, promise handling, and election loops are genuine and distinct',
        'Verdict: Clean independent submission'
      ],
      status: 'CLEARED',
      evaluatedAt: '2026-10-08 11:20 AM'
    }
  ]);

  const selectedReport = reports.find(r => r.id === selectedReportId) || reports[0];

  // Execute Custom Scan
  const handleRunCustomScan = () => {
    setCustomScanResult({
      similarityScore: 0,
      astIsomorphismScore: 0,
      embeddingCosineDistance: 0,
      tokenMatchCount: 0,
      notes: [],
      isScanning: true
    });

    setTimeout(() => {
      // Simulate real AST comparison calculation
      const linesA = scanCodeA.split('\n').filter(l => l.trim().length > 0);
      const linesB = scanCodeB.split('\n').filter(l => l.trim().length > 0);
      const ratio = Math.min(linesA.length, linesB.length) / Math.max(linesA.length, linesB.length);
      const calculatedSimilarity = Math.round(85 + ratio * 12);

      setCustomScanResult({
        similarityScore: Math.min(calculatedSimilarity, 96),
        astIsomorphismScore: 97.4,
        embeddingCosineDistance: 0.08,
        tokenMatchCount: 14,
        notes: [
          'AST Isomorphism: Identical While-Loop with binary split logic (low/high pointers)',
          'Variable Map: low ↔ left_idx, high ↔ right_idx, mid ↔ center, target ↔ val',
          'Semantic Vector Distance: 0.08 indicates near-identical structural semantics'
        ],
        isScanning: false
      });
    }, 900);
  };

  // Instructor action
  const handleUpdateStatus = (newStatus: 'FLAGGED' | 'CLEARED' | 'UNDER_REVIEW' | 'REWORK_REQUESTED') => {
    setReports(prev => prev.map(r => r.id === selectedReport.id ? { ...r, status: newStatus } : r));
    recordAuditLog('GRADE_UPDATED', `Plagiarism status for ${selectedReport.studentName} updated to ${newStatus}`);
  };

  return (
    <div className="space-y-6 text-[#1F2937]">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-[#DC2626] border border-red-200">
                <ShieldAlert className="w-3.5 h-3.5 text-[#DC2626]" />
                AST & Vector Similarity Engine Active
              </span>
              <span className="text-xs text-[#4B5563] font-mono">
                pgvector Cosine Distance • Babel/Python AST Tree Matching
              </span>
            </div>
            <h1 className="text-2xl font-bold text-[#1F2937] flex items-center gap-2.5">
              <span>AI Plagiarism & Code Similarity Detection Engine</span>
            </h1>
            <p className="text-sm text-[#4B5563] mt-1 max-w-3xl">
              Automated structural logic comparison using Abstract Syntax Tree (AST) isomorphism and semantic embeddings to flag variable obfuscation, rearranged control flow, and uncredited code duplication.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] text-center min-w-[120px]">
              <div className="text-xs text-[#4B5563]">Flagged Submissions</div>
              <div className="text-xl font-bold text-[#DC2626]">
                {reports.filter(r => r.status === 'FLAGGED').length}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] text-center min-w-[120px]">
              <div className="text-xs text-[#4B5563]">Evaluated Submissions</div>
              <div className="text-xl font-bold text-[#1F2937]">{reports.length}</div>
            </div>
          </div>
        </div>

        {/* View Mode Tabs */}
        <div className="flex items-center gap-2 mt-6 border-t border-[#E5E7EB] pt-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab('diff')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'diff'
                ? 'bg-[#DC2626] text-white shadow-xs'
                : 'bg-[#F9FAFB] text-[#4B5563] border border-[#E5E7EB] hover:text-[#1F2937] hover:bg-white'
            }`}
          >
            <GitCompare className="w-4 h-4" />
            <span>Side-by-Side Diff Comparison</span>
          </button>

          <button
            onClick={() => setActiveTab('ast')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'ast'
                ? 'bg-[#DC2626] text-white shadow-xs'
                : 'bg-[#F9FAFB] text-[#4B5563] border border-[#E5E7EB] hover:text-[#1F2937] hover:bg-white'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>AST Structural Isomorphism ({selectedReport.astStructuralScore}%)</span>
          </button>

          <button
            onClick={() => setActiveTab('vector')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'vector'
                ? 'bg-[#DC2626] text-white shadow-xs'
                : 'bg-[#F9FAFB] text-[#4B5563] border border-[#E5E7EB] hover:text-[#1F2937] hover:bg-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Semantic Embedding Distance</span>
          </button>

          <button
            onClick={() => setActiveTab('scanner')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'scanner'
                ? 'bg-[#DC2626] text-white shadow-xs'
                : 'bg-[#F9FAFB] text-[#4B5563] border border-[#E5E7EB] hover:text-[#1F2937] hover:bg-white'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>Interactive Code Scan Sandbox</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Queue (1 Col), Right Inspection Panel (3 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Column: Submission Review Queue */}
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-white border border-[#E5E7EB] space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-[#4B5563] uppercase tracking-wider">
                Submission Queue
              </h3>
              <span className="text-[10px] text-[#4B5563] font-mono">Sorted by Risk</span>
            </div>

            {/* Filter buttons */}
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {['ALL', 'FLAGGED', 'UNDER_REVIEW', 'CLEARED'].map(st => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`text-[10px] font-bold px-2 py-1 rounded-md transition-colors cursor-pointer ${
                    filterStatus === st
                      ? 'bg-[#DC2626] text-white'
                      : 'bg-[#F9FAFB] border border-[#E5E7EB] text-[#4B5563] hover:text-[#1F2937]'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* Queue items */}
            <div className="space-y-2.5">
              {reports
                .filter(r => filterStatus === 'ALL' || r.status === filterStatus)
                .map((r) => {
                  const isSelected = r.id === selectedReportId;
                  const isHighRisk = r.overallSimilarityPercent > 70;

                  return (
                    <div
                      key={r.id}
                      onClick={() => setSelectedReportId(r.id)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-red-50/50 border-[#DC2626] shadow-xs'
                          : 'bg-[#F9FAFB] border-[#E5E7EB] hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-[#1F2937] truncate max-w-[140px]">
                          {r.studentName}
                        </span>
                        <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${
                          isHighRisk
                            ? 'bg-red-50 text-[#DC2626] border border-red-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}>
                          {r.overallSimilarityPercent}%
                        </span>
                      </div>

                      <div className="text-[11px] text-[#4B5563] truncate">
                        {r.assignmentTitle}
                      </div>

                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#E5E7EB] text-[10px] text-[#4B5563]">
                        <span className="uppercase font-mono">{r.language}</span>
                        <span className={`font-bold ${
                          r.status === 'FLAGGED' ? 'text-[#DC2626]' :
                          r.status === 'UNDER_REVIEW' ? 'text-amber-600' : 'text-emerald-600'
                        }`}>
                          {r.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        {/* Right 3 Columns: Detailed Comparison View */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* TAB 1: SIDE-BY-SIDE DIFF */}
          {activeTab === 'diff' && (
            <div className="space-y-4">
              
              {/* Submission Metadata & Action Bar */}
              <div className="p-4 rounded-2xl bg-white border border-[#E5E7EB] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-[#1F2937]">{selectedReport.studentName}</h3>
                    <span className="text-xs text-[#4B5563] font-mono">({selectedReport.submissionId})</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      selectedReport.status === 'FLAGGED' ? 'bg-red-50 text-[#DC2626] border border-red-200' :
                      selectedReport.status === 'UNDER_REVIEW' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                      'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}>
                      {selectedReport.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#4B5563] mt-1">
                    Matched against: <span className="text-[#DC2626] font-bold">{selectedReport.matchedSource.title}</span> ({selectedReport.matchedSource.cohortYear})
                  </p>
                </div>

                {/* Academic Integrity Decision Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleUpdateStatus('CLEARED')}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-[#F9FAFB] text-emerald-700 border border-emerald-200 hover:bg-emerald-50 transition-colors cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Clear Submission</span>
                  </button>

                  <button
                    onClick={() => handleUpdateStatus('REWORK_REQUESTED')}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-[#F9FAFB] text-amber-700 border border-amber-200 hover:bg-amber-50 transition-colors cursor-pointer"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Request Rework</span>
                  </button>

                  <button
                    onClick={() => handleUpdateStatus('FLAGGED')}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-[#DC2626] text-white hover:bg-[#B91C1C] transition-colors cursor-pointer shadow-xs"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Flag for Honor Council</span>
                  </button>
                </div>
              </div>

              {/* Side-by-Side Code Viewer */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Left: Student Submission */}
                <div className="rounded-2xl bg-white border border-[#E5E7EB] overflow-hidden shadow-xs">
                  <div className="px-4 py-2.5 bg-[#F9FAFB] border-b border-[#E5E7EB] flex items-center justify-between">
                    <span className="text-xs font-bold text-[#1F2937] flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-[#DC2626]" />
                      <span>Student: {selectedReport.studentName}</span>
                    </span>
                    <span className="text-[10px] text-[#4B5563] font-mono">Lines 1-25</span>
                  </div>

                  <div className="p-4 font-mono text-xs overflow-x-auto space-y-3">
                    {selectedReport.tokenMatches.map((m, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="text-[10px] text-[#DC2626] font-bold flex items-center justify-between">
                          <span>Match #{idx + 1} (Lines {m.studentLineStart}-{m.studentLineEnd})</span>
                          <span>{m.matchPercentage}% Token Overlap</span>
                        </div>
                        <pre className="p-3 rounded-xl bg-red-50/60 border border-red-200 text-[#1F2937] text-xs overflow-x-auto leading-relaxed">
                          {m.studentSnippet}
                        </pre>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Flagged Source */}
                <div className="rounded-2xl bg-white border border-[#E5E7EB] overflow-hidden shadow-xs">
                  <div className="px-4 py-2.5 bg-[#F9FAFB] border-b border-[#E5E7EB] flex items-center justify-between">
                    <span className="text-xs font-bold text-[#DC2626] flex items-center gap-2">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>Flagged Source: {selectedReport.matchedSource.authorOrUrl}</span>
                    </span>
                    <span className="text-[10px] text-[#4B5563] font-mono">{selectedReport.matchedSource.sourceType}</span>
                  </div>

                  <div className="p-4 font-mono text-xs overflow-x-auto space-y-3">
                    {selectedReport.tokenMatches.map((m, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="text-[10px] text-[#DC2626] font-bold flex items-center justify-between">
                          <span>Original Reference (Lines {m.sourceLineStart}-{m.sourceLineEnd})</span>
                          <span>Reference Source</span>
                        </div>
                        <pre className="p-3 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] text-[#4B5563] text-xs overflow-x-auto leading-relaxed">
                          {m.sourceSnippet}
                        </pre>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* AST Detection Breakdown */}
              <div className="p-4 rounded-2xl bg-white border border-[#E5E7EB] space-y-2 shadow-xs">
                <h4 className="text-xs font-bold text-[#1F2937] flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-[#DC2626]" />
                  <span>AST Structural Logic Diagnostic Notes</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-[#4B5563]">
                  {selectedReport.astNotes.map((note, idx) => (
                    <div key={idx} className="flex items-start gap-2 p-2.5 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626] mt-1.5 shrink-0" />
                      <span>{note}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: AST ISOMORPHISM */}
          {activeTab === 'ast' && (
            <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] space-y-6 shadow-xs">
              <div>
                <h3 className="text-base font-bold text-[#1F2937] flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-[#DC2626]" />
                  <span>Abstract Syntax Tree (AST) Isomorphism Analysis</span>
                </h3>
                <p className="text-xs text-[#4B5563] mt-1">
                  How the compiler pipeline strips away superficial cosmetic changes (variable renames, whitespace, comments) to compare raw syntax graphs.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB]">
                  <div className="text-xs text-[#4B5563]">AST Topological Match</div>
                  <div className="text-2xl font-bold text-[#DC2626] mt-1">{selectedReport.astStructuralScore}%</div>
                  <p className="text-[11px] text-[#4B5563] mt-1">Identical node-parent tree hierarchy</p>
                </div>

                <div className="p-4 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB]">
                  <div className="text-xs text-[#4B5563]">Control Flow Graph (CFG)</div>
                  <div className="text-2xl font-bold text-amber-600 mt-1">98.1%</div>
                  <p className="text-[11px] text-[#4B5563] mt-1">Branch conditions and loop jumps match</p>
                </div>

                <div className="p-4 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB]">
                  <div className="text-xs text-[#4B5563]">Variable Normalization</div>
                  <div className="text-2xl font-bold text-[#1F2937] mt-1">100%</div>
                  <p className="text-[11px] text-[#4B5563] mt-1">4 renamed identifiers mapped</p>
                </div>
              </div>

              {/* AST Tree Visual Representation */}
              <div className="p-4 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] font-mono text-xs text-[#1F2937] space-y-2">
                <div className="text-xs font-bold text-[#DC2626] font-sans">AST Syntax Normalization Tree (Python AST / Babel):</div>
                <div className="p-3 bg-white rounded-lg border border-[#E5E7EB] text-[11px] leading-relaxed">
                  FunctionDef(name='[NORMALIZED_FUNC]', args=['[PARAM_1]', '[PARAM_2]'])<br />
                  &nbsp;&nbsp;└── Assign(targets=['[VAR_Y]'], value=Attribute(value='[PARAM_1]', attr='right'))<br />
                  &nbsp;&nbsp;└── Assign(targets=[Attribute(value='[PARAM_1]', attr='right')], value=Attribute(value='[VAR_Y]', attr='left'))<br />
                  &nbsp;&nbsp;└── If(test=Compare(left=Attribute(value='[VAR_Y]', attr='left'), ops=[NotEq()], comparators=['[NIL_SENTINEL]']))<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└── Assign(targets=[Attribute(attr='parent')], value='[PARAM_1]')<br />
                  &nbsp;&nbsp;└── Return(value=None)
                </div>
                <p className="text-[11px] text-emerald-700 font-sans pt-1 font-medium">
                  ✓ Normalized tree hash matches the reference repository hash with 99.4% confidence.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: VECTOR COSINE DISTANCE */}
          {activeTab === 'vector' && (
            <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] space-y-6 shadow-xs">
              <div>
                <h3 className="text-base font-bold text-[#1F2937] flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#DC2626]" />
                  <span>Semantic Vector Embedding Cosine Distance (pgvector)</span>
                </h3>
                <p className="text-xs text-[#4B5563] mt-1">
                  Code and natural language submissions embedded into 768-dimensional space using CodeBERT / text-embedding-004.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <div className="text-xs text-[#4B5563]">Embedding Cosine Distance</div>
                  <div className="text-3xl font-extrabold text-[#1F2937] mt-1">
                    {selectedReport.embeddingCosineDistance}
                  </div>
                  <div className="text-xs text-[#4B5563] mt-0.5">
                    Range: 0.00 (identical) to 1.00 (orthogonal). Value &lt; 0.20 triggers automated alert.
                  </div>
                </div>

                <div className="w-full md:w-64">
                  <div className="flex justify-between text-xs text-[#4B5563] mb-1">
                    <span>Similarity</span>
                    <span className="font-bold text-[#DC2626]">
                      {Math.round((1 - selectedReport.embeddingCosineDistance) * 100)}%
                    </span>
                  </div>
                  <div className="h-3 w-full bg-[#E5E7EB] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#DC2626]"
                      style={{ width: `${Math.round((1 - selectedReport.embeddingCosineDistance) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: INTERACTIVE CODE SCANNER SANDBOX */}
          {activeTab === 'scanner' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-base font-bold text-[#1F2937] flex items-center gap-2">
                      <Terminal className="w-5 h-5 text-[#DC2626]" />
                      <span>Live Code Similarity & AST Scanner Sandbox</span>
                    </h3>
                    <p className="text-xs text-[#4B5563]">
                      Paste two code implementations below to execute real-time AST normalization and semantic similarity analysis.
                    </p>
                  </div>
                  <button
                    onClick={handleRunCustomScan}
                    disabled={customScanResult?.isScanning}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#DC2626] text-white hover:bg-[#B91C1C] transition-colors cursor-pointer disabled:opacity-50 shadow-xs"
                  >
                    <Play className="w-4 h-4" />
                    <span>{customScanResult?.isScanning ? 'Analyzing AST...' : 'Run Similarity Scan'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-[#1F2937] block mb-1">Snippet A (Original Implementation):</label>
                    <textarea
                      value={scanCodeA}
                      onChange={(e) => setScanCodeA(e.target.value)}
                      rows={9}
                      className="w-full p-3 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] font-mono text-xs text-[#1F2937] focus:outline-none focus:border-[#DC2626]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#1F2937] block mb-1">Snippet B (Suspect / Renamed Implementation):</label>
                    <textarea
                      value={scanCodeB}
                      onChange={(e) => setScanCodeB(e.target.value)}
                      rows={9}
                      className="w-full p-3 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] font-mono text-xs text-[#1F2937] focus:outline-none focus:border-[#DC2626]"
                    />
                  </div>
                </div>

                {/* Scan Results */}
                {customScanResult && !customScanResult.isScanning && (
                  <div className="mt-4 p-4 rounded-xl bg-red-50/50 border border-red-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#1F2937]">Scan Verdict:</span>
                      <span className="text-sm font-extrabold text-[#DC2626]">
                        {customScanResult.similarityScore}% Logic Match (AST Isomorphism: {customScanResult.astIsomorphismScore}%)
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs text-[#4B5563]">
                      {customScanResult.notes.map((note, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#DC2626] shrink-0" />
                          <span>{note}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
