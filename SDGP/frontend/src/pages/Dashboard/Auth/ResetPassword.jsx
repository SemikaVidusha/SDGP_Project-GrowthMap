import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Lock, ArrowLeft, CheckCircle2 } from "lucide-react";
import GrowthMapLogo from "../../../assets/logo.png";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract token from URL query string
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing password reset token.");
    }
  }, [token]);

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (newPassword !== confirmPassword) {
      return setError("Passwords do not match");
    }

    if (newPassword.length < 6) {
      return setError("Password must be at least 6 characters long");
    }

    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || "Failed to reset password");
      }
      
      setIsSuccess(true);
      setMessage("Your password has been successfully reset!");
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
        
        {/* GrowthMap Logo */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={GrowthMapLogo}
            alt="GrowthMap Logo"
            className="w-28 h-auto mb-2 drop-shadow-md"
          />
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
            GrowthMap
          </h2>
        </div>

        {/* Heading */}
        <h3 className="text-lg font-semibold text-center text-slate-700 mb-2">
          Create New Password
        </h3>
        <p className="text-sm text-center text-slate-500 mb-6">
          Enter your new password below to regain access to your account.
        </p>

        {/* Message / Error */}
        {message && (
          <div className="mb-4 p-3 bg-emerald-50 text-emerald-600 text-sm rounded-lg text-center border border-emerald-100 flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> {message}
          </div>
        )}
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center border border-red-100">
            {error}
          </div>
        )}

        {!isSuccess && token && (
          <form onSubmit={handleReset} className="space-y-5">
            {/* New Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
              <Input
                type="password"
                placeholder="New password"
                className="pl-10 rounded-lg"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
              <Input
                type="password"
                placeholder="Confirm new password"
                className="pl-10 rounded-lg"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {/* Submit Button */}
            <Button 
              disabled={isLoading || !token}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-lg disabled:opacity-70"
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        )}

        {/* Back to Login */}
        <div className="mt-6 flex justify-center">
          <Link
            to="/login"
            className="text-sm text-slate-500 hover:text-indigo-600 font-medium flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to login
          </Link>
        </div>

      </div>
    </div>
  );
}
