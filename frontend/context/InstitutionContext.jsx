import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase.config';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLocation } from 'react-router-dom';

// Create a context
const InstitutionContext = createContext();

// Custom hook to use context
export function useInstitution() {
  return useContext(InstitutionContext);
}

// Fetch institution function
const fetchInstitution = async (user) => {
  try {
    const institution_API_Endpoint = (user?.role === 'admin') ? (`/api/institutions/by-uid`) : (`/api/institutions/by-memberOf`);
    const response = await axios.get(institution_API_Endpoint);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch institution", error);
    throw error;
  }
};

// Create institution function
const createInstitution = async (data) => {
  try {
    const response = await axios.post('/api/institutions/create', data);
    return response.data;
  } catch (error) {
    console.error("Failed to create institution", error);
    throw new Error('Failed to create institution');
  }
};

// Update institution function
const updateInstitution = async (data) => {
  try {
    const response = await axios.patch(`/api/institutions/update`, data);
    return response.data;
  } catch (error) {
    console.error("Failed to update institution", error);
    throw new Error('Failed to update institution');
  }
};


// InstitutionProvider component
export function InstitutionProvider({ children }) {
  const { user, userToken } = useAuth();
  const [institution, setInstitution] = useState(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [proceedToNavigate, setProceedToNavigate] = useState(false); //For AutoRouting

  //Setting userToken through axios interceptors

  useEffect(() => {
    // Setup Axios interceptor to add token to every request
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        if (userToken) {
          config.headers['Authorization'] = `Bearer ${userToken}`; // Add token if available
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Cleanup interceptor when the component unmounts or userToken changes
    return () => {
      axios.interceptors.request.eject(requestInterceptor);
    };
  }, [userToken]);



  // Fetch institution data
  const { data: institutionData, isLoading: isFetchingInstitution, isError: isInstitutionError, isSuccess: isInstitutionFetched, error: institutionError, refetch: refetchInstitution } = useQuery({
    queryKey: ['institution', user?.uid],
    queryFn: () => fetchInstitution(user),
    enabled: !!(user?.uid && user?.role),
  });

  useEffect(() => {
    // Alternative for the onSuccess behaviour of useQuery (useQuery: onSuccess has been deprecated in v5)
    if (isInstitutionFetched) {
      setInstitution(institutionData);
    }
    
    
  }, [isInstitutionFetched, institutionData]);

  useEffect(() => {
    if(isInstitutionError){
      toast({
        title: "Failed to fetch your institution details",
        description: `${institutionError.response?.data?.message}`,
        variant: 'destructive'
      })
    }
  },[isInstitutionError, institutionError])
  


  const handleRouting = (user, institution) => {
    if (user && institution) {
      toast({
        title: 'We found your institution',
        description: 'Click on the button to visit your dashboard',
        action: (
          <Button
            onClick={() => handleNavigation(user, institution)} // Pass handleNavigation inside onClick
            variant="outline"
            className="rounded-full"
          >
            Continue
          </Button>
        ),
      });
    }
  };

  const handleNavigation = async (user, institution) => {
    // Display a full page loading animation instead of this toast
    toast({
      title: 'Redirecting you to your dashboard',
      description: 'Please wait...',
    });

    const studentDashboardPath = `${institution?.inst_id}/student/dashboard`;
    const teacherDashboardPath = `${institution?.inst_id}/teacher/dashboard`;
    const adminDashboardPath = `${institution?.inst_id}/admin/dashboard`;

    let pathToNavigate;

    if (user?.role === 'admin' && institution?.createdBy === user?.uid) {
      pathToNavigate = adminDashboardPath;
    } else if (user?.role === 'teacher' && user?.memberOf === institution?.inst_id) {
      pathToNavigate = teacherDashboardPath;
    } else if (user?.role === 'student' && user?.memberOf === institution?.inst_id) {
      pathToNavigate = studentDashboardPath;
    }

    if (!pathToNavigate) {
      toast({
        title: 'No institution found',
        description: 'Please create an institution or join an existing institution.',
        status: 'error',
      });
      return;
    }

    if (pathToNavigate) {
      navigate(pathToNavigate);
    }
  };
  
  // Call handleRouting whenever the institution is fetched and set
  useEffect(() => {
    if (institution) {
      handleRouting(user, institution);
    }
  }, [institution]);


  // Create Institution mutation
  const { mutateAsync: createInstitutionMutation, isLoading: isCreatingInstitution, error: createInstitutionError } = useMutation({
    mutationFn: (data) => createInstitution(data),
    enabled: !!(user?.uid && !user?.role),
    onSuccess: () => {
      queryClient.invalidateQueries(['institution', user?.uid]);
      refetchInstitution();
    },
    onError: (error) => {
      console.error("Failed to create institution:", error);
      
    },
  });


  // Institution update mutation
  const { mutateAsync: updateInstitutionMutation, isLoading: isUpdatingInstitution, error: updateInstitutionError } = useMutation({
    mutationFn: (data) => updateInstitution(data),
    enabled: !!(user?.uid && user?.role === 'admin'), // Only enable for users with admin role
    onSuccess: (updatedInstitution) => {
      setInstitution(updatedInstitution);
      // Invalidate the 'institution' query to trigger a refetch
      queryClient.invalidateQueries(['institution', user?.uid]);
    },
    onError: (error) => {
      console.error("Failed to update institution:", error);
    },
  });

  // Logo file upload function
  const uploadLogo = async (file) => {
    try {
      const storageRef = ref(storage, `institution-logos/${file.name}`);
      await uploadBytes(storageRef, file);
      const logoUrl = await getDownloadURL(storageRef);
      return logoUrl;
    } catch (error) {
      console.error("Failed to upload logo", error);
      throw new Error('Failed to upload logo');
    }
  };

  // Handle Routing






  return (
    <InstitutionContext.Provider
      value={{
        institution,
        isLoading: isFetchingInstitution || isCreatingInstitution || isUpdatingInstitution,
        createInstitution: createInstitutionMutation,
        updateInstitution: updateInstitutionMutation,
        uploadLogo,
        error: institutionError || createInstitutionError || updateInstitutionError,
      }}
    >
      {children}
    </InstitutionContext.Provider>
  );
}
