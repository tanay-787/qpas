import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"; // Added useLocation import
import AuthProvider from "./context/AuthContext";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { InstitutionProvider } from "./context/InstitutionContext";
// Import the NotificationProvider
import { NotificationProvider } from "./context/NotificationContext";
import LandingPage from "./components/LandingPage";
import SignUp from "./components/user-auth/SignUp";
import LogIn from "./components/user-auth/LogIn";
import AdminDashboard from "./components/admin-dashboard/AdminDashboard";
import BrowseInstitutions from "./components/browse-institutions-page/BrowseInstitutions";
import SampleDashboard from "./components/SampleDashboard";
import FormStructureBuilder from "./components/FormStructureBuilder";
// useLocation is already used below, ensure it's imported once
import AnimatedContent from "@/components/ui/animated-content";
import TeacherDashboard from "./components/teacher-dashboard/TeacherDashboard";
import StudentDashboard from "./components/student-dashboard/StudentDashboard";
import { TestUI } from '@/components/test-ui';
import MainLayout from "./components/shared-components/MainLayout";
import UserProfile from "./components/UserProfile";
import ProtectedRoute from "./components/shared-components/ProtectedRoute"; // Import ProtectedRoute

const queryClient = new QueryClient();

// Define AppContent to use useLocation hook
export default function App() {
  const location = useLocation();
  const isAuthRoute = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NotificationProvider>
          <InstitutionProvider>
            <AnimatedContent
              distance={100}
              direction="vertical"
              reverse={false}
              config={{ tension: 50, friction: 25 }}
              initialOpacity={0.0}
              animateOpacity
              scale={1.0}
              threshold={0.1}
            >
              <Routes>
                {/* Auth Routes - No NavBar */}
                <Route path="/signup" element={<SignUp />} />
                <Route path="/login" element={<LogIn />} />

                {/* Routes with NavBar */}
                <Route element={<MainLayout />}>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/browse-institutions" element={<BrowseInstitutions />} />
                  <Route path="/sample" element={<SampleDashboard />} />

                  {/* Protected Dashboard Routes */}
                  <Route
                    path="/:institution_id/admin/dashboard"
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/:institution_id/teacher/dashboard"
                    element={
                      <ProtectedRoute requiredRole="teacher">
                        <TeacherDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/:institution_id/student/dashboard"
                    element={
                      <ProtectedRoute requiredRole="student">
                        <StudentDashboard />
                      </ProtectedRoute>
                    }
                  />

                  <Route path="/test-ui" element={<TestUI />} />
                  {/* UserProfile might also need protection depending on requirements */}
                  <Route path="/user-profile" element={<UserProfile />} />
                </Route>
              </Routes>
            </AnimatedContent>
          </InstitutionProvider>
        </NotificationProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
