import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut, sendPasswordResetEmail } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth, db, ADMIN_EMAIL } from '../lib/firebase';
import { ref, onValue } from 'firebase/database';

interface AuthContextType {
  user: User | null;
  userPlayerId: string | null;
  isAdmin: boolean;
  loading: boolean;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userPlayerId, setUserPlayerId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAdmin(!!(currentUser && currentUser.email === ADMIN_EMAIL));
      
      if (currentUser?.email) {
        // Auto-assign ID for Admin if whitelist fails or for safety
        if (currentUser.email === ADMIN_EMAIL) {
          setUserPlayerId('var');
        }

        const emailKey = currentUser.email.replace(/\./g, '_');
        onValue(ref(db, `whitelist/${emailKey}`), (snap) => {
          const id = snap.val();
          if (id) setUserPlayerId(id);
          setLoading(false);
        });
      } else {
        setUserPlayerId(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const logout = () => signOut(auth);
  const resetPassword = (email: string) => sendPasswordResetEmail(auth, email);

  return (
    <AuthContext.Provider value={{ user, userPlayerId, isAdmin, loading, logout, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
