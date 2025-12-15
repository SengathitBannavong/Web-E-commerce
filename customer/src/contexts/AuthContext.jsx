import React, { createContext, useContext, useState, useEffect } from "react";
import apiFetch from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);

  useEffect(() => {
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
  }, [token]);

  const login = async (email, password) => {
    const response = await apiFetch("/users/login", {
      method: "POST",
      body: JSON.stringify({ Email: email, Password: password }),
    });

    if (response.token) {
      setToken(response.token);
      localStorage.setItem("token", response.token);
      setIsAuthenticated(true);
      return { success: true };
    } else {
      return { success: false, message: "Login failed: No token received." };
    }
  };

  const register = async (userData) => {
    const response = await apiFetch("/users/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });

    if (response.token) {
      setToken(response.token);
      localStorage.setItem("token", response.token);
      setIsAuthenticated(true);
      return { success: true };
    } else {
      return {
        success: false,
        message: "Registration failed: No token received.",
      };
    }
  };

  const logout = () => {
    setToken(null);
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, token, login, logout, register }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
