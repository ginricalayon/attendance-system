"use client";

import { useState } from "react";
import { Barcode, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAllStudents } from "@/app/hooks/students/use-students";
import { toast } from "sonner";

interface GenerateBarcodesButtonProps {
  search?: string;
  department?: string;
}

export function GenerateBarcodesButton({ search, department }: GenerateBarcodesButtonProps) {
  const [enabled, setEnabled] = useState(false);
  const { data, isLoading, isError } = useAllStudents({ search, department }, enabled);

  const handleGenerate = () => {
    setEnabled(true);
  };

  // When data arrives, open the print window
  if (enabled && data && !isLoading) {
    // Reset the enabled state so we don't re-trigger
    setEnabled(false);

    const students = data.data || [];

    if (students.length === 0) {
      toast.error("No students found to generate barcodes for.");
      return null;
    }

    // Build the HTML for the print window
    const printHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Student Barcodes</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

    @page {
      size: auto;
      margin: 8mm;
    }

    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Inter', sans-serif;
      background: #fff;
      color: #111;
      padding: 4mm;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 4mm;
    }

    .card {
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      padding: 3mm;
      text-align: center;
      page-break-inside: avoid;
      break-inside: avoid;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2mm;
    }

    .card img {
      max-width: 100%;
      height: auto;
      display: block;
    }

    .card .name {
      font-size: 13px;
      font-weight: 700;
      color: #111;
      line-height: 1.2;
      word-break: break-word;
      margin-top: 1mm;
    }

    .card .dept {
      font-size: 10px;
      font-weight: 600;
      color: #6b7280;
      background: #f3f4f6;
      border-radius: 4px;
      padding: 2px 8px;
      display: inline-block;
    }

    @media print {
      body {
        padding: 0;
      }

      .no-print {
        display: none !important;
      }

      .grid {
        gap: 3mm;
      }

      .card {
        border: 1px solid #d1d5db;
      }
    }

    .actions {
      text-align: center;
      margin-bottom: 6mm;
    }

    .actions button {
      font-family: 'Inter', sans-serif;
      background: #2563eb;
      color: white;
      border: none;
      padding: 8px 24px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      margin: 0 4px;
      transition: background 0.15s;
    }

    .actions button:hover {
      background: #1d4ed8;
    }

    .actions button.secondary {
      background: #f3f4f6;
      color: #374151;
    }

    .actions button.secondary:hover {
      background: #e5e7eb;
    }
  </style>
</head>
<body>
  <div class="actions no-print">
    <button onclick="window.print()">🖨️ Print Barcodes</button>
    <button class="secondary" onclick="window.close()">Close</button>
  </div>

  <div class="grid">
    ${students
      .map(
        (s: any) => `
      <div class="card">
        <img src="${s.barcode}" alt="Barcode ${s.student_number}" />
        <div class="name">${s.last_name}, ${s.first_name}${s.middle_initial ? ` ${s.middle_initial}.` : ""}</div>
        <div class="dept">${s.department}</div>
      </div>
    `
      )
      .join("")}
  </div>
</body>
</html>`;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(printHTML);
      printWindow.document.close();
    } else {
      toast.error("Pop-up blocked. Please allow pop-ups for this site.");
    }
  }

  if (isError && enabled) {
    setEnabled(false);
    toast.error("Failed to fetch students for barcode generation.");
  }

  return (
    <Button
      variant="outline"
      onClick={handleGenerate}
      disabled={isLoading}
      className="rounded-xl border-primary/20 hover:bg-primary/5 hover:text-primary transition-colors"
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Barcode className="mr-2 h-4 w-4" />
      )}
      {isLoading ? "Loading..." : "Generate Barcodes"}
    </Button>
  );
}
