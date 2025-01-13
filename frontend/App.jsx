import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthProvider from "./context/AuthContext";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { InstitutionProvider } from "./context/InstitutionContext";


import LandingPage from "./components/LandingPage";
import SignUp from "./components/user-auth/SignUp";
import LogIn from "./components/user-auth/LogIn";
import RoleSelection from "./components/Role-Selection";
import CreateInstitution from "./components/admin/CreateInstitution";
import AdminDashboard from "./components/admin/AdminDashboard";
import BrowseInstitutions from "./components/BrowseInstitutions";

import SampleDashboard from "./components/SampleDashboard";
import FormStructureBuilder from "./components/FormStructureBuilder";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <InstitutionProvider>
      
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
            
            <Route path="/sample" element={<SampleDashboard />} />
            {/* Admin Routes */}
            <Route path="/institutions/:institution_id/form-builder" element={<FormStructureBuilder /> } />
            <Route path="/:institution_id/admin/verification-form" element={null } />
            <Route path="/:institution_id/admin/dashboard" element={<AdminDashboard /> } />

            {/* Teacher Routes */}
            <Route path="/:institution_id/teacher/dashboard" element={null } />

            {/* Student Routes */}
            <Route path="/student/dashboard" element={null } />
            <Route path="/:institution_id/student/dashboard" element={null } />
          </Routes>
      </InstitutionProvider>
    </AuthProvider>
    </QueryClientProvider>
  );
}
