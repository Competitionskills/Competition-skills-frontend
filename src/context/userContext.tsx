import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchUserProfile } from '../api/userApi'; // ✅ Import your API call

interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  points: number;
  username?: string;
  // Add more fields if needed
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
  try {
    setIsUserLoading(true);
    const userData = await fetchUserProfile();
    const normalizedUser = {
      ...userData,
      id: userData._id || userData.id,
    };
    setUser(normalizedUser);
  } catch (error) {
    console.error("❌ Failed to load user:", error);
    setUser(null); // fallback
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
