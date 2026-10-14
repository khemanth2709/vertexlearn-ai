import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-16 text-[#1F2937]">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-extrabold text-[#1F2937] tracking-tight">
          Contact Academic Registrar & Faculty
        </h1>
        <p className="text-sm text-[#4B5563] max-w-xl mx-auto">
          Reach out for admissions inquiries, academic advising, or institutional deployment support.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white border border-[#E5E7EB] rounded-3xl p-8 space-y-6 shadow-xs">
          <h2 className="text-lg font-bold text-[#1F2937]">University Registrar Directorate</h2>
          
          <div className="space-y-4 text-xs text-[#4B5563]">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-[#1F2937]">Campus Headquarters</div>
                <div className="text-[#4B5563]">VertexLearn Academic Center, Silicon Valley Campus, CA 94025</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-[#DC2626] shrink-0" />
              <div>
                <div className="font-semibold text-[#1F2937]">Admissions & Registrar</div>
                <div className="text-[#4B5563]">registrar@vertexlearn.ai</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-[#DC2626] shrink-0" />
              <div>
                <div className="font-semibold text-[#1F2937]">Academic Helpline</div>
                <div className="text-[#4B5563]">+1 (800) 555-VTXL (Toll-Free)</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-3xl p-8 space-y-4 shadow-xs">
          <h2 className="text-lg font-bold text-[#1F2937]">Send Inquiries</h2>

          {submitted && (
            <div className="p-3 bg-green-50 border border-green-200 text-green-700 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
              Your inquiry has been logged. An academic advisor will respond shortly.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-[#1F2937] mb-1">Your Name</label>
              <input 
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jordan Miller"
                className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs text-[#1F2937] placeholder-gray-400 focus:outline-none focus:border-[#DC2626]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1F2937] mb-1">Your Email</label>
              <input 
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jordan@example.com"
                className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs text-[#1F2937] placeholder-gray-400 focus:outline-none focus:border-[#DC2626]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1F2937] mb-1">Inquiry Details</label>
              <textarea 
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Inquiry regarding course enrollment, syllabus prerequisites, or academic standing..."
                className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-3 text-xs text-[#1F2937] placeholder-gray-400 focus:outline-none focus:border-[#DC2626]"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#DC2626] hover:bg-[#B91C1C] text-white font-semibold py-2.5 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 text-xs cursor-pointer"
            >
              <Send className="w-4 h-4" /> Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
