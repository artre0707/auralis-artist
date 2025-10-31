import { useState, useEffect } from 'react';

const USER_KEY = "auralis-user";

/**
 * Custom hook to manage and persist the user's name in localStorage.
 * Ensures a consistent user identity across the Studio.
 */
export function useUserName() {
  const [userName, setUserName] = useState<string>(() => {
    // Get initial value from localStorage, defaulting to "Guest"
    try {
      return localStorage.getItem(USER_KEY) || "Guest";
    } catch {
      return "Guest";
    }
  });

  // Effect to persist the user's name whenever it changes.
  useEffect(() => {
    try {
      if (userName.trim()) {
        localStorage.setItem(USER_KEY, userName.trim());
      } else {
        // If the name is cleared, remove it from storage to reset to "Guest" on next load
        localStorage.removeItem(USER_KEY);
      }
    } catch (e) {
      console.error("Failed to persist user name", e);
    }
  }, [userName]);
  
  return { userName, setUserName };
}
