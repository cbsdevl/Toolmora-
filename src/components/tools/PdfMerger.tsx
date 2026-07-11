import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PDFDocument } from "pdf-lib";
import { 
  FileText, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Plus, 
  Merge, 
  Download, 
  RefreshCw, 
  AlertCircle,
  CheckCircle,
  FileUp
} from "lucide-react";

interface UploadedFile {
  id: string;
  file: File;
  name: string;
  size: string;
  pages: number;
  arrayBuffer: ArrayBuffer;
}

export default function PdfMerger() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
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
    if (!e.target.files) return;
    await processFiles(Array.from(e.target.files));
  };

  const processFiles = async (fileList: File[]) => {
    setError(null);
    setSuccess(null);
    const pdfFiles = fileList.filter(file => file.type === "application/pdf" || file.name.endsWith(".pdf"));
    
    if (pdfFiles.length === 0) {
      setError("Please select valid PDF files.");
      return;
    }

    setIsProcessing(true);
    const newUploadedFiles: UploadedFile[] = [];

    for (const file of pdfFiles) {
      try {
        const buffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(buffer);
        const pagesCount = pdfDoc.getPageCount();
        
        newUploadedFiles.push({
          id: Math.random().toString(36).substring(2, 9),
          file,
          name: file.name,
          size: formatFileSize(file.size),
          pages: pagesCount,
          arrayBuffer: buffer
        });
      } catch (err) {
        console.error("Error loading PDF: ", err);
        setError(`Failed to read "${file.name}". The file might be corrupted or password-protected.`);
      }
    }

    setFiles(prev => [...prev, ...newUploadedFiles]);
    setIsProcessing(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      await processFiles(Array.from(e.dataTransfer.files));
    }
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
    setSuccess(null);
  };

  const moveFile = (index: number, direction: "up" | "down") => {
    setSuccess(null);
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === files.length - 1) return;

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const updated = [...files];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setFiles(updated);
  };

  const clearAll = () => {
    setFiles([]);
    setError(null);
    setSuccess(null);
  };

  const mergePdfs = async () => {
    if (files.length < 2) {
      setError("You must upload at least 2 PDF files to merge them.");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setSuccess(null);

    try {
      const mergedPdf = await PDFDocument.create();

      for (const item of files) {
        const srcDoc = await PDFDocument.load(item.arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(srcDoc, srcDoc.getPageIndices());
        copiedPages.forEach(page => mergedPdf.addPage(page));
      }

      const mergedPdfBytes = await mergedPdf.save();
      
      const blob = new Blob([mergedPdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Merged_Document_${new Date().toISOString().slice(0, 10)}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setSuccess("PDFs successfully merged and downloaded!");
    } catch (err: any) {
      console.error("Merge error:", err);
      setError("An unexpected error occurred while merging your PDF documents.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6" id="pdf-merger-tool">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h2 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">Merge PDF Documents</h2>
        <p className="text-xs text-gray-600 dark:text-gray-400">
          Combine multiple PDF files into a single document. Reorder files before merging. Everything runs completely local.
        </p>
      </div>

      {/* Drag and Drop Zone */}
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
          multiple
          accept=".pdf,application/pdf"
          className="hidden"
        />
        <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition duration-200">
          <FileUp className="w-6 h-6" />
        </div>
        <p className="text-sm font-bold text-gray-700 dark:text-gray-300">
          Drag & drop your PDF files here, or <span className="text-blue-600 dark:text-blue-400 hover:underline">browse</span>
        </p>
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Supports multiple PDF uploads</p>
      </div>

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

      {files.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-gray-800">
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
              Files to merge ({files.length})
            </span>
            <button
              onClick={clearAll}
              className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
            >
              Clear All
            </button>
          </div>

          <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
            <AnimatePresence initial={false}>
              {files.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="p-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl flex items-center justify-between gap-3 text-xs shadow-sm hover:border-gray-200 dark:hover:border-gray-700 transition"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0 font-bold">
                      {index + 1}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-gray-800 dark:text-gray-200 truncate pr-2">
                        {item.name}
                      </p>
                      <p className="text-[10px] text-gray-600 dark:text-gray-400 mt-0.5 flex gap-2">
                        <span>Pages: {item.pages}</span>
                        <span>•</span>
                        <span>{item.size}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => moveFile(index, "up")}
                      disabled={index === 0}
                      className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-400 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => moveFile(index, "down")}
                      disabled={index === files.length - 1}
                      className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-400 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => removeFile(item.id)}
                      className="p-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg text-rose-600 dark:text-rose-400 cursor-pointer"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="pt-2">
            <button
              onClick={mergePdfs}
              disabled={files.length < 2 || isProcessing}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transition shadow-md shadow-blue-500/10 hover:shadow-blue-500/20"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Merging Files...
                </>
              ) : (
                <>
                  <Merge className="w-4 h-4" />
                  Merge & Download Document
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
