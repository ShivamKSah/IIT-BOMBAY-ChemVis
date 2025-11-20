import { EquipmentData, DatasetSummary, DatasetRecord, TypeDistribution, AnomalyReport, HealthScore, ForecastData, DataQualityReport, AnomalyDetails } from '../types';

// --- Core Parsing Logic ---

export const parseCSV = (csvText: string, fileName: string): DatasetRecord => {
    const lines = csvText.split('\n').filter(line => line.trim() !== '');
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/ /g, '_'));
    
    const data: EquipmentData[] = [];

    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        if (values.length < 5) continue;

        const row: any = {};
        headers.forEach((header, index) => {
            let val: string | number = values[index]?.trim();
            if (['flowrate', 'pressure', 'temperature'].includes(header)) {
                val = parseFloat(val);
            }
            row[header] = val;
        });

        data.push({
            id: `eq-${Date.now()}-${i}`,
            equipment_name: row.equipment_name || `Eq-${i}`,
            equipment_type: row.equipment_type || 'Unknown',
            flowrate: isNaN(row.flowrate) ? 0 : row.flowrate,
            pressure: isNaN(row.pressure) ? 0 : row.pressure,
            temperature: isNaN(row.temperature) ? 0 : row.temperature,
            uploaded_at: new Date().toISOString()
        });
    }

    const summary = calculateSummary(data);
    
    // Run Advanced Analytics (Simulating Backend Python Logic)
    const anomalies = detectAnomalies(data, summary);
    const health_scores = calculateHealthScores(data, summary);
    const auto_insights = generateAutoInsights(data, summary, anomalies);
    const forecast = generateForecast(data);
    const data_quality = auditDataQuality(data);

    return {
        id: `ds-${Date.now()}`,
        file_name: fileName,
        uploaded_at: new Date().toISOString(),
        summary,
        data,
        anomalies,
        health_scores,
        auto_insights,
        forecast,
        data_quality
    };
};

const calculateSummary = (data: EquipmentData[]): DatasetSummary => {
    if (data.length === 0) {
        return {
            total_count: 0,
            average_flowrate: 0,
            average_pressure: 0,
            average_temperature: 0,
            type_distribution: []
        };
    }

    const total_count = data.length;
    const sum = data.reduce((acc, curr) => ({
        flow: acc.flow + curr.flowrate,
        press: acc.press + curr.pressure,
        temp: acc.temp + curr.temperature
    }), { flow: 0, press: 0, temp: 0 });

    const typeMap = new Map<string, number>();
    data.forEach(item => {
        typeMap.set(item.equipment_type, (typeMap.get(item.equipment_type) || 0) + 1);
    });

    const type_distribution: TypeDistribution[] = Array.from(typeMap.entries()).map(([name, value]) => ({
        name,
        value
    }));

    return {
        total_count,
        average_flowrate: parseFloat((sum.flow / total_count).toFixed(2)),
        average_pressure: parseFloat((sum.press / total_count).toFixed(2)),
        average_temperature: parseFloat((sum.temp / total_count).toFixed(2)),
        type_distribution
    };
};

// --- Advanced Features (Simulating Python Backend) ---

const calculateStdDev = (data: EquipmentData[], mean: number, key: keyof EquipmentData) => {
    const squareDiffs = data.map(item => {
        const val = item[key] as number;
        const diff = val - mean;
        return diff * diff;
    });
    const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / squareDiffs.length;
    return Math.sqrt(avgSquareDiff);
};

// Feature 1: Anomaly Detection (Z-Score approximation for Isolation Forest)
const detectAnomalies = (data: EquipmentData[], summary: DatasetSummary): AnomalyReport => {
    const stdFlow = calculateStdDev(data, summary.average_flowrate, 'flowrate');
    const stdPress = calculateStdDev(data, summary.average_pressure, 'pressure');
    const stdTemp = calculateStdDev(data, summary.average_temperature, 'temperature');

    const anomalies: AnomalyDetails[] = [];
    
    data.forEach(row => {
        const reasons: string[] = [];
        let score = 0;

        // Threshold: 2.5 Standard Deviations
        if (Math.abs(row.flowrate - summary.average_flowrate) > (stdFlow * 2.5)) {
            reasons.push('Abnormal Flowrate');
            score += 0.3;
        }
        if (Math.abs(row.pressure - summary.average_pressure) > (stdPress * 2.5)) {
            reasons.push('Abnormal Pressure');
            score += 0.3;
        }
        if (Math.abs(row.temperature - summary.average_temperature) > (stdTemp * 2.5)) {
            reasons.push('Abnormal Temperature');
            score += 0.4;
        }

        if (reasons.length > 0) {
            anomalies.push({
                rowId: row.id,
                equipment_name: row.equipment_name,
                equipment_type: row.equipment_type,
                flowrate: row.flowrate,
                pressure: row.pressure,
                temperature: row.temperature,
                reason: reasons,
                score: Math.min(score, 1)
            });
        }
    });

    return {
        total_anomalies: anomalies.length,
        rows_flagged: anomalies.map(a => a.rowId),
        anomalies: anomalies.sort((a, b) => b.score - a.score)
    };
};

// Feature 2: Health Score Calculation
const calculateHealthScores = (data: EquipmentData[], summary: DatasetSummary): HealthScore[] => {
    return data.map(row => {
        const flowVar = Math.abs(row.flowrate - summary.average_flowrate) / (summary.average_flowrate || 1);
        const pressVar = Math.abs(row.pressure - summary.average_pressure) / (summary.average_pressure || 1);
        const tempVar = Math.abs(row.temperature - summary.average_temperature) / (summary.average_temperature || 1);
        
        // Higher variation = Lower Health. Max health 100.
        // Weighting: Temp (40%), Pressure (30%), Flow (30%)
        const totalVar = (flowVar * 0.3) + (pressVar * 0.3) + (tempVar * 0.4);
        
        let score = 100 - (totalVar * 100);
        score = Math.max(0, Math.min(100, score)); // Clamp 0-100

        return {
            equipment_name: row.equipment_name,
            score: Math.round(score)
        };
    }).sort((a, b) => a.score - b.score); // Ascending: show worst health first
};

// Feature 3: Auto Insights
const generateAutoInsights = (data: EquipmentData[], summary: DatasetSummary, anomalies: AnomalyReport): string[] => {
    const insights: string[] = [];
    
    // Anomaly Insight
    if (anomalies.total_anomalies > 0) {
        const pct = ((anomalies.total_anomalies / data.length) * 100).toFixed(1);
        insights.push(`⚠️ Anomaly Alert: ${pct}% of equipment showed abnormal operational parameters.`);
    }

    // Parameter Dominance
    if (summary.average_pressure > 50) {
        insights.push(`High Pressure System: Average pressure is ${summary.average_pressure} bar, indicating a high-load environment.`);
    }

    // Equipment Type Specifics
    const pumpData = data.filter(d => d.equipment_type.toLowerCase().includes('pump'));
    if (pumpData.length > 0) {
        const avgPumpFlow = pumpData.reduce((sum, p) => sum + p.flowrate, 0) / pumpData.length;
        if (avgPumpFlow > summary.average_flowrate) {
            insights.push(`Pumps are driving system flow, averaging ${avgPumpFlow.toFixed(1)} m³/h (higher than global average).`);
        }
    }

    return insights;
};

// Feature 4: Predictive Trend Forecasting (Simulated Holt-Winters/Moving Average)
const generateForecast = (data: EquipmentData[]): ForecastData => {
    // Simulate time-series by taking data in index order (assuming index ~= time)
    const stepSize = Math.floor(data.length / 10) || 1;
    const recent = data.slice(-10); // Last 10 points

    // Simple linear projection based on last 2 points avg slope
    const predictNext = (values: number[]) => {
        if (values.length < 2) return [values[0] || 0, 0, 0, 0, 0];
        const last = values[values.length - 1];
        const secondLast = values[values.length - 2];
        const slope = (last - secondLast);
        
        const future = [];
        for (let i = 1; i <= 5; i++) {
            // Add some damping to the slope so it doesn't explode
            future.push(parseFloat((last + (slope * i * 0.5)).toFixed(2))); 
        }
        return future;
    };

    return {
        flowrate_future: predictNext(recent.map(d => d.flowrate)),
        pressure_future: predictNext(recent.map(d => d.pressure)),
        temperature_future: predictNext(recent.map(d => d.temperature)),
        labels: ['+1h', '+2h', '+3h', '+4h', '+5h']
    };
};

// Feature 6: Data Quality Audit
const auditDataQuality = (data: EquipmentData[]): DataQualityReport => {
    let missing = 0;
    let negative = 0;
    let duplicates = 0;
    const ids = new Set();
    const issues: string[] = [];

    data.forEach(row => {
        if (!row.equipment_name || row.flowrate === undefined) missing++;
        if (row.pressure < 0 || row.flowrate < 0) negative++;
        
        const compositeKey = `${row.equipment_name}-${row.uploaded_at}`;
        if (ids.has(compositeKey)) duplicates++;
        ids.add(compositeKey);
    });

    const totalIssues = missing + negative + duplicates;
    let score = 100 - (totalIssues * 2); // Deduct 2 points per issue
    score = Math.max(0, score);

    if (missing > 0) issues.push(`${missing} rows have missing critical values.`);
    if (negative > 0) issues.push(`${negative} rows contain physically impossible negative values.`);
    if (duplicates > 0) issues.push(`${duplicates} duplicate entries detected.`);
    if (issues.length === 0) issues.push("Data quality is excellent.");

    return {
        score,
        missing_values: missing,
        negative_values: negative,
        duplicates,
        outliers: 0, // Calculated in anomalies
        issues
    };
};

// Feature 7: Real-Time Simulator
export const getSimulatedStream = () => {
    // Generate random realistic chemical data
    return {
        time: new Date().toLocaleTimeString(),
        flowrate: 100 + (Math.random() * 20 - 10),
        pressure: 40 + (Math.random() * 10 - 5),
        temperature: 60 + (Math.random() * 15 - 7.5),
        status: Math.random() > 0.9 ? 'WARNING' : 'OK'
    };
};

// --- Storage Logic ---

export const saveDatasetToHistory = (dataset: DatasetRecord) => {
    const historyStr = localStorage.getItem('chemvis_history');
    let history: DatasetRecord[] = historyStr ? JSON.parse(historyStr) : [];
    history.unshift(dataset);
    if (history.length > 5) {
        history = history.slice(0, 5);
    }
    localStorage.setItem('chemvis_history', JSON.stringify(history));
};

export const getHistory = (): DatasetRecord[] => {
    const historyStr = localStorage.getItem('chemvis_history');
    return historyStr ? JSON.parse(historyStr) : [];
};

export const generateSampleCSV = () => {
    const headers = "equipment_name,equipment_type,flowrate,pressure,temperature";
    const rows = [
        "Pump-A01,Pump,120.5,45.2,60.1",
        "Valve-X99,Valve,0,12.5,22.0",
        "Reactor-Main,Reactor,500.2,150.0,210.5",
        "HeatEx-B2,Heat Exchanger,300.1,80.4,150.2",
        "Tank-Storage,Tank,0,1.2,25.0",
        "Pump-A02,Pump,115.0,44.8,62.3",
        "Compressor-C1,Compressor,600.5,250.1,90.5",
        "Valve-Y10,Valve,0,12.2,21.5",
        // Add some outliers for anomaly detection
        "Pump-Error,Pump,900.0,5.0,300.0", 
    ];
    return `${headers}\n${rows.join('\n')}`;
};