import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { jsPDF } from "jspdf";
import { 
  FileText, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Plus, 
  Download, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle, 
  FileImage,
  Settings,
  Maximize2
} from "lucide-react";

interface UploadedImage {
  id: string;
  file: File;
  name: string;
  src: string;
  size: string;
}

export default function ImageToPdf() {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [pageSize, setPageSize] = useState<"a4" | "letter" | "original">("a4");
  const [margin, setMargin] = useState<"none" | "small" | "medium">("none");
  const [orientation, setOrientation] = useState<"auto" | "portrait" | "landscape">("auto");
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    processImages(Array.from(e.target.files));
  };

  const processImages = (fileList: File[]) => {
    setError(null);
    setSuccess(null);
    const validImages = fileList.filter(file => 
      file.type === "image/jpeg" || 
      file.type === "image/png" || 
      file.type === "image/webp" ||
      file.name.endsWith(".jpg") ||
      file.name.endsWith(".jpeg") ||
      file.name.endsWith(".png") ||
      file.name.endsWith(".webp")
    );

    if (validImages.length === 0) {
      setError("Please select valid image files (JPG, PNG, or WebP).");
      return;
    }

    const newUploaded: UploadedImage[] = [];

    validImages.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        newUploaded.push({
          id: Math.random().toString(36).substring(2, 9),
          file,
          name: file.name,
          size: formatFileSize(file.size),
          src: reader.result as string
        });

        if (newUploaded.length === validImages.length) {
          setImages(prev => [...prev, ...newUploaded]);
        }
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      processImages(Array.from(e.dataTransfer.files));
    }
  };

  const removeImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
    setSuccess(null);
  };

  const moveImage = (index: number, direction: "up" | "down") => {
    setSuccess(null);
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === images.length - 1) return;

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const updated = [...images];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setImages(updated);
  };

  const clearAll = () => {
    setImages([]);
    setError(null);
    setSuccess(null);
  };

  const convertToPdf = async () => {
    if (images.length === 0) {
      setError("Please upload at least one image to create a PDF.");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setSuccess(null);

    // Give a minor delay to let state change
    await new Promise(resolve => setTimeout(resolve, 300));

    try {
      let doc: jsPDF | null = null;
      
      const marginValues = {
        none: 0,
        small: 15,
        medium: 30
      };
      const pad = marginValues[margin];

      for (let i = 0; i < images.length; i++) {
        const item = images[i];
        
        // Load image to get width and height
        const img = new Image();
        img.src = item.src;
        await new Promise((resolve) => {
          img.onload = resolve;
        });

        const imgW = img.width;
        const imgH = img.height;

        // Determine orientation
        let finalOrientation: "p" | "l" = "p";
        if (orientation === "auto") {
          finalOrientation = imgW > imgH ? "l" : "p";
        } else {
          finalOrientation = orientation === "portrait" ? "p" : "l";
        }

        // Page setup
        let pW = 0;
        let pH = 0;
        let formatSpec: any = pageSize;

        if (pageSize === "original") {
          formatSpec = [imgW + pad * 2, imgH + pad * 2];
          pW = imgW + pad * 2;
          pH = imgH + pad * 2;
        } else {
          // Standard document widths/heights in pt/px
          const specW = pageSize === "a4" ? 595.28 : 612;
          const specH = pageSize === "a4" ? 841.89 : 792;
          pW = finalOrientation === "p" ? specW : specH;
          pH = finalOrientation === "p" ? specH : specW;
        }

        if (i === 0) {
          doc = new jsPDF({
            orientation: finalOrientation,
            unit: "pt",
            format: formatSpec
          });
        } else {
          doc?.addPage(formatSpec, finalOrientation);
        }

        // Calculate size to draw with aspect ratio constraint
        const printableW = pW - pad * 2;
        const printableH = pH - pad * 2;

        let drawW = printableW;
        let drawH = (imgH * drawW) / imgW;

        if (drawH > printableH) {
          drawH = printableH;
          drawW = (imgW * drawH) / imgH;
        }

        // Center on page
        const drawX = pad + (printableW - drawW) / 2;
        const drawY = pad + (printableH - drawH) / 2;

        // Try to add image format correctly
        let format = "JPEG";
        if (item.file.type === "image/png" || item.name.endsWith(".png")) format = "PNG";
        if (item.file.type === "image/webp" || item.name.endsWith(".webp")) format = "WEBP";

        doc?.addImage(item.src, format, drawX, drawY, drawW, drawH);
      }

      if (doc) {
        doc.save(`Images_${new Date().toISOString().slice(0, 10)}.pdf`);
        setSuccess("Successfully generated and downloaded PDF!");
      } else {
        setError("Could not initialize PDF generation.");
      }
    } catch (err: any) {
      console.error(err);
      setError("An error occurred during PDF generation.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6" id="image-to-pdf-tool">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h2 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">Convert Images to PDF</h2>
        <p className="text-xs text-gray-600 dark:text-gray-400">
          Transform PNG, JPEG, or WebP images into a single beautifully styled PDF. Drag images to arrange page order.
        </p>
      </div>

      {/* Drag & Drop */}
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
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
        />
        <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition duration-200">
          <FileImage className="w-6 h-6" />
        </div>
        <p className="text-sm font-bold text-gray-700 dark:text-gray-300">
          Drag & drop your images here, or <span className="text-blue-600 dark:text-blue-400 hover:underline">browse</span>
        </p>
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Supports PNG, JPG, and WebP formats</p>
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

      {images.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Settings panel - Left */}
          <div className="md:col-span-1 space-y-4 p-5 bg-gray-50/50 dark:bg-gray-900/30 border border-gray-100 dark:border-gray-800/80 rounded-2xl h-fit">
            <div className="flex items-center gap-1.5 pb-2 border-b border-gray-100 dark:border-gray-800">
              <Settings className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">PDF Options</span>
            </div>

            {/* Page Format */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-600 dark:text-gray-400">Page Format</label>
              <select
                value={pageSize}
                onChange={(e: any) => setPageSize(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500/20 text-gray-800 dark:text-gray-200"
              >
                <option value="a4">A4 (Standard)</option>
                <option value="letter">US Letter</option>
                <option value="original">Original Image Dimensions</option>
              </select>
            </div>

            {/* Page Orientation */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-600 dark:text-gray-400">Page Orientation</label>
              <select
                value={orientation}
                onChange={(e: any) => setOrientation(e.target.value)}
                disabled={pageSize === "original"}
                className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500/20 text-gray-800 dark:text-gray-200 disabled:opacity-40"
              >
                <option value="auto">Auto (Match Image Layout)</option>
                <option value="portrait">Portrait</option>
                <option value="landscape">Landscape</option>
              </select>
            </div>

            {/* Margins */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-600 dark:text-gray-400">Page Margins</label>
              <div className="grid grid-cols-3 gap-1.5">
                {(["none", "small", "medium"] as const).map(option => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setMargin(option)}
                    className={`py-1.5 border rounded-lg text-[10px] font-bold uppercase transition cursor-pointer ${
                      margin === option
                        ? "bg-blue-600 border-blue-600 text-white"
                        : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={convertToPdf}
                disabled={isProcessing}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer transition text-xs shadow-md shadow-blue-500/10 hover:shadow-blue-500/20"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Generating PDF...
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" />
                    Generate & Download PDF
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Uploaded images grid order list - Right */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex justify-between items-center pb-1 border-b border-gray-100 dark:border-gray-800">
              <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                Arrange Pages ({images.length})
              </span>
              <button
                onClick={clearAll}
                className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
              >
                Clear All
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
              <AnimatePresence initial={false}>
                {images.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, x: -50 }}
                    className="p-2.5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl relative group flex gap-3 shadow-sm hover:border-gray-200 dark:hover:border-gray-700 transition"
                  >
                    {/* Thumbnail */}
                    <div className="w-16 h-20 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-800 overflow-hidden flex-shrink-0 flex items-center justify-center relative">
                      <img
                        src={item.src}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-1 left-1 bg-gray-900/70 text-white rounded px-1 text-[8px] font-extrabold uppercase">
                        Page {index + 1}
                      </div>
                    </div>

                    <div className="min-w-0 flex flex-col justify-between py-0.5 w-full">
                      <div className="min-w-0">
                        <p className="text-[11px] font-bold text-gray-800 dark:text-gray-200 truncate pr-5">
                          {item.name}
                        </p>
                        <p className="text-[9px] text-gray-600 dark:text-gray-400 mt-0.5">{item.size}</p>
                      </div>

                      <div className="flex items-center gap-1 flex-shrink-0 justify-end mt-2">
                        <button
                          onClick={() => moveImage(index, "up")}
                          disabled={index === 0}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-gray-600 dark:text-gray-400 disabled:opacity-20 cursor-pointer"
                          title="Move Left"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => moveImage(index, "down")}
                          disabled={index === images.length - 1}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-gray-600 dark:text-gray-400 disabled:opacity-20 cursor-pointer"
                          title="Move Right"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => removeImage(item.id)}
                          className="p-1 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded text-rose-600 dark:text-rose-400 cursor-pointer"
                          title="Remove Image"
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
    </div>
  );
}
