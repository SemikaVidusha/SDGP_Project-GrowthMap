import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import GrowthMapLogo from "../../../assets/logo.png";

export default function VerifySignup() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract email from query params (passed from Signup)
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get("email");

  useEffect(() => {
    if (!email) {
      setError("No email address provided. Please restart the signup process.");
    }
    // Focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [email]);

  const handleChange = (index, value) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return;

    const newCode = [...code];
    // Handle pasting multiple digits
    if (value.length > 1) {
      const pastedDigits = value.slice(0, 6).split("");
      for (let i = 0; i < pastedDigits.length; i++) {
        if (index + i < 6) {
          newCode[index + i] = pastedDigits[i];
        }
      }
      setCode(newCode);
      
      // Focus next available input or last
      const nextIndex = Math.min(index + pastedDigits.length, 5);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value !== "" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      // Focus previous input on backspace if current is empty
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!email) return;

    const fullCode = code.join("");
    if (fullCode.length !== 6) {
      return setError("Please enter the full 6-digit code.");
    }

    setError("");
    setMessage("");
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/verify-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: fullCode }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || "Failed to verify account");
      }
      
      setMessage("Account successfully verified! Redirecting...");
      
      // Log the user in
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify({
        _id: data._id,
        name: data.name,
        email: data.email
      }));
      
      // Redirect to dashboard
      setTimeout(() => {
        navigate("/");
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
        </div>

        {/* Heading */}
        <h3 className="text-lg font-semibold text-center text-slate-700 mb-2">
          Verify Your Account
        </h3>
        <p className="text-sm text-center text-slate-500 mb-6">
          We've sent a 6-digit confirmation code to <span className="font-semibold text-slate-700">{email || "your email"}</span>. Enter it to create your account!
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

        <form onSubmit={handleVerify} className="space-y-6">
          {/* OTP Code Input Boxes */}
          <div className="flex justify-between gap-2">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={6} // allow pasting full code
                className="w-12 h-14 text-center text-xl font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                disabled={!email || message.length > 0}
              />
            ))}
          </div>

          {/* Verify Button */}
          <Button 
            disabled={isLoading || !email || message.length > 0}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-lg disabled:opacity-70 mt-2"
          >
            {isLoading ? "Verifying..." : "Create Account"}
          </Button>
        </form>

        {/* Back to Signup */}
        <div className="mt-6 flex justify-center">
          <Link
            to="/signup"
            className="text-sm text-slate-500 hover:text-indigo-600 font-medium flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Sign Up
          </Link>
        </div>

      </div>
    </div>
  );
}
