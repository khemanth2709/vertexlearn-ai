import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';

export const ForgotPasswordPage: React.FC = () => {
  const { requestPasswordReset, confirmPasswordReset, setCurrentView } = useLMS();

  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [tokenInput, setTokenInput] = useState('');
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [infoMsg, setInfoMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRequestToken = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setErrorMsg(null);
    const result = await requestPasswordReset(email);
    setLoading(false);

    if (result.success) {
      if (result.token) {
        setGeneratedToken(result.token);
      }
      setInfoMsg(result.message);
      setStep(2);
    } else {
      setErrorMsg(result.message || 'Email not recognized in the institutional directory.');
    }
  };

  const handleConfirmReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!tokenInput || tokenInput.trim().length !== 6) {
      setErrorMsg('Please enter the 6-digit cryptographic security challenge token.');
      return;
    }

    if (newPassword.length < 8) {
      setErrorMsg('Password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPass) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setLoading(true);
    const result = await confirmPasswordReset(email, tokenInput.trim(), newPassword);
    setLoading(false);

    if (result.success) {
      setInfoMsg('Password successfully reset. Redirecting to Login...');
      setTimeout(() => {
        setCurrentView('login');
      }, 1500);
    } else {
      setErrorMsg(result.message || 'Challenge token verification failed. Token may be invalid or expired.');
    }
  };

  return (
    <div className="max-w-md mx-auto py-8 space-y-6 text-[#1F2937]">
      <div className="bg-white border border-[#E5E7EB] rounded-3xl p-8 sm:p-10 shadow-xs space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-red-50 text-[#DC2626] rounded-2xl flex items-center justify-center mx-auto border border-red-200 text-2xl">
            🔑
          </div>
          <h2 className="text-2xl font-bold text-[#1F2937] tracking-tight">
            Password Recovery
          </h2>
          <p className="text-xs text-[#4B5563]">
            {step === 1 ? 'Dispatch a one-time cryptographic challenge token' : 'Verify token and establish new password'}
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-[#DC2626] flex items-start gap-2">
            <span className="shrink-0 mt-0.5">⚠️</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {infoMsg && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-xs text-green-700 flex items-start gap-2">
            <span className="shrink-0 mt-0.5">✅</span>
            <span>{infoMsg}</span>
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleRequestToken} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#1F2937] mb-1">
                Institutional Email
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs">✉️</span>
                <input 
                  type="email"
                  required
                  placeholder="student@vertexlearn.ai"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl pl-9 pr-3 py-2 text-xs text-[#1F2937] placeholder-gray-400 focus:outline-none focus:border-[#DC2626]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#DC2626] hover:bg-[#B91C1C] disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 text-xs cursor-pointer"
            >
              {loading ? 'Dispatching Token...' : 'Generate 6-Digit Challenge Token'}
              <span>➡️</span>
            </button>
          </form>
        ) : (
          <form onSubmit={handleConfirmReset} className="space-y-4">
            {generatedToken && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-center space-y-1">
                <div className="text-[10px] text-[#4B5563] uppercase tracking-wider font-semibold">Simulated Security SMS/Email Token</div>
                <div className="text-xl font-mono font-bold text-[#DC2626] tracking-widest">{generatedToken}</div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#1F2937] mb-1">
                Enter 6-Digit Token
              </label>
              <input 
                type="text"
                required
                maxLength={6}
                placeholder="123456"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-3 py-2 text-center text-sm font-mono text-[#1F2937] tracking-widest focus:outline-none focus:border-[#DC2626]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1F2937] mb-1">New Password</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs">🔒</span>
                <input 
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl pl-9 pr-3 py-2 text-xs text-[#1F2937] placeholder-gray-400 focus:outline-none focus:border-[#DC2626]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1F2937] mb-1">Confirm New Password</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs">🔒</span>
                <input 
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl pl-9 pr-3 py-2 text-xs text-[#1F2937] placeholder-gray-400 focus:outline-none focus:border-[#DC2626]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#DC2626] hover:bg-[#B91C1C] disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 text-xs cursor-pointer"
            >
              {loading ? 'Resetting Password...' : 'Verify & Set New Password'}
              <span>✅</span>
            </button>
          </form>
        )}

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => setCurrentView('login')}
            className="text-xs text-[#4B5563] hover:text-[#DC2626] flex items-center justify-center gap-1 mx-auto cursor-pointer"
          >
            <span>⬅️</span> Return to Sign In
          </button>
        </div>

      </div>
    </div>
  );
};
