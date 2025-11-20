import React, { useEffect, useState, useRef } from 'react';
import { getSimulatedStream } from '../services/dataService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface StreamData {
    time: string;
    flowrate: number;
    pressure: number;
    temperature: number;
    status: string;
}

const LiveMonitor: React.FC = () => {
    const [data, setData] = useState<StreamData[]>([]);
    const [latest, setLatest] = useState<StreamData | null>(null);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            if (!isPaused) {
                const point = getSimulatedStream();
                setLatest(point);
                setData(prev => {
                    const newData = [...prev, point];
                    if (newData.length > 20) newData.shift(); // Keep last 20 points
                    return newData;
                });
            }
        }, 2000); // 2s Refresh

        return () => clearInterval(interval);
    }, [isPaused]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
                <div>
                     <h2 className="text-2xl font-bold text-slate-800 flex items-center">
                        <span className="relative flex h-3 w-3 mr-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                        Live Equipment Stream
                    </h2>
                    <p className="text-slate-500 mt-1">Real-time telemetry simulation via /api/simulated-stream/</p>
                </div>
                <button 
                    onClick={() => setIsPaused(!isPaused)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${isPaused ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'}`}
                >
                    {isPaused ? 'Resume Stream' : 'Pause Stream'}
                </button>
            </div>

            {latest && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 relative overflow-hidden">
                        <div className="text-slate-500 text-sm font-medium uppercase">Real-Time Flow</div>
                        <div className="text-3xl font-bold text-slate-800 mt-1">{latest.flowrate.toFixed(1)} <span className="text-sm text-slate-400 font-normal">m³/h</span></div>
                        <div className={`absolute top-0 right-0 p-2 ${latest.flowrate > 115 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'} rounded-bl-lg text-xs font-bold`}>
                            {latest.flowrate > 115 ? 'HIGH' : 'NOMINAL'}
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 relative overflow-hidden">
                        <div className="text-slate-500 text-sm font-medium uppercase">Real-Time Pressure</div>
                        <div className="text-3xl font-bold text-slate-800 mt-1">{latest.pressure.toFixed(1)} <span className="text-sm text-slate-400 font-normal">bar</span></div>
                        <div className={`absolute top-0 right-0 p-2 ${latest.pressure > 45 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'} rounded-bl-lg text-xs font-bold`}>
                            {latest.pressure > 45 ? 'HIGH' : 'NOMINAL'}
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 relative overflow-hidden">
                        <div className="text-slate-500 text-sm font-medium uppercase">Real-Time Temp</div>
                        <div className="text-3xl font-bold text-slate-800 mt-1">{latest.temperature.toFixed(1)} <span className="text-sm text-slate-400 font-normal">°C</span></div>
                        <div className={`absolute top-0 right-0 p-2 ${latest.temperature > 70 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'} rounded-bl-lg text-xs font-bold`}>
                            {latest.temperature > 70 ? 'HIGH' : 'NOMINAL'}
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-96">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="time" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip contentStyle={{backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0'}} />
                        <Line isAnimationActive={false} type="monotone" dataKey="flowrate" stroke="#3b82f6" strokeWidth={2} dot={false} />
                        <Line isAnimationActive={false} type="monotone" dataKey="pressure" stroke="#f59e0b" strokeWidth={2} dot={false} />
                        <Line isAnimationActive={false} type="monotone" dataKey="temperature" stroke="#ef4444" strokeWidth={2} dot={false} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default LiveMonitor;