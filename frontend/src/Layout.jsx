import React from 'react';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen">
      <style>{`
        :root {
          --color-primary: #7c3aed;
          --color-primary-dark: #6d28d9;
          --color-secondary: #3b82f6;
        }
        
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: #f1f5f9;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        
        /* Smooth transitions */
        * {
          scroll-behavior: smooth;
        }
      `}</style>
      {children}
    </div>
  );
}