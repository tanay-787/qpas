import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthProvider from "./components/context/AuthContext";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { InstitutionProvider } from "./components/context/InstitutionContext";


import LandingPage from "./components/LandingPage";
import SignUp from "./components/user-auth/SignUp";
import LogIn from "./components/user-auth/LogIn";
import RoleSelection from "./components/Role-Selection";
import CreateInstitution from "./components/admin/CreateInstitution";
import AdminDashboard from "./components/admin/AdminDashboard";
import BrowseInstitutions from "./components/BrowseInstitutions";


const queryClient = new QueryClient();

export default function App() {
  return (
    <AuthProvider>
      <InstitutionProvider>
      <QueryClientProvider client={queryClient}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<LogIn />} />

    
            {/* User Searches for Institutions */}
            <Route path="/browse-institutions" element={<BrowseInstitutions />} />
            {/* Chooses to create a new one */}
            <Route path="/create-institution" element={<CreateInstitution />} />

            {/* Join as a member */}
            <Route path="/role-selection" element={<RoleSelection />} />
            
            {/* Admin Routes */}
            <Route path="/:institution_id/admin/dashboard" element={<AdminDashboard /> } />

            {/* Teacher Routes */}
            <Route path="/:institution_id/teacher/dashboard" element={null } />

            {/* Student Routes */}
            <Route path="/student/dashboard" element={null } />
            <Route path="/:institution_id/student/dashboard" element={null } />
          </Routes>
        </QueryClientProvider>
      </InstitutionProvider>
    </AuthProvider>
  );
}
