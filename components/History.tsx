import React from 'react';
import { DatasetRecord } from '../types';

interface HistoryProps {
    history: DatasetRecord[];
    onSelect: (dataset: DatasetRecord) => void;
}

const History: React.FC<HistoryProps> = ({ history, onSelect }) => {
    if (history.length === 0) {
        return (
            <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                <p className="text-slate-500">No upload history available yet.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Uploads (Last 5)</h3>
            <div className="grid gap-4">
                {history.map((item) => (
                    <div 
                        key={item.id}
                        onClick={() => onSelect(item)}
                        className="bg-white p-4 rounded-lg border border-slate-200 hover:border-blue-400 hover:shadow-md cursor-pointer transition-all group flex justify-between items-center"
                    >
                        <div className="flex items-center">
                            <div className="bg-blue-100 p-3 rounded-full mr-4 group-hover:bg-blue-200 transition-colors">
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="font-medium text-slate-800">{item.file_name}</h4>
                                <p className="text-sm text-slate-500">
                                    {new Date(item.uploaded_at).toLocaleString()} • {item.summary.total_count} Items
                                </p>
                            </div>
                        </div>
                        <svg className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transform group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default History;