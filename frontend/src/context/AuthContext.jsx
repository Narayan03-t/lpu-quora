import { createContext, useState } from "react";
import api from "../api/axios";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  
  const [auth, setAuth] = useState(
    JSON.parse(localStorage.getItem("auth")) || null
  );




const login = async (email, password) => {
  const res = await api.post("/auth/login", { email, password });

  const data = {
    token: res.data.token,
    user: res.data.user,
  };

  localStorage.setItem("auth", JSON.stringify(data));
  setAuth(data);
};


  const googleLogin = async (token) => {
    const res = await api.post("/auth/google", { token });
    const data = {
      token: res.data.token,
      user: res.data.user,
    };
    localStorage.setItem("auth", JSON.stringify(data));
    setAuth(data);
  };

  const logout = () => {
    setAuth(null);
    localStorage.removeItem("auth");
  };

  const forgotPassword = async (email) => {
    const res = await api.post("/auth/forgot-password", { email });
    return res.data;
  };

  const verifyResetOtp = async (email, otp) => {
    const res = await api.post("/auth/verify-reset-otp", { email, otp });
    return res.data;
  };

  const resetPassword = async (email, resetToken, newPassword, confirmPassword) => {
    const res = await api.post("/auth/reset-password", { email, resetToken, newPassword, confirmPassword });
    return res.data;
  };

  return (
    <AuthContext.Provider value={{ auth, login, googleLogin, logout, forgotPassword, verifyResetOtp, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

