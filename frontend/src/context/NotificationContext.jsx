import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from "@/hooks/use-toast";
// Import Firestore instance and functions
import { firestore as db } from '../../firebase.config.js'; // Adjust path if needed
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc, serverTimestamp, Timestamp } from "firebase/firestore";
import { useNavigate } from 'react-router-dom'; // Keep for navigating on click

const NotificationContext = createContext();

export function useNotifications() {
  return useContext(NotificationContext);
}

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true); // Start loading true
  const { user } = useAuth(); // Get the authenticated user
  const { toast } = useToast();
  const navigate = useNavigate();

  // Listener Effect
  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
      return; // No user, clear state and stop
    }

    setLoading(true);

    // Reference to the user's notifications subcollection
    // Structure: /users/{userId}/notifications/{notificationId}
    const notificationsRef = collection(db, 'users', user.uid, 'notifications');
    const q = query(notificationsRef, orderBy('timestamp', 'desc')); // Order by timestamp descending

    // Set up the real-time listener
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedNotifications = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        fetchedNotifications.push({
          id: doc.id, // Use Firestore document ID
          ...data,
          // Convert Firestore Timestamp to JS Date for easier use in components
          timestamp: data.timestamp instanceof Timestamp ? data.timestamp.toDate() : new Date(),
        });
      });

      setNotifications(fetchedNotifications);
      setUnreadCount(fetchedNotifications.filter(n => !n.read).length);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching notifications:", error);
      toast({ title: "Error", description: "Could not load notifications.", variant: "destructive" });
      setLoading(false);
    });

    // Cleanup function: Unsubscribe when component unmounts or user changes
    return () => unsubscribe();

  }, [user, toast]); // Dependency on user and toast

  // --- Mark Notification as Read ---
   const markAsRead = useCallback(async (notificationId) => {
    if (!user) return; // Should not happen if called from UI, but good practice

    const notificationRef = doc(db, 'users', user.uid, 'notifications', notificationId);

    try {
      await updateDoc(notificationRef, {
        read: true
      });
      // No need to update state manually, the listener will handle it.
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
      toast({ title: "Error", description: "Could not update notification status.", variant: "destructive" });
      // Optionally, could revert state if needed, but listener should eventually sync
    }
  }, [user, toast]); // Dependency on user and toast


  // --- (Optional) Function to manually trigger a toast for a NEW notification ---
  // This could be useful if you want to show a toast *in addition* to the bell update
  // when the listener detects a brand new, unread notification.
  // You might compare the new snapshot to the previous one to detect additions.
  // Or, the backend could potentially send a push message via FCM for immediate toasts.
  // For simplicity, we'll rely on the bell icon updating for now.

  const value = {
    notifications,
    unreadCount,
    loading,
    // fetchNotifications is no longer needed as listener handles updates
    markAsRead,
    // addNotification might be removed unless frontend creates notifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}
