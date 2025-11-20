<div align="center">
  <h1>ChemVis - Equipment Parameter Visualizer</h1>
  <p>AI-powered analytics dashboard for chemical plant equipment monitoring and analysis</p>
</div>

## 📊 Overview

ChemVis is a comprehensive equipment parameter visualization tool designed for chemical plant engineers and operators. It provides real-time monitoring, advanced analytics, and AI-powered insights for equipment performance data. The application processes CSV datasets containing equipment parameters like flowrate, pressure, and temperature, and generates detailed analytics, anomaly detection, health scores, and predictive forecasts.

## 🚀 Key Features

### 🔍 Advanced Analytics Dashboard
- Interactive summary cards with key performance indicators
- Data visualization through dynamic charts and graphs
- Detailed equipment parameter analysis
- Export functionality to PDF reports

### 🤖 AI-Powered Insights
- Integration with Gemini API for engineering analysis
- Automated anomaly detection using statistical methods
- Predictive trend forecasting for equipment parameters
- Auto-generated operational insights

### 📈 Real-time Monitoring
- Live equipment telemetry simulation
- Real-time parameter tracking with visual indicators
- Pause/resume functionality for data streams

### 🛡️ Data Quality & Health Analysis
- Comprehensive data quality auditing
- Equipment health scoring based on operational parameters
- Anomaly detection with severity scoring
- Duplicate and missing data identification

### 📁 Data Management
- CSV file upload and parsing
- Historical dataset tracking (last 5 uploads)
- Sample data generation for testing

### 🔐 Secure Authentication
- Token-based authentication system
- Session management with local storage

## 🛠️ Technical Architecture

### Frontend
- **React 19** with TypeScript
- **Vite 6** for fast development and building
- **Recharts** for data visualization
- Responsive design with Tailwind CSS-inspired styling

### Backend Simulation
- Client-side data processing algorithms
- Statistical analysis for anomaly detection
- Predictive modeling for trend forecasting
- Local storage for data persistence

### AI Integration
- **Gemini API** for engineering insights
- Natural language analysis of equipment data
- Technical recommendations based on operational parameters

## 📁 Project Structure

```
chemvis---equipment-parameter-visualizer/
├── components/           # React UI components
│   ├── AdvancedAnalytics.tsx
│   ├── Charts.tsx
│   ├── DataTable.tsx
│   ├── FileUploader.tsx
│   ├── History.tsx
│   ├── LiveMonitor.tsx
│   ├── Login.tsx
│   └── SummaryCards.tsx
├── services/            # Business logic and data processing
│   ├── dataService.ts
│   ├── geminiService.ts
│   └── pdfService.ts
├── App.tsx              # Main application component
├── index.tsx            # Application entry point
├── types.ts             # TypeScript interfaces and types
├── vite.config.ts       # Vite configuration
└── package.json         # Project dependencies and scripts
```

## 📦 Installation & Setup

### Prerequisites
- Node.js (version 16 or higher)
- npm (comes with Node.js)
- Gemini API key (for AI features)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd chemvis---equipment-parameter-visualizer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env.local` file in the project root:
   ```bash
   echo "GEMINI_API_KEY=your_actual_api_key_here" > .env.local
   ```
   
   Replace `your_actual_api_key_here` with your actual Gemini API key.
   
   To get a Gemini API key:
   - Visit the Gemini API portal
   - Create a new API key
   - Copy the key and paste it in your `.env.local` file

4. **Run the development server**
   ```bash
   npm run dev
   ```
   
   The application will be available at `http://localhost:3000`

5. **Build for production**
   ```bash
   npm run build
   ```

6. **Preview production build**
   ```bash
   npm run preview
   ```

## 🎯 Usage Guide

### Authentication
1. On first launch, you'll be directed to the login screen
2. Enter any username and password (authentication is simulated for demo purposes)
3. You'll be logged in and redirected to the dashboard

### Data Upload
1. Navigate to the Analytics Dashboard
2. Click "Upload Equipment Data" to select a CSV file
3. The application will process your data and display analytics

### CSV Data Format
Your CSV file should include the following columns:
```csv
equipment_name,equipment_type,flowrate,pressure,temperature
Pump-A01,Pump,120.5,45.2,60.1
Valve-X99,Valve,0,12.5,22.0
```

### Navigation
- **Analytics Dashboard**: Main analytics view with charts and data tables
- **Live Monitor**: Real-time equipment telemetry simulation
- **History**: Access to previously uploaded datasets

### Features
- **AI Insights**: Click the "AI Insights" button to generate engineering analysis
- **Export PDF**: Generate and download PDF reports of your analysis
- **New Data**: Upload a new dataset to replace the current view

## 🔬 Analytical Features

### Anomaly Detection
- Identifies equipment with abnormal operational parameters
- Uses statistical analysis (Z-score approximation) to detect outliers
- Provides severity scoring for each anomaly

### Health Scoring
- Calculates equipment health based on deviation from operational averages
- Weighted scoring: Temperature (40%), Pressure (30%), Flow (30%)
- Visual indicators for equipment status

### Predictive Forecasting
- Projects future equipment parameter trends
- Simulates Holt-Winters forecasting model
- Predicts values for next 5 operational cycles

### Data Quality Audit
- Evaluates dataset integrity
- Identifies missing values, duplicates, and physically impossible data
- Provides quality score (0-100)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Gemini API for AI-powered analysis
- Recharts for data visualization components
- Vite for fast development tooling
- React for the frontend framework

## 📞 Support

For support, please open an issue in the repository or contact the development team.
