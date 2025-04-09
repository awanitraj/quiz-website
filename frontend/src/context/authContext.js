import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    const user = authService.getCurrentUser();
    if (user) {
      setUser(user);
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  };

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    setUser(data);
    setIsAuthenticated(true);
    return data;
  };

  const register = async (username, email, password, role) => {
    const data = await authService.register(username, email, password, role);
    return data;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easier consumption
export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;