import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PDFDocument } from "pdf-lib";
import { 
  FileText, 
  Download, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle, 
  FileUp, 
  Scissors, 
  CheckSquare, 
  Square 
} from "lucide-react";

export default function PdfSplitter() {
  const [file, setFile] = useState<File | null>(null);
  const [arrayBuffer, setArrayBuffer] = useState<ArrayBuffer | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [rangeInput, setRangeInput] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    await processFile(e.target.files[0]);
  };

  const processFile = async (targetFile: File) => {
    setError(null);
    setSuccess(null);
    if (targetFile.type !== "application/pdf" && !targetFile.name.endsWith(".pdf")) {
      setError("Please select a valid PDF file.");
      return;
    }

    setIsProcessing(true);
    try {
      const buffer = await targetFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buffer);
      const count = pdfDoc.getPageCount();
      
      setFile(targetFile);
      setArrayBuffer(buffer);
      setPageCount(count);
      // Select all by default
      setSelectedPages(Array.from({ length: count }, (_, i) => i + 1));
      setRangeInput(`1-${count}`);
    } catch (err) {
      console.error("Error reading PDF: ", err);
      setError("Failed to read PDF. The file might be corrupted or password-protected.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await processFile(e.dataTransfer.files[0]);
    }
  };

  const togglePageSelection = (pageNum: number) => {
    setSuccess(null);
    setSelectedPages(prev => {
      const next = prev.includes(pageNum) 
        ? prev.filter(p => p !== pageNum) 
        : [...prev, pageNum].sort((a, b) => a - b);
      
      // Update range input to reflect selection in a simple list style
      setRangeInput(next.join(", "));
      return next;
    });
  };

  const selectAll = () => {
    setSuccess(null);
    const all = Array.from({ length: pageCount }, (_, i) => i + 1);
    setSelectedPages(all);
    setRangeInput(`1-${pageCount}`);
  };

  const selectNone = () => {
    setSuccess(null);
    setSelectedPages([]);
    setRangeInput("");
  };

  const handleRangeInputChange = (val: string) => {
    setSuccess(null);
    setRangeInput(val);
    
    // Parse range (e.g. "1-5, 8, 11-13")
    const pagesToSelect: number[] = [];
    const parts = val.split(",");
    
    for (const part of parts) {
      const trimmed = part.trim();
      if (!trimmed) continue;
      
      if (trimmed.includes("-")) {
        const [startStr, endStr] = trimmed.split("-");
        const start = parseInt(startStr, 10);
        const end = parseInt(endStr, 10);
        
        if (!isNaN(start) && !isNaN(end)) {
          const s = Math.min(start, end);
          const e = Math.max(start, end);
          for (let i = s; i <= e; i++) {
            if (i >= 1 && i <= pageCount) {
              pagesToSelect.push(i);
            }
          }
        }
      } else {
        const pageNum = parseInt(trimmed, 10);
        if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= pageCount) {
          pagesToSelect.push(pageNum);
        }
      }
    }
    
    // Deduplicate and sort
    const uniqueSorted = Array.from(new Set(pagesToSelect)).sort((a, b) => a - b);
    setSelectedPages(uniqueSorted);
  };

  const extractPages = async () => {
    if (!arrayBuffer || !file) return;
    if (selectedPages.length === 0) {
      setError("Please select at least one page to extract.");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setSuccess(null);

    try {
      const srcDoc = await PDFDocument.load(arrayBuffer);
      const newPdf = await PDFDocument.create();
      
      // pdf-lib copyPages expects 0-based index
      const zeroBasedIndices = selectedPages.map(p => p - 1);
      const copiedPages = await newPdf.copyPages(srcDoc, zeroBasedIndices);
      copiedPages.forEach(page => newPdf.addPage(page));
      
      const newPdfBytes = await newPdf.save();
      
      const blob = new Blob([newPdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${file.name.replace(".pdf", "")}_extracted.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setSuccess(`Successfully extracted ${selectedPages.length} pages into a new PDF!`);
    } catch (err) {
      console.error("Split error:", err);
      setError("Failed to extract pages. An unexpected error occurred.");
    } finally {
      setIsProcessing(false);
    }
  };

  const clearAll = () => {
    setFile(null);
    setArrayBuffer(null);
    setPageCount(0);
    setSelectedPages([]);
    setRangeInput("");
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="space-y-6" id="pdf-splitter-tool">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h2 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">PDF Splitter & Page Extractor</h2>
        <p className="text-xs text-gray-600 dark:text-gray-400">
          Extract specific page ranges, split select sections, or delete unneeded pages from a PDF. Fully offline and secure.
        </p>
      </div>

      {!file ? (
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-8 text-center cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition bg-gray-50/50 dark:bg-gray-900/30 group"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,application/pdf"
            className="hidden"
          />
          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition duration-200">
            <FileUp className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-gray-700 dark:text-gray-300">
            Drag & drop your PDF file here, or <span className="text-blue-600 dark:text-blue-400 hover:underline">browse</span>
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Select a single PDF document to split</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* File details panel */}
          <div className="p-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl flex justify-between items-center text-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="font-extrabold text-gray-900 dark:text-white max-w-[200px] sm:max-w-md truncate">{file.name}</p>
                <p className="text-gray-600 dark:text-gray-400 mt-0.5">{formatFileSize(file.size)} • {pageCount} pages</p>
              </div>
            </div>
            <button
              onClick={clearAll}
              className="px-3 py-1.5 border border-gray-200 dark:border-gray-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:border-rose-100 dark:hover:border-rose-900 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg text-xs font-bold transition cursor-pointer"
            >
              Change File
            </button>
          </div>

          {/* Config Area */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Range selection left */}
            <div className="md:col-span-1 space-y-4 p-5 bg-gray-50/50 dark:bg-gray-900/30 border border-gray-100 dark:border-gray-800/80 rounded-2xl h-fit">
              <span className="text-xs font-bold text-gray-800 dark:text-gray-200 block uppercase tracking-wider">Extraction Config</span>
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-600 dark:text-gray-400">Page Range Input</label>
                <input
                  type="text"
                  value={rangeInput}
                  onChange={(e) => handleRangeInputChange(e.target.value)}
                  placeholder="e.g. 1-3, 5, 8-10"
                  className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-gray-800 dark:text-gray-200"
                />
                <span className="text-[10px] text-gray-600 dark:text-gray-400 block leading-relaxed">
                  Enter ranges separated by commas (e.g. "1-4, 6"). Or click the page cards on the right.
                </span>
              </div>

              <div className="pt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={selectAll}
                  className="px-2.5 py-1 text-[10px] font-bold bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition cursor-pointer"
                >
                  Select All
                </button>
                <button
                  type="button"
                  onClick={selectNone}
                  className="px-2.5 py-1 text-[10px] font-bold bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition cursor-pointer"
                >
                  Deselect All
                </button>
              </div>

              <div className="border-t border-gray-100 dark:border-gray-800 pt-3">
                <div className="flex justify-between items-center text-xs text-gray-600 dark:text-gray-400">
                  <span>Selected Pages:</span>
                  <span className="font-extrabold text-blue-600 dark:text-blue-400">{selectedPages.length} / {pageCount}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={extractPages}
                disabled={selectedPages.length === 0 || isProcessing}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transition text-xs"
              >
                {isProcessing ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Scissors className="w-3.5 h-3.5" />
                )}
                Extract & Download
              </button>
            </div>

            {/* Visual Page grid right */}
            <div className="md:col-span-2 space-y-3">
              <span className="text-xs font-bold text-gray-700 dark:text-gray-300 block">Select Pages Visually</span>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 max-h-[350px] overflow-y-auto pr-1">
                {Array.from({ length: pageCount }, (_, i) => i + 1).map((pageNum) => {
                  const isSelected = selectedPages.includes(pageNum);
                  return (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => togglePageSelection(pageNum)}
                      className={`relative aspect-[3/4] rounded-xl border flex flex-col justify-between p-3 transition text-left cursor-pointer outline-none focus:ring-2 focus:ring-blue-500/30 ${
                        isSelected 
                          ? "bg-blue-50/40 dark:bg-blue-950/20 border-blue-500 text-blue-900 dark:text-blue-200" 
                          : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-700"
                      }`}
                    >
                      <div className="flex justify-between items-center w-full">
                        <span className="text-[10px] font-bold text-gray-600 dark:text-gray-400">Page</span>
                        {isSelected ? (
                          <CheckSquare className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                        ) : (
                          <Square className="w-3.5 h-3.5 text-gray-300 dark:text-gray-700 flex-shrink-0" />
                        )}
                      </div>
                      <div className="text-center w-full py-2">
                        <span className="text-xl font-extrabold">{pageNum}</span>
                      </div>
                      <div className="w-full h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div className={`h-full ${isSelected ? 'bg-blue-500' : 'bg-transparent'}`} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-400 rounded-xl text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-400 rounded-xl text-xs flex items-start gap-2.5">
          <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}
    </div>
  );
}
