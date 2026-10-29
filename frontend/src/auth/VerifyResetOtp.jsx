import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import LpuCampus from "./lpupic.jpg";

export default function VerifyResetOtp() {
  const { verifyResetOtp, forgotPassword } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (!email) {
      navigate("/forgot-password");
    }
  }, [email, navigate]);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => setCountdown(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleSubmit = async () => {
    setError("");
    setSuccess("");

    if (!otp || otp.length < 6) {
      setError("Please enter the 6-digit OTP");
      return;
    }

    try {
      setLoading(true);
      const res = await verifyResetOtp(email, otp);
      setSuccess(res.message);
      setTimeout(() => {
        navigate("/reset-password", { state: { email, resetToken: res.resetToken } });
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setSuccess("");
    try {
      setResendLoading(true);
      const res = await forgotPassword(email);
      setSuccess(res.message);
      setCountdown(60);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setResendLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  if (!email) return null;

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white relative overflow-hidden">
        <div className="absolute top-10 left-10 w-20 h-20 bg-orange-100 rounded-full opacity-50 blur-2xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-orange-200 rounded-full opacity-30 blur-3xl"></div>

        <div className="w-full max-w-md relative z-10 animate-fadeInUp">
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-600 rounded-3xl flex items-center justify-center shadow-2xl transform hover:rotate-6 transition-transform duration-300">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>

          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-gray-900 mb-3 animate-slideDown">
              Verify OTP
            </h1>
            <p className="text-gray-600 text-lg animate-slideDown" style={{ animationDelay: '0.1s' }}>
              Enter the 6-digit code sent to {email}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6 flex items-center gap-3">
              <p className="font-medium">{error}</p>
            </div>
          )}
          {success && (
            <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-lg mb-6 flex items-center gap-3">
              <p className="font-medium">{success}</p>
            </div>
          )}

          <div className="space-y-5">
            <div>
              <input
                type="text"
                maxLength="6"
                placeholder="6-Digit OTP"
                className="w-full text-center text-2xl tracking-widest py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading || otp.length < 6}
              className="w-full bg-gradient-to-r cursor-pointer from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 px-4 rounded-2xl transform transition-all hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-lg"
            >
              {loading ? 'Verifying...' : 'VERIFY OTP'}
            </button>

            <div className="text-center mt-6">
              <p className="text-gray-600">
                Didn't receive code?{' '}
                <button 
                  onClick={handleResend}
                  disabled={countdown > 0 || resendLoading}
                  className="text-orange-600 font-bold hover:underline disabled:text-gray-400"
                >
                  {resendLoading ? 'Sending...' : countdown > 0 ? `Wait ${countdown}s` : 'Resend'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${LpuCampus})` }}></div>
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/90 via-orange-600/85 to-orange-700/90"></div>
        <div className="relative z-10 flex items-center justify-center p-12 w-full">
          <div className="text-center text-white max-w-lg">
            <h1 className="text-5xl font-bold mb-6 drop-shadow-lg">Just one more step</h1>
            <p className="text-xl text-white/90 drop-shadow-md">Verify your identity to reset your password.</p>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes slideDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slideDown { animation: slideDown 0.6s ease-out; }
        .animate-fadeInUp { animation: fadeInUp 0.8s ease-out; }
      `}</style>
    </div>
  );
}
