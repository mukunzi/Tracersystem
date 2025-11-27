
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string, role?: 'admin' | 'leader' | 'member') => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('trade_union_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string, role?: 'admin' | 'leader' | 'member'): Promise<boolean> => {
    // Mock authentication for admin
    if (role === 'admin' && username === 'admin' && password === 'admin123') {
      const adminUser: User = {
        id: 'admin-1',
        username: 'admin',
        role: 'admin'
      };
      setUser(adminUser);
      localStorage.setItem('trade_union_user', JSON.stringify(adminUser));
      return true;
    }

    // Check syndicate leader credentials
    const syndicates = JSON.parse(localStorage.getItem('syndicates') || '[]');
    const syndicate = syndicates.find((s: any) => 
      s.leaderCredentials.username === username && 
      s.leaderCredentials.password === password
    );

    if (syndicate) {
      const leaderUser: User = {
        id: `leader-${syndicate.id}`,
        username: username,
        role: 'leader',
        syndicateId: syndicate.id
      };
      setUser(leaderUser);
      localStorage.setItem('trade_union_user', JSON.stringify(leaderUser));
      return true;
    }

    // Check member credentials
    const members = JSON.parse(localStorage.getItem('members') || '[]');
    const member = members.find((m: any) => 
      m.credentials && 
      m.credentials.username === username && 
      m.credentials.password === password
    );

    if (member) {
      const memberUser: User = {
        id: `member-${member.id}`,
        username: username,
        role: 'member',
        syndicateId: member.syndicateId
      };
      setUser(memberUser);
      localStorage.setItem('trade_union_user', JSON.stringify(memberUser));
      return true;
    }

    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('trade_union_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
