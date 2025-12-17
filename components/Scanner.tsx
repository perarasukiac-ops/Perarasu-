import React, { useState } from 'react';
import { analyzeUrl } from '../services/geminiService';
import { ScanResult } from '../types';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Search, 
  Activity, 
  Lock, 
  Globe, 
  AlertTriangle 
} from 'lucide-react';

const Scanner: React.FC = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setResult(null);
    try {
      const data = await analyzeUrl(url);
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score < 30) return 'text-cyber-success';
    if (score < 70) return 'text-cyber-warning';
    return 'text-cyber-danger';
  };

  const getScoreBg = (score: number) => {
    if (score < 30) return 'bg-cyber-success';
    if (score < 70) return 'bg-cyber-warning';
    return 'bg-cyber-danger';
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-8">
      
      {/* Search Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-cyber-accent">AI Phishing URL Scanner</h2>
        <p className="text-slate-400">Enter a suspicious link to analyze it using our Gemini-powered engine.</p>
      </div>

      {/* Input Area */}
      <div className="bg-cyber-800 p-6 rounded-xl border border-cyber-700 shadow-xl">
        <form onSubmit={handleScan} className="flex gap-4 flex-col sm:flex-row">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Globe className="h-5 w-5 text-slate-500" />
            </div>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="e.g., http://secure-login-update.com/account"
              className="block w-full pl-10 pr-3 py-4 border border-cyber-700 rounded-lg leading-5 bg-cyber-900 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyber-accent focus:ring-1 focus:ring-cyber-accent sm:text-sm transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-lg text-cyber-900 bg-cyber-accent hover:bg-cyan-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-all ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-cyber-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Scanning...
              </>
            ) : (
              <>
                <Search className="mr-2 h-5 w-5" />
                Analyze
              </>
            )}
          </button>
        </form>
      </div>

      {/* Results Area */}
      {result && (
        <div className="animate-fade-in-up space-y-6">
          
          {/* Main Verdict Card */}
          <div className={`rounded-xl p-1 bg-gradient-to-r ${result.isPhishing ? 'from-red-500 via-orange-500 to-red-500' : 'from-green-400 via-emerald-500 to-green-600'}`}>
            <div className="bg-cyber-900 rounded-lg p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                
                <div className="flex items-center gap-4">
                  <div className={`p-4 rounded-full ${result.isPhishing ? 'bg-red-500/10' : 'bg-green-500/10'}`}>
                    {result.isPhishing ? (
                      <ShieldAlert className="h-12 w-12 text-red-500" />
                    ) : (
                      <ShieldCheck className="h-12 w-12 text-green-500" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Verdict</h3>
                    <p className={`text-3xl font-bold ${result.isPhishing ? 'text-red-500' : 'text-green-500'}`}>
                      {result.verdict}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                   <div className="text-center">
                    <h4 className="text-sm text-slate-400 mb-1">Risk Score</h4>
                    <div className="relative inline-flex items-center justify-center">
                       <svg className="w-20 h-20 transform -rotate-90">
                         <circle className="text-cyber-700" strokeWidth="8" stroke="currentColor" fill="transparent" r="36" cx="40" cy="40"/>
                         <circle 
                            className={`${getScoreColor(result.riskScore)} transition-all duration-1000 ease-out`} 
                            strokeWidth="8" 
                            strokeDasharray={226} 
                            strokeDashoffset={226 - (226 * result.riskScore) / 100} 
                            strokeLinecap="round" 
                            stroke="currentColor" 
                            fill="transparent" 
                            r="36" 
                            cx="40" 
                            cy="40" 
                          />
                       </svg>
                       <span className={`absolute text-xl font-bold ${getScoreColor(result.riskScore)}`}>{result.riskScore}</span>
                    </div>
                   </div>
                   
                   <div className="text-center hidden sm:block">
                      <h4 className="text-sm text-slate-400 mb-2">Confidence</h4>
                      <span className="px-3 py-1 rounded-full bg-cyber-700 text-slate-200 text-sm font-medium border border-cyber-600">
                        {result.confidence}
                      </span>
                   </div>
                </div>

              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Reasons */}
            <div className="bg-cyber-800 rounded-xl border border-cyber-700 p-6">
              <div className="flex items-center mb-4">
                <AlertTriangle className="h-5 w-5 text-cyber-accent mr-2" />
                <h3 className="text-lg font-semibold text-slate-100">Analysis Findings</h3>
              </div>
              <ul className="space-y-3">
                {result.reasons.map((reason, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="flex-shrink-0 h-1.5 w-1.5 rounded-full bg-cyber-accent mt-2 mr-3"></span>
                    <span className="text-slate-300 text-sm leading-relaxed">{reason}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Technical Features */}
            <div className="bg-cyber-800 rounded-xl border border-cyber-700 p-6">
              <div className="flex items-center mb-4">
                <Activity className="h-5 w-5 text-cyber-accent mr-2" />
                <h3 className="text-lg font-semibold text-slate-100">Technical Indicators</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-cyber-700">
                   <span className="text-slate-400 text-sm">URL Length</span>
                   <span className="text-slate-200 font-mono">{result.features.urlLength} chars</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-cyber-700">
                   <span className="text-slate-400 text-sm">IP in Hostname</span>
                   <span className={`text-sm font-medium ${result.features.hasIpAddress ? 'text-red-400' : 'text-green-400'}`}>
                     {result.features.hasIpAddress ? 'DETECTED' : 'None'}
                   </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-cyber-700">
                   <span className="text-slate-400 text-sm">@ Symbol</span>
                   <span className={`text-sm font-medium ${result.features.hasAtSymbol ? 'text-red-400' : 'text-green-400'}`}>
                     {result.features.hasAtSymbol ? 'Present' : 'Absent'}
                   </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-cyber-700">
                   <span className="text-slate-400 text-sm">Suspicious Keywords</span>
                   <span className={`text-sm font-medium ${result.features.hasSuspiciousKeywords ? 'text-orange-400' : 'text-slate-400'}`}>
                     {result.features.hasSuspiciousKeywords ? 'Found' : 'None'}
                   </span>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}
    </div>
  );
};

export default Scanner;
