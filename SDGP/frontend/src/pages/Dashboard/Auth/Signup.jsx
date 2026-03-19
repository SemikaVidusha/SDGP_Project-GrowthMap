import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock, User } from "lucide-react";
import GrowthMapLogo from "@/assets/logo.png"; // adjust filename if needed

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = (e) => {
    e.preventDefault();
    console.log("Signup:", { name, email, password });
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

        {/* Heading */}
        <h3 className="text-lg font-semibold text-center text-slate-700 dark:text-slate-200 mb-6">
          Create Your Account
        </h3>

        <form onSubmit={handleSignup} className="space-y-5">

          {/* Name */}
          <div className="relative">
            <User className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
            <Input
              type="text"
              placeholder="Full name"
              className="pl-10 rounded-lg"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
            <Input
              type="email"
              placeholder="Email address"
              className="pl-10 rounded-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            />
          </div>

          {/* Signup Button */}
          <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-lg">
            Sign Up
          </Button>

        </form>

        {/* Login link */}
        <p className="text-sm text-center mt-6 text-slate-500 dark:text-slate-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-indigo-600 font-medium hover:text-indigo-700"
          >
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}
