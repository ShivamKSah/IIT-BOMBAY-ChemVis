import React from 'react';
import { DatasetSummary } from '../types';

interface SummaryCardsProps {
    summary: DatasetSummary;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ summary }) => {
    const cards = [
        {
            title: 'Total Equipment',
            value: summary.total_count,
            unit: 'Units',
            icon: (
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
            ),
            color: 'bg-blue-50 text-blue-700 border-blue-100'
        },
        {
            title: 'Avg Flowrate',
            value: summary.average_flowrate,
            unit: 'm³/h',
            icon: (
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            ),
            color: 'bg-emerald-50 text-emerald-700 border-emerald-100'
        },
        {
            title: 'Avg Pressure',
            value: summary.average_pressure,
            unit: 'bar',
            icon: (
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            color: 'bg-amber-50 text-amber-700 border-amber-100'
        },
        {
            title: 'Avg Temperature',
            value: summary.average_temperature,
            unit: '°C',
            icon: (
                <svg className="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                </svg>
            ),
            color: 'bg-rose-50 text-rose-700 border-rose-100'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {cards.map((card, index) => (
                <div key={index} className={`rounded-xl p-6 border ${card.color.split(' ')[2]} bg-white shadow-sm`}>
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-slate-500 font-medium text-sm">{card.title}</span>
                        <div className={`p-2 rounded-lg ${card.color.split(' ')[0]}`}>
                            {card.icon}
                        </div>
                    </div>
                    <div className="flex items-baseline">
                        <span className="text-3xl font-bold text-slate-800">{card.value}</span>
                        <span className="ml-2 text-sm text-slate-500 font-medium">{card.unit}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SummaryCards;