import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Signup = () => {
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowToast(true);

    // Automatically hide toast and redirect after 5 seconds
    setTimeout(() => {
      setShowToast(false);
      navigate('/login');
    }, 5000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex w-full min-h-screen font-sans text-gray-900 bg-gray-50 flex-col md:flex-row antialiased"
    >
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", bounce: 0.35 }}
            className="fixed top-6 right-6 md:top-8 md:right-10 z-[100] bg-white border border-[#164e63]/20 shadow-[0_10px_40px_rgba(0,0,0,0.12)] px-6 py-4 rounded-xl flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-[16px]">Account Created Successfully!</p>
              <p className="text-gray-500 text-[14px]">Redirecting you to login automatically...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Left Side */}
      <div className="w-full md:w-[40%] bg-gradient-to-br from-[#101935] to-[#0a1024] p-10 md:p-16 flex flex-col justify-between relative overflow-hidden min-h-[250px] md:min-h-screen">
        <h1 className="text-white font-serif text-3xl md:text-[38px] leading-tight font-medium">
          Your Path to Smarter<br />Career Growth
        </h1>

        <div className="w-full justify-start items-end flex-grow mt-12 md:mt-20 hidden md:flex">
          <img
            src="https://illustrations.popsy.co/amber/student-going-to-school.svg"
            alt="Career Growth"
            className="max-w-[130%] -ml-[15%] -mb-20 object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.3)]"
          />
        </div>
      </div>

      {/* Right Side */}
      <div className="w-full md:w-[60%] bg-gray-50 relative flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-[540px]">

          {/* Logo */}
          <div className="static md:absolute top-10 right-14 flex items-center justify-center md:justify-end gap-2 mb-8 md:mb-0">
            <span className="text-3xl">🦉</span>
            <span className="font-bold text-sm tracking-widest text-gray-900 font-sans">GROWTHMAP</span>
          </div>

          {/* Form Container */}
          <div className="bg-white p-8 md:p-12 rounded-[20px] shadow-[0_10px_40px_rgba(0,0,0,0.04)] md:mt-10">
            <h2 className="text-[26px] font-bold text-gray-900 mb-9">Create Account</h2>

            <form className="flex flex-col gap-7" onSubmit={handleSubmit}>
              <div className="flex flex-col md:flex-row gap-7 md:gap-5">
                <div className="relative flex-1">
                  <input type="text" id="firstName" required className="w-full p-4 border border-gray-300 rounded-xl text-[15px] outline-none focus:border-[#164e63] focus:ring-4 focus:ring-[#164e63]/10 transition-all bg-transparent text-gray-900" />
                  <label htmlFor="firstName" className="absolute left-3.5 -top-2.5 bg-white px-1.5 text-[13px] font-medium text-gray-500 pointer-events-none">First Name</label>
                </div>
                <div className="relative flex-1">
                  <input type="text" id="lastName" required className="w-full p-4 border border-gray-300 rounded-xl text-[15px] outline-none focus:border-[#164e63] focus:ring-4 focus:ring-[#164e63]/10 transition-all bg-transparent text-gray-900" />
                  <label htmlFor="lastName" className="absolute left-3.5 -top-2.5 bg-white px-1.5 text-[13px] font-medium text-gray-500 pointer-events-none">Last Name</label>
                </div>
              </div>

              <div className="relative">
                <input type="email" id="email" required className="w-full p-4 border border-gray-300 rounded-xl text-[15px] outline-none focus:border-[#164e63] focus:ring-4 focus:ring-[#164e63]/10 transition-all bg-transparent text-gray-900" />
                <label htmlFor="email" className="absolute left-3.5 -top-2.5 bg-white px-1.5 text-[13px] font-medium text-gray-500 pointer-events-none">Email</label>
              </div>

              <div className="relative">
                <input type="password" id="password" required className="w-full p-4 border border-gray-300 rounded-xl text-[15px] outline-none focus:border-[#164e63] focus:ring-4 focus:ring-[#164e63]/10 transition-all bg-transparent text-gray-900" />
                <label htmlFor="password" className="absolute left-3.5 -top-2.5 bg-white px-1.5 text-[13px] font-medium text-gray-500 pointer-events-none">Password</label>
              </div>

              <button
                type="submit"
                disabled={showToast}
                className="w-full bg-[#164e63] text-white rounded-xl p-4 text-[16px] font-semibold hover:bg-[#0f3d4d] active:translate-y-0.5 transition-all shadow-[0_4px_12px_rgba(22,78,99,0.2)] hover:shadow-[0_6px_16px_rgba(22,78,99,0.3)] mt-2 disabled:bg-[#164e63]/80 disabled:shadow-none disabled:active:translate-y-0 disabled:cursor-wait relative overflow-hidden"
              >
                {showToast ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </span>
                ) : 'Create Account'}
              </button>
            </form>

            <div className="mt-5 text-center text-[14px] text-gray-500">
              Already have an account? <Link to="/login" className="text-gray-900 font-semibold hover:text-[#164e63] hover:underline transition-colors pointer-events-auto">Login</Link>
            </div>

            <div className="flex items-center text-center my-7 text-gray-400 text-[14px] font-medium before:flex-1 before:border-b before:border-gray-200 after:flex-1 after:border-b after:border-gray-200">
              <span className="px-4 text-gray-500">or</span>
            </div>

            <button type="button" className="w-full flex items-center justify-center gap-3 bg-gray-200 text-gray-900 rounded-xl p-4 text-[15px] font-semibold hover:bg-gray-300 active:translate-y-0.5 transition-all">
              <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" /><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" /><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" /><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" /></svg>
              Sign up with Google
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Signup;
