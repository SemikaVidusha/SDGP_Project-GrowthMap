import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Login = () => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex w-full min-h-screen font-sans text-gray-900 bg-gray-50 flex-col md:flex-row antialiased"
        >
            {/* Left Side */}
            <div className="w-full md:w-[40%] bg-gradient-to-br from-[#101935] to-[#0a1024] p-10 md:p-16 flex flex-col justify-between relative overflow-hidden min-h-[250px] md:min-h-screen">
                <h1 className="text-white font-serif text-3xl md:text-[38px] leading-tight font-medium">
                    Welcome Back to<br />Your GrowthMap
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
                        <h2 className="text-[26px] font-bold text-gray-900 mb-9">Login</h2>

                        <form className="flex flex-col gap-7" onSubmit={(e) => e.preventDefault()}>
                            <div className="relative">
                                <input type="email" id="email" required className="w-full p-4 border border-gray-300 rounded-xl text-[15px] outline-none focus:border-[#164e63] focus:ring-4 focus:ring-[#164e63]/10 transition-all bg-transparent text-gray-900" />
                                <label htmlFor="email" className="absolute left-3.5 -top-2.5 bg-white px-1.5 text-[13px] font-medium text-gray-500 pointer-events-none">Email</label>
                            </div>

                            <div className="relative">
                                <input type="password" id="password" required className="w-full p-4 border border-gray-300 rounded-xl text-[15px] outline-none focus:border-[#164e63] focus:ring-4 focus:ring-[#164e63]/10 transition-all bg-transparent text-gray-900" />
                                <label htmlFor="password" className="absolute left-3.5 -top-2.5 bg-white px-1.5 text-[13px] font-medium text-gray-500 pointer-events-none">Password</label>
                            </div>

                            <div className="flex justify-end -mt-3">
                                <a href="#" className="flex content-end text-[13px] font-medium text-[#164e63] hover:underline">Forgot password?</a>
                            </div>

                            <button type="submit" className="w-full bg-[#164e63] text-white rounded-xl p-4 text-[16px] font-semibold hover:bg-[#0f3d4d] active:translate-y-0.5 transition-all shadow-[0_4px_12px_rgba(22,78,99,0.2)] hover:shadow-[0_6px_16px_rgba(22,78,99,0.3)] mt-2">
                                Login
                            </button>
                        </form>

                        <div className="mt-5 text-center text-[14px] text-gray-500">
                            Don't have an account? <Link to="/signup" className="text-gray-900 font-semibold hover:text-[#164e63] hover:underline transition-colors">Sign up</Link>
                        </div>

                        <div className="flex items-center text-center my-7 text-gray-400 text-[14px] font-medium before:flex-1 before:border-b before:border-gray-200 after:flex-1 after:border-b after:border-gray-200">
                            <span className="px-4 text-gray-500">or</span>
                        </div>

                        <button type="button" className="w-full flex items-center justify-center gap-3 bg-gray-200 text-gray-900 rounded-xl p-4 text-[15px] font-semibold hover:bg-gray-300 active:translate-y-0.5 transition-all">
                            <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" /><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" /><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" /><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" /></svg>
                            Sign in with Google
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Login;
