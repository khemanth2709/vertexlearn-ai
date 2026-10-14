import React, { useState } from 'react';
import { CertificateTemplate, CertificateData } from './CertificateTemplate';
import { generateCertificatePdf } from '../../utils/certificatePdfGenerator';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: CertificateData;
  onViewVerification?: (certId: string) => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  data,
  onViewVerification
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDownload = async () => {
    setIsDownloading(true);
    setErrorMessage(null);
    try {
      const cleanName = data.recipientName.replace(/[^a-zA-Z0-9]/g, '_');
      const cleanCourse = data.courseTitle.replace(/[^a-zA-Z0-9]/g, '_');
      const fileName = `VertexLearn_Certificate_${cleanCourse}_${cleanName}.pdf`;

      const result = await generateCertificatePdf('vertexlearn-certificate-modal-view', {
        fileName
      });

      if (result.success) {
        setDownloadSuccess(true);
        setTimeout(() => setDownloadSuccess(false), 5000);
      } else {
        setErrorMessage(result.error || 'Could not compile PDF.');
      }
    } catch (e: unknown) {
      setErrorMessage(e instanceof Error ? e.message : 'Error generating certificate PDF');
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-6xl w-full max-h-[94vh] flex flex-col shadow-2xl border border-[#E2E8F0] overflow-hidden animate-in fade-in zoom-in-95">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] bg-slate-50">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎓</span>
            <div>
              <h2 className="text-base font-bold text-[#0F172A] leading-tight">
                Official Certificate of Completion
              </h2>
              <p className="text-xs text-[#64748B]">
                Accredited by VertexLearn AI Directorate &bull; Credential ID: {data.certificateId}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Verification Button */}
            {onViewVerification && (
              <button
                onClick={() => {
                  onClose();
                  onViewVerification(data.certificateId);
                }}
                className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-blue-50 text-[#0284C7] hover:bg-blue-100 border border-blue-200 transition-colors cursor-pointer flex items-center gap-1.5"
                title="Open Public Verification Page"
              >
                <span>🔍</span> Public Verification
              </button>
            )}

            {/* Print Button */}
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 text-[#334155] hover:bg-slate-200 border border-slate-200 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>🖨️</span> Print
            </button>

            {/* Download PDF Button */}
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="px-4 py-1.5 text-xs font-bold rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-white shadow-xs transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-60"
            >
              <span>{isDownloading ? '⏳' : '📥'}</span>
              <span>{isDownloading ? 'Rendering A4 PDF...' : 'Download A4 PDF'}</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-200 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <span className="text-lg leading-none">✕</span>
            </button>
          </div>
        </div>

        {/* Alerts */}
        {downloadSuccess && (
          <div className="px-6 py-2.5 bg-green-50 border-b border-green-200 text-green-700 text-xs font-semibold flex items-center gap-2">
            <span>✅</span>
            <span>A4 Landscape PDF generated and downloaded successfully!</span>
          </div>
        )}
        {errorMessage && (
          <div className="px-6 py-2.5 bg-red-50 border-b border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
            <span>⚠️</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Certificate Scaled Preview Viewport */}
        <div className="flex-1 overflow-auto p-4 sm:p-8 bg-slate-100 flex items-center justify-center">
          <div className="transform scale-[0.55] sm:scale-[0.7] md:scale-[0.8] lg:scale-[0.95] origin-top my-4">
            <CertificateTemplate
              id="vertexlearn-certificate-modal-view"
              data={data}
            />
          </div>
        </div>

        {/* Modal Footer Info */}
        <div className="px-6 py-3 border-t border-[#E2E8F0] bg-slate-50 flex items-center justify-between text-xs text-[#64748B]">
          <div>
            Verified standard: <strong className="text-[#0F172A]">A4 Landscape (297 × 210 mm) at 300 DPI</strong>
          </div>
          <div>
            Verification Link: <code className="bg-slate-200 px-1.5 py-0.5 rounded text-[11px] text-[#0F172A]">{data.verificationUrl}</code>
          </div>
        </div>

      </div>
    </div>
  );
};
