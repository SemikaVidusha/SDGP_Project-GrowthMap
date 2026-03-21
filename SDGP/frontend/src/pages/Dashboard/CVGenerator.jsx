import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Loader2, Download } from 'lucide-react';

export default function CVGenerator() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    targetRole: '',
    summary: '',
    education: '',
    experience: '',
    skills: '',
    projects: ''
  });

  const [loading, setLoading] = useState(false);
  const [generatedCV, setGeneratedCV] = useState('');
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const generateCV = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://127.0.0.1:5000/api/cv/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate CV');
      }

      setGeneratedCV(data.cv);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">AI CV Generator</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          Enter your professional details below to generate a tailored, modern CV using AI.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 print:hidden">
          <form onSubmit={generateCV} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                <input required type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
                <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent" placeholder="john@example.com" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent" placeholder="+1 234 567 890" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Target Role</label>
                <input required type="text" name="targetRole" value={formData.targetRole} onChange={handleInputChange} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent" placeholder="Software Engineer" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Professional Summary</label>
              <textarea rows="3" name="summary" value={formData.summary} onChange={handleInputChange} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent" placeholder="A brief summary of your professional background and goals..."></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Education</label>
              <textarea rows="3" name="education" value={formData.education} onChange={handleInputChange} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent" placeholder="BSc in Computer Science, University of XYZ (2018-2022)"></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Work Experience</label>
              <textarea rows="4" name="experience" value={formData.experience} onChange={handleInputChange} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent" placeholder="Company ABC - Developer (2022-Present): Did X, Y, Z."></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Skills</label>
              <textarea rows="2" name="skills" value={formData.skills} onChange={handleInputChange} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent" placeholder="JavaScript, Python, React, Node.js"></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Projects</label>
              <textarea rows="3" name="projects" value={formData.projects} onChange={handleInputChange} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent" placeholder="E-commerce App: Built using React and Node.js..."></textarea>
            </div>

            {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Generate CV Magic'}
            </button>
          </form>
        </div>

        {/* Results Section */}
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 flex flex-col h-full print:border-none print:shadow-none print:p-0">
          <div className="flex justify-between items-center mb-6 print:hidden">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Your Generated CV</h2>
          </div>

          <div className="flex-1 overflow-auto bg-slate-50 dark:bg-slate-950 p-6 rounded-lg border border-slate-200 dark:border-slate-800 print:bg-white print:border-none print:p-0">
            {generatedCV ? (
              <>
                <style>{`
                  @media print {
                    @page { margin: 15mm; size: A4 portrait; }
                    body { 
                      -webkit-print-color-adjust: exact; 
                      print-color-adjust: exact; 
                      font-family: 'Inter', system-ui, sans-serif !important;
                      background: white !important;
                    }
                    /* Professional CV Print Override */
                    .print-cv-wrapper {
                      max-width: 100% !important;
                      color: #1f2937 !important;
                    }
                    .print-cv-wrapper h1 {
                      font-size: 26pt !important;
                      font-weight: 800 !important;
                      text-transform: uppercase !important;
                      color: #111827 !important;
                      border-bottom: 2px solid #111827 !important;
                      padding-bottom: 6px !important;
                      margin-top: 0 !important;
                      margin-bottom: 12px !important;
                      line-height: 1.1 !important;
                    }
                    .print-cv-wrapper h2 {
                      font-size: 14pt !important;
                      font-weight: 700 !important;
                      text-transform: uppercase !important;
                      color: #4f46e5 !important; /* Professional Indigo */
                      margin-top: 20px !important;
                      margin-bottom: 8px !important;
                      line-height: 1.2 !important;
                    }
                    .print-cv-wrapper h3 {
                      font-size: 12pt !important;
                      font-weight: 600 !important;
                      color: #111827 !important;
                      margin-top: 12px !important;
                      margin-bottom: 4px !important;
                    }
                    .print-cv-wrapper p {
                      font-size: 11pt !important;
                      line-height: 1.5 !important;
                      color: #374151 !important;
                      margin-bottom: 8px !important;
                      margin-top: 0 !important;
                    }
                    .print-cv-wrapper ul {
                      margin-top: 4px !important;
                      margin-bottom: 8px !important;
                      padding-left: 20px !important;
                    }
                    .print-cv-wrapper li {
                      font-size: 11pt !important;
                      line-height: 1.5 !important;
                      color: #374151 !important;
                      margin-bottom: 4px !important;
                    }
                    .print-cv-wrapper strong {
                      color: #111827 !important;
                      font-weight: 600 !important;
                    }
                    .print-cv-wrapper a {
                      color: #4f46e5 !important;
                      text-decoration: none !important;
                    }
                  }
                `}</style>
                <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none print-cv-wrapper print:text-black">
                  <ReactMarkdown>{generatedCV}</ReactMarkdown>
                </div>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 text-center">
                <p>No CV generated yet.</p>
                <p className="text-sm">Fill in your details and click generate to see the AI magic.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
