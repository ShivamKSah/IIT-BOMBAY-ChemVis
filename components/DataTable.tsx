import React from 'react';
import { EquipmentData } from '../types';

interface DataTableProps {
    data: EquipmentData[];
}

const DataTable: React.FC<DataTableProps> = ({ data }) => {
    // Limit display for performance
    const displayData = data.slice(0, 50);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-slate-800">Raw Dataset</h3>
                <span className="text-sm text-slate-500">Showing top {displayData.length} of {data.length} records</span>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Flowrate (m³/h)</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Pressure (bar)</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Temp (°C)</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {displayData.map((row) => (
                            <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{row.equipment_name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        {row.equipment_type}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-slate-600">{row.flowrate}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-slate-600">{row.pressure}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-slate-600">{row.temperature}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DataTable;