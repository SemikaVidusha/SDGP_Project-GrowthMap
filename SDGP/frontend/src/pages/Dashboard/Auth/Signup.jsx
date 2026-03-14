import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Mail, Lock, User, CheckCircle2, ShieldCheck, RefreshCw } from "lucide-react";
import GrowthMapLogo from "../../../assets/logo.png";

export default function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendCode = async (e) => {
    e.preventDefault();
    if (!name || !email) return setError("Please enter your name and email.");
    
    setError("");
    setMessage("");
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to initiate signup");

      setMessage("Verification code sent to email!");
      setIsEmailSent(true);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    if (code.length !== 6) return setError("Please enter the 6-digit code.");

    setError("");
    setMessage("");
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/verify-signup-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to verify code");

      setMessage("Email verified! Please set your password.");
      setIsEmailVerified(true);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinalizeSignup = async (e) => {
    e.preventDefault();
    if (password.length < 6) return setError("Password must be at least 6 characters.");

    setError("");
    setMessage("");
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/finalize-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to complete signup");

      setMessage("Account created! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
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

        {/* Header Block */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={GrowthMapLogo}
            alt="GrowthMap Logo"
            className="w-20 h-auto mb-2 drop-shadow-md"
          />
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">
            GrowthMap
          </h2>
          <p className="text-sm text-slate-500 mt-1">Discover your skills. Map your future.</p>
        </div>

        <h3 className="text-lg font-semibold text-center text-slate-700 mb-6">
          Create Your Account
        </h3>

        {/* Error/Message Banners */}
        {message && (
          <div className="mb-4 p-3 bg-emerald-50 text-emerald-600 text-sm rounded-lg text-center border border-emerald-100 flex items-center justify-center gap-2 animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="w-4 h-4" /> {message}
          </div>
        )}
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center border border-red-100 animate-in fade-in slide-in-from-top-2">
            {error}
          </div>
        )}

        {/* Main Interface */}
        <div className="space-y-4">
          
          {/* Name Field */}
          <div className="relative">
            <User className={`absolute left-3 top-3.5 w-5 h-5 ${isEmailVerified ? 'text-slate-300' : 'text-slate-400'}`} />
            <Input
              type="text"
              placeholder="Full name"
              className="pl-10 rounded-lg disabled:opacity-75 disabled:bg-slate-50"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isEmailVerified || isEmailSent || isLoading}
            />
          </div>

          {/* Email Field & Verify CTA */}
          <div className="flex gap-2 relative">
            <div className="relative flex-1">
              <Mail className={`absolute left-3 top-3.5 w-5 h-5 ${isEmailVerified ? 'text-emerald-500' : 'text-slate-400'}`} />
              <Input
                type="email"
                placeholder="Email address"
                className={`pl-10 rounded-lg disabled:opacity-75 ${
                  isEmailVerified ? "bg-emerald-50 text-emerald-700 border-emerald-200 disabled:opacity-100" : "disabled:bg-slate-50"
                }`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isEmailSent || isEmailVerified || isLoading}
              />
              {isEmailVerified && (
                <CheckCircle2 className="absolute right-3 top-3.5 w-4 h-4 text-emerald-600" />
              )}
            </div>
            
            {/* Step 1: Initial Verify Button */}
            {!isEmailSent && !isEmailVerified && (
              <Button 
                onClick={handleSendCode}
                disabled={isLoading || !email || !name}
                className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
              >
                Verify
              </Button>
            )}
            
            {/* Step 2: Show small change email button if OTP was sent */}
            {isEmailSent && !isEmailVerified && (
               <Button 
                 variant="ghost" 
                 onClick={() => {
                   setIsEmailSent(false);
                   setCode("");
                   setMessage("");
                   setError("");
                 }}
                 disabled={isLoading}
                 className="text-slate-500 hover:text-slate-700 hover:bg-slate-100 px-2 flex-shrink-0"
                 title="Change Email Address"
               >
                 <RefreshCw className="w-4 h-4" />
               </Button>
            )}
          </div>

          {/* Step 2 Extension: OTP Code Field */}
          {isEmailSent && !isEmailVerified && (
            <div className="flex gap-2 animate-in fade-in slide-in-from-top-2 pt-2 border-t border-slate-100 mt-2">
              <div className="relative flex-1">
                <ShieldCheck className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                <Input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="6-digit code"
                  className="pl-10 rounded-lg text-slate-700 placeholder:text-slate-400"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                  disabled={isLoading}
                  autoFocus
                />
              </div>
              <Button 
                onClick={handleVerifyCode}
                disabled={isLoading || code.length !== 6}
                className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
              >
                Confirm
              </Button>
            </div>
          )}

          {/* Step 3 Extension: Password Field */}
          {isEmailVerified && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-2 pt-2 border-t border-slate-100">
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                <Input
                  type="password"
                  placeholder="Choose a password (min 6 chars)"
                  className="pl-10 rounded-lg"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  minLength={6}
                  autoFocus
                />
              </div>
              <Button 
                onClick={handleFinalizeSignup}
                disabled={isLoading || password.length < 6}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-lg text-md font-semibold mt-2"
              >
                {isLoading ? "Creating Account..." : "Complete Sign Up"}
              </Button>
            </div>
          )}

        </div>

        {/* Login Link */}
        <p className="text-sm text-center mt-8 text-slate-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors"
          >
            Login here
          </Link>
        </p>

      </div>
    </div>
  );
}