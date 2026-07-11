import React, { useState, useRef, useEffect } from "react";
import { Upload, Maximize, Download, RotateCcw, ImageIcon, Lock, Unlock } from "lucide-react";

export default function ImageResizerTool() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string>("");
  const [resizedUrl, setResizedUrl] = useState<string>("");
  
  // Dimensions
  const [origWidth, setOrigWidth] = useState<number>(0);
  const [origHeight, setOrigHeight] = useState<number>(0);
  const [width, setWidth] = useState<string>("800");
  const [height, setHeight] = useState<string>("600");
  const [lockRatio, setLockRatio] = useState(true);
  const [ratio, setRatio] = useState<number>(1); // h / w ratio

  // Resize mode
  const [resizeMode, setResizeMode] = useState<"pixels" | "percentage">("pixels");
  const [percentage, setPercentage] = useState<number>(100);

  const [resizing, setResizing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file (JPEG, PNG, WebP).");
      return;
    }
    setSelectedFile(file);
    
    const url = URL.createObjectURL(file);
    setOriginalUrl(url);

    // Load image properties
    const img = new Image();
    img.src = url;
    img.onload = () => {
      setOrigWidth(img.naturalWidth);
      setOrigHeight(img.naturalHeight);
      setWidth(img.naturalWidth.toString());
      setHeight(img.naturalHeight.toString());
      setRatio(img.naturalHeight / img.naturalWidth);
    };
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

  // Perform canvas resize
  const processResize = () => {
    if (!originalUrl) return;
    setResizing(true);
    
    const img = new Image();
    img.src = originalUrl;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let targetW = 800;
      let targetH = 600;

      if (resizeMode === "pixels") {
        targetW = parseInt(width) || img.naturalWidth;
        targetH = parseInt(height) || img.naturalHeight;
      } else {
        targetW = Math.round((img.naturalWidth * percentage) / 100);
        targetH = Math.round((img.naturalHeight * percentage) / 100);
      }

      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext("2d");
      
      if (ctx) {
        ctx.drawImage(img, 0, 0, targetW, targetH);
        const url = canvas.toDataURL(selectedFile?.type || "image/jpeg", 0.92);
        setResizedUrl(url);
      }
      setResizing(false);
    };
  };

  useEffect(() => {
    if (originalUrl) {
      processResize();
    }
  }, [width, height, percentage, resizeMode, originalUrl]);

  const handleWidthChange = (val: string) => {
    setWidth(val);
    const parsedW = parseFloat(val);
    if (lockRatio && ratio && !isNaN(parsedW)) {
      setHeight(Math.round(parsedW * ratio).toString());
    }
  };

  const handleHeightChange = (val: string) => {
    setHeight(val);
    const parsedH = parseFloat(val);
    if (lockRatio && ratio && !isNaN(parsedH)) {
      setWidth(Math.round(parsedH / ratio).toString());
    }
  };

  const handleDownload = () => {
    if (!resizedUrl) return;
    const a = document.createElement("a");
    a.href = resizedUrl;
    a.download = `toolmora-resized-${selectedFile?.name || "image"}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleReset = () => {
    setSelectedFile(null);
    setOriginalUrl("");
    setResizedUrl("");
    setOrigWidth(0);
    setOrigHeight(0);
    setWidth("800");
    setHeight("600");
    setPercentage(100);
    setLockRatio(true);
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm" id="image-resizer-card">
      <div className="space-y-6">
        {!selectedFile ? (
          /* Drag & Drop Upload block */
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
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">Resize JPG, PNG, and WebP dimensions client-side with complete privacy.</p>
          </div>
        ) : (
          /* Editor Layout */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Controls Panel */}
            <div className="lg:col-span-1 space-y-5">
              {/* Image Info card */}
              <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-xl p-4">
                <ImageIcon className="w-9 h-9 text-blue-500 bg-white p-1.5 border border-gray-100 rounded-lg" />
                <div className="truncate flex-1">
                  <p className="text-xs font-semibold text-gray-700 truncate">{selectedFile.name}</p>
                  <p className="text-[10px] text-gray-600 dark:text-gray-400 font-mono font-bold mt-0.5">Original: {origWidth} x {origHeight} px</p>
                </div>
                <button
                  onClick={handleReset}
                  className="p-1.5 border border-gray-200 hover:bg-red-50 text-gray-500 hover:text-red-500 rounded-lg transition"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Resize Mode Selector */}
              <div className="flex bg-gray-50 p-1.5 rounded-xl border border-gray-100 text-xs font-bold">
                <button
                  onClick={() => setResizeMode("pixels")}
                  className={`flex-1 py-1.5 rounded-lg text-center transition cursor-pointer ${
                    resizeMode === "pixels" ? "bg-white shadow-sm text-blue-600 border border-gray-100" : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  By Pixels
                </button>
                <button
                  onClick={() => setResizeMode("percentage")}
                  className={`flex-1 py-1.5 rounded-lg text-center transition cursor-pointer ${
                    resizeMode === "percentage" ? "bg-white shadow-sm text-blue-600 border border-gray-100" : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  By Percentage
                </button>
              </div>

              {/* Dynamic Inputs block */}
              {resizeMode === "pixels" ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Width (px)</label>
                      <input
                        type="number"
                        min="1"
                        value={width}
                        onChange={(e) => handleWidthChange(e.target.value)}
                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm font-mono text-gray-800"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Height (px)</label>
                      <input
                        type="number"
                        min="1"
                        value={height}
                        onChange={(e) => handleHeightChange(e.target.value)}
                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm font-mono text-gray-800"
                      />
                    </div>
                  </div>

                  <label className="flex items-center gap-2.5 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100/75 transition border border-gray-50 text-xs">
                    <input
                      type="checkbox"
                      checked={lockRatio}
                      onChange={(e) => {
                        setLockRatio(e.target.checked);
                        if (e.target.checked && ratio) {
                          setHeight(Math.round(parseFloat(width) * ratio).toString());
                        }
                      }}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex items-center gap-1.5 font-semibold text-gray-700">
                      {lockRatio ? <Lock className="w-3.5 h-3.5 text-blue-500" /> : <Unlock className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />}
                      <span>Lock Aspect Ratio ({origWidth}:{origHeight})</span>
                    </div>
                  </label>
                </div>
              ) : (
                <div className="bg-blue-50/20 border border-blue-100/30 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between text-xs font-semibold text-blue-800">
                    <span>Resize Scale</span>
                    <span className="font-bold">{percentage}%</span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={200}
                    value={percentage}
                    onChange={(e) => setPercentage(Number(e.target.value))}
                    className="w-full h-1.5 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-[10px] text-gray-600 dark:text-gray-400 font-mono font-bold">
                    <span>10% (Tiny)</span>
                    <span>100% (Original)</span>
                    <span>200% (Large)</span>
                  </div>
                </div>
              )}

              {/* Resized Dimension summary */}
              <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100 text-center text-xs">
                <span className="text-gray-600 dark:text-gray-400 font-semibold uppercase tracking-wider block mb-1">Target Dimension Summary</span>
                <span className="font-mono font-bold text-gray-800 text-sm">
                  {resizeMode === "pixels"
                    ? `${width} x ${height} px`
                    : `${Math.round((origWidth * percentage) / 100)} x ${Math.round((origHeight * percentage) / 100)} px`}
                </span>
              </div>

              {/* Download Button */}
              {resizedUrl && (
                <button
                  onClick={handleDownload}
                  disabled={resizing}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-xl font-bold text-sm transition shadow-sm cursor-pointer active:scale-95"
                >
                  <Download className="w-4.5 h-4.5" />
                  Download Resized Image
                </button>
              )}
            </div>

            {/* Preview Column */}
            <div className="lg:col-span-2 space-y-2 relative flex flex-col justify-center min-h-[350px]">
              <span className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider block">Resized Output Preview</span>
              <div className="flex-1 border border-gray-100 rounded-2xl overflow-hidden bg-gray-50 flex items-center justify-center max-h-[400px] relative select-none">
                {resizedUrl ? (
                  <img
                    src={resizedUrl}
                    alt="Resized Preview"
                    className="object-contain max-h-[380px]"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="text-gray-600 dark:text-gray-400 text-xs">Preparing scale parameters...</div>
                )}

                {resizing && (
                  <div className="absolute inset-0 bg-white/70 flex items-center justify-center font-bold text-sm text-blue-600 animate-pulse">
                    Rescaling Image...
                  </div>
                )}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
