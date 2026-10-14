import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';
import { CourseModule, QuizQuestion } from '../../types/lms';
import { 
  PlusCircle, 
  Trash2, 
  Save, 
  ArrowLeft, 
  Video, 
  FileText, 
  HelpCircle, 
  Layers, 
  Sparkles,
  CheckCircle2,
  Clock,
  Code
} from 'lucide-react';

export const CourseBuilder: React.FC = () => {
  const { createCourse, setCurrentView, user } = useLMS();

  // Basic Course Info
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [category, setCategory] = useState<'Engineering' | 'Data & AI' | 'Compliance' | 'Leadership' | 'Security'>('Engineering');
  const [level, setLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [description, setDescription] = useState('');
  const [estimatedHours, setEstimatedHours] = useState(12);
  const [isCompliance, setIsCompliance] = useState(false);
  const [tagsInput, setTagsInput] = useState('Node.js, PostgreSQL, System Design');

  // Dynamic Modules
  const [modules, setModules] = useState<CourseModule[]>([
    {
      id: `m_init_1`,
      title: 'Module 1: Production System Architecture & Scalability',
      type: 'video',
      duration: '15:00',
      description: 'Foundational video lecture covering horizontal pod scaling and database pooling.',
      url: 'https://www.w3schools.com/html/mov_bbb.mp4'
    },
    {
      id: `m_init_2`,
      title: 'Module 2: Technical Specification & Implementation Guide',
      type: 'pdf',
      duration: '12 min read',
      content: `### Architectural Guidelines & Best Practices

1. **Connection Pooling**: Configure \`max: 10\` per instance with an idle client error hook.
2. **Schema Verification**: Apply Drizzle ORM migrations sequentially.
3. **Security Standards**: Always sanitize user inputs and restrict authorization claims.`
    }
  ]);

  // New module modal / inline form state
  const [newModType, setNewModType] = useState<'video' | 'pdf' | 'scorm_xapi' | 'quiz'>('video');
  const [newModTitle, setNewModTitle] = useState('');
  const [newModDuration, setNewModDuration] = useState('10:00');

  // Quiz questions temp state
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([
    {
      id: 'q_new_1',
      question: 'What is the primary benefit of connection pooling in enterprise PostgreSQL backends?',
      type: 'MCQ',
      options: [
        'Disables authentication requirements',
        'Reuses active database sockets and limits connection overhead',
        'Encrypts hard drives using AES-256',
        'Prevents SQL schema changes'
      ],
      correctAnswer: 1,
      points: 50,
      explanation: 'Reusing database sockets avoids high TCP connection handshake latency under concurrent load.'
    }
  ]);

  const handleAddModule = () => {
    if (!newModTitle) return;

    const newModule: CourseModule = {
      id: `mod_${Date.now()}`,
      title: newModTitle,
      type: newModType,
      duration: newModDuration,
      url: newModType === 'video' ? 'https://www.w3schools.com/html/mov_bbb.mp4' : undefined,
      content: newModType === 'pdf' ? '### Module Content Notes\nEnter detailed architecture instructions here.' : undefined,
      scormPackageName: newModType === 'scorm_xapi' ? 'SCORM_Enterprise_Sim_v1.zip' : undefined,
      questions: newModType === 'quiz' ? quizQuestions : undefined,
      passingScore: newModType === 'quiz' ? 75 : undefined
    };

    setModules(prev => [...prev, newModule]);
    setNewModTitle('');
  };

  const handleRemoveModule = (id: string) => {
    setModules(prev => prev.filter(m => m.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || modules.length === 0) return;

    createCourse({
      title,
      code: code || `CRS-${Math.floor(100 + Math.random() * 900)}`,
      category,
      level,
      description: description || 'Comprehensive enterprise syllabus.',
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800',
      instructorId: user?.id || 'usr_inst_001',
      instructorName: user?.name || 'Dr. Elena Vance',
      instructorTitle: user?.title || 'Lead Faculty Instructor',
      estimatedHours,
      modules,
      tags: tagsInput.split(',').map(t => t.trim()),
      isComplianceCourse: isCompliance,
      complianceValidityMonths: isCompliance ? 12 : undefined
    });

    setCurrentView('courses');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 text-[#1F2937]">
      
      {/* Top Header */}
      <div className="flex items-center justify-between bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView('dashboard')}
            className="p-2 rounded-lg text-[#4B5563] hover:text-[#1F2937] hover:bg-gray-100 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-[#1F2937] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#DC2626]" />
              Course Studio & Curriculum Authoring
            </h1>
            <p className="text-xs text-[#4B5563] mt-0.5">
              Build sequenced multimedia learning paths with automated assessment grading.
            </p>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer"
        >
          <Save className="w-4 h-4" /> Publish Course
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Basic Course Information */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 space-y-4 shadow-xs">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#DC2626]">
            1. Core Course Meta & Specifications
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-[#4B5563] mb-1">Course Title</label>
              <input 
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Distributed Consensus, Raft & Vector Storage"
                className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-3.5 py-2.5 text-xs text-[#1F2937] placeholder-gray-400 focus:outline-none focus:border-[#DC2626]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#4B5563] mb-1">Course Code</label>
              <input 
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="ENG-710"
                className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-3.5 py-2.5 text-xs text-[#1F2937] placeholder-gray-400 focus:outline-none focus:border-[#DC2626]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#4B5563] mb-1">Category</label>
              <select
                value={category}
                onChange={(e: any) => setCategory(e.target.value)}
                className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-3.5 py-2 text-xs text-[#1F2937] focus:outline-none focus:border-[#DC2626]"
              >
                <option value="Engineering">Engineering</option>
                <option value="Data & AI">Data & AI</option>
                <option value="Compliance">Compliance</option>
                <option value="Leadership">Leadership</option>
                <option value="Security">Security</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#4B5563] mb-1">Difficulty Level</label>
              <select
                value={level}
                onChange={(e: any) => setLevel(e.target.value)}
                className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-3.5 py-2 text-xs text-[#1F2937] focus:outline-none focus:border-[#DC2626]"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#4B5563] mb-1">Estimated Hours</label>
              <input 
                type="number"
                min="1"
                max="100"
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(Number(e.target.value))}
                className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-3.5 py-2 text-xs text-[#1F2937] focus:outline-none focus:border-[#DC2626]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#4B5563] mb-1">Description & Learning Outcomes</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Outline the architectural competencies students will master upon completing this course..."
              className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-3 text-xs text-[#1F2937] placeholder-gray-400 focus:outline-none focus:border-[#DC2626]"
            />
          </div>

          <div className="flex items-center gap-3 pt-1">
            <input 
              type="checkbox"
              id="complianceCheck"
              checked={isCompliance}
              onChange={(e) => setIsCompliance(e.target.checked)}
              className="accent-[#DC2626] w-4 h-4 rounded"
            />
            <label htmlFor="complianceCheck" className="text-xs text-[#4B5563] cursor-pointer">
              Tag as <span className="text-[#DC2626] font-semibold">Mandatory Compliance Course</span> (Automatically generates annual recertification countdown and official certificate).
            </label>
          </div>
        </div>

        {/* Modules Sequencing Studio */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#DC2626]">
              2. Sequenced Modules & Automated Rubrics ({modules.length})
            </h2>
            <span className="text-xs text-[#4B5563]">
              Enforces sequential prerequisite locking for learners
            </span>
          </div>

          {/* Existing Modules List */}
          <div className="space-y-2.5">
            {modules.map((mod, idx) => (
              <div 
                key={mod.id}
                className="p-4 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3 truncate">
                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[#DC2626] shrink-0 border border-[#E5E7EB]">
                    {mod.type === 'video' && <Video className="w-4 h-4" />}
                    {mod.type === 'pdf' && <FileText className="w-4 h-4" />}
                    {mod.type === 'scorm_xapi' && <Layers className="w-4 h-4 text-[#DC2626]" />}
                    {mod.type === 'quiz' && <HelpCircle className="w-4 h-4 text-[#DC2626]" />}
                  </div>
                  <div className="truncate">
                    <div className="text-xs font-semibold text-[#1F2937] truncate">
                      {idx + 1}. {mod.title}
                    </div>
                    <div className="text-[10px] text-[#4B5563] capitalize">
                      {mod.type.replace('_', ' ')} &bull; {mod.duration}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveModule(mod.id)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-[#DC2626] hover:bg-red-50 transition-colors cursor-pointer"
                  title="Remove Module"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Add Module Box */}
          <div className="p-4 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] border-dashed space-y-3">
            <div className="text-xs font-bold text-[#1F2937] flex items-center gap-1.5">
              <PlusCircle className="w-4 h-4 text-[#DC2626]" /> Append New Learning Module
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] text-[#4B5563] mb-1">Module Format</label>
                <select
                  value={newModType}
                  onChange={(e: any) => setNewModType(e.target.value)}
                  className="w-full bg-white border border-[#E5E7EB] rounded-lg px-2.5 py-1.5 text-xs text-[#1F2937] focus:outline-none focus:border-[#DC2626]"
                >
                  <option value="video">Video Lecture</option>
                  <option value="pdf">Reading / Architecture Guide</option>
                  <option value="scorm_xapi">SCORM / xAPI Simulation</option>
                  <option value="quiz">Automated Quiz Assessment</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] text-[#4B5563] mb-1">Module Title</label>
                <input 
                  type="text"
                  value={newModTitle}
                  onChange={(e) => setNewModTitle(e.target.value)}
                  placeholder="e.g. Module 3: HNSW Distance Benchmark Lab"
                  className="w-full bg-white border border-[#E5E7EB] rounded-lg px-3 py-1.5 text-xs text-[#1F2937] placeholder-gray-400 focus:outline-none focus:border-[#DC2626]"
                />
              </div>

              <div>
                <label className="block text-[11px] text-[#4B5563] mb-1">Est. Duration</label>
                <input 
                  type="text"
                  value={newModDuration}
                  onChange={(e) => setNewModDuration(e.target.value)}
                  placeholder="15:00 or 10 min read"
                  className="w-full bg-white border border-[#E5E7EB] rounded-lg px-3 py-1.5 text-xs text-[#1F2937] placeholder-gray-400 focus:outline-none focus:border-[#DC2626]"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddModule}
              className="bg-red-50 hover:bg-red-100 text-[#DC2626] border border-red-200 text-xs font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" /> Append Module to Curriculum
            </button>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => setCurrentView('courses')}
            className="px-4 py-2.5 rounded-xl text-xs font-medium text-[#4B5563] hover:text-[#1F2937] cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-semibold px-6 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" /> Save & Activate Course
          </button>
        </div>

      </form>

    </div>
  );
};
