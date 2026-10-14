import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';
import { 
  ShieldCheck, 
  Mail, 
  Lock, 
  ArrowRight, 
  GraduationCap, 
  AlertCircle,
  Loader2,
  KeyRound,
  Info,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  UserCheck
} from 'lucide-react';
import { VertexLearnLogo } from '../common/VertexLearnLogo';

export const LoginPage: React.FC = () => {
  const { login, setCurrentView } = useLMS();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isNotRegistered, setIsNotRegistered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showReferenceGuide, setShowReferenceGuide] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setErrorMsg('Please enter both your institutional email and password.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setIsNotRegistered(false);

    const result = await login(email, password);
    setLoading(false);

    if (!result.success) {
      setErrorMsg(result.message || 'Authentication failed. Please verify credentials.');
      if (result.notFound) {
        setIsNotRegistered(true);
      }
    }
  };

  const handleFillReference = (refEmail: string, refPass: string) => {
    setEmail(refEmail);
    setPassword(refPass);
    setErrorMsg(null);
    setIsNotRegistered(false);
  };

  return (
    <div className="max-w-xl mx-auto py-10 px-4 space-y-6 text-[#1F2937]">
      
      {/* Institutional Sign-In Card */}
      <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 sm:p-9 shadow-xs space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-3">
            <VertexLearnLogo size="lg" showSubtitle={true} />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] tracking-tight">
            Institutional Sign In
          </h2>
          <p className="text-xs text-[#4B5563] max-w-sm mx-auto leading-relaxed">
            VertexLearn AI &bull; Secure Multi-Tenant RBAC Authentication
          </p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-[#DC2626] text-[11px] font-semibold">
            <Lock className="w-3.5 h-3.5" />
            <span>Strict Access: Registered Candidates & Faculty Only</span>
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-4 rounded-2xl text-xs flex items-start gap-3 bg-red-50 border border-red-200 text-[#DC2626] animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-[#DC2626] mt-0.5" />
            <div className="flex-1 space-y-2">
              <div className="font-semibold">{errorMsg}</div>
              {isNotRegistered && (
                <button
                  type="button"
                  onClick={() => setCurrentView('register')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#DC2626] hover:bg-[#B91C1C] text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Register Student Account Now</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#1F2937] mb-1.5">
              Institutional Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3 text-[#4B5563]" />
              <input 
                type="email"
                required
                placeholder="e.g. your.email@vertexlearn.ai"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrorMsg(null);
                }}
                className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[#1F2937] placeholder-gray-400 focus:outline-none focus:border-[#DC2626] transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-[#1F2937]">
                Password
              </label>
              <button
                type="button"
                onClick={() => setCurrentView('forgot_password')}
                className="text-xs text-[#DC2626] hover:text-[#B91C1C] transition-colors cursor-pointer"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <KeyRound className="w-4 h-4 absolute left-3.5 top-3 text-[#4B5563]" />
              <input 
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMsg(null);
                }}
                className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[#1F2937] placeholder-gray-400 focus:outline-none focus:border-[#DC2626] transition-colors"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#DC2626] hover:bg-[#B91C1C] disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 text-xs cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Verifying Credentials...
                </>
              ) : (
                <>
                  Sign In to Workspace <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          <div className="text-center text-xs text-[#4B5563] pt-4 border-t border-[#E5E7EB] flex items-center justify-center gap-2">
            <span>New candidate?</span>
            <button
              type="button"
              onClick={() => setCurrentView('register')}
              className="text-[#DC2626] hover:text-[#B91C1C] font-semibold inline-flex items-center gap-1 cursor-pointer transition-colors"
            >
              <GraduationCap className="w-3.5 h-3.5" /> Register Student Account
            </button>
          </div>
        </form>

      </div>

      {/* Authorized Institutional Accounts Reference (Drawer for evaluation) */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden transition-all text-xs shadow-xs">
        <button
          type="button"
          onClick={() => setShowReferenceGuide(!showReferenceGuide)}
          className="w-full px-4 py-3 flex items-center justify-between text-left text-[#4B5563] hover:text-[#1F2937] transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-[#DC2626]" />
            <span className="font-semibold text-[#1F2937]">Registered Institutional Accounts Reference</span>
          </div>
          {showReferenceGuide ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showReferenceGuide && (
          <div className="p-4 pt-1 border-t border-[#E5E7EB] space-y-3 bg-[#F9FAFB] text-[#1F2937]">
            <div className="flex items-center justify-between">
              <p className="text-[11px] text-[#4B5563] leading-relaxed">
                Pre-registered institutional accounts (stored with bcrypt 10-round cryptographic salts):
              </p>
              <span className="text-[10px] font-mono bg-red-50 text-[#DC2626] border border-red-200 px-2 py-0.5 rounded-full font-semibold">
                bcrypt (10 rounds)
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              {/* Student */}
              <div className="p-3 rounded-xl bg-white border border-[#E5E7EB] space-y-1.5 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-red-50 text-[#DC2626] border border-red-200">
                    Student
                  </span>
                  <div className="font-semibold text-[#1F2937] text-xs mt-1 truncate">student@vertexlearn.ai</div>
                  <div className="text-[11px] text-[#4B5563] font-mono">Student@2026</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleFillReference('student@vertexlearn.ai', 'Student@2026')}
                  className="mt-2 w-full text-[11px] font-semibold text-[#DC2626] hover:text-[#B91C1C] text-center py-1 rounded bg-[#F9FAFB] hover:bg-gray-100 border border-[#E5E7EB] transition-colors cursor-pointer"
                >
                  Use in Form
                </button>
              </div>

              {/* Faculty */}
              <div className="p-3 rounded-xl bg-white border border-[#E5E7EB] space-y-1.5 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-red-50 text-[#DC2626] border border-red-200">
                    Faculty
                  </span>
                  <div className="font-semibold text-[#1F2937] text-xs mt-1 truncate">instructor@vertexlearn.ai</div>
                  <div className="text-[11px] text-[#4B5563] font-mono">Faculty@2026</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleFillReference('instructor@vertexlearn.ai', 'Faculty@2026')}
                  className="mt-2 w-full text-[11px] font-semibold text-[#DC2626] hover:text-[#B91C1C] text-center py-1 rounded bg-[#F9FAFB] hover:bg-gray-100 border border-[#E5E7EB] transition-colors cursor-pointer"
                >
                  Use in Form
                </button>
              </div>

              {/* Admin */}
              <div className="p-3 rounded-xl bg-white border border-[#E5E7EB] space-y-1.5 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-red-50 text-[#DC2626] border border-red-200">
                    Admin
                  </span>
                  <div className="font-semibold text-[#1F2937] text-xs mt-1 truncate">admin@vertexlearn.ai</div>
                  <div className="text-[11px] text-[#4B5563] font-mono">Admin@2026</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleFillReference('admin@vertexlearn.ai', 'Admin@2026')}
                  className="mt-2 w-full text-[11px] font-semibold text-[#DC2626] hover:text-[#B91C1C] text-center py-1 rounded bg-[#F9FAFB] hover:bg-gray-100 border border-[#E5E7EB] transition-colors cursor-pointer"
                >
                  Use in Form
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
