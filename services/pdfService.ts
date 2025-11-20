import { DatasetRecord } from "../types";

// We declare jsPDF locally to avoid Typescript errors since it's loaded via CDN
declare const jspdf: any;

export const generatePDF = (dataset: DatasetRecord) => {
    try {
        const { jsPDF } = jspdf;
        const doc = new jsPDF();

        // Title
        doc.setFontSize(22);
        doc.setTextColor(41, 128, 185);
        doc.text("Chemical Equipment Report", 105, 20, { align: "center" });

        // Meta
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`File: ${dataset.file_name}`, 20, 35);
        doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 40);
        doc.text(`Total Items: ${dataset.summary.total_count}`, 20, 45);

        // Summary Table
        doc.setFontSize(14);
        doc.setTextColor(0);
        doc.text("Summary Statistics", 20, 60);

        const summaryData = [
            ["Parameter", "Value"],
            ["Avg Flowrate", `${dataset.summary.average_flowrate} m3/h`],
            ["Avg Pressure", `${dataset.summary.average_pressure} bar`],
            ["Avg Temperature", `${dataset.summary.average_temperature} C`],
        ];

        doc.autoTable({
            startY: 65,
            head: [["Metric", "Value"]],
            body: summaryData,
            theme: 'striped',
            headStyles: { fillColor: [41, 128, 185] }
        });

        // Type Distribution
        const distributionData = dataset.summary.type_distribution.map(t => [t.name, t.value]);
        doc.text("Equipment Distribution", 20, doc.lastAutoTable.finalY + 15);
        
        doc.autoTable({
            startY: doc.lastAutoTable.finalY + 20,
            head: [["Type", "Count"]],
            body: distributionData,
            theme: 'grid',
            headStyles: { fillColor: [46, 204, 113] }
        });

        // Data Snapshot (First 20 rows)
        doc.addPage();
        doc.text("Raw Data Snapshot (Top 20)", 20, 20);

        const rows = dataset.data.slice(0, 20).map(d => [
            d.equipment_name,
            d.equipment_type,
            d.flowrate,
            d.pressure,
            d.temperature
        ]);

        doc.autoTable({
            startY: 25,
            head: [["Name", "Type", "Flow", "Press", "Temp"]],
            body: rows,
            theme: 'striped',
            headStyles: { fillColor: [44, 62, 80] }
        });

        doc.save(`ChemVis_Report_${dataset.id}.pdf`);
    } catch (e) {
        console.error("PDF Generation Error", e);
        alert("Error generating PDF. Please ensure libraries are loaded.");
    }
};