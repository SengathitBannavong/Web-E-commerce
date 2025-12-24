import React, { createContext, useContext, useState, useEffect } from "react";
import apiFetch from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);
  const [loading, setLoading] = useState(true); 

  const mapUserResponse = (backendUser) => {
    if (!backendUser) return null;
    return {
      ...backendUser,
      name: backendUser.Name,
      email: backendUser.Email,
      phone: backendUser.PhoneNumber,
      address: backendUser.Address,
      gender: backendUser.Gender,
      avatar: backendUser.Avatar || "https://via.placeholder.com/150",
    };
  };

  useEffect(() => {
    const loadUser = async () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        try {
          const userData = await apiFetch("/users/me");
          setUser(mapUserResponse(userData));
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Token expired or invalid:", error);
          logout();
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await apiFetch("/users/login", {
        method: "POST",
        body: JSON.stringify({ Email: email, Password: password }),
      });

      if (response.token) {
        localStorage.setItem("token", response.token);
        setToken(response.token);
        setUser(mapUserResponse(response.user));
        setIsAuthenticated(true);
        return { success: true };
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const register = async (userData) => {
    try {
      const payload = {
        Name: userData.fullName,
        Email: userData.email,
        Password: userData.password,
        PhoneNumber: userData.phone,
        Address: userData.address || "Chưa cập nhật", 
        Gender: userData.gender
      };

      const response = await apiFetch("/users/register", { 
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (response.token) {
        localStorage.setItem("token", response.token);
        setToken(response.token);
        setUser(mapUserResponse(response.user));
        setIsAuthenticated(true);
        return { success: true };
      }
    } catch (error) {
      return { success: false, message: error.message };
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
      value={{ isAuthenticated, user, token, login, logout, register, loading }}
    >
      {!loading && children} 
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);