import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';

export interface CertificateData {
  certificateId: string;
  recipientName: string;
  courseTitle: string;
  courseCode?: string;
  issueDate: string;
  completionDate?: string;
  instructorName?: string;
  instructorTitle?: string;
  directorName?: string;
  directorTitle?: string;
  verificationUrl: string;
  grade?: string;
}

interface CertificateTemplateProps {
  data: CertificateData;
  className?: string;
  id?: string;
}

/**
 * Official VertexLearn AI Certificate of Completion
 * Exact reproduction of the approved white, deep-red and gold reference design.
 * Standard A4 Landscape: 297mm x 210mm (1.414 aspect ratio, 1122px x 794px canvas).
 */
export const CertificateTemplate: React.FC<CertificateTemplateProps> = ({
  data,
  className = '',
  id = 'vertexlearn-certificate-node'
}) => {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

  useEffect(() => {
    QRCode.toDataURL(data.verificationUrl || `${window.location.origin}/verify/${data.certificateId}`, {
      width: 140,
      margin: 1,
      color: {
        dark: '#0A0A0A',
        light: '#FFFFFF'
      }
    })
      .then(url => setQrCodeDataUrl(url))
      .catch(() => {});
  }, [data.verificationUrl, data.certificateId]);

  return (
    <div
      id={id}
      className={`relative bg-white text-[#0F172A] overflow-hidden select-none shadow-2xl font-sans ${className}`}
      style={{
        width: '1122px',
        height: '794px',
        minWidth: '1122px',
        minHeight: '794px',
        maxWidth: '1122px',
        maxHeight: '794px',
        boxSizing: 'border-box'
      }}
    >
      {/* ============================================================== */}
      {/* 1. SVG BACKGROUND DECORATIONS (CORNERS, BORDERS & WATERMARKS)  */}
      {/* ============================================================== */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
        viewBox="0 0 1122 794"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Subtle Guilloche Wave Pattern on Left */}
          <pattern id="guilloche-waves" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
            <path
              d="M0 20 Q30 0 60 20 T120 20 M0 40 Q30 20 60 40 T120 40 M0 60 Q30 40 60 60 T120 60 M0 80 Q30 60 60 80 T120 80 M0 100 Q30 80 60 100 T120 100"
              stroke="#B91C1C"
              strokeWidth="0.5"
              strokeOpacity="0.12"
              fill="none"
            />
          </pattern>
        </defs>

        {/* Guilloche Wave Background on Left Side */}
        <rect x="0" y="0" width="360" height="794" fill="url(#guilloche-waves)" opacity="0.8" />

        {/* Subtle Watermark Mortarboard on Right Side */}
        <g opacity="0.04" transform="translate(760, 220) scale(2.8)">
          <path d="M50 15 L95 35 L50 55 L5 35 Z" fill="#7F1D1D" />
          <path d="M22 43 L22 65 C22 78 78 78 78 65 L78 43 Z" fill="#7F1D1D" />
          <path d="M90 37 L98 56 L94 57 L87 39 Z" fill="#D97706" />
          <circle cx="96" cy="57" r="3" fill="#D97706" />
        </g>

        {/* Outer Red Hairline Framing Border */}
        <rect x="16" y="16" width="1090" height="762" stroke="#8A0A0A" strokeWidth="1.5" fill="none" />
        <rect x="20" y="20" width="1082" height="754" stroke="#C5A059" strokeWidth="0.8" fill="none" opacity="0.7" />

        {/* ============================================================== */}
        {/* TOP-LEFT MULTI-FACETED 3D RUBY RED CORNER WITH GOLD TRIM       */}
        {/* ============================================================== */}
        <polygon points="0,0 270,0 0,270" fill="#4C0505" />
        <polygon points="0,0 230,0 0,230" fill="#7A0909" />
        <polygon points="0,0 180,0 0,180" fill="#991B1B" />
        <polygon points="0,0 120,0 0,120" fill="#B91C1C" />
        <polygon points="0,0 60,0 0,60" fill="#DC2626" />
        {/* Gold Accent Framing Trims */}
        <line x1="0" y1="270" x2="270" y2="0" stroke="#C5A059" strokeWidth="3" />
        <line x1="0" y1="230" x2="230" y2="0" stroke="#D4AF37" strokeWidth="2" />
        <line x1="0" y1="180" x2="180" y2="0" stroke="#C5A059" strokeWidth="1.5" />

        {/* ============================================================== */}
        {/* BOTTOM-RIGHT MULTI-FACETED 3D RUBY RED CORNER WITH GOLD TRIM   */}
        {/* ============================================================== */}
        <polygon points="1122,794 852,794 1122,524" fill="#4C0505" />
        <polygon points="1122,794 892,794 1122,564" fill="#7A0909" />
        <polygon points="1122,794 942,794 1122,614" fill="#991B1B" />
        <polygon points="1122,794 1002,794 1122,674" fill="#B91C1C" />
        <polygon points="1122,794 1062,794 1122,734" fill="#DC2626" />
        {/* Gold Accent Framing Trims */}
        <line x1="852" y1="794" x2="1122" y2="524" stroke="#C5A059" strokeWidth="3" />
        <line x1="892" y1="794" x2="1122" y2="564" stroke="#D4AF37" strokeWidth="2" />
        <line x1="942" y1="794" x2="1122" y2="614" stroke="#C5A059" strokeWidth="1.5" />
      </svg>

      {/* ============================================================== */}
      {/* 2. INNER CONTENT LAYER                                         */}
      {/* ============================================================== */}
      <div className="relative z-20 w-full h-full flex flex-col justify-between px-24 py-10">
        
        {/* ------------------------------------------------------------ */}
        {/* Top Header: Logo & Right-Aligned Vertical Motto              */}
        {/* ------------------------------------------------------------ */}
        <div className="flex items-start justify-between">
          {/* Official Certificate Red-and-Dark Emblem & Wordmark */}
          <div className="flex items-center gap-3.5 pl-6 pt-1">
            <svg width="48" height="48" viewBox="0 0 100 100" fill="none" className="shrink-0 drop-shadow-sm">
              <polygon points="20,38 48,82 52,82 34,38" fill="#8B0000" />
              <polygon points="80,38 52,82 48,82 66,38" fill="#991B1B" />
              <polygon points="50,50 41,74 59,74" fill="#B91C1C" />
              <circle cx="50" cy="40" r="6" fill="#8B0000" />
              <polygon points="50,18 78,28 50 36 22 28" fill="#8B0000" />
              <path d="M34 30 L34 38 C34 43 66 43 66 38 L66 30 Z" fill="#7F1D1D" />
              <path d="M74 29 L80 38 L77 39 L72 31 Z" fill="#C5A059" />
              <circle cx="78.5" cy="39" r="2.5" fill="#C5A059" />
            </svg>
            <div className="flex flex-col">
              <div className="text-2xl font-bold tracking-tight leading-none text-[#0F172A]">
                Vertex<span className="text-[#8B0000]">Learn</span> <span className="text-[#8B0000] font-black">AI</span>
              </div>
              <span className="text-[10px] tracking-widest text-[#64748B] font-medium uppercase mt-1">
                Intelligent Learning Management System
              </span>
            </div>
          </div>

          {/* Top-Right Vertical Motto */}
          <div className="pr-6 text-right flex flex-col items-end text-[10px] font-bold tracking-[0.35em] text-[#64748B] uppercase leading-tight space-y-1">
            <span>L E A R N</span>
            <span>P R A C T I C E</span>
            <span>G R O W</span>
            <span>A C H I E V E</span>
          </div>
        </div>

        {/* ------------------------------------------------------------ */}
        {/* Certificate Heading & Title                                  */}
        {/* ------------------------------------------------------------ */}
        <div className="text-center my-0.5">
          <h1
            className="text-4xl font-extrabold tracking-[0.25em] text-[#800000] uppercase"
            style={{ fontFamily: "'Cinzel', 'Playfair Display', 'Times New Roman', serif" }}
          >
            CERTIFICATE
          </h1>
          <div className="flex items-center justify-center gap-3 mt-1">
            <span className="h-[1px] w-28 bg-[#C5A059]"></span>
            <span
              className="text-xs font-bold tracking-[0.3em] text-[#C5A059] uppercase font-serif"
            >
              — OF COMPLETION —
            </span>
            <span className="h-[1px] w-28 bg-[#C5A059]"></span>
          </div>
          <div className="text-[10px] font-bold tracking-[0.3em] text-[#64748B] uppercase mt-2.5">
            THIS IS TO CERTIFY THAT
          </div>
        </div>

        {/* ------------------------------------------------------------ */}
        {/* Dynamic Recipient Name (Calligraphy Script)                  */}
        {/* ------------------------------------------------------------ */}
        <div className="text-center my-1">
          <div
            className="text-5xl lg:text-6xl font-normal text-[#800000] inline-block px-10 leading-tight select-text"
            style={{
              fontFamily: "'Alex Brush', 'Great Vibes', 'Playfair Display', cursive",
              textShadow: '0 1px 2px rgba(128, 0, 0, 0.08)'
            }}
          >
            {data.recipientName}
          </div>
          <div className="w-96 h-[1px] bg-[#C5A059] mx-auto mt-1 opacity-70"></div>
        </div>

        {/* ------------------------------------------------------------ */}
        {/* Course Completion Narrative                                  */}
        {/* ------------------------------------------------------------ */}
        <div className="text-center space-y-1 my-0.5">
          <div className="text-[10px] font-semibold tracking-[0.25em] text-[#64748B] uppercase">
            HAS SUCCESSFULLY COMPLETED THE
          </div>
          <div className="text-2xl font-black text-[#0F172A] tracking-tight">
            {data.courseTitle}
          </div>
          <div className="text-[11px] font-bold tracking-[0.2em] text-[#0F172A] uppercase">
            AN ONLINE COURSE OFFERED BY VERTEXLEARN AI
          </div>
          <p className="text-[11px] text-[#475569] max-w-2xl mx-auto leading-relaxed pt-0.5">
            This certifies the successful completion of all course requirements, including the lessons,
            assessments, and hands-on projects.
          </p>
        </div>

        {/* ------------------------------------------------------------ */}
        {/* Signatures, Medallion Seal, and Verification Column          */}
        {/* ------------------------------------------------------------ */}
        <div className="grid grid-cols-12 items-end pt-3 px-2">
          
          {/* Left Signature: Dr. Priya Sharma */}
          <div className="col-span-3 flex flex-col items-center text-center">
            <div
              className="text-2xl text-[#1E293B] h-10 flex items-end tracking-wider select-none"
              style={{ fontFamily: "'Alex Brush', 'Great Vibes', cursive" }}
            >
              Priya Sharma
            </div>
            <div className="w-40 h-[1px] bg-[#0F172A] my-1"></div>
            <div className="text-xs font-bold text-[#0F172A]">
              {data.directorName || 'Dr. Priya Sharma'}
            </div>
            <div className="text-[10px] text-[#64748B]">
              {data.directorTitle || 'CEO, VertexLearn AI'}
            </div>
          </div>

          {/* Center Column: 3D Golden Medallion Seal */}
          <div className="col-span-3 flex flex-col items-center justify-center relative">
            <div className="relative -mt-6">
              {/* 3D Gold Seal SVG */}
              <svg width="90" height="90" viewBox="0 0 100 100" fill="none" className="drop-shadow-lg">
                {/* Outer Fluted Gold Ring */}
                <circle cx="50" cy="50" r="46" fill="#C5A059" stroke="#9A7B38" strokeWidth="2" />
                <circle cx="50" cy="50" r="41" fill="#D4AF37" />
                <circle cx="50" cy="50" r="37" fill="#800000" stroke="#C5A059" strokeWidth="1.5" />
                <circle cx="50" cy="50" r="33" fill="#6B0505" />

                {/* Inner Emblem Icon in Gold */}
                <g transform="translate(28, 26) scale(0.44)">
                  <polygon points="50,18 78,28 50 36 22 28" fill="#FDE047" />
                  <path d="M34 30 L34 38 C34 43 66 43 66 38 L66 30 Z" fill="#EAB308" />
                  <polygon points="20,38 48,82 52,82 34,38" fill="#FDE047" />
                  <polygon points="80,38 52,82 48,82 66,38" fill="#FDE047" />
                  <circle cx="50" cy="42" r="7" fill="#FEF08A" />
                </g>

                {/* Laurel Leaves Surround */}
                <circle cx="50" cy="50" r="30" stroke="#C5A059" strokeWidth="1" strokeDasharray="3 3" fill="none" />
              </svg>

              {/* Hanging Red Ribbon Tails */}
              <svg
                width="90"
                height="36"
                viewBox="0 0 90 36"
                fill="none"
                className="absolute -bottom-6 left-0 pointer-events-none"
              >
                <polygon points="28,0 42,0 36,34 22,26 18,34" fill="#991B1B" />
                <line x1="18" y1="34" x2="36" y2="34" stroke="#C5A059" strokeWidth="1.2" />
                <polygon points="48,0 62,0 72,34 68,26 54,34" fill="#800000" />
                <line x1="54" y1="34" x2="72" y2="34" stroke="#C5A059" strokeWidth="1.2" />
              </svg>
            </div>
          </div>

          {/* Right Signature: Rahul Verma */}
          <div className="col-span-3 flex flex-col items-center text-center">
            <div
              className="text-2xl text-[#1E293B] h-10 flex items-end tracking-wider select-none"
              style={{ fontFamily: "'Alex Brush', 'Great Vibes', cursive" }}
            >
              Rahul Verma
            </div>
            <div className="w-40 h-[1px] bg-[#0F172A] my-1"></div>
            <div className="text-xs font-bold text-[#0F172A]">
              {data.instructorName || 'Rahul Verma'}
            </div>
            <div className="text-[10px] text-[#64748B]">
              {data.instructorTitle || 'Head of Academic Programs'}
            </div>
            <div className="text-[9px] text-[#94A3B8]">
              VertexLearn AI
            </div>
          </div>

          {/* Far Right: Metadata Stack (Date, ID & QR Code) */}
          <div className="col-span-3 flex flex-col items-end text-right space-y-1.5 pl-4">
            {/* Date of Issue */}
            <div className="flex items-center gap-2">
              <span className="text-sm">📅</span>
              <div className="text-left">
                <div className="text-[9px] font-bold text-[#64748B] uppercase tracking-wider">Date of Issue</div>
                <div className="text-[11px] font-bold text-[#0F172A]">{data.issueDate}</div>
              </div>
            </div>

            {/* Certificate ID */}
            <div className="flex items-center gap-2">
              <span className="text-sm">🪪</span>
              <div className="text-left">
                <div className="text-[9px] font-bold text-[#64748B] uppercase tracking-wider">Certificate ID</div>
                <div className="font-mono text-[11px] font-bold text-[#800000]">{data.certificateId}</div>
              </div>
            </div>

            {/* QR Code */}
            <div className="flex items-center gap-2 pt-0.5">
              <div className="text-right text-[9px] text-[#475569] leading-tight">
                <div className="font-bold text-[#0F172A]">Verify Certificate</div>
                <div className="text-[#0284C7] font-mono text-[8px]">vertexlearn.ai/verify</div>
              </div>
              {qrCodeDataUrl ? (
                <img
                  src={qrCodeDataUrl}
                  alt="QR Code"
                  className="w-14 h-14 bg-white p-0.5 border border-[#CBD5E1] rounded shadow-xs"
                />
              ) : (
                <div className="w-14 h-14 bg-slate-100 border border-[#CBD5E1] rounded flex items-center justify-center text-[8px] text-slate-400">
                  QR
                </div>
              )}
            </div>
          </div>

        </div>

        {/* ------------------------------------------------------------ */}
        {/* Bottom Tagline                                               */}
        {/* ------------------------------------------------------------ */}
        <div className="flex items-center gap-4 pt-2">
          <div className="text-[9px] font-bold tracking-[0.25em] text-[#800000] uppercase shrink-0">
            SKILLS TODAY <span className="mx-2 text-[#C5A059]">|</span> A BRIGHTER TOMORROW
          </div>
          <div className="h-[1px] flex-1 bg-[#800000] opacity-40"></div>
        </div>

      </div>
    </div>
  );
};
