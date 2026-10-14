import React, { useEffect, useRef } from 'react';
import { useLMS, LMSView } from '../../context/LMSContext';
import { UserRole } from '../../types/lms';

export const PUBLIC_VIEWS: LMSView[] = [
  'landing',
  'about',
  'features',
  'courses_overview',
  'contact',
  'login',
  'register',
  'forgot_password',
  'verify_certificate'
];

interface RouteGuardProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

/**
 * RouteGuard Component
 * Strictly enforces Role-Based Access Control (RBAC).
 * Per security specification: Non-authorized users receive a 403 Forbidden state
 * INSTEAD of being redirected to ensure strict security visibility and audit compliance.
 */
export const RouteGuard: React.FC<RouteGuardProps> = ({ children, allowedRoles }) => {
  const { user, currentView, setCurrentView, logout, recordAuditLog } = useLMS();
  const loggedIncidentRef = useRef<string | null>(null);

  const isPublicView = PUBLIC_VIEWS.includes(currentView);
  const isUnauthenticated = !user && !isPublicView;
  const isRoleForbidden = !!(user && allowedRoles && !allowedRoles.includes(user.role));
  const isForbidden = isUnauthenticated || isRoleForbidden;

  // Log 403 Forbidden Security Violation once per occurrence
  useEffect(() => {
    if (isForbidden) {
      const incidentKey = `${currentView}_${user?.id || 'anon'}_${isUnauthenticated ? 'unauth' : 'role'}`;
      if (loggedIncidentRef.current !== incidentKey) {
        loggedIncidentRef.current = incidentKey;
        const detailMsg = isUnauthenticated
          ? `403 Forbidden: Unauthenticated access attempt to protected view "${currentView}". Redirection suppressed.`
          : `403 Forbidden: Role "${user?.role}" denied access to "${currentView}". Required role(s): [${allowedRoles?.join(', ')}]. Redirection suppressed.`;
        recordAuditLog('SECURITY_403_FORBIDDEN', detailMsg);
      }
    }
  }, [isForbidden, currentView, user, isUnauthenticated, allowedRoles, recordAuditLog]);

  // If unauthorized: render 403 Forbidden state instead of redirecting
  if (isForbidden) {
    const forbiddenCode = isUnauthenticated ? '403.1 (AUTH_REQUIRED)' : '403.3 (ROLE_DENIED)';
    const reasonTitle = isUnauthenticated 
      ? '403 Forbidden: Institutional Authentication Required'
      : '403 Forbidden: Insufficient Role Privileges';
    
    const reasonDescription = isUnauthenticated
      ? 'Anonymous access to this educational workspace is strictly prohibited. Zero-trust security policy requires verified institutional credentials before entering this module.'
      : `Your active account (${user?.email}) has role clearance level "${user?.role}". This resource strictly mandates role authorization: [${allowedRoles?.join(', ')}].`;

    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4 sm:p-6 my-auto text-[#1F2937]">
        <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 sm:p-10 max-w-2xl w-full text-center space-y-6 shadow-xs animate-in fade-in zoom-in-95 duration-200">
          
          {/* 403 Visual Shield Badge */}
          <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
            <div className="w-20 h-20 rounded-3xl bg-red-50 text-[#DC2626] border border-red-200 flex items-center justify-center text-3xl shadow-xs">
              🛡️
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#DC2626] text-white flex items-center justify-center text-[11px] font-black border-2 border-white">
              !
            </div>
          </div>

          {/* Heading and HTTP 403 Status */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-[#DC2626] text-xs font-bold uppercase tracking-wider">
              <span>⚠️</span>
              <span>HTTP 403 FORBIDDEN &bull; STRICT RBAC ENFORCED</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] tracking-tight">
              {reasonTitle}
            </h1>
            
            <p className="text-xs sm:text-sm text-[#4B5563] max-w-lg mx-auto leading-relaxed">
              {reasonDescription}
            </p>
          </div>

          {/* Detailed Security Diagnostics Terminal */}
          <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl p-4 sm:p-5 text-left font-mono text-xs space-y-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-[#E5E7EB] text-[11px] text-[#4B5563]">
              <span className="flex items-center gap-1.5 text-[#DC2626] font-bold uppercase">
                <span>💻</span> Security RBAC Violation Log
              </span>
              <span className="text-[10px] bg-red-50 text-[#DC2626] border border-red-200 px-2 py-0.5 rounded font-mono font-semibold">
                {forbiddenCode}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-[#6B7280]">Requested Resource: </span>
                <span className="text-[#DC2626] font-semibold">/{currentView}</span>
              </div>
              <div>
                <span className="text-[#6B7280]">HTTP Status: </span>
                <span className="text-[#DC2626] font-bold">403 Forbidden</span>
              </div>
              <div>
                <span className="text-[#6B7280]">Client Identity: </span>
                <span className="text-[#1F2937] truncate font-medium">{user ? user.email : 'Anonymous (Unauthenticated)'}</span>
              </div>
              <div>
                <span className="text-[#6B7280]">Current Role: </span>
                <span className={`font-bold ${user ? 'text-amber-700' : 'text-[#6B7280]'}`}>
                  {user ? user.role : 'None'}
                </span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-[#6B7280]">Required Role(s): </span>
                <span className="text-emerald-700 font-semibold">
                  {allowedRoles ? allowedRoles.join(', ') : 'AUTHENTICATED_CANDIDATE'}
                </span>
              </div>
              <div className="sm:col-span-2 pt-1 border-t border-[#E5E7EB] text-[#6B7280] text-[10px]">
                Policy Action: <strong className="text-[#DC2626]">Request Denied In Place</strong> (Automatic redirection disabled per security audit rule).
              </div>
            </div>
          </div>

          {/* Corrective Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            {isUnauthenticated ? (
              <>
                <button
                  type="button"
                  onClick={() => setCurrentView('login')}
                  className="bg-[#DC2626] hover:bg-[#B91C1C] text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer"
                >
                  <span>🔒</span>
                  <span>Authenticate at Institutional Portal</span>
                  <span>➡️</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentView('register')}
                  className="bg-white hover:bg-[#F9FAFB] text-[#1F2937] font-semibold text-xs px-5 py-2.5 rounded-xl transition-all border border-[#E5E7EB] flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <span>🎓</span>
                  <span>Register Candidate Account</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentView('landing')}
                  className="text-xs text-[#4B5563] hover:text-[#1F2937] font-semibold px-3 py-2 flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <span>🏠</span>
                  <span>Return to Homepage</span>
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setCurrentView('dashboard')}
                  className="bg-[#DC2626] hover:bg-[#B91C1C] text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer"
                >
                  <span>🔄</span>
                  <span>Return to Authorized Dashboard</span>
                </button>

                <button
                  type="button"
                  onClick={logout}
                  className="bg-red-50 hover:bg-red-100 text-[#DC2626] font-semibold text-xs px-5 py-2.5 rounded-xl transition-all border border-red-200 flex items-center gap-2 cursor-pointer"
                >
                  <span>🚪</span>
                  <span>Switch Account / Sign Out</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentView('courses_overview')}
                  className="text-xs text-[#4B5563] hover:text-[#1F2937] font-semibold px-3 py-2 flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <span>Explore Course Catalog</span>
                </button>
              </>
            )}
          </div>

        </div>
      </div>
    );
  }

  return <>{children}</>;
};

/**
 * Higher Order Component (HOC) version of RouteGuard
 */
export function withRouteGuard<P extends object>(
  Component: React.ComponentType<P>,
  allowedRoles?: UserRole[]
) {
  return function GuardedComponent(props: P) {
    return (
      <RouteGuard allowedRoles={allowedRoles}>
        <Component {...props} />
      </RouteGuard>
    );
  };
}
