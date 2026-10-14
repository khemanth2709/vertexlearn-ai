import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';
import { Assignment, Submission } from '../../types/lms';
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  Upload, 
  Code, 
  Play, 
  Award, 
  AlertCircle, 
  ChevronRight, 
  Sparkles,
  Terminal,
  Layers,
  Check,
  Edit3
} from 'lucide-react';

export const AssignmentsModule: React.FC = () => {
  const { 
    assignments, 
    submissions, 
    submitAssignment, 
    user, 
    gradeSubmissionManually 
  } = useLMS();

  const [selectedAsgId, setSelectedAsgId] = useState<string>(assignments[0]?.id || '');
  const [submissionTab, setSubmissionTab] = useState<'code' | 'file'>('code');
  const [codeContent, setCodeContent] = useState<string>(
`// Sample vector search pipeline implementation
export async function retrieveRelevantChunks(queryEmbedding: number[], tenantId: string, limit = 5) {
  return await db.execute(sql\`
    SELECT id, document_id, content, 1 - (embedding <=> \${queryEmbedding}::vector) AS similarity
    FROM document_embeddings
    WHERE tenant_id = \${tenantId}
    ORDER BY embedding <=> \${queryEmbedding}::vector
    LIMIT \${limit};
  \`);
}`
  );
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeSubmission, setActiveSubmission] = useState<Submission | null>(null);

  // Manual Review state for instructor
  const [manualReviewSubId, setManualReviewSubId] = useState<string | null>(null);
  const [manualScore, setManualScore] = useState<number>(95);
  const [manualFeedback, setManualFeedback] = useState<string>('');

  const selectedAsg = assignments.find(a => a.id === selectedAsgId) || assignments[0];
  const userSubmission = submissions.find(s => s.assignmentId === selectedAsg?.id && s.studentId === user?.id);
  const allAsgSubmissions = submissions.filter(s => s.assignmentId === selectedAsg?.id);

  const isInstructorOrAdmin = user?.role === 'INSTRUCTOR' || user?.role === 'ADMIN';

  const handleRunAutomatedGrading = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const sub = submitAssignment({
        assignmentId: selectedAsg.id,
        courseId: selectedAsg.courseId,
        codeSnippet: submissionTab === 'code' ? codeContent : undefined,
        fileName: submissionTab === 'file' ? (uploadedFileName || 'vector_pipeline_impl.ts') : 'inline_code_submission.ts',
        fileSize: '3.8 KB'
      });
      setIsSubmitting(false);
      setActiveSubmission(sub);
    }, 1200);
  };

  const handleSaveManualGrade = (subId: string) => {
    gradeSubmissionManually(subId, manualScore, manualFeedback);
    setManualReviewSubId(null);
  };

  return (
    <div className="space-y-6 text-[#1F2937]">
      
      {/* Header */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-50 text-[#DC2626] border border-red-200 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Automated Test Harness & Grading Suite
          </div>
          <h1 className="text-2xl font-bold text-[#1F2937] flex items-center gap-2">
            <FileText className="w-6 h-6 text-[#DC2626]" />
            Course Assignments & Assessment Submissions
          </h1>
          <p className="text-xs text-[#4B5563] mt-1">
            Submit code repositories for instant AST syntax parsing, SQL injection isolation tests, and automated score assignment.
          </p>
        </div>

        <div className="text-right">
          <div className="text-xs text-[#4B5563]">Total Enrolled Cohort Submissions</div>
          <div className="text-xl font-bold text-[#1F2937] mt-0.5">{submissions.length} Evaluated</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Assignments Selector */}
        <div className="space-y-3">
          <h3 className="font-bold text-xs text-[#4B5563] uppercase tracking-wider px-1">
            Active Assignments ({assignments.length})
          </h3>

          {assignments.map((asg) => {
            const isSelected = asg.id === selectedAsg?.id;
            const sub = submissions.find(s => s.assignmentId === asg.id && s.studentId === user?.id);

            return (
              <div
                key={asg.id}
                onClick={() => setSelectedAsgId(asg.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  isSelected 
                    ? 'bg-red-50/50 border-[#DC2626] shadow-xs' 
                    : 'bg-white border-[#E5E7EB] hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[10px] font-semibold text-[#DC2626] uppercase tracking-wider truncate">
                    {asg.courseTitle.split(':')[0]}
                  </span>
                  {sub ? (
                    <span className="text-[10px] font-bold bg-green-50 text-green-700 px-2 py-0.5 rounded-full border border-green-200">
                      Graded: {sub.score}/100
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full border border-amber-200">
                      Due Soon
                    </span>
                  )}
                </div>

                <h4 className="text-sm font-semibold text-[#1F2937] line-clamp-1">
                  {asg.title}
                </h4>

                <div className="flex items-center justify-between text-[11px] text-[#4B5563] mt-2">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#DC2626]" /> Due {asg.dueDate}
                  </span>
                  <span className="font-medium text-[#1F2937]">
                    Max: {asg.maxScore} pts
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right 2 Columns: Assignment Workspace */}
        <div className="lg:col-span-2 space-y-6">
          {selectedAsg && (
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 lg:p-8 space-y-6 shadow-xs">
              
              {/* Assignment Overview & Rubrics */}
              <div className="border-b border-[#E5E7EB] pb-6 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h2 className="text-xl font-bold text-[#1F2937]">
                    {selectedAsg.title}
                  </h2>
                  <span className="text-xs font-semibold bg-red-50 text-[#DC2626] border border-red-200 px-3 py-1 rounded-full self-start">
                    Automated Test Suite Enabled
                  </span>
                </div>

                <p className="text-xs text-[#4B5563] leading-relaxed">
                  {selectedAsg.description}
                </p>

                {/* Rubrics Breakdown */}
                <div className="space-y-2 pt-2">
                  <div className="text-xs font-bold text-[#4B5563] uppercase tracking-wider">
                    Automated Grading Rubric Criteria
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {selectedAsg.rubrics.map((r, i) => (
                      <div key={i} className="p-3 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] space-y-1">
                        <div className="flex justify-between text-xs font-semibold text-[#1F2937]">
                          <span className="truncate">{r.criterion}</span>
                          <span className="text-[#DC2626] font-bold shrink-0">{r.maxPoints} pts</span>
                        </div>
                        <p className="text-[10px] text-[#4B5563] leading-relaxed line-clamp-2">
                          {r.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Student Submission Workspace */}
              {!isInstructorOrAdmin && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-[#1F2937] text-sm flex items-center gap-2">
                      <Code className="w-4 h-4 text-[#DC2626]" />
                      Student Submission Console
                    </h3>

                    {/* Tabs */}
                    <div className="flex bg-[#F9FAFB] p-1 rounded-xl border border-[#E5E7EB] text-xs">
                      <button
                        onClick={() => setSubmissionTab('code')}
                        className={`px-3 py-1 rounded-lg transition-colors font-semibold cursor-pointer ${
                          submissionTab === 'code' ? 'bg-[#DC2626] text-white' : 'text-[#4B5563] hover:text-[#1F2937]'
                        }`}
                      >
                        Code Editor
                      </button>
                      <button
                        onClick={() => setSubmissionTab('file')}
                        className={`px-3 py-1 rounded-lg transition-colors font-semibold cursor-pointer ${
                          submissionTab === 'file' ? 'bg-[#DC2626] text-white' : 'text-[#4B5563] hover:text-[#1F2937]'
                        }`}
                      >
                        File Upload (.ts / .zip)
                      </button>
                    </div>
                  </div>

                  {/* Submission Form */}
                  {submissionTab === 'code' ? (
                    <div className="space-y-2">
                      <div className="relative">
                        <div className="absolute top-2.5 right-3 text-[10px] font-mono text-gray-400 uppercase">
                          TypeScript 5.8
                        </div>
                        <textarea
                          rows={8}
                          value={codeContent}
                          onChange={(e) => setCodeContent(e.target.value)}
                          className="w-full bg-[#F9FAFB] font-mono text-xs text-[#1F2937] border border-[#E5E7EB] rounded-xl p-4 focus:outline-none focus:border-[#DC2626] leading-relaxed"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="border border-[#E5E7EB] border-dashed rounded-xl p-8 bg-[#F9FAFB] text-center space-y-3">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto text-[#DC2626] border border-[#E5E7EB] shadow-xs">
                        <Upload className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-[#1F2937]">
                          Drag and drop source archive or click to browse
                        </div>
                        <div className="text-[10px] text-[#4B5563] mt-1">
                          Supported: .ts, .js, .sql, .zip (Max 25MB)
                        </div>
                      </div>
                      <input 
                        type="file"
                        id="asgFileInput"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) setUploadedFileName(f.name);
                        }}
                        className="hidden"
                      />
                      <label 
                        htmlFor="asgFileInput"
                        className="inline-block bg-white hover:bg-gray-100 text-[#1F2937] border border-[#E5E7EB] text-xs font-semibold px-4 py-2 rounded-lg cursor-pointer transition-colors"
                      >
                        {uploadedFileName || 'Select File from Computer'}
                      </label>
                    </div>
                  )}

                  {/* Run Button */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="text-xs text-[#4B5563]">
                      Automated testing validates 4 test vectors & security constraints.
                    </div>
                    <button
                      onClick={handleRunAutomatedGrading}
                      disabled={isSubmitting}
                      className="bg-[#DC2626] hover:bg-[#B91C1C] disabled:opacity-50 text-white text-xs font-semibold px-6 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      {isSubmitting ? 'Running Automated Test Suites...' : 'Run Automated Grading Suite'}
                    </button>
                  </div>
                </div>
              )}

              {/* Submission Result / Active Submission Inspection */}
              {(userSubmission || activeSubmission) && (
                <div className="p-5 bg-[#F9FAFB] rounded-2xl border border-[#E5E7EB] space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E5E7EB] pb-3">
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-green-600" />
                      <h4 className="font-bold text-[#1F2937] text-sm">
                        Submission Evaluation Report
                      </h4>
                      <span className="text-[10px] bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full font-bold">
                        Status: Graded
                      </span>
                    </div>

                    <div className="text-lg font-extrabold text-[#DC2626]">
                      Score: {(activeSubmission || userSubmission)?.score} / 100
                    </div>
                  </div>

                  <p className="text-xs text-[#1F2937]">
                    {(activeSubmission || userSubmission)?.feedback}
                  </p>

                  {/* Automated Test Breakdown */}
                  <div className="space-y-2">
                    <div className="text-[11px] font-bold text-[#4B5563] uppercase tracking-wider flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5 text-[#DC2626]" />
                      Automated Test Results ({((activeSubmission || userSubmission)?.automatedCheckResults || []).length} / 4 Passed)
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {((activeSubmission || userSubmission)?.automatedCheckResults || []).map((t, idx) => (
                        <div key={idx} className="p-2.5 bg-white rounded-lg border border-[#E5E7EB] flex items-start gap-2 text-xs shadow-xs">
                          <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                          <div className="truncate">
                            <div className="font-semibold text-[#1F2937] truncate">{t.testName}</div>
                            <div className="text-[10px] text-[#4B5563] truncate">{t.output}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Instructor View: Submissions Queue Table */}
              {isInstructorOrAdmin && (
                <div className="space-y-4 pt-4 border-t border-[#E5E7EB]">
                  <h3 className="font-bold text-[#1F2937] text-sm flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#DC2626]" />
                    Cohort Submissions Queue ({allAsgSubmissions.length})
                  </h3>

                  <div className="divide-y divide-[#E5E7EB] border border-[#E5E7EB] rounded-xl overflow-hidden bg-white">
                    {allAsgSubmissions.map((sub) => (
                      <div key={sub.id} className="p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <img src={sub.studentAvatar} alt={sub.studentName} className="w-8 h-8 rounded-full object-cover border border-[#E5E7EB]" />
                            <div>
                              <div className="text-xs font-semibold text-[#1F2937]">{sub.studentName}</div>
                              <div className="text-[10px] text-[#4B5563]">Submitted {sub.submittedAt}</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="text-sm font-bold text-[#DC2626]">{sub.score}/100</div>
                            <button
                              onClick={() => {
                                setManualReviewSubId(sub.id);
                                setManualScore(sub.score || 95);
                                setManualFeedback(sub.feedback || '');
                              }}
                              className="text-xs text-[#DC2626] hover:text-[#B91C1C] font-medium flex items-center gap-1 cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" /> Review & Adjust
                            </button>
                          </div>
                        </div>

                        {/* Expandable Manual Grade Form */}
                        {manualReviewSubId === sub.id && (
                          <div className="p-3 bg-[#F9FAFB] rounded-xl border border-red-200 space-y-3">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              <div>
                                <label className="block text-[11px] text-[#4B5563] mb-1">Score Override</label>
                                <input 
                                  type="number"
                                  min="0"
                                  max="100"
                                  value={manualScore}
                                  onChange={(e) => setManualScore(Number(e.target.value))}
                                  className="w-full bg-white border border-[#E5E7EB] rounded-lg px-3 py-1.5 text-xs text-[#1F2937] focus:outline-none focus:border-[#DC2626]"
                                />
                              </div>
                              <div className="sm:col-span-2">
                                <label className="block text-[11px] text-[#4B5563] mb-1">Instructor Feedback</label>
                                <input 
                                  type="text"
                                  value={manualFeedback}
                                  onChange={(e) => setManualFeedback(e.target.value)}
                                  className="w-full bg-white border border-[#E5E7EB] rounded-lg px-3 py-1.5 text-xs text-[#1F2937] focus:outline-none focus:border-[#DC2626]"
                                />
                              </div>
                            </div>
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => setManualReviewSubId(null)}
                                className="px-3 py-1 text-xs text-[#4B5563] cursor-pointer"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleSaveManualGrade(sub.id)}
                                className="px-3 py-1 text-xs font-semibold bg-[#DC2626] hover:bg-[#B91C1C] text-white rounded-lg cursor-pointer"
                              >
                                Save Changes
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}
        </div>

      </div>

    </div>
  );
};
