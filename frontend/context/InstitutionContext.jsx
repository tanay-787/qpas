import React, { createContext, useContext, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext'; // Assuming AuthContext.jsx is in the same directory or adjust path
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase.config'; // Adjust path as needed
import { useToast } from '@/hooks/use-toast'; // Keep if used by other parts, else remove if only sonner is used here
import { useNavigate } from 'react-router-dom';
import { toast as sonner } from 'sonner';

// --- Create Context ---
const InstitutionContext = createContext(null);

// --- Custom Hook to use Context ---
export function useInstitution() {
  const context = useContext(InstitutionContext);
  if (!context) {
    throw new Error('useInstitution must be used within an InstitutionProvider');
  }
  return context;
}

// --- API Helper Functions ---

// Fetch institution based on user role
const fetchInstitution = async (user) => {
  // Guard clause: Ensure user and role are available
  if (!user?.role) {
    console.log("Skipping institution fetch: user role not yet available.");
    // Return null or throw an error depending on desired behavior when role is missing
    // Returning null allows the query to potentially succeed with null data if role never appears.
    // Throwing an error will mark the query as failed. Let's return null for now.
    return null;
  }

  // Determine API endpoint based on role
  const institution_API_Endpoint = user.role === 'admin'
    ? '/api/institutions/by-uid' // Endpoint for admins (fetching the one they created)
    : '/api/institutions/by-memberOf'; // Endpoint for others (fetching the one they belong to)

  console.log(`Fetching institution from: ${institution_API_Endpoint}`);

  try {
    // Make the GET request using Axios (interceptor will add token)
    const response = await axios.get(institution_API_Endpoint);
    console.log("Fetch successful, returning data:", response.data);
    // Return the data part of the response
    return response.data;
  } catch (error) {
    // Log detailed error and re-throw for React Query
    console.error("Error in fetchInstitution:", error.response?.data || error.message);
    // Throw a more specific error message if available from response, otherwise a generic one
    throw error.response?.data || new Error("Failed to fetch institution details");
  }
};

// Create a new institution
const createInstitution = async (data) => {
  // POST request to create endpoint
  const response = await axios.post('/api/institutions/create', data);
  // Return the data from the response (usually the newly created institution object)
  return response.data;
};

// Update an existing institution
const updateInstitution = async ({ inst_id, ...data }) => {
  // PATCH request to update endpoint (assuming PATCH for partial updates)
  const response = await axios.patch(`/api/institutions/${inst_id}/update`, data);
  // Return the data from the response (usually the updated institution object)
  return response.data;
};

// Upload institution logo to Firebase Storage
const uploadLogo = async (file) => {
  try {
    // Create a reference in Firebase Storage
    const storageRef = ref(storage, `institution-logos/${Date.now()}_${file.name}`); // Add timestamp for uniqueness
    // Upload the file
    await uploadBytes(storageRef, file);
    // Get the download URL for the uploaded file
    const logoUrl = await getDownloadURL(storageRef);
    return logoUrl;
  } catch (error) {
    // Log error and re-throw
    console.error("Failed to upload logo", error);
    throw new Error('Failed to upload logo');
  }
};


// --- InstitutionProvider Component ---
export function InstitutionProvider({ children }) {
  // Get user data, token, and auth loading states from AuthContext
  const { user, userToken, isLoggedIn, isLoading: isAuthLoading } = useAuth();
  // Get React Query client instance
  const queryClient = useQueryClient();
  // Hook for navigation
  const navigate = useNavigate();
  // Ref to store the ID of the loading toast notification
  const loadingToastId = useRef(null);

  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        // Add the token only if it exists
        if (userToken) {
          config.headers['Authorization'] = `Bearer ${userToken}`;
        }
        return config; // Return the modified config
      },
      (error) => Promise.reject(error) // Forward request errors
    );

    // Cleanup function to remove the interceptor when the component unmounts or token changes
    return () => {
      axios.interceptors.request.eject(requestInterceptor);
    };
  }, [userToken]);

  // --- React Query: Fetch Institution Data ---
  const {
    data: institutionData,          // The fetched institution data (or undefined/null)
    isLoading: isInstitutionLoadingInitially, // True only on initial load when no data exists
    isFetching: isInstitutionFetching,      // True during initial fetch AND background refetches
    isSuccess: isInstitutionFetched,        // True if the last fetch succeeded (stays true after success)
    isError: isInstitutionError,          // True if the last fetch failed
    error: institutionError,              // The error object if the fetch failed
    refetch: refetchInstitution,          // Function to manually trigger a refetch
    status: institutionStatus,            // Detailed status: 'pending', 'error', 'success'
  } = useQuery({
    // Unique key for this query, includes user UID to refetch if user changes
    queryKey: ['institution', user?.uid],
    // The function that performs the data fetching
    queryFn: () => fetchInstitution(user),
    // Enable the query only when:
    // 1. Firebase auth state indicates user is logged in.
    // 2. The AuthContext is not in its initial loading state (Firestore user data fetch is done).
    // 3. The Firestore user object exists AND has a 'role' property needed by fetchInstitution.
    enabled: isLoggedIn && !isAuthLoading && !!user?.role,
    // Configuration options:
    staleTime: 5 * 60 * 1000,       // Data is considered fresh for 5 minutes
    gcTime: 10 * 60 * 1000,         // Data is kept in cache for 10 minutes after becoming inactive
    refetchOnWindowFocus: false,    // Don't refetch automatically when browser tab regains focus
    retry: 1,                       // Retry failed fetches once
    // notifyOnChangeProps: 'all', // Consider using 'all' if observing many states, or list specific ones
  });

  // --- Effect 1: Show Loading Toast ---
  // Manages the appearance of the "loading" notification
  useEffect(() => {

    if (isInstitutionFetching && !loadingToastId.current) {
      loadingToastId.current = sonner.loading('Fetching institution details...');
      console.log("Sonner: Showing loading toast", loadingToastId.current);
    }

  }, [isInstitutionFetching]);


  useEffect(() => {

    if (!isInstitutionFetching && loadingToastId.current) {
      const toastId = loadingToastId.current; // Capture ID before resetting ref


      if (institutionStatus === 'success') {

        console.log("Sonner: Updating toast to SUCCESS", toastId, "Data:", institutionData);
        sonner.success(`Successfully fetched ${institutionData?.name || 'your institution'} details.`, {
          id: toastId, // Target the specific toast to update it
          description: 'Institution data loaded.',
          duration: 5000, // Optional: How long the success toast stays visible (ms)
          // Optional Action Button:
          action: {
            label: 'Go to Dashboard',
            onClick: () => {
              // Ensure necessary data exists before navigating
              if (institutionData?.inst_id && user?.role) {
                navigate(`/${institutionData.inst_id}/${user.role}/dashboard`);
              }
            },
          }
        });
      } else if (institutionStatus === 'error') {
        console.log("Sonner: Updating toast to ERROR", toastId, "Error:", institutionError);
        sonner.error(`Failed to fetch institution: ${institutionError?.message || 'Unknown error'}`, {
          id: toastId, // Target the specific toast to update it
        });
      } else {
        // UNEXPECTED CASE: Fetching stopped, but status isn't success or error
        // (e.g., query was disabled mid-fetch). Dismiss the loading toast.
        console.log("Sonner: Dismissing toast (unexpected status after fetch)", toastId, "Status:", institutionStatus);
        sonner.dismiss(toastId);
      }

      loadingToastId.current = null;
    }


  }, [
    isInstitutionFetching,  // To know when fetching stops
    institutionStatus,      // To know the final outcome ('success', 'error')
    institutionData,        // Needed for the success message content
    institutionError,       // Needed for the error message content
    user?.role              // Needed for the optional navigation action path
  ]);


  // Mutation for Creating an Institution
  const createInstitutionMutation = useMutation({
    mutationFn: createInstitution, // The function that performs the API call
    onSuccess: (data) => {
      // When creation is successful:
      // 1. Invalidate the 'institution' query cache to force a refetch of the user's institution data.
      queryClient.invalidateQueries({ queryKey: ['institution', user?.uid] });
      // 2. Show a success notification.
      sonner.success("Institution created successfully!", { description: `Welcome to ${data?.name}` });
      // 3. Optionally navigate the user (e.g., to the new institution's dashboard).
      if (data?.inst_id) {
        navigate(`/${data.id}/admin/dashboard`);
      }
    },
    onError: (error) => {
      // When creation fails:
      console.error("Failed to create institution:", error);
      // Show an error notification.
      sonner.error("Failed to create institution", { description: error.message || "An unknown error occurred." });
    },
  });

  // Mutation for Updating an Institution
  const updateInstitutionMutation = useMutation({
    mutationFn: updateInstitution, // The function that performs the API call
    onSuccess: (updatedInstitution) => {
      // When update is successful:
      // 1. Invalidate the query cache to refetch fresh data. (Safer)
      queryClient.invalidateQueries({ queryKey: ['institution', user?.uid] });
      // --- OR ---
      // 2. Manually update the cache with the returned data (Faster UI, assumes response is accurate).
      // queryClient.setQueryData(['institution', user?.uid], updatedInstitution);
      // ---
      // 3. Show a success notification.
      sonner.success("Institution updated successfully!");
    },
    onError: (error) => {
      // When update fails:
      console.error("Failed to update institution:", error);
      // Show an error notification.
      sonner.error("Failed to update institution", { description: error.message || "An unknown error occurred." });
    },
  });


  // --- Context Value ---
  // Assemble the value object to be provided by the context
  const contextValue = {
    // Institution Data & State
    institution: institutionData,             // The fetched institution object
    isInstitutionLoading: isInstitutionFetching, // General loading state (true during any fetch)
    isInstitutionLoadingInitially: isInstitutionLoadingInitially, // Specific initial load state
    isInstitutionError: isInstitutionError,     // Error flag for the institution query
    institutionError: institutionError,         // The error object itself
    isInstitutionFetched: isInstitutionFetched,   // Success flag for the institution query
    refetchInstitution,                       // Function to manually refetch

    // Mutations & Their States
    createInstitution: createInstitutionMutation.mutateAsync, // Function to trigger creation (async version)
    updateInstitution: updateInstitutionMutation.mutateAsync, // Function to trigger update (async version)
    isCreatingInstitution: createInstitutionMutation.isPending, // Loading state for creation
    isUpdatingInstitution: updateInstitutionMutation.isPending, // Loading state for update

    // Other Utilities
    uploadLogo, // Function to upload a logo
    // handleNavigation, // Include if you have a separate navigation handler function
  };

  // Provide the context value to children components
  return (
    <InstitutionContext.Provider value={contextValue}>
      {children}
    </InstitutionContext.Provider>
  );
}