import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthProvider from "./context/AuthContext";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { InstitutionProvider } from "./context/InstitutionContext";
import LandingPage from "./components/LandingPage";
import SignUp from "./components/user-auth/SignUp";
import LogIn from "./components/user-auth/LogIn";
import AdminDashboard from "./components/admin-dashboard/AdminDashboard";
import BrowseInstitutions from "./components/browse-institutions-page/BrowseInstitutions";
import SampleDashboard from "./components/SampleDashboard";
import FormStructureBuilder from "./components/FormStructureBuilder";
import { useLocation } from "react-router-dom";
import AnimatedContent from "@/components/ui/animated-content";
import TeacherDashboard from "./components/teacher-dashboard/TeacherDashboard";
import StudentDashboard from "./components/student-dashboard/StudentDashboard";
import { TestUI } from '@/components/test-ui'
import MainLayout from "./components/shared-components/MainLayout";

const queryClient = new QueryClient();

export default function App() {
  const location = useLocation();
  const isAuthRoute = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
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
                <Route path="/institutions/:institution_id/form-builder" element={<FormStructureBuilder />} />
                <Route path="/:institution_id/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/:institution_id/teacher/dashboard" element={<TeacherDashboard />} />
                <Route path="/:institution_id/student/dashboard" element={<StudentDashboard />} />
                <Route path="/test-ui" element={<TestUI />} />
              </Route>
            </Routes>
          </AnimatedContent>
        </InstitutionProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
