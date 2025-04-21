import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; 
import { useInstitution } from '../../context/InstitutionContext'; 
import { Skeleton } from '../../src/components/ui/skeleton'; 
import { Alert, AlertDescription, AlertTitle } from '../../src/components/ui/alert'; 
import { AlertCircle, AlertTriangle, ShieldAlert } from 'lucide-react';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, isLoading: authLoading, isLoggedIn } = useAuth();
  // Use isFetching for loading state as it covers initial load and refetches
  const { institution, isFetching: instLoading, isError: instError, error: instErrorDetails } = useInstitution(); 
  const location = useLocation();

  

  // 1. Loading States: Show skeleton while fetching auth state OR (if logged in) institution data
  if (authLoading || (isLoggedIn && instLoading)) { 
    return (
      <div className="flex flex-col space-y-4 p-6 m-auto max-w-lg">
         <Skeleton className="h-8 w-3/4 rounded-md" />
         <Skeleton className="h-4 w-1/2 rounded-md" />
         <div className="space-y-3 mt-4">
           <Skeleton className="h-[100px] w-full rounded-xl" />
           <Skeleton className="h-4 w-[280px] rounded-md" />
           <Skeleton className="h-4 w-[230px] rounded-md" />
         </div>
         <p className="text-center text-muted-foreground pt-4">Verifying your access rights...</p>
      </div>
    );
  }

  // 2. Not Logged In: Redirect to login
  if (!isLoggedIn || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Institution Context Check: Handle cases where fetch failed AFTER loading finished
   if (instError) { // Check for error *after* loading is complete
        console.error("Institution fetch error:", instErrorDetails);
        return (
         <div className="p-4 max-w-md mx-auto mt-10">
             <Alert variant="destructive">
                 <AlertCircle className="h-4 w-4" />
                 <AlertTitle>Institution Access Error</AlertTitle>
                 <AlertDescription>
                     Failed to load institution details. {instErrorDetails?.message || 'Please try again or contact support.'}
                 </AlertDescription>
             </Alert>
         </div>
     );
   }

  // 4. No Institution Found (but fetch succeeded): User might not belong to one
  if (!institution) { 
      return (
        <div className="p-4 max-w-md mx-auto mt-10">
            <Alert variant="warning"> 
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>No Institution Found</AlertTitle>
                <AlertDescription>
                    You don't seem to be associated with any institution currently. If you've just joined or created one, it might take a moment to update. Try refreshing, or contact support if this persists.
                </AlertDescription>
            </Alert>
        </div>
    );
  }

  // 5. Role and Membership Authorization Check

  const userMemberOf = user?.member_of; // ID of institution user *claims* to be part of
  const currentInstitutionId = institution?.inst_id; // ID of institution currently loaded in context

  // Check 5a: Verify the user belongs to the institution loaded in the context
  // This check might be redundant if the backend already filters correctly, but adds safety
  if (userMemberOf !== currentInstitutionId) {
       return (
        <div className="p-4 max-w-md mx-auto mt-10">
            <Alert variant="warning">
                 <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Institution Context Mismatch</AlertTitle>
                <AlertDescription>
                    Your user profile indicates you belong to a different institution (ID: {userMemberOf || 'N/A'}) than the one currently loaded (ID: {currentInstitutionId}). This might be temporary. If this persists, please log out and log back in.
                </AlertDescription>
            </Alert>
        </div>
    );
  }

  // Check 5b: Verify the user's UID is in the correct list OR has the correct role for the required access level
  let isAuthorized = false;
  const userId = user.uid;

  switch (requiredRole) {
    case 'admin':
      // Admin access requires BOTH the user role to be 'admin' AND matching the createdBy UID
      isAuthorized = institution?.createdBy?.uid === userId && user.role === 'admin'; 
      if(user.role !== 'admin') {
          console.warn(`User ${userId} attempting admin access for ${currentInstitutionId}, but their role is ${user.role}`);
      }
      break;
    case 'teacher':
       // Teacher access requires BOTH the user role to be 'teacher' AND UID in teacher_list
      isAuthorized = institution?.teacher_list?.includes(userId) && user.role === 'teacher';
      break;
    case 'student':
      // Student access requires BOTH the user role to be 'student' AND UID in student_list
      isAuthorized = institution?.student_list?.includes(userId) && user.role === 'student';
      break;
    default:
      console.error(`Unknown requiredRole: ${requiredRole} provided to ProtectedRoute`);
      isAuthorized = false; // Deny access if the role requirement is misconfigured
  }

  // If authorization fails after all checks
  if (!isAuthorized) {
     return (
        <div className="p-4 max-w-md mx-auto mt-10">
            <Alert variant="destructive">
                 <ShieldAlert className="h-4 w-4" />
                <AlertTitle>Authorization Failed</AlertTitle>
                <AlertDescription>
                    You (UID: {userId}) do not have the necessary permissions ({requiredRole}) to access this page for institution {currentInstitutionId}. Role needed: {requiredRole}, Your role: {user.role}.
                </AlertDescription>
            </Alert>
        </div>
    );
  }

  // 6. Authorization Success: Render the requested component
  return children;
};

export default ProtectedRoute;