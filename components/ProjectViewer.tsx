import React, { useState } from 'react';
import { PYTHON_PROJECT_FILES } from '../constants';
import { PythonFile } from '../types';
import { FileCode, FileText, Folder, ChevronRight, Download } from 'lucide-react';

const ProjectViewer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<PythonFile>(PYTHON_PROJECT_FILES[0]);

  const getFileIcon = (lang: string) => {
    switch (lang) {
      case 'python': return <FileCode className="h-4 w-4 text-blue-400" />;
      case 'markdown': return <FileText className="h-4 w-4 text-yellow-400" />;
      case 'text': return <FileText className="h-4 w-4 text-slate-400" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col md:flex-row gap-4 max-w-7xl mx-auto p-4">
      
      {/* Sidebar - File Explorer */}
      <div className="w-full md:w-64 bg-cyber-800 rounded-xl border border-cyber-700 flex flex-col overflow-hidden shadow-lg flex-shrink-0">
        <div className="p-3 bg-cyber-900 border-b border-cyber-700 flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-200">Project Files</span>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
           <div className="flex items-center px-2 py-1 text-slate-400 text-sm mb-1">
             <Folder className="h-4 w-4 mr-2 text-cyber-accent" />
             phishing-detection-system/
           </div>
           {PYTHON_PROJECT_FILES.map((file) => (
             <button
               key={file.name}
               onClick={() => setSelectedFile(file)}
               className={`w-full flex items-center px-6 py-2 text-sm rounded-md transition-colors ${
                 selectedFile.name === file.name 
                   ? 'bg-cyber-700 text-cyan-400 font-medium' 
                   : 'text-slate-400 hover:bg-cyber-700/50 hover:text-slate-200'
               }`}
             >
               <span className="mr-2">{getFileIcon(file.language)}</span>
               {file.name}
             </button>
           ))}
        </div>
        <div className="p-3 border-t border-cyber-700 bg-cyber-900/50">
           <p className="text-xs text-slate-500 text-center">Read-Only View</p>
        </div>
      </div>

      {/* Main Content - Code Viewer */}
      <div className="flex-1 bg-cyber-900 rounded-xl border border-cyber-700 shadow-lg flex flex-col overflow-hidden">
        
        {/* Code Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-cyber-700 bg-cyber-800">
           <div className="flex items-center text-sm text-slate-300">
             <span className="text-cyber-accent font-mono">{selectedFile.name}</span>
           </div>
           <div className="flex items-center gap-2">
             <span className="text-xs text-slate-500 uppercase">{selectedFile.language}</span>
           </div>
        </div>

        {/* Code Body */}
        <div className="flex-1 overflow-auto p-0 bg-[#0d1117] relative">
          <pre className="p-4 text-sm font-mono text-slate-300 leading-6 tab-4">
            <code>
              {selectedFile.content}
            </code>
          </pre>
        </div>
      </div>

    </div>
  );
};

export default ProjectViewer;
