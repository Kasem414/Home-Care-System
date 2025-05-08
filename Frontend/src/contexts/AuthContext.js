import React, { createContext, useState, useContext, useEffect } from "react";

// Create the Authentication Context
const AuthContext = createContext();

// Hook to use the Auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provider Component that wraps your app and makes auth available to any child component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Simulate checking if user is already logged in (e.g., from localStorage)
  useEffect(() => {
    const checkLoggedIn = () => {
      try {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
          setUser(JSON.parse(savedUser));
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Error loading auth state:", error);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      // In a real app, make an API call to authenticate
      // For demo purposes, simulating login
      const mockUser = {
        id: "user123",
        name: "Test User",
        email: email,
        role: "client", // Or could be "admin", "provider"
      };

      setUser(mockUser);
      setIsAuthenticated(true);

      // Save to localStorage for persistence
      localStorage.setItem("user", JSON.stringify(mockUser));

      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: error.message };
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
  };

  // Register function
  const register = async (userData) => {
    try {
      // In a real app, make an API call to register the user
      // For demo purposes, simulating registration
      const mockUser = {
        id: "user" + Date.now(),
        name: userData.name,
        email: userData.email,
        role: "client",
      };

      setUser(mockUser);
      setIsAuthenticated(true);

      // Save to localStorage for persistence
      localStorage.setItem("user", JSON.stringify(mockUser));

      return { success: true };
    } catch (error) {
      console.error("Registration error:", error);
      return { success: false, error: error.message };
    }
  };

  // Update profile function
  const updateProfile = async (profileData) => {
    try {
      // In a real app, make an API call to update the user profile
      // For demo purposes, simulating profile update
      const updatedUser = {
        ...user,
        ...profileData,
      };

      setUser(updatedUser);

      // Save to localStorage for persistence
      localStorage.setItem("user", JSON.stringify(updatedUser));

      return { success: true };
    } catch (error) {
      console.error("Profile update error:", error);
      return { success: false, error: error.message };
    }
  };

  // Change password function
  const changePassword = async (currentPassword, newPassword) => {
    try {
      // In a real app, make an API call to change the password
      // For demo purposes, simulating password change
      // Here we would validate the current password against the stored password

      return { success: true };
    } catch (error) {
      console.error("Password change error:", error);
      return { success: false, error: error.message };
    }
  };

  // Delete account function
  const deleteAccount = async () => {
    try {
      // In a real app, make an API call to delete the account
      // For demo purposes, simulating account deletion

      // Clear user data
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("user");

      return { success: true };
    } catch (error) {
      console.error("Account deletion error:", error);
      return { success: false, error: error.message };
    }
  };

  // Value object that will be passed to any consuming components
  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    register,
    updateProfile,
    changePassword,
    deleteAccount,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
