import React, { useCallback, useState } from 'react';
import { parseCSV, generateSampleCSV } from '../services/dataService';
import { DatasetRecord } from '../types';

interface FileUploaderProps {
    onUploadSuccess: (dataset: DatasetRecord) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onUploadSuccess }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setIsDragging(true);
        } else if (e.type === 'dragleave') {
            setIsDragging(false);
        }
    }, []);

    const processFile = (file: File) => {
        setProcessing(true);
        setError(null);

        if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
            setError('Invalid file type. Please upload a CSV file.');
            setProcessing(false);
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const text = event.target?.result as string;
                // Simulate slight processing delay for UX
                setTimeout(() => {
                    const dataset = parseCSV(text, file.name);
                    if (dataset.data.length === 0) {
                        setError('Parsed CSV is empty or format is incorrect.');
                    } else {
                        onUploadSuccess(dataset);
                    }
                    setProcessing(false);
                }, 1000);
            } catch (err) {
                setError('Error parsing CSV file.');
                setProcessing(false);
            }
        };
        reader.readAsText(file);
    };

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            processFile(e.dataTransfer.files[0]);
        }
    }, [onUploadSuccess]);

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            processFile(e.target.files[0]);
        }
    };

    const downloadSample = () => {
        const csvContent = "data:text/csv;charset=utf-8," + generateSampleCSV();
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "sample_equipment_data.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Upload Equipment Data
            </h3>

            <div
                className={`relative border-2 border-dashed rounded-xl p-10 text-center transition-all duration-200 ${
                    isDragging
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                {processing ? (
                    <div className="flex flex-col items-center animate-pulse">
                        <svg className="w-12 h-12 text-blue-500 mb-3 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className="text-slate-600 font-medium">Processing chemical dataset...</p>
                    </div>
                ) : (
                    <>
                        <svg className="mx-auto h-12 w-12 text-slate-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-slate-600 mb-2">Drag and drop your CSV file here</p>
                        <p className="text-slate-400 text-sm mb-6">Required columns: equipment_name, equipment_type, flowrate, pressure, temperature</p>
                        
                        <div className="flex justify-center gap-4">
                            <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-sm transition-colors">
                                <span>Browse Files</span>
                                <input type="file" className="hidden" accept=".csv" onChange={handleFileInput} />
                            </label>
                            <button 
                                onClick={downloadSample}
                                className="px-4 py-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-sm font-medium"
                            >
                                Download Sample
                            </button>
                        </div>
                    </>
                )}
                
                {error && (
                    <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FileUploader;