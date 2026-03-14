import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Mail, ArrowLeft, Send } from "lucide-react";
import GrowthMapLogo from "../../../assets/logo.png";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong");
      
      setMessage(data.message);
      
      // Auto redirect to verify-code with email
      setTimeout(() => {
        navigate(`/verify-code?email=${encodeURIComponent(email)}`);
      }, 1500);
      
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
          <p className="text-sm text-slate-500 mt-1 text-center">
            Discover your skills. Map your future.
          </p>
        </div>

        {/* Heading */}
        <h3 className="text-lg font-semibold text-center text-slate-700 mb-2">
          Reset Your Password
        </h3>
        <p className="text-sm text-center text-slate-500 mb-6">
          Enter your email address and we'll send you a link to reset your password.
        </p>

        {/* Message / Error */}
        {message && (
          <div className="mb-4 p-3 bg-emerald-50 text-emerald-600 text-sm rounded-lg text-center border border-emerald-100">
            {message}
          </div>
        )}
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleReset} className="space-y-5">
          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
            <Input
              type="email"
              placeholder="Email address"
              className="pl-10 rounded-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Reset Button */}
          <Button 
            disabled={isLoading || message.length > 0}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-lg disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {isLoading ? "Sending..." : (
              <>
                <Send className="w-4 h-4" /> Send Reset Link
              </>
            )}
          </Button>
        </form>

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
