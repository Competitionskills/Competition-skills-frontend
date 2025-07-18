import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  _id: string;
  username: string;
  points: number;
  tickets?: number;
  prestigeTickets?: number;
}

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  refreshUser: () => Promise<void>;
  isUserLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isUserLoading, setIsUserLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    console.log('[🔄 RefreshUser] Starting...');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('[⚠️ No token found in localStorage]');
        setUser(null);
        setIsUserLoading(false);
        return;
      }

      // ✅ Updated endpoint to your working route:
      const res = await fetch('https://api.scoreperks.co.uk/api/users/user', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('[📡 Fetch status]', res.status);

      if (!res.ok) {
        const text = await res.text();
        console.error('[❌ Failed to fetch user]', res.status, text);
        setUser(null);
      } else {
        const data = await res.json();
        console.log('[✅ User fetched]', data);
        setUser(data);
      }
    } catch (err) {
      console.error('[❌ Error fetching user]', err);
      setUser(null);
    } finally {
      setIsUserLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, refreshUser, isUserLoading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
