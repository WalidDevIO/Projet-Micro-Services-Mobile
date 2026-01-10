import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../services/authService';
import { STORAGE_KEYS } from '../constants/api';
import { User } from '../models/User';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);

      if (storedToken) {
        // Verify token validity and get latest user data including admin status
        try {
          // Temporarily set token for the request if not already set in interceptor
          // But interceptor reads from storage so it should be fine.
          const verifyResponse = await authService.checkToken();
          if (verifyResponse.valid) {
            setToken(storedToken);
            // Construct user object from verify response
            const userData = {
              id: verifyResponse.id,
              username: verifyResponse.username,
              admin: verifyResponse.admin
            };
            setUser(new User(userData));
            // Update stored user data
            await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
          } else {
            // Token invalid
            await logout();
          }
        } catch (verifyError) {
          console.log('Token verification failed:', verifyError);
          await logout();
        }
      }
    } catch (error) {
      console.error('Error loading auth:', error);
    } finally {
      setLoading(false);
    }
  };

  const signin = async (username, password) => {
    try {
      const response = await authService.signin(username, password);

      if (response.success && response.token) {
        await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.token);

        // Now fetch full user details including admin status
        try {
          // Ensure the token is available for the next request
          // Note: interceptor reads from AsyncStorage, so it should be available immediately

          const verifyResponse = await authService.checkToken();

          let userData = response.user;
          if (verifyResponse.valid) {
            userData = {
              ...response.user,
              id: verifyResponse.id, // Ensure we have the ID
              admin: verifyResponse.admin
            };
          }

          await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));

          setToken(response.token);
          setUser(new User(userData));

          return { success: true };
        } catch (error) {
          console.error('Error fetching admin status:', error);
          // Fallback to basic user data if verification fails (shouldn't happen if login succeeded)
          // But treating as success might be risky if admin status is crucial. 
          // Let's assume valid login but maybe network error on verify.
          await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.user));
          setToken(response.token);
          setUser(new User(response.user));
          return { success: true };
        }
      }

      return { success: false, message: 'Invalid credentials' };
    } catch (error) {
      console.error('Signin error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Connection failed'
      };
    }
  };

  const signup = async (userData) => {
    try {
      const response = await authService.signup(userData);

      if (response.success) {
        return { success: true, message: 'Account created successfully' };
      }

      return { success: false, message: 'Signup failed' };
    } catch (error) {
      console.error('Signup error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Signup failed'
      };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
      setToken(null);
      setUser(null);
    }
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    signin,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
