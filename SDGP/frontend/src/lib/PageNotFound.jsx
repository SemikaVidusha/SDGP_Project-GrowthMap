import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PageNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-purple-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl flex items-center justify-center">
          <ArrowLeft className="w-12 h-12 text-slate-500" />
        </div>
        <h1 className="text-4xl font-bold text-slate-800 mb-4">Page Not Found</h1>
        <p className="text-xl text-slate-600 mb-8">The page you're looking for doesn't exist.</p>
        <Link to="/">
          <Button size="lg" className="w-full">
            Go Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
