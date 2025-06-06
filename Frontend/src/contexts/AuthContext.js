import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

// API base URL
const API_BASE_URL = "http://localhost:8000/auth";

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
  const [token, setToken] = useState(null);

  // Check if user is already logged in from localStorage
  useEffect(() => {
    const checkLoggedIn = () => {
      try {
        console.log("Checking logged in state...");
        const savedToken = localStorage.getItem("token");
        const savedUser = localStorage.getItem("user");

        console.log("Saved auth state:", {
          hasToken: !!savedToken,
          hasUser: !!savedUser,
        });

        if (savedToken && savedUser) {
          const decodedToken = jwtDecode(savedToken);
          const userData = JSON.parse(savedUser);

          console.log("Decoded token:", decodedToken);
          console.log("Loaded user data:", userData);

          // Update user data with role and id from token
          userData.role = decodedToken.role;
          userData.id = decodedToken.user_id;

          setToken(savedToken);
          setUser(userData);
          setIsAuthenticated(true);

          // Set up axios authorization header for future requests
          axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${savedToken}`;

          console.log(
            "Auth state restored successfully with user_id:",
            userData.id
          );
        } else {
          console.log("No saved auth state found");
        }
      } catch (error) {
        console.error("Error loading auth state:", error);
        // Clear potentially corrupted auth state
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  // Login function
  const login = async (email, password, onSuccess) => {
    try {
      console.log("Attempting login...");
      const response = await axios.post(`${API_BASE_URL}/login`, {
        email,
        password,
      });

      console.log("Login response:", response.data);

      // Check if we have the token in the response
      if (response.data && response.data.token) {
        const authToken = response.data.token;

        // Decode the token to get user information
        const decodedToken = jwtDecode(authToken);
        console.log("Decoded token:", decodedToken);

        const userData = {
          ...response.data.user,
          role: decodedToken.role,
          id: decodedToken.user_id,
        };

        console.log("Setting user data with user_id:", userData);

        // Save user data and token
        setUser(userData);
        setToken(authToken);
        setIsAuthenticated(true);

        // Set authorization header for future requests
        axios.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;

        // Save to localStorage for persistence
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", authToken);

        console.log("Login successful, navigating...");

        // Navigate based on role from token
        if (onSuccess) {
          switch (decodedToken.role) {
            case "service_provider":
              onSuccess("/provider/dashboard");
              break;
            case "administrator":
              onSuccess("/admin");
              break;
            case "customer":
              onSuccess("/requests");
              break;
            default:
              onSuccess("/");
          }
        }

        return { success: true };
      } else {
        console.log("Invalid response structure:", response.data);
        return {
          success: false,
          error: "Invalid response structure from server",
        };
      }
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        error:
          error.response?.data?.message ||
          "Failed to log in. Please check your credentials.",
      };
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
  };

  // Register homeowner function
  const registerHomeowner = async (userData, onSuccess) => {
    try {
      console.log("Starting homeowner registration with data:", userData);

      const response = await axios.post(`${API_BASE_URL}/register/homeowner`, {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phone: userData.phone,
        city: userData.city,
        region: userData.region,
        password: userData.password,
      });

      console.log("Registration response:", response.data);

      if (response.data) {
        console.log("Registration successful, attempting login...");

        const loginResult = await login(
          userData.email,
          userData.password,
          (path) => {
            console.log("Login successful, navigating to:", path);
            onSuccess(path);
          }
        );

        console.log("Login result:", loginResult);

        if (!loginResult.success) {
          console.log("Auto-login failed:", loginResult.error);
          return {
            success: false,
            error: loginResult.error,
          };
        }

        return { success: true };
      } else {
        console.log("Registration failed:", response.data);
        return {
          success: false,
          error:
            response.data?.detail ||
            response.data?.message ||
            "Registration failed",
        };
      }
    } catch (error) {
      console.error("Registration error:", error.response?.data);
      // Extract error message from response
      const errorMessage =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        error.response?.data?.error ||
        (typeof error.response?.data === "string"
          ? error.response.data
          : null) ||
        "Registration failed. Please try again.";

      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  // Register service provider function
  const registerServiceProvider = async (userData, onSuccess) => {
    try {
      console.log("Starting provider registration with data:", userData);

      const response = await axios.post(`${API_BASE_URL}/register/provider`, {
        companyName: userData.companyName,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phone: userData.phone,
        password: userData.password,
        city: userData.city,
        region: userData.region,
        serviceCategories: userData.serviceCategories,
        serviceRegions: userData.serviceRegions,
        yearsInBusiness: userData.yearsInBusiness,
        employeeCount: userData.employeeCount,
        bio: userData.bio,
        availability: userData.availability,
      });

      console.log("Provider registration response:", response.data);

      if (response.data) {
        console.log("Provider registration successful, attempting login...");

        const loginResult = await login(
          userData.email,
          userData.password,
          (path) => {
            console.log("Provider login successful, navigating to:", path);
            onSuccess(path);
          }
        );

        console.log("Provider login result:", loginResult);

        if (!loginResult.success) {
          console.log("Provider auto-login failed:", loginResult.error);
          return {
            success: false,
            error: loginResult.error,
          };
        }

        return { success: true };
      } else {
        console.log("Provider registration failed:", response.data);
        return {
          success: false,
          error:
            response.data?.detail ||
            response.data?.message ||
            "Registration failed",
        };
      }
    } catch (error) {
      console.error("Provider registration error:", error.response?.data);
      // Extract error message from response
      const errorMessage =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        error.response?.data?.error ||
        (typeof error.response?.data === "string"
          ? error.response.data
          : null) ||
        "Registration failed. Please try again.";

      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  // Update profile function
  const updateProfile = async (profileData) => {
    try {
      // This would be implemented once you have a profile update API endpoint
      const updatedUser = {
        ...user,
        ...profileData,
      };

      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      return { success: true };
    } catch (error) {
      console.error("Profile update error:", error);
      return {
        success: false,
        error:
          error.response?.data?.message ||
          "Profile update failed. Please try again.",
      };
    }
  };

  // Change password function
  const changePassword = async (currentPassword, newPassword) => {
    try {
      // This would be implemented once you have a password change API endpoint
      return { success: true };
    } catch (error) {
      console.error("Password change error:", error);
      return {
        success: false,
        error:
          error.response?.data?.message ||
          "Password change failed. Please try again.",
      };
    }
  };

  // Delete account function
  const deleteAccount = async () => {
    try {
      // This would be implemented once you have an account deletion API endpoint
      // Clear user data after successful deletion
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];

      return { success: true };
    } catch (error) {
      console.error("Account deletion error:", error);
      return {
        success: false,
        error:
          error.response?.data?.message ||
          "Account deletion failed. Please try again.",
      };
    }
  };

  // Value object that will be passed to any consuming components
  const value = {
    user,
    loading,
    isAuthenticated,
    token,
    login,
    logout,
    registerHomeowner,
    registerServiceProvider,
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
