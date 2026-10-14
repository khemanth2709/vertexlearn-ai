import React, { useState } from 'react';
import { LMSProvider, useLMS } from './context/LMSContext';
import { RouteGuard, PUBLIC_VIEWS } from './components/auth/RouteGuard';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { LandingPage } from './components/public/LandingPage';
import { AboutPage } from './components/public/AboutPage';
import { FeaturesPage } from './components/public/FeaturesPage';
import { CoursesOverviewPage } from './components/public/CoursesOverviewPage';
import { ContactPage } from './components/public/ContactPage';
import { LoginPage } from './components/public/LoginPage';
import { StudentRegistrationPage } from './components/public/StudentRegistrationPage';
import { ForgotPasswordPage } from './components/public/ForgotPasswordPage';
import { CertificateVerificationPage } from './components/public/CertificateVerificationPage';
import { StudentDashboard } from './components/dashboard/StudentDashboard';
import { InstructorDashboard } from './components/dashboard/InstructorDashboard';
import { AdminComplianceDashboard } from './components/dashboard/AdminComplianceDashboard';
import { AdminStudentsSegmentation } from './components/admin/AdminStudentsSegmentation';
import { AdminFacultyManagement } from './components/admin/AdminFacultyManagement';
import { AdminAuditLogs } from './components/admin/AdminAuditLogs';
import { CourseCatalog } from './components/course/CourseCatalog';
import { CourseDetailView } from './components/course/CourseDetailView';
import { CoursePlayer } from './components/course/CoursePlayer';
import { CourseBuilder } from './components/course/CourseBuilder';
import { AssignmentsModule } from './components/assignments/AssignmentsModule';
import { AttendanceModule } from './components/attendance/AttendanceModule';
import { CloudStorageModule } from './components/storage/CloudStorageModule';
import { MessagingModule } from './components/messaging/MessagingModule';
import { ComplianceModule } from './components/compliance/ComplianceModule';
import { AnalyticsModule } from './components/analytics/AnalyticsModule';
import { DatabaseSchemaViewer } from './components/database/DatabaseSchemaViewer';
import { ApiDocumentationViewer } from './components/api/ApiDocumentationViewer';
import { SystemArchitectureViewer } from './components/architecture/SystemArchitectureViewer';
import { FolderStructureViewer } from './components/architecture/FolderStructureViewer';
import { PermissionsMatrixViewer } from './components/auth/PermissionsMatrixViewer';
import { DevelopmentRoadmapViewer } from './components/roadmap/DevelopmentRoadmapViewer';
import { TechStackViewer } from './components/techstack/TechStackViewer';
import { DeploymentStrategyViewer } from './components/deployment/DeploymentStrategyViewer';
import { BlueprintAndTestCasesModule } from './components/blueprint/BlueprintAndTestCasesModule';
import { AITutorWidget } from './components/ai/AITutorWidget';
import { ExpansionHub } from './components/expansion/ExpansionHub';
import { StudyRoomsModule } from './components/expansion/StudyRoomsModule';
import { PlagiarismDetectorModule } from './components/expansion/PlagiarismDetectorModule';
import { MobilePwaModule } from './components/expansion/MobilePwaModule';
import { MonetizationModule } from './components/expansion/MonetizationModule';
import { VoiceTutorModule } from './components/expansion/VoiceTutorModule';
import { PredictiveAnalyticsModule } from './components/expansion/PredictiveAnalyticsModule';
import { useKeyboardNavigation } from './hooks/useKeyboardNavigation';
import { KeyboardShortcutsModal } from './components/common/KeyboardShortcutsModal';

const MainLayout: React.FC = () => {
  const { currentView, user } = useLMS();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [shortcutsModalOpen, setShortcutsModalOpen] = useState(false);

  // Global keyboard shortcut listener for navigation & cheat sheet
  const { activeShortcutToast } = useKeyboardNavigation({
    onToggleHelpModal: () => setShortcutsModalOpen((prev) => !prev),
    enabled: true
  });

  // Authenticated Role-based Dashboard router
  const renderDashboardByRole = () => {
    if (user?.role === 'ADMIN') {
      return <AdminComplianceDashboard />;
    }
    if (user?.role === 'INSTRUCTOR') {
      return <InstructorDashboard />;
    }
    return <StudentDashboard />;
  };

  // Public Pages Router
  const renderPublicView = () => {
    switch (currentView) {
      case 'about': return <AboutPage />;
      case 'features': return <FeaturesPage />;
      case 'courses_overview': return <CoursesOverviewPage />;
      case 'contact': return <ContactPage />;
      case 'login': return <LoginPage />;
      case 'register': return <StudentRegistrationPage />;
      case 'forgot_password': return <ForgotPasswordPage />;
      case 'verify_certificate': return <CertificateVerificationPage />;
      default: return <LandingPage />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#1F2937] font-sans overflow-hidden antialiased flex flex-col selection:bg-[#DC2626] selection:text-white">
      
      {/* Top Header Navbar */}
      <Navbar 
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
        onOpenShortcuts={() => setShortcutsModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Sidebar Navigation (Only for authenticated users) */}
        {user && (
          <Sidebar 
            isOpen={sidebarOpen} 
            onClose={() => setSidebarOpen(false)} 
            onOpenShortcuts={() => setShortcutsModalOpen(true)}
          />
        )}

        {/* Viewport wrapped with RouteGuard */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto w-full">
            
            <RouteGuard>
              {/* If on a public view, render public page */}
              {PUBLIC_VIEWS.includes(currentView) ? (
                renderPublicView()
              ) : (
                /* Authenticated User: Render Protected Pages with role protection */
                <>
                  {currentView === 'dashboard' && renderDashboardByRole()}
                  {currentView === 'courses' && <CourseCatalog />}
                  {currentView === 'course_detail' && <CourseDetailView />}
                  {currentView === 'course_player' && <CoursePlayer />}
                  {currentView === 'course_builder' && (
                    <RouteGuard allowedRoles={['ADMIN', 'INSTRUCTOR']}>
                      <CourseBuilder />
                    </RouteGuard>
                  )}
                  {currentView === 'assignments' && <AssignmentsModule />}
                  {currentView === 'attendance' && <AttendanceModule />}
                  {currentView === 'admin_students' && (
                    <RouteGuard allowedRoles={['ADMIN']}>
                      <AdminStudentsSegmentation />
                    </RouteGuard>
                  )}
                  {currentView === 'admin_instructors' && (
                    <RouteGuard allowedRoles={['ADMIN']}>
                      <AdminFacultyManagement />
                    </RouteGuard>
                  )}
                  {currentView === 'admin_audit' && (
                    <RouteGuard allowedRoles={['ADMIN']}>
                      <AdminAuditLogs />
                    </RouteGuard>
                  )}
                  {currentView === 'storage' && <CloudStorageModule />}
                  {currentView === 'messaging' && <MessagingModule />}
                  {currentView === 'compliance' && <ComplianceModule />}
                  {currentView === 'analytics' && (
                    <RouteGuard allowedRoles={['ADMIN', 'INSTRUCTOR']}>
                      <AnalyticsModule />
                    </RouteGuard>
                  )}
                  {currentView === 'schema' && <DatabaseSchemaViewer />}
                  {currentView === 'api_docs' && <ApiDocumentationViewer />}
                  {currentView === 'architecture' && <SystemArchitectureViewer />}
                  {currentView === 'folder_structure' && <FolderStructureViewer />}
                  {currentView === 'permissions_matrix' && <PermissionsMatrixViewer />}
                  {currentView === 'roadmap' && <DevelopmentRoadmapViewer />}
                  {currentView === 'tech_stack' && <TechStackViewer />}
                  {currentView === 'deployment' && <DeploymentStrategyViewer />}
                  {currentView === 'blueprint' && <BlueprintAndTestCasesModule />}
                  {currentView === 'expansion_hub' && <ExpansionHub />}
                  {currentView === 'study_rooms' && <StudyRoomsModule />}
                  {currentView === 'plagiarism_detector' && <PlagiarismDetectorModule />}
                  {currentView === 'mobile_pwa' && <MobilePwaModule />}
                  {currentView === 'monetization' && <MonetizationModule />}
                  {currentView === 'voice_tutor' && <VoiceTutorModule />}
                  {currentView === 'predictive_analytics' && (
                    <RouteGuard allowedRoles={['ADMIN', 'INSTRUCTOR']}>
                      <PredictiveAnalyticsModule />
                    </RouteGuard>
                  )}
                </>
              )}
            </RouteGuard>

          </div>
        </main>
      </div>

      {/* Floating AI Technical Tutor */}
      <AITutorWidget />

      {/* Global Shortcut Navigation Indicator Toast */}
      {activeShortcutToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none transition-all duration-200">
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-[#09182d]/95 border border-cyan-500/40 shadow-xl shadow-cyan-950/60 backdrop-blur-md text-slate-100 text-xs animate-in fade-in slide-in-from-bottom-2">
            <kbd className="px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-700/60 text-cyan-300 font-mono font-bold text-[11px]">
              {activeShortcutToast.keyLabel}
            </kbd>
            <span className="font-medium text-slate-200">{activeShortcutToast.title}</span>
          </div>
        </div>
      )}

      {/* Keyboard Shortcuts Cheat Sheet Modal */}
      <KeyboardShortcutsModal
        isOpen={shortcutsModalOpen}
        onClose={() => setShortcutsModalOpen(false)}
      />

    </div>
  );
};

export default function App() {
  return (
    <LMSProvider>
      <MainLayout />
    </LMSProvider>
  );
}
