import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  authenticateUser, 
  getDashboardPathByRole, 
  saveRememberedEmail, 
  getRememberedEmail, 
  clearRememberedEmail 
} from '../utils/auth';

import { DUMMY_USERS } from '../data/users';

const AuthContext = createContext(null);

const AUTH_USER_KEY = 'hospital_erp_auth_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(AUTH_USER_KEY) || sessionStorage.getItem(AUTH_USER_KEY);
      return stored ? JSON.parse(stored) : DUMMY_USERS[0];
    } catch {
      return DUMMY_USERS[0];
    }
  });

  const [rememberedEmail, setRememberedEmail] = useState(() => getRememberedEmail());

  const [toast, setToast] = useState({
    show: false,
    type: 'success', // 'success' | 'error'
    title: '',
    message: ''
  });

  const showToast = () => {
    // Toast notifications are disabled per user request.
  };

  const hideToast = () => {
    // Toast notifications are disabled.
  };

  const login = async (email, password, rememberMe = false) => {
    // Simulate async network latency for smooth UI feedback (800ms)
    await new Promise((resolve) => setTimeout(resolve, 800));

    const result = authenticateUser(email, password);

    if (result.success && result.user) {
      setUser(result.user);

      // Store in session or local storage
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem(AUTH_USER_KEY, JSON.stringify(result.user));

      if (rememberMe) {
        saveRememberedEmail(email);
        setRememberedEmail(email);
      } else {
        clearRememberedEmail();
        setRememberedEmail('');
      }

      showToast(
        'success',
        'Authentication Successful',
        `Welcome back, ${result.user.name}! Redirecting to ${result.user.role} Dashboard...`
      );

      return {
        success: true,
        user: result.user,
        targetPath: getDashboardPathByRole(result.user.role)
      };
    } else {
      showToast(
        'error',
        'Authentication Failed',
        result.message || 'Invalid credentials. Please verify your email and password.'
      );

      return {
        success: false,
        message: result.message
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_USER_KEY);
    sessionStorage.removeItem(AUTH_USER_KEY);
    showToast('success', 'Logged Out', 'You have been successfully logged out.');
  };

  const updateAuthUser = (patch) => {
    setUser((prev) => {
      const updated = { ...prev, ...patch };
      try {
        if (localStorage.getItem(AUTH_USER_KEY)) {
          localStorage.setItem(AUTH_USER_KEY, JSON.stringify(updated));
        }
        if (sessionStorage.getItem(AUTH_USER_KEY)) {
          sessionStorage.setItem(AUTH_USER_KEY, JSON.stringify(updated));
        }
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        updateAuthUser,
        rememberedEmail,
        toast,
        showToast,
        hideToast
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
