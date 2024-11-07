import { createContext, useState, useEffect, useContext } from 'react';
import { ROLES } from '../types';
import { authService } from '../services/authService';

/**
 * Context for managing authentication state globally.
 * Provides user information and auth functions to all child components.
 */
export const AuthContext = createContext(null);

/**
 * Provider component that wraps the app and makes auth available to all child components.
 * Manages user authentication state and provides login/logout functionality.
 * 
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Child components to render
 */
export function AuthProvider({ children }) {
  // Track the authenticated user
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for existing user session on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const user = await authService.getCurrentUser();
        if (user) setUser(user);
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        setLoading(false);
      }
    };
  
    initAuth();
  }, []);
  /**
   * Handles user login.
   * In a real app, this would verify credentials against a backend.
   * 
   * @param {string} email - User's email
   * @param {string} password - User's password
   */
  const login = async (email, password) => {
    try {
      setError(null);
      const user = await authService.login(email, password);
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
    } catch (err) {
      setError('Invalid email or password');
      throw err;
    }
  };

  /**
   * Handles user logout.
   * Clears user data from state and localStorage.
   */
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <p>Loading...</p>
    </div>;
  }
  return (
    <AuthContext.Provider value={{ 
          user, 
          login, 
          logout, 
          error,
          isAuthenticated: !!user 
        }}>
  {children}
</AuthContext.Provider>
  );
}

/**
 * Custom hook to use authentication context.
 * Provides a convenient way to access auth functionality in any component.
 * 
 * @returns {Object} Auth context value containing user data and auth functions
 * @throws {Error} If used outside of AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
