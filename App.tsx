import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import FileUploader from './components/FileUploader';
import SummaryCards from './components/SummaryCards';
import Charts from './components/Charts';
import DataTable from './components/DataTable';
import History from './components/History';
import AdvancedAnalytics from './components/AdvancedAnalytics';
import LiveMonitor from './components/LiveMonitor';
import { DatasetRecord, AuthState } from './types';
import { saveDatasetToHistory, getHistory } from './services/dataService';
import { generatePDF } from './services/pdfService';
import { analyzeDataset } from './services/geminiService';

const App: React.FC = () => {
    const [authState, setAuthState] = useState<AuthState>(AuthState.UNAUTHENTICATED);
    const [currentView, setCurrentView] = useState<'dashboard' | 'history' | 'live'>('dashboard');
    const [currentDataset, setCurrentDataset] = useState<DatasetRecord | null>(null);
    const [history, setHistory] = useState<DatasetRecord[]>([]);
    const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    useEffect(() => {
        // Check for existing token
        const token = localStorage.getItem('chemvis_token');
        if (token) {
            setAuthState(AuthState.AUTHENTICATED);
            setHistory(getHistory());
        }
    }, []);

    const handleLogin = () => {
        setAuthState(AuthState.AUTHENTICATED);
        setHistory(getHistory());
    };

    const handleLogout = () => {
        localStorage.removeItem('chemvis_token');
        setAuthState(AuthState.UNAUTHENTICATED);
        setCurrentDataset(null);
    };

    const handleUploadSuccess = (dataset: DatasetRecord) => {
        setCurrentDataset(dataset);
        saveDatasetToHistory(dataset);
        setHistory(getHistory());
        setAiAnalysis(null); // Reset analysis on new upload
    };

    const handleHistorySelect = (dataset: DatasetRecord) => {
        setCurrentDataset(dataset);
        setCurrentView('dashboard');
        setAiAnalysis(null);
    };

    const handleGenerateReport = () => {
        if (currentDataset) {
            generatePDF(currentDataset, aiAnalysis);
        }
    };

    const handleAiAnalysis = async () => {
        if (!currentDataset) return;
        setIsAnalyzing(true);
        const result = await analyzeDataset(currentDataset);
        setAiAnalysis(result);
        setIsAnalyzing(false);
    };

    const handleNewData = () => {
        setCurrentDataset(null);
        setAiAnalysis(null);
        setCurrentView('dashboard');
    };

    if (authState === AuthState.UNAUTHENTICATED) {
        return <Login onLogin={handleLogin} />;
    }

    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50">
            {/* Sidebar Navigation */}
            <aside className="lg:w-64 bg-slate-900 text-white shrink-0 sticky top-0 h-auto lg:h-screen z-20">
                <div className="p-6 border-b border-slate-800">
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
                        ChemVis
                    </h1>
                    <p className="text-slate-400 text-xs mt-1">Parameter Visualizer v2.1</p>
                </div>
                <nav className="p-4 space-y-2">
                    <button 
                        onClick={() => setCurrentView('dashboard')}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${currentView === 'dashboard' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                        <span>Analytics Dashboard</span>
                    </button>
                    <button 
                        onClick={() => setCurrentView('live')}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${currentView === 'live' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span>Live Monitor</span>
                    </button>
                    <button 
                        onClick={() => setCurrentView('history')}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${currentView === 'history' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>History</span>
                    </button>
                </nav>
                <div className="p-4 mt-auto border-t border-slate-800 lg:absolute lg:bottom-0 lg:w-full">
                    <button 
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-red-900/30 hover:text-red-400 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto h-screen">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">
                            {currentView === 'dashboard' ? 'Operational Dashboard' : currentView === 'live' ? 'Real-Time Telemetry' : 'Dataset History'}
                        </h2>
                        <p className="text-slate-500">
                            {currentView === 'dashboard' 
                                ? (currentDataset ? `Viewing: ${currentDataset.file_name}` : 'Upload a file to begin analysis')
                                : currentView === 'live' ? 'Simulated live connection to plant sensors' 
                                : 'Manage your recent data uploads'}
                        </p>
                    </div>
                    {currentDataset && currentView === 'dashboard' && (
                        <div className="flex gap-3">
                            <button
                                onClick={handleAiAnalysis}
                                disabled={isAnalyzing}
                                className="flex items-center bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow-sm transition-all disabled:opacity-70"
                            >
                                {isAnalyzing ? (
                                    <svg className="animate-spin w-4 h-4 mr-2" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                ) : (
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                )}
                                AI Insights
                            </button>
                            <button 
                                onClick={handleGenerateReport}
                                className="flex items-center bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg shadow-sm transition-colors"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Export PDF
                            </button>
                            <button 
                                onClick={handleNewData}
                                className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm transition-colors"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                New Equipment Data
                            </button>
                        </div>
                    )}
                </header>

                {currentView === 'dashboard' ? (
                    <div className="space-y-8">
                        {!currentDataset && <FileUploader onUploadSuccess={handleUploadSuccess} />}
                        
                        {currentDataset && (
                            <>
                                <SummaryCards summary={currentDataset.summary} />

                                {aiAnalysis && (
                                    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100 rounded-xl p-6 shadow-sm">
                                        <h3 className="text-lg font-semibold text-purple-900 mb-2 flex items-center">
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                            </svg>
                                            AI Engineering Analysis
                                        </h3>
                                        <div className="prose prose-sm text-slate-700 max-w-none">
                                            <div dangerouslySetInnerHTML={{ __html: aiAnalysis.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                                        </div>
                                    </div>
                                )}

                                <Charts summary={currentDataset.summary} />
                                
                                {/* New Advanced Features Section */}
                                <AdvancedAnalytics dataset={currentDataset} />

                                <DataTable data={currentDataset.data} />
                            </>
                        )}
                    </div>
                ) : currentView === 'live' ? (
                    <LiveMonitor />
                ) : (
                    <History history={history} onSelect={handleHistorySelect} />
                )}
            </main>
        </div>
    );
};

export default App;