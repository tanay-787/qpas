import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase.config';
import { useToast } from '@/hooks/use-toast';

// Create a context
const InstitutionContext = createContext();

// Custom hook to use context
export function useInstitution() {
  return useContext(InstitutionContext);
}

// Fetch institution function
const fetchInstitution = async (user, userToken) => {
  try {
    const institution_API_Endpoint = (user?.role === 'admin') ? (`/api/institutions/by-uid`) : (`/api/institutions/by-memberOf`);
    const response = await axios.get(institution_API_Endpoint, {
      headers: {
        'Authorization': `Bearer ${userToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch institution", error);
    throw new Error('Failed to fetch institution');
  }
};

// Create institution function
const createInstitution = async (data, userToken) => {
  try {
    const response = await axios.post('/api/institutions/create', data, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to create institution", error);
    throw new Error('Failed to create institution');
  }
};

// Update institution function
const updateInstitution = async (data, userToken) => {

  try {
    const response = await axios.patch(`/api/institutions/update`, data, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`,
      },
    });
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

  // Fetch institution data
  const { data: institutionData, isLoading: isFetchingInstitution, isError: isInstitutionError, isSuccess: isInstitutionFetched, error: institutionError } = useQuery({
    queryKey: ['institution', user?.uid],
    queryFn: () => fetchInstitution(user, userToken),
    enabled: !!(user?.uid && user?.role),
  });


  useEffect(() => {
    // Alternative for the onSuccess behaviour of useQuery (deprecated)
    if (isInstitutionFetched) {
      setInstitution(institutionData);
    }
  }, [isInstitutionFetched, institutionData]);


  // Institution create mutation
  const { mutateAsync: createInstitutionMutation, isLoading: isCreatingInstitution, error: createInstitutionError } = useMutation({
    mutationFn: (data) => createInstitution(data, userToken),
    enabled: !!(user?.uid && !user.role),
    onSuccess: () => {
      queryClient.invalidateQueries(['institution', user?.uid]);
    },
    onError: (error) => {
      console.error("Failed to create institution:", error);
    },
  });


  // Institution update mutation
  const { mutateAsync: updateInstitutionMutation, isLoading: isUpdatingInstitution, error: updateInstitutionError } = useMutation({
    mutationFn: (data) => updateInstitution(data, userToken),
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

  // Provide values via context
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
