import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ProtectedRoute from "@/components/protected-route";

//context-providers
import AuthProvider from "@/context/AuthContext";
import { InstitutionProvider } from "@/context/InstitutionContext";
import { NotificationProvider } from "@/context/NotificationContext";

//pages
import LandingPage from "@/pages/landing-page";
import SignUp from "@/pages/user-auth/SignUp";
import LogIn from "@/pages/user-auth/LogIn";
import AdminDashboard from "@/pages/admin-dashboard/AdminDashboard";
import BrowseInstitutions from "@/pages/browse-institutions";
import AnimatedContent from "@/components/ui/animated-content";
import TeacherDashboard from "@/pages/teacher-dashboard/TeacherDashboard";
import StudentDashboard from "@/pages/student-dashboard/StudentDashboard";
import { TestUI } from '@/components/test-ui';
import MainLayout from "@/components/main-layout";
import UserProfile from "@/pages/user-profile";
import UnderstandingQpas from "@/pages/UnderstandingQpas"; // Added import

const queryClient = new QueryClient();

export default function App() {
  const location = useLocation();
  const isAuthRoute = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NotificationProvider>
          <InstitutionProvider>
            {/* <AnimatedContent
              distance={100}
              direction="vertical"
              reverse={false}
              config={{ tension: 50, friction: 25 }}
              initialOpacity={0.0}
              animateOpacity
              scale={1.0}
              threshold={0.1}
            > */}
              <Routes>
                {/* Auth Routes - No NavBar */}
                <Route path="/signup" element={<SignUp />} />
                <Route path="/login" element={<LogIn />} />

                {/* Routes with NavBar */}
                <Route element={<MainLayout />}>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/browse-institutions" element={<BrowseInstitutions />} />
                  <Route path="/user-profile" element={<UserProfile />} />
                  <Route path="/understanding-qpas" element={<UnderstandingQpas />} /> {/* Added route */}
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
                </Route>
              </Routes>
            {/* </AnimatedContent> */}
          </InstitutionProvider>
        </NotificationProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
