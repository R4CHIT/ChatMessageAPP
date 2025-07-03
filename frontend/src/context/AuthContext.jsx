import React, { createContext, useState, useEffect } from "react";
import axios from "../axios";


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem("accesstoken");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      fetchUser(token);
    } else {
      setLoading(false);
    }
  }, []);
  const fetchUser = async (token) => {
    try {
      const response = await axios.get("/api/auth/dashboard/");
      setUser(response.data.user);
    } catch (error) {
      
    } finally {
      setLoading(false);
    }
  };

  const Login = async (credentials,navigate) => {
    
    try {
      // Make the login request to the backend
      const response = await axios.post(
        "/api/auth/login/",
        credentials,
      );
  
      // Log the response to check if the tokens are correct
      console.log("Login successful. Response:", response.data);
      
      const { access, refresh } = response.data;
      // Store tokens in localStorage
      localStorage.setItem("accesstoken", access);
      localStorage.setItem("refreshtoken", refresh);
      // Set the Authorization header for further requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${access}`;
  
      // Fetch user data after login
      await fetchUser(access);
      navigate("/");
    } catch (error) {
      
      console.error("Login failed:", error.response.data );
      
    } finally {
      setLoading(false);
    }
  };
  
const register = async (credentials) => {
    try {
      // Make the login request to the backend
      const response = await axios.post(
        "/api/auth/register/",
        credentials,
      );
  
      // Log the response to check if the tokens are correct
      console.log("register successful. Response:");
      Navigate("/login");
    } catch (error) {
      setError(error.response.data);
      // Enhanced error logging for better debugging
      console.error("register failed:");
    } finally {
      setLoading(false);
    }
  };
  

  const Logout = () => {
    localStorage.removeItem("accesstoken");
    localStorage.removeItem("refreshtoken");
    setUser(null);
    delete axios.defaults.headers.common["Authorization"];
  };

  

  return (
    <AuthContext.Provider value={{ user, loading, Login, Logout , register,error}}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
