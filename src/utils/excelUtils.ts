import { CargoItem } from "@/types";

export const generateExcelTemplate = (): Blob => {
  // This is a simplified approach - in a real app, you'd use a library like xlsx or exceljs
  // For this demo, we'll create a CSV file which can be opened in Excel
  const headers = [
    "Name",
    "Length (cm)",
    "Width (cm)",
    "Height (cm)",
    "Weight (kg)",
    "Quantity",
    "Stackable (yes/no)"
  ];
  
  const exampleRows = [
    ["Box A", "100", "80", "60", "50", "10", "yes"],
    ["Pallet B", "120", "100", "140", "200", "5", "no"],
    ["Crate C", "200", "150", "180", "300", "2", "yes"]
  ];
  
  const csvContent = [
    headers.join(","),
    ...exampleRows.map(row => row.join(","))
  ].join("\n");
  
  return new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
};

export const parseExcelData = (file: File): Promise<CargoItem[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const csvData = event.target?.result as string;
        const lines = csvData.split("\n");
        
        // Skip header row
        const items: CargoItem[] = [];
        
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;
          
          const columns = line.split(",");
          
          if (columns.length >= 7) {
            items.push({
              id: `item-${i}`,
              name: columns[0].trim(),
              length: parseFloat(columns[1].trim()),
              width: parseFloat(columns[2].trim()),
              height: parseFloat(columns[3].trim()),
              weight: parseFloat(columns[4].trim()),
              quantity: parseInt(columns[5].trim(), 10),
              stackable: columns[6].trim().toLowerCase() === "yes"
            });
          }
        }
        
        resolve(items);
      } catch (error) {
        reject(new Error("Failed to parse CSV data"));
      }
    };
    
    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };
    
    reader.readAsText(file);
  });
};