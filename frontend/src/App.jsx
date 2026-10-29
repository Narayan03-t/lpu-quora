
import { Routes, Route } from "react-router-dom";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Home from "./pages/Home";
import AdminPanel from "./pages/AdminPanel";
import ProtectedRoute from "./auth/ProtectedRoute";
import CheckEmail from "./pages/CheckEmail";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./auth/ForgotPassword";
import VerifyResetOtp from "./auth/VerifyResetOtp";
import ResetPassword from "./auth/ResetPassword";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />


     <Route path="/check-email" element={<CheckEmail />} />
     <Route path="/verify-email" element={<VerifyEmail />} />

     <Route path="/forgot-password" element={<ForgotPassword />} />
     <Route path="/verify-reset-otp" element={<VerifyResetOtp />} />
     <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/" element={
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      } />

      <Route path="/admin" element={
        <ProtectedRoute adminOnly>
          <AdminPanel />
        </ProtectedRoute>
      } />
    </Routes>
  );
}
