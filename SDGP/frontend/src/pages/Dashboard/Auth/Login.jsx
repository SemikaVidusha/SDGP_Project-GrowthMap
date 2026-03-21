import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Mail, Lock } from "lucide-react";
import GrowthMapLogo from "../../../assets/logo.png"; // adjust name if different

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      // Save token and user details to localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect to home/dashboard
      navigate("/home");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 dark:from-slate-950 via-white dark:via-slate-900 to-indigo-50 flex items-center justify-center px-4">
      
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 p-8">

        {/* GrowthMap Logo */}
        <div className="flex flex-col items-center mb-8">
          
          <img
            src={GrowthMapLogo}
            alt="GrowthMap Logo"
            className="w-28 h-auto mb-2 drop-shadow-md"
          />

          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
            GrowthMap
          </h2>

          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 text-center">
            Discover your skills. Map your future.
          </p>

        </div>

        {/* Error/Message Banners */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center border border-red-100 animate-in fade-in slide-in-from-top-2">
            {error}
          </div>
        )}

        {/* Heading */}
        <h3 className="text-lg font-semibold text-center text-slate-700 dark:text-slate-200 mb-6">
          Welcome Back
        </h3>

        <form onSubmit={handleLogin} className="space-y-5">

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
            <Input
              type="email"
              placeholder="Email address"
              className="pl-10 rounded-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
            <Input
              type="password"
              placeholder="Password"
              className="pl-10 rounded-lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="flex justify-end mt-2">
            <Link
              to="/forgot-password"
              className="text-sm text-indigo-600 font-medium hover:text-indigo-700 transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          {/* Login Button */}
          <Button disabled={isLoading} className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-lg">
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>

        {/* Signup */}
        <p className="text-sm text-center mt-6 text-slate-500 dark:text-slate-400">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-indigo-600 font-medium hover:text-indigo-700"
          >
            Sign up
          </Link>
        </p>

      </div>
    </div>
  );
}