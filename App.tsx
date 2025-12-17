import React, { useState } from 'react';
import Header from './components/Header';
import Scanner from './components/Scanner';
import ProjectViewer from './components/ProjectViewer';
import { AppTab } from './types';

const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<AppTab>(AppTab.SCANNER);

  return (
    <div className="min-h-screen bg-cyber-900 text-slate-200 font-sans selection:bg-cyber-accent selection:text-cyber-900">
      <Header currentTab={currentTab} onTabChange={setCurrentTab} />
      
      <main className="py-6">
        {currentTab === AppTab.SCANNER ? (
          <Scanner />
        ) : (
          <ProjectViewer />
        )}
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 w-full bg-cyber-900/90 backdrop-blur-sm border-t border-cyber-800 py-3 text-center">
        <p className="text-xs text-slate-500">
          Powered by Gemini 2.5 Flash • For Educational Purposes Only • {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
};

export default App;
