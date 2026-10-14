import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';
import { ComplianceCertificate } from '../../types/lms';
import { 
  ShieldCheck, 
  Award, 
  Clock, 
  Download, 
  Printer, 
  X, 
  QrCode, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Calendar, 
  Lock 
} from 'lucide-react';
import { CertificateModal } from '../certificate/CertificateModal';
import { CertificateData } from '../certificate/CertificateTemplate';

export const ComplianceModule: React.FC = () => {
  const { certificates, renewCertificate, user, courses, setCurrentView } = useLMS();

  const [selectedCertData, setSelectedCertData] = useState<CertificateData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePrintCertificate = () => {
    window.print();
  };

  return (
    <div className="space-y-6 text-[#1F2937]">
      
      {/* Header */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-50 text-[#DC2626] border border-red-200 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" /> Corporate Accreditation & Compliance Directorate
          </div>
          <h1 className="text-2xl font-bold text-[#1F2937] flex items-center gap-2">
            <Award className="w-6 h-6 text-[#DC2626]" />
            Compliance Certifications & Official Credentials
          </h1>
          <p className="text-xs text-[#4B5563] mt-1">
            Verifiable compliance credentials required for SOC 2 Type II, ISO 27001, and regulatory database access authorizations.
          </p>
        </div>

        <div className="text-right">
          <div className="text-xs text-[#4B5563]">Active Issued Certificates</div>
          <div className="text-xl font-bold text-[#1F2937] mt-0.5">{certificates.length} Credentials</div>
        </div>
      </div>

      {/* Certificates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {certificates.map((cert) => {
          const isExpiringSoon = cert.status === 'expiring_soon';

          return (
            <div 
              key={cert.id}
              className="bg-white border border-[#E5E7EB] rounded-2xl p-6 space-y-4 hover:border-red-300 transition-all flex flex-col justify-between shadow-xs"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold text-[#DC2626]">
                    {cert.certificateNumber}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                    cert.status === 'active'
                      ? 'bg-green-50 text-green-700 border-green-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    {cert.status === 'active' ? 'Active & Valid' : 'Expiring Soon (Refresher Due)'}
                  </span>
                </div>

                <h3 className="font-bold text-[#1F2937] text-base leading-snug">
                  {cert.courseTitle}
                </h3>

                <div className="p-3 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] space-y-1.5 text-xs text-[#1F2937]">
                  <div className="flex justify-between">
                    <span className="text-[#4B5563]">Certified Recipient:</span>
                    <span className="font-semibold text-[#1F2937]">{cert.studentName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#4B5563]">Issued On:</span>
                    <span>{cert.issuedAt}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#4B5563]">Valid Through:</span>
                    <span className={isExpiringSoon ? 'text-amber-600 font-semibold' : ''}>
                      {cert.expiresAt}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#4B5563]">Issuer Authority:</span>
                    <span className="text-[11px] text-[#4B5563] truncate max-w-[180px]">{cert.issuer}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E5E7EB] flex items-center justify-between gap-3">
                <button
                  onClick={() => {
                    const certData: CertificateData = {
                      certificateId: cert.certificateNumber,
                      recipientName: cert.studentName,
                      courseTitle: cert.courseTitle,
                      issueDate: cert.issuedAt,
                      directorName: 'Dr. Priya Sharma',
                      directorTitle: 'CEO & Academic Dean',
                      instructorName: 'Rahul Verma',
                      instructorTitle: 'Head of Academic Programs',
                      verificationUrl: `${window.location.origin}/verify/${cert.certificateNumber}`
                    };
                    setSelectedCertData(certData);
                    setIsModalOpen(true);
                  }}
                  className="bg-red-50 hover:bg-red-100 text-[#DC2626] border border-red-200 text-xs font-semibold py-2 px-4 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Award className="w-3.5 h-3.5" /> Inspect Official Certificate
                </button>

                {isExpiringSoon && (
                  <button
                    onClick={() => renewCertificate(cert.id)}
                    className="bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-semibold py-2 px-4 rounded-xl transition-all shadow-xs cursor-pointer"
                  >
                    1-Click Recertify
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Official A4 Landscape Certificate Modal Preview & Download */}
      {selectedCertData && (
        <CertificateModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedCertData(null);
          }}
          data={selectedCertData}
          onViewVerification={(certId) => {
            setIsModalOpen(false);
            setSelectedCertData(null);
            setCurrentView('verify_certificate');
          }}
        />
      )}

    </div>
  );
};
