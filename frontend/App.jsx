import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthProvider from "./context/AuthContext";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { InstitutionProvider } from "./context/InstitutionContext";
import LandingPage from "./components/LandingPage";
import SignUp from "./components/user-auth/SignUp";
import LogIn from "./components/user-auth/LogIn";
import AdminDashboard from "./components/AdminDashboard";
import BrowseInstitutions from "./components/BrowseInstitutions";
import SampleDashboard from "./components/SampleDashboard";
import FormStructureBuilder from "./components/FormStructureBuilder";
import NavBar from "./components/shared-components/NavBar";
import { useLocation } from "react-router-dom";
import AnimatedContent from "@/components/ui/animated-content";

const queryClient = new QueryClient();

export default function App() {
  const location = useLocation();
  const isAuthRoute = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <InstitutionProvider>
          <div>
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
              {!isAuthRoute && <NavBar />}

              <Routes>
                {/* Auth Routes */}
                <Route path="/signup" element={<SignUp />} />
                <Route path="/login" element={<LogIn />} />
                <Route path="/" element={<LandingPage />} />

                {/* User Searches for Institutions */}
                <Route path="/browse-institutions" element={<BrowseInstitutions />} />

                <Route path="/sample" element={<SampleDashboard />} />
                {/* Admin Routes */}
                <Route path="/institutions/:institution_id/form-builder" element={<FormStructureBuilder />} />
                <Route path="/:institution_id/admin/dashboard" element={<AdminDashboard />} />

                {/* Teacher Routes */}
                <Route path="/:institution_id/teacher/dashboard" element={null} />

                {/* Student Routes */}
                <Route path="/student/dashboard" element={null} />
                <Route path="/:institution_id/student/dashboard" element={null} />
              </Routes>
            </AnimatedContent>
          </div>
        </InstitutionProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
