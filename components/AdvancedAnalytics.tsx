import React, { useState } from 'react';
import { DatasetRecord } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface Props {
    dataset: DatasetRecord;
}

const AdvancedAnalytics: React.FC<Props> = ({ dataset }) => {
    const [activeTab, setActiveTab] = useState<'anomalies' | 'health' | 'forecast' | 'quality'>('anomalies');
    const [showOnlyAnomalies, setShowOnlyAnomalies] = useState(true);

    // --- Renderers ---

    const renderAnomalies = () => {
        const flaggedSet = new Set(dataset.anomalies?.rows_flagged || []);
        
        // Determine which data to show
        const displayData = showOnlyAnomalies 
            ? dataset.data.filter(row => flaggedSet.has(row.id))
            : dataset.data.slice(0, 100); // Show top 100 for performance when showing all

        return (
            <div className="space-y-6">
                <div className="bg-red-50 border border-red-200 p-4 rounded-lg flex justify-between items-center">
                    <div>
                        <h3 className="text-red-800 font-bold text-lg">Anomaly Detection (Isolation Forest Simulated)</h3>
                        <p className="text-red-600 text-sm">{dataset.anomalies?.total_anomalies || 0} anomalies detected in {dataset.data.length} records.</p>
                    </div>
                    <div className="h-10 w-10 bg-red-200 rounded-full flex items-center justify-center text-red-600 font-bold">
                        !
                    </div>
                </div>

                <div className="flex items-center justify-end mb-2">
                     <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                            type="checkbox" 
                            checked={showOnlyAnomalies} 
                            onChange={() => setShowOnlyAnomalies(!showOnlyAnomalies)} 
                            className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        <span className="ml-3 text-sm font-medium text-gray-700">Show only anomalies</span>
                    </label>
                </div>

                <div className="overflow-x-auto border rounded-lg max-h-96 overflow-y-auto">
                    <table className="min-w-full divide-y divide-red-100">
                        <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Equipment</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Type</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Flow</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Pressure</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Temp</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Severity</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-100">
                            {displayData.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-4 text-center text-sm text-slate-500">
                                        No data to display.
                                    </td>
                                </tr>
                            ) : (
                                displayData.map((row) => {
                                    const isAnomaly = flaggedSet.has(row.id);
                                    const anomalyDetail = isAnomaly ? dataset.anomalies?.anomalies.find(a => a.rowId === row.id) : null;
                                    const score = anomalyDetail?.score || 0;
                                    
                                    // Score Color Logic
                                    let scoreColor = 'bg-green-500';
                                    if (score > 0.7) scoreColor = 'bg-red-600';
                                    else if (score > 0.4) scoreColor = 'bg-orange-500';
                                    else if (score > 0) scoreColor = 'bg-yellow-500';

                                    return (
                                        <tr key={row.id} className={`${isAnomaly ? 'bg-red-50 hover:bg-red-100' : 'hover:bg-slate-50'} transition-colors`}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{row.equipment_name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{row.equipment_type}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-slate-600">{row.flowrate}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-slate-600">{row.pressure}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-slate-600">{row.temperature}</td>
                                            
                                            {/* Severity Column with Visual Bar */}
                                            <td className="px-6 py-4 whitespace-nowrap align-middle">
                                                {isAnomaly ? (
                                                    <div className="flex items-center">
                                                        <div className="w-20 h-1.5 bg-slate-200 rounded-full mr-2 overflow-hidden">
                                                            <div 
                                                                className={`h-full ${scoreColor}`} 
                                                                style={{ width: `${Math.min(score * 100, 100)}%` }}
                                                            />
                                                        </div>
                                                        <span className={`text-xs font-bold ${score > 0.7 ? 'text-red-700' : 'text-orange-600'}`}>
                                                            {(score * 100).toFixed(0)}%
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-slate-300">-</span>
                                                )}
                                            </td>

                                            {/* Status Column with Icon */}
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold">
                                                {isAnomaly ? (
                                                    <div className="text-red-600 flex flex-col items-end">
                                                        <span className="flex items-center">
                                                            ANOMALY
                                                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                            </svg>
                                                        </span>
                                                        <span className="text-xs font-normal opacity-75">{anomalyDetail?.reason[0]}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-emerald-600 flex items-center justify-end">
                                                        OK
                                                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                    {!showOnlyAnomalies && dataset.data.length > 100 && (
                        <div className="p-2 text-center text-xs text-slate-400 bg-slate-50">
                            Showing first 100 records only. Filter to anomalies to see specific issues.
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const renderHealth = () => {
        const healthData = dataset.health_scores?.slice(0, 10) || []; // Top 10 worst/best
        
        return (
            <div className="space-y-6">
                 <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-lg">
                    <h3 className="text-emerald-800 font-bold text-lg">Equipment Health Scores</h3>
                    <p className="text-emerald-600 text-sm">Calculated based on deviation from operational averages.</p>
                </div>

                <div className="h-80 w-full bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={healthData} layout="vertical" margin={{ left: 40 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" domain={[0, 100]} />
                            <YAxis dataKey="equipment_name" type="category" width={100} style={{ fontSize: '12px' }} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="score" fill="#10b981" name="Health Score (0-100)" radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        );
    };

    const renderForecast = () => {
        if (!dataset.forecast) return <div>No forecast available</div>;

        const data = dataset.forecast.labels.map((label, i) => ({
            name: label,
            flow: dataset.forecast?.flowrate_future[i],
            pressure: dataset.forecast?.pressure_future[i],
            temp: dataset.forecast?.temperature_future[i]
        }));

        return (
            <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                    <h3 className="text-blue-800 font-bold text-lg">Predictive Trend Forecasting</h3>
                    <p className="text-blue-600 text-sm">Projection for next 5 operational cycles based on Holt-Winters Simulation.</p>
                </div>

                <div className="h-80 w-full bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="flow" stroke="#3b82f6" strokeWidth={2} />
                            <Line type="monotone" dataKey="pressure" stroke="#f59e0b" strokeWidth={2} />
                            <Line type="monotone" dataKey="temp" stroke="#ef4444" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        );
    };

    const renderQuality = () => {
        if (!dataset.data_quality) return null;
        const q = dataset.data_quality;

        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     <div className="p-6 bg-white border rounded-xl text-center shadow-sm">
                        <div className={`text-4xl font-bold mb-2 ${q.score > 80 ? 'text-green-600' : 'text-yellow-600'}`}>
                            {q.score}/100
                        </div>
                        <div className="text-slate-500 font-medium">Overall Quality Score</div>
                     </div>
                     <div className="p-6 bg-white border rounded-xl shadow-sm col-span-2">
                        <h4 className="font-semibold text-slate-800 mb-4">Audit Findings</h4>
                        <ul className="space-y-2">
                            {q.issues.map((issue, i) => (
                                <li key={i} className="flex items-center text-slate-600">
                                    <span className="w-2 h-2 bg-slate-400 rounded-full mr-3"></span>
                                    {issue}
                                </li>
                            ))}
                        </ul>
                     </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="text-2xl font-bold text-slate-800">{q.missing_values}</div>
                        <div className="text-xs text-slate-500 uppercase tracking-wide">Missing Values</div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="text-2xl font-bold text-slate-800">{q.duplicates}</div>
                        <div className="text-xs text-slate-500 uppercase tracking-wide">Duplicates</div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="text-2xl font-bold text-slate-800">{q.negative_values}</div>
                        <div className="text-xs text-slate-500 uppercase tracking-wide">Invalid Negatives</div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8">
            <div className="flex border-b border-slate-200">
                <button 
                    onClick={() => setActiveTab('anomalies')}
                    className={`flex-1 py-4 text-sm font-medium transition-colors ${activeTab === 'anomalies' ? 'text-red-600 border-b-2 border-red-600 bg-red-50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
                >
                    Anomaly Detection
                </button>
                <button 
                    onClick={() => setActiveTab('health')}
                    className={`flex-1 py-4 text-sm font-medium transition-colors ${activeTab === 'health' ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
                >
                    Health Scores
                </button>
                <button 
                    onClick={() => setActiveTab('forecast')}
                    className={`flex-1 py-4 text-sm font-medium transition-colors ${activeTab === 'forecast' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
                >
                    Forecasting
                </button>
                <button 
                    onClick={() => setActiveTab('quality')}
                    className={`flex-1 py-4 text-sm font-medium transition-colors ${activeTab === 'quality' ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
                >
                    Data Quality
                </button>
            </div>

            <div className="p-6">
                {activeTab === 'anomalies' && renderAnomalies()}
                {activeTab === 'health' && renderHealth()}
                {activeTab === 'forecast' && renderForecast()}
                {activeTab === 'quality' && renderQuality()}
            </div>

             {/* Auto Insights Footer */}
             {dataset.auto_insights && dataset.auto_insights.length > 0 && (
                <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 text-white">
                    <h4 className="font-bold mb-3 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Auto-Generated Insights
                    </h4>
                    <ul className="space-y-2">
                        {dataset.auto_insights.map((insight, i) => (
                            <li key={i} className="flex items-start opacity-90 text-sm">
                                <span className="mr-2">•</span> {insight}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default AdvancedAnalytics;