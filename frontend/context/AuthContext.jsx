import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, firestore } from '../firebase.config';
import { useToast } from '@/hooks/use-toast';
import { toast as sonner } from 'sonner';
import { useNavigate } from 'react-router-dom';
import {
  useQuery,
  useMutation,
  useQueryClient, // Import useQueryClient
} from '@tanstack/react-query';
import axios from "axios";

// --- Constants for Query Keys ---
const AUTH_QUERY_KEY = ['auth', 'user'];

// --- Helper function to fetch Firestore user data ---
const fetchFirestoreUser = async (uid) => {
  if (!uid) return null; // No user logged in
  const userDocRef = doc(firestore, 'users', uid);
  const userDoc = await getDoc(userDocRef);
  if (userDoc.exists()) {
    return userDoc.data(); // Return Firestore user data
  } else {
    console.warn('No Firestore user document found for UID:', uid);
    // Decide what to return - null, or throw an error? Null is often safer.
    return null;
  }
};

const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [firebaseUser, setFirebaseUser] = useState(() => auth.currentUser); // Initialize with current user if available
  const [userToken, setUserToken] = useState(null);
  const [initialAuthLoading, setInitialAuthLoading] = useState(true); // Tracks the initial onAuthStateChanged check
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient(); // Get query client instance

  // --- Listener for Firebase Auth state changes ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser); // Update the raw Firebase user object
      if (fbUser) {
        try {
          const token = await fbUser.getIdToken();
          setUserToken(token);
          queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
        } catch (error) {
          console.error('Error getting user token:', error);
          setUserToken(null);
          queryClient.setQueryData(AUTH_QUERY_KEY, null);
        }
      } else {
        setUserToken(null);
        queryClient.setQueryData(AUTH_QUERY_KEY, null);
      }
      setInitialAuthLoading(false);
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, [queryClient]);



  // --- React Query to fetch Firestore user data ---
  // This query depends on the firebaseUser's UID
  const {
    data: user, // This is your Firestore user data object
    isLoading: isUserLoading, // Loading state specifically for Firestore data
    isError: isUserError,
    error: userError,
  } = useQuery({
    queryKey: AUTH_QUERY_KEY, // Use the consistent query key
    queryFn: () => fetchFirestoreUser(firebaseUser?.uid), // Fetch based on current firebaseUser UID
    enabled: !!firebaseUser && !initialAuthLoading, // Only run if firebaseUser exists AND initial check is done
    staleTime: 1000 * 60 * 5, // Cache user data for 5 minutes (adjust as needed)
    gcTime: 1000 * 60 * 15, // Keep data in cache longer (garbage collection time)
    retry: 1, // Retry once on failure
    // Optional: Add placeholderData or initialData if useful
  });

  // --- Derived States ---
  const isLoggedIn = !!firebaseUser; // Logged in if firebaseUser object exists
  // Combine initial auth check loading with Firestore user data loading
  const isLoading = initialAuthLoading || (isLoggedIn && isUserLoading);

  // --- Mutations for Auth Actions ---

  const handleAuthSuccess = (fbUser, message) => {
    // Optional: Manually set firebaseUser state for immediate UI feedback,
    // though onAuthStateChanged should handle it shortly after.
    setFirebaseUser(fbUser);

    // Invalidate the user query to trigger refetch of Firestore data
    // The listener *should* catch the change, but invalidation is a safety net
    // and useful if the listener fires *before* Firestore is updated.
    queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });

    sonner.success(message.title, { description: message.description });
    navigate('/');
  };

  const handleAuthError = (error, defaultMessage) => {
    console.error(defaultMessage.title, error);
    sonner.error(defaultMessage.title, {
      description: error.message || defaultMessage.description,
    });
  };

  // --- Sign In With Google ---
  const signInWithGoogleMutation = useMutation({
    mutationFn: async () => {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const userData = {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        // photoURL: result.user.photoURL, // Optional
      };

      // Check if user exists in Firestore, create if not
      const userDocRef = doc(firestore, 'users', result.user.uid);
      const userDoc = await getDoc(userDocRef);
      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          ...userData,
          createdAt: new Date(),
          // Add any other default fields
        });
      }
      return result.user; // Return the Firebase user
    },
    onSuccess: (fbUser) => {
      handleAuthSuccess(fbUser, { title: 'Successfully signed in with Google' });
    },
    onError: (error) => {
      handleAuthError(error, { title: 'Error signing in with Google' });
    },
  });

  // --- Sign In With Email ---
  const signInWithEmailMutation = useMutation({
    mutationFn: async ({ email, password }) => {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user; // Return Firebase user
    },
    onSuccess: (fbUser) => {
      handleAuthSuccess(fbUser, {
        title: `Welcome ${fbUser?.displayName || fbUser?.email}`,
        description: 'Successfully Signed in',
      });

    },
    onError: (error) => {
      handleAuthError(error, { title: 'Failed to sign in' });
    },
  });

  // --- Create User With Email ---
  const createUserWithEmailMutation = useMutation({
    mutationFn: async ({ email, password, displayName }) => {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const fbUser = result.user;

      // Update Firebase profile
      await updateProfile(fbUser, { displayName });

      // Create Firestore document
      const userData = {
        uid: fbUser.uid,
        email: fbUser.email,
        displayName: displayName, // Use the provided displayName
      };
      const userDocRef = doc(firestore, 'users', fbUser.uid);
      await setDoc(userDocRef, {
        ...userData,
        createdAt: new Date(),
        // Add any other default fields
      });

      return fbUser; // Return Firebase user
    },
    onSuccess: (fbUser) => {
      //add a timeout to send welcome email
      setTimeout(() => {
        axios.post('/api/n8n/send-welcome-email').catch((err) => {
          console.error('Failed to trigger welcome email:', err);
          // Optional: send to Sentry or another logger
        })},5000)
      // Don't show success toast here maybe, navigate instead
      handleAuthSuccess(fbUser, { title: "Account Created", description: `Welcome ${fbUser.displayName}` });
    },
    onError: (error) => {
      // Use the original toast for this one as per your example
      console.error(error);
      toast({
        title: 'Error Creating Account',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // --- Logout ---
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await signOut(auth);
      // No need to return anything
    },
    onSuccess: () => {
      // Clear relevant query caches on logout
      queryClient.removeQueries({ queryKey: AUTH_QUERY_KEY }); // Remove user data
      // Optionally clear other user-specific data queries
      // queryClient.invalidateQueries({ queryKey: ['user-posts'] }); // Example
      // Navigate to home/login page
      navigate('/');
      toast({
        title: 'Success',
        description: 'Successfully signed out',
      });
    },
    onError: (error) => {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to sign out',
        variant: 'destructive',
      });
    },
  });

  // --- Other Functions (Can remain similar, but use React Query state) ---

  const showAuthError = () => {
    // Check based on React Query's derived state
    if (!isLoggedIn) {
      toast({
        title: 'Authentication Error',
        description: 'You must be logged in to perform this action.',
        variant: 'destructive',
      });
      return false;
    }
    return true;
  };

  // handleRoleBasedRouting might need adjustment based on when 'user' (Firestore data) is needed.
  // It might become less necessary if navigation happens within mutation onSuccess callbacks.
  const handleRoleBasedRouting = async () => {
    if (!isLoggedIn || !user) { // Check both isLoggedIn and if user data is loaded
      toast({
        title: "Routing Error",
        description: "User data not available yet or not logged in.",
        variant: "destructive"
      });
      return;
    }
    // Now 'user' is the Firestore data from the useQuery
    const role = user.role; // Assuming 'role' exists in your Firestore data
    console.log("User role:", role);
    // Add your role-based navigation logic here
    // if (role === 'admin') navigate('/admin');
    // else navigate('/dashboard');
  };


  // --- Context Value ---
  const value = {
    // State from React Query
    user, // Firestore user data (or null/undefined)
    isLoading, // Combined loading state
    isLoggedIn, // Derived from firebaseUser presence
    isUserError, // Firestore data query error status
    userError,   // Firestore data query error object

    // Raw Firebase info (optional, but can be useful)
    firebaseUser, // The raw Firebase user object
    userToken,    // Firebase ID token

    // Mutations (provide functions that call mutate/mutateAsync)
    // Using mutateAsync allows awaiting and handling promise in the component if needed
    signInWithGoogle: signInWithGoogleMutation.mutateAsync,
    signInWithEmail: signInWithEmailMutation.mutateAsync,
    createUserWithEmail: createUserWithEmailMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,

    // Mutation states (optional, pass if components need them)
    isSigningInGoogle: signInWithGoogleMutation.isPending,
    isSigningInEmail: signInWithEmailMutation.isPending,
    isCreatingUser: createUserWithEmailMutation.isPending,
    isLoggingOut: logoutMutation.isPending,

    // Utility functions
    handleRoleBasedRouting,
    showAuthError,

    // Refetch user data manually if needed (e.g., after profile update)
    refetchUser: () => queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY }),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// --- Custom Hook ---
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};