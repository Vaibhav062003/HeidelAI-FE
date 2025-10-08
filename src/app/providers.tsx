'use client';

import { useEffect } from 'react';
import { fetchEncryptionKey, clearEncryptionKey } from '@/lib/indexedDB';
import { useAuth } from '@clerk/nextjs';

export function SecurityProvider({ children }: { children: React.ReactNode }) {
  const { isLoaded, userId, sessionId } = useAuth();
  
  useEffect(() => {
    // Initialize encryption when auth is loaded and user is signed in
    if (isLoaded) {
      if (userId && sessionId) {
        fetchEncryptionKey()
          .catch(error => console.error('Failed to initialize encryption:', error));
      } else {
        // Clear the key when logged out
        clearEncryptionKey();
      }
    }
  }, [isLoaded, userId, sessionId]);
  
  return <>{children}</>;
}