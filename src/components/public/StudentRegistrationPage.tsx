import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';
import { 
  GraduationCap, 
  User as UserIcon, 
  Mail, 
  Phone, 
  Building, 
  Calendar, 
  Lock, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck 
} from 'lucide-react';
import { VertexLearnLogo } from '../common/VertexLearnLogo';

export const StudentRegistrationPage: React.FC = () => {
  const { registerStudent, login, setCurrentView } = useLMS();

  const [fullName, setFullName] = useState('');
  const [studentRollNumber, setStudentRollNumber] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [year, setYear] = useState<'1st Year' | '2nd Year' | '3rd Year' | '4th Year'>('1st Year');
  const [section, setSection] = useState('Section A');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Password strength check
  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const isStrong = hasMinLength && hasNumber && hasSpecial;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    // Form validations
    if (!fullName.trim() || !studentRollNumber.trim() || !email.trim() || !password) {
      setErrorMsg('Please fill in all mandatory fields.');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      setErrorMsg('Please enter a valid institutional email address.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please re-enter.');
      return;
    }

    if (!hasMinLength) {
      setErrorMsg('Password must contain at least 8 characters.');
      return;
    }

    setLoading(true);
    const result = await registerStudent({
      fullName,
      studentRollNumber,
      email,
      phone: phone || '+1 (555) 000-0000',
      department,
      year,
      section,
      password
    });
    setLoading(false);

    if (!result.success) {
      setErrorMsg(result.message);
    } else {
      setSuccessMsg('Student registration successful! Identity verified. Launching your student workspace...');
      setIsRedirecting(true);
      setTimeout(async () => {
        await login(email, password);
        setCurrentView('dashboard');
      }, 1000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-6 space-y-6 text-[#1F2937]">
      <div className="bg-white border border-[#E5E7EB] rounded-3xl p-8 sm:p-10 shadow-xs space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-3">
            <VertexLearnLogo size="lg" showSubtitle={true} />
          </div>
          <h2 className="text-2xl font-bold text-[#1F2937] tracking-tight">
            Student Identity Registration
          </h2>
          <p className="text-xs text-[#4B5563] max-w-md mx-auto">
            Enroll your verified academic record into VertexLearn AI.
            Role is provisioned as STUDENT.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-[#DC2626] flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-[#DC2626] mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 bg-green-50 border border-green-200 rounded-xl text-xs text-green-700 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-green-600 mt-0.5" />
            <div className="flex-1">
              <div className="font-semibold">{successMsg}</div>
              {isRedirecting && (
                <div className="text-[11px] text-green-700 mt-1 flex items-center gap-1.5">
                  Redirecting to Sign In...
                  <button
                    type="button"
                    onClick={() => setCurrentView('login')}
                    className="underline font-bold text-[#DC2626] ml-1 hover:text-[#B91C1C]"
                  >
                    Click here to sign in now
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Row 1: Full Name & Roll Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1F2937] mb-1">
                Full Name <span className="text-[#DC2626]">*</span>
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 absolute left-3 top-2.5 text-[#4B5563]" />
                <input 
                  type="text"
                  required
                  placeholder="e.g. Jordan Miller"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl pl-9 pr-3 py-2 text-xs text-[#1F2937] placeholder-gray-400 focus:outline-none focus:border-[#DC2626]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1F2937] mb-1">
                Student ID / Roll Number <span className="text-[#DC2626]">*</span>
              </label>
              <input 
                type="text"
                required
                placeholder="STU-2026-0842"
                value={studentRollNumber}
                onChange={(e) => setStudentRollNumber(e.target.value)}
                className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs text-[#1F2937] placeholder-gray-400 focus:outline-none focus:border-[#DC2626] font-mono"
              />
            </div>
          </div>

          {/* Row 2: Institutional Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1F2937] mb-1">
                Institutional Email <span className="text-[#DC2626]">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-2.5 text-[#4B5563]" />
                <input 
                  type="email"
                  required
                  placeholder="jordan.miller@vertexlearn.ai"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl pl-9 pr-3 py-2 text-xs text-[#1F2937] placeholder-gray-400 focus:outline-none focus:border-[#DC2626]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1F2937] mb-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-2.5 text-[#4B5563]" />
                <input 
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl pl-9 pr-3 py-2 text-xs text-[#1F2937] placeholder-gray-400 focus:outline-none focus:border-[#DC2626]"
                />
              </div>
            </div>
          </div>

          {/* Row 3: Department, Year & Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1F2937] mb-1">Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-2.5 py-2 text-xs text-[#1F2937] focus:outline-none focus:border-[#DC2626]"
              >
                <option value="Computer Science & Engineering">Computer Science</option>
                <option value="Artificial Intelligence & Data Science">AI & Data Science</option>
                <option value="Cyber Security & Information Assurance">Cyber Security</option>
                <option value="Cloud Systems & DevOps">Cloud Systems</option>
                <option value="Software Engineering">Software Eng</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1F2937] mb-1">Academic Year</label>
              <select
                value={year}
                onChange={(e: any) => setYear(e.target.value)}
                className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-2.5 py-2 text-xs text-[#1F2937] focus:outline-none focus:border-[#DC2626]"
              >
                <option value="1st Year">1st Year (Freshman)</option>
                <option value="2nd Year">2nd Year (Sophomore)</option>
                <option value="3rd Year">3rd Year (Junior)</option>
                <option value="4th Year">4th Year (Senior)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1F2937] mb-1">Class Section</label>
              <select
                value={section}
                onChange={(e) => setSection(e.target.value)}
                className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-2.5 py-2 text-xs text-[#1F2937] focus:outline-none focus:border-[#DC2626]"
              >
                <option value="Section A">Section A</option>
                <option value="Section B">Section B</option>
                <option value="Section C">Section C</option>
              </select>
            </div>
          </div>

          {/* Row 4: Password & Confirm Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block text-xs font-semibold text-[#1F2937] mb-1">
                Password <span className="text-[#DC2626]">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-2.5 text-[#4B5563]" />
                <input 
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl pl-9 pr-3 py-2 text-xs text-[#1F2937] placeholder-gray-400 focus:outline-none focus:border-[#DC2626]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1F2937] mb-1">
                Confirm Password <span className="text-[#DC2626]">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-2.5 text-[#4B5563]" />
                <input 
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl pl-9 pr-3 py-2 text-xs text-[#1F2937] placeholder-gray-400 focus:outline-none focus:border-[#DC2626]"
                />
              </div>
            </div>
          </div>

          {/* Password Strength Indicator */}
          {password && (
            <div className="p-3 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] text-[11px] text-[#4B5563] space-y-1.5">
              <div className="flex items-center gap-2">
                <span className={hasMinLength ? 'text-green-600 font-semibold' : 'text-[#4B5563]'}>
                  {hasMinLength ? '✓' : '○'} Min 8 characters
                </span>
                <span>&bull;</span>
                <span className={hasNumber ? 'text-green-600 font-semibold' : 'text-[#4B5563]'}>
                  {hasNumber ? '✓' : '○'} Contains number
                </span>
                <span>&bull;</span>
                <span className={hasSpecial ? 'text-green-600 font-semibold' : 'text-[#4B5563]'}>
                  {hasSpecial ? '✓' : '○'} Special symbol
                </span>
              </div>
              <div className="text-[10px] text-[#DC2626] font-mono flex items-center gap-1 border-t border-[#E5E7EB] pt-1 font-semibold">
                <span>🔒 Security: Password will be encrypted with bcrypt (10 salt rounds)</span>
              </div>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading || isRedirecting}
              className="w-full bg-[#DC2626] hover:bg-[#B91C1C] disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 text-xs cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              {loading ? 'Creating Student Profile...' : 'Complete Student Registration'}
            </button>
          </div>

          <div className="text-center text-xs text-[#4B5563] pt-2">
            Already have an active student account?{' '}
            <button
              type="button"
              onClick={() => setCurrentView('login')}
              className="text-[#DC2626] hover:text-[#B91C1C] font-semibold cursor-pointer"
            >
              Sign In
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
