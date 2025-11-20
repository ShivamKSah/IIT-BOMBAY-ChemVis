export interface EquipmentData {
    id: string;
    equipment_name: string;
    equipment_type: 'Pump' | 'Valve' | 'Heat Exchanger' | 'Tank' | 'Reactor' | 'Compressor' | string;
    flowrate: number;
    pressure: number;
    temperature: number;
    uploaded_at: string;
}

export interface TypeDistribution {
    name: string;
    value: number;
}

export interface AnomalyDetails {
    rowId: string;
    equipment_name: string;
    equipment_type: string;
    flowrate: number;
    pressure: number;
    temperature: number;
    reason: string[];
    score: number; // 0 to 1, 1 is high anomaly
}

export interface AnomalyReport {
    total_anomalies: number;
    rows_flagged: string[];
    anomalies: AnomalyDetails[];
}

export interface HealthScore {
    equipment_name: string;
    score: number; // 0-100
}

export interface ForecastData {
    flowrate_future: number[];
    pressure_future: number[];
    temperature_future: number[];
    labels: string[];
}

export interface DataQualityReport {
    score: number; // 0-100
    missing_values: number;
    duplicates: number;
    negative_values: number;
    outliers: number;
    issues: string[];
}

export interface DatasetSummary {
    total_count: number;
    average_flowrate: number;
    average_pressure: number;
    average_temperature: number;
    type_distribution: TypeDistribution[];
}

export interface DatasetRecord {
    id: string;
    file_name: string;
    uploaded_at: string;
    summary: DatasetSummary;
    data: EquipmentData[];
    // New Analytical Fields
    anomalies?: AnomalyReport;
    health_scores?: HealthScore[];
    auto_insights?: string[];
    forecast?: ForecastData;
    data_quality?: DataQualityReport;
}

export enum AuthState {
    UNAUTHENTICATED,
    AUTHENTICATED
}

export interface User {
    username: string;
    token: string;
}