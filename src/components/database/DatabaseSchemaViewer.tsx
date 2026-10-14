import React, { useState } from 'react';
import { POSTGRESQL_CORE_TABLES, INDEXING_STRATEGY, DDLTable } from '../../data/databaseSchemaData';

export const DatabaseSchemaViewer: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeTable, setActiveTable] = useState<DDLTable>(POSTGRESQL_CORE_TABLES[0]);
  const [activeSubTab, setActiveSubTab] = useState<'ddl' | 'sample' | 'indexing' | 'architecture'>('ddl');
  const [copiedTable, setCopiedTable] = useState<string | null>(null);

  const categories = [
    'ALL',
    'USERS & AUTH',
    'COURSES',
    'ENROLLMENT & PROGRESS',
    'ASSIGNMENTS',
    'QUIZZES',
    'GAMIFICATION',
    'AI TUTOR & VECTOR STORE',
    'RECOMMENDATIONS',
    'DISCUSSIONS & COMMS',
    'ADMIN & GOVERNANCE'
  ];

  const filteredTables = POSTGRESQL_CORE_TABLES.filter((t) => {
    const matchesCategory = selectedCategory === 'ALL' || t.category === selectedCategory;
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCopyDDL = (ddl: string, name: string) => {
    navigator.clipboard.writeText(ddl);
    setCopiedTable(name);
    setTimeout(() => setCopiedTable(null), 2000);
  };

  const handleCopyAllDDL = () => {
    const allDDL = POSTGRESQL_CORE_TABLES.map(t => `-- ${t.name.toUpperCase()} (${t.category})\n${t.ddl}`).join('\n\n');
    navigator.clipboard.writeText(allDDL);
    setCopiedTable('ALL');
    setTimeout(() => setCopiedTable(null), 2000);
  };

  return (
    <div className="space-y-6 text-[#1F2937]">
      
      {/* Top Banner */}
      <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 lg:p-8 relative overflow-hidden shadow-xs">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-[#DC2626] border border-red-200 text-xs font-semibold">
              <span>🗄️</span> Section 7: Authoritative PostgreSQL & pgvector Schema Design
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] tracking-tight">
              PostgreSQL Relational Schema & Vector Store
            </h1>
            <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">
              Relational system of record with <strong className="text-[#1F2937]">32 Production DDL Tables</strong>, 
              <strong className="text-[#DC2626]"> pgvector (1536-dim embeddings)</strong> for RAG semantic search, 
              B-tree & IVFFlat indexing strategies, and strict relational integrity across 
              Students, Instructors, and Platform Admins.
            </p>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 border-t sm:border-t-0 sm:border-l border-[#E5E7EB] pt-4 sm:pt-0 sm:pl-6 shrink-0">
            <div className="text-left sm:text-right">
              <div className="text-2xl font-black text-[#DC2626] flex items-center sm:justify-end gap-1.5">
                32 Tables
              </div>
              <div className="text-[11px] text-[#6B7280]">10 Functional Domains</div>
            </div>
            <button
              onClick={handleCopyAllDDL}
              className="px-3.5 py-1.5 rounded-xl bg-[#DC2626] hover:bg-red-700 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-xs"
            >
              {copiedTable === 'ALL' ? (
                <>
                  <span>✓</span> Copied Full DDL
                </>
              ) : (
                <>
                  <span>📋</span> Export All DDL (.sql)
                </>
              )}
            </button>
          </div>
        </div>

        {/* Sub-Tabs Navigation */}
        <div className="flex gap-2 border-t border-[#E5E7EB] mt-6 pt-4 overflow-x-auto">
          <button
            onClick={() => setActiveSubTab('ddl')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeSubTab === 'ddl'
                ? 'bg-[#DC2626] text-white shadow-xs'
                : 'bg-[#F9FAFB] text-[#4B5563] hover:text-[#1F2937] border border-[#E5E7EB]'
            }`}
          >
            <span>💻</span> DDL Table Definitions ({POSTGRESQL_CORE_TABLES.length})
          </button>
          <button
            onClick={() => setActiveSubTab('sample')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeSubTab === 'sample'
                ? 'bg-[#DC2626] text-white shadow-xs'
                : 'bg-[#F9FAFB] text-[#4B5563] hover:text-[#1F2937] border border-[#E5E7EB]'
            }`}
          >
            <span>📊</span> Live Relational Records Explorer
          </button>
          <button
            onClick={() => setActiveSubTab('indexing')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeSubTab === 'indexing'
                ? 'bg-[#DC2626] text-white shadow-xs'
                : 'bg-[#F9FAFB] text-[#4B5563] hover:text-[#1F2937] border border-[#E5E7EB]'
            }`}
          >
            <span>⚡</span> Indexing & Performance Strategy
          </button>
          <button
            onClick={() => setActiveSubTab('architecture')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeSubTab === 'architecture'
                ? 'bg-[#DC2626] text-white shadow-xs'
                : 'bg-[#F9FAFB] text-[#4B5563] hover:text-[#1F2937] border border-[#E5E7EB]'
            }`}
          >
            <span>🏗️</span> System of Record vs Vector/Redis
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: DDL TABLE EXPLORER */}
      {activeSubTab === 'ddl' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Tables Sidebar */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Filter & Search */}
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 space-y-3 shadow-xs">
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-[#9CA3AF]">🔍</span>
                <input
                  type="text"
                  placeholder="Filter 32 core tables..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl text-xs text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:border-[#DC2626]"
                />
              </div>

              {/* Categories Carousel */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 max-w-full">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all ${
                      selectedCategory === cat
                        ? 'bg-[#DC2626] text-white shadow-xs'
                        : 'bg-[#F9FAFB] text-[#4B5563] hover:text-[#1F2937] border border-[#E5E7EB]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Tables List */}
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-2 space-y-1.5 max-h-[640px] overflow-y-auto shadow-xs">
              {filteredTables.map((tbl) => {
                const isSelected = activeTable.name === tbl.name;
                return (
                  <button
                    key={tbl.name}
                    onClick={() => setActiveTable(tbl)}
                    className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between gap-2 border ${
                      isSelected
                        ? 'bg-red-50/60 border-[#DC2626] text-[#1F2937] shadow-xs'
                        : 'bg-[#F9FAFB] hover:bg-gray-100 border-[#E5E7EB] text-[#4B5563]'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`font-mono text-xs font-bold ${isSelected ? 'text-[#DC2626]' : 'text-[#1F2937]'}`}>
                          {tbl.name}
                        </span>
                        {tbl.name === 'document_chunks' && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-red-50 text-[#DC2626] border border-red-200">
                            pgvector
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-[#6B7280] truncate mt-0.5">
                        {tbl.category} • {tbl.columnsCount} columns
                      </div>
                    </div>
                    <span className={`text-xs shrink-0 ${isSelected ? 'text-[#DC2626]' : 'text-[#9CA3AF]'}`}>
                      →
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: DDL Detail View */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 space-y-4 shadow-xs">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E5E7EB]">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-mono font-bold text-[#1F2937]">{activeTable.name}</h2>
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-[#DC2626] border border-red-200">
                      {activeTable.category}
                    </span>
                  </div>
                  <p className="text-xs text-[#4B5563] mt-1 leading-relaxed">
                    {activeTable.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleCopyDDL(activeTable.ddl, activeTable.name)}
                    className="px-3 py-1.5 rounded-lg bg-[#F9FAFB] hover:bg-gray-100 border border-[#E5E7EB] text-xs font-semibold text-[#DC2626] flex items-center gap-1.5 transition-all"
                  >
                    {copiedTable === activeTable.name ? (
                      <>
                        <span>✓</span> Copied DDL
                      </>
                    ) : (
                      <>
                        <span>📋</span> Copy SQL
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Table Metadata Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#6B7280] tracking-wider">Primary Key</span>
                  <div className="text-xs font-mono font-semibold text-[#1F2937] truncate">{activeTable.primaryKey}</div>
                </div>
                <div className="p-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#6B7280] tracking-wider">Foreign Keys</span>
                  <div className="text-xs font-mono font-semibold text-[#DC2626] truncate">
                    {activeTable.foreignKeys.length > 0 ? activeTable.foreignKeys.join(', ') : 'None (Root Entity)'}
                  </div>
                </div>
                <div className="p-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#6B7280] tracking-wider">Estimated Live Rows</span>
                  <div className="text-xs font-semibold text-emerald-600">
                    {activeTable.sampleRowsCount.toLocaleString()} rows in memory
                  </div>
                </div>
              </div>

              {/* SQL Syntax Highlighting Box */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-[#6B7280]">
                  <span className="font-mono font-semibold text-[#DC2626]">PostgreSQL DDL Specification</span>
                  <span className="text-[11px] text-[#9CA3AF]">ANSI SQL-92 / PostgreSQL 15+ compatible</span>
                </div>
                <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-4 overflow-x-auto font-mono text-xs text-[#1F2937] leading-relaxed shadow-inner">
                  <pre>{activeTable.ddl}</pre>
                </div>
              </div>

              {/* Seed Data Preview for this table */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-[#1F2937] flex items-center gap-1.5">
                  <span>📊</span> Seed Sample Rows
                </span>
                <div className="overflow-x-auto border border-[#E5E7EB] rounded-xl">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-[#F9FAFB] text-[#4B5563] border-b border-[#E5E7EB]">
                      <tr>
                        {Object.keys(activeTable.sampleData[0] || {}).map((col) => (
                          <th key={col} className="p-2.5 font-semibold text-[11px] whitespace-nowrap">{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E7EB] bg-white">
                      {activeTable.sampleData.map((row, idx) => (
                        <tr key={idx} className="hover:bg-[#F9FAFB] transition-colors">
                          {Object.values(row).map((val, cIdx) => (
                            <td key={cIdx} className="p-2.5 text-[#4B5563] text-[11px] whitespace-nowrap max-w-xs truncate">
                              {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* SUB-TAB 2: LIVE RELATIONAL RECORDS EXPLORER */}
      {activeSubTab === 'sample' && (
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-[#1F2937] flex items-center gap-2">
                <span>📊</span> Relational Records Multi-Table Viewer
              </h2>
              <p className="text-xs text-[#6B7280] mt-1">
                Live verified seed datasets powering the LMS-AI client and persistence layer.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#6B7280] font-semibold">Select Table:</span>
              <select
                value={activeTable.name}
                onChange={(e) => {
                  const found = POSTGRESQL_CORE_TABLES.find(t => t.name === e.target.value);
                  if (found) setActiveTable(found);
                }}
                className="bg-[#F9FAFB] border border-[#E5E7EB] text-[#1F2937] text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-[#DC2626] font-mono font-bold"
              >
                {POSTGRESQL_CORE_TABLES.map(t => (
                  <option key={t.name} value={t.name}>{t.name} ({t.category})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto border border-[#E5E7EB] rounded-2xl">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#F9FAFB] text-[#4B5563] border-b border-[#E5E7EB]">
                <tr>
                  {Object.keys(activeTable.sampleData[0] || {}).map((col) => (
                    <th key={col} className="p-3 font-semibold text-xs whitespace-nowrap">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB] bg-white">
                {activeTable.sampleData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-[#F9FAFB] transition-colors">
                    {Object.values(row).map((val, cIdx) => (
                      <td key={cIdx} className="p-3 text-[#4B5563] text-xs whitespace-nowrap">
                        {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl flex items-center justify-between text-xs">
            <span className="text-[#6B7280]">
              Showing sample records for <span className="font-mono text-[#DC2626] font-bold">{activeTable.name}</span>. Total table cardinality: <strong className="text-[#1F2937]">{activeTable.sampleRowsCount.toLocaleString()}</strong>.
            </span>
            <button
              onClick={() => handleCopyDDL(activeTable.ddl, activeTable.name)}
              className="text-[#DC2626] hover:underline font-bold flex items-center gap-1"
            >
              Copy DDL <span>→</span>
            </button>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: INDEXING STRATEGY */}
      {activeSubTab === 'indexing' && (
        <div className="space-y-6">
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 space-y-4 shadow-xs">
            <h2 className="text-lg font-bold text-[#1F2937] flex items-center gap-2">
              <span>⚡</span> 7.3 High-Scale Indexing & Query Acceleration Strategy
            </h2>
            <p className="text-xs text-[#4B5563] leading-relaxed">
              Designed to satisfy the non-functional requirement of <strong className="text-[#DC2626]">sub-300ms p95 API latency</strong> and 
              <strong className="text-[#DC2626]"> sub-10 second AI tutor doubt resolution</strong> under high concurrent traffic.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {INDEXING_STRATEGY.map((idx, i) => (
                <div key={i} className="p-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#1F2937]">{idx.type}</span>
                    <span className="text-[10px] font-mono text-[#DC2626] bg-red-50 px-2 py-0.5 rounded border border-red-200">
                      {idx.target}
                    </span>
                  </div>
                  <div className="p-2.5 bg-white border border-[#E5E7EB] rounded-lg font-mono text-[11px] text-[#1F2937] overflow-x-auto">
                    <code>{idx.definition}</code>
                  </div>
                  <p className="text-xs text-[#4B5563] leading-relaxed">
                    {idx.purpose}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: ARCHITECTURE: SYSTEM OF RECORD VS VECTOR & CACHING */}
      {activeSubTab === 'architecture' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* System of Record (PostgreSQL) */}
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 space-y-4 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-xl">
                🗄️
              </div>
              <h3 className="text-base font-bold text-[#1F2937]">1. System of Record (PostgreSQL)</h3>
              <p className="text-xs text-[#4B5563] leading-relaxed">
                PostgreSQL is the single authoritative source of truth. ACID transactions ensure consistent enrollments, user identity, assignments, grades, certificates, and immutable audit logs.
              </p>
              <ul className="text-xs text-[#6B7280] space-y-1.5 list-disc list-inside">
                <li>32 normalized relational entities</li>
                <li>Strict foreign key cascades</li>
                <li>JSONB schemas for rubrics & plans</li>
                <li>Audit logging and FERPA compliance</li>
              </ul>
            </div>

            {/* Vector Store (pgvector) */}
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 space-y-4 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-xl">
                ⚡
              </div>
              <h3 className="text-base font-bold text-[#1F2937]">2. Vector Database (pgvector)</h3>
              <p className="text-xs text-[#4B5563] leading-relaxed">
                Embedded directly into PostgreSQL via the <code className="text-emerald-700 font-bold">pgvector</code> extension. Keeps course transcripts, lecture chunks, and 1536-dimensional embeddings co-located with relational course metadata.
              </p>
              <ul className="text-xs text-[#6B7280] space-y-1.5 list-disc list-inside">
                <li>1536-dimensional float vectors</li>
                <li>IVFFlat cosine distance indexing</li>
                <li>Grounded source citations</li>
                <li>Zero out-of-sync multi-database lag</li>
              </ul>
            </div>

            {/* Caching & Queues (Redis) */}
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 space-y-4 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-xl">
                🔄
              </div>
              <h3 className="text-base font-bold text-[#1F2937]">3. Redis Caching & Job Queues</h3>
              <p className="text-xs text-[#4B5563] leading-relaxed">
                Explicitly used as a transient caching layer and asynchronous background job queue (BullMQ/Celery), NOT as a system of record.
              </p>
              <ul className="text-xs text-[#6B7280] space-y-1.5 list-disc list-inside">
                <li>Catalog listing & metadata cache</li>
                <li>Streak leaderboard fast reads</li>
                <li>Transcript chunking worker queues</li>
                <li>Auto-quiz generation background jobs</li>
              </ul>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

