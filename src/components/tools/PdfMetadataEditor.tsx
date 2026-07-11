import React, { useState, useRef } from "react";
import { PDFDocument } from "pdf-lib";
import { 
  FileText, 
  Download, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle, 
  FileUp, 
  Info,
  Edit3
} from "lucide-react";

export default function PdfMetadataEditor() {
  const [file, setFile] = useState<File | null>(null);
  const [arrayBuffer, setArrayBuffer] = useState<ArrayBuffer | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Metadata Fields
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [subject, setSubject] = useState("");
  const [keywords, setKeywords] = useState("");
  const [creator, setCreator] = useState("");
  const [producer, setProducer] = useState("");

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
      
      // Load existing metadata values
      setTitle(pdfDoc.getTitle() || "");
      setAuthor(pdfDoc.getAuthor() || "");
      setSubject(pdfDoc.getSubject() || "");
      setKeywords(pdfDoc.getKeywords() || "");
      setCreator(pdfDoc.getCreator() || "");
      setProducer(pdfDoc.getProducer() || "");

      setFile(targetFile);
      setArrayBuffer(buffer);
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

  const saveMetadata = async () => {
    if (!arrayBuffer || !file) return;

    setIsProcessing(true);
    setError(null);
    setSuccess(null);

    try {
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      
      // Set metadata values
      pdfDoc.setTitle(title);
      pdfDoc.setAuthor(author);
      pdfDoc.setSubject(subject);
      pdfDoc.setKeywords(keywords.split(",").map(k => k.trim()).filter(Boolean));
      pdfDoc.setCreator(creator);
      pdfDoc.setProducer(producer);

      const updatedBytes = await pdfDoc.save();
      
      const blob = new Blob([updatedBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${file.name.replace(".pdf", "")}_edited.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Save updated array buffer so further updates work on this version
      setArrayBuffer(updatedBytes);
      setSuccess("PDF Metadata updated successfully!");
    } catch (err) {
      console.error("Metadata Save error:", err);
      setError("Failed to save PDF metadata. An unexpected error occurred.");
    } finally {
      setIsProcessing(false);
    }
  };

  const clearAll = () => {
    setFile(null);
    setArrayBuffer(null);
    setTitle("");
    setAuthor("");
    setSubject("");
    setKeywords("");
    setCreator("");
    setProducer("");
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="space-y-6" id="pdf-metadata-editor-tool">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h2 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">PDF Metadata Editor</h2>
        <p className="text-xs text-gray-600 dark:text-gray-400">
          Inspect, configure, or edit search-engine indexed PDF metadata tags. No third-party uploads, fully private.
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
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Select a single PDF file to edit metadata</p>
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
                <p className="text-gray-600 dark:text-gray-400 mt-0.5">{formatFileSize(file.size)}</p>
              </div>
            </div>
            <button
              onClick={clearAll}
              className="px-3 py-1.5 border border-gray-200 dark:border-gray-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:border-rose-100 dark:hover:border-rose-900 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg text-xs font-bold transition cursor-pointer"
            >
              Change File
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Form Fields - Left & Middle */}
            <div className="md:col-span-2 space-y-4">
              <span className="text-xs font-bold text-gray-700 dark:text-gray-300 block uppercase tracking-wider">Document Metadata Properties</span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-gray-600 dark:text-gray-400">Document Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter PDF Title..."
                    className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 text-gray-800 dark:text-gray-200"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-600 dark:text-gray-400">Author Name</label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Author / Creator Name..."
                    className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 text-gray-800 dark:text-gray-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-gray-600 dark:text-gray-400">Subject</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Brief description / subject..."
                    className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 text-gray-800 dark:text-gray-200"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-600 dark:text-gray-400">Keywords (Comma Separated)</label>
                  <input
                    type="text"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder="tag1, tag2, tag3"
                    className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 text-gray-800 dark:text-gray-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-gray-600 dark:text-gray-400">Application (Creator)</label>
                  <input
                    type="text"
                    value={creator}
                    onChange={(e) => setCreator(e.target.value)}
                    placeholder="e.g. Adobe InDesign, Microsoft Word"
                    className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 text-gray-800 dark:text-gray-200"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-600 dark:text-gray-400">PDF Producer</label>
                  <input
                    type="text"
                    value={producer}
                    onChange={(e) => setProducer(e.target.value)}
                    placeholder="PDF engine / generator..."
                    className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 text-gray-800 dark:text-gray-200"
                  />
                </div>
              </div>
            </div>

            {/* Quick action right card */}
            <div className="md:col-span-1 space-y-4 p-5 bg-gray-50/50 dark:bg-gray-900/30 border border-gray-100 dark:border-gray-800/80 rounded-2xl h-fit text-xs">
              <div className="flex items-center gap-1 text-gray-700 dark:text-gray-300 font-bold uppercase tracking-wider">
                <Info className="w-4 h-4 text-blue-600" />
                <span>Why Edit Metadata?</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-[11px]">
                PDF metadata is critical for Search Engine Optimization (SEO). 
                Adding rich keywords, appropriate titles, and authoritative authors helps search engines like Google rank your PDF links more effectively.
              </p>
              
              <div className="border-t border-gray-100 dark:border-gray-800 pt-3">
                <button
                  type="button"
                  onClick={saveMetadata}
                  disabled={isProcessing}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer transition"
                >
                  {isProcessing ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Edit3 className="w-3.5 h-3.5" />
                  )}
                  Save & Export PDF
                </button>
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
