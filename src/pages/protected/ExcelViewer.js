import React, { useState } from "react";
import DataGrid from "react-data-grid";
import * as XLSX from "xlsx";

function ExcelViewer() {
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const workbook = XLSX.read(e.target.result, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const excelData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      const headerRow = excelData[0];
      const columnKeys = Object.keys(headerRow);
      const gridColumns = columnKeys.map((key) => ({
        key: key,
        name: headerRow[key],
        resizable: true,
      }));

      const gridRows = excelData.slice(1).map((row) => {
        const rowData = {};
        columnKeys.forEach((key, index) => {
          rowData[key] = row[index];
        });
        return rowData;
      });

      setColumns(gridColumns);
      setRows(gridRows);
    };

    reader.readAsBinaryString(file);
  };

  return (
    <div>
      <input type="file" onChange={handleFileUpload} />
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid columns={columns} rows={rows} />
      </div>
    </div>
  );
}

export default ExcelViewer;
