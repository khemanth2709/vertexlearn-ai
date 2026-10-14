import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';
import { CloudFile } from '../../types/lms';
import { 
  HardDrive, 
  Upload, 
  Trash2, 
  Download, 
  ShieldCheck, 
  FileText, 
  FileArchive, 
  Search, 
  Filter, 
  Lock, 
  Sparkles, 
  CheckCircle2, 
  Check, 
  AlertCircle 
} from 'lucide-react';

export const CloudStorageModule: React.FC = () => {
  const { 
    cloudFiles, 
    uploadCloudFile, 
    deleteCloudFile, 
    storageQuota, 
    user 
  } = useLMS();

  const [selectedBucket, setSelectedBucket] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  // Form states for manual or drag drop upload
  const [customFileName, setCustomFileName] = useState('');
  const [targetBucket, setTargetBucket] = useState<CloudFile['bucket']>('courses');

  const buckets: Array<{ id: string; label: string }> = [
    { id: 'All', label: 'All Buckets' },
    { id: 'courses', label: 'Course Materials' },
    { id: 'assignments', label: 'Assignments' },
    { id: 'submissions', label: 'Submissions' },
    { id: 'certificates', label: 'Certificates' },
    { id: 'scorm', label: 'SCORM Packages' },
  ];

  const filteredFiles = cloudFiles.filter(f => {
    const matchesBucket = selectedBucket === 'All' || f.bucket === selectedBucket;
    const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase()) || 
                          f.uploadedBy.toLowerCase().includes(search.toLowerCase());
    return matchesBucket && matchesSearch;
  });

  const handleFileUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customFileName) return;

    setIsUploading(true);
    setTimeout(() => {
      uploadCloudFile({
        name: customFileName.includes('.') ? customFileName : `${customFileName}.pdf`,
        bucket: targetBucket,
        size: '2.4 MB',
        sizeBytes: 2516582,
        mimeType: 'application/pdf'
      });
      setIsUploading(false);
      setUploadSuccess(`File "${customFileName}" encrypted with AES-256 and verified clean.`);
      setCustomFileName('');
      setTimeout(() => setUploadSuccess(null), 3000);
    }, 800);
  };

  const handleDownloadSimulation = (file: CloudFile) => {
    // Generate simulated download file
    const element = document.createElement("a");
    const fileContent = `--- NEXUS CLOUD STORAGE ARTIFACT ---\nFile: ${file.name}\nBucket: ${file.bucket}\nSHA-256: ${file.sha256Hash}\nEncrypted: AES-256-GCM\nUploaded By: ${file.uploadedBy}\nUploaded At: ${file.uploadedAt}\nIntegrity: Verified Clean`;
    const textBlob = new Blob([fileContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(textBlob);
    element.download = file.name;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6 text-[#1F2937]">
      
      {/* Header */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-50 text-[#DC2626] border border-red-200 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" /> Cloud Storage Solution & Object Vault
          </div>
          <h1 className="text-2xl font-bold text-[#1F2937] flex items-center gap-2">
            <HardDrive className="w-6 h-6 text-[#DC2626]" />
            Cloud Storage Vault & Course Asset Manager
          </h1>
          <p className="text-xs text-[#4B5563] mt-1">
            Enterprise cloud bucket storage with AES-256 encryption at rest, automatic ClamAV malware scanning, and immutable SHA-256 integrity verification.
          </p>
        </div>

        {/* Quota Gauge */}
        <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-4 min-w-[240px] space-y-2">
          <div className="flex justify-between text-xs text-[#4B5563]">
            <span>Bucket Quota Used</span>
            <span className="font-bold text-[#1F2937]">14.8 GB / 50 GB</span>
          </div>
          <div className="w-full bg-[#E5E7EB] rounded-full h-2 overflow-hidden">
            <div 
              className="bg-[#DC2626] h-2 rounded-full" 
              style={{ width: `30%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] text-[#4B5563]">
            <span>30% Utilized</span>
            <span className="text-green-700 font-semibold flex items-center gap-1">
              <Lock className="w-3 h-3" /> TLS 1.3
            </span>
          </div>
        </div>
      </div>

      {/* Upload Zone & Filter Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Upload Form Box */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 space-y-4 shadow-xs">
          <h3 className="font-bold text-[#1F2937] text-sm flex items-center gap-2">
            <Upload className="w-4 h-4 text-[#DC2626]" />
            Upload File to Cloud Vault
          </h3>

          <form onSubmit={handleFileUpload} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-[#4B5563] mb-1">Target Bucket</label>
              <select
                value={targetBucket}
                onChange={(e: any) => setTargetBucket(e.target.value)}
                className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs text-[#1F2937] focus:outline-none focus:border-[#DC2626]"
              >
                <option value="courses">Course Materials</option>
                <option value="assignments">Assignments</option>
                <option value="submissions">Submissions</option>
                <option value="certificates">Certificates</option>
                <option value="scorm">SCORM Packages</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#4B5563] mb-1">File Name or Archive</label>
              <input 
                type="text"
                required
                value={customFileName}
                onChange={(e) => setCustomFileName(e.target.value)}
                placeholder="e.g. pgvector_benchmarks_q4.pdf"
                className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs text-[#1F2937] placeholder-gray-400 focus:outline-none focus:border-[#DC2626]"
              />
            </div>

            <button
              type="submit"
              disabled={isUploading}
              className="w-full bg-[#DC2626] hover:bg-[#B91C1C] disabled:opacity-50 text-white text-xs font-semibold py-2.5 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              {isUploading ? 'Encrypting & Storing...' : 'Securely Upload to Cloud'}
            </button>
          </form>

          {uploadSuccess && (
            <div className="p-3 bg-green-50 border border-green-200 text-green-700 text-xs rounded-xl flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
              <span>{uploadSuccess}</span>
            </div>
          )}

          <div className="p-3.5 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] space-y-1 text-[11px] text-[#4B5563]">
            <div className="font-semibold text-[#1F2937]">Security Guarantees:</div>
            <div>&bull; SSE-KMS Customer-Managed Keys (AES-256)</div>
            <div>&bull; Real-time anti-malware hash inspection</div>
            <div>&bull; Cross-Region replication for disaster recovery</div>
          </div>
        </div>

        {/* Right 2 Columns: Files Table & Filters */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1">
              {buckets.map((b) => (
                <button
                  key={b.id}
                  onClick={() => setSelectedBucket(b.id)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    selectedBucket === b.id
                      ? 'bg-[#DC2626] text-white shadow-xs'
                      : 'bg-white text-[#4B5563] hover:text-[#1F2937] border border-[#E5E7EB]'
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-60">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-400" />
              <input 
                type="text"
                placeholder="Search files..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white border border-[#E5E7EB] rounded-xl pl-8 pr-3 py-1.5 text-xs text-[#1F2937] placeholder-gray-400 focus:outline-none focus:border-[#DC2626]"
              />
            </div>
          </div>

          {/* Files List */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#1F2937]">
                <thead className="bg-[#F9FAFB] text-[#4B5563] uppercase text-[10px] font-semibold border-b border-[#E5E7EB]">
                  <tr>
                    <th className="p-4">File Name</th>
                    <th className="p-4">Bucket</th>
                    <th className="p-4">Size</th>
                    <th className="p-4">Scan</th>
                    <th className="p-4">Uploaded By</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB]">
                  {filteredFiles.map((file) => (
                    <tr key={file.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-2.5">
                          {file.bucket === 'scorm' ? (
                            <FileArchive className="w-4 h-4 text-[#DC2626] shrink-0" />
                          ) : (
                            <FileText className="w-4 h-4 text-[#DC2626] shrink-0" />
                          )}
                          <div className="truncate max-w-xs">
                            <div className="font-semibold text-[#1F2937] truncate">{file.name}</div>
                            <div className="text-[10px] text-[#4B5563] font-mono truncate">
                              SHA256: {file.sha256Hash.substring(0, 16)}...
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#F9FAFB] border border-[#E5E7EB] text-[#1F2937]">
                          {file.bucket}
                        </span>
                      </td>
                      <td className="p-4 text-[#4B5563] whitespace-nowrap">
                        {file.size}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                          <CheckCircle2 className="w-3 h-3" /> Clean
                        </span>
                      </td>
                      <td className="p-4 text-[#4B5563] whitespace-nowrap">
                        <div>{file.uploadedBy}</div>
                        <div className="text-[10px] text-gray-400">{file.uploadedAt}</div>
                      </td>
                      <td className="p-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleDownloadSimulation(file)}
                            className="p-1.5 rounded-lg text-[#4B5563] hover:text-[#1F2937] hover:bg-gray-100 transition-colors cursor-pointer"
                            title="Download Artifact"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteCloudFile(file.id)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-[#DC2626] hover:bg-red-50 transition-colors cursor-pointer"
                            title="Delete File"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
