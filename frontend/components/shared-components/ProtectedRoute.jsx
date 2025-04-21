import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; 
import { useInstitution } from '../../context/InstitutionContext'; 
import { Skeleton } from '../../src/components/ui/skeleton'; 
import { Alert, AlertDescription, AlertTitle } from '../../src/components/ui/alert'; 
import { AlertCircle, AlertTriangle, ShieldAlert } from 'lucide-react';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, isLoading: authLoading, isLoggedIn } = useAuth();
  const { institution, isFetching: instLoading, isError: instError } = useInstitution();
  const location = useLocation();

  // 1. Loading States: Show skeleton while fetching user or institution data
  if (authLoading || (isLoggedIn && !institution && instLoading)) { // Show loading if auth is loading OR if logged in but inst is still loading
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

  if (!isLoggedIn || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Institution Context Check: Handle cases where institution data is missing or failed to load
   if (instError || !institution) {
       // This might happen if the user isn't part of any institution,
       // or if the InstitutionContext failed to load data for the user's member_of ID.
        return (
         <div className="p-4 max-w-md mx-auto mt-10">
             <Alert variant="destructive">
                 {/* Use AlertCircle from lucide-react */}
                 <AlertCircle className="h-4 w-4" />
                 <AlertTitle>Institution Access Error</AlertTitle>
                 <AlertDescription>
                     We couldn't verify your institution details. This could be because you're not currently a member of an institution, or there was an issue loading the data ({instError?.message || 'No institution context found'}). Please try logging out and back in, or contact support if the problem persists.
                 </AlertDescription>
             </Alert>
         </div>
     );
   }

  // 4. Role and Membership Authorization Check

  const userMemberOf = user?.member_of; // ID of institution user *claims* to be part of
  const currentInstitutionId = institution?.inst_id; // ID of institution currently loaded in context

  // Check 4a: Verify the user belongs to the institution loaded in the context
  if (userMemberOf !== currentInstitutionId) {
       return (
        <div className="p-4 max-w-md mx-auto mt-10">
            <Alert variant="warning">
                 {/* Use AlertTriangle from lucide-react */}
                 <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Institution Context Mismatch</AlertTitle>
                <AlertDescription>
                    Your user profile indicates you belong to a different institution (ID: {userMemberOf}) than the one currently loaded (ID: {currentInstitutionId}). This might be temporary during navigation. If this persists, please log out and log back in.
                </AlertDescription>
            </Alert>
        </div>
    );
  }

  // Check 4b: Verify the user's UID is in the correct list for the required role within *this* institution
  let isAuthorized = false;
  const userId = user.uid;

  switch (requiredRole) {
    case 'admin':
      isAuthorized = institution?.createdBy?.uid === userId;
      console.log('Admin Check status: ', isAuthorized)
      if(user.role !== 'admin') {
          console.warn(`User ${userId} attempting admin access for ${currentInstitutionId}, but their role is ${user.role}`);
          isAuthorized = false; // Explicitly deny if role mismatch, even if UID is in a list somehow
      }
      break;
    case 'teacher':
      isAuthorized = institution?.teacher_list?.includes(userId) && user.role === 'teacher';
      console.log('Teacher Check done')
      break;
    case 'student':
      isAuthorized = institution?.student_list?.includes(userId) && user.role === 'student';
      console.log('Student Check done')
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
                 {/* Use ShieldAlert (or Ban/XCircle) from lucide-react */}
                 <ShieldAlert className="h-4 w-4" />
                <AlertTitle>Authorization Failed</AlertTitle>
                <AlertDescription>
                    You (UID: {userId}) do not have the necessary permissions ({requiredRole}) to access this dashboard for institution {currentInstitutionId}. Please contact the institution administrator if you believe this is an error.
                </AlertDescription>
            </Alert>
        </div>
    );
  }

  // 5. Authorization Success: Render the requested dashboard component
  return children;
};

export default ProtectedRoute;
