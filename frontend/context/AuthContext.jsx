import React, { createContext, useContext, useEffect, useState } from 'react'
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth'
import { updateProfile } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { auth, firestore } from '../firebase.config'
import { useToast } from '@/hooks/use-toast'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext(null)

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [userToken, setUserToken] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      
      if (firebaseUser) {
        try {
          // Setting Auth JWT Token by Firebase
          const token = await firebaseUser.getIdToken();
          setUserToken(token);
          
          // Fetch user data from Firestore
          const userDocRef = doc(firestore, "users", firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
  
            // Set user data in state
            setUser(userData); // Only set user state if user data exists
            setIsLoggedIn(true);
          } else {
            console.log("No user data found");
            setUser(null);
          }

        } catch (error) {
          console.error("Error fetching user data:", error);
          setUser(null);
        }
      } else {
        // User is logged out, reset user state
        setUser(null);
        setIsLoggedIn(false);
      }
  
      setLoading(false);
    });
  
    return () => unsubscribe(); // Cleanup on unmount
  }, []);
  


  const showAuthError = () => {
    if (!isLoggedIn) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to perform this action.",
        variant: "destructive",
      })
      return false
    }
    return true
  }

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const userData = {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
      }

      const userDocRef = doc(firestore, "users", result.user.uid)
      const userDoc = await getDoc(userDocRef)

      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          ...userData,
          createdAt: new Date(),
        })
      }
      
      setIsLoggedIn(true)

      toast({
        title: "Success",
        description: "Successfully signed in with Google",
      })
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "Failed to sign in with Google",
        variant: "destructive",
      })
    }
  }

  const signInWithEmail = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
      setIsLoggedIn(true)
      toast({
        title: "Success",
        description: "Successfully signed in",
      })
      await handleRoleBasedRouting()
    } catch (error) {
      toast({
        title: "Failed to sign in",
        description: "Please re-check credentials and try again",
        variant: "destructive",
      })
    }
  }

  const createUserWithEmail = async (email, password, displayName) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      const user = result.user
  
      await updateProfile(user, { displayName })
  
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: displayName,
      }
  
      const userDocRef = doc(firestore, "users", user.uid)
      await setDoc(userDocRef, {
        ...userData,
        createdAt: new Date(),
      })
  
      setIsLoggedIn(true)
  
      toast({
        title: "Success",
        description: "Account created successfully",
      })
      navigate('/role-selection')
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      setIsLoggedIn(false)
      setUser(null)
      navigate('/')
      toast({
        title: "Success",
        description: "Successfully signed out",
      })
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      })
    }
  }
  
  const handleRoleBasedRouting = async() => {
    try {
      if (!isLoggedIn) {
        toast({
          title: "Routing",
          description: "Make sure you have signed in and please try again.",
          variant: "destructive"
        })
        return
      }
      const userDocRef = doc(firestore, "users", user.uid)
      const userDoc = await getDoc(userDocRef)
      const userData = userDoc.data()
      
      setUser(userData)

    } catch (error) {
      toast({
        title: "Routing",
        description: "Unable to route based on role. Please try again.",
        variant: "destructive"
      })
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        userToken,
        isLoggedIn,
        loading,
        signInWithGoogle,
        signInWithEmail,
        createUserWithEmail,
        logout,
        handleRoleBasedRouting,
        showAuthError
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

