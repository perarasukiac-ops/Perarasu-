import React from 'react';
import { AppTab } from '../types';
import { Shield, Code2, Terminal } from 'lucide-react';

interface HeaderProps {
  currentTab: AppTab;
  onTabChange: (tab: AppTab) => void;
}

const Header: React.FC<HeaderProps> = ({ currentTab, onTabChange }) => {
  return (
    <header className="bg-cyber-900 border-b border-cyber-800 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyber-accent/10 rounded-lg">
              <Shield className="h-6 w-6 text-cyber-accent" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-100 tracking-tight">PhishingDetector<span className="text-cyber-accent">AI</span></h1>
            </div>
          </div>

          <nav className="flex space-x-2">
            <button
              onClick={() => onTabChange(AppTab.SCANNER)}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                currentTab === AppTab.SCANNER 
                  ? 'bg-cyber-800 text-cyber-accent shadow-sm border border-cyber-700' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-cyber-800/50'
              }`}
            >
              <Terminal className="w-4 h-4 mr-2" />
              Live Scanner
            </button>
            <button
              onClick={() => onTabChange(AppTab.PROJECT_CODE)}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                currentTab === AppTab.PROJECT_CODE 
                  ? 'bg-cyber-800 text-cyber-accent shadow-sm border border-cyber-700' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-cyber-800/50'
              }`}
            >
              <Code2 className="w-4 h-4 mr-2" />
              Python Source
            </button>
          </nav>

        </div>
      </div>
    </header>
  );
};

export default Header;
