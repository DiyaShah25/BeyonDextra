import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole } from '@/types/accessibility';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user for demo
const mockUser: User = {
  id: '1',
  name: 'Alex Johnson',
  email: 'alex@example.com',
  role: 'learner',
  xp: 2450,
  level: 12,
  badges: [
    { id: '1', name: 'First Steps', description: 'Complete your first lesson', icon: '🎯', earnedAt: new Date() },
    { id: '2', name: 'Quick Learner', description: 'Complete 5 lessons in one day', icon: '⚡', earnedAt: new Date() },
    { id: '3', name: 'Community Star', description: 'Help 10 other learners', icon: '⭐', earnedAt: new Date() },
  ],
  completedCourses: ['course-1', 'course-2'],
  enrolledCourses: ['course-3', 'course-4', 'course-5'],
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setUser(mockUser);
  };

  const logout = () => {
    setUser(null);
  };

  const register = async (name: string, email: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    setUser({ ...mockUser, name, email });
  };

  const switchRole = (role: UserRole) => {
    if (user) {
      setUser({ ...user, role });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        register,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
