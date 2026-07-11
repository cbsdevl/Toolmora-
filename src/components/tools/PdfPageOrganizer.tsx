import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PDFDocument, degrees } from "pdf-lib";
import { 
  FileText, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  RotateCw, 
  Download, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle, 
  FileUp, 
  LayoutGrid
} from "lucide-react";

interface PageState {
  id: string;
  originalIndex: number; // 0-based
  rotation: number; // 0, 90, 180, 270
}

export default function PdfPageOrganizer() {
  const [file, setFile] = useState<File | null>(null);
  const [arrayBuffer, setArrayBuffer] = useState<ArrayBuffer | null>(null);
  const [pages, setPages] = useState<PageState[]>([]);
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
      
      const loadedPages: PageState[] = [];
      for (let i = 0; i < count; i++) {
        const page = pdfDoc.getPage(i);
        const rotationAngle = page.getRotation().angle;
        
        loadedPages.push({
          id: Math.random().toString(36).substring(2, 9),
          originalIndex: i,
          rotation: rotationAngle
        });
      }

      setFile(targetFile);
      setArrayBuffer(buffer);
      setPages(loadedPages);
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

  const rotatePage = (index: number) => {
    setSuccess(null);
    setPages(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        rotation: (updated[index].rotation + 90) % 360
      };
      return updated;
    });
  };

  const deletePage = (id: string) => {
    setSuccess(null);
    setPages(prev => prev.filter(p => p.id !== id));
  };

  const movePage = (index: number, direction: "left" | "right") => {
    setSuccess(null);
    if (direction === "left" && index === 0) return;
    if (direction === "right" && index === pages.length - 1) return;

    const targetIndex = direction === "left" ? index - 1 : index + 1;
    const updated = [...pages];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setPages(updated);
  };

  const exportPdf = async () => {
    if (!arrayBuffer || !file) return;
    if (pages.length === 0) {
      setError("You must have at least one page to generate a PDF.");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setSuccess(null);

    try {
      const srcDoc = await PDFDocument.load(arrayBuffer);
      const newPdf = await PDFDocument.create();

      for (const item of pages) {
        // Copy the specific page
        const [copiedPage] = await newPdf.copyPages(srcDoc, [item.originalIndex]);
        
        // Apply rotation
        copiedPage.setRotation(degrees(item.rotation));
        
        // Add to new doc
        newPdf.addPage(copiedPage);
      }

      const organizedBytes = await newPdf.save();
      
      const blob = new Blob([organizedBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${file.name.replace(".pdf", "")}_organized.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setSuccess("Your organized PDF has been successfully exported and downloaded!");
    } catch (err) {
      console.error("Export organized PDF error:", err);
      setError("Failed to export PDF. An unexpected error occurred.");
    } finally {
      setIsProcessing(false);
    }
  };

  const clearAll = () => {
    setFile(null);
    setArrayBuffer(null);
    setPages([]);
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="space-y-6" id="pdf-organizer-tool">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h2 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">PDF Page Organizer & Rotator</h2>
        <p className="text-xs text-gray-600 dark:text-gray-400">
          Visually rearrange PDF pages, rotate crooked files, or delete extra layout pages. Completely safe and runs client-side.
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
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Select a single PDF document to organize pages</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* File Header */}
          <div className="p-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl flex flex-wrap justify-between items-center text-xs gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="font-extrabold text-gray-900 dark:text-white max-w-[200px] sm:max-w-md truncate">{file.name}</p>
                <p className="text-gray-600 dark:text-gray-400 mt-0.5">{formatFileSize(file.size)} • {pages.length} pages</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={clearAll}
                className="px-3 py-2 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg font-bold transition cursor-pointer"
              >
                Change File
              </button>
              <button
                onClick={exportPdf}
                disabled={isProcessing || pages.length === 0}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg flex items-center gap-2 cursor-pointer transition disabled:opacity-40"
              >
                {isProcessing ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Download className="w-3.5 h-3.5" />
                )}
                Save & Download
              </button>
            </div>
          </div>

          {/* Visual Canvas Grid */}
          <div className="p-5 bg-gray-50/50 dark:bg-gray-900/30 border border-gray-100 dark:border-gray-800 rounded-2xl">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-h-[420px] overflow-y-auto pr-1">
              <AnimatePresence initial={false}>
                {pages.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="p-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl flex flex-col justify-between shadow-sm hover:border-gray-200 dark:hover:border-gray-700 transition gap-3"
                  >
                    {/* Visual aspect */}
                    <div className="flex justify-between items-center text-[10px] font-bold text-gray-600 dark:text-gray-400">
                      <span>Index: {index + 1}</span>
                      <span>Page {item.originalIndex + 1}</span>
                    </div>

                    {/* Paper Mockup with rotation */}
                    <div className="py-6 flex items-center justify-center bg-gray-50/50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 rounded-lg relative overflow-hidden h-28">
                      <motion.div
                        animate={{ rotate: item.rotation }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                        className="w-12 h-16 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded shadow-sm flex flex-col justify-between p-1"
                      >
                        <div className="w-full h-1 bg-gray-100 dark:bg-gray-700 rounded-full" />
                        <div className="space-y-0.5">
                          <div className="w-2/3 h-0.5 bg-gray-100 dark:bg-gray-700 rounded-full" />
                          <div className="w-3/4 h-0.5 bg-gray-100 dark:bg-gray-700 rounded-full" />
                        </div>
                        <div className="text-[10px] font-extrabold text-center text-gray-600 dark:text-gray-400">
                          PDF
                        </div>
                      </motion.div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center justify-between border-t border-gray-50 dark:border-gray-800 pt-2 text-xs">
                      <div className="flex gap-1">
                        <button
                          onClick={() => movePage(index, "left")}
                          disabled={index === 0}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-gray-500 disabled:opacity-20 cursor-pointer"
                          title="Move Left"
                        >
                          <ArrowUp className="w-3.5 h-3.5 -rotate-90" />
                        </button>
                        <button
                          onClick={() => movePage(index, "right")}
                          disabled={index === pages.length - 1}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-gray-500 disabled:opacity-20 cursor-pointer"
                          title="Move Right"
                        >
                          <ArrowUp className="w-3.5 h-3.5 rotate-90" />
                        </button>
                      </div>

                      <div className="flex gap-1">
                        <button
                          onClick={() => rotatePage(index)}
                          className="p-1 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded cursor-pointer"
                          title="Rotate 90°"
                        >
                          <RotateCw className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deletePage(item.id)}
                          className="p-1 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 rounded cursor-pointer"
                          title="Delete Page"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
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
