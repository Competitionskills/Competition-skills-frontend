import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

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
  // NEW:
  isReady: boolean;
  token: string | null;
  setToken: (t: string | null) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isUserLoading, setIsUserLoading] = useState<boolean>(true);
  const [isReady, setIsReady] = useState<boolean>(false); // finished first hydration (success or fail)
  const [token, setTokenState] = useState<string | null>(() => localStorage.getItem('token'));

  const setToken = (t: string | null) => {
    if (t) localStorage.setItem('token', t);
    else localStorage.removeItem('token');
    setTokenState(t);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const refreshUser = useCallback(async () => {
    console.log('[🔄 RefreshUser] Starting...');
    try {
      if (!token) {
        console.warn('[⚠️ No token found]');
        setUser(null);
        return;
      }
      setIsUserLoading(true);

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
      setIsReady(true); // mark hydration complete
    }
  }, [token]);

  // hydrate on mount & whenever token changes
  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  // cross-tab token sync (optional)
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'token') setTokenState(localStorage.getItem('token'));
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        refreshUser,
        isUserLoading,
        // NEW provided values:
        isReady,
        token,
        setToken,
        logout,
      }}
    >
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
