import React, { useState, useRef } from "react";
import { Upload, ChevronsDown, Download, RotateCcw, ImageIcon, AlertTriangle } from "lucide-react";

export default function ImageCompressorTool() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string>("");
  const [compressedUrl, setCompressedUrl] = useState<string>("");
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [quality, setQuality] = useState<number>(0.75); // 75% quality default
  const [compressing, setCompressing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 KB";
    const kb = bytes / 1024;
    if (kb > 1024) {
      return `${(kb / 1024).toFixed(2)} MB`;
    }
    return `${kb.toFixed(1)} KB`;
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file (JPEG, PNG, WebP).");
      return;
    }
    setSelectedFile(file);
    setOriginalSize(file.size);
    
    const url = URL.createObjectURL(file);
    setOriginalUrl(url);
    
    // Auto-compress on load
    compressImage(file, url, quality);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const compressImage = (file: File, imgUrl: string, compQuality: number) => {
    setCompressing(true);
    const img = new Image();
    img.src = imgUrl;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        
        // Export to Blob with quality parameter (jpeg or webp support quality parameter)
        // If PNG, it exports as JPEG so it can actually compress
        const exportType = file.type === "image/png" ? "image/jpeg" : file.type;
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              setCompressedSize(blob.size);
              const url = URL.createObjectURL(blob);
              setCompressedUrl(url);
            }
            setCompressing(false);
          },
          exportType,
          compQuality
        );
      } else {
        setCompressing(false);
      }
    };
  };

  const handleQualityChange = (newQuality: number) => {
    setQuality(newQuality);
    if (selectedFile && originalUrl) {
      compressImage(selectedFile, originalUrl, newQuality);
    }
  };

  const handleDownload = () => {
    if (!compressedUrl) return;
    const a = document.createElement("a");
    a.href = compressedUrl;
    // Keep extension logic
    const ext = selectedFile?.type === "image/png" ? "jpg" : selectedFile?.name.split(".").pop() || "jpg";
    a.download = `toolmora-compressed.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleReset = () => {
    setSelectedFile(null);
    setOriginalUrl("");
    setCompressedUrl("");
    setOriginalSize(0);
    setCompressedSize(0);
    setQuality(0.75);
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm" id="image-compressor-card">
      <div className="space-y-6">
        {!selectedFile ? (
          /* Drag & Drop Area */
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`h-72 border-2 border-dashed rounded-2xl flex flex-col justify-center items-center p-8 text-center cursor-pointer transition duration-150 ${
              dragActive
                ? "border-blue-500 bg-blue-50/20"
                : "border-gray-200 bg-gray-50/50 hover:bg-gray-100/50"
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInputChange}
              accept="image/*"
              className="hidden"
            />
            <Upload className="w-12 h-12 text-gray-600 dark:text-gray-400 mb-4 opacity-75" />
            <p className="font-semibold text-gray-700 text-sm">Drag & drop your image here, or click to browse</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">Supports JPG, PNG, WebP up to 50MB. Compression is 100% private.</p>
          </div>
        ) : (
          /* Controls & Previews */
          <div className="space-y-6">
            {/* Header info */}
            <div className="flex flex-wrap justify-between items-center gap-4 bg-gray-50 border border-gray-100 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <ImageIcon className="w-10 h-10 text-blue-500 bg-white p-2 border border-gray-100 rounded-lg" />
                <div>
                  <p className="text-sm font-semibold text-gray-700 truncate max-w-[200px] sm:max-w-xs">{selectedFile.name}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 font-mono">Original: {formatSize(originalSize)}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-xs font-semibold text-emerald-600">Compressed: {formatSize(compressedSize)}</p>
                  {originalSize > 0 && compressedSize > 0 && (
                    <p className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md mt-0.5 font-mono inline-block">
                      -{Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100))}% Smaller
                    </p>
                  )}
                </div>
                <button
                  onClick={handleReset}
                  className="p-2 border border-gray-200 hover:bg-red-50 text-gray-500 hover:text-red-500 rounded-xl transition cursor-pointer"
                  title="Upload Another Image"
                >
                  <RotateCcw className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>

            {/* Quality Slider */}
            <div className="bg-blue-50/20 border border-blue-100/30 rounded-xl p-5 space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5 text-sm font-semibold text-blue-800">
                  <ChevronsDown className="w-4.5 h-4.5" />
                  <span>Compression Quality Level</span>
                </div>
                <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2.5 py-1 rounded-lg">
                  {Math.round(quality * 100)}%
                </span>
              </div>
              <input
                type="range"
                min={0.1}
                max={1}
                step={0.05}
                value={quality}
                onChange={(e) => handleQualityChange(parseFloat(e.target.value))}
                className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <p className="text-[11px] text-blue-600 leading-relaxed font-medium">
                Adjust the slider. Lower quality shrinks file sizes significantly, while higher quality preserves maximum visual sharpness.
              </p>
            </div>

            {/* Side-by-Side Images Previews */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Original Preview */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider block">Original Image</span>
                <div className="border border-gray-100 rounded-2xl overflow-hidden bg-gray-100 flex items-center justify-center max-h-80 select-none">
                  <img
                    src={originalUrl}
                    alt="Original Preview"
                    className="object-contain max-h-80"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

              {/* Compressed Preview */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider block">Compressed Image Preview</span>
                <div className="border border-gray-100 rounded-2xl overflow-hidden bg-gray-100 flex items-center justify-center max-h-80 relative select-none">
                  {compressedUrl ? (
                    <img
                      src={compressedUrl}
                      alt="Compressed Preview"
                      className="object-contain max-h-80"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="text-gray-600 dark:text-gray-400 text-xs">Generating compress preview...</div>
                  )}

                  {compressing && (
                    <div className="absolute inset-0 bg-white/70 flex items-center justify-center font-bold text-sm text-blue-600 animate-pulse">
                      Processing Compression...
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Download Button */}
            {compressedUrl && (
              <button
                onClick={handleDownload}
                disabled={compressing}
                className="w-full flex items-center justify-center gap-2 px-5 py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-xl font-bold text-sm transition shadow-sm cursor-pointer active:scale-95"
              >
                <Download className="w-4.5 h-4.5" />
                Download Compressed Image
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
