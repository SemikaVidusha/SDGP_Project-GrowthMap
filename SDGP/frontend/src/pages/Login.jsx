import React from 'react';

const Login = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <div className="bg-white w-full max-w-md p-8 rounded-3xl shadow-xl shadow-blue-100/50">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-slate-800">Welcome Back</h2>
                    <p className="text-slate-500 mt-2">Please enter your details to sign in</p>
                </div>
                
                <form className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                        <input type="email" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all" placeholder="name@example.com" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                        <input type="password" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all" placeholder="••••••••" />
                    </div>
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-200">
                        Sign In
                    </button>
                </form>
                
                <p className="text-center mt-6 text-slate-600">
                    Don't have an account? <a href="/register" className="text-blue-600 font-bold hover:underline">Sign up</a>
                </p>
            </div>
        </div>
    );
};

export default Login;